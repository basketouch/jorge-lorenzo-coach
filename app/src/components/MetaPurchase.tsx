"use client";

import { useEffect } from "react";
import { trackMetaWhenReady } from "@/lib/meta-pixel";

/** Envía la compra al Píxel de Meta al volver de Stripe (`?compra=ok`), una sola vez por sesión. */
export default function MetaPurchase() {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("compra") !== "ok") return;
    try {
      if (window.sessionStorage.getItem("jl_meta_purchase")) return;
      window.sessionStorage.setItem("jl_meta_purchase", "1");
    } catch {
      /* sin sessionStorage: se envía igualmente */
    }
    trackMetaWhenReady("Purchase", { currency: "EUR" });
  }, []);
  return null;
}
