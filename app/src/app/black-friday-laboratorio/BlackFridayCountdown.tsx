"use client";

import { useEffect, useState } from "react";

const deadline = new Date("2026-11-30T22:59:00.000Z");

function remainingTime() {
  const distance = deadline.getTime() - Date.now();
  if (distance <= 0) return "OFERTA CERRADA";
  const days = Math.floor(distance / 86_400_000);
  const hours = Math.floor((distance % 86_400_000) / 3_600_000);
  const minutes = Math.floor((distance % 3_600_000) / 60_000);
  return `${days}d ${hours}h ${minutes}m`;
}

export default function BlackFridayCountdown() {
  const [remaining, setRemaining] = useState(remainingTime);
  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(remainingTime()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  return <strong>{remaining}</strong>;
}
