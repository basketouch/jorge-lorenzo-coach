"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Detecta tokens de recovery en el hash de la URL (implicit flow de Supabase)
 * y redirige a /nueva-contrasena preservando el hash para que el SDK lo procese.
 */
export default function RecoveryRedirect() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery") && hash.includes("access_token=")) {
      router.replace("/nueva-contrasena" + hash);
    }
  }, [router]);

  return null;
}
