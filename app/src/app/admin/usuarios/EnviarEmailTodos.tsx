"use client";

import { useState } from "react";

interface Props {
  total: number;
}

export default function EnviarEmailTodos({ total }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [asunto, setAsunto] = useState("");
  const [contenido, setContenido] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<{ ok: boolean; enviados?: number; error?: string } | null>(null);

  function abrir() { setAbierto(true); setConfirmando(false); setResultado(null); }
  function cerrar() { setAbierto(false); setConfirmando(false); setResultado(null); setAsunto(""); setContenido(""); }

  async function enviar() {
    setLoading(true);
    setResultado(null);
    const res = await fetch("/api/admin/enviar-email-todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ asunto, contenido }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setResultado({ ok: true, enviados: data.enviados });
      setTimeout(cerrar, 2500);
    } else {
      setResultado({ ok: false, error: data.error ?? "Error al enviar" });
    }
  }

  return (
    <>
      <button
        onClick={abrir}
        style={{
          fontSize: 12, fontWeight: 600, padding: "7px 16px", borderRadius: 6,
          border: "1px solid var(--oro)", color: "var(--oro)",
          background: "none", cursor: "pointer", fontFamily: "inherit",
          display: "inline-flex", alignItems: "center", gap: 6,
        }}
      >
        ✉ Email a todos
      </button>

      {abierto && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          onClick={cerrar}
        >
          <div
            style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 12, padding: 32, width: "100%", maxWidth: 560 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h3 style={{ marginBottom: 4 }}>Email a todos los alumnos</h3>
                <p style={{ fontSize: 13, color: "var(--texto-suave)" }}>
                  Se enviará a <strong style={{ color: "var(--oro)" }}>{total} usuarios</strong>
                </p>
              </div>
              <button onClick={cerrar} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--texto-suave)", fontSize: 22 }}>×</button>
            </div>

            {!confirmando ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input
                  value={asunto}
                  onChange={(e) => setAsunto(e.target.value)}
                  placeholder="Asunto"
                  required
                  style={inputStyle}
                />
                <textarea
                  value={contenido}
                  onChange={(e) => setContenido(e.target.value)}
                  placeholder={"Escribe el mensaje...\n\nSepara párrafos con línea en blanco.\nUsa → Texto: https://url para botón dorado."}
                  required
                  rows={9}
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                />
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button type="button" onClick={cerrar} style={btnSecundario}>Cancelar</button>
                  <button
                    type="button"
                    disabled={!asunto.trim() || !contenido.trim()}
                    onClick={() => setConfirmando(true)}
                    className="btn-primary"
                    style={{ fontSize: 13, padding: "8px 20px", border: "none", cursor: "pointer", opacity: (!asunto.trim() || !contenido.trim()) ? 0.5 : 1 }}
                  >
                    Continuar →
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Vista previa */}
                <div style={{ background: "var(--negro)", border: "1px solid var(--borde)", borderRadius: 8, padding: 16 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--oro)", marginBottom: 10 }}>
                    Vista previa
                  </p>
                  <p style={{ fontSize: 13, color: "var(--texto)", fontWeight: 600, marginBottom: 6 }}>{asunto}</p>
                  <p style={{ fontSize: 12, color: "var(--texto-suave)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{contenido}</p>
                </div>

                <div style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 8, padding: "12px 16px" }}>
                  <p style={{ fontSize: 13, color: "var(--oro)" }}>
                    ⚠ Se enviará a <strong>{total} usuarios</strong>. Esta acción no se puede deshacer.
                  </p>
                </div>

                {resultado?.ok && (
                  <p style={{ fontSize: 13, color: "#4a9", textAlign: "center" }}>✓ {resultado.enviados} emails enviados correctamente.</p>
                )}
                {resultado?.error && (
                  <p style={{ fontSize: 13, color: "#e06" }}>Error: {resultado.error}</p>
                )}

                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button type="button" onClick={() => setConfirmando(false)} style={btnSecundario} disabled={loading}>
                    ← Editar
                  </button>
                  <button
                    type="button"
                    onClick={enviar}
                    disabled={loading}
                    className="btn-primary"
                    style={{ fontSize: 13, padding: "8px 20px", border: "none", cursor: loading ? "not-allowed" : "pointer" }}
                  >
                    {loading ? `Enviando...` : `Enviar a ${total} usuarios`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", background: "var(--negro)", border: "1px solid var(--borde)",
  borderRadius: 6, padding: "10px 14px", color: "var(--texto)",
  fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
};

const btnSecundario: React.CSSProperties = {
  fontSize: 13, padding: "8px 16px", background: "none",
  border: "1px solid var(--borde)", borderRadius: 6,
  color: "var(--texto-suave)", cursor: "pointer", fontFamily: "inherit",
};
