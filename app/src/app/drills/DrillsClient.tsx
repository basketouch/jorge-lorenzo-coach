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

const INITIAL_VISIBLE = 6;

export default function DrillsClient({ drills, userAccessLevel, userViews, freeQuota }: Props) {
  const [search, setSearch] = useState("");
  const [filterChapter, setFilterChapter] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());

  const chapters = useMemo(() =>
    [...new Set(drills.map(d => d.chapter))].sort((a, b) => a - b).filter(ch => ch >= 2),
    [drills]
  );

  // Número de display: cap. 2 de BD → "1", cap. 3 → "2", etc.
  function displayNum(ch: number) { return ch - 1; }

  const categories = useMemo(() => [...new Set(drills.map(d => d.category_es).filter(Boolean))].sort(), [drills]);
  const levels = useMemo(() => [...new Set(drills.map(d => d.level).filter(Boolean))], [drills]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return drills.filter(d => {
      if (!chapters.includes(d.chapter)) return false;
      if (filterChapter && d.chapter !== Number(filterChapter)) return false;
      if (filterCategory && d.category_es !== filterCategory) return false;
      if (filterLevel && d.level !== filterLevel) return false;
      if (q && !d.title_es.toLowerCase().includes(q) && !d.objective_short_es?.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [drills, chapters, search, filterChapter, filterCategory, filterLevel]);

  const grouped = useMemo(() => {
    const map = new Map<number, { title: string; drills: Drill[] }>();
    for (const d of filtered) {
      if (!map.has(d.chapter)) map.set(d.chapter, { title: d.chapter_title_es, drills: [] });
      map.get(d.chapter)!.drills.push(d);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [filtered]);

  const isFiltering = !!(search || filterChapter || filterCategory || filterLevel);

  function toggleExpand(ch: number) {
    setExpandedChapters(prev => {
      const next = new Set(prev);
      next.has(ch) ? next.delete(ch) : next.add(ch);
      return next;
    });
  }

  const selectStyle: React.CSSProperties = {
    background: "var(--card)", border: "1px solid var(--borde)", color: "var(--texto)",
    borderRadius: 6, padding: "9px 14px", fontSize: 14, cursor: "pointer",
    appearance: "none", WebkitAppearance: "none",
  };

  return (
    <div>
      {/* Filtros */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
        <input
          type="text"
          placeholder="Buscar ejercicio..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...selectStyle, flex: "1 1 220px", minWidth: 200 }}
        />
        <select value={filterChapter} onChange={e => setFilterChapter(e.target.value)} style={{ ...selectStyle, minWidth: 160 }}>
          <option value="">Todos los capítulos</option>
          {chapters.map(ch => (
            <option key={ch} value={ch}>Cap. {displayNum(ch)} — {drills.find(d => d.chapter === ch)?.chapter_title_es?.split(" ").slice(0, 3).join(" ")}</option>
          ))}
        </select>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ ...selectStyle, minWidth: 180 }}>
          <option value="">Todas las categorías</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} style={{ ...selectStyle, minWidth: 150 }}>
          <option value="">Todos los niveles</option>
          {levels.map(l => <option key={l} value={l}>{LEVEL_LABEL[l] ?? l}</option>)}
        </select>
        {isFiltering && (
          <button
            onClick={() => { setSearch(""); setFilterChapter(""); setFilterCategory(""); setFilterLevel(""); }}
            style={{ ...selectStyle, color: "var(--oro)", borderColor: "var(--oro)", cursor: "pointer", background: "transparent" }}
          >
            Limpiar
          </button>
        )}
      </div>

      <p style={{ fontSize: 13, color: "var(--texto-suave)", marginBottom: 32 }}>
        {filtered.length} ejercicio{filtered.length !== 1 ? "s" : ""}
        {isFiltering && ` de ${drills.filter(d => chapters.includes(d.chapter)).length}`}
      </p>

      {/* Listado agrupado por capítulo */}
      {grouped.map(([chapter, { title, drills: capDrills }]) => {
        const expanded = isFiltering || expandedChapters.has(chapter);
        const visible = expanded ? capDrills : capDrills.slice(0, INITIAL_VISIBLE);
        const hidden = capDrills.length - INITIAL_VISIBLE;

        return (
          <div key={chapter} style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid var(--borde)" }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--oro)", minWidth: 56 }}>Cap. {displayNum(chapter)}</span>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--texto)" }}>{title}</h3>
              <span style={{ fontSize: 12, color: "var(--texto-suave)", marginLeft: "auto" }}>{capDrills.length} ejercicios</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
              {visible.map(drill => {
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

            {!isFiltering && hidden > 0 && (
              <button
                onClick={() => toggleExpand(chapter)}
                style={{ marginTop: 16, background: "none", border: "1px solid var(--borde)", color: "var(--texto-suave)", borderRadius: 6, padding: "9px 20px", cursor: "pointer", fontSize: 13 }}
              >
                {expanded ? "Ver menos" : `Ver más… (${hidden} ejercicios más)`}
              </button>
            )}
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--texto-suave)" }}>
          <p style={{ fontSize: 16, marginBottom: 8 }}>No hay ejercicios con esos filtros.</p>
          <button onClick={() => { setSearch(""); setFilterChapter(""); setFilterCategory(""); setFilterLevel(""); }} style={{ color: "var(--oro)", background: "none", border: "none", cursor: "pointer", fontSize: 14, textDecoration: "underline" }}>Limpiar filtros</button>
        </div>
      )}
    </div>
  );
}
