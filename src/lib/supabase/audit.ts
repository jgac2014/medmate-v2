"use client";

import { createClient } from "./client";

interface AuditEventInput {
  actorId?: string | null;
  eventType: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}

export async function logAuditEvent({
  actorId,
  eventType,
  entityType,
  entityId = null,
  metadata = {},
}: AuditEventInput): Promise<void> {
  try {
    const supabase = createClient();
    let resolvedActorId = actorId ?? null;

    if (!resolvedActorId) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      resolvedActorId = user?.id ?? null;
    }

    if (!resolvedActorId) return;

    await supabase.from("audit_logs").insert({
      actor_id: resolvedActorId,
      event_type: eventType,
      entity_type: entityType,
      entity_id: entityId,
      metadata,
    });
  } catch (error) {
    // Log to console so failures surface in server logs and error monitoring (e.g. Sentry).
    // Never throws — audit is best-effort and must not break the user flow.
    console.error("[audit] Failed to log audit event:", error);
  }
}
