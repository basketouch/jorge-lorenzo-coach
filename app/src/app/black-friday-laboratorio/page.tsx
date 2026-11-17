import type { Metadata } from "next";
import Link from "next/link";
import StripeCheckoutButton from "@/components/StripeCheckoutButton";
import { createAdminClient } from "@/lib/supabase-admin";
import BlackFridayCountdown from "./BlackFridayCountdown";
import BlackFridayLeadVideo from "./BlackFridayLeadVideo";
import BlackFridayNotifyForm from "./BlackFridayNotifyForm";
import { BF_CLOSES_AT, BF_OPENS_AT, BF_PROMO_CODE, getBlackFridayPhase, type BlackFridayPhase } from "@/lib/black-friday";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Black Friday · Laboratorio del Entrenador",
  robots: { index: false, follow: false },
};

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
const ctaStyle = { width: "100%", padding: "19px", fontSize: 17, fontWeight: 900, border: 0, borderRadius: 8, background: "#d8b33f", color: "#0a0a0a" } as const;
const phases: BlackFridayPhase[] = ["pre", "oferta", "cerrada"];

export default async function BlackFridayLaboratorio({ searchParams }: { searchParams: Promise<{ fase?: string }> }) {
  // Fuera de producción se puede forzar una fase con ?fase=pre|oferta|cerrada para revisarla.
  const { fase } = await searchParams;
  const forced = process.env.VERCEL_ENV !== "production" ? phases.find((item) => item === fase) : undefined;
  const phase = forced ?? getBlackFridayPhase();
  const { data: course } = await createAdminClient()
    .from("cursos")
    .select("titulo, portada_url, stripe_price_id, modulos(id, titulo, orden, lecciones_curso(id, titulo, orden, es_preview, video_id))")
    .eq("slug", "laboratorio-2526")
    .single();

  if (!course?.stripe_price_id) return null;

  const modules = ((course.modulos ?? []) as Module[]).sort((a, b) => a.orden - b.orden);
  // Una lección = un vídeo. Es la única fuente del número que se enseña en toda la página.
  const videoCount = modules.reduce((total, module) => total + (module.lecciones_curso?.length ?? 0), 0) || 51;
  return (
    <main className={styles.page}>
      <div className={styles.topbar}>
        <span>JORGE <strong>LORENZO</strong></span>
        <span>{phase === "pre" ? "BLACK FRIDAY · ABRE EL 27 NOV" : phase === "cerrada" ? "BLACK FRIDAY · FINALIZADO" : "BLACK FRIDAY · 27–30 NOV"}</span>
      </div>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>EL LABORATORIO DEL ENTRENADOR<span className={styles.eyebrowExtra}> · ARCHIVO 25/26</span></p>
          <h1>Todo el Laboratorio.<br /><em>Para siempre.</em></h1>
          <p className={styles.intro}>{videoCount} vídeos y más de 23 horas de baloncesto: técnica individual, defensa, sistemas de ataque, scouting y planificación, más las clases de vestuario, presión y liderazgo que no salen en la pizarra.</p>
          {phase === "oferta" ? (
            <>
              <div className={styles.offer}>
                <div><span>BLACK FRIDAY</span><p>Antes <s>249,99€</s></p></div>
                <strong>119,99€</strong>
                <p className={styles.offerNote}>Descuento aplicado al abrir el pago</p>
              </div>
              <div className={`${styles.deadline} ${styles.heroDeadline} ${styles.deadlineMobile}`}><span>LA OFERTA CIERRA EN</span><BlackFridayCountdown target={BF_CLOSES_AT} /></div>
              <div className={styles.cta}>
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
            {exampleVideos.map((video) => (
              <div className={styles.heroVideo} key={video.id}>
                <iframe
                  src={`https://iframe.mediadelivery.net/embed/${bunnyLibraryId}/${video.id}?autoplay=false&preload=true&responsive=true&primaryColor=c9a84c&muted=false&loop=false&captions=false`}
                  title={video.title}
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
          <p><b>01</b><span>Técnica individual, táctica colectiva y lectura del juego.</span></p>
          <p><b>02</b><span>Scouting, planificación y herramientas para el día a día.</span></p>
          <p><b>03</b><span>Acceso permanente al archivo de esta temporada.</span></p>
          <p><b>04</b><span>{videoCount} vídeos y más de 23 horas para consultar cuando las necesites.</span></p>
        </div>
      </section>

      <section className={styles.finalCta}>
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
    </main>
  );
}
