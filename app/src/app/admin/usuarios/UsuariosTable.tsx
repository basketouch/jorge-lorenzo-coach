"use client";

import { useState } from "react";
import QuickEmailBtn from "./QuickEmailBtn";

type Usuario = {
  id: string;
  nombre: string | null;
  apellido: string | null;
  email: string | null;
};

type Props = {
  usuarios: Usuario[];
  ultimoAccesoMap: Record<string, string>;
  progresosMap: Record<string, { completadas: number; total: number }>;
};

type Col = "nombre" | "email" | "acceso" | "lecciones";

function formatFecha(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

export default function UsuariosTable({ usuarios, ultimoAccesoMap, progresosMap }: Props) {
  const [sortCol, setSortCol] = useState<Col>("nombre");
  const [sortAsc, setSortAsc] = useState(true);

  function handleSort(col: Col) {
    if (sortCol === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(col);
      setSortAsc(true);
    }
  }

  const sorted = [...usuarios].sort((a, b) => {
    let va: string | number = "";
    let vb: string | number = "";

    if (sortCol === "nombre") {
      va = `${a.nombre ?? ""} ${a.apellido ?? ""}`.trim().toLowerCase();
      vb = `${b.nombre ?? ""} ${b.apellido ?? ""}`.trim().toLowerCase();
    } else if (sortCol === "email") {
      va = a.email?.toLowerCase() ?? "";
      vb = b.email?.toLowerCase() ?? "";
    } else if (sortCol === "acceso") {
      va = ultimoAccesoMap[a.id] ?? "";
      vb = ultimoAccesoMap[b.id] ?? "";
    } else if (sortCol === "lecciones") {
      va = progresosMap[a.id]?.completadas ?? 0;
      vb = progresosMap[b.id]?.completadas ?? 0;
    }

    if (va < vb) return sortAsc ? -1 : 1;
    if (va > vb) return sortAsc ? 1 : -1;
    return 0;
  });

  function Th({ col, label, className }: { col: Col; label: string; className?: string }) {
    const active = sortCol === col;
    return (
      <th
        onClick={() => handleSort(col)}
        className={className}
        style={{
          padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700,
          letterSpacing: "0.08em", textTransform: "uppercase",
          color: active ? "var(--oro)" : "var(--texto-suave)",
          whiteSpace: "nowrap", cursor: "pointer", userSelect: "none",
        }}
      >
        {label} {active ? (sortAsc ? "↑" : "↓") : <span style={{ opacity: 0.3 }}>↕</span>}
      </th>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--borde)" }}>
            <Th col="nombre" label="Nombre" />
            <Th col="email" label="Email" />
            <Th col="acceso" label="Último acceso" className="admin-col-acceso" />
            <Th col="lecciones" label="Lecciones" className="admin-col-lecciones" />
            <th style={{ padding: "10px 16px" }} />
          </tr>
        </thead>
        <tbody>
          {sorted.map((u) => {
            const { completadas = 0, total = 0 } = progresosMap[u.id] ?? {};
            return (
              <tr key={u.id} style={{ borderBottom: "1px solid var(--borde)" }}>
                <td style={{ padding: "14px 16px", fontWeight: 600, whiteSpace: "nowrap" }}>
                  <a href={`/admin/usuarios/${u.id}`} style={{ color: "var(--texto)", textDecoration: "none" }}>
                    {u.nombre || "—"} {u.apellido} →
                  </a>
                </td>
                <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                  {u.email
                    ? <span style={{ color: "var(--texto-suave)" }}>{u.email}</span>
                    : <span style={{ fontSize: 11, color: "#e06", border: "1px solid #e0666655", borderRadius: 4, padding: "2px 8px" }}>sin email</span>
                  }
                </td>
                <td className="admin-col-acceso" style={{ padding: "14px 16px", color: "var(--texto-suave)", whiteSpace: "nowrap" }}>
                  {formatFecha(ultimoAccesoMap[u.id])}
                </td>
                <td className="admin-col-lecciones" style={{ padding: "14px 16px", color: "var(--texto-suave)", whiteSpace: "nowrap" }}>
                  {completadas}/{total}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  {u.email && (
                    <QuickEmailBtn
                      email={u.email}
                      nombre={`${u.nombre ?? ""} ${u.apellido ?? ""}`.trim()}
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
