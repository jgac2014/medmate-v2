import type { ConsultationState } from "@/types";
import { createClient } from "./client";
import { generateEsusSummary } from "@/lib/esus-generator";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dbRecordToState(record: any): ConsultationState {
  return {
    patient: record.patient_snapshot ?? {
      name: "", age: "", gender: "", race: "",
      consultationDate: record.date ?? new Date().toISOString().split("T")[0],
    },
    vitals: record.vitals ?? { pas: "", pad: "", peso: "", altura: "", imc: "", ca_abd: "", fc: "", spo2: "", temp: "" },
    problems: record.problems ?? [],
    problemsOther: record.problems_other ?? "",
    preventions: record.preventions ?? [],
    labs: record.labs ?? {},
    labsDate: record.labs_date ?? record.date ?? new Date().toISOString().split("T")[0],
    imaging: record.imaging ?? { date: record.date ?? "", entries: "" },
    calculations: record.calculations ?? { imc: null, tfg: null, fib4: null, rcv: null },
    soap: {
      subjective: record.subjective ?? "",
      objective: record.objective ?? "",
      assessment: record.assessment ?? "",
      plan: record.plan ?? "",
    },
    history: record.history ?? { personal: "", family: "", habits: "", medications: "", allergies: "", comorbidities: "" },
    prescription: record.prescription ?? "",
    requestedExams: record.requested_exams ?? "",
    patientInstructions: record.patient_instructions ?? "",
  };
}

export async function saveConsultation(userId: string, state: ConsultationState, consultationId?: string, patientId?: string | null) {
  const supabase = createClient();
  const esusSummary = generateEsusSummary(state);

  const data = {
    user_id: userId,
    patient_id: patientId ?? null,
    date: state.patient.consultationDate || new Date().toISOString().split("T")[0],
    patient_snapshot: state.patient,
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
    esus_summary: esusSummary,
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
    .select("id, date, created_at, problems, vitals, patient_snapshot, patient_id")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(50);
}
