import { createClient } from "@/lib/supabase-server";
import NavHamburger from "./NavHamburger";
import { NAV_LINKS } from "@/lib/nav-links";

export default async function SiteNav() {
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {}

  return (
    <nav>
      <a href="/" className="nav-logo">Jorge <span>Lorenzo</span></a>
      <div className="nav-links">
        {NAV_LINKS.map(({ label, href }) => (
          <a key={href} href={href} className="nav-link">{label}</a>
        ))}
        {user ? (
          <a href="/cuenta" className="nav-cta">Mi cuenta</a>
        ) : (
          <a href="/login" className="nav-cta">Iniciar sesión</a>
        )}
      </div>
      <NavHamburger links={[
        ...NAV_LINKS,
        ...(user ? [{ label: "Mi cuenta", href: "/cuenta" }] : [{ label: "Iniciar sesión", href: "/login" }]),
      ]} />
    </nav>
  );
}
