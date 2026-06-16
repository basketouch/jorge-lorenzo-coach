/**
 * Genera audio MP3 con OpenAI TTS para todos los conceptos de ec_concepts
 * sin audio_url, y los sube a Supabase Storage.
 *
 * Uso:
 *   OPENAI_API_KEY=sk-... SUPABASE_SERVICE_KEY=eyJ... node scripts/generate-audio.mjs
 */

import { createClient } from "/Users/jorgelorenzo/Desktop/jorge-lorenzo-coach/app/node_modules/@supabase/supabase-js/dist/index.mjs";

const OPENAI_KEY   = process.env.OPENAI_API_KEY;
const SUPABASE_URL = "https://otsbpiukzftacmvmkajy.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const BUCKET       = "ec-audio";
const VOICE        = "onyx";
const MODEL        = "tts-1-hd";

if (!OPENAI_KEY || !SUPABASE_KEY) {
  console.error("Faltan OPENAI_API_KEY o SUPABASE_SERVICE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function generateMp3(text) {
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: MODEL, voice: VOICE, input: text }),
  });
  if (!res.ok) throw new Error(`OpenAI error: ${res.status} ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find(b => b.name === BUCKET)) {
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
    if (error) throw error;
    console.log(`Bucket '${BUCKET}' creado`);
  }
}

async function main() {
  await ensureBucket();

  const { data: concepts, error } = await supabase
    .from("ec_concepts")
    .select("id, en, audio_url")
    .is("user_id", null)
    .eq("status", "approved")
    .is("audio_url", null);

  if (error) {
    console.error("Error al cargar conceptos:", error.message);
    process.exit(1);
  }

  console.log(`Generando audio para ${concepts.length} conceptos...\n`);

  let ok = 0, fail = 0;

  for (const concept of concepts) {
    try {
      const mp3 = await generateMp3(concept.en);
      const path = `${concept.id}.mp3`;

      await supabase.storage.from(BUCKET).upload(path, mp3, {
        contentType: "audio/mpeg",
        upsert: true,
      });

      const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);

      const { error: updateErr } = await supabase
        .from("ec_concepts")
        .update({ audio_url: publicUrl })
        .eq("id", concept.id);

      if (updateErr) throw updateErr;

      console.log(`✓  ${concept.en}`);
      ok++;

      await new Promise(r => setTimeout(r, 200));
    } catch (e) {
      console.error(`✗  ${concept.en}: ${e.message}`);
      fail++;
    }
  }

  console.log(`\n────────────────────────`);
  console.log(`✓ ${ok} generados`);
  if (fail > 0) console.log(`✗ ${fail} errores`);
}

main();
