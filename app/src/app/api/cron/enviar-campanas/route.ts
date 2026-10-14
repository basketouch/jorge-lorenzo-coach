import { createAdminClient } from "@/lib/supabase-admin";
import { correoCoach, parrafo, textoABloques, esc } from "@/lib/email-shell";
import { NextResponse } from "next/server";

const BREVO_API_KEY = process.env.BREVO_API_KEY!;
const SENDER = { name: "Jorge Lorenzo Coach", email: "info@jorgelorenzo.coach" };

function pieCampana(): string {
  return `Recibes este email porque aceptaste recibir comunicaciones de Jorge Lorenzo Coach. <a href="{{ unsubscribe }}" style="color:#52606d;text-decoration:underline">Darte de baja</a>.<br>© ${new Date().getFullYear()} Jorge Lorenzo Coach · jorgelorenzo.coach`;
}

function contenidoAHtml(asunto: string, texto: string, portadaUrl?: string | null): string {
  return correoCoach({ title: esc(asunto), bodyHtml: textoABloques(texto), hero: portadaUrl, footer: pieCampana() });
}

export async function GET(req: Request) {
  // Vercel llama al cron con el header CRON_SECRET automáticamente
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const ahora = new Date().toISOString();

  const { data: campanas } = await admin
    .from("campanas_programadas")
    .select("*")
    .eq("activa", true)
    .eq("enviada", false)
    .lte("enviar_en", ahora);

  if (!campanas || campanas.length === 0) {
    return NextResponse.json({ ok: true, enviadas: 0 });
  }

  let enviadas = 0;

  for (const campana of campanas) {
    try {
      // Fetch portada_url from related module
      const { data: moduloData } = await admin
        .from("campanas_programadas")
        .select("modulos(portada_url)")
        .eq("id", campana.id)
        .single();
      const portadaUrl = (moduloData?.modulos as { portada_url?: string } | null)?.portada_url ?? null;

      const htmlContent = contenidoAHtml(campana.asunto, campana.contenido, portadaUrl);

      // Crear campaña en Brevo
      const createRes = await fetch("https://api.brevo.com/v3/emailCampaigns", {
        method: "POST",
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `[Auto] ${campana.asunto} — ${new Date().toLocaleDateString("es-ES")}`,
          subject: campana.asunto,
          sender: SENDER,
          type: "classic",
          htmlContent,
          recipients: { listIds: [campana.lista_brevo_id] },
        }),
      });

      const created = await createRes.json();
      if (!created.id) {
        console.error("Error creando campaña Brevo:", created);
        continue;
      }

      // Enviar inmediatamente
      await fetch(`https://api.brevo.com/v3/emailCampaigns/${created.id}/sendNow`, {
        method: "POST",
        headers: { "api-key": BREVO_API_KEY },
      });

      // Marcar como enviada
      await admin
        .from("campanas_programadas")
        .update({ enviada: true, enviada_at: new Date().toISOString(), brevo_campaign_id: created.id })
        .eq("id", campana.id);

      enviadas++;
    } catch (err) {
      console.error("Error enviando campaña", campana.id, err);
    }
  }

  return NextResponse.json({ ok: true, enviadas });
}
