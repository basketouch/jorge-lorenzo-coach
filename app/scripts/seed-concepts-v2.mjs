/**
 * Actualiza ec_concepts con:
 * - context en frases existentes
 * - command en vocab existente
 * - Inserta frases nuevas (captar atención + correcciones en pista)
 */
import { createClient } from "/Users/jorgelorenzo/Desktop/jorge-lorenzo-coach/app/node_modules/@supabase/supabase-js/dist/index.mjs";

const SUPABASE_URL = "https://otsbpiukzftacmvmkajy.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── 1. Añadir COMMAND a vocab existente ──────────────────────
const COMMANDS = [
  { en: "Screen",           command: "Set a screen!" },
  { en: "Cut",              command: "Cut hard!" },
  { en: "Drive",            command: "Drive it!" },
  { en: "Kick-out",         command: "Kick it out!" },
  { en: "Spacing",          command: "Keep your spacing!" },
  { en: "Hand-off",         command: "Come get the hand-off!" },
  { en: "Post up",          command: "Post up strong!" },
  { en: "Fast break",       command: "Run the break!" },
  { en: "Close out",        command: "Close out!" },
  { en: "Box out",          command: "Box out!" },
  { en: "Switch",           command: "Switch!" },
  { en: "Help defense",     command: "Help!" },
  { en: "Rotate",           command: "Rotate!" },
  { en: "Deny",             command: "Deny the pass!" },
  { en: "Contest the shot", command: "Contest the shot!" },
  { en: "Trap",             command: "Trap him!" },
  { en: "Dribble",          command: "Keep your dribble alive!" },
  { en: "Pass",             command: "Make the pass!" },
  { en: "Shoot",            command: "Shoot it!" },
  { en: "Pivot",            command: "Pivot out!" },
  { en: "Square up",        command: "Square up!" },
  { en: "Slide",            command: "Slide your feet!" },
  { en: "Sprint",           command: "Sprint back!" },
  { en: "Hands up",         command: "Hands up!" },
];

// ── 2. Añadir CONTEXT a frases existentes ────────────────────
const CONTEXTS = [
  { en: "Partner up.",                   context: "Cuando quieres que trabajen de dos en dos." },
  { en: "Get into groups of three.",     context: "Para drills de tres jugadores." },
  { en: "Two lines on the baseline.",    context: "Para iniciar ejercicios desde fondo de pista." },
  { en: "Spread out.",                   context: "Cuando están demasiado juntos." },
  { en: "Line up here.",                 context: "Para marcar el punto de inicio del ejercicio." },
  { en: "Bring it in!",                  context: "Para reunir al equipo cerca de ti." },
  { en: "Bring it in, hands in.",        context: "Para cerrar el entrenamiento con piña." },
  { en: "On the whistle.",               context: "Cuando deben esperar tu señal para empezar." },
  { en: "On my count.",                  context: "Cuando quieres controlar tú el inicio." },
  { en: "Game speed!",                   context: "Cuando el ejercicio se está haciendo demasiado lento." },
  { en: "Half speed.",                   context: "Para practicar técnica sin ir al máximo." },
  { en: "Hold up - freeze.",             context: "Para detener el ejercicio justo en una posición concreta." },
  { en: "Switch sides.",                 context: "Para cambiar de lado o rol en el ejercicio." },
  { en: "Run it again.",                 context: "Cuando quieres repetir el mismo ejercicio." },
  { en: "Make it sharp.",                context: "Cuando el ejercicio se hace con poca precisión o limpieza." },
  { en: "No fouls.",                     context: "Para recordar que el ejercicio es técnico, sin contacto." },
  { en: "Last one.",                     context: "Para avisar que es la última repetición." },
  { en: "Water break - two minutes.",    context: "Para dar un descanso breve entre ejercicios." },
  { en: "Good work today.",              context: "Para cerrar el entrenamiento con refuerzo positivo." },
];

