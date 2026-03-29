import type { ConsultationState } from "@/types";

export function generateResumoOutput(state: ConsultationState): string {
  const lines: string[] = [];
  const { patient, vitals, problems, problemsOther, soap, prescription, requestedExams, patientInstructions } = state;

  const patientLine = [patient.name, patient.age, patient.gender].filter(Boolean).join(" · ");
  if (patientLine) lines.push(`**${patientLine}**`);

  const allProblems = [
    ...problems,
    ...(problemsOther.trim() ? problemsOther.split(",").map((s) => s.trim()).filter(Boolean) : []),
  ];
  if (allProblems.length > 0) lines.push(`\nProblemas: ${allProblems.join(", ")}`);

  const vitalParts: string[] = [];
  if (vitals.pas && vitals.pad) vitalParts.push(`PA ${vitals.pas}/${vitals.pad}`);
  if (vitals.peso) vitalParts.push(`Peso ${vitals.peso} kg`);
  if (vitals.imc) vitalParts.push(`IMC ${vitals.imc}`);
  if (vitalParts.length > 0) lines.push(`Vitais: ${vitalParts.join(" | ")}`);

  if (soap.assessment) lines.push(`\nAvaliação: ${soap.assessment}`);
  if (soap.plan) lines.push(`Plano: ${soap.plan}`);
  if (prescription) lines.push(`\nPrescrição:\n${prescription}`);
  if (requestedExams) lines.push(`\nExames:\n${requestedExams}`);
  if (patientInstructions) lines.push(`\nOrientações:\n${patientInstructions}`);

  return lines.join("\n").trimEnd();
}
