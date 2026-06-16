import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import NavHamburger from "@/components/NavHamburger";
import EnglishClient from "./EnglishClient";
import PwaRegister from "./PwaRegister";

const NAV_LINKS = [
  { label: "Comunidad", href: "/#niveles" },
  { label: "El Laboratorio", href: "/cursos/laboratorio-2526" },
  { label: "Drill Lab", href: "/drills" },
  { label: "English Coach", href: "/english" },
  { label: "Newsletter", href: "/newsletter" },
];

export const metadata = {
  title: "English Coach — Jorge Lorenzo",
  description: "Aprende el inglés que necesitas para dirigir entrenamientos de baloncesto. Vocabulario, frases y ejercicios con audio.",
  manifest: "/english-manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "English Coach",
  },
  icons: {
    apple: "/icons/english-apple-touch.png",
  },
};

export const dynamic = "force-dynamic";

export default async function EnglishPage() {
  const supabase = await createClient();
  const admin = createAdminClient();

  let user = null;
  try { const { data } = await supabase.auth.getUser(); user = data.user; } catch {}

  // Gate: require login
  if (!user) {
    return (
      <>
        <PwaRegister />
        <nav>
          <a href="/" className="nav-logo">Jorge <span>Lorenzo</span></a>
          <div className="nav-links">
            {NAV_LINKS.map(l => <a key={l.href} href={l.href} className="nav-link">{l.label}</a>)}
            <a href="/login?redirect=/english" className="nav-cta">Iniciar sesión</a>
          </div>
          <NavHamburger links={[...NAV_LINKS]} />
        </nav>
        <section style={{ paddingTop: 120, paddingBottom: 80, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", maxWidth: 400, padding: "0 24px" }}>
            <div style={{ fontSize: 56, marginBottom: 24 }}>🏀</div>
            <h1 style={{ fontSize: 32, fontFamily: "var(--font-display)", marginBottom: 16 }}>English Coach</h1>
            <p style={{ color: "var(--texto-suave)", fontSize: 17, lineHeight: 1.6, marginBottom: 32 }}>
              Aprende el inglés que necesitas para dirigir entrenamientos de baloncesto. Vocabulario, frases y ejercicios con audio.
            </p>
            <a href="/login?redirect=/english" className="btn-primary" style={{ display: "inline-block" }}>
              Iniciar sesión
            </a>
          </div>
        </section>
      </>
    );
  }

  // Check access level
  let userAccessLevel: "free" | "member" = "free";
  try {
    const { data: access } = await admin
      .from("bdl_user_access")
      .select("access_level")
      .eq("user_id", user.id)
      .single();
    if (access?.access_level === "member") userAccessLevel = "member";
  } catch {}

  // Load base concepts
  const { data: concepts } = await admin
    .from("ec_concepts")
    .select("id, type, category, en, es, say, note, audio_url")
    .is("user_id", null)
    .eq("status", "approved")
    .order("created_at");

  // Load progress for members
  let initialProgress: any[] = [];
  if (userAccessLevel === "member") {
    const { data: prog } = await admin
      .from("ec_progress")
      .select("concept_id, level, streak, attempts, correct_count, next_review, last_seen")
      .eq("user_id", user.id);
    initialProgress = prog ?? [];
  }

  return (
    <>
      <PwaRegister />
      <nav>
        <a href="/" className="nav-logo">Jorge <span>Lorenzo</span></a>
        <div className="nav-links">
          {NAV_LINKS.map(l => <a key={l.href} href={l.href} className="nav-link">{l.label}</a>)}
          <a href="/cuenta" className="nav-cta">Mi cuenta</a>
        </div>
        <NavHamburger links={[...NAV_LINKS, { label: "Mi cuenta", href: "/cuenta" }]} />
      </nav>
      <EnglishClient
        userId={user.id}
        userAccessLevel={userAccessLevel}
        concepts={concepts ?? []}
        initialProgress={initialProgress}
      />
    </>
  );
}
