/** Céntimos → "249,99" (con decimales) o "250" (si es entero). Sin símbolo de moneda. */
export function formatPrecio(cents: number): string {
  const euros = cents / 100;
  return Number.isInteger(euros) ? String(euros) : euros.toFixed(2).replace(".", ",");
}
