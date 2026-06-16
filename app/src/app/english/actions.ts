"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";

export async function saveEcProgress(conceptId: string, progressData: {
  level: number;
  streak: number;
  attempts: number;
  correct_count: number;
  next_review: string;
  last_seen: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const admin = createAdminClient();
  await admin.from("ec_progress").upsert({
    user_id: user.id,
    concept_id: conceptId,
    ...progressData,
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id,concept_id" });
}
