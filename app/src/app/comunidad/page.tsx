import { createAdminClient } from "@/lib/supabase-admin";
import Footer from "@/components/Footer";
import SiteNav from "@/components/SiteNav";
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

  const all = items ?? [];
  const stats = {
    total: all.length,
    lessons: all.filter((i) => i.content_type === "lesson").length,
    posts: all.filter((i) => i.content_type === "post").length,
    categories: new Set(all.map((i) => i.category).filter(Boolean)).size,
  };

  return (
    <>
      <SiteNav />

      <section style={{ paddingTop: 140, paddingBottom: 56, position: "relative", overflow: "hidden" }}>
        <div style={{
          content: "''", position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 70% 30%, rgba(201,168,76,0.08) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <p className="hero-eyebrow">Comunidad Jorge Lorenzo Coach</p>
          <h1 style={{
            fontSize: "clamp(36px, 5.5vw, 60px)", fontWeight: 800, lineHeight: 1.05,
            letterSpacing: "-0.02em", color: "var(--blanco)", marginBottom: 16, maxWidth: 760,
          }}>
            Todo lo que hemos publicado, <span style={{ color: "var(--oro)" }}>en un solo sitio.</span>
          </h1>
          <p className="hero-sub" style={{ marginBottom: 32, maxWidth: 620 }}>
            Busca por tema y encuentra el post o la lección exacta, aunque no recuerdes dónde estaba.
          </p>

          <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginBottom: 40 }}>
            {[
              [stats.total, "recursos"],
              [stats.lessons, "lecciones del Aula"],
              [stats.posts, "posts"],
              [stats.categories, "categorías"],
            ].map(([n, label]) => (
              <div key={label as string}>
                <p style={{ fontSize: 32, fontWeight: 800, color: "var(--oro)", lineHeight: 1 }}>{n}</p>
                <p style={{ fontSize: 13, color: "var(--texto-suave)", marginTop: 4 }}>{label}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 40 }}>
            {[
              {
                name: "Sergio Delgado Bidegaray",
                meta: "Sigue siendo miembro de pago después de 2 meses",
                text: "Experiencia súper recomendable, le he consultado a Jorge por diferentes razones y he tenido una respuesta inmediata, con video incluido. Demuestra su interés por ayudar y volcar toda su experiencia a quien le consulte. Esto me ha mejorado en el plan de partido para mi equipo.",
              },
              {
                name: "Vicente Navalon Fresneda",
                meta: "Sigue siendo miembro de pago después de 3 meses",
                text: "La verdad es que la comunidad es de gran ayuda para tod@s, es importante que sirva para cualquier nivel y se puedan aplicar las cosas en tu día a día, Jorge está pendiente de cualquier duda y aportando cada detalle, recomendable 100x100 para seguir mejorando.",
              },
              {
                name: "Egoitz Arizmendi",
                meta: "Sigue siendo miembro de pago después de 9 meses",
                text: "Llevo casi un año en la comunidad y me ha ayudado mucho. Cada vez que he tenido una consulta o alguna duda, me la ha resuelto al instante. Es como tener un profesor particular de primerísimo nivel a tu disposición. Además se nota que le apasiona y siempre trata de innovar y mejorar.",
              },
            ].map((r) => (
              <div key={r.name} style={{
                background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 10,
                padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%", background: "var(--oro)",
                    color: "var(--negro)", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 700, flexShrink: 0,
                  }}>
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>{r.name}</p>
                    <p style={{ fontSize: 12, color: "var(--oro)" }}>★★★★★</p>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "var(--texto-suave)", lineHeight: 1.6 }}>{r.text}</p>
                <p style={{ fontSize: 11, color: "var(--texto-suave)", opacity: 0.7 }}>{r.meta}</p>
              </div>
            ))}
          </div>

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

          <ComunidadClient items={all} />
        </div>
      </section>

      <Footer />
    </>
  );
}
