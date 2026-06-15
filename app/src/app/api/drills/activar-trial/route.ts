import { createAdminClient } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  if (!token || token !== process.env.SKOOL_DRILL_TOKEN) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const admin = createAdminClient();

  // Comprobar si ya tiene acceso o trial activo
  const { data: perfil } = await admin
    .from("usuarios")
    .select("bdl_acceso, bdl_trial_start")
    .eq("id", user.id)
    .single();

  if (perfil?.bdl_acceso) {
    return NextResponse.json({ ok: true, status: "ya_tiene_acceso" });
  }

  if (perfil?.bdl_trial_start) {
    return NextResponse.json({ ok: true, status: "trial_activo" });
  }

  // Activar trial
  await admin
    .from("usuarios")
    .update({ bdl_trial_start: new Date().toISOString(), bdl_acceso: true })
    .eq("id", user.id);

  await admin
    .from("bdl_user_access")
    .upsert({ user_id: user.id, access_level: "member" }, { onConflict: "user_id" });

  return NextResponse.json({ ok: true, status: "trial_activado" });
}
