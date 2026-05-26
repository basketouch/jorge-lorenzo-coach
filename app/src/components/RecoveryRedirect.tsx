"use client";

import { useEffect } from "react";

/**
 * Detecta tokens de recovery en el hash de la URL (implicit flow de Supabase)
 * y hace una navegación completa a /nueva-contrasena con el hash preservado.
 * Necesita window.location (no router.replace) para que el SDK de Supabase
 * se inicialice de cero en la nueva página y detecte el access_token.
 */
export default function RecoveryRedirect() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery") && hash.includes("access_token=")) {
      window.location.replace("/nueva-contrasena" + hash);
    }
  }, []);

  return null;
}
