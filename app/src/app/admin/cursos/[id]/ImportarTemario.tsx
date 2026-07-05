"use client";

import { useMemo, useState } from "react";

interface BunnyVideo {
  id: string;
  titulo: string;
  duracionSeg: number;
  status: number;
}

interface LeccionParseada {
  prefijo: string;
  titulo: string;
}

interface ModuloParseado {
  titulo: string;
  lecciones: LeccionParseada[];
}

const RE_MODULO = /^(\d+)\.\s*.*?[Mm][oó]dulo\s*\d*\s*:?\s*(.+)$/;
const RE_LECCION = /^(\d+(?:\.\d+)+(?:\.[a-z](?=\.))?)\.\s*(.+)$/;
const RE_INTRO = /^0\.\s*(.+)$/;
const RE_PREFIJO_VIDEO = /^(\d+(?:\.\d+)*(?:\.[a-z](?=\.))?)\.?\s*/;

function parsearTemario(texto: string): ModuloParseado[] {
  const modulos: ModuloParseado[] = [];
  let intro: LeccionParseada | null = null;

  for (const raw of texto.split("\n")) {
    const line = raw.trim();
    if (!line) continue;

    const mModulo = line.match(RE_MODULO);
    if (mModulo) {
      modulos.push({ titulo: mModulo[2].trim(), lecciones: [] });
      continue;
    }

    const mLeccion = line.match(RE_LECCION);
    if (mLeccion && modulos.length > 0) {
      modulos[modulos.length - 1].lecciones.push({ prefijo: mLeccion[1], titulo: mLeccion[2].trim() });
      continue;
    }

    const mIntro = line.match(RE_INTRO);
    if (mIntro && !modulos.length) {
      intro = { prefijo: "0", titulo: mIntro[1].trim() };
    }
  }

  if (intro && modulos.length > 0) {
    modulos[0].lecciones.unshift(intro);
  }

  return modulos;
}

function extraerPrefijoVideo(titulo: string): string {
  const m = titulo.match(RE_PREFIJO_VIDEO);
  return m ? m[1].toLowerCase() : "";
}

