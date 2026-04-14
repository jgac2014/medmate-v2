/**
 * Definições das escalas de triagem clínica para APS
 *
 * Hierarquia de fontes: MS / INCA / Portarias / eSUS APS / Linhas de Cuidado
 *
 * Escalas implementadas:
 * - IVCF-20: avaliação multidimensional de idosos — NÚCLEO PRINCIPAL SUS (MS Protocolo Envelhecimento Saudável)
 * - PHQ-9: rastreio de depressão — NÚCLEO PRINCIPAL SUS (MS Linha de Cuidado Depressão)
 * - GAD-7: rastreio de ansiedade — COMPLEMENTAR ÚTIL (MS Linha de Cuidado Ansiedade)
 * - AUDIT-C: uso de álcool — COMPLEMENTAR ÚTIL (MS PNAN Álcool / WHO AUDIT)
 * - Mini-Cog: rastreio cognitivo — COMPLEMENTAR GERIÁTRICA PRESENCIAL (MS Caderno Saúde Pessoa Idosa)
 * - Edmonton Frailty Scale: fragilidade — COMPLEMENTAR GERIÁTRICA PRESENCIAL (MS Caderno Saúde Pessoa Idosa)
 *
 * IVCF-20 é o instrumento OFICIAL do MS para idosos >=60a na APS.
 * Deve aparecer como triagem geriátrica primária — antes de Mini-Cog/Edmonton.
 *
 * Escalas marcadas "nucleoSUS": prioritárias na UI e no fluxo eSUS.
 * Escalas marcadas "complementar": úteis como complemento ou quando há suspeita clínica.
 */

import type { ScaleDef } from "./types";

const OPTIONS_0_3 = [
  { label: "Nunca", value: 0 },
  { label: "Vários dias", value: 1 },
  { label: "Mais da metade dos dias", value: 2 },
  { label: "Quase todos os dias", value: 3 },
];

export const PHQ9: ScaleDef = {
  id: "phq9",
  name: "PHQ-9",
  shortName: "PHQ-9",
  description: "Rastreio de depressão — 9 itens",
  timeFrame: "Nas últimas 2 semanas, com que frequência você foi incomodado pelos seguintes problemas?",
  maxScore: 27,
  source: "Kroenke & Spitzer 2002 / MS Linha de Cuidado Depressão",
  sourceYear: 2002,
  questions: [
    { id: "q1", text: "Pouco interesse ou prazer em fazer as coisas", options: OPTIONS_0_3 },
    { id: "q2", text: "Se sentiu pra baixo, deprimido ou sem perspectiva", options: OPTIONS_0_3 },
    { id: "q3", text: "Dificuldade para adormecer ou manter o sono, ou dormiu demais", options: OPTIONS_0_3 },
    { id: "q4", text: "Se sentiu cansado ou com pouca energia", options: OPTIONS_0_3 },
    { id: "q5", text: "Falta de apetite ou comeu demais", options: OPTIONS_0_3 },
    { id: "q6", text: "Se sentiu mal consigo mesmo — ou achou que é um fracasso ou que decepcionou a família", options: OPTIONS_0_3 },
    { id: "q7", text: "Dificuldade para se concentrar nas coisas, como ler ou ver televisão", options: OPTIONS_0_3 },
    { id: "q8", text: "Lentidão para se movimentar ou falar, ou agitação excessiva (andando de um lado para o outro)", options: OPTIONS_0_3 },
    { id: "q9", text: "Pensou em se machucar de alguma forma ou que seria melhor estar morto", options: OPTIONS_0_3 },
  ],
  interpret(score) {
    if (score <= 4) return { label: "Mínimo", level: "ok" };
    if (score <= 9) return { label: "Leve", level: "ok", note: "Monitorar, orientar hábitos de vida" };
    if (score <= 14) return { label: "Moderado", level: "warn", note: "Considerar psicoterapia e/ou farmacoterapia" };
    if (score <= 19) return { label: "Moderadamente grave", level: "crit", note: "Psicoterapia + farmacoterapia recomendadas" };
    return { label: "Grave", level: "crit", note: "Iniciar tratamento imediatamente; avaliar risco de suicídio (Q9)" };
  },
};

