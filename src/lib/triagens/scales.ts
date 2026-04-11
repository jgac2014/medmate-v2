/**
 * Definições das escalas de triagem clínica para APS
 *
 * Escalas implementadas:
 * - PHQ-9: rastreio de depressão (Kroenke & Spitzer 2002 / MS Linha de Cuidado Depressão)
 * - GAD-7: rastreio de ansiedade (Spitzer et al. 2006 / MS Linha de Cuidado Ansiedade)
 * - AUDIT-C: uso de álcool (Bush et al. 1998 / WHO AUDIT / MS PNAN Álcool)
 * - Mini-Cog: rastreio cognitivo (Borson et al. 2000 / MS Caderno Saúde Pessoa Idosa 2023)
 * - Edmonton Frailty Scale: avaliação de fragilidade (Rolfson et al. 2006 / MS Caderno Saúde Pessoa Idosa 2023)
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

export const ALL_SCALES: ScaleDef[] = [PHQ9, GAD7, AUDIT_C, MINI_COG, EDMONTON];

export function computeScore(answers: Record<string, number>): number {
  return Object.values(answers).reduce((sum, v) => sum + v, 0);
}
