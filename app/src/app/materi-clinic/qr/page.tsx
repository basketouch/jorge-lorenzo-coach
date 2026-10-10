import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR — Materi Clinic PERBASI",
  robots: "noindex, nofollow",
};

const IZQUIERDA = [
  { etiqueta: "", logos: [{ nombre: "PERBASI", src: "/logos/perbasi.png" }] },
  { etiqueta: "Supported by", logos: [{ nombre: "Bogor Hornbills", src: "/sponsors/bogor-hornbills.png" }] },
];

const DERECHA = [
  {
    etiqueta: "Sponsor",
    logos: [
      { nombre: "Le Yasmin", src: "/sponsors/le-yasmin.png" },
      { nombre: "Diton", src: "/sponsors/diton.png" },
      { nombre: "PT Omega Safety Indonesia", src: "/sponsors/omega-safety.png" },
    ],
  },
];

function Lateral({ grupos }: { grupos: typeof IZQUIERDA }) {
  return (
    <div className="qr-lateral">
      {grupos.map(({ etiqueta, logos }) => (
        <div key={etiqueta || logos[0].nombre} className="qr-grupo">
          {etiqueta && <p className="qr-etiqueta">{etiqueta}</p>}
          {logos.map(({ nombre, src }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={nombre} src={src} alt={nombre} className="qr-logo" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Pantalla completa para proyectar el QR en el clinic.
export default function QrPantallaCompleta() {
  return (
    <main className="qr-pantalla">
      <style>{`
        .qr-pantalla { position: fixed; inset: 0; z-index: 200; background: #fff; color: #0a0a0a; overflow-y: auto;
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3vh; padding: 3vh 4vw; text-align: center; }
        .qr-cuerpo { display: flex; flex-direction: column; align-items: center; gap: 2vh; }
        .qr-lateral { display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center; align-items: center; gap: 24px; }
        .qr-grupo { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .qr-etiqueta { font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #777; }
        .qr-logo { max-width: 130px; max-height: 70px; object-fit: contain; }
        .qr-img { width: min(46vh, 80vw); height: min(46vh, 80vw); }
        @media (min-width: 900px) {
          .qr-pantalla { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2.2fr) minmax(0, 1fr); align-items: center; gap: 2vw; }
          .qr-lateral { flex-direction: column; flex-wrap: nowrap; gap: 5vh; }
          .qr-grupo { gap: 1.4vh; }
          .qr-etiqueta { font-size: clamp(11px, 1.8vh, 16px); }
          .qr-logo { max-width: min(100%, 17vw); max-height: 14vh; }
        }
      `}</style>

      <Lateral grupos={IZQUIERDA} />

      <div className="qr-cuerpo">
        <p style={{ fontSize: "clamp(13px, 2.2vh, 20px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8a6d1f" }}>
          Clinic resmi PERBASI · Penataran Pelatih Lisensi B
        </p>
        <h1 style={{ fontSize: "clamp(28px, 5.4vh, 54px)", fontWeight: 900, lineHeight: 1.1 }}>Materi Clinic</h1>
        <p style={{ fontSize: "clamp(15px, 2.6vh, 26px)", color: "#333" }}>
          Pemateri / Ponentes: <strong>César Cámara &amp; Jorge Lorenzo</strong>
        </p>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/qr-materi-clinic.svg" alt="QR jorgelorenzo.coach/materi-clinic" className="qr-img" style={{ imageRendering: "crisp-edges" }} />

        <div>
          <p style={{ fontSize: "clamp(16px, 2.8vh, 28px)", fontWeight: 700 }}>Pindai untuk mengunduh materi</p>
          <p style={{ fontSize: "clamp(14px, 2.4vh, 24px)", color: "#555", marginTop: 2 }}>jorgelorenzo.coach/materi-clinic</p>
        </div>

        <p style={{ fontSize: "clamp(22px, 4.4vh, 44px)", fontWeight: 900, color: "#8a6d1f", marginTop: "0.6vh" }}>
          Terima kasih · Gracias
        </p>
      </div>

      <Lateral grupos={DERECHA} />
    </main>
  );
}
