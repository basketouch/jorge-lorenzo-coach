"use client";

import { useState } from "react";

export default function StripeCheckoutButton({
  priceId,
  metadata,
  promotionCode,
  children,
  className,
  style,
}: {
  priceId: string;
  metadata?: Record<string, string>;
  promotionCode?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [loading, setLoading] = useState(false);

  async function abrir() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, metadata, promotionCode }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result.error || "No se pudo abrir el pago.");
      const { url } = result;
      if (url) window.location.href = url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={abrir}
      disabled={loading}
      className={className}
      style={{ ...style, opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer" }}
    >
      {loading ? "Redirigiendo..." : children}
    </button>
  );
}
