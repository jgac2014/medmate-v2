/**
 * Cálculos Lipídicos
 *
 * Referências:
 *   - Friedewald WT, Levy RI, Fredrickson DS. Estimation of the concentration of
 *     low-density lipoprotein cholesterol in plasma, without use of the preparative
 *     ultracentrifuge. Clin Chem. 1972;18(6):499-502.
 *   - Grundy SM et al. 2018 AHA/ACC Guideline on the Management of Blood Cholesterol.
 *     Circulation. 2019;139(25):e1082-e1143.
 *     (Não-HDL como alvo terapêutico secundário — meta 30 mg/dL acima do alvo LDL)
 *
 * Limitações:
 *   - Friedewald: inválido quando TG ≥ 400 mg/dL (subestima LDL; usar método direto).
 *   - Não-HDL inclui VLDL, IDL, LDL e Lp(a) — não depende de jejum.
 */

interface LipidResult {
  value: number;
}

/**
 * LDL — Equação de Friedewald
 * LDL = CT − HDL − (TG / 5)
 * Válida apenas quando TG < 400 mg/dL.
 */
export function calculateLDL(ct: number, hdl: number, trig: number): LipidResult | null {
  if (ct <= 0 || hdl <= 0 || trig <= 0) return null;
  if (trig >= 400) return null;
  const value = Math.round((ct - hdl - trig / 5) * 10) / 10;
  if (value < 0) return null;
  return { value };
}

/**
 * Não-HDL = CT − HDL
 * Engloba todas as lipoproteínas aterogênicas (VLDL, IDL, LDL, Lp(a)).
 */
export function calculateNaoHDL(ct: number, hdl: number): LipidResult | null {
  if (ct <= 0 || hdl <= 0) return null;
  const value = Math.round((ct - hdl) * 10) / 10;
  if (value < 0) return null;
  return { value };
}
