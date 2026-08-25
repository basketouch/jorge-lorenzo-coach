// Uso: node scripts/skool-login.mjs
// Abre una ventana real de Chromium en tu Mac. Inicia sesión a mano en Skool
// (email/contraseña o Google) con tu cuenta de siempre. El script detecta solo
// cuándo ya has entrado a la comunidad y guarda la sesión en
// scripts/.skool-session.json (nunca se sube a git; está en .gitignore).
// skool-scrape.mjs reutiliza ese archivo para no pedirte credenciales cada vez.

import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SESSION_PATH = path.join(__dirname, '.skool-session.json');
const GROUP = 'jorge-lorenzo-coach';

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext();
const page = await context.newPage();
await page.goto('https://www.skool.com/login');

console.log('\nInicia sesión en la ventana que se ha abierto, con tu cuenta habitual.');
console.log(`Esperando a que llegues a la comunidad ${GROUP}... (hasta 10 minutos)\n`);

const deadline = Date.now() + 10 * 60 * 1000;
let loggedIn = false;
while (Date.now() < deadline) {
  const url = page.url();
  if (url.includes(`/${GROUP}`) && !url.includes('/login')) {
    loggedIn = true;
    break;
  }
  await page.waitForTimeout(2000);
}

if (!loggedIn) {
  console.error('No se detectó el login a tiempo. Vuelve a ejecutar el script cuando puedas completarlo.');
  await browser.close();
  process.exit(1);
}

// margen para que terminen de cargar las cookies de sesión
await page.waitForTimeout(2000);
await context.storageState({ path: SESSION_PATH });
console.log(`Sesión guardada en ${SESSION_PATH}`);
console.log('Ya puedes cerrar esta ventana. A partir de ahora, skool-scrape.mjs puede correr sin ti.');

await browser.close();
