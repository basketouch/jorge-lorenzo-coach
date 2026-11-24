import { createAdminClient } from "@/lib/supabase-admin";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import crypto from "crypto";
import { reportClientToHub } from "@/lib/hub-client-event";

const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY!);

async function reportGrowthConversion(session: Stripe.Checkout.Session) {
  const url = process.env.GROWTH_HUB_INGEST_URL;
  const token = process.env.GROWTH_HUB_INGEST_TOKEN;
  const meta = session.metadata || {};
  if (!url || !token || meta.growth_project !== "jorge_lorenzo_coach" || !meta.utm_campaign) return;
  const base = {
    project: "jorge_lorenzo_coach", provider: "stripe", provider_event_id: session.id,
    transaction_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
    utm_source: meta.utm_source, utm_medium: meta.utm_medium, utm_campaign: meta.utm_campaign, utm_content: meta.utm_content,
    amount_minor: session.amount_total, currency_code: session.currency?.toUpperCase(), occurred_at: new Date((session.created || Math.floor(Date.now() / 1000)) * 1000).toISOString(),
  };
  for (const event_type of ["checkout_completed", "subscription_paid"]) {
    const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ ...base, event_type, dedupe_key: `stripe:${session.id}:${event_type}` }) });
    if (!response.ok) console.error("No se pudo atribuir conversión en Hub", await response.text());
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";
  const secret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, sig, secret);
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

  await reportGrowthConversion(session).catch((error) => console.error("Error atribuyendo compra", error));
  // El Hub guarda quién compró y desde qué campaña (sin cambiar su consentimiento de email).
  await reportClientToHub({
    email: customerEmail,
    firstName: nombre,
    lastName: apellido,
    stripeSessionId: sessionId,
    productSlug,
    amountMinor: session.amount_total,
    currency: session.currency,
    attribution: metadata,
  }).catch((error) => console.error("Error registrando al cliente en el Hub", error));

  return NextResponse.json({ ok: true });
}
