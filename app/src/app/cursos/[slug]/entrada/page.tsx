import { Suspense } from "react";
import NavBar from "@/components/NavBar";
import EntradaForm from "./EntradaForm";

export default async function EntradaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <>
      <NavBar />
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 24px 60px" }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <p className="section-label" style={{ textAlign: "center" }}>Acceso anticipado</p>
          <h2 style={{ textAlign: "center", marginBottom: 32, fontSize: "clamp(22px, 4vw, 30px)" }}>Introduce tu código</h2>
          <div style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 10, padding: 32 }}>
            <Suspense>
              <EntradaForm slug={slug} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
