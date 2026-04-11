/**
 * FIB-4 — Índice de Fibrose Hepática
 *
 * Referências:
 *   - Sterling RK et al. Hepatology 2006;43:1317-1325 (fórmula original)
 *   - EASL Clinical Practice Guidelines 2023 (pontos de corte)
 *   - Ministério da Saúde — Nota Técnica DHGNA 2022
 *
 * FIB-4 = (Idade × AST) / (Plaquetas_mil × √ALT)
 *
 * Pontos de corte por faixa etária (EASL 2023):
 *   Idade 35–65: Baixo risco < 1.3 | Indeterminado 1.3–2.67 | Alto risco > 2.67
 *   Idade > 65:  Baixo risco < 2.0 | Indeterminado 2.0–2.67 | Alto risco > 2.67
 *   Idade < 35:  Baixa validade do índice — mostrar valor sem classificar
 *
 * Nota: estratificação de risco de fibrose — não diagnóstico.
 * Interpretar com cautela em doença hepática aguda.
 */

export interface Fib4Result {
  value: number;
  risk: string;
  lowValidity: boolean;
}

export function calculateFIB4(
  idade: number,
  ast: number,
  alt: number,
  plaquetasMil: number
): Fib4Result | null {
  if (idade <= 0 || ast <= 0 || alt <= 0 || plaquetasMil <= 0) return null;

  const raw = (idade * ast) / (plaquetasMil * Math.sqrt(alt));
  const value = Math.round(raw * 100) / 100;

  if (idade < 35) {
    return { value, risk: "Baixa validade nesta faixa etária", lowValidity: true };
  }

  const lowThreshold = idade > 65 ? 2.0 : 1.3;
  let risk: string;
  if (value < lowThreshold) risk = "Baixo risco";
  else if (value <= 2.67) risk = "Risco indeterminado";
  else risk = "Alto risco";

  return { value, risk, lowValidity: false };
}
