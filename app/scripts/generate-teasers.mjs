// Uso: OPENAI_API_KEY=xxx SUPABASE_SERVICE_KEY=xxx node scripts/generate-teasers.mjs
//
// Rellena `public_teaser` en community_items para los items que aún no lo
// tienen: un resumen corto (1-2 frases) apto para mostrarse a cualquiera,
// sin revelar el contenido completo. Usa el modelo barato que ya usa Alex
// (gpt-5.6-luna) en vez de uno nuevo.

if (!globalThis.WebSocket) {
  const { default: WS } = await import('ws');
  globalThis.WebSocket = WS;
}
const { createClient } = await import('@supabase/supabase-js');

const SUPABASE_URL = 'https://otsbpiukzftacmvmkajy.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.TEASER_MODEL || 'gpt-5.6-luna';

if (!SUPABASE_KEY || !OPENAI_KEY) {
  console.error('Faltan SUPABASE_SERVICE_KEY y/o OPENAI_API_KEY en el entorno.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const SYSTEM_PROMPT = `Escribes teasers públicos para una biblioteca de contenido de baloncesto dirigida a entrenadores.
Reglas:
- 1-2 frases, máximo 220 caracteres.
- Describe de qué trata y a quién ayuda, sin dar la solución ni el contenido completo.
- Nunca reveles el desarrollo, los pasos o la conclusión del post/lección.
- Tono cercano, en español, sin emojis.
- Responde solo con el texto del teaser, sin comillas ni prefijos.`;

async function generateTeaser(title, body) {
  const content = body?.trim()
    ? `Título: ${title}\n\nContenido:\n${body.slice(0, 3000)}`
    : `Título: ${title}\n\n(Sin texto adicional; probablemente es un vídeo.)`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content },
      ],
      max_completion_tokens: 150,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI HTTP ${res.status}: ${text.slice(0, 300)}`);
  }
  const json = await res.json();
  return json.choices?.[0]?.message?.content?.trim() ?? null;
}

async function main() {
  const { data: items, error } = await supabase
    .from('community_items')
    .select('id, title, body')
    .is('public_teaser', null)
    .not('status', 'in', '(excluded,archived)');

  if (error) {
    console.error('Error leyendo community_items:', error.message);
    process.exit(1);
  }

  console.log(`${items.length} items sin teaser. Modelo: ${MODEL}.`);

  let done = 0;
  let failed = 0;
  for (const item of items) {
    try {
      const teaser = await generateTeaser(item.title, item.body);
      if (!teaser) throw new Error('Respuesta vacía');
      const { error: updateError } = await supabase
        .from('community_items')
        .update({ public_teaser: teaser })
        .eq('id', item.id);
      if (updateError) throw new Error(updateError.message);
      done++;
      console.log(`✓ ${item.title.slice(0, 50)} → ${teaser.slice(0, 60)}...`);
    } catch (err) {
      failed++;
      console.error(`✗ ${item.title.slice(0, 50)}: ${err.message}`);
    }
    await sleep(300); // ritmo prudente, evita rate limits
  }

  console.log(`\nCompletado. Generados: ${done}, fallidos: ${failed}.`);
}

main();
