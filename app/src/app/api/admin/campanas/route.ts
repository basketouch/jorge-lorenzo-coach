import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { formatPrecio } from "@/lib/format-price";

// GET — listar todas las campañas
export async function GET() {
  const { admin } = await requireAdmin();
  const { data, error } = await admin
    .from("campanas_programadas")
    .select("*, modulos(titulo, orden)")
    .order("enviar_en", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST — generar 3 campañas para un módulo
export async function POST(req: NextRequest) {
  const { admin } = await requireAdmin();
  const { modulo_id } = await req.json();

  const { data: modulo, error } = await admin
    .from("modulos")
    .select("id, titulo, orden, precio, fecha_apertura, fecha_cierre_venta, cursos(slug)")
    .eq("id", modulo_id)
    .single();

  if (error || !modulo) return NextResponse.json({ error: "Módulo no encontrado" }, { status: 404 });
  if (!modulo.fecha_apertura || !modulo.fecha_cierre_venta) {
    return NextResponse.json({ error: "El módulo necesita fecha de apertura y cierre" }, { status: 400 });
  }

  const precio = modulo.precio ? formatPrecio(modulo.precio) : "75";
  const curso = modulo.cursos as unknown as { slug: string };
  const urlModulo = `https://jorgelorenzo.coach/modulos/${modulo.id}`;
  const fechaCierreStr = new Date(modulo.fecha_cierre_venta).toLocaleDateString("es-ES", { day: "numeric", month: "long" });
  const horaCierreStr = new Date(modulo.fecha_cierre_venta).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

  const apertura = new Date(modulo.fecha_apertura);
  const cierre = new Date(modulo.fecha_cierre_venta);
  const recordatorio = new Date(cierre.getTime() - 3 * 24 * 60 * 60 * 1000);
  const ultimoDia = new Date(cierre.getTime() - 24 * 60 * 60 * 1000);

  const campanas = [
    {
      modulo_id,
      tipo: "apertura",
      enviar_en: apertura.toISOString(),
      asunto: `Ya está disponible — ${modulo.titulo}`,
      contenido: `El Capítulo ${modulo.orden} ya está abierto: ${modulo.titulo}.\n\n[Escribe aquí el gancho del contenido: qué se trabaja, por qué es relevante, un detalle concreto.]\n\nEstá disponible hasta el ${fechaCierreStr}. Después cierra.\n\n→ Ver el módulo — ${precio}€: ${urlModulo}`,
    },
    {
      modulo_id,
      tipo: "recordatorio",
      enviar_en: recordatorio.toISOString(),
      asunto: `Quedan 3 días — ${modulo.titulo}`,
      contenido: `Solo un recordatorio: el Capítulo ${modulo.orden} se cierra el ${fechaCierreStr}.\n\nSi todavía no lo has visto, este es el momento. Después no estará disponible hasta la próxima apertura, y no sé cuándo será.\n\n→ Ver el módulo — ${precio}€: ${urlModulo}`,
    },
    {
      modulo_id,
      tipo: "cierre",
      enviar_en: ultimoDia.toISOString(),
      asunto: `Mañana cierra — ${modulo.titulo}`,
      contenido: `Mañana a las ${horaCierreStr} se cierra el acceso al Capítulo ${modulo.orden}: ${modulo.titulo}.\n\nSi quieres quedarte con él, es ahora.\n\n→ Comprar antes de que cierre — ${precio}€: ${urlModulo}`,
    },
  ];

  const { error: insertError } = await admin
    .from("campanas_programadas")
    .insert(campanas);

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
