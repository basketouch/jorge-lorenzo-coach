"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: "◉" },
  { href: "/admin/usuarios", label: "Usuarios", icon: "👥" },
  { href: "/admin/cursos", label: "Contenido", icon: "📚" },
  { href: "/admin/ventas", label: "Ventas", icon: "💳" },
  { href: "/admin/marketing", label: "Marketing", icon: "📧" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);
  const [esMobil, setEsMobil] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const check = () => setEsMobil(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Cerrar al navegar en móvil
  useEffect(() => {
    if (esMobil) setAbierto(false);
  }, [pathname, esMobil]);

  const sidebarVisible = !esMobil || abierto;

  return (
    <>
      {/* Botón hamburguesa — solo móvil */}
      {esMobil && (
        <button
          onClick={() => setAbierto(!abierto)}
          aria-label="Menú admin"
          style={{
            position: "fixed", top: 12, left: 12,
            zIndex: 120,
            background: "var(--card)", border: "1px solid var(--borde)",
            borderRadius: 6, cursor: "pointer",
            padding: "7px 10px",
            display: "flex", flexDirection: "column", gap: 4,
            alignItems: "center", justifyContent: "center",
          }}
        >
          <span style={{ display: "block", width: 18, height: 1.5, background: abierto ? "var(--oro)" : "var(--texto)", transition: "background 0.2s" }} />
          <span style={{ display: "block", width: 18, height: 1.5, background: abierto ? "var(--oro)" : "var(--texto)", transition: "background 0.2s" }} />
          <span style={{ display: "block", width: 18, height: 1.5, background: abierto ? "var(--oro)" : "var(--texto)", transition: "background 0.2s" }} />
        </button>
      )}

      {/* Fondo oscuro — solo móvil cuando abierto */}
      {esMobil && abierto && (
        <div
          onClick={() => setAbierto(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 90,
            background: "rgba(0,0,0,0.65)",
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        style={{
          width: 240, flexShrink: 0,
          background: "var(--oscuro)",
          borderRight: "1px solid var(--borde)",
          display: "flex", flexDirection: "column",
          position: "fixed", top: 0, left: 0, bottom: 0,
          zIndex: 100,
          transform: esMobil ? (abierto ? "translateX(0)" : "translateX(-100%)") : "translateX(0)",
          transition: "transform 0.25s ease",
        }}
      >
        {/* Logo */}
        <div style={{ padding: "28px 24px 20px", borderBottom: "1px solid var(--borde)" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--blanco)" }}>
              Jorge <span style={{ color: "var(--oro)" }}>Lorenzo</span>
            </span>
          </a>
          <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--oro)", display: "inline-block" }} />
            <span style={{ fontSize: 11, color: "var(--texto-suave)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Panel Admin</span>
          </div>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, padding: "16px 0", display: "flex", flexDirection: "column" }}>
          {navLinks.map(({ href, label, icon }) => {
            const activo = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <a key={href} href={href} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 24px", textDecoration: "none",
                fontSize: 14, fontWeight: activo ? 700 : 500,
                color: activo ? "var(--oro)" : "var(--texto-suave)",
                background: activo ? "rgba(201,168,76,0.08)" : "transparent",
                borderRight: activo ? "2px solid var(--oro)" : "2px solid transparent",
                transition: "all 0.15s",
              }}>
                <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{icon}</span>
                <span>{label}</span>
              </a>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: "20px 24px", borderTop: "1px solid var(--borde)", display: "flex", flexDirection: "column", gap: 10 }}>
          <a href="/cuenta" style={{
            display: "flex", alignItems: "center", gap: 8,
            textDecoration: "none", fontSize: 13, color: "var(--texto-suave)",
            transition: "color 0.15s", padding: "6px 0",
          }}>
            <span>←</span> Mis cursos
          </a>
          <form action="/api/logout" method="post">
            <button type="submit" style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 13, color: "var(--texto-suave)", padding: 0,
              fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8,
            }}>
              <span>⏻</span> Salir
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
