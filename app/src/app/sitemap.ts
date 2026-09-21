import type { MetadataRoute } from "next";

const BASE_URL = "https://www.jorgelorenzo.coach";

const RUTAS_ESTATICAS = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/bio", changeFrequency: "monthly" as const, priority: 0.6 },
  { path: "/historia", changeFrequency: "monthly" as const, priority: 0.6 },
  { path: "/comunidad", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/herramientas", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/cursos", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/drills", changeFrequency: "weekly" as const, priority: 0.7 },
  { path: "/english", changeFrequency: "weekly" as const, priority: 0.7 },
  { path: "/newsletter", changeFrequency: "weekly" as const, priority: 0.7 },
  { path: "/privacidad", changeFrequency: "yearly" as const, priority: 0.2 },
  { path: "/reembolsos", changeFrequency: "yearly" as const, priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return RUTAS_ESTATICAS.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
