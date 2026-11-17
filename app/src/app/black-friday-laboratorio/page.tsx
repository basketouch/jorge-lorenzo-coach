import type { Metadata } from "next";
import StripeCheckoutButton from "@/components/StripeCheckoutButton";
import { createAdminClient } from "@/lib/supabase-admin";
import BlackFridayCountdown from "./BlackFridayCountdown";
import BlackFridayLeadVideo from "./BlackFridayLeadVideo";
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
const publicVideoId = "f1bd43e2-2931-40dd-bd58-ab015c9d4091";
const leadVideoId = "5b6fa10c-20b4-440e-aba1-769c7371736a";

export default async function BlackFridayLaboratorio() {
  const { data: course } = await createAdminClient()
    .from("cursos")
    .select("titulo, portada_url, stripe_price_id, modulos(id, titulo, orden, lecciones_curso(id, titulo, orden, es_preview, video_id))")
    .eq("slug", "laboratorio-2526")
    .single();

  if (!course?.stripe_price_id) return null;

  const modules = ((course.modulos ?? []) as Module[]).sort((a, b) => a.orden - b.orden);
  const totalLessons = modules.reduce((total, module) => total + (module.lecciones_curso?.length ?? 0), 0);
  return (
    <main className={styles.page}>
      <div className={styles.topbar}>
        <span>JORGE <strong>LORENZO</strong></span>
        <span>BLACK FRIDAY · 27–30 NOV</span>
      </div>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>EL LABORATORIO DEL ENTRENADOR · ARCHIVO 25/26</p>
          <h1>Todo el Laboratorio.<br /><em>Para siempre.</em></h1>
          <p className={styles.intro}>El archivo completo para entrenadores que quieren llevar sus sesiones, su lectura del juego y su metodología a otro nivel.</p>
          <div className={styles.stats}>
            <div><strong>{modules.length || 9}</strong><span>módulos</span></div>
            <div><strong>{totalLessons || 51}</strong><span>lecciones</span></div>
            <div><strong>∞</strong><span>acceso</span></div>
          </div>
          <div className={styles.offer}>
            <div><span>BLACK FRIDAY</span><p>Antes <s>347€</s></p></div>
            <strong>99,99€</strong>
            <p className={styles.offerNote}>Descuento aplicado al abrir el pago</p>
          </div>
          <StripeCheckoutButton priceId={course.stripe_price_id} promotionCode="BLACKFRIDAY26" metadata={checkoutMetadata} style={{ width: "100%", padding: "19px", fontSize: 17, fontWeight: 900, border: 0, borderRadius: 8, background: "#d8b33f", color: "#0a0a0a" }}>Acceder al Laboratorio por 99,99€ →</StripeCheckoutButton>
          <p className={styles.checkoutNote}>Pago único · acceso permanente · sin suscripción</p>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.deadline}><span>LA OFERTA CIERRA EN</span><BlackFridayCountdown /></div>
          <div className={styles.heroVideo}>
            <iframe
              src={`https://iframe.mediadelivery.net/embed/${bunnyLibraryId}/${publicVideoId}?autoplay=false&preload=true&responsive=true&primaryColor=c9a84c&muted=false&loop=false&captions=false`}
              title="El Laboratorio del Entrenador"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen
            />
          </div>
          <div className={styles.visualCaption}><span>EL LABORATORIO POR DENTRO</span><p>Partidos, detalles y situaciones reales de entrenamiento.</p></div>
        </div>
      </section>

      <section className={styles.proof}>
        <p className={styles.sectionLabel}>NO ES UN CURSO SUELTO</p>
        <div className={styles.proofHeading}><h2>Es el archivo completo<br />del Laboratorio.</h2><p>Un lugar al que volver antes de una sesión, cuando preparas a un rival o cuando necesitas ordenar una idea.</p></div>
        <div className={styles.moduleGrid}>
          {modules.slice(0, 6).map((module, index) => <div className={styles.moduleCard} key={module.id}><span>0{index + 1}</span><div><strong>{module.titulo}</strong><p>{module.lecciones_curso?.length ?? 0} lecciones</p></div></div>)}
        </div>
        <BlackFridayLeadVideo libraryId={bunnyLibraryId} videoId={leadVideoId} />
      </section>

      <section className={styles.includes}>
        <div><p className={styles.sectionLabel}>LO QUE TE LLEVAS</p><h2>Material para aplicar.<br />No para acumular.</h2></div>
        <div className={styles.benefits}>
          <p><b>01</b><span>Técnica individual, táctica colectiva y lectura del juego.</span></p>
          <p><b>02</b><span>Scouting, planificación y herramientas para el día a día.</span></p>
          <p><b>03</b><span>Acceso permanente al archivo de esta temporada.</span></p>
          <p><b>04</b><span>51 lecciones en vídeo para consultar cuando las necesites.</span></p>
        </div>
      </section>

      <section className={styles.finalCta}>
        <p className={styles.sectionLabel}>BLACK FRIDAY · SOLO HASTA EL 30 DE NOVIEMBRE</p>
        <h2>El Laboratorio completo.<br /><em>99,99€.</em></h2>
        <StripeCheckoutButton priceId={course.stripe_price_id} promotionCode="BLACKFRIDAY26" metadata={checkoutMetadata} style={{ width: "min(100%, 460px)", padding: "19px", fontSize: 17, fontWeight: 900, border: 0, borderRadius: 8, background: "#d8b33f", color: "#0a0a0a" }}>Quiero acceder al archivo →</StripeCheckoutButton>
        <p className={styles.checkoutNote}>La promoción se aplica automáticamente en el pago.</p>
      </section>
    </main>
  );
}
