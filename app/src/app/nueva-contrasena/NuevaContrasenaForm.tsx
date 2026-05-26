"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function NuevaContrasenaForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const router = useRouter();

  // Asegura que el SDK procese el token del hash antes de mostrar el form
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError("No se pudo actualizar la contraseña. El enlace puede haber expirado — solicita uno nuevo.");
      return;
    }

    setOk(true);
    setTimeout(() => router.push("/login"), 2500);
  }

  if (ok) {
    return (
      <div style={{ textAlign: "center", padding: "48px 0" }}>
        <p style={{ fontSize: 40 }}>✅</p>
        <h2 style={{ marginTop: 16, marginBottom: 8 }}>Contraseña actualizada</h2>
        <p style={{ color: "var(--texto-suave)" }}>Redirigiendo al login...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <p style={{ fontSize: 14, color: "var(--texto-suave)" }}>
        Elige una nueva contraseña para tu cuenta.
      </p>
      <input
        type="password"
        placeholder="Nueva contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        minLength={6}
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Repetir contraseña"
        value={confirm}
        onChange={e => setConfirm(e.target.value)}
        required
        style={inputStyle}
      />
      {error && <p style={{ color: "#e05c5c", fontSize: 14 }}>{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary"
        style={{ border: "none", cursor: "pointer" }}
      >
        {loading ? "..." : "Guardar contraseña"}
      </button>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  background: "var(--card)", border: "1px solid var(--borde)",
  borderRadius: 6, padding: "12px 16px",
  color: "var(--texto)", fontSize: 15, fontFamily: "inherit",
  outline: "none", width: "100%", boxSizing: "border-box",
};
