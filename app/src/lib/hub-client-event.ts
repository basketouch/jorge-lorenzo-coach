// Registra en Basketouch Hub que una persona ha comprado un curso completo, con la campaña, el medio y el
// contenido (botón o mail) de los que venía. Así el Hub sabe quién compró desde qué mail o anuncio, y
// reconoce a los clientes para excluirlos de futuras promociones.
// Es un evento de ciclo de vida: no cambia el consentimiento de email que la persona ya tuviera.
// Nunca debe romper el cobro: quien lo llama captura el error.

export async function reportClientToHub(input: {
  email: string;
  firstName: string;
  lastName?: string;
  stripeSessionId: string;
  productSlug: string | null;
  amountMinor: number | null;
  currency: string | null;
  attribution: Record<string, string | undefined>;
}): Promise<"saved" | "unconfigured" | "failed"> {
  const endpoint = process.env.HUB_CONTACT_EVENTS_URL;
  const secret = process.env.JORGE_LORENZO_COACH_CONTACT_EVENTS_SECRET;
  if (!endpoint || !secret) return "unconfigured";
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${secret}` },
      body: JSON.stringify({
        project: "jorge_lorenzo_coach",
        event_type: "lifecycle_updated",
        // Un reintento del webhook de Stripe no duplica el evento.
        event_id: `stripe:${input.stripeSessionId}:client`,
        email: input.email,
        first_name: input.firstName || null,
        last_name: input.lastName || null,
        source: "laboratorio_compra",
        lifecycle: "client",
        payload: {
          stripe_session_id: input.stripeSessionId,
          product: input.productSlug,
          amount_minor: input.amountMinor,
          currency: input.currency?.toUpperCase() ?? null,
          utm_source: input.attribution.utm_source ?? null,
          utm_medium: input.attribution.utm_medium ?? null,
          utm_campaign: input.attribution.utm_campaign ?? null,
          utm_content: input.attribution.utm_content ?? null,
        },
      }),
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) console.error("Hub no registró al cliente:", response.status, await response.text());
    return response.ok ? "saved" : "failed";
  } catch (error) {
    console.error("Error registrando al cliente en el Hub:", error);
    return "failed";
  }
}
