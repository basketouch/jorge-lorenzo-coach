// Contenidos del clinic de Indonesia (Penataran Pelatih Lisensi B, 8-11 octubre 2026).
// Los enlaces solo se devuelven desde la API tras dejar el email, no viajan en el bundle de la página.

export const CLINIC_BREVO_LIST_ID = 37;

const CLINIC_FOLDER_ID = "1_p9WhADgOJpeoPy6KaRmm1LbHEzKvhqv";

export const CLINIC_FOLDER_URL = `https://drive.google.com/drive/folders/${CLINIC_FOLDER_ID}?usp=sharing`;
export const CLINIC_EMBED_URL = `https://drive.google.com/embeddedfolderview?id=${CLINIC_FOLDER_ID}#grid`;

export type ClinicFile = {
  id: string;
  titulo: string;
  tipo: "video" | "pdf" | "otro";
  verUrl: string;
  descargaUrl: string;
};

const FOLDER_LIST_URL = `https://drive.google.com/embeddedfolderview?id=${CLINIC_FOLDER_ID}`;
const CACHE_MS = 60_000;
let cache: { at: number; files: ClinicFile[] } | null = null;

function decodeEntities(text: string) {
  return text
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

function prettyTitle(fileName: string) {
  return fileName.replace(/\.[a-z0-9]{2,4}$/i, "").replace(/_/g, " ").replace(/\s+/g, " ").trim();
}

// Lee el listado público de la carpeta de Drive. Si Google cambia el formato devuelve [] y la web
// cae a la vista incrustada de Drive.
export async function listClinicFiles(): Promise<ClinicFile[]> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.files;

  try {
    const response = await fetch(FOLDER_LIST_URL, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return cache?.files ?? [];
    const html = await response.text();

    const files: ClinicFile[] = [];
    for (const block of html.split('class="flip-entry"').slice(1)) {
      const id = block.match(/id="entry-([^"]+)"/)?.[1];
      const name = block.match(/class="flip-entry-title">([^<]*)</)?.[1];
      const icon = block.match(/\/type\/([^"]+)"/)?.[1] ?? "";
      if (!id || !name) continue;
      files.push({
        id,
        titulo: prettyTitle(decodeEntities(name)),
        tipo: icon.startsWith("video") ? "video" : icon.includes("pdf") ? "pdf" : "otro",
        verUrl: `https://drive.google.com/file/d/${id}/view`,
        descargaUrl: `https://drive.google.com/uc?export=download&id=${id}`,
      });
    }
    files.sort((a, b) => a.titulo.localeCompare(b.titulo, "en", { numeric: true }));
    cache = { at: Date.now(), files };
    return files;
  } catch {
    return cache?.files ?? [];
  }
}
