"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

function remainingParts(target: string) {
  const distance = new Date(target).getTime() - Date.now();
  if (distance <= 0) return null;
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance % 86_400_000) / 3_600_000),
    minutes: Math.floor((distance % 3_600_000) / 60_000),
  };
}

function remainingTime(target: string, closedText: string) {
  const parts = remainingParts(target);
  return parts ? `${parts.days}d ${parts.hours}h ${parts.minutes}m` : closedText;
}

const two = (value: number) => String(value).padStart(2, "0");

/**
 * Cuenta atrás. Por defecto es una línea de texto («8d 14h 25m»); con `tiles` se dibuja en tres
 * casillas (días, horas, minutos) para el bloque de escritorio.
 */
export default function BlackFridayCountdown({ target, closedText = "OFERTA CERRADA", tiles = false }: { target: string; closedText?: string; tiles?: boolean }) {
  const [remaining, setRemaining] = useState(() => remainingTime(target, closedText));
  const [parts, setParts] = useState(() => remainingParts(target));
  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemaining(remainingTime(target, closedText));
      setParts(remainingParts(target));
    }, 30_000);
    return () => window.clearInterval(timer);
  }, [target, closedText]);

  if (!tiles) return <strong>{remaining}</strong>;
  if (!parts) return <strong className={styles.countdownClosed}>{closedText}</strong>;
  return (
    <div className={styles.countdownTiles} role="timer" aria-label={`${parts.days} días, ${parts.hours} horas y ${parts.minutes} minutos`}>
      <div><b>{two(parts.days)}</b><span>días</span></div>
      <div><b>{two(parts.hours)}</b><span>horas</span></div>
      <div><b>{two(parts.minutes)}</b><span>min</span></div>
    </div>
  );
}
