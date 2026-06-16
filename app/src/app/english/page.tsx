import { createClient } from "@/lib/supabase-server";

export const metadata = {
  title: "English Coach — Jorge Lorenzo",
  description: "Aprende el inglés que necesitas para dirigir entrenamientos de baloncesto. Vocabulario, frases y ejercicios con audio.",
};

export const dynamic = "force-dynamic";

const ENGLISH_COACH_URL = "https://english-coach-basketouch.vercel.app";

export default async function EnglishPage() {
  const supabase = await createClient();
  let user = null;
  try { const { data } = await supabase.auth.getUser(); user = data.user; } catch {}

  return (
    <>
      <nav>
        <a href="/" className="nav-logo">Jorge <span>Lorenzo</span></a>
        <div className="nav-links">
          <a href="/drills" className="nav-link">Drill Lab</a>
          {user ? (
            <a href="/cuenta" className="nav-link">Mi cuenta</a>
          ) : (
            <a href="/login" className="nav-link">Iniciar sesión</a>
          )}
          <a
            href={ENGLISH_COACH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-cta"
          >
            Abrir app
          </a>
        </div>
      </nav>

      <div style={{
        position: "fixed",
        top: 61,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "stretch",
        background: "#14151A",
      }}>
        <iframe
          src={ENGLISH_COACH_URL}
          style={{
            width: "100%",
            maxWidth: 430,
            height: "100%",
            border: "none",
            display: "block",
          }}
          title="English Coach"
          allow="autoplay; microphone"
        />
      </div>
    </>
  );
}
