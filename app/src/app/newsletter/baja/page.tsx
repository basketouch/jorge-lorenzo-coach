import UnsubscribeClient from "./UnsubscribeClient";

export const dynamic = "force-dynamic";

export default async function NewsletterUnsubscribePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return <UnsubscribeClient token={token} />;
}
