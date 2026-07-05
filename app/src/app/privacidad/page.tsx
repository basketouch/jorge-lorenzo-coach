import { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Política de Privacidad — Jorge Lorenzo",
};

export default function PrivacidadPage() {
  return (
    <>
      <nav>
        <a href="/" className="nav-logo">Jorge <span>Lorenzo</span></a>
        <div className="nav-links">
          <a href="/#niveles" className="nav-link">Comunidad</a>
          <a href="/cursos/laboratorio-2526" className="nav-link">El Laboratorio</a>
          <a href="/newsletter" className="nav-link">Newsletter</a>
          <a href="/login" className="nav-cta">Iniciar sesión</a>
        </div>
      </nav>

      <div style={{ paddingTop: 64 }}>
        <div className="container" style={{ maxWidth: 740, paddingTop: 64, paddingBottom: 100 }}>
          <a href="/" style={{ color: "var(--texto-suave)", fontSize: 13, textDecoration: "none", display: "inline-block", marginBottom: 32 }}>
            ← Volver
          </a>

          <p className="section-label">Legal</p>
          <h1 style={{ marginBottom: 48 }}>Política de Privacidad</h1>

          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>

            <section>
              <h2 style={h2Style}>1. Responsable del tratamiento</h2>
              <p style={pStyle}>
                <strong style={{ color: "var(--blanco)" }}>Basketouch Solutions Spain, SL</strong>, con domicilio en C\ Padre Arintero, nº17-2º, CP: 33400 - Avilés (Asturias), y CIF: B52575107, es el responsable del tratamiento de los datos personales recogidos en <a href="https://www.jorgelorenzo.coach" style={linkStyle}>www.jorgelorenzo.coach</a>.
              </p>
            </section>

            <section>
              <h2 style={h2Style}>2. Datos que recogemos</h2>
              <p style={{ ...pStyle, marginBottom: 12 }}>Recogemos los siguientes datos personales:</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "Nombre y apellidos",
                  "Dirección de correo electrónico",
                  "Datos de pago (gestionados por Paddle, procesador de pagos externo)",
                  "Datos de navegación e interacción con la plataforma",
                ].map((item) => (
                  <li key={item} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 15, color: "var(--texto-suave)", lineHeight: 1.7 }}>
                    <span style={{ color: "var(--oro)", flexShrink: 0, marginTop: 2 }}>→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 style={h2Style}>3. Finalidad del tratamiento</h2>
              <p style={{ ...pStyle, marginBottom: 12 }}>Utilizamos tus datos para:</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "Gestionar el acceso a los cursos y contenidos adquiridos.",
                  "Enviarte comunicaciones relacionadas con tu cuenta y los servicios contratados.",
                  "Enviarte comunicaciones comerciales y de marketing, previa aceptación.",
                  "Cumplir con nuestras obligaciones legales y fiscales.",
                ].map((item) => (
                  <li key={item} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 15, color: "var(--texto-suave)", lineHeight: 1.7 }}>
                    <span style={{ color: "var(--oro)", flexShrink: 0, marginTop: 2 }}>→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 style={h2Style}>4. Base jurídica</h2>
              <p style={pStyle}>
                El tratamiento de tus datos se basa en la ejecución del contrato de compraventa o acceso a los servicios, el cumplimiento de obligaciones legales, y el consentimiento que nos otorgas al registrarte y aceptar estas políticas.
              </p>
            </section>

            <section>
              <h2 style={h2Style}>5. Conservación de los datos</h2>
              <p style={pStyle}>
                Conservaremos tus datos mientras mantengas una relación activa con nosotros y, posteriormente, durante los plazos legalmente exigidos para el cumplimiento de obligaciones fiscales y mercantiles.
              </p>
            </section>

            <section>
              <h2 style={h2Style}>6. Destinatarios</h2>
              <p style={pStyle}>
                No cedemos tus datos a terceros salvo obligación legal. Trabajamos con proveedores de servicios (procesadores de pago, plataformas de email) que actúan como encargados del tratamiento bajo acuerdos de confidencialidad conformes al RGPD.
              </p>
            </section>

            <section>
              <h2 style={h2Style}>7. Tus derechos</h2>
              <p style={{ ...pStyle, marginBottom: 12 }}>Puedes ejercer los siguientes derechos escribiendo a <a href="mailto:basketouch@gmail.com" style={linkStyle}>basketouch@gmail.com</a>:</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "Acceso a tus datos personales.",
                  "Rectificación de datos inexactos.",
                  "Supresión de tus datos cuando ya no sean necesarios.",
                  "Oposición y limitación del tratamiento.",
                  "Portabilidad de los datos.",
                ].map((item) => (
                  <li key={item} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 15, color: "var(--texto-suave)", lineHeight: 1.7 }}>
                    <span style={{ color: "var(--oro)", flexShrink: 0, marginTop: 2 }}>→</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p style={{ ...pStyle, marginTop: 16 }}>
                También tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD).
              </p>
            </section>

            <section>
              <h2 style={h2Style}>8. Seguridad</h2>
              <p style={pStyle}>
                Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos frente a accesos no autorizados, pérdida o destrucción accidental.
              </p>
            </section>

          </div>

          <p style={{ fontSize: 12, color: "var(--texto-suave)", marginTop: 48 }}>
            Última actualización: julio 2025
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}

const h2Style: React.CSSProperties = {
  fontSize: 17, fontWeight: 700, color: "var(--blanco)", marginBottom: 12,
};

const pStyle: React.CSSProperties = {
  color: "var(--texto-suave)", fontSize: 15, lineHeight: 1.8, marginBottom: 0,
};

const linkStyle: React.CSSProperties = {
  color: "var(--oro)", textDecoration: "none",
};
