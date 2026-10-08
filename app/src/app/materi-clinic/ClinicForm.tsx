"use client";

import { useRef, useState } from "react";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "14px 16px", fontSize: 16, color: "var(--texto)",
  background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 8, outline: "none",
};

export default function ClinicForm() {
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [optIn, setOptIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [folderUrl, setFolderUrl] = useState<string | null>(null);
  const renderedAt = useRef(Date.now());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!optIn) {
      setError("Centang kotak persetujuan untuk melanjutkan.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/materi-clinic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, whatsapp, optIn, website, renderedAt: renderedAt.current }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(
          data.error === "invalid_whatsapp"
            ? "Nomor WhatsApp tidak valid. Contoh: 0812 3456 7890."
            : data.error === "invalid_data"
              ? "Periksa email Anda."
              : "Terjadi kesalahan. Silakan coba lagi."
        );
      } else {
        setFolderUrl(data.folderUrl ?? "");
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    }
    setLoading(false);
  }

  if (folderUrl !== null) {
    return (
      <div style={{
        background: "linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.04))",
        border: "1px solid rgba(201,168,76,0.4)", borderRadius: 12, padding: 24,
      }}>
        <h2 style={{ fontSize: 20, marginBottom: 6 }}>Terima kasih! 🏀</h2>
        <p style={{ color: "var(--texto-suave)", fontSize: 15, lineHeight: 1.6, marginBottom: 20 }}>
          Materi Anda sudah siap: 3 presentasi video dan 3 dokumen catatan.
        </p>
        {folderUrl ? (
          <a href={folderUrl} target="_blank" rel="noopener noreferrer" style={{
            display: "block", textAlign: "center", padding: 16, fontSize: 16, fontWeight: 800,
            color: "var(--negro)", background: "var(--oro)", borderRadius: 8, textDecoration: "none",
          }}>
            Buka folder materi →
          </a>
        ) : (
          <p style={{ color: "var(--texto-suave)", fontSize: 14 }}>Silakan coba lagi nanti.</p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <input
        type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1} autoComplete="off" aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />
      <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "var(--texto-suave)" }}>
        Email *
        <input type="email" required placeholder="nama@email.com" autoComplete="email"
          value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
      </label>
      <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "var(--texto-suave)" }}>
        WhatsApp
        <input type="tel" placeholder="0812 3456 7890" autoComplete="tel" inputMode="tel"
          value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} style={inputStyle} />
      </label>
      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, color: "var(--texto-suave)", lineHeight: 1.5 }}>
        <input type="checkbox" checked={optIn} onChange={(e) => setOptIn(e.target.checked)}
          style={{ marginTop: 3, accentColor: "var(--oro)", flexShrink: 0 }} />
        <span>
          Saya setuju menerima email dari Jorge Lorenzo tentang materi dan konten bola basket. Anda dapat
          berhenti berlangganan kapan saja. <a href="/privacidad" style={{ color: "var(--oro)" }}>Kebijakan privasi</a>.
        </span>
      </label>
      {error && <p style={{ color: "#e5736b", fontSize: 14 }}>{error}</p>}
      <button type="submit" disabled={loading} style={{
        padding: "16px", fontSize: 16, fontWeight: 800, color: "var(--negro)", background: "var(--oro)",
        border: "none", borderRadius: 8, cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1,
      }}>
        {loading ? "Memproses…" : "Akses materi →"}
      </button>
    </form>
  );
}
