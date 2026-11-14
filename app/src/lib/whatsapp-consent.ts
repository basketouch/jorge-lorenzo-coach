// Alta de WhatsApp. El consentimiento es de empresa (Basketouch Solutions Spain SL): el teléfono y la
// aceptación se envían a Basketouch Hub, que es donde se guarda la ficha de cada contacto.
// Si se cambia el texto de la casilla, hay que cambiar también la versión.

export const WHATSAPP_CONSENT_VERSION = "2026-11-14";
export const WHATSAPP_CONSENT_TEXT =
  "Acepto que Basketouch Solutions Spain SL me escriba por WhatsApp a este número con novedades, contenidos exclusivos y ofertas de sus productos y servicios. Puedo darme de baja en cualquier momento.";

/** Formato internacional; un número español de 9 cifras sin prefijo se toma como +34. */
export function normalizePhone(raw: string): string | null {
  let phone = raw.replace(/[\s().-]/g, "").replace(/^00/, "+");
  if (/^[6789][0-9]{8}$/.test(phone)) phone = `+34${phone}`;
  return /^\+[1-9][0-9]{7,14}$/.test(phone) ? phone : null;
}

const HUB_URL = (process.env.HUB_WHATSAPP_CONSENT_URL || "https://hub.basketouch.com/api/contacts/whatsapp-consent").trim();

export type HubConsentResult = "saved" | "unconfigured" | "failed";

/** Envía teléfono y aceptación al Hub. Solo desde el servidor: usa un secreto que no debe llegar al navegador. */
export async function sendWhatsappConsentToHub(input: {
  email: string;
  firstName: string;
  lastName?: string;
  phone: string;
  consent: boolean;
  source: string;
}): Promise<HubConsentResult> {
  const secret = (process.env.HUB_WHATSAPP_CONSENT_SECRET || "").trim();
  if (!secret) return "unconfigured";
  try {
    const response = await fetch(HUB_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${secret}` },
      body: JSON.stringify({
        email: input.email,
        first_name: input.firstName,
        last_name: input.lastName || null,
        phone: input.phone,
        whatsapp_consent: input.consent,
        whatsapp_consent_text_version: input.consent ? WHATSAPP_CONSENT_VERSION : null,
        source: input.source,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    return response.ok ? "saved" : "failed";
  } catch {
    return "failed";
  }
}

export type WhatsappStatus = { phone: string | null; consent: boolean };

async function hubAction(action: "get" | "revoke", email: string): Promise<WhatsappStatus | null> {
  const secret = (process.env.HUB_WHATSAPP_CONSENT_SECRET || "").trim();
  if (!secret) return null;
  try {
    const response = await fetch(HUB_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${secret}` },
      body: JSON.stringify({ action, email }),
      signal: AbortSignal.timeout(8_000),
      cache: "no-store",
    });
    if (!response.ok) return null;
    const body = await response.json();
    return { phone: typeof body.phone === "string" ? body.phone : null, consent: body.whatsapp_consent === true };
  } catch {
    return null;
  }
}

/** Teléfono y aceptación que el Hub tiene guardados para ese email; null si no se pudo consultar. */
export function getWhatsappStatusFromHub(email: string) {
  return hubAction("get", email);
}

/** Retira la aceptación de WhatsApp de ese email en el Hub (el teléfono se conserva). */
export function revokeWhatsappConsentInHub(email: string) {
  return hubAction("revoke", email);
}
