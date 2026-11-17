import { NextRequest, NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();
    const firstName = typeof name === "string" ? name.trim().slice(0, 120) : "";
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    if (!firstName || !EMAIL_PATTERN.test(normalizedEmail)) {
      return NextResponse.json({ error: "Indica tu nombre y un email válido." }, { status: 400 });
    }

    const endpoint = process.env.HUB_CONTACT_EVENTS_URL;
    const secret = process.env.JORGE_LORENZO_COACH_CONTACT_EVENTS_SECRET;
    if (!endpoint || !secret) {
      console.error("Black Friday aviso: falta la conexión segura con Basketouch Hub.");
      return NextResponse.json({ error: "El formulario no está listo todavía. Prueba de nuevo en unos minutos." }, { status: 503 });
    }

    let attribution: Record<string, string> = {};
    try {
      attribution = JSON.parse(decodeURIComponent(request.cookies.get("growth_attribution")?.value || ""));
    } catch { /* sin atribución */ }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${secret}` },
      body: JSON.stringify({
        project: "jorge_lorenzo_coach",
        event_type: "contact_upsert",
        event_id: crypto.randomUUID(),
        email: normalizedEmail,
        first_name: firstName,
        source: "black_friday_2026_laboratorio_aviso",
        lifecycle: "lead",
        email_marketing_consent: true,
        consent_text_version: "black-friday-2026-aviso-v1",
        preferred_language: "es",
        payload: {
          contact_list: "black-friday-2026-laboratorio",
          campaign: "black_friday_2026_laboratorio",
          asset: "aviso_apertura",
          ...attribution,
        },
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Black Friday aviso: Hub respondió", response.status, await response.text());
      return NextResponse.json({ error: "No se pudo guardar tu email. Prueba de nuevo." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Black Friday aviso error", error);
    return NextResponse.json({ error: "No se pudo guardar tu email." }, { status: 500 });
  }
}
