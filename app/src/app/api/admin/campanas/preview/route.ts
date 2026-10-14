import { requireAdmin } from "@/lib/admin-guard";
import { correoCoach, parrafo, textoABloques, esc } from "@/lib/email-shell";
import { NextRequest, NextResponse } from "next/server";

function contenidoAHtml(asunto: string, texto: string, portadaUrl?: string | null): string {
  return correoCoach({ title: esc(asunto), bodyHtml: textoABloques(texto), hero: portadaUrl });
}

export async function POST(req: NextRequest) {
  await requireAdmin();
  const { asunto, contenido, portada_url } = await req.json();
  const html = contenidoAHtml(asunto, contenido, portada_url);
  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
