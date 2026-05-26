import type { Metadata } from "next";
import "./globals.css";
import RecoveryRedirect from "@/components/RecoveryRedirect";

export const metadata: Metadata = {
  title: "Jorge Lorenzo — Comunidad de Entrenadores de Baloncesto",
  description: "La comunidad de entrenadores de baloncesto de Jorge Lorenzo. Campeón del Mundo 2019 y de Europa 2022 con la Selección Española.",
  keywords: "entrenadores baloncesto, comunidad entrenadores, baloncesto españa, jorge lorenzo entrenador",
  authors: [{ name: "Jorge Lorenzo" }],
  robots: "index, follow",
  openGraph: {
    type: "website",
    siteName: "Jorge Lorenzo Coach",
    locale: "es_ES",
    title: "Jorge Lorenzo — Comunidad de Entrenadores de Baloncesto",
    description: "Campeón del Mundo y de Europa con la Selección Española. Un sistema para entrenadores que quieren leer mejor el juego.",
    images: [{ url: "/fotos/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jorge Lorenzo — Comunidad de Entrenadores de Baloncesto",
    description: "Campeón del Mundo y de Europa con la Selección Española.",
    images: ["/fotos/og-image.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏀</text></svg>" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Jorge Lorenzo",
              jobTitle: "Entrenador de Baloncesto",
              description: "Campeón del Mundo 2019 y de Europa 2022. Entrenador ayudante de la Selección Española Absoluta 2017-2025.",
              url: "https://jorgelorenzo.coach/",
              sameAs: ["https://www.skool.com/jorge-lorenzo-coach", "https://newsletter.jorgelorenzo.coach/"],
            }),
          }}
        />
      </head>
      <body>
        <RecoveryRedirect />
        {children}
      </body>
    </html>
  );
}
