"use client";

import { PROBLEMS } from "@/lib/constants";
import { ageFromBirthDate } from "@/lib/utils";
import { showToast } from "@/components/ui/toast";
import { useConsultationStore } from "@/stores/consultation-store";
import type { Patient } from "@/types";
import { getFollowupFromLastConsultation } from "../supabase/followup";
import { getPatientMedications } from "../supabase/patient-medications";
import { getPatientProblems } from "../supabase/patient-problems";
import { getPatientAllergies } from "../supabase/patient-allergies";

interface PrepareConsultationInput {
  userId: string | null;
  patient: Patient;
  subjective?: string;
}

export async function prepareConsultationForPatient({
  userId,
  patient,
  subjective = "",
}: PrepareConsultationInput): Promise<void> {
  const store = useConsultationStore.getState();

  store.reset();
  store.setPatientId(patient.id);
  store.setPatientName(patient.name);
  store.setPatient({
    name: patient.name,
    age:
      ageFromBirthDate(patient.birth_date) !== null
        ? String(ageFromBirthDate(patient.birth_date))
        : "",
    gender: (patient.gender as "Masculino" | "Feminino" | "Outro" | "") ?? "",
    race: (patient.race as "Branco" | "Pardo" | "Preto" | "Amarelo" | "Indígena" | "") ?? "",
  });

  if (subjective.trim()) {
    store.setSoap({ subjective: subjective.trim() });
  }

  if (!userId) return;

  const selectedPatientId = patient.id;
  const [followupResult, medicationsResult, problemsResult, allergiesResult] = await Promise.allSettled([
    getFollowupFromLastConsultation(userId, patient.id),
    getPatientMedications(patient.id),
    getPatientProblems(patient.id),
    getPatientAllergies(patient.id),
  ]);

  // Surface failures explicitly — a silent empty list in a medical context may cause
  // the physician to incorrectly assume there are no active conditions or medications.
  const anyFailed = [followupResult, medicationsResult, problemsResult, allergiesResult].some(
    (result) => result.status === "rejected"
  );
  if (anyFailed) {
    showToast(
      "Dados incompletos do paciente (medicamentos ou problemas podem estar faltando). Confirme manualmente antes de prosseguir.",
      "error"
    );
  }

  if (useConsultationStore.getState().patientId !== selectedPatientId) return;

  if (followupResult.status === "fulfilled" && followupResult.value.length > 0) {
    useConsultationStore.getState().setFollowupItems(followupResult.value);
  }

  // Medications: lidos como contexto longitudinal — alimentam chips na sidebar, não prescription.
  // Campo prescription é conduta de hoje, preenchido manualmente pelo médico.

  if (allergiesResult.status === "fulfilled" && allergiesResult.value.length > 0) {
    // Alergias como texto livre em history.allergies — campo crítico, puxado automaticamente.
    const allergiesText = allergiesResult.value
      .map((a) => a.allergy_text)
      .join(", ");
    useConsultationStore.getState().setHistory({ allergies: allergiesText });
  }

  if (problemsResult.status === "fulfilled" && problemsResult.value.length > 0) {
    const knownProblems = new Set<string>(PROBLEMS);
    const freeProblems: string[] = [];

    problemsResult.value.forEach((problem) => {
      if (knownProblems.has(problem)) {
        useConsultationStore.getState().toggleProblem(problem);
      } else {
        freeProblems.push(problem);
      }
    });

    if (freeProblems.length > 0) {
      useConsultationStore.getState().setProblemsOther(freeProblems.join(", "));
    }
  }

  // Always clear transient consultation fields on patient change.
  // These are per-consultation (not longitudinal), so they should never carry over.
  useConsultationStore.getState().setRequestedExams("");
  useConsultationStore.getState().setPatientInstructions("");
  useConsultationStore.getState().setLabsExtras("");

  // Reset triagens for the new patient — they are scale-specific.
  Object.keys(useConsultationStore.getState().triagens).forEach((key) => {
    useConsultationStore.getState().clearTriagemResult(key);
  });
}
