import { useSyncExternalStore } from "react";

// Consentimiento de cookies de medición y publicidad (Píxel de Meta). Sin elección guardada, no se carga nada.
export const CONSENT_KEY = "jl_cookie_consent_v1";
export const CONSENT_EVENT = "jl-consent-change";
export const REOPEN_EVENT = "jl-cookie-reopen";

export type Consent = "accepted" | "rejected";

export function readConsent(): Consent | null {
  try {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    return stored === "accepted" || stored === "rejected" ? stored : null;
  } catch {
    return null;
  }
}

export function writeConsent(value: Consent | null) {
  try {
    if (value) window.localStorage.setItem(CONSENT_KEY, value);
    else window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    /* sin almacenamiento: se trata como sin elección */
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener(CONSENT_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CONSENT_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

/** Elección actual: "loading" mientras se hidrata la página, luego null (sin elegir), "accepted" o "rejected". */
export function useConsent(): Consent | null | "loading" {
  return useSyncExternalStore<Consent | null | "loading">(subscribe, readConsent, () => "loading");
}
