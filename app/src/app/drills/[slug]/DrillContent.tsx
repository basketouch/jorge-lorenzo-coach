"use client";

import Link from "next/link";

type Drill = Record<string, any>;
type AdjacentDrill = { slug: string; title_es: string } | null;
type Props = {
  drill: Drill;
  access: "anonymous" | "preview_only" | "full" | "quota_reached";
  signedImageUrl: string | null;
  prev: AdjacentDrill;
  next: AdjacentDrill;
};

const LEVEL_LABEL: Record<string, string> = {
  intermediate: "Intermedio",
  advanced: "Avanzado",
  competitive: "Competición",
};

const L = {
  material: "Material", personal: "Personal", objetivo: "Objetivo",
  desarrollo: "Desarrollo", detalles: "Detalles clave", variantes: "Variantes",
  anterior: "Anterior", siguiente: "Siguiente", volver: "← Ver todos los ejercicios",
  registro: "Regístrate gratis para leer este ejercicio.",
  registroSub: "Con una cuenta gratuita puedes acceder a 5 ejercicios completos. Sin tarjeta de crédito.",
  crearCuenta: "Crear cuenta gratis", iniciarSesion: "Iniciar sesión",
  limite: "Has llegado al límite de 5 ejercicios gratuitos.",
  limiteSub: "Únete a la comunidad para acceder a los 169 ejercicios completos, con imagen y detalles de ejecución.",
  unirse: "Únete a la comunidad",
};

function Section({ title, content }: { title: string; content: string }) {
  if (!content?.trim()) return null;
  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--oro)", marginBottom: 12 }}>
        {title}
      </h3>
      <div style={{ fontSize: 15, lineHeight: 1.75, color: "var(--texto)", whiteSpace: "pre-wrap" }}>
        {content}
      </div>
    </div>
  );
}

