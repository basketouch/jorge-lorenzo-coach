"use client";

import { FormEvent, useState } from "react";
import styles from "./page.module.css";

export default function BlackFridayLeadVideo({ libraryId, videoId }: { libraryId: string; videoId: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function unlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/black-friday-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "No se pudo abrir el vídeo.");
      setUnlocked(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo abrir el vídeo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.videoSample}>
      <div>
        <p className={styles.sectionLabel}>MUESTRA DE EJERCICIOS</p>
        <h3>Ejemplos que puedes llevar a pista.</h3>
        <p>Déjanos tu email y accede ahora a una selección de ejercicios. Antes de que cierre Black Friday recibirás un único recordatorio de la oferta.</p>
      </div>
      {unlocked ? (
        <div className={styles.videoFrame}>
          <iframe
            src={`https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=false&preload=true&responsive=true&primaryColor=c9a84c&muted=false&loop=false&captions=false`}
            title="Ejemplos de ejercicios del Laboratorio"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen
          />
        </div>
      ) : (
        <form className={styles.leadForm} onSubmit={unlock}>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Tu nombre" autoComplete="given-name" required />
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Tu email" autoComplete="email" required />
          <label><input type="checkbox" required /> Quiero recibir el recordatorio de Black Friday y acepto la <a href="/privacidad" target="_blank">política de privacidad</a>.</label>
          <button type="submit" disabled={loading}>{loading ? "Abriendo vídeo..." : "Ver ejemplos de ejercicios →"}</button>
          {error ? <p role="alert">{error}</p> : null}
        </form>
      )}
    </section>
  );
}
