import { createAdminClient } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import CurriculumAccordion from "./CurriculumAccordion";
import FaqAccordion from "./FaqAccordion";
import NavBar from "@/components/NavBar";

export const dynamic = "force-dynamic";

export default async function CursoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const adminDb = createAdminClient();
  const { data: curso } = await adminDb
    .from("cursos")
    .select("*, modulos(id, titulo, orden, fecha_apertura, fecha_cierre_venta, precio, lemon_variant_id, portada_url, lecciones_curso(id, titulo, duracion, es_preview, orden))")
    .eq("slug", slug)
    .eq("activo", true)
    .single();

  if (!curso) notFound();

  // Usuario (puede ser anónimo)
  let user = null;
  let tieneAcceso = false;
  try {
    const supabase = await createClient();
    const { data: { user: u } } = await supabase.auth.getUser();
    user = u;
    if (user) {
      const { data } = await supabase.rpc("tiene_acceso", { p_curso_id: curso.id });
      tieneAcceso = !!data;
    }
  } catch { /* anónimo */ }

  const modulos = (curso.modulos ?? []).sort((a: { orden: number }, b: { orden: number }) => a.orden - b.orden);
  const totalLecciones = modulos.reduce(
    (acc: number, m: { lecciones_curso: unknown[] }) => acc + (m.lecciones_curso?.length ?? 0), 0
  );

  // Precios: usar campos específicos si existen, si no caer a precio base
  const webPrecio = curso.web_precio ?? curso.precio;
  const webPrecioOrig = curso.web_precio_original ?? null;
  const skoolPrecio = curso.skool_precio ?? null;
  const skoolPrecioOrig = curso.skool_precio_original ?? null;
  const skoolUrl = curso.skool_url ?? null;
  const tieneSkool = !!(skoolPrecio && skoolUrl);
  const esGratuito = webPrecio === 0;

  const paraQuien: { texto: string }[] = curso.para_quien ?? [];
  const trabajamos: { icono: string; texto: string }[] = curso.lo_que_trabajamos ?? [];
  const videosPreview: { id: string; titulo: string }[] = curso.videos_preview ?? [];

  const lemonStore = process.env.NEXT_PUBLIC_LEMON_STORE ?? "basketouch.lemonsqueezy.com";

  return (
    <>
      <NavBar links={user ? [{ label: "Mi cuenta", href: "/cuenta" }] : [{ label: "Acceder", href: "/login" }]} />

      {/* HERO */}
      <div style={{ paddingTop: 64, background: "var(--oscuro)", borderBottom: "1px solid var(--borde)" }}>
        <div className="container" style={{ maxWidth: 1140, paddingTop: 60, paddingBottom: 60 }}>
          <a href="/cursos" style={{ color: "var(--texto-suave)", fontSize: 13, textDecoration: "none", display: "inline-block", marginBottom: 24 }}>
            ← Todos los cursos
          </a>
          <p className="section-label">Curso</p>
          <h2 style={{ fontSize: "clamp(28px, 5vw, 52px)", maxWidth: 700, marginBottom: 20 }}>{curso.titulo}</h2>
          {(curso.descripcion_larga || curso.descripcion) && (
            <p style={{ fontSize: 17, color: "var(--texto-suave)", maxWidth: 620, lineHeight: 1.7, marginBottom: 32 }}>
              {curso.descripcion_larga || curso.descripcion}
            </p>
          )}
          {/* Stats */}
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            {[
              { valor: modulos.length, etiqueta: "módulos" },
              { valor: totalLecciones, etiqueta: "lecciones" },
              ...(curso.duracion_texto ? [{ valor: curso.duracion_texto, etiqueta: "de contenido" }] : []),
            ].map(({ valor, etiqueta }) => (
              <div key={etiqueta}>
                <span style={{ fontSize: 28, fontWeight: 800, color: "var(--oro)" }}>{valor}</span>
                <span style={{ fontSize: 14, color: "var(--texto-suave)", marginLeft: 6 }}>{etiqueta}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <section style={{ paddingTop: 60, paddingBottom: 120 }}>
        <div className="container" style={{ maxWidth: 1140 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 64, alignItems: "start" }}>

            {/* IZQUIERDA */}
            <div>
              {/* Para quién es */}
              {paraQuien.length > 0 && (
                <div style={{ marginBottom: 48 }}>
                  <p className="section-label">¿Para quién es?</p>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                    {paraQuien.map((item, i) => (
                      <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 15, color: "var(--texto-suave)", lineHeight: 1.6 }}>
                        <span style={{ color: "var(--oro)", fontWeight: 700, flexShrink: 0 }}>→</span>
                        {item.texto}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Lo que trabajamos */}
              {trabajamos.length > 0 && (
                <div style={{ marginBottom: 48 }}>
                  <p className="section-label">Lo que trabajamos</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {trabajamos.map(({ icono, texto }) => (
                      <div key={texto} style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 8, padding: "14px 16px", display: "flex", gap: 10, alignItems: "center" }}>
                        <span style={{ fontSize: 18 }}>{icono}</span>
                        <span style={{ fontSize: 13, color: "var(--texto-suave)" }}>{texto}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vídeos de ejemplo */}
              {videosPreview.length > 0 && (
                <div style={{ marginBottom: 48 }}>
                  <p className="section-label">Muestra del contenido</p>
                  <p style={{ fontSize: 15, color: "var(--texto-suave)", marginBottom: 24, lineHeight: 1.6 }}>
                    Lecciones del programa para que veas el nivel y el formato antes de decidir.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    {videosPreview.map(({ id, titulo }) => (
                      <div key={id}>
                        <div style={{ position: "relative", paddingBottom: "56.25%", borderRadius: 10, overflow: "hidden", background: "#000" }}>
                          <iframe
                            src={`https://player.vimeo.com/video/${id}?color=c9a84c&byline=0&portrait=0&title=0&dnt=1`}
                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                        <p style={{ fontSize: 13, color: "var(--texto-suave)", marginTop: 10 }}>
                          <span style={{ color: "var(--oro)", marginRight: 6 }}>↳</span>{titulo}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Temario */}
              <div>
                <p className="section-label">Temario completo</p>
                <CurriculumAccordion modulos={modulos} slug={slug} lemonStore={lemonStore} />
              </div>
            </div>

            {/* DERECHA — Card */}
            <div style={{ position: "sticky", top: 100 }}>
              <div style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 12, padding: 28, boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
                {curso.portada_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={curso.portada_url} alt={curso.titulo}
                    style={{ width: "100%", borderRadius: 8, marginBottom: 20, aspectRatio: "16/9", objectFit: "cover" }} />
                )}

                {/* CTA */}
                {tieneAcceso ? (
                  <a href={`/ver/${curso.slug}`} className="btn-primary" style={{ display: "block", textAlign: "center", marginBottom: 20 }}>
                    Continuar curso →
                  </a>
                ) : esGratuito ? (
                  <a href="/login" className="btn-primary" style={{ display: "block", textAlign: "center", marginBottom: 20 }}>
                    Acceder al curso →
                  </a>
                ) : (
                  <div style={{ marginBottom: 20 }}>
                    {/* Precio web */}
                    {!esGratuito && (
                      <div style={{ marginBottom: 8 }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                          <span style={{ fontSize: 38, fontWeight: 800, color: "var(--blanco)", lineHeight: 1 }}>
                            {(webPrecio / 100).toFixed(0)}€
                          </span>
                          {webPrecioOrig && (
                            <span style={{ fontSize: 16, color: "var(--texto-suave)", textDecoration: "line-through" }}>
                              {(webPrecioOrig / 100).toFixed(0)}€
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: 13, color: "var(--texto-suave)", marginTop: 4 }}>Pago único · Acceso permanente</p>
                      </div>
                    )}

                    {/* Opción Skool — solo si está configurada */}
                    {tieneSkool && (
                      <>
                        <div style={{
                          background: "linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(201,168,76,0.03) 100%)",
                          border: "2px solid rgba(201,168,76,0.5)",
                          borderRadius: 10, padding: "20px",
                          marginBottom: 10, position: "relative",
                        }}>
                          <div style={{ position: "absolute", top: -11, left: 16, background: "var(--oro)", color: "var(--negro)", fontSize: 10, fontWeight: 800, padding: "2px 10px", borderRadius: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                            Mejor precio
                          </div>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 38, fontWeight: 900, color: "var(--oro)", lineHeight: 1 }}>
                              {(skoolPrecio! / 100).toFixed(0)}€
                            </span>
                            {skoolPrecioOrig && (
                              <span style={{ fontSize: 13, color: "var(--texto-suave)", textDecoration: "line-through" }}>
                                {(skoolPrecioOrig / 100).toFixed(0)}€
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: 12, color: "var(--texto-suave)", marginBottom: 14, lineHeight: 1.5 }}>
                            Acceso completo · Pago único · Solo para miembros de la comunidad Skool
                          </p>
                          <a href={skoolUrl!} target="_blank" rel="noopener noreferrer"
                            className="btn-primary" style={{ display: "block", textAlign: "center", fontSize: 14 }}>
                            Entrar a la comunidad →
                          </a>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                          <div style={{ flex: 1, height: 1, background: "var(--borde)" }} />
                          <span style={{ fontSize: 11, color: "var(--texto-suave)" }}>o</span>
                          <div style={{ flex: 1, height: 1, background: "var(--borde)" }} />
                        </div>
                      </>
                    )}

                    {/* Opción compra directa web */}
                    <div style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 10, padding: "16px 20px", marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: curso.en_venta ? 12 : 6 }}>
                        <div>
                          <span style={{ fontSize: 26, fontWeight: 900, color: "var(--blanco)", lineHeight: 1 }}>
                            {(webPrecio / 100).toFixed(0)}€
                          </span>
                          <p style={{ fontSize: 11, color: "var(--texto-suave)", marginTop: 3 }}>Acceso directo · Pago único</p>
                        </div>
                        {!curso.en_venta && curso.fecha_apertura_texto && (
                          <div style={{ textAlign: "right" }}>
                            <p style={{ fontSize: 10, fontWeight: 700, color: "var(--oro)", letterSpacing: "0.15em", textTransform: "uppercase" }}>{curso.fecha_apertura_texto}</p>
                            <p style={{ fontSize: 10, color: "var(--texto-suave)", marginTop: 2 }}>Apertura limitada</p>
                          </div>
                        )}
                      </div>
                      {curso.en_venta && curso.lemon_variant_id && (
                        <a
                          href={`https://${lemonStore}/checkout/buy/${curso.lemon_variant_id}?checkout[custom][slug]=${curso.slug}`}
                          target="_blank" rel="noopener noreferrer"
                          style={{ display: "block", textAlign: "center", fontSize: 13, padding: "10px", border: "1px solid var(--borde)", borderRadius: 6, color: "var(--texto)", textDecoration: "none" }}
                        >
                          Comprar — {(webPrecio / 100).toFixed(0)}€ →
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Incluye */}
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, borderTop: "1px solid var(--borde)", paddingTop: 20 }}>
                  {[
                    `${modulos.length} módulos · ${totalLecciones} lecciones`,
                    "Acceso permanente",
                    "Vídeos en alta calidad",
                  ].map((item) => (
                    <li key={item} style={{ fontSize: 13, color: "var(--texto-suave)", display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span style={{ color: "var(--oro)", flexShrink: 0 }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Q&A */}
      <section style={{ paddingTop: 80, paddingBottom: 100, borderTop: "1px solid var(--borde)" }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <p className="section-label" style={{ marginBottom: 8 }}>Preguntas frecuentes</p>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 36px)", marginBottom: 48 }}>Lo que más nos preguntan.</h2>
          <FaqAccordion />

          <div style={{ marginTop: 56, padding: "28px 32px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <div>
              <p style={{ fontWeight: 700, marginBottom: 4 }}>¿Tienes alguna otra duda?</p>
              <p style={{ fontSize: 13, color: "var(--texto-suave)" }}>Escríbenos directamente y te respondemos.</p>
            </div>
            <a href="mailto:info@basketouch.com" className="btn-secondary" style={{ fontSize: 14, whiteSpace: "nowrap", textDecoration: "none" }}>
              Contactar →
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
