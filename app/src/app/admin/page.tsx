import { requireAdmin } from "@/lib/admin-guard";

export default async function AdminDashboard() {
  const { admin } = await requireAdmin();

  const [
    { count: totalUsuarios },
    { count: totalCompras },
    { count: accesosHoy },
    { count: visualizacionesSemana },
    { count: leccionesCompletadas },
  ] = await Promise.all([
    admin.from("usuarios").select("*", { count: "exact", head: true }).eq("is_admin", false),
    admin.from("compras").select("*", { count: "exact", head: true }),
    admin.from("accesos").select("*", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - 86400000).toISOString()),
    admin.from("visualizaciones").select("*", { count: "exact", head: true })
      .gte("visto_el", new Date(Date.now() - 7 * 86400000).toISOString()),
    admin.from("progreso").select("*", { count: "exact", head: true }).eq("completada", true),
  ]);

  const stats = [
    { label: "Alumnos", valor: totalUsuarios ?? 0, sub: "usuarios activos" },
    { label: "Matrículas", valor: totalCompras ?? 0, sub: "accesos a cursos" },
    { label: "Accesos hoy", valor: accesosHoy ?? 0, sub: "últimas 24h" },
    { label: "Visualizaciones", valor: visualizacionesSemana ?? 0, sub: "últimos 7 días" },
    { label: "Completadas", valor: leccionesCompletadas ?? 0, sub: "lecciones marcadas" },
  ];

  return (
    <>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--oro)", marginBottom: 8 }}>Panel Admin</p>
      <h2 style={{ marginBottom: 40 }}>Dashboard</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
        {stats.map(({ label, valor, sub }) => (
          <div key={label} style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 10, padding: 24 }}>
            <p style={{ fontSize: 12, color: "var(--texto-suave)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
            <p style={{ fontSize: 36, fontWeight: 800, color: "var(--blanco)", lineHeight: 1 }}>{valor}</p>
            <p style={{ fontSize: 12, color: "var(--texto-suave)", marginTop: 6 }}>{sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 32 }}>
        <a href="/admin/usuarios" style={{ textDecoration: "none" }}>
          <div style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 10, padding: 28, cursor: "pointer" }}>
            <p style={{ fontSize: 20, marginBottom: 8 }}>👥</p>
            <p style={{ fontWeight: 700, color: "var(--blanco)", marginBottom: 4 }}>Gestionar usuarios</p>
            <p style={{ fontSize: 13, color: "var(--texto-suave)" }}>Ver actividad, dar y revocar acceso a cursos.</p>
          </div>
        </a>
        <a href="/admin/cursos" style={{ textDecoration: "none" }}>
          <div style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 10, padding: 28, cursor: "pointer" }}>
            <p style={{ fontSize: 20, marginBottom: 8 }}>📚</p>
            <p style={{ fontWeight: 700, color: "var(--blanco)", marginBottom: 4 }}>Gestionar contenido</p>
            <p style={{ fontSize: 13, color: "var(--texto-suave)" }}>Editar lecciones, añadir módulos y vídeos de Vimeo.</p>
          </div>
        </a>
      </div>
    </>
  );
}
