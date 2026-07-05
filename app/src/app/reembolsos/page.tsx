import type { Metadata } from "next";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Política de Reembolsos — Jorge Lorenzo Coach",
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
          <h1 style={{ marginBottom: 8 }}>Política de Reembolsos</h1>
          <p style={{ color: "var(--texto-suave)", fontSize: 13, marginBottom: 48 }}>Jorge Lorenzo Coach — jorgelorenzo.coach</p>

          <p style={pStyle}>
            En jorgelorenzo.coach queremos que estés completamente satisfecho con los contenidos adquiridos. Esta política describe cómo funcionan los reembolsos.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 36, marginTop: 36 }}>

            <section>
              <h2 style={h2Style}>1. Política de reembolso</h2>
              <p style={pStyle}>
                Ofrecemos reembolso completo si nos lo solicitas en las <strong style={{ color: "var(--blanco)" }}>48 horas siguientes</strong> a la compra y no has accedido al contenido. Una vez que has accedido al material, el contenido digital se considera entregado.
              </p>
            </section>

            <section>
              <h2 style={h2Style}>2. Derecho de desistimiento (UE)</h2>
              <p style={pStyle}>
                Si eres consumidor en la Unión Europea, tienes derecho de desistimiento de 14 días conforme a la Directiva 2011/83/UE. Sin embargo, de conformidad con el art. 103 m) del Real Decreto Legislativo 1/2007, este derecho no es aplicable una vez que hayas accedido al contenido digital con tu consentimiento expreso.
              </p>
            </section>

            <section>
              <h2 style={h2Style}>3. Cómo solicitar el reembolso</h2>
              <ul style={listStyle}>
                {[
                  "Envía un correo a basketouch@gmail.com con el asunto «Solicitud de reembolso».",
                  "Incluye el email de tu cuenta y la fecha del cargo.",
                  "Procesaremos tu solicitud en un plazo máximo de 3 días hábiles.",
                  "El reembolso se realizará al método de pago original en un plazo de 5 a 10 días hábiles según tu entidad bancaria.",
                ].map((item) => (
                  <li key={item} style={liStyle}>
                    <span style={{ color: "var(--oro)", flexShrink: 0, marginTop: 2 }}>→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 style={h2Style}>4. Procesado de pagos</h2>
              <p style={pStyle}>
                Los pagos son procesados por <strong style={{ color: "var(--blanco)" }}>Paddle</strong>, que actúa como Merchant of Record. Los reembolsos se tramitan a través de Paddle de acuerdo con su política de reembolsos. También puedes solicitar un reembolso directamente a Paddle si lo prefieres.
              </p>
            </section>

            <section>
              <h2 style={h2Style}>5. Defectos técnicos</h2>
              <p style={pStyle}>
                Si el contenido adquirido presenta un defecto técnico grave que impida su acceso, nos comprometemos a resolverlo en un plazo razonable o, si no fuera posible, a emitir un reembolso total independientemente del plazo.
              </p>
            </section>

            <section>
              <h2 style={h2Style}>6. Contacto</h2>
              <p style={pStyle}>
                Para cualquier duda sobre reembolsos: <a href="mailto:basketouch@gmail.com" style={linkStyle}>basketouch@gmail.com</a>
              </p>
            </section>

          </div>

          <p style={{ fontSize: 12, color: "var(--texto-suave)", marginTop: 48 }}>
            Última actualización: julio de 2025
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

const listStyle: React.CSSProperties = {
  listStyle: "none", display: "flex", flexDirection: "column", gap: 10,
};

const liStyle: React.CSSProperties = {
  display: "flex", gap: 12, alignItems: "flex-start", fontSize: 15, color: "var(--texto-suave)", lineHeight: 1.7,
};
