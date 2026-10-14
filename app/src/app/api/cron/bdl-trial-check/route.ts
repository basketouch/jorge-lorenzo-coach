import { createAdminClient } from "@/lib/supabase-admin";
import { correoCoach, parrafo, boton, textoABloques, esc } from "@/lib/email-shell";
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

    const html = correoCoach({
      title: "Trial Drill Lab — 7 días",
      bodyHtml:
        parrafo(`El usuario <strong>${esc(nombre)}</strong> (${esc(u.email)}) lleva <strong>7 días</strong> de prueba en el Drill Lab.`) +
        parrafo(`Inicio del trial: ${inicio}`) +
        parrafo("Revisa en Skool si sigue siendo miembro y decide si mantener o revocar el acceso.") +
        boton(adminUrl, "Ver usuario en Admin"),
    });

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
