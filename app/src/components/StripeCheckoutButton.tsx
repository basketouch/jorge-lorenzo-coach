"use client";

import { useState } from "react";
import { trackMeta } from "@/lib/meta-pixel";
import { trackWeb } from "@/lib/web-analytics";

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
  const [error, setError] = useState("");

  async function abrir() {
    if (loading) return;
    setLoading(true);
    setError("");
    trackMeta("InitiateCheckout", { currency: "EUR" });
    trackWeb("cta_clicked", { cta_name: "trial" });
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
      else throw new Error("Stripe no devolvió una página de pago.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo abrir el pago.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={abrir}
        disabled={loading}
        className={className}
        style={{ ...style, opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer" }}
      >
        {loading ? "Redirigiendo..." : children}
      </button>
      {error && <p role="alert" style={{ marginTop: 8, color: "#e57373", fontSize: 12 }}>{error}</p>}
    </>
  );
}
