/**
 * Genera audio MP3 para todos los textos EN de los drills
 * y los sube a Supabase Storage en ec-audio/drills/
 * Imprime el objeto DRILLS actualizado con audio_url para copiar en EnglishClient.tsx
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
  if (!res.ok) throw new Error(`OpenAI ${res.status}`);
  const mp3 = Buffer.from(await res.arrayBuffer());
  await supabase.storage.from(BUCKET).upload(path, mp3, { contentType: "audio/mpeg", upsert: true });
  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return publicUrl;
}

const DRILLS_TEXT = [
  {
    id: "three-man-weave",
    setup: "Three lines on the baseline. Middle line has the ball.",
    steps: [
      "Middle player starts with the ball.",
      "Pass, then run behind the player you passed to.",
      "Fill the outside lane, catch, and pass again.",
      "Two dribbles maximum - keep it moving.",
      "Finish with a layup.",
      "Grab the rebound and bring it back the other way.",
    ],
    cues: ["Follow your pass!", "Sharp passes!"],
  },
  {
    id: "shell-drill",
    setup: "Four on offense around the perimeter, four on defense matched up.",
    steps: [
      "Offense, pass the ball around - no dribble yet.",
      "On every pass, defense jumps to the ball.",
      "On the ball: pressure. One pass away: deny.",
      "Two passes away: drop and help.",
      "Talk on every screen - call it out.",
      "On the whistle, we go live.",
    ],
    cues: ["Jump to the ball!", "Talk to each other!", "Close out under control."],
  },
  {
    id: "closeout-1v1",
    setup: "Defender starts under the rim with the ball. Attacker waits on the wing.",
    steps: [
      "Defender passes out to the attacker and closes out.",
      "Close out high, short steps, hand up.",
      "Attacker reads it: shoot or drive.",
      "Live until a stop or a basket.",
      "Then switch roles.",
    ],
    cues: ["Break down - don't fly by!", "Contest, don't foul."],
  },
  {
    id: "layup-lines",
    setup: "Two lines: one to shoot, one to rebound.",
    steps: [
      "Shooting line starts on the wing.",
      "Drive in and finish with a layup.",
      "Rebound line grabs it before it hits the floor.",
      "Pass out to the next shooter.",
      "Then go to the back of the other line.",
    ],
    cues: ["Use the backboard!", "High off the glass."],
  },
  {
    id: "defensive-slides",
    setup: "Players spread out, low in a defensive stance.",
    steps: [
      "Get low - wide stance, hands up.",
      "Slide on my hand: left, right.",
      "Don't cross your feet.",
      "Stay on the balls of your feet.",
      "Thirty seconds - push through it.",
    ],
    cues: ["Lower!", "Don't stand up!"],
  },
];

async function main() {
  const results = {};
  let ok = 0, fail = 0;

  for (const drill of DRILLS_TEXT) {
    results[drill.id] = { setup: null, steps: [], cues: [] };
    console.log(`\n── ${drill.id} ──`);

    // Setup
    try {
      const url = await generateAndUpload(drill.setup, `drills/${drill.id}-setup.mp3`);
      results[drill.id].setup = url;
      console.log(`✓ setup`);
      ok++;
    } catch(e) { console.error(`✗ setup: ${e.message}`); fail++; }
    await new Promise(r => setTimeout(r, 200));

    // Steps
    for (let i = 0; i < drill.steps.length; i++) {
      try {
        const url = await generateAndUpload(drill.steps[i], `drills/${drill.id}-step-${i}.mp3`);
        results[drill.id].steps.push(url);
        console.log(`✓ step ${i+1}`);
        ok++;
      } catch(e) { console.error(`✗ step ${i+1}: ${e.message}`); results[drill.id].steps.push(null); fail++; }
      await new Promise(r => setTimeout(r, 200));
    }

    // Cues
    for (let i = 0; i < drill.cues.length; i++) {
      try {
        const url = await generateAndUpload(drill.cues[i], `drills/${drill.id}-cue-${i}.mp3`);
        results[drill.id].cues.push(url);
        console.log(`✓ cue ${i+1}`);
        ok++;
      } catch(e) { console.error(`✗ cue ${i+1}: ${e.message}`); results[drill.id].cues.push(null); fail++; }
      await new Promise(r => setTimeout(r, 200));
    }
  }

  console.log(`\n────────────────────────`);
  console.log(`✓ ${ok} generados · ✗ ${fail} errores`);
  console.log(`\nRESULTS JSON (para EnglishClient.tsx):`);
  console.log(JSON.stringify(results, null, 2));
}

main();
