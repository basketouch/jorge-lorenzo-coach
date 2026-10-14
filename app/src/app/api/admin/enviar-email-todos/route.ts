import { NextRequest, NextResponse } from "next/server";
import { correoCoach, parrafo, textoABloques, esc } from "@/lib/email-shell";
import { requireAdmin } from "@/lib/admin-guard";

const BREVO_API_KEY = process.env.BREVO_API_KEY!;
const SENDER = { name: "Jorge Lorenzo Coach", email: "info@jorgelorenzo.coach" };

function buildHtml(asunto: string, contenido: string, nombre: string): string {
  const saludo = nombre ? `Hola <strong>${esc(nombre)}</strong>,` : "Hola,";
  return correoCoach({ title: esc(asunto), bodyHtml: parrafo(saludo) + textoABloques(contenido) });
}

export async function POST(req: NextRequest) {
  const { admin } = await requireAdmin();
  const { asunto, contenido } = await req.json();

  if (!asunto || !contenido) {
    return NextResponse.json({ error: "asunto y contenido son obligatorios" }, { status: 400 });
  }

  // Obtener todos los usuarios no-admin con email
  const { data: usuarios, error: dbError } = await admin
    .from("usuarios")
    .select("nombre, email")
    .eq("is_admin", false)
    .not("email", "is", null);

  if (dbError || !usuarios) {
    return NextResponse.json({ error: "Error cargando usuarios" }, { status: 500 });
  }

  const destinatarios = usuarios.filter((u) => u.email);

  if (destinatarios.length === 0) {
    return NextResponse.json({ error: "No hay usuarios con email" }, { status: 400 });
  }

  // Brevo messageVersions: una versión personalizada por usuario
  const messageVersions = destinatarios.map((u) => ({
    to: [{ email: u.email!, name: u.nombre ?? u.email }],
    htmlContent: buildHtml(asunto, contenido, u.nombre ?? ""),
  }));

  // Brevo permite hasta 50 versiones por request; dividir si hay más
  const CHUNK = 50;
  const chunks: typeof messageVersions[] = [];
  for (let i = 0; i < messageVersions.length; i += CHUNK) {
    chunks.push(messageVersions.slice(i, i + CHUNK));
  }

  let enviados = 0;
  for (const chunk of chunks) {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: SENDER,
        subject: asunto,
        htmlContent: buildHtml(asunto, contenido, ""),
        messageVersions: chunk,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.message ?? "Error al enviar", enviados },
        { status: 500 }
      );
    }
    enviados += chunk.length;
  }

  return NextResponse.json({ ok: true, enviados });
}
