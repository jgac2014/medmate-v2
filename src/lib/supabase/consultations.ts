import type { ConsultationState } from "@/types";
import { createClient } from "./client";

export async function saveConsultation(userId: string, state: ConsultationState, consultationId?: string) {
  const supabase = createClient();

  const data = {
    user_id: userId,
    date: state.patient.consultationDate || new Date().toISOString().split("T")[0],
    vitals: state.vitals,
    problems: state.problems,
    problems_other: state.problemsOther,
    labs: state.labs,
    labs_date: state.labsDate || null,
    imaging: state.imaging,
    calculations: state.calculations,
    subjective: state.soap.subjective,
    objective: state.soap.objective,
    assessment: state.soap.assessment,
    plan: state.soap.plan,
    history: state.history,
    preventions: state.preventions,
    prescription: state.prescription,
    requested_exams: state.requestedExams,
    patient_instructions: state.patientInstructions,
    updated_at: new Date().toISOString(),
  };

  if (consultationId) {
    return supabase.from("consultations").update(data).eq("id", consultationId).select().single();
  }

  return supabase.from("consultations").insert(data).select().single();
}

export async function loadConsultation(consultationId: string) {
  const supabase = createClient();
  return supabase.from("consultations").select("*").eq("id", consultationId).single();
}

export async function listConsultations(userId: string) {
  const supabase = createClient();
  return supabase
    .from("consultations")
    .select("id, date, created_at, problems, vitals")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(50);
}
