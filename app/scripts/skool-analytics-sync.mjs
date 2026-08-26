// Uso: HUB_SUPABASE_URL=... HUB_SUPABASE_SERVICE_KEY=... node scripts/skool-analytics-sync.mjs
// Requiere haber corrido antes `node scripts/skool-login.mjs` una vez (misma sesión
// que usa skool-scrape.mjs).
//
// Lee el panel de analytics propio de Skool (api2.skool.com/groups/{id}/analytics-v2),
// no el contenido público: visitas y altas de los últimos 30 días, desglosadas por
// fuente (Instagram, Directo, YouTube, etc.). Skool solo da una ventana fija de 30
// días para esto (no admite 7d/90d), así que cada ejecución sobrescribe el snapshot
// del día de hoy. Pensado para el mismo cron diario que ya usa skool-scrape.mjs.
//
// Escribe en el proyecto Supabase "CutSports & DrawSports" (el que usa basketouch-hub
// para el dashboard de Comunidad), no en el de "Jorge Lorenzo Coach" (ese es solo para
// el catálogo público de /comunidad).

import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

if (!globalThis.WebSocket) {
  const { default: WS } = await import('ws');
  globalThis.WebSocket = WS;
}
const { createClient } = await import('@supabase/supabase-js');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SESSION_PATH = path.join(__dirname, '.skool-session.json');
const GROUP = 'jorge-lorenzo-coach';

const SUPABASE_URL = process.env.HUB_SUPABASE_URL;
const SUPABASE_KEY = process.env.HUB_SUPABASE_SERVICE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Faltan HUB_SUPABASE_URL / HUB_SUPABASE_SERVICE_KEY en el entorno.');
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Nombres más legibles para las fuentes que da Skool (dominios/atribuciones crudas).
const SOURCE_LABELS = {
  direct: 'Directo',
  instagram: 'Instagram',
  'instagram.com': 'Instagram',
  youtube: 'YouTube',
  'youtube.com': 'YouTube',
  'x.com': 'X',
  twitter: 'X',
  'linkedin.com': 'LinkedIn',
  skool: 'Skool network',
  'google.com': 'Google',
  other: 'Otro',
};
function labelSource(attribution) {
  const key = (attribution || 'other').toLowerCase();
  return SOURCE_LABELS[key] || attribution || 'Otro';
}

async function notifyTelegram(message) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }),
    });
  } catch (err) {
    console.error('No se pudo avisar por Telegram:', err.message);
  }
}

// Los endpoints de analytics-v2 son asíncronos: la primera llamada da un token,
// hay que esperar en /wait?token=... (long-poll, responde texto "completed") y
// repetir la llamada original añadiendo &token=... para obtener el JSON final.
async function fetchAnalytics(page, url) {
  const first = await page.request.get(url);
  const firstJson = await first.json();
  if (!firstJson.token) return firstJson;
  await page.request.get(`https://api2.skool.com/wait?token=${firstJson.token}`, { timeout: 20000 });
  const final = await page.request.get(`${url}${url.includes('?') ? '&' : '?'}token=${firstJson.token}`);
  return await final.json();
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: SESSION_PATH });
  const page = await context.newPage();

  try {
    // El groupId (UUID interno) no está en la URL pública; se saca del JSON del panel
    // de miembros admin, que ya usa skool-scrape.mjs con el mismo patrón _next/data.
    await page.goto(`https://www.skool.com/${GROUP}/-/members?admin=true`, { waitUntil: 'domcontentloaded', timeout: 20000 });
    const buildId = await page.evaluate(() => window.__NEXT_DATA__?.buildId);
    const nextDataUrl = `https://www.skool.com/_next/data/${buildId}/${GROUP}/-/members.json?admin=true&group=${GROUP}`;
    const membersResp = await page.request.get(nextDataUrl);
    const membersJson = await membersResp.json();
    const groupId = membersJson?.pageProps?.currentGroup?.id;
    if (!groupId) throw new Error('No se pudo resolver el groupId de Skool.');

    const [visits, signups] = await Promise.all([
      fetchAnalytics(page, `https://api2.skool.com/groups/${groupId}/analytics-v2?chart=visits_by_source`),
      fetchAnalytics(page, `https://api2.skool.com/groups/${groupId}/analytics-v2?chart=signups_by_source`),
    ]);

    const visitItems = visits?.data?.chart_data?.items || [];
    const signupItems = signups?.data?.chart_data?.items || [];

    const bySource = new Map();
    for (const item of visitItems) {
      const label = labelSource(item.attribution);
      const entry = bySource.get(label) || { visits: 0, conversions: 0 };
      entry.visits += item.total || 0;
      bySource.set(label, entry);
    }
    for (const item of signupItems) {
      const label = labelSource(item.attribution);
      const entry = bySource.get(label) || { visits: 0, conversions: 0 };
      entry.conversions += item.total || 0;
      bySource.set(label, entry);
    }

    if (bySource.size === 0) throw new Error('Skool no devolvió datos de visitas/altas por fuente.');

    const now = new Date().toISOString();
    const snapshotDate = now.slice(0, 10);
    const rows = Array.from(bySource.entries()).map(([source, { visits, conversions }]) => ({
      snapshot_date: snapshotDate,
      source,
      visits,
      conversions,
      last_sync_at: now,
      sync_status: 'ok',
      last_error: null,
    }));

    const { error } = await supabase
      .from('community_acquisition_snapshots')
      .upsert(rows, { onConflict: 'snapshot_date,source' });
    if (error) throw new Error(error.message);

    console.log(`OK: ${rows.length} fuentes sincronizadas para ${snapshotDate}.`);
  } catch (err) {
    console.error('Fallo en skool-analytics-sync:', err.message);
    await notifyTelegram(`⚠️ Fallo en skool-analytics-sync.mjs: ${err.message}`);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

await main();
