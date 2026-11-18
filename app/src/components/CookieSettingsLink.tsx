"use client";

import { REOPEN_EVENT } from "@/lib/consent";

/** Enlace del pie para volver a abrir el aviso de cookies y cambiar la elección. */
export default function CookieSettingsLink({ style }: { style?: React.CSSProperties }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(REOPEN_EVENT))} style={{ background: "none", border: 0, borderBottom: "1px solid var(--borde)", padding: "0 0 1px", cursor: "pointer", font: "inherit", ...style }}>
      Cookies
    </button>
  );
}
