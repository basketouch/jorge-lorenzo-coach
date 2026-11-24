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
        <div className="container" style={{ maxWidth: 740, paddingTop: 32, paddingBottom: 64 }}>
          <a href="/" style={{ color: "var(--texto-suave)", fontSize: 13, textDecoration: "none", display: "inline-block", marginBottom: 20 }}>
            ← Volver
          </a>

          <p className="section-label">Legal</p>
          <h1 style={{ marginBottom: 4 }}>Política de Privacidad</h1>
          <p style={{ color: "var(--texto-suave)", fontSize: 13, marginBottom: 32 }}>Jorge Lorenzo Coach — jorgelorenzo.coach</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            <section>
              <h2 style={h2Style}>1. Responsable del tratamiento</h2>
              <p style={pStyle}>
                <strong style={{ color: "var(--blanco)" }}>Basketouch Solutions Spain, SL</strong><br />
                Email: <a href="mailto:info@jorgelorenzo.coach" style={linkStyle}>info@jorgelorenzo.coach</a><br />
                Web: <a href="https://www.jorgelorenzo.coach" style={linkStyle}>www.jorgelorenzo.coach</a>
              </p>
            </section>

            <section>
              <h2 style={h2Style}>2. Datos que recogemos</h2>
              <ul style={listStyle}>
                {[
                  ["Datos de cuenta:", "nombre y dirección de correo electrónico."],
                  ["Datos de compra:", "cursos y módulos adquiridos, fecha de acceso y progreso en los contenidos."],
                  ["Datos de pago:", "procesados íntegramente por Stripe (nuestro proveedor de pagos). No almacenamos números de tarjeta ni datos bancarios."],
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
                  ["Comunicaciones comerciales", "consentimiento (art. 6.1.a RGPD), que das al apuntarte a un aviso, recordatorio o boletín pulsando el botón del formulario, junto al texto que te explica qué vas a recibir. Puedes retirarlo en cualquier momento con el enlace de baja de cada email o escribiéndonos."],
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
                  ["Stripe", "procesador de pagos. Tus datos de facturación se rigen por la política de privacidad de Stripe (stripe.com/es/privacy)."],
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
                No vendemos tus datos a terceros. Con fines publicitarios solo compartimos tu email, ya cifrado, con Meta (Facebook e Instagram), tal como se explica en el apartado 7.
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
                Para ejercer cualquiera de estos derechos escríbenos a <a href="mailto:info@jorgelorenzo.coach" style={linkStyle}>info@jorgelorenzo.coach</a>. También puedes reclamar ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" style={linkStyle}>aepd.es</a>).
              </p>
            </section>

            <section id="cookies">
              <h2 style={h2Style}>7. Cookies</h2>
              <p style={pStyle}>
                Utilizamos cookies técnicas necesarias para el funcionamiento del servicio (sesión de usuario, preferencias de acceso). También guardamos, durante 60 días, una cookie propia con los parámetros UTM de la campaña por la que llegaste, para saber de qué canal viene cada compra o alta.
              </p>
              <p style={{ ...pStyle, marginTop: 12 }}>
                Solo si las aceptas en el aviso de cookies, registramos nuestras visitas y clics con un identificador aleatorio guardado en tu navegador (sin nombre ni email), unido a los parámetros UTM de la campaña, para saber qué publicaciones y anuncios funcionan; y cargamos el Píxel de Meta (Facebook e Instagram), que usa cookies de medición y publicidad (_fbp, _fbc) para medir los anuncios y mostrarte los nuestros. Si las rechazas, no se carga. Puedes cambiar tu elección en cualquier momento desde el enlace «Cookies» del pie de página.
              </p>
              <p style={{ ...pStyle, marginTop: 12 }}>
                <strong style={{ color: "var(--blanco)" }}>Publicidad en Facebook e Instagram.</strong> Si estás suscrito a nuestro boletín o nos has dejado tu email, podemos usarlo para mostrarte nuestros anuncios en Facebook e Instagram y para no mostrártelos si ya eres cliente. Para ello subimos tu email a Meta ya cifrado (hash), que lo compara con los de sus usuarios. Meta no nos devuelve datos tuyos. Lo hacemos por interés legítimo, y puedes oponerte en cualquier momento escribiendo a <a href="mailto:info@jorgelorenzo.coach" style={linkStyle}>info@jorgelorenzo.coach</a>: retiraremos tu email de esos públicos.
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
                Podemos actualizar esta Política de Privacidad ocasionalmente. Publicaremos aquí la versión vigente con su fecha de última actualización y te avisaremos por correo cuando los cambios sean relevantes.
              </p>
            </section>

          </div>

          <p style={{ fontSize: 12, color: "var(--texto-suave)", marginTop: 32 }}>
            Última actualización: noviembre de 2026
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
