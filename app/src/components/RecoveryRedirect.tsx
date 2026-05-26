"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";

/**
 * Detecta tokens de recovery en el hash (implicit flow de Supabase).
 * Llama setSession explícitamente para guardar la sesión en cookies,
 * y luego redirige a /nueva-contrasena SIN hash. Así updateUser encuentra
 * la sesión activa y puede cambiar la contraseña.
 */
export default function RecoveryRedirect() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("type=recovery") || !hash.includes("access_token=")) return;

    const params = new URLSearchParams(hash.substring(1));
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (!access_token || !refresh_token) return;

    const supabase = createClient();
    supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
      if (!error) {
        window.location.replace("/nueva-contrasena");
      }
    });
  }, []);

  return null;
}
