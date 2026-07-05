import { createAdminClient } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";
import Footer from "@/components/Footer";
import CursosGrid from "./CursosGrid";
import NavHamburger from "@/components/NavHamburger";

export const metadata = { title: "Cursos — Jorge Lorenzo" };

export default async function CursosPage() {
  const admin = createAdminClient();
  const supabase = await createClient();
  const ahora = new Date().toISOString();

  let user = null;
  try { const { data } = await supabase.auth.getUser(); user = data.user; } catch {}

  const [{ data: cursos }, { data: modulosEnVenta }] = await Promise.all([
    admin.from("cursos").select("*").eq("activo", true).order("created_at"),
    admin.from("modulos")
      .select("id, titulo, portada_url, precio, fecha_apertura, fecha_cierre_venta, paddle_price_id, cursos(slug)")
      .lte("fecha_apertura", ahora)
      .or(`fecha_cierre_venta.is.null,fecha_cierre_venta.gte.${ahora}`),
  ]);

  let drillLabAccess: "anonymous" | "free" | "member" = "anonymous";
  let drillViewsUsed = 0;
  if (user) {
    drillLabAccess = "free";
    const [{ data: access }, { count }] = await Promise.all([
      admin.from("bdl_user_access").select("access_level").eq("user_id", user.id).single(),
      admin.from("bdl_user_drill_views").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    ]);
    if (access?.access_level === "member") drillLabAccess = "member";
    drillViewsUsed = count ?? 0;
  }

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
          { label: "English Coach", href: "/english" },
          { label: "Comunidad", href: "https://www.skool.com/jorge-lorenzo-coach/plans" },
        ]} />
      </nav>

      <section style={{ paddingTop: 140 }}>
        <div className="container">
          <p className="section-label">Formación</p>
          <h2>Cursos de Jorge Lorenzo.</h2>
          <p className="lead">Formación en profundidad sobre técnica, táctica y gestión de equipo.</p>

          <CursosGrid
            cursos={cursos ?? []}
            modulosEnVenta={(modulosEnVenta ?? []) as any}
            drillLabAccess={drillLabAccess}
            drillViewsUsed={drillViewsUsed}
          />
        </div>
      </section>

      <Footer />
    </>
  );
}
