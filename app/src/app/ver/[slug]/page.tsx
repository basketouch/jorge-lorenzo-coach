import Image from "next/image";
import { createClient } from "@/lib/supabase-server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import ModuloAccordion from "./ModuloAccordion";
import NavBar from "@/components/NavBar";

export default async function PlayerIndex({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=/ver/${slug}`);

  const { data: curso } = await supabase
    .from("cursos")
    .select("*, modulos(id, titulo, orden, lecciones_curso(id, titulo, duracion, orden, es_preview))")
    .eq("slug", slug)
    .single();

  if (!curso) notFound();

  const { data: acceso } = await supabase.rpc("tiene_acceso", { p_curso_id: curso.id });

  // También dejamos pasar si tiene acceso a al menos un módulo del curso
  let tieneAccesoModulo = false;
  if (!acceso) {
    const { data: modAcceso } = await supabase
      .from("accesos_modulo")
      .select("modulo_id")
      .eq("user_id", user.id)
      .in("modulo_id", (curso.modulos ?? []).map((m: { id: number }) => m.id))
      .limit(1);
    tieneAccesoModulo = !!(modAcceso && modAcceso.length > 0);
  }

  if (!acceso && !tieneAccesoModulo) redirect(`/cursos/${slug}`);

  const { data: progresos } = await supabase
    .from("progreso")
    .select("leccion_id, completada")
    .eq("user_id", user.id);

  const modulos = curso.modulos?.sort((a: { orden: number }, b: { orden: number }) => a.orden - b.orden);
  const primeraLeccion = modulos?.[0]?.lecciones_curso?.sort((a: { orden: number }, b: { orden: number }) => a.orden - b.orden)[0];

  return (
    <>
      <NavBar logoHref="/cuenta" links={[{ label: "← Mis cursos", href: "/cuenta" }]} />

      <div style={{ paddingTop: 80, minHeight: "100vh" }}>
        {/* Banner del curso */}
        {curso.portada_url && (
          <div style={{ position: "relative", width: "100%", height: 280, overflow: "hidden" }}>
            <Image src={curso.portada_url} alt={curso.titulo} fill priority
              style={{ objectFit: "cover", objectPosition: "center 30%" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.85) 100%)" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 32px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--oro)", marginBottom: 6 }}>Curso · Temporada 2025/26</p>
              <h2 style={{ fontSize: "clamp(20px, 3vw, 32px)", marginBottom: 0 }}>{curso.titulo}</h2>
            </div>
          </div>
        )}

        <div className="container" style={{ paddingTop: 40 }}>
          {!curso.portada_url && <h2 style={{ marginBottom: 8 }}>{curso.titulo}</h2>}
          {primeraLeccion && (
            <Link href={`/ver/${slug}/${primeraLeccion.id}`} className="btn-primary" style={{ display: "inline-block", marginBottom: 40 }}>
              Empezar →
            </Link>
          )}

          <ModuloAccordion
            modulos={modulos ?? []}
            slug={slug}
            completadas={progresos?.filter((p) => p.completada).map((p) => p.leccion_id) ?? []}
          />
        </div>
      </div>
    </>
  );
}
