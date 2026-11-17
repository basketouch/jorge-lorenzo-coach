"use client";

import { useEffect, useState } from "react";
import StripeCheckoutButton from "@/components/StripeCheckoutButton";
import styles from "./page.module.css";

const WATCHED = ["bf-hero-cta", "bf-mid-cta", "bf-final-cta"];

/**
 * Barra fija solo en móvil: precio y botón mientras no se ve ninguno de los botones de la página.
 * Se muestra después de bajar un poco y se oculta cuando uno de ellos entra en pantalla.
 */
export default function BlackFridayStickyBar({
  priceId,
  promotionCode,
  metadata,
}: {
  priceId: string;
  promotionCode: string;
  metadata: Record<string, string>;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const inView = new Set<string>();
    const update = () => setVisible(inView.size === 0 && window.scrollY > 200);
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) inView.add(entry.target.id);
        else inView.delete(entry.target.id);
      }
      update();
    });
    for (const id of WATCHED) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <div className={`${styles.stickyBar} ${visible ? styles.stickyVisible : ""}`} aria-hidden={!visible}>
      <div className={styles.stickyPrice}>
        <strong>119,99€</strong>
        <span>hasta el 30 nov</span>
      </div>
      <StripeCheckoutButton
        priceId={priceId}
        promotionCode={promotionCode}
        metadata={metadata}
        style={{ flex: 1, padding: "14px 16px", fontSize: 15, fontWeight: 900, border: 0, borderRadius: 8, background: "#d8b33f", color: "#0a0a0a" }}
      >
        Quiero el Laboratorio →
      </StripeCheckoutButton>
    </div>
  );
}
