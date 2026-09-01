import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

// Rutas que requieren sesión activa
const PROTECTED_PATHS = [
  "/cuenta",
  "/ver/",
  "/admin",
];

// Cursos que exigen código de entrada antes de mostrarse (pre-lanzamiento)
const CURSOS_CON_CODIGO = ["laboratorio-2627"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Siempre refrescar el token de sesión para que getUser() funcione en todas las páginas
  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return req.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value);
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  let user = null;
  try { const { data } = await supabase.auth.getUser(); user = data.user; } catch {}

  // Solo redirigir a login en rutas protegidas
  if (!user && PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Cursos con código de entrada: exigir cookie salvo en la propia página de entrada
  const cursoMatch = pathname.match(/^\/cursos\/([^/]+)(\/.*)?$/);
  const slugCurso = cursoMatch?.[1];
  const esPaginaEntrada = cursoMatch?.[2]?.startsWith("/entrada");
  if (slugCurso && CURSOS_CON_CODIGO.includes(slugCurso) && !esPaginaEntrada) {
    const cookie = req.cookies.get(`entrada_${slugCurso}`);
    if (cookie?.value !== "ok") {
      const entradaUrl = new URL(`/cursos/${slugCurso}/entrada`, req.url);
      entradaUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(entradaUrl);
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico).*)"],
};
