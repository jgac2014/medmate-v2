/**
 * IMC — Índice de Massa Corporal
 * Referência: OMS (WHO Expert Committee, 1995; WHO Obesity Report, 2000)
 * Fórmula: peso(kg) / altura(m)²
 */

interface ImcResult {
  value: number;
  classification: string;
}

export function calculateIMC(pesoKg: number, alturaCm: number): ImcResult | null {
  if (pesoKg <= 0 || alturaCm <= 0) return null;

  const alturaM = alturaCm / 100;
  const value = pesoKg / (alturaM * alturaM);

  let classification: string;
  if (value < 18.5) classification = "Baixo peso";
  else if (value < 25) classification = "Eutrófico";
  else if (value < 30) classification = "Sobrepeso";
  else if (value < 35) classification = "Obesidade I";
  else if (value < 40) classification = "Obesidade II";
  else classification = "Obesidade III";

  return { value: Math.round(value * 10) / 10, classification };
}
