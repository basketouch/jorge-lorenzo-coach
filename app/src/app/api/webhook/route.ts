import { createAdminClient } from "@/lib/supabase-admin";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-signature") ?? "";
  const secret = process.env.LEMON_WEBHOOK_SECRET ?? "";

  // Verificar firma HMAC
  const hmac = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  if (hmac !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const eventName = payload.meta?.event_name;

  if (eventName !== "order_created") {
    return NextResponse.json({ ok: true });
  }

  const order = payload.data?.attributes;
  const orderId = payload.data?.id;
  const customerEmail = order?.user_email as string | undefined;
  const customerName = (order?.user_name as string | undefined) ?? "";
  const productSlug = payload.meta?.custom_data?.slug as string | undefined;
  const moduloIdRaw = payload.meta?.custom_data?.modulo_id;
  const moduloId = moduloIdRaw ? parseInt(String(moduloIdRaw)) : undefined;

  if (!customerEmail || (!productSlug && !moduloId)) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Separar nombre y apellido (Lemon Squeezy devuelve nombre completo)
  const [nombre = "", ...apellidoParts] = customerName.trim().split(" ");
  const apellido = apellidoParts.join(" ");

  // Buscar o crear usuario en auth.users
  let userId: string;
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existingUser = existingUsers?.users?.find((u) => u.email === customerEmail);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jorgelorenzo.coach";

  if (existingUser) {
    userId = existingUser.id;
    // Usuario ya existe — mandarle magic link para que acceda directamente
    await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: customerEmail,
      options: { redirectTo: `${siteUrl}/cuenta` },
    });
  } else {
    // Usuario nuevo — crear e invitar con magic link de bienvenida
    const tempPassword = crypto.randomBytes(16).toString("hex");
    const { data: newUser, error } = await supabase.auth.admin.createUser({
      email: customerEmail,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { nombre, apellido },
    });
    if (error || !newUser.user) {
      console.error("Error creando usuario:", error);
      return NextResponse.json({ error: "Error creando usuario" }, { status: 500 });
    }
    userId = newUser.user.id;
    // El trigger handle_new_user crea el perfil automáticamente

    // Enviar magic link de acceso (el usuario no tiene contraseña asignada)
    await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: customerEmail,
      options: { redirectTo: `${siteUrl}/cuenta` },
    });
  }

  // Actualizar perfil si tiene nombre (usuario existente puede no tenerlo)
  if (nombre) {
    await supabase.from("usuarios")
      .upsert({ id: userId, nombre, apellido, updated_at: new Date().toISOString() })
      .eq("id", userId);
  }

  // Compra de módulo individual
  if (moduloId) {
    await supabase.from("accesos_modulo").upsert(
      { user_id: userId, modulo_id: moduloId },
      { onConflict: "user_id,modulo_id" }
    );
    return NextResponse.json({ ok: true });
  }

  // Compra de curso completo
  const { data: curso } = await supabase
    .from("cursos")
    .select("id")
    .eq("slug", productSlug)
    .single();

  if (!curso) {
    return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
  }

  await supabase.from("compras").upsert(
    { user_id: userId, curso_id: curso.id, lemon_order_id: String(orderId) },
    { onConflict: "lemon_order_id" }
  );

  return NextResponse.json({ ok: true });
}
