import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR — Materi Clinic PERBASI",
  robots: "noindex, nofollow",
};

// Pantalla completa para proyectar el QR en el clinic.
export default function QrPantallaCompleta() {
  return (
    <main style={{
      position: "fixed", inset: 0, zIndex: 200, background: "#fff", color: "#0a0a0a",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: "3vh", padding: "3vh 5vw", textAlign: "center",
    }}>
      <div>
        <p style={{ fontSize: "clamp(14px, 2.4vh, 22px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8a6d1f" }}>
          Clinic resmi PERBASI · Penataran Pelatih Lisensi B
        </p>
        <h1 style={{ fontSize: "clamp(28px, 6vh, 56px)", fontWeight: 900, lineHeight: 1.1, marginTop: 8 }}>
          Materi Clinic
        </h1>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/qr-materi-clinic.svg" alt="QR jorgelorenzo.coach/materi-clinic"
        style={{ width: "min(62vh, 86vw)", height: "min(62vh, 86vw)", imageRendering: "crisp-edges" }} />

      <div>
        <p style={{ fontSize: "clamp(18px, 3.2vh, 32px)", fontWeight: 700 }}>Pindai untuk mengunduh materi</p>
        <p style={{ fontSize: "clamp(16px, 2.8vh, 28px)", color: "#555", marginTop: 4 }}>jorgelorenzo.coach/materi-clinic</p>
      </div>
    </main>
  );
}
