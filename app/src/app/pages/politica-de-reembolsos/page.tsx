import { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Política de Reembolsos — Jorge Lorenzo",
};

export default function ReembolsosPage() {
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
          <h1 style={{ marginBottom: 48 }}>Política de Reembolsos</h1>

          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>

            <section>
              <h2 style={h2Style}>1. Acceso al contenido digital</h2>
              <p style={pStyle}>
                Los productos ofrecidos en <a href="https://www.jorgelorenzo.coach" style={linkStyle}>www.jorgelorenzo.coach</a> son cursos y contenidos digitales de acceso inmediato. Al completar la compra y acceder al contenido, el usuario reconoce haber recibido el servicio contratado.
              </p>
            </section>

            <section>
              <h2 style={h2Style}>2. Derecho de desistimiento</h2>
              <p style={pStyle}>
                De conformidad con el artículo 103 m) del Real Decreto Legislativo 1/2007, el derecho de desistimiento no es aplicable a contratos de suministro de contenido digital que no se preste en soporte material una vez que la ejecución haya comenzado con previo consentimiento expreso del consumidor.
              </p>
              <p style={{ ...pStyle, marginTop: 12 }}>
                Al realizar la compra y acceder al contenido, el usuario acepta expresamente que se inicie la prestación del servicio digital y que, por tanto, renuncia al derecho de desistimiento de 14 días establecido en la normativa de consumidores.
              </p>
            </section>

            <section>
              <h2 style={h2Style}>3. Excepciones y garantía de satisfacción</h2>
              <p style={pStyle}>
                No obstante lo anterior, en caso de que el contenido adquirido presente un defecto técnico grave que impida su visualización o acceso, Basketouch Solutions Spain, SL se compromete a resolver el problema en un plazo razonable o, si no fuera posible, a emitir un reembolso total.
              </p>
            </section>

            <section>
              <h2 style={h2Style}>4. Cómo solicitar un reembolso</h2>
              <p style={pStyle}>
                Para cualquier solicitud relacionada con reembolsos, contacta con nosotros en <a href="mailto:basketouch@gmail.com" style={linkStyle}>basketouch@gmail.com</a> indicando:
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
                {[
                  "Tu nombre y correo electrónico de registro.",
                  "El curso o producto adquirido.",
                  "El motivo de la solicitud.",
                ].map((item) => (
                  <li key={item} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 15, color: "var(--texto-suave)", lineHeight: 1.7 }}>
                    <span style={{ color: "var(--oro)", flexShrink: 0, marginTop: 2 }}>→</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p style={{ ...pStyle, marginTop: 16 }}>
                Analizaremos cada caso de forma individual y responderemos en un plazo máximo de 5 días hábiles.
              </p>
            </section>

            <section>
              <h2 style={h2Style}>5. Legislación aplicable</h2>
              <p style={pStyle}>
                Esta política se rige por la legislación española, en particular por el Real Decreto Legislativo 1/2007 de 16 de noviembre, por el que se aprueba el texto refundido de la Ley General para la Defensa de los Consumidores y Usuarios.
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
