/**
 * Actualiza las traducciones ES mejoradas en ec_concepts
 */
import { createClient } from "/Users/jorgelorenzo/Desktop/jorge-lorenzo-coach/app/node_modules/@supabase/supabase-js/dist/index.mjs";

const SUPABASE_URL = "https://otsbpiukzftacmvmkajy.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const UPDATES = [
  { en: "Wing",              es: "Jugador exterior / alero" },
  { en: "Trailer",           es: "Jugador que llega de segunda oleada" },
  { en: "Screen",            es: "Bloqueo / pantalla" },
  { en: "Hand-off",          es: "Mano a mano" },
  { en: "Kick-out",          es: "Pase de descarga al exterior" },
  { en: "Spacing",           es: "Espaciado / ocupar bien los espacios" },
  { en: "Post up",           es: "Postear / jugar de espaldas" },
  { en: "Close out",         es: "Salir a puntear / cerrar al tirador" },
  { en: "Box out",           es: "Cerrar el rebote" },
  { en: "Switch",            es: "Cambio defensivo" },
  { en: "Hedge",             es: "Mostrar / saltar al bloqueo" },
  { en: "Drop coverage",     es: "Defensa en drop / quedarse atrás en el bloqueo" },
  { en: "Deny",              es: "Negar el pase" },
  { en: "Contest the shot",  es: "Puntear / disputar el tiro" },
  { en: "Trap",              es: "Dos contra uno / trampa" },
  { en: "Stance",            es: "Postura defensiva" },
  { en: "Elbow",             es: "El codo de la zona" },
  { en: "Top of the key",    es: "Frontal / parte alta de la zona" },
  { en: "The wing",          es: "El ala / posición de 45º" },
  { en: "Scrimmage",         es: "Partidillo / situación de juego" },
  { en: "Catch",             es: "Recibir" },
  { en: "Square up",         es: "Cuadrarse / encarar el aro" },
  { en: "Stay on your toes", es: "Mantente activo sobre las puntas" },
  { en: "Slide",             es: "Deslizarse en defensa" },
  { en: "Talk!",             es: "¡Hablad / comunicaos!" },
  { en: "Hustle!",           es: "¡A tope / con intensidad!" },
  { en: "Bring it in!",      es: "¡Todos aquí! / piña" },
  { en: "Bring it in, hands in.", es: "Piña, manos al centro." },
];

async function main() {
  let ok = 0, fail = 0;
  for (const { en, es } of UPDATES) {
    const { error } = await supabase
      .from("ec_concepts")
      .update({ es })
      .eq("en", en)
      .is("user_id", null);
    if (error) { console.error(`✗ ${en}: ${error.message}`); fail++; }
    else { console.log(`✓ ${en}`); ok++; }
  }
  console.log(`\n✓ ${ok} actualizados · ✗ ${fail} errores`);
}

main();
