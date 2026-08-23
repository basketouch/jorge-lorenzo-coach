import { createAdminClient } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let token = "";

  try {
    const payload = await request.json();
    token = typeof payload.token === "string" ? payload.token.trim() : "";
  } catch {
    return NextResponse.json({ error: "Solicitud no válida." }, { status: 400 });
  }

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token)) {
    return NextResponse.json({ error: "Enlace de baja no válido." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("newsletter_subscribers")
    .update({
      status: "unsubscribed",
      marketing_consent: false,
      unsubscribed_at: new Date().toISOString(),
      unsubscribe_reason: "self_service",
      updated_at: new Date().toISOString(),
    })
    .eq("unsubscribe_token", token)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Error procesando baja de newsletter:", error);
    return NextResponse.json({ error: "No hemos podido procesar la baja." }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Enlace de baja no encontrado." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
