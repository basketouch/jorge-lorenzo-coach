import { createAdminClient } from "@/lib/supabase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { accessToken } = await req.json();
    if (!accessToken) return NextResponse.json({ error: "No token" }, { status: 400 });

    const supabase = createAdminClient();

    // Verificar el token con Supabase (firma y caducidad) antes de fiarse de su contenido.
    // Sin esto, cualquiera podía enviar un token inventado con el user_id de otra persona
    // y cerrar sus sesiones, porque esta ruta usa la clave de servicio.
    const { data: verified, error: verifyError } = await supabase.auth.getUser(accessToken);
    if (verifyError || !verified?.user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // El token ya está verificado: ahora sí se puede leer el session_id de su payload.
    const parts = accessToken.split(".");
    if (parts.length !== 3) return NextResponse.json({ error: "Invalid token" }, { status: 400 });

    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
    const userId = verified.user.id;
    const sessionId = payload.session_id as string;

    if (!userId || !sessionId) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

    // Sesión única: revocar todas las demás sesiones activas del usuario
    await supabase.rpc("revocar_otras_sesiones", {
      p_user_id: userId,
      p_session_id: sessionId,
    });

    // Registrar acceso
    await supabase.from("accesos").insert({ user_id: userId });

    return NextResponse.json({ ok: true });
  } catch {
    // No bloquear el login si algo falla
    return NextResponse.json({ ok: true });
  }
}
