import { createClient } from "@/lib/supabase/client";
import type { FollowUpItem } from "@/types";

/**
 * Retorna os itens de pendência não concluídos da consulta mais recente
 * de um paciente, excluindo a consulta corrente (se existir).
 */
export async function getFollowupFromLastConsultation(
  userId: string,
  patientId: string,
  excludeConsultationId?: string | null
): Promise<FollowUpItem[]> {
  const supabase = createClient();

  let query = supabase
    .from("consultations")
    .select("followup_items")
    .eq("user_id", userId)
    .eq("patient_id", patientId)
    .order("created_at", { ascending: false })
    .limit(1);

  if (excludeConsultationId) {
    query = query.neq("id", excludeConsultationId);
  }

  const { data, error } = await query.maybeSingle();

  if (error || !data) return [];

  const items = data.followup_items as FollowUpItem[] | null;
  if (!Array.isArray(items) || items.length === 0) return [];

  return items.filter((item) => !item.completed);
}
