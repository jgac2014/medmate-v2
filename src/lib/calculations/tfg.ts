/**
 * TFG — Taxa de Filtração Glomerular
 * Fórmula: CKD-EPI 2021 sem raça (race-free)
 * Referências:
 *   - Inker LA et al. N Engl J Med. 2021;385(19):1737-1749. (CKD-EPI 2021)
 *   - KDIGO 2024 Clinical Practice Guideline for CKD Evaluation and Management
 *   - Ministério da Saúde — Diretrizes Clínicas para o Cuidado ao paciente com DRC, 2022
 *
 * κ = 0.7 (F) ou 0.9 (M)
 * α = -0.241 (F) ou -0.302 (M)
 * Se Cr/κ ≤ 1: TFG = 142 × (Cr/κ)^α × 0.9938^idade × (1.012 se F)
 * Se Cr/κ > 1: TFG = 142 × (Cr/κ)^-1.200 × 0.9938^idade × (1.012 se F)
 */

type Sex = "Masculino" | "Feminino";

interface TfgResult {
  value: number;
  stage: string;
}

export function calculateTFG(creatinina: number, idade: number, sexo: Sex): TfgResult | null {
  if (creatinina <= 0 || idade <= 0) return null;

  const isFemale = sexo === "Feminino";
  const kappa = isFemale ? 0.7 : 0.9;
  const alpha = isFemale ? -0.241 : -0.302;
  const sexMultiplier = isFemale ? 1.012 : 1;

  const ratio = creatinina / kappa;
  let tfg: number;

  if (ratio <= 1) {
    tfg = 142 * Math.pow(ratio, alpha) * Math.pow(0.9938, idade) * sexMultiplier;
  } else {
    tfg = 142 * Math.pow(ratio, -1.200) * Math.pow(0.9938, idade) * sexMultiplier;
  }

  const value = Math.round(tfg * 10) / 10;

  let stage: string;
  if (value >= 90) stage = "G1";
  else if (value >= 60) stage = "G2";
  else if (value >= 45) stage = "G3a";
  else if (value >= 30) stage = "G3b";
  else if (value >= 15) stage = "G4";
  else stage = "G5";

  return { value, stage };
}
