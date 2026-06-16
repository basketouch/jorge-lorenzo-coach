"use client";

import { useEffect } from "react";

export default function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw-english.js", { scope: "/english" }).catch(() => {});
    }
  }, []);

  return null;
}
