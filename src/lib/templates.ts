// src/lib/templates.ts
//
// Templates clínicos para condições prevalentes na Atenção Primária à Saúde (APS) brasileira.
//
// ATENÇÃO: TODO conteúdo clínico deste arquivo é sourced exclusivamente de fontes oficiais
// brasileiras (MS, SBC, SBMFC). NUNCA alterar metas, critérios ou condutas sem verificar
// a diretriz atualizada citada no campo `source` de cada template.
//
// Fontes verificadas em 2026-03-28:
//   HAS   — MS. Linha de Cuidado HAS no Adulto, 2021. linhasdecuidado.saude.gov.br
//           MS. Caderno de Atenção Básica nº 37 (HAS), 2013. bvsms.saude.gov.br
//           MS. Portaria SECTICS/MS nº 49/2025 (PCDT HAS). bvsms.saude.gov.br
//   DM2   — MS. Linha de Cuidado DM2 no Adulto. linhasdecuidado.saude.gov.br
//           MS. Caderno de Atenção Básica nº 36 (DM), 2013. bvsms.saude.gov.br
//   DISPL — SBC. Diretriz Brasileira de Dislipidemias e Prev. Aterosclerose, 2025.
//           pmc.ncbi.nlm.nih.gov/articles/PMC12674852/
//   HIPO  — MS. Protocolos de Encaminhamento: Endocrinologia Adulto, 2022.
//           bvsms.saude.gov.br/bvs/publicacoes/protocolos_encaminhamento_atencao_endocrinologia_adulto.pdf
//   ASMA  — MS. Linha de Cuidado Asma. linhasdecuidado.saude.gov.br/portal/asma/
//   DPOC  — MS. Linha de Cuidado DPOC. linhasdecuidado.saude.gov.br/portal/doenca-pulmonar-obstrutiva-cronica/

import type { SoapNotes } from "@/types";

export type TemplateCategory = "cronico" | "agudo" | "preventivo";

export interface ClinicalTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  /** Citação completa da fonte oficial */
  source: string;
  /** URL de verificação da fonte */
  sourceUrl: string;
  sourceYear: number;
  fill: {
    /** Problemas a marcar na lista (strings devem corresponder exatamente a PROBLEMS em constants.ts) */
    problems?: string[];
    /** Prevenções a marcar (strings devem corresponder exatamente a PREVENTIONS em constants.ts) */
    preventions?: string[];
    /** Texto estruturado para campos SOAP — serve como guia, não como diagnóstico */
    soap?: Partial<SoapNotes>;
    /** Exames a solicitar — texto livre para o campo "Exames a Solicitar" */
    requestedExams?: string;
    /** Orientações ao paciente — texto livre */
    patientInstructions?: string;
  };
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

