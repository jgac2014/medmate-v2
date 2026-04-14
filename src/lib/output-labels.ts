/**
 * Utilitário de formatação de labels para outputs clínicos.
 *
 * Regras de separação PREVENÇÕES vs TRIAGENS:
 * - TRIAGENS (seção separada no output): IVCF-20, PHQ-9, GAD-7, AUDIT-C, Mini-Cog, Edmonton
 *   → Items de "Prevenções" que são escalas (Rastreio depressão, IVCF-20) VÃO para TRIAGENS,
 *     não para a seção PREVENÇÕES — evitam duplicação conceitual
 * - PREVENÇÕES: tudo que é prevenção factual (mamografia, colo útero, dT, vacinas em dia,
 *   testagens opportunísticas quando feitas — não escalas)
 * - PSA: filtrado de todos os outputs
 * - Contextuais sem escala: densitometria — não entra no output PREVENÇÕES
 *
 * PSA é filtrado de todos os outputs — fora do escopo preventivo padrão SUS/INCA.
 */

/** Padrões de itens PSA — nunca entram no output. */
const PSA_PATTERNS = [/psa\b/i, /antígeno prostático/i];

/**
 * Itens de PREVENTIONS que correspondem a escalas de triagem.
 * Nunca vão para a seção PREVENÇÕES do output — vão para TRIAGENS quando aplicados.
 * Os padrões são normalizados (NFD + remoção de acentos) na comparação.
 */
const TRIAGE_ITEMS = [
  "ivcf-20",
  "ivcf20",
  "phq-2",
  "phq2",
  "phq-9",
  "phq9",
  "depressao",
  "phq",
];

/** Normaliza uma string para comparação (NFD + stripping de acentos). */
function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Itens contextuais que NÃO devem entrar na seção PREVENÇÕES do output.
 * São: (a) não são prevenção factual padrão, (b) têm seção própria (escalas), ou (c) são densitometria
 */
const CONTEXTUAL_OUTPUT_EXCLUDE = [
  "densitometria",
  "avaliação visual",
  "avaliação auditiva",
  "avaliação geriátrica",
];

/** Verifica se um label é PSA. */
export function isPSA(label: string): boolean {
  return PSA_PATTERNS.some((p) => p.test(label));
}

/**
 * Verifica se um label de prevenção corresponde a uma escala de triagem.
 * Estes itens vão para a seção TRIAGENS quando aplicados, não para PREVENÇÕES.
 */
export function isTriageItem(label: string): boolean {
  const normalized = normalize(label);
  return TRIAGE_ITEMS.some((t) => normalized.includes(t));
}

/**
 * Verifica se um label de prevenção é contextual puro e deve ser
 * excluído da seção PREVENÇÕES do output.
 */
export function isContextualExclude(label: string): boolean {
  const normalized = label.toLowerCase();
  return CONTEXTUAL_OUTPUT_EXCLUDE.some((t) => normalized.includes(t));
}

/**
 * Remove itens de PREVENÇÕES que pertencem semanticamente a TRIAGENS ou são contextuais.
 * Retorna só o que é prevenção factual para aparecer na seção PREVENÇÕES do output.
 */
export function preventionOutputLabels(labels: string[]): string[] {
  return labels
    .filter((l) => !isPSA(l))
    .filter((l) => !isTriageItem(l))
    .filter((l) => !isContextualExclude(l));
}

/**
 * Comprime rótulo de prevenção para versão curta de output.
 * Nunca retorna strings para: PSA, itens de triagem, densitometria.
 *
 * Regra de "em dia" vs "verificado":
 * - Prevenção factual padrão (mamografia, colo útero, dT, vacinas) → mantém "em dia"
 * - Testagem opportunística feita (HIV, HepC, Sífilis, glicemia, perfil lipídico)
 *   → troca para "verificado" (não soa como rastreamento universal)
 */
