import { createClient } from "@/lib/supabase-server";
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

  // Activar trial via API
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jorgelorenzo.coach";
  const res = await fetch(`${siteUrl}/api/drills/activar-trial`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
    cache: "no-store",
  });
  const data = await res.json();

  const mensajes: Record<string, { titulo: string; sub: string }> = {
    trial_activado:   { titulo: "Acceso activado.", sub: "Tienes 7 días de acceso completo al Drill Lab. Disfrútalo." },
    trial_activo:     { titulo: "Tu prueba ya está activa.", sub: "Ya tienes acceso al Drill Lab. Sigue explorando." },
    ya_tiene_acceso:  { titulo: "Ya tienes acceso.", sub: "Tu cuenta ya tiene acceso completo al Drill Lab." },
  };

  const { titulo, sub } = mensajes[data.status] ?? { titulo: "Enlace no válido.", sub: "El token no es correcto o ha caducado." };
  const ok = !!data.ok;

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
