import { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Términos y condiciones — Jorge Lorenzo",
};

export default function TerminosPage() {
  return (
    <>
      {/* NAV */}
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
        <div className="container" style={{ maxWidth: 740, paddingTop: 32, paddingBottom: 64 }}>
          <a href="/" style={{ color: "var(--texto-suave)", fontSize: 13, textDecoration: "none", display: "inline-block", marginBottom: 20 }}>
            ← Volver
          </a>

          <p className="section-label">Legal</p>
          <h1 style={{ marginBottom: 32 }}>Términos y Condiciones</h1>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            <section>
              <h2 style={h2Style}>1. Introducción</h2>
              <p style={pStyle}>
                Al registrarte en <a href="https://www.jorgelorenzo.coach" style={linkStyle}>www.jorgelorenzo.coach</a> y todos los subdominios, aceptas nuestros Términos y Condiciones. Estos términos rigen el uso de nuestra plataforma de contenido online, operada por <strong style={{ color: "var(--blanco)" }}>Basketouch Solutions Spain, SL</strong>, con domicilio en C\ Padre Arintero, nº17-2º, CP: 33400 - Avilés (Asturias), y CIF: B52575107.
              </p>
            </section>

            <section>
              <h2 style={h2Style}>2. Uso de la Plataforma</h2>
              <p style={pStyle}>
                La plataforma <a href="https://www.jorgelorenzo.coach" style={linkStyle}>www.jorgelorenzo.coach</a> ofrece acceso a una variedad de contenidos educativos, incluyendo videos, PDFs, presentaciones de PowerPoint, materiales de formación y otros. Estos recursos son para uso personal y exclusivo de los usuarios registrados. Está prohibida la reproducción, distribución, modificación o publicación del material sin el consentimiento expreso por escrito de Basketouch Solutions Spain, SL.
              </p>
            </section>

            <section>
              <h2 style={h2Style}>3. Responsabilidades del Usuario</h2>
              <p style={{ ...pStyle, marginBottom: 12 }}>Al registrarte, te comprometes a:</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "Proporcionar información veraz y actualizada durante el proceso de registro.",
                  "Mantener la confidencialidad de tus credenciales de acceso y no compartir tu cuenta con terceros.",
                  "Utilizar la plataforma de manera responsable y respetuosa, sin realizar actividades que puedan dañar, interferir o interrumpir el funcionamiento de la misma.",
                ].map((item) => (
                  <li key={item} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 15, color: "var(--texto-suave)", lineHeight: 1.7 }}>
                    <span style={{ color: "var(--oro)", flexShrink: 0, marginTop: 2 }}>→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 style={h2Style}>4. Derechos de Propiedad Intelectual</h2>
              <p style={pStyle}>
                Todo el contenido disponible en <a href="https://www.jorgelorenzo.coach" style={linkStyle}>www.jorgelorenzo.coach</a> está protegido por derechos de autor y otros derechos de propiedad intelectual. La titularidad de estos derechos pertenece a Basketouch Solutions Spain, SL. El uso no autorizado del contenido puede resultar en acciones legales.
              </p>
            </section>

            <section>
              <h2 style={h2Style}>5. Modificaciones y Terminación</h2>
              <p style={pStyle}>
                Basketouch Solutions Spain, SL se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones serán notificadas a los usuarios y entrarán en vigor a partir de su publicación en la plataforma. Nos reservamos el derecho de suspender o terminar tu acceso a la plataforma si incumples estos términos.
              </p>
            </section>

            <section>
              <h2 style={h2Style}>6. Consentimiento para Recepción de Comunicaciones</h2>
              <p style={pStyle}>
                Al registrarte en <a href="https://www.jorgelorenzo.coach" style={linkStyle}>www.jorgelorenzo.coach</a>, consientes en recibir comunicaciones de Basketouch Solutions Spain, SL relacionadas con nuestros servicios, actualizaciones de cursos, novedades y promociones exclusivas. Estas comunicaciones pueden ser enviadas a través de correo electrónico u otros medios de contacto que nos hayas proporcionado.
              </p>
              <p style={{ ...pStyle, marginBottom: 12 }}>
                Nuestro objetivo es mantenerte informado sobre todas las mejoras, nuevas oportunidades y eventos dentro de nuestra plataforma de formación. Las comunicaciones incluirán:
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                {[
                  { titulo: "Actualizaciones de Cursos:", texto: "Información sobre nuevas lecciones, materiales adicionales y mejoras en los cursos existentes." },
                  { titulo: "Novedades y Promociones:", texto: "Noticias sobre nuevos cursos, ofertas especiales, descuentos, promociones exclusivas y otros para nuestros usuarios." },
                  { titulo: "Eventos y Webinars:", texto: "Invitaciones a eventos en línea, seminarios y webinars que puedan ser de tu interés." },
                ].map(({ titulo, texto }) => (
                  <li key={titulo} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 15, color: "var(--texto-suave)", lineHeight: 1.7 }}>
                    <span style={{ color: "var(--oro)", flexShrink: 0, marginTop: 2 }}>→</span>
                    <span><strong style={{ color: "var(--blanco)" }}>{titulo}</strong> {texto}</span>
                  </li>
                ))}
              </ul>
              <p style={{ ...pStyle, marginBottom: 12 }}>
                Respetamos tu privacidad y nos comprometemos a no saturar tu bandeja de entrada con comunicaciones irrelevantes. Si en algún momento deseas dejar de recibir estas comunicaciones, puedes darte de baja de las siguientes maneras:
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                {[
                  { titulo: "Instrucciones en Correos Electrónicos:", texto: "Cada correo electrónico que te enviemos incluirá un enlace para darte de baja de futuras comunicaciones." },
                  { titulo: "Contacto Directo:", texto: "Puedes contactarnos directamente a través de la web para solicitar la baja." },
                  { titulo: "Configuración de Cuenta:", texto: "También puedes gestionar tus preferencias de comunicación en la configuración de tu cuenta dentro de la plataforma." },
                ].map(({ titulo, texto }) => (
                  <li key={titulo} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 15, color: "var(--texto-suave)", lineHeight: 1.7 }}>
                    <span style={{ color: "var(--oro)", flexShrink: 0, marginTop: 2 }}>→</span>
                    <span><strong style={{ color: "var(--blanco)" }}>{titulo}</strong> {texto}</span>
                  </li>
                ))}
              </ul>
              <p style={pStyle}>
                Al aceptar estas condiciones, reconoces que las comunicaciones son parte integral de nuestra relación contigo como usuario registrado, y que es importante mantenerte informado para maximizar tu experiencia y aprovechamiento de los recursos que ofrecemos en <a href="https://www.jorgelorenzo.coach" style={linkStyle}>www.jorgelorenzo.coach</a>.
              </p>
            </section>

            <section>
              <h2 style={h2Style}>7. Legislación Aplicable y Jurisdicción</h2>
              <p style={pStyle}>
                Estos Términos y Condiciones se rigen por la legislación española. Para cualquier disputa o cuestión legal que pueda surgir en relación con el uso de nuestra plataforma, las partes se someterán a la jurisdicción de los tribunales de España.
              </p>
            </section>

            <section>
              <h2 style={h2Style}>8. Aceptación de Términos y Condiciones</h2>
              <p style={pStyle}>
                Al aceptar estos Términos y Condiciones, confirmas que has leído, comprendido y aceptado cumplir con todas las disposiciones aquí establecidas.
              </p>
            </section>

          </div>

          <p style={{ fontSize: 12, color: "var(--texto-suave)", marginTop: 32 }}>
            Última actualización: mayo 2025
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
