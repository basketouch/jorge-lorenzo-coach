"use client";

import { useState } from "react";

interface ParaQuienItem { texto: string }
interface TrabajamoItem { icono: string; texto: string }
interface VideoPreview { id: string; titulo: string }

interface CursoData {
  id: number;
  slug: string;
  titulo: string;
  descripcion?: string | null;
  precio: number;
  lemon_variant_id?: string | null;
  en_venta?: boolean;
  activo: boolean;
  portada_url?: string | null;
  descripcion_larga?: string | null;
  duracion_texto?: string | null;
  para_quien?: ParaQuienItem[] | null;
  lo_que_trabajamos?: TrabajamoItem[] | null;
  videos_preview?: VideoPreview[] | null;
  skool_precio?: number | null;
  skool_precio_original?: number | null;
  skool_url?: string | null;
  web_precio?: number | null;
  web_precio_original?: number | null;
  fecha_apertura_texto?: string | null;
  fecha_apertura?: string | null;
  fecha_cierre?: string | null;
}

export default function CursoEditor({ curso }: { curso: CursoData }) {
  const [abierto, setAbierto] = useState(false);
  const [tab, setTab] = useState<"info" | "venta" | "pagina">("info");
  const [guardando, setGuardando] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");

  // --- Info básica ---
  const [titulo, setTitulo] = useState(curso.titulo ?? "");
  const [slug, setSlug] = useState(curso.slug ?? "");
  const [descripcion, setDescripcion] = useState(curso.descripcion ?? "");
  const [portada, setPortada] = useState(curso.portada_url ?? "");
  const [activo, setActivo] = useState(curso.activo);

  // --- Venta ---
  const [variantId, setVariantId] = useState(curso.lemon_variant_id ?? "");
  const [precio, setPrecio] = useState(String((curso.precio ?? 0) / 100));
  const [enVenta, setEnVenta] = useState(curso.en_venta ?? false);
  const [webPrecio, setWebPrecio] = useState(String((curso.web_precio ?? 0) / 100));
  const [webPrecioOrig, setWebPrecioOrig] = useState(String((curso.web_precio_original ?? 0) / 100));
  const [skoolUrl, setSkoolUrl] = useState(curso.skool_url ?? "");
  const [skoolPrecio, setSkoolPrecio] = useState(String((curso.skool_precio ?? 0) / 100));
  const [skoolPrecioOrig, setSkoolPrecioOrig] = useState(String((curso.skool_precio_original ?? 0) / 100));
  const [fechaApertura, setFechaApertura] = useState(curso.fecha_apertura_texto ?? "");
  // fecha_apertura: ISO datetime local (ej: "2026-06-01T09:00")
  const [fechaAperturaAuto, setFechaAperturaAuto] = useState(
    curso.fecha_apertura ? curso.fecha_apertura.slice(0, 16) : ""
  );
  const [fechaCierre, setFechaCierre] = useState(
    curso.fecha_cierre ? curso.fecha_cierre.slice(0, 16) : ""
  );

  // --- Página ---
  const [descLarga, setDescLarga] = useState(curso.descripcion_larga ?? "");
  const [duracion, setDuracion] = useState(curso.duracion_texto ?? "");
  const [paraQuien, setParaQuien] = useState<string[]>(
    (curso.para_quien ?? []).map(p => p.texto)
  );
  const [trabajamos, setTrabajamos] = useState<TrabajamoItem[]>(
    curso.lo_que_trabajamos ?? []
  );
  const [videos, setVideos] = useState<VideoPreview[]>(
    curso.videos_preview ?? []
  );

  const lemonStore = process.env.NEXT_PUBLIC_LEMON_STORE ?? "basketouch.lemonsqueezy.com";
  const checkoutUrl = variantId
    ? `https://${lemonStore}/checkout/buy/${variantId}?checkout[custom][slug]=${slug}`
    : null;

  async function guardar() {
    setGuardando(true); setOk(false); setError("");
    const body: Record<string, unknown> = {
      // info
      titulo: titulo.trim(), slug: slug.trim(), descripcion: descripcion.trim() || null,
      portada_url: portada.trim() || null, activo,
      // venta
      lemon_variant_id: variantId.trim() || null,
      precio: Math.round(parseFloat(precio || "0") * 100),
      en_venta: enVenta,
      fecha_apertura: fechaAperturaAuto ? new Date(fechaAperturaAuto).toISOString() : null,
      fecha_cierre: fechaCierre ? new Date(fechaCierre).toISOString() : null,
      web_precio: webPrecio ? Math.round(parseFloat(webPrecio) * 100) : null,
      web_precio_original: webPrecioOrig ? Math.round(parseFloat(webPrecioOrig) * 100) : null,
      skool_url: skoolUrl.trim() || null,
      skool_precio: skoolPrecio ? Math.round(parseFloat(skoolPrecio) * 100) : null,
      skool_precio_original: skoolPrecioOrig ? Math.round(parseFloat(skoolPrecioOrig) * 100) : null,
      fecha_apertura_texto: fechaApertura.trim() || null,
      // página
      descripcion_larga: descLarga.trim() || null,
      duracion_texto: duracion.trim() || null,
      para_quien: paraQuien.filter(t => t.trim()).map(texto => ({ texto })),
      lo_que_trabajamos: trabajamos.filter(t => t.texto.trim()),
      videos_preview: videos.filter(v => v.id.trim()),
    };

    const res = await fetch(`/api/admin/curso/${curso.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setGuardando(false);
    if (res.ok) { setOk(true); setTimeout(() => setOk(false), 2500); }
    else { const d = await res.json(); setError(d.error ?? "Error"); }
  }

  return (
    <div style={{ background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 8, marginBottom: 20 }}>
      {/* Cabecera colapsable */}
      <button
        onClick={() => setAbierto(v => !v)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left",
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--oro)" }}>
          ⚙ Editar curso
        </span>
        <span style={{ color: "var(--texto-suave)", fontSize: 12, transition: "transform 0.2s", display: "inline-block", transform: abierto ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
      </button>

      {!abierto && <div style={{ height: 1, background: "rgba(201,168,76,0.15)" }} />}

      {abierto && (
        <>
          {/* Tabs */}
          <div style={{ display: "flex", borderTop: "1px solid rgba(201,168,76,0.2)", borderBottom: "1px solid rgba(201,168,76,0.2)" }}>
            {(["info", "venta", "pagina"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                  padding: "10px 16px", background: "none", border: "none", cursor: "pointer",
                  color: tab === t ? "var(--oro)" : "var(--texto-suave)",
                  borderBottom: tab === t ? "2px solid var(--oro)" : "2px solid transparent",
                }}>
                {t === "info" ? "⚙ Info" : t === "venta" ? "💳 Venta" : "📄 Página"}
              </button>
            ))}
          </div>

      <div style={{ padding: 16 }}>
        {/* ---- TAB INFO ---- */}
        {tab === "info" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Row label="Título">
              <input value={titulo} onChange={e => setTitulo(e.target.value)} style={iS} placeholder="Nombre del curso" />
            </Row>
            <Row label="Slug (URL)">
              <input value={slug} onChange={e => setSlug(e.target.value)} style={{ ...iS, fontFamily: "monospace" }} placeholder="el-laboratorio-2526" />
            </Row>
            <Row label="Descripción corta">
              <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={2} style={{ ...iS, resize: "vertical" }} placeholder="Una línea visible en la card" />
            </Row>
            <Row label="URL portada">
              <input value={portada} onChange={e => setPortada(e.target.value)} style={iS} placeholder="https://..." />
            </Row>
            <Row label="Modo">
              <Toggle value={activo} onChange={setActivo} labelOn="Publicado" labelOff="Draft (oculto)" />
            </Row>
          </div>
        )}

        {/* ---- TAB VENTA ---- */}
        {tab === "venta" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Row label="Fecha de apertura automática">
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <input
                  type="datetime-local"
                  value={fechaAperturaAuto}
                  onChange={e => setFechaAperturaAuto(e.target.value)}
                  style={iS}
                />
                {fechaAperturaAuto && (() => {
                  const d = new Date(fechaAperturaAuto);
                  const ahora = new Date();
                  const activa = d <= ahora;
                  return (
                    <span style={{ fontSize: 11, color: activa ? "#4aa" : "var(--oro)", fontWeight: 600 }}>
                      {activa
                        ? `✓ En venta desde ${d.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}`
                        : `⏰ Se activará el ${d.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}`
                      }
                    </span>
                  );
                })()}
                {!fechaAperturaAuto && (
                  <span style={{ fontSize: 11, color: "var(--texto-suave)" }}>Sin fecha → usa el toggle manual de abajo</span>
                )}
              </div>
            </Row>
            <Row label="Fecha de cierre de venta">
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <input
                  type="datetime-local"
                  value={fechaCierre}
                  onChange={e => setFechaCierre(e.target.value)}
                  style={iS}
                />
                {fechaCierre && (() => {
                  const d = new Date(fechaCierre);
                  const cerrado = d <= new Date();
                  return (
                    <span style={{ fontSize: 11, color: cerrado ? "#e06" : "var(--texto-suave)", fontWeight: 600 }}>
                      {cerrado
                        ? `✗ Venta cerrada desde ${d.toLocaleDateString("es-ES", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}`
                        : `Cierra el ${d.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}`
                      }
                    </span>
                  );
                })()}
              </div>
            </Row>
            <Row label="Activación manual (override)">
              <Toggle value={enVenta} onChange={setEnVenta} labelOn="Forzar en venta ya" labelOff="Desactivado" />
            </Row>
            <Row label="Lemon Variant ID">
              <input value={variantId} onChange={e => setVariantId(e.target.value)} style={{ ...iS, fontFamily: "monospace" }} placeholder="ej. 5c1f00a0-..." />
            </Row>
            {checkoutUrl && (
              <Row label="URL checkout">
                <div style={{ display: "flex", gap: 6 }}>
                  <code style={{ ...iS, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 11, color: "var(--oro)" }}>
                    {checkoutUrl}
                  </code>
                  <button onClick={() => navigator.clipboard.writeText(checkoutUrl!)}
                    style={{ background: "var(--negro)", border: "1px solid var(--borde)", borderRadius: 4, padding: "6px 10px", color: "var(--texto-suave)", cursor: "pointer", fontSize: 11, flexShrink: 0 }}>
                    Copiar
                  </button>
                </div>
              </Row>
            )}
            <div style={{ height: 1, background: "var(--borde)", margin: "4px 0" }} />
            <p style={{ fontSize: 11, color: "var(--texto-suave)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Precios mostrados en la landing</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <Row label="Precio web (€)"><input type="number" value={webPrecio} onChange={e => setWebPrecio(e.target.value)} style={iS} placeholder="347" /></Row>
              <Row label="Precio web tachado (€)"><input type="number" value={webPrecioOrig} onChange={e => setWebPrecioOrig(e.target.value)} style={iS} placeholder="" /></Row>
              <Row label="Precio Skool (€)"><input type="number" value={skoolPrecio} onChange={e => setSkoolPrecio(e.target.value)} style={iS} placeholder="297" /></Row>
              <Row label="Precio Skool tachado (€)"><input type="number" value={skoolPrecioOrig} onChange={e => setSkoolPrecioOrig(e.target.value)} style={iS} placeholder="347" /></Row>
            </div>
            <Row label="URL Skool">
              <input value={skoolUrl} onChange={e => setSkoolUrl(e.target.value)} style={iS} placeholder="https://www.skool.com/..." />
            </Row>
            <Row label="Fecha apertura (texto)">
              <input value={fechaApertura} onChange={e => setFechaApertura(e.target.value)} style={iS} placeholder="Junio 2026" />
            </Row>
            <Row label="Precio base (€)">
              <input type="number" value={precio} onChange={e => setPrecio(e.target.value)} style={iS} placeholder="0" />
            </Row>
          </div>
        )}

        {/* ---- TAB PÁGINA ---- */}
        {tab === "pagina" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Row label="Descripción larga">
              <textarea value={descLarga} onChange={e => setDescLarga(e.target.value)} rows={3} style={{ ...iS, resize: "vertical" }} placeholder="Texto visible debajo del título en la landing" />
            </Row>
            <Row label="Duración (texto)">
              <input value={duracion} onChange={e => setDuracion(e.target.value)} style={iS} placeholder="9 meses" />
            </Row>

            {/* Para quién es */}
            <div>
              <p style={labelS}>¿Para quién es? (bullets)</p>
              {paraQuien.map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                  <input value={t} onChange={e => { const a = [...paraQuien]; a[i] = e.target.value; setParaQuien(a); }}
                    style={{ ...iS, flex: 1 }} placeholder={`Ítem ${i + 1}`} />
                  <button onClick={() => setParaQuien(paraQuien.filter((_, j) => j !== i))}
                    style={delBtn}>×</button>
                </div>
              ))}
              <button onClick={() => setParaQuien([...paraQuien, ""])} style={addBtn}>+ Añadir</button>
            </div>

            {/* Lo que trabajamos */}
            <div>
              <p style={labelS}>Lo que trabajamos (cards con icono)</p>
              {trabajamos.map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                  <input value={t.icono} onChange={e => { const a = [...trabajamos]; a[i] = { ...a[i], icono: e.target.value }; setTrabajamos(a); }}
                    style={{ ...iS, width: 56, flexShrink: 0 }} placeholder="🎯" />
                  <input value={t.texto} onChange={e => { const a = [...trabajamos]; a[i] = { ...a[i], texto: e.target.value }; setTrabajamos(a); }}
                    style={{ ...iS, flex: 1 }} placeholder="Descripción" />
                  <button onClick={() => setTrabajamos(trabajamos.filter((_, j) => j !== i))}
                    style={delBtn}>×</button>
                </div>
              ))}
              <button onClick={() => setTrabajamos([...trabajamos, { icono: "", texto: "" }])} style={addBtn}>+ Añadir</button>
            </div>

            {/* Vídeos preview */}
            <div>
              <p style={labelS}>Vídeos de muestra (Vimeo)</p>
              {videos.map((v, i) => (
                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                  <input value={v.id} onChange={e => { const a = [...videos]; a[i] = { ...a[i], id: e.target.value }; setVideos(a); }}
                    style={{ ...iS, width: 130, flexShrink: 0, fontFamily: "monospace" }} placeholder="Vimeo ID" />
                  <input value={v.titulo} onChange={e => { const a = [...videos]; a[i] = { ...a[i], titulo: e.target.value }; setVideos(a); }}
                    style={{ ...iS, flex: 1 }} placeholder="Título del vídeo" />
                  <button onClick={() => setVideos(videos.filter((_, j) => j !== i))}
                    style={delBtn}>×</button>
                </div>
              ))}
              <button onClick={() => setVideos([...videos, { id: "", titulo: "" }])} style={addBtn}>+ Añadir</button>
            </div>
          </div>
        )}

        {/* Guardar */}
        <div style={{ marginTop: 16, display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={guardar} disabled={guardando}
            style={{
              background: ok ? "rgba(74,170,100,0.15)" : "var(--oro)",
              color: ok ? "#4aa" : "var(--negro)",
              border: ok ? "1px solid #4aa" : "none",
              borderRadius: 4, padding: "7px 16px",
              fontSize: 13, fontWeight: 700, cursor: "pointer",
            }}>
            {guardando ? "Guardando…" : ok ? "✓ Guardado" : "Guardar curso"}
          </button>
          {error && <span style={{ fontSize: 12, color: "#e06" }}>{error}</span>}
        </div>
      </div>
        </>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={labelS}>{label}</p>
      {children}
    </div>
  );
}

function Toggle({ value, onChange, labelOn, labelOff }: { value: boolean; onChange: (v: boolean) => void; labelOn: string; labelOff: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <button onClick={() => onChange(!value)}
        style={{
          width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
          background: value ? "#4aa" : "var(--borde)",
          position: "relative", transition: "background 0.2s", flexShrink: 0,
        }}>
        <span style={{
          position: "absolute", top: 3, left: value ? 23 : 3,
          width: 18, height: 18, borderRadius: "50%", background: "white",
          transition: "left 0.2s",
        }} />
      </button>
      <span style={{ fontSize: 13, color: value ? "#4aa" : "#e06", fontWeight: 600 }}>
        {value ? labelOn : labelOff}
      </span>
    </div>
  );
}

const iS: React.CSSProperties = {
  width: "100%", background: "var(--negro)", border: "1px solid var(--borde)",
  borderRadius: 4, padding: "7px 10px", color: "var(--blanco)",
  fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
};
const labelS: React.CSSProperties = {
  fontSize: 11, color: "var(--texto-suave)", marginBottom: 4, fontWeight: 600,
};
const addBtn: React.CSSProperties = {
  fontSize: 11, color: "var(--oro)", background: "none", border: "1px dashed rgba(201,168,76,0.4)",
  borderRadius: 4, padding: "4px 10px", cursor: "pointer", marginTop: 2,
};
const delBtn: React.CSSProperties = {
  background: "none", border: "1px solid var(--borde)", borderRadius: 4,
  padding: "4px 8px", color: "var(--texto-suave)", cursor: "pointer", fontSize: 14, flexShrink: 0,
};
