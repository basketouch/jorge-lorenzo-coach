import { requireAdmin } from "@/lib/admin-guard";
import LeccionesOrdenables from "./LeccionesOrdenables";
import AddLeccionForm from "./AddLeccionForm";
import AddModuloForm from "./AddModuloForm";
import AddCursoForm from "./AddCursoForm";
import CursoEditor from "./CursoEditor";
import ModuloEditor from "./ModuloEditor";
import ModuloTitulo from "./ModuloTitulo";

export default async function AdminCursos() {
  const { admin } = await requireAdmin();

  const { data: cursos } = await admin
    .from("cursos")
    .select("*, modulos(*, lecciones_curso(*))")
    .order("id");

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--oro)", marginBottom: 8 }}>Admin</p>
          <h2>Contenido</h2>
        </div>
        <AddCursoForm />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
        {cursos?.map((curso) => {
          const modulos = [...(curso.modulos ?? [])].sort((a, b) => a.orden - b.orden);

          return (
            <div key={curso.id}>
              {/* Cabecera del curso */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, paddingBottom: 16, borderBottom: "2px solid var(--oro)" }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 20, color: "var(--blanco)", marginBottom: 4 }}>{curso.titulo}</h3>
                  <p style={{ fontSize: 13, color: "var(--texto-suave)" }}>
                    slug: <code style={{ color: "var(--oro)" }}>{curso.slug}</code> ·{" "}
                    {modulos.length} módulos
                  </p>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 4,
                  background: curso.activo ? "rgba(74,170,100,0.1)" : "rgba(200,80,80,0.1)",
                  color: curso.activo ? "#4aa" : "#e06",
                  border: `1px solid ${curso.activo ? "#4aa" : "#e06"}`,
                }}>
                  {curso.activo ? "Activo" : "Inactivo"}
                </span>
              </div>

              {/* Editor completo del curso */}
              <CursoEditor curso={{
                id: curso.id,
                slug: curso.slug,
                titulo: curso.titulo,
                descripcion: curso.descripcion,
                precio: curso.precio,
                lemon_variant_id: curso.lemon_variant_id,
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

              {/* Módulos */}
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
                        lemon_variant_id: modulo.lemon_variant_id,
                        portada_url: modulo.portada_url,
                      }} />
                    </div>
                  );
                })}

                <AddModuloForm cursoId={curso.id} nextOrden={modulos.length + 1} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
