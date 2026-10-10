import type { Metadata } from "next";
import QrPantalla from "../QrPantalla";

export const metadata: Metadata = {
  title: "QR — Materi Clinic PERBASI",
  robots: "noindex, nofollow",
};

export default function QrMateri() {
  return (
    <QrPantalla titulo="Materi Clinic" qrSrc="/qr-materi-clinic.svg" qrAlt="QR jorgelorenzo.coach/materi-clinic">
      <p style={{ fontSize: "clamp(15px, 2.6vh, 26px)", color: "#333" }}>
        Pemateri: <strong>César Cámara &amp; Jorge Lorenzo</strong>
      </p>
      <div>
        <p style={{ fontSize: "clamp(16px, 2.8vh, 28px)", fontWeight: 700 }}>Pindai untuk mengunduh materi</p>
        <p style={{ fontSize: "clamp(14px, 2.4vh, 24px)", color: "#555", marginTop: 2 }}>jorgelorenzo.coach/materi-clinic</p>
      </div>
      <p style={{ fontSize: "clamp(22px, 4.4vh, 44px)", fontWeight: 900, color: "#8a6d1f", marginTop: "0.6vh" }}>
        Terima kasih · Gracias
      </p>
    </QrPantalla>
  );
}
