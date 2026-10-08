import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import ClinicForm from "./ClinicForm";

export const metadata: Metadata = {
  title: "Materi Clinic PERBASI — César Cámara & Jorge Lorenzo",
  description: "Clinic resmi PERBASI, Penataran Pelatih Lisensi B. Pemateri: César Cámara & Jorge Lorenzo.",
  robots: "noindex, nofollow",
};

export default function MateriClinicPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SiteNav />

      <section style={{ flex: 1, padding: "112px 24px 64px", maxWidth: 560, width: "100%", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/perbasi.png" alt="PERBASI" width={72} height={72}
            style={{ background: "#fff", borderRadius: 12, padding: 6, flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--oro)", marginBottom: 4 }}>
              Clinic resmi PERBASI
            </p>
            <p style={{ fontSize: 14, color: "var(--texto-suave)", lineHeight: 1.4 }}>
              Penataran Pelatih Lisensi B<br />Bogor · 8–11 Oktober 2026
            </p>
          </div>
        </div>
        <h1 style={{ fontSize: "clamp(30px, 7vw, 44px)", lineHeight: 1.1, fontWeight: 900, marginBottom: 16 }}>
          Materi <span style={{ color: "var(--oro)" }}>Clinic</span>
        </h1>
        <p style={{ color: "var(--texto-suave)", fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
          Pemateri: <strong style={{ color: "var(--texto)" }}>César Cámara &amp; Jorge Lorenzo</strong>. Masukkan email Anda untuk mengunduh
          3 presentasi video dan 3 dokumen catatan dari clinic.
        </p>
        <ClinicForm />
      </section>
    </main>
  );
}
