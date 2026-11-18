"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useConsent } from "@/lib/consent";
import { trackMeta } from "@/lib/meta-pixel";

const PIXEL_ID = /^\d{8,20}$/.test(process.env.NEXT_PUBLIC_META_PIXEL_ID || "") ? process.env.NEXT_PUBLIC_META_PIXEL_ID : null;

/** Carga el Píxel de Meta solo si hay ID configurado y la persona ha aceptado las cookies. */
export default function MetaPixel() {
  const accepted = useConsent() === "accepted";
  const pathname = usePathname();
  const firstView = useRef(true);

  // El primer PageView lo envía el propio código del Píxel; aquí solo las navegaciones posteriores.
  useEffect(() => {
    if (!accepted) return;
    if (firstView.current) {
      firstView.current = false;
      return;
    }
    trackMeta("PageView");
  }, [pathname, accepted]);

  if (!PIXEL_ID || !accepted || pathname.startsWith("/admin")) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
    </Script>
  );
}
