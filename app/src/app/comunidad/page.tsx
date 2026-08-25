import { createAdminClient } from "@/lib/supabase-admin";
import Footer from "@/components/Footer";
import NavHamburger from "@/components/NavHamburger";
import ComunidadClient from "./ComunidadClient";

export const metadata = {
  title: "Contenidos de la Comunidad — Jorge Lorenzo",
  description: "Busca entre los posts y lecciones de la comunidad Jorge Lorenzo Coach.",
  openGraph: {
    type: "website",
    siteName: "Jorge Lorenzo Coach",
    locale: "es_ES",
    title: "Contenidos de la Comunidad — Jorge Lorenzo Coach",
    description: "Busca entre todo lo publicado en la comunidad: posts y lecciones del Aula, con resumen y acceso directo.",
    images: [{ url: "/fotos/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contenidos de la Comunidad — Jorge Lorenzo Coach",
    description: "Busca entre todo lo publicado en la comunidad: posts y lecciones del Aula.",
    images: ["/fotos/og-image.jpg"],
  },
};

export default async function ComunidadPage() {
  const admin = createAdminClient();

  const { data: items } = await admin
    .from("community_items")
    .select("id, content_type, title, public_teaser, category, source_url, thumbnail_url, published_at, tags")
    .not("status", "in", "(excluded,archived)")
    .order("published_at", { ascending: false });

  return (
    <>
      <nav>
        <a href="/" className="nav-logo">Jorge <span>Lorenzo</span></a>
        <div className="nav-links">
          <a href="/cuenta" className="nav-link">Mi cuenta</a>
          <a href="https://www.skool.com/jorge-lorenzo-coach/plans" target="_blank" rel="noopener noreferrer" className="nav-cta">Comunidad</a>
        </div>
        <NavHamburger links={[
          { label: "Mi cuenta", href: "/cuenta" },
          { label: "Drill Lab", href: "/drills" },
          { label: "Comunidad", href: "https://www.skool.com/jorge-lorenzo-coach/plans" },
        ]} />
      </nav>

      <section style={{ paddingTop: 120, paddingBottom: 80 }}>
        <div className="container">
          <p className="section-label">Contenidos</p>
          <h2 style={{ marginBottom: 8 }}>Busca en la comunidad.</h2>
          <p className="lead" style={{ marginBottom: 24, maxWidth: 640 }}>
            Todo lo que hemos publicado en la comunidad Jorge Lorenzo Coach — posts y lecciones del Aula —
            en un único buscador, para que encuentres algo aunque no recuerdes dónde estaba.
          </p>

          <div style={{
            display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 36,
            background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 8,
            padding: "18px 24px",
          }}>
            {[
              ["🔍", "Busca o filtra", "por palabra, tipo de contenido o categoría"],
              ["👀", "Mira el resumen", "para saber de qué trata sin verlo entero"],
              ["🎓", "Ábrelo en Skool", "el contenido completo está dentro de la comunidad"],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ display: "flex", gap: 12, alignItems: "flex-start", flex: "1 1 200px" }}>
                <span style={{ fontSize: 20 }}>{icon}</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{title}</p>
                  <p style={{ fontSize: 13, color: "var(--texto-suave)" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <ComunidadClient items={items ?? []} />
        </div>
      </section>

      <Footer />
    </>
  );
}
