import type { ClinicalRule, PatientRuleInput } from "@/types";

/**
 * Regras de rastreamento baseadas em diretrizes brasileiras oficiais.
 * Fontes: MS, INCA, SBR, SBU — verificadas em 2025-03.
 */
export const CLINICAL_RULES: ClinicalRule[] = [
  {
    id: "mamografia",
    preventionLabel: "Mamografia em dia",
    description: "A cada 2 anos, 50–74 anos — MS/INCA 2025",
    condition: (p) =>
      p.gender === "Feminino" &&
      p.age !== null &&
      p.age >= 50 &&
      p.age <= 74,
  },
  {
    id: "papanicolau",
    preventionLabel: "Papanicolau em dia",
    description: "A cada 3 anos, 25–64 anos — INCA/MS (após 2 normais consecutivos)",
    condition: (p) =>
      p.gender === "Feminino" &&
      p.age !== null &&
      p.age >= 25 &&
      p.age <= 64,
  },
  {
    id: "colonoscopia",
    preventionLabel: "Colonoscopia / PSOF em dia",
    description: "A partir dos 45 anos — INCA/MS",
    condition: (p) => p.age !== null && p.age >= 45,
  },
  {
    id: "densitometria",
    preventionLabel: "Densitometria em dia",
    description: "Mulheres ≥ 65 anos, a cada 5 anos — MS/SBR",
    condition: (p) =>
      p.gender === "Feminino" &&
      p.age !== null &&
      p.age >= 65,
  },
  {
    id: "psa",
    preventionLabel: "PSA (disc. compartilhada)",
    description: "Sem rastreamento universal — decisão compartilhada — MS/INCA/SBU 2024",
    condition: (p) =>
      p.gender === "Masculino" &&
      p.age !== null &&
      p.age >= 50 &&
      p.age <= 70,
  },
];

/** Retorna as regras aplicáveis que ainda não estão marcadas em preventions. */
export function getSuggestedPreventions(patient: PatientRuleInput): ClinicalRule[] {
  return CLINICAL_RULES.filter(
    (rule) =>
      rule.condition(patient) && !patient.preventions.includes(rule.preventionLabel)
  );
}

/** Converte a string de idade "35 anos" → 35, ou null se não parsável. */
export function parseAge(ageStr: string): number | null {
  const match = ageStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}
