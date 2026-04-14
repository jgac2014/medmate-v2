import type { ConsultationState } from "@/types";
import { preventionOutputLabels, preventionShortLabel, triagemOutputLine } from "@/lib/output-labels";

/**
 * Output resumido — formato compacto para uso rápido.
 * Princípios: curto, clínico, sem contexto normativo, sem seções vazias.
 */
export function generateResumoOutput(state: ConsultationState): string {
  const lines: string[] = [];
  const { patient, vitals, problems, problemsOther, soap, prescription, requestedExams, patientInstructions, preventions, triagens } = state;
  const { labsExtras, calculations, history } = state;

  const patientLine = [patient.name, patient.age, patient.gender].filter(Boolean).join(" · ");
  if (patientLine) lines.push(`**${patientLine}**`);

  const allProblems = [
    ...problems,
    ...(problemsOther.trim() ? problemsOther.split(",").map((s) => s.trim()).filter(Boolean) : []),
  ];
  if (allProblems.length > 0) lines.push(`\nProblemas: ${allProblems.join(", ")}`);

  // Alergias
  if (history.allergies.trim()) {
    lines.push(`\nAlergias: ${history.allergies.replace(/\n/g, ", ")}`);
  }

  // Prevenções — só prevenção factual, rótulos curtos
  if (preventions.length > 0) {
    const short = preventionOutputLabels(preventions)
      .map(preventionShortLabel)
      .filter(Boolean);
    if (short.length > 0) {
      lines.push(`\nPrevenções: ${short.join(" | ")}`);
    }
  }

  // Vitais completos
  const vitalParts: string[] = [];
  if (vitals.pas && vitals.pad) vitalParts.push(`PA ${vitals.pas}/${vitals.pad}`);
  if (vitals.peso) vitalParts.push(`${vitals.peso} kg`);
  if (vitals.imc) vitalParts.push(`IMC ${vitals.imc}`);
  if (vitals.fc) vitalParts.push(`FC ${vitals.fc} bpm`);
  if (vitals.spo2) vitalParts.push(`SpO2 ${vitals.spo2}%`);
  if (vitals.temp) vitalParts.push(`Temp ${vitals.temp} °C`);
  if (vitals.altura) vitalParts.push(`${vitals.altura} cm`);
  if (vitals.ca_abd) vitalParts.push(`CA ${vitals.ca_abd} cm`);
  if (vitalParts.length > 0) lines.push(`Vitais: ${vitalParts.join(" | ")}`);

  // Cálculos clínicos
  const calcParts: string[] = [];
  if (calculations.tfg && Number.isFinite(calculations.tfg.value))
    calcParts.push(`TFG ${calculations.tfg.value.toFixed(0)} mL/min (${calculations.tfg.stage})`);
  if (calculations.fib4 && Number.isFinite(calculations.fib4.value))
    calcParts.push(`FIB-4 ${calculations.fib4.value.toFixed(2)}`);
  if (calculations.rcv && Number.isFinite(calculations.rcv.value))
    calcParts.push(`RCV ${calculations.rcv.value.toFixed(0)}% (${calculations.rcv.risk})`);
  if (calculations.ldl && Number.isFinite(calculations.ldl.value))
    calcParts.push(`LDL ${calculations.ldl.value.toFixed(0)} mg/dL`);
  if (calculations.naoHdl && Number.isFinite(calculations.naoHdl.value))
    calcParts.push(`Não-HDL ${calculations.naoHdl.value.toFixed(0)} mg/dL`);
  if (calcParts.length > 0) lines.push(`Calc: ${calcParts.join(" | ")}`);

  // Labs extras
  if (labsExtras?.trim()) lines.push(`\nExames: ${labsExtras.trim().replace(/\n/g, " | ")}`);

  // SOAP
  if (soap.subjective) lines.push(`\nS: ${soap.subjective}`);
  if (soap.objective) lines.push(`O: ${soap.objective}`);
  if (soap.assessment) lines.push(`A: ${soap.assessment}`);
  if (soap.plan) lines.push(`P: ${soap.plan}`);

  if (prescription) lines.push(`\nPrescrição:\n${prescription}`);
  if (requestedExams) lines.push(`\nExames:\n${requestedExams}`);
  if (patientInstructions) lines.push(`\nOrientações:\n${patientInstructions}`);

  // Triagens — formato curto
  const triagemEntries = Object.values(triagens ?? {});
  if (triagemEntries.length > 0) {
    const triagemLines = triagemEntries.map(
      (r) => `• ${triagemOutputLine(r.scaleId, r.score, r.interpretation)}`
    );
    lines.push(`\nTriagens clínicas:\n${triagemLines.join("\n")}`);
  }

  return lines.join("\n").trimEnd();
}
