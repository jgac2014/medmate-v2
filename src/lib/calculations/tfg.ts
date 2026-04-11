/**
 * TFG — Taxa de Filtração Glomerular
 * Fórmula: CKD-EPI 2021 sem raça (race-free)
 *
 * Referências:
 *   - Inker LA et al. N Engl J Med. 2021;385(19):1737-1749. (CKD-EPI 2021)
 *   - KDIGO 2024 Clinical Practice Guideline for CKD Evaluation and Management
 *   - Ministério da Saúde — Diretrizes Clínicas para o Cuidado ao paciente com DRC, 2022
 *
 * Nota: resultado expresso em mL/min/1,73m². Classificação KDIGO G1–G5.
 * UACR: Albuminúria A1–A3 (KDIGO 2024).
 * Não diagnosticar DRC por exame isolado — usar em contexto clínico.
 */

type Sex = "Masculino" | "Feminino";

export interface TfgResult {
  value: number;
  stage: string;
  uacrCategory?: string;
}

export type UacrCategory = "A1" | "A2" | "A3";

/**
 * Classifica UACR (mg/g) em A1/A2/A3 (KDIGO 2024).
 */
export function classifyUACR(uacr: number): UacrCategory {
  if (uacr < 30) return "A1";
  if (uacr <= 300) return "A2";
  return "A3";
}

/**
 * TFG CKD-EPI 2021 (race-free).
 * Válido para idade >= 18 anos.
 */
export function calculateTFG(
  creatinina: number,
  idade: number,
  sexo: Sex,
  uacrMgG?: number
): TfgResult | null {
  if (creatinina <= 0 || idade < 18) return null;

  const isFemale = sexo === "Feminino";
  const kappa = isFemale ? 0.7 : 0.9;
  const alpha = isFemale ? -0.241 : -0.302;
  const sexMultiplier = isFemale ? 1.012 : 1;

  const ratio = creatinina / kappa;
  const tfg =
    142 *
    Math.pow(Math.min(ratio, 1), alpha) *
    Math.pow(Math.max(ratio, 1), -1.2) *
    Math.pow(0.9938, idade) *
    sexMultiplier;

  const value = Math.round(tfg * 10) / 10;

  let stage: string;
  if (value >= 90) stage = "Faixa G1";
  else if (value >= 60) stage = "Faixa G2";
  else if (value >= 45) stage = "Faixa G3a";
  else if (value >= 30) stage = "Faixa G3b";
  else if (value >= 15) stage = "Faixa G4";
  else stage = "Faixa G5";

  const uacrCategory =
    uacrMgG !== undefined && uacrMgG > 0
      ? `Albuminúria ${classifyUACR(uacrMgG)}`
      : undefined;

  return { value, stage, uacrCategory };
}
