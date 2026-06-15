import { requireAdmin } from "@/lib/admin-guard";

export default async function AdminDashboard() {
  const { admin } = await requireAdmin();

  const [
    { count: totalUsuarios },
    { count: totalCompras },
    { count: accesosHoy },
    { count: visualizacionesSemana },
    { count: leccionesCompletadas },
    { count: bdlAcceso },
    { count: bdlTrial },
    { data: topDrills },
  ] = await Promise.all([
    admin.from("usuarios").select("*", { count: "exact", head: true }).eq("is_admin", false),
    admin.from("compras").select("*", { count: "exact", head: true }),
    admin.from("accesos").select("*", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - 86400000).toISOString()),
    admin.from("visualizaciones").select("*", { count: "exact", head: true })
      .gte("visto_el", new Date(Date.now() - 7 * 86400000).toISOString()),
    admin.from("progreso").select("*", { count: "exact", head: true }).eq("completada", true),
    admin.from("usuarios").select("*", { count: "exact", head: true }).eq("bdl_acceso", true).eq("is_admin", false),
    admin.from("usuarios").select("*", { count: "exact", head: true }).not("bdl_trial_start", "is", null).eq("bdl_acceso", true).eq("is_admin", false),
    admin.from("bdl_user_drill_views").select("drill_id, bdl_drills(title_es)").limit(500),
  ]);

  // Top drills más vistos
  const drillCount: Record<string, { title: string; count: number }> = {};
  for (const row of topDrills ?? []) {
    const id = row.drill_id;
    const title = (row.bdl_drills as any)?.title_es ?? id;
    if (!drillCount[id]) drillCount[id] = { title, count: 0 };
    drillCount[id].count++;
  }
  const topDrillsList = Object.values(drillCount).sort((a, b) => b.count - a.count).slice(0, 10);

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

      {/* DRILL LAB */}
      <div style={{ marginTop: 48 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--oro)", marginBottom: 16 }}>Drill Lab</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16, marginBottom: 32 }}>
          <div style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 10, padding: 24 }}>
            <p style={{ fontSize: 12, color: "var(--texto-suave)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>Con acceso</p>
            <p style={{ fontSize: 36, fontWeight: 800, color: "var(--blanco)", lineHeight: 1 }}>{bdlAcceso ?? 0}</p>
            <p style={{ fontSize: 12, color: "var(--texto-suave)", marginTop: 6 }}>usuarios activos</p>
          </div>
          <div style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 10, padding: 24 }}>
            <p style={{ fontSize: 12, color: "var(--texto-suave)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>En trial</p>
            <p style={{ fontSize: 36, fontWeight: 800, color: "var(--oro)", lineHeight: 1 }}>{bdlTrial ?? 0}</p>
            <p style={{ fontSize: 12, color: "var(--texto-suave)", marginTop: 6 }}>prueba activa</p>
          </div>
        </div>

        {topDrillsList.length > 0 && (
          <div style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 10, padding: 24 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--texto-suave)", marginBottom: 20 }}>Top drills más vistos</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {topDrillsList.map((drill, i) => (
                <div key={drill.title} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--oro)", minWidth: 20, textAlign: "right" }}>{i + 1}</span>
                  <div style={{ flex: 1, background: "var(--oscuro)", borderRadius: 4, height: 6, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: "var(--oro)", width: `${Math.round((drill.count / (topDrillsList[0]?.count || 1)) * 100)}%` }} />
                  </div>
                  <span style={{ fontSize: 13, color: "var(--texto)", minWidth: 180 }}>{drill.title}</span>
                  <span style={{ fontSize: 12, color: "var(--texto-suave)", minWidth: 40, textAlign: "right" }}>{drill.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
