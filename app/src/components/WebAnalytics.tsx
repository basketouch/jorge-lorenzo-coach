"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useConsent } from "@/lib/consent";
import { forgetAnonymousId, trackWeb } from "@/lib/web-analytics";

/** Registra las visitas de cada página en el Hub, solo con cookies de medición aceptadas. */
export default function WebAnalytics() {
  const consent = useConsent();
  const pathname = usePathname();

  useEffect(() => {
    if (consent === "rejected") forgetAnonymousId();
  }, [consent]);

  useEffect(() => {
    if (consent !== "accepted" || pathname.startsWith("/admin")) return;
    trackWeb("page_viewed");
  }, [pathname, consent]);

  return null;
}
