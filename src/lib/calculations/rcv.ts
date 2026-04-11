/**
 * RCV — Risco Cardiovascular (ERG / Framingham Laboratorial)
 *
 * Referências:
 *   - Wilson PW et al. Circulation 1998;97(18):1837-1847 (modelo original)
 *   - Diretriz Brasileira de Prevenção Cardiovascular — SBC 2022
 *   - Ministério da Saúde — Caderno DCNT 2022
 *
 * Modelo logarítmico com coeficientes por sexo.
 * Válido para idade 30–74 anos. Fora desta faixa, retornar outOfRange: true.
 *
 * Classificação por sexo (SBC 2022):
 *   Masculino:  Baixo < 5% | Intermediário 5–19.9% | Alto >= 20%
 *   Feminino:   Baixo < 5% | Intermediário 5–9.9%  | Alto >= 10%
 *
 * Nota: em prevenção secundária o escore não determina o risco final isoladamente.
 * Rotular como "Risco pelo escore".
 */

type Sex = "Masculino" | "Feminino";

export interface RcvResult {
  value: number;
  risk: string;
  outOfRange: boolean;
}

export function calculateRCV(
  idade: number,
  pas: number,
  ct: number,
  hdl: number,
  sexo: Sex,
  tabagismo: boolean,
  dm: boolean,
  hasTratada: boolean
): RcvResult | null {
  if (pas <= 0 || ct <= 0 || hdl <= 0) return null;

  // Fora da faixa etária do escore
  if (idade < 30 || idade > 74) {
    return { value: 0, risk: "Fora da faixa etária do escore", outOfRange: true };
  }

  let s: number;
  let baseline: number;

  if (sexo === "Masculino") {
    s =
      3.06117 * Math.log(idade) +
      1.1237 * Math.log(ct) -
      0.93263 * Math.log(hdl) +
      (hasTratada ? 1.99881 : 1.93303) * Math.log(pas) +
      (tabagismo ? 0.65451 : 0) +
      (dm ? 0.57367 : 0) -
      23.9802;
    baseline = 0.9402;
  } else {
    s =
      2.32888 * Math.log(idade) +
      1.20904 * Math.log(ct) -
      0.70833 * Math.log(hdl) +
      (hasTratada ? 2.82263 : 2.76157) * Math.log(pas) +
      (tabagismo ? 0.52873 : 0) +
      (dm ? 0.69154 : 0) -
      26.1931;
    baseline = 0.9669;
  }

  const score = 1 - Math.pow(baseline, Math.exp(s));
  const percentage = Math.round(score * 1000) / 10;

  let risk: string;
  if (sexo === "Masculino") {
    if (percentage < 5) risk = "Baixo risco";
    else if (percentage < 20) risk = "Risco intermediário";
    else risk = "Alto risco";
  } else {
    if (percentage < 5) risk = "Baixo risco";
    else if (percentage < 10) risk = "Risco intermediário";
    else risk = "Alto risco";
  }

  return { value: percentage, risk, outOfRange: false };
}
