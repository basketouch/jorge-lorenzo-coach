import { ImageResponse } from "next/og";

// Imagen al compartir el enlace (WhatsApp, Instagram, X…). Sin precio: vale para las tres fases.
export function renderBlackFridayImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#090909", color: "#f7f4ec", padding: "64px 72px", borderLeft: "14px solid #d8b33f" }}>
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 8, fontWeight: 700, color: "#aaa79f" }}>
          JORGE&nbsp;<span style={{ color: "#d8b33f" }}>LORENZO</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 34, letterSpacing: 6, fontWeight: 700, color: "#d8b33f" }}>BLACK FRIDAY · 27–30 DE NOVIEMBRE</div>
          <div style={{ display: "flex", fontSize: 96, fontWeight: 800, lineHeight: 1.02, marginTop: 22 }}>El Laboratorio del Entrenador</div>
        </div>
        <div style={{ display: "flex", fontSize: 38, color: "#bcb8af" }}>Todo el Laboratorio. Para siempre.</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
