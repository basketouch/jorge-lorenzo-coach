import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase-server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { priceId, metadata } = await req.json();

  if (!priceId) {
    return NextResponse.json({ error: "priceId requerido" }, { status: 400 });
  }

  // Obtener email del usuario si está logueado
  let customerEmail: string | undefined;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) customerEmail = user.email;
  } catch { /* anónimo */ }

  const origin = req.headers.get("origin") ?? "https://www.jorgelorenzo.coach";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: customerEmail,
    metadata: metadata ?? {},
    allow_promotion_codes: true,
    automatic_tax: { enabled: true },
    tax_id_collection: { enabled: true },
    success_url: `${origin}/cuenta?compra=ok`,
    cancel_url: `${origin}/cursos`,
  });

  return NextResponse.json({ url: session.url });
}