export const GAD7: ScaleDef = {
  id: "gad7",
  name: "GAD-7",
  shortName: "GAD-7",
  description: "Rastreio de ansiedade — 7 itens",
  timeFrame: "Nas últimas 2 semanas, com que frequência você foi incomodado pelos seguintes problemas?",
  maxScore: 21,
  source: "Spitzer et al. 2006 / MS Linha de Cuidado Ansiedade",
  sourceYear: 2006,
  questions: [
    { id: "q1", text: "Sensação de nervosismo, ansiedade ou tensão", options: OPTIONS_0_3 },
    { id: "q2", text: "Incapaz de parar ou controlar as preocupações", options: OPTIONS_0_3 },
    { id: "q3", text: "Preocupação excessiva com diversas coisas", options: OPTIONS_0_3 },
    { id: "q4", text: "Dificuldade para relaxar", options: OPTIONS_0_3 },
    { id: "q5", text: "Agitação tão grande que ficou difícil ficar sentado parado", options: OPTIONS_0_3 },
    { id: "q6", text: "Ficar facilmente irritado ou irritável", options: OPTIONS_0_3 },
    { id: "q7", text: "Sentir medo como se algo terrível fosse acontecer", options: OPTIONS_0_3 },
  ],
  interpret(score) {
    if (score <= 4) return { label: "Mínimo", level: "ok" };
    if (score <= 9) return { label: "Leve", level: "ok", note: "Psicoeducação, técnicas de relaxamento" };
    if (score <= 14) return { label: "Moderado", level: "warn", note: "Considerar encaminhamento ou farmacoterapia" };
    return { label: "Grave", level: "crit", note: "Tratamento indicado; avaliar TAG, transtorno do pânico" };
  },
};

export const AUDIT_C: ScaleDef = {
  id: "audit_c",
  name: "AUDIT-C",
  shortName: "AUDIT-C",
  description: "Rastreio de uso de álcool — 3 itens",
  maxScore: 12,
  source: "Bush et al. 1998 / WHO AUDIT / MS PNAN Álcool 2023",
  sourceYear: 1998,
  genderAware: true,
  questions: [
    {
      id: "q1",
      text: "Com que frequência você consome bebidas que contêm álcool?",
      options: [
        { label: "Nunca", value: 0 },
        { label: "Mensalmente ou menos", value: 1 },
        { label: "2 a 4 vezes por mês", value: 2 },
        { label: "2 a 3 vezes por semana", value: 3 },
        { label: "4 ou mais vezes por semana", value: 4 },
      ],
    },
    {
      id: "q2",
      text: "Num dia típico em que bebe, quantas doses você consome?",
      options: [
        { label: "1 ou 2", value: 0 },
        { label: "3 ou 4", value: 1 },
        { label: "5 ou 6", value: 2 },
        { label: "7 a 9", value: 3 },
        { label: "10 ou mais", value: 4 },
      ],
    },
    {
      id: "q3",
      text: "Com que frequência você consome 5 ou mais doses em uma única ocasião?",
      options: [
        { label: "Nunca", value: 0 },
        { label: "Menos de uma vez por mês", value: 1 },
        { label: "Mensalmente", value: 2 },
        { label: "Semanalmente", value: 3 },
        { label: "Diariamente ou quase todos os dias", value: 4 },
      ],
    },
  ],
  interpret(score, gender) {
    const threshold = gender === "Feminino" ? 3 : 4;
    if (score < threshold) return { label: "Triagem negativa", level: "ok" };
    if (score <= 7) return { label: "Triagem positiva — uso de risco", level: "warn", note: "Intervenção breve recomendada" };
    return { label: "Triagem positiva — uso nocivo / provável dependência", level: "crit", note: "Avaliação especializada e intervenção intensiva" };
  },
};

export const MINI_COG: ScaleDef = {
  id: "mini_cog",
  name: "Mini-Cog",
  shortName: "Mini-Cog",
  description: "Rastreio cognitivo — recordação de 3 palavras + relógio",
  maxScore: 5,
  source: "Borson et al. 2000 / MS Caderno Saúde Pessoa Idosa 2023",
  sourceYear: 2000,
  requiresInPerson: true,
  questions: [
    {
      id: "recall",
      text: "Palavras recordadas (diga 3 palavras, peça ao paciente para repetir e lembrar após o relógio)",
      options: [
        { label: "0 palavras", value: 0 },
        { label: "1 palavra", value: 1 },
        { label: "2 palavras", value: 2 },
        { label: "3 palavras", value: 3 },
      ],
    },
    {
      id: "clock",
      text: "Desenho do relógio (peça para desenhar um relógio mostrando 11h10)",
      options: [
        { label: "Anormal — espaçamento incorreto ou números/ponteiros errados (0 pts)", value: 0 },
        { label: "Normal — todos os números e ponteiros corretos (2 pts)", value: 2 },
      ],
    },
  ],
  interpret(score) {
    if (score <= 2) return { label: "Rastreio positivo — possível comprometimento cognitivo", level: "crit", note: "Encaminhar para avaliação neuropsicológica / especialista" };
    if (score === 3) return { label: "Limítrofe — considerar avaliação complementar", level: "warn" };
    return { label: "Rastreio negativo", level: "ok" };
  },
};

