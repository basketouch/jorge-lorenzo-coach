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

  // Las estadísticas de cabecera deben reflejar lo real en Skool, no lo que
  // Jorge decide ocultar en la biblioteca (status "excluded"). Solo se
  // excluye "archived" (contenido que ya no existe en Skool). La lista de
  // tarjetas sí respeta el ocultado editorial.
  const [{ data: items }, { data: realItems }] = await Promise.all([
    admin
      .from("community_items")
      .select("id, content_type, title, public_teaser, category, source_url, thumbnail_url, published_at, tags")
      .not("status", "in", "(excluded,archived)")
      .order("published_at", { ascending: false }),
    admin
      .from("community_items")
      .select("content_type, category")
      .not("status", "eq", "archived"),
  ]);

  const all = items ?? [];
  const realAll = realItems ?? [];
  const stats = {
    total: realAll.length,
    lessons: realAll.filter((i) => i.content_type === "lesson").length,
    posts: realAll.filter((i) => i.content_type === "post").length,
    categories: new Set(realAll.map((i) => i.category).filter(Boolean)).size,
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
