import { requireAdmin } from "@/lib/admin-guard";
import { notFound } from "next/navigation";
import AddLeccionForm from "../AddLeccionForm";
import AddModuloForm from "../AddModuloForm";
import CursoEditor from "../CursoEditor";
import LeccionesOrdenables from "../LeccionesOrdenables";
import ModuloEditor from "../ModuloEditor";
import ModuloTitulo from "../ModuloTitulo";
import EliminarCurso from "./EliminarCurso";
import ImportarTemario from "./ImportarTemario";

export default async function AdminCursoDetalle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { admin } = await requireAdmin();

  const { data: curso } = await admin
    .from("cursos")
    .select("*, modulos(*, lecciones_curso(*))")
    .eq("id", id)
    .single();

  if (!curso) notFound();

  const modulos = [...(curso.modulos ?? [])].sort((a, b) => a.orden - b.orden);

  return (
    <>
      <div style={{ marginBottom: 32 }}>
        <a href="/admin/cursos" style={{ fontSize: 13, color: "var(--texto-suave)", textDecoration: "none" }}>
          ← Todos los cursos
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 20, paddingBottom: 20, borderBottom: "2px solid var(--oro)" }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 24, color: "var(--blanco)", marginBottom: 4 }}>{curso.titulo}</h2>
            <p style={{ fontSize: 13, color: "var(--texto-suave)" }}>
              slug: <code style={{ color: "var(--oro)" }}>{curso.slug}</code> ·{" "}
              {modulos.length} módulos
            </p>
          </div>
          <a
            href={`/cursos/${curso.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 6,
              border: "1px solid var(--borde)", color: "var(--texto-suave)",
              textDecoration: "none", whiteSpace: "nowrap",
            }}
          >
            ↗ Ver curso
          </a>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 4,
            background: curso.activo ? "rgba(74,170,100,0.1)" : "rgba(200,80,80,0.1)",
            color: curso.activo ? "#4aa" : "#e06",
            border: `1px solid ${curso.activo ? "#4aa" : "#e06"}`,
          }}>
            {curso.activo ? "Activo" : "Inactivo"}
          </span>
          <EliminarCurso cursoId={curso.id} titulo={curso.titulo} />
        </div>
      </div>

      <CursoEditor curso={{
        id: curso.id,
        slug: curso.slug,
        titulo: curso.titulo,
        descripcion: curso.descripcion,
        precio: curso.precio,
        stripe_price_id: curso.stripe_price_id,
        en_venta: curso.en_venta,
        activo: curso.activo,
        portada_url: curso.portada_url,
        descripcion_larga: curso.descripcion_larga,
        duracion_texto: curso.duracion_texto,
        para_quien: curso.para_quien,
        lo_que_trabajamos: curso.lo_que_trabajamos,
        videos_preview: curso.videos_preview,
        skool_precio: curso.skool_precio,
        skool_precio_original: curso.skool_precio_original,
        skool_url: curso.skool_url,
        web_precio: curso.web_precio,
        web_precio_original: curso.web_precio_original,
        fecha_apertura_texto: curso.fecha_apertura_texto,
        fecha_apertura: curso.fecha_apertura,
        fecha_cierre: curso.fecha_cierre,
      }} />

      <ImportarTemario cursoId={curso.id} nextOrdenModulo={modulos.length + 1} />

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {modulos.map((modulo) => {
          const lecciones = [...(modulo.lecciones_curso ?? [])].sort((a, b) => a.orden - b.orden);

          return (
            <div key={modulo.id} style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 8, padding: 20 }}>
              <ModuloTitulo id={modulo.id} orden={modulo.orden} titulo={modulo.titulo} />

              <LeccionesOrdenables lecciones={lecciones} cursoSlug={curso.slug} />

              <AddLeccionForm moduloId={modulo.id} nextOrden={lecciones.length + 1} />
              <ModuloEditor modulo={{
                id: modulo.id,
                titulo: modulo.titulo,
                orden: modulo.orden,
                fecha_apertura: modulo.fecha_apertura,
                fecha_cierre_venta: modulo.fecha_cierre_venta,
                precio: modulo.precio,
                stripe_price_id: modulo.stripe_price_id,
                portada_url: modulo.portada_url,
              }} />
            </div>
          );
        })}

        <AddModuloForm cursoId={curso.id} nextOrden={modulos.length + 1} />
      </div>
    </>
  );
}
