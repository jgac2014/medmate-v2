import { createClient } from "./client";

export interface PatientAllergy {
  id: string;
  patient_id: string;
  user_id: string;
  allergy_text: string;
  severity: "leve" | "moderada" | "grave";
  active: boolean;
  created_at: string;
}

/** Retorna alergias ativas de um paciente. */
export async function getPatientAllergies(patientId: string): Promise<PatientAllergy[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("patient_allergies")
    .select("*")
    .eq("patient_id", patientId)
    .eq("active", true)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as PatientAllergy[];
}

/**
 * Upsert completo de alergias — cria, atualiza ou desativa.
 * Cada item pode ter id (update) ou não (create).
 * active=false significa desativar sem deletar (auditoria preservada).
 */
export async function upsertPatientAllergies(
  userId: string,
  patientId: string,
  allergies: {
    id?: string;
    text: string;
    severity: "leve" | "moderada" | "grave";
    active: boolean;
  }[]
): Promise<void> {
  const supabase = createClient();

  for (const allergy of allergies) {
    if (allergy.id) {
      // Update fields or soft-delete
      const { error } = await supabase
        .from("patient_allergies")
        .update({
          allergy_text: allergy.text,
          severity: allergy.severity,
          active: allergy.active,
        })
        .eq("id", allergy.id)
        .eq("user_id", userId);
      if (error) throw error;
    } else {
      // Create new
      const { error } = await supabase.from("patient_allergies").insert({
        patient_id: patientId,
        user_id: userId,
        allergy_text: allergy.text,
        severity: allergy.severity,
        active: allergy.active,
      });
      if (error) throw error;
    }
  }
}

/**
 * Desativa uma alergia específica pelo ID (soft delete).
 */
export async function deactivatePatientAllergy(
  userId: string,
  allergyId: string
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("patient_allergies")
    .update({ active: false })
    .eq("id", allergyId)
    .eq("user_id", userId);
  if (error) throw error;
}