// ── 3. Frases nuevas ─────────────────────────────────────────
const NEW_PHRASES = [
  // Para captar la atención
  { type: "phrase", category: "Para captar la atención", en: "Eyes on me.",         es: "Miradme.",            say: "áis on mi",        context: "Cuando necesitas que el grupo deje de mirar el balón o hablar." },
  { type: "phrase", category: "Para captar la atención", en: "Listen up.",           es: "Escuchad.",           say: "LÍ-sen op",        context: "Antes de explicar un ejercicio o corregir algo importante." },
  { type: "phrase", category: "Para captar la atención", en: "Take a knee.",         es: "Rodilla al suelo.",   say: "téik a níi",       context: "Para una explicación más larga o una charla rápida." },
  { type: "phrase", category: "Para captar la atención", en: "Huddle up.",           es: "Juntaos aquí.",       say: "HÓ-del op",        context: "Para reunir al equipo en un punto concreto de la pista." },

  // Para corregir en pista (sin parar)
  { type: "phrase", category: "Para corregir en pista", en: "Keep moving.",          es: "Seguid moviéndoos.",  say: "kiip MÚU-vin",     context: "Cuando los jugadores se quedan parados esperando." },
  { type: "phrase", category: "Para corregir en pista", en: "Move the ball.",        es: "Moved el balón.",     say: "múuv de bol",      context: "Cuando el ataque retiene demasiado el balón." },
  { type: "phrase", category: "Para corregir en pista", en: "Talk on defense.",      es: "Hablad en defensa.",  say: "tok on de-FENS",   context: "Cuando falta comunicación defensiva." },
  { type: "phrase", category: "Para corregir en pista", en: "Call it out.",          es: "Avisadlo.",           say: "kol it áut",       context: "Para pedir que comuniquen bloqueos, cambios o ayudas." },
  { type: "phrase", category: "Para corregir en pista", en: "Stay low.",             es: "Manteneos abajo.",    say: "stéi lóu",         context: "Cuando la postura defensiva es demasiado alta." },
  { type: "phrase", category: "Para corregir en pista", en: "Be strong with the ball.", es: "Sed fuertes con el balón.", say: "bi strong uiz de bol", context: "Cuando hay pérdidas por falta de protección del balón." },
  { type: "phrase", category: "Para corregir en pista", en: "Pick up the pace.",     es: "Subid el ritmo.",     say: "pik op de péis",   context: "Cuando falta intensidad en el ejercicio." },

  // Don't — Generales
  { type: "phrase", category: "Don't — Generales", en: "Don't rush.",           es: "No te precipites.",          say: "dóunt rosh",        context: "Cuando un jugador decide demasiado rápido o sin control." },
  { type: "phrase", category: "Don't — Generales", en: "Don't force it.",       es: "No lo fuerces.",             say: "dóunt fors it",     context: "Cuando intenta un pase, tiro o penetración sin ventaja." },
  { type: "phrase", category: "Don't — Generales", en: "Don't stop moving.",    es: "No pares de moverte.",       say: "dóunt stop MÚU-vin", context: "Cuando el jugador se queda quieto sin balón." },
  { type: "phrase", category: "Don't — Generales", en: "Don't watch the ball.", es: "No mires solo el balón.",    say: "dóunt uoch de bol", context: "Para jugadores que pierden de vista a su par defensivo." },
  { type: "phrase", category: "Don't — Generales", en: "Don't give up.",        es: "No te rindas.",              say: "dóunt guiv op",     context: "Para mantener energía e intensidad al final del ejercicio." },
  { type: "phrase", category: "Don't — Generales", en: "Don't switch off.",     es: "No desconectes.",            say: "dóunt suich of",    context: "Cuando falta concentración o atención en el ejercicio." },

  // Don't — Ataque
  { type: "phrase", category: "Don't — Ataque", en: "Don't over-dribble.",       es: "No botes de más.",                   say: "dóunt ÓU-ver DRÍ-bol",  context: "Cuando el jugador retiene demasiado el balón botando." },
  { type: "phrase", category: "Don't — Ataque", en: "Don't pick up your dribble.", es: "No dejes de botar.",              say: "dóunt pik op yor DRÍ-bol", context: "Cuando se queda sin opciones demasiado pronto." },
  { type: "phrase", category: "Don't — Ataque", en: "Don't crowd the ball.",     es: "No os juntéis alrededor del balón.", say: "dóunt kráud de bol",    context: "Cuando el espaciado es malo y varios jugadores van al balón." },
  { type: "phrase", category: "Don't — Ataque", en: "Don't kill the spacing.",   es: "No rompáis el espaciado.",           say: "dóunt kil de SPÉI-sin", context: "Para mantener buenos espacios en ataque." },
  { type: "phrase", category: "Don't — Ataque", en: "Don't float the pass.",     es: "No bombees el pase.",                say: "dóunt flóut de pas",    context: "Cuando los pases son lentos o blandos y fáciles de interceptar." },
  { type: "phrase", category: "Don't — Ataque", en: "Don't bring the ball down.", es: "No bajes el balón.",               say: "dóunt bring de bol dáun", context: "Especialmente cerca del aro, donde el defensor puede robar." },
  { type: "phrase", category: "Don't — Ataque", en: "Don't settle.",             es: "No te conformes.",                   say: "dóunt SÉ-tel",          context: "Cuando se toma un mal tiro pudiendo atacar en mejores condiciones." },

  // Don't — Defensa
  { type: "phrase", category: "Don't — Defensa", en: "Don't reach.",             es: "No metas la mano.",              say: "dóunt ríich",           context: "Para evitar faltas tontas intentando robar el balón." },
  { type: "phrase", category: "Don't — Defensa", en: "Don't foul.",              es: "No hagas falta.",                say: "dóunt fául",            context: "Corrección directa ante contacto innecesario." },
  { type: "phrase", category: "Don't — Defensa", en: "Don't gamble.",            es: "No te la juegues.",              say: "dóunt GÁM-bol",         context: "Cuando intenta robar y pierde la posición defensiva." },
  { type: "phrase", category: "Don't — Defensa", en: "Don't open the gate.",     es: "No abras la puerta.",            say: "dóunt ÓU-pen de guéit", context: "Cuando abre demasiado la cadera y deja pasar al atacante." },
  { type: "phrase", category: "Don't — Defensa", en: "Don't give up the middle.", es: "No concedas el centro.",        say: "dóunt guiv op de MÍ-del", context: "En defensa de 1 contra 1 cerca del aro." },
  { type: "phrase", category: "Don't — Defensa", en: "Don't lose sight of your man.", es: "No pierdas de vista a tu par.", say: "dóunt luus sáit of yor man", context: "En defensa sin balón, cuando el jugador mira solo el balón." },
  { type: "phrase", category: "Don't — Defensa", en: "Don't over-help.",         es: "No ayudes de más.",              say: "dóunt ÓU-ver help",     context: "Cuando abandona demasiado a su jugador para ayudar." },
  { type: "phrase", category: "Don't — Defensa", en: "Don't fly by.",            es: "No pases de largo.",             say: "dóunt fláy bai",        context: "En closeouts descontrolados donde el defensor se pasa." },
  { type: "phrase", category: "Don't — Defensa", en: "Don't stand upright.",     es: "No te quedes de pie.",           say: "dóunt stand OP-rait",   context: "Cuando la postura defensiva es demasiado alta y sin palanca." },
  { type: "phrase", category: "Don't — Defensa", en: "Don't cross your feet.",   es: "No cruces los pies.",            say: "dóunt kros yor fíit",   context: "En desplazamientos defensivos laterales." },

  // Don't — Rebote y físico
  { type: "phrase", category: "Don't — Rebote", en: "Don't ball-watch.",         es: "No te quedes mirando el balón.", say: "dóunt bol-uoch",        context: "Cuando no cierra el rebote por quedarse mirando el tiro." },
  { type: "phrase", category: "Don't — Rebote", en: "Don't stop after the shot.", es: "No pares después del tiro.",   say: "dóunt stop ÁF-ter de shot", context: "Para ir al rebote o al balance defensivo tras el tiro." },
  { type: "phrase", category: "Don't — Rebote", en: "Don't walk back.",          es: "No vuelvas andando.",            say: "dóunt uok bak",         context: "Para exigir balance defensivo rápido tras pérdida o tiro." },
  { type: "phrase", category: "Don't — Rebote", en: "Don't stand up.",           es: "No te levantes.",                say: "dóunt stand op",        context: "En ejercicios físicos o defensivos donde hay que mantener postura." },
];

