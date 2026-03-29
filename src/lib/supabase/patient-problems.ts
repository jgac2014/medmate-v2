import { createClient } from "@/lib/supabase/client";

/** Retorna os problemas ativos de um paciente. */
export async function getPatientProblems(patientId: string): Promise<string[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("patient_problems")
    .select("problem_text")
    .eq("patient_id", patientId)
    .eq("active", true)
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data.map((r) => r.problem_text);
}

/**
 * Sincroniza a lista de problemas do paciente com os problemas da consulta atual.
 * - Novos problemas são inseridos.
 * - Problemas removidos da consulta são marcados como resolvidos.
 * - Problemas que voltaram são reativados.
 */
export async function upsertPatientProblems(
  userId: string,
  patientId: string,
  currentProblems: string[]
): Promise<void> {
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("patient_problems")
    .select("id, problem_text, active")
    .eq("patient_id", patientId)
    .eq("user_id", userId);

  const existingMap = new Map((existing ?? []).map((p) => [p.problem_text, p]));
  const currentSet = new Set(currentProblems);

  // Inserir novos
  const toInsert = currentProblems
    .filter((p) => !existingMap.has(p))
    .map((problem_text) => ({ patient_id: patientId, user_id: userId, problem_text, active: true }));

  if (toInsert.length > 0) {
    await supabase.from("patient_problems").insert(toInsert);
  }

  // Reativar os que voltaram
  const toReactivate = (existing ?? [])
    .filter((p) => !p.active && currentSet.has(p.problem_text))
    .map((p) => p.id);

  if (toReactivate.length > 0) {
    await supabase
      .from("patient_problems")
      .update({ active: true, resolved_at: null })
      .in("id", toReactivate);
  }

  // Resolver os que saíram
  const toResolve = (existing ?? [])
    .filter((p) => p.active && !currentSet.has(p.problem_text))
    .map((p) => p.id);

  if (toResolve.length > 0) {
    await supabase
      .from("patient_problems")
      .update({ active: false, resolved_at: new Date().toISOString() })
      .in("id", toResolve);
  }
}
