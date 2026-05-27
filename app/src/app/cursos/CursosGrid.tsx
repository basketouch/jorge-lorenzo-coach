"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CuentaAtrasVenta from "@/components/CuentaAtrasVenta";

const PAGE_SIZE = 6;

interface Curso {
  id: number;
  slug: string;
  titulo: string;
  descripcion?: string;
  precio: number;
  portada_url?: string;
}

interface ModuloEnVenta {
  id: number;
  titulo: string;
  portada_url?: string;
  precio?: number;
  fecha_cierre_venta?: string;
  cursos: { slug: string } | null;
}

interface Item {
  tipo: "curso" | "modulo";
  key: string;
  data: Curso | ModuloEnVenta;
}

export default function CursosGrid({
  cursos,
  modulosEnVenta,
}: {
  cursos: Curso[];
  modulosEnVenta: ModuloEnVenta[];
}) {
  const [visibles, setVisibles] = useState(PAGE_SIZE);

  // Cursos primero, luego módulos en venta
  const items: Item[] = [
    ...cursos.map(c => ({ tipo: "curso" as const, key: `curso-${c.id}`, data: c })),
    ...modulosEnVenta.map(m => ({ tipo: "modulo" as const, key: `mod-${m.id}`, data: m })),
  ];

  const mostrados = items.slice(0, visibles);
  const hayMas = visibles < items.length;
  const quedan = items.length - visibles;

  if (items.length === 0) {
    return (
      <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "80px 0", color: "var(--texto-suave)" }}>
        <p style={{ fontSize: 32, marginBottom: 16 }}>🏀</p>
        <p style={{ fontSize: 18 }}>Próximamente — los primeros cursos llegan antes del inicio de temporada.</p>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24, marginTop: 48 }}>
        {mostrados.map(item => {
          if (item.tipo === "curso") {
            const c = item.data as Curso;
            return (
              <Link key={item.key} href={`/cursos/${c.slug}`} style={{ textDecoration: "none" }}>
                <div className="tier-card" style={{ cursor: "pointer", height: "100%" }}>
                  {c.portada_url && (
                    <Image src={c.portada_url} alt={c.titulo} width={640} height={360} style={{ width: "100%", height: "auto", borderRadius: 6, marginBottom: 16, objectFit: "cover" }} />
                  )}
                  <p className="tier-nombre">{c.titulo}</p>
                  {c.descripcion && <p className="tier-desc" style={{ marginTop: 8 }}>{c.descripcion}</p>}
                  <div className="tier-precio" style={{ marginTop: 16 }}>{(c.precio / 100).toFixed(0)}€</div>
                  <span className="tier-cta tier-cta-primary" style={{ display: "block", textAlign: "center", marginTop: 16 }}>Ver curso</span>
                </div>
              </Link>
            );
          }

          const m = item.data as ModuloEnVenta;
          return (
            <Link key={item.key} href={`/modulos/${m.id}`} style={{ textDecoration: "none" }}>
              <div className="tier-card" style={{ cursor: "pointer", position: "relative", height: "100%" }}>
                <div style={{ position: "absolute", top: 12, right: 12, background: "var(--oro)", color: "var(--negro)", fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 4, letterSpacing: "0.08em", textTransform: "uppercase", zIndex: 1 }}>
                  En venta
                </div>
                {m.portada_url && (
                  <Image src={m.portada_url} alt={m.titulo} width={640} height={360} style={{ width: "100%", height: "auto", borderRadius: 6, marginBottom: 16, objectFit: "cover" }} />
                )}
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--texto-suave)", marginBottom: 6 }}>Módulo individual</p>
                <p className="tier-nombre">{m.titulo}</p>
                <div className="tier-precio" style={{ marginTop: 16 }}>{m.precio ? (m.precio / 100).toFixed(0) : "—"}€</div>
                {m.fecha_cierre_venta && <CuentaAtrasVenta fecha={m.fecha_cierre_venta} />}
                <span className="tier-cta tier-cta-primary" style={{ display: "block", textAlign: "center", marginTop: 16 }}>Ver módulo</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Ver más */}
      {hayMas && (
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <button
            onClick={() => setVisibles(v => v + PAGE_SIZE)}
            style={{
              fontSize: 13, fontWeight: 600, padding: "12px 32px",
              background: "none", border: "1px solid var(--borde)",
              borderRadius: 8, color: "var(--texto)", cursor: "pointer",
              fontFamily: "inherit", transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={e => { (e.target as HTMLButtonElement).style.borderColor = "var(--oro)"; (e.target as HTMLButtonElement).style.color = "var(--oro)"; }}
            onMouseLeave={e => { (e.target as HTMLButtonElement).style.borderColor = "var(--borde)"; (e.target as HTMLButtonElement).style.color = "var(--texto)"; }}
          >
            Ver más ({quedan} {quedan === 1 ? "más" : "más"})
          </button>
        </div>
      )}
    </>
  );
}
