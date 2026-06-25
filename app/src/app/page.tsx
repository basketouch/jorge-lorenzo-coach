import Image from "next/image";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import Footer from "@/components/Footer";
import NavHamburger from "@/components/NavHamburger";

export const dynamic = "force-dynamic";

const tecnico = [
  "Estilos de juego del Eurobasket '25",
  "Defensa en bloqueo directo y formación",
  "Técnica individual ofensiva",
  "Spacing con 4 abiertos",
  "Sistemas de ataque estructurados",
  "Scouting y preparación de partido",
  "Análisis de equipos de élite mundial",
  "Finalizaciones en situaciones reales de pista",
];

const gestion = [
  "Liderazgo del entrenador — de la pizarra al día a día",
  "Gestión de la presión del jugador y del entrenador",
  "Comunicación dentro del cuerpo técnico",
  "Planificación y periodización de la temporada",
  "Toma de decisiones en partido",
  "Relación entrenador–jugador en el alto rendimiento",
];

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Datos dinámicos del Laboratorio
  const adminDb = createAdminClient();
  const { data: lab } = await adminDb
    .from("cursos")
    .select("en_venta, fecha_apertura, fecha_cierre, fecha_apertura_texto, web_precio, skool_precio")
    .eq("slug", "laboratorio-2526")
    .single();

  const enVentaAuto = lab?.fecha_apertura ? new Date(lab.fecha_apertura) <= new Date() : false;
  const cierrePasado = lab?.fecha_cierre ? new Date(lab.fecha_cierre) <= new Date() : false;
  const labEnVenta = (lab?.en_venta || enVentaAuto) && !cierrePasado;
  const webPrecio = lab?.web_precio ? (lab.web_precio / 100).toFixed(0) : "347";
  const skoolPrecio = lab?.skool_precio ? (lab.skool_precio / 100).toFixed(0) : "297";

  return (
    <>
      {/* NAV */}
      <nav>
        <a href="/" className="nav-logo">Jorge <span>Lorenzo</span></a>
        <div className="nav-links">
          <a href="#niveles" className="nav-link">Comunidad</a>
          <a href="/cursos/laboratorio-2526" className="nav-link">El Laboratorio</a>
          <a href="/drills" className="nav-link">Drill Lab</a>
          <a href="/english" className="nav-link">English Coach</a>
          <a href="/herramientas" className="nav-link">Herramientas</a>
          <a href="/newsletter" className="nav-link">Newsletter</a>
          {user ? (
            <a href="/cuenta" className="nav-cta">Mi cuenta</a>
          ) : (
            <a href="/login" className="nav-cta">Iniciar sesión</a>
          )}
        </div>
        {/* Hamburguesa móvil */}
        <NavHamburger links={[
          { label: "Comunidad", href: "#niveles" },
          { label: "El Laboratorio", href: "/cursos/laboratorio-2526" },
          { label: "Drill Lab", href: "/drills" },
          { label: "English Coach", href: "/english" },
          { label: "Herramientas", href: "/herramientas" },
          { label: "Newsletter", href: "/newsletter" },
          ...(user ? [{ label: "Mi cuenta", href: "/cuenta" }] : []),
        ]} />
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-inner">
            <p className="hero-eyebrow">Comunidad de Entrenadores · Baloncesto</p>
            <h1>
              Campeón del Mundo.<br />
              <span className="accent">Campeón de Europa.</span>
            </h1>
            <p className="hero-sub">Y mañana entreno con <em>mis chicos.</em></p>
            <p className="hero-body">
              Empecé a entrenar con 16 años. Nunca lo dejé. En 2025 cerré una etapa de casi una década como asistente de la Selección Española — dos Mundiales, dos Juegos Olímpicos, un Eurobasket. Y cada semana sigo en la pista con mis equipos.{" "}
              <strong>Eso es lo que voy a compartir contigo.</strong>
            </p>
            <a href="#niveles" className="btn-primary">Entra a la comunidad</a>
            <div className="palmares">
              {[
                { icon: "🥇", title: "Campeón del Mundo", sub: "Beijing 2019" },
                { icon: "🥇", title: "Campeón de Europa", sub: "Berlín 2022" },
                { icon: "🏅", title: "JJOO 2021 · 2024", sub: "Tokyo · París" },
                { icon: "🏅", title: "Mundial 2023 · Eurobasket 2025", sub: "Jakarta · Chipre" },
                { icon: "🏅", title: "Selecciones de formación", sub: "U15/U16 España · 2015–2018" },
                { icon: "🏀", title: "Director Academia · 2021/22", sub: "Clube 1º de Agosto · Angola" },
                { icon: "🏀", title: "Entrenador Ayudante · 2024/25", sub: "Palencia Baloncesto · 1ª FEB" },
                { icon: "📋", title: "25 años entrenando", sub: "Formación y alto rendimiento" },
              ].map((item, i) => (
                <div key={i} className="palmares-item">
                  <span className="icon">{item.icon}</span>
                  <span><strong>{item.title}</strong><br />{item.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOTO MUNDIAL */}
      <div className="foto-banda">
        <Image src="/fotos/Mundial Oro 19.png" alt="Jorge Lorenzo, Campeón del Mundo 2019" fill style={{ objectFit: "cover", objectPosition: "center" }} priority />
        <div className="foto-banda-overlay"><span>Campeón del Mundo · China 2019</span></div>
      </div>

      {/* PROBLEMA */}
      <section>
        <div className="container">
          <p className="section-label">El problema</p>
          <h2>Contenido no es lo mismo que decidir mejor.</h2>
          <p className="lead">
            La mayoría de entrenadores ven los mismos partidos, consumen las mismas ideas y siguen tomando las mismas decisiones.
            No es falta de contenido. <strong>Es falta de criterio para leer el juego y actuar en consecuencia.</strong>
          </p>
          <div className="problema-grid">
            {[
              { n: "01", text: <>Ves un clip táctico, lo intentas en el siguiente partido. Sin entender el contexto, no funciona. <strong>Y lo abandonas.</strong></> },
              { n: "02", text: <>El conocimiento de los mejores equipos del mundo parece lejano. <strong>Como si no aplicara a tu nivel.</strong> Aplica. Solo hay que saber leerlo.</> },
              { n: "03", text: <>En medio del partido tomas decisiones que luego no sabes explicar. <strong>O peor: sabes que te equivocaste pero no sabes por qué.</strong></> },
              { n: "04", text: <>La temporada avanza. El equipo no progresa como debería. <strong>No es falta de trabajo — es falta de sistema para leer y decidir mejor.</strong></> },
            ].map((item, i) => (
              <div key={i} className="problema-item">
                <div className="numero">{item.n}</div>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOTOS JUGADORES */}
      <section>
        <div className="container">
          <p className="section-label">En el más alto nivel</p>
          <h2>Con los mejores del mundo.</h2>
          <p className="lead" style={{ marginBottom: 40 }}>El conocimiento que comparto aquí viene de compartir vestuario con los mejores jugadores del planeta durante casi una década.</p>
          <div className="fotos-grid">
            {[
              { src: "/fotos/Con Scariolo.png", label: "Con Sergio Scariolo" },
              { src: "/fotos/Con Pau Gasol.png", label: "Con Pau Gasol" },
              { src: "/fotos/Con Ricky Rubio.png", label: "Con Ricky Rubio" },
              { src: "/fotos/Con Santi Aldama.png", label: "Con Santi Aldama" },
            ].map((foto, i) => (
              <div key={i} className="foto-jugador">
                <Image src={foto.src} alt={foto.label} width={600} height={600} style={{ width: "100%", height: "auto", display: "block" }} />
                <div className="foto-jugador-label">{foto.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIERS */}
      <section id="niveles">
        <div className="container">
          <p className="section-label">Elige tu nivel</p>
          <h2>Tres maneras de trabajar conmigo.</h2>
          <p className="lead">Cada nivel responde a una necesidad distinta. No hay una opción incorrecta — hay la que encaja con lo que necesitas ahora.</p>
          <div className="tiers-grid">
            <div className="tier-card">
              <p className="tier-nivel">Standard</p>
              <p className="tier-nombre">Comunidad</p>
              <div className="tier-precio">18€ <span>/mes</span></div>
              <p className="tier-precio-anual">$20/mes</p>
              <p className="tier-desc">Para entrenadores que quieren aprender, compartir y mantenerse activos cada semana.</p>
              <ul className="tier-lista">
                <li>Comunidad privada de entrenadores</li>
                <li>La oficina — ideas y reflexiones desde el banquillo</li>
                <li>Martes: ejercicio con explicación completa</li>
                <li>Jueves: sistema ofensivo o defensivo</li>
                <li>Sábado: ATO — situaciones que deciden partidos</li>
                <li>Preguntas — resuelve tus dudas en la comunidad</li>
                <li>Archivo completo Lab. 25/26 disponible por 297€</li>
              </ul>
              <a href="https://www.skool.com/jorge-lorenzo-coach/plans" target="_blank" rel="noopener noreferrer" className="tier-cta tier-cta-secondary">Entrar en Standard</a>
            </div>
            <div className="tier-card destacado">
              <div className="tier-badge">Más popular</div>
              <p className="tier-nivel">Premium</p>
              <p className="tier-nombre">Sistema</p>
              <div className="tier-precio">41€ <span>/mes</span></div>
              <p className="tier-precio-anual">$45/mes</p>
              <p className="tier-desc">Un sistema estructurado que sigues durante toda la temporada. 10 meses de Laboratorio, más julio de post-temporada y agosto de pre-temporada.</p>
              <ul className="tier-lista">
                <li>Todo lo anterior del plan Standard</li>
                <li>El Laboratorio del Entrenador — programa mensual</li>
                <li>Mínimo 3 vídeos + charla al mes: técnica, táctica y gestión</li>
                <li>Últimos 2 meses del Laboratorio incluidos</li>
                <li>Preguntas con atención prioritaria</li>
                <li>Archivo completo Lab. 25/26 disponible por 297€</li>
              </ul>
              <a href="https://www.skool.com/jorge-lorenzo-coach/plans" target="_blank" rel="noopener noreferrer" className="tier-cta tier-cta-primary">Entrar en Premium</a>
            </div>
            <div className="tier-card">
              <p className="tier-nivel">VIP</p>
              <p className="tier-nombre">Acompañamiento</p>
              <div className="tier-precio">117€ <span>/mes</span></div>
              <p className="tier-precio-anual">$129/mes · Plazas limitadas</p>
              <p className="tier-desc">Trabajamos directamente sobre tu equipo. Tus partidos, tus decisiones, tu realidad.</p>
              <ul className="tier-lista">
                <li>Todo lo del plan Premium</li>
                <li>3 sesiones individuales al mes · 45 min</li>
                <li>Te ayudo a leer tus partidos y tomar mejores decisiones</li>
                <li>Prioridad total en respuestas</li>
                <li>Archivo completo del Laboratorio al final de temporada*</li>
                <li>Plazas limitadas</li>
              </ul>
              <a href="https://www.skool.com/jorge-lorenzo-coach/plans" target="_blank" rel="noopener noreferrer" className="tier-cta tier-cta-secondary">Entrar en VIP</a>
            </div>
          </div>
          <p className="precio-aviso">* Precios en euros orientativos. Skool cobra en dólares, por lo que pagarás algo menos según el cambio del día.</p>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section>
        <div className="container">
          <div className="newsletter-box">
            <div className="newsletter-texto">
              <p className="section-label">Gratis · Cada lunes</p>
              <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", marginBottom: 12 }}>Reflexiones desde el banquillo, cada semana.</h2>
              <p style={{ fontSize: 16, color: "var(--texto-suave)", lineHeight: 1.7, maxWidth: 480 }}>
                Reflexiones, lecturas de juego y contenido gratuito para entrenadores. Sin fórmulas ni plantillas. Lo que vivo cada semana en la pista y las enseñanzas que me dejó casi una década con la Selección Española, en tu bandeja de entrada.
              </p>
            </div>
            <div className="newsletter-cta">
              <a href="https://newsletter.jorgelorenzo.coach/" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ whiteSpace: "nowrap" }}>Suscribirse gratis</a>
              <p style={{ fontSize: 12, color: "var(--texto-suave)", marginTop: 12, textAlign: "center" }}>Sin spam. Baja cuando quieras.</p>
            </div>
          </div>
        </div>
      </section>

      {/* LABORATORIO */}
      <section>
        <div className="container">
          <p className="section-label">Producto independiente</p>
          <h2>El Laboratorio del Entrenador.</h2>
          <p className="lead">Un programa intensivo que sigue el ritmo de la temporada: septiembre a junio, más post-temporada en julio y pre-temporada en agosto. Cada mes: mínimo 3 vídeos y una charla — técnica, táctica y gestión.</p>
          <div className="laboratorio-ciclo">
            <div className="ciclo-item ciclo-activo">
              <span className="ciclo-mes">Sep – Jun</span>
              <span className="ciclo-desc">El Laboratorio del Entrenador · 10 meses</span>
            </div>
            <div className="ciclo-flecha">→</div>
            <div className="ciclo-item">
              <span className="ciclo-mes">Julio</span>
              <span className="ciclo-desc">Post-temporada</span>
            </div>
            <div className="ciclo-flecha">→</div>
            <div className="ciclo-item">
              <span className="ciclo-mes">Agosto</span>
              <span className="ciclo-desc">Pre-temporada</span>
            </div>
            <div className="ciclo-flecha">→</div>
            <div className="ciclo-item ciclo-activo">
              <span className="ciclo-mes">Sep</span>
              <span className="ciclo-desc">Empieza el nuevo Laboratorio</span>
            </div>
          </div>
          {/* Imagen del Laboratorio */}
          <div style={{ margin: "40px 0", borderRadius: 12, overflow: "hidden", position: "relative", maxHeight: 480 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://otsbpiukzftacmvmkajy.supabase.co/storage/v1/object/public/portadas/ChatGPT%20Image%2021%20may%202026,%2012_55_41.png"
              alt="El Laboratorio del Entrenador"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)",
              display: "flex", alignItems: "flex-end", padding: "32px 40px",
            }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--oro)", marginBottom: 8 }}>Temporada 2025/26</p>
                <p style={{ fontSize: 28, fontWeight: 800, color: "var(--blanco)", lineHeight: 1.2 }}>El Laboratorio del Entrenador</p>
              </div>
            </div>
          </div>

          <div className="videos-preview">
            <div className="video-card">
              <div className="video-wrapper">
                <iframe src="https://player.vimeo.com/video/1190934536?color=c9a84c&byline=0&portrait=0&title=0&dnt=1" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
              </div>
              <p className="video-label"><span>↳</span>Puntos Clave del Scouting — Temporada 2025/26</p>
            </div>
            <div className="video-card">
              <div className="video-wrapper">
                <iframe src="https://player.vimeo.com/video/1191259291?color=c9a84c&byline=0&portrait=0&title=0&dnt=1" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
              </div>
              <p className="video-label"><span>↳</span>Liderazgo del entrenador — de la pizarra al día a día</p>
            </div>
          </div>
          <div className="laboratorio-box">
            <div className="laboratorio-intro">
              <h3>Los detalles que marcan la diferencia en la pista.</h3>
              <ul className="laboratorio-lista" style={{ marginTop: 16 }}>
                <li>Primer miércoles — vídeos de técnica, táctica y aplicación directa</li>
                <li>Tercer miércoles — charla sobre gestión de equipo y lecturas</li>
                <li>Q&A en Skool — preguntas y debate con la comunidad</li>
              </ul>
            </div>
            <p style={{ fontSize: 15, color: "var(--texto-suave)", marginBottom: 24 }}>
              Dentro de <strong style={{ color: "var(--texto)" }}>El Laboratorio del Entrenador</strong> encontrarás cómo se construye, entrena y lidera un equipo desde dentro:
            </p>
            <div className="laboratorio-contenido">
              <div className="laboratorio-col">
                <p className="laboratorio-col-titulo">Técnico y táctico</p>
                <ul className="laboratorio-lista">
                  {tecnico.map((t) => <li key={t}>{t}</li>)}
                </ul>
              </div>
              <div className="laboratorio-col">
                <p className="laboratorio-col-titulo">Gestión y liderazgo</p>
                <ul className="laboratorio-lista">
                  {gestion.map((t) => <li key={t}>{t}</li>)}
                </ul>
              </div>
            </div>
            <div className="laboratorio-footer">
              <p className="laboratorio-horas">+19 horas de formación aplicada, basada en situaciones reales de pista.</p>

              {/* Bloque precio + urgencia */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 }}>
                {/* Standalone */}
                <div style={{ background: "var(--negro)", border: "1px solid var(--borde)", borderRadius: 10, padding: 24 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--texto-suave)", marginBottom: 8 }}>Acceso independiente · Web</p>
                  <div className="laboratorio-precio">{webPrecio}€</div>
                  <p style={{ fontSize: 13, color: "var(--texto-suave)", marginTop: 8, lineHeight: 1.5 }}>
                    El archivo completo · Pago único<br />Acceso permanente a las 51 lecciones
                  </p>
                  <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 6 }}>
                    {labEnVenta ? (
                      <p style={{ fontSize: 12, color: "#4aa", fontWeight: 700 }}>🔥 En venta ahora · Plazas limitadas</p>
                    ) : cierrePasado ? (
                      <p style={{ fontSize: 12, color: "var(--texto-suave)", fontWeight: 700 }}>✕ Venta cerrada hasta la próxima temporada</p>
                    ) : (
                      <p style={{ fontSize: 12, color: "var(--oro)", fontWeight: 700 }}>
                        ⏳ Apertura única{lab?.fecha_apertura_texto ? ` · ${lab.fecha_apertura_texto}` : ""}
                      </p>
                    )}
                    <p style={{ fontSize: 11, color: "var(--texto-suave)", marginTop: 4 }}>Ventana de venta limitada. Una vez cerrada, no vuelve a estar disponible hasta la próxima temporada.</p>
                  </div>
                </div>

                {/* Comunidad */}
                <div style={{ background: "var(--negro)", border: "2px solid var(--oro)", borderRadius: 10, padding: 24, position: "relative" }}>
                  <div style={{ position: "absolute", top: -12, left: 20, background: "var(--oro)", color: "var(--negro)", fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>Mejor opción</div>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--texto-suave)", marginBottom: 8 }}>Miembro Skool · Cualquier nivel</p>
                  <div className="laboratorio-precio" style={{ color: "var(--oro)" }}>{skoolPrecio}€</div>
                  <p style={{ fontSize: 13, color: "var(--texto-suave)", marginTop: 8, lineHeight: 1.5 }}>
                    Precio exclusivo para miembros<br />+ comunidad activa toda la temporada
                  </p>
                  <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(201,168,76,0.08)", borderRadius: 6 }}>
                    <p style={{ fontSize: 11, color: "var(--oro)" }}>
                      Cualquier nivel de Skool (desde $20/mes) da acceso al archivo completo por 297€ — 50€ menos que en la web.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 16, marginTop: 32, paddingTop: 32, borderTop: "1px solid var(--borde)", flexWrap: "wrap", alignItems: "stretch" }}>
              <a href="/cursos/laboratorio-2526" className="btn-secondary" style={{ flex: 1, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>Ver el programa completo</a>
              <a href="https://www.skool.com/jorge-lorenzo-coach/plans" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ flex: 1, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>Acceder en Skool</a>
            </div>
          </div>
        </div>
      </section>

      {/* DRILL LAB */}
      <section>
        <div className="container">
          <div style={{
            background: "var(--negro)", border: "1px solid var(--borde)", borderRadius: 12,
            padding: "40px 48px", display: "flex", gap: 48, alignItems: "center",
            flexWrap: "wrap",
          }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--oro)", marginBottom: 12 }}>Nuevo · Drill Lab</p>
              <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", marginBottom: 16 }}>Ejercicios de entrenamiento, explicados.</h2>
              <p style={{ fontSize: 15, color: "var(--texto-suave)", lineHeight: 1.7, marginBottom: 24 }}>
                Una biblioteca de drills con contexto real: por qué funciona, cuándo usarlo y cómo adaptarlo a tu equipo. Cada ejercicio, con vídeo y análisis.
              </p>
              <a href="/drills" className="btn-primary" style={{ display: "inline-block" }}>Ver los drills</a>
            </div>
            <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", gap: 10 }}>
              {["Técnica individual", "Sistemas ofensivos", "Defensa y transición", "Situaciones de partido"].map((item) => (
                <div key={item} style={{ fontSize: 14, color: "var(--texto-suave)", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: "var(--oro)" }}>✓</span> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOTO BANQUILLO */}
      <div className="foto-banda foto-banda-tall">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/fotos/Eurobasket banquillo 2025.JPG" alt="Jorge Lorenzo en el banquillo, Eurobasket 2025" />
        <div className="foto-banda-overlay"><span>Eurobasket 2025 · Selección Española</span></div>
      </div>

      {/* CTA FINAL */}
      <section className="cta-final" style={{ position: "relative", overflow: "hidden" }}>
        <div className="cta-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/fotos/Eurobasket jugs 2025.JPG" alt="" aria-hidden="true" />
        </div>
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <h2>No necesitas más contenido.</h2>
          <p className="lead">
            Necesitas a alguien que lleve 25 años en la pista, haya ganado dos títulos con la Selección y siga entrenando esta semana. Eso es lo que encuentras aquí.
          </p>
          <a href="#niveles" className="btn-primary">Elige tu nivel y empieza hoy</a>
        </div>
      </section>

      <Footer />
    </>
  );
}
