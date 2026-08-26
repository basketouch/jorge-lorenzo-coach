"use client";

import { useState, useMemo, useEffect } from "react";

type Item = {
  id: string;
  content_type: string;
  title: string;
  public_teaser: string | null;
  category: string | null;
  source_url: string;
  thumbnail_url: string | null;
  published_at: string | null;
  tags: string[];
};

type Props = {
  items: Item[];
};

const TYPE_LABEL: Record<string, string> = {
  post: "Post",
  lesson: "Lección",
};

const TYPE_COLOR: Record<string, string> = {
  post: "#4caf7d",
  lesson: "var(--oro)",
};

const FALLBACK_ICON: Record<string, string> = {
  post: "💬",
  lesson: "🎬",
};

function categoryGradient(seed: string) {
  // Gradiente determinista por categoría (no por título), para que todas las
  // tarjetas de un mismo curso compartan el mismo fondo.
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `linear-gradient(135deg, hsl(${hue}, 42%, 22%), hsl(${(hue + 35) % 360}, 45%, 11%))`;
}

// Muchas categorías ya empiezan con un emoji (ej. "🛡️ Defensa"); lo
// reutilizamos como icono grande en vez de repetir el mismo bloque de texto.
const EMOJI_PREFIX = /^(\p{Emoji_Presentation}|\p{Extended_Pictographic})️?\s*/u;

function CardThumb({ item }: { item: Item }) {
  const gradientSeed = item.category ?? item.content_type;
  const emojiMatch = item.category?.match(EMOJI_PREFIX);
  const icon = emojiMatch?.[0]?.trim() || FALLBACK_ICON[item.content_type] || "🏀";
  const categoryLabel = item.category?.replace(EMOJI_PREFIX, "").trim();

  return (
    <div
      style={{
        aspectRatio: "16 / 9", width: "100%",
        background: item.thumbnail_url ? undefined : categoryGradient(gradientSeed),
        backgroundImage: item.thumbnail_url ? `url(${item.thumbnail_url})` : undefined,
        backgroundSize: "cover", backgroundPosition: "center",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
      }}
    >
      {!item.thumbnail_url && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 40, lineHeight: 1, filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.35))" }}>
            {icon}
          </span>
          {categoryLabel && (
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", padding: "0 16px", textAlign: "center" }}>
              {categoryLabel}
            </span>
          )}
        </div>
      )}
      <span
        style={{
          position: "absolute", top: 10, left: 10, fontSize: 11, fontWeight: 600,
          padding: "3px 9px", borderRadius: 20, background: "rgba(0,0,0,0.55)",
          color: TYPE_COLOR[item.content_type] ?? "var(--texto)", backdropFilter: "blur(4px)",
        }}
      >
        {TYPE_LABEL[item.content_type] ?? item.content_type}
      </span>
    </div>
  );
}

const PAGE_SIZE = 24;

