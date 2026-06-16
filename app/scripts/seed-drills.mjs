/**
 * Seed ec_drills — migra los 5 drills del código a la BD
 * y rellena goal, coach_lang, corrections
 */
import { createClient } from "/Users/jorgelorenzo/Desktop/jorge-lorenzo-coach/app/node_modules/@supabase/supabase-js/dist/index.mjs";

const SUPABASE_URL = "https://otsbpiukzftacmvmkajy.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BASE = "https://otsbpiukzftacmvmkajy.supabase.co/storage/v1/object/public/ec-audio/drills";

const DRILLS = [
  {
    id: "three-man-weave",
    en: "Three-man weave",
    es: "Tres en zigzag",
    meta: "Calentamiento · 5–8 min",
    goal_en: "Improve passing, spacing, lane running and finishing at game speed.",
    goal_es: "Mejorar pase, espacios, ocupación de carriles y finalización a ritmo de partido.",
    setup_en: "Three lines on the baseline. Middle line has the ball.",
    setup_es: "Tres filas en la línea de fondo. La del medio con balón.",
    setup_audio: `${BASE}/three-man-weave-setup.mp3`,
    steps: [
      { en: "Middle player starts with the ball.", es: "El jugador del medio empieza con balón.", audio_url: `${BASE}/three-man-weave-step-0.mp3` },
      { en: "Pass, then run behind the player you passed to.", es: "Pasa y corre por detrás del jugador que recibe.", audio_url: `${BASE}/three-man-weave-step-1.mp3` },
      { en: "Fill the outside lane, catch, and pass again.", es: "Ocupa el carril exterior, recibe y vuelve a pasar.", audio_url: `${BASE}/three-man-weave-step-2.mp3` },
      { en: "Two dribbles maximum - keep it moving.", es: "Máximo dos botes - mantenedlo fluido.", audio_url: `${BASE}/three-man-weave-step-3.mp3` },
      { en: "Finish with a layup.", es: "Terminad con una bandeja.", audio_url: `${BASE}/three-man-weave-step-4.mp3` },
      { en: "Grab the rebound and bring it back the other way.", es: "Coged el rebote y volved por el otro lado.", audio_url: `${BASE}/three-man-weave-step-5.mp3` },
    ],
    cues: [
      { en: "Follow your pass!", es: "¡Sigue tu pase!", audio_url: `${BASE}/three-man-weave-cue-0.mp3` },
      { en: "Sharp passes!", es: "¡Pases precisos!", audio_url: `${BASE}/three-man-weave-cue-1.mp3` },
      { en: "Keep wide lanes!", es: "¡Mantened las calles abiertas!", audio_url: `${BASE}/three-man-weave-cue-2.mp3` },
    ],
    coach_lang: [
      { en: "Lead him with the pass!", es: "¡Dale el pase adelantado!" },
      { en: "Keep it moving!", es: "¡Que fluya!" },
      { en: "Don't slow down!", es: "¡No frenéis!" },
      { en: "Finish at full speed!", es: "¡Finalizad a máxima velocidad!" },
      { en: "Grab it and go back!", es: "¡Cogedla y volved!" },
    ],
    corrections: [
      { en: "Don't run down the middle.", es: "No corras por el centro." },
      { en: "Don't crowd the ball.", es: "No os juntéis alrededor del balón." },
      { en: "Don't float the pass.", es: "No bombees el pase." },
    ],
    coaching: [
      { en: "The passer always runs behind the receiver.", es: "El que pasa siempre corre por detrás del que recibe." },
      { en: "Three lanes must stay wide — don't bunch up.", es: "Las tres calles deben mantenerse abiertas — no os juntéis." },
      { en: "Two dribbles maximum — push the pace.", es: "Máximo dos botes — subid el ritmo." },
      { en: "Finish with a proper layup — not just a toss.", es: "Terminad con una bandeja real — no un simple lanzamiento." },
    ],
    mistakes: [
      { en: "Running in front of the pass instead of behind.", es: "Correr por delante del pase en vez de por detrás." },
      { en: "Lanes too narrow — three players too close together.", es: "Calles demasiado estrechas — los tres muy juntos." },
      { en: "Too many dribbles — slows down the drill.", es: "Demasiados botes — ralentiza el ejercicio." },
      { en: "Stopping after the pass instead of sprinting.", es: "Pararse después de pasar en vez de esprintar." },
    ],
    progression: [
      { en: "Walk-through first to fix the pattern.", es: "Primero a paso lento para fijar el patrón." },
      { en: "Half speed with the correct paths.", es: "A medio gas con los recorridos correctos." },
      { en: "Full speed — two dribble limit.", es: "A tope — límite de dos botes." },
      { en: "Add a second ball from the other baseline.", es: "Añadir un segundo balón desde el otro lado." },
    ],
    order_index: 1,
  },
  {
    id: "shell-drill",
    en: "Shell drill (4-on-4)",
    es: "Defensivo 4x4 (shell)",
    meta: "Defensa · 10 min",
    goal_en: "Improve defensive positioning, help defense, communication and rotations.",
    goal_es: "Mejorar posicionamiento defensivo, ayudas, comunicación y rotaciones.",
    setup_en: "Four on offense around the perimeter, four on defense matched up.",
    setup_es: "Cuatro en ataque por el perímetro, cuatro en defensa emparejados.",
    setup_audio: `${BASE}/shell-drill-setup.mp3`,
    steps: [
      { en: "Offense, pass the ball around - no dribble yet.", es: "Ataque, moved el balón - todavía sin bote.", audio_url: `${BASE}/shell-drill-step-0.mp3` },
      { en: "On every pass, defense jumps to the ball.", es: "En cada pase, la defensa salta hacia el balón.", audio_url: `${BASE}/shell-drill-step-1.mp3` },
      { en: "On the ball: pressure. One pass away: deny.", es: "Al balón: presión. A un pase: negar.", audio_url: `${BASE}/shell-drill-step-2.mp3` },
      { en: "Two passes away: drop and help.", es: "A dos pases: bajar y ayudar.", audio_url: `${BASE}/shell-drill-step-3.mp3` },
      { en: "Talk on every screen - call it out.", es: "Hablad en cada bloqueo - avisadlo.", audio_url: `${BASE}/shell-drill-step-4.mp3` },
      { en: "On the whistle, we go live.", es: "Al silbato, se juega libre.", audio_url: `${BASE}/shell-drill-step-5.mp3` },
    ],
    cues: [
      { en: "Jump to the ball!", es: "¡Salta al balón!", audio_url: `${BASE}/shell-drill-cue-0.mp3` },
      { en: "Talk to each other!", es: "¡Comunicaos!", audio_url: `${BASE}/shell-drill-cue-1.mp3` },
      { en: "Close out under control.", es: "Bascula controlado.", audio_url: `${BASE}/shell-drill-cue-2.mp3` },
    ],
    coach_lang: [
      { en: "See ball and man!", es: "¡Ve balón y hombre!" },
      { en: "Deny one pass away!", es: "¡Niega a un pase!" },
      { en: "Drop and help!", es: "¡Baja y ayuda!" },
      { en: "Talk on every pass!", es: "¡Hablad en cada pase!" },
      { en: "Call the screen!", es: "¡Avisad el bloqueo!" },
      { en: "Rotate!", es: "¡Rotad!" },
      { en: "Close out under control!", es: "¡Salid a puntear con control!" },
    ],
    corrections: [
      { en: "Don't stand upright.", es: "No os quedéis de pie." },
      { en: "Don't lose your man.", es: "No perdáis a vuestro par." },
      { en: "Don't over-help.", es: "No ayudéis de más." },
      { en: "Don't be late on the rotation.", es: "No lleguéis tarde a la rotación." },
    ],
    coaching: [
      { en: "On every pass, the whole defense must move together.", es: "En cada pase, toda la defensa se mueve a la vez." },
      { en: "Ball pressure is key — make the offense uncomfortable.", es: "La presión al balón es clave — incomodad al ataque." },
      { en: "Deny the direct pass — one arm's length from your player.", es: "Negad el pase directo — a un brazo de distancia de vuestro jugador." },
      { en: "Help-side defense: see ball and man at all times.", es: "Defensa de ayuda: ved siempre balón y jugador." },
      { en: "Communicate on screens before they happen, not after.", es: "Comunicad los bloqueos antes de que lleguen, no después." },
    ],
    mistakes: [
      { en: "Standing still after a pass — not jumping to the ball.", es: "Quedarse parado tras el pase — no saltar al balón." },
      { en: "Losing sight of the ball when denying.", es: "Perder de vista el balón mientras se niega el pase." },
      { en: "Help defense too close — not giving enough cushion.", es: "Defensa de ayuda demasiado cerca — sin dar suficiente colchón." },
      { en: "Not calling out screens — silent defense gets broken down.", es: "No avisar los bloqueos — la defensa silenciosa se rompe." },
    ],
    progression: [
      { en: "Start with no dribble — force ball movement only.", es: "Empezad sin bote — solo movimiento de balón." },
      { en: "Add one dribble allowed per possession.", es: "Añadid un bote permitido por posesión." },
      { en: "Add screens — offense sets one off-ball screen.", es: "Añadid bloqueos — el ataque pone uno sin balón." },
      { en: "Go live — full defense, full offense.", es: "A jugar libre — defensa y ataque completos." },
    ],
    order_index: 2,
  },
  {
    id: "closeout-1v1",
    en: "Closeout 1-on-1",
    es: "Basculación y 1x1",
    meta: "Defensa · 8 min",
    goal_en: "Improve closeout technique, defensive control and 1-on-1 containment.",
    goal_es: "Mejorar la técnica de closeout, el control defensivo y la defensa del 1 contra 1.",
    setup_en: "Defender starts under the rim with the ball. Attacker waits on the wing.",
    setup_es: "El defensor empieza bajo el aro con balón. El atacante espera en el ala.",
    setup_audio: `${BASE}/closeout-1v1-setup.mp3`,
    steps: [
      { en: "Defender passes out to the attacker and closes out.", es: "El defensor pasa al atacante y sale a puntear.", audio_url: `${BASE}/closeout-1v1-step-0.mp3` },
      { en: "Close out high, short steps, hand up.", es: "Sal alto, pasos cortos, mano arriba.", audio_url: `${BASE}/closeout-1v1-step-1.mp3` },
      { en: "Attacker reads it: shoot or drive.", es: "El atacante lee: tira o penetra.", audio_url: `${BASE}/closeout-1v1-step-2.mp3` },
      { en: "Live until a stop or a basket.", es: "Se juega hasta parada o canasta.", audio_url: `${BASE}/closeout-1v1-step-3.mp3` },
      { en: "Then switch roles.", es: "Después, cambiad de rol.", audio_url: `${BASE}/closeout-1v1-step-4.mp3` },
    ],
    cues: [
      { en: "Break down - don't fly by!", es: "¡Frena - no te pases de largo!", audio_url: `${BASE}/closeout-1v1-cue-0.mp3` },
      { en: "Contest, don't foul.", es: "Disputa, sin falta.", audio_url: `${BASE}/closeout-1v1-cue-1.mp3` },
    ],
    coach_lang: [
      { en: "Sprint, then break down!", es: "¡Esprinta y frena!" },
      { en: "Short steps!", es: "¡Pasos cortos!" },
      { en: "High hand!", es: "¡Mano arriba!" },
      { en: "Stay low!", es: "¡Mantente abajo!" },
      { en: "Force baseline!", es: "¡Llévalo a línea de fondo!" },
      { en: "Don't give up the middle!", es: "¡No concedas el centro!" },
      { en: "Stay in front!", es: "¡Aguanta delante!" },
    ],
    corrections: [
      { en: "Don't fly by.", es: "No pases de largo." },
      { en: "Don't jump at the shooter.", es: "No saltes encima del tirador." },
      { en: "Don't reach.", es: "No metas la mano." },
      { en: "Don't open your hips too early.", es: "No abras la cadera demasiado pronto." },
    ],
    coaching: [
      { en: "Sprint the first three steps, then break down into short choppy steps.", es: "Esprintar los primeros tres pasos, luego frenar con pasos cortos y rápidos." },
      { en: "Hand up to take away the shot — not both hands.", es: "Una mano arriba para quitar el tiro — no las dos." },
      { en: "Keep your feet moving — don't go for pump fakes.", es: "Moved los pies — no os dejéis engañar por los amagos." },
      { en: "Stay between the attacker and the basket at all times.", es: "Siempre entre el atacante y el aro." },
    ],
    mistakes: [
      { en: "Flying past the attacker — giving up open layup.", es: "Pasarse de largo — dejando bandeja libre." },
      { en: "Closing out straight — attacker drives easily.", es: "Basculando recto — el atacante penetra sin problema." },
      { en: "Both hands up — fouling on a shot attempt.", es: "Las dos manos arriba — faltando en el intento de tiro." },
      { en: "Standing upright — no leverage to move laterally.", es: "De pie erguido — sin palanca para moverse lateralmente." },
    ],
    progression: [
      { en: "Defender walks the closeout — focus on footwork.", es: "El defensor bascula andando — foco en los apoyos." },
      { en: "Half speed closeout — attacker chooses one option only.", es: "Basculación a medio gas — el atacante elige solo una opción." },
      { en: "Full speed — attacker has both options open.", es: "A tope — el atacante tiene las dos opciones abiertas." },
      { en: "Add a kick-out: help defender must close out too.", es: "Añadir un pase de descarga: el defensor de ayuda también bascula." },
    ],
    order_index: 3,
  },
  {
    id: "layup-lines",
    en: "Layup lines",
    es: "Filas de bandejas",
    meta: "Calentamiento · 5 min",
    goal_en: "Improve layup footwork, finishing technique, rebounding and passing rhythm.",
    goal_es: "Mejorar pasos de bandeja, técnica de finalización, rebote y ritmo de pase.",
    setup_en: "Two lines: one to shoot, one to rebound.",
    setup_es: "Dos filas: una tira, otra rebotea.",
    setup_audio: `${BASE}/layup-lines-setup.mp3`,
    steps: [
      { en: "Shooting line starts on the wing.", es: "La fila de tiro empieza en el ala.", audio_url: `${BASE}/layup-lines-step-0.mp3` },
      { en: "Drive in and finish with a layup.", es: "Penetra y termina con bandeja.", audio_url: `${BASE}/layup-lines-step-1.mp3` },
      { en: "Rebound line grabs it before it hits the floor.", es: "La fila de rebote la coge antes de que toque el suelo.", audio_url: `${BASE}/layup-lines-step-2.mp3` },
      { en: "Pass out to the next shooter.", es: "Pasa al siguiente tirador.", audio_url: `${BASE}/layup-lines-step-3.mp3` },
      { en: "Then go to the back of the other line.", es: "Luego, al final de la otra fila.", audio_url: `${BASE}/layup-lines-step-4.mp3` },
    ],
    cues: [
      { en: "Use the backboard!", es: "¡Usa el tablero!", audio_url: `${BASE}/layup-lines-cue-0.mp3` },
      { en: "High off the glass.", es: "Alto contra el tablero.", audio_url: `${BASE}/layup-lines-cue-1.mp3` },
      { en: "Finish strong!", es: "¡Termina con convicción!", audio_url: `${BASE}/layup-lines-cue-2.mp3` },
    ],
    coach_lang: [
      { en: "Eyes up!", es: "¡Cabeza arriba!" },
      { en: "Attack the rim!", es: "¡Ataca el aro!" },
      { en: "Rebound before it hits the floor!", es: "¡Coge el rebote antes de que toque el suelo!" },
      { en: "Quick outlet pass!", es: "¡Pase rápido de salida!" },
      { en: "Switch lines!", es: "¡Cambiad de fila!" },
    ],
    corrections: [
      { en: "Don't slow down too early.", es: "No frenes demasiado pronto." },
      { en: "Don't shoot from under the rim.", es: "No tires desde debajo del aro." },
      { en: "Don't bring the ball down.", es: "No bajes el balón." },
      { en: "Don't miss the rebound.", es: "No pierdas el rebote." },
    ],
    coaching: [
      { en: "Approach at an angle — not straight at the basket.", es: "Acercaos en diagonal — no recto al aro." },
      { en: "Use the correct foot: right side = right foot up.", es: "Pie correcto: lado derecho = pie derecho arriba." },
      { en: "Aim at the top corner of the square on the backboard.", es: "Apuntad a la esquina superior del cuadrado del tablero." },
      { en: "Soft touch — let the glass do the work.", es: "Toque suave — dejad que el tablero haga el trabajo." },
    ],
    mistakes: [
      { en: "Going straight to the basket — no angle.", es: "Ir recto al aro — sin diagonal." },
      { en: "Wrong foot — two-foot jump instead of one.", es: "Pie equivocado — salto con los dos pies en vez de uno." },
      { en: "Shooting too hard — bounces off instead of going in.", es: "Tiro demasiado fuerte — rebota en vez de entrar." },
      { en: "Rebounders waiting too long — ball hits the floor.", es: "Los reboteadores esperan demasiado — el balón toca el suelo." },
    ],
    progression: [
      { en: "Right side only — dominant hand focus.", es: "Solo por el lado derecho — foco en la mano dominante." },
      { en: "Both sides alternating.", es: "Los dos lados alternando." },
      { en: "Add a pass before the drive — catch and go.", es: "Añadir un pase antes de penetrar — recibe y va." },
      { en: "Power layup: two feet, body contact simulation.", es: "Bandeja de fuerza: dos pies, simulando contacto." },
    ],
    order_index: 4,
  },
  {
    id: "defensive-slides",
    en: "Defensive slides",
    es: "Desplazamientos defensivos",
    meta: "Físico · 4 min",
    goal_en: "Improve defensive stance, lateral movement, footwork and conditioning.",
    goal_es: "Mejorar postura defensiva, desplazamiento lateral, pies y condición física.",
    setup_en: "Players spread out, low in a defensive stance.",
    setup_es: "Jugadores repartidos, abajo en postura defensiva.",
    setup_audio: `${BASE}/defensive-slides-setup.mp3`,
    steps: [
      { en: "Get low - wide stance, hands up.", es: "Abajo - postura ancha, manos arriba.", audio_url: `${BASE}/defensive-slides-step-0.mp3` },
      { en: "Slide on my hand: left, right.", es: "Deslizaos según mi mano: izquierda, derecha.", audio_url: `${BASE}/defensive-slides-step-1.mp3` },
      { en: "Don't cross your feet.", es: "No crucéis los pies.", audio_url: `${BASE}/defensive-slides-step-2.mp3` },
      { en: "Stay on the balls of your feet.", es: "Apoyaos en la parte delantera de los pies.", audio_url: `${BASE}/defensive-slides-step-3.mp3` },
      { en: "Thirty seconds - push through it.", es: "Treinta segundos - apretad hasta el final.", audio_url: `${BASE}/defensive-slides-step-4.mp3` },
    ],
    cues: [
      { en: "Lower!", es: "¡Más abajo!", audio_url: `${BASE}/defensive-slides-cue-0.mp3` },
      { en: "Don't stand up!", es: "¡No os levantéis!", audio_url: `${BASE}/defensive-slides-cue-1.mp3` },
      { en: "Move your feet!", es: "¡Moved los pies!", audio_url: `${BASE}/defensive-slides-cue-2.mp3` },
    ],
    coach_lang: [
      { en: "Wide stance!", es: "¡Postura ancha!" },
      { en: "Hands up!", es: "¡Manos arriba!" },
      { en: "Slide, don't hop!", es: "¡Desliza, no saltes!" },
      { en: "Push off the outside foot!", es: "¡Empuja con el pie exterior!" },
      { en: "Hold it!", es: "¡Aguanta!" },
      { en: "Push through it!", es: "¡Aprieta hasta el final!" },
    ],
    corrections: [
      { en: "Don't stand up.", es: "No te levantes." },
      { en: "Don't bounce.", es: "No botes hacia arriba y abajo." },
      { en: "Don't let your feet get narrow.", es: "No juntes demasiado los pies." },
      { en: "Don't stop before the whistle.", es: "No pares antes del silbato." },
    ],
    coaching: [
      { en: "Hips low — knees bent, back straight.", es: "Caderas bajas — rodillas dobladas, espalda recta." },
      { en: "Lead foot slides first, trail foot follows immediately.", es: "El pie líder se desliza primero, el otro le sigue de inmediato." },
      { en: "Keep hands active — mirrors the ball.", es: "Manos activas — siguen el balón." },
      { en: "Weight on the balls of the feet — never flat-footed.", es: "Peso en la parte delantera del pie — nunca apoyados en toda la planta." },
    ],
    mistakes: [
      { en: "Crossing feet — loses balance and recovers slowly.", es: "Cruzar los pies — se pierde el equilibrio y la reacción." },
      { en: "Standing up when tired — gives up leverage.", es: "Levantarse cuando se cansa — se pierde la palanca." },
      { en: "Flat-footed — slow to react to change of direction.", es: "Apoyo plano — lento para reaccionar al cambio de dirección." },
      { en: "Leaning too far forward — off balance.", es: "Inclinarse demasiado hacia delante — desequilibrio." },
    ],
    progression: [
      { en: "Stationary stance hold — 10 seconds.", es: "Postura estática aguantando — 10 segundos." },
      { en: "Slow slides — coach calls direction verbally.", es: "Deslizamientos lentos — el entrenador da dirección verbal." },
      { en: "Fast slides — coach uses hand signals.", es: "Deslizamientos rápidos — el entrenador usa señales con la mano." },
      { en: "30-second push — max effort.", es: "30 segundos al máximo esfuerzo." },
    ],
    order_index: 5,
  },
];

async function main() {
  console.log("Insertando drills en ec_drills...\n");
  for (const drill of DRILLS) {
    const { error } = await supabase.from("ec_drills").upsert(drill, { onConflict: "id" });
    if (error) console.error(`✗ ${drill.id}: ${error.message}`);
    else console.log(`✓ ${drill.id}`);
  }
  console.log("\nListo.");
}

main();
