import { NextRequest, NextResponse } from "next/server";

// Reenvía al Hub las visitas y clics con el UTM guardado en la cookie `growth_attribution`.
// El token de ingesta se queda en el servidor. Sin UTM de campaña no se registra nada.
const EVENTS = ["page_viewed", "cta_clicked"];
const CTA_NAMES = ["trial", "download"];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: NextRequest) {
  const conversionsUrl = process.env.GROWTH_HUB_INGEST_URL;
  const token = process.env.GROWTH_HUB_INGEST_TOKEN;
  if (!conversionsUrl || !token) return NextResponse.json({ ok: true, skipped: "sin configurar" });

  const body = await req.json().catch(() => null);
  if (!body || !EVENTS.includes(body.event_name) || typeof body.anonymous_id !== "string" || !UUID.test(body.anonymous_id)) {
    return NextResponse.json({ error: "Evento no válido" }, { status: 400 });
  }
  const path = typeof body.path === "string" ? body.path.slice(0, 300) : null;
  if (path?.startsWith("/admin")) return NextResponse.json({ ok: true });

  let attribution: Record<string, string> = {};
  try {
    attribution = JSON.parse(decodeURIComponent(req.cookies.get("growth_attribution")?.value || ""));
  } catch {
    /* sin atribución */
  }
  if (!attribution.utm_campaign) return NextResponse.json({ ok: true });

  const url = conversionsUrl.replace(/\/conversions\/?$/, "/web-events");
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        project: "jorge_lorenzo_coach",
        event_name: body.event_name,
        anonymous_id: body.anonymous_id,
        path,
        cta_name: CTA_NAMES.includes(body.cta_name) ? body.cta_name : undefined,
        utm_source: attribution.utm_source,
        utm_medium: attribution.utm_medium,
        utm_campaign: attribution.utm_campaign,
        utm_content: attribution.utm_content,
      }),
    });
    if (!response.ok) console.error("No se pudo registrar el evento en el Hub", response.status);
  } catch (error) {
    console.error("No se pudo registrar el evento en el Hub", error);
  }
  return NextResponse.json({ ok: true });
}
