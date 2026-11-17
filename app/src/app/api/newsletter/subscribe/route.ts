import { createAdminClient } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";
import { normalizePhone, sendWhatsappConsentToHub } from "@/lib/whatsapp-consent";

const BREVO_API_KEY = process.env.BREVO_API_KEY!;
const BREVO_NEWSLETTER_LIST_ID = 15;

const ALLOWED_ORIGINS =
  process.env.NODE_ENV === "production"
    ? ["https://www.jorgelorenzo.coach", "https://jorgelorenzo.coach"]
    : ["https://www.jorgelorenzo.coach", "https://jorgelorenzo.coach", "http://localhost:3000"];
const MIN_SUBMIT_MS = 2500; // por debajo de esto, es un bot rellenando el formulario al vuelo

const NEWSLETTER_CONSENT_VERSION = "newsletter-web-v1";
const HUB_NEWSLETTER_LIST = "newsletter-jorge-lorenzo";

/**
 * Registra el alta en Basketouch Hub (contacto, lista y consentimiento versionado). No bloquea la
 * suscripción: la persona ya está guardada en nuestra base y el envío sigue leyendo de ahí. Devuelve
 * null si salió bien o el motivo del fallo.
 */
async function sendSubscriptionToHub(input: { email: string; firstName: string; attribution: Record<string, string> }): Promise<string | null> {
  const endpoint = process.env.HUB_CONTACT_EVENTS_URL;
  const secret = process.env.JORGE_LORENZO_COACH_CONTACT_EVENTS_SECRET;
  if (!endpoint || !secret) return "sin conexión configurada con el Hub";
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${secret}` },
      body: JSON.stringify({
        project: "jorge_lorenzo_coach",
        event_type: "contact_upsert",
        event_id: crypto.randomUUID(),
        email: input.email,
        first_name: input.firstName,
        source: "jorgelorenzo.coach/newsletter",
        lifecycle: "lead",
        email_marketing_consent: true,
        consent_text_version: NEWSLETTER_CONSENT_VERSION,
        preferred_language: "es",
        payload: { contact_list: HUB_NEWSLETTER_LIST, asset: "newsletter", ...input.attribution },
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    return response.ok ? null : `${response.status} ${(await response.text()).slice(0, 300)}`;
  } catch (error) {
    return error instanceof Error ? error.message : "error de red con el Hub";
  }
}

function normalizedText(value: unknown, maximumLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maximumLength) : "";
}

function requestLooksLegit(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) return ALLOWED_ORIGINS.includes(origin);

  // Fallback para peticiones same-origin que no envían Origin: exigimos al menos un Referer propio.
  const referer = request.headers.get("referer") ?? "";
  return ALLOWED_ORIGINS.some((allowed) => referer.startsWith(allowed));
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud no válida." }, { status: 400 });
  }

  // Bots que atacan el endpoint directamente (sin cargar la página) o sin JS real.
  if (!requestLooksLegit(request)) {
    return NextResponse.json({ ok: true });
  }

  // Campo trampa: respondemos como si la suscripción hubiera funcionado sin guardar nada.
  if (normalizedText(payload.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  // Envíos demasiado rápidos tras cargar la página: típico de bots que rellenan y envían el form al instante.
  const renderedAt = typeof payload.renderedAt === "number" ? payload.renderedAt : null;
  if (renderedAt !== null && Date.now() - renderedAt < MIN_SUBMIT_MS) {
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

  // Alta en el Hub: contacto + lista de la newsletter + consentimiento. No bloquea la suscripción.
  let attribution: Record<string, string> = {};
  try {
    attribution = JSON.parse(decodeURIComponent(request.headers.get("cookie")?.match(/(?:^|;\s*)growth_attribution=([^;]*)/)?.[1] || ""));
  } catch { /* sin atribución */ }
  const hubError = await sendSubscriptionToHub({ email, firstName, attribution });
  if (hubError) console.error("Alta de la newsletter no registrada en el Hub:", hubError);

  // Móvil opcional: se manda a Basketouch Hub junto a la casilla de WhatsApp. No bloquea la
  // suscripción: si falla o el número no es válido, la newsletter sigue adelante.
  const phone = normalizePhone(normalizedText(payload.telefono, 30));
  if (phone) {
    const hub = await sendWhatsappConsentToHub({
      email,
      firstName,
      phone,
      consent: payload.whatsapp === true,
      source: "jorgelorenzo.coach/newsletter",
    });
    if (hub !== "saved") console.error("Móvil de la newsletter no guardado en el Hub:", hub);
  }

  // Brevo se mantiene sincronizado hasta que el envío de campañas deje de usar sus listas. Ya no
  // bloquea el alta: la persona está guardada en nuestra base, así que si Brevo falla se anota en
  // los metadatos del suscriptor (brevo_sync_failed_at) para reintentarlo y la alta sigue adelante.
  let brevoError: string | null = null;
  try {
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
    if (!brevoResponse.ok) brevoError = `${brevoResponse.status} ${await brevoResponse.text()}`.slice(0, 500);
  } catch (error) {
    brevoError = error instanceof Error ? error.message : "Error de red con Brevo";
  }

  if (brevoError) {
    console.error("Error sincronizando suscriptor con Brevo (el alta sigue adelante):", brevoError);
    await admin
      .from("newsletter_subscribers")
      .update({ metadata: { ...existingMetadata, latest_form_submission_at: new Date().toISOString(), latest_form_submission_source: "jorgelorenzo.coach/newsletter", brevo_sync_failed_at: new Date().toISOString(), brevo_sync_error: brevoError } })
      .eq("email", email);
  } else if ("brevo_sync_failed_at" in existingMetadata) {
    // Se resolvió: quita la marca de un fallo anterior.
    const { brevo_sync_failed_at: _failedAt, brevo_sync_error: _error, ...cleanMetadata } = existingMetadata as Record<string, unknown>;
    void _failedAt; void _error;
    await admin
      .from("newsletter_subscribers")
      .update({ metadata: { ...cleanMetadata, latest_form_submission_at: new Date().toISOString(), latest_form_submission_source: "jorgelorenzo.coach/newsletter" } })
      .eq("email", email);
  }

  return NextResponse.json({ ok: true });
}
