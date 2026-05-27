import NavHamburger from "./NavHamburger";

interface Props {
  /** Enlace del logo. Por defecto "/" */
  logoHref?: string;
  links?: { label: string; href: string }[];
  /** Si true, muestra un botón de Salir (form POST /api/logout) */
  mostrarSalir?: boolean;
}

export default function NavBar({ logoHref = "/", links = [], mostrarSalir = false }: Props) {
  return (
    <nav>
      <a href={logoHref} className="nav-logo">Jorge <span>Lorenzo</span></a>

      {/* Desktop: links visibles */}
      <div className="nav-links">
        {links.map(({ label, href }) => (
          <a key={href} href={href} className="nav-link">{label}</a>
        ))}
        {mostrarSalir && (
          <form action="/api/logout" method="post">
            <button type="submit" className="nav-link"
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
              Salir
            </button>
          </form>
        )}
      </div>

      {/* Móvil: hamburguesa */}
      <NavHamburger links={links} mostrarSalir={mostrarSalir} />
    </nav>
  );
}

/** Versión para el visor de lecciones (dentro de un grid, no fixed) */
export function NavBarPlayer({
  slug,
  cursoTitulo,
}: {
  slug: string;
  cursoTitulo: string;
}) {
  return (
    <div style={{
      height: "100%",
      background: "rgba(10,10,10,0.97)",
      borderBottom: "1px solid var(--borde)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px", gap: 16,
    }}>
      <a href="/cuenta" className="nav-logo">Jorge <span>Lorenzo</span></a>

      <a href={`/ver/${slug}`} className="player-curso-titulo" style={{ textDecoration: "none", flex: 1, textAlign: "center" }}>
        <span className="nav-link">{cursoTitulo}</span>
      </a>

      <a href="/cuenta" className="nav-link" style={{ whiteSpace: "nowrap" }}>Mi cuenta</a>
    </div>
  );
}
