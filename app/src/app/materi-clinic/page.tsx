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

      <style>{`
        .clinic-grid { display: grid; grid-template-columns: 1fr; gap: 32px; align-items: center; }
        .clinic-poster { order: -1; }
        @media (min-width: 900px) {
          .clinic-grid { grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); gap: 56px; }
          .clinic-poster { order: 0; }
        }
      `}</style>

      <section style={{ flex: 1, padding: "96px 24px 48px", maxWidth: 1120, width: "100%", margin: "0 auto", display: "flex", alignItems: "center" }}>
        <div className="clinic-grid" style={{ width: "100%" }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--oro)", marginBottom: 12 }}>
              Clinic resmi PERBASI · Penataran Pelatih Lisensi B
            </p>
            <h1 style={{ fontSize: "clamp(30px, 7vw, 44px)", lineHeight: 1.1, fontWeight: 900, marginBottom: 16 }}>
              Materi <span style={{ color: "var(--oro)" }}>Clinic</span>
            </h1>
            <p style={{ color: "var(--texto-suave)", fontSize: 16, lineHeight: 1.7, marginBottom: 28 }}>
              Pemateri: <strong style={{ color: "var(--texto)" }}>César Cámara &amp; Jorge Lorenzo</strong>. Masukkan email Anda untuk mengunduh
              3 presentasi video dan 3 dokumen catatan dari clinic.
            </p>
            <ClinicForm />
          </div>
          <div className="clinic-poster">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/fotos/clinic-perbasi-2026.jpg" alt="Penataran Pelatih Lisensi B — Jorge Lorenzo, Cesar Camara Perez, Herru Yuharso"
              width={1206} height={939}
              style={{ width: "100%", height: "auto", borderRadius: 12, border: "1px solid var(--borde)", display: "block" }} />
          </div>
        </div>
      </section>
    </main>
  );
}
