import { createClient } from "@/lib/supabase/client";
import type { FeedbackInput } from "@/types";

export async function submitFeedback(input: FeedbackInput): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const metadata: Record<string, string | number | boolean | undefined> = {
    origin: input.origin,
    user_id: user.id,
  };
  if (input.consultation_id) metadata.consultation_id = input.consultation_id;
  if (input.timer_seconds !== undefined) metadata.timer_seconds = input.timer_seconds;

  await supabase.from("feedback_submissions").insert({
    user_id: user.id,
    type: input.type,
    area: input.area,
    message: input.message || "",
    contact_ok: input.contact_ok,
    metadata,
  });
}
