"use client";

import { PROBLEMS } from "@/lib/constants";
import { ageFromBirthDate } from "@/lib/utils";
import { showToast } from "@/components/ui/toast";
import { useConsultationStore } from "@/stores/consultation-store";
import type { Patient } from "@/types";
import { getFollowupFromLastConsultation } from "../supabase/followup";
import { getPatientMedications } from "../supabase/patient-medications";
import { getPatientProblems } from "../supabase/patient-problems";

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
        ? `${ageFromBirthDate(patient.birth_date)} anos`
        : "",
    gender: (patient.gender as "Masculino" | "Feminino" | "Outro" | "") ?? "",
    race: (patient.race as "Branco" | "Pardo" | "Preto" | "Amarelo" | "Indígena" | "") ?? "",
  });

  if (subjective.trim()) {
    store.setSoap({ subjective: subjective.trim() });
  }

  if (!userId) return;

  const selectedPatientId = patient.id;
  const [followupResult, medicationsResult, problemsResult] = await Promise.allSettled([
    getFollowupFromLastConsultation(userId, patient.id),
    getPatientMedications(patient.id),
    getPatientProblems(patient.id),
  ]);

  // Surface failures explicitly — a silent empty list in a medical context may cause
  // the physician to incorrectly assume there are no active conditions or medications.
  const anyFailed = [followupResult, medicationsResult, problemsResult].some(
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

  if (medicationsResult.status === "fulfilled" && medicationsResult.value.length > 0) {
    const prescription = medicationsResult.value
      .map((medication) =>
        medication.dosage
          ? `${medication.medication_name} - ${medication.dosage}`
          : medication.medication_name
      )
      .join("\n");

    useConsultationStore.getState().setPrescription(prescription);
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
}
