import { requireAdmin } from "@/lib/admin-guard";

export default async function AdminVentas() {
  const { admin } = await requireAdmin();

  const { data: compras } = await admin
    .from("compras")
    .select("*, cursos(titulo, slug), usuarios(nombre, apellido)")
    .order("created_at", { ascending: false });

  const total = compras?.length ?? 0;

  return (
    <>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--oro)", marginBottom: 8 }}>Admin</p>
      <h2 style={{ marginBottom: 8 }}>Ventas</h2>
      <p style={{ color: "var(--texto-suave)", fontSize: 14, marginBottom: 40 }}>
        {total} {total === 1 ? "acceso registrado" : "accesos registrados"} en total
      </p>

      <div style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--borde)", background: "rgba(255,255,255,0.02)" }}>
              {["Alumno", "Curso", "Pedido LS", "Fecha"].map((h) => (
                <th key={h} style={{
                  textAlign: "left", padding: "12px 20px",
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                  textTransform: "uppercase", color: "var(--texto-suave)",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compras?.map((compra) => {
              const nombre = compra.usuarios
                ? `${compra.usuarios.nombre ?? ""} ${compra.usuarios.apellido ?? ""}`.trim()
                : "—";
              const fecha = new Date(compra.created_at).toLocaleDateString("es-ES", {
                day: "2-digit", month: "short", year: "numeric",
              });

              return (
                <tr key={compra.id} style={{ borderBottom: "1px solid var(--borde)" }}>
                  <td style={{ padding: "14px 20px", color: "var(--blanco)", fontWeight: 500 }}>
                    {nombre || "—"}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{
                      fontSize: 12, padding: "3px 8px", borderRadius: 4,
                      background: "rgba(201,168,76,0.1)", color: "var(--oro)",
                      fontWeight: 600,
                    }}>
                      {compra.cursos?.titulo ?? compra.curso_id}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px", color: "var(--texto-suave)", fontFamily: "monospace", fontSize: 12 }}>
                    {compra.lemon_order_id ?? <span style={{ color: "var(--borde)" }}>acceso manual</span>}
                  </td>
                  <td style={{ padding: "14px 20px", color: "var(--texto-suave)" }}>
                    {fecha}
                  </td>
                </tr>
              );
            })}

            {(!compras || compras.length === 0) && (
              <tr>
                <td colSpan={4} style={{ padding: "40px 20px", textAlign: "center", color: "var(--texto-suave)" }}>
                  Aún no hay compras registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
