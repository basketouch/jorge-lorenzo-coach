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
  drillLabAccess = "anonymous",
  drillViewsUsed = 0,
}: {
  cursos: Curso[];
  modulosEnVenta: ModuloEnVenta[];
  drillLabAccess?: "anonymous" | "free" | "member";
  drillViewsUsed?: number;
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

  const FREE_QUOTA = 5;

  const drillLabBadge = drillLabAccess === "member"
    ? { label: "Acceso completo", color: "var(--oro)" }
    : drillLabAccess === "free" && drillViewsUsed < FREE_QUOTA
    ? { label: `${FREE_QUOTA - drillViewsUsed} ejercicio${FREE_QUOTA - drillViewsUsed !== 1 ? "s" : ""} disponible${FREE_QUOTA - drillViewsUsed !== 1 ? "s" : ""}`, color: "var(--texto-suave)" }
    : drillLabAccess === "free"
    ? { label: "Límite alcanzado", color: "#e57373" }
    : { label: "Gratis — 5 ejercicios", color: "var(--texto-suave)" };

  const DrillLabCard = () => (
    <Link href="/drills" style={{ textDecoration: "none" }}>
      <div className="tier-card" style={{ cursor: "pointer", height: "100%", position: "relative", display: "flex", flexDirection: "column" }}>
        {drillLabAccess === "member" && (
          <div style={{ position: "absolute", top: 12, right: 12, background: "var(--oro)", color: "var(--negro)", fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Acceso total
          </div>
        )}
        <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 16 }}>
          🏀
        </div>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--texto-suave)", marginBottom: 6 }}>Biblioteca digital</p>
        <p className="tier-nombre" style={{ marginBottom: 8 }}>Drill Lab</p>
        <p className="tier-desc" style={{ marginBottom: 16, flex: 1 }}>169 ejercicios de baloncesto. Del libro <em>The Complete Book of Offensive Drills</em>.</p>
        <div style={{ fontSize: 12, fontWeight: 700, color: drillLabBadge.color, marginBottom: 12 }}>
          {drillLabBadge.label}
        </div>
        <span className="tier-cta tier-cta-primary" style={{ display: "block", textAlign: "center" }}>
          {drillLabAccess === "anonymous" ? "Ver ejercicios" : "Abrir biblioteca"}
        </span>
      </div>
    </Link>
  );

  if (items.length === 0) {
    return (
      <>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24, marginTop: 48 }}>
          <DrillLabCard />
        </div>
      </>
    );
  }

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24, marginTop: 48 }}>
        <DrillLabCard />
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
