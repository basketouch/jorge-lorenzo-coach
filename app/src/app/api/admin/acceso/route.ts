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

  const { userId, cursoId, cursoSlug, action } = await req.json();
  const admin = createAdminClient();

  if (action === "grant") {
    await admin.from("compras").upsert(
      { user_id: userId, curso_id: cursoId, paddle_transaction_id: `admin-acceso-${userId}-${cursoId}` },
      { onConflict: "paddle_transaction_id" }
    );
  } else {
    await admin.from("compras")
      .delete()
      .eq("user_id", userId)
      .eq("curso_id", cursoId);
  }

  return NextResponse.json({ ok: true });
}
