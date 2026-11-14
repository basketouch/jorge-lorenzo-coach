import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { normalizePhone, revokeWhatsappConsentInHub, sendWhatsappConsentToHub } from "@/lib/whatsapp-consent";

// Avisos por WhatsApp desde «Mi cuenta»: el email sale de la sesión, no del formulario,
// así que nadie puede apuntar o dar de baja el teléfono de otra persona.
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Inicia sesión de nuevo." }, { status: 401 });

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud no válida." }, { status: 400 });
  }

  const email = user.email.toLowerCase();

  if (payload.acepta !== true) {
    const status = await revokeWhatsappConsentInHub(email);
    if (!status) return NextResponse.json({ error: "No hemos podido guardar el cambio. Inténtalo de nuevo." }, { status: 502 });
    return NextResponse.json({ ok: true, phone: status.phone, consent: false });
  }

  const phone = normalizePhone(typeof payload.telefono === "string" ? payload.telefono.trim().slice(0, 30) : "");
  if (!phone) {
    return NextResponse.json({ error: "Escribe tu móvil con el prefijo del país, por ejemplo +34 600 111 222." }, { status: 400 });
  }

  const { data: perfil } = await supabase.from("usuarios").select("nombre, apellido").eq("id", user.id).single();
  const result = await sendWhatsappConsentToHub({
    email,
    firstName: perfil?.nombre ?? "",
    lastName: perfil?.apellido ?? "",
    phone,
    consent: true,
    source: "jorgelorenzo.coach/cuenta",
  });
  if (result !== "saved") {
    console.error("WhatsApp de Mi cuenta no guardado en el Hub:", result);
    return NextResponse.json({ error: "No hemos podido guardar tu móvil. Inténtalo de nuevo." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, phone, consent: true });
}
