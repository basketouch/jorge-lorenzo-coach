"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import NavHamburger from "@/components/NavHamburger";
import { NAV_LINKS } from "@/lib/nav-links";

export default function NewsletterPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [optIn, setOptIn] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!optIn) {
      setError("Debes aceptar los términos para suscribirte.");
      return;
    }
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("NOMBRE", nombre.trim());
    formData.append("EMAIL", email.trim());
    formData.append("OPT_IN", "1");
    formData.append("email_address_check", "");
    formData.append("locale", "es");

    try {
      await fetch(
        "https://1e22ccbe.sibforms.com/serve/MUIFAIn_ci491dm8pn03mxd_b-9fZEH3fsCwnRQ90taaO9VXkFSaRGdCeilLFzL5GjLwaVmLD1Fij7eC2I_P8XkHXbl9WmMkEmlBDJ5ou2udjYvpWGJ9v8v_wyoJkRoxNEhZm-OK903Ii8iyFWKZZGHLM8OWUeFluTrBilqQakEgAKd-1biT7adF-d8KOGPPEZ7uBCactPTmNYkO",
        { method: "POST", body: formData, mode: "no-cors" }
      );
      setEnviado(true);
    } catch {
      setError("Ha habido un problema. Inténtalo de nuevo.");
    }
    setLoading(false);
  }

  return (
    <>
      {/* NAV */}
      <nav>
        <a href="/" className="nav-logo">Jorge <span>Lorenzo</span></a>
        <div className="nav-links">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} className="nav-link" style={l.href === "/newsletter" ? { color: "var(--oro)" } : undefined}>{l.label}</a>
          ))}
          <a href="/login" className="nav-cta">Iniciar sesión</a>
        </div>
        <NavHamburger links={[...NAV_LINKS, { label: "Iniciar sesión", href: "/login" }]} />
      </nav>

      {/* HERO */}
      <div style={{
        paddingTop: 64,
        background: "var(--oscuro)",
        borderBottom: "1px solid var(--borde)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: "url(https://otsbpiukzftacmvmkajy.supabase.co/storage/v1/object/public/portadas/Court.png)",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.06,
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent, var(--oscuro))", zIndex: 1 }} />

        <div className="container" style={{ position: "relative", zIndex: 2, paddingTop: 72, paddingBottom: 72 }}>
          <p className="section-label">Newsletter semanal</p>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 54px)", maxWidth: 680, lineHeight: 1.15, marginBottom: 20 }}>
            ¿Harto de teoría que no<br />sirve en la pista?
          </h1>
          <p style={{ fontSize: 18, color: "var(--texto-suave)", maxWidth: 560, lineHeight: 1.7 }}>
            Cada semana, una idea concreta sobre baloncesto, liderazgo o gestión del entrenador.
            Directa. Con ejemplos reales. Sin relleno.
          </p>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <section style={{ paddingTop: 72, paddingBottom: 100 }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 420px",
            gap: 64,
            alignItems: "start",
          }}
          className="newsletter-grid"
          >

            {/* IZQUIERDA — Formulario */}
            <div>
              <p className="section-label">Únete gratis</p>
              <h2 style={{ marginBottom: 12 }}>Una carta, una idea, una vez por semana</h2>
              <p style={{ color: "var(--texto-suave)", marginBottom: 32, fontSize: 15, lineHeight: 1.7 }}>
                Comparto lo que aprendo — en la pista con mis equipos, revisando vídeos de la élite mundial,
                o gestionando situaciones reales de vestuario. Sin padrinos, sin patrocinadores.
                Solo baloncesto.
              </p>

              {/* Puntos clave */}
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 14, marginBottom: 40 }}>
                {[
                  "Análisis táctico y técnico a todos los niveles",
                  "Gestión del entrenador: liderazgo, presión y comunicación",
                  "Recursos y herramientas que uso con mis equipos",
                ].map((item) => (
                  <li key={item} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 15, color: "var(--texto-suave)", lineHeight: 1.5 }}>
                    <span style={{ color: "var(--oro)", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>→</span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* FORMULARIO */}
              {enviado ? (
                <div style={{
                  background: "linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.04))",
                  border: "1px solid rgba(201,168,76,0.4)",
                  borderRadius: 12, padding: "40px 32px", textAlign: "center",
                }}>
                  <p style={{ fontSize: 36, marginBottom: 16 }}>📬</p>
                  <h3 style={{ marginBottom: 12 }}>Ya estás dentro</h3>
                  <p style={{ color: "var(--texto-suave)", fontSize: 15 }}>
                    Revisa tu email — te he enviado un mensaje de bienvenida con un pequeño regalo.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 460 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                      style={inputStyle}
                    />
                    <input
                      type="email"
                      placeholder="Tu email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={inputStyle}
                    />
                  </div>

                  <label style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={optIn}
                      onChange={(e) => setOptIn(e.target.checked)}
                      style={{ marginTop: 3, accentColor: "var(--oro)", flexShrink: 0 }}
                    />
                    <span style={{ fontSize: 13, color: "var(--texto-suave)", lineHeight: 1.5 }}>
                      Acepto recibir la newsletter y los{" "}
                      <a
                        href="/pages/aceptacion-de-terminos-y-condiciones"
                        style={{ color: "var(--oro)" }}
                      >
                        términos y condiciones
                      </a>
                      .
                    </span>
                  </label>

                  {error && <p style={{ color: "#e05c5c", fontSize: 14 }}>{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{ border: "none", cursor: "pointer", fontSize: 15, padding: "14px 28px" }}
                  >
                    {loading ? "..." : "Suscribirme gratis →"}
                  </button>

                  <p style={{ fontSize: 12, color: "var(--texto-suave)" }}>
                    Sin spam. Baja cuando quieras.
                  </p>
                </form>
              )}

              {/* Saber más */}
              <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--borde)" }}>
                <p style={{ fontSize: 13, color: "var(--texto-suave)", marginBottom: 8 }}>¿Quién es Jorge Lorenzo?</p>
                <a
                  href="/historia"
                  style={{ color: "var(--oro)", fontWeight: 600, fontSize: 14, textDecoration: "none" }}
                >
                  Lee su historia →
                </a>
              </div>
            </div>

            {/* DERECHA — Foto */}
            <div style={{ position: "sticky", top: 100 }}>
              <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--borde)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://newsletter.jorgelorenzo.coach/Con_Pau_Gasol.JPG"
                  alt="Jorge Lorenzo con Pau Gasol"
                  style={{ width: "100%", display: "block", objectFit: "cover" }}
                />
              </div>
              <p style={{ fontSize: 12, color: "var(--texto-suave)", marginTop: 10, textAlign: "center" }}>
                Con Pau Gasol · Selección Española
              </p>

              {/* Stats */}
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr",
                gap: 12, marginTop: 24,
              }}>
                {[
                  { valor: "2x", etiqueta: "Campeón del Mundo y Eurobasket" },
                  { valor: "6", etiqueta: "Competiciones FIBA" },
                  { valor: "8", etiqueta: "Años en la Selección" },
                  { valor: "16+", etiqueta: "Años como entrenador" },
                ].map(({ valor, etiqueta }) => (
                  <div key={etiqueta} style={{
                    background: "var(--card)", border: "1px solid var(--borde)",
                    borderRadius: 8, padding: "16px 14px", textAlign: "center",
                  }}>
                    <p style={{ fontSize: 22, fontWeight: 800, color: "var(--oro)", marginBottom: 4 }}>{valor}</p>
                    <p style={{ fontSize: 11, color: "var(--texto-suave)", lineHeight: 1.3 }}>{etiqueta}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TEMAS */}
      <section style={{ paddingBottom: 80, borderTop: "1px solid var(--borde)", paddingTop: 64 }}>
        <div className="container">
          <p className="section-label">De qué va esto</p>
          <h2 style={{ marginBottom: 40 }}>Temas recientes</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {[
              {
                numero: "01",
                titulo: "Puntos clave del Scouting",
                descripcion: "Cómo preparamos el análisis de rivales en la Selección. Qué miramos, qué ignoramos y por qué.",
              },
              {
                numero: "02",
                titulo: "Liderazgo del entrenador",
                descripcion: "De la pizarra al día a día. La diferencia entre el entrenador que dirige y el que lidera.",
              },
              {
                numero: "03",
                titulo: "Defensa del bloqueo directo",
                descripcion: "Cinco conceptos del Eurobasket que puedes aplicar esta semana en tu entrenamiento.",
              },
            ].map(({ numero, titulo, descripcion }) => (
              <div key={numero} style={{
                background: "var(--card)", border: "1px solid var(--borde)",
                borderRadius: 10, padding: "24px 22px",
              }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: "var(--oro)", marginBottom: 10 }}>
                  #{numero}
                </p>
                <p style={{ fontSize: 16, fontWeight: 700, color: "var(--blanco)", marginBottom: 8 }}>{titulo}</p>
                <p style={{ fontSize: 13, color: "var(--texto-suave)", lineHeight: 1.6 }}>{descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .newsletter-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}

const inputStyle: React.CSSProperties = {
  background: "var(--card)", border: "1px solid var(--borde)",
  borderRadius: 6, padding: "12px 16px",
  color: "var(--texto)", fontSize: 15, fontFamily: "inherit",
  outline: "none", width: "100%", boxSizing: "border-box",
};
