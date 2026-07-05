"use client";

import { useState } from "react";

export default function AddCursoForm() {
  const [abierto, setAbierto] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function generarSlug(t: string) {
    return t.toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim().replace(/\s+/g, "-");
  }

  async function crear() {
    if (!titulo.trim() || !slug.trim()) { setError("Título y slug son obligatorios"); return; }
    setLoading(true); setError("");
    const res = await fetch("/api/admin/curso", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo: titulo.trim(), slug: slug.trim() }),
    });
    setLoading(false);
    if (res.ok) {
      const { data } = await res.json();
      window.location.href = `/admin/cursos/${data.id}`;
    } else {
      const d = await res.json();
      setError(d.error ?? "Error al crear");
    }
  }

  if (!abierto) {
    return (
      <button
        onClick={() => setAbierto(true)}
        className="btn-primary"
        style={{ fontSize: 13, padding: "8px 20px", border: "none", cursor: "pointer" }}
      >
        + Nuevo curso
      </button>
    );
  }

  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--oro)", borderRadius: 10, padding: 24, marginBottom: 32, maxWidth: 480 }}>
      <h3 style={{ marginBottom: 16, fontSize: 16 }}>Crear nuevo curso</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <label style={{ fontSize: 11, color: "var(--texto-suave)", display: "block", marginBottom: 4 }}>Título del curso</label>
          <input
            value={titulo}
            onChange={e => { setTitulo(e.target.value); if (!slug) setSlug(generarSlug(e.target.value)); }}
            placeholder="Ej: Defensa Élite 2026"
            autoFocus
            style={iS}
          />
        </div>
        <div>
          <label style={{ fontSize: 11, color: "var(--texto-suave)", display: "block", marginBottom: 4 }}>
            Slug (URL: /cursos/<strong>{slug || "..."}</strong>)
          </label>
          <input
            value={slug}
            onChange={e => setSlug(e.target.value)}
            placeholder="defensa-elite-2026"
            style={{ ...iS, fontFamily: "monospace" }}
          />
        </div>
        {error && <p style={{ fontSize: 12, color: "#e06" }}>{error}</p>}
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={crear} disabled={loading} className="btn-primary"
            style={{ fontSize: 13, padding: "8px 20px", border: "none", cursor: "pointer" }}>
            {loading ? "Creando..." : "Crear curso"}
          </button>
          <button onClick={() => { setAbierto(false); setTitulo(""); setSlug(""); setError(""); }}
            style={{ fontSize: 13, color: "var(--texto-suave)", background: "none", border: "1px solid var(--borde)", borderRadius: 6, padding: "8px 16px", cursor: "pointer" }}>
            Cancelar
          </button>
        </div>
        <p style={{ fontSize: 11, color: "var(--texto-suave)" }}>
          El curso se crea inactivo. Podrás editarlo y activarlo una vez configurado.
        </p>
      </div>
    </div>
  );
}

const iS: React.CSSProperties = {
  width: "100%", background: "var(--negro)", border: "1px solid var(--borde)",
  borderRadius: 6, padding: "8px 12px", color: "var(--texto)",
  fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
};
