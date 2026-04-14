import type { Vitals, Calculations } from "@/types";
import { PRIMARY_EXAM_CARDS, ADDITIONAL_EXAM_CARDS } from "@/lib/constants";

/** Mapa key → label construído a partir de todos os cards de exames */
const LAB_LABEL_MAP: Record<string, string> = {};
for (const card of [...PRIMARY_EXAM_CARDS, ...ADDITIONAL_EXAM_CARDS]) {
  const allFields = [...card.primaryFields, ...(card.secondaryFields ?? [])];
  for (const field of allFields) {
    if (!("auto" in field) || !field.auto) {
      const unitSuffix = field.unit ? ` (${field.unit})` : "";
      LAB_LABEL_MAP[field.key] = `${field.label}${unitSuffix}`;
    }
  }
}

/**
 * Gera o texto formatado para o campo O do SOAP a partir dos dados objetivos.
 * Apenas campos com valor preenchido são incluídos.
 */
export function formatObjectiveText(
  vitals: Vitals,
  labs: Record<string, string>,
  calculations: Calculations
): string {
  const lines: string[] = [];

  // Sinais vitais
  const vitalParts: string[] = [];
  if (vitals.pas && vitals.pad)
    vitalParts.push(`PA: ${vitals.pas}/${vitals.pad} mmHg`);
  if (vitals.fc) vitalParts.push(`FC: ${vitals.fc} bpm`);
  if (vitals.spo2) vitalParts.push(`SpO2: ${vitals.spo2}%`);
  if (vitals.temp) vitalParts.push(`Temp: ${vitals.temp}°C`);
  if (vitalParts.length > 0) lines.push(vitalParts.join(" | "));

  // Antropometria
  const anthropoParts: string[] = [];
  if (vitals.peso) anthropoParts.push(`Peso: ${vitals.peso} kg`);
  if (vitals.altura) anthropoParts.push(`Altura: ${vitals.altura} m`);
  if (calculations.imc && !Number.isNaN(calculations.imc.value))
    anthropoParts.push(
      `IMC: ${calculations.imc.value.toFixed(1)} kg/m² (${calculations.imc.classification})`
    );
  if (vitals.ca_abd) anthropoParts.push(`CA: ${vitals.ca_abd} cm`);
  if (anthropoParts.length > 0) lines.push(anthropoParts.join(" | "));

  // Exames laboratoriais (apenas preenchidos, excluindo calculados)
  const filledLabs = Object.entries(labs)
    .filter(([key, value]) => value.trim() !== "" && key !== "tfg")
    .map(([key, value]) => {
      const label = LAB_LABEL_MAP[key] ?? key;
      return `${label}: ${value}`;
    });
  if (filledLabs.length > 0) lines.push(filledLabs.join(" | "));

  return lines.join("\n");
}
