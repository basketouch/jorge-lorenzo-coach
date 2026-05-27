"use client";

import { useState, useEffect } from "react";

interface Props {
  sidebar: React.ReactNode;
  player: React.ReactNode;
  header: React.ReactNode;
}

export default function PlayerLayout({ sidebar, player, header }: Props) {
  const [esMobil, setEsMobil] = useState(false);
  const [sidebarAbierto, setSidebarAbierto] = useState(true);

  useEffect(() => {
    const check = () => {
      const mobil = window.innerWidth < 768;
      setEsMobil(mobil);
      if (mobil) setSidebarAbierto(false);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div style={{
      display: "grid",
      gridTemplateRows: "56px 1fr",
      gridTemplateColumns: esMobil ? "1fr" : (sidebarAbierto ? "280px 1fr" : "0px 1fr"),
      height: "100dvh",
      overflow: "hidden",
      transition: "grid-template-columns 0.25s ease",
    }}>
      {/* HEADER */}
      <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center" }}>
        <div style={{ flex: 1, height: "100%" }}>
          {header}
        </div>
      </div>

      {/* SIDEBAR — desktop: columna fija | móvil: overlay */}
      {!esMobil && (
        <div style={{ position: "relative", overflow: "hidden", transition: "opacity 0.2s", opacity: sidebarAbierto ? 1 : 0 }}>
          {sidebar}
          <button
            onClick={() => setSidebarAbierto(false)}
            title="Ocultar temario"
            style={{
              position: "absolute", top: 0, right: 0,
              width: 18, height: 48,
              background: "var(--borde)", border: "none",
              borderRadius: "0 0 0 4px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--texto-suave)", fontSize: 10, zIndex: 10,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--oro)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--borde)")}
          >
            ‹
          </button>
        </div>
      )}

      {/* Overlay móvil */}
      {esMobil && sidebarAbierto && (
        <>
          {/* Fondo oscuro */}
          <div
            onClick={() => setSidebarAbierto(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 40,
              background: "rgba(0,0,0,0.6)",
              top: 56,
            }}
          />
          {/* Drawer lateral */}
          <div style={{
            position: "fixed", top: 56, left: 0, bottom: 0,
            width: "82%", maxWidth: 320,
            zIndex: 50,
            overflowY: "auto",
            boxShadow: "4px 0 24px rgba(0,0,0,0.5)",
          }}>
            {sidebar}
          </div>
        </>
      )}

      {/* PLAYER */}
      <div style={{ overflowY: "auto", height: "100%", position: "relative", gridColumn: esMobil ? "1 / -1" : undefined }}>
        {/* Botón abrir sidebar (desktop cerrado) */}
        {!esMobil && !sidebarAbierto && (
          <button
            onClick={() => setSidebarAbierto(true)}
            title="Ver temario"
            style={{
              position: "absolute", top: 0, left: 0,
              width: 18, height: 48,
              background: "var(--borde)", border: "none",
              borderRadius: "0 0 4px 0", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--texto-suave)", fontSize: 10, zIndex: 10,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--oro)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--borde)")}
          >
            ›
          </button>
        )}

        {/* Botón hamburguesa móvil — abre sidebar */}
        {esMobil && !sidebarAbierto && (
          <button
            onClick={() => setSidebarAbierto(true)}
            title="Ver temario"
            style={{
              position: "absolute", top: 8, left: 8,
              padding: "6px 10px",
              background: "var(--card)", border: "1px solid var(--borde)",
              borderRadius: 6, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
              color: "var(--texto-suave)", fontSize: 11,
              zIndex: 10,
            }}
          >
            ☰ Temario
          </button>
        )}

        {player}
      </div>
    </div>
  );
}
