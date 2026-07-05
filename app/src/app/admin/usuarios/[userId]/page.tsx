import { requireAdmin } from "@/lib/admin-guard";
import { notFound } from "next/navigation";
import AccesoToggle from "../AccesoToggle";
import AccesoModuloToggle from "./AccesoModuloToggle";
import EliminarUsuario from "./EliminarUsuario";
import EnviarEmailUsuario from "./EnviarEmailUsuario";

function formatFecha(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function UsuarioPerfil({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const { admin } = await requireAdmin();

  const [
    { data: usuario },
    { data: cursos },
    { data: modulos },
    { data: compras },
    { data: accesoModulos },
    { data: progreso },
    { data: accesos },
  ] = await Promise.all([
    admin.from("usuarios").select("*").eq("id", userId).single(),
    admin.from("cursos").select("id, slug, titulo, activo").order("id"),
    admin.from("modulos").select("id, titulo, orden, curso_id").order("orden"),
    admin.from("compras").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    admin.from("accesos_modulo").select("modulo_id").eq("user_id", userId),
    admin.from("progreso").select("leccion_id, completada").eq("user_id", userId),
    admin.from("accesos").select("created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(1),
  ]);

  if (!usuario) notFound();

  const completadas = progreso?.filter((p) => p.completada).length ?? 0;
  const total = progreso?.length ?? 0;
  const accesoModuloIds = new Set(accesoModulos?.map((a) => a.modulo_id) ?? []);

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <a href="/admin/usuarios" style={{ fontSize: 13, color: "var(--texto-suave)", textDecoration: "none" }}>
          ← Todos los usuarios
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 20 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "var(--oro)", color: "var(--negro)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 800, flexShrink: 0,
          }}>
            {(usuario.nombre?.[0] ?? "?").toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ marginBottom: 4 }}>{usuario.nombre} {usuario.apellido}</h2>
            <p style={{ color: "var(--texto-suave)", fontSize: 14 }}>{usuario.email ?? "—"}</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {usuario.email && (
              <EnviarEmailUsuario
                email={usuario.email}
                nombre={`${usuario.nombre} ${usuario.apellido ?? ""}`.trim()}
              />
            )}
            <EliminarUsuario userId={userId} nombre={`${usuario.nombre} ${usuario.apellido}`} />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

        {/* Info */}
        <div style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 10, padding: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--oro)", marginBottom: 16 }}>
            Información
          </p>
          {[
            { label: "Email", valor: usuario.email ?? "—" },
            { label: "Último acceso", valor: formatFecha(accesos?.[0]?.created_at) },
            { label: "Progreso", valor: `${completadas} / ${total} lecciones completadas` },
          ].map(({ label, valor }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--borde)" }}>
              <span style={{ fontSize: 13, color: "var(--texto-suave)" }}>{label}</span>
              <span style={{ fontSize: 13, color: "var(--texto)", fontWeight: 600 }}>{valor}</span>
            </div>
          ))}
        </div>

        {/* Pagos */}
        <div style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 10, padding: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--oro)", marginBottom: 16 }}>
            Pagos
          </p>
          {compras && compras.length > 0 ? compras.filter((c) => cursos?.some((cur) => cur.id === c.curso_id)).map((c) => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--borde)" }}>
              <div>
                <p style={{ fontSize: 13, color: "var(--texto)", fontWeight: 600 }}>
                  {cursos?.find((cur) => cur.id === c.curso_id)?.titulo ?? "—"}
                </p>
                <p style={{ fontSize: 11, color: "var(--texto-suave)", marginTop: 2 }}>
                  {c.paddle_transaction_id?.startsWith("admin-") ? "Acceso manual" : `Orden: ${c.paddle_transaction_id}`}
                </p>
              </div>
              <span style={{ fontSize: 12, color: "var(--texto-suave)", flexShrink: 0 }}>{formatFecha(c.created_at)}</span>
            </div>
          )) : (
            <p style={{ fontSize: 13, color: "var(--texto-suave)" }}>Sin pagos registrados.</p>
          )}
        </div>

        {/* Acceso a cursos + historial */}
        {cursos?.map((curso) => {
          const comprasCurso = compras?.filter((c) => c.curso_id === curso.id) ?? [];
          const tieneAcceso = comprasCurso.length > 0;
          const modulosCurso = modulos?.filter((m) => m.curso_id === curso.id) ?? [];

          return (
            <div key={curso.id} style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 10, padding: 24, gridColumn: "1 / -1" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--oro)", marginBottom: 4 }}>
                    {curso.activo ? "Curso activo" : "Próximo curso"}
                  </p>
                  <h3 style={{ fontSize: 15, fontWeight: 700 }}>{curso.titulo}</h3>
                </div>
                <AccesoToggle userId={userId} cursoId={curso.id} cursoSlug={curso.slug} tieneAcceso={tieneAcceso} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div>
                  <p style={{ fontSize: 11, color: "var(--texto-suave)", fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Historial de compras
                  </p>
                  {comprasCurso.length > 0 ? comprasCurso.map((c) => (
                    <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--borde)" }}>
                      <p style={{ fontSize: 12, color: "var(--texto-suave)" }}>
                        {c.paddle_transaction_id?.startsWith("admin-") ? "Acceso manual" : `Orden: ${c.paddle_transaction_id}`}
                      </p>
                      <span style={{ fontSize: 12, color: "var(--texto-suave)" }}>{formatFecha(c.created_at)}</span>
                    </div>
                  )) : (
                    <p style={{ fontSize: 13, color: "var(--texto-suave)" }}>Sin compras.</p>
                  )}
                </div>

                <div>
                  <p style={{ fontSize: 11, color: "var(--texto-suave)", fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Acceso por módulo
                  </p>
                  {modulosCurso.length > 0 ? modulosCurso.map((m) => (
                    <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--borde)" }}>
                      <span style={{ fontSize: 12, color: "var(--texto-suave)" }}>
                        <span style={{ color: "var(--oro)", fontWeight: 700, marginRight: 6 }}>{String(m.orden).padStart(2, "0")}.</span>
                        {m.titulo}
                      </span>
                      <AccesoModuloToggle userId={userId} moduloId={m.id} tieneAcceso={accesoModuloIds.has(m.id)} />
                    </div>
                  )) : (
                    <p style={{ fontSize: 13, color: "var(--texto-suave)" }}>Sin módulos.</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

      </div>
    </>
  );
}
