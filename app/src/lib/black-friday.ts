// Ventana real de la oferta (Europe/Madrid, CET = UTC+1):
// abre el viernes 27 nov 2026 a las 00:00 y cierra el lunes 30 nov a las 23:59:59.
export const BF_OPENS_AT = "2026-11-26T23:00:00.000Z";
export const BF_CLOSES_AT = "2026-11-30T22:59:59.000Z";
export const BF_PROMO_CODE = "BLACKFRIDAY120";

export type BlackFridayPhase = "pre" | "oferta" | "cerrada";

export function getBlackFridayPhase(now: number = Date.now()): BlackFridayPhase {
  if (now < new Date(BF_OPENS_AT).getTime()) return "pre";
  if (now > new Date(BF_CLOSES_AT).getTime()) return "cerrada";
  return "oferta";
}

// En producción la promoción solo se concede dentro de la ventana.
// En previews y local no se bloquea, para poder probar el checkout.
export function isBlackFridayOfferOpen(now: number = Date.now()): boolean {
  if (process.env.VERCEL_ENV !== "production") return true;
  return getBlackFridayPhase(now) === "oferta";
}
