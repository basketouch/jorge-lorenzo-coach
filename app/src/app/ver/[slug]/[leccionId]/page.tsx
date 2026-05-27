import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import MarcarCompletada from "./MarcarCompletada";
import SidebarModulos from "./SidebarModulos";
import { NavBarPlayer } from "@/components/NavBar";
import PlayerLayout from "./PlayerLayout";

export default async function PlayerLeccion({
  params,
}: {
  params: Promise<{ slug: string; leccionId: string }>;
}) {
  const { slug, leccionId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=/ver/${slug}/${leccionId}`);

  const { data: curso } = await supabase
    .from("cursos")
    .select("id, titulo, modulos(id, titulo, orden, lecciones_curso(id, titulo, orden, video_id, duracion, es_preview))")
    .eq("slug", slug)
    .single();

  if (!curso) notFound();

  // Aplanar primero para identificar la lección antes de verificar acceso
  const todasLecciones = curso.modulos
    ?.sort((a: { orden: number }, b: { orden: number }) => a.orden - b.orden)
    .flatMap((m: { lecciones_curso: { id: number; orden: number }[] }) =>
      m.lecciones_curso.sort((a, b) => a.orden - b.orden)
    ) ?? [];

  const idx = todasLecciones.findIndex((l: { id: number }) => l.id === parseInt(leccionId));
  const leccion = todasLecciones[idx] as unknown as { id: number; titulo: string; video_id?: string; duracion?: string; es_preview: boolean } | undefined;
  if (!leccion) notFound();

  const { data: acceso } = await supabase.rpc("tiene_acceso", { p_curso_id: curso.id });

  // Módulos con acceso individual
  let modulosAccesibles: number[] = [];
  let tieneAccesoModulo = false;

  if (!acceso && !leccion.es_preview) {
    const moduloDeLeccion = curso.modulos?.find((m: { lecciones_curso: { id: number }[] }) =>
      m.lecciones_curso.some((l) => l.id === parseInt(leccionId))
    );
    if (moduloDeLeccion) {
      const { data } = await supabase.rpc("tiene_acceso_modulo", { p_modulo_id: moduloDeLeccion.id });
      tieneAccesoModulo = !!data;
    }
    if (!tieneAccesoModulo) redirect(`/cursos/${slug}`);

    // Obtener todos los módulos accesibles individualmente para el sidebar
    const todosModulos = curso.modulos ?? [];
    const checks = await Promise.all(
      todosModulos.map(async (m: { id: number }) => {
        const { data } = await supabase.rpc("tiene_acceso_modulo", { p_modulo_id: m.id });
        return data ? m.id : null;
      })
    );
    modulosAccesibles = checks.filter((id): id is number => id !== null);
  }

  const anterior = todasLecciones[idx - 1] as { id: number } | undefined;
  const siguiente = todasLecciones[idx + 1] as { id: number } | undefined;

  const { data: progreso } = await supabase
    .from("progreso")
    .select("completada")
    .eq("user_id", user.id)
    .eq("leccion_id", leccion.id)
    .single();

  // Registrar visualización (en background, no bloquea el render)
  void createAdminClient()
    .from("visualizaciones")
    .insert({ user_id: user.id, leccion_id: leccion.id });

  // Progreso de todas las lecciones para el sidebar
  const { data: todoProgreso } = await supabase
    .from("progreso")
    .select("leccion_id, completada")
    .eq("user_id", user.id);

  const completadasIds = new Set(todoProgreso?.filter((p) => p.completada).map((p) => p.leccion_id) ?? []);

  const playerContent = (
    <>
      {leccion.video_id ? (
        <div style={{ position: "relative", paddingBottom: "56.25%", background: "#000" }}>
          <iframe
            src={`https://iframe.mediadelivery.net/embed/${process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID}/${leccion.video_id}?autoplay=false&preload=true&responsive=true&primaryColor=c9a84c&muted=false&loop=false&captions=false`}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div style={{ aspectRatio: "16/9", background: "var(--card)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "var(--texto-suave)" }}>Vídeo próximamente</p>
        </div>
      )}
      <div className="player-info">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: "clamp(18px, 3vw, 28px)", marginBottom: 4 }}>{leccion.titulo}</h2>
            {leccion.duracion && <p style={{ fontSize: 13, color: "var(--texto-suave)" }}>{leccion.duracion}</p>}
          </div>
          <MarcarCompletada leccionId={leccion.id} completada={!!progreso?.completada} siguienteId={siguiente?.id} slug={slug} />
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {anterior && <Link href={`/ver/${slug}/${anterior.id}`} className="btn-secondary" style={{ fontSize: 13 }}>← Anterior</Link>}
          {siguiente && <Link href={`/ver/${slug}/${siguiente.id}`} className="btn-primary" style={{ fontSize: 13 }}>Siguiente →</Link>}
        </div>
      </div>
    </>
  );

  return (
    <PlayerLayout
      header={<NavBarPlayer slug={slug} cursoTitulo={curso.titulo} />}
      sidebar={
        <SidebarModulos
          modulos={curso.modulos ?? []}
          slug={slug}
          leccionActivaId={leccion.id}
          completadasIds={[...completadasIds]}
          cursoTitulo={curso.titulo}
          modulosAccesibles={modulosAccesibles.length > 0 ? modulosAccesibles : undefined}
        />
      }
      player={playerContent}
    />
  );
}
