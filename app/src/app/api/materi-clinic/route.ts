import { NextResponse } from "next/server";
import { CLINIC_BREVO_LIST_ID, CLINIC_MATERIALES } from "@/lib/clinic-indonesia";

const BREVO_API_KEY = process.env.BREVO_API_KEY!;

const ALLOWED_ORIGINS =
  process.env.NODE_ENV === "production"
    ? ["https://www.jorgelorenzo.coach", "https://jorgelorenzo.coach"]
    : ["https://www.jorgelorenzo.coach", "https://jorgelorenzo.coach", "http://localhost:3000"];
const MIN_SUBMIT_MS = 2000;

function normalizedText(value: unknown, maximumLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maximumLength) : "";
}

function requestLooksLegit(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) return ALLOWED_ORIGINS.includes(origin);
  const referer = request.headers.get("referer") ?? "";
  return ALLOWED_ORIGINS.some((allowed) => referer.startsWith(allowed));
}

// Brevo espera el número en formato internacional sin "+" (ej. 6281234567890).
// Un 0 inicial se interpreta como número local indonesio.
function normalizeWhatsapp(raw: string) {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = `62${digits.slice(1)}`;
  return digits.length >= 8 && digits.length <= 15 ? digits : null;
}

async function upsertBrevoContact(email: string, whatsapp: string | null) {
  const send = (attributes: Record<string, string>) =>
    fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email, attributes, listIds: [CLINIC_BREVO_LIST_ID], updateEnabled: true }),
    });

  const response = await send(whatsapp ? { WHATSAPP: whatsapp } : {});
  if (response.ok || !whatsapp) return response;

  // El WhatsApp es opcional: si Brevo lo rechaza (duplicado, formato), guardamos el email igualmente.
  console.error("Brevo rechazó el WhatsApp del clinic, reintento sin él:", await response.text());
  return send({});
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const materiales = CLINIC_MATERIALES.map(({ tipo, titulo, url }) => ({ tipo, titulo, url }));

  // Bots: respondemos con éxito sin guardar nada ni revelar enlaces.
  if (
    !requestLooksLegit(request) ||
    normalizedText(payload.website, 200) ||
    (typeof payload.renderedAt === "number" && Date.now() - payload.renderedAt < MIN_SUBMIT_MS)
  ) {
    return NextResponse.json({ ok: true, materiales: materiales.map((m) => ({ ...m, url: "" })) });
  }

  const email = normalizedText(payload.email, 254).toLowerCase();
  const whatsappRaw = normalizedText(payload.whatsapp, 30);
  const whatsapp = whatsappRaw ? normalizeWhatsapp(whatsappRaw) : null;

  if (!/^\S+@\S+\.\S+$/.test(email) || payload.optIn !== true) {
    return NextResponse.json({ error: "invalid_data" }, { status: 400 });
  }
  if (whatsappRaw && !whatsapp) {
    return NextResponse.json({ error: "invalid_whatsapp" }, { status: 400 });
  }

  const brevoResponse = await upsertBrevoContact(email, whatsapp);
  if (!brevoResponse.ok) {
    console.error("Error guardando contacto del clinic en Brevo:", await brevoResponse.text());
    return NextResponse.json({ error: "brevo_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, materiales });
}
