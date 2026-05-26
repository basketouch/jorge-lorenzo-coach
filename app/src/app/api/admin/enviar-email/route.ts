import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";

const BREVO_API_KEY = process.env.BREVO_API_KEY!;
const SENDER = { name: "Jorge Lorenzo Coach", email: "info@jorgelorenzo.coach" };

function buildHtml(asunto: string, contenido: string): string {
  const year = new Date().getFullYear();
  const paragraphs = contenido
    .split("\n\n")
    .map(p => {
      const trimmed = p.trim();
      const ctaMatch = trimmed.match(/^(?:→|->)\s*(.+?):\s*(https?:\/\/\S+)$/);
      if (ctaMatch) {
        return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;">
          <tr><td align="center">
            <a href="${ctaMatch[2].trim()}" style="display:inline-block;background:#c9a84c;color:#0a0a0a;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px;">
              ${ctaMatch[1].trim()} →
            </a>
          </td></tr>
        </table>`;
      }
      return `<p style="margin:0 0 16px;font-size:15px;color:#aaa;line-height:1.7;">${trimmed.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${asunto}</title></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;min-height:100vh;">
    <tr><td align="center" style="padding:48px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
        <tr><td align="center" style="padding-bottom:32px;">
          <span style="font-size:20px;font-weight:800;letter-spacing:0.08em;color:#fff;">
            JORGE <span style="color:#c9a84c;">LORENZO</span>
          </span>
        </td></tr>
        <tr><td style="background:#141414;border:1px solid #2a2a2a;border-radius:16px;padding:40px;">
          <div style="width:40px;height:2px;background:#c9a84c;margin:0 0 24px;"></div>
          ${paragraphs}
        </td></tr>
        <tr><td align="center" style="padding-top:32px;">
          <p style="margin:0;font-size:12px;color:#444;line-height:1.6;">
            © ${year} Jorge Lorenzo Coach · Campeón del Mundo · Campeón de Europa<br>
            <a href="https://jorgelorenzo.coach" style="color:#666;text-decoration:none;">jorgelorenzo.coach</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
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
