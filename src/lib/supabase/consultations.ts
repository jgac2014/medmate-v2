import type { ConsultationState } from "@/types";
import { createClient } from "./client";
import { generateEsusSummary } from "@/lib/esus-generator";
import { logAuditEvent } from "./audit";

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
    followupItems: record.followup_items ?? [],
    labsExtras: record.labs_extras ?? "",
    triagens: record.triagens ?? {},
    timerState: {
      started_at: record.consultation_started_at ?? null,
      finished_at: record.consultation_finished_at ?? null,
      active_seconds: record.consultation_active_seconds ?? 0,
    },
    copiesThisSession: 0, // session-only counter, resets to 0 on load
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
    followup_items: state.followupItems,
    consultation_started_at: state.timerState.started_at,
    consultation_finished_at: state.timerState.finished_at,
    consultation_active_seconds: state.timerState.active_seconds,
    esus_summary: esusSummary,
    updated_at: new Date().toISOString(),
  };

  if (consultationId) {
    const result = await supabase.from("consultations").update(data).eq("id", consultationId).select().single();
    if (!result.error && result.data) {
      await logAuditEvent({
        actorId: userId,
        eventType: "consultation.updated",
        entityType: "consultation",
        entityId: result.data.id,
        metadata: {
          patientId: patientId ?? null,
          consultationDate: data.date,
        },
      });
    }
    return result;
  }

  const result = await supabase.from("consultations").insert(data).select().single();
  if (!result.error && result.data) {
    await logAuditEvent({
      actorId: userId,
      eventType: "consultation.created",
      entityType: "consultation",
      entityId: result.data.id,
      metadata: {
        patientId: patientId ?? null,
        consultationDate: data.date,
      },
    });
  }
  return result;
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

export async function searchConsultations(
  userId: string,
  query: string,
  dateFrom?: string,
  dateTo?: string
) {
  const supabase = createClient();
  let q = supabase
    .from("consultations")
    .select("id, date, created_at, problems, vitals, patient_snapshot, patient_id")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(50);

  if (dateFrom) q = q.gte("date", dateFrom);
  if (dateTo) q = q.lte("date", dateTo);

  if (query.trim()) {
    q = q.or(
      `patient_snapshot->>name.ilike.%${query}%,assessment.ilike.%${query}%,problems_other.ilike.%${query}%,prescription.ilike.%${query}%`
    );
  }

  return q;
}

export async function listConsultationsByPatient(patientId: string) {
  const supabase = createClient();
  return supabase
    .from("consultations")
    .select("id, date, created_at, problems, problems_other, vitals, labs, patient_snapshot, prescription, assessment, followup_items")
    .eq("patient_id", patientId)
    .order("date", { ascending: false })
    .limit(50);
}
