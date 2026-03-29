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
  // --- Regras para PREVENTIONS existentes sem regra ---
  {
    id: "hiv-testagem",
    preventionLabel: "HIV (testado)",
    description: "Ao menos uma vez na vida, ≥ 15 anos — MS PCDT HIV 2024",
    condition: (p) => p.age !== null && p.age >= 15,
  },
  {
    id: "hepatite-c",
    preventionLabel: "Hepatite C (anti-HCV)",
    description: "Ao menos uma vez na vida, ≥ 20 anos — MS Guia Eliminação Hepatites 2025",
    condition: (p) => p.age !== null && p.age >= 20,
  },
  {
    id: "hepatite-b",
    preventionLabel: "Hepatite B (anti-HBs)",
    description: "Ao menos uma vez na vida, susceptíveis ≥ 20 anos — MS PCDT Hepatite B 2023",
    condition: (p) => p.age !== null && p.age >= 20,
  },
  // --- Novos rastreamentos MS expandidos ---
  {
    id: "glicemia-rastreio",
    preventionLabel: "Glicemia de jejum / TOTG",
    description: "A partir dos 45 anos — MS PCDT DM2 2024",
    condition: (p) => p.age !== null && p.age >= 45,
  },
  {
    id: "perfil-lipidico",
    preventionLabel: "Perfil lipídico",
    description: "Homens ≥ 35 anos, mulheres ≥ 45 anos — V Diretriz Brasileira de Dislipidemias SBC",
    condition: (p) =>
      p.age !== null &&
      (p.gender === "Masculino" ? p.age >= 35 : p.age >= 45),
  },
  {
    id: "sifilis-rastreio",
    preventionLabel: "Sífilis (VDRL/teste rápido)",
    description: "Ao menos uma vez na vida, ≥ 15 anos — MS 2024",
    condition: (p) => p.age !== null && p.age >= 15,
  },
  {
    id: "vacina-dt",
    preventionLabel: "dT / dTpa (vacinado)",
    description: "Reforço a cada 10 anos após 3 doses primárias, ≥ 18 anos — PNI/MS 2025",
    condition: (p) => p.age !== null && p.age >= 18,
  },
  {
    id: "depressao-rastreio",
    preventionLabel: "Rastreio depressão (PHQ-2)",
    description: "Ao menos uma vez, ≥ 18 anos — MS Linha de Cuidado Depressão (linhasdecuidado.saude.gov.br)",
    condition: (p) => p.age !== null && p.age >= 18,
  },
  {
    id: "avaliacao-visual-idoso",
    preventionLabel: "Avaliação visual (idoso)",
    description: "≥ 60 anos — MS Caderneta de Saúde da Pessoa Idosa 2018",
    condition: (p) => p.age !== null && p.age >= 60,
  },
  {
    id: "avaliacao-auditiva-idoso",
    preventionLabel: "Avaliação auditiva (idoso)",
    description: "≥ 60 anos — MS Caderneta de Saúde da Pessoa Idosa 2018",
    condition: (p) => p.age !== null && p.age >= 60,
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
