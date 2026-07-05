import Image from "next/image";

interface Leccion { id: number; titulo: string; duracion?: string; es_preview: boolean; orden: number; }
interface Curso { id: number; slug: string; titulo: string; precio: number; paddle_price_id: string | null; en_venta: boolean; }
interface Modulo { id: number; titulo: string; orden: number; portada_url?: string | null; }

export default function ModuloAcceso({
  modulo, lecciones, curso,
}: {
  modulo: Modulo; lecciones: Leccion[]; curso: Curso;
}) {
  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 100, maxWidth: 720 }}>

      {/* Breadcrumb */}
      <a href="/cuenta" style={{ fontSize: 13, color: "var(--texto-suave)", textDecoration: "none", display: "inline-block", marginBottom: 24 }}>
        ← Mi cuenta
      </a>

      {/* Hero portada */}
      {modulo.portada_url && (
        <div className="modulo-portada" style={{ marginBottom: 40, borderRadius: 12, overflow: "hidden", height: 320, position: "relative" }}>
          <Image
            src={modulo.portada_url}
            alt={modulo.titulo}
            fill
            priority
            style={{ objectFit: "cover" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />
          <div className="modulo-portada-texto" style={{ position: "absolute", bottom: 24, left: 28 }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>
              Módulo {String(modulo.orden).padStart(2, "0")}
            </p>
            <h1 style={{ fontSize: "clamp(20px, 3vw, 32px)", color: "#fff", margin: 0 }}>{modulo.titulo}</h1>
          </div>
        </div>
      )}

      {!modulo.portada_url && (
        <>
          <p className="section-label">Módulo {String(modulo.orden).padStart(2, "0")}</p>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 38px)", marginBottom: 32 }}>{modulo.titulo}</h1>
        </>
      )}

      {/* Botón Play principal */}
      {lecciones[0] && (
        <a
          href={`/ver/${curso.slug}/${lecciones[0].id}`}
          style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "var(--oro)", color: "var(--negro)",
            padding: "14px 28px", borderRadius: 8, fontSize: 15, fontWeight: 700,
            textDecoration: "none", marginBottom: 40,
          }}
        >
          ▶ Empezar módulo
        </a>
      )}

      {/* Lecciones */}
      <div style={{ display: "flex", flexDirection: "column", marginBottom: 56 }}>
        {lecciones.map((l, i) => (
          <a
            key={l.id}
            href={`/ver/${curso.slug}/${l.id}`}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 0", borderBottom: "1px solid var(--borde)",
              textDecoration: "none", gap: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 12, color: "var(--oro)", fontWeight: 700, minWidth: 20 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ fontSize: 14, color: "var(--texto)" }}>{l.titulo}</span>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
              {l.duracion && <span style={{ fontSize: 12, color: "var(--texto-suave)" }}>{l.duracion}</span>}
              <span style={{ fontSize: 12, color: "var(--oro)" }}>▶</span>
            </div>
          </a>
        ))}
      </div>

      {/* Upsell discreto — banner horizontal */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
        padding: "20px 24px", borderRadius: 10,
        border: "1px solid var(--borde)",
        background: "rgba(255,255,255,0.02)",
        flexWrap: "wrap",
      }}>
        <div>
          <p style={{ fontSize: 12, color: "var(--texto-suave)", marginBottom: 2 }}>¿Quieres el curso completo?</p>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--texto)" }}>
            {curso.titulo} — <span style={{ color: "var(--oro)" }}>297€</span> <span style={{ fontSize: 11, color: "var(--texto-suave)", textDecoration: "line-through" }}>347€</span>
          </p>
        </div>
        <a
          href="https://www.skool.com/jorge-lorenzo-coach/plans"
          target="_blank" rel="noopener noreferrer"
          style={{
            fontSize: 13, fontWeight: 600, padding: "8px 20px", borderRadius: 6,
            border: "1px solid rgba(201,168,76,0.4)", color: "var(--oro)",
            textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
          }}
        >
          Ver curso completo →
        </a>
      </div>

    </div>
  );
}
