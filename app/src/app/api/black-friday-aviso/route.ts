import { NextRequest, NextResponse } from "next/server";
import { normalizePhone, sendWhatsappConsentToHub } from "@/lib/whatsapp-consent";
import { addContactToBrevoList } from "@/lib/brevo-contacts";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const { name, email, telefono, whatsapp } = await request.json();
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
        consent_text_version: "black-friday-2026-aviso-v2",
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

    // El Black Friday se envía desde Brevo: la persona también entra en su lista general. No bloquea el aviso.
    const brevo = await addContactToBrevoList(normalizedEmail, firstName);
    if (!brevo.ok) console.error("Black Friday aviso: contacto no añadido a Brevo:", brevo.error);

    // Móvil opcional: solo se guarda en el Hub si es válido y la persona marca la casilla de WhatsApp.
    // No bloquea el aviso (el email ya está guardado), pero el resultado se devuelve para avisarle.
    type PhoneStatus = "none" | "saved" | "invalid" | "no_consent" | "failed";
    let phoneStatus: PhoneStatus = "none";
    const phoneRaw = typeof telefono === "string" ? telefono.trim().slice(0, 30) : "";
    if (phoneRaw) {
      const phone = normalizePhone(phoneRaw);
      if (!phone) phoneStatus = "invalid";
      else if (whatsapp !== true) phoneStatus = "no_consent";
      else {
        const hub = await sendWhatsappConsentToHub({ email: normalizedEmail, firstName, phone, consent: true, source: "black_friday_2026_laboratorio_aviso" });
        if (hub === "saved") phoneStatus = "saved";
        else {
          phoneStatus = "failed";
          console.error("Black Friday aviso: móvil no guardado en el Hub:", hub);
        }
      }
    }

    return NextResponse.json({ ok: true, phone: phoneStatus });
  } catch (error) {
    console.error("Black Friday aviso error", error);
    return NextResponse.json({ error: "No se pudo guardar tu email." }, { status: 500 });
  }
}
