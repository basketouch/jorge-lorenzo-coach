import { renderBlackFridayImage } from "./og-render";

export const alt = "Black Friday · El Laboratorio del Entrenador";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderBlackFridayImage();
}
