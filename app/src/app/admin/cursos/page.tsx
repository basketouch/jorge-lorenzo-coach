import { requireAdmin } from "@/lib/admin-guard";
import AddCursoForm from "./AddCursoForm";

export default async function AdminCursos() {
  const { admin } = await requireAdmin();

  const { data: cursos } = await admin
    .from("cursos")
    .select("id, slug, titulo, descripcion, portada_url, activo, modulos(id)")
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
        {cursos?.map((curso) => {
          const numModulos = curso.modulos?.length ?? 0;

          return (
            <a
              key={curso.id}
              href={`/admin/cursos/${curso.id}`}
              style={{
                display: "block", background: "var(--card)", border: "1px solid var(--borde)",
                borderRadius: 10, overflow: "hidden", textDecoration: "none", transition: "border-color 0.15s",
              }}
            >
              <div style={{
                height: 120, background: curso.portada_url ? `url(${curso.portada_url}) center/cover` : "var(--negro)",
                display: "flex", alignItems: "flex-start", justifyContent: "flex-end", padding: 12,
              }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 4,
                  background: curso.activo ? "rgba(74,170,100,0.15)" : "rgba(200,80,80,0.15)",
                  color: curso.activo ? "#4aa" : "#e06",
                  border: `1px solid ${curso.activo ? "#4aa" : "#e06"}`,
                }}>
                  {curso.activo ? "Activo" : "Inactivo"}
                </span>
              </div>
              <div style={{ padding: 20 }}>
                <h3 style={{ fontSize: 17, color: "var(--blanco)", marginBottom: 6 }}>{curso.titulo}</h3>
                <p style={{ fontSize: 12, color: "var(--texto-suave)", marginBottom: 10 }}>
                  slug: <code style={{ color: "var(--oro)" }}>{curso.slug}</code>
                </p>
                <p style={{ fontSize: 13, color: "var(--texto-suave)" }}>{numModulos} módulos</p>
              </div>
            </a>
          );
        })}
      </div>
    </>
  );
}
