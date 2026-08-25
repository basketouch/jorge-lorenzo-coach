"use client";

import { useState, useMemo } from "react";

type Item = {
  id: string;
  content_type: string;
  title: string;
  category: string | null;
  source_url: string;
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

export default function ComunidadClient({ items }: Props) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const categories = useMemo(
    () => [...new Set(items.map((i) => i.category).filter((c): c is string => !!c))].sort(),
    [items]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter((i) => {
      if (filterType && i.content_type !== filterType) return false;
      if (filterCategory && i.category !== filterCategory) return false;
      if (q && !i.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [items, search, filterType, filterCategory]);

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
      </div>

      <p style={{ fontSize: 13, color: "var(--texto-suave)", marginBottom: 16 }}>
        {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((item) => (
          <a
            key={item.id}
            href={item.source_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16,
              background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 8,
              padding: "14px 18px", textDecoration: "none", color: "var(--texto)",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {item.title}
              </p>
              <p style={{ fontSize: 12, color: "var(--texto-suave)" }}>
                {TYPE_LABEL[item.content_type] ?? item.content_type}
                {item.category ? ` · ${item.category}` : ""}
              </p>
            </div>
            <span style={{ fontSize: 12, color: "var(--oro)", whiteSpace: "nowrap" }}>Ver en Skool →</span>
          </a>
        ))}
        {filtered.length === 0 && (
          <p style={{ color: "var(--texto-suave)", fontSize: 14, padding: "24px 0" }}>
            No hay resultados para esta búsqueda.
          </p>
        )}
      </div>
    </div>
  );
}
