import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import ClinicForm from "./ClinicForm";

const INSTAGRAM = [
  { nombre: "César Cámara", usuario: "cesarcamaraperez", url: "https://www.instagram.com/cesarcamaraperez/" },
  { nombre: "Jorge Lorenzo", usuario: "jorgelorenzo.coach", url: "https://www.instagram.com/jorgelorenzo.coach/" },
];

// Para mostrar el logo: copiar el archivo a public/sponsors/ y poner su ruta en `logo`.
const SPONSORS: { nombre: string; usuario?: string; logo?: string }[] = [
  { nombre: "Le Yasmin", usuario: "leyasmin.id" },
  { nombre: "Diton", usuario: "ditonpremium" },
  { nombre: "PT Omega Safety Indonesia" },
];

function InstagramIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

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
        .clinic-ig { display: flex; align-items: center; gap: 12px; flex: 1 1 0; min-width: 0; padding: 12px 16px; background: var(--card); border: 1px solid var(--borde); border-radius: 10px; color: var(--texto); text-decoration: none; transition: border-color 0.2s; }
        .clinic-ig:hover { border-color: var(--oro); }
        .clinic-partners { display: flex; flex-direction: column; align-items: center; gap: 28px; }
        .clinic-partners-group { display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .clinic-partners-label { font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--texto-suave); }
        .clinic-partners-divider { width: 48px; height: 1px; background: var(--borde); }
        @media (min-width: 900px) {
          .clinic-partners { flex-direction: row; gap: 48px; }
          .clinic-partners-divider { width: 1px; height: 120px; }
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 16 }}>
              {INSTAGRAM.map(({ nombre, usuario, url }) => (
                <a key={usuario} href={url} target="_blank" rel="noopener noreferrer" className="clinic-ig" style={{ minWidth: 200 }}>
                  <span style={{ color: "var(--oro)", display: "flex" }}><InstagramIcon /></span>
                  <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.3, minWidth: 0 }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{nombre}</span>
                    <span style={{ fontSize: 13, color: "var(--texto-suave)", overflow: "hidden", textOverflow: "ellipsis" }}>@{usuario}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 24px 72px", maxWidth: 1120, width: "100%", margin: "0 auto" }}>
        <div className="clinic-partners">
          <div className="clinic-partners-group">
            <p className="clinic-partners-label">Supported by</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/sponsors/bogor-hornbills.png" alt="Bogor Hornbills" width={120} height={120}
              style={{ width: 120, height: 120, objectFit: "contain" }} />
          </div>
          <div className="clinic-partners-divider" />
          <div className="clinic-partners-group" style={{ flex: 1 }}>
            <p className="clinic-partners-label">Sponsor</p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
              {SPONSORS.map(({ nombre, usuario, logo }) => (
                <div key={nombre} style={{
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
                  width: 200, height: 96, padding: 16, borderRadius: 10, textAlign: "center",
                  background: logo ? "#fff" : "var(--card)", border: "1px solid var(--borde)",
                }}>
                  {logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logo} alt={nombre} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                  ) : (
                    <>
                      <span style={{ fontSize: 15, fontWeight: 700 }}>{nombre}</span>
                      {usuario && <span style={{ fontSize: 12, color: "var(--texto-suave)" }}>@{usuario}</span>}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
