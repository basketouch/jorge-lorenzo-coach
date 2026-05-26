"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/cuenta";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [modo, setModo] = useState<"login" | "registro" | "recovery">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [verPassword, setVerPassword] = useState(false);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (modo === "recovery") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/nueva-contrasena`,
      });
      if (error) { setError("No hemos podido enviar el email. Comprueba la dirección."); setLoading(false); return; }
      setEnviado(true);
      setLoading(false);
      return;
    }

    if (modo === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError("Email o contraseña incorrectos."); setLoading(false); return; }

      if (data.session?.access_token) {
        fetch("/api/post-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: data.session.access_token }),
        }).catch(() => {});
      }

      router.push(redirect);
      router.refresh();

    } else {
      if (!nombre.trim() || !apellido.trim()) {
        setError("El nombre y apellido son obligatorios.");
        setLoading(false);
        return;
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nombre: nombre.trim(), apellido: apellido.trim() },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/cuenta`,
        },
      });
      if (error) { setError(error.message); setLoading(false); return; }

      // Enviar a Brevo
      fetch("/api/preview-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), nombre: nombre.trim(), apellido: apellido.trim() }),
      }).catch(() => {});

      setEnviado(true);
    }
    setLoading(false);
  }

  if (enviado) {
    return (
      <div style={{ textAlign: "center", padding: "48px 0" }}>
        <p style={{ fontSize: 32 }}>📧</p>
        <h2 style={{ marginTop: 16, marginBottom: 12 }}>Revisa tu email</h2>
        <p style={{ color: "var(--texto-suave)" }}>
          {modo === "recovery"
            ? <>Te hemos enviado un enlace para restablecer tu contraseña a <strong style={{ color: "var(--texto)" }}>{email}</strong>.</>
            : <>Te hemos enviado un enlace de confirmación a <strong style={{ color: "var(--texto)" }}>{email}</strong>.</>
          }
        </p>
        {modo === "recovery" && (
          <button
            type="button"
            onClick={() => { setModo("login"); setEnviado(false); setError(""); }}
            style={{ marginTop: 24, background: "none", border: "none", color: "var(--oro)", cursor: "pointer", fontSize: 14, fontWeight: 600 }}
          >
            ← Volver al login
          </button>
        )}
      </div>
    );
  }

  // Pantalla de recuperación
  if (modo === "recovery") {
    return (
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <p style={{ fontSize: 14, color: "var(--texto-suave)", marginBottom: 4 }}>
          Introduce tu email y te enviamos un enlace para restablecer tu contraseña.
        </p>
        <input
          type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          required style={inputStyle}
        />
        {error && <p style={{ color: "#e05c5c", fontSize: 14 }}>{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary"
          style={{ width: "100%", border: "none", cursor: "pointer" }}>
          {loading ? "..." : "Enviar enlace"}
        </button>
        <button
          type="button"
          onClick={() => { setModo("login"); setError(""); }}
          style={{ background: "none", border: "none", color: "var(--texto-suave)", cursor: "pointer", fontSize: 14, textAlign: "center" }}
        >
          ← Volver al login
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {modo === "registro" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <input
            type="text" placeholder="Nombre" value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required style={inputStyle}
          />
          <input
            type="text" placeholder="Apellido" value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required style={inputStyle}
          />
        </div>
      )}
      <input
        type="email" placeholder="Email" value={email}
        onChange={(e) => setEmail(e.target.value)}
        required style={inputStyle}
      />

      {/* Campo contraseña con ojo */}
      <div style={{ position: "relative" }}>
        <input
          type={verPassword ? "text" : "password"}
          placeholder="Contraseña" value={password}
          onChange={(e) => setPassword(e.target.value)}
          required style={{ ...inputStyle, paddingRight: 44 }}
        />
        <button
          type="button"
          onClick={() => setVerPassword(!verPassword)}
          style={{
            position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer",
            color: "var(--texto-suave)", fontSize: 18, lineHeight: 1, padding: 4,
          }}
          aria-label={verPassword ? "Ocultar contraseña" : "Ver contraseña"}
        >
          {verPassword ? "🙈" : "👁️"}
        </button>
      </div>

      {/* Olvidé mi contraseña — solo en modo login */}
      {modo === "login" && (
        <div style={{ textAlign: "right", marginTop: -8 }}>
          <button
            type="button"
            onClick={() => { setModo("recovery"); setError(""); }}
            style={{ background: "none", border: "none", color: "var(--texto-suave)", cursor: "pointer", fontSize: 13 }}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      )}

      {error && <p style={{ color: "#e05c5c", fontSize: 14 }}>{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary"
        style={{ width: "100%", border: "none", cursor: "pointer" }}>
        {loading ? "..." : modo === "login" ? "Entrar" : "Crear cuenta"}
      </button>

      <p style={{ textAlign: "center", fontSize: 14, color: "var(--texto-suave)" }}>
        {modo === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
        <button type="button" onClick={() => { setModo(modo === "login" ? "registro" : "login"); setError(""); }}
          style={{ background: "none", border: "none", color: "var(--oro)", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
          {modo === "login" ? "Regístrate" : "Inicia sesión"}
        </button>
      </p>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  background: "var(--card)", border: "1px solid var(--borde)",
  borderRadius: 6, padding: "12px 16px",
  color: "var(--texto)", fontSize: 15, fontFamily: "inherit",
  outline: "none", width: "100%", boxSizing: "border-box",
};
