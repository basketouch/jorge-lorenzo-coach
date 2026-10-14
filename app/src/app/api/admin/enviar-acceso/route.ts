import { NextRequest, NextResponse } from "next/server";
import { correoCoach, parrafo, boton, textoABloques, esc } from "@/lib/email-shell";
import { requireAdmin } from "@/lib/admin-guard";

const BREVO_API_KEY = process.env.BREVO_API_KEY!;
const SENDER = { name: "Jorge Lorenzo Coach", email: "info@jorgelorenzo.coach" };
const REDIRECT_URL = "https://www.jorgelorenzo.coach";

export async function POST(req: NextRequest) {
  try {
  const { admin } = await requireAdmin();
  const { email, nombre, apellido } = await req.json();

  if (!email) return NextResponse.json({ error: "email es obligatorio" }, { status: 400 });

  // 1. Comprobar si ya existe en Auth
  const { data: lista } = await admin.auth.admin.listUsers();
  const usuarioAuth = lista?.users?.find((u) => u.email === email);

  if (!usuarioAuth) {
    // 2. Crear usuario en Auth (email confirmado, sin contraseña)
    const { data: creado, error: createError } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
    });

    if (createError || !creado?.user) {
      return NextResponse.json({ error: createError?.message ?? "Error al crear usuario", details: JSON.stringify(createError) }, { status: 500 });
    }

    const newId = creado.user.id;

    // 3. Si había una fila antigua en usuarios (UUID distinto), migrar accesos y limpiar
    const { data: viejo } = await admin
      .from("usuarios")
      .select("id")
      .eq("email", email)
      .neq("id", newId)
      .single();

    if (viejo?.id) {
      const oldId = viejo.id;
      // Migrar tablas relacionadas al nuevo UUID
      await Promise.all([
        admin.from("accesos_modulo").update({ user_id: newId }).eq("user_id", oldId),
        admin.from("compras").update({ user_id: newId }).eq("user_id", oldId),
        admin.from("progreso").update({ user_id: newId }).eq("user_id", oldId),
        admin.from("accesos").update({ user_id: newId }).eq("user_id", oldId),
      ]);
      // Borrar fila vieja (ya no tiene dependencias)
      await admin.from("usuarios").delete().eq("id", oldId);
    }
  }

  // 4. Actualizar nombre/apellido en usuarios por UUID de auth
  if (nombre?.trim() || apellido?.trim()) {
    const { data: authList2 } = await admin.auth.admin.listUsers();
    const authUser = authList2?.users?.find((u) => u.email === email);
    if (authUser) {
      await admin.from("usuarios")
        .update({ nombre: nombre?.trim() || null, apellido: apellido?.trim() || null })
        .eq("id", authUser.id);
    }
  }

  // 5. Generar recovery link (NO manda email propio)
  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo: REDIRECT_URL },
  });

  if (error || !data?.properties?.action_link) {
    return NextResponse.json({ error: error?.message ?? "No se pudo generar el enlace" }, { status: 500 });
  }

  // 6. Construir URL limpia sin supabase.co (evita filtros de Gmail)
  const actionUrl = new URL(data.properties.action_link);
  const supabaseToken = actionUrl.searchParams.get("token") ?? "";
  const supabaseType = actionUrl.searchParams.get("type") ?? "recovery";
  const enlaceSeguro = `https://www.jorgelorenzo.coach/api/ir?token=${encodeURIComponent(supabaseToken)}&type=${encodeURIComponent(supabaseType)}`;

  // 7. Enviar email con Brevo
  const nombreMostrado = nombre?.trim() || "entrenador";
  const year = new Date().getFullYear();

  const html = correoCoach({
    title: "Tu acceso a El Laboratorio del Entrenador",
    bodyHtml:
      parrafo(`Hola <strong>${esc(nombreMostrado)}</strong>,`) +
      parrafo("Ya tienes acceso a <strong>El Laboratorio del Entrenador</strong>. Haz clic en el botón para crear tu contraseña y entrar.") +
      parrafo("El enlace es válido durante 24 horas.") +
      boton(enlaceSeguro, "Crear contraseña y entrar") +
      '<p style="margin:16px 0 0;font-size:14px;line-height:1.55;color:#52606d">Si no esperabas este email, puedes ignorarlo con seguridad.</p>',
  });

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: SENDER,
      to: [{ email, name: nombreMostrado }],
      subject: "Tu acceso a El Laboratorio del Entrenador",
      htmlContent: html,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    return NextResponse.json({ error: err.message ?? "Error al enviar el email" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("[enviar-acceso] error inesperado:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
