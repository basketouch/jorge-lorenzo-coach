"use client";

import { useState, useEffect } from "react";

interface Leccion {
  id: number;
  titulo: string;
  duracion?: string;
  es_preview: boolean;
}

interface Modulo {
  id: number;
  titulo: string;
  orden: number;
  fecha_apertura?: string | null;
  fecha_cierre_venta?: string | null;
  precio?: number | null;
  lemon_variant_id?: string | null;
  portada_url?: string | null;
  lecciones_curso: Leccion[];
}

function useCuentaAtras(fechaCierre?: string | null) {
  const [restante, setRestante] = useState("");

  useEffect(() => {
    if (!fechaCierre) return;
    const cierre = new Date(fechaCierre);
    function calc() {
      const diff = cierre.getTime() - Date.now();
      if (diff <= 0) { setRestante("Cerrado"); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setRestante(d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m`);
    }
    calc();
    const t = setInterval(calc, 60000);
    return () => clearInterval(t);
  }, [fechaCierre]);

  return restante;
}

function ModuloRow({ modulo, slug, lemonStore }: { modulo: Modulo; slug: string; lemonStore: string }) {
  const ahora = new Date();
  const apertura = modulo.fecha_apertura ? new Date(modulo.fecha_apertura) : null;
  const cierre = modulo.fecha_cierre_venta ? new Date(modulo.fecha_cierre_venta) : null;
  const enVenta = apertura && ahora >= apertura && (!cierre || ahora <= cierre);
  const cerrado = cierre && ahora > cierre;
  const cuentaAtras = useCuentaAtras(enVenta ? modulo.fecha_cierre_venta : null);

  function estadoBadge() {
    if (!apertura) return null;
    if (cerrado) return { label: "Venta cerrada", color: "#888" };
    if (enVenta) return { label: "En venta", color: "#4a9" };
    return {
      label: `Abre ${apertura.toLocaleDateString("es-ES", { day: "numeric", month: "short" })}`,
      color: "var(--oro)",
    };
  }

  const badge = estadoBadge();
  const lecciones = [...modulo.lecciones_curso].sort((a, b) => a.id - b.id);
  const [abiertos, setAbiertos] = useState(() => lecciones.some((l) => l.es_preview));

  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 8, overflow: "hidden" }}>
      <button
        onClick={() => setAbiertos(!abiertos)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 12, padding: "16px 20px", background: "transparent", border: "none",
          cursor: "pointer", textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
          {modulo.portada_url ? (
            <img src={modulo.portada_url} alt={modulo.titulo} style={{ width: 40, height: 28, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />
          ) : (
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--oro)", minWidth: 20 }}>
              {String(modulo.orden).padStart(2, "0")}
            </span>
          )}
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--texto)" }}>{modulo.titulo}</span>
          {badge && (
            <a
              href={`/modulos/${modulo.id}`}
              onClick={(e) => e.stopPropagation()}
              style={{ fontSize: 10, fontWeight: 700, color: badge.color, border: `1px solid ${badge.color}`, padding: "2px 7px", borderRadius: 4, flexShrink: 0, textDecoration: "none" }}
            >
              {badge.label} →
            </a>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          {enVenta && cuentaAtras && cuentaAtras !== "Cerrado" && (
            <span style={{ fontSize: 11, color: "#4a9" }}>⏱ {cuentaAtras}</span>
          )}
          {enVenta && modulo.precio && modulo.lemon_variant_id && (
            <a
              href={`https://${lemonStore}/checkout/buy/${modulo.lemon_variant_id}?checkout[custom][modulo_id]=${modulo.id}`}
              target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="btn-primary"
              style={{ fontSize: 11, padding: "5px 12px", textDecoration: "none", display: "inline-block" }}
            >
              Comprar — {(modulo.precio / 100).toFixed(0)}€
            </a>
          )}
          <span style={{ fontSize: 12, color: "var(--texto-suave)" }}>{lecciones.length} lecciones</span>
          <span style={{
            color: "var(--texto-suave)", fontSize: 12, transition: "transform 0.2s", display: "inline-block",
            transform: abiertos ? "rotate(180deg)" : "rotate(0deg)",
          }}>▾</span>
        </div>
      </button>

      {abiertos && (
        <div style={{ borderTop: "1px solid var(--borde)" }}>
          {lecciones.map((leccion, i) => {
            const previewUrl = `/preview/${slug}/${leccion.id}`;
            const row = (
              <div className="leccion-row" style={{
                padding: "12px 20px 12px 52px", display: "flex", alignItems: "center",
                justifyContent: "space-between",
                borderBottom: i < lecciones.length - 1 ? "1px solid var(--borde)" : "none",
                textDecoration: "none",
              }}>
                <span style={{ fontSize: 13, color: leccion.es_preview ? "var(--texto)" : "var(--texto-suave)" }}>{leccion.titulo}</span>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
                  {leccion.duracion && <span style={{ fontSize: 12, color: "var(--texto-suave)" }}>{leccion.duracion}</span>}
                  {leccion.es_preview && (
                    <span style={{ fontSize: 11, color: "var(--oro)", border: "1px solid var(--oro)", padding: "2px 8px", borderRadius: 4 }}>▶ Preview</span>
                  )}
                </div>
              </div>
            );
            return leccion.es_preview ? (
              <a key={leccion.id} href={previewUrl} style={{ display: "block", textDecoration: "none" }}>
                {row}
              </a>
            ) : (
              <div key={leccion.id}>{row}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CurriculumAccordion({ modulos, slug, lemonStore }: { modulos: Modulo[]; slug: string; lemonStore: string }) {
  const [inicializado, setInicializado] = useState(false);

  useEffect(() => { setInicializado(true); }, []);

  if (!inicializado) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {modulos.map((m) => (
        <ModuloRow key={m.id} modulo={m} slug={slug} lemonStore={lemonStore} />
      ))}
    </div>
  );
}
