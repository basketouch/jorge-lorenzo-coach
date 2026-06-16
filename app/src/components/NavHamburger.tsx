"use client";

import { useState, useEffect, useRef } from "react";

interface Props {
  links: { label: string; href: string }[];
  mostrarSalir?: boolean;
}

export default function NavHamburger({ links, mostrarSalir }: Props) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function onClickFuera(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    }
    if (abierto) document.addEventListener("mousedown", onClickFuera);
    return () => document.removeEventListener("mousedown", onClickFuera);
  }, [abierto]);

  return (
    <div ref={ref} className="nav-hamburger" style={{ position: "relative" }}>
      <button
        onClick={() => setAbierto(!abierto)}
        aria-label="Menú"
        style={{
          background: "none", border: "1px solid var(--borde)",
          borderRadius: 6, cursor: "pointer",
          padding: "6px 10px",
          display: "flex", flexDirection: "column", gap: 4,
          alignItems: "center", justifyContent: "center",
        }}
      >
        <span style={{
          display: "block", width: 18, height: 1.5,
          background: abierto ? "var(--oro)" : "var(--texto)",
          transition: "background 0.2s",
        }} />
        <span style={{
          display: "block", width: 18, height: 1.5,
          background: abierto ? "var(--oro)" : "var(--texto)",
          transition: "background 0.2s",
        }} />
        <span style={{
          display: "block", width: 18, height: 1.5,
          background: abierto ? "var(--oro)" : "var(--texto)",
          transition: "background 0.2s",
        }} />
      </button>

      {abierto && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", right: 0,
          minWidth: 180,
          background: "var(--card)",
          border: "1px solid var(--borde)",
          borderRadius: 8,
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          overflow: "hidden",
          zIndex: 200,
        }}>
          {links.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={() => setAbierto(false)}
              style={{
                display: "block",
                padding: "14px 20px",
                fontSize: 14,
                color: "var(--texto)",
                textDecoration: "none",
                borderBottom: "1px solid var(--borde)",
              }}
            >
              {label}
            </a>
          ))}

          {mostrarSalir && (
            <form action="/api/logout" method="post">
              <button
                type="submit"
                style={{
                  display: "block", width: "100%",
                  padding: "14px 20px",
                  fontSize: 14, textAlign: "left",
                  color: "var(--texto-suave)",
                  background: "none", border: "none",
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Salir →
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
