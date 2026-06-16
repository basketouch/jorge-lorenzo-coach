"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import NavHamburger from "@/components/NavHamburger";

const NAV_LINKS = [
  { label: "Comunidad", href: "/#niveles" },
  { label: "El Laboratorio", href: "/cursos/laboratorio-2526" },
  { label: "Drill Lab", href: "/drills" },
  { label: "English Coach", href: "/english" },
  { label: "Newsletter", href: "/newsletter" },
];

export default function HistoriaPage() {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  return (
    <>
      {/* NAV */}
      <nav>
        <a href="/" className="nav-logo">Jorge <span>Lorenzo</span></a>
        <div className="nav-links">
          {NAV_LINKS.map(l => <a key={l.href} href={l.href} className="nav-link">{l.label}</a>)}
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
        <div className="container" style={{ position: "relative", zIndex: 2, paddingTop: 60, paddingBottom: 60 }}>
          <a href="/newsletter" style={{ color: "var(--texto-suave)", fontSize: 13, textDecoration: "none", display: "inline-block", marginBottom: 24 }}>
            ← Volver a Newsletter
          </a>
          <p className="section-label">Historia</p>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 44px)", maxWidth: 680, lineHeight: 1.2 }}>
            El chico que no hablaba<br />y fue Campeón del Mundo
          </h1>
        </div>
      </div>

      {/* CONTENIDO */}
      <article style={{ paddingTop: 64, paddingBottom: 100 }}>
        <div className="container" style={{ maxWidth: 760 }}>

          {/* Bloque 1: Hero con Copa */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 40, alignItems: "start", marginBottom: 48 }} className="historia-hero">
            <div>
              <p style={parrafoStyle}>Hola, soy Jorge.</p>
              <p style={parrafoStyle}>No te voy a soltar un currículum lleno de títulos ni una historia con fuegos artificiales. Solo te diré esto:</p>
              <p style={parrafoStyle}>He estado en muchas pistas. Algunas eran de baloncesto. Otras, de esas que no se ven.</p>
              <p style={parrafoStyle}>Cuando era más joven no hablaba mucho. De hecho, sigo sin hacerlo si no tengo nada que aportar. Pero cuando tengo algo que decir, lo comparto con intención, con claridad y con valor real.</p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://newsletter.jorgelorenzo.coach/Copa_vertical.png"
              alt="Jorge Lorenzo con la Copa del Mundo 2019"
              style={{ width: "100%", borderRadius: 8, display: "block" }}
            />
          </div>

          <div style={dividerStyle} />

          {/* Bloque 2: De dónde vengo */}
          <h2 style={h2Style}>De dónde vengo</h2>
          <p style={parrafoStyle}>Desde los 16 años soy entrenador de baloncesto. He trabajado con todas las categorías, desde alevines hasta senior. Con jugadores que me doblaban en edad. Con jugadoras. Con talento. Y con dudas. Con ganas. Y con miedo.</p>
          <p style={parrafoStyle}>El baloncesto me ha llevado a lugares que nunca imaginé. En 2019, en mi primer torneo con la Selección Española en categoría senior, <strong style={{ color: "var(--blanco)" }}>fuimos campeones del mundo</strong>. Desde entonces he tenido la suerte de vivir otras experiencias que no daba por sentadas: <strong style={{ color: "var(--blanco)" }}>campeón del Eurobasket 2022</strong>, participante en otro Mundial y dos Juegos Olímpicos, y entrenador en Angola, aprendiendo de culturas y baloncestos muy diferentes.</p>
          <p style={parrafoStyle}>Hoy sigo entrenando. Y sigo aprendiendo.</p>

          {/* Participaciones */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, margin: "24px 0 32px" }}>
            {[
              { año: "2019", evento: "Mundial", nota: "🥇 Campeones" },
              { año: "2021", evento: "JJOO Tokio", nota: "" },
              { año: "2022", evento: "Eurobasket", nota: "🥇 Campeones" },
              { año: "2023", evento: "Mundial", nota: "" },
              { año: "2024", evento: "JJOO París", nota: "" },
              { año: "2025", evento: "Eurobasket", nota: "" },
            ].map(({ año, evento, nota }) => (
              <div key={año + evento} style={{
                background: "var(--card)", border: nota ? "1px solid rgba(201,168,76,0.5)" : "1px solid var(--borde)",
                borderRadius: 8, padding: "10px 14px",
              }}>
                <p style={{ fontSize: 11, color: "var(--oro)", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 2 }}>{año}</p>
                <p style={{ fontSize: 13, color: "var(--blanco)", fontWeight: 600 }}>{evento}</p>
                {nota && <p style={{ fontSize: 11, color: "var(--oro)", marginTop: 2 }}>{nota}</p>}
              </div>
            ))}
          </div>

          {/* Imágenes Scariolo + Rudy */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "32px 0" }} className="img-row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://newsletter.jorgelorenzo.coach/Con_Scariolo.png" alt="Jorge Lorenzo con Scariolo, Eurobasket 2022"
              style={{ width: "100%", borderRadius: 8, aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://newsletter.jorgelorenzo.coach/Con_Rudy.png" alt="Jorge Lorenzo con Rudy Fernández"
              style={{ width: "100%", borderRadius: 8, aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
          </div>

          <div style={dividerStyle} />

          {/* Bloque 3: El camino */}
          <h2 style={h2Style}>El camino</h2>
          <p style={parrafoStyle}>Con el tiempo y gracias a internet, empecé a hacerme un pequeño nombre. Durante años me recorrí España. Campeonato tras campeonato. Desde Asturias, en mi coche, buscando siempre el hotel más barato.</p>
          <p style={parrafoStyle}>Vi a Porzingis cuando aún no era Porzingis. A Doncic lo vi crecer. Y entre viaje y viaje, fui creciendo yo también.</p>
          <p style={parrafoStyle}>Lo que más me hizo avanzar fue el contacto con otros entrenadores. Las charlas en la grada. Las conversaciones entre partidos. Ese networking, el de verdad —no el de postureo ni tarjetas—, fue clave. Porque muchas oportunidades llegaron así.</p>

          {/* Imagen Ricky Rubio */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://newsletter.jorgelorenzo.coach/Con_Ricky_Rubio.png"
            alt="Jorge Lorenzo con Ricky Rubio, Selección Española"
            style={{ width: "100%", borderRadius: 8, aspectRatio: "16/9", objectFit: "cover", display: "block", margin: "32px 0" }}
          />

          <div style={dividerStyle} />

          {/* Bloque 4: De qué te escribo */}
          <h2 style={h2Style}>De qué te escribo</h2>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
            {[
              "Lo que aprendí entrenando a jugadores que hoy están en lo más alto",
              "Cómo crear tu propio estilo como entrenador",
              "Qué funciona en pista y qué solo funciona en PowerPoint",
              "Cómo formarte sin perder el tiempo",
              "Por qué a veces el mayor paso en tu carrera no está en un título, sino en una conversación",
            ].map((item) => (
              <li key={item} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 15, color: "var(--texto-suave)", lineHeight: 1.6 }}>
                <span style={{ color: "var(--borde)", fontWeight: 700, flexShrink: 0, marginTop: 2 }}>—</span>
                {item}
              </li>
            ))}
          </ul>

          <div style={dividerStyle} />

          {/* Bloque 5: Tres promesas */}
          <h2 style={h2Style}>Tres promesas</h2>
          <ol style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
            {[
              "No hacerte perder el tiempo.",
              "Enviar solo contenido que me gustaría recibir si estuviera en tu lugar.",
              "Cuando venda algo, lo haré con la misma honestidad con la que entreno.",
            ].map((item, i) => (
              <li key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", fontSize: 15, color: "var(--texto-suave)", lineHeight: 1.6 }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: "var(--oro)", flexShrink: 0, lineHeight: 1.3 }}>{i + 1}</span>
                {item}
              </li>
            ))}
          </ol>

          {/* Trío de fotos FIBA */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, margin: "32px 0 8px" }}>
            {[
              { src: "https://newsletter.jorgelorenzo.coach/FIBA_China_2026.jpg", alt: "Jorge Lorenzo FIBA China 2026" },
              { src: "https://newsletter.jorgelorenzo.coach/FIBA_China_2026_b.jpg", alt: "Jorge Lorenzo dirigiendo en FIBA China 2026" },
              { src: "https://newsletter.jorgelorenzo.coach/FIBA_China_2026_c.jpg", alt: "Jorge Lorenzo entrenando en FIBA China 2026" },
            ].map(({ src, alt }) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt={alt}
                onClick={() => setLightboxSrc(src)}
                style={{
                  width: "100%", borderRadius: 6, aspectRatio: "3/2",
                  objectFit: "cover", display: "block", cursor: "pointer",
                  transition: "opacity 0.2s",
                }}
              />
            ))}
          </div>
          <p style={{ fontSize: 11, color: "var(--texto-suave)", textAlign: "center", marginBottom: 48, letterSpacing: "0.03em" }}>
            FIBA China Youth Training Partner Conference &amp; FIBA-BG Academy Annual Meeting 2026 · Con 600 entrenadores
          </p>

          {/* CTA */}
          <div style={{
            borderTop: "1px solid var(--borde)", borderBottom: "1px solid var(--borde)",
            padding: "40px 0", textAlign: "center",
          }}>
            <p style={{ fontSize: 17, color: "var(--texto)", marginBottom: 20 }}>
              Si todo esto te resuena, estás en el sitio correcto.
            </p>
            <a href="/newsletter" className="btn-primary" style={{ display: "inline-block" }}>
              Unirse a la lista →
            </a>
          </div>

        </div>
      </article>

      <Footer />

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          onClick={() => setLightboxSrc(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)",
            zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <span style={{ position: "absolute", top: 20, right: 28, color: "#fff", fontSize: 28, opacity: 0.7, lineHeight: 1 }}>✕</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightboxSrc} alt="" style={{ maxWidth: "92vw", maxHeight: "92vh", objectFit: "contain", display: "block" }} />
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .historia-hero { grid-template-columns: 1fr !important; }
          .img-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

const parrafoStyle: React.CSSProperties = {
  color: "var(--texto-suave)", fontSize: 15, lineHeight: 1.8, marginBottom: 14,
};

const h2Style: React.CSSProperties = {
  fontSize: 18, fontWeight: 700, color: "var(--blanco)", marginBottom: 16,
};

const dividerStyle: React.CSSProperties = {
  width: 32, height: 2, background: "var(--oro)", margin: "48px 0",
};
