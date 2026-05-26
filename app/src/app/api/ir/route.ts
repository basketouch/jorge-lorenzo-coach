import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const REDIRECT_URL = "https://www.jorgelorenzo.coach/auth/callback?next=/nueva-contrasena";

/**
 * Proxy limpio para links de auth de Supabase.
 * El email incluye una URL limpia de nuestro dominio:
 *   /api/ir?token=TOKEN&type=invite
 * Esta ruta reconstruye la URL de Supabase y redirige.
 * Gmail nunca ve supabase.co en el email.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const type = req.nextUrl.searchParams.get("type") ?? "invite";

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const supabaseVerifyUrl =
    `${SUPABASE_URL}/auth/v1/verify` +
    `?token=${encodeURIComponent(token)}` +
    `&type=${encodeURIComponent(type)}` +
    `&redirect_to=${encodeURIComponent(REDIRECT_URL)}`;

  return NextResponse.redirect(supabaseVerifyUrl);
}