export const CLINICAL_TEMPLATES: ClinicalTemplate[] = [
  // ── HAS ──────────────────────────────────────────────────────────────────
  {
    id: "has_retorno",
    name: "HAS — Retorno",
    description: "Retorno de HAS crônica — avaliação de controle e adesão",
    category: "cronico",
    source: "MS. Linha de Cuidado HAS no Adulto, 2021; CAB nº 37, 2013",
    sourceUrl: "https://linhasdecuidado.saude.gov.br/portal/hipertensao-arterial-sistemica-(HAS)-no-adulto/",
    sourceYear: 2021,
    fill: {
      problems: ["HAS"],
      soap: {
        subjective:
          "Queixas: cefaleia, tontura, palpitações, visão turva, dor torácica, dispneia?\n" +
          "Adesão ao tratamento: [ ] Boa  [ ] Irregular — motivo: ___\n" +
          "Efeitos adversos dos anti-hipertensivos: ___\n" +
          "Aferições domiciliares (MRPA/MAPA): ___",
        assessment:
          "HAS [ ] controlada  /  [ ] não controlada.\n" +
          "Meta PA: <140/90 mmHg (população geral); <130/80 mmHg (DM, DRC, alto RCV).\n" +
          "Risco cardiovascular: [ ] baixo  [ ] intermediário  [ ] alto  [ ] muito alto\n" +
          "Lesão em órgão-alvo: [ ] Ausente  [ ] Presente — ___",
        plan:
          "MNF: sal <5 g/dia, atividade física ≥150 min/semana, controle de peso, cessação tabágica.\n" +
          "[ ] Manter farmacoterapia atual\n" +
          "[ ] Ajustar dose / associar anti-hipertensivo\n" +
          "Retorno em ___ meses. Solicitar exames de rotina anuais.",
      },
      requestedExams:
        "— Lipidograma\n" +
        "— Creatinina + TFG (CKD-EPI)\n" +
        "— Potássio (se em uso de IECA/BRA ou diurético)\n" +
        "— Glicemia de jejum\n" +
        "— EAS (urina I)\n" +
        "— ECG (se ainda não realizado ou >2 anos)",
      patientInstructions:
        "— Aferir PA em casa e anotar (diário de pressão)\n" +
        "— Reduzir sal: máximo 5 g/dia (~1 colher de chá rasa)\n" +
        "— Praticar atividade física: 30 min/dia, pelo menos 5 dias/semana\n" +
        "— Manter peso saudável; limitar álcool\n" +
        "— NÃO interromper os medicamentos sem orientação médica\n" +
        "— Procurar serviço de saúde se PA >180/110 mmHg ou sintomas: cefaleia intensa, visão turva, dor no peito, falta de ar",
    },
  },

  // ── DM2 ──────────────────────────────────────────────────────────────────
  {
    id: "dm2_retorno",
    name: "DM2 — Retorno",
    description: "Retorno de DM2 crônico — controle glicêmico e rastreio de complicações",
    category: "cronico",
    source: "MS. Linha de Cuidado DM2 no Adulto; CAB nº 36, 2013",
    sourceUrl: "https://linhasdecuidado.saude.gov.br/portal/diabetes-mellitus-tipo-2-(DM2)-no-adulto/",
    sourceYear: 2021,
    fill: {
      problems: ["DM2"],
      soap: {
        subjective:
          "Sintomas de hiperglicemia: poliúria, polidipsia, visão turva?\n" +
          "Episódios de hipoglicemia: [ ] Sim — frequência/horário: ___  [ ] Não\n" +
          "Adesão ao tratamento: [ ] Boa  [ ] Irregular — motivo: ___\n" +
          "Atividade física e alimentação: ___",
        assessment:
          "DM2 [ ] controlado  /  [ ] não controlado.\n" +
          "Meta HbA1c: <7% (adulto geral); 7,5–8,5% (idoso frágil/alto risco de hipoglicemia).\n" +
          "Meta glicemia jejum: 80–130 mg/dL. Meta pós-prandial 2h: <180 mg/dL.",
        plan:
          "[ ] Orientar dieta (reduzir carboidratos simples e açúcares)\n" +
          "[ ] Manter farmacoterapia  /  [ ] Ajustar dose ou adicionar hipoglicemiante\n" +
          "Avaliação do pé diabético nesta consulta (sensibilidade, pulsos, inspeção).\n" +
          "Rastreio de retinopatia: encaminhar oftalmologia se ainda não realizado ou >1 ano.\n" +
          "Retorno em ___ meses.",
      },
      requestedExams:
        "— HbA1c (a cada 3 meses se descompensado; 6 meses se estável)\n" +
        "— Glicemia de jejum\n" +
        "— Lipidograma\n" +
        "— Creatinina + TFG (CKD-EPI)\n" +
        "— RAC — razão albumina/creatinina (rastreio de nefropatia)\n" +
        "— EAS (urina I)",
      patientInstructions:
        "— Dieta: reduzir açúcares, farinha branca, frituras; preferir fibras e proteínas magras\n" +
        "— Atividade física: ≥150 min/semana de intensidade moderada\n" +
        "— Auto-monitorização glicêmica conforme orientado\n" +
        "— Examinar os pés diariamente (feridas, calosidades, alterações de cor)\n" +
        "— NÃO interromper medicações sem orientação médica\n" +
        "— Procurar serviço de saúde se glicemia >300 mg/dL, sintomas intensos ou feridas nos pés",
    },
  },

  // ── HAS + DM2 ─────────────────────────────────────────────────────────────
  {
    id: "has_dm2_retorno",
    name: "HAS + DM2 — Retorno",
    description: "Retorno combinado para HAS e DM2 crônicos",
    category: "cronico",
    source: "MS. Linha de Cuidado HAS (2021) e DM2 no Adulto; CAB nº 36 e nº 37 (MS, 2013)",
    sourceUrl: "https://linhasdecuidado.saude.gov.br/portal/hipertensao-arterial-sistemica-(HAS)-no-adulto/",
    sourceYear: 2021,
    fill: {
      problems: ["HAS", "DM2"],
      soap: {
        subjective:
          "Queixas: cefaleia, tontura, poliúria, polidipsia, hipoglicemia, visão turva?\n" +
          "Adesão ao tratamento: [ ] Boa  [ ] Irregular — motivo: ___\n" +
          "Aferições domiciliares (PA/glicemia): ___",
        assessment:
          "HAS [ ] controlada  /  [ ] não controlada. Meta PA: <130/80 mmHg (paciente com DM).\n" +
          "DM2 [ ] controlado  /  [ ] não controlado. Meta HbA1c: <7% (adulto geral).\n" +
          "Risco cardiovascular aumentado pela associação HAS + DM.",
        plan:
          "MNF: dieta hipossódica + restrição de carboidratos simples; exercício ≥150 min/semana.\n" +
          "[ ] Manter  /  [ ] Ajustar farmacoterapia (anti-hipertensivo + hipoglicemiante)\n" +
          "Avaliação do pé diabético. Rastreio de retinopatia (oftalmologia).\n" +
          "Retorno em ___ meses. Solicitar exames.",
      },
      requestedExams:
        "— HbA1c\n" +
        "— Glicemia de jejum\n" +
        "— Lipidograma\n" +
        "— Creatinina + TFG (CKD-EPI)\n" +
        "— RAC (albumina/creatinina) — rastreio nefropatia\n" +
        "— Potássio (se em uso de IECA/BRA)\n" +
        "— EAS (urina I)\n" +
        "— ECG",
      patientInstructions:
        "— Controlar sal (máx. 5 g/dia) e açúcares simultaneamente\n" +
        "— Atividade física ≥30 min/dia\n" +
        "— Monitorizar PA e glicemia em casa e anotar\n" +
        "— Inspecionar os pés diariamente\n" +
        "— NÃO interromper medicamentos sem orientação\n" +
        "— Procurar serviço de saúde se PA >180/110 mmHg, glicemia >300 mg/dL ou feridas nos pés",
    },
  },

  // ── Dislipidemia ──────────────────────────────────────────────────────────
  {
    id: "dislipidemia_retorno",
    name: "Dislipidemia — Retorno",
    description: "Retorno de dislipidemia — metas de LDL por risco cardiovascular",
    category: "cronico",
    // Fonte: Diretriz Brasileira de Dislipidemias 2025 (SBC) — verificada em PMC
    source: "SBC. Diretriz Brasileira de Dislipidemias e Prevenção da Aterosclerose, 2025",
    sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12674852/",
    sourceYear: 2025,
    fill: {
      problems: ["Dislipidemia"],
      soap: {
        subjective:
          "Sintomas musculares (mialgia, fraqueza) — possível efeito adverso de estatina?\n" +
          "Adesão ao tratamento: [ ] Boa  [ ] Irregular\n" +
          "Dieta e atividade física: ___",
        assessment:
          "Dislipidemia. Estratificar risco cardiovascular (Escore de Risco Brasil ou similar).\n" +
          "Metas LDL-c (Diretriz SBC 2025):\n" +
          "  Baixo risco:      <190 mg/dL\n" +
          "  Intermediário:    <130 mg/dL\n" +
          "  Alto risco:       <100 mg/dL\n" +
          "  Muito alto risco: <70 mg/dL\n" +
          "  Risco extremo:    <50 mg/dL\n" +
          "Meta Não-HDL = meta LDL + 30 mg/dL.",
        plan:
          "MNF: reduzir gorduras saturadas/trans, aumentar fibras solúveis, atividade física aeróbica.\n" +
          "[ ] Manter estatina  /  [ ] Iniciar  /  [ ] Ajustar dose\n" +
          "[ ] Associar ezetimiba se meta LDL não atingida com estatina isolada\n" +
          "Controlar novo lipidograma em 3–6 meses após início/ajuste de terapia.",
      },
      requestedExams:
        "— Lipidograma completo (CT, HDL, LDL, TG, Não-HDL)\n" +
        "— Glicemia de jejum\n" +
        "— Creatinina + TFG\n" +
        "— CPK (se mialgia — suspeita de miopatia por estatina)\n" +
        "— AST / ALT (se sintomas hepáticos ou dose alta de estatina)",
      patientInstructions:
        "— Reduzir gorduras saturadas (carnes gordas, laticínios integrais, frituras)\n" +
        "— Eliminar gordura trans (industrializados, margarinas endurecidas)\n" +
        "— Aumentar fibras: aveia, leguminosas, vegetais\n" +
        "— Praticar atividade física aeróbica regularmente\n" +
        "— NÃO interromper estatina sem orientação — relatar ao médico qualquer dor ou fraqueza muscular",
    },
  },

  // ── Hipotireoidismo ───────────────────────────────────────────────────────
  {
    id: "hipotireoidismo_retorno",
    name: "Hipotireoidismo — Retorno",
    description: "Retorno de hipotireoidismo em uso de levotiroxina",
    category: "cronico",
    source: "MS. Protocolos de Encaminhamento: Endocrinologia Adulto, 2022",
    sourceUrl: "https://bvsms.saude.gov.br/bvs/publicacoes/protocolos_encaminhamento_atencao_endocrinologia_adulto.pdf",
    sourceYear: 2022,
    fill: {
      problems: ["Hipotireoidismo"],
      soap: {
        subjective:
          "Sintomas de hipotireoidismo: fadiga, ganho de peso, constipação, intolerância ao frio, queda de cabelo, humor deprimido?\n" +
          "Sintomas de excesso (hipertireoidismo iatrogênico): palpitações, tremor, insônia, emagrecimento?\n" +
          "Uso correto da levotiroxina: [ ] Em jejum ≥30 min antes do café  /  [ ] Irregular\n" +
          "Dose atual: ___ mcg/dia",
        assessment:
          "Hipotireoidismo [ ] compensado (TSH na faixa de referência)  /  [ ] descompensado.\n" +
          "TSH atual: ___ mUI/L. Encaminhar a endocrinologia se necessidade de dose >2,5 mcg/kg/dia\n" +
          "após investigada adesão e interações medicamentosas.",
        plan:
          "[ ] Manter dose de levotiroxina: ___ mcg/dia\n" +
          "[ ] Ajustar dose (incrementos habituais de 12,5–25 mcg)\n" +
          "Controlar TSH em 6–8 semanas após qualquer ajuste de dose.\n" +
          "Se estável: controlar TSH a cada 6–12 meses.\n" +
          "Retorno em ___ meses.",
      },
      requestedExams:
        "— TSH (rotina: 6–12 meses se estável; 6–8 semanas após ajuste de dose)\n" +
        "— T4 livre (se TSH alterado ou suspeita de hipotireoidismo central)",
      patientInstructions:
        "— Tomar a levotiroxina SEMPRE em jejum, pelo menos 30 minutos antes do café da manhã\n" +
        "— Não tomar junto com cálcio, ferro ou antiácidos (intervalo mínimo de 2–4 horas)\n" +
        "— NÃO interromper o medicamento — o hipotireoidismo piora sem tratamento\n" +
        "— Retornar se sintomas de excesso: palpitações, tremor, insônia, emagrecimento involuntário",
    },
  },

  // ── Asma / DPOC ───────────────────────────────────────────────────────────
  {
    id: "asma_dpoc_retorno",
    name: "Asma / DPOC — Retorno",
    description: "Retorno de asma ou DPOC crônico — avaliação de controle e exacerbações",
    category: "cronico",
    source: "MS. Linha de Cuidado Asma (2021); MS. Linha de Cuidado DPOC; MS. PCDT Asma (2021)",
    sourceUrl: "https://linhasdecuidado.saude.gov.br/portal/asma/",
    sourceYear: 2021,
    fill: {
      problems: ["Asma / DPOC"],
      soap: {
        subjective:
          "Frequência de sintomas (tosse, sibilância, dispneia, aperto torácico):\n" +
          "  [ ] Diários  [ ] >2×/semana  [ ] ≤2×/semana  [ ] Raro\n" +
          "Limitação de atividades por sintomas: [ ] Sim  [ ] Não\n" +
          "Uso de broncodilatador de resgate na última semana: ___ vezes\n" +
          "Exacerbações nos últimos 12 meses: ___  (internações: ___)\n" +
          "Tabagismo: [ ] Ativo  [ ] Ex (cessação há ___ anos)  [ ] Nunca",
        assessment:
          "Asma: [ ] controlada  /  [ ] parcialmente controlada  /  [ ] não controlada\n" +
          "— OU —\n" +
          "DPOC — risco de exacerbação:\n" +
          "  [ ] Baixo (<2 exacerbações/ano, sem internação)\n" +
          "  [ ] Alto (≥2 exacerbações ou qualquer internação nos últimos 12 meses)\n" +
          "Espirometria (FEV1/CVF pós-BD): ___",
        plan:
          "[ ] Manter terapia inalatória atual\n" +
          "[ ] Ajustar step de tratamento conforme controle\n" +
          "Técnica inalatória revisada em consulta: [ ] Adequada  [ ] Corrigida\n" +
          "Cessação tabágica: [ ] Aconselhado  [ ] Encaminhado a programa\n" +
          "Reabilitação pulmonar (DPOC): [ ] Indicada  [ ] Em curso  [ ] Não indicada\n" +
          "Retorno em ___ meses ou se exacerbação.",
      },
      requestedExams:
        "— Espirometria (diagnóstico e monitoramento — mínimo anual)\n" +
        "— Oximetria de pulso (SpO2)\n" +
        "— Hemograma (se exacerbação ou suspeita de infecção)\n" +
        "— Rx de tórax (se exacerbação ou avaliação inicial)",
      patientInstructions:
        "— Usar o inalador exatamente como orientado — a técnica correta é fundamental\n" +
        "— Broncodilatador de resgate >2×/semana indica mau controle — retornar para reavaliação\n" +
        "— Cessação do tabagismo: maior benefício isolado no DPOC\n" +
        "— Vacinar-se anualmente contra influenza; manter vacinação antipneumocócica em dia\n" +
        "— Sinais de piora (crise): dispneia aumentada, escarro amarelo/verde, febre — procurar serviço de saúde imediatamente",
    },
  },
];
