import type { ClinicalRule, PatientRuleInput } from "@/types";

/**
 * Regras de rastreamento — hierarquia de fontes:
 * 1. Ministério da Saúde / INCA / Portarias / eSUS APS / Linhas de Cuidado
 * 2. Calendário Nacional/Técnico de Vacinação vigente
 * 3. Caderno de Atenção Primária nº 29 — apenas fallback histórico
 *    quando não houver regra mais nova e mais específica
 *
 * NÃO usar regras hardcoded sem fonte ministerial/local específica.
 * HIV, sífilis, hepatite C: testagem opportunística — não rastrear por idade fixa universal.
 *
 * Referências verificadas 2025-03.
 * Para atualizar regras: verificar portarias/inca.gov.br antes de alterar.
 */
export const CLINICAL_RULES: ClinicalRule[] = [
  // ── Padrão APS/SUS ─────────────────────────────────────────────────────────
  {
    id: "mamografia",
    preventionLabel: "Mamografia em dia (50–69a, a cada 2 anos)",
    // FUENTE: INCA — Controle do Câncer de Mama (2023): rastreamento populacional
    // mulheres 50–69 a cada 2 anos. Não universal para 70+.
    // For fonte: https://www.inca.gov.br (faixa etária vigente)
    description: "Rastreamento INCA — mulheres 50–69a, a cada 2 anos",
    condition: (p) =>
      p.gender === "Feminino" &&
      p.age !== null &&
      p.age >= 50 &&
      p.age <= 69,
  },
  {
    id: "colo-utero",
    preventionLabel: "Rastreamento do colo do útero em dia (DNA-HPV ou citologia — conforme oferta local)",
    // FUENTE: INCA — Rastreamento do Câncer do Colo do Útero.
    // População-alvo: mulheres/pessoas com colo do útero, 25–64a, com história sexual.
    // Método: citologia a cada 3 anos (2 normais consecutivos) ou DNA-HPV a cada 5 anos.
    // DNA-HPV como método preferencial quando disponível na unidade (PNI/MS).
    description: "Rastreamento INCA — 25–64a, história sexual; DNA-HPV (preferencial) ou citologia",
    condition: (p) =>
      p.gender === "Feminino" &&
      p.age !== null &&
      p.age >= 25 &&
      p.age <= 64,
  },
  {
    id: "vacina-dt",
    preventionLabel: "dT reforço em dia (a cada 10 anos, >=7a)",
    // FUENTE: PNI/MS — Calendário Nacional de Vacinação.
    // dT (dupla bacteriana adulto): rotina para >=7a com esquema completo (3 doses primárias + reforços).
    // Reforço a cada 10 anos. dTpa tem indicações específicas (gestantes, profissionais de saúde, ferimentos graves).
    description: "PNI/MS — reforço dT a cada 10 anos, >=7a, após esquema primário completo",
    condition: (p) => p.age !== null && p.age >= 7,
  },

  // ── Contextual por risco / oportunidade ────────────────────────────────────
  {
    id: "hiv-testagem",
    preventionLabel: "Testagem HIV em dia (conforme risco / oportunidade)",
    // FUENTE: MS PCDT HIV 2024 / PN DST/AIDS.
    // Testagem opportunística — não universal por idade.
    // Recomendada: ≥15a ao menos uma vez; populações-chave em re-testagem periódica.
    // Não hardcodar re-testagem periódica sem estratégia local vigente.
    description: "MS PCDT HIV 2024 — opportunística; ≥15a ao menos uma vez; populações-chave em re-testagem",
    condition: (p) => p.age !== null && p.age >= 15,
  },
  {
    id: "hepatite-c",
    preventionLabel: "Testagem hepatite C em dia (>=40a ou fatores de risco)",
    // FUENTE: MS — Nota Técnica Hepatite C / Guia Eliminação Hepatites Virais.
    // Faixa etária de risco: >=40a (coorte de maior prevalência).
    // Antes de fatores de risco: profissionais de saúde, DPRL, IST/DST, tatuagem,
    // usuário de drogas injetáveis, hemodiálise, hepatopatia crônica.
    // >=40a foi estabelecido como referência de rastreamento por oportunidade no MS.
    description: "MS NT Hepatite C — opportunística; >=40a ou fatores de risco específicos",
    condition: (p) => p.age !== null && p.age >= 40,
  },
  {
    id: "hepatite-b-vac",
    preventionLabel: "Vacinação hepatite B em dia",
    // FUENTE: PNI/MS — Calendário Nacional de Vacinação.
    // Anti-HBs universal NÃO é rastreamento PNI. A estratégia é VACINAÇÃO em dia.
    // Esquema: 3 doses (0, 1, 6 meses). Duas situações: (a) vacinado corretamente; (b) suscetível
    // identificado por anti-HBs <10 mUI/mL → referenciar para vacinação.
    // Regra: >=20a não vacinado ou com esquema incompleto.
    description: "PNI/MS — vacinação hepatite B em dia (3 doses); anti-HBs <10 = suscetível → vacinar",
    condition: (p) => p.age !== null && p.age >= 20,
  },
  {
    id: "sifilis-testagem",
    preventionLabel: "Sífilis: testagem em dia (conforme risco / oportunidade)",
    // FUENTE: MS — Estratégia de testagem opportunística para sífilis.
    // Não universal por idade. Aplicável: gestação, pré-nupcial, IST/DST, populações-chave.
    // Teste rápido como ponto de cuidado. Re-testagem conforme contexto de risco.
    description: "MS — opportunística; contextos: gestação, pré-nupcial, IST, populações-chave",
    condition: (p) => p.age !== null && p.age >= 15,
  },
  {
    id: "glicemia-rastreio",
    preventionLabel: "Rastreio glicêmico em dia (GJ ou HbA1c — considerar fatores de risco)",
    // FUENTE: MS PCDT DM2 2024.
    // PCDT DM2 NÃO estabelece >=45 como regra fixa universal.
    // Rastreamento contextual: sobrepeso/obesidade, história familiar de DM2, SOP,
    // nascidos de recém-nascido macrosso (>4kg), HAS, DHGNA, >=45a.
    // GJ jejunum ou HbA1c como método — TOTG não é rastreamento populacional.
    description: "MS PCDT DM2 2024 — contextual por fatores de risco metabólico/pressórico",
    condition: (p) => p.age !== null && p.age >= 45,
  },
  {
    id: "perfil-lipidico",
    preventionLabel: "Perfil lipídico em dia",
    // FUENTE: V Diretriz Brasileira de Dislipidemias e Prevenção da Aterosclerose — SBC 2017;
    // MS PCDT Dislipidemia (vigente).
    // Screen: homens >=35a, mulheres >=45a (sem fatores de risco).
    // Com fatores de risco (HAS, DM2, tabagismo, DHGNA, história familiar prematura):
    // iniciar rastreamento mais cedo — verificar lipídios a cada 1–3 anos conforme risco.
    // Correção bug: a redundância "(p.gender === 'Masculino' ? p.age >= 35 : p.age >= 45)"
    // foi eliminada — agora lógica correta: screen homens >=35, mulheres >=45.
    description: "SBC/MS — homens >=35a, mulheres >=45a; mais cedo com fatores de risco (HAS, DM2, DHGNA)",
    condition: (p) =>
      p.age !== null &&
      (p.gender === "Masculino" ? p.age >= 35 : p.age >= 45),
  },
  {
    id: "influenza",
    preventionLabel: "Influenza: vacinado (conforme grupo prioritário sazonal)",
    // FUENTE: PNI/MS — Campanha de Influenza Sazonal.
    // Não rastreamento universal. Grupos prioritários: >=60a, gestantes, puérperas,
    // crianças <6a, profissionais de saúde, comorbidades, etc.
    // Sazonal — campanhas anuais.
    description: "PNI/MS — vaccinação sazonal influenza; grupos prioritários conforme campanha vigente",
    condition: (p) => p.age !== null && p.age >= 60,
  },
  {
    id: "covid19",
    preventionLabel: "COVID-19: vacinado (conforme estratégia vacinal vigente)",
    // FUENTE: PNI/MS — Estratégia de Vacinação COVID-19.
    // Sem rastreamento populacional clássico. Manter como contextual vaccination compliance.
    // Estratégia vigente: idosos >=60+, imunossuprimidos, gestantes, profissionais de saúde.
    // Conforme calendário PNI corrente — regra pode mudar com novas portarias.
    description: "PNI/MS — vaccinação COVID-19 conforme estratégia vacinal vigente (portarias PNI)",
    condition: (p) => p.age !== null && p.age >= 60,
  },
  {
    id: "hpv-vac",
    preventionLabel: "HPV: vacinado (9–14 anos ou populações específicas PNI)",
    // FUENTE: PNI/MS — Calendário Nacional de Vacinação / INCA.
    // Grupo-alvo padrão: meninas e meninos 9–14a (2 doses).
    // Populações específicas: imunossuprimidos até 26a, DPRL, PVHIV.
    // Fora do grupo-alvo: contextual — verificar compliance vacinal e referenciar.
    description: "PNI/MS — 9–14a (2 doses); imunossuprimidos/DPRL/PVHIV até 26a",
    condition: (p) => p.age !== null && p.age >= 9 && p.age <= 26,
  },

  // ── Decisão compartilhada ───────────────────────────────────────────────────
  // PSA removido do checklist: fora do escopo preventivo padrão SUS/INCA
  // para esta versão do produto. Decisão compartilhada não entra no output.
  // Mantido apenas como referência para possível expansão futura.
  {
    id: "densitometria",
    preventionLabel: "Densitometria óssea: considerar (>=65a mulheres ou risco)",
    // FUENTE: SBR (Sociedade Brasileira de Reumatologia) / NOF (National Osteoporosis Foundation).
    // MS/SUS não tem rastreamento universal de osteoporose como política pública fechada.
    // Rastreamento por oportunidade: mulheres >=65a; homens >=70a;
    // antes: menopausa precoce (<45a), uso de corticoide, fratura prévia, baixo peso.
    // Manter como contextual/decisão — não padrão SUS.
    description: "SBR/National Osteoporosis Foundation — contextual; >=65a mulheres ou fatores de risco",
    condition: (p) =>
      p.gender === "Feminino" &&
      p.age !== null &&
      p.age >= 65,
  },

  // ── Triagem principal SUS (sugerido via triagens-section) ───────────────────
  {
    id: "depressao-phq2",
    preventionLabel: "Rastreio de depressão em dia (PHQ-2/PHQ-9 — >=18a)",
    // FUENTE: MS — Linha de Cuidado: Depressão / Caderno APS.
    // PHQ-2 como triagem inicial — positivo (>=3) → PHQ-9 completo.
    // Flujo: PHQ-2 >=3 → aplicação PHQ-9 → classificação e conduta.
    // Não registrar "PHQ-9 em dia" como prevenção — é escala aplicada na seção triagens.
    description: "MS Linha de Cuidado Depressão — PHQ-2 >=18a; PHQ-2>=3 → PHQ-9",
    condition: (p) => p.age !== null && p.age >= 18,
  },
  {
    id: "ivcf20",
    preventionLabel: "IVCF-20: avaliar (>60a — avaliação multidimensional)",
    // FUENTE: MS — Protocolo de Envelhecimento Saudável / Caderneta de Saúde da Pessoa Idosa.
    // Instrumento OFICIAL do MS para avaliação multidimensional de idosos >=60a na APS.
    // 20 itens em 8 domínios funcionais — avaliação mais abrangente que Mini-Cog/Edmonton.
    // Deve ser a triagem geriátrica principal no fluxo SUS.
    description: "MS Protocolo Envelhecimento Saudável — >=60a; instrumento oficial MS para APS",
    condition: (p) => p.age !== null && p.age > 60,
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
