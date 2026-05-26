import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";

const BREVO_API_KEY = process.env.BREVO_API_KEY!;
const SENDER = { name: "Jorge Lorenzo Coach", email: "info@jorgelorenzo.coach" };
const REDIRECT_URL = "https://www.jorgelorenzo.coach/auth/callback?next=/nueva-contrasena";

export async function POST(req: NextRequest) {
  const { admin } = await requireAdmin();
  const { email, nombre } = await req.json();

  if (!email) return NextResponse.json({ error: "email es obligatorio" }, { status: 400 });

  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo: REDIRECT_URL },
  });

  if (error || !data?.properties?.action_link) {
    return NextResponse.json({ error: error?.message ?? "No se pudo generar el enlace" }, { status: 500 });
  }

  const enlace = data.properties.action_link;
  const nombreMostrado = nombre?.trim() || "entrenador";
  const year = new Date().getFullYear();

  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Tu acceso a El Laboratorio del Entrenador</title></head>
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
          <p style="margin:0 0 16px;font-size:15px;color:#aaa;line-height:1.7;">Hola <strong style="color:#fff;">${nombreMostrado}</strong>,</p>
          <p style="margin:0 0 16px;font-size:15px;color:#aaa;line-height:1.7;">Ya tienes acceso a <strong style="color:#fff;">El Laboratorio del Entrenador</strong>. Haz clic en el botón para crear tu contraseña y entrar.</p>
          <p style="margin:0 0 24px;font-size:14px;color:#666;line-height:1.7;">El enlace es válido durante 24 horas.</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;">
            <tr><td align="center">
              <a href="${enlace}" style="display:inline-block;background:#c9a84c;color:#0a0a0a;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px;">
                Crear contraseña y entrar →
              </a>
            </td></tr>
          </table>
          <p style="margin:0;font-size:12px;color:#444;line-height:1.6;">Si no esperabas este email, puedes ignorarlo con seguridad.</p>
        </td></tr>
        <tr><td align="center" style="padding-top:32px;">
          <p style="margin:0;font-size:12px;color:#444;line-height:1.6;">
            © ${year} Jorge Lorenzo Coach<br>
            <a href="https://jorgelorenzo.coach" style="color:#666;text-decoration:none;">jorgelorenzo.coach</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: SENDER,
      to: [{ email, name: nombreMostrado }],
      subject: "Tu acceso a El Laboratorio del Entrenador",
      htmlContent: html,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    return NextResponse.json({ error: err.message ?? "Error al enviar el email" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
