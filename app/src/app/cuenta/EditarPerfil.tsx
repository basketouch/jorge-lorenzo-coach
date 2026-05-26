"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";

interface Props {
  userId: string;
  nombreInicial: string;
  apellidoInicial: string;
}

export default function EditarPerfil({ userId, nombreInicial, apellidoInicial }: Props) {
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState(nombreInicial);
  const [apellido, setApellido] = useState(apellidoInicial);
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);

  async function guardar() {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("usuarios").upsert({
      id: userId,
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      updated_at: new Date().toISOString(),
    });
    setLoading(false);
    setEditando(false);
    setOk(true);
    setTimeout(() => setOk(false), 3000);
  }

  if (!editando) {
    return (
      <button
        onClick={() => setEditando(true)}
        style={{ background: "none", border: "none", color: "var(--texto-suave)", fontSize: 13, cursor: "pointer", padding: 0, textDecoration: "underline" }}
      >
        {ok ? "✓ Guardado" : nombreInicial ? "Editar nombre" : "Añadir nombre"}
      </button>
    );
  }

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
      <input
        type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre" style={inputStyle}
      />
      <input
        type="text" value={apellido} onChange={(e) => setApellido(e.target.value)}
        placeholder="Apellido" style={inputStyle}
      />
      <button onClick={guardar} disabled={loading} className="btn-primary"
        style={{ fontSize: 13, padding: "8px 16px", border: "none", cursor: "pointer" }}>
        {loading ? "..." : "Guardar"}
      </button>
      <button onClick={() => setEditando(false)}
        style={{ background: "none", border: "none", color: "var(--texto-suave)", fontSize: 13, cursor: "pointer" }}>
        Cancelar
      </button>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 6,
  padding: "8px 12px", color: "var(--texto)", fontSize: 14, fontFamily: "inherit",
  outline: "none", width: 140,
};
