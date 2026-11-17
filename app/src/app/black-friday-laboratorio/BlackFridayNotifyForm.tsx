"use client";

import { FormEvent, useState } from "react";
import styles from "./page.module.css";

export default function BlackFridayNotifyForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/black-friday-aviso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "No se pudo guardar tu email.");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar tu email.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return <div className={styles.notifyDone}><strong>Hecho.</strong> Te escribiré el viernes 27 en cuanto abra.</div>;
  }

  return (
    <form className={`${styles.leadForm} ${styles.notifyForm}`} onSubmit={submit}>
      <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Tu nombre" autoComplete="given-name" required />
      <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Tu email" autoComplete="email" required />
      <label><input type="checkbox" required /> Quiero que me avisen por email cuando abra Black Friday y acepto la <a href="/privacidad" target="_blank">política de privacidad</a>.</label>
      <button type="submit" disabled={loading}>{loading ? "Guardando..." : "Avísame cuando abra →"}</button>
      {error ? <p role="alert">{error}</p> : null}
    </form>
  );
}
