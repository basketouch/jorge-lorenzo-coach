// Uso: SUPABASE_SERVICE_KEY=xxx node scripts/skool-scrape.mjs
// Requiere haber corrido antes `node scripts/skool-login.mjs` una vez.
//
// Recorre la comunidad de Skool (jorge-lorenzo-coach): los cursos de Classroom
// y los posts de la comunidad (paginados, 30/página) vía los endpoints JSON
// internos de Next.js. Solo guarda contenido cuyo autor seas tú (evita
// almacenar posts de otros miembros por protección de datos). Hace upsert en
// Supabase por `source_id` para no duplicar en re-ejecuciones, y deja un
// registro en community_sync_runs.

import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Node 18 (usado en el VPS) no trae WebSocket nativo, que el cliente
// realtime de supabase-js instancia siempre en su constructor aunque no lo usemos.
if (!globalThis.WebSocket) {
  const { default: WS } = await import('ws');
  globalThis.WebSocket = WS;
}
const { createClient } = await import('@supabase/supabase-js');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SESSION_PATH = path.join(__dirname, '.skool-session.json');
const GROUP = 'jorge-lorenzo-coach';

const SUPABASE_URL = 'https://otsbpiukzftacmvmkajy.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
if (!SUPABASE_KEY) {
  console.error('Falta SUPABASE_SERVICE_KEY en el entorno.');
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Skool sirve variantes ligeras de sus propias imágenes (assets.skool.com)
// con sufijo "-sm"/"-md" sobre el mismo hash. "-sm" (240x135) queda borroso
// en las tarjetas; "-md" (720x405) es nítido y ~6x más ligero que el
// original. Las URLs externas (ej. thumbnails de YouTube) no soportan este
// sufijo y deben dejarse tal cual.
function toMediumVariant(url) {
  if (!url) return null;
  if (!url.includes('assets.skool.com')) return url;
  return url.replace(/(\.\w+)$/, '-md$1');
}

// Reutiliza el bot de Telegram "Alex" (OpenClaw) para avisar de fallos.
// Lee el token/chat_id de su propio .env, sin duplicar el secreto.
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

function stripV2Content(desc) {
  // El campo "desc" de las lecciones viene como JSON tipo editor ([v2][{...}]);
  // nos quedamos con el texto plano cuando lo trae, si no, cadena vacía.
  if (!desc) return '';
  try {
    const jsonPart = desc.replace(/^\[v2\]/, '');
    const nodes = JSON.parse(jsonPart);
    return nodes
      .map((n) => (typeof n.text === 'string' ? n.text : ''))
      .join(' ')
      .trim();
  } catch {
    return typeof desc === 'string' ? desc : '';
  }
}

async function upsertItems(items, runCounters) {
  for (const item of items) {
    const { data: existing } = await supabase
      .from('community_items')
      .select('id, status')
      .eq('source_id', item.source_id)
      .maybeSingle();

    // No pisar decisiones editoriales (excluded/approved/review) en cada re-scrape.
    // Solo forzamos "detected" al crear el item, o al revivir uno archivado
    // (curso que pasó de borrador a publicado, o volvió a aparecer en Skool).
    const payload = { ...item, last_seen_at: new Date().toISOString() };
    if (existing && existing.status !== 'archived') {
      delete payload.status;
    }

    const { error } = await supabase
      .from('community_items')
      .upsert(payload, { onConflict: 'source_id' });

    if (error) {
      console.error(`Error guardando ${item.source_id}:`, error.message);
      runCounters.items_failed++;
    } else if (existing) {
      runCounters.items_updated++;
    } else {
      runCounters.items_created++;
    }
    runCounters.items_found++;
  }
}

// Los cursos anidan lecciones dentro de "sets" (carpetas/módulos temáticos)
// a profundidad variable; solo los nodos "module" son lecciones reales.
function collectLeafModules(nodes) {
  let out = [];
  for (const node of nodes ?? []) {
    const c = node.course;
    if (!c) continue;
    if (c.unitType === 'module') {
      out.push(c);
    } else if (node.children?.length) {
      out = out.concat(collectLeafModules(node.children));
    }
  }
  return out;
}

async function scrapeClassroom(page, buildId, selfId, runCounters) {
  console.log('\n--- Classroom ---');
  await page.goto(`https://www.skool.com/${GROUP}/classroom`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
  const allCourses = await page.evaluate(() => window.__NEXT_DATA__.props.pageProps.allCourses ?? []);
  // allCourses trae el slug de URL en "name" (no en "id"); el "id" es el uuid interno.
  // state:1/sin "public" = curso en Borrador en Skool; nunca debe salir en la biblioteca pública.
  const published = allCourses.filter((c) => c.state === 2 && c.public === true);
  const draftCount = allCourses.length - published.length;
  if (draftCount > 0) {
    console.log(`Saltando ${draftCount} curso(s) en borrador: ${allCourses.filter((c) => !(c.state === 2 && c.public === true)).map((c) => c.metadata?.title).join(', ')}`);
  }
  const courseSlugs = published.map((c) => c.name).filter(Boolean);

  if (courseSlugs.length === 0) {
    console.warn('No se detectaron cursos en window.__NEXT_DATA__; revisar estructura de la página.');
    return;
  }

  for (const courseId of courseSlugs) {
    // Sin "md" en la URL, Next.js redirige al primer módulo; dejamos que el
    // propio navegador resuelva el redirect en vez de pedir el JSON a pelo.
    await page.goto(`https://www.skool.com/${GROUP}/classroom/${courseId}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1200);
    const pageProps = await page.evaluate(() => window.__NEXT_DATA__?.props?.pageProps ?? null);
    const course = pageProps?.course?.course;
    const children = pageProps?.course?.children ?? [];
    if (!course) {
      console.warn(`Curso ${courseId}: no se pudo leer pageProps.course`);
      continue;
    }
    const courseTitle = course?.metadata?.title ?? courseId;
    const allLessons = collectLeafModules(children);
    const ownLessons = allLessons.filter((c) => c.userId === selfId);
    console.log(`Curso "${courseTitle}": ${allLessons.length} lecciones (${ownLessons.length} tuyas)`);

    const items = [];
    for (const c of ownLessons) {
      const lessonUrl = `https://www.skool.com/${GROUP}/classroom/${courseId}?md=${c.id}`;
      let thumbnailUrl = c.metadata?.videoThumbnail ?? null;

      // Vídeos alojados nativamente en Skool (Mux) no traen miniatura en el
      // árbol del curso; solo se resuelve en pageProps.video al visitar la
      // lección concreta. Sale como coste de una visita extra por lección.
      if (!thumbnailUrl && c.metadata?.videoId) {
        try {
          await page.goto(lessonUrl, { waitUntil: 'domcontentloaded' });
          await page.waitForTimeout(800);
          const fullSizeThumb = await page.evaluate(() => window.__NEXT_DATA__?.props?.pageProps?.video?.thumbnailUrl ?? null);
          thumbnailUrl = toMediumVariant(fullSizeThumb);
        } catch {
          /* si falla, se queda sin miniatura; no es crítico */
        }
      }

      items.push({
        source_id: `skool_lesson_${c.id}`,
        source_url: lessonUrl,
        content_type: 'lesson',
        title: c.metadata?.title ?? '(sin título)',
        summary: null,
        author_id: c.userId ?? null,
        body: stripV2Content(c.metadata?.desc),
        category: courseTitle,
        video_url: c.metadata?.videoLink ?? null,
        thumbnail_url: thumbnailUrl,
        published_at: c.createdAt ?? null,
        updated_at: c.updatedAt ?? null,
        status: 'detected',
        tags: [],
      });
    }

    await upsertItems(items, runCounters);
    await sleep(1500); // ritmo prudente entre requests
  }
}

async function scrapeCommunityPosts(page, buildId, selfId, runCounters) {
  console.log('\n--- Comunidad (posts) ---');
  // La comunidad usa paginación numerada (?p=N, 30 posts/página), no scroll
  // infinito. Next.js expone cada página vía su endpoint _next/data.
  const seen = new Map();
  let totalKnown = null;
  let p = 1;
  while (totalKnown === null || p <= Math.ceil(totalKnown / 30)) {
    const url = `https://www.skool.com/_next/data/${buildId}/${GROUP}.json?p=${p}`;
    const res = await page.request.get(url);
    if (!res.ok()) {
      console.warn(`Página ${p} de posts: HTTP ${res.status()}`);
      break;
    }
    const json = await res.json();
    const postTrees = json.pageProps?.postTrees ?? [];
    totalKnown = json.pageProps?.total ?? totalKnown ?? postTrees.length;
    for (const tree of postTrees) seen.set(tree.post.id, tree.post);
    console.log(`Página ${p}: +${postTrees.length} posts (acumulado ${seen.size}/${totalKnown})`);
    p++;
    await sleep(1000); // ritmo prudente entre requests
  }

  const ownPosts = [...seen.values()].filter((p) => p.userId === selfId);
  console.log(`Posts capturados: ${seen.size} (${ownPosts.length} tuyos, resto de otros miembros se descarta)`);

  const items = ownPosts.map((p) => {
    let videoUrl = null;
    try {
      const videoLinks = JSON.parse(p.metadata?.videoLinksData ?? '[]');
      videoUrl = videoLinks[0]?.url ?? null;
    } catch {
      /* sin vídeo embebido */
    }
    return {
      source_id: `skool_post_${p.id}`,
      source_url: `https://www.skool.com/${GROUP}/${p.name}`,
      content_type: 'post',
      title: p.metadata?.title ?? '(sin título)',
      summary: null,
      author_id: p.userId ?? null,
      body: p.metadata?.content ?? '',
      category: null,
      video_url: videoUrl,
      thumbnail_url: toMediumVariant(p.metadata?.imagePreview) ?? null,
      published_at: p.createdAt ?? null,
      updated_at: p.updatedAt ?? null,
      status: 'detected',
      tags: [],
    };
  });

  await upsertItems(items, runCounters);
}

// Archiva items propios que ya no aparecen en Skool (borrados, o restos de
// una lógica de scraping anterior) para no dejar basura acumulándose.
async function reconcileStale(runStartedAt, selfId) {
  const { data, error } = await supabase
    .from('community_items')
    .update({ status: 'archived' })
    .eq('author_id', selfId)
    .not('status', 'in', '(excluded,archived)')
    .lt('last_seen_at', runStartedAt)
    .select('id');
  if (error) {
    console.error('No se pudo reconciliar items obsoletos:', error.message);
    return 0;
  }
  if (data.length) console.log(`\nArchivados ${data.length} items que ya no aparecen en Skool.`);
  return data.length;
}

async function main() {
  const runStartedAt = new Date().toISOString();
  const runCounters = { items_found: 0, items_created: 0, items_updated: 0, items_failed: 0 };
  const { data: run, error: runError } = await supabase
    .from('community_sync_runs')
    .insert({ status: 'running' })
    .select()
    .single();

  if (runError || !run) {
    console.error('No se pudo crear el registro de sincronización (revisa SUPABASE_SERVICE_KEY):', runError?.message);
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: SESSION_PATH });
  const page = await context.newPage();

  try {
    await page.goto(`https://www.skool.com/${GROUP}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);
    const buildId = await page.evaluate(() => window.__NEXT_DATA__.buildId);
    const selfId = await page.evaluate(() => window.__NEXT_DATA__.props.pageProps.self?.id);
    if (!selfId) throw new Error('No se pudo determinar tu userId (self.id) desde la sesión.');
    console.log(`Filtrando solo contenido propio (userId ${selfId}).`);

    await scrapeClassroom(page, buildId, selfId, runCounters);
    await scrapeCommunityPosts(page, buildId, selfId, runCounters);
    const archived = await reconcileStale(runStartedAt, selfId);

    await supabase
      .from('community_sync_runs')
      .update({
        finished_at: new Date().toISOString(),
        status: 'success',
        ...runCounters,
        log: `OK. Encontrados: ${runCounters.items_found}, creados: ${runCounters.items_created}, actualizados: ${runCounters.items_updated}, fallidos: ${runCounters.items_failed}, archivados: ${archived}.`,
      })
      .eq('id', run.id);

    console.log('\nSincronización completa.', runCounters);
  } catch (err) {
    console.error('Fallo en el scraping:', err);
    const isSessionExpired = /Timeout|self\?\.\id|selfId|__NEXT_DATA__/.test(String(err));
    const fixSteps = isSessionExpired
      ? `\n\n<b>Solución (probable sesión caducada):</b>\n` +
        `Desde cualquier ordenador con Node instalado (no hace falta que sea el tuyo):\n` +
        `1. <code>cd app</code> (carpeta del proyecto jorge-lorenzo-coach)\n` +
        `2. <code>node scripts/skool-login.mjs</code> — se abre un navegador, inicia sesión en Skool con tu cuenta.\n` +
        `3. <code>scp scripts/.skool-session.json root@147.93.90.134:/root/skool-scraper/</code>\n` +
        `Con eso el cron de las 3:00 vuelve a funcionar solo la noche siguiente.`
      : `\n\nRevisa el log completo en /root/skool-scraper/sync.log en el VPS.`;
    await notifyTelegram(`⚠️ <b>Skool scraper falló</b>\n${String(err?.message ?? err).slice(0, 300)}${fixSteps}`);
    await supabase
      .from('community_sync_runs')
      .update({
        finished_at: new Date().toISOString(),
        status: 'error',
        ...runCounters,
        log: String(err?.stack ?? err),
      })
      .eq('id', run.id);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

main();