export function preventionShortLabel(label: string): string {
  if (isPSA(label)) return "";
  if (isTriageItem(label)) return "";     // vai para TRIAGENS, não PREVENÇÕES
  if (isContextualExclude(label)) return ""; // densitometria etc. não entra no output

  const normalized = label.toLowerCase();

  // Testagens opportunísticas feitas → "verificado"
  const opportunistic = [
    "testagem hiv",
    "testagem hepatite c",
    "sífilis",
    "rastreio glicêmico",
    "perfil lipídico",
  ];

  const isOportunistic = opportunistic.some((t) => normalized.includes(t));

  // Remove " espaço+reforço+espaço " — substitui por um espaço.
  // dT: "dT: espaço+reforço+espaço ém dia" → "dT:   ém dia" (3 spaces) → "dT: ém dia"
  // (o ": " final do "dT: " vem do original "dT:" + replacement space)
  const noReforco = label
    .replace(/\s+reforço\s+/i, " ")  // remove " espaço+reforço+espaço "
    .replace(/\s+/g, " ")             // normaliza TODOS os espaços
    .replace(/\s{2,}/g, " ")         // reduz 2+ consecutivos a 1
    .trim();

  // Special case: dT label → remove trailing ": " from noReforco result
  // "dT: ém dia" → "dT ém dia". Sífilis ends with "ém dia" (not ": "), safe.
  const dTclean = /reforço/i.test(label) && noReforco.endsWith(": ")
    ? noReforco.slice(0, -1).trimEnd()
    : noReforco;

  const compressed = dTclean
    .replace(/\s*\([^)]*\)\s*/g, " ")   // (50-69a, a cada 2 anos)
    .replace(/\s*\[[^\]]*\]\s*/g, " ")  // [texto]
    .replace(/\s*—.*$/g, "")             // — conforme oferta local
    .replace(/:\s*considerar.*$/i, "")  // : considerar
    .replace(/:\s*avaliar.*$/i, " em dia")
    .replace(/:\s*reforço\s*/i, " ")    // fallback "reforço" sem acento
    .replace(/:\s*$/, "")              // remove ":" solto à direita
    .replace(/\s+/g, " ")
    .trim();

  const endsWithEmDia = /em dia\s*$/i.test(compressed)
    ? "em dia"
    : /vacinado\s*$/i.test(compressed)
    ? "vacinado"
    : /verificado\s*$/i.test(compressed)
    ? "verificado"
    : null;

  if (endsWithEmDia === null) {
    return `${compressed} — ${isOportunistic ? "verificado" : "em dia"}`;
  }

  if (isOportunistic) {
    return compressed.replace(/em dia\s*$/i, "verificado");
  }

  return compressed;
}

/** Mapa de interpretação curta por scaleId. */
const INTERPRETATION_SHORT: Record<string, Record<string, string>> = {
  ivcf20: {
    "Idoso robusto / independente": "robusto",
    "Idoso vulnerável": "vulnerabilidade",
    "Idoso frágil / dependente": "fragilidade",
  },
  phq9: {
    "Mínimo": "sintomas ausentes",
    "Leve": "sintomas leves",
    "Moderado": "depressão moderada",
    "Moderadamente grave": "depressão mod.-grave",
    "Grave": "depressão grave",
  },
  gad7: {
    "Mínimo": "ansiedade mínima",
    "Leve": "ansiedade leve",
    "Moderado": "ansiedade moderada",
    "Grave": "ansiedade grave",
  },
  audit_c: {
    "Triagem negativa": "uso de baixo risco",
    "Triagem positiva — uso de risco": "uso de risco",
    "Triagem positiva — uso nocivo / provável dependência": "uso nocivo/provável dependência",
  },
  mini_cog: {
    "Rastreio positivo — possível comprometimento cognitivo": "possível déficit cognitivo",
    "Limítrofe — considerar avaliação complementar": "resultado limítrofe",
    "Rastreio negativo": "sem déficit cognitivo",
  },
  edmonton: {
    "Sem fragilidade": "sem fragilidade",
    "Vulnerável": "vulnerabilidade",
    "Fragilidade leve": "fragilidade leve",
    "Fragilidade moderada": "fragilidade moderada",
    "Fragilidade grave": "fragilidade grave",
  },
};

/**
 * Formata resultado de triagem para output curto e clínico.
 * Formato: "PHQ-9: 8 pts — depressão moderada"
 */
export function triagemOutputLine(
  scaleId: string,
  score: number,
  interpretation: string
): string {
  const scaleMap = INTERPRETATION_SHORT[scaleId];
  const shortInterp = scaleMap?.[interpretation] ?? interpretation;
  return `${scaleId.toUpperCase().replace(/_/g, "-")}: ${score} pts — ${shortInterp}`;
}
