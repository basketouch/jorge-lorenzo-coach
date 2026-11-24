// Alta de un contacto en la lista general de Brevo (#15), la que usan las campañas de newsletter y Black Friday.
// Los formularios del Black Friday guardan a la persona en el Hub; Brevo envía el Black Friday (último envío
// con sus listas), así que hay que dejarla también aquí. Nunca bloquea el formulario: si falla, devuelve el error.
// Brevo respeta las bajas anteriores: añadir a una lista no reactiva a un contacto dado de baja o bloqueado.

export const BREVO_NEWSLETTER_LIST_ID = 15;

// Solo el primer nombre y bien escrito, para que el saludo del email salga limpio.
export function cleanFirstName(name: string): string {
  const first = name.trim().split(/\s+/)[0] ?? "";
  return first ? first.charAt(0).toLocaleUpperCase("es") + first.slice(1).toLocaleLowerCase("es") : "";
}

export async function addContactToBrevoList(email: string, firstName: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return { ok: false, error: "Falta BREVO_API_KEY" };
  try {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: { "api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        attributes: { NOMBRE: cleanFirstName(firstName) },
        listIds: [BREVO_NEWSLETTER_LIST_ID],
        updateEnabled: true,
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return { ok: false, error: `${response.status} ${await response.text()}`.slice(0, 300) };
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Error de red con Brevo" };
  }
}
