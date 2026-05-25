export const metadata = {
  title: "Pre-Season Tours — Jorge Lorenzo Coach",
  description: "Bring your college basketball program to Spain for elite training, matches against top-tier European competition, and unforgettable cultural experiences.",
};

export default function Stages() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--negro)",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Header */}
      <header style={{ position: "relative", zIndex: 1, padding: "32px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/" style={{ fontSize: 18, fontWeight: 800, letterSpacing: "0.05em", color: "var(--blanco)", textDecoration: "none" }}>
          JORGE <span style={{ color: "var(--oro)" }}>LORENZO</span>
        </a>
        <a href="/" style={{ fontSize: 13, color: "var(--texto-suave)", textDecoration: "none" }}>
          ← Back to home
        </a>
      </header>

      {/* Hero */}
      <section style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "80px 40px 60px", position: "relative", zIndex: 1,
      }}>
        <div style={{ maxWidth: 720, width: "100%", textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(32px, 6vw, 58px)", lineHeight: 1.1, marginBottom: 24, fontWeight: 900 }}>
            Pre-Season Tours<br />
            <span style={{ color: "var(--oro)" }}>in Spain</span>
          </h1>
          <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "var(--texto-suave)", lineHeight: 1.7, marginBottom: 40, maxWidth: 600, margin: "0 auto 40px" }}>
            Bring your college basketball program to Spain for elite training, matches against top-tier European competition, and unforgettable cultural experiences with world-class coaching.
          </p>
        </div>
      </section>

      {/* Features */}
      <section style={{ position: "relative", zIndex: 1, padding: "60px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 32,
            marginBottom: 60,
          }}>
            {[
              { title: "Elite Competition", desc: "Face off against top Spanish and European teams with professional-level competition." },
              { title: "Expert Coaching", desc: "Learn from Jorge Lorenzo and his team of world-class coaches with European Championships experience." },
              { title: "Training Facilities", desc: "Access world-class training facilities and courts used by Spain's national teams." },
              { title: "Cultural Immersion", desc: "Experience Spain's rich basketball culture, history, and world-class hospitality." },
              { title: "Custom Programs", desc: "Tailored coaching clinics and training programs designed for your team's needs." },
              { title: "Professional Network", desc: "Connect with European basketball coaches and scouts from elite clubs." },
            ].map((item, i) => (
              <div key={i} style={{
                background: "var(--card)",
                border: "1px solid var(--borde)",
                borderRadius: 10,
                padding: 32,
              }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: "var(--oro)" }}>{item.title}</h3>
                <p style={{ color: "var(--texto-suave)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section style={{ position: "relative", zIndex: 1, padding: "60px 40px", background: "var(--card)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 40, textAlign: "center" }}>What's Included</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
            <div>
              <h3 style={{ color: "var(--oro)", marginBottom: 16, fontSize: 18, fontWeight: 700 }}>Training Program</h3>
              <ul style={{ listStyle: "none" }}>
                {[
                  "Daily coaching clinics",
                  "Full-court practice sessions",
                  "Defensive techniques & systems",
                  "Offensive strategy & spacing",
                  "High-level match play",
                  "Video analysis sessions",
                ].map((item, i) => (
                  <li key={i} style={{ paddingBottom: 12, color: "var(--texto-suave)" }}>✓ {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 style={{ color: "var(--oro)", marginBottom: 16, fontSize: 18, fontWeight: 700 }}>Experience</h3>
              <ul style={{ listStyle: "none" }}>
                {[
                  "Accommodation in Spain",
                  "Meals & transportation",
                  "Cultural tours",
                  "Match tickets",
                  "Team merchandise",
                  "Certificate of participation",
                ].map((item, i) => (
                  <li key={i} style={{ paddingBottom: 12, color: "var(--texto-suave)" }}>✓ {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: "relative", zIndex: 1, padding: "80px 40px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 24 }}>Ready to Transform Your Program?</h2>
          <p style={{ color: "var(--texto-suave)", marginBottom: 32, lineHeight: 1.7 }}>
            Whether you're looking for a pre-season conditioning camp, competitive matches, or specialized coaching clinics, we'll create a custom experience for your team.
          </p>
          <a href="mailto:coach@jorgelorenzospain.com?subject=Pre-Season%20Tours%20Inquiry" style={{
            display: "inline-block",
            background: "var(--oro)",
            color: "var(--negro)",
            padding: "14px 40px",
            borderRadius: 4,
            textDecoration: "none",
            fontWeight: 700,
            fontSize: 14,
            transition: "all 0.2s",
            border: "2px solid var(--oro)",
            cursor: "pointer",
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            Request Your Custom Program
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: "relative", zIndex: 1, padding: "24px 40px", textAlign: "center", borderTop: "1px solid var(--borde)" }}>
        <p style={{ fontSize: 12, color: "var(--texto-suave)" }}>
          © {new Date().getFullYear()} Jorge Lorenzo Coach · Campeón del Mundo · Campeón de Europa
        </p>
      </footer>

    </div>
  );
}
