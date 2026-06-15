"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type Drill = {
  drill_id: string;
  slug: string;
  chapter: number;
  chapter_title_es: string;
  title_es: string;
  category_es: string;
  level: string;
  tags: string[];
  objective_short_es: string;
  access_level: string;
};

type Props = {
  drills: Drill[];
  userAccessLevel: string;
  userViews: string[];
  freeQuota: number;
};

const LEVEL_LABEL: Record<string, string> = {
  intermediate: "Intermedio",
  advanced: "Avanzado",
  competitive: "Competición",
};

function getDrillStatus(drill: Drill, userAccessLevel: string, userViews: string[], freeQuota: number) {
  if (userAccessLevel === "member") return "open";
  if (userViews.includes(drill.drill_id)) return "open"; // ya visto → siempre accesible
  if (userAccessLevel === "free" && userViews.length < freeQuota) return "available";
  if (userAccessLevel === "free") return "locked";
  return "preview"; // anonymous
}

const STATUS_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  open:      { label: "Visto",       color: "var(--oro)",         bg: "rgba(201,168,76,0.1)" },
  available: { label: "Disponible",  color: "#4caf7d",            bg: "rgba(76,175,125,0.1)" },
  locked:    { label: "Bloqueado",   color: "var(--texto-suave)", bg: "transparent" },
  preview:   { label: "Preview",     color: "var(--texto-suave)", bg: "transparent" },
};

