import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "otsbpiukzftacmvmkajy.supabase.co" },
      { protocol: "https", hostname: "newsletter.jorgelorenzo.coach" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    // Enlaces cortos para las bios de las redes (X no admite el enlace largo con UTM). Temporales (307) para poder cambiarlos.
    return [
      {
        source: "/x",
        destination:
          "/black-friday-laboratorio?utm_source=x&utm_medium=bio&utm_campaign=black_friday_2026_laboratorio&utm_content=general",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        // Imágenes y fuentes estáticas en /public — caché 1 año
        source: "/fotos/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Assets de Next.js — ya son inmutables por hash, reforzamos
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Imágenes optimizadas por next/image
        source: "/_next/image",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
    ];
  },
};

export default nextConfig;
