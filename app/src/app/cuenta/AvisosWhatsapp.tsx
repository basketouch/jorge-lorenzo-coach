"use client";

import { useState } from "react";
import { WHATSAPP_CONSENT_TEXT } from "@/lib/whatsapp-consent";

interface Props {
  telefonoInicial: string;
  aceptaInicial: boolean;
}

export default function AvisosWhatsapp({ telefonoInicial, aceptaInicial }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [telefono, setTelefono] = useState(telefonoInicial);
  // Viene marcada; si ya nos dio el móvil, refleja lo que tenga guardado.
  const [acepta, setAcepta] = useState(telefonoInicial ? aceptaInicial : true);
  const [activo, setActivo] = useState(Boolean(telefonoInicial) && aceptaInicial);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  async function guardar() {
    setLoading(true);
    setError("");
    setMensaje("");
    try {
      const response = await fetch("/api/whatsapp/cuenta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telefono, acepta }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.error || "No hemos podido guardar el cambio.");
      if (body?.phone) setTelefono(body.phone);
      setActivo(body?.consent === true);
      setMensaje(body?.consent ? "✓ Guardado. Te avisaré por WhatsApp." : "✓ Hecho. No te escribiré por WhatsApp.");
      setAbierto(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No hemos podido guardar el cambio.");
    }
    setLoading(false);
  }

  if (!abierto) {
    return (
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button
          onClick={() => { setAbierto(true); setMensaje(""); }}
          style={{ background: "none", border: "none", color: "var(--texto-suave)", fontSize: 13, cursor: "pointer", padding: 0, textDecoration: "underline" }}
        >
          {activo ? `Avisos por WhatsApp: ${telefono}` : "Recibir avisos por WhatsApp"}
        </button>
        {mensaje && <span style={{ fontSize: 13, color: "var(--oro)" }}>{mensaje}</span>}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 520, marginBottom: 8 }}>
      <input
        type="tel"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        placeholder="Tu móvil, por ejemplo +34 600 111 222"
        aria-label="Móvil"
        autoComplete="tel"
        style={inputStyle}
      />
      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={acepta}
          onChange={(e) => setAcepta(e.target.checked)}
          style={{ marginTop: 3, accentColor: "var(--oro)", flexShrink: 0 }}
        />
        <span style={{ fontSize: 13, color: "var(--texto-suave)", lineHeight: 1.5 }}>{WHATSAPP_CONSENT_TEXT}</span>
      </label>
      {error && <p role="alert" style={{ color: "#e05c5c", fontSize: 13 }}>{error}</p>}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={guardar} disabled={loading} className="btn-primary"
          style={{ fontSize: 13, padding: "8px 16px", border: "none", cursor: "pointer" }}>
          {loading ? "..." : "Guardar"}
        </button>
        <button onClick={() => { setAbierto(false); setError(""); }}
          style={{ background: "none", border: "none", color: "var(--texto-suave)", fontSize: 13, cursor: "pointer" }}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 6,
  padding: "8px 12px", color: "var(--texto)", fontSize: 14, fontFamily: "inherit",
  outline: "none", width: "100%", boxSizing: "border-box",
};
