"use client";

import { useState, useEffect } from "react";
import PaddleCheckoutButton from "@/components/PaddleCheckoutButton";

interface Leccion { id: number; titulo: string; duracion?: string; es_preview: boolean; }
interface Curso { id: number; slug: string; titulo: string; precio: number; paddle_price_id: string | null; en_venta: boolean; }
interface Modulo {
  id: number; titulo: string; orden: number;
  fecha_apertura?: string | null; fecha_cierre_venta?: string | null;
  precio?: number | null; paddle_price_id?: string | null;
  portada_url?: string | null;
}

function CuentaAtras({ fecha }: { fecha: string }) {
  const [restante, setRestante] = useState("");

  useEffect(() => {
    const cierre = new Date(fecha);
    function calc() {
      const diff = cierre.getTime() - Date.now();
      if (diff <= 0) { setRestante("Cerrado"); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRestante(d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m ${s}s`);
    }
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [fecha]);

  return <span>{restante}</span>;
}

export default function ModuloGate({
  modulo, lecciones, curso, isLoggedIn,
}: {
  modulo: Modulo; lecciones: Leccion[]; curso: Curso; isLoggedIn: boolean;
}) {
  const ahora = new Date();
  const apertura = modulo.fecha_apertura ? new Date(modulo.fecha_apertura) : null;
  const cierre = modulo.fecha_cierre_venta ? new Date(modulo.fecha_cierre_venta) : null;
  const enVenta = apertura && ahora >= apertura && (!cierre || ahora <= cierre);
  const cerrado = cierre && ahora > cierre;

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 100 }}>

      <a href="/cursos" style={{ fontSize: 13, color: "var(--texto-suave)", textDecoration: "none", display: "inline-block", marginBottom: 24 }}>
        ← Cursos
      </a>

      {/* Hero portada */}
      {modulo.portada_url && (
        <div style={{ marginBottom: 48, borderRadius: 12, overflow: "hidden", maxHeight: 340, position: "relative" }}>
          <img
            src={modulo.portada_url}
            alt={modulo.titulo}
            style={{ width: "100%", objectFit: "cover", display: "block", maxHeight: 340, filter: "brightness(0.6)" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)" }} />
          <div style={{ position: "absolute", bottom: 28, left: 32 }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>
              Módulo {String(modulo.orden).padStart(2, "0")}
            </p>
            <h1 style={{ fontSize: "clamp(22px, 3.5vw, 36px)", color: "#fff", margin: 0 }}>{modulo.titulo}</h1>
          </div>
          <div style={{ position: "absolute", top: 20, right: 20, background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, padding: "6px 14px" }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>🔒 Contenido bloqueado</span>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 48, alignItems: "start" }}>

        {/* Izquierda — temario bloqueado */}
        <div>
          {!modulo.portada_url && (
            <>
              <p className="section-label">Módulo {String(modulo.orden).padStart(2, "0")}</p>
              <h1 style={{ fontSize: "clamp(24px, 4vw, 38px)", marginBottom: 8 }}>{modulo.titulo}</h1>
            </>
          )}
          <p style={{ fontSize: 14, color: "var(--texto-suave)", marginBottom: 32 }}>
            {lecciones.length} lecciones
          </p>

          {/* Lista — preview desbloqueado, resto bloqueado */}
          <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
            {lecciones.map((l, i) => l.es_preview ? (
              <a
                key={l.id}
                href={`/preview/${curso.slug}/${l.id}`}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "16px 0", borderBottom: "1px solid var(--borde)",
                  textDecoration: "none", gap: 16,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 12, color: "var(--oro)", fontWeight: 700, minWidth: 20 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ fontSize: 14, color: "var(--texto)" }}>{l.titulo}</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
                  {l.duracion && <span style={{ fontSize: 12, color: "var(--texto-suave)" }}>{l.duracion}</span>}
                  <span style={{ fontSize: 11, color: "var(--oro)", border: "1px solid var(--oro)", padding: "2px 8px", borderRadius: 4 }}>▶ Gratis</span>
                </div>
              </a>
            ) : (
              <div
                key={l.id}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "16px 0", borderBottom: "1px solid var(--borde)",
                  gap: 16, opacity: 0.4,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 12, color: "var(--oro)", fontWeight: 700, minWidth: 20 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ fontSize: 14, color: "var(--texto)" }}>{l.titulo}</span>
                </div>
                <span style={{ fontSize: 14, color: "var(--texto-suave)" }}>🔒</span>
              </div>
            ))}

            {/* Overlay */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to bottom, transparent 20%, var(--negro) 80%)",
              pointerEvents: "none",
            }} />
          </div>
        </div>

        {/* Derecha — compra */}
        <div style={{ position: "sticky", top: 100 }}>

          {/* Estado del módulo */}
          {cerrado ? (
            <div style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 12, padding: 24, marginBottom: 16, textAlign: "center" }}>
              <p style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>Ventana de venta cerrada</p>
              <p style={{ fontSize: 12, color: "var(--texto-suave)" }}>Este módulo ya no está disponible por separado.</p>
            </div>
          ) : enVenta && modulo.precio && modulo.paddle_price_id ? (
            <div style={{
              background: "var(--card)", border: "2px solid rgba(201,168,76,0.5)",
              borderRadius: 12, padding: 24, marginBottom: 16,
            }}>
              {cierre && (
                <div style={{ marginBottom: 16, textAlign: "center" }}>
                  <p style={{ fontSize: 18, fontWeight: 800, color: "var(--oro)" }}>
                    🔥 Solo quedan <CuentaAtras fecha={modulo.fecha_cierre_venta!} />
                  </p>
                </div>
              )}
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 38, fontWeight: 900, color: "var(--oro)", lineHeight: 1 }}>
                  {(modulo.precio / 100).toFixed(0)}€
                </span>
                <span style={{ fontSize: 13, color: "var(--texto-suave)" }}>este módulo</span>
              </div>
              <p style={{ fontSize: 12, color: "var(--texto-suave)", marginBottom: 16, lineHeight: 1.5 }}>
                Acceso permanente a las {lecciones.length} lecciones de este módulo.
              </p>
              <PaddleCheckoutButton
                priceId={modulo.paddle_price_id!}
                customData={{ modulo_id: modulo.id }}
                className="btn-primary"
                style={{ display: "block", textAlign: "center", fontSize: 14, width: "100%" }}
              >
                Comprar módulo →
              </PaddleCheckoutButton>
              {!isLoggedIn && (
                <p style={{ fontSize: 11, color: "var(--texto-suave)", marginTop: 10, textAlign: "center" }}>
                  <a href="/login" style={{ color: "var(--oro)" }}>Inicia sesión</a> si ya tienes cuenta.
                </p>
              )}
            </div>
          ) : apertura && ahora < apertura ? (
            <div style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 12, padding: 24, marginBottom: 16, textAlign: "center" }}>
              <p style={{ fontSize: 11, color: "var(--oro)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Próximamente</p>
              <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                {apertura.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              <p style={{ fontSize: 12, color: "var(--texto-suave)" }}>Apertura de venta</p>
            </div>
          ) : null}

          {/* Siempre — opción curso completo */}
          <div style={{
            background: "linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.02) 100%)",
            border: "1px solid rgba(201,168,76,0.25)", borderRadius: 12, padding: 24,
          }}>
            <p style={{ fontSize: 11, color: "var(--oro)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
              Mejor opción
            </p>
            <h3 style={{ fontSize: 15, marginBottom: 8 }}>Curso completo</h3>
            <p style={{ fontSize: 12, color: "var(--texto-suave)", lineHeight: 1.6, marginBottom: 16 }}>
              Todos los módulos de la temporada. {!cerrado ? "50€ menos que en la web." : ""}
            </p>

            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 12 }}>
              <span style={{ fontSize: 26, fontWeight: 900, color: "var(--oro)" }}>297€</span>
              <span style={{ fontSize: 12, color: "var(--texto-suave)", textDecoration: "line-through" }}>347€</span>
            </div>
            <a
              href="https://www.skool.com/jorge-lorenzo-coach/plans"
              target="_blank" rel="noopener noreferrer"
              className="btn-primary"
              style={{ display: "block", textAlign: "center", fontSize: 13, textDecoration: "none", marginBottom: 8 }}
            >
              Entrar a Skool →
            </a>
            <p style={{ fontSize: 11, color: "var(--texto-suave)", textAlign: "center" }}>desde $20/mes</p>

            {curso.en_venta && curso.paddle_price_id && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "12px 0" }}>
                  <div style={{ flex: 1, height: 1, background: "var(--borde)" }} />
                  <span style={{ fontSize: 11, color: "var(--texto-suave)" }}>o</span>
                  <div style={{ flex: 1, height: 1, background: "var(--borde)" }} />
                </div>
                <PaddleCheckoutButton
                  priceId={curso.paddle_price_id}
                  customData={{ slug: curso.slug }}
                  style={{
                    display: "block", textAlign: "center", fontSize: 12, padding: "9px",
                    border: "1px solid var(--borde)", borderRadius: 6,
                    color: "var(--texto)", background: "transparent", cursor: "pointer", width: "100%",
                  }}
                >
                  Comprar en la web — 347€
                </PaddleCheckoutButton>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
