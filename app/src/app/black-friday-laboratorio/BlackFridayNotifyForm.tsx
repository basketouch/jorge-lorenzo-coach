"use client";

import { FormEvent, useState } from "react";
import { WHATSAPP_CONSENT_TEXT } from "@/lib/whatsapp-consent";
import styles from "./page.module.css";

export default function BlackFridayNotifyForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState(false);
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
        body: JSON.stringify({ name, email, telefono: phone, whatsapp: phone.trim() ? whatsapp : false }),
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
      <label className={styles.field}>
        <span>Nombre</span>
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Tu nombre" autoComplete="given-name" required />
      </label>
      <label className={styles.field}>
        <span>Email</span>
        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="tu@email.com" autoComplete="email" required />
      </label>
      <label className={styles.field}>
        <span>Móvil <em>(opcional)</em></span>
        <input value={phone} onChange={(event) => setPhone(event.target.value)} type="tel" placeholder="+34 600 111 222" autoComplete="tel" />
      </label>
      {phone.trim() ? (
        <label className={styles.consent}><input type="checkbox" checked={whatsapp} onChange={(event) => setWhatsapp(event.target.checked)} /> {WHATSAPP_CONSENT_TEXT}</label>
      ) : null}
      <label className={styles.consent}><input type="checkbox" required /> Quiero que me avisen por email cuando abra Black Friday y acepto la <a href="/privacidad" target="_blank">política de privacidad</a>.</label>
      <button type="submit" disabled={loading}>{loading ? "Guardando..." : "Avísame cuando abra →"}</button>
      {error ? <p role="alert">{error}</p> : null}
    </form>
  );
}
