import { NextRequest, NextResponse } from "next/server";

// Cursos protegidos con código de entrada mientras no se anuncian públicamente.
const CODIGOS: Record<string, string> = {
  "laboratorio-2627": "2340",
};

export async function POST(req: NextRequest) {
  const { slug, codigo } = await req.json();

  const esperado = CODIGOS[slug];
  if (!esperado || codigo !== esperado) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(`entrada_${slug}`, "ok", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: 60 * 60 * 24 * 180, // 180 días
    path: "/",
  });
  return res;
}
