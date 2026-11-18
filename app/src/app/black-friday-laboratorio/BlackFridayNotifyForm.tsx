"use client";

import { FormEvent, useState } from "react";
import { normalizePhone, WHATSAPP_CONSENT_TEXT } from "@/lib/whatsapp-consent";
import { trackMeta } from "@/lib/meta-pixel";
import styles from "./page.module.css";

const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/EkeqdYr7SY67R9ys97poYc";
const COMMUNITY_URL = "https://www.skool.com/jorge-lorenzo-coach/about";

type PhoneStatus = "none" | "saved" | "invalid" | "no_consent" | "failed";

export default function BlackFridayNotifyForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState(false);
  const [done, setDone] = useState(false);
  const [phoneStatus, setPhoneStatus] = useState<PhoneStatus>("none");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setError("");
    const trimmedPhone = phone.trim();
    if (trimmedPhone) {
      if (!normalizePhone(trimmedPhone)) {
        setError("El móvil no parece válido. Escríbelo con prefijo, por ejemplo +34 600 111 222, o déjalo vacío.");
        return;
      }
      if (!whatsapp) {
        setError("Marca la casilla de WhatsApp para que podamos escribirte, o borra el móvil.");
        return;
      }
    }
    setLoading(true);
    try {
      const response = await fetch("/api/black-friday-aviso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, telefono: phone, whatsapp: phone.trim() ? whatsapp : false }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "No se pudo guardar tu email.");
      setPhoneStatus((result.phone as PhoneStatus) || "none");
      setDone(true);
      trackMeta("Lead", { content_name: "black_friday_2026_aviso" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar tu email.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    const phoneProblem = phoneStatus === "invalid" || phoneStatus === "failed" || phoneStatus === "no_consent";
    return (
      <div className={styles.notifyDone}>
        <p><strong>Hecho.</strong> Te escribiré el viernes 27 en cuanto abra{phoneStatus === "saved" ? ", por email y por WhatsApp" : ""}.</p>
        {phoneProblem ? (
          <p className={styles.notifyWarn} role="alert">
            Tu email está guardado, pero no hemos podido guardar tu móvil. Para recibir el aviso por WhatsApp, entra al grupo con el botón de abajo.
          </p>
        ) : null}
        <a className={styles.groupLink} href={WHATSAPP_GROUP_URL} target="_blank" rel="noopener noreferrer">Entrar al grupo de WhatsApp →</a>
        <p className={styles.notifyMore}>Mientras llega el viernes, puedes unirte a la <a href={COMMUNITY_URL} target="_blank" rel="noopener noreferrer">comunidad de entrenadores</a>.</p>
      </div>
    );
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
