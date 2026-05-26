"use client";

import { useState } from "react";

interface Props {
  email: string;
  nombre: string;
}

export default function EnviarAccesoUsuario({ email, nombre }: Props) {
  const [estado, setEstado] = useState<"idle" | "confirmando" | "loading" | "ok" | "error">("idle");

  async function enviar() {
    setEstado("loading");
    const res = await fetch("/api/admin/enviar-acceso", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, nombre }),
    });
    setEstado(res.ok ? "ok" : "error");
    if (res.ok) setTimeout(() => setEstado("idle"), 3000);
  }

  if (estado === "ok") {
    return <button disabled style={btnStyle}>✓ Email enviado</button>;
  }

  if (estado === "error") {
    return <button onClick={() => setEstado("idle")} style={{ ...btnStyle, borderColor: "#e05c5c", color: "#e05c5c" }}>Error — reintentar</button>;
  }

  if (estado === "confirmando") {
    return (
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "var(--texto-suave)" }}>¿Enviar acceso a {email}?</span>
        <button onClick={enviar} style={{ ...btnStyle, borderColor: "var(--oro)", color: "var(--oro)" }}>Confirmar</button>
        <button onClick={() => setEstado("idle")} style={btnStyle}>Cancelar</button>
      </div>
    );
  }

  return (
    <button onClick={() => setEstado("confirmando")} disabled={estado === "loading"} style={btnStyle}>
      {estado === "loading" ? "Enviando..." : "🔑 Enviar acceso"}
    </button>
  );
}

const btnStyle: React.CSSProperties = {
  fontSize: 12, padding: "7px 16px", borderRadius: 6, cursor: "pointer",
  background: "none", border: "1px solid var(--borde)",
  color: "var(--texto-suave)", fontFamily: "inherit",
};
