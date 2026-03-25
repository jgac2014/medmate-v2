import type { ConsultationState } from "@/types";
import { formatDateBR } from "./utils";
import { EXAM_CARDS } from "./constants";

/**
 * Gera o texto de resumo formatado para colar no eSUS PEC.
 * Texto gerado em tempo real a partir do estado da consulta.
 */
export function generateEsusSummary(state: ConsultationState): string {
  const lines: string[] = [];

  // LISTA DE PROBLEMAS
  const allProblems = [...state.problems];
  if (state.problemsOther.trim()) {
    allProblems.push(...state.problemsOther.split(",").map((s) => s.trim()).filter(Boolean));
  }
  if (allProblems.length > 0) {
    lines.push("LISTA DE PROBLEMAS");
    allProblems.forEach((p) => lines.push(`• ${p}`));
    lines.push("");
  }

  // ALERGIAS
  if (state.history.allergies.trim()) {
    lines.push("ALERGIAS");
    state.history.allergies.split("\n").filter(Boolean).forEach((a) => lines.push(`• ${a.trim()}`));
    lines.push("");
  }

  // PREVENÇÕES
  if (state.preventions.length > 0) {
    lines.push("PREVENÇÕES");
    state.preventions.forEach((p) => lines.push(`• ${p}`));
    lines.push("");
  }

  // RASTREAMENTOS
  const screenings: string[] = [];
  const dateLab = formatDateBR(state.labsDate);

  if (state.calculations.rcv) {
    screenings.push(`• RCV: ${state.calculations.rcv.value}% — Risco ${state.calculations.rcv.risk} (Framingham/SBC 2022)`);
  }
  if (state.calculations.tfg) {
    screenings.push(`• TFG (CKD-EPI 2021): ${state.calculations.tfg.value} mL/min — ${state.calculations.tfg.stage}${dateLab ? ` (${dateLab})` : ""}`);
  }
  if (state.calculations.fib4) {
    screenings.push(`• FIB-4: ${state.calculations.fib4.value} — ${state.calculations.fib4.risk}${dateLab ? ` (${dateLab})` : ""}`);
  }
  if (screenings.length > 0) {
    lines.push("RASTREAMENTOS");
    lines.push(...screenings);
    lines.push("");
  }

  // BIOQUÍMICA
  const labLines: string[] = [];
  for (const card of EXAM_CARDS) {
    const values = card.fields
      .filter((f) => !("auto" in f && f.auto) && state.labs[f.key])
      .map((f) => `${f.label}: ${state.labs[f.key]}`)
      .join(" ; ");
    if (values) labLines.push(`• ${values}`);
  }
  if (labLines.length > 0) {
    lines.push(`Bioquímica${dateLab ? ` (${dateLab})` : ""}:`);
    lines.push(...labLines);
    lines.push("");
  }

  // IMAGENS / OUTROS
  if (state.imaging.entries.trim()) {
    const imgDate = formatDateBR(state.imaging.date);
    lines.push(`Imagens / Outros${imgDate ? ` (${imgDate})` : ""}:`);
    state.imaging.entries.split("\n").filter(Boolean).forEach((e) => lines.push(`• ${e.trim()}`));
    lines.push("");
  }

  // MUC
  if (state.history.comorbidities.trim()) {
    lines.push("MUC");
    state.history.comorbidities.split("\n").filter(Boolean).forEach((m) => lines.push(`• ${m.trim()}`));
    lines.push("");
  }

  // DOENÇA ATUAL (SOAP)
  const hasSoap = state.soap.subjective || state.soap.objective || state.soap.assessment || state.soap.plan;
  if (hasSoap) {
    lines.push("DOENÇA ATUAL");
    if (state.soap.subjective) {
      lines.push("• História Clínica");
      lines.push(`  ${state.soap.subjective}`);
    }
    if (state.soap.objective) {
      lines.push("• Exame Físico");
      lines.push(`  ${state.soap.objective}`);
    }
    if (state.soap.assessment) {
      lines.push("• Hipótese Diagnóstica");
      lines.push(`  ${state.soap.assessment}`);
    }
    if (state.soap.plan) {
      lines.push("• Plano");
      lines.push(`  ${state.soap.plan}`);
    }
    lines.push("");
  }

  // ANTECEDENTES
  const antecedentes: string[] = [];
  if (state.history.personal.trim()) antecedentes.push(`• Pessoais: ${state.history.personal}`);
  if (state.history.family.trim()) antecedentes.push(`• Familiares: ${state.history.family}`);
  if (state.history.habits.trim()) antecedentes.push(`• Hábitos: ${state.history.habits}`);
  if (state.history.medications.trim()) {
    antecedentes.push("• Medicamentos em uso:");
    state.history.medications.split("\n").filter(Boolean).forEach((m) => antecedentes.push(`  - ${m.trim()}`));
  }
  if (antecedentes.length > 0) {
    lines.push("ANTECEDENTES");
    lines.push(...antecedentes);
    lines.push("");
  }

  // PRESCRIÇÃO
  if (state.prescription.trim()) {
    lines.push("PRESCRIÇÃO");
    state.prescription.split("\n").filter(Boolean).forEach((p, i) => lines.push(`${i + 1}. ${p.trim()}`));
    lines.push("");
  }

  // EXAMES SOLICITADOS
  if (state.requestedExams.trim()) {
    lines.push("EXAMES SOLICITADOS");
    lines.push(`• ${state.requestedExams}`);
    lines.push("");
  }

  // ORIENTAÇÕES
  if (state.patientInstructions.trim()) {
    lines.push("ORIENTAÇÕES");
    lines.push(state.patientInstructions);
    lines.push("");
  }

  return lines.join("\n").trimEnd();
}
