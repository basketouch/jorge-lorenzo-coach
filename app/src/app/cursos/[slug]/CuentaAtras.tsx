"use client";

import { useState, useEffect } from "react";

export default function CuentaAtras({ fechaCierre }: { fechaCierre: string }) {
  const [restante, setRestante] = useState("");

  useEffect(() => {
    const cierre = new Date(fechaCierre);

    function calc() {
      const diff = cierre.getTime() - Date.now();
      if (diff <= 0) {
        setRestante("Cerrado");
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      if (d > 0) setRestante(`${d}d ${h}h ${m}m`);
      else if (h > 0) setRestante(`${h}h ${m}m ${s}s`);
      else setRestante(`${m}m ${s}s`);
    }

    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [fechaCierre]);

  if (!restante || restante === "Cerrado") return null;

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      padding: "10px 16px", marginBottom: 12,
      background: "rgba(201,168,76,0.06)",
      border: "1px solid rgba(201,168,76,0.2)",
      borderRadius: 8,
    }}>
      <span style={{ fontSize: 14 }}>⏱</span>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: 11, color: "var(--texto-suave)", marginBottom: 2 }}>Cierra en</p>
        <p style={{ fontSize: 18, fontWeight: 800, color: "var(--oro)", letterSpacing: "0.04em", lineHeight: 1 }}>
          {restante}
        </p>
      </div>
    </div>
  );
}
