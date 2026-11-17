import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { priceId: requestedPriceId, metadata } = await req.json();

  if (!requestedPriceId) {
    return NextResponse.json({ error: "priceId requerido" }, { status: 400 });
  }

  let priceId = requestedPriceId as string;
  let promotionCodeId: string | undefined;
  const courseSlug = typeof metadata?.slug === "string" ? metadata.slug : null;

  // Para un curso, la configuración de venta (precio y código) vive en la base de datos.
  // Así el descuento no depende de que el navegador mande un código ni un precio manipulable.
  if (courseSlug) {
    const { data: curso, error } = await createAdminClient()
      .from("cursos")
      .select("stripe_price_id, codigo_promocional")
      .eq("slug", courseSlug)
      .single();
    if (error || !curso?.stripe_price_id) {
      return NextResponse.json({ error: "Curso no disponible para la compra" }, { status: 400 });
    }
    priceId = curso.stripe_price_id;

    const codigo = curso.codigo_promocional?.trim();
    if (codigo) {
      const promotionCodes = await getStripe().promotionCodes.list({ code: codigo, active: true, limit: 1 });
      const promotionCode = promotionCodes.data[0];
      if (!promotionCode) {
        return NextResponse.json({ error: "La promoción configurada no está disponible" }, { status: 400 });
      }
      promotionCodeId = promotionCode.id;
    }
  }

  // Obtener email del usuario si está logueado
  let customerEmail: string | undefined;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) customerEmail = user.email;
  } catch { /* anónimo */ }

  const origin = req.headers.get("origin") ?? "https://www.jorgelorenzo.coach";

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: customerEmail,
    metadata: metadata ?? {},
    // Stripe no permite habilitar el campo manual cuando se aplica un código automáticamente.
    allow_promotion_codes: !promotionCodeId,
    ...(promotionCodeId ? { discounts: [{ promotion_code: promotionCodeId }] } : {}),
    automatic_tax: { enabled: true },
    tax_id_collection: { enabled: true },
    success_url: `${origin}/cuenta?compra=ok`,
    cancel_url: `${origin}/cursos`,
  });

  return NextResponse.json({ url: session.url });
}