export const EDMONTON: ScaleDef = {
  id: "edmonton",
  name: "Edmonton Frailty Scale",
  shortName: "Edmonton",
  description: "Avaliação de fragilidade — 9 domínios",
  maxScore: 17,
  source: "Rolfson et al. 2006 / MS Caderno Saúde Pessoa Idosa 2023",
  sourceYear: 2006,
  requiresInPerson: true,
  questions: [
    {
      id: "cognitivo",
      text: "1. Cognição — Peça ao paciente para desenhar um relógio mostrando 11h10",
      options: [
        { label: "Sem erros (0)", value: 0 },
        { label: "Erros menores de espaçamento (1)", value: 1 },
        { label: "Outros erros (2)", value: 2 },
      ],
    },
    {
      id: "saude_geral",
      text: "2. Estado geral de saúde — No último ano, quantas vezes foi internado?",
      options: [
        { label: "Nenhuma (0)", value: 0 },
        { label: "1 a 2 vezes (1)", value: 1 },
        { label: "3 ou mais vezes (2)", value: 2 },
      ],
    },
    {
      id: "dependencia",
      text: "3. Independência funcional — Quantas das seguintes atividades você faz SEM ajuda? (cozinhar, compras, transporte, telefonemas, tomar remédio, dinheiro, limpeza, lavanderia)",
      options: [
        { label: "0 a 1 dependência (0)", value: 0 },
        { label: "2 a 4 dependências (1)", value: 1 },
        { label: "5 ou mais dependências (2)", value: 2 },
      ],
    },
    {
      id: "suporte",
      text: "4. Suporte social — Quando precisa de ajuda, tem alguém disponível?",
      options: [
        { label: "Sempre (0)", value: 0 },
        { label: "Às vezes / nunca (1)", value: 1 },
      ],
    },
    {
      id: "medicamentos",
      text: "5. Uso de medicamentos — Quantos medicamentos diferentes você usa regularmente?",
      options: [
        { label: "0 a 4 (0)", value: 0 },
        { label: "5 ou mais (1)", value: 1 },
      ],
    },
    {
      id: "polimedicacao",
      text: "6. Aderência — Alguma vez esquece de tomar seus remédios?",
      options: [
        { label: "Não (0)", value: 0 },
        { label: "Sim (1)", value: 1 },
      ],
    },
    {
      id: "nutricao",
      text: "7. Nutrição — Você perdeu peso significativo nos últimos 6 meses sem querer?",
      options: [
        { label: "Não (0)", value: 0 },
        { label: "Sim (1)", value: 1 },
      ],
    },
    {
      id: "humor",
      text: "8. Humor — Você se sente triste ou deprimido com frequência?",
      options: [
        { label: "Não (0)", value: 0 },
        { label: "Sim (1)", value: 1 },
      ],
    },
    {
      id: "continencia",
      text: "9. Continência — Você tem perda involuntária de urina?",
      options: [
        { label: "Não (0)", value: 0 },
        { label: "Sim (1)", value: 1 },
      ],
    },
    {
      id: "desempenho",
      text: "10. Desempenho funcional — Timed Up and Go: levante da cadeira, caminhe 3m, volte e sente",
      options: [
        { label: "< 10 segundos (0)", value: 0 },
        { label: "10 a 19 segundos (1)", value: 1 },
        { label: "≥ 20 segundos ou recusa (2)", value: 2 },
      ],
    },
  ],
  interpret(score) {
    if (score <= 4) return { label: "Sem fragilidade", level: "ok" };
    if (score <= 6) return { label: "Vulnerável", level: "ok", note: "Monitorar e intervir em fatores de risco" };
    if (score <= 8) return { label: "Fragilidade leve", level: "warn", note: "Plano de cuidados individualizado" };
    if (score <= 10) return { label: "Fragilidade moderada", level: "warn", note: "Avaliação geriátrica abrangente indicada" };
    return { label: "Fragilidade grave", level: "crit", note: "Avaliação especializada urgente; cuidados paliativos a considerar" };
  },
};

