import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import SiteNav from "@/components/SiteNav";
import EnglishClient from "./EnglishClient";
import PwaRegister from "./PwaRegister";

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
        <SiteNav />
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
    .select("id, type, category, en, es, say, note, audio_url, context, command")
    .is("user_id", null)
    .eq("status", "approved")
    .order("created_at");

  // Load drills
  const { data: drills } = await admin
    .from("ec_drills")
    .select("id, en, es, meta, goal_en, goal_es, setup_en, setup_es, setup_audio, steps, cues, coach_lang, corrections, coaching, mistakes, progression")
    .eq("status", "approved")
    .order("order_index");

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
      <SiteNav />
      <EnglishClient
        userId={user.id}
        userAccessLevel={userAccessLevel}
        concepts={concepts ?? []}
        initialProgress={initialProgress}
        drills={(drills ?? []) as any}
      />
    </>
  );
}
