import type { Metadata } from "next";
import Image from "next/image";
import StripeCheckoutButton from "@/components/StripeCheckoutButton";
import { createAdminClient } from "@/lib/supabase-admin";

export const metadata: Metadata = { title: "Black Friday · Laboratorio del Entrenador", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function BlackFridayLaboratorio() {
  const { data: course } = await createAdminClient().from("cursos").select("titulo, portada_url, stripe_price_id").eq("slug", "laboratorio-2526").single();
  if (!course?.stripe_price_id) return null;
  return <main style={{ minHeight: "100vh", background: "#090909", color: "#f7f4ec", padding: "32px 20px 80px" }}>
    <div style={{ maxWidth: 1040, margin: "0 auto" }}>
      <p style={{ color: "#d4af45", fontWeight: 800, letterSpacing: "0.14em", fontSize: 12 }}>BLACK FRIDAY · SOLO HASTA EL 30 DE NOVIEMBRE</p>
      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(280px, .9fr)", gap: 48, alignItems: "center", marginTop: 28 }}>
        <div>
          <h1 style={{ fontSize: "clamp(42px, 7vw, 76px)", lineHeight: .98, margin: "0 0 24px" }}>El archivo completo del Laboratorio.</h1>
          <p style={{ color: "#b8b5ad", fontSize: 19, lineHeight: 1.55, maxWidth: 600 }}>51 lecciones para entrenadores: técnica, táctica, scouting, planificación y liderazgo. Acceso permanente al archivo 25/26.</p>
          <div style={{ margin: "30px 0", padding: 24, border: "2px solid #d4af45", borderRadius: 12, background: "linear-gradient(135deg,#251e0c,#111)" }}>
            <p style={{ margin: 0, color: "#b8b5ad" }}>Antes <s>347€</s></p>
            <p style={{ fontSize: 48, color: "#d4af45", fontWeight: 900, margin: "4px 0" }}>99,99€</p>
            <p style={{ margin: 0, fontSize: 13, color: "#d4af45", fontWeight: 800 }}>DESCUENTO BLACK FRIDAY APLICADO AUTOMÁTICAMENTE</p>
          </div>
          <StripeCheckoutButton priceId={course.stripe_price_id} promotionCode="BLACKFRIDAY26" metadata={{ slug: "laboratorio-2526", growth_project: "jorge_lorenzo_coach" }} style={{ width: "100%", padding: "18px", fontSize: 17, fontWeight: 900, border: 0, borderRadius: 8, background: "#d4af45", color: "#111" }}>Acceder al archivo por 99,99€ →</StripeCheckoutButton>
          <p style={{ textAlign: "center", color: "#87837a", fontSize: 12 }}>Pago único · acceso permanente · oferta termina el lunes 30 a las 23:59</p>
        </div>
        <div>{course.portada_url && <Image src={course.portada_url} alt={course.titulo} width={720} height={405} style={{ width: "100%", height: "auto", borderRadius: 12 }} />}</div>
      </section>
      <section style={{ marginTop: 70, borderTop: "1px solid #2d2d2d", paddingTop: 42 }}><h2 style={{ fontSize: 30 }}>Lo que incluye</h2><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 16, color: "#d2cec4" }}><p>✓ 9 módulos completos</p><p>✓ 51 lecciones en vídeo</p><p>✓ Técnica, táctica y scouting</p><p>✓ Acceso permanente</p></div></section>
    </div>
  </main>;
}
