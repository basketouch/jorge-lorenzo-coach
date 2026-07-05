import { createAdminClient } from "@/lib/supabase-admin";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sigHeader = req.headers.get("paddle-signature") ?? "";
  const secret = process.env.PADDLE_WEBHOOK_SECRET ?? "";

  // Extraer ts y h1 del header "ts=...;h1=..."
  const parts = Object.fromEntries(
    sigHeader.split(";").map((p) => p.split("=") as [string, string])
  );
  const ts = parts["ts"] ?? "";
  const h1 = parts["h1"] ?? "";

  // Verificar firma HMAC — timing-safe
  const signedPayload = `${ts}:${rawBody}`;
  const expected = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex");
  const expectedBuf = Buffer.from(expected, "hex");
  const receivedBuf = Buffer.from(h1, "hex");
  if (
    expectedBuf.length === 0 ||
    expectedBuf.length !== receivedBuf.length ||
    !crypto.timingSafeEqual(expectedBuf, receivedBuf)
  ) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const eventType = payload.event_type as string;

  if (eventType !== "transaction.completed") {
    return NextResponse.json({ ok: true });
  }

  const data = payload.data;
  const transactionId = data?.id as string | undefined;
  const customData = data?.custom_data ?? {};
  const productSlug = customData?.slug as string | undefined;
  const moduloIdRaw = customData?.modulo_id;
  const moduloId = moduloIdRaw ? parseInt(String(moduloIdRaw)) : undefined;

  // El email puede estar en diferentes rutas según la versión del payload
  const customerEmail =
    (data?.customer?.email as string | undefined) ??
    (data?.billing_details?.email as string | undefined);
  const customerName =
    (data?.customer?.name as string | undefined) ??
    (data?.billing_details?.name as string | undefined) ?? "";

  if (!customerEmail || (!productSlug && !moduloId)) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const [nombre = "", ...apellidoParts] = customerName.trim().split(" ");
  const apellido = apellidoParts.join(" ");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jorgelorenzo.coach";

  // Buscar o crear usuario
  let userId: string;
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existingUser = existingUsers?.users?.find((u) => u.email === customerEmail);

  if (existingUser) {
    userId = existingUser.id;
    await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: customerEmail,
      options: { redirectTo: `${siteUrl}/cuenta` },
    });
  } else {
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

    await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: customerEmail,
      options: { redirectTo: `${siteUrl}/cuenta` },
    });
  }

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
    { user_id: userId, curso_id: curso.id, paddle_transaction_id: transactionId },
    { onConflict: "paddle_transaction_id" }
  );

  return NextResponse.json({ ok: true });
}
