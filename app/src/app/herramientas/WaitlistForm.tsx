"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";

export default function WaitlistForm({
  producto,
  productoId,
  descripcion,
}: {
  producto: string;
  productoId: string;
  descripcion: string;
}) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !nombre) return;

    setEstado("loading");
    setError("");

    const supabase = createClient();
    const { error: sbError } = await supabase
      .from("waitlist")
      .insert({ nombre, email, producto_id: productoId });

    if (sbError) {
      console.error(sbError);
      setError("Algo ha fallado. Inténtalo de nuevo.");
      setEstado("error");
      return;
    }

    setEstado("success");
  }

  return (
    <div className="waitlist-wrap">
      <h3 className="waitlist-titulo">{producto} — Lista de espera</h3>
      <p className="waitlist-desc">{descripcion}</p>

      {estado === "success" ? (
        <p className="waitlist-success">Apuntado. Te avisamos antes que a nadie.</p>
      ) : (
        <form className="waitlist-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="waitlist-input"
            required
          />
          <input
            type="email"
            placeholder="Tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="waitlist-input"
            required
          />
          <button type="submit" className="waitlist-btn" disabled={estado === "loading"}>
            {estado === "loading" ? "Enviando..." : "Apuntarme"}
          </button>
          {error && <p className="waitlist-error">{error}</p>}
        </form>
      )}
    </div>
  );
}
