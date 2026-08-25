import { createAdminClient } from "@/lib/supabase-admin";
import Footer from "@/components/Footer";
import NavHamburger from "@/components/NavHamburger";
import ComunidadClient from "./ComunidadClient";

export const metadata = {
  title: "Biblioteca de la Comunidad — Jorge Lorenzo",
  description: "Busca entre los posts y lecciones de la comunidad Jorge Lorenzo Coach.",
};

export default async function ComunidadPage() {
  const admin = createAdminClient();

  const { data: items } = await admin
    .from("community_items")
    .select("id, content_type, title, category, source_url, published_at, tags")
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
          <p className="section-label">Biblioteca</p>
          <h2 style={{ marginBottom: 8 }}>Busca en la comunidad.</h2>
          <p className="lead" style={{ marginBottom: 32 }}>
            Posts y lecciones de la comunidad Jorge Lorenzo Coach. El contenido completo se abre en Skool.
          </p>

          <ComunidadClient items={items ?? []} />
        </div>
      </section>

      <Footer />
    </>
  );
}
