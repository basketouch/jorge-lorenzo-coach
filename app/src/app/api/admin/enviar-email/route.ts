import { NextRequest, NextResponse } from "next/server";
import { correoCoach, parrafo, textoABloques, esc } from "@/lib/email-shell";
import { requireAdmin } from "@/lib/admin-guard";

const BREVO_API_KEY = process.env.BREVO_API_KEY!;
const SENDER = { name: "Jorge Lorenzo Coach", email: "info@jorgelorenzo.coach" };

function buildHtml(asunto: string, contenido: string): string {
  return correoCoach({ title: esc(asunto), bodyHtml: textoABloques(contenido) });
}

export async function POST(req: NextRequest) {
  await requireAdmin();
  const { email, nombre, asunto, contenido } = await req.json();

  if (!email || !asunto || !contenido) {
    return NextResponse.json({ error: "email, asunto y contenido son obligatorios" }, { status: 400 });
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: SENDER,
      to: [{ email, name: nombre ?? email }],
      subject: asunto,
      htmlContent: buildHtml(asunto, contenido),
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    return NextResponse.json({ error: err.message ?? "Error al enviar" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
