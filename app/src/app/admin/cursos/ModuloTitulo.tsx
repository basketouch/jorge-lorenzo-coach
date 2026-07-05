"use client";

import { useState } from "react";

export default function ModuloTitulo({ id, orden, titulo }: { id: number; orden: number; titulo: string }) {
  const [editando, setEditando] = useState(false);
  const [valor, setValor] = useState(titulo);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  async function guardar() {
    if (valor.trim() === titulo) { setEditando(false); return; }
    setGuardando(true);
    await fetch(`/api/admin/modulo/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo: valor.trim() }),
    });
    setGuardando(false);
    setEditando(false);
  }

  async function eliminar() {
    if (!confirm(`¿Eliminar el módulo "${titulo}" y TODAS sus lecciones? Esta acción no se puede deshacer.`)) return;
    setEliminando(true);
    await fetch(`/api/admin/modulo/${id}`, { method: "DELETE" });
    window.location.reload();
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
      <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--oro)", flexShrink: 0 }}>
        Cap. {String(orden).padStart(2, "0")} —
      </span>

      {editando ? (
        <>
          <input
            autoFocus
            value={valor}
            onChange={e => setValor(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") guardar(); if (e.key === "Escape") { setValor(titulo); setEditando(false); } }}
            style={{
              flex: 1, background: "var(--negro)", border: "1px solid var(--oro)",
              borderRadius: 4, padding: "4px 8px", color: "var(--blanco)",
              fontSize: 13, fontWeight: 700, fontFamily: "inherit", outline: "none",
            }}
          />
          <button
            onClick={guardar}
            disabled={guardando}
            style={{ fontSize: 11, fontWeight: 700, background: "var(--oro)", color: "var(--negro)", border: "none", borderRadius: 4, padding: "4px 10px", cursor: "pointer" }}
          >
            {guardando ? "…" : "✓"}
          </button>
          <button
            onClick={() => { setValor(titulo); setEditando(false); }}
            style={{ fontSize: 11, background: "none", border: "1px solid var(--borde)", borderRadius: 4, padding: "4px 8px", color: "var(--texto-suave)", cursor: "pointer" }}
          >
            ✕
          </button>
        </>
      ) : (
        <>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--oro)" }}>
            {valor}
          </span>
          <button
            onClick={() => setEditando(true)}
            title="Editar título"
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, padding: "2px 4px", color: "var(--texto-suave)", lineHeight: 1 }}
          >
            ✏️
          </button>
          <button
            onClick={eliminar}
            disabled={eliminando}
            title="Eliminar módulo"
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, padding: "2px 4px", color: "#e06", lineHeight: 1 }}
          >
            {eliminando ? "…" : "🗑"}
          </button>
        </>
      )}
    </div>
  );
}