export default function ComunidadClient({ items }: Props) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent");
  const [openItem, setOpenItem] = useState<Item | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Al cambiar cualquier filtro/orden, volvemos a mostrar solo la primera página.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, filterType, filterCategory, sortOrder]);

  useEffect(() => {
    if (!openItem) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenItem(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openItem]);

  const categories = useMemo(
    () => [...new Set(items.map((i) => i.category).filter((c): c is string => !!c))].sort(),
    [items]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const result = items.filter((i) => {
      if (filterType && i.content_type !== filterType) return false;
      if (filterCategory && i.category !== filterCategory) return false;
      if (q && !i.title.toLowerCase().includes(q) && !i.public_teaser?.toLowerCase().includes(q)) return false;
      return true;
    });
    // items ya vienen ordenados por fecha desc. desde el servidor; solo invertimos si toca.
    return sortOrder === "oldest" ? [...result].reverse() : result;
  }, [items, search, filterType, filterCategory, sortOrder]);

  const visibleItems = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const selectStyle: React.CSSProperties = {
    background: "var(--card)", border: "1px solid var(--borde)", color: "var(--texto)",
    borderRadius: 6, padding: "9px 14px", fontSize: 14, cursor: "pointer",
    appearance: "none", WebkitAppearance: "none",
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...selectStyle, flex: "1 1 220px", minWidth: 200 }}
        />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ ...selectStyle, minWidth: 150 }}>
          <option value="">Todo</option>
          <option value="post">Posts</option>
          <option value="lesson">Lecciones</option>
        </select>
        {categories.length > 0 && (
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ ...selectStyle, minWidth: 180 }}>
            <option value="">Todas las categorías</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as "recent" | "oldest")} style={{ ...selectStyle, minWidth: 150 }}>
          <option value="recent">Más reciente</option>
          <option value="oldest">Más antiguo</option>
        </select>
      </div>

      <p style={{ fontSize: 13, color: "var(--texto-suave)", marginBottom: 20 }}>
        {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}>
        {visibleItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setOpenItem(item)}
            style={{
              display: "flex", flexDirection: "column", textAlign: "left",
              background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 10,
              overflow: "hidden", color: "var(--texto)", cursor: "pointer", padding: 0, font: "inherit",
              transition: "transform 150ms ease, border-color 150ms ease",
            }}
            className="comunidad-card"
          >
            <CardThumb item={item} />

            <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
              {item.category && (
                <p style={{ fontSize: 11, color: "var(--texto-suave)", textTransform: "uppercase", letterSpacing: 0.4 }}>
                  {item.category}
                </p>
              )}
              <p style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.35 }}>{item.title}</p>
              {item.public_teaser && (
                <p style={{
                  fontSize: 13, color: "var(--texto-suave)", lineHeight: 1.5, marginTop: 2,
                  display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                  {item.public_teaser}
                </p>
              )}
              <span style={{ fontSize: 12, color: "var(--oro)", marginTop: "auto", paddingTop: 10 }}>
                Ver detalles →
              </span>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <p style={{ color: "var(--texto-suave)", fontSize: 14, padding: "24px 0", gridColumn: "1 / -1" }}>
            No hay resultados para esta búsqueda.
          </p>
        )}
      </div>

      {hasMore && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            style={{
              background: "var(--card)", border: "1px solid var(--borde)", color: "var(--texto)",
              borderRadius: 6, padding: "10px 24px", fontSize: 14, cursor: "pointer",
            }}
          >
            Cargar más ({filtered.length - visibleCount} más)
          </button>
        </div>
      )}

      {openItem && (
        <div
          onClick={() => setOpenItem(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 12,
              maxWidth: 520, width: "100%", maxHeight: "85vh", overflowY: "auto",
              display: "flex", flexDirection: "column", position: "relative",
            }}
          >
            <CardThumb item={openItem} />
            <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                type="button"
                onClick={() => setOpenItem(null)}
                aria-label="Cerrar"
                style={{
                  position: "absolute", top: 14, right: 14, background: "rgba(0,0,0,0.5)", border: "none",
                  color: "#fff", width: 28, height: 28, borderRadius: "50%", cursor: "pointer", fontSize: 16,
                }}
              >
                ×
              </button>
              {openItem.category && (
                <p style={{ fontSize: 11, color: "var(--texto-suave)", textTransform: "uppercase", letterSpacing: 0.4 }}>
                  {openItem.category}
                </p>
              )}
              <h3 style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.3 }}>{openItem.title}</h3>
              {openItem.public_teaser && (
                <p style={{ fontSize: 14, color: "var(--texto-suave)", lineHeight: 1.6 }}>
                  {openItem.public_teaser}
                </p>
              )}
              <a
                href={openItem.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-cta"
                style={{ textAlign: "center", marginTop: 12, textDecoration: "none" }}
              >
                Ver en Skool →
              </a>
              <a
                href="https://api.whatsapp.com/send/?phone=34666136257&text=Hola+Jorge%2C+tengo+dudas+sobre+qu%C3%A9+plan+de+la+comunidad+me+conviene"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textAlign: "center", fontSize: 12, color: "var(--texto-suave)", textDecoration: "underline" }}
              >
                ¿Dudas sobre qué plan te conviene? Escríbeme
              </a>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .comunidad-card:hover {
          transform: translateY(-2px);
          border-color: var(--oro);
        }
      `}</style>
    </div>
  );
}
