import { requireAdmin } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

export default async function NewsletterAudiencePage() {
  const { admin } = await requireAdmin();
  const [{ data: subscribers }, { data: categories }, { count: total }, { count: active }, { count: unsubscribed }] = await Promise.all([
    admin
      .from("newsletter_subscribers")
      .select("email, first_name, last_name, status, consent_at, legacy_customer_category, legacy_lab_entrenador")
      .order("consent_at", { ascending: false })
      .limit(100),
    admin.from("newsletter_subscribers").select("legacy_customer_category"),
    admin.from("newsletter_subscribers").select("*", { count: "exact", head: true }),
    admin.from("newsletter_subscribers").select("*", { count: "exact", head: true }).eq("status", "active").eq("marketing_consent", true),
    admin.from("newsletter_subscribers").select("*", { count: "exact", head: true }).eq("status", "unsubscribed"),
  ]);

  const rows = subscribers ?? [];
  const categoryCounts = (categories ?? []).reduce<Record<string, number>>((counts, subscriber) => {
    const category = subscriber.legacy_customer_category ?? "Sin categoría";
    counts[category] = (counts[category] ?? 0) + 1;
    return counts;
  }, {});
  const cards = [
    { label: "Audiencia total", value: total ?? 0, note: "suscriptores importados" },
    { label: "Activos", value: active ?? 0, note: "pueden recibir la newsletter", accent: true },
    { label: "Bajas", value: unsubscribed ?? 0, note: "gestionadas desde Basketouch" },
  ];

  return (
    <div>
      <header style={{ marginBottom: 32 }}>
        <p style={{ color: "var(--oro)", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>Newsletter semanal</p>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Pizarra de audiencia</h1>
        <p style={{ color: "var(--texto-suave)", maxWidth: 620, lineHeight: 1.65 }}>La base de entrenadores que recibe tus ideas, recursos y novedades. Los contactos viven aquí; las cuentas de cursos siguen separadas.</p>
      </header>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12, marginBottom: 28 }}>
        {cards.map(card => (
          <article key={card.label} style={{ padding: "20px", background: "var(--card)", border: `1px solid ${card.accent ? "rgba(201,168,76,0.55)" : "var(--borde)"}`, borderRadius: 12 }}>
            <p style={{ color: "var(--texto-suave)", fontSize: 12, marginBottom: 10 }}>{card.label}</p>
            <p style={{ color: card.accent ? "var(--oro)" : "var(--texto)", fontSize: 32, fontWeight: 800, lineHeight: 1, marginBottom: 8, fontVariantNumeric: "tabular-nums" }}>{card.value}</p>
            <p style={{ color: "var(--texto-suave)", fontSize: 11 }}>{card.note}</p>
          </article>
        ))}
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 260px", gap: 20, alignItems: "start" }} className="newsletter-admin-grid">
        <div style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", padding: "16px 20px", borderBottom: "1px solid var(--borde)" }}>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700 }}>Últimos contactos</h2>
              <p style={{ color: "var(--texto-suave)", fontSize: 11, marginTop: 3 }}>Mostrando {rows.length} de {total ?? 0}</p>
            </div>
            <span style={{ color: "var(--oro)", fontSize: 11, fontWeight: 700 }}>Lista 15 migrada</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ color: "var(--texto-suave)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "left" }}>
                  <th style={{ padding: "12px 20px", fontWeight: 700 }}>Entrenador</th><th style={{ padding: "12px 12px", fontWeight: 700 }}>Estado</th><th style={{ padding: "12px 20px", fontWeight: 700 }}>Alta</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(subscriber => (
                  <tr key={subscriber.email} style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <td style={{ padding: "12px 20px" }}><p style={{ fontWeight: 600 }}>{[subscriber.first_name, subscriber.last_name].filter(Boolean).join(" ") || "Sin nombre"}</p><p style={{ color: "var(--texto-suave)", fontSize: 11, marginTop: 2 }}>{subscriber.email}</p></td>
                    <td style={{ padding: "12px" }}><span style={{ color: subscriber.status === "active" ? "#79c89b" : "#e49a9a", fontSize: 11, fontWeight: 700 }}>{subscriber.status === "active" ? "Activo" : "Baja"}</span></td>
                    <td style={{ padding: "12px 20px", color: "var(--texto-suave)", fontSize: 12, whiteSpace: "nowrap" }}>{subscriber.consent_at ? new Date(`${subscriber.consent_at}T12:00:00`).toLocaleDateString("es-ES") : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside style={{ background: "var(--card)", border: "1px solid var(--borde)", borderRadius: 12, padding: 20 }}>
          <p style={{ color: "var(--texto-suave)", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>Composición visible</p>
          {Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).map(([category, count]) => (
            <div key={category} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 13 }}><span style={{ color: "var(--texto-suave)" }}>{category}</span><strong style={{ color: "var(--oro)", fontVariantNumeric: "tabular-nums" }}>{count}</strong></div>
          ))}
          <p style={{ color: "var(--texto-suave)", fontSize: 11, lineHeight: 1.5, marginTop: 16 }}>Las categorías solo existen en una parte de la importación histórica.</p>
        </aside>
      </section>
    </div>
  );
}
