import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import StripeCheckoutButton from "@/components/StripeCheckoutButton";
import { createAdminClient } from "@/lib/supabase-admin";
import BlackFridayCountdown from "./BlackFridayCountdown";
import BlackFridayLeadVideo from "./BlackFridayLeadVideo";
import BlackFridayNotifyForm from "./BlackFridayNotifyForm";
import BlackFridayStickyBar from "./BlackFridayStickyBar";
import { BF_CLOSES_AT, BF_OPENS_AT, BF_PROMO_CODE, getBlackFridayPhase, type BlackFridayPhase } from "@/lib/black-friday";
import styles from "./page.module.css";

const phases: BlackFridayPhase[] = ["pre", "oferta", "cerrada"];

function resolvePhase(fase: string | undefined): BlackFridayPhase {
  // Fuera de producción se puede forzar una fase con ?fase=pre|oferta|cerrada para revisarla.
  const forced = process.env.VERCEL_ENV !== "production" ? phases.find((item) => item === fase) : undefined;
  return forced ?? getBlackFridayPhase();
}

const descriptions: Record<BlackFridayPhase, string> = {
  pre: "El archivo completo de la temporada para entrenadores: técnica, defensa, sistemas de ataque, scouting y planificación. Black Friday abre el viernes 27 de noviembre.",
  oferta: "El Laboratorio del Entrenador 25/26 completo por 119,99 € en lugar de 249,99 €, hasta el 30 de noviembre. Pago único y acceso de por vida.",
  cerrada: "El archivo completo de la temporada para entrenadores: técnica, defensa, sistemas de ataque, scouting y planificación. Pago único y acceso de por vida.",
};

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ fase?: string }> }): Promise<Metadata> {
  const { fase } = await searchParams;
  const description = descriptions[resolvePhase(fase)];
  const title = "El Laboratorio del Entrenador · Black Friday";
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: { type: "website", siteName: "Jorge Lorenzo Coach", locale: "es_ES", title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export const dynamic = "force-dynamic";

type Lesson = { id: number; titulo: string; orden: number; es_preview: boolean; video_id: string | null };
type Module = { id: number; titulo: string; orden: number; lecciones_curso: Lesson[] | null };

const checkoutMetadata = { slug: "laboratorio-2526", growth_project: "jorge_lorenzo_coach" };
const bunnyLibraryId = "667464";
// Ejemplos completos del header: dos lecciones del curso (ambas de la biblioteca de Bunny).
const exampleVideos = [
  { id: "f1bd43e2-2931-40dd-bd58-ab015c9d4091", title: "El pase · Técnica individual ofensiva" },
  { id: "d6446f73-61b6-4524-9464-e93f5187b13e", title: "Sistemas para tiradores · Sistemas de ataque" },
];
const leadVideoId = "5b6fa10c-20b4-440e-aba1-769c7371736a";

// Lo que se aplica después: sale de los módulos del curso.
const outcomes = [
  "Preparar a un rival con método: scouting colectivo e individual, plan de partido y puntos clave.",
  "Planificar tu semana de entrenamientos: del análisis del rival al planning y los ejercicios.",
  "Defender el bloqueo directo y construir tu sistema defensivo, del 1x1 a la defensa colectiva.",
  "Atacar con más espacio: spacing con 4 abiertos y 1 dentro, y sistemas para el P&R, tiradores, interiores y cortes.",
  "Mejorar a tus jugadores con pase, tiro, finalizaciones y bote, con ejercicios para llevar a pista.",
  "Gestionar el grupo: clases de vestuario, presión, liderazgo y cultura de esfuerzo.",
];
const fitYes = [
  "Entrenas a un equipo de baloncesto, de formación o de competición.",
  "Quieres ver cómo se prepara una temporada completa, del planteamiento al cierre.",
  "Prefieres un pago único y consultar el archivo cuando lo necesites.",
];
const fitNo = [
  "Buscas una suscripción con contenido nuevo cada semana: esto es el archivo de la temporada 25/26.",
  "Quieres un curso de baloncesto para jugadores, no para entrenadores.",
  "Esperas recetas cerradas, sin adaptarlas a tu equipo.",
];
// Palmarés: el mismo que la portada de jorgelorenzo.coach.
const palmares = [
  { icon: "🥇", title: "Campeón del Mundo", sub: "Beijing 2019" },
  { icon: "🥇", title: "Campeón de Europa", sub: "Berlín 2022" },
  { icon: "🏀", title: "JJOO 2021 · 2024", sub: "Tokyo · París" },
  { icon: "🏀", title: "Mundial 2023 · Eurobasket 2025", sub: "Jakarta · Chipre" },
];
const ctaStyle = { width: "100%", padding: "19px", fontSize: 17, fontWeight: 900, border: 0, borderRadius: 8, background: "#d8b33f", color: "#0a0a0a" } as const;
export default async function BlackFridayLaboratorio({ searchParams }: { searchParams: Promise<{ fase?: string }> }) {
  const { fase } = await searchParams;
  const phase = resolvePhase(fase);
  const { data: course } = await createAdminClient()
    .from("cursos")
    .select("titulo, portada_url, stripe_price_id, modulos(id, titulo, orden, lecciones_curso(id, titulo, orden, es_preview, video_id))")
    .eq("slug", "laboratorio-2526")
    .single();

  if (!course?.stripe_price_id) return null;

  const modules = ((course.modulos ?? []) as Module[]).sort((a, b) => a.orden - b.orden);
  // Una lección = un vídeo. Es la única fuente del número que se enseña en toda la página.
  const videoCount = modules.reduce((total, module) => total + (module.lecciones_curso?.length ?? 0), 0) || 51;
  const faqItems = [
    ...(phase === "oferta"
      ? [{ q: "¿Hasta cuándo está este precio?", a: "Hasta el lunes 30 de noviembre a las 23:59, hora de Madrid. Después, el Laboratorio vuelve a su precio habitual de 249,99 €." }]
      : phase === "pre"
        ? [{ q: "¿Cuándo abre Black Friday?", a: "El viernes 27 de noviembre a las 00:00, hora de Madrid, y se mantiene hasta el lunes 30 a las 23:59." }]
        : []),
    { q: "¿El acceso es permanente?", a: "Sí. Es un pago único, sin suscripción y sin caducidad. Lo ves en jorgelorenzo.coach las veces que quieras." },
    { q: "¿Necesito ser miembro de la comunidad de Skool?", a: "No es necesario. Lo compras aquí y accedes en jorgelorenzo.coach, sin ninguna suscripción. Aun así, te recomiendo unirte a la comunidad de entrenadores en Skool: es donde comparto el contenido de cada semana y donde puedes preguntar, compartir y aprender con otros entrenadores." },
    { q: "¿Qué incluye exactamente?", a: `${modules.length || 9} módulos, ${videoCount} vídeos y más de 23 horas: técnica individual, defensa, sistemas de ataque, spacing, planificación, scouting y el resumen de la temporada, con clases sobre vestuario, presión y liderazgo.` },
  ];
  return (
    <main className={`${styles.page} ${phase === "oferta" ? styles.hasSticky : ""}`}>
      <div className={styles.topbar}>
        <span>JORGE <strong>LORENZO</strong></span>
        <span>{phase === "pre" ? "BLACK FRIDAY · ABRE EL 27 NOV" : phase === "cerrada" ? "BLACK FRIDAY · FINALIZADO" : "BLACK FRIDAY · 27–30 NOV"}</span>
      </div>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>EL LABORATORIO DEL ENTRENADOR<span className={styles.eyebrowExtra}> · ARCHIVO 25/26</span></p>
          <h1>Todo el Laboratorio.<br /><em>Para siempre.</em></h1>
          <p className={styles.forWhom}>Para entrenadores que quieren llegar a cada sesión y a cada partido con las ideas claras.</p>
          <p className={styles.intro}>{videoCount} vídeos y más de 23 horas de baloncesto: técnica individual, defensa, sistemas de ataque, scouting y planificación, más las clases de vestuario, presión y liderazgo que no salen en la pizarra.</p>
          <p className={styles.credentials}><strong>Jorge Lorenzo</strong> · Campeón del Mundo 2019 y de Europa 2022 · Entrenador ayudante de la Selección Española 2017–2025</p>
          {phase === "oferta" ? (
            <>
              <div className={styles.offer}>
                <div><span>BLACK FRIDAY</span><p>Antes <s>249,99€</s></p><p className={styles.perHour}>Menos de 5,25 € por hora de contenido</p></div>
                <strong>119,99€</strong>
                <p className={styles.offerNote}>Descuento aplicado al abrir el pago</p>
              </div>
              <div className={`${styles.deadline} ${styles.heroDeadline} ${styles.deadlineMobile}`}><span>LA OFERTA CIERRA EN</span><BlackFridayCountdown target={BF_CLOSES_AT} /></div>
              <div className={styles.cta} id="bf-hero-cta">
                <StripeCheckoutButton priceId={course.stripe_price_id} promotionCode={BF_PROMO_CODE} metadata={checkoutMetadata} style={ctaStyle}>Quiero el Laboratorio completo →</StripeCheckoutButton>
                <p className={styles.checkoutNote}>Pago único · acceso de por vida · sin suscripción</p>
              </div>
            </>
          ) : phase === "pre" ? (
            <>
              <div className={`${styles.deadline} ${styles.heroDeadline} ${styles.deadlineMobile}`}><span>BLACK FRIDAY ABRE EN</span><BlackFridayCountdown target={BF_OPENS_AT} closedText="YA ABIERTO" /></div>
              <div className={`${styles.notify} ${styles.cta}`}>
                <p className={styles.notifyTitle}>Abre el viernes 27 de noviembre.</p>
                <p className={styles.notifyText}>Déjame tu email y serás de los primeros en saberlo.</p>
                <BlackFridayNotifyForm />
              </div>
            </>
          ) : (
            <div className={styles.cta}>
              <p className={styles.closedText}>La oferta de Black Friday ha terminado. El Laboratorio sigue disponible al precio habitual de 249,99€.</p>
              <Link href="/cursos/laboratorio-2526" className={styles.closedLink}>Ver el Laboratorio →</Link>
            </div>
          )}
        </div>

        <div className={styles.heroVisual}>
          {phase === "oferta" ? <div className={`${styles.deadline} ${styles.deadlineDesktop}`}><span>LA OFERTA CIERRA EN</span><BlackFridayCountdown target={BF_CLOSES_AT} /></div> : null}
          {phase === "pre" ? <div className={`${styles.deadline} ${styles.deadlineDesktop}`}><span>BLACK FRIDAY ABRE EN</span><BlackFridayCountdown target={BF_OPENS_AT} closedText="YA ABIERTO" /></div> : null}
          <p className={styles.videoLabel}>Mira estos ejemplos completos</p>
          <div className={styles.heroVideos}>
            {exampleVideos.map((video, index) => (
              <div className={styles.heroVideo} key={video.id}>
                <iframe
                  src={`https://iframe.mediadelivery.net/embed/${bunnyLibraryId}/${video.id}?autoplay=false&preload=${index === 0}&responsive=true&primaryColor=c9a84c&muted=false&loop=false&captions=false`}
                  title={video.title}
                  loading={index === 0 ? "eager" : "lazy"}
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen
                />
              </div>
            ))}
          </div>
          <div className={`${styles.stats} ${styles.videoStats}`}>
            <div><strong>{modules.length || 9}</strong><span>módulos</span></div>
            <div><strong>{videoCount}</strong><span>vídeos</span></div>
            <div><strong>23+</strong><span>horas</span></div>
            <div><strong>∞</strong><span>acceso de por vida</span></div>
          </div>
        </div>
      </section>

      <section className={styles.proof}>
        <p className={styles.sectionLabel}>NO ES UN CURSO SUELTO</p>
        <div className={styles.proofHeading}><h2>Es el archivo completo<br />del Laboratorio.</h2><p>Un lugar al que volver antes de una sesión, cuando preparas a un rival o cuando necesitas ordenar una idea.</p></div>
        <div className={styles.moduleGrid}>
          {modules.slice(0, 9).map((module, index) => <div className={styles.moduleCard} key={module.id}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{module.titulo}</strong><p>{module.lecciones_curso?.length ?? 0} lecciones</p></div></div>)}
        </div>
        {phase === "oferta" ? <BlackFridayLeadVideo libraryId={bunnyLibraryId} videoId={leadVideoId} /> : null}
      </section>

      <section className={styles.includes}>
        <div><p className={styles.sectionLabel}>LO QUE TE LLEVAS</p><h2>Material para aplicar.<br />No para acumular.</h2></div>
        <div className={styles.benefits}>
          {outcomes.map((text, index) => <p key={text}><b>{String(index + 1).padStart(2, "0")}</b><span>{text}</span></p>)}
        </div>
      </section>

      {phase === "oferta" ? (
        <section className={styles.midCta} id="bf-mid-cta">
          <div><strong>119,99€</strong><span>Antes 249,99€ · hasta el lunes 30 a las 23:59</span></div>
          <StripeCheckoutButton priceId={course.stripe_price_id} promotionCode={BF_PROMO_CODE} metadata={checkoutMetadata} style={{ ...ctaStyle, width: "auto", padding: "17px 28px" }}>Quiero el Laboratorio completo →</StripeCheckoutButton>
        </section>
      ) : null}

      <section className={styles.fit}>
        <p className={styles.sectionLabel}>¿ES PARA TI?</p>
        <div className={styles.fitGrid}>
          <div className={styles.fitYes}><h3>Es para ti si…</h3><ul>{fitYes.map((text) => <li key={text}>{text}</li>)}</ul></div>
          <div className={styles.fitNo}><h3>Quizá no lo es si…</h3><ul>{fitNo.map((text) => <li key={text}>{text}</li>)}</ul></div>
        </div>
      </section>

      <section className={styles.bio}>
        <div className={styles.bioPhoto}>
          <Image src="/fotos/Con Scariolo.png" alt="Jorge Lorenzo con Sergio Scariolo tras ganar el Eurobasket 2022" fill sizes="(max-width: 760px) 100vw, 420px" style={{ objectFit: "cover", objectPosition: "50% 35%" }} />
          <span>Con Sergio Scariolo · Eurobasket 2022</span>
        </div>
        <div className={styles.bioCopy}>
          <p className={styles.sectionLabel}>EL ENTRENADOR DETRÁS DEL LABORATORIO</p>
          <h2>Hola, soy Jorge Lorenzo.</h2>
          <p>Empecé a entrenar con 16 años. Nunca lo dejé. En 2025 cerré una etapa de casi una década como asistente de la Selección Española: dos Mundiales, dos Juegos Olímpicos, dos Eurobasket. Y cada semana sigo en la pista con mis equipos.</p>
          <p>El Laboratorio recoge lo que trabajé esta temporada, para que lo apliques en tu pista.</p>
          <div className={styles.palmares}>
            {palmares.map((item) => <div key={item.title}><span aria-hidden="true">{item.icon}</span><p><strong>{item.title}</strong><br />{item.sub}</p></div>)}
          </div>
        </div>
      </section>

      <section className={styles.faq}>
        <p className={styles.sectionLabel}>PREGUNTAS FRECUENTES</p>
        <div className={styles.faqList}>
          {faqItems.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}
        </div>
      </section>

      <section className={styles.finalCta} id="bf-final-cta">
        {phase === "oferta" ? (
          <>
            <p className={styles.sectionLabel}>BLACK FRIDAY · SOLO HASTA EL 30 DE NOVIEMBRE</p>
            <h2>El Laboratorio completo.<br /><em>119,99€.</em></h2>
            <StripeCheckoutButton priceId={course.stripe_price_id} promotionCode={BF_PROMO_CODE} metadata={checkoutMetadata} style={{ ...ctaStyle, width: "min(100%, 460px)" }}>Quiero acceder al archivo →</StripeCheckoutButton>
            <p className={styles.checkoutNote}>La promoción se aplica automáticamente en el pago.</p>
          </>
        ) : phase === "pre" ? (
          <>
            <p className={styles.sectionLabel}>BLACK FRIDAY · ABRE EL 27 DE NOVIEMBRE</p>
            <h2>El Laboratorio completo.<br /><em>Apúntate al aviso.</em></h2>
            <div className={styles.finalNotify}><BlackFridayNotifyForm /></div>
          </>
        ) : (
          <>
            <p className={styles.sectionLabel}>EL LABORATORIO DEL ENTRENADOR · ARCHIVO 25/26</p>
            <h2>El Laboratorio completo.<br /><em>Sigue disponible.</em></h2>
            <Link href="/cursos/laboratorio-2526" className={styles.closedLink}>Ver el Laboratorio →</Link>
          </>
        )}
      </section>

      <Footer />
      {phase === "oferta" ? <BlackFridayStickyBar priceId={course.stripe_price_id} promotionCode={BF_PROMO_CODE} metadata={checkoutMetadata} /> : null}
    </main>
  );
}
