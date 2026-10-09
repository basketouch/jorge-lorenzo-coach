"use client";

import { useRef, useState } from "react";
import type { ClinicFile } from "@/lib/clinic-indonesia";

const actionStyle: React.CSSProperties = {
  padding: "8px 14px", fontSize: 13, fontWeight: 700, borderRadius: 6, textDecoration: "none",
  color: "var(--texto)", border: "1px solid var(--borde)", background: "transparent",
};

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
  const [embedUrl, setEmbedUrl] = useState("");
  const [files, setFiles] = useState<ClinicFile[]>([]);
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
        setEmbedUrl(data.embedUrl ?? "");
        setFiles(Array.isArray(data.files) ? data.files : []);
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
          Materi Anda sudah siap. Tonton langsung atau unduh ke perangkat Anda.
        </p>
        {files.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 20 }}>
            {[
              { titulo: "Presentasi video", items: files.filter((f) => f.tipo === "video") },
              { titulo: "Catatan (dokumen)", items: files.filter((f) => f.tipo !== "video") },
            ].filter((g) => g.items.length > 0).map((g) => (
              <div key={g.titulo}>
                <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--oro)", marginBottom: 10 }}>
                  {g.titulo}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {g.items.map((f) => (
                    <div key={f.id} style={{
                      display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
                      padding: "12px 14px", background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 8,
                    }}>
                      <span style={{ fontSize: 20 }} aria-hidden="true">{f.tipo === "video" ? "▶️" : "📄"}</span>
                      <span style={{ flex: "1 1 160px", minWidth: 0, fontSize: 15, fontWeight: 600, wordBreak: "break-word" }}>{f.titulo}</span>
                      <span style={{ display: "flex", gap: 8 }}>
                        <a href={f.verUrl} target="_blank" rel="noopener noreferrer" style={actionStyle}>
                          {f.tipo === "video" ? "Tonton" : "Buka"}
                        </a>
                        <a href={f.descargaUrl} target="_blank" rel="noopener noreferrer"
                          style={{ ...actionStyle, background: "var(--oro)", color: "var(--negro)", borderColor: "var(--oro)" }}>
                          Unduh
                        </a>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          embedUrl && (
            <iframe src={embedUrl} title="Materi clinic" loading="lazy"
              style={{ width: "100%", height: 360, border: "1px solid var(--borde)", borderRadius: 8, background: "#fff", marginBottom: 16 }} />
          )
        )}
        {folderUrl ? (
          <a href={folderUrl} target="_blank" rel="noopener noreferrer" style={{
            display: "block", textAlign: "center", padding: 16, fontSize: 16, fontWeight: 800,
            color: "var(--negro)", background: "var(--oro)", borderRadius: 8, textDecoration: "none",
          }}>
            Buka semua di Google Drive →
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
