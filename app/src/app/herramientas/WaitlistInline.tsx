"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";

export default function WaitlistInline({
  productoId,
  ctaTexto,
}: {
  productoId: string;
  ctaTexto: string;
}) {
  const [abierto, setAbierto] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !nombre) return;
    setEstado("loading");

    const supabase = createClient();
    const { error } = await supabase.from("waitlist").insert({ nombre, email, producto_id: productoId });

    if (error) {
      console.error(error);
      setEstado("error");
      return;
    }
    setEstado("success");
  }

  if (estado === "success") {
    return <p className="waitlist-inline-success">✓ Apuntado. Te avisamos antes que a nadie.</p>;
  }

  if (!abierto) {
    return (
      <button type="button" className="producto-cta producto-cta--waitlist" onClick={() => setAbierto(true)}>
        {ctaTexto}
      </button>
    );
  }

  return (
    <form className="waitlist-inline-form" onSubmit={handleSubmit}>
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
      {estado === "error" && <p className="waitlist-error">Algo ha fallado. Inténtalo de nuevo.</p>}
    </form>
  );
}
