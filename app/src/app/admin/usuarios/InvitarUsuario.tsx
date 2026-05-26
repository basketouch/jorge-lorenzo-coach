"use client";

import { useState } from "react";

export default function InvitarUsuario() {
  const [abierto, setAbierto] = useState(false);
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const [estado, setEstado] = useState<"idle" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function cerrar() { setAbierto(false); setEmail(""); setNombre(""); setEstado("idle"); setErrorMsg(""); }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setEstado("idle");
    const res = await fetch("/api/admin/enviar-acceso", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, nombre }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setEstado("ok");
    } else {
      setEstado("error");
      setErrorMsg(data.error ?? "Error al enviar");
    }
  }

  return (
    <>
      <button
        onClick={() => setAbierto(true)}
        style={{
          fontSize: 12, fontWeight: 600, padding: "7px 16px", borderRadius: 6,
          border: "1px solid var(--borde)", color: "var(--texto-suave)",
          background: "none", cursor: "pointer", fontFamily: "inherit",
        }}
      >
        🔑 Invitar usuario
      </button>

      {abierto && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          onClick={cerrar}
        >
          <div
            style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 12, padding: 32, width: "100%", maxWidth: 420 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0 }}>Invitar usuario</h3>
              <button onClick={cerrar} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--texto-suave)", fontSize: 22 }}>×</button>
            </div>

            {estado === "ok" ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <p style={{ fontSize: 32, marginBottom: 12 }}>✅</p>
                <p style={{ fontWeight: 600, marginBottom: 6 }}>Invitación enviada</p>
                <p style={{ fontSize: 13, color: "var(--texto-suave)", marginBottom: 20 }}>
                  {email} recibirá un email para crear su contraseña.
                </p>
                <button onClick={cerrar} className="btn-primary" style={{ fontSize: 13, padding: "8px 20px", border: "none", cursor: "pointer" }}>
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={enviar} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email *"
                  required
                  autoFocus
                  style={inputStyle}
                />
                <input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre (opcional)"
                  style={inputStyle}
                />
                {estado === "error" && (
                  <p style={{ fontSize: 12, color: "#e05c5c" }}>{errorMsg}</p>
                )}
                <p style={{ fontSize: 12, color: "var(--texto-suave)", lineHeight: 1.5 }}>
                  Se creará la cuenta si no existe y se enviará un email con enlace para crear la contraseña.
                </p>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
                  <button type="button" onClick={cerrar}
                    style={{ fontSize: 13, padding: "8px 16px", background: "none", border: "1px solid var(--borde)", borderRadius: 6, color: "var(--texto-suave)", cursor: "pointer", fontFamily: "inherit" }}>
                    Cancelar
                  </button>
                  <button type="submit" disabled={loading} className="btn-primary"
                    style={{ fontSize: 13, padding: "8px 20px", border: "none", cursor: "pointer" }}>
                    {loading ? "Enviando..." : "Enviar invitación →"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const inputStyle: React.CSSProperties = {
  background: "var(--negro)", border: "1px solid var(--borde)", borderRadius: 6,
  padding: "10px 14px", color: "var(--texto)", fontSize: 13, fontFamily: "inherit",
  outline: "none", width: "100%", boxSizing: "border-box",
};
