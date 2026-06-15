import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";
import Footer from "@/components/Footer";
import DrillContent from "./DrillContent";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const admin = createAdminClient();
  const { data } = await admin.from("bdl_drills").select("title_es, objective_short_es").eq("slug", slug).single();
  if (!data) return { title: "Ejercicio — Jorge Lorenzo" };
  return {
    title: `${data.title_es} — Jorge Lorenzo`,
    description: data.objective_short_es ?? "",
  };
}

export default async function DrillPage({ params }: Props) {
  const { slug } = await params;
  const admin = createAdminClient();
  const supabase = await createClient();

  // Cargar drill completo
  const { data: drill } = await admin
    .from("bdl_drills")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!drill) notFound();

  // Cargar figura principal
  const { data: figures } = await admin
    .from("bdl_drill_figures")
    .select("*")
    .eq("drill_id", drill.drill_id)
    .order("role");

  // Sesión del usuario
  let user = null;
  try { const { data } = await supabase.auth.getUser(); user = data.user; } catch {}

  const FREE_QUOTA = 5;
  let access: "anonymous" | "preview_only" | "full" | "quota_reached" = "anonymous";
  let signedImageUrl: string | null = null;

  if (user) {
    // Nivel de acceso del usuario
    const { data: userAccess } = await admin
      .from("bdl_user_access")
      .select("access_level")
      .eq("user_id", user.id)
      .single();

    if (userAccess?.access_level === "member") {
      access = "full";
    } else {
      // Comprobar si ya vio este drill
      const { data: viewed } = await admin
        .from("bdl_user_drill_views")
        .select("drill_id")
        .eq("user_id", user.id)
        .eq("drill_id", drill.drill_id)
        .single();

      if (viewed) {
        access = "full"; // ya lo vio antes → acceso siempre
      } else {
        // Contar vistas totales
        const { count } = await admin
          .from("bdl_user_drill_views")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        if ((count ?? 0) < FREE_QUOTA) {
          // Tiene cuota disponible → dar acceso y registrar vista
          access = "full";
          await admin.from("bdl_user_drill_views").insert({
            user_id: user.id,
            drill_id: drill.drill_id,
          });
        } else {
          access = "quota_reached";
        }
      }
    }
  }

  // Generar URL firmada de imagen solo si tiene acceso completo
  if (access === "full" && figures && figures.length > 0) {
    const mainFig = figures.find(f => f.role === "main") ?? figures[0];
    if (mainFig?.storage_path) {
      try {
        const { data: signed } = await admin.storage
          .from("bdl-figures")
          .createSignedUrl(mainFig.storage_path, 3600);
        signedImageUrl = signed?.signedUrl ?? null;
      } catch {}
    }
  }

  // Drill anterior / siguiente
  const { data: adjacent } = await admin
    .from("bdl_drills")
    .select("slug, title_es, title_en, global_order")
    .in("global_order", [drill.global_order - 1, drill.global_order + 1]);

  const prev = adjacent?.find(d => d.global_order === drill.global_order - 1) ?? null;
  const next = adjacent?.find(d => d.global_order === drill.global_order + 1) ?? null;

  return (
    <>
      <nav>
        <a href="/" className="nav-logo">Jorge <span>Lorenzo</span></a>
        <div className="nav-links">
          <a href="/cuenta" className="nav-link">Mi cuenta</a>
          <a href="https://www.skool.com/jorge-lorenzo-coach/plans" target="_blank" rel="noopener noreferrer" className="nav-cta">Comunidad</a>
        </div>
      </nav>

      <section style={{ paddingTop: 120, paddingBottom: 80 }}>
        <div className="container">
          {/* Breadcrumb */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 32, fontSize: 13, color: "var(--texto-suave)" }}>
            <a href="/drills" style={{ color: "var(--texto-suave)", textDecoration: "none" }}>Ejercicios</a>
            <span>›</span>
            <span>Cap. {drill.chapter} — {drill.chapter_title_es}</span>
          </div>

          <DrillContent
            drill={drill}
            access={access}
            signedImageUrl={signedImageUrl}
            prev={prev}
            next={next}
          />
        </div>
      </section>

      <Footer />
    </>
  );
}
