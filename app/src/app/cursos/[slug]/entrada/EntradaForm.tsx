"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function EntradaForm({ slug }: { slug: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      const res = await fetch("/api/entrada-curso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, codigo }),
      });
      if (!res.ok) {
        setError("Código incorrecto.");
        setEnviando(false);
        return;
      }
      const redirect = searchParams.get("redirect") || `/cursos/${slug}`;
      router.push(redirect);
      router.refresh();
    } catch {
      setError("Algo ha fallado. Inténtalo de nuevo.");
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <input
        type="text"
        inputMode="numeric"
        placeholder="Código de acceso"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        autoFocus
        style={{
          width: "100%", padding: "12px 14px", borderRadius: 8,
          border: "1px solid var(--borde)", background: "var(--oscuro)",
          color: "var(--texto)", fontSize: 16, textAlign: "center", letterSpacing: 4,
        }}
      />
      {error && <p style={{ fontSize: 13, color: "#e66", textAlign: "center" }}>{error}</p>}
      <button type="submit" disabled={enviando || !codigo} className="btn-primary" style={{ width: "100%" }}>
        {enviando ? "Comprobando…" : "Entrar →"}
      </button>
    </form>
  );
}
