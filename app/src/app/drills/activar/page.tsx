import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { redirect } from "next/navigation";

export default async function ActivarTrialPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const returnUrl = `/drills/activar?token=${token ?? ""}`;
    redirect(`/login?redirect=${encodeURIComponent(returnUrl)}`);
  }

  // Validar token
  const tokenValido = token && token === process.env.SKOOL_DRILL_TOKEN;

  let status = "token_invalido";

  if (tokenValido) {
    const admin = createAdminClient();
    const { data: perfil } = await admin
      .from("usuarios")
      .select("bdl_acceso, bdl_trial_start")
      .eq("id", user.id)
      .single();

    if (perfil?.bdl_acceso && !perfil?.bdl_trial_start) {
      status = "ya_tiene_acceso";
    } else if (perfil?.bdl_trial_start) {
      status = "trial_activo";
    } else {
      await admin
        .from("usuarios")
        .update({ bdl_trial_start: new Date().toISOString(), bdl_acceso: true })
        .eq("id", user.id);
      await admin
        .from("bdl_user_access")
        .upsert({ user_id: user.id, access_level: "member" }, { onConflict: "user_id" });
      status = "trial_activado";
    }
  }

  const mensajes: Record<string, { titulo: string; sub: string; ok: boolean }> = {
    trial_activado:  { titulo: "Acceso activado.", sub: "Tienes 7 días de acceso completo al Drill Lab. Disfrútalo.", ok: true },
    trial_activo:    { titulo: "Tu prueba ya está activa.", sub: "Ya tienes acceso al Drill Lab. Sigue explorando.", ok: true },
    ya_tiene_acceso: { titulo: "Ya tienes acceso.", sub: "Tu cuenta ya tiene acceso completo al Drill Lab.", ok: true },
    token_invalido:  { titulo: "Enlace no válido.", sub: "El enlace no es correcto o ha caducado.", ok: false },
  };

  const { titulo, sub, ok } = mensajes[status];

  return (
    <>
      <nav>
        <a href="/" className="nav-logo">Jorge <span>Lorenzo</span></a>
      </nav>
      <section style={{ paddingTop: 160, paddingBottom: 80 }}>
        <div className="container" style={{ maxWidth: 560, textAlign: "center" }}>
          <div style={{ width: 48, height: 3, background: ok ? "var(--oro)" : "#e06", margin: "0 auto 32px" }} />
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>{titulo}</h1>
          <p style={{ fontSize: 16, color: "var(--texto-suave)", lineHeight: 1.7, marginBottom: 40 }}>{sub}</p>
          {ok && (
            <a href="/drills" className="btn-primary">Ver los ejercicios</a>
          )}
        </div>
      </section>
    </>
  );
}
