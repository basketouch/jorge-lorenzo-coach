import { readConsent } from "@/lib/consent";

// Medición propia de visitas y clics (se envía al Hub). Solo si la persona ha aceptado las cookies de medición.
const ANON_KEY = "jl_anon_id_v1";

function anonymousId(): string | null {
  try {
    let id = window.localStorage.getItem(ANON_KEY);
    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem(ANON_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

export function trackWeb(event: "page_viewed" | "cta_clicked", extra?: { cta_name?: string }) {
  if (typeof window === "undefined" || readConsent() !== "accepted") return;
  const anonymous_id = anonymousId();
  if (!anonymous_id) return;
  const body = JSON.stringify({ event_name: event, anonymous_id, path: window.location.pathname, ...extra });
  try {
    void fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
  } catch {
    /* la medición nunca debe romper la página */
  }
}

/** Borra el identificador anónimo (al rechazar las cookies después de haberlas aceptado). */
export function forgetAnonymousId() {
  try {
    window.localStorage.removeItem(ANON_KEY);
  } catch {
    /* sin almacenamiento */
  }
}
