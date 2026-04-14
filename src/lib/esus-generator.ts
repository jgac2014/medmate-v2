import type { ConsultationState } from "@/types";
import { formatDateBR } from "./utils";
import { EXAM_CARDS } from "./constants";
import { preventionOutputLabels, preventionShortLabel, triagemOutputLine } from "./output-labels";

/**
 * Gera o texto de resumo formatado para colar no eSUS PEC.
 * Texto gerado em tempo real a partir do estado da consulta.
 *
 * Princípios de output:
 * - Rótulos curtos, clínicos, sem contexto normativo
 * - Triagens só aparecem se realmente aplicadas
 * - Sem seções vazias, sem placeholders
 * - PSA completamente ausente do output
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

  // PREVENÇÕES — rótulos curtos, só prevenção factual (sem duplicação com TRIAGENS)
  if (state.preventions.length > 0) {
    const outputItems = preventionOutputLabels(state.preventions)
      .map(preventionShortLabel)
      .filter(Boolean);
    if (outputItems.length > 0) {
      lines.push("PREVENÇÕES");
      outputItems.forEach((p) => lines.push(`• ${p}`));
      lines.push("");
    }
  }

  // RASTREAMENTOS
  const screenings: string[] = [];
  const dateLab = formatDateBR(state.labsDate);

  if (state.calculations.rcv && !state.calculations.rcv.outOfRange) {
    screenings.push(`• RCV: ${state.calculations.rcv.value}% — Risco ${state.calculations.rcv.risk} (Framingham/SBC 2022)`);
  }
  if (state.calculations.tfg) {
    screenings.push(`• TFG (CKD-EPI 2021): ${state.calculations.tfg.value} mL/min — ${state.calculations.tfg.stage}${dateLab ? ` (${dateLab})` : ""}`);
  }
  if (state.calculations.fib4 && !state.calculations.fib4.lowValidity) {
    screenings.push(`• FIB-4: ${state.calculations.fib4.value} — ${state.calculations.fib4.risk}${dateLab ? ` (${dateLab})` : ""}`);
  }
  if (screenings.length > 0) {
    lines.push("RASTREAMENTOS");
    lines.push(...screenings);
    lines.push("");
  }

  // LDL / Não-HDL
  const lipidCalcs: string[] = [];
  if (state.calculations.ldl && Number.isFinite(state.calculations.ldl.value)) {
    lipidCalcs.push(`LDL-c (Friedewald): ${state.calculations.ldl.value.toFixed(0)} mg/dL`);
  }
  if (state.calculations.naoHdl && Number.isFinite(state.calculations.naoHdl.value)) {
    lipidCalcs.push(`Não-HDL-c: ${state.calculations.naoHdl.value.toFixed(0)} mg/dL`);
  }
  if (lipidCalcs.length > 0) {
    lines.push("LIPIDOGRAMA");
    lipidCalcs.forEach((l) => lines.push(`• ${l}`));
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

  // EXAMES E IMAGENS
  const validItems = state.imaging.items.filter(
    (item) => item.name.trim() || item.result.trim() || item.notes.trim()
  );
  const hasImaging = validItems.length > 0 || state.imaging.entries.trim();
  if (hasImaging) {
    const byDate: Record<string, typeof validItems> = {};
    for (const item of validItems) {
      const d = item.examDate || state.imaging.date;
      if (!byDate[d]) byDate[d] = [];
      byDate[d].push(item);
    }

    for (const [dateKey, items] of Object.entries(byDate)) {
      const formattedDate = formatDateBR(dateKey);
      lines.push(`Exames e Imagens${formattedDate ? ` (${formattedDate})` : ""}:`);
      for (const item of items) {
        const parts = [item.name.trim(), item.result.trim()].filter(Boolean).join(": ");
        const suffix = item.notes.trim() ? ` — ${item.notes.trim()}` : "";
        if (parts) lines.push(`• ${parts}${suffix}`);
      }
    }
    if (state.imaging.entries.trim()) {
      const imgDate = formatDateBR(state.imaging.date);
      lines.push(`Exames e Imagens${imgDate ? ` (${imgDate})` : ""}:`);
      state.imaging.entries.split("\n").filter(Boolean).forEach((e) => lines.push(`• ${e.trim()}`));
    }
    lines.push("");
  }

  // MUC
  if (state.history.comorbidities.trim()) {
    lines.push("MUC");
    state.history.comorbidities.split("\n").filter(Boolean).forEach((m) => lines.push(`• ${m.trim()}`));
    lines.push("");
  }

  // DOENÇA ATUAL
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

  // TRIAGENS CLÍNICAS — só se aplicadas
  const triagemEntries = Object.values(state.triagens ?? {});
  if (triagemEntries.length > 0) {
    const nucleoSUS = triagemEntries.filter(
      (r) => r.scaleId === "ivcf20" || r.scaleId === "phq9"
    );
    const complementares = triagemEntries.filter(
      (r) => r.scaleId !== "ivcf20" && r.scaleId !== "phq9"
    );

    lines.push("AVALIAÇÕES CLÍNICAS");
    nucleoSUS.forEach((r) => lines.push(`• ${triagemOutputLine(r.scaleId, r.score, r.interpretation)}`));
    complementares.forEach((r) => lines.push(`• ${triagemOutputLine(r.scaleId, r.score, r.interpretation)}`));
    lines.push("");
  }

  return lines.join("\n").trimEnd();
}
