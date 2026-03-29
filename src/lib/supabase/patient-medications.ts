import { createClient } from "./client";
import type { PatientMedication } from "@/types";

export async function getPatientMedications(patientId: string): Promise<PatientMedication[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("patient_medications")
    .select("*")
    .eq("patient_id", patientId)
    .eq("active", true)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as PatientMedication[];
}

export async function addPatientMedication(
  userId: string,
  patientId: string,
  medicationName: string,
  dosage: string
): Promise<PatientMedication> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("patient_medications")
    .insert({ user_id: userId, patient_id: patientId, medication_name: medicationName, dosage })
    .select()
    .single();

  if (error) throw error;
  return data as PatientMedication;
}

export async function discontinuePatientMedication(medicationId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("patient_medications")
    .update({ active: false, discontinued_at: new Date().toISOString() })
    .eq("id", medicationId);

  if (error) throw error;
}
