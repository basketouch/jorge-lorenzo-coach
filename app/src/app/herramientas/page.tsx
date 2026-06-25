import { createClient } from "@/lib/supabase-server";
import Footer from "@/components/Footer";
import NavHamburger from "@/components/NavHamburger";
import WaitlistInline from "./WaitlistInline";
import "./herramientas.css";

export const metadata = {
  title: "Herramientas para entrenadores · Jorge Lorenzo",
  description:
    "Software profesional para entrenadores de baloncesto. Videoanálisis, estadísticas y análisis defensivo. Hecho por el cuerpo técnico de la Selección Española.",
  openGraph: {
    title: "Herramientas para entrenadores · Jorge Lorenzo",
    description: "Software profesional para entrenadores. Desde 8€/mes.",
  },
};

type Estado = "disponible" | "waitlist" | "proximamente";

interface Producto {
  id: string;
  nombre: string;
  plataforma: string;
  tagline: string;
  descripcion: string;
  /** Número grande — el argumento de venta principal */
  precio_destacado: string;
  /** Detalle pequeño debajo (precio total, facturación, planes...) */
  precio_nota: string;
  estado: Estado;
  cta_individual: { texto: string; url: string } | null;
  cta_equipos: { texto: string; url: string } | null;
  badge: string | null;
}

const productos: Producto[] = [
  {
    id: "drawsports",
    nombre: "DrawSports",
    plataforma: "iPad · App Store",
    tagline: "Convierte tu iPad en una sala de videoanálisis profesional.",
    descripcion:
      "Importa vídeo, marca cortes y dibuja sobre la jugada en tiempo real. La herramienta que usamos en Mundiales y Eurobaskets, ahora en tu iPad.",
    precio_destacado: "8,33€/mes",
    precio_nota: "99,99€ al año · pago único",
    estado: "disponible",
    cta_individual: {
      texto: "Descargar en App Store",
      url: "https://apps.apple.com/es/app/drawsports/id6756434573",
    },
    cta_equipos: {
      texto: "Licencias para equipos",
      url: "https://drawsports.app/pro/planes/",
    },
    badge: null,
  },
  {
    id: "cutsports",
    nombre: "CutSports",
    plataforma: "Mac",
    tagline: "DrawSports, ahora en tu Mac.",
    descripcion:
      "El mismo flujo de trabajo de videoanálisis que DrawSports, adaptado al escritorio. Ideal para preparar sesiones largas y exportar clips al equipo.",
    precio_destacado: "8,33€/mes",
    precio_nota: "99,99€ al año · pago único",
    estado: "proximamente",
    cta_individual: null,
    cta_equipos: null,
    badge: "Próximamente",
  },
  {
    id: "analyst",
    nombre: "The Analyst",
    plataforma: "Web · SaaS",
    tagline: "Box score y play-by-play para entrenadores que leen el juego.",
    descripcion:
      "Analiza estadísticas avanzadas de tus partidos. Desde el dato más simple hasta los patrones que cambian tu sistema defensivo.",
    precio_destacado: "Desde 29€/mes",
    precio_nota: "Planes: 29€ · 49€ · 79€/mes",
    estado: "waitlist",
    cta_individual: { texto: "Apuntarse a la lista de espera", url: "#" },
    cta_equipos: null,
    badge: "Lista de espera",
  },
  {
    id: "hustle",
    nombre: "Hustle Tracker",
    plataforma: "Web · App",
    tagline: "Mide el esfuerzo defensivo. Lo que el box score no te cuenta.",
    descripcion:
      "Herramienta de análisis del esfuerzo defensivo. Cuantifica lo que siempre has visto pero nunca has podido medir: cargas, recuperaciones, presión en bola.",
    precio_destacado: "29,99€/mes",
    precio_nota: "Sin permanencia",
    estado: "waitlist",
    cta_individual: { texto: "Apuntarse a la lista de espera", url: "#" },
    cta_equipos: null,
    badge: "Lista de espera",
  },
];

