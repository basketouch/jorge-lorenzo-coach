import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/auth", "/cuenta", "/preview", "/nueva-contrasena"],
    },
    sitemap: "https://www.jorgelorenzo.coach/sitemap.xml",
  };
}
