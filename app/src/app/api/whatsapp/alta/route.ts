import { NextResponse } from "next/server";
import { normalizePhone, sendWhatsappConsentToHub } from "@/lib/whatsapp-consent";

const ALLOWED_ORIGINS =
  process.env.NODE_ENV === "production"
    ? ["https://www.jorgelorenzo.coach", "https://jorgelorenzo.coach"]
    : ["https://www.jorgelorenzo.coach", "https://jorgelorenzo.coach", "http://localhost:3000"];
const MIN_SUBMIT_MS = 2500; // por debajo de esto, es un bot rellenando el formulario al vuelo

function normalizedText(value: unknown, maximumLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maximumLength) : "";
}

function requestLooksLegit(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) return ALLOWED_ORIGINS.includes(origin);
  const referer = request.headers.get("referer") ?? "";
  return ALLOWED_ORIGINS.some((allowed) => referer.startsWith(allowed));
}

// Alta de WhatsApp desde /whatsapp: mismas defensas contra bots que la newsletter.
export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud no válida." }, { status: 400 });
  }

  // A los bots se les responde como si hubiera ido bien, sin guardar nada.
  if (!requestLooksLegit(request)) return NextResponse.json({ ok: true });
  if (normalizedText(payload.website, 200)) return NextResponse.json({ ok: true });
  const renderedAt = typeof payload.renderedAt === "number" ? payload.renderedAt : null;
  if (renderedAt !== null && Date.now() - renderedAt < MIN_SUBMIT_MS) return NextResponse.json({ ok: true });

  const firstName = normalizedText(payload.nombre, 120);
  const lastName = normalizedText(payload.apellidos, 160);
  const email = normalizedText(payload.email, 254).toLowerCase();
  const phone = normalizePhone(normalizedText(payload.telefono, 30));

  if (!firstName || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Revisa tu nombre y tu email." }, { status: 400 });
  }
  if (!phone) {
    return NextResponse.json({ error: "Escribe tu móvil con el prefijo del país, por ejemplo +34 600 111 222." }, { status: 400 });
  }
  if (payload.acepta !== true) {
    return NextResponse.json({ error: "Marca la casilla para que podamos escribirte por WhatsApp." }, { status: 400 });
  }

  const result = await sendWhatsappConsentToHub({
    email,
    firstName,
    lastName,
    phone,
    consent: true,
    source: "jorgelorenzo.coach/whatsapp",
  });
  if (result !== "saved") {
    console.error("Alta de WhatsApp no guardada en el Hub:", result);
    return NextResponse.json({ error: "No hemos podido guardar tus datos. Inténtalo de nuevo en un momento." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
