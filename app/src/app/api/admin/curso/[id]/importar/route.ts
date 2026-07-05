import { createAdminClient } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const admin = createAdminClient();
  const { data } = await admin.from("usuarios").select("is_admin").eq("id", user.id).single();
  return !!data?.is_admin;
}

interface LeccionInput {
  titulo: string;
  orden: number;
  video_id: string | null;
  duracion: string | null;
}

interface ModuloInput {
  titulo: string;
  orden: number;
  lecciones: LeccionInput[];
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const cursoId = Number(id);
  const body = await req.json();
  const modulos: ModuloInput[] = body.modulos ?? [];

  if (!modulos.length) {
    return NextResponse.json({ error: "No hay módulos que importar" }, { status: 400 });
  }

  const admin = createAdminClient();
  let modulosCreados = 0;
  let leccionesCreadas = 0;

  for (const modulo of modulos) {
    const { data: moduloRow, error: moduloError } = await admin
      .from("modulos")
      .insert({ curso_id: cursoId, titulo: modulo.titulo, orden: modulo.orden })
      .select()
      .single();

    if (moduloError) {
      return NextResponse.json({
        error: `Error creando módulo "${modulo.titulo}": ${moduloError.message}`,
        modulosCreados, leccionesCreadas,
      }, { status: 500 });
    }
    modulosCreados++;

    if (modulo.lecciones.length > 0) {
      const { error: leccionesError } = await admin.from("lecciones_curso").insert(
        modulo.lecciones.map((l) => ({
          modulo_id: moduloRow.id,
          titulo: l.titulo,
          orden: l.orden,
          video_id: l.video_id,
          duracion: l.duracion,
        }))
      );

      if (leccionesError) {
        return NextResponse.json({
          error: `Error creando lecciones del módulo "${modulo.titulo}": ${leccionesError.message}`,
          modulosCreados, leccionesCreadas,
        }, { status: 500 });
      }
      leccionesCreadas += modulo.lecciones.length;
    }
  }

  return NextResponse.json({ ok: true, modulosCreados, leccionesCreadas });
}