function formatDuracion(segundos: number): string {
  const m = Math.floor(segundos / 60);
  const s = Math.round(segundos % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function ImportarTemario({ cursoId, nextOrdenModulo }: { cursoId: number; nextOrdenModulo: number }) {
  const [abierto, setAbierto] = useState(false);
  const [coleccion, setColeccion] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [errorVideos, setErrorVideos] = useState("");
  const [bunnyVideos, setBunnyVideos] = useState<BunnyVideo[] | null>(null);
  const [texto, setTexto] = useState("");
  const [importando, setImportando] = useState(false);
  const [errorImport, setErrorImport] = useState("");
  const [resultado, setResultado] = useState<{ modulosCreados: number; leccionesCreadas: number } | null>(null);

  const modulosParseados = useMemo(() => parsearTemario(texto), [texto]);

  const modulosConMatch = useMemo(() => {
    return modulosParseados.map((modulo) => ({
      ...modulo,
      lecciones: modulo.lecciones.map((leccion) => {
        const video = bunnyVideos?.find((v) => extraerPrefijoVideo(v.titulo) === leccion.prefijo.toLowerCase());
        return { ...leccion, video };
      }),
    }));
  }, [modulosParseados, bunnyVideos]);

  const totalLecciones = modulosConMatch.reduce((acc, m) => acc + m.lecciones.length, 0);
  const totalMatcheadas = modulosConMatch.reduce((acc, m) => acc + m.lecciones.filter((l) => l.video).length, 0);

  async function buscarVideos() {
    setBuscando(true); setErrorVideos(""); setBunnyVideos(null);
    const res = await fetch(`/api/admin/bunny/videos${coleccion.trim() ? `?collection=${encodeURIComponent(coleccion.trim())}` : ""}`);
    setBuscando(false);
    if (res.ok) {
      const d = await res.json();
      setBunnyVideos(d.videos);
    } else {
      const d = await res.json();
      setErrorVideos(d.error ?? "Error buscando vídeos");
    }
  }

  async function importar() {
    setImportando(true); setErrorImport(""); setResultado(null);
    const body = {
      modulos: modulosConMatch.map((modulo, mi) => ({
        titulo: modulo.titulo,
        orden: nextOrdenModulo + mi,
        lecciones: modulo.lecciones.map((leccion, li) => ({
          titulo: leccion.titulo,
          orden: li + 1,
          video_id: leccion.video?.id ?? null,
          duracion: leccion.video ? formatDuracion(leccion.video.duracionSeg) : null,
        })),
      })),
    };

    const res = await fetch(`/api/admin/curso/${cursoId}/importar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setImportando(false);
    const d = await res.json();
    if (res.ok) {
      setResultado(d);
      setTimeout(() => window.location.reload(), 1500);
    } else {
      setErrorImport(d.error ?? "Error al importar");
    }
  }

  if (!abierto) {
    return (
      <button
        onClick={() => setAbierto(true)}
        style={{ fontSize: 13, color: "var(--oro)", background: "none", border: "1px dashed var(--oro)", borderRadius: 8, padding: "12px 20px", cursor: "pointer", width: "100%", textAlign: "left", opacity: 0.7, marginBottom: 16 }}
      >
        ⇪ Importar temario completo (módulos + lecciones desde Bunny)
      </button>
    );
  }

  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--oro)", borderRadius: 10, padding: 24, marginBottom: 16 }}>
      <h3 style={{ marginBottom: 16, fontSize: 16 }}>Importar temario completo</h3>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <label style={labelS}>Colección/carpeta en Bunny (opcional, filtra la búsqueda)</label>
          <input value={coleccion} onChange={(e) => setColeccion(e.target.value)} style={iS} placeholder="Ej: En la Formacion y en la Elite" />
        </div>
        <button onClick={buscarVideos} disabled={buscando} className="btn-primary" style={{ fontSize: 13, padding: "8px 20px", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
          {buscando ? "Buscando..." : "🔍 Buscar vídeos"}
        </button>
      </div>
      {errorVideos && <p style={{ fontSize: 12, color: "#e06", marginBottom: 12 }}>{errorVideos}</p>}
      {bunnyVideos && !errorVideos && (
        <p style={{ fontSize: 12, color: "var(--texto-suave)", marginBottom: 16 }}>
          {bunnyVideos.length} vídeos encontrados en Bunny.
        </p>
      )}

      <label style={labelS}>Pega aquí el temario (módulos y lecciones numeradas)</label>
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        rows={10}
        placeholder={"1. Módulo 1: El equipo\n1.1.1. Filosofía, Estilo, Mentalidad competitiva y Valores\n1.1.2. Liderazgo y Roles\n1.2. Desarrollo de Jugadores Jóvenes\n\n2. Módulo 2: Defensa\n2.1. Defensa en pista completa\n..."}
        style={{ ...iS, fontFamily: "monospace", resize: "vertical", marginBottom: 16 }}
      />

      {modulosParseados.length > 0 && (
        <div style={{ marginBottom: 16, maxHeight: 360, overflowY: "auto", border: "1px solid var(--borde)", borderRadius: 8, padding: 16 }}>
          <p style={{ fontSize: 12, color: "var(--texto-suave)", marginBottom: 12 }}>
            {modulosConMatch.length} módulos · {totalLecciones} lecciones · {totalMatcheadas}/{totalLecciones} con vídeo encontrado
          </p>
          {modulosConMatch.map((modulo, mi) => (
            <div key={mi} style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--oro)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Módulo {nextOrdenModulo + mi} — {modulo.titulo}
              </p>
              {modulo.lecciones.map((leccion, li) => (
                <div key={li} style={{ display: "flex", gap: 8, alignItems: "center", padding: "4px 0", fontSize: 12 }}>
                  <span style={{ color: "var(--texto-suave)", minWidth: 44 }}>{leccion.prefijo}</span>
                  <span style={{ flex: 1, color: "var(--texto)" }}>{leccion.titulo}</span>
                  {leccion.video ? (
                    <span style={{ color: "#4aa", flexShrink: 0 }}>✓ {formatDuracion(leccion.video.duracionSeg)}</span>
                  ) : (
                    <span style={{ color: "#e06", flexShrink: 0 }}>✗ sin vídeo</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {errorImport && <p style={{ fontSize: 12, color: "#e06", marginBottom: 12 }}>{errorImport}</p>}

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={importar}
          disabled={importando || modulosParseados.length === 0}
          className="btn-primary"
          style={{ fontSize: 13, padding: "8px 20px", border: "none", cursor: modulosParseados.length === 0 ? "default" : "pointer", opacity: modulosParseados.length === 0 ? 0.5 : 1 }}
        >
          {importando ? "Importando..." : resultado ? `✓ ${resultado.modulosCreados} módulos, ${resultado.leccionesCreadas} lecciones` : `Importar ${modulosParseados.length} módulos y ${totalLecciones} lecciones`}
        </button>
        <button onClick={() => { setAbierto(false); setTexto(""); setBunnyVideos(null); setResultado(null); }}
          style={{ fontSize: 13, color: "var(--texto-suave)", background: "none", border: "1px solid var(--borde)", borderRadius: 6, padding: "8px 16px", cursor: "pointer" }}>
          Cerrar
        </button>
      </div>
    </div>
  );
}

const iS: React.CSSProperties = {
  width: "100%", background: "var(--negro)", border: "1px solid var(--borde)",
  borderRadius: 6, padding: "8px 12px", color: "var(--texto)",
  fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
};
const labelS: React.CSSProperties = {
  fontSize: 11, color: "var(--texto-suave)", display: "block", marginBottom: 4,
};
