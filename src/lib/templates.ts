// src/lib/templates.ts
//
// Templates clÃ­nicos para condiÃ§Ãµes prevalentes na AtenÃ§Ã£o PrimÃ¡ria Ã  SaÃºde (APS) brasileira.
//
// ATENÃ‡ÃƒO: TODO conteÃºdo clÃ­nico deste arquivo Ã© sourced exclusivamente de fontes oficiais
// brasileiras (MS, SBC, SBMFC). NUNCA alterar metas, critÃ©rios ou condutas sem verificar
// a diretriz atualizada citada no campo `source` de cada template.
//
// Fontes verificadas em 2026-03-28:
//   HAS   â€” MS. Linha de Cuidado HAS no Adulto, 2021. linhasdecuidado.saude.gov.br
//           MS. Caderno de AtenÃ§Ã£o BÃ¡sica nÂº 37 (HAS), 2013. bvsms.saude.gov.br
//           MS. Portaria SECTICS/MS nÂº 49/2025 (PCDT HAS). bvsms.saude.gov.br
//   DM2   â€” MS. Linha de Cuidado DM2 no Adulto. linhasdecuidado.saude.gov.br
//           MS. Caderno de AtenÃ§Ã£o BÃ¡sica nÂº 36 (DM), 2013. bvsms.saude.gov.br
//   DISPL â€” SBC. Diretriz Brasileira de Dislipidemias e Prev. Aterosclerose, 2025.
//           pmc.ncbi.nlm.nih.gov/articles/PMC12674852/
//   HIPO  â€” MS. Protocolos de Encaminhamento: Endocrinologia Adulto, 2022.
//           bvsms.saude.gov.br/bvs/publicacoes/protocolos_encaminhamento_atencao_endocrinologia_adulto.pdf
//   ASMA  â€” MS. Linha de Cuidado Asma. linhasdecuidado.saude.gov.br/portal/asma/
//   DPOC  â€” MS. Linha de Cuidado DPOC. linhasdecuidado.saude.gov.br/portal/doenca-pulmonar-obstrutiva-cronica/

import type { SoapNotes, TemplateCategory, TemplateStatus, TemplateGovernance } from "@/types";

export type { TemplateCategory, TemplateStatus, TemplateGovernance } from "@/types";

// â”€â”€â”€ Schema lean â€” uso clÃ­nico rÃ¡pido â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Campos essenciais para decisÃ£o em segundos, sem perder seguranÃ§a mÃ­nima.
// whenToUse Ã© obrigatÃ³rio em novos templates; governance deve acompanhar.

export interface ClinicalTemplate {
  // â”€â”€ IdentificaÃ§Ã£o â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  id: string;

  // â”€â”€ Formato legado (v1.0.x) â€” migration completa em 2026-04 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  name?: string;
  description?: string;
  category?: TemplateCategory;

  /** Tags para busca por palavra-chave */
  tags?: string[];
  /** Quando aplicar â€” cenÃ¡rio clÃ­nico especÃ­fico */
  whenToUse?: string;
  /** Quando NÃƒO usar â€” contraindicaÃ§Ãµes ou cenÃ¡rios inapropriados */
  whenNotToUse?: string;
  /** Dados mÃ­nimos necessÃ¡rios antes de aplicar */
  minimumData?: string[];
  /** SOAP â€” guides a documentaÃ§Ã£o, nÃ£o substitui julgamento clÃ­nico */
  soap?: {
    subjective?: string;
    assessment?: string;
    plan?: string;
    [key: string]: string | undefined;
  };
  /** OrientaÃ§Ãµes ao paciente */
  guidance?: string;
  /** Exames a solicitar */
  exams?: string;
  /** Red flags que exigem atenÃ§Ã£o */
  redFlags?: string[];
  /** Retorno / seguimento recomendado */
  followup?: string;

  // â”€â”€ Formato v1.3.1 â€” padrÃ£o oficial de templates clÃ­nicos â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  metadata?: {
    name: string;
    description: string;
    category: TemplateCategory;
    tags: string[];
    status: TemplateStatus;
  };
  indications?: string[];
  dataRequirements?: {
    useNow: string[];
    idealForAdjustment?: string[];
  };
  ui?: {
    subjectivePrompt?: string;
    objectivePrompt?: string;
    quickNotes?: string[];
  };
  clinical?: {
    soap?: {
      subjectiveOutputBlocks?: string[];
      objectiveOutputBlocks?: string[];
      assessmentBlocks: string[];
      planBlocks: string[];
    };
    exams?: {
      panelBase?: string[];
      directed?: string[];
      monitoring?: string[];
    };
    guidance?: string[];
    followup?: string[];
    specialSituations?: string[];
    longitudinalFocus?: string[];
  };
  apply?: {
    problems?: Array<{ key: string; label: string }>;
  };

  // â”€â”€ GovernanÃ§a â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  governance?: TemplateGovernance;

  // â”€â”€ Retrocompatibilidade (prÃ©-migraÃ§Ã£o) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  /** @deprecated Use governance.sources */
  source?: string;
  /** @deprecated Use governance.sources */
  sourceUrl?: string;
  /** @deprecated Use governance.sources */
  sourceYear?: number;
  /** @deprecated Use clinical, ui, apply */
  fill?: {
    problems?: string[];
    preventions?: string[];
    soap?: { [key: string]: string | undefined };
    requestedExams?: string;
    patientInstructions?: string;
  };
}

// Fontes adicionadas na SessÃ£o 14.5 (11/04/2026):
//   OBESID â€” MS. CAB nÂº 38 â€” EstratÃ©gias para o Cuidado da Pessoa com Obesidade, 2014. bvsms.saude.gov.br
//            ABESO. Diretrizes Brasileiras de Obesidade, 2022. abeso.org.br
//   DEP    â€” MS. Linha de Cuidado para DepressÃ£o na AtenÃ§Ã£o BÃ¡sica, 2022. linhasdecuidado.saude.gov.br
//   ANSIED â€” MS. Linha de Cuidado para Transtornos de Ansiedade, 2022. linhasdecuidado.saude.gov.br
//   DRC    â€” KDIGO 2022 CKD Guidelines. kdigo.org; MS. Linha de Cuidado para DRC. linhasdecuidado.saude.gov.br
//
// Fontes adicionadas na SessÃ£o 15 (15/04/2026):
//   DPOC   â€” GOLD 2024. goldcopd.org; MS. Linha de Cuidado DPOC
//   ASMA   â€” GINA 2025. ginacoalition.org; MS. Linha de Cuidado Asma, 2021
//   GOTA   â€” SBR. Consenso Brasileiro para DiagnÃ³stico e Tratamento da Gota, 2022. reumatologia.org.br
//   OSTEO  â€” MS. PCDT Osteoporose. Portaria SCTIE/MS nÂº 39/2022. gov.br/saude
//   ICC    â€” SBC. Diretriz Brasileira de InsuficiÃªncia CardÃ­aca CrÃ´nica e Aguda, 2023. arquivosonline.com.br
//   GRIPAL â€” MS. Protocolo de Manejo ClÃ­nico da Gripe na APS, 2023. gov.br/saude
//   ITU    â€” MS/FEBRASGO. Protocolo ClÃ­nico de ITU nÃ£o Complicada na APS, 2021.
//   AMIG   â€” Score Centor/McIsaac (Can Fam Physician, 2003); MS. RENAME 2023.
//   LOMBAR â€” MS. Caderno de AtenÃ§Ã£o BÃ¡sica â€” Dorsalgia, 2023. bvsms.saude.gov.br
//   CEFAL  â€” SBCef. Diretrizes DiagnÃ³sticas e TerapÃªuticas de Cefaleias PrimÃ¡rias do Adulto, 2022. sbcef.org.br
//   MULHER â€” MS/INCA. Diretrizes para Rastreamento do CÃ¢ncer no Brasil, 2024. inca.gov.br
//   IDOSO  â€” MS. CAB nÂº 19 â€” Envelhecimento e SaÃºde da Pessoa Idosa, 2023. bvsms.saude.gov.br
//   HOMEM  â€” MS. PNAISH, 2023. gov.br/saude
//   PRENAT â€” MS. CAB nÂº 32 â€” AtenÃ§Ã£o ao PrÃ©-Natal de Baixo Risco, 2013 (atualiz. 2022). bvsms.saude.gov.br
//   PUERIC â€” MS. CAB nÂº 33 â€” SaÃºde da CrianÃ§a: Crescimento e Desenvolvimento, 2012; Caderneta da CrianÃ§a, 2023.

// Schema lean â€” migration 2026-04-14. whenToUse obrigatÃ³rio, governance completo em todos.
// Template acelera â€” nÃ£o substitui julgamento clÃ­nico.

