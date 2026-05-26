import { requireAdmin } from "@/lib/admin-guard";
import CrearUsuario from "./CrearUsuario";
import QuickEmailBtn from "./QuickEmailBtn";

export default async function AdminUsuarios() {
  const { admin } = await requireAdmin();

  const { data: usuarios } = await admin
    .from("usuarios")
    .select("id, nombre, apellido, email, is_admin")
    .eq("is_admin", false)
    .order("nombre");

  if (!usuarios) return <p>Error cargando datos.</p>;

  const userIds = usuarios.map((u) => u.id);

  const [{ data: accesos }, { data: progresos }] = await Promise.all([
    admin.from("accesos").select("user_id, created_at").in("user_id", userIds).order("created_at", { ascending: false }),
    admin.from("progreso").select("user_id, completada").in("user_id", userIds),
  ]);

  const ultimoAccesoMap = new Map<string, string>();
  accesos?.forEach((a) => {
    if (!ultimoAccesoMap.has(a.user_id)) ultimoAccesoMap.set(a.user_id, a.created_at);
  });

  function formatFecha(iso?: string) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
  }

  return (
    <>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--oro)", marginBottom: 8 }}>Admin</p>
      <h2 style={{ marginBottom: 8 }}>Usuarios</h2>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <p style={{ color: "var(--texto-suave)" }}>{usuarios.length} alumnos registrados</p>
        <div style={{ display: "flex", gap: 10 }}>
          <a
            href="/api/admin/export-usuarios"
            style={{
              fontSize: 12, fontWeight: 600, padding: "7px 16px", borderRadius: 6,
              border: "1px solid var(--borde)", color: "var(--texto-suave)",
              textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
            }}
          >
            ↓ Exportar CSV
          </a>
          <CrearUsuario />
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--borde)" }}>
              {["Nombre", "Email", "Último acceso", "Lecciones", ""].map((h) => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--texto-suave)", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => {
              const completadas = progresos?.filter((pr) => pr.user_id === u.id && pr.completada).length ?? 0;
              const total = progresos?.filter((pr) => pr.user_id === u.id).length ?? 0;

              return (
                <tr key={u.id} style={{ borderBottom: "1px solid var(--borde)" }}>
                  <td style={{ padding: "14px 16px", fontWeight: 600, whiteSpace: "nowrap" }}>
                    <a href={`/admin/usuarios/${u.id}`} style={{ color: "var(--texto)", textDecoration: "none" }}>
                      {u.nombre || "—"} {u.apellido} →
                    </a>
                  </td>
                  <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                    {u.email
                      ? <span style={{ color: "var(--texto-suave)" }}>{u.email}</span>
                      : <span style={{ fontSize: 11, color: "#e06", border: "1px solid #e0666655", borderRadius: 4, padding: "2px 8px" }}>sin email</span>
                    }
                  </td>
                  <td style={{ padding: "14px 16px", color: "var(--texto-suave)", whiteSpace: "nowrap" }}>
                    {formatFecha(ultimoAccesoMap.get(u.id))}
                  </td>
                  <td style={{ padding: "14px 16px", color: "var(--texto-suave)", whiteSpace: "nowrap" }}>
                    {completadas}/{total}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    {u.email && (
                      <QuickEmailBtn
                        email={u.email}
                        nombre={`${u.nombre ?? ""} ${u.apellido ?? ""}`.trim()}
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
