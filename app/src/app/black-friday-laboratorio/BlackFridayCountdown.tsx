"use client";

import { useEffect, useState } from "react";

function remainingTime(target: string, closedText: string) {
  const distance = new Date(target).getTime() - Date.now();
  if (distance <= 0) return closedText;
  const days = Math.floor(distance / 86_400_000);
  const hours = Math.floor((distance % 86_400_000) / 3_600_000);
  const minutes = Math.floor((distance % 3_600_000) / 60_000);
  return `${days}d ${hours}h ${minutes}m`;
}

export default function BlackFridayCountdown({ target, closedText = "OFERTA CERRADA" }: { target: string; closedText?: string }) {
  const [remaining, setRemaining] = useState(() => remainingTime(target, closedText));
  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(remainingTime(target, closedText)), 30_000);
    return () => window.clearInterval(timer);
  }, [target, closedText]);
  return <strong>{remaining}</strong>;
}