/**
 * IVCF-20 — Índice de Vulnerabilidade Clínico-Funcional para Idosos
 *
 * Instrumento OFICIAL do MS para avaliação multidimensional de idosos >=60a na APS.
 * Fonte: MS — Protocolo de Envelhecimento Saudável / Caderneta de Saúde da Pessoa Idosa.
 * Autores originais: Maia et al. 2016 (IAF-20); adaptado pelo MS para IVCF-20.
 * 20 itens em 8 domínios funcionais.
 * Score: 0–20 (higher = more frail).
 *
 * Interpretação:
 *  0–5  : Idoso robusto / independente
 *  6–10 : Idoso vulnerável
 * 11–20 : Idoso frágil / dependente
 *
 * ⚠️  Este instrumento requer aplicação PRESENCIAL. Não aplicar por teleconsulta.
 */
export const IVCF20: ScaleDef = {
  id: "ivcf20",
  name: "IVCF-20",
  shortName: "IVCF-20",
  description: "Avaliação multidimensional de idosos — 20 itens (instrumento oficial MS)",
  source: "Maia et al. 2016 / MS Protocolo Envelhecimento Saudável / Caderneta Pessoa Idosa",
  sourceYear: 2016,
  requiresInPerson: true,
  maxScore: 20,
  questions: [
    {
      id: "idade",
      text: "1. Idade",
      options: [
        { label: "60–74a (0)", value: 0 },
        { label: "75–84a (1)", value: 1 },
        { label: ">=85a (2)", value: 2 },
      ],
    },
    {
      id: "autopercepcao_saude",
      text: "2. Autopercepção de saúde",
      options: [
        { label: "Ótima/boa (0)", value: 0 },
        { label: "Regular (1)", value: 1 },
        { label: "Ruim/péssima (2)", value: 2 },
      ],
    },
    {
      id: "internacoes",
      text: "3. Internações nos últimos 12 meses",
      options: [
        { label: "Nenhuma (0)", value: 0 },
        { label: "1–2 (1)", value: 1 },
        { label: ">=3 (2)", value: 2 },
      ],
    },
    {
      id: "medicamentos",
      text: "4. Número de medicamentos de uso contínuo (sem contar fitoterápicos)",
      options: [
        { label: "Nenhum (0)", value: 0 },
        { label: "1–4 (1)", value: 1 },
        { label: ">=5 (2)", value: 2 },
      ],
    },
    {
      id: "cognicao",
      text: "5. Cognição — recordação de 3 palavras após 5 minutos",
      options: [
        { label: "Lembrou 3 palavras (0)", value: 0 },
        { label: "Lembrou 1–2 palavras (1)", value: 1 },
        { label: "Não lembrou nenhuma (2)", value: 2 },
      ],
    },
    {
      id: "humor",
      text: "6. Humor — sentimentos de tristeza, desânimo ou desinteresse (perguntar ao paciente ou cuidador)",
      options: [
        { label: "Nenhum sintoma (0)", value: 0 },
        { label: "Algum sintoma (1)", value: 1 },
        { label: "Sintomas frequentes / persistente (2)", value: 2 },
      ],
    },
    {
      id: "mobilidade",
      text: "7. Mobilidade — ability de transferir da cama/cadeira e caminhar",
      options: [
        { label: "Independente (0)", value: 0 },
        { label: "Precisa de ajuda (1)", value: 1 },
        { label: "Dependente / cadeira de rodas / acamado (2)", value: 2 },
      ],
    },
    {
      id: "transferencias",
      text: "8. Transferências — ability de levantar-se da cama/cadeira",
      options: [
        { label: "Independente (0)", value: 0 },
        { label: "Precisa de ajuda (1)", value: 1 },
        { label: "Dependente (2)", value: 2 },
      ],
    },
    {
      id: "avds_instrumentais",
      text: "9. Atividades instrumentais da vida diária — usar telefone, transporte, medicação, compras",
      options: [
        { label: "Independente (0)", value: 0 },
        { label: "Precisa de ajuda (1)", value: 1 },
        { label: "Dependente (2)", value: 2 },
      ],
    },
    {
      id: "avd_basicas",
      text: "10. Atividades básicas de vida diária — vestir, banhar, higiene, alimentação, continência",
      options: [
        { label: "Independente em todas (0)", value: 0 },
        { label: "Dependente em 1–2 (1)", value: 1 },
        { label: "Dependente em >=3 (2)", value: 2 },
      ],
    },
    {
      id: "visao",
      text: "11. Visão — consegue ler jornal ou ver TV com óculos se usar?",
      options: [
        { label: "Sim, sem dificuldade (0)", value: 0 },
        { label: "Com alguma dificuldade (1)", value: 1 },
        { label: "Não consegue / sem óculos (2)", value: 2 },
      ],
    },
    {
      id: "audicao",
      text: "12. Audição — consegue manter uma conversa em tom normal?",
      options: [
        { label: "Sim, sem dificuldade (0)", value: 0 },
        { label: "Precisa aumentar volume / repete palavras (1)", value: 1 },
        { label: "Não consegue / usa aparelho e não ajuda (2)", value: 2 },
      ],
    },
    {
      id: "marcha",
      text: "13. Marcha — ao caminhar 3 metros, velocidade é:",
      options: [
        { label: "Normal / rápida (0)", value: 0 },
        { label: "Lenta, mas não para (1)", value: 1 },
        { label: "Lenta, para, ou não caminha (2)", value: 2 },
      ],
    },
    {
      id: "quedas",
      text: "14. Quedas nos últimos 6 meses",
      options: [
        { label: "Nenhuma (0)", value: 0 },
        { label: "1 queda (1)", value: 1 },
        { label: ">=2 quedas (2)", value: 2 },
      ],
    },
    {
      id: "nutricao",
      text: "15. Perda de peso não intencional nos últimos 6 meses",
      options: [
        { label: "Não perdeu ou ganhou (0)", value: 0 },
        { label: "Perdeu 1–4 kg (1)", value: 1 },
        { label: "Perdeu >4 kg / não sabe quanto (2)", value: 2 },
      ],
    },
    {
      id: "atividades_fisicas",
      text: "16. Pratica atividades físicas regulares (caminhada, ginástica, dança, hidro, etc.)?",
      options: [
        { label: "Sim, >=3x/semana (0)", value: 0 },
        { label: "Sim, 1–2x/semana (1)", value: 1 },
        { label: "Não pratica (2)", value: 2 },
      ],
    },
    {
      id: "rede_social",
      text: "17. Rede de apoio social — quando precisa de ajuda, tem alguém?",
      options: [
        { label: "Sempre tem alguém (0)", value: 0 },
        { label: "Às vezes tem (1)", value: 1 },
        { label: "Nunca ou quase nunca tem (2)", value: 2 },
      ],
    },
    {
      id: "continencia",
      text: "18. Continência urinária",
      options: [
        { label: "Preserva continência (0)", value: 0 },
        { label: "Incontinência de esforço / urgência ocasional (1)", value: 1 },
        { label: "Sonda / fralda / incontinência total (2)", value: 2 },
      ],
    },
    {
      id: "comunicacao",
      text: "19. Comunicação — consegue se fazer entender e compreender os outros?",
      options: [
        { label: "Sim, sem dificuldade (0)", value: 0 },
        { label: "Com dificuldade (1)", value: 1 },
        { label: "Não consegue / não se entende (2)", value: 2 },
      ],
    },
    {
      id: "orientacao",
      text: "20. Orientação temporal — sabe que dia é hoje (dia, mês, ano)?",
      options: [
        { label: "Sabe os 3 (0)", value: 0 },
        { label: "Sabe 1–2 (1)", value: 1 },
        { label: "Não sabe nenhum (2)", value: 2 },
      ],
    },
  ],
  interpret(score) {
    if (score <= 5) return { label: "Idoso robusto / independente", level: "ok" };
    if (score <= 10) return { label: "Idoso vulnerável", level: "warn" };
    return { label: "Idoso frágil / dependente", level: "crit" };
  },
};

export const ALL_SCALES: ScaleDef[] = [IVCF20, PHQ9, GAD7, AUDIT_C, MINI_COG, EDMONTON];

export function computeScore(answers: Record<string, number>): number {
  return Object.values(answers).reduce((sum, v) => sum + v, 0);
}
