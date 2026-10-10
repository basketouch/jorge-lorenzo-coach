import type { Metadata } from "next";
import QrPantalla from "../QrPantalla";

export const metadata: Metadata = {
  title: "QR Ujian — Lisensi B PERBASI",
  robots: "noindex, nofollow",
};

export default function QrUjian() {
  return (
    <QrPantalla
      titulo="UJIAN DEFENSE & TRANSITION OFF & OFF SYSTEM LISENSI B"
      qrSrc="/qr-ujian-lisensi-b.svg"
      qrAlt="QR formulir ujian Lisensi B"
      qrTamano="56vh"
    >
      <p style={{ fontSize: "clamp(16px, 2.8vh, 28px)", fontWeight: 700 }}>Pindai untuk mengerjakan ujian</p>
    </QrPantalla>
  );
}
