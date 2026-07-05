"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EliminarCurso({ cursoId, titulo }: { cursoId: number; titulo: string }) {
  const [confirmando, setConfirmando] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function eliminar() {
    setLoading(true); setError("");
    const res = await fetch(`/api/admin/curso/${cursoId}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      router.push("/admin/cursos");
      router.refresh();
    } else {
      const d = await res.json();
      setError(d.error ?? "Error al eliminar");
    }
  }

  if (confirmando) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 13, color: "var(--texto-suave)" }}>¿Eliminar "{titulo}" y todos sus módulos/lecciones?</span>
          <button
            onClick={eliminar}
            disabled={loading}
            style={{
              fontSize: 12, fontWeight: 700, padding: "6px 14px", borderRadius: 6,
              border: "1px solid #e05c5c", background: "rgba(224,92,92,0.1)",
              color: "#e05c5c", cursor: "pointer",
            }}
          >
            {loading ? "Eliminando..." : "Sí, eliminar"}
          </button>
          <button
            onClick={() => setConfirmando(false)}
            style={{
              fontSize: 12, padding: "6px 14px", borderRadius: 6,
              border: "1px solid var(--borde)", background: "transparent",
              color: "var(--texto-suave)", cursor: "pointer",
            }}
          >
            Cancelar
          </button>
        </div>
        {error && <span style={{ fontSize: 12, color: "#e06" }}>{error}</span>}
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirmando(true)}
      style={{
        fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 6,
        border: "1px solid #e05c5c", background: "transparent",
        color: "#e05c5c", cursor: "pointer",
      }}
    >
      Eliminar curso
    </button>
  );
}
