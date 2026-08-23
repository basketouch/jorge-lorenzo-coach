import { createAdminClient } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

const BREVO_API_KEY = process.env.BREVO_API_KEY!;
const BREVO_NEWSLETTER_LIST_ID = 15;

function normalizedText(value: unknown, maximumLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maximumLength) : "";
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud no válida." }, { status: 400 });
  }

  // Campo trampa: respondemos como si la suscripción hubiera funcionado sin guardar nada.
  if (normalizedText(payload.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const firstName = normalizedText(payload.nombre, 120);
  const email = normalizedText(payload.email, 254).toLowerCase();
  const optIn = payload.optIn === true;

  if (!firstName || !/^\S+@\S+\.\S+$/.test(email) || !optIn) {
    return NextResponse.json({ error: "Revisa los datos y acepta los términos para suscribirte." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("newsletter_subscribers")
    .select("metadata, source_list_ids")
    .eq("email", email)
    .maybeSingle();

  const existingMetadata = existing?.metadata && typeof existing.metadata === "object"
    ? existing.metadata
    : {};
  const sourceListIds = Array.from(new Set([...(existing?.source_list_ids ?? []), BREVO_NEWSLETTER_LIST_ID]));
  const today = new Date().toISOString().slice(0, 10);

  const { error: subscriberError } = await admin
    .from("newsletter_subscribers")
    .upsert(
      {
        email,
        first_name: firstName,
        status: "active",
        marketing_consent: true,
        consent_at: today,
        consent_source: "jorgelorenzo.coach/newsletter",
        source_list_ids: sourceListIds,
        metadata: {
          ...existingMetadata,
          latest_form_submission_at: new Date().toISOString(),
          latest_form_submission_source: "jorgelorenzo.coach/newsletter",
        },
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email" }
    );

  if (subscriberError) {
    console.error("Error guardando suscriptor de newsletter:", subscriberError);
    return NextResponse.json({ error: "No hemos podido guardar tu suscripción." }, { status: 500 });
  }

  // Brevo se mantiene sincronizado hasta que el envío de campañas deje de usar sus listas.
  const brevoResponse = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      attributes: { NOMBRE: firstName },
      listIds: [BREVO_NEWSLETTER_LIST_ID],
      updateEnabled: true,
    }),
  });

  if (!brevoResponse.ok) {
    console.error("Error sincronizando suscriptor con Brevo:", await brevoResponse.text());
    return NextResponse.json({ error: "No hemos podido completar tu suscripción. Inténtalo de nuevo." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