export const CLINICAL_TEMPLATES: ClinicalTemplate[] = [
  // â”€â”€ HAS â€” Retorno v1.3.1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "has_retorno",

    metadata: {
      name: "HAS — Retorno",
      description: "Retorno ambulatorial de pessoa adulta com hipertensão arterial sistêmica em seguimento longitudinal na APS.",
      category: "cronico",
      tags: ["HAS", "hipertensão", "anti-hipertensivo", "adesão", "retorno", "APS", "RCV"],
      status: "ativo",
    },

    indications: [
      "Adulto com HAS já diagnosticada em retorno ambulatorial na APS.",
      "Revisão de controle pressórico, adesão, efeitos adversos, exames, RCV e necessidade de ajuste terapêutico.",
      "Usar em seguimento crônico sem sinais de urgência/emergência hipertensiva.",
    ],

    dataRequirements: {
      useNow: [
        "PA atual, se aferida corretamente nesta consulta",
        "Medicações em uso, doses e adesão",
        "Efeitos adversos, sintomas de hipotensão ou sintomas cardiovasculares",
        "Registros domiciliares de PA, MRPA ou MAPA, se disponíveis",
        "Comorbidades, exames recentes e fatores que pioram controle pressórico",
      ],
      idealForAdjustment: [
        "PA de consultas anteriores e tendência pressórica",
        "Creatinina/eTFG, potássio, glicemia/HbA1c, perfil lipídico, EAS e ECG, se disponíveis",
        "Risco cardiovascular e lesões de órgão-alvo",
        "Uso de AINEs, descongestionantes, álcool, tabagismo, excesso de sal ou baixa adesão",
        "Suspeita de hipertensão secundária, avental branco, hipertensão mascarada ou HAS resistente",
      ],
    },

    ui: {
      subjectivePrompt: "Registrar adesão, medicações, efeitos adversos, sintomas, medidas domiciliares/MRPA/MAPA quando houver e fatores que dificultam controle pressórico.",
      objectivePrompt: "Registrar apenas dados realmente aferidos/documentados: PA, FC, peso, IMC, exame físico relevante, exames, RCV e sinais de lesão de órgão-alvo.",
      quickNotes: [
        "Não classificar HAS como controlada sem PA confiável ou medidas disponíveis.",
        "Antes de intensificar, revisar adesão, técnica de aferição, acesso, sal, álcool, AINEs e outras causas de pior controle.",
        "PA muito elevada com sintomas ou lesão aguda de órgão-alvo exige fluxo de urgência, não retorno simples.",
      ],
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente em seguimento por hipertensão arterial sistêmica na APS.",
          "Retorna para revisão de controle pressórico, adesão, medicações em uso, efeitos adversos, exames e risco cardiovascular.",
          "Relato de sintomas, adesão, medidas domiciliares de PA e intercorrências conforme dados informados na consulta.",
        ],
        objectiveOutputBlocks: [
          "Dados objetivos conforme preenchimento: PA, FC, peso, IMC, exame físico relevante, exames laboratoriais, ECG e cálculo de risco cardiovascular.",
          "Controle pressórico interpretado conforme PA aferida na consulta e/ou medidas fora do consultório disponíveis.",
          "Lesões de órgão-alvo e comorbidades registradas conforme dados documentados.",
        ],
        assessmentBlocks: [
          "HAS em seguimento longitudinal na APS.",
          "Controle pressórico avaliado conforme medidas disponíveis; se não houver PA confiável ou registros recentes, não classifico controle como adequadamente avaliado.",
          "Meta pressórica individualizada conforme idade, tolerância, risco cardiovascular, comorbidades e lesões de órgão-alvo.",
          "Reviso adesão, efeitos adversos, fatores de pior controle pressórico e necessidade de ajuste terapêutico.",
        ],
        planBlocks: [
          "Mantenho tratamento atual ou ajusto esquema anti-hipertensivo conforme PA, adesão, tolerância, comorbidades, função renal, potássio e risco cardiovascular.",
          "Reforço adesão ao tratamento, uso correto das medicações e técnica adequada de aferição da pressão arterial.",
          "Oriento redução de sal e ultraprocessados, controle de peso, atividade física conforme condição clínica, moderação de álcool e cessação do tabagismo quando aplicável.",
          "Reviso fatores que podem elevar a PA, incluindo AINEs, descongestionantes, álcool, excesso de sal, baixa adesão e dificuldade de acesso aos medicamentos.",
          "Solicito/atualizo creatinina, potássio, glicemia ou HbA1c, perfil lipídico, EAS e ECG conforme pendências, comorbidades, medicamentos em uso e suspeita de lesão de órgão-alvo.",
          "Considero MRPA/MAPA ou registros domiciliares quando houver discrepância entre consultório e domicílio, suspeita de avental branco, hipertensão mascarada ou sintomas de hipotensão, conforme disponibilidade da rede.",
          "Integro o risco cardiovascular ao plano de cuidado e à intensidade do seguimento.",
          "Reforço sinais de alarme e oriento procurar urgência se PA muito elevada associada a dor torácica, dispneia, déficit neurológico, confusão, alteração visual importante, síncope, oligúria ou piora clínica importante.",
          "Programo retorno em cerca de 1 mês se início/ajuste terapêutico ou PA fora da meta; se controle estável, retorno em 3 a 6 meses conforme risco cardiovascular, comorbidades e organização da APS.",
        ],
      },

      exams: {
        panelBase: [
          "Creatinina sérica, para cálculo automático de eTFG",
          "Potássio sérico",
          "Glicemia de jejum ou HbA1c",
          "Perfil lipídico: colesterol total, HDL-c, LDL-c e triglicerídeos",
          "Urinálise/EAS",
          "Eletrocardiograma",
        ],
        directed: [
          "Sódio sérico se uso de diurético tiazídico, hiponatremia prévia ou indicação clínica.",
          "MRPA ou MAPA se suspeita de efeito do avental branco, hipertensão mascarada, discordância entre PA de consultório e domiciliar ou sintomas de hipotensão, conforme disponibilidade da rede.",
          "Relação albumina/creatinina urinária se diabetes, doença renal, suspeita de lesão renal ou estratificação de risco mais detalhada.",
          "Ecocardiograma ou outros exames se suspeita de lesão de órgão-alvo, cardiopatia, HAS secundária, HAS resistente ou comorbidade que justifique investigação.",
        ],
        monitoring: [
          "PA em toda consulta, com técnica adequada e registro do contexto da aferição.",
          "Creatinina/eTFG e potássio conforme medicamentos em uso, comorbidades, DRC, idade e necessidade de ajuste terapêutico.",
          "Glicemia/HbA1c, perfil lipídico e EAS conforme periodicidade, risco cardiovascular e comorbidades.",
          "ECG conforme avaliação inicial, evolução clínica, sintomas, risco cardiovascular ou suspeita de lesão de órgão-alvo.",
          "RCV: reavaliar periodicamente ou quando houver mudança clínica relevante.",
        ],
      },

      guidance: [
        "Oriento não interromper anti-hipertensivos por conta própria.",
        "Oriento levar registros de PA domiciliar quando disponíveis, com data, horário e contexto da medida.",
        "Oriento reduzir sal, ultraprocessados e álcool, além de manter atividade física conforme condição clínica.",
        "Oriento avisar se houver tontura, síncope, hipotensão, edema, tosse persistente, câimbras ou outros efeitos adversos.",
        "Oriento procurar atendimento imediato se PA muito elevada vier acompanhada de dor torácica, falta de ar, déficit neurológico, confusão, alteração visual importante, desmaio, oligúria ou piora clínica importante.",
      ],

      followup: [
        "Reavalio PA, adesão, efeitos adversos, técnica de aferição, comorbidades, exames e risco cardiovascular.",
        "Programo retorno em cerca de 1 mês após início ou ajuste terapêutico, ou antes se sintomas/PA muito elevada.",
        "Após controle pressórico estável, mantenho seguimento em 3 a 6 meses conforme risco cardiovascular, comorbidades, adesão e organização da APS.",
        "Reavalio necessidade de investigação de HAS secundária ou resistência se PA persistir fora da meta apesar de adesão, técnica adequada e esquema terapêutico otimizado.",
      ],

      specialSituations: [
        "PA muito elevada persistente, especialmente PAS ≥180 mmHg e/ou PAD ≥120 mmHg, associada a sintomas ou suspeita de lesão aguda de órgão-alvo.",
        "Dor torácica, dispneia, déficit neurológico focal, confusão, rebaixamento do sensório, alteração visual importante, síncope, oligúria ou sinais de edema agudo de pulmão.",
        "Gestação, puerpério recente ou suspeita de gestação, que exigem fluxo específico.",
        "Suspeita de hipertensão secundária: início abrupto, idade muito jovem, piora súbita, hipocalemia, DRC progressiva, apneia do sono importante ou achados sugestivos.",
        "Suspeita de HAS resistente: PA fora da meta apesar de uso adequado de múltiplos anti-hipertensivos, após revisar adesão, técnica de aferição e fatores interferentes.",
        "Hipotensão sintomática, síncope, quedas recorrentes ou efeitos adversos relevantes ao tratamento.",
      ],

      longitudinalFocus: [
        "Comparar PA atual com medidas anteriores, registros domiciliares e meta individualizada.",
        "Registrar contexto da aferição e evitar classificar controle pressórico com medida isolada pouco confiável.",
        "Revisar adesão, acesso, efeitos adversos, técnica de aferição e fatores que pioram controle antes de intensificar tratamento.",
        "Acompanhar risco cardiovascular, função renal, potássio, glicemia/HbA1c, perfil lipídico, EAS e ECG conforme risco e medicamentos.",
        "Revisar lesões de órgão-alvo, comorbidades e necessidade de cuidado compartilhado quando houver DRC, DCV, IC, AVC, DAP, diabetes ou suspeita de HAS secundária/resistente.",
        "Manter plano longitudinal com metas realistas, orientações de estilo de vida, seguimento periódico e intensificação gradual quando indicado.",
      ],
    },

    apply: {
      problems: [{ key: "has", label: "Hipertensão arterial sistêmica" }],
    },

    governance: {
      status: "ativo",
      version: "1.2.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-24",
      changes: "Revisão clínica e operacional do template HAS — Retorno. Corrigida codificação de acentos. Removidos placeholders do SOAP. Removidas frases que documentavam ações não necessariamente realizadas. Saída reescrita para uso prático em eSUS, com menor necessidade de edição pelo médico. Mantidos limites de uso, sinais de urgência, monitoramento, RCV e alinhamento com PCDT HAS 2025, Linha de Cuidado MS/SAPS e Caderno de Atenção Básica nº 37.",
      sources: [
        {
          label: "Ministério da Saúde/Conitec — Protocolo Clínico e Diretrizes Terapêuticas da Hipertensão Arterial Sistêmica",
          url: "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-hipertensao-arterial-sistemica.pdf/view",
          type: "primary",
          year: "2025",
        },
        {
          label: "Ministério da Saúde/SAPS — Linha de Cuidado: Hipertensão Arterial Sistêmica (HAS) no adulto",
          url: "https://linhasdecuidado.saude.gov.br/portal/hipertensao-arterial-sistemica-%28HAS%29-no-adulto/",
          type: "secondary",
          year: "2020",
        },
        {
          label: "Ministério da Saúde — Caderno de Atenção Básica nº 37: Estratégias para o cuidado da pessoa com doença crônica — Hipertensão Arterial Sistêmica",
          url: "https://bvsms.saude.gov.br/bvs/publicacoes/hipertensao_arterial_sistemica_cab37.pdf",
          type: "secondary",
          year: "2013",
        },
      ],
    },
  },

  // â”€â”€ HAS â€” InÃ­cio v1.3.1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "has_inicial",

    metadata: {
      name: "HAS — Inicial",
      description: "Avaliação inicial de pessoa adulta com pressão arterial elevada ou suspeita de hipertensão arterial sistêmica na APS.",
      category: "cronico",
      tags: ["HAS", "hipertensão", "PA elevada", "diagnóstico", "MRPA", "MAPA", "RCV", "APS"],
      status: "ativo",
    },

    indications: [
      "Adulto sem diagnóstico prévio confirmado de HAS, com PA elevada em consulta ou em medidas prévias.",
      "Avaliação inicial para confirmar diagnóstico, estratificar risco cardiovascular e organizar seguimento.",
      "Não usar como fluxo principal em urgência/emergência hipertensiva, gestação ou HAS já estabelecida em seguimento.",
    ],

    dataRequirements: {
      useNow: [
        "PA atual, número de medidas e contexto da aferição, se registrados",
        "Medidas prévias de PA, registros domiciliares, MRPA ou MAPA, se disponíveis",
        "Sintomas de alarme, sintomas cardiovasculares ou sintomas de hipotensão",
        "Medicações/substâncias que podem elevar PA: AINEs, descongestionantes, estimulantes, corticoides, álcool e outros",
        "Comorbidades, fatores de risco cardiovascular e história familiar relevante",
      ],
      idealForAdjustment: [
        "PA em consultas anteriores ou medidas fora do consultório",
        "Creatinina/eTFG, potássio, glicemia/HbA1c, perfil lipídico, EAS e ECG, se disponíveis",
        "Risco cardiovascular e sinais de lesão de órgão-alvo",
        "Suspeita de avental branco, hipertensão mascarada, HAS secundária ou HAS resistente",
        "Gestação, puerpério recente ou possibilidade de gestação quando aplicável",
      ],
    },

    ui: {
      subjectivePrompt: "Registrar contexto da PA elevada, medidas prévias, sintomas, comorbidades, fatores de risco, medicamentos/substâncias que elevam PA e sinais de alarme.",
      objectivePrompt: "Registrar apenas dados realmente aferidos/documentados: PA, número de medidas, técnica/contexto, FC, peso, IMC, exame físico relevante, exames, RCV e sinais de lesão de órgão-alvo.",
      quickNotes: [
        "Não fechar HAS com medida isolada se não houver critério suficiente.",
        "Considerar MRPA/MAPA quando houver dúvida diagnóstica, avental branco ou hipertensão mascarada.",
        "PA muito elevada com sintomas ou lesão aguda de órgão-alvo exige fluxo de urgência, não avaliação inicial simples.",
      ],
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente em avaliação inicial por pressão arterial elevada/suspeita de HAS na APS.",
          "Consulta voltada à revisão de medidas pressóricas, sintomas, fatores de risco cardiovascular, comorbidades e possíveis fatores de pior controle pressórico.",
          "Relato de sintomas, medidas prévias de PA, uso de medicamentos/substâncias e antecedentes conforme dados informados na consulta.",
        ],
        objectiveOutputBlocks: [
          "Dados objetivos conforme preenchimento: PA, número de medidas, contexto da aferição, FC, peso, IMC, exame físico relevante, exames, ECG e cálculo de risco cardiovascular.",
          "Medidas fora do consultório, MRPA ou MAPA registradas conforme disponibilidade.",
          "Sinais de lesão de órgão-alvo e comorbidades registrados conforme dados documentados.",
        ],
        assessmentBlocks: [
          "PA elevada/suspeita de HAS em avaliação diagnóstica na APS.",
          "Diagnóstico de HAS condicionado a medidas repetidas, técnica adequada e/ou confirmação fora do consultório quando indicada.",
          "Se houver apenas medida isolada sem critério suficiente, mantenho como PA elevada em investigação, sem consolidar HAS confirmada.",
          "Avalio risco cardiovascular, comorbidades, lesão de órgão-alvo e possibilidade de HAS secundária conforme dados disponíveis.",
        ],
        planBlocks: [
          "Registro PA, número de medidas, contexto da aferição e medidas prévias disponíveis.",
          "Solicito ou oriento confirmação diagnóstica com novas medidas em consulta, registros domiciliares, MRPA ou MAPA quando indicado e disponível.",
          "Oriento medidas não farmacológicas: redução de sal e ultraprocessados, controle de peso, atividade física conforme condição clínica, moderação de álcool e cessação do tabagismo quando aplicável.",
          "Reviso fatores que podem elevar a PA, incluindo AINEs, descongestionantes, álcool, excesso de sal, baixa adesão a cuidados e outros medicamentos/substâncias.",
          "Solicito/atualizo creatinina, potássio, glicemia ou HbA1c, perfil lipídico, EAS e ECG conforme contexto, risco cardiovascular, comorbidades e necessidade de estratificação inicial.",
          "Considero tratamento medicamentoso inicial conforme nível pressórico, risco cardiovascular, lesão de órgão-alvo, comorbidades, sintomas e confirmação diagnóstica.",
          "Integro o risco cardiovascular ao plano de cuidado e à definição da intensidade do seguimento.",
          "Reforço sinais de alarme e oriento procurar urgência se PA muito elevada associada a dor torácica, dispneia, déficit neurológico, confusão, alteração visual importante, síncope, oligúria ou piora clínica importante.",
          "Programo retorno conforme nível pressórico e risco: mais precoce se PA muito elevada, sintomas, suspeita de lesão de órgão-alvo ou início de tratamento; em geral 1 a 3 meses para confirmação/estratificação quando sem sinais de gravidade.",
        ],
      },

      exams: {
        panelBase: [
          "Creatinina sérica, para cálculo automático de eTFG",
          "Potássio sérico",
          "Glicemia de jejum ou HbA1c",
          "Perfil lipídico: colesterol total, HDL-c, LDL-c e triglicerídeos",
          "Urinálise/EAS",
          "Eletrocardiograma",
        ],
        directed: [
          "MRPA ou MAPA para confirmação diagnóstica quando indicado e disponível, especialmente em suspeita de avental branco, hipertensão mascarada ou discrepância entre medidas.",
          "Sódio sérico, ácido úrico ou outros exames conforme diurético, comorbidades, suspeita clínica ou protocolo local.",
          "Relação albumina/creatinina urinária se diabetes, doença renal, suspeita de lesão renal ou necessidade de estratificação mais detalhada.",
          "TSH/T4 livre, relação aldosterona/renina, ecocardiograma, Doppler de artérias renais ou outros exames apenas se suspeita de HAS secundária, lesão de órgão-alvo, HAS resistente ou comorbidade específica.",
        ],
        monitoring: [
          "Repetir medidas de PA com técnica adequada e registrar contexto da aferição.",
          "Acompanhar medidas fora do consultório, MRPA/MAPA ou registros domiciliares quando usados para confirmação diagnóstica.",
          "Reavaliar exames, risco cardiovascular e lesão de órgão-alvo conforme resultado inicial e conduta definida.",
          "Após confirmação diagnóstica, migrar para seguimento longitudinal de HAS.",
        ],
      },

      guidance: [
        "Oriento que PA elevada isolada pode precisar de confirmação antes de consolidar diagnóstico de HAS.",
        "Oriento técnica adequada de medida da PA e registro domiciliar quando possível, com data, horário e contexto da medida.",
        "Oriento reduzir sal, ultraprocessados e álcool, além de manter atividade física conforme condição clínica.",
        "Oriento evitar automedicação com substâncias que possam elevar PA, especialmente AINEs e descongestionantes, quando possível.",
        "Oriento procurar atendimento imediato se PA muito elevada vier acompanhada de dor torácica, falta de ar, déficit neurológico, confusão, alteração visual importante, desmaio, oligúria ou piora clínica importante.",
      ],

      followup: [
        "Reavalio PA, medidas prévias, adesão às medidas não farmacológicas, sintomas, exames, risco cardiovascular e necessidade de confirmação diagnóstica.",
        "Programo retorno mais precoce se PA muito elevada, sintomas, suspeita de lesão de órgão-alvo, início de tratamento ou maior risco cardiovascular.",
        "Em avaliação inicial sem sinais de gravidade, programo retorno em geral em 1 a 3 meses para confirmação diagnóstica, estratificação e definição de conduta.",
        "Após confirmação de HAS e estabilização, migro para seguimento de HAS em retorno longitudinal.",
      ],

      specialSituations: [
        "PA muito elevada persistente, especialmente PAS ≥180 mmHg e/ou PAD ≥120 mmHg, associada a sintomas ou suspeita de lesão aguda de órgão-alvo.",
        "Dor torácica, dispneia, déficit neurológico focal, confusão, rebaixamento do sensório, alteração visual importante, síncope, oligúria ou sinais de edema agudo de pulmão.",
        "Gestação, puerpério recente ou suspeita de gestação, que exigem fluxo específico.",
        "Suspeita de hipertensão secundária: início abrupto, idade muito jovem, piora súbita, hipocalemia, DRC progressiva, apneia do sono importante ou achados sugestivos.",
        "Suspeita de efeito do avental branco ou hipertensão mascarada, exigindo medidas fora do consultório quando possível.",
        "Hipotensão sintomática, síncope, quedas recorrentes ou efeitos adversos relevantes se já houver uso de anti-hipertensivo.",
      ],

      longitudinalFocus: [
        "Diferenciar PA elevada isolada, suspeita de HAS e HAS confirmada antes de consolidar o problema na lista ativa.",
        "Registrar datas, valores, contexto e técnica das medidas de PA usadas para diagnóstico.",
        "Usar MRPA/MAPA ou registros domiciliares quando indicados e disponíveis para reduzir erro diagnóstico.",
        "Organizar exames iniciais e estratificação de risco cardiovascular conforme risco e comorbidades.",
        "Revisar fatores modificáveis: sal, álcool, peso, sedentarismo, tabagismo, AINEs, descongestionantes e outros medicamentos/substâncias.",
        "Após confirmação diagnóstica, migrar para seguimento longitudinal de HAS com meta individualizada e plano terapêutico definido.",
      ],
    },

    apply: {
      problems: [{ key: "suspeita_has", label: "Suspeita de HAS / PA elevada em avaliação" }],
    },

    governance: {
      status: "ativo",
      version: "1.2.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-24",
      changes: "Revisão clínica e operacional do template HAS — Inicial. Corrigida codificação de acentos. Removidos placeholders do SOAP. Template mantido como fluxo de PA elevada/suspeita de HAS sem diagnóstico prévio confirmado, evitando consolidar HAS automaticamente. Saída reescrita para uso prático em eSUS, com menor necessidade de edição pelo médico. Mantidos critérios de confirmação diagnóstica, MRPA/MAPA quando indicado, sinais de urgência, estratificação de RCV e alinhamento com PCDT HAS 2025, Linha de Cuidado MS/SAPS e Caderno de Atenção Básica nº 37.",
      sources: [
        {
          label: "Ministério da Saúde/Conitec — Protocolo Clínico e Diretrizes Terapêuticas da Hipertensão Arterial Sistêmica",
          url: "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-hipertensao-arterial-sistemica.pdf/view",
          type: "primary",
          year: "2025",
        },
        {
          label: "Ministério da Saúde/SAPS — Linha de Cuidado: Hipertensão Arterial Sistêmica (HAS) no adulto",
          url: "https://linhasdecuidado.saude.gov.br/portal/hipertensao-arterial-sistemica-%28HAS%29-no-adulto/",
          type: "secondary",
          year: "2020",
        },
        {
          label: "Ministério da Saúde — Caderno de Atenção Básica nº 37: Estratégias para o cuidado da pessoa com doença crônica — Hipertensão Arterial Sistêmica",
          url: "https://bvsms.saude.gov.br/bvs/publicacoes/hipertensao_arterial_sistemica_cab37.pdf",
          type: "secondary",
          year: "2014",
        },
      ],
    },
  },

  // â”€â”€ DM2 â€” Retorno v1.3.1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "dm2_retorno",

    metadata: {
      name: "DM2 — Retorno",
      description: "Retorno ambulatorial de pessoa adulta com diabete melito tipo 2 em seguimento longitudinal na APS.",
      category: "cronico",
      tags: ["DM2", "diabetes", "HbA1c", "hipoglicemia", "pé diabético", "retorno", "APS", "RCV"],
      status: "ativo",
    },

    indications: [
      "Adulto com DM2 já diagnosticado em retorno ambulatorial na APS.",
      "Revisão de controle glicêmico, adesão, medicações, exames e rastreio de complicações.",
      "Usar em seguimento crônico sem sinais de urgência/emergência.",
    ],

    dataRequirements: {
      useNow: [
        "Medicações em uso, doses e adesão",
        "Hipoglicemias, efeitos adversos e dificuldade de acesso ao tratamento",
        "HbA1c/glicemias recentes, se disponíveis",
        "PA, peso/IMC e exame dos pés, se realizados",
        "Creatinina, albuminúria/RAC e perfil lipídico, se disponíveis",
      ],
      idealForAdjustment: [
        "HbA1c com data e comparação anterior",
        "Função renal/eTFG e albuminúria/RAC",
        "Perfil lipídico e risco cardiovascular",
        "Status de fundo de olho e avaliação dos pés",
        "Comorbidades relevantes: HAS, DRC, obesidade, DCV, IC, AVC, DAP e tabagismo",
      ],
    },

    ui: {
      subjectivePrompt: "Registrar adesão, medicações, hipoglicemias, efeitos adversos, sintomas e intercorrências desde a última consulta.",
      objectivePrompt: "Registrar apenas dados realmente aferidos/documentados: PA, peso, IMC, exames, eTFG, albuminúria/RAC, pés e rastreios.",
      quickNotes: [
        "Não classificar controle glicêmico sem HbA1c/glicemias recentes.",
        "Antes de intensificar, revisar adesão, acesso, função renal e hipoglicemias.",
        "Não registrar exame dos pés como realizado se não foi feito.",
      ],
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente em seguimento por DM2 na APS.",
          "Retorna para revisão de controle glicêmico, adesão, medicações, exames e tratamento.",
          "Relato de adesão, hipoglicemias, efeitos adversos, sintomas e intercorrências conforme dados informados na consulta.",
        ],
        objectiveOutputBlocks: [
          "Dados objetivos conforme preenchimento: PA, peso, IMC, exames laboratoriais, cálculos clínicos e avaliação dos pés.",
          "HbA1c/glicemias, função renal, albuminúria/RAC e perfil lipídico avaliados conforme exames disponíveis e respectivas datas.",
          "Rastreios de nefropatia, retinopatia e pé diabético registrados conforme status atual: em dia, pendentes ou não documentados.",
        ],
        assessmentBlocks: [
          "DM2 em seguimento longitudinal na APS.",
          "Controle glicêmico avaliado conforme HbA1c/glicemias disponíveis; se ausentes, não classifico controle laboratorial.",
          "Meta glicêmica individualizada conforme idade, funcionalidade, comorbidades e risco de hipoglicemia.",
          "Reviso segurança terapêutica, adesão, função renal, hipoglicemias e pendências de rastreio.",
        ],
        planBlocks: [
          "Mantenho tratamento atual ou ajusto conforme controle glicêmico, adesão, tolerância, função renal, hipoglicemias e comorbidades.",
          "Oriento alimentação adequada, redução de ultraprocessados e bebidas açucaradas, atividade física conforme condição clínica e uso correto das medicações.",
          "Oriento automonitorização glicêmica de forma individualizada, especialmente em uso de insulina, hipoglicemias, ajuste terapêutico ou descontrole.",
          "Oriento cuidado diário com os pés e retorno se ferida, secreção, vermelhidão, dor, escurecimento, febre ou piora local.",
          "Solicito/atualizo HbA1c, glicemia de jejum, creatinina, albuminúria/RAC e perfil lipídico conforme pendências, periodicidade e contexto clínico.",
          "Solicito/encaminho para rastreio de retinopatia conforme status do último exame e disponibilidade da rede.",
          "Programo avaliação dos pés conforme periodicidade, risco e achados da consulta.",
          "Reforço sinais de alarme e oriento procurar urgência se hipoglicemia grave, confusão/sonolência, vômitos persistentes, desidratação, glicemias muito elevadas com sintomas ou lesão grave em pés.",
          "Programo retorno em até 3 meses se descontrole, ajuste terapêutico, hipoglicemias, sintomas ou pendências relevantes; se estável, retorno em 3 a 6 meses conforme risco e organização da APS.",
        ],
      },

      exams: {
        panelBase: [
          "Hemoglobina glicada (HbA1c), com data",
          "Glicemia plasmática de jejum, com data",
          "Creatinina sérica, para cálculo automático de eTFG",
          "Albuminúria ou relação albumina/creatinina urinária (RAC)",
          "Perfil lipídico: colesterol total, HDL-c, LDL-c e triglicerídeos",
        ],
        directed: [
          "Glicemias capilares/automonitorização quando em uso de insulina, hipoglicemias, ajuste terapêutico ou descontrole.",
          "Retinografia, fundoscopia ou avaliação oftalmológica para rastreio de retinopatia conforme rede local.",
          "Avaliação de pé diabético: sensibilidade protetora, pulsos periféricos, deformidades, calosidades, fissuras, lesões, sinais de infecção e risco de ulceração.",
          "EAS/urocultura apenas se sintomas urinários, suspeita de infecção ou outra indicação clínica; não solicitar de rotina apenas por DM2 estável.",
        ],
        monitoring: [
          "Peso corporal e pressão arterial: registrar em cada consulta quando aferidos.",
          "HbA1c e glicemia plasmática de jejum: em geral a cada 6 meses; considerar reavaliação trimestral se fora da meta ou após ajuste terapêutico.",
          "Perfil lipídico: ao diagnóstico e, em geral, anualmente.",
          "Creatinina sérica/eTFG e albuminúria/RAC: ao diagnóstico e, em geral, anualmente, ou antes conforme risco/alteração prévia.",
          "Risco cardiovascular: reavaliar anualmente ou quando houver mudança clínica relevante.",
          "Avaliação do pé diabético: ao diagnóstico e, no mínimo, anualmente; aumentar frequência conforme risco, perda de sensibilidade, deformidade, doença arterial periférica ou lesão prévia.",
          "Rastreio de retinopatia: iniciar no diagnóstico de DM2 e acompanhar conforme achados e fluxo da rede.",
        ],
      },

      guidance: [
        "Oriento manter alimentação adequada, atividade física conforme condição clínica e uso correto das medicações.",
        "Oriento avisar se houver efeitos adversos, dificuldade de acesso, esquecimento frequente ou hipoglicemias.",
        "Oriento reconhecer hipoglicemia e evitar jejum prolongado, especialmente se em uso de insulina ou medicação com maior risco de hipoglicemia.",
        "Oriento cuidado diário com os pés e retorno imediato em caso de ferida, bolha, secreção, vermelhidão, dor, escurecimento, febre ou piora local.",
        "Oriento manter rastreios de olhos, rins, pés, risco cardiovascular e vacinação conforme calendário e organização da rede.",
      ],

      followup: [
        "Reavalio controle glicêmico com base em HbA1c/glicemias disponíveis, considerando data do exame e meta individualizada.",
        "Reavalio peso, PA, adesão, hipoglicemias, efeitos adversos, função renal, risco cardiovascular e rastreios pendentes.",
        "Programo retorno em até 3 meses se houver descontrole, ajuste terapêutico, hipoglicemia, sintomas, lesão em pés ou pendências relevantes.",
        "Programo retorno em 3 a 6 meses se quadro estável, sem hipoglicemias relevantes, com plano terapêutico definido e rastreios organizados.",
      ],

      specialSituations: [
        "Suspeita de cetoacidose diabética ou síndrome hiperosmolar hiperglicêmica.",
        "Hiperglicemia importante com sintomas, desidratação, vômitos persistentes, dor abdominal, sonolência, confusão ou rebaixamento do sensório.",
        "Hipoglicemia grave, hipoglicemia recorrente, necessidade de ajuda de terceiros ou alteração do estado mental.",
        "Infecção importante no pé, úlcera profunda, necrose, secreção purulenta, febre, celulite extensa, sinais de isquemia ou dor intensa em membro inferior.",
        "Perda visual súbita, dor ocular importante ou suspeita de complicação oftalmológica aguda.",
        "Gestação, planejamento de gestação ou diabetes gestacional, que exigem fluxo específico.",
        "Descontrole persistente apesar de boa adesão, uso adequado e múltiplos ajustes, especialmente em insulinoterapia complexa ou com complicações.",
      ],

      longitudinalFocus: [
        "Comparar HbA1c atual com resultados anteriores e com a meta terapêutica individualizada.",
        "Registrar datas dos exames para evitar classificar controle ou rastreio como atualizado sem documentação.",
        "Revisar adesão, acesso a medicamentos, técnica de uso, tolerância e hipoglicemias antes de intensificar tratamento.",
        "Revisar necessidade de ajuste conforme função renal, idade, fragilidade, risco cardiovascular, DRC, IC e doença cardiovascular estabelecida.",
        "Acompanhar nefropatia, retinopatia, pé diabético, perfil lipídico, risco cardiovascular e situação vacinal conforme periodicidade e rede local.",
        "Manter plano de cuidado compartilhado com atenção especializada quando houver complicações, albuminúria persistente, alteração oftalmológica, perda de sensibilidade nos pés ou doença cardiovascular/renal relevante.",
      ],
    },

    apply: {
      problems: [{ key: "dm2", label: "Diabete melito tipo 2" }],
    },

    governance: {
      status: "ativo",
      version: "1.2.1",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-24",
      changes: "Revisão clínica e operacional do template DM2 — Retorno. Versão enxuta para uso real em consulta APS/eSUS, mantendo segurança documental. Removidas frases que documentavam ações não necessariamente realizadas. Indicações e prompts reduzidos para leitura rápida. SOAP reescrito para gerar texto quase pronto, com menor necessidade de edição pelo médico. Mantidos limites de uso, sinais de urgência, monitoramento alinhado ao PCDT DM2 2026 e governança com fontes oficiais.",
      sources: [
        {
          label: "Ministério da Saúde/Conitec — Protocolo Clínico e Diretrizes Terapêuticas do Diabete Melito Tipo 2",
          url: "https://www.gov.br/saude/pt-br/assuntos/pcdt/d/diabete-melito-tipo-2.pdf/view",
          type: "primary",
          year: "2026",
        },
        {
          label: "Ministério da Saúde/SAPS — Linha de Cuidado: Diabetes Mellitus tipo 2 (DM2) no adulto",
          url: "https://linhasdecuidado.saude.gov.br/portal/diabetes-mellitus-tipo-2-%28DM2%29-no-adulto/",
          type: "secondary",
          year: "2020",
        },
        {
          label: "Ministério da Saúde — Caderno de Atenção Básica nº 36: Estratégias para o cuidado da pessoa com doença crônica — Diabetes Mellitus",
          url: "https://bvsms.saude.gov.br/bvs/publicacoes/diabetes_mellitus_cab36.pdf",
          type: "secondary",
          year: "2013",
        },
      ],
    },
  },

  // â”€â”€ DM2 â€” InÃ­cio v1.3.1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "dm2_inicial",

    metadata: {
      name: "DM2 — Início",
      description: "Consulta inicial de pessoa adulta com diabete melito tipo 2 recém-confirmado ou com critérios laboratoriais suficientes, para organização do cuidado na APS.",
      category: "cronico",
      tags: ["DM2", "diabetes", "diagnóstico", "HbA1c", "tratamento inicial", "APS", "RCV"],
      status: "ativo",
    },

    indications: [
      "Adulto com DM2 recém-confirmado ou com critérios laboratoriais suficientes na APS.",
      "Consulta inicial para organizar exames basais, tratamento, orientações e rastreio de complicações.",
      "Não usar como fluxo principal em suspeita sem confirmação, pré-diabetes ou apresentação atípica/aguda.",
    ],

    dataRequirements: {
      useNow: [
        "Exames diagnósticos com data: HbA1c, glicemia de jejum, TOTG ou glicemia aleatória com sintomas",
        "Sintomas atuais, comorbidades, medicações em uso e fatores de risco cardiovascular",
        "PA, peso/IMC e avaliação dos pés, se realizados",
        "Creatinina, albuminúria/RAC e perfil lipídico, se disponíveis",
        "Contraindicações, tolerância ou barreiras ao início do tratamento",
      ],
      idealForAdjustment: [
        "Confirmação do critério diagnóstico laboratorial",
        "Função renal/eTFG e albuminúria/RAC",
        "Perfil lipídico e risco cardiovascular",
        "Status de fundo de olho e avaliação dos pés",
        "Sinais de apresentação atípica: perda ponderal importante, cetose, adulto jovem/magro, sintomas intensos ou suspeita de DM1/LADA",
      ],
    },

    ui: {
      subjectivePrompt: "Registrar exames diagnósticos, sintomas, comorbidades, medicações em uso, barreiras ao tratamento e fatores de risco cardiovascular.",
      objectivePrompt: "Registrar apenas dados realmente aferidos/documentados: PA, peso, IMC, exames com data, eTFG, albuminúria/RAC, perfil lipídico e avaliação dos pés.",
      quickNotes: [
        "Se houver apenas exame isolado sem confirmação, considerar futuro fluxo de alteração glicêmica/suspeita.",
        "Não registrar exame dos pés, RCV ou rastreios como avaliados se não foram documentados.",
        "Fenótipo jovem/magro, perda ponderal importante, cetose ou sintomas intensos: considerar DM1/LADA ou urgência.",
      ],
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente em consulta inicial por DM2 recém-confirmado na APS.",
          "Consulta voltada à organização do cuidado, revisão de exames diagnósticos, sintomas, comorbidades, medicações em uso e fatores de risco cardiovascular.",
          "Relato de sintomas, adesão inicial, barreiras ao tratamento e histórico clínico conforme dados informados na consulta.",
        ],
        objectiveOutputBlocks: [
          "Dados objetivos conforme preenchimento: PA, peso, IMC, exames diagnósticos, cálculos clínicos, função renal, perfil lipídico e avaliação dos pés.",
          "Critério diagnóstico registrado conforme HbA1c, glicemia de jejum, TOTG ou glicemia aleatória com sintomas, sempre com data e contexto clínico.",
          "Rastreios iniciais de nefropatia, retinopatia e pé diabético registrados conforme disponibilidade e status atual.",
        ],
        assessmentBlocks: [
          "DM2 recém-confirmado/início de seguimento longitudinal na APS.",
          "Critério diagnóstico considerado conforme exames disponíveis e contexto clínico.",
          "Avalio risco cardiovascular, função renal, comorbidades e rastreio inicial de complicações conforme dados documentados.",
          "Reviso sinais de apresentação atípica, DM1/LADA, diabetes secundário, gestação ou descompensação aguda.",
        ],
        planBlocks: [
          "Registro critério diagnóstico e exames disponíveis com data.",
          "Solicito/atualizo HbA1c, glicemia de jejum, creatinina, albuminúria/RAC e perfil lipídico conforme pendências e contexto clínico.",
          "Solicito/encaminho para rastreio de retinopatia conforme disponibilidade da rede.",
          "Programo avaliação dos pés e estratificação de risco conforme dados da consulta e organização da APS.",
          "Defino tratamento inicial conforme HbA1c/glicemias, sintomas, comorbidades, função renal, risco cardiovascular, contraindicações e acesso ao tratamento.",
          "Considero metformina como opção inicial se não houver contraindicação, associada a mudanças de estilo de vida.",
          "Oriento alimentação adequada, redução de ultraprocessados e bebidas açucaradas, atividade física conforme condição clínica, cuidado com peso e cessação do tabagismo quando aplicável.",
          "Oriento cuidado diário com os pés e retorno se ferida, secreção, vermelhidão, dor, escurecimento, febre ou piora local.",
          "Reforço sinais de alarme e oriento procurar urgência se vômitos persistentes, desidratação, sonolência/confusão, dor abdominal importante, hiperglicemia sintomática importante ou lesão grave em pés.",
          "Programo retorno em 4 a 8 semanas após início/ajuste de tratamento ou conforme pendências; após estabilização, organizo seguimento longitudinal conforme risco.",
        ],
      },

      exams: {
        panelBase: [
          "Hemoglobina glicada (HbA1c), com data",
          "Glicemia plasmática de jejum, com data",
          "Creatinina sérica, para cálculo automático de eTFG",
          "Albuminúria ou relação albumina/creatinina urinária (RAC)",
          "Perfil lipídico: colesterol total, HDL-c, LDL-c e triglicerídeos",
        ],
        directed: [
          "TOTG 75 g se necessário para esclarecimento diagnóstico.",
          "Glicemia aleatória se sintomas de hiperglicemia ou suspeita de descompensação.",
          "Retinografia, fundoscopia ou avaliação oftalmológica após diagnóstico de DM2, conforme rede local.",
          "Avaliação de pé diabético: sensibilidade protetora, pulsos periféricos, deformidades, calosidades, fissuras, lesões e sinais de infecção.",
          "Cetonemia/cetonúria ou avaliação de urgência se hiperglicemia com sintomas importantes, vômitos, desidratação, dor abdominal, sonolência, perda ponderal importante ou suspeita de DM1/LADA.",
          "EAS/urocultura apenas se sintomas urinários, suspeita de infecção ou outra indicação clínica; não solicitar de rotina apenas por DM2 recém-confirmado.",
        ],
        monitoring: [
          "HbA1c e glicemia: obter basal e acompanhar conforme controle; em geral a cada 6 meses, ou antes se fora da meta/início de tratamento.",
          "Perfil lipídico: ao diagnóstico e, em geral, anualmente.",
          "Creatinina sérica/eTFG e albuminúria/RAC: ao diagnóstico e, em geral, anualmente, ou antes conforme risco/alteração prévia.",
          "Risco cardiovascular: avaliar no diagnóstico e reavaliar anualmente ou quando houver mudança clínica relevante.",
          "Avaliação do pé diabético: realizar no diagnóstico e, no mínimo, anualmente; aumentar frequência conforme risco.",
          "Rastreio de retinopatia: iniciar no diagnóstico de DM2 e acompanhar conforme achados e fluxo da rede.",
        ],
      },

      guidance: [
        "Oriento o diagnóstico de DM2, seu caráter crônico e a importância do acompanhamento regular.",
        "Oriento alimentação adequada, atividade física conforme condição clínica, cuidado com peso e uso correto das medicações se iniciadas.",
        "Oriento avisar se houver efeitos adversos, dificuldade de acesso ao tratamento, sintomas persistentes ou piora clínica.",
        "Oriento cuidado diário com os pés e retorno imediato em caso de ferida, bolha, secreção, vermelhidão, dor, escurecimento, febre ou piora local.",
        "Oriento manter rastreios de olhos, rins, pés, risco cardiovascular e vacinação conforme calendário e organização da rede.",
      ],

      followup: [
        "Reavalio sintomas, exames basais, adesão, tolerância e necessidade de ajuste em 4 a 8 semanas quando houver início ou ajuste de tratamento.",
        "Reavalio HbA1c/glicemias, função renal, albuminúria/RAC, perfil lipídico, risco cardiovascular e rastreios pendentes.",
        "Após estabilização, organizo seguimento longitudinal semelhante ao retorno de DM2, com periodicidade conforme controle, risco e organização da APS.",
        "Programo retorno mais precoce se houver sintomas importantes, descontrole, hipoglicemia, lesão em pés, suspeita de DM1/LADA ou necessidade de ajuste terapêutico.",
      ],

      specialSituations: [
        "Suspeita de DM2 sem confirmação laboratorial suficiente: considerar futuro fluxo específico de alteração glicêmica/suspeita, sem consolidar como DM2 confirmado.",
        "Hiperglicemia importante com sintomas, desidratação, vômitos persistentes, dor abdominal, sonolência, confusão ou rebaixamento do sensório.",
        "Suspeita de cetoacidose diabética ou síndrome hiperosmolar hiperglicêmica.",
        "Hipoglicemia grave, necessidade de ajuda de terceiros ou alteração do estado mental.",
        "Fenótipo sugestivo de DM1/LADA: adulto jovem, magro, perda ponderal importante, sintomas intensos, cetose, início abrupto ou necessidade precoce de insulina.",
        "Gestação, planejamento de gestação ou diabetes gestacional, que exigem fluxo específico.",
        "Infecção importante no pé, úlcera profunda, necrose, secreção purulenta, febre, celulite extensa ou sinais de isquemia.",
        "Suspeita de diabetes secundário por medicamentos, doença pancreática, endocrinopatias ou outra causa específica.",
      ],

      longitudinalFocus: [
        "Registrar data e tipo dos exames diagnósticos que confirmaram DM2.",
        "Organizar exames basais: HbA1c/glicemia, função renal, albuminúria/RAC, perfil lipídico, risco cardiovascular, pés e retinopatia.",
        "Revisar adesão, acesso a medicamentos, tolerância e barreiras ao cuidado após início do plano terapêutico.",
        "Migrar para seguimento longitudinal de DM2 com metas individualizadas e rastreio periódico de complicações.",
        "Manter atenção a sinais de DM1/LADA, diabetes secundário, gestação ou descompensação aguda, especialmente quando apresentação for atípica.",
      ],
    },

    apply: {
      problems: [{ key: "dm2", label: "Diabete melito tipo 2" }],
    },

    governance: {
      status: "ativo",
      version: "1.2.1",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-24",
      changes: "Ajuste após validação prática eSUS do dm2_inicial v1.2.0. Template reposicionado para DM2 recém-confirmado ou com critérios laboratoriais suficientes, reduzindo mistura entre suspeita diagnóstica, diagnóstico confirmado e apresentação atípica/aguda. apply.problems alterado para dm2. Casos de suspeita sem confirmação ficam indicados para futuro template de alteração glicêmica/suspeita. Mantida segurança documental, linguagem operacional e alinhamento com PCDT DM2 2026 e Linha de Cuidado MS/SAPS.",
      sources: [
        {
          label: "Ministério da Saúde/Conitec — Protocolo Clínico e Diretrizes Terapêuticas do Diabete Melito Tipo 2",
          url: "https://www.gov.br/saude/pt-br/assuntos/pcdt/d/diabete-melito-tipo-2.pdf/view",
          type: "primary",
          year: "2026",
        },
        {
          label: "Ministério da Saúde/SAPS — Linha de Cuidado: Diabetes Mellitus tipo 2 (DM2) no adulto",
          url: "https://linhasdecuidado.saude.gov.br/portal/diabetes-mellitus-tipo-2-%28DM2%29-no-adulto/",
          type: "secondary",
          year: "2020",
        },
        {
          label: "Ministério da Saúde — Caderno de Atenção Básica nº 36: Estratégias para o cuidado da pessoa com doença crônica — Diabetes Mellitus",
          url: "https://bvsms.saude.gov.br/bvs/publicacoes/diabetes_mellitus_cab36.pdf",
          type: "secondary",
          year: "2013",
        },
      ],
    },
  },

  // â”€â”€ HAS + DM2 â€” Retorno v1.3.1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "has_dm2_retorno",

    metadata: {
      name: "HAS + DM2 — Retorno",
      description: "Retorno ambulatorial combinado de pessoa adulta com hipertensão arterial sistêmica e diabete melito tipo 2 em seguimento longitudinal na APS.",
      category: "cronico",
      tags: ["HAS", "DM2", "hipertensão", "diabetes", "risco cardiovascular", "retorno", "APS", "cardiometabólico"],
      status: "ativo",
    },

    indications: [
      "Adulto com HAS e DM2 já diagnosticados em retorno ambulatorial na APS.",
      "Revisão integrada de PA, controle glicêmico, adesão, medicações, exames, RCV e rastreio de complicações.",
      "Usar em seguimento crônico sem sinais de urgência/emergência hipertensiva, descompensação hiperglicêmica ou pé diabético grave.",
    ],

    dataRequirements: {
      useNow: [
        "PA atual, se aferida corretamente nesta consulta",
        "HbA1c/glicemias recentes, se disponíveis",
        "Medicações em uso, doses e adesão, incluindo anti-hipertensivos, antidiabéticos e insulina",
        "Hipoglicemias, efeitos adversos, sintomas cardiovasculares e sintomas de descompensação",
        "Creatinina, albuminúria/RAC, potássio, perfil lipídico e avaliação dos pés, se disponíveis",
      ],
      idealForAdjustment: [
        "PA de consultas anteriores, registros domiciliares, MRPA ou MAPA",
        "HbA1c com data e comparação anterior",
        "Função renal/eTFG, albuminúria/RAC e potássio",
        "Perfil lipídico, risco cardiovascular e lesões de órgão-alvo",
        "Status de retinopatia, nefropatia, pé diabético, DRC, DCV, IC, AVC, DAP e tabagismo",
      ],
    },

    ui: {
      subjectivePrompt: "Registrar adesão, medicações, PA domiciliar/MRPA/MAPA, hipoglicemias, efeitos adversos, sintomas, autocuidado, intercorrências e barreiras ao tratamento.",
      objectivePrompt: "Registrar apenas dados realmente aferidos/documentados: PA, FC, peso, IMC, exames, eTFG, albuminúria/RAC, potássio, perfil lipídico, RCV, ECG e avaliação dos pés.",
      quickNotes: [
        "Não classificar controle pressórico ou glicêmico sem PA confiável e HbA1c/glicemias recentes.",
        "Antes de intensificar, revisar adesão, acesso, técnica de uso, hipoglicemias, função renal, potássio e efeitos adversos.",
        "HAS + DM2 exige olhar cardiometabólico integrado, mas sem duplicar texto de dois templates separados.",
      ],
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente em seguimento por HAS e DM2 na APS.",
          "Retorna para revisão integrada de controle pressórico, controle glicêmico, adesão, medicações, exames, efeitos adversos e risco cardiovascular.",
          "Relato de sintomas, hipoglicemias, medidas domiciliares de PA, autocuidado e intercorrências conforme dados informados na consulta.",
        ],
        objectiveOutputBlocks: [
          "Dados objetivos conforme preenchimento: PA, FC, peso, IMC, exames laboratoriais, cálculos clínicos, ECG e avaliação dos pés.",
          "Controle pressórico e glicêmico interpretados conforme PA aferida/medidas disponíveis e HbA1c/glicemias com data.",
          "Função renal/eTFG, albuminúria/RAC, potássio, perfil lipídico, RCV e rastreios de complicações registrados conforme dados documentados.",
        ],
        assessmentBlocks: [
          "HAS e DM2 em seguimento longitudinal combinado na APS.",
          "Controle pressórico e glicêmico avaliados conforme dados disponíveis; se ausentes, não classifico controle como adequadamente avaliado.",
          "Risco cardiovascular, função renal, albuminúria, lesões de órgão-alvo e comorbidades orientam metas, segurança terapêutica e intensidade do seguimento.",
          "Reviso adesão, tolerância, hipoglicemias, efeitos adversos, fatores de pior controle pressórico/glicêmico e pendências de rastreio.",
        ],
        planBlocks: [
          "Mantenho tratamento atual ou ajusto esquema anti-hipertensivo e antidiabético conforme PA, HbA1c/glicemias, adesão, tolerância, função renal, potássio, hipoglicemias, comorbidades e risco cardiovascular.",
          "Reforço adesão, uso correto das medicações, técnica de aferição da PA e técnica de aplicação/armazenamento de insulina quando pertinente.",
          "Oriento alimentação adequada, redução de sal, ultraprocessados e bebidas açucaradas, controle de peso, atividade física conforme condição clínica, moderação de álcool e cessação do tabagismo quando aplicável.",
          "Oriento automonitorização glicêmica de forma individualizada, especialmente em uso de insulina, hipoglicemias, ajuste terapêutico ou descontrole.",
          "Oriento cuidado diário com os pés e retorno se ferida, secreção, vermelhidão, dor, escurecimento, febre ou piora local.",
          "Solicito/atualizo HbA1c, glicemia de jejum, creatinina, potássio, albuminúria/RAC, perfil lipídico, EAS e ECG conforme pendências, medicamentos em uso, comorbidades e risco.",
          "Solicito/encaminho para rastreio de retinopatia conforme status do último exame e disponibilidade da rede.",
          "Programo avaliação dos pés e estratificação de risco conforme periodicidade, achados e organização da APS.",
          "Integro risco cardiovascular, função renal e albuminúria ao plano de cuidado e à intensidade do seguimento.",
          "Reforço sinais de alarme e oriento procurar urgência se PA muito elevada com sintomas, dor torácica, dispneia, déficit neurológico, confusão, vômitos persistentes, desidratação, hipoglicemia grave, glicemias muito elevadas com sintomas ou lesão grave em pés.",
          "Programo retorno em 1 a 3 meses se descontrole, ajuste terapêutico, hipoglicemias, PA fora da meta ou pendências relevantes; se estável, retorno em 3 a 6 meses conforme risco e organização da APS.",
        ],
      },

      exams: {
        panelBase: [
          "Hemoglobina glicada (HbA1c), com data",
          "Glicemia plasmática de jejum, com data",
          "Creatinina sérica, para cálculo automático de eTFG",
          "Potássio sérico",
          "Albuminúria ou relação albumina/creatinina urinária (RAC)",
          "Perfil lipídico: colesterol total, HDL-c, LDL-c e triglicerídeos",
        ],
        directed: [
          "EAS conforme contexto, comorbidades, suspeita de lesão renal ou protocolo local.",
          "ECG conforme avaliação inicial/seguimento, risco cardiovascular, sintomas, evolução clínica ou suspeita de lesão de órgão-alvo.",
          "Retinografia, fundoscopia ou avaliação oftalmológica para rastreio de retinopatia conforme rede local.",
          "Avaliação de pé diabético: sensibilidade protetora, pulsos periféricos, deformidades, calosidades, fissuras, lesões, sinais de infecção e risco de ulceração.",
          "MRPA ou MAPA se suspeita de avental branco, hipertensão mascarada, discordância entre consultório e domicílio ou sintomas de hipotensão, conforme disponibilidade da rede.",
          "Urocultura apenas se sintomas urinários, suspeita de infecção ou outra indicação clínica; não solicitar de rotina apenas por HAS + DM2 estáveis.",
        ],
        monitoring: [
          "PA em toda consulta, com técnica adequada e registro do contexto da aferição.",
          "HbA1c e glicemia: em geral a cada 6 meses; considerar reavaliação trimestral se fora da meta ou após ajuste terapêutico.",
          "Creatinina/eTFG, potássio e albuminúria/RAC conforme medicamentos em uso, DRC, albuminúria, idade, risco e necessidade de ajuste terapêutico.",
          "Perfil lipídico e risco cardiovascular: reavaliar periodicamente ou quando houver mudança clínica relevante.",
          "Avaliação do pé diabético: ao menos anualmente; aumentar frequência conforme risco, perda de sensibilidade, deformidade, doença arterial periférica ou lesão prévia.",
          "Rastreio de retinopatia: acompanhar conforme achados prévios e fluxo da rede.",
        ],
      },

      guidance: [
        "Oriento não interromper medicações por conta própria e avisar se houver efeitos adversos ou dificuldade de acesso.",
        "Oriento levar registros de PA domiciliar e glicemias quando indicados, com data, horário e contexto.",
        "Oriento reduzir sal, ultraprocessados, bebidas açucaradas e álcool, além de manter atividade física conforme condição clínica.",
        "Oriento reconhecer hipoglicemia e evitar jejum prolongado, especialmente se em uso de insulina ou medicação com maior risco de hipoglicemia.",
        "Oriento cuidado diário com os pés e retorno imediato em caso de ferida, bolha, secreção, vermelhidão, dor, escurecimento, febre ou piora local.",
        "Oriento procurar atendimento imediato se PA muito elevada vier acompanhada de dor torácica, falta de ar, déficit neurológico, confusão, alteração visual importante, vômitos persistentes, desidratação, hipoglicemia grave ou lesão grave em pés.",
      ],

      followup: [
        "Reavalio PA, HbA1c/glicemias, adesão, hipoglicemias, efeitos adversos, função renal, potássio, albuminúria/RAC, perfil lipídico, RCV e rastreios pendentes.",
        "Programo retorno em 1 a 3 meses se houver descontrole pressórico/glicêmico, ajuste terapêutico, hipoglicemia, sintomas, lesão em pés ou pendências relevantes.",
        "Programo retorno em 3 a 6 meses se quadro estável, sem hipoglicemias relevantes, com plano terapêutico definido e rastreios organizados.",
        "Reavalio necessidade de cuidado compartilhado se DRC, albuminúria persistente, lesão de órgão-alvo, DCV/IC/AVC/DAP, retinopatia, pé diabético de risco ou suspeita de HAS secundária/resistente.",
      ],

      specialSituations: [
        "PA muito elevada persistente, especialmente PAS ≥180 mmHg e/ou PAD ≥120 mmHg, associada a sintomas ou suspeita de lesão aguda de órgão-alvo.",
        "Dor torácica, dispneia, déficit neurológico focal, confusão, rebaixamento do sensório, alteração visual importante, síncope, oligúria ou sinais de edema agudo de pulmão.",
        "Hiperglicemia importante com sintomas, desidratação, vômitos persistentes, dor abdominal, sonolência, confusão ou rebaixamento do sensório.",
        "Suspeita de cetoacidose diabética ou síndrome hiperosmolar hiperglicêmica.",
        "Hipoglicemia grave, hipoglicemia recorrente, necessidade de ajuda de terceiros ou alteração do estado mental.",
        "Infecção importante no pé, úlcera profunda, necrose, secreção purulenta, febre, celulite extensa, sinais de isquemia ou dor intensa em membro inferior.",
        "Gestação, puerpério recente, planejamento de gestação ou diabetes gestacional, que exigem fluxo específico.",
        "Suspeita de HAS secundária/resistente ou apresentação atípica do diabetes, como DM1/LADA ou diabetes secundário.",
      ],

      longitudinalFocus: [
        "Comparar PA e HbA1c atuais com valores anteriores e metas individualizadas.",
        "Registrar datas dos exames e contexto das aferições para evitar classificar controle sem dados confiáveis.",
        "Revisar adesão, acesso, técnica de uso, efeitos adversos, hipoglicemias, função renal e potássio antes de intensificar tratamento.",
        "Acompanhar risco cardiovascular, função renal/eTFG, albuminúria/RAC, perfil lipídico, EAS, ECG, retinopatia e pé diabético conforme risco e rede local.",
        "Revisar lesões de órgão-alvo e comorbidades que mudam o seguimento: DRC, DCV, IC, AVC, DAP, obesidade, tabagismo e albuminúria persistente.",
        "Manter plano integrado para reduzir risco cardiovascular e complicações microvasculares, evitando duplicação de condutas entre HAS e DM2.",
      ],
    },

    apply: {
      problems: [
        { key: "has", label: "HipertensÃ£o arterial sistÃªmica" },
        { key: "dm2", label: "Diabete melito tipo 2" },
      ],
    },

    governance: {
      status: "ativo",
      version: "1.2.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-24",
      changes: "Revisão clínica e operacional do template HAS + DM2 — Retorno. Corrigida codificação de acentos. Removidas frases que documentavam ações não necessariamente realizadas. Template reescrito para não ser simples soma de HAS Retorno e DM2 Retorno, mas sim consulta integrada cardiometabólica. Saída adaptada para eSUS, com menor necessidade de edição pelo médico. Mantidos limites de uso, sinais de urgência, rastreios, RCV, função renal, albuminúria e alinhamento com PCDT HAS 2025, PCDT DM2 2026 e Linhas de Cuidado MS/SAPS.",
      sources: [
        {
          label: "Ministério da Saúde/Conitec — Protocolo Clínico e Diretrizes Terapêuticas da Hipertensão Arterial Sistêmica",
          url: "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-hipertensao-arterial-sistemica.pdf/view",
          type: "primary",
          year: "2025",
        },
        {
          label: "Ministério da Saúde/Conitec — Protocolo Clínico e Diretrizes Terapêuticas do Diabete Melito Tipo 2",
          url: "https://www.gov.br/saude/pt-br/assuntos/pcdt/d/diabete-melito-tipo-2.pdf/view",
          type: "primary",
          year: "2026",
        },
        {
          label: "Ministério da Saúde/SAPS — Linha de Cuidado: Hipertensão Arterial Sistêmica (HAS) no adulto",
          url: "https://linhasdecuidado.saude.gov.br/portal/hipertensao-arterial-sistemica-%28HAS%29-no-adulto/",
          type: "secondary",
          year: "2020",
        },
        {
          label: "Ministério da Saúde/SAPS — Linha de Cuidado: Diabetes Mellitus tipo 2 (DM2) no adulto",
          url: "https://linhasdecuidado.saude.gov.br/portal/diabetes-mellitus-tipo-2-%28DM2%29-no-adulto/",
          type: "secondary",
          year: "2020",
        },
      ],
    },
  },

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // DISLIPIDEMIA â€” SBC 2025 (PREVENT)
  // Fonte: SBC. Diretriz Brasileira de Dislipidemias e PrevenÃ§Ã£o da Aterosclerose, 2025.
  //        pmc.ncbi.nlm.nih.gov/articles/PMC12674852/
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

  // â”€â”€ Dislipidemia â€” InÃ­cio v1.3.1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "dislipidemia_inicial",

    metadata: {
      name: "Dislipidemia — Inicial",
      description: "Avaliação inicial de pessoa adulta com lipidograma alterado, suspeita ou diagnóstico inicial de dislipidemia na APS, com foco em risco cardiovascular e definição do plano de cuidado.",
      category: "cronico",
      tags: ["dislipidemia", "LDL", "não-HDL", "triglicerídeos", "estatina", "risco cardiovascular", "APS"],
      status: "ativo",
    },

    indications: [
      "Adulto com lipidograma alterado, suspeita ou diagnóstico inicial de dislipidemia na APS.",
      "Avaliação para estratificar risco cardiovascular, revisar causas secundárias e definir plano inicial.",
      "Não usar como fluxo principal em evento cardiovascular agudo, pancreatite, miopatia grave ou gestação sem revisão específica.",
    ],

    dataRequirements: {
      useNow: [
        "Lipidograma com data: colesterol total, HDL-c, LDL-c, não-HDL-c e triglicerídeos",
        "Fatores de risco e comorbidades: HAS, DM2, DRC, DCV, obesidade, tabagismo e história familiar",
        "Medicações em uso, álcool, hábitos alimentares e nível de atividade física",
        "Sintomas de alerta: dor abdominal, vômitos, dor muscular intensa, fraqueza ou urina escura",
        "Glicemia/HbA1c, creatinina/eTFG, ALT/AST e TSH se disponíveis ou indicados",
      ],
      idealForAdjustment: [
        "Estratificação de risco cardiovascular",
        "História familiar de DCV precoce, xantomas ou suspeita de hipercolesterolemia familiar",
        "Causas secundárias: hipotireoidismo, diabetes descompensado, DRC, álcool, medicamentos, hepatopatia ou síndrome nefrótica",
        "Risco de toxicidade, interações medicamentosas, hepatopatia, miopatia prévia ou contraindicações terapêuticas",
        "Presença de DCV aterosclerótica, DRC, DM2 ou outras condições que mudam meta e intensidade terapêutica",
      ],
    },

    ui: {
      subjectivePrompt: "Registrar motivo da avaliação, lipidograma alterado, história familiar, fatores de risco, comorbidades, medicações, álcool, alimentação, atividade física e sintomas de alerta.",
      objectivePrompt: "Registrar apenas dados realmente aferidos/documentados: peso, IMC, PA, circunferência abdominal se medida, lipidograma com data, RCV, função renal, transaminases e glicemia/HbA1c.",
      quickNotes: [
        "Não definir meta lipídica sem estratificar risco cardiovascular.",
        "Não iniciar/intensificar tratamento sem revisar contexto, adesão possível, contraindicações e causas secundárias.",
        "TG muito elevado com dor abdominal/vômitos exige avaliar pancreatite/urgência.",
      ],
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente em avaliação inicial por lipidograma alterado/suspeita de dislipidemia na APS.",
          "Consulta voltada à revisão do perfil lipídico, risco cardiovascular, comorbidades, história familiar, hábitos de vida, medicações em uso e possíveis causas secundárias.",
          "Relato de sintomas de alerta, dor muscular, dor abdominal, álcool, tabagismo e antecedentes conforme dados informados na consulta.",
        ],
        objectiveOutputBlocks: [
          "Dados objetivos conforme preenchimento: peso, IMC, PA, circunferência abdominal se medida, lipidograma, cálculo de risco cardiovascular, função renal, transaminases e glicemia/HbA1c.",
          "LDL-c, não-HDL-c e triglicerídeos interpretados conforme data do exame, risco cardiovascular e contexto clínico.",
          "Comorbidades, fatores de risco e sinais sugestivos de causa secundária registrados conforme dados documentados.",
        ],
        assessmentBlocks: [
          "Dislipidemia/alteração lipídica em avaliação inicial na APS.",
          "Meta e intensidade terapêutica dependem do risco cardiovascular, perfil lipídico, comorbidades, tolerância e preferências do paciente.",
          "Se risco cardiovascular ou exames complementares ainda não estiverem disponíveis, mantenho avaliação inicial e organizo estratificação antes de consolidar conduta definitiva.",
          "Reviso causas secundárias, história familiar de DCV precoce, sinais de hipercolesterolemia familiar, risco de pancreatite e segurança terapêutica conforme dados disponíveis.",
        ],
        planBlocks: [
          "Registro lipidograma disponível com data e contexto da avaliação.",
          "Estratifico risco cardiovascular e integro com HAS, DM2, DRC, DCV, tabagismo, obesidade e história familiar.",
          "Solicito/atualizo lipidograma, glicemia ou HbA1c, creatinina/eTFG e ALT/AST conforme pendências, risco e contexto clínico.",
          "Solicito TSH ou outros exames se suspeita de causa secundária, como hipotireoidismo, diabetes descompensado, doença renal, hepatopatia, álcool, medicamentos ou síndrome nefrótica.",
          "Defino plano terapêutico conforme LDL-c, não-HDL-c, triglicerídeos, risco cardiovascular, comorbidades, contraindicações, tolerância e acesso ao tratamento.",
          "Considero estatina como primeira opção quando houver indicação de terapia hipolipemiante, após discutir objetivo, adesão, riscos e benefícios.",
          "Considero terapia mais intensiva ou associação conforme risco cardiovascular, meta necessária, LDL-c muito elevado, DCV, DM2, DRC ou resposta esperada.",
          "Considero abordagem específica para triglicerídeos muito elevados, especialmente ≥500 mg/dL, após revisar causas secundárias e risco de pancreatite.",
          "Oriento alimentação adequada, redução de gorduras saturadas/trans, ultraprocessados, bebidas açucaradas e álcool, aumento de fibras quando possível, atividade física conforme condição clínica, controle de peso e cessação do tabagismo quando aplicável.",
          "Reforço sinais de alarme e oriento procurar urgência se dor abdominal intensa, vômitos persistentes, mal-estar importante, dor muscular intensa, fraqueza progressiva, urina escura, dor torácica, dispneia ou déficit neurológico.",
          "Programo retorno em 6 a 12 semanas se iniciar/ajustar terapia ou se alteração importante precisar reavaliação; se apenas organização inicial sem medicação, retorno conforme risco, pendências e organização da APS.",
        ],
      },

      exams: {
        panelBase: [
          "Lipidograma com data: colesterol total, HDL-c, LDL-c, não-HDL-c e triglicerídeos",
          "Glicemia de jejum ou HbA1c",
          "Creatinina sérica, para cálculo automático de eTFG",
          "ALT/AST conforme contexto clínico, segurança terapêutica ou suspeita de hepatopatia",
        ],
        directed: [
          "TSH se suspeita de hipotireoidismo, LDL-c elevado sem causa clara ou dislipidemia de difícil controle.",
          "CK basal apenas se alto risco de miopatia, antecedente de doença muscular, sintomas musculares prévios ou interação medicamentosa relevante.",
          "ApoB se triglicerídeos elevados, discordância entre LDL-c e não-HDL-c ou necessidade de avaliação mais detalhada de risco, conforme disponibilidade.",
          "Lp(a) uma vez na vida quando disponível, especialmente em DCV precoce, suspeita de hipercolesterolemia familiar, estenose aórtica, história familiar relevante ou risco cardiovascular aumentado.",
          "EAS/albuminúria se DRC, DM2, HAS, suspeita de doença renal ou necessidade de estratificação cardiometabólica.",
        ],
        monitoring: [
          "Lipidograma em 6 a 12 semanas após início ou ajuste da terapia hipolipemiante.",
          "Após estabilização, lipidograma em geral a cada 6 a 12 meses, conforme risco cardiovascular e adesão.",
          "ALT/AST e CK não devem ser repetidos rotineiramente sem indicação; solicitar conforme sintomas, contexto clínico, hepatopatia, miopatia ou risco de toxicidade.",
          "Reavaliar risco cardiovascular quando houver mudança clínica relevante, novo diagnóstico de HAS/DM2/DRC/DCV ou alteração importante do perfil lipídico.",
        ],
      },

      guidance: [
        "Oriento que a decisão de tratamento depende do risco cardiovascular global, do perfil lipídico e do contexto clínico.",
        "Oriento alimentação adequada, redução de gorduras saturadas/trans, ultraprocessados, bebidas açucaradas e álcool, além de aumento de fibras quando possível.",
        "Oriento atividade física conforme condição clínica, controle de peso e cessação do tabagismo quando aplicável.",
        "Oriento uso regular da medicação se iniciada e não suspensão por conta própria.",
        "Oriento avisar se houver dor muscular importante, fraqueza progressiva, urina escura, dor abdominal intensa, vômitos persistentes ou mal-estar importante.",
      ],

      followup: [
        "Reavalio lipidograma, risco cardiovascular, comorbidades, causas secundárias, adesão às orientações e necessidade de tratamento medicamentoso.",
        "Programo retorno em 6 a 12 semanas se houver início ou ajuste terapêutico, ou antes se sintomas relevantes.",
        "Se não houver medicação inicial e o foco for estratificação/medidas de estilo de vida, programo retorno conforme risco, pendências e organização da APS.",
        "Após estabilização, organizo seguimento semelhante ao retorno de dislipidemia, com periodicidade conforme risco cardiovascular, metas, adesão e disponibilidade da rede.",
      ],

      specialSituations: [
        "Triglicerídeos persistentemente muito elevados, especialmente ≥500 mg/dL, pelo risco de pancreatite e necessidade de abordagem específica.",
        "Dor abdominal intensa, vômitos persistentes ou suspeita de pancreatite aguda.",
        "Dor muscular intensa, fraqueza progressiva, urina escura ou suspeita de miopatia grave/rabdomiólise.",
        "LDL-c muito elevado persistente, história familiar de DCV precoce, xantomas ou suspeita de hipercolesterolemia familiar.",
        "Evento cardiovascular agudo, dor torácica, déficit neurológico ou dispneia aguda, que exigem fluxo de urgência.",
        "Gestação, planejamento gestacional ou amamentação, que exigem revisão específica da terapia hipolipemiante.",
      ],

      longitudinalFocus: [
        "Diferenciar alteração lipídica isolada, dislipidemia persistente e dislipidemia associada a alto risco cardiovascular.",
        "Registrar data do lipidograma e evitar definir meta ou conduta definitiva sem risco cardiovascular e contexto clínico.",
        "Revisar causas secundárias antes de consolidar dislipidemia como problema isolado.",
        "Integrar dislipidemia ao plano cardiometabólico com HAS, DM2, DRC, DCV, obesidade e tabagismo.",
        "Após definição inicial, migrar para seguimento longitudinal de dislipidemia com metas individualizadas.",
        "Avaliar cuidado compartilhado quando houver suspeita de hipercolesterolemia familiar, intolerância importante, TG muito elevado, falha terapêutica ou risco cardiovascular muito elevado/extremo.",
      ],
    },

    apply: {
      problems: [{ key: "dislipidemia", label: "Dislipidemia / alteração lipídica em avaliação" }],
    },

    governance: {
      status: "ativo",
      version: "1.2.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-24",
      changes: "Revisão clínica e operacional do template Dislipidemia — Inicial. Corrigida codificação de acentos. Adicionados apply.problems e longitudinalFocus. Escopo ajustado para lipidograma alterado, suspeita ou diagnóstico inicial de dislipidemia na APS, evitando iniciar estatina automaticamente sem estratificação de risco e contexto clínico. Removidas frases que documentavam ações não necessariamente realizadas. Saída reescrita para uso prático em eSUS, com menor necessidade de edição pelo médico. Integrados risco cardiovascular, causas secundárias, HAS, DM2, DRC, DCV, segurança terapêutica, sinais de alarme e alinhamento com PCDT/SUS e Diretriz Brasileira de Dislipidemias 2025.",
      sources: [
        {
          label: "Ministério da Saúde/Conitec — Protocolo Clínico e Diretrizes Terapêuticas da Dislipidemia: prevenção de eventos cardiovasculares e pancreatite",
          url: "https://www.gov.br/saude/pt-br/assuntos/pcdt/d/dislipidemia/view",
          type: "primary",
          year: "2025",
        },
        {
          label: "Sociedade Brasileira de Cardiologia — Diretriz Brasileira de Dislipidemias e Prevenção da Aterosclerose",
          url: "https://abccardiol.org/wp-content/uploads/articles_xml/0066-782X-abc-122-09-e20250640/0066-782X-abc-122-09-e20250640.x66747.pdf",
          type: "secondary",
          year: "2025",
        },
      ],
    },
  },

  // â”€â”€ Dislipidemia â€” Retorno v1.3.1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "dislipidemia_retorno",

    metadata: {
      name: "Dislipidemia — Retorno",
      description: "Retorno ambulatorial de pessoa adulta com dislipidemia em seguimento na APS, com foco em risco cardiovascular, metas lipídicas, adesão e segurança terapêutica.",
      category: "cronico",
      tags: ["dislipidemia", "estatina", "LDL", "não-HDL", "triglicerídeos", "risco cardiovascular", "retorno", "APS"],
      status: "ativo",
    },

    indications: [
      "Adulto com dislipidemia já diagnosticada em retorno ambulatorial na APS.",
      "Revisão de lipidograma, risco cardiovascular, adesão, tolerância, tratamento e medidas de estilo de vida.",
      "Usar em seguimento crônico sem sinais de pancreatite, miopatia grave ou evento cardiovascular agudo.",
    ],

    dataRequirements: {
      useNow: [
        "Tratamento atual: medidas de estilo de vida, estatina, ezetimiba, fibrato ou outros, com dose e adesão",
        "Lipidograma recente com data, se disponível",
        "Sintomas musculares, fraqueza, urina escura, dor abdominal ou efeitos adversos",
        "Comorbidades e risco cardiovascular: HAS, DM2, DRC, DCV, tabagismo, obesidade e história familiar",
        "ALT/AST, creatinina/eTFG, glicemia/HbA1c e CK se indicados ou disponíveis",
      ],
      idealForAdjustment: [
        "LDL-c, não-HDL-c e triglicerídeos com comparação anterior",
        "Estratificação de risco cardiovascular e presença de DCV aterosclerótica",
        "Aderência ao tratamento, tolerância, interações medicamentosas e barreiras de acesso",
        "Causas secundárias: hipotireoidismo, diabetes descompensado, DRC, álcool, medicamentos ou síndrome nefrótica",
        "História familiar de DCV precoce ou suspeita de hipercolesterolemia familiar",
      ],
    },

    ui: {
      subjectivePrompt: "Registrar adesão, tratamento atual, sintomas musculares, efeitos adversos, mudanças de alimentação/atividade física, tabagismo, álcool e intercorrências cardiovasculares.",
      objectivePrompt: "Registrar apenas dados realmente aferidos/documentados: peso, IMC, PA, lipidograma com data, RCV, função renal, transaminases, CK se indicada e comorbidades.",
      quickNotes: [
        "Não classificar meta lipídica sem lipidograma recente e risco cardiovascular definido.",
        "Antes de intensificar, revisar adesão, tolerância, dose, interações, acesso e causas secundárias.",
        "TG muito elevado com dor abdominal ou sintomas sistêmicos exige avaliar pancreatite/urgência.",
      ],
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente em seguimento por dislipidemia na APS.",
          "Retorna para revisão de lipidograma, risco cardiovascular, adesão, tratamento, tolerância e medidas de estilo de vida.",
          "Relato de sintomas musculares, efeitos adversos, mudanças de hábitos, tabagismo, álcool e intercorrências conforme dados informados na consulta.",
        ],
        objectiveOutputBlocks: [
          "Dados objetivos conforme preenchimento: peso, IMC, PA, lipidograma, cálculo de risco cardiovascular, função renal, transaminases e CK quando indicada.",
          "LDL-c, não-HDL-c e triglicerídeos interpretados conforme data do exame, risco cardiovascular e contexto clínico.",
          "Comorbidades e fatores de risco cardiovascular registrados conforme dados documentados.",
        ],
        assessmentBlocks: [
          "Dislipidemia em seguimento longitudinal na APS.",
          "Controle lipídico avaliado conforme lipidograma disponível; se ausente ou antigo, não classifico meta como adequadamente avaliada.",
          "Meta terapêutica individualizada conforme risco cardiovascular, presença de HAS, DM2, DRC, DCV aterosclerótica, idade, tolerância e preferências do paciente.",
          "Reviso adesão, tolerância, efeitos adversos, interações medicamentosas, causas secundárias e necessidade de intensificação terapêutica.",
        ],
        planBlocks: [
          "Mantenho tratamento atual ou ajusto terapia hipolipemiante conforme LDL-c, não-HDL-c, triglicerídeos, risco cardiovascular, adesão, tolerância, interações e acesso.",
          "Reforço adesão ao tratamento e não suspensão de estatina ou outra medicação por conta própria.",
          "Oriento alimentação adequada, redução de gorduras saturadas/trans, ultraprocessados e bebidas açucaradas, aumento de fibras quando possível, atividade física conforme condição clínica, controle de peso e cessação do tabagismo quando aplicável.",
          "Solicito/atualizo lipidograma conforme tempo desde último exame, ajuste terapêutico, controle e risco cardiovascular.",
          "Solicito/atualizo ALT/AST, creatinina/eTFG, glicemia ou HbA1c e TSH conforme contexto clínico, sintomas, comorbidades, suspeita de causa secundária ou segurança terapêutica.",
          "Solicito CK apenas se sintomas musculares relevantes, fraqueza, suspeita de miopatia, alto risco de toxicidade ou interação medicamentosa relevante.",
          "Considero intensificar estatina ou associar ezetimiba se meta não atingida após revisar adesão, tolerância, dose máxima tolerada, risco cardiovascular e disponibilidade.",
          "Considero fibrato ou avaliação específica se triglicerídeos persistentemente muito elevados, especialmente ≥500 mg/dL, após revisar causas secundárias e risco de pancreatite.",
          "Reforço sinais de alarme e oriento procurar urgência se dor abdominal intensa, vômitos persistentes, mal-estar importante, dor muscular intensa, fraqueza progressiva ou urina escura.",
          "Programo retorno em 6 a 12 semanas após início/ajuste terapêutico ou investigação de alteração importante; se estável, retorno em 6 a 12 meses conforme risco e organização da APS.",
        ],
      },

      exams: {
        panelBase: [
          "Lipidograma com data: colesterol total, HDL-c, LDL-c, não-HDL-c e triglicerídeos",
          "Glicemia de jejum ou HbA1c",
          "Creatinina sérica, para cálculo automático de eTFG",
          "ALT/AST conforme contexto clínico, segurança terapêutica ou suspeita de hepatopatia",
        ],
        directed: [
          "CK se sintomas musculares relevantes, fraqueza, suspeita de miopatia, alto risco de toxicidade ou interação medicamentosa relevante.",
          "TSH se suspeita de hipotireoidismo ou causa secundária de dislipidemia.",
          "ApoB se triglicerídeos elevados, discordância entre LDL-c e não-HDL-c ou necessidade de avaliação mais detalhada de risco, conforme disponibilidade.",
          "Lp(a) uma vez na vida quando disponível, especialmente em DCV precoce, suspeita de hipercolesterolemia familiar, estenose aórtica, história familiar relevante ou risco cardiovascular aumentado.",
          "EAS/albuminúria se DRC, DM2, HAS, suspeita de doença renal ou necessidade de estratificação cardiometabólica.",
        ],
        monitoring: [
          "Lipidograma em 6 a 12 semanas após início ou ajuste da terapia hipolipemiante.",
          "Após estabilização, lipidograma em geral a cada 6 a 12 meses, conforme risco cardiovascular e adesão.",
          "ALT/AST e CK não devem ser repetidos rotineiramente sem indicação; solicitar conforme sintomas, contexto clínico, hepatopatia, miopatia ou risco de toxicidade.",
          "Reavaliar risco cardiovascular quando houver mudança clínica relevante, novo diagnóstico de HAS/DM2/DRC/DCV ou alteração importante do perfil lipídico.",
        ],
      },

      guidance: [
        "Oriento uso regular da medicação prescrita e não suspensão por conta própria.",
        "Oriento avisar se houver dor muscular importante, fraqueza progressiva, urina escura, dor abdominal intensa, vômitos persistentes ou mal-estar importante.",
        "Oriento reduzir gorduras saturadas/trans, ultraprocessados, bebidas açucaradas e álcool, além de aumentar fibras quando possível.",
        "Oriento atividade física conforme condição clínica, controle de peso e cessação do tabagismo quando aplicável.",
        "Oriento que o tratamento da dislipidemia faz parte da redução de risco cardiovascular global, junto com controle de PA, glicemia, peso e tabagismo.",
      ],

      followup: [
        "Reavalio lipidograma, adesão, tolerância, efeitos adversos, risco cardiovascular, comorbidades e necessidade de intensificação.",
        "Programo retorno em 6 a 12 semanas após início ou ajuste terapêutico, ou antes se sintomas relevantes.",
        "Após estabilização, programo retorno em 6 a 12 meses conforme risco cardiovascular, metas, adesão e organização da APS.",
        "Reavalio necessidade de cuidado compartilhado se LDL-c muito elevado persistente, suspeita de hipercolesterolemia familiar, TG muito elevado, DCV aterosclerótica complexa, intolerância relevante ou falha terapêutica apesar de adesão.",
      ],

      specialSituations: [
        "Triglicerídeos persistentemente muito elevados, especialmente ≥500 mg/dL, pelo risco de pancreatite e necessidade de abordagem específica.",
        "Dor abdominal intensa, vômitos persistentes ou suspeita de pancreatite aguda.",
        "Dor muscular intensa, fraqueza progressiva, urina escura ou suspeita de miopatia grave/rabdomiólise em uso de estatina ou terapia combinada.",
        "LDL-c muito elevado persistente, história familiar de DCV precoce, xantomas ou suspeita de hipercolesterolemia familiar.",
        "Evento cardiovascular agudo, dor torácica, déficit neurológico ou dispneia aguda, que exigem fluxo de urgência.",
        "Gestação, planejamento gestacional ou amamentação, que exigem revisão específica da terapia hipolipemiante.",
      ],

      longitudinalFocus: [
        "Comparar LDL-c, não-HDL-c e triglicerídeos atuais com resultados anteriores e com a meta individualizada.",
        "Registrar data do lipidograma e evitar classificar controle sem exame recente ou risco cardiovascular definido.",
        "Revisar adesão, tolerância, interações, acesso e causas secundárias antes de intensificar tratamento.",
        "Integrar dislipidemia ao plano cardiometabólico com HAS, DM2, DRC, DCV, obesidade e tabagismo.",
        "Monitorar necessidade de intensificação terapêutica, associação de ezetimiba ou abordagem de triglicerídeos muito elevados.",
        "Avaliar cuidado compartilhado quando houver suspeita de hipercolesterolemia familiar, intolerância importante, falha terapêutica ou risco cardiovascular muito elevado/extremo.",
      ],
    },

    apply: {
      problems: [{ key: "dislipidemia", label: "Dislipidemia" }],
    },

    governance: {
      status: "ativo",
      version: "1.2.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-24",
      changes: "Revisão clínica e operacional do template Dislipidemia — Retorno. Escopo ampliado para seguimento de dislipidemia na APS, não limitado a uso de estatina ou ausência de DCVA. Removidas frases que documentavam ações não necessariamente realizadas. Saída reescrita para uso prático em eSUS, com menor necessidade de edição pelo médico. Integrados risco cardiovascular, HAS, DM2, DRC, DCV, adesão, tolerância, efeitos adversos, causas secundárias, metas lipídicas e segurança terapêutica. Governança fortalecida com PCDT/SUS e Diretriz Brasileira de Dislipidemias 2025.",
      sources: [
        {
          label: "Ministério da Saúde/Conitec — Protocolo Clínico e Diretrizes Terapêuticas da Dislipidemia: prevenção de eventos cardiovasculares e pancreatite",
          url: "https://www.gov.br/saude/pt-br/assuntos/pcdt/d/dislipidemia/view",
          type: "primary",
          year: "2025",
        },
        {
          label: "Sociedade Brasileira de Cardiologia — Diretriz Brasileira de Dislipidemias e Prevenção da Aterosclerose",
          url: "https://abccardiol.org/wp-content/uploads/articles_xml/0066-782X-abc-122-09-e20250640/0066-782X-abc-122-09-e20250640.x66747.pdf",
          type: "secondary",
          year: "2025",
        },
      ],
    },
  },

  // â”€â”€ Hipotireoidismo â€” Retorno â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // STATUS: MIGRADO v1.3.1 (21/04/2026)
  {
    id: "hipotireoidismo_retorno",

    metadata: {
      name: "Hipotireoidismo — Retorno",
      description: "Retorno ambulatorial de pessoa adulta com hipotireoidismo em uso de levotiroxina na APS, com foco em TSH, adesão, modo de uso, sintomas e segurança do ajuste.",
      category: "cronico",
      tags: ["hipotireoidismo", "levotiroxina", "TSH", "T4 livre", "tireoide", "APS", "retorno"],
      status: "ativo",
    },

    indications: [
      "Adulto com hipotireoidismo já diagnosticado em retorno ambulatorial na APS.",
      "Revisão de TSH/T4L quando indicado, dose, adesão, modo de uso, sintomas e necessidade de ajuste.",
      "Usar em seguimento crônico sem gestação, suspeita de hipotireoidismo central ou sintomas cardiovasculares relevantes.",
    ],

    dataRequirements: {
      useNow: [
        "Dose atual de levotiroxina e tempo desde último ajuste",
        "TSH recente com data, se disponível",
        "Adesão, horário de tomada e uso em jejum",
        "Interações: cálcio, ferro, antiácidos, IBP, alimentos, polivitamínicos ou outros medicamentos",
        "Sintomas de hipo/hipertireoidismo, gestação/suspeita de gestação, cardiopatia ou idade avançada",
      ],
      idealForAdjustment: [
        "TSH comparado com resultado anterior",
        "T4 livre se TSH alterado, suspeita de hipotireoidismo central, gestação ou contexto específico",
        "Peso atual, mudança ponderal relevante e comorbidades",
        "Uso de medicações que interferem na absorção/metabolismo da levotiroxina",
        "Histórico de tireoidectomia, radioiodoterapia, doença autoimune, nódulo tireoidiano ou seguimento especializado",
      ],
    },

    ui: {
      subjectivePrompt: "Registrar sintomas, dose atual, adesão, horário de uso da levotiroxina, jejum, interações, efeitos adversos, gestação/suspeita e evolução desde a última consulta.",
      objectivePrompt: "Registrar apenas dados realmente aferidos/documentados: peso, PA, FC, exame físico relevante, TSH com data, T4L se disponível e exames associados.",
      quickNotes: [
        "Não ajustar dose apenas por sintomas sem revisar TSH com data, adesão, horário de uso e interações.",
        "Repetir TSH em geral 6 a 8 semanas após início ou ajuste de dose.",
        "Gestação/suspeita, TSH baixo com T4L baixo ou sintomas cardiovasculares relevantes exigem atenção/fluxo específico.",
      ],
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente em seguimento por hipotireoidismo na APS, em uso de levotiroxina.",
          "Retorna para revisão de sintomas, dose atual, adesão, modo de uso da medicação, interações e controle laboratorial.",
          "Relato de sintomas, efeitos adversos, horário de tomada, uso em jejum e interferentes de absorção conforme dados informados na consulta.",
        ],
        objectiveOutputBlocks: [
          "Dados objetivos conforme preenchimento: peso, PA, FC, exame físico relevante, TSH com data, T4 livre quando disponível e exames associados.",
          "Controle laboratorial interpretado conforme TSH/T4L disponíveis, data do exame, tempo desde último ajuste e contexto clínico.",
          "Fatores que podem interferir no controle, como adesão, interações e mudança de peso, registrados conforme dados documentados.",
        ],
        assessmentBlocks: [
          "Hipotireoidismo em seguimento longitudinal na APS.",
          "Controle clínico-laboratorial avaliado conforme sintomas, TSH/T4L disponíveis, adesão, modo de uso e tempo desde último ajuste.",
          "Se não houver TSH recente ou se houver dúvida sobre adesão/interações, não classifico controle laboratorial como adequadamente avaliado.",
          "Reviso risco de sobretratamento ou subtratamento, especialmente em idoso, cardiopatia, osteoporose, gestação/suspeita ou sintomas cardiovasculares.",
        ],
        planBlocks: [
          "Registro dose atual de levotiroxina, modo de uso, adesão, interações e TSH/T4L disponíveis com data.",
          "Mantenho ou ajusto levotiroxina conforme TSH com data, sintomas, adesão, horário de uso, interações, idade, peso, cardiopatia e contexto clínico.",
          "Oriento uso da levotiroxina em jejum, preferencialmente 30 a 60 minutos antes do café da manhã, com água.",
          "Oriento separar levotiroxina de cálcio, ferro, antiácidos, polivitamínicos e outros interferentes, em geral por pelo menos 4 horas.",
          "Reviso medicamentos e condições que podem interferir na absorção ou necessidade de dose, incluindo IBP, antiácidos, suplementos, mudança de peso, gestação e adesão irregular.",
          "Solicito/atualizo TSH conforme tempo desde último exame, ajuste de dose, sintomas, adesão e contexto clínico.",
          "Solicito T4 livre quando TSH estiver alterado, houver suspeita de hipotireoidismo central, gestação/suspeita, sintomas relevantes ou necessidade de esclarecimento.",
          "Reforço sinais de excesso de dose e oriento retorno se palpitações, tremor, insônia, perda de peso inexplicada, ansiedade intensa, dor torácica ou piora clínica.",
          "Programo reavaliação de TSH em 6 a 8 semanas após início/ajuste de dose; se estável, acompanhamento em 6 a 12 meses conforme contexto.",
        ],
      },

      exams: {
        panelBase: [
          "TSH com data",
        ],
        directed: [
          "T4 livre se TSH alterado, suspeita de hipotireoidismo central, gestação/suspeita, sintomas relevantes ou necessidade de esclarecimento.",
          "Lipidograma se dislipidemia, risco cardiovascular aumentado ou reavaliação metabólica.",
          "Hemograma, ferritina, vitamina B12 ou outros exames se fadiga persistente ou sintomas não explicados pelo controle tireoidiano.",
          "Ultrassonografia de tireoide apenas se nódulo palpável, bócio, assimetria cervical ou outra indicação clínica; não solicitar rotineiramente para seguimento de hipotireoidismo estável.",
        ],
        monitoring: [
          "TSH em 6 a 8 semanas após início ou ajuste de dose.",
          "Se estável, TSH em geral a cada 6 a 12 meses, conforme contexto clínico.",
          "Reavaliar mais precocemente se gestação/suspeita, mudança importante de peso, troca de formulação, introdução de medicamento interferente, sintomas relevantes ou adesão irregular.",
        ],
      },

      guidance: [
        "Oriento tomar levotiroxina em jejum, com água, preferencialmente 30 a 60 minutos antes do café da manhã.",
        "Oriento manter intervalo de pelo menos 4 horas entre levotiroxina e cálcio, ferro, antiácidos, polivitamínicos ou suplementos.",
        "Oriento não alterar dose ou suspender a medicação por conta própria.",
        "Oriento avisar se houver palpitações, tremor, insônia, perda de peso inexplicada, dor torácica, piora importante de cansaço ou sintomas persistentes.",
        "Oriento informar gestação, suspeita de gestação, troca de marca/formulação ou início de novos medicamentos.",
      ],

      followup: [
        "Reavalio TSH, sintomas, adesão, modo de uso, interações, dose atual e tempo desde último ajuste.",
        "Programo controle de TSH em 6 a 8 semanas após início ou ajuste de dose.",
        "Se TSH estável e paciente clinicamente estável, programo acompanhamento em 6 a 12 meses conforme contexto.",
        "Reavalio necessidade de encaminhamento/endocrinologia se suspeita de hipotireoidismo central, gestação, dificuldade persistente de controle, sintomas cardiovasculares relevantes ou dúvida diagnóstica.",
      ],

      specialSituations: [
        "Gestação, suspeita de gestação ou planejamento gestacional, que exigem manejo específico.",
        "Suspeita de hipotireoidismo central: TSH normal/baixo com T4 livre baixo, ou contexto hipofisário/hipotalâmico.",
        "TSH suprimido ou sintomas de excesso de levotiroxina, como palpitações, tremor, insônia, perda de peso inexplicada ou arritmia.",
        "Idoso, cardiopatia, osteoporose ou risco aumentado de eventos adversos por sobretratamento.",
        "Dificuldade persistente de controle apesar de adesão adequada, uso correto e revisão de interações/absorção.",
        "Bócio importante, nódulo palpável, assimetria cervical, sintomas compressivos ou suspeita de doença tireoidiana estrutural.",
      ],

      longitudinalFocus: [
        "Comparar TSH atual com resultado anterior, sempre considerando data, dose e tempo desde último ajuste.",
        "Registrar dose de levotiroxina, modo de uso, adesão e interferentes de absorção em cada revisão relevante.",
        "Evitar ajuste por sintomas isolados sem revisar TSH, adesão, horário de tomada e interações.",
        "Revisar risco de sobretratamento em idosos, cardiopatas, osteoporose ou TSH persistentemente baixo.",
        "Investigar outras causas de sintomas persistentes quando TSH estiver em alvo, como anemia, depressão, distúrbios do sono, deficiência nutricional ou outras comorbidades.",
        "Manter cuidado compartilhado quando houver gestação, suspeita de hipotireoidismo central, nódulo/bócio relevante ou dificuldade persistente de controle.",
      ],
    },

    apply: {
      problems: [{ key: "hipotireoidismo", label: "Hipotireoidismo" }],
    },

    governance: {
      status: "ativo",
      version: "1.2.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-24",
      changes: "Revisão clínica e operacional do template Hipotireoidismo — Retorno. Corrigida codificação de acentos. Removidas frases que documentavam ações não necessariamente realizadas. Saída reescrita para uso prático em eSUS, com menor necessidade de edição pelo médico. Reforçada segurança do ajuste de levotiroxina com TSH/T4L, data do exame, adesão, modo de uso, interações, gestação, cardiopatia, idade avançada e risco de sobretratamento. Mantidas fontes oficiais PCDT Conitec e Protocolo de Encaminhamento MS/UFRGS.",
      sources: [
        {
          label: "Ministério da Saúde/Conitec — PCDT Resumido do Hipotireoidismo",
          url: "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt_resumido_do_hipotireoidismo.pdf/view",
          type: "primary",
          year: "2023",
        },
        {
          label: "Ministério da Saúde/UFRGS — Protocolos de Encaminhamento da Atenção Primária para a Atenção Especializada: Endocrinologia Adulto",
          url: "https://bvsms.saude.gov.br/bvs/publicacoes/protocolos_encaminhamento_atencao_endocrinologia_adulto.pdf",
          type: "secondary",
          year: "2022",
        },
      ],
    },
  },

  // â”€â”€ Asma / DPOC â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // STATUS: DESATUALIZADO (15/04/2026)
  // SubstituÃ­do por dois templates prÃ³prios:
  //   - dpoc_retorno  (classificaÃ§Ã£o GOLD 2024 ABE)
  //   - asma_retorno  (classificaÃ§Ã£o GINA/MS)
  // Mantido para audit trail â€” nÃ£o excluir.
  {
    id: "asma_dpoc_retorno",
    name: "Asma / DPOC â€” Retorno",
    description: "Template legado â€” usar dpoc_retorno ou asma_retorno.",
    category: "cronico",
    whenToUse: undefined,
    whenNotToUse: "DESATUALIZADO. Usar dpoc_retorno (DPOC) ou asma_retorno (Asma).",
    minimumData: undefined,
    tags: [],
    soap: {
      subjective: "DESATUALIZADO â€” usar dpoc_retorno ou asma_retorno.",
      assessment: undefined,
      plan: undefined,
    },
    exams: undefined,
    guidance: "DESATUALIZADO.",
    redFlags: undefined,
    followup: undefined,
    governance: {
      source: "MS. Linha de Cuidado Asma (2021); MS. Linha de Cuidado DPOC; MS. PCDT Asma, 2021",
      sourceUrl: "https://linhasdecuidado.saude.gov.br/portal/asma/",
      status: "desatualizado",
      version: "1.0.0",
      lastRevised: "2026-04-14",
    },
  },

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // DPOC â€” Retorno
  // PadrÃ£o mestre: seÃ§Ã£o 6, sessÃ£o 15 (15/04/2026)
  // Fonte principal: GOLD 2024 â€” Global Strategy for Diagnosis, Management
  //   and Prevention of COPD; goldcopd.org
  // Fonte secundÃ¡ria: MS. Linha de Cuidado DPOC
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // â”€â”€ DPOC â€” Retorno v1.3.1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "dpoc_retorno",

    metadata: {
      name: "DPOC â€” Retorno",
      description: "Acompanhamento de DPOC confirmado por espirometria na APS â€” classificaÃ§Ã£o GOLD ABE, tÃ©cnica inalatÃ³ria e cessaÃ§Ã£o tabÃ¡gica.",
      category: "cronico",
      tags: ["DPOC", "LAMA", "LABA", "exacerbaÃ§Ã£o", "tabagismo", "mMRC", "CAT"],
      status: "ativo",
    },

    indications: [
      "Paciente com DPOC confirmado por espirometria (VEF1/CVF pÃ³s-broncodilatador <0,70), em seguimento na APS.",
      "Consulta de retorno para reavaliaÃ§Ã£o de controle, exacerbaÃ§Ãµes, tÃ©cnica inalatÃ³ria e cessaÃ§Ã£o tabÃ¡gica.",
    ],

    dataRequirements: {
      useNow: [
        "Dispneia atual (escala mMRC)",
        "Uso de broncodilatador de resgate na Ãºltima semana",
        "ExacerbaÃ§Ãµes e internaÃ§Ãµes nos Ãºltimos 12 meses",
        "SituaÃ§Ã£o tabÃ¡gica atual",
      ],
      idealForAdjustment: [
        "PontuaÃ§Ã£o CAT",
        "Espirometria recente",
        "EosinÃ³filos (guia para corticoide inalatÃ³rio no grupo E)",
        "Oximetria",
      ],
    },

    ui: {
      subjectivePrompt: "Revisar dispneia (mMRC), uso de resgate, exacerbaÃ§Ãµes recentes, tabagismo e tÃ©cnica inalatÃ³ria.",
      objectivePrompt: "Registrar SpO2, FC, FR e ausculta pulmonar.",
      quickNotes: [
        "Grupo GOLD ABE: A = baixo risco/poucos sintomas; B = baixo risco/muitos sintomas; E = alto risco (â‰¥1 internaÃ§Ã£o ou â‰¥2 exacerbaÃ§Ãµes no Ãºltimo ano).",
        "TÃ©cnica inalatÃ³ria Ã© o principal ponto de falha â€” revisar em toda consulta.",
        "CessaÃ§Ã£o tabÃ¡gica Ã© a intervenÃ§Ã£o de maior impacto no prognÃ³stico.",
      ],
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente em seguimento por DPOC confirmado por espirometria.",
          "Na consulta, reavaliados grau de dispneia (mMRC), uso de broncodilatador de resgate, exacerbaÃ§Ãµes nos Ãºltimos 12 meses e situaÃ§Ã£o tabÃ¡gica.",
          "Revisados tÃ©cnica inalatÃ³ria, adesÃ£o ao tratamento e intercorrÃªncias desde a Ãºltima consulta.",
        ],
        objectiveOutputBlocks: [
          "SpO2, FC e ausculta pulmonar registrados conforme consulta.",
        ],
        assessmentBlocks: [
          "DPOC confirmado por espirometria, em seguimento na APS.",
          "ClassificaÃ§Ã£o GOLD ABE reavaliada com base em sintomas, uso de resgate e histÃ³rico de exacerbaÃ§Ãµes.",
          "TÃ©cnica inalatÃ³ria e adesÃ£o ao tratamento reavaliadas na consulta.",
        ],
        planBlocks: [
          "Ajusto o tratamento broncodilatador conforme grupo GOLD ABE: broncodilatador de longa aÃ§Ã£o para grupo A; LAMA+LABA para grupo B; LAMA+LABA+corticoide inalatÃ³rio para grupo E, especialmente se eosinÃ³filos â‰¥300 cÃ©l/ÂµL.",
          "Oriento e corrijo a tÃ©cnica inalatÃ³ria quando necessÃ¡rio.",
          "ReforÃ§o cessaÃ§Ã£o tabÃ¡gica com aconselhamento e farmacoterapia disponÃ­vel via SUS quando indicado.",
          "Solicito vacinaÃ§Ã£o atualizada para influenza e pneumocÃ³cica conforme PNI vigente.",
          "Solicito espirometria conforme protocolo e mudanÃ§a clÃ­nica relevante.",
          "Programo retorno em 1 a 3 meses para grupo E ou instÃ¡vel; 6 meses para grupos A e B estÃ¡veis.",
        ],
      },

      exams: {
        panelBase: [
          "Oximetria em toda consulta",
        ],
        directed: [
          "Espirometria a cada 1 a 3 anos se estÃ¡vel; antes se mudanÃ§a clÃ­nica.",
          "Hemograma se suspeita de policitemia (SpO2 persistentemente baixa) ou exacerbaÃ§Ã£o.",
          "Radiografia de tÃ³rax se exacerbaÃ§Ã£o grave, hemoptise ou diagnÃ³stico diferencial.",
          "EosinÃ³filos como guia para uso de corticoide inalatÃ³rio no grupo E.",
        ],
        monitoring: [
          "SpO2 em toda consulta.",
          "Espirometria periÃ³dica conforme protocolo e evoluÃ§Ã£o clÃ­nica.",
        ],
      },

      guidance: [
        "Oriento que a tÃ©cnica inalatÃ³ria correta Ã© fundamental â€” revisar em toda consulta.",
        "Oriento que resgate mais de 2 vezes ao dia indica mau controle.",
        "Oriento cessaÃ§Ã£o tabÃ¡gica â€” Ã© a intervenÃ§Ã£o de maior impacto.",
        "Oriento vacinar influenza anualmente e verificar situaÃ§Ã£o vacinal pneumocÃ³cica.",
        "Oriento buscar atendimento se aumento da dispneia, escarro amarelo/verde, febre ou resgate muito frequente.",
      ],

      followup: [
        "Programo retorno em 1 a 3 meses se grupo E ou instÃ¡vel.",
        "Programo retorno em 6 meses se grupos A ou B estÃ¡veis.",
        "Reavalio antes se houver exacerbaÃ§Ã£o ou piora clÃ­nica.",
      ],

      specialSituations: [
        "SpO2 <88% em ar ambiente â€” avaliar necessidade de oxigenoterapia.",
        "ConfusÃ£o mental ou sonolÃªncia diurna â€” suspeitar de hipercapnia.",
        "ExacerbaÃ§Ã£o grave: dispneia em repouso, uso de musculatura acessÃ³ria, cianose.",
        "Hemoptise â€” investigar causa.",
      ],

      longitudinalFocus: [
        "Comparar classificaÃ§Ã£o GOLD ABE atual com avaliaÃ§Ã£o anterior.",
        "Revisar histÃ³rico de exacerbaÃ§Ãµes e internaÃ§Ãµes no Ãºltimo ano.",
        "Verificar progressÃ£o da dispneia e resposta ao tratamento atual.",
        "Registrar evoluÃ§Ã£o da cessaÃ§Ã£o tabÃ¡gica e estratÃ©gias em uso.",
      ],
    },

    apply: {
      problems: [{ key: "dpoc", label: "DPOC" }],
    },

    governance: {
      status: "ativo",
      version: "1.1.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-22",
      changes: "MigraÃ§Ã£o para v1.3.1. RemoÃ§Ã£o de SOAP com checkboxes e placeholders. ConversÃ£o de exams para objeto estruturado. InclusÃ£o de ui, longitudinalFocus e apply.problems.",
      sources: [
        {
          label: "GOLD 2025 â€” Global Strategy for Diagnosis, Management and Prevention of COPD",
          url: "https://goldcopd.org/",
          type: "primary",
          year: "2025",
        },
        {
          label: "MS â€” Linha de Cuidado DPOC",
          url: "https://linhasdecuidado.saude.gov.br/portal/doenca-pulmonar-obstrutiva-cronica/",
          type: "secondary",
          year: "2021",
        },
      ],
    },
  },

  // â”€â”€ Asma â€” Retorno v1.3.1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "asma_retorno",

    metadata: {
      name: "Asma â€” Retorno",
      description: "Acompanhamento de asma brÃ´nquica na APS â€” controle, tÃ©cnica inalatÃ³ria e ajuste de step terapÃªutico.",
      category: "cronico",
      tags: ["asma", "ICS", "GINA", "exacerbaÃ§Ã£o", "corticoide inalatÃ³rio", "MART"],
      status: "ativo",
    },

    indications: [
      "Paciente com asma diagnosticada, em seguimento ambulatorial na APS.",
      "Consulta de retorno para reavaliaÃ§Ã£o do controle, tÃ©cnica inalatÃ³ria, desencadeantes e adequaÃ§Ã£o do step terapÃªutico.",
    ],

    dataRequirements: {
      useNow: [
        "Sintomas da Ãºltima semana (tosse, sibilÃ¢ncia, dispneia, aperto torÃ¡cico)",
        "Uso de broncodilatador de resgate na Ãºltima semana",
        "ExacerbaÃ§Ãµes e internaÃ§Ãµes nos Ãºltimos 12 meses",
      ],
      idealForAdjustment: [
        "ACT (Asthma Control Test)",
        "Espirometria recente quando disponÃ­vel",
        "EosinÃ³filos se suspeita de indicaÃ§Ã£o para biolÃ³gicos",
      ],
    },

    ui: {
      subjectivePrompt: "Revisar sintomas da Ãºltima semana, frequÃªncia de resgate, desencadeantes, exacerbaÃ§Ãµes recentes e tÃ©cnica inalatÃ³ria.",
      objectivePrompt: "Registrar SpO2, FC, FR e ausculta pulmonar.",
      quickNotes: [
        "ClassificaÃ§Ã£o GINA de controle: bem controlada / parcialmente controlada / nÃ£o controlada.",
        "Resgate >2x/semana = mau controle â€” nÃ£o negligenciar.",
        "LABA NUNCA em monoterapia na asma â€” risco de morte.",
      ],
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente em seguimento por asma brÃ´nquica.",
          "Na consulta, reavaliados sintomas da Ãºltima semana, frequÃªncia de uso do broncodilatador de resgate, desencadeantes e exacerbaÃ§Ãµes nos Ãºltimos 12 meses.",
          "Revisados tÃ©cnica inalatÃ³ria, adesÃ£o ao tratamento e intercorrÃªncias desde a Ãºltima consulta.",
        ],
        objectiveOutputBlocks: [
          "SpO2 e ausculta pulmonar registrados conforme consulta.",
        ],
        assessmentBlocks: [
          "Asma brÃ´nquica em seguimento na APS.",
          "Controle avaliado pela classificaÃ§Ã£o GINA: bem controlada, parcialmente controlada ou nÃ£o controlada.",
          "TÃ©cnica inalatÃ³ria e adesÃ£o ao tratamento reavaliadas na consulta.",
        ],
        planBlocks: [
          "Ajusto o step terapÃªutico conforme nÃ­vel de controle GINA e resposta ao tratamento atual.",
          "Mantenho ou escalo o tratamento: ICS-formoterol em regime MART (preferencial GINA 2025) ou ICS-LABA em manutenÃ§Ã£o com SABA como resgate (track alternativo), conforme disponibilidade e contexto.",
          "Oriento e corrijo a tÃ©cnica inalatÃ³ria quando necessÃ¡rio.",
          "Entrego ou atualizo plano de aÃ§Ã£o escrito para manejo de crises.",
          "Solicito vacinaÃ§Ã£o anual para influenza.",
          "Programo retorno em 3 a 6 meses se controlada; 1 a 3 meses se parcialmente controlada; 4 a 6 semanas se nÃ£o controlada.",
        ],
      },

      exams: {
        panelBase: [],
        directed: [
          "Espirometria a cada 1 a 2 anos ou antes se mudanÃ§a clÃ­nica significativa.",
          "Peak flow â€” monitoramento domiciliar em asma moderada a grave.",
          "EosinÃ³filos como marcador de resposta a corticoide inalatÃ³rio e qualificaÃ§Ã£o para biolÃ³gicos.",
          "IgE total e especÃ­fica se suspeita de atopia e qualificaÃ§Ã£o para biolÃ³gicos.",
        ],
        monitoring: [
          "ReavaliaÃ§Ã£o clÃ­nica periÃ³dica conforme nÃ­vel de controle.",
          "Espirometria periÃ³dica conforme protocolo e evoluÃ§Ã£o.",
        ],
      },

      guidance: [
        "Oriento que a tÃ©cnica inalatÃ³ria correta Ã© fundamental â€” serÃ¡ revisada em toda consulta.",
        "Oriento que resgate mais de 2 vezes por semana indica mau controle.",
        "Oriento o uso do plano de aÃ§Ã£o escrito na vigÃªncia de crise.",
        "Oriento vacinar influenza anualmente.",
        "Oriento buscar atendimento imediato se resgate nÃ£o controla os sintomas.",
      ],

      followup: [
        "Programo retorno em 3 a 6 meses se controlada.",
        "Programo retorno em 1 a 3 meses se parcialmente controlada.",
        "Reavalio em 4 a 6 semanas se nÃ£o controlada.",
        "Atendimento imediato em caso de crise.",
      ],

      specialSituations: [
        "Crise asmÃ¡tica: dispneia em repouso, sibilÃ¢ncia intensa, dificuldade em completar frases.",
        "SpO2 <92% durante crise.",
        "Resgate nÃ£o controla os sintomas â€” necessidade de corticoide oral ou atendimento de urgÃªncia.",
        "Asma de difÃ­cil controle apesar de adesÃ£o e tÃ©cnica corretas â€” avaliar encaminhamento para especialista.",
      ],

      longitudinalFocus: [
        "Comparar classificaÃ§Ã£o de controle GINA atual com avaliaÃ§Ãµes anteriores.",
        "Revisar histÃ³rico de exacerbaÃ§Ãµes e internaÃ§Ãµes no Ãºltimo ano.",
        "Verificar progressÃ£o do step terapÃªutico e resposta ao tratamento.",
        "Registrar tÃ©cnica inalatÃ³ria e necessidade de correÃ§Ã£o a cada consulta.",
      ],
    },

    apply: {
      problems: [{ key: "asma", label: "Asma" }],
    },

    governance: {
      status: "ativo",
      version: "1.1.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-22",
      changes: "MigraÃ§Ã£o para v1.3.1. RemoÃ§Ã£o de SOAP com checkboxes e placeholders. ConversÃ£o de exams para objeto estruturado. InclusÃ£o de ui, longitudinalFocus e apply.problems.",
      sources: [
        {
          label: "GINA 2025 â€” Global Strategy for Asthma Management and Prevention",
          url: "https://ginacoalition.org/",
          type: "primary",
          year: "2025",
        },
        {
          label: "MS â€” Linha de Cuidado Asma",
          url: "https://linhasdecuidado.saude.gov.br/portal/asma/",
          type: "secondary",
          year: "2021",
        },
      ],
    },
  },

  // â”€â”€ Obesidade â€” Retorno v1.3.1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "obesidade_retorno",

    metadata: {
      name: "Obesidade â€” Retorno",
      description: "Retorno de obesidade na APS â€” metas clÃ­nicas, adesÃ£o e escalonamento terapÃªutico.",
      category: "cronico",
      tags: ["obesidade", "sÃ­ndrome metabÃ³lica", "IMC", "peso", "meta ponderal"],
      status: "ativo",
    },

    indications: [
      "Paciente com obesidade em seguimento ambulatorial na APS.",
      "Consulta de retorno para reavaliaÃ§Ã£o de metas ponderais, adesÃ£o, comorbidades e necessidade de escalonamento terapÃªutico.",
    ],

    dataRequirements: {
      useNow: [
        "Peso atual",
        "PA e perÃ­metro abdominal",
        "Contexto clÃ­nico da consulta atual",
      ],
      idealForAdjustment: [
        "Peso anterior para comparaÃ§Ã£o",
        "Exames metabÃ³licos recentes",
        "Comorbidades associadas",
      ],
    },

    ui: {
      subjectivePrompt: "Revisar peso atual, padrÃ£o alimentar, atividade fÃ­sica, adesÃ£o ao tratamento e comorbidades.",
      objectivePrompt: "Registrar peso, PA, IMC e perÃ­metro abdominal.",
      quickNotes: [
        "Meta: reduÃ§Ã£o de 5 a 10% do peso em 6 meses jÃ¡ melhora comorbidades.",
        "Avaliar indicaÃ§Ã£o de farmacoterapia conforme PCDT e contexto clÃ­nico.",
      ],
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente em seguimento por obesidade.",
          "Na consulta, reavaliados peso atual, padrÃ£o alimentar, atividade fÃ­sica, adesÃ£o ao tratamento e impacto nas comorbidades.",
        ],
        objectiveOutputBlocks: [
          "Peso, IMC, PA e perÃ­metro abdominal registrados conforme consulta.",
        ],
        assessmentBlocks: [
          "Obesidade em seguimento na APS.",
          "EvoluÃ§Ã£o ponderal e metabÃ³lica reavaliadas com base nos dados da consulta e exames disponÃ­veis.",
          "Risco cardiometabÃ³lico considerado na definiÃ§Ã£o da intensidade do tratamento.",
        ],
        planBlocks: [
          "ReforÃ§o medidas nÃ£o farmacolÃ³gicas: alimentaÃ§Ã£o com base em alimentos in natura, reduÃ§Ã£o de ultraprocessados e atividade fÃ­sica progressiva.",
          "Mantenho ou ajusto o plano terapÃªutico conforme evoluÃ§Ã£o ponderal, adesÃ£o e comorbidades.",
          "Encaminho para nutricionista ou equipe multiprofissional quando indicado.",
          "Avalio indicaÃ§Ã£o de farmacoterapia conforme PCDT, disponibilidade e contexto clÃ­nico.",
          "Solicito exames metabÃ³licos conforme protocolo e controle.",
          "Programo retorno em 3 a 6 meses para monitoramento de peso, perÃ­metro abdominal e PA.",
        ],
      },

      exams: {
        panelBase: [
          "Glicemia de jejum",
          "Lipidograma",
          "Creatinina com TFGe",
          "AST/ALT",
        ],
        directed: [
          "HbA1c se glicemia de jejum â‰¥100 mg/dL ou diagnÃ³stico de DM2.",
          "TSH se sinais ou suspeita de hipotireoidismo.",
          "Ãcido Ãºrico se antecedente de gota ou uso de diurÃ©tico tiazÃ­dico.",
        ],
        monitoring: [
          "Peso e perÃ­metro abdominal em toda consulta.",
          "Exames metabÃ³licos conforme protocolo e controle clÃ­nico.",
        ],
      },

      guidance: [
        "Oriento que a reduÃ§Ã£o de 5 a 10% do peso jÃ¡ melhora as comorbidades.",
        "Oriento alimentaÃ§Ã£o baseada em alimentos in natura e reduÃ§Ã£o de ultraprocessados.",
        "Oriento atividade fÃ­sica: iniciar com pelo menos 150 min/semana e progredir conforme tolerÃ¢ncia.",
        "Oriento sono adequado de 7 a 9 horas por noite.",
        "Oriento nÃ£o interromper o tratamento por conta prÃ³pria.",
      ],

      followup: [
        "Programo retorno em 3 a 6 meses para monitoramento de peso, perÃ­metro abdominal e PA.",
      ],

      specialSituations: [
        "Ganho de peso significativo e nÃ£o intencional â€” investigar causa secundÃ¡ria.",
        "GestaÃ§Ã£o ou suspeita de gestaÃ§Ã£o â€” exige conduÃ§Ã£o especÃ­fica.",
        "Necessidade de manejo cirÃºrgico â€” avaliar encaminhamento para serviÃ§o especializado.",
      ],

      longitudinalFocus: [
        "Comparar peso e perÃ­metro abdominal atuais com valores anteriores.",
        "Revisar evoluÃ§Ã£o das comorbidades metabÃ³licas desde a Ãºltima consulta.",
        "Verificar adesÃ£o ao plano alimentar, atividade fÃ­sica e tratamento farmacolÃ³gico quando em uso.",
      ],
    },

    apply: {
      problems: [{ key: "obesidade", label: "Obesidade" }],
    },

    governance: {
      status: "ativo",
      version: "1.1.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-22",
      changes: "MigraÃ§Ã£o para v1.3.1. RemoÃ§Ã£o de SOAP com checkboxes e placeholders. ConversÃ£o de exams para objeto estruturado. InclusÃ£o de ui, longitudinalFocus e apply.problems.",
      sources: [
        {
          label: "ABESO â€” Diretrizes Brasileiras de Obesidade",
          url: "https://abeso.org.br/diretrizes/",
          type: "primary",
          year: "2022",
        },
        {
          label: "MS â€” EstratÃ©gias para o Cuidado da Pessoa com Obesidade (CAB nÂº 38)",
          url: "https://bvsms.saude.gov.br/bvs/publicacoes/estrategias_cuidado_pessoa_doenca_cronica_obesidade_cab38.pdf",
          type: "secondary",
          year: "2014",
        },
      ],
    },
  },

  // â”€â”€ DepressÃ£o â€” Retorno v1.3.1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "depressao_retorno",

    metadata: {
      name: "DepressÃ£o â€” Retorno",
      description: "Retorno de transtorno depressivo maior na APS â€” resposta ao antidepressivo, adesÃ£o e risco suicida.",
      category: "saude_mental",
      tags: ["depressÃ£o", "antidepressivo", "PHQ-9", "suicÃ­dio", "CAPS", "TCC"],
      status: "ativo",
    },

    indications: [
      "Paciente em uso de antidepressivo em seguimento na APS.",
      "Consulta de retorno para reavaliaÃ§Ã£o de resposta terapÃªutica (PHQ-9), adesÃ£o, efeitos adversos e risco suicida.",
    ],

    dataRequirements: {
      useNow: [
        "AdesÃ£o ao antidepressivo",
        "AvaliaÃ§Ã£o de ideaÃ§Ã£o suicida",
        "Contexto clÃ­nico da consulta atual",
      ],
      idealForAdjustment: [
        "PHQ-9 atual",
        "Resposta terapÃªutica comparada com avaliaÃ§Ã£o anterior",
        "PresenÃ§a de psicoterapia em curso",
      ],
    },

    ui: {
      subjectivePrompt: "Revisar humor, sono, apetite, energia, adesÃ£o ao antidepressivo, efeitos adversos e presenÃ§a de ideaÃ§Ã£o suicida.",
      objectivePrompt: "Registrar peso, PA e aspectos relevantes do exame do estado mental.",
      quickNotes: [
        "PHQ-9: 0â€“4 remissÃ£o | 5â€“9 leve | 10â€“14 moderada | 15â€“19 mod-grave | 20â€“27 grave.",
        "Resposta: remissÃ£o (PHQ-9 <5) | parcial (â‰¥50% de reduÃ§Ã£o) | ausente.",
        "IdeaÃ§Ã£o suicida (item 9 do PHQ-9) deve ser sempre avaliada â€” se presente, determinar risco e acionar rede conforme gravidade.",
      ],
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente em seguimento por depressÃ£o, em uso de antidepressivo.",
          "Na consulta, reavaliados humor, sono, apetite, energia, adesÃ£o ao tratamento e efeitos adversos.",
          "Avaliada presenÃ§a de ideaÃ§Ã£o suicida e impacto funcional do quadro.",
        ],
        objectiveOutputBlocks: [
          "Peso e sinais vitais registrados conforme consulta.",
        ],
        assessmentBlocks: [
          "Transtorno depressivo maior em seguimento na APS.",
          "Resposta terapÃªutica avaliada com base no PHQ-9 e na avaliaÃ§Ã£o clÃ­nica.",
          "Risco suicida avaliado na consulta.",
        ],
        planBlocks: [
          "Mantenho, ajusto ou substituo o antidepressivo conforme resposta terapÃªutica, adesÃ£o e tolerÃ¢ncia.",
          "Oriento que o antidepressivo leva de 4 a 6 semanas para fazer efeito e nÃ£o deve ser interrompido abruptamente.",
          "Encaminho para psicoterapia (TCC) quando disponÃ­vel â€” combinaÃ§Ã£o com farmacoterapia Ã© superior.",
          "Encaminho para CAPS, RAPS ou urgÃªncia conforme gravidade, risco suicida ou refratariedade.",
          "Mantenho o tratamento por ao menos 6 meses apÃ³s a remissÃ£o para prevenÃ§Ã£o de recaÃ­da.",
          "Programo retorno em 2 a 4 semanas na fase inicial; 4 a 8 semanas conforme resposta e risco.",
        ],
      },

      exams: {
        panelBase: [],
        directed: [
          "TSH se suspeita de hipotireoidismo contribuindo para o quadro depressivo.",
          "Hemograma se fadiga desproporcional ou suspeita de anemia.",
        ],
        monitoring: [
          "ReavaliaÃ§Ã£o clÃ­nica periÃ³dica com PHQ-9 conforme fase do tratamento.",
        ],
      },

      guidance: [
        "Oriento que o antidepressivo leva de 4 a 6 semanas para fazer efeito â€” nÃ£o interromper por conta prÃ³pria.",
        "Oriento nÃ£o suspender abruptamente â€” sempre com orientaÃ§Ã£o mÃ©dica.",
        "Oriento atividade fÃ­sica regular â€” hÃ¡ evidÃªncia de benefÃ­cio no humor.",
        "Oriento manter rotina de sono.",
        "Oriento procurar atendimento imediato ou ligar para o CVV (188) se surgirem pensamentos de autoagressÃ£o ou piora importante.",
      ],

      followup: [
        "Programo retorno em 2 a 4 semanas na fase inicial.",
        "ApÃ³s estabilizaÃ§Ã£o, retorno em 4 a 8 semanas conforme gravidade, risco e resposta.",
      ],

      specialSituations: [
        "IdeaÃ§Ã£o suicida ativa com plano, intenÃ§Ã£o ou tentativa recente â€” encaminhar urgentemente para serviÃ§o de urgÃªncia e articular CAPS/RAPS.",
        "DepressÃ£o grave sem resposta apÃ³s dose terapÃªutica adequada â€” avaliar encaminhamento para psiquiatria.",
      ],

      longitudinalFocus: [
        "Comparar PHQ-9 atual com avaliaÃ§Ã£o anterior.",
        "Revisar evoluÃ§Ã£o do humor, sono e funcionamento desde a Ãºltima consulta.",
        "Verificar adesÃ£o ao antidepressivo e Ã  psicoterapia quando em curso.",
        "Registrar se houve necessidade de ajuste terapÃªutico e resposta obtida.",
      ],
    },

    apply: {
      problems: [{ key: "ansiedade_depressao", label: "Ansiedade / DepressÃ£o" }],
    },

    governance: {
      status: "ativo",
      version: "1.1.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-22",
      changes: "MigraÃ§Ã£o para v1.3.1. RemoÃ§Ã£o de SOAP com checkboxes e placeholders. InclusÃ£o de ui, longitudinalFocus e apply.problems.",
      sources: [
        {
          label: "MS â€” Linha de Cuidado da DepressÃ£o no Adulto",
          url: "https://linhasdecuidado.saude.gov.br/portal/transtornos-de-humor-e-comportamento/",
          type: "primary",
          year: "2022",
        },
      ],
    },
  },

  // â”€â”€ InsÃ´nia v1.3.1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "insonia",

    metadata: {
      name: "InsÃ´nia",
      description: "AvaliaÃ§Ã£o e manejo de insÃ´nia crÃ´nica na APS â€” TCC-I como primeira linha, farmacoterapia como adjuvante.",
      category: "saude_mental",
      tags: ["insÃ´nia", "sono", "TCC-I", "higiene do sono", "SAOS", "zolpidem"],
      status: "ativo",
    },

    indications: [
      "Paciente com queixa de insÃ´nia crÃ´nica (â‰¥3 meses, â‰¥3 vezes por semana) com impacto funcional diurno.",
      "Consulta para avaliaÃ§Ã£o de causas secundÃ¡rias, rastreio de SAOS e definiÃ§Ã£o do plano terapÃªutico.",
    ],

    dataRequirements: {
      useNow: [
        "DuraÃ§Ã£o e frequÃªncia dos sintomas de insÃ´nia",
        "Impacto diurno (fadiga, sonolÃªncia, dÃ©ficit cognitivo)",
        "Screening de SAOS: ronco, apneia testemunhada, IMC, Epworth",
        "Screening de depressÃ£o e ansiedade (PHQ-2 / GAD-2)",
      ],
      idealForAdjustment: [
        "ISI ou PSQI",
        "HÃ¡bitos de sono e higiene atual",
        "MedicaÃ§Ãµes em uso que possam interferir no sono",
      ],
    },

    ui: {
      subjectivePrompt: "Revisar duraÃ§Ã£o, frequÃªncia, latÃªncia do sono, acordares noturnos, impacto diurno, ronco, apneia testemunhada, cafeÃ­na, Ã¡lcool, telas e screening de depressÃ£o/ansiedade.",
      objectivePrompt: "Registrar IMC, PA e ausculta cardiopulmonar.",
      quickNotes: [
        "ISI: 0â€“7 normal | 8â€“14 limÃ­trofe | 15â€“21 moderada | 22â€“28 grave.",
        "TCC-I Ã© superior aos hipnÃ³ticos a longo prazo â€” orientar na consulta mesmo sem encaminhamento formal.",
        "Investigar SAOS antes de iniciar hipnÃ³tico se: Epworth â‰¥10 + ronco frequente + IMC â‰¥30.",
      ],
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente com queixa de insÃ´nia crÃ´nica, com impacto funcional diurno.",
          "Na consulta, avaliados duraÃ§Ã£o e frequÃªncia dos sintomas, latÃªncia do sono, acordares noturnos e qualidade do sono relatada.",
          "Revisados hÃ¡bitos de sono, uso de cafeÃ­na, Ã¡lcool e telas, alÃ©m de screening para SAOS, depressÃ£o e ansiedade.",
        ],
        objectiveOutputBlocks: [
          "IMC, PA e ausculta registrados conforme consulta.",
        ],
        assessmentBlocks: [
          "InsÃ´nia crÃ´nica com impacto funcional diurno.",
          "DiagnÃ³stico diferencial avaliado: SAOS, sÃ­ndrome das pernas inquietas, transtorno de humor, ansiedade, uso de substÃ¢ncias, medicamentos e dor crÃ´nica.",
          "Gravidade estimada com base no ISI e no impacto diurno referido.",
        ],
        planBlocks: [
          "Oriento higiene do sono: horÃ¡rio fixo para deitar e acordar, evitar telas 1h antes, cafeÃ­na apenas atÃ© as 14h, evitar Ã¡lcool nas 3h anteriores ao sono, quarto escuro, fresco e silencioso.",
          "Oriento princÃ­pios da TCC-I na consulta e referencio quando disponÃ­vel.",
          "Avalio indicaÃ§Ã£o de farmacoterapia apÃ³s 2 semanas de falha das medidas nÃ£o farmacolÃ³gicas â€” menor dose eficaz pelo menor tempo possÃ­vel.",
          "NÃ£o prescreverei benzodiazepÃ­nico como primeira linha.",
          "Investigo SAOS se Epworth â‰¥10, ronco frequente e IMC â‰¥30 â€” adio hipnÃ³tico atÃ© investigaÃ§Ã£o.",
          "Programo retorno em 2 semanas para reavaliaÃ§Ã£o da adesÃ£o e da resposta inicial.",
        ],
      },

      exams: {
        panelBase: [],
        directed: [
          "Glicemia de jejum, TSH e creatinina para investigar causas secundÃ¡rias de insÃ´nia.",
          "Hemograma se fadiga diurna significativa ou suspeita de anemia.",
          "Ferritina se suspeita de dÃ©ficit de ferro (sÃ­ndrome das pernas inquietas ou fadiga).",
          "Polissonografia se Epworth â‰¥10, ronco frequente e IMC â‰¥30.",
        ],
        monitoring: [
          "ReavaliaÃ§Ã£o clÃ­nica em 2 semanas apÃ³s inÃ­cio do plano.",
          "Suspender ou manter farmacoterapia em 4 semanas conforme benefÃ­cio e risco.",
        ],
      },

      guidance: [
        "Oriento que a TCC-I Ã© o tratamento de escolha para insÃ´nia crÃ´nica â€” funciona melhor que hipnÃ³ticos a longo prazo e sem riscos de dependÃªncia.",
        "Oriento que medicaÃ§Ã£o Ã© adjuvante: menor dose eficaz, menor tempo possÃ­vel.",
        "Oriento nunca interromper abruptamente o uso prolongado de hipnÃ³tico â€” risco de insÃ´nia rebote.",
        "Oriento nÃ£o associar hipnÃ³tico com Ã¡lcool ou outros depressores do SNC.",
        "Oriento que zolpidem em qualquer concentraÃ§Ã£o exige NotificaÃ§Ã£o de Receita B.",
      ],

      followup: [
        "Reavalio em 2 semanas: adesÃ£o Ã  higiene do sono e resposta inicial.",
        "Reavalio em 4 semanas: suspender ou manter farmacoterapia conforme benefÃ­cio e risco â€” nunca manter por inÃ©rcia.",
        "Encaminho para atenÃ§Ã£o especializada se refratÃ¡ria apÃ³s 8 semanas de tratamento adequado.",
      ],

      specialSituations: [
        "Ronco, apneia testemunhada e sonolÃªncia diurna excessiva â€” investigar SAOS antes de iniciar hipnÃ³tico.",
        "IdeaÃ§Ã£o suicida â€” encaminhar para CAPS/emergÃªncia.",
        "InsÃ´nia refratÃ¡ria apÃ³s 8 semanas de tratamento adequado â€” encaminhar para psiquiatria.",
        "SÃ­ndrome das pernas inquietas â€” encaminhar para neurologia.",
      ],
    },

    governance: {
      status: "ativo",
      version: "1.1.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-22",
      changes: "MigraÃ§Ã£o para v1.3.1. RemoÃ§Ã£o de SOAP com checkboxes e placeholders. ConversÃ£o de exams para objeto estruturado. InclusÃ£o de ui e specialSituations.",
      sources: [
        {
          label: "AASM â€” Behavioral and Psychological Treatments for Chronic Insomnia Disorder in Adults",
          url: "https://aasm.org/clinical-practice-guideline/pharmacologic-treatment-of-chronic-insomnia/",
          type: "primary",
          year: "2021",
        },
        {
          label: "ICSD-3 â€” International Classification of Sleep Disorders (AASM)",
          url: "https://aasm.org/",
          type: "secondary",
          year: "2014",
        },
      ],
    },
  },

  // â”€â”€ Ansiedade / TAG â€” Retorno v1.3.1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "ansiedade_retorno",

    metadata: {
      name: "Ansiedade / TAG â€” Retorno",
      description: "Retorno de transtorno de ansiedade generalizada na APS â€” resposta ao tratamento, adesÃ£o e impacto funcional.",
      category: "saude_mental",
      tags: ["ansiedade", "TAG", "GAD-7", "ISRS", "pÃ¢nico", "CAPS"],
      status: "ativo",
    },

    indications: [
      "Paciente com TAG ou transtorno de ansiedade em seguimento na APS.",
      "Consulta de retorno para reavaliaÃ§Ã£o de resposta ao tratamento (GAD-7), adesÃ£o, efeitos adversos e impacto funcional.",
    ],

    dataRequirements: {
      useNow: [
        "AdesÃ£o ao tratamento",
        "Impacto funcional atual",
        "Contexto clÃ­nico da consulta",
      ],
      idealForAdjustment: [
        "GAD-7 atual",
        "Resposta comparada com avaliaÃ§Ã£o anterior",
        "PresenÃ§a de psicoterapia em curso",
      ],
    },

    ui: {
      subjectivePrompt: "Revisar preocupaÃ§Ã£o, tensÃ£o, insÃ´nia, irritabilidade, crises de pÃ¢nico, adesÃ£o ao ISRS e impacto funcional.",
      objectivePrompt: "Registrar peso, PA e aspectos relevantes do exame do estado mental.",
      quickNotes: [
        "GAD-7: 0â€“4 mÃ­nima | 5â€“9 leve | 10â€“14 moderada | â‰¥15 grave.",
        "Aguardar 4 a 6 semanas para avaliar resposta ao ISRS antes de ajustar.",
        "Evitar benzodiazepÃ­nicos como manutenÃ§Ã£o â€” risco de dependÃªncia.",
      ],
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente em seguimento por transtorno de ansiedade generalizada.",
          "Na consulta, reavaliados preocupaÃ§Ã£o excessiva, tensÃ£o, insÃ´nia, irritabilidade, crises de pÃ¢nico, adesÃ£o ao tratamento e impacto funcional.",
        ],
        objectiveOutputBlocks: [
          "Peso e sinais vitais registrados conforme consulta.",
        ],
        assessmentBlocks: [
          "Transtorno de ansiedade generalizada em seguimento na APS.",
          "Resposta terapÃªutica avaliada com base no GAD-7 e na avaliaÃ§Ã£o clÃ­nica.",
          "Causas orgÃ¢nicas de ansiedade consideradas e avaliadas quando pertinente.",
        ],
        planBlocks: [
          "Mantenho ou ajusto o ISRS conforme resposta terapÃªutica e tolerÃ¢ncia.",
          "Oriento que o ISRS leva de 4 a 6 semanas para fazer efeito e nÃ£o deve ser interrompido abruptamente.",
          "Encaminho para psicoterapia (TCC) quando disponÃ­vel â€” combinaÃ§Ã£o com farmacoterapia Ã© superior.",
          "Encaminho para CAPS, RAPS ou urgÃªncia conforme gravidade, risco ou refratariedade.",
          "Evito benzodiazepÃ­nico como manutenÃ§Ã£o â€” uso apenas pontual se necessÃ¡rio.",
          "Programo retorno em 2 a 4 semanas na fase inicial; 4 a 8 semanas conforme resposta e risco.",
        ],
      },

      exams: {
        panelBase: [],
        directed: [
          "TSH se sintomas compatÃ­veis com hiper ou hipotireoidismo.",
          "Hemograma se suspeita de anemia ou fadiga desproporcional.",
          "ECG se palpitaÃ§Ãµes, sÃ­ncope, dor torÃ¡cica ou dÃºvida de causa cardÃ­aca.",
        ],
        monitoring: [
          "ReavaliaÃ§Ã£o clÃ­nica periÃ³dica com GAD-7 conforme fase do tratamento.",
        ],
      },

      guidance: [
        "Oriento tÃ©cnicas de respiraÃ§Ã£o e relaxamento â€” ajudam no manejo dos sintomas.",
        "Oriento reduzir cafeÃ­na e Ã¡lcool â€” pioram a ansiedade.",
        "Oriento exercÃ­cio fÃ­sico regular â€” hÃ¡ evidÃªncia de benefÃ­cio no controle da ansiedade.",
        "Oriento manter rotina de sono.",
        "Oriento que o tratamento funciona melhor com medicaÃ§Ã£o associada Ã  terapia.",
      ],

      followup: [
        "Programo retorno em 2 a 4 semanas na fase inicial.",
        "ApÃ³s estabilizaÃ§Ã£o, retorno em 4 a 8 semanas conforme gravidade, risco e resposta.",
      ],

      specialSituations: [
        "Risco agudo de suicÃ­dio ou auto/heteroagressÃ£o â€” encaminhar para urgÃªncia e articular RAPS.",
        "Sintomas psicÃ³ticos ou maniformes â€” encaminhar para avaliaÃ§Ã£o especializada.",
        "Crise com sÃ­ncope, rebaixamento de consciÃªncia ou dÃºvida de causa orgÃ¢nica â€” investigar antes de tratar como ansiedade.",
      ],

      longitudinalFocus: [
        "Comparar GAD-7 atual com avaliaÃ§Ã£o anterior.",
        "Revisar evoluÃ§Ã£o dos sintomas e do impacto funcional desde a Ãºltima consulta.",
        "Verificar adesÃ£o ao ISRS e Ã  psicoterapia quando em curso.",
        "Registrar necessidade de ajuste terapÃªutico e resposta obtida.",
      ],
    },

    apply: {
      problems: [{ key: "ansiedade_depressao", label: "Ansiedade / DepressÃ£o" }],
    },

    governance: {
      status: "ativo",
      version: "1.1.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-22",
      changes: "MigraÃ§Ã£o para v1.3.1. RemoÃ§Ã£o de SOAP com checkboxes e placeholders. InclusÃ£o de ui, longitudinalFocus e apply.problems.",
      sources: [
        {
          label: "MS â€” Linha de Cuidado â€” Transtornos de Ansiedade no Adulto",
          url: "https://linhasdecuidado.saude.gov.br/portal/transtornos-de-humor-e-comportamento/",
          type: "primary",
          year: "2022",
        },
      ],
    },
  },

  // â”€â”€ DRC â€” Retorno v1.3.1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "drc_retorno",

    metadata: {
      name: "DRC — Retorno",
      description: "Retorno ambulatorial de pessoa adulta com doença renal crônica em seguimento na APS, com foco em eTFG, albuminúria, nefroproteção, segurança medicamentosa e progressão.",
      category: "cronico",
      tags: ["DRC", "eTFG", "albuminúria", "RAC", "KDIGO", "nefroproteção", "HAS", "DM2", "APS"],
      status: "ativo",
    },

    indications: [
      "Adulto com DRC já conhecida em retorno ambulatorial na APS.",
      "Revisão de eTFG, albuminúria/RAC, PA, comorbidades, medicações, progressão e nefroproteção.",
      "Usar em seguimento crônico sem sinais de lesão renal aguda, hipercalemia grave, uremia grave ou sobrecarga volêmica importante.",
    ],

    dataRequirements: {
      useNow: [
        "Creatinina sérica com data, para cálculo automático de eTFG",
        "Albuminúria ou relação albumina/creatinina urinária (RAC), se disponível",
        "PA atual, peso, edema e sintomas, se avaliados/documentados",
        "Medicações em uso, incluindo IECA/BRA, diuréticos, iSGLT2, metformina, AINEs e nefrotóxicos",
        "Potássio, EAS, glicemia/HbA1c, perfil lipídico e hemograma, se disponíveis",
      ],
      idealForAdjustment: [
        "eTFG e RAC atuais comparados com resultados anteriores",
        "Causa provável da DRC e comorbidades: HAS, DM2, DRC familiar, DCV, IC, obesidade e tabagismo",
        "Risco cardiovascular, albuminúria persistente e lesões de órgão-alvo",
        "Bicarbonato, cálcio, fósforo, PTH, vitamina D, ferritina/ferro e outros conforme estágio e contexto",
        "Histórico de encaminhamento, matriciamento ou acompanhamento com nefrologia quando houver",
      ],
    },

    ui: {
      subjectivePrompt: "Registrar sintomas, edema, PA domiciliar, diurese, intercorrências, adesão, uso de nefrotóxicos/AINEs, medicações e barreiras ao tratamento.",
      objectivePrompt: "Registrar apenas dados realmente aferidos/documentados: PA, peso, edema, creatinina/eTFG, RAC/albuminúria, potássio, EAS, hemograma, bicarbonato e demais exames.",
      quickNotes: [
        "Não estadiar DRC sem creatinina/eTFG e albuminúria/RAC disponíveis ou recentes.",
        "Antes de ajustar medicações, revisar eTFG, potássio, PA, albuminúria, desidratação, AINEs e nefrotóxicos.",
        "Queda rápida da eTFG, hipercalemia importante, uremia ou sobrecarga volêmica exigem avaliar urgência/encaminhamento.",
      ],
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente em seguimento por doença renal crônica na APS.",
          "Retorna para revisão de função renal, albuminúria, controle pressórico, comorbidades, medicações em uso, segurança terapêutica e risco de progressão.",
          "Relato de sintomas, edema, diurese, PA domiciliar, uso de AINEs/nefrotóxicos, adesão e intercorrências conforme dados informados na consulta.",
        ],
        objectiveOutputBlocks: [
          "Dados objetivos conforme preenchimento: PA, peso, edema, creatinina/eTFG calculada, albuminúria/RAC, potássio, EAS, hemograma e demais exames.",
          "Estadiamento por eTFG e albuminúria deve considerar data dos exames, tendência evolutiva e persistência das alterações.",
          "Comorbidades, risco cardiovascular, uso de nefrotóxicos e sinais de complicações da DRC registrados conforme dados documentados.",
        ],
        assessmentBlocks: [
          "DRC em seguimento longitudinal na APS.",
          "Estágio e risco de progressão avaliados conforme eTFG, albuminúria/RAC e evolução temporal disponíveis; se dados ausentes ou antigos, não classifico estadiamento como adequadamente reavaliado.",
          "Reviso PA, HAS, DM2, dislipidemia, RCV, albuminúria, função renal e segurança medicamentosa como eixos de nefroproteção.",
          "Avalio necessidade de cuidado compartilhado/nefrologia conforme eTFG, albuminúria, progressão, complicações, causa suspeita e contexto clínico.",
        ],
        planBlocks: [
          "Registro creatinina/eTFG, albuminúria/RAC e exames disponíveis com data, comparando com resultados anteriores quando houver.",
          "Mantenho ou ajusto plano terapêutico conforme eTFG, albuminúria, PA, potássio, comorbidades, risco cardiovascular, tolerância e acesso.",
          "Individualizo meta pressórica conforme idade, tolerância, albuminúria, HAS/DM2, risco cardiovascular e risco de eventos adversos.",
          "Reviso uso de IECA/BRA, diuréticos, iSGLT2, metformina e outras medicações conforme indicação, eTFG, potássio, PA, albuminúria e segurança.",
          "Oriento evitar AINEs e outros nefrotóxicos quando possível, além de informar sobre risco de contraste, desidratação, automedicação e suplementos sem orientação.",
          "Oriento redução de sal, controle pressórico, controle glicêmico quando houver DM2, atividade física conforme condição clínica, controle de peso e cessação do tabagismo quando aplicável.",
          "Solicito/atualizo creatinina para eTFG, albuminúria/RAC, potássio, EAS, glicemia/HbA1c, perfil lipídico e hemograma conforme estágio, comorbidades e medicações.",
          "Solicito bicarbonato, cálcio, fósforo, PTH, vitamina D, ferritina/ferro ou outros exames conforme eTFG, estágio, anemia, distúrbio mineral-ósseo, acidose ou orientação da rede.",
          "Atualizo vacinação conforme calendário, risco e disponibilidade da rede, incluindo influenza, pneumocócica, hepatite B e outras indicadas.",
          "Considero cuidado compartilhado/nefrologia se eTFG <30, albuminúria A3 persistente, queda acelerada da eTFG, hematúria/proteinúria importante, complicações da DRC, suspeita de causa específica ou dificuldade de manejo na APS.",
          "Reforço sinais de alarme e oriento procurar urgência se redução importante da diurese, edema intenso, falta de ar, confusão/sonolência, vômitos persistentes, fraqueza intensa, palpitações, dor torácica ou piora importante do estado geral.",
          "Programo retorno conforme estágio, albuminúria, tendência da eTFG, PA, comorbidades, exames pendentes e risco de progressão.",
        ],
      },

      exams: {
        panelBase: [
          "Creatinina sérica, para cálculo automático de eTFG",
          "Albuminúria ou relação albumina/creatinina urinária (RAC)",
          "Potássio sérico",
          "Urinálise/EAS",
          "Hemograma",
        ],
        directed: [
          "Glicemia de jejum ou HbA1c se DM2, pré-diabetes, risco metabólico ou monitoramento cardiometabólico.",
          "Perfil lipídico para estratificação cardiovascular e acompanhamento cardiometabólico.",
          "Sódio, bicarbonato, cálcio, fósforo, PTH e vitamina D conforme estágio, eTFG, sintomas, distúrbio mineral-ósseo ou protocolo local.",
          "Ferritina, ferro sérico, transferrina/IST ou outros exames de anemia conforme hemograma e suspeita de anemia da DRC.",
          "Ultrassonografia renal e vias urinárias se investigação etiológica, obstrução, alterações estruturais, assimetria renal, hematúria, ITU recorrente ou indicação da rede.",
        ],
        monitoring: [
          "Creatinina/eTFG e albuminúria/RAC em intervalos conforme estágio, albuminúria e risco de progressão.",
          "Potássio após início/ajuste de IECA, BRA, antagonista de aldosterona, diurético, iSGLT2 ou outras medicações que alterem função renal/potássio.",
          "Hemograma, bicarbonato, cálcio, fósforo, PTH e vitamina D conforme estágio da DRC, sintomas e protocolo local.",
          "PA e fatores cardiometabólicos em toda consulta quando possível.",
          "Reavaliar risco cardiovascular e segurança medicamentosa quando houver mudança clínica, queda de eTFG, albuminúria persistente ou novo tratamento.",
        ],
      },

      guidance: [
        "Oriento evitar anti-inflamatórios não esteroidais e automedicação sem orientação.",
        "Oriento manter controle da PA, diabetes quando houver, colesterol, peso e tabagismo como parte da proteção renal e cardiovascular.",
        "Oriento reduzir sal e ultraprocessados, com ajustes dietéticos conforme estágio, potássio, fósforo, albuminúria e orientação nutricional disponível.",
        "Oriento avisar se houver redução do volume urinário, inchaço importante, falta de ar, vômitos persistentes, sonolência/confusão, fraqueza intensa ou piora do estado geral.",
        "Oriento informar DRC antes de usar contraste, novos medicamentos, suplementos ou procedimentos.",
      ],

      followup: [
        "Reavalio eTFG, albuminúria/RAC, PA, potássio, medicações, adesão, comorbidades, risco cardiovascular e sinais de progressão.",
        "Programo retorno conforme estágio, albuminúria, tendência de eTFG, PA, exames pendentes e risco de progressão.",
        "Reavalio necessidade de cuidado compartilhado/nefrologia se houver eTFG <30, albuminúria A3 persistente, queda acelerada da eTFG, complicações ou dúvida diagnóstica/manejo.",
        "Após intercorrência, ajuste medicamentoso relevante ou alteração laboratorial importante, programo reavaliação mais precoce.",
      ],

      specialSituations: [
        "Suspeita de lesão renal aguda, queda rápida da eTFG ou aumento importante de creatinina em curto intervalo.",
        "Hipercalemia importante, arritmia, fraqueza intensa, palpitações ou alteração eletrocardiográfica suspeita.",
        "Sobrecarga volêmica importante, falta de ar, edema intenso, oligúria ou sinais de edema agudo de pulmão.",
        "Sintomas urêmicos importantes: náuseas/vômitos persistentes, sonolência/confusão, prurido intenso, anorexia importante ou piora do estado geral.",
        "eTFG <30 mL/min/1,73m², albuminúria A3 persistente, hematúria/proteinúria importante, queda acelerada da eTFG ou suspeita de glomerulopatia/doença sistêmica.",
        "Gestação, planejamento gestacional, rim único, doença renal hereditária, transplante renal ou necessidade de preparo para terapia renal substitutiva.",
      ],

      longitudinalFocus: [
        "Comparar eTFG e albuminúria/RAC atuais com resultados anteriores, sempre considerando data e estabilidade clínica.",
        "Registrar causa provável da DRC, estágio por eTFG/albuminúria e tendência de progressão quando houver dados suficientes.",
        "Integrar manejo de DRC com HAS, DM2, dislipidemia, obesidade, tabagismo e risco cardiovascular.",
        "Revisar adesão, acesso, nefrotóxicos, AINEs, contraste, automedicação, suplementos e segurança de doses conforme eTFG.",
        "Acompanhar complicações da DRC: anemia, distúrbio mineral-ósseo, acidose, hiperpotassemia, sobrecarga volêmica e progressão.",
        "Manter plano de cuidado compartilhado com nefrologia quando critérios de encaminhamento, progressão, complicações ou incerteza diagnóstica estiverem presentes.",
      ],
    },

    apply: {
      problems: [{ key: "drc", label: "Doença renal crônica" }],
    },

    governance: {
      status: "ativo",
      version: "1.2.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-24",
      changes: "Revisão clínica e operacional do template DRC — Retorno. Corrigida codificação de acentos. Removidas frases que documentavam ações não necessariamente realizadas. Saída reescrita para uso prático em eSUS, com menor necessidade de edição pelo médico. Entrada ajustada para creatinina com cálculo automático de eTFG, albuminúria/RAC, PA, potássio, segurança medicamentosa e progressão. Removida meta pressórica fixa, substituída por individualização. Governança fortalecida com PCDT/SUS de estratégias para atenuar progressão da DRC, Linha de Cuidado MS/SAPS e KDIGO 2024 como fonte complementar internacional.",
      sources: [
        {
          label: "Ministério da Saúde/Conitec — PCDT de Estratégias para Atenuar a Progressão da Doença Renal Crônica",
          url: "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-de-estrategias-para-atenuar-a-progressao-da-doenca-renal-cronica",
          type: "primary",
          year: "2024",
        },
        {
          label: "Ministério da Saúde/SAPS — Linha de Cuidado: Doença Renal Crônica (DRC) em adultos",
          url: "https://linhasdecuidado.saude.gov.br/portal/doenca-renal-cronica-%28DRC%29-em-adultos/",
          type: "secondary",
          year: "2022",
        },
        {
          label: "KDIGO — 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease",
          url: "https://kdigo.org/guidelines/ckd-evaluation-and-management/",
          type: "secondary",
          year: "2024",
        },
      ],
    },
  },

  // â”€â”€ Gota â€” Retorno v1.3.1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "gota_retorno",

    metadata: {
      name: "Gota â€” Retorno",
      description: "Acompanhamento de gota na APS â€” meta de Ã¡cido Ãºrico, ajuste de alopurinol e prevenÃ§Ã£o de crises.",
      category: "cronico",
      tags: ["gota", "Ã¡cido Ãºrico", "alopurinol", "colchicina", "crise gotosa"],
      status: "ativo",
    },

    indications: [
      "Paciente com gota em seguimento ambulatorial na APS.",
      "Consulta de retorno para monitoramento do Ã¡cido Ãºrico sÃ©rico, ajuste de alopurinol e orientaÃ§Ã£o sobre prevenÃ§Ã£o de crises.",
    ],

    dataRequirements: {
      useNow: [
        "Ãcido Ãºrico sÃ©rico atual",
        "Dose e adesÃ£o ao alopurinol",
        "OcorrÃªncia de crises nos Ãºltimos 12 meses",
      ],
      idealForAdjustment: [
        "Creatinina com TFGe para ajuste de dose na DRC",
        "PresenÃ§a de tofos",
        "Comorbidades metabÃ³licas associadas",
      ],
    },

    ui: {
      subjectivePrompt: "Revisar frequÃªncia de crises, adesÃ£o ao alopurinol, presenÃ§a de tofos e hÃ¡bitos dietÃ©ticos.",
      objectivePrompt: "Registrar peso, PA e avaliar articulaÃ§Ãµes afetadas.",
      quickNotes: [
        "Meta de Ã¡cido Ãºrico: <6 mg/dL geral; <5 mg/dL se tofos ou artropatia gotosa crÃ´nica.",
        "NÃ£o ajustar alopurinol durante crise aguda â€” aguardar 2 a 4 semanas pÃ³s-crise.",
        "Profilaxia com colchicina 0,5 mg/dia durante ajuste do alopurinol reduz risco de crises.",
      ],
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente em seguimento por gota.",
          "Na consulta, revisados nÃºmero e caracterÃ­sticas das crises nos Ãºltimos 12 meses, adesÃ£o ao alopurinol e hÃ¡bitos dietÃ©ticos.",
          "Avaliada presenÃ§a de tofos e intercorrÃªncias desde a Ãºltima consulta.",
        ],
        objectiveOutputBlocks: [
          "Peso, PA e exame articular registrados conforme consulta.",
        ],
        assessmentBlocks: [
          "Gota em seguimento na APS.",
          "Controle do Ã¡cido Ãºrico reavaliado com base no resultado sÃ©rico atual e na meta terapÃªutica.",
          "Meta de Ã¡cido Ãºrico: <6 mg/dL na maioria dos pacientes; <5 mg/dL na presenÃ§a de tofos ou artropatia crÃ´nica.",
        ],
        planBlocks: [
          "Mantenho ou ajusto a dose de alopurinol conforme Ã¡cido Ãºrico sÃ©rico, aumentando 100 mg a cada 4 semanas atÃ© atingir a meta.",
          "NÃ£o ajusto o alopurinol durante crise aguda â€” aguardo 2 a 4 semanas pÃ³s-crise.",
          "Mantenho profilaxia com colchicina 0,5 mg/dia durante o perÃ­odo de ajuste do alopurinol.",
          "Oriento reduzir carnes vermelhas, frutos do mar, cerveja e frutose industrializada.",
          "Solicito Ã¡cido Ãºrico sÃ©rico, creatinina com TFGe e exames metabÃ³licos conforme protocolo.",
          "Programo retorno em 3 a 6 meses ou antes apÃ³s crise.",
        ],
      },

      exams: {
        panelBase: [
          "Ãcido Ãºrico sÃ©rico",
          "Creatinina com TFGe",
        ],
        directed: [
          "Lipidograma e glicemia se sÃ­ndrome metabÃ³lica associada.",
          "Radiografia articular se suspeita de artropatia gotosa crÃ´nica ou tofos.",
        ],
        monitoring: [
          "Ãcido Ãºrico sÃ©rico a cada 3 a 6 meses atÃ© atingir a meta, depois anualmente.",
          "Creatinina com TFGe periodicamente para ajuste de dose do alopurinol.",
        ],
      },

      guidance: [
        "Oriento reduzir carnes vermelhas, frutos do mar e cerveja.",
        "Oriento evitar frutose industrializada.",
        "Oriento ingestÃ£o hÃ­drica de pelo menos 2 L de Ã¡gua por dia.",
        "Oriento manter o peso adequado.",
        "Oriento nÃ£o interromper o alopurinol durante crise â€” manter a dose base.",
      ],

      followup: [
        "Solicito Ã¡cido Ãºrico sÃ©rico a cada 3 a 6 meses durante ajuste.",
        "ApÃ³s atingir a meta, controle anual ou conforme evoluÃ§Ã£o clÃ­nica.",
      ],

      specialSituations: [
        "Crise gotosa poliarticular ou com febre â€” avaliar sepse articular e encaminhar se necessÃ¡rio.",
        "Tofos volumosos ou artropatia destrutiva â€” avaliar encaminhamento para reumatologia.",
        "IntolerÃ¢ncia ao alopurinol â€” avaliar febuxostate conforme disponibilidade.",
      ],

      longitudinalFocus: [
        "Comparar Ã¡cido Ãºrico atual com resultados anteriores e com a meta terapÃªutica.",
        "Revisar frequÃªncia de crises desde a Ãºltima consulta.",
        "Verificar adesÃ£o ao alopurinol e a modificaÃ§Ãµes dietÃ©ticas.",
      ],
    },

    apply: {
      problems: [{ key: "gota", label: "Gota" }],
    },

    governance: {
      status: "ativo",
      version: "1.1.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-22",
      changes: "MigraÃ§Ã£o para v1.3.1. RemoÃ§Ã£o de SOAP com checkboxes e placeholders. ConversÃ£o de exams para objeto estruturado. InclusÃ£o de ui, longitudinalFocus e apply.problems.",
      sources: [
        {
          label: "SBR â€” Consenso Brasileiro para o DiagnÃ³stico e Tratamento da Gota",
          url: "https://www.reumatologia.org.br/",
          type: "primary",
          year: "2022",
        },
      ],
    },
  },

  // â”€â”€ Osteoporose â€” Retorno v1.3.1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "osteoporose_retorno",

    metadata: {
      name: "Osteoporose â€” Retorno",
      description: "Acompanhamento de osteoporose na APS â€” densitometria, adesÃ£o ao bisfosfonato e prevenÃ§Ã£o de quedas.",
      category: "cronico",
      tags: ["osteoporose", "DXA", "bisfosfonato", "cÃ¡lcio", "vitamina D", "queda", "fratura"],
      status: "ativo",
    },

    indications: [
      "Paciente com osteoporose ou osteopenia significativa em seguimento ambulatorial na APS.",
      "Consulta de retorno para monitoramento de DXA, adesÃ£o ao bisfosfonato e prevenÃ§Ã£o de quedas e fraturas.",
    ],

    dataRequirements: {
      useNow: [
        "AdesÃ£o ao bisfosfonato e tÃ©cnica de uso",
        "OcorrÃªncia de quedas e fraturas nos Ãºltimos 12 meses",
        "Uso de cÃ¡lcio e vitamina D",
      ],
      idealForAdjustment: [
        "DXA recente com T-score e FRAX",
        "Vitamina D (25-OH) sÃ©rica",
        "AvaliaÃ§Ã£o de risco de queda",
      ],
    },

    ui: {
      subjectivePrompt: "Revisar adesÃ£o ao bisfosfonato, quedas e fraturas recentes, uso de cÃ¡lcio/vitamina D e risco de queda domiciliar.",
      objectivePrompt: "Registrar peso, PA e avaliaÃ§Ã£o do risco de queda.",
      quickNotes: [
        "Alendronato: jejum com copo cheio de Ã¡gua, permanecer em pÃ© 30 min apÃ³s.",
        "DXA a cada 1 a 2 anos conforme resposta e risco.",
        "FRAX para estimativa de risco de fratura quando indicado.",
      ],
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente em seguimento por osteoporose.",
          "Na consulta, revisados adesÃ£o ao bisfosfonato, tÃ©cnica de uso, ocorrÃªncia de quedas e fraturas nos Ãºltimos 12 meses e uso de cÃ¡lcio e vitamina D.",
        ],
        objectiveOutputBlocks: [
          "Peso, PA e avaliaÃ§Ã£o do risco de queda registrados conforme consulta.",
        ],
        assessmentBlocks: [
          "Osteoporose em seguimento na APS.",
          "Resposta ao tratamento avaliada com base em DXA disponÃ­vel, ocorrÃªncia de fraturas e adesÃ£o ao esquema terapÃªutico.",
          "Risco de queda reavaliado na consulta.",
        ],
        planBlocks: [
          "Mantenho o bisfosfonato conforme resposta e tolerÃ¢ncia; revejo tÃ©cnica de uso.",
          "Oriento cÃ¡lcio 1.000 a 1.200 mg/dia, preferencialmente pela dieta.",
          "Oriento vitamina D 1.000 a 2.000 UI/dia se deficiente, conforme resultado sÃ©rico.",
          "Oriento exercÃ­cios de resistÃªncia e equilÃ­brio para prevenÃ§Ã£o de quedas.",
          "Oriento adaptaÃ§Ãµes domiciliares para reduzir risco de queda: tapetes, corrimÃ£os, iluminaÃ§Ã£o.",
          "Solicito DXA em 1 a 2 anos conforme protocolo e vitamina D (25-OH) se nÃ£o avaliada recentemente.",
          "Programo retorno em 6 a 12 meses.",
        ],
      },

      exams: {
        panelBase: [
          "Vitamina D (25-OH)",
          "CÃ¡lcio sÃ©rico",
        ],
        directed: [
          "DXA conforme periodicidade de risco â€” em geral a cada 1 a 2 anos.",
          "FÃ³sforo e PTH se hipercalcemia ou suspeita de hiperparatireoidismo.",
          "TSH se hipotireoidismo nÃ£o controlado como fator de risco.",
        ],
        monitoring: [
          "DXA a cada 1 a 2 anos conforme resposta e risco.",
          "Vitamina D (25-OH) periodicamente.",
        ],
      },

      guidance: [
        "Oriento tomar o alendronato em jejum, com copo cheio de Ã¡gua, e permanecer em pÃ© por 30 min apÃ³s.",
        "Oriento nÃ£o tomar o bisfosfonato junto com cÃ¡lcio ou antiÃ¡cidos.",
        "Oriento aumentar ingestÃ£o de cÃ¡lcio pela dieta: laticÃ­nios, couve, sardinha.",
        "Oriento exposiÃ§Ã£o solar de 15 a 30 min por dia quando possÃ­vel.",
        "Oriento exercÃ­cios com suporte de peso e de equilÃ­brio.",
        "Oriento adaptar o domicÃ­lio para prevenir quedas.",
      ],

      followup: [
        "Solicito DXA a cada 1 a 2 anos conforme protocolo.",
        "Programo retorno em 6 a 12 meses.",
      ],

      specialSituations: [
        "Nova fratura vertebral ou de quadril â€” reavaliar esquema terapÃªutico e encaminhar quando necessÃ¡rio.",
        "IntolerÃ¢ncia ao alendronato â€” avaliar alternativas terapÃªuticas.",
        "Osteoporose severa ou refratÃ¡ria â€” avaliar encaminhamento para reumatologia ou endocrinologia.",
      ],

      longitudinalFocus: [
        "Comparar T-score do DXA atual com resultado anterior.",
        "Revisar ocorrÃªncia de quedas e fraturas desde a Ãºltima consulta.",
        "Verificar adesÃ£o ao bisfosfonato e tÃ©cnica de uso.",
        "Avaliar progressÃ£o do risco de fratura com FRAX quando indicado.",
      ],
    },

    apply: {
      problems: [{ key: "osteoporose", label: "Osteoporose" }],
    },

    governance: {
      status: "ativo",
      version: "1.1.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-22",
      changes: "MigraÃ§Ã£o para v1.3.1. RemoÃ§Ã£o de SOAP com checkboxes e placeholders. ConversÃ£o de exams para objeto estruturado. InclusÃ£o de ui, longitudinalFocus e apply.problems.",
      sources: [
        {
          label: "MS â€” PCDT Osteoporose (Portaria SCTIE/MS nÂº 39/2022)",
          url: "https://www.gov.br/saude/pt-br/assuntos/protocolos-clinicos-e-diretrizes-terapeuticas/o/osteoporose",
          type: "primary",
          year: "2022",
        },
      ],
    },
  },

  // â”€â”€ ICC â€” Retorno v1.3.1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "icc_retorno",

    metadata: {
      name: "ICC â€” Retorno",
      description: "Acompanhamento de insuficiÃªncia cardÃ­aca crÃ´nica na APS â€” classe funcional NYHA e otimizaÃ§Ã£o da farmacoterapia.",
      category: "cronico",
      tags: ["ICC", "insuficiÃªncia cardÃ­aca", "NYHA", "FEVE", "iSGLT2", "diurÃ©tico"],
      status: "ativo",
    },

    indications: [
      "Paciente com insuficiÃªncia cardÃ­aca crÃ´nica compensada, em seguimento ambulatorial na APS.",
      "Consulta de retorno para reavaliaÃ§Ã£o de classe funcional NYHA, adesÃ£o e otimizaÃ§Ã£o da farmacoterapia baseada em evidÃªncias.",
    ],

    dataRequirements: {
      useNow: [
        "Classe funcional NYHA atual",
        "Peso atual e comparaÃ§Ã£o com peso habitual",
        "PA e medicamentos em uso",
        "AdesÃ£o e restriÃ§Ã£o hÃ­drica/sal",
      ],
      idealForAdjustment: [
        "FEVE mais recente",
        "BNP ou NT-proBNP",
        "Creatinina com TFGe e potÃ¡ssio",
        "PresenÃ§a de ortopneia, dispneia paroxÃ­stica noturna e edema",
      ],
    },

    ui: {
      subjectivePrompt: "Revisar dispneia, ortopneia, DPN, edema de MMII, pesagem diÃ¡ria, adesÃ£o Ã s medicaÃ§Ãµes e Ã  restriÃ§Ã£o de sal.",
      objectivePrompt: "Registrar PA, FC, peso, presenÃ§a de estertores e edema.",
      quickNotes: [
        "ICFEr (<40%): 4 pilares â€” IECA/BRA/ARNI + betabloqueador + ARM + iSGLT2.",
        "Pesagem diÃ¡ria: procurar atendimento se ganho â‰¥2 kg em 3 dias.",
        "Encaminhar cardiologia: FEVE <35% ou CF IIIâ€“IV refratÃ¡ria.",
      ],
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente em seguimento por insuficiÃªncia cardÃ­aca crÃ´nica.",
          "Na consulta, reavaliados grau de dispneia, ortopneia, dispneia paroxÃ­stica noturna, edema de membros inferiores, peso atual e adesÃ£o ao tratamento.",
          "Revisados adesÃ£o Ã s medicaÃ§Ãµes, restriÃ§Ã£o de sal e fluidos e intercorrÃªncias desde a Ãºltima consulta.",
        ],
        objectiveOutputBlocks: [
          "PA, FC, peso e presenÃ§a de edema de membros inferiores registrados conforme consulta.",
        ],
        assessmentBlocks: [
          "InsuficiÃªncia cardÃ­aca crÃ´nica em seguimento na APS.",
          "Classe funcional NYHA avaliada na consulta.",
          "CompensaÃ§Ã£o hemodinÃ¢mica avaliada com base nos dados clÃ­nicos e exames disponÃ­veis.",
        ],
        planBlocks: [
          "Revejo e otimizo a farmacoterapia conforme FEVE e classe funcional: IECA/BRA/ARNI + betabloqueador + ARM + iSGLT2 para ICFEr.",
          "Ajusto o diurÃ©tico conforme retenÃ§Ã£o hÃ­drica e sintomas.",
          "Oriento pesagem diÃ¡ria pela manhÃ£ em jejum e retorno imediato se ganho â‰¥2 kg em 3 dias.",
          "Oriento sal <2 g/dia e restriÃ§Ã£o hÃ­drica de aproximadamente 1,5 L/dia em CF IIIâ€“IV.",
          "Oriento nÃ£o usar anti-inflamatÃ³rios nÃ£o esteroidais.",
          "Solicito vacinaÃ§Ã£o para influenza e pneumocÃ³cica quando indicado.",
          "Solicito creatinina com TFGe, potÃ¡ssio e demais exames conforme protocolo.",
          "Encaminho para cardiologia se FEVE <35% ou CF IIIâ€“IV refratÃ¡ria.",
          "Programo retorno em 1 a 2 meses ou antes se houver descompensaÃ§Ã£o.",
        ],
      },

      exams: {
        panelBase: [
          "Creatinina com TFGe",
          "PotÃ¡ssio",
          "Hemograma",
        ],
        directed: [
          "BNP ou NT-proBNP conforme indicaÃ§Ã£o clÃ­nica.",
          "ECG conforme indicaÃ§Ã£o clÃ­nica.",
          "Ecocardiograma para avaliaÃ§Ã£o ou reavaliaÃ§Ã£o da FEVE.",
        ],
        monitoring: [
          "Creatinina com TFGe e potÃ¡ssio periodicamente, especialmente com ajuste de diurÃ©tico, IECA/BRA ou iSGLT2.",
          "Peso em toda consulta.",
        ],
      },

      guidance: [
        "Oriento pesagem diÃ¡ria pela manhÃ£ em jejum â€” procurar atendimento se ganho â‰¥2 kg em 3 dias.",
        "Oriento sal <2 g/dia.",
        "Oriento limitar lÃ­quidos a aproximadamente 1,5 L por dia em classes funcionais III e IV.",
        "Oriento nÃ£o usar anti-inflamatÃ³rios.",
        "Oriento vacinar gripe anualmente e verificar situaÃ§Ã£o vacinal pneumocÃ³cica.",
      ],

      followup: [
        "Programo retorno em 1 a 2 meses.",
        "Reavalio antes se houver descompensaÃ§Ã£o ou piora clÃ­nica.",
      ],

      specialSituations: [
        "Dispneia em repouso ou edema pulmonar â€” referenciar internaÃ§Ã£o.",
        "Ganho ponderal â‰¥2 kg em 3 dias com sintomas â€” reavaliaÃ§Ã£o urgente.",
        "FEVE <35% ou CF IIIâ€“IV refratÃ¡ria â€” encaminhar cardiologia.",
      ],

      longitudinalFocus: [
        "Comparar classe funcional NYHA atual com avaliaÃ§Ãµes anteriores.",
        "Revisar evoluÃ§Ã£o ponderal e de sintomas desde a Ãºltima consulta.",
        "Verificar otimizaÃ§Ã£o dos 4 pilares terapÃªuticos na ICFEr.",
        "Registrar necessidade de ajuste terapÃªutico e resposta obtida.",
      ],
    },

    apply: {
      problems: [{ key: "icc", label: "ICC" }],
    },

    governance: {
      status: "ativo",
      version: "1.1.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-22",
      changes: "MigraÃ§Ã£o para v1.3.1. RemoÃ§Ã£o de SOAP com checkboxes e placeholders. ConversÃ£o de exams para objeto estruturado. InclusÃ£o de ui, longitudinalFocus e apply.problems.",
      sources: [
        {
          label: "SBC â€” Diretriz Brasileira de InsuficiÃªncia CardÃ­aca CrÃ´nica e Aguda",
          url: "https://www.arquivosonline.com.br/",
          type: "primary",
          year: "2023",
        },
      ],
    },
  },

  // â”€â”€ SÃ­ndrome Gripal / IRA â€” Atendimento v1.3.1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "sindrome_gripal",

    metadata: {
      name: "Síndrome Gripal / IRA — Atendimento",
      description: "Atendimento de síndrome gripal e infecção respiratória aguda na APS, com foco em triagem de gravidade, grupo de risco, manejo ambulatorial e orientação eSUS.",
      category: "agudo",
      tags: ["síndrome gripal", "IRA", "influenza", "COVID", "oseltamivir", "SpO2", "febre", "APS"],
      status: "ativo",
    },

    indications: [
      "Paciente com quadro respiratório agudo compatível com síndrome gripal/IRA na APS.",
      "Triagem de sinais de gravidade, grupo de risco, tempo de sintomas e necessidade de antiviral/testagem/encaminhamento.",
      "Usar apenas se não houver sinais de SRAG, hipoxemia, instabilidade clínica ou outro critério de urgência.",
    ],

    dataRequirements: {
      useNow: [
        "Tempo de início dos sintomas",
        "Sintomas principais: febre, tosse, dor de garganta, coriza, mialgia, cefaleia, dispneia ou sintomas gastrointestinais",
        "SpO2 em ar ambiente, FR, FC, temperatura e estado geral, se aferidos",
        "Sinais de alerta: dispneia, desconforto respiratório, cianose, confusão, hipotensão, piora importante ou prostração",
        "Grupo de risco: gestação/puerpério, idade avançada, crianças pequenas, imunossupressão, pneumopatia, cardiopatia, DM, DRC, obesidade importante ou outras comorbidades",
      ],
      idealForAdjustment: [
        "Situação vacinal para influenza e COVID",
        "Contato com casos respiratórios, surto local ou cenário epidemiológico",
        "Uso prévio de medicamentos, alergias e comorbidades relevantes",
        "Sinais focais de pneumonia, otite, sinusite, amigdalite bacteriana ou outra complicação",
        "Necessidade de atestado, orientações de afastamento e retorno",
      ],
    },

    ui: {
      subjectivePrompt: "Registrar início dos sintomas, febre, tosse, dor de garganta, coriza, mialgia, cefaleia, dispneia, comorbidades, grupo de risco, vacinação, contatos e necessidade de atestado.",
      objectivePrompt: "Registrar apenas dados realmente aferidos/documentados: SpO2 em ar ambiente, FR, FC, temperatura, estado geral, ausculta pulmonar e sinais de esforço respiratório.",
      quickNotes: [
        "Não registrar ausência de sinais de alerta se não foram avaliados.",
        "Oseltamivir: considerar em SRAG ou síndrome gripal com fator de risco, preferencialmente até 48h, sem atrasar se indicação clínica.",
        "Antibiótico não é rotina em síndrome gripal; considerar apenas se suspeita de complicação bacteriana.",
      ],
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente em atendimento por quadro respiratório agudo compatível com síndrome gripal/IRA.",
          "Registro tempo de sintomas, febre, tosse, dor de garganta, coriza, mialgia, cefaleia, dispneia, contatos, vacinação, comorbidades e grupo de risco conforme dados informados.",
          "Relato de piora, sinais de alerta, uso prévio de medicamentos e necessidade de afastamento/atestado conforme consulta.",
        ],
        objectiveOutputBlocks: [
          "Dados objetivos conforme preenchimento: SpO2 em ar ambiente, FR, FC, temperatura, PA, estado geral, ausculta pulmonar e sinais de esforço respiratório.",
          "Sinais de gravidade, hipoxemia, desconforto respiratório ou achados focais devem ser registrados apenas quando avaliados/documentados.",
        ],
        assessmentBlocks: [
          "Síndrome gripal/infecção respiratória aguda em avaliação na APS.",
          "Gravidade avaliada conforme SpO2, sinais vitais, estado geral, dispneia, esforço respiratório, comorbidades e evolução clínica disponíveis.",
          "Manejo ambulatorial apenas se ausência de sinais de gravidade estiver documentada e contexto clínico for compatível.",
          "Avalio indicação de antiviral, testagem, afastamento, sintomáticos, investigação de complicações e encaminhamento conforme risco e evolução.",
        ],
        planBlocks: [
          "Registro tempo de início dos sintomas, grupo de risco, sinais vitais disponíveis, SpO2 e presença/ausência documentada de sinais de alerta.",
          "Oriento medidas de suporte: hidratação, repouso relativo, alimentação conforme tolerância, higiene das mãos, etiqueta respiratória e evitar contato próximo enquanto sintomático.",
          "Prescrevo sintomáticos conforme avaliação clínica, contraindicações, alergias, idade, comorbidades e protocolo local.",
          "Não prescrevo antibiótico de rotina em síndrome gripal sem sinais de complicação bacteriana.",
          "Considero oseltamivir conforme protocolo vigente se SRAG, síndrome gripal com fator de risco para complicações, tempo de sintomas, disponibilidade e julgamento clínico.",
          "Considero testagem para influenza/COVID ou outros vírus conforme disponibilidade, cenário epidemiológico, grupo de risco, necessidade de confirmação e protocolo local.",
          "Solicito radiografia de tórax ou exames complementares se houver suspeita de pneumonia, hipoxemia, dispneia relevante, piora clínica, ausculta focal, febre persistente ou dúvida diagnóstica.",
          "Oriento afastamento/atestado conforme quadro clínico, atividade laboral/escolar, risco de transmissão e normas locais.",
          "Reforço sinais de alarme e oriento procurar urgência se falta de ar, SpO2 baixa, dor torácica, confusão, cianose, prostração importante, desidratação, piora após melhora inicial, febre persistente ou piora do estado geral.",
          "Programo retorno/reavaliação conforme evolução, grupo de risco, gravidade e persistência dos sintomas; retorno imediato se sinais de alerta.",
        ],
      },

      exams: {
        panelBase: [],
        directed: [
          "Teste para influenza/COVID ou outros vírus respiratórios conforme disponibilidade, cenário epidemiológico, grupo de risco, necessidade de confirmação e protocolo local.",
          "Radiografia de tórax se suspeita de pneumonia, hipoxemia, dispneia relevante, ausculta focal, dor torácica, febre persistente, piora clínica ou dúvida diagnóstica.",
          "Hemograma, PCR ou outros exames apenas se quadro prolongado, suspeita de complicação, gravidade, comorbidades relevantes ou dúvida diagnóstica.",
          "Oximetria de pulso em ar ambiente sempre que possível, especialmente se dispneia, comorbidade respiratória/cardiovascular, grupo de risco ou piora clínica.",
        ],
        monitoring: [
          "Reavaliar sinais vitais e SpO2 se piora, dispneia, grupo de risco, febre persistente ou retorno por evolução desfavorável.",
          "Acompanhar evolução clínica e sinais de complicação, especialmente em grupos de risco.",
        ],
      },

      guidance: [
        "Oriento hidratação, repouso relativo, higiene das mãos, etiqueta respiratória e evitar contato próximo enquanto sintomático.",
        "Oriento uso de sintomáticos conforme prescrição e evitar automedicação inadequada.",
        "Oriento que antibiótico não é necessário na maioria dos quadros virais e só deve ser usado quando houver indicação clínica.",
        "Oriento observar sinais de alarme: falta de ar, piora importante, dor torácica, confusão, cianose, desidratação, febre persistente ou piora após melhora inicial.",
        "Oriento retorno imediato ou urgência se surgirem sinais de alarme, SpO2 baixa ou piora do estado geral.",
      ],

      followup: [
        "Reavalio conforme evolução clínica, grupo de risco, persistência de febre, dispneia, queda de SpO2 ou piora do estado geral.",
        "Programo retorno se sintomas persistirem, se houver piora após melhora inicial ou se surgirem sinais de complicação.",
        "Em quadro leve e evolução favorável, mantenho orientações e retorno se piora ou persistência dos sintomas.",
      ],

      specialSituations: [
        "SpO2 baixa em ar ambiente, dispneia importante, desconforto respiratório, cianose ou sinais de exaustão respiratória.",
        "Confusão, rebaixamento do sensório, prostração importante, hipotensão, desidratação importante ou piora rápida do estado geral.",
        "Dor torácica, hemoptise, ausculta focal, suspeita de pneumonia, sepse ou outra complicação.",
        "Piora clínica após período inicial de melhora, sugerindo possível complicação bacteriana ou outra evolução desfavorável.",
        "Gestação, puerpério, imunossupressão, doença cardiopulmonar, DRC, DM, obesidade importante, idosos, crianças pequenas ou outros grupos de risco para complicações.",
        "Suspeita de SRAG ou necessidade de oxigênio/encaminhamento para urgência/emergência.",
      ],

      longitudinalFocus: [
        "Registrar data de início dos sintomas e evolução temporal.",
        "Registrar grupo de risco, vacinação, SpO2/sinais vitais e sinais de alerta quando avaliados.",
        "Evitar repetir antibiótico ou corticoide sem critério clínico claro.",
        "Revisar retorno se febre persistente, piora após melhora, dispneia, queda de SpO2 ou sintomas prolongados.",
        "Registrar necessidade de afastamento/atestado e orientações fornecidas.",
      ],
    },

    apply: {
      problems: [{ key: "sindrome_gripal", label: "Síndrome gripal / IRA" }],
    },

    governance: {
      status: "ativo",
      version: "1.2.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-24",
      changes: "Revisão clínica e operacional do template Síndrome Gripal / IRA — Atendimento. Corrigida codificação de acentos. Removidas frases que documentavam avaliações não necessariamente realizadas. Template reescrito para triagem rápida de gravidade, grupo de risco, tempo de sintomas, SpO2, sinais de alerta, manejo ambulatorial, orientação e saída eSUS. Removida prescrição automática de sintomáticos e oseltamivir. Incluídas orientações para evitar antibiótico sem critério, considerar antiviral conforme protocolo vigente e encaminhar casos com sinais de SRAG/gravidade.",
      sources: [
        {
          label: "Ministério da Saúde — Síndrome Gripal e Síndrome Respiratória Aguda Grave: orientações para profissionais de saúde",
          url: "https://www.gov.br/saude/pt-br/centrais-de-conteudo/publicacoes/guias-e-manuais/2025/guia-de-orientacoes-para-profissionais-de-saude-srag.pdf",
          type: "primary",
          year: "2025",
        },
        {
          label: "Ministério da Saúde — Guia de Manejo e Tratamento de Influenza",
          url: "https://www.gov.br/saude/pt-br/centrais-de-conteudo/publicacoes/svsa/influenza/guia-de-manejo-e-tratamento-de-influenza-2023",
          type: "secondary",
          year: "2023",
        },
        {
          label: "Ministério da Saúde/SVSA/SAPS/SAES/SESAI — Nota Técnica Conjunta nº 87/2026",
          url: "https://www.gov.br/saude/pt-br/centrais-de-conteudo/publicacoes/notas-tecnicas/2026/nota-tecnica-conjunta-no-87-2026-svsa-saps-saes-sesai-ms.pdf",
          type: "secondary",
          year: "2026",
        },
      ],
    },
  },

  // â”€â”€ ITU nÃ£o complicada v1.3.1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "itu_nao_complicada",

    metadata: {
      name: "ITU nÃ£o complicada â€” Atendimento",
      description: "Cistite aguda nÃ£o complicada em mulher adulta nÃ£o gestante.",
      category: "agudo",
      tags: ["ITU", "cistite", "disÃºria", "fosfomicina", "nitrofurantoÃ­na", "agudo"],
      status: "ativo"
    },

    indications: [
      "Mulher adulta nÃ£o gestante com sÃ­ndrome cistÃ­tica: disÃºria + polaciÃºria Â± urgÃªncia miccional.",
      "AusÃªncia de febre, dor lombar, imunossupressÃ£o ou sonda vesical (critÃ©rios de nÃ£o complicada)."
    ],

    dataRequirements: {
      useNow: [
        "PresenÃ§a ou ausÃªncia de febre",
        "Dor lombar ou costovertebral",
        "GestaÃ§Ã£o atual",
        "Sintomas urinÃ¡rios tÃ­picos (disÃºria, polaciÃºria, urgÃªncia)"
      ],
      idealForAdjustment: [
        "EAS ou fita urinÃ¡ria se disponÃ­vel",
        "HistÃ³rico de ITUs anteriores e antibiÃ³ticos usados",
        "Alergias a antimicrobianos"
      ]
    },

    ui: {
      subjectivePrompt: "Caracterizar sintomas urinÃ¡rios, descartar febre, dor lombar, gestaÃ§Ã£o e histÃ³rico de ITUs recorrentes.",
      objectivePrompt: "Registrar temperatura, dor Ã  palpaÃ§Ã£o suprapÃºbica e sinal de Giordano.",
      quickNotes: [
        "Febre + dor lombar = suspeita de pielonefrite â€” protocolo diferente.",
        "ITU recorrente (â‰¥3/ano) e homens: nÃ£o usar este template.",
        "Fosfomicina dose Ãºnica tem melhor adesÃ£o; nitrofurantoÃ­na Ã© alternativa por 5 dias."
      ]
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente refere disÃºria e polaciÃºria com inÃ­cio hÃ¡ [tempo]. Nega febre, dor lombar e gestaÃ§Ã£o.",
          "Sem histÃ³rico recente de ITU / [nÃºmero] episÃ³dios nos Ãºltimos 12 meses.",
          "Sem alergias conhecidas a antimicrobianos."
        ],
        objectiveOutputBlocks: [
          "Afebril. Sinal de Giordano negativo bilateralmente.",
          "Dor Ã  palpaÃ§Ã£o suprapÃºbica: [presente / ausente]."
        ],
        assessmentBlocks: [
          "Cistite aguda nÃ£o complicada â€” sÃ­ndrome cistÃ­tica tÃ­pica em mulher adulta nÃ£o gestante, sem febre nem dor lombar.",
          "DiagnÃ³stico clÃ­nico na APS â€” EAS e urocultura reservados para casos de dÃºvida diagnÃ³stica, falha terapÃªutica ou ITU recorrente."
        ],
        planBlocks: [
          "Prescrevo antibiÃ³tico de 1Âª linha conforme disponibilidade e histÃ³rico: fosfomicina 3g dose Ãºnica, nitrofurantoÃ­na 100mg 2Ã—/dia por 5 dias ou TMP-SMX 160/800mg 2Ã—/dia por 3 dias (se resistÃªncia local <20%).",
          "Oriento completar o antibiÃ³tico mesmo com melhora dos sintomas antes do tÃ©rmino.",
          "Oriento ingestÃ£o hÃ­drica â‰¥2L/dia, higiene perineal no sentido anteroposterior e micÃ§Ã£o pÃ³s-coito quando aplicÃ¡vel.",
          "Reavalio em 48â€“72h se nÃ£o houver melhora clÃ­nica â€” reavaliar diagnÃ³stico, colher EAS/urocultura e ajustar antibiÃ³tico.",
          "Programo retorno imediato se surgir febre, dor lombar, nÃ¡useas ou piora dos sintomas (critÃ©rios de pielonefrite)."
        ]
      },

      exams: {
        panelBase: [],
        directed: [
          "EAS ou fita urinÃ¡ria: se dÃºvida diagnÃ³stica ou ausÃªncia de melhora em 48â€“72h.",
          "Urocultura: se falha terapÃªutica, ITU recorrente ou gestante."
        ],
        monitoring: [
          "NÃ£o Ã© necessÃ¡rio exame de controle apÃ³s cura clÃ­nica em ITU nÃ£o complicada isolada."
        ]
      },

      guidance: [
        "Oriento ingerir â‰¥2L de Ã¡gua por dia para favorecer diurese.",
        "Oriento completar o antibiÃ³tico prescrito mesmo que os sintomas melhorem antes do fim.",
        "Oriento higiene Ã­ntima no sentido anteroposterior e micÃ§Ã£o apÃ³s relaÃ§Ã£o sexual.",
        "Oriento retorno imediato se surgir febre, dor nas costas, nÃ¡useas ou piora â€” esses sinais indicam pielonefrite."
      ],

      followup: [
        "Retorno em 48â€“72h se nÃ£o houver melhora clÃ­nica.",
        "Em caso de ITU recorrente (â‰¥3 episÃ³dios/ano), avaliar profilaxia e encaminhamento para urologia."
      ],

      specialSituations: [
        "Gestante com sintomas urinÃ¡rios: sempre solicitar urocultura e tratar bacteriÃºria assintomÃ¡tica â€” nÃ£o usar este template.",
        "Homem com cistite: investigar causa subjacente (prostatite, uropatia obstrutiva) â€” encaminhar ou ampliar protocolo.",
        "Falha com fosfomicina ou nitrofurantoÃ­na: solicitar urocultura e ajustar conforme antibiograma."
      ]
    },

    governance: {
      status: "ativo",
      version: "1.1.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-22",
      changes: "MigraÃ§Ã£o para padrÃ£o v1.3.1. planBlocks em primeira pessoa clÃ­nica. RemoÃ§Ã£o de checkboxes e campos em branco.",
      sources: [
        {
          label: "MS/FEBRASGO â€” Protocolo ClÃ­nico de ITU nÃ£o Complicada na APS, 2021",
          url: "https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/i/infeccao-do-trato-urinario",
          type: "primary",
          year: ""
        },
        {
          label: "MS â€” RENAME 2023",
          url: "https://www.gov.br/saude/pt-br/assuntos/rename",
          type: "secondary",
          year: ""
        }
      ]
    }
  },

  // â”€â”€ Amigdalite / Faringite v1.3.1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "amigdalite_faringite",

    metadata: {
      name: "Amigdalite / Faringite â€” Atendimento",
      description: "Faringoamigdalite aguda com uso do score de Centor/McIsaac para decisÃ£o de antibiÃ³tico.",
      category: "agudo",
      tags: ["faringite", "amigdalite", "Centor", "McIsaac", "estreptococo", "antibiÃ³tico", "agudo"],
      status: "ativo"
    },

    indications: [
      "Paciente com dor de garganta aguda â€” aplicar score Centor/McIsaac para estratificar risco de infecÃ§Ã£o por estreptococo do grupo A.",
      "DecisÃ£o de antibiÃ³tico baseada no score, nÃ£o em aparÃªncia clÃ­nica isolada."
    ],

    dataRequirements: {
      useNow: [
        "PresenÃ§a ou ausÃªncia de febre (temperatura atual ou referida)",
        "PresenÃ§a ou ausÃªncia de tosse",
        "Exsudato amigdaliano",
        "Sensibilidade cervical anterior",
        "Faixa etÃ¡ria"
      ],
      idealForAdjustment: [
        "Estreptotest ou cultura de orofaringe se score â‰¥3",
        "Alergias a penicilinas"
      ]
    },

    ui: {
      subjectivePrompt: "Caracterizar inÃ­cio, intensidade da dor, presenÃ§a de febre, tosse, coriza e capacidade de deglutiÃ§Ã£o.",
      objectivePrompt: "Registrar temperatura, aspecto das amÃ­gdalas (exsudato, hiperemia), linfonodos cervicais e presenÃ§a/ausÃªncia de tosse.",
      quickNotes: [
        "Score Centor/McIsaac â‰¥3: alto risco streptococo â€” considerar estreptotest ou antibiÃ³tico.",
        "Coriza e tosse favorecem etiologia viral â€” antibiÃ³tico nÃ£o indicado.",
        "Incapacidade de engolir saliva, sialorreia, desvio de Ãºvula = abscesso periamigdaliano â€” encaminhar urgÃªncia."
      ]
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente refere dor de garganta com inÃ­cio hÃ¡ [tempo]. [Febre presente â€” temperatura / Afebril].",
          "[Sem tosse / Com tosse presente â€” fator viral]. DeglutiÃ§Ã£o: [preservada / comprometida].",
          "[Sem coriza / Com coriza â€” sugestivo de etiologia viral]."
        ],
        objectiveOutputBlocks: [
          "Orofaringe: [hiperemia / exsudato amigdaliano bilateral / amÃ­gdalas com tamanho aumentado].",
          "Linfonodos cervicais anteriores: [sensÃ­veis / nÃ£o sensÃ­veis].",
          "Score Centor/McIsaac: [pontuaÃ§Ã£o]/4."
        ],
        assessmentBlocks: [
          "Faringoamigdalite aguda com score Centor/McIsaac [pontuaÃ§Ã£o]/4.",
          "Score â‰¥3: alto risco de infecÃ§Ã£o por Streptococcus pyogenes â€” antibioticoterapia considerada.",
          "Score <3: baixa probabilidade bacteriana â€” tratamento sintomÃ¡tico preferencial."
        ],
        planBlocks: [
          "Para score â‰¥3 com estreptotest ou cultura positiva: prescrevo penicilina V 500mg 3Ã—/dia por 10 dias ou amoxicilina 500mg 3Ã—/dia por 10 dias; em alergia Ã  penicilina, uso cefalexina ou azitromicina.",
          "Para score <3 ou estreptotest negativo: mantenho apenas tratamento sintomÃ¡tico â€” sem antibiÃ³tico.",
          "Prescrevo paracetamol 500â€“750mg 6/6h ou ibuprofeno 400mg 8/8h para controle de dor e febre.",
          "Oriento hidrataÃ§Ã£o adequada, repouso relativo e alimentos frios ou pastosos se deglutiÃ§Ã£o comprometida.",
          "Programo retorno em 48h se nÃ£o houver melhora, ou imediatamente se surgir dificuldade para engolir saliva, respiraÃ§Ã£o ruidosa ou sialorreia."
        ]
      },

      exams: {
        panelBase: [],
        directed: [
          "Estreptotest rÃ¡pido: quando disponÃ­vel e score â‰¥3 â€” guia decisÃ£o de antibiÃ³tico.",
          "Cultura de orofaringe: se suspeita de portador ou recorrÃªncia com estreptotest negativo."
        ],
        monitoring: []
      },

      guidance: [
        "Oriento uso regular de analgÃ©sico/antitÃ©rmico para controle da dor â€” paracetamol ou ibuprofeno.",
        "Oriento hidrataÃ§Ã£o abundante e preferÃªncia por alimentos frios e pastosos enquanto houver dor.",
        "Oriento completar o antibiÃ³tico prescrito atÃ© o final, mesmo com melhora prÃ©via, para evitar recidiva e reumatismo.",
        "Oriento retorno imediato se: dificuldade para engolir saliva, sialorreia, respiraÃ§Ã£o ruidosa ou piora abrupta da dor."
      ],

      followup: [
        "Retorno em 5â€“7 dias ou antes se piora clÃ­nica.",
        "Amigdalites bacterianas recorrentes (â‰¥5 episÃ³dios/ano por 2 anos): avaliar encaminhamento para otorrinolaringologia."
      ],

      specialSituations: [
        "Abscesso periamigdaliano: desvio de Ãºvula, voz abafada (hot potato voice), trismo â€” encaminhar urgÃªncia hospitalar.",
        "Escarlatina: rash micropapular pÃ³s-amigdalite â€” confirmar e tratar com penicilina por 10 dias.",
        "Paciente imunossuprimido com faringite: ampliar suspeitas (CMV, EBV) e solicitar hemograma."
      ]
    },

    governance: {
      status: "ativo",
      version: "1.1.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-22",
      changes: "MigraÃ§Ã£o para padrÃ£o v1.3.1. RemoÃ§Ã£o de checkboxes, campos em branco e caracteres corrompidos. planBlocks em primeira pessoa clÃ­nica.",
      sources: [
        {
          label: "McIsaac WJ et al. â€” Validation of a clinical score to reduce unnecessary antibiotic use. Can Fam Physician, 2003",
          url: "https://pubmed.ncbi.nlm.nih.gov/9861203/",
          type: "primary",
          year: ""
        },
        {
          label: "MS â€” RENAME 2023",
          url: "https://www.gov.br/saude/pt-br/assuntos/rename",
          type: "secondary",
          year: ""
        }
      ]
    }
  },

  // â”€â”€ Dor Lombar Aguda v1.3.1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "dor_lombar_aguda",

    metadata: {
      name: "Dor Lombar Aguda â€” Atendimento",
      description: "Dor lombar aguda inespecÃ­fica â€” identificar bandeiras vermelhas e manejar conservadoramente.",
      category: "agudo",
      tags: ["dor lombar", "coluna", "bandeiras vermelhas", "ciatalgia", "fisioterapia", "agudo"],
      status: "ativo"
    },

    indications: [
      "Paciente com dor lombar aguda (<6 semanas) â€” triagem de bandeiras vermelhas e manejo conservador na APS.",
      "A maioria dos casos (â‰ˆ90%) Ã© inespecÃ­fica e responde a tratamento conservador sem necessidade de imagem."
    ],

    dataRequirements: {
      useNow: [
        "PresenÃ§a de bandeiras vermelhas (febre, perda de peso, trauma, dÃ©ficit neurolÃ³gico progressivo, disfunÃ§Ã£o vesical/intestinal)",
        "IrradiaÃ§Ã£o para membros inferiores",
        "Exame neurolÃ³gico sumÃ¡rio (forÃ§a, sensibilidade, reflexos)"
      ],
      idealForAdjustment: [
        "EVA de dor atual",
        "Impacto funcional e capacidade de deambulaÃ§Ã£o",
        "Uso prÃ©vio de analgÃ©sicos e resposta"
      ]
    },

    ui: {
      subjectivePrompt: "Caracterizar inÃ­cio, mecanismo, localizaÃ§Ã£o da dor, irradiaÃ§Ã£o, sintomas neurolÃ³gicos (parestesias, fraqueza) e disfunÃ§Ã£o vesical/intestinal.",
      objectivePrompt: "Registrar exame neurolÃ³gico sumÃ¡rio: forÃ§a, sensibilidade, reflexos tendinosos profundos e sinal de LasÃ¨gue.",
      quickNotes: [
        "DisfunÃ§Ã£o vesical ou intestinal = sÃ­ndrome de cauda equina â€” encaminhar emergÃªncia imediatamente.",
        "Imagem (RX, RM) NÃƒO Ã© indicada de rotina na dor lombar aguda inespecÃ­fica.",
        "Manter atividade Ã© parte do tratamento â€” repouso prolongado piora o prognÃ³stico."
      ]
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente refere dor lombar com inÃ­cio hÃ¡ [tempo] e mecanismo [descriÃ§Ã£o]. Intensidade atual: EVA [valor].",
          "IrradiaÃ§Ã£o para membro inferior: [ausente / presente Ã  direita / presente Ã  esquerda â€” nÃ­vel].",
          "Nega febre, perda de peso, trauma significativo, parestesias e disfunÃ§Ã£o vesical ou intestinal."
        ],
        objectiveOutputBlocks: [
          "Exame neurolÃ³gico sumÃ¡rio: forÃ§a preservada nos membros inferiores, sensibilidade preservada, reflexos presentes e simÃ©tricos.",
          "Sinal de LasÃ¨gue: [negativo bilateralmente / positivo Ã  direita/esquerda â€” grau].",
          "Contratura muscular paravertebral: [ausente / presente]."
        ],
        assessmentBlocks: [
          "Dor lombar aguda inespecÃ­fica â€” sem bandeiras vermelhas identificadas, compatÃ­vel com a maioria dos casos na APS.",
          "Ciatalgia: [ausente / presente â€” indicar nÃ­vel e extensÃ£o].",
          "Imagem nÃ£o indicada no momento â€” critÃ©rios clÃ­nicos nÃ£o justificam investigaÃ§Ã£o complementar de rotina."
        ],
        planBlocks: [
          "Prescrevo analgesia regular: paracetamol 500â€“750mg 6/6h e, se necessÃ¡rio, ibuprofeno 400â€“600mg 8/8h por atÃ© 7 dias.",
          "Acrescento ciclobenzaprina 5mg 3Ã—/dia por atÃ© 7 dias se houver espasmo muscular clinicamente evidente.",
          "Oriento manutenÃ§Ã£o de atividade fÃ­sica e deslocamentos â€” repouso no leito piora o prognÃ³stico e nÃ£o Ã© recomendado.",
          "Oriento calor local (bolsa quente) para alÃ­vio do espasmo muscular.",
          "Reavalio em 4 semanas: se nÃ£o houver melhora, solicito fisioterapia; se surgirem bandeiras vermelhas, solicito imagem e encaminho conforme achado.",
          "Programo retorno imediato se surgir fraqueza nos membros inferiores, dormÃªncia perineal ou perda do controle vesical/intestinal."
        ]
      },

      exams: {
        panelBase: [],
        directed: [
          "Radiografia lombar: apenas se suspeita de fratura por compressÃ£o em idoso, trauma de alta energia ou neoplasia.",
          "RessonÃ¢ncia magnÃ©tica lombar: dÃ©ficit neurolÃ³gico progressivo, suspeita de sÃ­ndrome de cauda equina ou hÃ©rnia com falha de tratamento conservador â‰¥6 semanas.",
          "Hemograma e PCR: se suspeita de causa infecciosa ou inflamatÃ³ria (espondilodiscite)."
        ],
        monitoring: []
      },

      guidance: [
        "Oriento manter-se ativo â€” o movimento Ã© parte do tratamento e acelera a recuperaÃ§Ã£o.",
        "Oriento aplicar calor local (bolsa de Ã¡gua quente ou toalha morna) no ponto de maior dor.",
        "Oriento tomar o analgÃ©sico no horÃ¡rio prescrito, nÃ£o aguardar a dor intensa para medicÃ¡-lo.",
        "Oriento que radiografia e ressonÃ¢ncia nÃ£o sÃ£o necessÃ¡rias neste momento e nÃ£o mudariam o tratamento.",
        "Oriento buscar emergÃªncia imediatamente se surgir: fraqueza na perna, dormÃªncia na regiÃ£o genital/anal ou perda do controle da bexiga ou intestino."
      ],

      followup: [
        "Retorno em 4â€“6 semanas se nÃ£o houver melhora com tratamento conservador.",
        "Retorno imediato se surgir qualquer bandeira vermelha."
      ],

      specialSituations: [
        "Ciatalgia com dÃ©ficit motor progressivo: solicitar RM e encaminhar ortopedia/neurocirurgia.",
        "Dor lombar crÃ´nica (>12 semanas): reavaliar, iniciar fisioterapia, considerar abordagem biopsicossocial.",
        "Suspeita de espondilodiscite (febre + dor noturna sem alÃ­vio): solicitar hemograma, PCR, VHS e RM urgente."
      ]
    },

    governance: {
      status: "ativo",
      version: "1.1.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-22",
      changes: "MigraÃ§Ã£o para padrÃ£o v1.3.1. RemoÃ§Ã£o de checkboxes, campos em branco e caracteres corrompidos. planBlocks em primeira pessoa clÃ­nica.",
      sources: [
        {
          label: "MS â€” Caderno de AtenÃ§Ã£o BÃ¡sica: Dorsalgia, 2023",
          url: "https://bvsms.saude.gov.br/",
          type: "primary",
          year: ""
        }
      ]
    }
  },

  // â”€â”€ Cefaleia v1.3.1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "cefaleia",

    metadata: {
      name: "Cefaleia â€” Atendimento",
      description: "AvaliaÃ§Ã£o de cefaleia primÃ¡ria na APS â€” triagem de bandeiras vermelhas e manejo da enxaqueca e cefaleia tensional.",
      category: "agudo",
      tags: ["cefaleia", "enxaqueca", "tensional", "bandeiras vermelhas", "triptano", "profilaxia", "agudo"],
      status: "ativo"
    },

    indications: [
      "Paciente com cefaleia recorrente ou episÃ³dio agudo â€” excluir causas secundÃ¡rias graves (bandeiras vermelhas) e classificar o tipo primÃ¡rio.",
      "DecisÃ£o sobre tratamento de crise e avaliaÃ§Ã£o de necessidade de profilaxia."
    ],

    dataRequirements: {
      useNow: [
        "FrequÃªncia e duraÃ§Ã£o dos episÃ³dios",
        "CaracterÃ­sticas da dor (localizaÃ§Ã£o, qualidade, intensidade)",
        "PresenÃ§a de nÃ¡useas, foto/fonofobia, aura",
        "NÃºmero de dias de uso de analgÃ©sicos por mÃªs",
        "Bandeiras vermelhas (inÃ­cio sÃºbito, febre, dÃ©ficit neurolÃ³gico)"
      ],
      idealForAdjustment: [
        "DiÃ¡rio de cefaleias com gatilhos identificados",
        "Medicamentos jÃ¡ usados e resposta",
        "HistÃ³rico familiar de enxaqueca"
      ]
    },

    ui: {
      subjectivePrompt: "Caracterizar frequÃªncia, localizaÃ§Ã£o, qualidade, intensidade, duraÃ§Ã£o, nÃ¡useas, foto/fonofobia, aura, gatilhos e uso de analgÃ©sicos por mÃªs.",
      objectivePrompt: "Registrar exame neurolÃ³gico (rigidez nucal, dÃ©ficit motor/sensitivo focal, pupilas) e sinais vitais.",
      quickNotes: [
        "Bandeiras vermelhas presentes = investigar cefaleia secundÃ¡ria antes de qualquer outro manejo.",
        "Uso de analgÃ©sico >10 dias/mÃªs pode causar cefaleia por uso excessivo de medicamento (rebote).",
        "Profilaxia indicada se â‰¥4 crises incapacitantes por mÃªs."
      ]
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente refere cefaleia com frequÃªncia de [nÃºmero] dias/mÃªs. LocalizaÃ§Ã£o: [unilateral / bilateral]. Qualidade: [pulsÃ¡til / pressÃ£o / aperto].",
          "Intensidade: EVA [valor]. DuraÃ§Ã£o mÃ©dia: [horas]. NÃ¡useas: [presentes / ausentes]. Foto/fonofobia: [presente / ausente]. Aura: [nÃ£o / sim â€” descriÃ§Ã£o].",
          "Usa analgÃ©sico em [nÃºmero] dias/mÃªs. Gatilhos identificados: [lista ou ausentes].",
          "Nega inÃ­cio sÃºbito, febre, rigidez de nuca, dÃ©ficit neurolÃ³gico focal ou primeiro episÃ³dio apÃ³s os 50 anos."
        ],
        objectiveOutputBlocks: [
          "Exame neurolÃ³gico sumÃ¡rio: sem dÃ©ficit motor, sem alteraÃ§Ã£o de pares cranianos, sem rigidez nucal.",
          "Sinais vitais: PA [mmHg], FC [bpm]."
        ],
        assessmentBlocks: [
          "Cefaleia primÃ¡ria sem bandeiras vermelhas.",
          "ClassificaÃ§Ã£o provÃ¡vel: [cefaleia tensional episÃ³dica / cefaleia tensional crÃ´nica / enxaqueca sem aura / enxaqueca com aura] â€” conforme critÃ©rios ICHD-3.",
          "Uso de analgÃ©sico: [dentro do limite / excessivo â€” >10 dias/mÃªs â€” risco de cefaleia por abuso medicamentoso]."
        ],
        planBlocks: [
          "Para cefaleia tensional em crise: prescrevo AINE (ibuprofeno 400â€“600mg) ou paracetamol 750mg; oriento uso intermitente e monitoramento do nÃºmero de dias de uso.",
          "Para enxaqueca leve/moderada em crise: prescrevo ibuprofeno 400â€“600mg; acrescento metoclopramida 10mg se nÃ¡useas presentes.",
          "Para enxaqueca grave ou refratÃ¡ria a AINE: prescrevo triptano â€” sumatriptana 50â€“100mg VO na crise.",
          "Se frequÃªncia â‰¥4 crises incapacitantes/mÃªs: inicio profilaxia â€” propranolol 40â€“80mg/dia ou amitriptilina 10â€“25mg/noite, conforme perfil do paciente.",
          "Oriento iniciar diÃ¡rio de cefaleias para identificar gatilhos e monitorar frequÃªncia.",
          "Programo retorno em 4â€“6 semanas para avaliar resposta e ajuste de profilaxia, se iniciada."
        ]
      },

      exams: {
        panelBase: [],
        directed: [
          "Neuroimagem (TC ou RM crÃ¢nio): se bandeiras vermelhas presentes (inÃ­cio sÃºbito, febre, dÃ©ficit focal, >50 anos primeiro episÃ³dio, piora progressiva).",
          "PunÃ§Ã£o lombar: se TC normal e suspeita de hemorragia subaracnoidea ou meningite.",
          "TSH: se cefaleia crÃ´nica e hipotireoidismo na lista de diferenciais."
        ],
        monitoring: []
      },

      guidance: [
        "Oriento manter diÃ¡rio de cefaleias anotando data, duraÃ§Ã£o, intensidade, gatilho e medicamento usado.",
        "Oriento identificar e evitar gatilhos: privaÃ§Ã£o de sono, jejum prolongado, Ã¡lcool, estresse e odores fortes.",
        "Oriento nÃ£o usar analgÃ©sico mais de 10 dias por mÃªs â€” o uso excessivo causa cefaleia de rebote.",
        "Oriento que o triptano deve ser tomado no inÃ­cio da crise, nÃ£o aguardar a dor intensa.",
        "Oriento buscar emergÃªncia se surgir: cefaleia sÃºbita de mÃ¡xima intensidade, febre com rigidez de nuca, fraqueza ou alteraÃ§Ã£o de fala."
      ],

      followup: [
        "Retorno em 4â€“6 semanas para avaliar frequÃªncia, resposta ao tratamento e ajuste de profilaxia.",
        "Se profilaxia iniciada: reavaliar em 2â€“3 meses â€” reduÃ§Ã£o de 50% na frequÃªncia Ã© meta razoÃ¡vel."
      ],

      specialSituations: [
        "Cefaleia por abuso medicamentoso: retirada gradual do analgÃ©sico excessivo â€” pode haver piora transitÃ³ria; orientar o paciente.",
        "Enxaqueca menstrual: triptano profilÃ¡tico peri-menstrual ou AINE programado no perÃ­odo.",
        "Aura atÃ­pica ou cefaleia nova apÃ³s os 50 anos: sempre investigar com neuroimagem antes de tratar como primÃ¡ria."
      ]
    },

    governance: {
      status: "ativo",
      version: "1.1.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-22",
      changes: "MigraÃ§Ã£o para padrÃ£o v1.3.1. RemoÃ§Ã£o de checkboxes e campos em branco. planBlocks em primeira pessoa clÃ­nica operacional.",
      sources: [
        {
          label: "SBCef â€” Diretrizes DiagnÃ³sticas e TerapÃªuticas de Cefaleias PrimÃ¡rias do Adulto, 2022",
          url: "https://sbcef.org.br/",
          type: "primary",
          year: ""
        }
      ]
    }
  },

  // â”€â”€ SaÃºde da Mulher v1.3.1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "saude_mulher",

    metadata: {
      name: "SaÃºde da Mulher â€” Rastreio",
      description: "Consulta de saÃºde da mulher â€” rastreamentos oncolÃ³gicos (colo e mama) e planejamento reprodutivo na APS.",
      category: "preventivo",
      tags: ["mulher", "Papanicolau", "mamografia", "rastreio", "cÃ¢ncer", "contracepÃ§Ã£o", "preventivo"],
      status: "ativo"
    },

    indications: [
      "Mulher em idade reprodutiva ou climatÃ©rio â€” rastrear cÃ¢ncer de colo do Ãºtero e de mama conforme protocolo MS/INCA 2024.",
      "AvaliaÃ§Ã£o e orientaÃ§Ã£o sobre planejamento familiar, mÃ©todo anticoncepcional e saÃºde ginecolÃ³gica geral."
    ],

    dataRequirements: {
      useNow: [
        "Data da Ãºltima citologia oncÃ³tica e resultado",
        "Data da Ãºltima mamografia e resultado (para mulheres â‰¥50 anos)",
        "MÃ©todo anticoncepcional em uso",
        "Data da Ãºltima menstruaÃ§Ã£o e regularidade do ciclo"
      ],
      idealForAdjustment: [
        "HistÃ³ria de IST pregressa",
        "HistÃ³ria familiar de cÃ¢ncer de mama ou ovÃ¡rio",
        "Planejamento gestacional atual"
      ]
    },

    ui: {
      subjectivePrompt: "Revisar rastreamentos oncolÃ³gicos (data e resultado da citologia e mamografia), mÃ©todo anticoncepcional atual, ciclo menstrual e queixas ginecolÃ³gicas.",
      objectivePrompt: "Registrar exame das mamas e, se indicado, coleta de citologia oncÃ³tica.",
      quickNotes: [
        "Papanicolau: 25â€“64 anos, anual nos dois primeiros anos consecutivos normais, depois a cada 3 anos.",
        "Mamografia: 50â€“69 anos a cada 2 anos; fora dessa faixa apenas com risco elevado.",
        "Colposcopia nÃ£o Ã© rastreamento de rotina â€” sÃ³ apÃ³s citologia alterada (ASC-US ou superior)."
      ]
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente de [idade] anos, [prÃ©-menopausa / climatÃ©rio / pÃ³s-menopausa]. DUM: [data]. Ciclo: [regular / irregular â€” caracterizaÃ§Ã£o].",
          "MÃ©todo anticoncepcional em uso: [mÃ©todo / nÃ£o usa]. Planejamento reprodutivo: [nÃ£o deseja engravidar / deseja engravidar / indiferente].",
          "Ãšltima citologia oncÃ³tica: [data] â€” resultado: [normal / alterado / nÃ£o realizada]. Ãšltima mamografia: [data] â€” resultado: [BI-RADS / nÃ£o indicada / nÃ£o realizada].",
          "Queixas atuais: [corrimento, dispareunia, sangramento irregular, nÃ³dulo mamÃ¡rio ou ausÃªncia de queixas]."
        ],
        objectiveOutputBlocks: [
          "Exame das mamas: [sem alteraÃ§Ãµes palpÃ¡veis / nÃ³dulo descrito em localizaÃ§Ã£o e caracterÃ­sticas].",
          "Citologia coletada nesta consulta: [sim â€” material adequado / nÃ£o indicada no momento]."
        ],
        assessmentBlocks: [
          "Rastreamento conforme MS/INCA 2024:",
          "â€” CÃ¢ncer de colo uterino (Papanicolau): [em dia / pendente â€” Ãºltima: data ou nunca realizada].",
          "â€” CÃ¢ncer de mama (mamografia 50â€“69 anos, a cada 2 anos): [em dia / pendente / nÃ£o indicada por faixa etÃ¡ria].",
          "MÃ©todo anticoncepcional: [adequado ao momento / necessita orientaÃ§Ã£o ou ajuste]."
        ],
        planBlocks: [
          "Coletei ou agendo citologia oncÃ³tica se indicada (25â€“64 anos com intervalo adequado).",
          "Solicito mamografia se 50â€“69 anos com exame anterior hÃ¡ â‰¥2 anos; ou se risco elevado (histÃ³ria familiar de 1Âº grau, mutaÃ§Ã£o BRCA) independentemente da faixa etÃ¡ria.",
          "Oriento ou prescrevo mÃ©todo anticoncepcional adequado ao momento reprodutivo, comorbidades e preferÃªncia da paciente.",
          "Solicito sorologias para IST (HIV, sÃ­filis, hepatite B e C) se indicado por risco ou ausÃªncia de rastreio recente.",
          "Encaminho para colposcopia se citologia mostrar ASC-US ou superior; para mastologia se nÃ³dulo palpÃ¡vel ou BI-RADS â‰¥4.",
          "OfereÃ§o vacina HPV se 9â€“45 anos e esquema incompleto ou ausente.",
          "Programo retorno anual ou conforme intervalo do rastreio â€” citologia a cada 3 anos apÃ³s dois normais consecutivos, mamografia a cada 2 anos."
        ]
      },

      exams: {
        panelBase: [
          "Citologia oncÃ³tica (Papanicolau) â€” 25 a 64 anos",
          "Mamografia bilateral â€” 50 a 69 anos, a cada 2 anos"
        ],
        directed: [
          "Sorologias para IST (HIV, sÃ­filis, hepatite B e C): conforme risco ou ausÃªncia de rastreio.",
          "Ultrassonografia mamÃ¡ria: complementar Ã  mamografia se mama densa ou nÃ³dulo palpÃ¡vel.",
          "Colposcopia: citologia ASC-US ou superior.",
          "CA-125 e ultrassonografia transvaginal: nÃ£o sÃ£o recomendados para rastreio de cÃ¢ncer de ovÃ¡rio na populaÃ§Ã£o geral."
        ],
        monitoring: [
          "Citologia oncÃ³tica normal em dois anos consecutivos: intervalo de 3 anos.",
          "Mamografia normal: repetir em 2 anos."
        ]
      },

      guidance: [
        "Oriento que o Papanicolau detecta alteraÃ§Ãµes anos antes do cÃ¢ncer â€” Ã© uma das formas mais eficazes de prevenÃ§Ã£o disponÃ­veis.",
        "Oriento que a mamografia deve ser realizada a cada 2 anos dos 50 aos 69 anos, mesmo sem sintomas.",
        "Oriento sobre o mÃ©todo anticoncepcional em uso: como usar corretamente, sinais de alerta e o que fazer em caso de falha.",
        "Oriento retornar se surgir: corrimento com odor intenso ou cor incomum, sangramento fora do perÃ­odo, sangramento pÃ³s-menopausa, ou nÃ³dulo mamÃ¡rio palpÃ¡vel."
      ],

      followup: [
        "Retorno anual para consulta preventiva e revisÃ£o dos rastreamentos.",
        "Citologia normal: retorno em 3 anos apÃ³s dois consecutivos normais.",
        "Mamografia normal: retorno em 2 anos."
      ],

      specialSituations: [
        "Sangramento vaginal pÃ³s-menopausa: sempre investigar â€” solicitar ultrassonografia transvaginal e encaminhar ginecologia.",
        "GestaÃ§Ã£o planejada: orientar Ã¡cido fÃ³lico 400mcg/dia prÃ©-concepcional, atualizar vacinas e rastreamentos antes da gravidez.",
        "Paciente com imunossupressÃ£o (HIV, transplante, corticoterapia crÃ´nica): rastreamento de colo uterino com maior frequÃªncia â€” seguir protocolo especÃ­fico."
      ]
    },

    governance: {
      status: "ativo",
      version: "1.1.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-22",
      changes: "MigraÃ§Ã£o para padrÃ£o v1.3.1. RemoÃ§Ã£o de checkboxes e campos em branco. planBlocks em primeira pessoa clÃ­nica.",
      sources: [
        {
          label: "MS/INCA â€” Diretrizes para Rastreamento do CÃ¢ncer no Brasil, 2024",
          url: "https://www.inca.gov.br/publicacoes/livros/rastreamento-do-cancer",
          type: "primary",
          year: ""
        }
      ]
    }
  },

  // â”€â”€ SaÃºde do Idoso v1.3.1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "saude_idoso",

    metadata: {
      name: "SaÃºde do Idoso â€” AvaliaÃ§Ã£o",
      description: "Consulta de saÃºde do idoso â€” avaliaÃ§Ã£o funcional, cognitiva, risco de quedas e polifarmÃ¡cia na APS.",
      category: "preventivo",
      tags: ["idoso", "fragilidade", "queda", "cogniÃ§Ã£o", "MEEM", "TUG", "polifarmÃ¡cia", "preventivo"],
      status: "ativo"
    },

    indications: [
      "Idoso â‰¥60 anos em acompanhamento na APS â€” avaliaÃ§Ã£o multidimensional: funcional, cognitivo, humor, nutriÃ§Ã£o, medicaÃ§Ãµes e prevenÃ§Ã£o de quedas.",
      "Consulta anual de vigilÃ¢ncia de saÃºde ou quando houver queda, piora funcional ou queixa cognitiva."
    ],

    dataRequirements: {
      useNow: [
        "Lista atualizada de medicamentos em uso",
        "AVDs bÃ¡sicas (banho, higiene, alimentaÃ§Ã£o, transferÃªncia, continÃªncia)",
        "HistÃ³rico de quedas nos Ãºltimos 12 meses",
        "Escolaridade (necessÃ¡ria para interpretaÃ§Ã£o do MEEM)"
      ],
      idealForAdjustment: [
        "MEEM (Mini-Exame do Estado Mental)",
        "TUG (Timed Up and Go Test)",
        "GDS-2 (rastreio de humor depressivo)",
        "Peso atual e comparaÃ§Ã£o com consulta anterior"
      ]
    },

    ui: {
      subjectivePrompt: "Revisar queixas, AVDs, quedas no Ãºltimo ano, cogniÃ§Ã£o, humor, sono, alimentaÃ§Ã£o e medicaÃ§Ãµes em uso.",
      objectivePrompt: "Registrar peso, PA, MEEM, TUG e exame fÃ­sico dirigido.",
      quickNotes: [
        "TUG >12s: alto risco de queda â€” acionar fisioterapia.",
        "MEEM: corte por escolaridade â€” analfabeto â‰¥13, 1â€“7 anos â‰¥18, â‰¥8 anos â‰¥26.",
        "PolifarmÃ¡cia (â‰¥5 medicamentos): revisar CritÃ©rios de Beers para inapropriados em idosos."
      ]
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Idoso de [idade] anos, escolaridade: [anos]. Queixa principal: [descriÃ§Ã£o ou consulta de rotina].",
          "AVDs bÃ¡sicas: [independente / dependente parcial em: descriÃ§Ã£o]. AVDs instrumentais: [preservadas / comprometidas em: descriÃ§Ã£o].",
          "Quedas nos Ãºltimos 12 meses: [nÃºmero de episÃ³dios / nenhuma]. Medo de cair: [sim / nÃ£o].",
          "CogniÃ§Ã£o: [sem queixa subjetiva / refere dificuldade com: descriÃ§Ã£o]. Humor: [sem alteraÃ§Ã£o / triagem GDS-2 positiva].",
          "Medicamentos em uso: [lista â€” total de X medicamentos]."
        ],
        objectiveOutputBlocks: [
          "Peso: [kg] (variaÃ§Ã£o em relaÃ§Ã£o Ã  consulta anterior: [kg]). PA: [mmHg]. FC: [bpm].",
          "MEEM: [pontuaÃ§Ã£o]/30 â€” [normal para escolaridade / abaixo do corte].",
          "TUG: [segundos] â€” [<12s: risco baixo / 12â€“20s: risco moderado / >20s: risco alto].",
          "Exame fÃ­sico dirigido: [achados relevantes ou sem alteraÃ§Ãµes]."
        ],
        assessmentBlocks: [
          "Idoso com [envelhecimento ativo / prÃ©-fragilidade / fragilidade] â€” fenÃ³tipo de Fried: [pontuaÃ§Ã£o/5 critÃ©rios].",
          "CogniÃ§Ã£o: [normal para a escolaridade / triagem positiva para comprometimento â€” necessita avaliaÃ§Ã£o complementar].",
          "Risco de queda: [baixo â€” TUG <12s / moderado â€” TUG 12â€“20s / alto â€” TUG >20s].",
          "PolifarmÃ¡cia: [ausente / presente com X medicamentos â€” revisar potencialmente inapropriados]."
        ],
        planBlocks: [
          "Reviso a lista de medicamentos e suspendo ou substituo os potencialmente inapropriados conforme CritÃ©rios de Beers/STOPP.",
          "Solicito exercÃ­cios de equilÃ­brio e fortalecimento muscular â€” encaminho para fisioterapia se TUG >12s.",
          "Oriento adaptaÃ§Ãµes domiciliares para prevenÃ§Ã£o de quedas: tapetes fixos ou removidos, corrimÃ£os, iluminaÃ§Ã£o adequada, sapatos com solado antiderrapante.",
          "Encaminho para avaliaÃ§Ã£o complementar (neuropsicologia, geriatra) se MEEM abaixo do corte ou deterioraÃ§Ã£o cognitiva progressiva.",
          "Solicito exames laboratoriais de rastreio: creatinina + TFGe, vitamina B12, folato, vitamina D, TSH e hemograma.",
          "Verifico e atualizo vacinas: influenza (anual), pneumocÃ³cica (conforme esquema), dT/dTpa e COVID-19 (conforme esquema vigente).",
          "Encaminho para oftalmologia e/ou audiologia se dÃ©ficit visual ou auditivo identificado.",
          "Programo retorno em 6â€“12 meses ou antes se deterioraÃ§Ã£o funcional, cognitiva ou queda."
        ]
      },

      exams: {
        panelBase: [
          "Creatinina com TFGe",
          "Vitamina B12",
          "Folato",
          "Vitamina D (25-OH)",
          "TSH",
          "Hemograma completo"
        ],
        directed: [
          "DXA (densitometria Ã³ssea): se nÃ£o realizada nos Ãºltimos 2 anos em idosa ou idoso com fatores de risco para osteoporose.",
          "Rastreio de cÃ¢ncer colorretal: PSOF anual ou colonoscopia a cada 10 anos (50â€“75 anos)."
        ],
        monitoring: [
          "Peso a cada consulta â€” perda >5% em 6 meses: investigar causa.",
          "PA a cada consulta."
        ]
      },

      guidance: [
        "Oriento prÃ¡tica regular de exercÃ­cios fÃ­sicos â€” caminhada, equilÃ­brio e fortalecimento reduzem risco de queda e fragilidade.",
        "Oriento adaptaÃ§Ãµes domiciliares: remover tapetes soltos, instalar corrimÃ£os e melhorar iluminaÃ§Ã£o.",
        "Oriento nÃ£o adicionar ou suspender medicamentos sem comunicar ao mÃ©dico.",
        "Oriento vacinaÃ§Ã£o anual contra influenza e seguimento do esquema vacinal para idosos.",
        "Oriento manter atividades sociais e estimulaÃ§Ã£o cognitiva â€” leitura, jogos e conversas â€” como parte do cuidado com a saÃºde cerebral."
      ],

      followup: [
        "Retorno em 6â€“12 meses conforme grau de vulnerabilidade.",
        "Idosos frÃ¡geis ou com TUG >12s: retorno em 3â€“6 meses."
      ],

      specialSituations: [
        "Queda com trauma ou suspeita de fratura: solicitar radiografia e encaminhar conforme achado.",
        "MEEM abaixo do corte: diferenciar delirium (agudo) de demÃªncia (crÃ´nico) â€” investigar causas reversÃ­veis antes de concluir demÃªncia.",
        "Disfagia ou perda de peso significativa: avaliar disfunÃ§Ã£o oral/esofÃ¡gica, rastrear depressÃ£o e neoplasia."
      ]
    },

    governance: {
      status: "ativo",
      version: "1.1.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-22",
      changes: "MigraÃ§Ã£o para padrÃ£o v1.3.1. RemoÃ§Ã£o de checkboxes e campos em branco. planBlocks em primeira pessoa clÃ­nica.",
      sources: [
        {
          label: "MS â€” CAB nÂº 19 â€” Envelhecimento e SaÃºde da Pessoa Idosa, 2023",
          url: "https://bvsms.saude.gov.br/bvs/publicacoes/envelhecimento_saude_pessoa_idosa.pdf",
          type: "primary",
          year: ""
        }
      ]
    }
  },

  // â”€â”€ SaÃºde do Homem v1.3.1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "saude_homem",

    metadata: {
      name: "SaÃºde do Homem â€” Rastreio",
      description: "Consulta de saÃºde do homem â€” rastreamentos, saÃºde sexual e prevenÃ§Ã£o na APS.",
      category: "preventivo",
      tags: ["homem", "PSA", "colorretal", "PSOF", "tabagismo", "Ã¡lcool", "IST", "preventivo"],
      status: "ativo"
    },

    indications: [
      "Homem adulto em consulta preventiva â€” rastrear cÃ¢nceres (prÃ³stata, colorretal), HAS, DM2, dislipidemia e fatores de risco comportamentais.",
      "Abordagem de saÃºde sexual, sintomas urinÃ¡rios e intervenÃ§Ã£o breve para tabagismo e Ã¡lcool."
    ],

    dataRequirements: {
      useNow: [
        "Idade",
        "PA atual",
        "HistÃ³ria familiar de cÃ¢ncer de prÃ³stata",
        "Sintomas urinÃ¡rios (IPSS ou descriÃ§Ã£o)"
      ],
      idealForAdjustment: [
        "Glicemia e perfil lipÃ­dico recentes",
        "AUDIT-C (rastreio de uso problemÃ¡tico de Ã¡lcool)",
        "Rastreio de tabagismo e nÃºmero de cigarros/dia"
      ]
    },

    ui: {
      subjectivePrompt: "Revisar rastreamentos oncolÃ³gicos, sintomas urinÃ¡rios, saÃºde sexual, tabagismo, consumo de Ã¡lcool e histÃ³ria familiar.",
      objectivePrompt: "Registrar PA, peso, IMC e exame fÃ­sico dirigido.",
      quickNotes: [
        "PSA: decisÃ£o compartilhada â€” explicar prÃ³s/contras antes de solicitar. NÃ£o rastrear >75 anos.",
        "PSOF anual ou colonoscopia a cada 10 anos: 50â€“75 anos.",
        "AUDIT-C â‰¥3: abordagem breve de Ã¡lcool na consulta."
      ]
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Homem de [idade] anos em consulta preventiva. Queixas atuais: [descriÃ§Ã£o ou ausÃªncia de queixas].",
          "Sintomas urinÃ¡rios: [ausentes / IPSS: pontuaÃ§Ã£o â€” jato fraco, hesitÃ¢ncia, noctÃºria, urgÃªncia].",
          "Tabagismo: [nunca / ex-fumante hÃ¡ X anos / ativo â€” X cigarros/dia]. Ãlcool: [AUDIT-C: pontuaÃ§Ã£o â€” abaixo/acima do limiar].",
          "HistÃ³ria familiar: [ausente / cÃ¢ncer de prÃ³stata ou colorretal em 1Âº grau]."
        ],
        objectiveOutputBlocks: [
          "PA: [mmHg]. Peso: [kg]. IMC: [valor].",
          "Exame fÃ­sico dirigido: [sem alteraÃ§Ãµes / achados relevantes descritos]."
        ],
        assessmentBlocks: [
          "Rastreamento PNAISH 2023:",
          "â€” CÃ¢ncer de prÃ³stata (PSA): [decisÃ£o compartilhada realizada e aceita / recusado / indicaÃ§Ã£o diferida].",
          "â€” CÃ¢ncer colorretal: [PSOF em dia / colonoscopia em dia / pendente].",
          "â€” MetabÃ³lico: [HAS / DM / dislipidemia â€” controlados / em acompanhamento / rastreio indicado].",
          "Tabagismo: [sem risco / em abordagem]. Ãlcool: [sem risco / AUDIT-C positivo â€” abordagem breve realizada]."
        ],
        planBlocks: [
          "Realizo decisÃ£o compartilhada sobre PSA â€” explico benefÃ­cios (detecÃ§Ã£o precoce) e limitaÃ§Ãµes (falso-positivos, sobrediagnÃ³stico, biÃ³psia desnecessÃ¡ria) para o paciente decidir.",
          "Solicito PSOF anual ou oriento colonoscopia a cada 10 anos (50â€“75 anos) para rastreio de cÃ¢ncer colorretal.",
          "Solicito PA, glicemia de jejum e perfil lipÃ­dico se nÃ£o realizados no Ãºltimo ano.",
          "Abordo tabagismo: avalio motivaÃ§Ã£o e ofereÃ§o apoio â€” aconselhamento breve + farmacoterapia (vareniclina ou reposiÃ§Ã£o nicotÃ­nica) se pronto para mudanÃ§a.",
          "Aplico intervenÃ§Ã£o breve de Ã¡lcool se AUDIT-C â‰¥3 â€” modelo das 5As ou FRAMES.",
          "Encaminho para urologia se IPSS >7 ou PSA acima do limiar para a faixa etÃ¡ria.",
          "Solicito sorologias IST (HIV, sÃ­filis, hepatite B e C) se fatores de risco ou ausÃªncia de rastreio recente.",
          "Programo retorno anual ou conforme fatores de risco identificados."
        ]
      },

      exams: {
        panelBase: [
          "PA (aferiÃ§Ã£o na consulta)",
          "Glicemia de jejum",
          "Perfil lipÃ­dico"
        ],
        directed: [
          "PSA: se decisÃ£o compartilhada positiva â€” â‰¥50 anos; â‰¥45 anos se afrodescendente ou histÃ³rico familiar de 1Âº grau.",
          "PSOF (pesquisa de sangue oculto nas fezes): anual, 50â€“75 anos.",
          "Sorologias IST (HIV, sÃ­filis, hepatite B e C): conforme risco.",
          "Colonoscopia: alternativa ao PSOF â€” a cada 10 anos, 50â€“75 anos."
        ],
        monitoring: [
          "PA anual se normal; trimestral se HAS em tratamento.",
          "Glicemia e lipidograma: anual em rastreio; trimestral/semestral se DM ou dislipidemia em tratamento."
        ]
      },

      guidance: [
        "Oriento que consulta preventiva Ã© para todos â€” nÃ£o Ã© preciso esperar sintomas para cuidar da saÃºde.",
        "Oriento que PSA tem limitaÃ§Ãµes importantes â€” decidimos juntos se faz sentido solicitÃ¡-lo.",
        "Oriento que cessar o tabagismo Ã© o ato de maior impacto individual em saÃºde â€” ofereÃ§o apoio se desejar.",
        "Oriento que Ã¡lcool acima de 14 doses/semana aumenta risco de cÃ¢ncer, cirrose e doenÃ§as cardiovasculares.",
        "Oriento que saÃºde sexual faz parte da saÃºde geral â€” disfunÃ§Ã£o erÃ©til pode ser sinal de doenÃ§a cardiovascular."
      ],

      followup: [
        "Retorno anual para consulta preventiva.",
        "Retorno em 3 meses apÃ³s inÃ­cio de abordagem de tabagismo ou Ã¡lcool para avaliar resposta."
      ],

      specialSituations: [
        "PSA >4 ng/mL ou aumento rÃ¡pido de PSA (>0,75 ng/mL/ano): encaminhar urologia para avaliaÃ§Ã£o.",
        "Sangramento retal: investigar â€” colonoscopia prioritÃ¡ria.",
        "DisfunÃ§Ã£o erÃ©til: rastrear HAS, DM, dislipidemia e hipogonadismo como causas orgÃ¢nicas antes de tratar sintomaticamente."
      ]
    },

    governance: {
      status: "ativo",
      version: "1.1.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-22",
      changes: "MigraÃ§Ã£o para padrÃ£o v1.3.1. RemoÃ§Ã£o de checkboxes e campos em branco. planBlocks em primeira pessoa clÃ­nica.",
      sources: [
        {
          label: "MS â€” PNAISH (PolÃ­tica Nacional de AtenÃ§Ã£o Integral Ã  SaÃºde do Homem), 2023",
          url: "https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-do-homem",
          type: "primary",
          year: ""
        }
      ]
    }
  },

  // â”€â”€ PrÃ©-natal v1.3.1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "prenatal",

    metadata: {
      name: "PrÃ©-natal â€” Consulta",
      description: "Consulta de prÃ©-natal de baixo risco na APS â€” roteiro trimestral, exames e vacinaÃ§Ã£o.",
      category: "preventivo",
      tags: ["gestante", "prÃ©-natal", "IG", "trimestre", "exames", "vacina", "preventivo"],
      status: "ativo"
    },

    indications: [
      "Gestante em acompanhamento de prÃ©-natal de baixo risco na APS â€” roteiro por trimestre.",
      "CritÃ©rios de baixo risco: ausÃªncia de PA â‰¥140/90, proteinÃºria, diabetes gestacional, sangramento ativo ou comorbidade grave."
    ],

    dataRequirements: {
      useNow: [
        "Idade gestacional (IG) atual e DUM",
        "PA aferida na consulta",
        "SituaÃ§Ã£o vacinal (dTpa, influenza)",
        "SuplementaÃ§Ã£o em uso (Ã¡cido fÃ³lico, sulfato ferroso)"
      ],
      idealForAdjustment: [
        "Resultados de exames do trimestre anterior",
        "Peso atual e ganho ponderal total",
        "Movimentos fetais (apÃ³s 20 semanas)",
        "Resultados de sorologias e ultrassonografia"
      ]
    },

    ui: {
      subjectivePrompt: "Revisar IG, DUM, DPP, queixas do trimestre, movimentos fetais, vacinas e suplementaÃ§Ã£o.",
      objectivePrompt: "Registrar PA, peso, altura uterina, BCF (apÃ³s 12 semanas) e edema.",
      quickNotes: [
        "PA â‰¥160/110 + cefaleia ou edema sÃºbito: suspeita de prÃ©-eclÃ¢mpsia â€” encaminhar urgÃªncia.",
        "AusÃªncia de movimentos fetais apÃ³s 28 semanas: avaliaÃ§Ã£o fetal urgente.",
        "dTpa: obrigatÃ³ria apÃ³s 20 semanas em cada gestaÃ§Ã£o, independente do estado vacinal prÃ©vio."
      ]
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Gestante com [IG em semanas+dias], DUM [data], DPP [data].",
          "Queixas do perÃ­odo: [nÃ¡useas, azia, dor pÃ©lvica, edema de tornozelos â€” ou assintomÃ¡tica].",
          "Movimentos fetais: [presentes e normais / diminuÃ­dos]. Sangramento: [ausente / presente â€” caracterizar].",
          "Vacinas: dTpa [realizada em X sem / pendente]. Influenza: [realizada / pendente].",
          "SuplementaÃ§Ã£o: Ã¡cido fÃ³lico [em uso / suspenso]. Sulfato ferroso [em uso apÃ³s 20 sem / ainda nÃ£o iniciado]."
        ],
        objectiveOutputBlocks: [
          "Peso: [kg] (ganho total: [kg]). PA: [mmHg]. FC: [bpm].",
          "Altura uterina: [cm] (compatÃ­vel com IG / discordante). BCF: [bpm / nÃ£o ausculta por IG].",
          "Edema: [ausente / presente em: tornozelos, membros inferiores, face]."
        ],
        assessmentBlocks: [
          "PrÃ©-natal de [baixo risco / alto risco â€” encaminhar prÃ©-natal especializado].",
          "IG atual: [semanas+dias]. Desenvolvimento fetal compatÃ­vel com a IG.",
          "Sem sinais de alerta / Sinais de alerta presentes: [descriÃ§Ã£o]."
        ],
        planBlocks: [
          "1Âº trimestre (â‰¤13 semanas): prescrevo Ã¡cido fÃ³lico 400mcg/dia atÃ© a 12Âª semana; solicito exames: Ht/Hb, tipagem ABO/Rh, glicemia de jejum, EAS, sorologias (HIV, sÃ­filis, toxoplasmose IgM/IgG, rubÃ©ola IgG, hepatite B e C), TSH e USG obstÃ©trica de 1Âº trimestre (11â€“14 semanas).",
          "2Âº trimestre (14â€“27 semanas): inicio sulfato ferroso 40mg/dia de Fe elementar apÃ³s a 20Âª semana; solicito TOTG 75g entre 24â€“28 semanas e USG morfolÃ³gica (20â€“24 semanas); aplico dTpa apÃ³s 20 semanas.",
          "3Âº trimestre (28â€“40 semanas): repito sorologias (HIV, sÃ­filis, toxoplasmose); solicito cultura para SGB entre 35â€“37 semanas e USG 34â€“36 semanas.",
          "Oriento sobre sinais de alerta que exigem retorno imediato: PA â‰¥160/110, sangramento ativo, ausÃªncia de movimentos fetais, convulsÃµes, cefaleia intensa + visÃ£o turva + epigastralgia, edema sÃºbito de face e mÃ£os.",
          "Programo retorno conforme calendÃ¡rio: mensal atÃ© 28 semanas, quinzenal de 28â€“36 semanas, semanal de 36â€“40 semanas."
        ]
      },

      exams: {
        panelBase: [
          "Hemoglobina e hematÃ³crito",
          "Tipagem ABO/Rh e Coombs indireto",
          "Glicemia de jejum",
          "EAS (urinÃ¡lise)",
          "Sorologias: HIV, sÃ­filis (VDRL), toxoplasmose (IgM e IgG), rubÃ©ola (IgG), hepatite B (HBsAg) e hepatite C (anti-HCV)",
          "TSH",
          "Ultrassonografia obstÃ©trica (11â€“14 semanas)"
        ],
        directed: [
          "TOTG 75g: 24â€“28 semanas â€” rastreio de diabetes gestacional.",
          "Cultura para Streptococcus do grupo B: 35â€“37 semanas.",
          "USG morfolÃ³gica de 2Âº trimestre: 20â€“24 semanas.",
          "Coombs indireto: repetir mensalmente se Rh negativo."
        ],
        monitoring: [
          "RepetiÃ§Ã£o de sorologias (HIV, sÃ­filis, toxoplasmose) no 3Âº trimestre.",
          "Peso e PA a cada consulta.",
          "Altura uterina e BCF a partir de 12 semanas."
        ]
      },

      guidance: [
        "Oriento realizar as consultas no calendÃ¡rio: mensal atÃ© 28 semanas, quinzenal atÃ© 36, semanal atÃ© o parto.",
        "Oriento tomar o sulfato ferroso com suco de laranja para melhorar absorÃ§Ã£o e evitar cafÃ©, chÃ¡ ou leite prÃ³ximo ao horÃ¡rio.",
        "Oriento contar os movimentos fetais a partir de 28 semanas â€” se perceber reduÃ§Ã£o, buscar atendimento no mesmo dia.",
        "Oriento vacinaÃ§Ã£o: influenza pode ser feita em qualquer trimestre; dTpa apÃ³s 20 semanas â€” protege o bebÃª contra coqueluche.",
        "Oriento buscar urgÃªncia se surgir: sangramento vaginal, PA muito alta, cefaleia intensa, visÃ£o turva, edema sÃºbito de face ou ausÃªncia de movimentos fetais."
      ],

      followup: [
        "Mensal atÃ© 28 semanas; quinzenal de 28â€“36 semanas; semanal de 36â€“40 semanas.",
        "Encaminhar ao prÃ©-natal de alto risco se: PA â‰¥140/90 em duas aferiÃ§Ãµes, diabetes gestacional, sangramento, feto com crescimento restrito ou anomalia detectada."
      ],

      specialSituations: [
        "PrÃ©-eclÃ¢mpsia (PA â‰¥140/90 + proteinÃºria ou sintomas): encaminhar urgÃªncia hospitalar imediatamente.",
        "BacteriÃºria assintomÃ¡tica: tratar com antibiÃ³tico conforme antibiograma â€” sempre.",
        "Toxoplasmose aguda na gestaÃ§Ã£o: encaminhar prÃ©-natal especializado para manejo com espiramicina/sulfadiazina."
      ]
    },

    governance: {
      status: "ativo",
      version: "1.1.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-22",
      changes: "MigraÃ§Ã£o para padrÃ£o v1.3.1. RemoÃ§Ã£o de checkboxes e campos em branco. planBlocks em primeira pessoa clÃ­nica.",
      sources: [
        {
          label: "MS â€” CAB nÂº 32 â€” AtenÃ§Ã£o ao PrÃ©-Natal de Baixo Risco, 2013 (atualizado 2022)",
          url: "https://bvsms.saude.gov.br/bvs/publicacoes/cadernos_atencao_basica_32_prenatal.pdf",
          type: "primary",
          year: ""
        }
      ]
    }
  },

  // â”€â”€ Puericultura v1.3.1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "puericultura",

    metadata: {
      name: "Puericultura â€” Crescimento e Desenvolvimento",
      description: "Consulta de puericultura â€” vigilÃ¢ncia de crescimento, marcos do desenvolvimento e vacinaÃ§Ã£o conforme calendÃ¡rio PNI.",
      category: "preventivo",
      tags: ["crianÃ§a", "puericultura", "crescimento", "desenvolvimento", "vacina", "Caderneta", "preventivo"],
      status: "ativo"
    },

    indications: [
      "CrianÃ§a de 0 a 6 anos â€” vigilÃ¢ncia de crescimento (peso, estatura, perÃ­metro cefÃ¡lico), marcos do desenvolvimento neuropsicomotor e atualizaÃ§Ã£o vacinal conforme CalendÃ¡rio PNI.",
      "Consultas conforme calendÃ¡rio do MS: nascimento, 15 dias, 1, 2, 4, 6, 9, 12, 18 e 24 meses; anual de 3â€“6 anos."
    ],

    dataRequirements: {
      useNow: [
        "Peso e estatura atuais",
        "SituaÃ§Ã£o vacinal (Caderneta da CrianÃ§a)",
        "Tipo de alimentaÃ§Ã£o atual (aleitamento, misto, diversificada)"
      ],
      idealForAdjustment: [
        "PerÃ­metro cefÃ¡lico (obrigatÃ³rio atÃ© 2 anos)",
        "Curvas de crescimento anteriores plotadas na Caderneta",
        "Relato dos responsÃ¡veis sobre marcos do desenvolvimento"
      ]
    },

    ui: {
      subjectivePrompt: "Revisar alimentaÃ§Ã£o, sono, desenvolvimento (visÃ£o, audiÃ§Ã£o, fala, motor), queixas dos responsÃ¡veis e situaÃ§Ã£o vacinal.",
      objectivePrompt: "Registrar peso, estatura, perÃ­metro cefÃ¡lico (atÃ© 2 anos), plotar nas curvas OMS da Caderneta e avaliar marcos do desenvolvimento.",
      quickNotes: [
        "Escore-z P/E < -2: desnutriÃ§Ã£o aguda â€” avaliar causas e intensificar acompanhamento.",
        "DecÃºbito dorsal obrigatÃ³rio para dormir (<1 ano) â€” previne morte sÃºbita.",
        "Telas: nenhuma exposiÃ§Ã£o <2 anos; mÃ¡ximo 1h/dia de 2â€“5 anos."
      ]
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "CrianÃ§a de [idade em meses/anos]. Acompanhante: [responsÃ¡vel]. Queixa dos responsÃ¡veis: [descriÃ§Ã£o ou consulta de rotina].",
          "AlimentaÃ§Ã£o: [AME exclusivo / misto / diversificada adequada / diversificada com pontos de atenÃ§Ã£o]. IntroduÃ§Ã£o alimentar (apÃ³s 6 meses): [adequada / com pendÃªncias: descriÃ§Ã£o].",
          "Sono: [adequado para a faixa etÃ¡ria / alterado]. PosiÃ§Ã£o para dormir (<1 ano): [decÃºbito dorsal / outra â€” orientado].",
          "Desenvolvimento: responsÃ¡veis relatam [sem preocupaÃ§Ãµes / dificuldades com: visÃ£o, audiÃ§Ã£o, fala, motor â€” descriÃ§Ã£o]."
        ],
        objectiveOutputBlocks: [
          "Peso: [kg] â€” escore-z P/I: [valor] | P/E: [valor].",
          "Estatura: [cm] â€” escore-z E/I: [valor]. IMC/I: [escore-z].",
          "PerÃ­metro cefÃ¡lico: [cm] â€” [dentro da normalidade / acima / abaixo do esperado].",
          "Curvas OMS (Caderneta): [crescimento adequado / alerta em: descriÃ§Ã£o].",
          "Marcos do desenvolvimento: [adequados para a faixa etÃ¡ria / atraso em: descriÃ§Ã£o].",
          "VacinaÃ§Ã£o (PNI): [em dia / atrasada em: vacinas]."
        ],
        assessmentBlocks: [
          "Puericultura de [idade]: crescimento [adequado / em alerta â€” escore-z], desenvolvimento neuropsicomotor [adequado / com atraso em: Ã¡rea(s)].",
          "VacinaÃ§Ã£o: [em dia / atrasada â€” pendÃªncias descritas].",
          "AlimentaÃ§Ã£o: [adequada para a faixa etÃ¡ria / com pontos de atenÃ§Ã£o: descriÃ§Ã£o]."
        ],
        planBlocks: [
          "Ploto peso, estatura e perÃ­metro cefÃ¡lico nas curvas OMS da Caderneta da CrianÃ§a e registro os escores-z.",
          "Atualizo vacinaÃ§Ã£o conforme calendÃ¡rio PNI â€” administro as vacinas atrasadas e oriento sobre prÃ³ximas doses.",
          "Prescrevo ferro profilÃ¡tico: 1mg/kg/dia de ferro elementar de 6 a 24 meses de vida.",
          "Oriento alimentaÃ§Ã£o adequada para a faixa etÃ¡ria: AME atÃ© 6 meses; introduÃ§Ã£o alimentar sem sal, aÃ§Ãºcar ou mel (<1 ano); alimentaÃ§Ã£o diversificada e participativa apÃ³s 6 meses.",
          "Oriento estimulaÃ§Ã£o do desenvolvimento: conversar, ler em voz alta, brincar e explorar o ambiente de forma segura.",
          "Encaminho para avaliaÃ§Ã£o especializada se: atraso em â‰¥2 marcos do desenvolvimento, suspeita de dÃ©ficit visual ou auditivo, crescimento inadequado persistente.",
          "Programo retorno conforme calendÃ¡rio do MS ou em 30 dias se houver alerta nutricional ou de desenvolvimento."
        ]
      },

      exams: {
        panelBase: [],
        directed: [
          "Triagem neonatal (pezinho, olhinho, orelhinha, coraÃ§Ã£ozinho): confirmar que foram realizadas nos primeiros dias de vida.",
          "Hemoglobina: considerar rastreio de anemia entre 6â€“12 meses em Ã¡reas de risco.",
          "Vitamina D: suplementar 400 UI/dia nos primeiros 12 meses conforme protocolo local."
        ],
        monitoring: [
          "Peso e estatura a cada consulta â€” plotar nas curvas OMS.",
          "PerÃ­metro cefÃ¡lico: obrigatÃ³rio atÃ© 2 anos."
        ]
      },

      guidance: [
        "Oriento sobre a importÃ¢ncia do aleitamento materno exclusivo atÃ© 6 meses â€” protege contra infecÃ§Ãµes, alergias e promove vÃ­nculo.",
        "Oriento introduÃ§Ã£o alimentar: a partir dos 6 meses, oferecer alimentos da famÃ­lia sem sal, aÃ§Ãºcar ou mel; sem ultraprocessados.",
        "Oriento que a crianÃ§a deve dormir de costas (<1 ano) â€” posiÃ§Ã£o que previne morte sÃºbita do lactente.",
        "Oriento sobre telas: nenhuma exposiÃ§Ã£o antes dos 2 anos; mÃ¡ximo 1 hora/dia de 2 a 5 anos, sempre com supervisÃ£o.",
        "Oriento trazer a Caderneta da CrianÃ§a em todas as consultas â€” ela Ã© o documento de saÃºde da crianÃ§a.",
        "Oriento buscar atendimento se: febre em crianÃ§a <3 meses, recusa alimentar persistente, choro inconsolÃ¡vel ou marcos de desenvolvimento atrasados."
      ],

      followup: [
        "CalendÃ¡rio MS: nascimento, 15 dias, 1, 2, 4, 6, 9, 12, 18 e 24 meses; anual dos 3â€“6 anos.",
        "Retorno antecipado se: alerta de crescimento, atraso em marco do desenvolvimento ou vacina em atraso."
      ],

      specialSituations: [
        "Crescimento inadequado (escore-z P/E < -2): investigar causas orgÃ¢nicas, sociais e alimentares antes de encaminhar.",
        "Atraso em â‰¥2 marcos do desenvolvimento: encaminhar para neuropediatria ou equipe NASF multidisciplinar.",
        "CrianÃ§a sem acesso Ã  Caderneta: solicitar segunda via e reconstituir histÃ³rico vacinal com o responsÃ¡vel."
      ]
    },

    governance: {
      status: "ativo",
      version: "1.1.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-22",
      changes: "MigraÃ§Ã£o para padrÃ£o v1.3.1. RemoÃ§Ã£o de checkboxes e campos em branco. planBlocks em primeira pessoa clÃ­nica.",
      sources: [
        {
          label: "MS â€” CAB nÂº 33 â€” SaÃºde da CrianÃ§a: Crescimento e Desenvolvimento, 2012",
          url: "https://bvsms.saude.gov.br/bvs/publicacoes/saude_crianca_crescimento_desenvolvimento.pdf",
          type: "primary",
          year: ""
        },
        {
          label: "MS â€” Caderneta da CrianÃ§a, 2023",
          url: "https://www.gov.br/saude/pt-br/assuntos/saude-da-crianca/caderneta",
          type: "secondary",
          year: ""
        }
      ]
    }
  },
];
