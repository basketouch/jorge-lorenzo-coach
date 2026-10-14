// Esqueleto común de los correos de la suite Basketouch con la marca Jorge Lorenzo (oro):
// cabecera negra con el logo y el nombre, línea oro, cuerpo claro, un único botón y pie con contraste suficiente.

const LOGO = "https://www.jorgelorenzo.coach/email/logo-comunidad.png";
const GOLD = "#c8a747";

export function esc(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function parrafo(html: string): string {
  return `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#1f2933">${html}</p>`;
}

export function boton(href: string, label: string): string {
  return `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:24px 0 8px"><tr><td style="border-radius:8px;background:${GOLD}"><a href="${href}" style="display:inline-block;padding:14px 28px;font-size:16px;font-weight:700;color:#0c0d10;text-decoration:none;border-radius:8px">${label}</a></td></tr></table>`;
}

/** Convierte el texto de una campaña (párrafos separados por línea en blanco; "→ Etiqueta: https://…" = botón). */
export function textoABloques(texto: string): string {
  return texto
    .split("\n\n")
    .map((p) => {
      const t = p.trim();
      const m = t.match(/^(?:→|->)\s*(.+?):\s*(https?:\/\/\S+)$/);
      if (m) return boton(m[2].trim(), m[1].trim());
      return t ? parrafo(t.replace(/\n/g, "<br/>")) : "";
    })
    .join("");
}

export function correoCoach(opts: { title: string; bodyHtml: string; hero?: string | null; footer?: string }): string {
  const year = new Date().getFullYear();
  const footer = opts.footer ?? `© ${year} Jorge Lorenzo Coach · <a href="https://jorgelorenzo.coach" style="color:#52606d;text-decoration:underline">jorgelorenzo.coach</a>`;
  const hero = opts.hero
    ? `<tr><td style="padding:0"><img src="${opts.hero}" alt="" width="520" style="display:block;width:100%;height:auto;border:0" /></td></tr>`
    : "";
  return [
    `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${opts.title}</title></head>`,
    `<body style="margin:0;padding:0;background:#f1f3f5"><div lang="es" style="margin:0;padding:32px 12px;background:#f1f3f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">`,
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #dde1e6">',
    `<tr><td style="padding:24px 24px 20px;text-align:center;background:#0c0d10;border-bottom:4px solid ${GOLD}"><img src="${LOGO}" alt="Jorge Lorenzo" width="84" style="display:block;margin:0 auto;max-width:100%;height:auto;border:0" /><div style="margin-top:12px;font-size:20px;font-weight:700;letter-spacing:3px;line-height:1"><span style="color:#ffffff">JORGE</span> <span style="color:${GOLD}">LORENZO</span></div></td></tr>`,
    hero,
    '<tr><td style="padding:32px 32px 28px">',
    `<h1 style="margin:0 0 20px;font-size:24px;line-height:1.25;color:#111827">${opts.title}</h1>`,
    opts.bodyHtml,
    "</td></tr>",
    `<tr><td style="padding:18px 32px;background:#f8f9fa;border-top:1px solid #e4e7eb"><p style="margin:0;font-size:12px;line-height:1.55;color:#52606d;text-align:center">${footer}</p></td></tr>`,
    "</table></div></body></html>",
  ].join("");
}
