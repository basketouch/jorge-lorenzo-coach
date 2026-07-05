export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--borde)", padding: "32px 0" }}>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <p style={{ fontSize: 13, color: "var(--texto-suave)" }}>
          © 2025 Jorge Lorenzo · Comunidad de Entrenadores · Baloncesto
        </p>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <a
            href="/bio"
            style={{ fontSize: 13, color: "var(--texto-suave)", textDecoration: "none", borderBottom: "1px solid var(--borde)", paddingBottom: 1 }}
          >
            Bio &amp; enlaces
          </a>
          <a
            href="/pages/aceptacion-de-terminos-y-condiciones"
            style={{ fontSize: 13, color: "var(--texto-suave)", textDecoration: "none", borderBottom: "1px solid var(--borde)", paddingBottom: 1 }}
          >
            Términos y condiciones
          </a>
        </div>
      </div>
    </footer>
  );
}
