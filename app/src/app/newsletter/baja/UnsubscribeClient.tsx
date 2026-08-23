"use client";

import { useState } from "react";

export default function UnsubscribeClient({ token }: { token?: string }) {
  const [status, setStatus] = useState<"ready" | "loading" | "done" | "error">("ready");

  async function unsubscribe() {
    if (!token) return;
    setStatus("loading");
    const response = await fetch("/api/newsletter/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    setStatus(response.ok ? "done" : "error");
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "var(--negro)" }}>
      <section style={{ width: "min(100%, 480px)", padding: "40px 36px", background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 16, textAlign: "center" }}>
        <p style={{ color: "var(--oro)", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>Jorge Lorenzo Coach</p>
        {status === "done" ? (
          <>
            <h1 style={{ fontSize: 28, marginBottom: 12 }}>Baja confirmada</h1>
            <p style={{ color: "var(--texto-suave)", lineHeight: 1.65 }}>No volverás a recibir esta newsletter. Gracias por habernos acompañado.</p>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: 28, marginBottom: 12 }}>¿Quieres darte de baja?</h1>
            <p style={{ color: "var(--texto-suave)", lineHeight: 1.65, marginBottom: 28 }}>Dejarás de recibir la newsletter semanal de Jorge Lorenzo Coach.</p>
            {!token ? (
              <p style={{ color: "#e07a7a" }}>Este enlace de baja no es válido.</p>
            ) : (
              <button onClick={unsubscribe} disabled={status === "loading"} style={{ width: "100%", border: "1px solid #9f4f4f", background: "transparent", color: "#f2a0a0", borderRadius: 8, padding: "12px 16px", cursor: "pointer", font: "inherit", fontWeight: 700 }}>
                {status === "loading" ? "Procesando…" : "Confirmar baja"}
              </button>
            )}
            {status === "error" && <p style={{ color: "#e07a7a", marginTop: 16, fontSize: 14 }}>No hemos podido procesar la baja. Inténtalo de nuevo.</p>}
          </>
        )}
      </section>
    </main>
  );
}
