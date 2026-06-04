"use client";

import { useState } from "react";

interface Modulo {
  id: number;
  titulo: string;
  orden: number;
  fecha_apertura?: string | null;
  fecha_cierre_venta?: string | null;
  precio?: number | null;
  lemon_variant_id?: string | null;
}

function toInputDate(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  // Formatear en hora LOCAL del navegador (no UTC) para que el input datetime-local muestre bien
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function ModuloEditor({ modulo }: { modulo: Modulo }) {
  const [abierto, setAbierto] = useState(false);
  const [data, setData] = useState(modulo);
  const [loading, setLoading] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [copiado, setCopiado] = useState(false);

  function copiarUrl() {
    navigator.clipboard.writeText(`${window.location.origin}/modulos/${modulo.id}`);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  async function guardar() {
    setLoading(true);
    await fetch(`/api/admin/modulo/${data.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fecha_apertura: data.fecha_apertura || null,
        fecha_cierre_venta: data.fecha_cierre_venta || null,
        precio: data.precio ?? 0,
        lemon_variant_id: data.lemon_variant_id || null,
      }),
    });
    setLoading(false);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  }

  function estado() {
    const ahora = new Date();
    if (!data.fecha_apertura) return null;
    const apertura = new Date(data.fecha_apertura);
    if (ahora < apertura) return { label: "Programado", color: "#888" };
    if (data.fecha_cierre_venta) {
      const cierre = new Date(data.fecha_cierre_venta);
      if (ahora <= cierre) return { label: "En venta", color: "#4a9" };
      return { label: "Cerrado", color: "#e06" };
    }
    return { label: "Abierto", color: "#4a9" };
  }

  const est = estado();

  return (
    <div style={{ borderTop: "1px dashed var(--borde)", marginTop: 12, paddingTop: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          onClick={() => setAbierto(!abierto)}
          style={{ fontSize: 11, color: "var(--texto-suave)", background: "none", border: "1px solid var(--borde)", borderRadius: 4, padding: "3px 10px", cursor: "pointer" }}
        >
          {abierto ? "▲ Venta" : "▼ Venta"}
        </button>
        {est && (
          <span style={{ fontSize: 11, fontWeight: 700, color: est.color, border: `1px solid ${est.color}`, padding: "2px 8px", borderRadius: 4 }}>
            {est.label}
          </span>
        )}
        {data.precio ? <span style={{ fontSize: 11, color: "var(--texto-suave)" }}>{(data.precio / 100).toFixed(0)}€</span> : null}
        <button onClick={copiarUrl} style={{ fontSize: 11, color: copiado ? "#4a9" : "var(--oro)", background: "none", border: `1px solid ${copiado ? "#4a9" : "var(--oro)"}`, borderRadius: 4, padding: "2px 10px", cursor: "pointer" }}>
          {copiado ? "✓ Copiado" : "🔗 Copiar URL"}
        </button>
      </div>

      {abierto && (
        <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div>
            <p style={{ fontSize: 10, color: "var(--texto-suave)", marginBottom: 4 }}>Apertura</p>
            <input
              type="datetime-local"
              value={toInputDate(data.fecha_apertura)}
              onChange={(e) => setData({ ...data, fecha_apertura: e.target.value ? new Date(e.target.value).toISOString() : null })}
              style={inputStyle}
            />
          </div>
          <div>
            <p style={{ fontSize: 10, color: "var(--texto-suave)", marginBottom: 4 }}>Cierre venta</p>
            <input
              type="datetime-local"
              value={toInputDate(data.fecha_cierre_venta)}
              onChange={(e) => setData({ ...data, fecha_cierre_venta: e.target.value ? new Date(e.target.value).toISOString() : null })}
              style={inputStyle}
            />
          </div>
          <div>
            <p style={{ fontSize: 10, color: "var(--texto-suave)", marginBottom: 4 }}>Precio (€)</p>
            <input
              type="number"
              min="0"
              step="1"
              value={data.precio ? data.precio / 100 : ""}
              onChange={(e) => setData({ ...data, precio: e.target.value ? Math.round(parseFloat(e.target.value) * 100) : 0 })}
              placeholder="75"
              style={{ ...inputStyle, width: 80 }}
            />
          </div>
          <div>
            <p style={{ fontSize: 10, color: "var(--texto-suave)", marginBottom: 4 }}>Lemon Variant ID</p>
            <input
              value={data.lemon_variant_id ?? ""}
              onChange={(e) => setData({ ...data, lemon_variant_id: e.target.value })}
              placeholder="uuid"
              style={{ ...inputStyle, width: 220 }}
            />
          </div>
          <button
            onClick={guardar}
            disabled={loading}
            className="btn-primary"
            style={{ fontSize: 12, padding: "7px 16px", border: "none", cursor: "pointer" }}
          >
            {loading ? "..." : guardado ? "✓ Guardado" : "Guardar"}
          </button>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: "var(--negro)", border: "1px solid var(--borde)", borderRadius: 6,
  padding: "7px 10px", color: "var(--texto)", fontSize: 12, fontFamily: "inherit",
  outline: "none", boxSizing: "border-box",
};
