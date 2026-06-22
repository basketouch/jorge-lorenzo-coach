import Footer from "@/components/Footer";
import NavHamburger from "@/components/NavHamburger";

export const metadata = {
  title: "Ejercicio: trabajo de bote — Jorge Lorenzo",
  description: "El ejercicio de trabajo de bote que comparte Jorge Lorenzo con su comunidad de entrenadores de baloncesto.",
};

const NAV_LINKS = [
  { label: "Comunidad", href: "/#niveles" },
  { label: "El Laboratorio", href: "/cursos/laboratorio-2526" },
  { label: "Drill Lab", href: "/drills" },
  { label: "English Coach", href: "/english" },
];

export default function VideoPage() {
  return (
    <>
      <nav>
        <a href="/" className="nav-logo">Jorge <span>Lorenzo</span></a>
        <div className="nav-links">
          {NAV_LINKS.map(l => <a key={l.href} href={l.href} className="nav-link">{l.label}</a>)}
          <a href="https://www.skool.com/jorge-lorenzo-coach/plans" target="_blank" rel="noopener noreferrer" className="nav-cta">Entra ahora</a>
        </div>
        <NavHamburger links={[...NAV_LINKS, { label: "Comunidad", href: "https://www.skool.com/jorge-lorenzo-coach/plans" }]} />
      </nav>

      <section style={{ paddingTop: 140, paddingBottom: 80, textAlign: "center" }}>
        <div className="container">
          <p className="section-label" style={{ textAlign: "center" }}>El ejercicio del bote</p>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "var(--blanco)",
            marginBottom: 16,
          }}>
            El ejercicio que te comentaba <span style={{ color: "var(--oro)" }}>por correo.</span>
          </h1>
          <p className="lead" style={{ margin: "0 auto 48px", textAlign: "center" }}>
            Así es como trabajamos el bote — uno de los muchos ejercicios que comparto cada semana dentro de la comunidad.
          </p>

          <div className="video-wrapper" style={{ maxWidth: 760, margin: "0 auto" }}>
            <iframe
              src="https://www.youtube.com/embed/T84wwvSadpA"
              title="Ejercicio: trabajo de bote — Jorge Lorenzo Coach"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <section style={{ borderTop: "1px solid var(--borde)", paddingTop: 80, paddingBottom: 80 }}>
        <div className="container">
          <p className="section-label">Dentro de la comunidad</p>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", marginBottom: 24 }}>Esto es solo una muestra.</h2>
          <p className="lead">Dentro de la comunidad encuentras ejercicios como este cada semana, además de:</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 40 }}>
            <div style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 10, padding: 28 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>🏀</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--blanco)", marginBottom: 8 }}>Drills</h3>
              <p style={{ fontSize: 14, color: "var(--texto-suave)", lineHeight: 1.6 }}>
                169 ejercicios organizados por capítulo, categoría y nivel, con contexto real de aplicación en pista.
              </p>
              <a href="/drills" className="btn-secondary" style={{ marginTop: 16, display: "inline-block" }}>Ver la biblioteca</a>
            </div>
            <div style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 10, padding: 28, position: "relative", opacity: 0.85 }}>
              <div style={{ position: "absolute", top: -10, right: 20, background: "var(--oro)", color: "var(--negro)", fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 20 }}>
                Próximamente
              </div>
              <div style={{ fontSize: 28, marginBottom: 12 }}>🗣️</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--blanco)", marginBottom: 8 }}>English Coach</h3>
              <p style={{ fontSize: 14, color: "var(--texto-suave)", lineHeight: 1.6 }}>
                Vocabulario y comunicación en inglés para entrenadores — pensado para clinics, vestuarios y entornos internacionales.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ borderTop: "1px solid var(--borde)", paddingTop: 80, paddingBottom: 80 }}>
        <div className="container">
          <p className="section-label">Comunidad + Laboratorio del Entrenador</p>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", marginBottom: 24 }}>Únete y accede a todo el contenido.</h2>

          <div className="laboratorio-box" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 40, flexWrap: "wrap", border: "1px solid var(--oro)" }}>
            <p style={{ fontSize: 16, color: "var(--texto-suave)", lineHeight: 1.7, maxWidth: 480 }}>
              Comunidad privada de entrenadores y el Laboratorio del Entrenador: drills, sistemas, charlas de gestión y mucho más, cada semana.
            </p>
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <a href="https://www.skool.com/jorge-lorenzo-coach/plans" target="_blank" rel="noopener noreferrer" className="btn-primary">Entra a la comunidad</a>
              <p style={{ marginTop: 16 }}>
                <a href="/cursos/laboratorio-2526" className="btn-secondary">Ver el Laboratorio</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
