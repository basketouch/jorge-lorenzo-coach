import { createAdminClient } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";
import Footer from "@/components/Footer";
import DrillsClient from "./DrillsClient";
import SiteNav from "@/components/SiteNav";

export const metadata = {
  title: "Biblioteca de Ejercicios — Jorge Lorenzo",
  description: "169 ejercicios de baloncesto organizados por capítulo, categoría y nivel. Acceso para la comunidad de entrenadores.",
};

export default async function DrillsPage() {
  const admin = createAdminClient();
  const supabase = await createClient();

  let user = null;
  try { const { data } = await supabase.auth.getUser(); user = data.user; } catch {}

  // Cargar todos los drills (campos públicos)
  const { data: drills } = await admin
    .from("bdl_drills")
    .select("drill_id, slug, chapter, chapter_order, global_order, chapter_title_es, title_es, category_es, level, tags, objective_short_es, primary_figure_id, access_level")
    .order("global_order");

  // Si hay usuario, cargar sus vistas y nivel de acceso
  let userViews: string[] = [];
  let userAccessLevel = "anonymous";

  if (user) {
    userAccessLevel = "free";
    const [{ data: views }, { data: access }] = await Promise.all([
      admin.from("bdl_user_drill_views").select("drill_id").eq("user_id", user.id),
      admin.from("bdl_user_access").select("access_level").eq("user_id", user.id).single(),
    ]);
    userViews = (views ?? []).map((v: any) => v.drill_id);
    if (access?.access_level === "member") userAccessLevel = "member";
  }

  const FREE_QUOTA = 5;
  const viewsUsed = userViews.length;

  return (
    <>
      <SiteNav />

      <section style={{ paddingTop: 120, paddingBottom: 80 }}>
        <div className="container">
          <p className="section-label">Biblioteca</p>
          <h2 style={{ marginBottom: 8 }}>169 ejercicios de baloncesto.</h2>
          <p className="lead" style={{ marginBottom: 8 }}>
            Organizados por capítulo, categoría y nivel. Con contexto real de aplicación en pista.
          </p>

          {/* Estado de acceso */}
          {userAccessLevel === "anonymous" && (
            <div style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 8, padding: "16px 20px", marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <p style={{ fontSize: 14, color: "var(--texto-suave)" }}>
                Regístrate gratis para acceder a 5 ejercicios completos.
              </p>
              <a href="/login" className="nav-cta" style={{ fontSize: 13, padding: "8px 16px" }}>Registrarse gratis</a>
            </div>
          )}

          {userAccessLevel === "free" && (
            <div style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 8, padding: "16px 20px", marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <p style={{ fontSize: 14, color: "var(--texto-suave)" }}>
                {viewsUsed < FREE_QUOTA
                  ? `Tienes ${FREE_QUOTA - viewsUsed} ejercicio${FREE_QUOTA - viewsUsed !== 1 ? "s" : ""} gratuito${FREE_QUOTA - viewsUsed !== 1 ? "s" : ""} disponible${FREE_QUOTA - viewsUsed !== 1 ? "s" : ""}.`
                  : "Has alcanzado el límite de 5 ejercicios gratuitos."}
              </p>
              {viewsUsed >= FREE_QUOTA && (
                <a href="https://www.skool.com/jorge-lorenzo-coach/plans" target="_blank" rel="noopener noreferrer" className="nav-cta" style={{ fontSize: 13, padding: "8px 16px" }}>Únete a la comunidad</a>
              )}
            </div>
          )}

          {userAccessLevel === "member" && (
            <div style={{ background: "rgba(201,168,76,0.08)", border: "1px solid var(--oro)", borderRadius: 8, padding: "12px 20px", marginBottom: 32 }}>
              <p style={{ fontSize: 14, color: "var(--oro)" }}>✓ Acceso completo — miembro de la comunidad.</p>
            </div>
          )}

          <DrillsClient
            drills={drills ?? []}
            userAccessLevel={userAccessLevel}
            userViews={userViews}
            freeQuota={FREE_QUOTA}
          />
        </div>
      </section>

      <Footer />
    </>
  );
}
