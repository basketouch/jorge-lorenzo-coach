declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Envía un evento al Píxel de Meta. Si no hay consentimiento, el Píxel no está cargado y no hace nada. */
export function trackMeta(event: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") window.fbq("track", event, params);
}

/** Igual que trackMeta, pero espera hasta 5 s a que el Píxel termine de cargarse (para eventos al abrir la página). */
export function trackMetaWhenReady(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    if (typeof window.fbq === "function") {
      window.fbq("track", event, params);
      window.clearInterval(timer);
    } else if (attempts >= 17) {
      window.clearInterval(timer);
    }
  }, 300);
}
