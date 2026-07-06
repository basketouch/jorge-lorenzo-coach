import { createAdminClient } from "@/lib/supabase-admin";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import crypto from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";
  const secret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ ok: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const sessionId = session.id;
  const customerEmail = session.customer_details?.email ?? session.customer_email ?? null;
  const customerName = session.customer_details?.name ?? "";
  const metadata = session.metadata ?? {};
  const productSlug = metadata.slug ?? null;
  const moduloId = metadata.modulo_id ? parseInt(metadata.modulo_id) : null;

  if (!customerEmail || (!productSlug && !moduloId)) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.jorgelorenzo.coach";

  const [nombre = "", ...apellidoParts] = customerName.trim().split(" ");
  const apellido = apellidoParts.join(" ");

  // Buscar o crear usuario
  let userId: string;
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existingUser = existingUsers?.users?.find((u) => u.email === customerEmail);

  if (existingUser) {
    userId = existingUser.id;
  } else {
    const tempPassword = crypto.randomBytes(16).toString("hex");
    const { data: newUser, error } = await supabase.auth.admin.createUser({
      email: customerEmail,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { nombre, apellido },
    });
    if (error || !newUser.user) {
      return NextResponse.json({ error: "Error creando usuario" }, { status: 500 });
    }
    userId = newUser.user.id;
  }

  // Enviar magic link para acceso inmediato
  await supabase.auth.admin.generateLink({
    type: "magiclink",
    email: customerEmail,
    options: { redirectTo: `${siteUrl}/cuenta` },
  });

  if (nombre) {
    await supabase.from("usuarios")
      .upsert({ id: userId, nombre, apellido, updated_at: new Date().toISOString() })
      .eq("id", userId);
  }

  // Módulo individual
  if (moduloId) {
    await supabase.from("accesos_modulo").upsert(
      { user_id: userId, modulo_id: moduloId },
      { onConflict: "user_id,modulo_id" }
    );
    return NextResponse.json({ ok: true });
  }

  // Curso completo
  const { data: curso } = await supabase
    .from("cursos")
    .select("id")
    .eq("slug", productSlug)
    .single();

  if (!curso) {
    return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
  }

  await supabase.from("compras").upsert(
    { user_id: userId, curso_id: curso.id, stripe_session_id: sessionId },
    { onConflict: "stripe_session_id" }
  );

  return NextResponse.json({ ok: true });
}
