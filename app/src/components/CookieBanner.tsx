"use client";

import { useEffect, useState } from "react";
import { REOPEN_EVENT, readConsent, useConsent, writeConsent, type Consent } from "@/lib/consent";

const button: React.CSSProperties = { flex: 1, minWidth: 120, padding: "11px 18px", fontSize: 14, fontWeight: 700, borderRadius: 8, cursor: "pointer", border: "1px solid #d8b33f" };

/** Aviso de cookies: aceptar y rechazar con el mismo peso. Sin elección, no se carga el Píxel de Meta. */
export default function CookieBanner() {
  const consent = useConsent();
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    const reopen = () => setReopened(true);
    window.addEventListener(REOPEN_EVENT, reopen);
    return () => window.removeEventListener(REOPEN_EVENT, reopen);
  }, []);

  const open = consent !== "loading" && (consent === null || reopened);

  function choose(value: Consent) {
    const previous = readConsent();
    writeConsent(value);
    setReopened(false);
    if (value === "rejected" && previous === "accepted") {
      // Retirar el consentimiento: se borran las cookies del Píxel y se recarga sin él.
      for (const name of ["_fbp", "_fbc"]) document.cookie = `${name}=; Max-Age=0; path=/`;
      window.location.reload();
    }
  }

  if (!open) return null;
  return (
    <div role="dialog" aria-label="Aviso de cookies" style={{ position: "fixed", left: 12, right: 12, bottom: 12, zIndex: 100, maxWidth: 560, margin: "0 auto", padding: "16px 18px", border: "1px solid rgba(216,179,63,.55)", borderRadius: 12, background: "#14130f", color: "#f7f4ec", boxShadow: "0 12px 40px rgba(0,0,0,.55)" }}>
      <p style={{ margin: "0 0 12px", fontSize: 14, lineHeight: 1.55 }}>
        Usamos cookies técnicas necesarias y, si lo aceptas, cookies de medición y publicidad de Meta para saber qué anuncios funcionan y mostrártelos. Puedes cambiarlo cuando quieras.{" "}
        <a href="/privacidad#cookies" style={{ color: "#d8b33f" }}>Más información</a>
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button type="button" onClick={() => choose("rejected")} style={{ ...button, background: "transparent", color: "#f7f4ec" }}>Rechazar</button>
        <button type="button" onClick={() => choose("accepted")} style={{ ...button, background: "#d8b33f", color: "#0a0a0a" }}>Aceptar</button>
      </div>
    </div>
  );
}
