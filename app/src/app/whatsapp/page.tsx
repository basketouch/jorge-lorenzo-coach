"use client";

import { useRef, useState } from "react";
import Footer from "@/components/Footer";
import NavHamburger from "@/components/NavHamburger";
import { NAV_LINKS } from "@/lib/nav-links";
import { WHATSAPP_CONSENT_TEXT } from "@/lib/whatsapp-consent";

export default function WhatsappPage() {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [website, setWebsite] = useState(""); // honeypot: solo lo rellenan los bots
  const [acepta, setAcepta] = useState(true);
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const renderedAt = useRef(Date.now());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!acepta) {
      setError("Marca la casilla para que podamos escribirte por WhatsApp.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/whatsapp/alta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, apellidos, email, telefono, acepta, website, renderedAt: renderedAt.current }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || "Ha habido un problema. Inténtalo de nuevo.");
      }
      setEnviado(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Ha habido un problema. Inténtalo de nuevo.");
    }
    setLoading(false);
  }

  return (
    <>
      <nav>
        <a href="/" className="nav-logo">Jorge <span>Lorenzo</span></a>
        <div className="nav-links">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
          ))}
          <a href="/login" className="nav-cta">Iniciar sesión</a>
        </div>
        <NavHamburger links={[...NAV_LINKS, { label: "Iniciar sesión", href: "/login" }]} />
      </nav>

      <div style={{ paddingTop: 64, background: "var(--oscuro)", borderBottom: "1px solid var(--borde)" }}>
        <div className="container" style={{ paddingTop: 72, paddingBottom: 56 }}>
          <p className="section-label">Avisos por WhatsApp</p>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", maxWidth: 680, lineHeight: 1.15, marginBottom: 20 }}>
            Las novedades, directas a tu móvil
          </h1>
          <p style={{ fontSize: 18, color: "var(--texto-suave)", maxWidth: 560, lineHeight: 1.7 }}>
            Déjame tu WhatsApp y te aviso cuando haya contenido nuevo o algo que merezca la pena.
            Pocos mensajes y siempre con algo útil.
          </p>
        </div>
      </div>

      <section style={{ paddingTop: 56, paddingBottom: 100 }}>
        <div className="container">
          {enviado ? (
            <div style={{
              background: "linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.04))",
              border: "1px solid rgba(201,168,76,0.4)",
              borderRadius: 12, padding: "40px 32px", textAlign: "center", maxWidth: 520,
            }}>
              <h3 style={{ marginBottom: 12 }}>Ya estás apuntado</h3>
              <p style={{ color: "var(--texto-suave)", fontSize: 15 }}>
                Te escribiré por WhatsApp solo cuando tenga algo que merezca la pena.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 520 }}>
              {/* Honeypot anti-spam: invisible para personas, los bots de formularios suelen rellenarlo */}
              <input
                type="text"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
              />
              <div className="whatsapp-names" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <input type="text" placeholder="Tu nombre" aria-label="Nombre" autoComplete="given-name" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={inputStyle} />
                <input type="text" placeholder="Apellidos" aria-label="Apellidos" autoComplete="family-name" value={apellidos} onChange={(e) => setApellidos(e.target.value)} style={inputStyle} />
              </div>
              <input type="email" placeholder="Tu email" aria-label="Email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
              <div>
                <input type="tel" placeholder="Tu móvil, por ejemplo +34 600 111 222" aria-label="Móvil" autoComplete="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} required style={inputStyle} />
                <p style={{ fontSize: 12, color: "var(--texto-suave)", marginTop: 6 }}>Con el prefijo de tu país si no es España.</p>
              </div>

              <label style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={acepta}
                  onChange={(e) => setAcepta(e.target.checked)}
                  style={{ marginTop: 3, accentColor: "var(--oro)", flexShrink: 0 }}
                />
                <span style={{ fontSize: 13, color: "var(--texto-suave)", lineHeight: 1.5 }}>
                  {WHATSAPP_CONSENT_TEXT}{" "}
                  <a href="/privacidad" style={{ color: "var(--oro)" }}>Política de privacidad</a>.
                </span>
              </label>

              {error && <p role="alert" style={{ color: "#e05c5c", fontSize: 14 }}>{error}</p>}

              <button type="submit" disabled={loading} className="btn-primary" style={{ border: "none", cursor: "pointer", fontSize: 15, padding: "14px 28px" }}>
                {loading ? "..." : "Apuntarme →"}
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 560px) {
          .whatsapp-names {
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