export default async function HerramientasPage() {
  const supabase = await createClient();
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    /* anónimo */
  }

  return (
    <>
      <nav>
        <a href="/" className="nav-logo">Jorge <span>Lorenzo</span></a>
        <div className="nav-links">
          <a href="#niveles" className="nav-link">Comunidad</a>
          <a href="/cursos/laboratorio-2526" className="nav-link">El Laboratorio</a>
          <a href="/drills" className="nav-link">Drill Lab</a>
          <a href="/herramientas" className="nav-link">Herramientas</a>
          <a href="/newsletter" className="nav-link">Newsletter</a>
          {user ? (
            <a href="/cuenta" className="nav-cta">Mi cuenta</a>
          ) : (
            <a href="/login" className="nav-cta">Iniciar sesión</a>
          )}
        </div>
        <NavHamburger links={[
          { label: "Comunidad", href: "/#niveles" },
          { label: "El Laboratorio", href: "/cursos/laboratorio-2526" },
          { label: "Drill Lab", href: "/drills" },
          { label: "Herramientas", href: "/herramientas" },
          { label: "Newsletter", href: "/newsletter" },
          ...(user ? [{ label: "Mi cuenta", href: "/cuenta" }] : []),
        ]} />
      </nav>

      <main className="herramientas-page" style={{ paddingTop: 80 }}>
        {/* HERO */}
        <section className="herramientas-hero">
          <p className="section-label" style={{ textAlign: "center" }}>Software para entrenadores</p>
          <h1 className="herramientas-h1">
            Las mismas herramientas.<br />
            <span className="herramientas-h1-accent">Al precio que toca.</span>
          </h1>
          <p className="herramientas-intro">
            Hecho por alguien que ha estado en un Mundial. Pensado para el entrenador
            que entrena el martes en un pabellón de barrio y quiere trabajar como la élite.
          </p>
        </section>

        {/* GRID DE PRODUCTOS */}
        <section className="herramientas-grid">
          {productos.map((p) => (
            <ProductoCard key={p.id} producto={p} />
          ))}
        </section>

        {/* GARANTÍA */}
        <section className="herramientas-garantia">
          <p className="herramientas-garantia-text">
            Si en 7 días no ves el valor, te devuelvo el dinero. Sin preguntas.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}

function ProductoCard({ producto: p }: { producto: Producto }) {
  return (
    <article className={`producto-card producto-card--${p.estado}`}>
      {p.badge && (
        <span className={`producto-badge producto-badge--${p.estado}`}>{p.badge}</span>
      )}

      <div className="producto-header">
        <div>
          <h2 className="producto-nombre">{p.nombre}</h2>
          <p className="producto-plataforma">{p.plataforma}</p>
        </div>
      </div>

      <p className="producto-tagline">{p.tagline}</p>
      <p className="producto-descripcion">{p.descripcion}</p>

      <div className="producto-precio-bloque">
        <span className="producto-precio-destacado">{p.precio_destacado}</span>
        <span className="producto-precio-nota">{p.precio_nota}</span>
      </div>

      {p.estado === "disponible" && (
        <div className="producto-ctas">
          {p.cta_individual && (
            <a href={p.cta_individual.url} className="producto-cta producto-cta--primary" target="_blank" rel="noopener noreferrer">
              {p.cta_individual.texto}
            </a>
          )}
          {p.cta_equipos && (
            <a href={p.cta_equipos.url} className="producto-cta producto-cta--secondary" target="_blank" rel="noopener noreferrer">
              {p.cta_equipos.texto}
            </a>
          )}
        </div>
      )}

      {p.estado === "waitlist" && p.cta_individual && (
        <div className="producto-ctas">
          <WaitlistInline productoId={p.id} ctaTexto={p.cta_individual.texto} />
        </div>
      )}

      {p.estado === "proximamente" && (
        <div className="producto-ctas">
          <span className="producto-cta producto-cta--disabled">Disponible pronto</span>
        </div>
      )}
    </article>
  );
}
