import { createAdminClient } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

const BREVO_API_KEY = process.env.BREVO_API_KEY!;
const SENDER = { name: "Jorge Lorenzo Coach", email: "info@jorgelorenzo.coach" };
const JORGE_EMAIL = process.env.JORGE_EMAIL ?? "info@jorgelorenzo.coach";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jorgelorenzo.coach";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Usuarios con trial iniciado hace entre 7 y 8 días
  const hace7dias = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const hace8dias = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString();

  const { data: usuarios } = await admin
    .from("usuarios")
    .select("id, nombre, apellido, email, bdl_trial_start")
    .gte("bdl_trial_start", hace8dias)
    .lte("bdl_trial_start", hace7dias);

  if (!usuarios || usuarios.length === 0) {
    return NextResponse.json({ ok: true, revisados: 0 });
  }

  for (const u of usuarios) {
    const nombre = `${u.nombre ?? ""} ${u.apellido ?? ""}`.trim() || u.email;
    const inicio = new Date(u.bdl_trial_start).toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
    const adminUrl = `${SITE_URL}/admin/usuarios/${u.id}`;

    const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Trial Drill Lab — 7 días</title></head>
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
          <p style="margin:0 0 16px;font-size:15px;color:#aaa;line-height:1.7;">
            El usuario <strong style="color:#fff;">${nombre}</strong> (${u.email}) lleva <strong style="color:#c9a84c;">7 días</strong> de prueba en el Drill Lab.
          </p>
          <p style="margin:0 0 8px;font-size:14px;color:#666;">Inicio del trial: ${inicio}</p>
          <p style="margin:0 0 32px;font-size:15px;color:#aaa;line-height:1.7;">
            Revisa en Skool si sigue siendo miembro y decide si mantener o revocar el acceso.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
            <tr><td align="center">
              <a href="${adminUrl}" style="display:inline-block;background:#c9a84c;color:#0a0a0a;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px;">
                Ver usuario en Admin →
              </a>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: SENDER,
        to: [{ email: JORGE_EMAIL, name: "Jorge Lorenzo" }],
        subject: `Drill Lab — ${nombre} lleva 7 días de prueba`,
        htmlContent: html,
      }),
    });
  }

  return NextResponse.json({ ok: true, revisados: usuarios.length });
}