async function main() {
  let ok = 0, fail = 0;

  // 1. Commands en vocab
  console.log("── Actualizando commands en vocab...");
  for (const { en, command } of COMMANDS) {
    const { error } = await supabase
      .from("ec_concepts").update({ command }).eq("en", en).is("user_id", null);
    if (error) { console.error(`✗ command "${en}": ${error.message}`); fail++; }
    else { console.log(`✓ command: ${en}`); ok++; }
  }

  // 2. Context en frases existentes
  console.log("\n── Actualizando context en frases...");
  for (const { en, context } of CONTEXTS) {
    const { error } = await supabase
      .from("ec_concepts").update({ context }).eq("en", en).is("user_id", null);
    if (error) { console.error(`✗ context "${en}": ${error.message}`); fail++; }
    else { console.log(`✓ context: ${en}`); ok++; }
  }

  // 3. Insertar frases nuevas (solo si no existen ya)
  console.log("\n── Insertando frases nuevas...");
  for (const phrase of NEW_PHRASES) {
    // Comprobar si ya existe
    const { data: existing } = await supabase
      .from("ec_concepts").select("id").eq("en", phrase.en).is("user_id", null).maybeSingle();
    if (existing) { console.log(`⊘ ya existe: ${phrase.en}`); ok++; continue; }

    const { error } = await supabase.from("ec_concepts")
      .insert({ ...phrase, user_id: null, status: "approved" });
    if (error) { console.error(`✗ phrase "${phrase.en}": ${error.message}`); fail++; }
    else { console.log(`✓ phrase: ${phrase.en}`); ok++; }
  }

  console.log(`\n✓ ${ok} · ✗ ${fail}`);
}

main();
