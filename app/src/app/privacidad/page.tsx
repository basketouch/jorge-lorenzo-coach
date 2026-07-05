import type { Metadata } from "next";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Política de Privacidad — Jorge Lorenzo Coach",
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
          <h1 style={{ marginBottom: 8 }}>Política de Privacidad</h1>
          <p style={{ color: "var(--texto-suave)", fontSize: 13, marginBottom: 48 }}>Jorge Lorenzo Coach — jorgelorenzo.coach</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>

            <section>
              <h2 style={h2Style}>1. Responsable del tratamiento</h2>
              <p style={pStyle}>
                <strong style={{ color: "var(--blanco)" }}>Basketouch Solutions Spain, SL</strong><br />
                Email: <a href="mailto:basketouch@gmail.com" style={linkStyle}>basketouch@gmail.com</a><br />
                Web: <a href="https://www.jorgelorenzo.coach" style={linkStyle}>www.jorgelorenzo.coach</a>
              </p>
            </section>

            <section>
              <h2 style={h2Style}>2. Datos que recogemos</h2>
              <ul style={listStyle}>
                {[
                  ["Datos de cuenta:", "nombre y dirección de correo electrónico."],
                  ["Datos de compra:", "cursos y módulos adquiridos, fecha de acceso y progreso en los contenidos."],
                  ["Datos de pago:", "procesados íntegramente por Paddle (nuestro proveedor de pagos, que actúa como Merchant of Record). No almacenamos números de tarjeta ni datos bancarios."],
                  ["Datos técnicos:", "dirección IP, tipo de navegador, sistema operativo e identificadores de sesión, recogidos automáticamente para garantizar la seguridad y el correcto funcionamiento del servicio."],
                ].map(([label, text]) => (
                  <li key={label} style={liStyle}>
                    <span style={{ color: "var(--oro)", flexShrink: 0, marginTop: 2 }}>→</span>
                    <span><strong style={{ color: "var(--blanco)" }}>{label}</strong> {text}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 style={h2Style}>3. Finalidad y base jurídica</h2>
              <ul style={listStyle}>
                {[
                  ["Prestación del servicio", "ejecución del contrato (art. 6.1.b RGPD). Necesario para que puedas acceder a los cursos y contenidos adquiridos."],
                  ["Gestión de pagos", "ejecución del contrato y obligaciones legales (art. 6.1.b y 6.1.c RGPD)."],
                  ["Comunicaciones transaccionales", "(confirmación de compra, acceso a contenidos) — ejecución del contrato (art. 6.1.b RGPD)."],
                  ["Comunicaciones comerciales", "consentimiento (art. 6.1.a RGPD). Solo si lo has aceptado expresamente; puedes retirarlo en cualquier momento."],
                ].map(([label, text]) => (
                  <li key={label} style={liStyle}>
                    <span style={{ color: "var(--oro)", flexShrink: 0, marginTop: 2 }}>→</span>
                    <span><strong style={{ color: "var(--blanco)" }}>{label}</strong> — {text}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 style={h2Style}>4. Terceros que reciben tus datos</h2>
              <ul style={listStyle}>
                {[
                  ["Paddle", "procesador de pagos y Merchant of Record. Tus datos de facturación se rigen por la política de privacidad de Paddle."],
                  ["Supabase", "plataforma de base de datos y autenticación (servidores en la UE)."],
                  ["Vercel", "alojamiento de la plataforma."],
                ].map(([label, text]) => (
                  <li key={label} style={liStyle}>
                    <span style={{ color: "var(--oro)", flexShrink: 0, marginTop: 2 }}>→</span>
                    <span><strong style={{ color: "var(--blanco)" }}>{label}</strong> — {text}</span>
                  </li>
                ))}
              </ul>
              <p style={{ ...pStyle, marginTop: 16 }}>
                No vendemos tus datos a terceros ni los cedemos con fines publicitarios.
              </p>
            </section>

            <section>
              <h2 style={h2Style}>5. Conservación de los datos</h2>
              <p style={pStyle}>
                Conservamos tus datos mientras tengas una cuenta activa. Si solicitas la eliminación de tu cuenta, borraremos tus datos personales en un plazo de 30 días, salvo los que debamos conservar por obligación legal (registros de facturación: 5 años conforme a la normativa fiscal española).
              </p>
            </section>

            <section>
              <h2 style={h2Style}>6. Tus derechos</h2>
              <p style={{ ...pStyle, marginBottom: 12 }}>
                Como usuario en el Espacio Económico Europeo tienes derecho a:
              </p>
              <ul style={listStyle}>
                {[
                  "Acceder a tus datos personales.",
                  "Rectificar datos inexactos o incompletos.",
                  "Solicitar la supresión («derecho al olvido»).",
                  "Limitar u oponerte al tratamiento.",
                  "Portabilidad de los datos.",
                  "Retirar el consentimiento en cualquier momento (sin afectar a los tratamientos anteriores).",
                ].map((item) => (
                  <li key={item} style={liStyle}>
                    <span style={{ color: "var(--oro)", flexShrink: 0, marginTop: 2 }}>→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p style={{ ...pStyle, marginTop: 16 }}>
                Para ejercer cualquiera de estos derechos escríbenos a <a href="mailto:basketouch@gmail.com" style={linkStyle}>basketouch@gmail.com</a>. También puedes reclamar ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" style={linkStyle}>aepd.es</a>).
              </p>
            </section>

            <section>
              <h2 style={h2Style}>7. Cookies</h2>
              <p style={pStyle}>
                Utilizamos cookies técnicas necesarias para el funcionamiento del servicio (sesión de usuario, preferencias de acceso). No utilizamos cookies de seguimiento publicitario de terceros.
              </p>
            </section>

            <section>
              <h2 style={h2Style}>8. Seguridad</h2>
              <p style={pStyle}>
                Aplicamos medidas técnicas y organizativas adecuadas: cifrado en tránsito (HTTPS/TLS), contraseñas almacenadas con hash seguro y acceso restringido por roles.
              </p>
            </section>

            <section>
              <h2 style={h2Style}>9. Cambios en esta política</h2>
              <p style={pStyle}>
                Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos por correo electrónico antes de que los cambios entren en vigor.
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
