"use client";

import { useState } from "react";

const faqs = [
  {
    q: "¿Necesito ser miembro de la comunidad de Skool?",
    a: "No es necesario. Compras el curso en esta web y accedes en jorgelorenzo.coach, sin ninguna suscripción. Aun así, te recomiendo unirte a la comunidad de entrenadores en Skool: es donde comparto el contenido de cada semana y donde puedes preguntar, compartir y aprender con otros entrenadores.",
  },
  {
    q: "¿El acceso es permanente?",
    a: "Sí. Si lo compras en la web, el acceso es de por vida en jorgelorenzo.coach: sin suscripción y sin caducidad, y lo ves las veces que quieras.",
  },
  {
    q: "¿Qué incluye exactamente?",
    a: "El archivo completo del Laboratorio del Entrenador 25/26: los módulos con todos sus vídeos de técnica, táctica y gestión, organizados para que los consultes cuando los necesites.",
  },
  {
    q: "¿Qué diferencia hay entre comprarlo en la web o acceder por Skool?",
    a: "En la web pagas una vez y tienes el curso para siempre, sin depender de ninguna suscripción. La opción de Skool es para miembros de la comunidad y su acceso está ligado a la membresía: mientras sigas siendo miembro, ves el contenido. Si prefieres no depender de ninguna suscripción, la web es la opción más sencilla.",
  },
  {
    q: "¿Hasta cuándo está disponible?",
    a: "Es una venta por tiempo limitado. Los precios y las fechas de apertura y cierre aparecen arriba, en la tarjeta de compra.",
  },
];

export default function FaqAccordion() {
  const [abierto, setAbierto] = useState<number | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {faqs.map(({ q, a }, i) => {
        const activo = abierto === i;
        return (
          <div key={i} style={{ borderBottom: "1px solid var(--borde)" }}>
            <button
              onClick={() => setAbierto(activo ? null : i)}
              style={{
                width: "100%", background: "none", border: "none",
                padding: "22px 0", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 600, color: activo ? "var(--oro)" : "var(--blanco)", lineHeight: 1.4, transition: "color 0.2s" }}>
                {q}
              </span>
              <span style={{
                fontSize: 20, color: "var(--oro)", flexShrink: 0,
                transform: activo ? "rotate(45deg)" : "rotate(0deg)",
                transition: "transform 0.25s",
                display: "inline-block", lineHeight: 1,
              }}>
                +
              </span>
            </button>
            {activo && (
              <p style={{ fontSize: 14, color: "var(--texto-suave)", lineHeight: 1.75, paddingBottom: 22, paddingRight: 32 }}>
                {a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
