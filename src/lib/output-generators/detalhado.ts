import type { ConsultationState } from "@/types";
import { formatDateBR } from "@/lib/utils";
import { EXAM_CARDS } from "@/lib/constants";
import { preventionOutputLabels, preventionShortLabel, triagemOutputLine } from "@/lib/output-labels";

/**
 * Output detalhado — formato completo para存档/prontuário.
 * Menos verboso que um documento clínico acadêmico, mais estruturado que o resumido.
 * Sem contexto normativo nos labels de prevenção.
 */
export function generateDetalhadoOutput(state: ConsultationState): string {
  const lines: string[] = [];
  const { patient, vitals, problems, problemsOther, labs, labsDate, labsExtras, imaging, calculations, soap, history, prescription, requestedExams, patientInstructions } = state;

  const date = formatDateBR(patient.consultationDate) || formatDateBR(new Date().toISOString().split("T")[0]);
  lines.push(`PRONTUÁRIO — ${date}`);
  lines.push("─".repeat(48));

  // Identificação
  lines.push("\nIDENTIFICAÇÃO");
  if (patient.name) lines.push(`Paciente: ${patient.name}`);
  if (patient.age) lines.push(`Idade: ${patient.age}`);
  if (patient.gender) lines.push(`Sexo: ${patient.gender}`);
  if (patient.race) lines.push(`Raça/Cor: ${patient.race}`);

  // Antecedentes
  const antKeys: [keyof typeof history, string][] = [
    ["comorbidities", "Comorbidades"],
    ["medications", "Medicamentos em uso"],
    ["allergies", "Alergias"],
    ["personal", "Antecedentes pessoais"],
    ["family", "Antecedentes familiares"],
    ["habits", "Hábitos de vida"],
  ];
  const hasHistory = antKeys.some(([k]) => history[k].trim());
  if (hasHistory) {
    lines.push("\nANTECEDENTES");
    antKeys.forEach(([k, label]) => {
      if (history[k].trim()) lines.push(`${label}: ${history[k]}`);
    });
  }

  // Problemas
  const allProblems = [
    ...problems,
    ...(problemsOther.trim() ? problemsOther.split(",").map((s) => s.trim()).filter(Boolean) : []),
  ];
  if (allProblems.length > 0) {
    lines.push("\nPROBLEMAS ATIVOS");
    allProblems.forEach((p) => lines.push(`• ${p}`));
  }

  // Prevenções — só prevenção factual, rótulos curtos
  if (state.preventions.length > 0) {
    const shortPreventions = preventionOutputLabels(state.preventions)
      .map(preventionShortLabel)
      .filter(Boolean);
    if (shortPreventions.length > 0) {
      lines.push("\nPREVENÇÕES");
      shortPreventions.forEach((p) => lines.push(`• ${p}`));
    }
  }

  // Sinais vitais
  const hasVitals = Object.values(vitals).some(Boolean);
  if (hasVitals) {
    lines.push("\nSINAIS VITAIS");
    if (vitals.pas && vitals.pad) lines.push(`PA: ${vitals.pas}/${vitals.pad} mmHg`);
    if (vitals.fc) lines.push(`FC: ${vitals.fc} bpm`);
    if (vitals.spo2) lines.push(`SpO2: ${vitals.spo2}%`);
    if (vitals.temp) lines.push(`Temp: ${vitals.temp} °C`);
    if (vitals.peso) lines.push(`Peso: ${vitals.peso} kg`);
    if (vitals.altura) lines.push(`Altura: ${vitals.altura} cm`);
    if (vitals.imc) lines.push(`IMC: ${vitals.imc} kg/m²`);
    if (vitals.ca_abd) lines.push(`CA abdominal: ${vitals.ca_abd} cm`);
  }

  // Cálculos
  const calcLines: string[] = [];
  if (calculations.tfg && Number.isFinite(calculations.tfg.value))
    calcLines.push(`TFG (CKD-EPI): ${calculations.tfg.value.toFixed(1)} mL/min — ${calculations.tfg.stage}`);
  if (calculations.fib4 && Number.isFinite(calculations.fib4.value))
    calcLines.push(`FIB-4: ${calculations.fib4.value.toFixed(2)} — ${calculations.fib4.risk}`);
  if (calculations.rcv && Number.isFinite(calculations.rcv.value))
    calcLines.push(`RCV (Framingham): ${calculations.rcv.value.toFixed(0)}% — ${calculations.rcv.risk}`);
  if (calculations.ldl && Number.isFinite(calculations.ldl.value))
    calcLines.push(`LDL-c (Friedewald): ${calculations.ldl.value.toFixed(0)} mg/dL`);
  if (calculations.naoHdl && Number.isFinite(calculations.naoHdl.value))
    calcLines.push(`Não-HDL-c: ${calculations.naoHdl.value.toFixed(0)} mg/dL`);
  if (calcLines.length > 0) {
    lines.push("\nCÁLCULOS");
    calcLines.forEach((c) => lines.push(c));
  }

  // Bioquímica
  const dateLab = formatDateBR(labsDate);
  const labLines: string[] = [];
  for (const card of EXAM_CARDS) {
    const values = card.fields
      .filter((f) => !("auto" in f && f.auto) && labs[f.key])
      .map((f) => `${f.label}: ${labs[f.key]}`)
      .join(" | ");
    if (values) labLines.push(`${card.title}: ${values}`);
  }
  if (labLines.length > 0) {
    lines.push(`\nBIOQUÍMICA${dateLab ? ` (${dateLab})` : ""}`);
    labLines.forEach((l) => lines.push(l));
  }

  if (labsExtras?.trim()) {
    lines.push("\nOUTROS EXAMES");
    labsExtras.trim().split("\n").filter(Boolean).forEach((l) => lines.push(l));
  }

  // Imagens / Exames estruturados
  const validItems = imaging.items.filter(
    (item) => item.name.trim() || item.result.trim() || item.notes.trim()
  );
  const hasImaging = validItems.length > 0 || imaging.entries.trim();
  if (hasImaging) {
    const byDate: Record<string, typeof validItems> = {};
    for (const item of validItems) {
      const d = item.examDate || imaging.date;
      if (!byDate[d]) byDate[d] = [];
      byDate[d].push(item);
    }
    for (const [dateKey, items] of Object.entries(byDate)) {
      const formattedDate = formatDateBR(dateKey);
      lines.push(`\nEXAMES E IMAGENS${formattedDate ? ` (${formattedDate})` : ""}`);
      for (const item of items) {
        const parts = [item.name.trim(), item.result.trim()].filter(Boolean).join(": ");
        const suffix = item.notes.trim() ? ` — ${item.notes.trim()}` : "";
        if (parts) lines.push(`• ${parts}${suffix}`);
      }
    }
    if (imaging.entries.trim()) {
      const imgDate = formatDateBR(imaging.date);
      lines.push(`\nEXAMES E IMAGENS${imgDate ? ` (${imgDate})` : ""}`);
      imaging.entries.split("\n").filter(Boolean).forEach((e) => lines.push(`• ${e.trim()}`));
    }
  }

  // SOAP
  const hasSoap = soap.subjective || soap.objective || soap.assessment || soap.plan;
  if (hasSoap) {
    lines.push("\nDOENÇA ATUAL (SOAP)");
    if (soap.subjective) lines.push(`S — ${soap.subjective}`);
    if (soap.objective) lines.push(`O — ${soap.objective}`);
    if (soap.assessment) lines.push(`A — ${soap.assessment}`);
    if (soap.plan) lines.push(`P — ${soap.plan}`);
  }

  // Saídas
  if (prescription) {
    lines.push("\nPRESCRIÇÃO");
    lines.push(prescription);
  }
  if (requestedExams) {
    lines.push("\nEXAMES SOLICITADOS");
    lines.push(requestedExams);
  }
  if (patientInstructions) {
    lines.push("\nORIENTAÇÕES AO PACIENTE");
    lines.push(patientInstructions);
  }

  // Triagens — formato curto
  const triagemEntries = Object.values(state.triagens ?? {});
  if (triagemEntries.length > 0) {
    const nucleoSUS = triagemEntries.filter(
      (r) => r.scaleId === "ivcf20" || r.scaleId === "phq9"
    );
    const complementares = triagemEntries.filter(
      (r) => r.scaleId !== "ivcf20" && r.scaleId !== "phq9"
    );

    lines.push("\nTRIAGENS CLÍNICAS");
    nucleoSUS.forEach((r) => lines.push(`• ${triagemOutputLine(r.scaleId, r.score, r.interpretation)}`));
    if (complementares.length > 0) {
      lines.push("Complementares:");
      complementares.forEach((r) => lines.push(`  • ${triagemOutputLine(r.scaleId, r.score, r.interpretation)}`));
    }
  }

  return lines.join("\n").trimEnd();
}
