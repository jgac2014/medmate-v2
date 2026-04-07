"use client";

import { consentVersionsMatch, CURRENT_PRIVACY_VERSION, CURRENT_TERMS_VERSION } from "@/lib/legal";
import { createClient } from "./client";
import { logAuditEvent } from "./audit";

export async function hasRequiredConsents(userId: string): Promise<boolean> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_consents")
    .select("document_type, version")
    .eq("user_id", userId)
    .in("document_type", ["terms", "privacy"]);

  if (error) return false;
  return consentVersionsMatch(data);
}

export async function acceptRequiredConsents(userId: string): Promise<void> {
  const supabase = createClient();

  const rows = [
    {
      user_id: userId,
      document_type: "terms",
      version: CURRENT_TERMS_VERSION,
      accepted_via: "in_app",
    },
    {
      user_id: userId,
      document_type: "privacy",
      version: CURRENT_PRIVACY_VERSION,
      accepted_via: "in_app",
    },
  ];

  const { error } = await supabase
    .from("user_consents")
    .upsert(rows, { onConflict: "user_id,document_type,version" });

  if (error) throw error;

  await logAuditEvent({
    actorId: userId,
    eventType: "consent.accepted",
    entityType: "user",
    entityId: userId,
    metadata: {
      termsVersion: CURRENT_TERMS_VERSION,
      privacyVersion: CURRENT_PRIVACY_VERSION,
      source: "in_app",
    },
  });
}