export default function DrillContent({ drill, access, signedImageUrl, prev, next }: Props) {
  const t = (field: string) => drill[`${field}_es`] || "";

  const isAnonymous = access === "anonymous";
  const isQuotaReached = access === "quota_reached";
  const hasFull = access === "full";

  return (
    <div style={{ maxWidth: 720 }}>
      {/* Cabecera */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--texto-suave)", background: "var(--card)", border: "1px solid var(--borde)", padding: "3px 10px", borderRadius: 4 }}>
            {drill.category_es}
          </span>
          {drill.level && (
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--texto-suave)" }}>
              {LEVEL_LABEL[drill.level] ?? drill.level}
            </span>
          )}
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.2, marginBottom: 12 }}>
          {t("title")}
        </h1>

        <p style={{ fontSize: 16, color: "var(--texto-suave)", lineHeight: 1.6 }}>
          {t("objective_short")}
        </p>
      </div>

      <div style={{ width: 48, height: 3, background: "var(--oro)", marginBottom: 40 }} />

      {/* ACCESO COMPLETO */}
      {hasFull && (
        <>
          {/* Imagen */}
          {signedImageUrl && (
            <div style={{ marginBottom: 40, borderRadius: 8, overflow: "hidden", border: "1px solid var(--borde)", background: "var(--card)" }}>
              <img
                src={signedImageUrl}
                alt={drill.primary_figure_id ?? drill.title_es}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          )}

          {/* Material */}
          {t("equipment") && (
            <div style={{ display: "grid", gridTemplateColumns: t("personnel") ? "1fr 1fr" : "1fr", gap: 16, marginBottom: 32 }}>
              <div style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 8, padding: "16px 20px" }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--oro)", marginBottom: 10 }}>{L.material}</p>
                <p style={{ fontSize: 14, color: "var(--texto)", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{t("equipment")}</p>
              </div>
              {t("personnel") && (
                <div style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 8, padding: "16px 20px" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--oro)", marginBottom: 10 }}>{L.personal}</p>
                  <p style={{ fontSize: 14, color: "var(--texto)", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{t("personnel")}</p>
                </div>
              )}
            </div>
          )}

          <Section title={L.objetivo} content={t("objective_full")} />
          <Section title={L.desarrollo} content={t("execution")} />
          <Section title={L.detalles} content={t("key_details")} />
          {t("variation") && <Section title={L.variantes} content={t("variation")} />}
        </>
      )}

      {/* BLOQUEADO — cuota agotada */}
      {isQuotaReached && (
        <>
          <div style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 10, padding: "40px 32px", textAlign: "center", marginBottom: 32 }}>
            <p style={{ fontSize: 32, marginBottom: 16 }}>🔒</p>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{L.limite}</h3>
            <p style={{ fontSize: 15, color: "var(--texto-suave)", marginBottom: 28, lineHeight: 1.6 }}>{L.limiteSub}</p>
            <a href="https://www.skool.com/jorge-lorenzo-coach/plans" target="_blank" rel="noopener noreferrer" className="nav-cta" style={{ display: "inline-block", fontSize: 15, padding: "14px 28px" }}>
              {L.unirse}
            </a>
          </div>
          <div style={{ opacity: 0.4, pointerEvents: "none", userSelect: "none" }}>
            <Section title={L.objetivo} content={(t("objective_full") ?? "").substring(0, 120) + "..."} />
            <div style={{ filter: "blur(4px)" }}>
              <Section title={L.desarrollo} content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam." />
            </div>
          </div>
        </>
      )}

      {/* NO REGISTRADO */}
      {isAnonymous && (
        <>
          <div style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 10, padding: "40px 32px", textAlign: "center", marginBottom: 32 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{L.registro}</h3>
            <p style={{ fontSize: 15, color: "var(--texto-suave)", marginBottom: 28, lineHeight: 1.6 }}>{L.registroSub}</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/login" className="nav-cta" style={{ display: "inline-block", fontSize: 15, padding: "14px 28px" }}>{L.crearCuenta}</a>
              <a href="/login" style={{ display: "inline-block", fontSize: 14, padding: "14px 20px", color: "var(--texto-suave)", border: "1px solid var(--borde)", borderRadius: 4, textDecoration: "none" }}>{L.iniciarSesion}</a>
            </div>
          </div>
          <div style={{ opacity: 0.35, pointerEvents: "none", userSelect: "none", filter: "blur(2px)" }}>
            <Section title={L.objetivo} content={(t("objective_full") ?? "").substring(0, 150) + "..."} />
          </div>
        </>
      )}

      {/* Navegación anterior / siguiente */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 60, paddingTop: 32, borderTop: "1px solid var(--borde)" }}>
        {prev ? (
          <Link href={`/drills/${prev.slug}`} style={{ textDecoration: "none" }}>
            <div style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 8, padding: "16px 18px" }}>
              <p style={{ fontSize: 11, color: "var(--texto-suave)", marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>← {L.anterior}</p>
              <p style={{ fontSize: 14, color: "var(--texto)", lineHeight: 1.3 }}>{prev.title_es}</p>
            </div>
          </Link>
        ) : <div />}

        {next ? (
          <Link href={`/drills/${next.slug}`} style={{ textDecoration: "none" }}>
            <div style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 8, padding: "16px 18px", textAlign: "right" }}>
              <p style={{ fontSize: 11, color: "var(--texto-suave)", marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>{L.siguiente} →</p>
              <p style={{ fontSize: 14, color: "var(--texto)", lineHeight: 1.3 }}>{next.title_es}</p>
            </div>
          </Link>
        ) : <div />}
      </div>

      {/* Volver al listado */}
      <div style={{ marginTop: 24, textAlign: "center" }}>
        <Link href="/drills" style={{ fontSize: 14, color: "var(--texto-suave)", textDecoration: "none", borderBottom: "1px solid var(--borde)", paddingBottom: 2 }}>
          {L.volver}
        </Link>
      </div>
    </div>
  );
}
