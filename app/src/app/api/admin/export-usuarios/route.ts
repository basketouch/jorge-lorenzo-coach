import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const { admin } = await requireAdmin();

  const [
    { data: usuarios },
    { data: compras },
    { data: accesoModulos },
    { data: modulos },
    { data: cursos },
    { data: accesos },
  ] = await Promise.all([
    admin.from("usuarios").select("id, nombre, apellido, email").eq("is_admin", false),
    admin.from("compras").select("user_id, curso_id, created_at"),
    admin.from("accesos_modulo").select("user_id, modulo_id"),
    admin.from("modulos").select("id, titulo, orden").order("orden"),
    admin.from("cursos").select("id, titulo"),
    admin.from("accesos").select("user_id, created_at").order("created_at", { ascending: false }),
  ]);

  const ultimoAccesoMap = new Map<string, string>();
  accesos?.forEach((a) => {
    if (!ultimoAccesoMap.has(a.user_id)) ultimoAccesoMap.set(a.user_id, a.created_at);
  });

  function fmt(iso?: string) {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  const modulosTitulos = (modulos ?? []).map((m) => m.titulo);
  const cursosTitulos = (cursos ?? []).map((c) => c.titulo);

  const headers = [
    "Nombre", "Apellido", "Email", "Último acceso",
    ...cursosTitulos.map((t) => `Acceso: ${t}`),
    ...modulosTitulos.map((t) => `Módulo: ${t}`),
  ];

  const rows = (usuarios ?? []).map((u) => {
    const cursosAcceso = (cursos ?? []).map((c) =>
      compras?.some((cp) => cp.user_id === u.id && cp.curso_id === c.id) ? "Sí" : "No"
    );
    const modulosAcceso = (modulos ?? []).map((m) =>
      accesoModulos?.some((am) => am.user_id === u.id && am.modulo_id === m.id) ? "Sí" : "No"
    );
    return [
      u.nombre ?? "",
      u.apellido ?? "",
      u.email ?? "",
      fmt(ultimoAccesoMap.get(u.id)),
      ...cursosAcceso,
      ...modulosAcceso,
    ];
  });

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="usuarios_${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
