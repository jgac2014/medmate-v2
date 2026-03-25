/**
 * FIB-4 — Índice de Fibrose Hepática
 * Referências:
 *   - Sterling RK et al. Hepatology 2006;43:1317-1325 (fórmula original)
 *   - EASL Clinical Practice Guidelines 2023 (pontos de corte)
 *   - Ministério da Saúde — Nota Técnica DHGNA 2022
 *
 * FIB-4 = (Idade × AST) / (Plaquetas_mil × √ALT)
 * <1.30 Baixo risco (F0-F2) | 1.30-2.67 Indeterminado | >2.67 Alto risco (F3-F4)
 */

interface Fib4Result {
  value: number;
  risk: string;
}

export function calculateFIB4(
  idade: number,
  ast: number,
  alt: number,
  plaquetasMil: number
): Fib4Result | null {
  if (idade <= 0 || ast <= 0 || alt <= 0 || plaquetasMil <= 0) return null;

  const value = (idade * ast) / (plaquetasMil * Math.sqrt(alt));
  const rounded = Math.round(value * 100) / 100;

  let risk: string;
  if (rounded < 1.3) risk = "Baixo risco (F0-F2)";
  else if (rounded <= 2.67) risk = "Indeterminado";
  else risk = "Alto risco (F3-F4)";

  return { value: rounded, risk };
}
