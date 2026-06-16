/**
 * Genera audio para los 3 cues nuevos añadidos a los drills
 */
import { createClient } from "/Users/jorgelorenzo/Desktop/jorge-lorenzo-coach/app/node_modules/@supabase/supabase-js/dist/index.mjs";

const OPENAI_KEY   = process.env.OPENAI_API_KEY;
const SUPABASE_URL = "https://otsbpiukzftacmvmkajy.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const BUCKET       = "ec-audio";
const VOICE        = "onyx";
const MODEL        = "tts-1-hd";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function generateAndUpload(text, path) {
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: { "Authorization": `Bearer ${OPENAI_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, voice: VOICE, input: text }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const mp3 = Buffer.from(await res.arrayBuffer());
  const { error } = await supabase.storage.from(BUCKET).upload(path, mp3, { contentType: "audio/mpeg", upsert: true });
  if (error) throw new Error(`Upload: ${error.message}`);
  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return publicUrl;
}

const NEW_CUES = [
  { text: "Keep wide lanes!", path: "drills/three-man-weave-cue-2.mp3" },
  { text: "Finish strong!",   path: "drills/layup-lines-cue-2.mp3" },
  { text: "Move your feet!",  path: "drills/defensive-slides-cue-2.mp3" },
];

async function main() {
  for (const { text, path } of NEW_CUES) {
    try {
      const url = await generateAndUpload(text, path);
      console.log(`✓ "${text}" → ${url}`);
    } catch (e) {
      console.error(`✗ "${text}": ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 300));
  }
}

main();