export default function DrillsClient({ drills, userAccessLevel, userViews, freeQuota }: Props) {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterLevel, setFilterLevel] = useState("");

  // Capítulos disponibles (sin capítulo 1)
  const chapters = useMemo(() =>
    [...new Set(drills.map(d => d.chapter))].sort((a, b) => a - b).filter(ch => ch >= 2),
    [drills]
  );

  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const currentChapter = activeChapter ?? chapters[0] ?? null;
  const currentIndex = chapters.indexOf(currentChapter ?? 0);

  // Número de display: el cap. 2 de BD se muestra como "1", el 3 como "2", etc.
  function displayNum(ch: number) { return ch - 1; }

  const categories = useMemo(() => {
    const inChapter = drills.filter(d => d.chapter === currentChapter);
    return [...new Set(inChapter.map(d => d.category_es).filter(Boolean))].sort();
  }, [drills, currentChapter]);

  const levels = useMemo(() => {
    const inChapter = drills.filter(d => d.chapter === currentChapter);
    return [...new Set(inChapter.map(d => d.level).filter(Boolean))];
  }, [drills, currentChapter]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return drills.filter(d => {
      if (d.chapter !== currentChapter) return false;
      if (filterCategory && d.category_es !== filterCategory) return false;
      if (filterLevel && d.level !== filterLevel) return false;
      if (q && !d.title_es.toLowerCase().includes(q) && !d.objective_short_es?.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [drills, currentChapter, search, filterCategory, filterLevel]);

  const chapterTitle = drills.find(d => d.chapter === currentChapter)?.chapter_title_es ?? "";

  function goToChapter(ch: number) {
    setActiveChapter(ch);
    setFilterCategory("");
    setFilterLevel("");
    setSearch("");
  }

  const selectStyle: React.CSSProperties = {
    background: "var(--card)", border: "1px solid var(--borde)", color: "var(--texto)",
    borderRadius: 6, padding: "9px 14px", fontSize: 14, cursor: "pointer",
    appearance: "none", WebkitAppearance: "none",
  };

  return (
    <div>
      {/* Navegación de capítulos */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
        <button
          onClick={() => currentIndex > 0 && goToChapter(chapters[currentIndex - 1])}
          disabled={currentIndex <= 0}
          style={{ background: "none", border: "1px solid var(--borde)", color: currentIndex > 0 ? "var(--texto)" : "var(--texto-suave)", borderRadius: 6, padding: "8px 14px", cursor: currentIndex > 0 ? "pointer" : "default", fontSize: 16, opacity: currentIndex <= 0 ? 0.3 : 1 }}
        >←</button>

        <select
          value={currentChapter ?? ""}
          onChange={e => goToChapter(Number(e.target.value))}
          style={{ ...selectStyle, flex: 1, minWidth: 200, fontWeight: 600 }}
        >
          {chapters.map(ch => (
            <option key={ch} value={ch}>Cap. {displayNum(ch)} — {drills.find(d => d.chapter === ch)?.chapter_title_es}</option>
          ))}
        </select>

        <button
          onClick={() => currentIndex < chapters.length - 1 && goToChapter(chapters[currentIndex + 1])}
          disabled={currentIndex >= chapters.length - 1}
          style={{ background: "none", border: "1px solid var(--borde)", color: currentIndex < chapters.length - 1 ? "var(--texto)" : "var(--texto-suave)", borderRadius: 6, padding: "8px 14px", cursor: currentIndex < chapters.length - 1 ? "pointer" : "default", fontSize: 16, opacity: currentIndex >= chapters.length - 1 ? 0.3 : 1 }}
        >→</button>
      </div>

      <p style={{ fontSize: 12, color: "var(--texto-suave)", marginBottom: 24 }}>
        Capítulo {currentChapter != null ? displayNum(currentChapter) : ""} de {displayNum(chapters[chapters.length - 1] ?? 2)}
      </p>

      {/* Filtros dentro del capítulo */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Buscar en este capítulo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...selectStyle, flex: "1 1 200px", minWidth: 180 }}
        />
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ ...selectStyle, minWidth: 160 }}>
          <option value="">Todas las categorías</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} style={{ ...selectStyle, minWidth: 140 }}>
          <option value="">Todos los niveles</option>
          {levels.map(l => <option key={l} value={l}>{LEVEL_LABEL[l] ?? l}</option>)}
        </select>
        {(search || filterCategory || filterLevel) && (
          <button
            onClick={() => { setSearch(""); setFilterCategory(""); setFilterLevel(""); }}
            style={{ ...selectStyle, color: "var(--oro)", borderColor: "var(--oro)", cursor: "pointer", background: "transparent" }}
          >
            Limpiar
          </button>
        )}
      </div>

      <p style={{ fontSize: 13, color: "var(--texto-suave)", marginBottom: 24 }}>
        {filtered.length} ejercicio{filtered.length !== 1 ? "s" : ""}
        {(search || filterCategory || filterLevel) && ` de ${drills.filter(d => d.chapter === currentChapter).length}`}
      </p>

      {/* Grid de drills del capítulo activo */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {filtered.map(drill => {
          const status = getDrillStatus(drill, userAccessLevel, userViews, freeQuota);
          const badge = STATUS_BADGE[status];
          const isLocked = status === "locked" || status === "preview";

          return (
            <Link key={drill.drill_id} href={`/drills/${drill.slug}`} style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: "var(--card)", border: "1px solid var(--borde)",
                  borderRadius: 8, padding: "18px 20px",
                  opacity: isLocked ? 0.65 : 1,
                  transition: "border-color 0.15s, opacity 0.15s",
                  cursor: "pointer", height: "100%",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = isLocked ? "var(--borde)" : "var(--oro)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--borde)"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--texto-suave)" }}>
                    {drill.category_es}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: badge.color, background: badge.bg, padding: "2px 8px", borderRadius: 3, whiteSpace: "nowrap" }}>
                    {isLocked ? "🔒" : ""} {badge.label}
                  </span>
                </div>

                <h4 style={{ fontSize: 15, fontWeight: 600, color: "var(--texto)", marginBottom: 8, lineHeight: 1.3 }}>
                  {drill.title_es}
                </h4>

                <p style={{ fontSize: 13, color: "var(--texto-suave)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {drill.objective_short_es}
                </p>

                {drill.level && (
                  <div style={{ marginTop: 12 }}>
                    <span style={{ fontSize: 11, color: "var(--texto-suave)", background: "var(--oscuro)", padding: "2px 8px", borderRadius: 3 }}>
                      {LEVEL_LABEL[drill.level] ?? drill.level}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--texto-suave)" }}>
          <p style={{ fontSize: 16, marginBottom: 8 }}>No hay ejercicios con esos filtros.</p>
          <button onClick={() => { setSearch(""); setFilterCategory(""); setFilterLevel(""); }} style={{ color: "var(--oro)", background: "none", border: "none", cursor: "pointer", fontSize: 14, textDecoration: "underline" }}>Limpiar filtros</button>
        </div>
      )}

      {/* Navegación inferior */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--borde)" }}>
        <button
          onClick={() => currentIndex > 0 && goToChapter(chapters[currentIndex - 1])}
          disabled={currentIndex <= 0}
          style={{ background: "none", border: "1px solid var(--borde)", color: "var(--texto)", borderRadius: 6, padding: "10px 20px", cursor: "pointer", fontSize: 14, opacity: currentIndex <= 0 ? 0.3 : 1 }}
        >
          ← Cap. {chapters[currentIndex - 1] != null ? displayNum(chapters[currentIndex - 1]) : ""}
        </button>
        <button
          onClick={() => currentIndex < chapters.length - 1 && goToChapter(chapters[currentIndex + 1])}
          disabled={currentIndex >= chapters.length - 1}
          style={{ background: "none", border: "1px solid var(--borde)", color: "var(--texto)", borderRadius: 6, padding: "10px 20px", cursor: "pointer", fontSize: 14, opacity: currentIndex >= chapters.length - 1 ? 0.3 : 1 }}
        >
          Cap. {chapters[currentIndex + 1] != null ? displayNum(chapters[currentIndex + 1]) : ""} →
        </button>
      </div>
    </div>
  );
}
