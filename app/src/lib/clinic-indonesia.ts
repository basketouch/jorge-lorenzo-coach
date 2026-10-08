// Contenidos del clinic de Indonesia (Penataran Pelatih Lisensi B, 8-11 octubre 2026).
// Los enlaces solo se devuelven desde la API tras dejar el email, no viajan en el bundle de la página.
// TODO: pegar aquí los enlaces de Drive (compartir como "Cualquier persona con el enlace").

export const CLINIC_BREVO_LIST_ID = 37;

export type ClinicMaterial = {
  tipo: "video" | "pdf";
  titulo: string;
  url: string;
};

export const CLINIC_MATERIALES: ClinicMaterial[] = [
  { tipo: "video", titulo: "Presentasi 1", url: "" },
  { tipo: "video", titulo: "Presentasi 2", url: "" },
  { tipo: "video", titulo: "Presentasi 3", url: "" },
  { tipo: "pdf", titulo: "Catatan 1", url: "" },
  { tipo: "pdf", titulo: "Catatan 2", url: "" },
  { tipo: "pdf", titulo: "Catatan 3", url: "" },
];
