import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase-server";

const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
  const { priceId, metadata, promotionCode } = await req.json();

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
  let attribution: Record<string, string> = {};
  try { attribution = JSON.parse(decodeURIComponent(req.cookies.get("growth_attribution")?.value || "")); } catch {}

  let promotionCodeId: string | undefined;
  if (typeof promotionCode === "string" && promotionCode) {
    const found = await getStripe().promotionCodes.list({ code: promotionCode, active: true, limit: 1 });
    if (!found.data[0]) return NextResponse.json({ error: "La promoción no está disponible." }, { status: 400 });
    promotionCodeId = found.data[0].id;
  }
  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: customerEmail,
    metadata: { ...(metadata ?? {}), ...attribution },
    ...(promotionCodeId ? { discounts: [{ promotion_code: promotionCodeId }] } : { allow_promotion_codes: true }),
    automatic_tax: { enabled: true },
    tax_id_collection: { enabled: true },
    success_url: `${origin}/cuenta?compra=ok`,
    cancel_url: `${origin}/cursos`,
  });

  return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creando checkout", error);
    const message = error instanceof Error ? error.message : "No se pudo crear el checkout.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
