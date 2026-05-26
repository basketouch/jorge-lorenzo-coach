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

export async function POST(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { titulo, slug } = body;

  if (!titulo?.trim() || !slug?.trim()) {
    return NextResponse.json({ error: "titulo y slug son obligatorios" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("cursos")
    .insert({ titulo: titulo.trim(), slug: slug.trim(), precio: 0, activo: false })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}
