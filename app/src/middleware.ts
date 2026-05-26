import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const BYPASS_PATHS = [
  "/en-construccion",
  "/api/",
  "/_next/",
  "/favicon",
  "/login",
  "/api/logout",
  "/auth/",
  "/nueva-contrasena",
  "/cursos",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Dejar pasar rutas internas y la propia página
  if (BYPASS_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Comprobar sesión Supabase
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

  const { data: { user } } = await supabase.auth.getUser();

  // Si no está logueado → página en construcción
  if (!user) {
    return NextResponse.redirect(new URL("/en-construccion", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico).*)"],
};
