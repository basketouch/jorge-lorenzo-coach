import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import Footer from "@/components/Footer";
import { redirect } from "next/navigation";
import Link from "next/link";
import EditarPerfil from "./EditarPerfil";
import CambiarContrasena from "./CambiarContrasena";
import NavBar from "@/components/NavBar";

export const metadata = { title: "Mi cuenta — Jorge Lorenzo" };

export default async function CuentaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const [{ data: compras }, { data: perfil }, { data: accesoModulos }, { data: bdlAccess }, { count: bdlViews }] = await Promise.all([
    supabase.from("compras").select("*, cursos(slug, titulo, portada_url)").eq("user_id", user.id),
    supabase.from("usuarios").select("nombre, apellido, is_admin").eq("id", user.id).single(),
    admin.from("accesos_modulo").select("modulo_id, modulos(id, titulo, portada_url)").eq("user_id", user.id),
    admin.from("bdl_user_access").select("access_level").eq("user_id", user.id).single(),
    admin.from("bdl_user_drill_views").select("*", { count: "exact", head: true }).eq("user_id", user.id),
  ]);

  const FREE_QUOTA = 5;
  const drillLabAccess = bdlAccess?.access_level === "member" ? "member" : "free";
  const drillViewsUsed = bdlViews ?? 0;

  const nombre = perfil?.nombre ? `${perfil.nombre}${perfil.apellido ? ` ${perfil.apellido}` : ""}` : null;

  return (
    <>
      <NavBar
        links={[
          { label: "Cursos", href: "/cursos" },
          ...(perfil?.is_admin ? [{ label: "Admin", href: "/admin" }] : []),
        ]}
        mostrarSalir
      />

      {/* HERO PRIVADO */}
      <div style={{
        position: "relative", overflow: "hidden",
        background: "var(--oscuro)", borderBottom: "1px solid var(--borde)",
        paddingTop: 64,
      }}>
        {/* Imagen de fondo difuminada */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: `url(https://otsbpiukzftacmvmkajy.supabase.co/storage/v1/object/public/portadas/Court.png)`,
          backgroundSize: "cover", backgroundPosition: "center top",
          opacity: 0.12, filter: "blur(2px)",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,10,0.3), var(--oscuro))", zIndex: 1 }} />

        <div className="container" style={{ position: "relative", zIndex: 2, paddingTop: 48, paddingBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* Avatar inicial */}
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--oro), #a07830)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 800, color: "var(--negro)", flexShrink: 0,
            }}>
              {nombre ? nombre[0].toUpperCase() : user.email![0].toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--oro)", marginBottom: 4 }}>
                Accede a tus datos
              </p>
              <h2 style={{ fontSize: "clamp(20px, 3vw, 32px)", marginBottom: 2 }}>
                {nombre ? `Hola, ${perfil!.nombre}.` : "Bienvenido."}
              </h2>
              <p style={{ fontSize: 14, color: "var(--texto-suave)" }}>{user.email}</p>
            </div>
          </div>

          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 8 }}>
            <EditarPerfil
              userId={user.id}
              nombreInicial={perfil?.nombre ?? ""}
              apellidoInicial={perfil?.apellido ?? ""}
            />
            <CambiarContrasena />
          </div>
        </div>
      </div>

      {/* CURSOS */}
      <section style={{ paddingTop: 48, paddingBottom: 80 }}>
        <div className="container">
          <p className="section-label">Mis cursos</p>

          {((compras && compras.length > 0) || (accesoModulos && accesoModulos.length > 0)) ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
              {/* Drill Lab */}
              <Link href="/drills" style={{ textDecoration: "none" }}>
                <div style={{ background: "var(--card)", border: drillLabAccess === "member" ? "1px solid var(--oro)" : "1px solid var(--borde)", borderRadius: 12, overflow: "hidden", cursor: "pointer" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://otsbpiukzftacmvmkajy.supabase.co/storage/v1/object/public/portadas/Drill%20Lab.png" alt="Biblioteca de Ejercicios" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
                  <div style={{ padding: "20px 24px" }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: drillLabAccess === "member" ? "var(--oro)" : "var(--texto-suave)", marginBottom: 6 }}>
                      {drillLabAccess === "member" ? "Acceso completo" : `${FREE_QUOTA - Math.min(drillViewsUsed, FREE_QUOTA)} de ${FREE_QUOTA} ejercicios disponibles`}
                    </p>
                    <p style={{ fontSize: 17, fontWeight: 700, color: "var(--blanco)", marginBottom: 16 }}>Biblioteca de Ejercicios</p>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: drillLabAccess === "member" ? "var(--oro)" : "var(--card)", border: drillLabAccess === "member" ? "none" : "1px solid var(--borde)", color: drillLabAccess === "member" ? "var(--negro)" : "var(--texto)", padding: "9px 20px", borderRadius: 6, fontSize: 13, fontWeight: 700 }}>
                      Abrir biblioteca →
                    </div>
                  </div>
                </div>
              </Link>
              {/* Cursos completos */}
              {compras?.filter((c) => !!c.cursos).map((compra) => (
                <Link key={compra.id} href={`/ver/${compra.cursos.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    background: "var(--card)", border: "1px solid var(--borde)",
                    borderRadius: 12, overflow: "hidden", cursor: "pointer",
                  }}>
                    {compra.cursos.portada_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={compra.cursos.portada_url} alt={compra.cursos.titulo}
                        style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
                    ) : (
                      <div style={{ width: "100%", aspectRatio: "16/9", background: "linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 40 }}>📚</span>
                      </div>
                    )}
                    <div style={{ padding: "20px 24px" }}>
                      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--oro)", marginBottom: 6 }}>Acceso completo</p>
                      <p style={{ fontSize: 17, fontWeight: 700, color: "var(--blanco)", marginBottom: 16 }}>{compra.cursos.titulo}</p>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--oro)", color: "var(--negro)", padding: "9px 20px", borderRadius: 6, fontSize: 13, fontWeight: 700 }}>
                        Continuar →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {/* Módulos individuales */}
              {accesoModulos?.map((am) => {
                const modulo = am.modulos as unknown as { id: number; titulo: string; portada_url?: string } | null;
                if (!modulo) return null;
                return (
                  <Link key={am.modulo_id} href={`/modulos/${am.modulo_id}`} style={{ textDecoration: "none" }}>
                    <div style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 12, overflow: "hidden", cursor: "pointer" }}>
                      {modulo.portada_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={modulo.portada_url} alt={modulo.titulo}
                          style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
                      ) : (
                        <div style={{ width: "100%", aspectRatio: "16/9", background: "linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 40 }}>🎬</span>
                        </div>
                      )}
                      <div style={{ padding: "20px 24px" }}>
                        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--oro)", marginBottom: 6 }}>Módulo</p>
                        <p style={{ fontSize: 17, fontWeight: 700, color: "var(--blanco)", marginBottom: 16 }}>{modulo.titulo}</p>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--oro)", color: "var(--negro)", padding: "9px 20px", borderRadius: 6, fontSize: 13, fontWeight: 700 }}>
                          Ver módulo →
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
              {/* Drill Lab — siempre visible aunque no haya cursos */}
              <Link href="/drills" style={{ textDecoration: "none" }}>
                <div style={{ background: "var(--card)", border: drillLabAccess === "member" ? "1px solid var(--oro)" : "1px solid var(--borde)", borderRadius: 12, overflow: "hidden", cursor: "pointer" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://otsbpiukzftacmvmkajy.supabase.co/storage/v1/object/public/portadas/Drill%20Lab.png" alt="Biblioteca de Ejercicios" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
                  <div style={{ padding: "20px 24px" }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: drillLabAccess === "member" ? "var(--oro)" : "var(--texto-suave)", marginBottom: 6 }}>
                      {drillLabAccess === "member" ? "Acceso completo" : `${FREE_QUOTA - Math.min(drillViewsUsed, FREE_QUOTA)} de ${FREE_QUOTA} ejercicios disponibles`}
                    </p>
                    <p style={{ fontSize: 17, fontWeight: 700, color: "var(--blanco)", marginBottom: 16 }}>Biblioteca de Ejercicios</p>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: drillLabAccess === "member" ? "var(--oro)" : "var(--card)", border: drillLabAccess === "member" ? "none" : "1px solid var(--borde)", color: drillLabAccess === "member" ? "var(--negro)" : "var(--texto)", padding: "9px 20px", borderRadius: 6, fontSize: 13, fontWeight: 700 }}>
                      Abrir biblioteca →
                    </div>
                  </div>
                </div>
              </Link>
              {/* Placeholder — sin cursos */}
              <div style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 12, padding: "40px 32px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start" }}>
                <p style={{ fontSize: 18, fontWeight: 600, color: "var(--texto)", marginBottom: 8 }}>Sin cursos todavía.</p>
                <p style={{ color: "var(--texto-suave)", marginBottom: 24, fontSize: 14, lineHeight: 1.6 }}>Accede al Laboratorio del Entrenador o únete a la comunidad en Skool.</p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <Link href="/cursos/laboratorio-2526" className="btn-primary" style={{ fontSize: 13 }}>Ver el Laboratorio</Link>
                  <a href="https://www.skool.com/jorge-lorenzo-coach/plans" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: 13 }}>Unirse a Skool</a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
