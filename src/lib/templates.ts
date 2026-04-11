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

// Fontes adicionadas na Sessão 14.5 (11/04/2026):
//   OBESID — MS. CAB nº 38 — Estratégias para o Cuidado da Pessoa com Obesidade, 2014. bvsms.saude.gov.br
//            ABESO. Diretrizes Brasileiras de Obesidade, 2022. abeso.org.br
//   DEP    — MS. Linha de Cuidado para Depressão na Atenção Básica, 2022. linhasdecuidado.saude.gov.br
//   ANSIED — MS. Linha de Cuidado para Transtornos de Ansiedade, 2022. linhasdecuidado.saude.gov.br
//   DRC    — KDIGO 2022 CKD Guidelines. kdigo.org; MS. Linha de Cuidado para DRC. linhasdecuidado.saude.gov.br
//   GOTA   — SBR. Consenso Brasileiro para Diagnóstico e Tratamento da Gota, 2022. reumatologia.org.br
//   OSTEO  — MS. PCDT Osteoporose. Portaria SCTIE/MS nº 39/2022. gov.br/saude
//   ICC    — SBC. Diretriz Brasileira de Insuficiência Cardíaca Crônica e Aguda, 2023. arquivosonline.com.br
//   GRIPAL — MS. Protocolo de Manejo Clínico da Gripe na APS, 2023. gov.br/saude
//   ITU    — MS/FEBRASGO. Protocolo Clínico de ITU não Complicada na APS, 2021.
//   AMIG   — Score Centor/McIsaac (Can Fam Physician, 2003); MS. RENAME 2023.
//   LOMBAR — MS. Caderno de Atenção Básica — Dorsalgia, 2023. bvsms.saude.gov.br
//   CEFAL  — SBCef. Diretrizes Diagnósticas e Terapêuticas de Cefaleias Primárias do Adulto, 2022. sbcef.org.br
//   MULHER — MS/INCA. Diretrizes para Rastreamento do Câncer no Brasil, 2024. inca.gov.br
//   IDOSO  — MS. CAB nº 19 — Envelhecimento e Saúde da Pessoa Idosa, 2023. bvsms.saude.gov.br
//   HOMEM  — MS. PNAISH, 2023. gov.br/saude
//   PRENAT — MS. CAB nº 32 — Atenção ao Pré-Natal de Baixo Risco, 2013 (atualiz. 2022). bvsms.saude.gov.br
//   PUERIC — MS. CAB nº 33 — Saúde da Criança: Crescimento e Desenvolvimento, 2012; Caderneta da Criança, 2023.

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

  // ==========================================================================
  // CRÔNICOS — novos (Sessão 14.5)
  // ==========================================================================

  // ── Obesidade / Síndrome Metabólica ───────────────────────────────────────
  {
    id: "obesidade_retorno",
    name: "Obesidade / S. Metabólica — Retorno",
    description: "Retorno de obesidade e síndrome metabólica — metas e terapêutica",
    category: "cronico",
    source: "MS. CAB nº 38 — Estratégias para o Cuidado da Pessoa com Obesidade, 2014; ABESO. Diretrizes Brasileiras de Obesidade, 2022",
    sourceUrl: "https://bvsms.saude.gov.br/bvs/publicacoes/estrategias_cuidado_pessoa_doenca_cronica_obesidade_cab38.pdf",
    sourceYear: 2022,
    fill: {
      problems: ["Obesidade"],
      soap: {
        subjective:
          "Peso atual: ___ kg (habitual: ___ kg). Variação recente: ___\n" +
          "Padrão alimentar: ___. Atividade física: ___\n" +
          "Complicações associadas: [ ] HAS  [ ] DM2  [ ] Dislipidemia  [ ] DHGNA  [ ] SAOS\n" +
          "Tentativas anteriores de emagrecimento: ___",
        objective:
          "IMC: ___ kg/m² (Grau I: 30–34,9 | Grau II: 35–39,9 | Grau III: ≥40).\n" +
          "Circunferência abdominal: ___ cm (alerta: ≥80 cm mulher / ≥94 cm homem).",
        assessment:
          "Obesidade Grau [ ] I  [ ] II  [ ] III.\n" +
          "Síndrome Metabólica: ≥3 dos critérios: CA aumentada + TG ↑ + HDL ↓ + PA ≥130/85 + glicemia ≥100.\n" +
          "Risco cardiovascular e metabólico: [ ] Baixo  [ ] Moderado  [ ] Alto",
        plan:
          "Meta: redução de 5–10% do peso em 6 meses (já melhora comorbidades significativamente).\n" +
          "[ ] Encaminhar nutricionista / equipe multiprofissional NASF\n" +
          "[ ] Farmacoterapia se IMC ≥30 com comorbidade ou IMC ≥35: ___\n" +
          "[ ] Discutir cirurgia bariátrica se IMC ≥40 (ou ≥35 com comorbidade grave não controlada)\n" +
          "Retorno em ___ meses — controlar peso, CA, PA e exames.",
      },
      requestedExams:
        "— Glicemia de jejum / HbA1c\n" +
        "— Lipidograma\n" +
        "— TSH (excluir hipotireoidismo como causa)\n" +
        "— Creatinina + TFG\n" +
        "— AST / ALT (rastreio DHGNA)\n" +
        "— Ácido úrico",
      patientInstructions:
        "— Meta inicial: perder 5–10% do peso — já traz benefícios reais à saúde\n" +
        "— Priorizar alimentos in natura e minimamente processados (Guia Alimentar MS)\n" +
        "— Reduzir ultraprocessados, açúcares e gorduras saturadas\n" +
        "— Atividade física: iniciar com 150 min/semana e progredir para 300 min/semana\n" +
        "— Dormir 7–9 horas por noite — privação de sono aumenta o apetite\n" +
        "— Anotar o que come (diário alimentar) — ajuda a identificar padrões",
    },
  },

  // ── Depressão ─────────────────────────────────────────────────────────────
  {
    id: "depressao_retorno",
    name: "Depressão — Retorno",
    description: "Retorno de Transtorno Depressivo Maior — resposta ao tratamento e adesão",
    category: "cronico",
    source: "MS. Linha de Cuidado para Depressão na Atenção Básica, 2022; DSM-5-TR (APA, 2022)",
    sourceUrl: "https://linhasdecuidado.saude.gov.br/portal/transtornos-de-humor-e-comportamento/",
    sourceYear: 2022,
    fill: {
      problems: ["Ansiedade / Depressão"],
      soap: {
        subjective:
          "PHQ-9 atual: ___ pontos (0–4 mínima; 5–9 leve; 10–14 moderada; 15–19 mod. grave; 20–27 grave).\n" +
          "Humor, anedonia, sono, apetite, concentração, energia, sentimento de desvalia: ___\n" +
          "Ideação suicida (PHQ-9 item 9): [ ] Ausente  [ ] Presente — avaliar risco: ___\n" +
          "Adesão ao antidepressivo: [ ] Regular  [ ] Irregular — motivo: ___\n" +
          "Psicoterapia (TCC): [ ] Em curso  [ ] Não",
        assessment:
          "Depressão [ ] leve  [ ] moderada  [ ] grave.\n" +
          "Resposta ao tratamento: [ ] Remissão (PHQ-9 <5)  [ ] Parcial (redução ≥50%)  [ ] Nenhuma\n" +
          "[ ] Ideação suicida presente — avaliar internação ou encaminhamento urgente ao CAPS",
        plan:
          "Antidepressivo: aguardar 4–6 semanas de dose terapêutica para avaliação de resposta.\n" +
          "[ ] Manter antidepressivo atual\n" +
          "[ ] Ajustar dose / trocar se 8 semanas sem resposta adequada\n" +
          "[ ] Encaminhar CAPS: episódio grave, risco de suicídio ou refratariedade\n" +
          "[ ] Orientar psicoterapia — TCC é primeira linha para depressão leve a moderada\n" +
          "Manter tratamento por mínimo 6 meses após remissão completa (1º episódio).\n" +
          "Retorno em ___ semanas.",
      },
      patientInstructions:
        "— O antidepressivo leva 4–6 semanas para fazer efeito completo — não interromper antes\n" +
        "— NÃO parar o medicamento abruptamente — reduzir gradualmente com orientação médica\n" +
        "— Atividade física tem eficácia comprovada na depressão leve a moderada\n" +
        "— Manter rotina: horários regulares de sono, refeições e atividades prazerosas\n" +
        "— Se pensamentos de se machucar: ligar CVV (188, 24h gratuito) ou ir à UPA/emergência",
    },
  },

  // ── Ansiedade / TAG ───────────────────────────────────────────────────────
  {
    id: "ansiedade_retorno",
    name: "Ansiedade / TAG — Retorno",
    description: "Retorno de Transtorno de Ansiedade Generalizada",
    category: "cronico",
    source: "MS. Linha de Cuidado para Transtornos de Ansiedade na Atenção Básica, 2022; DSM-5-TR (APA, 2022)",
    sourceUrl: "https://linhasdecuidado.saude.gov.br/portal/transtornos-de-humor-e-comportamento/",
    sourceYear: 2022,
    fill: {
      problems: ["Ansiedade / Depressão"],
      soap: {
        subjective:
          "GAD-7 atual: ___ pontos (0–4 mínima; 5–9 leve; 10–14 moderada; ≥15 grave).\n" +
          "Sintomas: preocupação excessiva, tensão muscular, insônia, irritabilidade, dificuldade de concentrar: ___\n" +
          "Crises de pânico: [ ] Ausentes  [ ] Presentes — frequência: ___\n" +
          "Adesão ao tratamento: [ ] Regular  [ ] Irregular — motivo: ___\n" +
          "Impacto funcional (trabalho, relações sociais, AVDs): ___",
        assessment:
          "TAG [ ] leve  [ ] moderada  [ ] grave.\n" +
          "Resposta ao tratamento: [ ] Boa (GAD-7 <5)  [ ] Parcial  [ ] Nenhuma\n" +
          "[ ] Afastar causas orgânicas se não investigado: hipertireoidismo, arritmia, anemia",
        plan:
          "1ª linha farmacológica: ISRS (sertralina 50–200 mg ou escitalopram 10–20 mg).\n" +
          "Aguardar 4–6 semanas de dose terapêutica antes de avaliar resposta.\n" +
          "[ ] Manter  /  [ ] Ajustar farmacoterapia\n" +
          "[ ] Encaminhar psicoterapia — TCC é padrão-ouro para TAG\n" +
          "[ ] Encaminhar CAPS se: grave, refratário ou impacto funcional severo\n" +
          "Evitar benzodiazepínicos como manutenção (uso pontual e limitado no tempo).\n" +
          "Retorno em ___ semanas.",
      },
      patientInstructions:
        "— Técnicas de respiração e relaxamento ajudam a controlar as crises\n" +
        "— Reduzir cafeína (café, chá preto, energéticos) e álcool — pioram a ansiedade\n" +
        "— Atividade física regular reduz ansiedade de forma comprovada\n" +
        "— Manter rotina de sono — privação de sono intensifica os sintomas\n" +
        "— O tratamento funciona melhor combinando medicamento com terapia",
    },
  },

  // ── DRC ───────────────────────────────────────────────────────────────────
  {
    id: "drc_retorno",
    name: "DRC — Retorno",
    description: "Retorno de Doença Renal Crônica — estadiamento KDIGO e nefroproteção",
    category: "cronico",
    source: "KDIGO 2022 CKD Clinical Practice Guidelines; MS. Linha de Cuidado para Doença Renal Crônica",
    sourceUrl: "https://linhasdecuidado.saude.gov.br/portal/doenca-renal-cronica/",
    sourceYear: 2022,
    fill: {
      problems: ["DRC"],
      soap: {
        subjective:
          "Sintomas urêmicos: edema, astenia, náusea, prurido, alteração do débito urinário?\n" +
          "Adesão ao tratamento: [ ] Boa  [ ] Irregular\n" +
          "Controle da PA (meta <130/80 mmHg na DRC): ___\n" +
          "Causa de base: [ ] HAS  [ ] DM2  [ ] Outra: ___",
        assessment:
          "DRC — Estadiamento KDIGO 2022 (TFG + Albuminúria):\n" +
          "  TFG: G1 ≥90 | G2 60–89 | G3a 45–59 | G3b 30–44 | G4 15–29 | G5 <15\n" +
          "  RAC: A1 <30 | A2 30–300 | A3 >300 mg/g\n" +
          "TFG atual (CKD-EPI): ___ mL/min. RAC: ___ mg/g.\n" +
          "[ ] Encaminhar nefrologia: TFG <30 (G4–G5), RAC >300, queda progressiva de TFG",
        plan:
          "Nefroproteção:\n" +
          "[ ] IECA ou BRA — 1ª linha na DRC com proteinúria ou DM; meta PA <130/80 mmHg\n" +
          "[ ] iSGLT2 (empagliflozina / dapagliflozina) se DM + DRC — reduz progressão renal\n" +
          "Dieta: restrição de sal; avaliar potássio e proteínas conforme estágio.\n" +
          "Vacinação: influenza (anual), pneumocócica 23-valente, hepatite B.\n" +
          "Controlar TFG + RAC a cada 3–12 meses conforme estágio e risco.\n" +
          "Retorno em ___ meses.",
      },
      requestedExams:
        "— Creatinina + TFG (CKD-EPI)\n" +
        "— RAC — razão albumina/creatinina (urina spot)\n" +
        "— Potássio (especialmente com IECA/BRA/iSGLT2)\n" +
        "— Sódio, bicarbonato\n" +
        "— Hemograma (rastreio anemia da DRC)\n" +
        "— Fósforo, PTH, vitamina D (a partir de G3b)",
      patientInstructions:
        "— Controlar rigorosamente a pressão arterial — é o principal fator de proteção dos rins\n" +
        "— Reduzir sal: máximo 5 g/dia\n" +
        "— Controle glicêmico rigoroso protege os rins em pacientes com DM\n" +
        "— NÃO usar anti-inflamatórios (ibuprofeno, diclofenaco, naproxeno) — lesionam os rins\n" +
        "— Vacinar-se contra gripe (anual) e pneumonia\n" +
        "— Comunicar qualquer mudança no volume de urina ou inchaço",
    },
  },

  // ── Gota ──────────────────────────────────────────────────────────────────
  {
    id: "gota_retorno",
    name: "Gota — Retorno",
    description: "Retorno de gota — meta de ácido úrico e prevenção de crises",
    category: "cronico",
    source: "SBR. Consenso Brasileiro para o Diagnóstico e Tratamento da Gota, 2022",
    sourceUrl: "https://www.reumatologia.org.br/",
    sourceYear: 2022,
    fill: {
      problems: ["Gota"],
      soap: {
        subjective:
          "Crises de artrite gotosa nos últimos 12 meses: ___. Última crise: ___ — articulação: ___\n" +
          "Em uso de alopurinol: ___ mg/dia. Adesão: [ ] Regular  [ ] Irregular\n" +
          "Tofos: [ ] Ausentes  [ ] Presentes — localização: ___\n" +
          "Dieta: carnes vermelhas, frutos do mar, miúdos, álcool (cerveja), refrigerantes com frutose?",
        assessment:
          "Gota [ ] controlada (AU sérico na meta)  /  [ ] não controlada.\n" +
          "Ácido úrico sérico atual: ___ mg/dL.\n" +
          "Meta AU: <6 mg/dL (geral); <5 mg/dL se tofos ou artropatia crônica (SBR 2022).",
        plan:
          "Uricossupressor: alopurinol — iniciar com 100 mg/dia; aumentar 100 mg a cada 4 semanas até meta.\n" +
          "[ ] Manter dose atual  /  [ ] Aumentar alopurinol (máx. 900 mg/dia; ajustar para TFG)\n" +
          "NÃO iniciar/ajustar alopurinol durante crise aguda — aguardar 2–4 semanas pós-crise.\n" +
          "[ ] Profilaxia durante ajuste: colchicina 0,5 mg/dia (ou AINE) por até 6 meses\n" +
          "Retorno em ___ meses com ácido úrico de controle.",
      },
      requestedExams:
        "— Ácido úrico sérico (meta <6 mg/dL)\n" +
        "— Creatinina + TFG (alopurinol requer ajuste de dose na DRC)\n" +
        "— Lipidograma, glicemia (síndrome metabólica frequentemente associada)\n" +
        "— Uricosúria 24h (se avaliar febuxostate)",
      patientInstructions:
        "— Reduzir: carnes vermelhas, frutos do mar, miúdos, cervejas — aumentam o ácido úrico\n" +
        "— Evitar refrigerantes e sucos industriais com frutose\n" +
        "— Aumentar ingestão de água: ≥2 litros/dia\n" +
        "— Manter peso saudável — obesidade aumenta o ácido úrico\n" +
        "— Em crise aguda: repouso, gelo local, usar analgésico prescrito\n" +
        "— NÃO interromper o alopurinol durante a crise — continuar o tratamento de base",
    },
  },

  // ── Osteoporose ───────────────────────────────────────────────────────────
  {
    id: "osteoporose_retorno",
    name: "Osteoporose — Retorno",
    description: "Retorno de osteoporose — densitometria, risco de fratura e PCDT MS",
    category: "cronico",
    source: "MS. PCDT Osteoporose. Portaria SCTIE/MS nº 39/2022",
    sourceUrl: "https://www.gov.br/saude/pt-br/assuntos/protocolos-clinicos-e-diretrizes-terapeuticas/o/osteoporose",
    sourceYear: 2022,
    fill: {
      problems: ["Osteoporose"],
      soap: {
        subjective:
          "Fraturas nos últimos 12 meses: [ ] Não  [ ] Sim — localização: ___\n" +
          "Quedas nos últimos 12 meses: ___ episódios — circunstâncias: ___\n" +
          "Uso de cálcio e vitamina D: [ ] Sim — dose/produto: ___  [ ] Não\n" +
          "Adesão ao bisfosfonato: [ ] Regular (em jejum com água)  [ ] Irregular\n" +
          "Fatores de risco: tabagismo, etilismo, corticoterapia crônica, imobilismo?",
        assessment:
          "Densitometria óssea (DXA) — data: ___\n" +
          "  Coluna lombar L1–L4: T-score ___\n" +
          "  Fêmur total / colo femoral: T-score ___\n" +
          "  Classificação OMS: Osteopenia T-score −1 a −2,5 | Osteoporose T-score ≤ −2,5\n" +
          "FRAX (risco fratura 10 anos): Quadril: ___% | Major osteoporótica: ___%",
        plan:
          "Cálcio total: 1.000–1.200 mg/dia (via dieta preferencialmente; suplementar se necessário).\n" +
          "Vitamina D: meta sérica 30–60 ng/mL; suplementar 1.000–2.000 UI/dia se deficiente.\n" +
          "[ ] Alendronato 70 mg 1×/semana VO — 1ª linha no PCDT MS\n" +
          "    (Tomar com água, em jejum, permanecer em pé ou sentado por 30 min após)\n" +
          "[ ] Exercícios de resistência e equilíbrio — reduzem risco de queda e fratura\n" +
          "[ ] Avaliar risco de quedas e adaptações no domicílio\n" +
          "Nova densitometria em 1–2 anos após início ou modificação do tratamento.\n" +
          "Retorno em ___ meses.",
      },
      requestedExams:
        "— Densitometria óssea (DXA) — periodicidade conforme risco\n" +
        "— Vitamina D sérica (25-OH colecalciferol)\n" +
        "— Cálcio sérico, fósforo\n" +
        "— PTH (se hipercalcemia ou suspeita de hiperparatireoidismo secundário)\n" +
        "— TSH (hipertireoidismo é fator de risco independente para osteoporose)\n" +
        "— CTX (marcador de reabsorção óssea — avalia resposta ao bisfosfonato)",
      patientInstructions:
        "— Alendronato: tomar em jejum com copo cheio de água; permanecer em pé ou sentado por 30 min\n" +
        "— Não tomar alendronato junto com cálcio, antiácidos ou outros medicamentos\n" +
        "— Aumentar cálcio na dieta: leite, iogurte, queijo, couve, brócolis, sardinha\n" +
        "— Exposição solar de 15–30 min/dia (braços e pernas) — vitamina D natural\n" +
        "— Exercícios com suporte de peso (caminhada, musculação leve) fortalecem os ossos\n" +
        "— Reduzir risco de quedas em casa: tapetes antiderrapantes, corrimãos, boa iluminação",
    },
  },

  // ── ICC ───────────────────────────────────────────────────────────────────
  {
    id: "icc_retorno",
    name: "ICC — Retorno",
    description: "Retorno de Insuficiência Cardíaca Crônica — classe funcional e otimização da farmacoterapia",
    category: "cronico",
    source: "SBC. Diretriz Brasileira de Insuficiência Cardíaca Crônica e Aguda, 2023",
    sourceUrl: "https://www.arquivosonline.com.br/",
    sourceYear: 2023,
    fill: {
      problems: ["ICC"],
      soap: {
        subjective:
          "Dispneia: [ ] Ausente  [ ] Grandes esforços (CF I–II)  [ ] Pequenos esforços (CF III)  [ ] Repouso (CF IV)\n" +
          "Ortopneia: ___ travesseiros. DPN (dispneia paroxística noturna): [ ] Sim  [ ] Não\n" +
          "Edema de MMII: [ ] Ausente  [ ] +/4  [ ] ++/4  [ ] +++/4\n" +
          "Peso diário: ___ kg. Ganho ≥2 kg em 3 dias: [ ] Sim (sinal de descompensação)  [ ] Não\n" +
          "Adesão à farmacoterapia e restrição de sódio/líquidos: ___",
        assessment:
          "ICC — Fração de Ejeção:\n" +
          "  [ ] ICFEr (FEVE <40%)  [ ] ICFEi (FEVE 40–49%)  [ ] ICFEp (FEVE ≥50%)\n" +
          "Classe funcional NYHA: [ ] I  [ ] II  [ ] III  [ ] IV\n" +
          "[ ] Compensada  /  [ ] Descompensada — avaliar internação ou encaminhamento urgente",
        plan:
          "ICFEr — 4 pilares da terapia baseada em evidências (SBC 2023):\n" +
          "  1. IECA/BRA ou ARNI (sacubitril-valsartana)\n" +
          "  2. Beta-bloqueador (carvedilol, bisoprolol ou succinato de metoprolol)\n" +
          "  3. ARM (espironolactona ou eplerenona)\n" +
          "  4. iSGLT2 (empagliflozina ou dapagliflozina)\n" +
          "[ ] Revisar e otimizar farmacoterapia conforme tolerância/PA/FC\n" +
          "Monitorar creatinina + potássio (especialmente com IECA + ARM).\n" +
          "Restrição hídrica 1,5 L/dia se CF III–IV. Sal <2 g/dia.\n" +
          "[ ] Encaminhar cardiologia: FEVE <35%, candidato a CDI/ressincronizador, CF III–IV refratária",
      },
      requestedExams:
        "— BNP ou NT-proBNP (monitoramento de descompensação)\n" +
        "— Creatinina + TFG + potássio (controle de IECA, ARM, iSGLT2)\n" +
        "— Hemograma (anemia piora a ICC)\n" +
        "— ECG\n" +
        "— Ecocardiograma (periodicidade conforme evolução clínica)",
      patientInstructions:
        "— Pesar-se TODOS OS DIAS pela manhã, em jejum. Procurar serviço se ganhar ≥2 kg em 3 dias\n" +
        "— Restringir sal: máximo 2 g/dia\n" +
        "— Limitar líquidos: ~1,5 litros/dia se orientado\n" +
        "— NÃO usar anti-inflamatórios (ibuprofeno, diclofenaco) — pioram a ICC\n" +
        "— Manter todas as medicações — muitas controlam a progressão da doença\n" +
        "— Vacinas em dia: influenza (anual) e pneumocócica",
    },
  },

  // ==========================================================================
  // AGUDOS (Sessão 14.5)
  // ==========================================================================

  // ── Síndrome Gripal / IRA ──────────────────────────────────────────────────
  {
    id: "sindrome_gripal",
    name: "Síndrome Gripal / IRA — Atendimento",
    description: "Atendimento de síndrome gripal e infecção respiratória aguda na APS",
    category: "agudo",
    source: "MS. Protocolo de Manejo Clínico da Gripe na Atenção Primária à Saúde, 2023",
    sourceUrl: "https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/i/influenza",
    sourceYear: 2023,
    fill: {
      soap: {
        subjective:
          "Início dos sintomas: ___. Febre: [ ] Sim — máx: ___°C  [ ] Não\n" +
          "Sintomas: tosse, coriza, congestão nasal, dor de garganta, mialgia, cefaleia, prostração?\n" +
          "Dispneia ou desconforto respiratório: [ ] Sim  [ ] Não\n" +
          "Grupo de risco: [ ] Gestante  [ ] Idoso ≥60 anos  [ ] Imunodeprimido  [ ] DM/Cardiopatia/Nefropatia  [ ] Nenhum\n" +
          "Vacinação contra influenza nesta temporada: [ ] Sim  [ ] Não  [ ] Não sabe",
        assessment:
          "Síndrome gripal (critério MS): febre + tosse OU dor de garganta de início abrupto.\n" +
          "Sinais de alerta (indicam internação):\n" +
          "  [ ] SpO2 <95%  [ ] FR >24 irpm  [ ] Confusão mental  [ ] Hipotensão  [ ] Cianose\n" +
          "  [ ] Piora clínica após melhora inicial\n" +
          "Conclusão: [ ] Síndrome gripal sem sinais de alerta — manejo ambulatorial\n" +
          "           [ ] Com sinal de alerta — encaminhar hospital",
        plan:
          "[ ] Oseltamivir 75 mg 2×/dia por 5 dias — indicar se: grupo de risco OU forma grave\n" +
          "[ ] Sintomáticos: paracetamol 500–750 mg 6/6h se febre/dor (evitar AAS <18 anos)\n" +
          "Isolamento domiciliar por 5–7 dias (ou até 24h afebril sem antitérmico).\n" +
          "Retorno imediato se: dispneia, SpO2 cair, confusão mental, piora após melhora.",
      },
      patientInstructions:
        "— Repouso e hidratação: ≥2 litros de líquidos/dia\n" +
        "— Paracetamol para febre e dor — EVITAR AAS (aspirina) em crianças e adolescentes\n" +
        "— Isolamento: ficar em casa por 5–7 dias, usar máscara se precisar sair\n" +
        "— Retornar IMEDIATAMENTE se: falta de ar, lábios azulados, confusão mental, febre que não cede com antitérmico\n" +
        "— Vacinar-se contra gripe na próxima campanha — especialmente grupos de risco",
    },
  },

  // ── ITU não complicada ────────────────────────────────────────────────────
  {
    id: "itu_nao_complicada",
    name: "ITU não complicada — Atendimento",
    description: "Cistite aguda não complicada em mulher adulta não gestante",
    category: "agudo",
    source: "MS/FEBRASGO. Protocolo Clínico de ITU não Complicada na Atenção Primária, 2021; MS. RENAME 2023",
    sourceUrl: "https://www.gov.br/saude/pt-br/assuntos/rename",
    sourceYear: 2021,
    fill: {
      soap: {
        subjective:
          "Disúria: [ ] Sim  [ ] Não. Polaciúria: [ ] Sim  [ ] Não. Urgência miccional: [ ] Sim  [ ] Não\n" +
          "Urina turva ou com odor: [ ] Sim  [ ] Não. Hematúria macroscópica: [ ] Sim  [ ] Não\n" +
          "Febre: [ ] Não  [ ] Sim — ___°C. Dor lombar / costovertebral: [ ] Não  [ ] Sim\n" +
          "ITU recorrente (≥3/ano ou ≥2 em 6 meses): [ ] Não  [ ] Sim\n" +
          "Gestante: [ ] Não (pré-requisito para ITU não complicada)  [ ] Sim — usar protocolo gestante",
        assessment:
          "[ ] Cistite não complicada (disúria + polaciúria SEM febre/dor lombar em mulher não gestante)\n" +
          "[ ] Pielonefrite (febre + dor lombar + sintomas urinários) — antibioticoterapia mais longa\n" +
          "EAS/urinocultura: leucocitúria: ___. Nitrito: ___. Cultura: ___\n" +
          "Diagnóstico clínico suficiente para cistite típica — EAS e cultura não obrigatórios de rotina",
        plan:
          "Cistite não complicada — antibiótico de 1ª linha (MS/RENAME 2023):\n" +
          "  [ ] Fosfomicina trometamol 3 g dose única (alta adesão; preferida quando disponível)\n" +
          "  [ ] Nitrofurantoína 100 mg 2×/dia por 5 dias\n" +
          "  [ ] Trimetoprim-sulfametoxazol 160/800 mg 2×/dia por 3 dias (se resistência local <20%)\n" +
          "Retorno se não melhora em 48–72h, febre ou dor lombar.",
      },
      patientInstructions:
        "— Aumentar ingestão hídrica: ≥2 litros/dia\n" +
        "— Completar todo o antibiótico mesmo que os sintomas melhorem antes\n" +
        "— Higiene íntima: limpar sempre de frente para trás; urinar após relação sexual\n" +
        "— Retornar se: febre, dor nas costas, não melhorar em 48h ou piorar",
    },
  },

  // ── Amigdalite / Faringite ────────────────────────────────────────────────
  {
    id: "amigdalite_faringite",
    name: "Amigdalite / Faringite — Atendimento",
    description: "Faringoamigdalite aguda — score de Centor/McIsaac para decisão de antibiótico",
    category: "agudo",
    source: "Score McIsaac (Can Fam Physician, 2003); MS. RENAME 2023; SBPTA — Diretrizes de Tonsilite Aguda",
    sourceUrl: "https://www.gov.br/saude/pt-br/assuntos/rename",
    sourceYear: 2023,
    fill: {
      soap: {
        subjective:
          "Início da dor de garganta: ___. Febre: [ ] Sim — ___°C  [ ] Não\n" +
          "Tosse: [ ] Ausente (ponto a favor de estreptococo)  [ ] Presente\n" +
          "Coriza / obstrução nasal: [ ] Presente (sugestivo de vírus)  [ ] Ausente\n" +
          "Dificuldade de deglutição: [ ] Leve  [ ] Moderada  [ ] Grave (não engole saliva)\n" +
          "Trismo (dificuldade de abrir a boca): [ ] Não  [ ] Sim — suspeita de abscesso periamigdaliano",
        assessment:
          "Score de Centor/McIsaac — probabilidade de estreptococo do grupo A (SBHGA):\n" +
          "  +1 Exsudato amigdaliano  +1 Linfonodo cervical anterior doloroso\n" +
          "  +1 Febre (>38°C)  +1 Ausência de tosse  −1 Idade ≥45 anos\n" +
          "  SCORE TOTAL: ___\n" +
          "  0–1 ponto: origem viral — antibiótico NÃO indicado\n" +
          "  2–3 pontos: considerar teste rápido para SBHGA; antibiótico se positivo\n" +
          "  ≥4 pontos: antibioticoterapia empírica indicada\n" +
          "[ ] Abscesso periamigdaliano: trismo + desvio de úvula + febre — ENCAMINHAR emergência",
        plan:
          "[ ] Score 0–1: sintomáticos apenas — analgesia/antitérmico, gargarejos salinos\n" +
          "[ ] Score ≥4 (ou teste rápido +): Amoxicilina 500 mg 3×/dia por 10 dias (1ª linha — MS/RENAME)\n" +
          "  [ ] Alergia à penicilina: Azitromicina 500 mg 1×/dia por 5 dias\n" +
          "[ ] Encaminhar emergência: abscesso periamigdaliano, estridor, disfagia grave, toxemia",
      },
      patientInstructions:
        "— Gargarejos com água morna e sal: alívio da inflamação e dor\n" +
        "— Paracetamol ou ibuprofeno para dor e febre\n" +
        "— Manter boa hidratação; preferir alimentos frios ou pastosos se dor ao engolir\n" +
        "— Se antibiótico prescrito: completar os 10 dias para evitar recidiva e resistência bacteriana\n" +
        "— Retornar se: febre persistir >48h com antibiótico, piora súbita ou dificuldade de abrir a boca",
    },
  },

  // ── Dor Lombar Aguda ──────────────────────────────────────────────────────
  {
    id: "dor_lombar_aguda",
    name: "Dor Lombar Aguda — Atendimento",
    description: "Dor lombar aguda inespecífica — identificar bandeiras vermelhas e manejo conservador",
    category: "agudo",
    source: "MS. Caderno de Atenção Básica — Dorsalgia e Dor Musculoesquelética, 2023",
    sourceUrl: "https://bvsms.saude.gov.br/",
    sourceYear: 2023,
    fill: {
      soap: {
        subjective:
          "Início da dor: ___. Mecanismo (esforço, movimento súbito, espontâneo): ___\n" +
          "Intensidade: ___/10 (EVA). Melhora com repouso: [ ] Sim  [ ] Não\n" +
          "Irradiação para membro inferior: [ ] Não  [ ] Sim — nível: ___. Parestesias: [ ] Sim  [ ] Não\n" +
          "Fraqueza em membros inferiores: [ ] Não  [ ] Sim — descrever: ___\n" +
          "Disfunção vesical ou intestinal (incontinência/retenção súbita): [ ] Não  [ ] Sim (EMERGÊNCIA — Cauda Equina!)",
        assessment:
          "Bandeiras vermelhas — investigar causa específica se presentes:\n" +
          "  [ ] Febre ou perda de peso inexplicada (infecção / tumor)\n" +
          "  [ ] Trauma significativo ou osteoporose (fratura)\n" +
          "  [ ] Déficit neurológico progressivo (compressão medular)\n" +
          "  [ ] Disfunção vesical / intestinal (síndrome de Cauda Equina — EMERGÊNCIA)\n" +
          "  [ ] Dor não melhora com nenhuma posição (tumor, infecção)\n" +
          "[ ] Dor lombar inespecífica — sem bandeiras vermelhas (90% dos casos)\n" +
          "[ ] Ciatalgia (dor irradiada + parestesias em dermátomo L4–S1)",
        plan:
          "[ ] Paracetamol 500–750 mg 6/6h (1ª linha — MS 2023) ± ibuprofeno 400–600 mg 8/8h com refeição\n" +
          "[ ] Ciclobenzaprina 5 mg 3×/dia por ≤7 dias se espasmo muscular intenso\n" +
          "MANTER ATIVIDADE FÍSICA adaptada — repouso prolongado piora o prognóstico.\n" +
          "[ ] Fisioterapia se não melhora em 4 semanas\n" +
          "[ ] Imagem (Rx/RM): indicar SOMENTE se bandeiras vermelhas — não de rotina\n" +
          "Prognóstico: 90% dos casos agudos melhoram em 4–6 semanas sem intervenção específica.",
      },
      patientInstructions:
        "— CONTINUAR SE MOVIMENTANDO — repouso total piora a recuperação\n" +
        "— Calor local (bolsa de água quente) alivia o espasmo muscular\n" +
        "— Tomar os analgésicos no horário prescrito — não esperar a dor piorar\n" +
        "— Evitar carregar peso excessivo durante a fase aguda\n" +
        "— Raio-X ou ressonância NÃO têm indicação neste momento\n" +
        "— Retornar IMEDIATAMENTE se: fraqueza ou formigamento na perna, perda de controle da bexiga ou intestino",
    },
  },

  // ── Cefaleia ──────────────────────────────────────────────────────────────
  {
    id: "cefaleia",
    name: "Cefaleia Tensional / Enxaqueca — Atendimento",
    description: "Avaliação e manejo de cefaleia primária na APS — triagem de bandeiras vermelhas",
    category: "agudo",
    source: "SBCef. Diretrizes Diagnósticas e Terapêuticas de Cefaleias Primárias do Adulto, 2022",
    sourceUrl: "https://sbcef.org.br/",
    sourceYear: 2022,
    fill: {
      soap: {
        subjective:
          "Frequência: ___ dias/mês. Início desta cefaleia: ___\n" +
          "Características: localização (uni/bilateral): ___. Qualidade (latejante/pressão): ___\n" +
          "Intensidade (0–10): ___. Duração: ___. Náuseas/vômitos: [ ] Sim  [ ] Não\n" +
          "Fotofobia / fonofobia: [ ] Sim  [ ] Não. Aura: [ ] Não  [ ] Sim — descrever: ___\n" +
          "Uso de analgésico: ___ dias/mês (abuso se >10 dias/mês por >3 meses)\n" +
          "Gatilhos: estresse, privação de sono, jejum, álcool, menstruação?",
        assessment:
          "BANDEIRAS VERMELHAS (investigar causas secundárias graves):\n" +
          "  [ ] Início súbito (trovão — pior cefaleia da vida): hemorragia subaracnóidea\n" +
          "  [ ] Febre + rigidez nucal: meningite\n" +
          "  [ ] Déficit neurológico focal ou rebaixamento de consciência\n" +
          "  [ ] Primeiro episódio em paciente >50 anos\n" +
          "  [ ] Piora progressiva sem período sem dor\n" +
          "Classificação (ICHD-3):\n" +
          "  [ ] Cefaleia tensional episódica  [ ] Cefaleia tensional crônica (≥15 dias/mês)\n" +
          "  [ ] Enxaqueca sem aura  [ ] Enxaqueca com aura\n" +
          "  Critérios enxaqueca: unilateral + pulsátil + moderada/grave + piora com atividade + náusea OU foto/fonofobia",
        plan:
          "CRISE — Tensional: AINEs (ibuprofeno 400–600 mg ou AAS 500–1.000 mg) ou paracetamol 750 mg.\n" +
          "CRISE — Enxaqueca leve/moderada: ibuprofeno 400–600 mg + metoclopramida 10 mg se náusea.\n" +
          "CRISE — Enxaqueca moderada/grave: triptano (sumatriptana 50–100 mg VO ou 6 mg SC).\n" +
          "PROFILAXIA (≥4 crises/mês ou crises incapacitantes):\n" +
          "  [ ] Propranolol 40–80 mg/dia  [ ] Amitriptilina 10–25 mg/noite  [ ] Topiramato 25–100 mg/dia\n" +
          "Alertar sobre cefaleia por abuso de analgésico (>10 dias/mês por >3 meses → cefaleia crônica).",
      },
      patientInstructions:
        "— Anotar cefaleias em diário: data, duração, intensidade, desencadeante, analgésico usado\n" +
        "— Identificar e evitar gatilhos pessoais: estresse, privação de sono, jejum prolongado, álcool\n" +
        "— Manter horários regulares de sono e refeições\n" +
        "— NÃO usar analgésico mais de 10 dias por mês — causa cefaleia de rebote\n" +
        "— Buscar emergência IMEDIATAMENTE se: cefaleia 'a pior da vida', início em segundos, febre + rigidez no pescoço, fraqueza súbita ou alteração visual",
    },
  },

  // ==========================================================================
  // PREVENTIVOS (Sessão 14.5)
  // ==========================================================================

  // ── Saúde da Mulher ───────────────────────────────────────────────────────
  {
    id: "saude_mulher",
    name: "Saúde da Mulher — Rastreio e Preventivo",
    description: "Consulta de saúde da mulher — rastreamentos oncológicos e planejamento reprodutivo",
    category: "preventivo",
    source: "MS/INCA. Diretrizes para Rastreamento do Câncer no Brasil, 2024; MS. Protocolos de Saúde da Mulher na APS",
    sourceUrl: "https://www.inca.gov.br/publicacoes/livros/rastreamento-do-cancer",
    sourceYear: 2024,
    fill: {
      preventions: ["Papanicolau em dia", "Mamografia em dia"],
      soap: {
        subjective:
          "Queixa principal: ___\n" +
          "DUM: ___. Ciclo: ___ dias. Regularidade: ___\n" +
          "Queixas ginecológicas: corrimento, dispareunia, sangramento irregular, dismenorreia?\n" +
          "Método anticoncepcional: ___. Adequado ao perfil/desejo: [ ] Sim  [ ] Não\n" +
          "Planejamento reprodutivo: [ ] Deseja gestação  [ ] Não deseja — método atual suficiente?\n" +
          "Última citologia oncótica (Papanicolau): ___. Resultado: ___\n" +
          "Última mamografia: ___. Resultado: ___",
        assessment:
          "Rastreamento oncológico — Diretrizes MS/INCA 2024:\n" +
          "  Colo de útero: Papanicolau dos 25 aos 64 anos\n" +
          "    Periodicidade: anual nos 2 primeiros anos se normais; a cada 3 anos após\n" +
          "  Mama: mamografia dos 50 aos 69 anos a cada 2 anos\n" +
          "    Risco elevado (BRCA, familiar 1º grau <50 anos): iniciar mais cedo\n" +
          "Planejamento familiar: [ ] Adequado  [ ] Necessita orientação / novo método\n" +
          "ISTs: [ ] Sem risco aumentado  [ ] Rastrear sífilis/HIV/hepatite B se indicado",
        plan:
          "[ ] Coleta de Papanicolau (se indicado)\n" +
          "[ ] Solicitar mamografia (se 50–69 anos ou risco elevado)\n" +
          "[ ] Orientar / prescrever método anticoncepcional adequado\n" +
          "[ ] Solicitar sorologias IST se indicado (HIV, sífilis, hepatite B/C)\n" +
          "[ ] Encaminhar colposcopia se Papanicolau alterado (ASC-US+, LSIL+)\n" +
          "[ ] Encaminhar mastologia se nódulo palpável ou BI-RADS ≥4\n" +
          "Vacina HPV: oferecer a mulheres de 9 a 45 anos conforme Calendário MS.",
      },
      patientInstructions:
        "— Papanicolau detecta alterações anos antes do câncer — não pular\n" +
        "— Mamografia a cada 2 anos dos 50 aos 69 anos — programar na saída da consulta\n" +
        "— Retornar se: corrimento com odor intenso, sangramento fora do período, nódulo na mama\n" +
        "— Conversar sobre planejamento familiar — há métodos para cada perfil e momento de vida",
    },
  },

  // ── Saúde do Idoso ────────────────────────────────────────────────────────
  {
    id: "saude_idoso",
    name: "Saúde do Idoso — Avaliação Funcional",
    description: "Consulta de saúde do idoso — avaliação funcional global, rastreios e prevenção de quedas",
    category: "preventivo",
    source: "MS. Caderno de Atenção Básica nº 19 — Envelhecimento e Saúde da Pessoa Idosa, 2023",
    sourceUrl: "https://bvsms.saude.gov.br/bvs/publicacoes/envelhecimento_saude_pessoa_idosa.pdf",
    sourceYear: 2023,
    fill: {
      preventions: ["Influenza (vacinado)", "Avaliação visual (idoso)", "Avaliação auditiva (idoso)", "Densitometria em dia"],
      soap: {
        subjective:
          "Queixa principal: ___\n" +
          "AVDs básicas (banho, higiene, alimentação, transferência): [ ] Independente  [ ] Dependente parcial: ___\n" +
          "AVDs instrumentais (compras, finanças, transporte, medicamentos): [ ] Preservadas  [ ] Comprometidas: ___\n" +
          "Quedas nos últimos 12 meses: ___ episódios. Medo de cair: [ ] Sim  [ ] Não\n" +
          "Cognição — queixas de memória: [ ] Sim  [ ] Não. Familiar relata alteração: [ ] Sim  [ ] Não\n" +
          "Humor — rastreio depressão (GDS-4 ou PHQ-2): ___\n" +
          "Polifarmácia (≥5 medicamentos): [ ] Sim — listar: ___  [ ] Não",
        objective:
          "Timed Up and Go (TUG): ___ segundos (>12s = alto risco de queda).\n" +
          "Mini-Exame do Estado Mental (MEEM): ___ pontos\n" +
          "  (corte: analfabeto ≥13 | 1–7 anos esc. ≥18 | ≥8 anos esc. ≥26)\n" +
          "Força de preensão palmar (handgrip): ___ kg (sarcopenia se <27 kg homem / <16 kg mulher).",
        assessment:
          "[ ] Envelhecimento saudável  [ ] Pré-frágil  [ ] Frágil\n" +
          "Fenótipo de Fried (fragilidade): perda de peso, fadiga, fraqueza, lentidão, sedentarismo\n" +
          "  (≥3 critérios = frágil; 1–2 = pré-frágil)\n" +
          "Polifarmácia: revisar Critérios de Beers — medicamentos potencialmente inapropriados em idosos",
        plan:
          "[ ] Revisar lista de medicamentos — suspender ou substituir inapropriados (Critérios de Beers)\n" +
          "[ ] Prescrever exercícios de equilíbrio e fortalecimento (previne quedas)\n" +
          "[ ] Orientar adaptações no domicílio: tapetes, iluminação, corrimãos\n" +
          "[ ] Encaminhar fisioterapia se risco de queda ou sarcopenia\n" +
          "[ ] Solicitar densitometria se ainda não realizada ou >2 anos\n" +
          "[ ] Encaminhar oftalmologia e audiologia se déficit identificado\n" +
          "[ ] Encaminhar NASF/assistência social se dependência funcional\n" +
          "Vacinação: influenza (anual), pneumocócica 23-valente, dT/dTpa.",
      },
      patientInstructions:
        "— Atividade física regular — caminhada e exercícios de equilíbrio previnem quedas\n" +
        "— Adaptar a casa: retirar tapetes soltos, instalar corrimãos, melhorar iluminação\n" +
        "— Não tomar medicamentos por conta própria — comunicar ao médico qualquer remédio novo\n" +
        "— Vacinar-se contra a gripe todo ano\n" +
        "— Manter atividades sociais e estimulação cognitiva — leitura, jogos, conversa",
    },
  },

  // ── Saúde do Homem ────────────────────────────────────────────────────────
  {
    id: "saude_homem",
    name: "Saúde do Homem — Rastreio e Preventivo",
    description: "Consulta de saúde do homem — rastreamentos, ISTs e prevenção na APS",
    category: "preventivo",
    source: "MS. Política Nacional de Atenção Integral à Saúde do Homem (PNAISH), 2023",
    sourceUrl: "https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-do-homem",
    sourceYear: 2023,
    fill: {
      preventions: ["PSA (disc. compartilhada)", "Colonoscopia / PSOF em dia"],
      soap: {
        subjective:
          "Queixa principal: ___\n" +
          "Sintomas urinários (jato fraco, hesitância, noctúria, urgência)? IPSS: ___ pontos\n" +
          "Saúde sexual: disfunção erétil, ejaculação precoce? [ ] Sim — descrever: ___  [ ] Não\n" +
          "Tabagismo: [ ] Nunca  [ ] Ex — cessação há: ___  [ ] Ativo — ___ cigarros/dia\n" +
          "Álcool: doses/semana: ___. AUDIT-C: ___ pontos (positivo: ≥3 homens)\n" +
          "Saúde mental: humor, estresse, sono: ___",
        assessment:
          "Rastreamentos prioritários — PNAISH 2023:\n" +
          "  PSA: decisão compartilhada ≥50 anos (ou ≥45 se afrodescendente ou histórico familiar)\n" +
          "    Informar: alto índice de falso-positivo; biópsia tem riscos; benefício em rastreio universal incerto\n" +
          "  Câncer colorretal: PSOF anual (50–75 anos) ou colonoscopia a cada 10 anos\n" +
          "  HAS, DM, dislipidemia: rastrear conforme risco (PA, glicemia, lipidograma)\n" +
          "  ISTs: oferecer teste de HIV, sífilis e hepatite B/C se comportamento de risco",
        plan:
          "[ ] Decisão compartilhada sobre PSA — explicar benefícios e limitações antes de solicitar\n" +
          "[ ] Solicitar PSOF ou encaminhar colonoscopia (50–75 anos)\n" +
          "[ ] Rastrear HAS, DM2 e dislipidemia: PA + glicemia + lipidograma\n" +
          "[ ] Abordagem tabagismo: aconselhamento + farmacoterapia (vareniclina, bupropiona, TRN) se motivado\n" +
          "[ ] Intervenção breve no álcool se AUDIT-C positivo\n" +
          "[ ] Encaminhar urologia se: IPSS >7 com impacto na qualidade de vida, PSA alterado",
      },
      patientInstructions:
        "— Consultas preventivas são para todos — não esperar ter doença para ir ao médico\n" +
        "— PSA tem limitações importantes — discutir com o médico antes de solicitar\n" +
        "— Tabagismo: a cessação é o ato com maior impacto individual em saúde — o médico pode ajudar\n" +
        "— Álcool: mais de 14 doses/semana aumenta risco de câncer, cirrose, cardiopatia e acidentes\n" +
        "— Saúde sexual faz parte da saúde geral — pode e deve ser discutida na consulta",
    },
  },

  // ==========================================================================
  // PRÉ-NATAL E PUERICULTURA (Sessão 14.5)
  // ==========================================================================

  // ── Pré-natal ─────────────────────────────────────────────────────────────
  {
    id: "prenatal",
    name: "Pré-natal — Consulta",
    description: "Consulta de pré-natal de baixo risco na APS — roteiro trimestral e exames obrigatórios",
    category: "preventivo",
    source: "MS. CAB nº 32 — Atenção ao Pré-Natal de Baixo Risco, 2013 (atualizado 2022); MS. Rede Cegonha",
    sourceUrl: "https://bvsms.saude.gov.br/bvs/publicacoes/cadernos_atencao_basica_32_prenatal.pdf",
    sourceYear: 2022,
    fill: {
      soap: {
        subjective:
          "IG (idade gestacional): ___ semanas + ___ dias. DUM: ___. DPP: ___\n" +
          "Queixas: náuseas/vômitos, dor pélvica/lombar, corrimento, sangramento, cefaleia, edema, visão turva?\n" +
          "Movimentos fetais (após 20 sem): [ ] Presentes  [ ] Diminuídos — data de início da percepção: ___\n" +
          "Contrações: [ ] Braxton-Hicks (irregulares, sem dor)  [ ] Regulares — descrever: ___\n" +
          "Vacinação: dTpa (≥20 sem): [ ] Feita  [ ] Pendente. Influenza: [ ] Feita  [ ] Pendente\n" +
          "Suplementação: ácido fólico: [ ] Sim  [ ] Não. Sulfato ferroso (após 20 sem): [ ] Sim  [ ] Não",
        objective:
          "PA: ___/___. Peso: ___ kg (ganho gestacional total: ___ kg).\n" +
          "AU (altura uterina): ___ cm. BCF (batimentos cardiofetais): ___ bpm.\n" +
          "Edema: [ ] Ausente  [ ] Presente: ___. Apresentação (>34 sem): [ ] Cefálica  [ ] Pélvica  [ ] Transversa",
        assessment:
          "Pré-natal de [ ] baixo risco  /  [ ] alto risco — encaminhar pré-natal especializado.\n" +
          "\n" +
          "CRITÉRIOS DE ALTO RISCO (MS CAB 32 — encaminhar):\n" +
          "  PA ≥140/90 em 2 aferições  |  Proteinúria ≥300 mg/24h  |  Diabetes gestacional\n" +
          "  Gestação gemelar  |  Cirurgia uterina prévia  |  Histórico de pré-eclâmpsia/eclâmpsia\n" +
          "  Sangramento ativo  |  CIUR  |  Polidrâmnio ou Oligodrâmnio\n" +
          "\n" +
          "SINAIS DE ALERTA — encaminhar imediatamente:\n" +
          "  PA ≥160/110  |  Sangramento ativo  |  Ausência de movimentos fetais\n" +
          "  Convulsões  |  Cefaleia intensa + visão turva + epigastralgia  |  Edema súbito generalizado",
        plan:
          "1º TRIMESTRE (até 13ª semana):\n" +
          "  [ ] Ácido fólico 400 mcg/dia (iniciar antes da concepção; manter até 12 sem)\n" +
          "  [ ] Exames: Ht/Hb, tipagem ABO/Rh, glicemia de jejum, EAS + urocultura,\n" +
          "      sorologias: HIV, sífilis (VDRL), toxoplasmose IgM/IgG, rubéola IgG,\n" +
          "      hepatite B (HBsAg), hepatite C (anti-HCV), TSH\n" +
          "  [ ] USG 1º trimestre (11–14 sem): translucência nucal e rastreio cromossômico\n" +
          "  [ ] Papanicolau se atrasado\n" +
          "\n" +
          "2º TRIMESTRE (14ª–27ª semana):\n" +
          "  [ ] Sulfato ferroso 40 mg/dia de ferro elementar a partir de 20 semanas (profilático — MS)\n" +
          "  [ ] Exames: repetir sorologias (sífilis, HIV, toxoplasmose), hemograma\n" +
          "  [ ] TOTG 75g (24–28 semanas) — rastreio de diabetes gestacional\n" +
          "  [ ] USG morfológico 2º trimestre (20–24 semanas): anatomia fetal\n" +
          "  [ ] Vacina dTpa a partir de 20 semanas\n" +
          "\n" +
          "3º TRIMESTRE (28ª–40ª semana):\n" +
          "  [ ] Exames: repetir Ht/Hb, EAS + urocultura, sorologias (sífilis, HIV)\n" +
          "  [ ] Cultura vagino-retal para SGB (35–37 semanas)\n" +
          "  [ ] USG obstétrico (34–36 semanas): peso estimado, apresentação, LA, Doppler\n" +
          "  [ ] Orientar sinais de TP, contagem de movimentos, plano de parto, amamentação\n" +
          "\n" +
          "Frequência de consultas (mínimo MS — meta ≥8):\n" +
          "  Até 28 sem: 1 consulta/mês  |  28–36 sem: 1 consulta/2 sem  |  >36 sem: semanal",
      },
      patientInstructions:
        "— Tomar ácido fólico e sulfato ferroso conforme orientação — protegem o bebê e a mãe\n" +
        "— NÃO tomar nenhum medicamento (incluindo fitoterápicos) sem comunicar ao médico\n" +
        "— Vacinar-se: gripe (qualquer trimestre) e dTpa (a partir de 20 semanas)\n" +
        "— Após 20 semanas: contar movimentos do bebê diariamente — <10 em 2h → procurar serviço\n" +
        "— NÃO fumar, NÃO beber álcool, NÃO usar drogas — não há dose segura na gestação\n" +
        "— Retornar IMEDIATAMENTE se: sangramento, dor intensa, pressão alta, convulsão, ausência de movimentos\n" +
        "— Manter todas as consultas de pré-natal mesmo sem queixas — mínimo 6 consultas (meta: ≥8)",
    },
  },

  // ── Puericultura — Crescimento e Desenvolvimento ──────────────────────────
  {
    id: "puericultura",
    name: "Puericultura — Crescimento e Desenvolvimento",
    description: "Consulta de puericultura — vigilância de crescimento, marcos do desenvolvimento e vacinação",
    category: "preventivo",
    source: "MS. CAB nº 33 — Saúde da Criança: Crescimento e Desenvolvimento, 2012; MS. Caderneta da Criança, 2023",
    sourceUrl: "https://bvsms.saude.gov.br/bvs/publicacoes/saude_crianca_crescimento_desenvolvimento.pdf",
    sourceYear: 2023,
    fill: {
      soap: {
        subjective:
          "Idade: ___ meses / ___ anos. Queixas dos responsáveis: ___\n" +
          "Alimentação: [ ] AME (aleitamento materno exclusivo até 6 meses — MS)  [ ] Misto  [ ] Artificial  [ ] Diversificada\n" +
          "Introdução alimentar (após 6 meses): adequada? [ ] Sim  [ ] Não — orientar\n" +
          "Sono: ___ horas/dia. Posição do sono (<1 ano): [ ] Decúbito dorsal ✓  [ ] Outra — orientar\n" +
          "Desenvolvimento: responsáveis notaram alteração em visão, audição, fala ou motor? ___",
        objective:
          "Peso: ___ kg (escore-z P/I: ___ | P/E: ___). Comprimento/Estatura: ___ cm (escore-z E/I: ___).\n" +
          "IMC/I: ___ escore-z (a partir de 2 anos). Perímetro cefálico: ___ cm (registrar até 2 anos).\n" +
          "Curvas OMS (Caderneta da Criança): [ ] Crescimento adequado  [ ] Alerta: ___",
        assessment:
          "MARCOS DO DESENVOLVIMENTO — Caderneta da Criança MS 2023:\n" +
          "  2 meses:  sorriso social, fixa olhar no rosto, reage ao som\n" +
          "  4 meses:  sustenta cabeça, vocaliza, segue objeto 180°\n" +
          "  6 meses:  senta com apoio, transfere objeto entre mãos, balbucio\n" +
          "  9 meses:  senta sem apoio, engatinha, faz gesto de 'tchau'\n" +
          "  12 meses: anda com apoio, primeiras palavras (1–3 com sentido), pinça fina\n" +
          "  18 meses: anda sem apoio, ≥10 palavras, aponta o que quer\n" +
          "  24 meses: frases de 2 palavras, corre, sobe escadas com apoio\n" +
          "  36 meses: frases completas, usa talheres, faz amizades, controle esfincteriano\n" +
          "\n" +
          "Marcos desta consulta: [ ] Adequados para a idade  [ ] Atraso em: ___\n" +
          "Vacinação (PNI): [ ] Em dia  [ ] Atrasada — vacinas pendentes: ___",
        plan:
          "[ ] Plotar peso, estatura e PC nas curvas da Caderneta da Criança (curvas OMS)\n" +
          "[ ] Atualizar vacinação conforme Calendário PNI (Programa Nacional de Imunizações)\n" +
          "[ ] Orientar alimentação por faixa etária (Guia Alimentar para Crianças <2 anos — MS 2019)\n" +
          "[ ] Vitamina D: 400 UI/dia até 12 meses para amamentados exclusivamente ao seio\n" +
          "[ ] Ferro profilático: 1 mg/kg/dia de 6 a 24 meses (MS CAB 33)\n" +
          "[ ] Estimular desenvolvimento: conversar, ler, cantar, brincar desde os primeiros dias\n" +
          "[ ] Encaminhar NASF/fisioterapia/fonoaudiologia se atraso de desenvolvimento\n" +
          "[ ] Encaminhar oftalmologia se suspeita de estrabismo ou déficit visual\n" +
          "\n" +
          "Calendário de consultas de puericultura (MS CAB 33):\n" +
          "  Nascimento, 15 dias, 1, 2, 4, 6, 9, 12, 18, 24 meses; anual dos 3 aos 6 anos",
      },
      patientInstructions:
        "— Amamentação exclusiva até 6 meses — protege contra infecções, alergias e obesidade\n" +
        "— Introdução alimentar aos 6 meses: alimentos da família sem sal, açúcar ou mel (<1 ano)\n" +
        "— Crianças <1 ano: dormir de costas (barriga para cima) — previne morte súbita do lactente\n" +
        "— Telas: evitar completamente <2 anos; limitar a <1h/dia dos 2 aos 5 anos (MS)\n" +
        "— Vacinação em dia — trazer a Caderneta da Criança em todas as consultas\n" +
        "— Conversar, ler e brincar com a criança todos os dias — fundamental para o desenvolvimento\n" +
        "— Retornar se: febre, recusa alimentar, choro inconsolável ou criança não atinge marcos do desenvolvimento",
    },
  },
];
