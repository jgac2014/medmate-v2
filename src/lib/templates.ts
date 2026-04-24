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
      name: "HAS â€” Retorno",
      description: "Retorno ambulatorial de paciente com hipertensÃ£o arterial sistÃªmica em seguimento na APS.",
      category: "cronico",
      tags: ["HAS", "hipertensÃ£o", "anti-hipertensivo", "adesÃ£o", "retorno"],
      status: "ativo"
    },

    indications: [
      "Paciente com hipertensÃ£o arterial sistÃªmica jÃ¡ diagnosticada, em seguimento ambulatorial na APS.",
      "Consulta de retorno para reavaliaÃ§Ã£o do controle pressÃ³rico, adesÃ£o, efeitos adversos, risco cardiovascular e necessidade de ajuste terapÃªutico."
    ],

    dataRequirements: {
      useNow: [
        "PA atual aferida corretamente",
        "Medicamentos em uso",
        "AdesÃ£o ao tratamento",
        "Efeitos adversos ou sintomas de hipotensÃ£o",
        "Contexto clÃ­nico da consulta atual"
      ],
      idealForAdjustment: [
        "Registros domiciliares de PA ou MRPA/MAPA, se disponÃ­veis",
        "Resultados de exames laboratoriais recentes",
        "Comorbidades e lesÃµes de Ã³rgÃ£o-alvo",
        "EstratificaÃ§Ã£o de risco cardiovascular"
      ]
    },

    ui: {
      subjectivePrompt: "Revisar PA atual, adesÃ£o ao tratamento, efeitos adversos, medidas domiciliares/MRPA e evoluÃ§Ã£o desde a Ãºltima consulta.",
      objectivePrompt: "Registrar PA, FC, peso e outros achados relevantes do exame fÃ­sico.",
      quickNotes: [
        "Comparar com aferiÃ§Ãµes anteriores, quando disponÃ­veis.",
        "Revisar fatores que pioram controle pressÃ³rico, como AINEs, Ã¡lcool e baixa adesÃ£o.",
        "Considerar MRPA/MAPA quando houver discrepÃ¢ncia entre consultÃ³rio e domicÃ­lio ou suspeita de avental branco/hipertensÃ£o mascarada."
      ]
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente em seguimento por hipertensÃ£o arterial sistÃªmica, em uso de [medicaÃ§Ã£o(Ãµes)].",
          "Refere [boa adesÃ£o / dificuldade com adesÃ£o]. [Sem efeitos adversos referidos / Refere ...].",
          "PA domiciliar: [nÃ£o monitorada / registros disponÃ­veis â€” valores entre ___ mmHg]. [AssintomÃ¡tico(a) / Refere ...]."
        ],
        objectiveOutputBlocks: [
          "PA e sinais vitais registrados conforme consulta."
        ],
        assessmentBlocks: [
          "HipertensÃ£o arterial sistÃªmica em seguimento na APS.",
          "Controle pressÃ³rico reavaliado com base na aferiÃ§Ã£o atual e, quando disponÃ­veis, em medidas fora do consultÃ³rio.",
          "Meta terapÃªutica individualizada; em consultÃ³rio, geralmente <140/90 mmHg e, se o tratamento for bem tolerado, considerar 130/80 mmHg em pessoas com menos de 65 anos, especialmente com comorbidades.",
          "Reavaliar necessidade de intensificaÃ§Ã£o terapÃªutica apÃ³s reforÃ§o de adesÃ£o, tÃ©cnica de aferiÃ§Ã£o e medidas nÃ£o farmacolÃ³gicas."
        ],
        planBlocks: [
          "Mantenho ou ajusto o esquema anti-hipertensivo conforme avaliaÃ§Ã£o clÃ­nica, tolerÃ¢ncia e controle pressÃ³rico.",
          "Oriento medidas nÃ£o farmacolÃ³gicas, com reduÃ§Ã£o de sal e ultraprocessados, controle de peso, atividade fÃ­sica regular e moderaÃ§Ã£o de Ã¡lcool.",
          "ReforÃ§o adesÃ£o ao tratamento e tÃ©cnica correta de medida da pressÃ£o arterial.",
          "Verifico RCV calculado automaticamente (Framingham â€” painel de cÃ¡lculos clÃ­nicos) e integro o resultado Ã  meta terapÃªutica e Ã  intensidade do seguimento.",
          "Solicito ou atualizo exames laboratoriais e complementares conforme protocolo, comorbidades, medicaÃ§Ãµes em uso e suspeita de lesÃ£o de Ã³rgÃ£o-alvo.",
          "Programo retorno em 1 mÃªs apÃ³s inÃ­cio ou mudanÃ§a do tratamento, atÃ© atingir a meta pressÃ³rica; apÃ³s estabilizaÃ§Ã£o, mantenho acompanhamento periÃ³dico."
        ]
      },

      exams: {
        panelBase: [
          "Creatinina com TFGe",
          "PotÃ¡ssio",
          "Glicemia de jejum ou HbA1c",
          "Perfil lipÃ­dico",
          "UrinÃ¡lise/EAS",
          "Eletrocardiograma"
        ],
        directed: [
          "SÃ³dio sÃ©rico se uso de diurÃ©tico tiazÃ­dico.",
          "MRPA ou MAPA se suspeita de efeito do avental branco, hipertensÃ£o mascarada, discordÃ¢ncia entre PA de consultÃ³rio e domiciliar ou sintomas de hipotensÃ£o.",
          "RelaÃ§Ã£o albumina-creatinina urinÃ¡ria se diabetes, doenÃ§a renal ou suspeita de lesÃ£o renal.",
          "Ecocardiograma ou outros exames complementares se suspeita de lesÃ£o de Ã³rgÃ£o-alvo, HAS secundÃ¡ria ou comorbidades que justifiquem investigaÃ§Ã£o."
        ],
        monitoring: [
          "Exames laboratoriais periÃ³dicos conforme protocolo e contexto clÃ­nico.",
          "Eletrocardiograma conforme indicaÃ§Ã£o clÃ­nica."
        ]
      },

      guidance: [
        "Oriento nÃ£o interromper a medicaÃ§Ã£o anti-hipertensiva por conta prÃ³pria.",
        "Oriento levar registro de pressÃ£o arterial domiciliar quando disponÃ­vel.",
        "Oriento reduzir consumo de sal e alimentos ultraprocessados.",
        "Oriento manter atividade fÃ­sica regular, adaptada Ã  condiÃ§Ã£o clÃ­nica.",
        "Oriento procurar atendimento imediato se pressÃ£o arterial muito elevada ou sintomas de alarme."
      ],

      followup: [
        "Reavalio em 1 mÃªs apÃ³s inÃ­cio ou mudanÃ§a do tratamento, atÃ© atingir a meta pressÃ³rica.",
        "ApÃ³s controle estÃ¡vel, acompanho de 2 a 4 vezes no primeiro ano, idealmente a cada 3 a 6 meses.",
        "Com controle sustentado, mantenho seguimento periÃ³dico, em geral semestral, conforme risco cardiovascular e comorbidades."
      ],

      specialSituations: [
        "PAS â‰¥180 mmHg e PAD â‰¥120 mmHg persistente, especialmente se associadas a sintomas ou suspeita de lesÃ£o aguda de Ã³rgÃ£o-alvo.",
        "Dor torÃ¡cica, dispneia, dÃ©ficit neurolÃ³gico focal, alteraÃ§Ã£o visual importante, rebaixamento do sensÃ³rio ou oligÃºria.",
        "GestaÃ§Ã£o ou suspeita de gestaÃ§Ã£o â€” requer manejo especÃ­fico conforme protocolo vigente.",
        "Suspeita de hipertensÃ£o secundÃ¡ria ou resistÃªncia anti-hipertensiva."
      ],

      longitudinalFocus: [
        "Comparar PA atual com aferiÃ§Ãµes anteriores e com a meta terapÃªutica individualizada.",
        "Revisar evoluÃ§Ã£o do risco cardiovascular desde a Ãºltima consulta.",
        "Verificar adesÃ£o, barreiras ao tratamento e possÃ­veis interaÃ§Ãµes medicamentosas.",
        "Registrar se houve necessidade de ajuste terapÃªutico e resposta clÃ­nica obtida.",
        "Revisar comorbidades associadas e seu impacto no manejo da hipertensÃ£o."
      ]
    },

    apply: {
      problems: [
        { key: "has", label: "HipertensÃ£o arterial sistÃªmica" }
      ]
    },

    governance: {
      status: "ativo",
      version: "1.1.1",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-21",
      changes: "MigraÃ§Ã£o do legado para o padrÃ£o v1.3.1. RemoÃ§Ã£o de SOAP com placeholders e checkboxes. EstruturaÃ§Ã£o de exams em panelBase, directed e monitoring. ConversÃ£o de guidance e followup em arrays. InclusÃ£o de ui, longitudinalFocus e apply.problems. RevisÃ£o clÃ­nica do assessment, plano e situaÃ§Ãµes especiais para APS/MFC. CorreÃ§Ã£o de governanÃ§a com URLs reais distintas.",
      sources: [
        {
          label: "CONITEC â€” PCDT de HipertensÃ£o Arterial SistÃªmica",
          url: "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-hipertensao-arterial-sistemica.pdf/view",
          type: "primary",
          year: "2025"
        },
        {
          label: "Linha de Cuidado â€” HipertensÃ£o Arterial SistÃªmica (HAS) no Adulto",
          url: "https://linhasdecuidado.saude.gov.br/portal/hipertensao-arterial-sistemica-%28HAS%29-no-adulto/",
          type: "secondary",
          year: "2020"
        },
        {
          label: "Caderno de AtenÃ§Ã£o BÃ¡sica nÂº 37 â€” HipertensÃ£o Arterial SistÃªmica",
          url: "https://bvsms.saude.gov.br/bvs/publicacoes/hipertensao_arterial_sistemica_cab37.pdf",
          type: "secondary",
          year: "2010"
        }
      ]
    }
  },

  // â”€â”€ HAS â€” InÃ­cio v1.3.1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "has_inicial",

    metadata: {
      name: "HAS â€” Inicial",
      description: "AvaliaÃ§Ã£o inicial de pressÃ£o arterial elevada ou suspeita de hipertensÃ£o arterial sistÃªmica na APS.",
      category: "cronico",
      tags: ["HAS", "hipertensÃ£o", "diagnÃ³stico", "MRPA", "MAPA", "risco cardiovascular"],
      status: "ativo"
    },

    indications: [
      "Adulto com pressÃ£o arterial elevada no consultÃ³rio ou fora dele, sem diagnÃ³stico previamente confirmado de hipertensÃ£o arterial sistÃªmica.",
      "Consulta inicial para confirmaÃ§Ã£o diagnÃ³stica, estratificaÃ§Ã£o de risco cardiovascular e definiÃ§Ã£o de seguimento ou conduta terapÃªutica inicial."
    ],

    dataRequirements: {
      useNow: [
        "PA aferida corretamente em pelo menos 2 medidas na consulta",
        "AferiÃ§Ãµes prÃ©vias ou medidas fora do consultÃ³rio, se disponÃ­veis",
        "Contexto clÃ­nico atual",
        "Medicamentos e substÃ¢ncias que possam elevar PA",
        "Sintomas de alarme"
      ],
      idealForAdjustment: [
        "MRPA ou MAPA, quando indicados",
        "EstratificaÃ§Ã£o de risco cardiovascular",
        "Comorbidades e lesÃ£o de Ã³rgÃ£o-alvo",
        "Exames laboratoriais iniciais"
      ]
    },

    ui: {
      subjectivePrompt: "Revisar nÃ­veis pressÃ³ricos disponÃ­veis, comorbidades, risco cardiovascular, substÃ¢ncias/medicaÃ§Ãµes que elevam PA e sintomas de alarme.",
      objectivePrompt: "Registrar PA com tÃ©cnica adequada, nÃºmero de medidas, sinais vitais e achados relevantes do exame fÃ­sico.",
      quickNotes: [
        "Confirmar diagnÃ³stico com medidas seriadas e, quando indicado, MAPA ou, se indisponÃ­vel, MRPA.",
        "Revisar possibilidade de avental branco, hipertensÃ£o mascarada e causas secundÃ¡rias.",
        "Diferenciar situaÃ§Ã£o ambulatorial de urgÃªncia/emergÃªncia hipertensiva."
      ]
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente em avaliaÃ§Ã£o inicial por pressÃ£o arterial elevada / suspeita de hipertensÃ£o arterial sistÃªmica.",
          "Refere [histÃ³rico de medidas elevadas desde ___ / primeira aferiÃ§Ã£o elevada na consulta atual]. [AssintomÃ¡tico(a) / Refere ...].",
          "Em uso de [nenhum medicamento anti-hipertensivo / ...]. [Sem fatores de risco identificados / Refere tabagismo, dislipidemia, ...]."
        ],
        objectiveOutputBlocks: [
          "PressÃ£o arterial aferida corretamente em medidas seriadas na consulta, com registro de sinais vitais e demais achados relevantes conforme contexto clÃ­nico."
        ],
        assessmentBlocks: [
          "PressÃ£o arterial elevada / suspeita de hipertensÃ£o arterial sistÃªmica em avaliaÃ§Ã£o diagnÃ³stica na APS.",
          "A definiÃ§Ã£o diagnÃ³stica deve considerar medidas repetidas e, quando indicado, confirmaÃ§Ã£o fora do consultÃ³rio com MAPA ou, se indisponÃ­vel, MRPA.",
          "A decisÃ£o terapÃªutica inicial deve considerar nÃ­vel pressÃ³rico, RCV calculado (Framingham â€” painel de cÃ¡lculos clÃ­nicos), lesÃ£o de Ã³rgÃ£o-alvo, comorbidades e possibilidade de hipertensÃ£o secundÃ¡ria.",
          "Na HAS confirmada, a meta terapÃªutica em consultÃ³rio Ã© geralmente <140/90 mmHg; se o tratamento for bem tolerado, pode-se considerar 130/80 mmHg em pessoas com menos de 65 anos, especialmente com comorbidades."
        ],
        planBlocks: [
          "Confirmo o diagnÃ³stico com medidas seriadas e, quando indicado, MAPA ou, se indisponÃ­vel, MRPA.",
          "Oriento medidas nÃ£o farmacolÃ³gicas para todos, com reduÃ§Ã£o de sal e ultraprocessados, controle de peso, atividade fÃ­sica regular, moderaÃ§Ã£o de Ã¡lcool e cessaÃ§Ã£o do tabagismo.",
          "Considero tratamento medicamentoso conforme nÃ­vel pressÃ³rico, RCV calculado (painel de cÃ¡lculos clÃ­nicos), presenÃ§a de lesÃ£o de Ã³rgÃ£o-alvo e comorbidades.",
          "Solicito exames iniciais para estratificaÃ§Ã£o de risco e investigaÃ§Ã£o de repercussÃµes ou causas secundÃ¡rias quando indicado.",
          "Programo reavaliaÃ§Ã£o conforme nÃ­vel pressÃ³rico, risco cardiovascular e necessidade de confirmaÃ§Ã£o diagnÃ³stica."
        ]
      },

      exams: {
        panelBase: [
          "Creatinina com TFGe",
          "PotÃ¡ssio",
          "SÃ³dio",
          "Ãcido Ãºrico",
          "AlbuminÃºria ou relaÃ§Ã£o albumina-creatinina",
          "Glicemia de jejum",
          "Perfil lipÃ­dico",
          "UrinÃ¡lise/EAS",
          "Eletrocardiograma"
        ],
        directed: [
          "MAPA ou, se indisponÃ­vel, MRPA, para confirmaÃ§Ã£o diagnÃ³stica quando indicado.",
          "TSH/T4 livre, relaÃ§Ã£o aldosterona-renina, ecocardiograma, Doppler de artÃ©rias renais ou outros exames conforme suspeita de hipertensÃ£o secundÃ¡ria, lesÃ£o de Ã³rgÃ£o-alvo ou comorbidades."
        ],
        monitoring: [
          "Repetir avaliaÃ§Ã£o pressÃ³rica e exames conforme confirmaÃ§Ã£o diagnÃ³stica, risco cardiovascular e conduta instituÃ­da."
        ]
      },

      guidance: [
        "Oriento que o diagnÃ³stico de hipertensÃ£o arterial sistÃªmica deve ser confirmado com medidas seriadas e, quando indicado, MAPA ou, se indisponÃ­vel, MRPA.",
        "Oriento tÃ©cnica correta de medida da pressÃ£o arterial.",
        "Oriento reduÃ§Ã£o de sal e ultraprocessados, controle de peso, atividade fÃ­sica regular, moderaÃ§Ã£o de Ã¡lcool e cessaÃ§Ã£o do tabagismo."
      ],

      followup: [
        "Reavalio em 1 mÃªs se iniciar tratamento medicamentoso ou se houver necessidade de confirmaÃ§Ã£o diagnÃ³stica em curto prazo.",
        "Se pressÃ£o arterial normal-alta ou HAS grau 1 com baixo risco sem tratamento medicamentoso inicial, reavalio pressÃ£o arterial e risco cardiovascular em 3 a 6 meses.",
        "ApÃ³s confirmaÃ§Ã£o diagnÃ³stica e estabilizaÃ§Ã£o, programo seguimento periÃ³dico conforme controle pressÃ³rico e risco cardiovascular."
      ],

      specialSituations: [
        "PAS â‰¥180 mmHg ou PAD â‰¥120 mmHg persistente, especialmente se associadas a sintomas ou suspeita de lesÃ£o aguda de Ã³rgÃ£o-alvo.",
        "Dor torÃ¡cica, dispneia, dÃ©ficit neurolÃ³gico focal, alteraÃ§Ã£o visual importante, rebaixamento do sensÃ³rio ou edema agudo de pulmÃ£o.",
        "GestaÃ§Ã£o ou suspeita de gestaÃ§Ã£o â€” requer manejo especÃ­fico conforme protocolo vigente.",
        "Suspeita de hipertensÃ£o secundÃ¡ria."
      ],

      longitudinalFocus: [
        "Comparar medidas pressÃ³ricas atuais com aferiÃ§Ãµes anteriores e com resultados de MRPA/MAPA, quando disponÃ­veis.",
        "Revisar evoluÃ§Ã£o do risco cardiovascular desde a avaliaÃ§Ã£o inicial.",
        "Registrar confirmaÃ§Ã£o diagnÃ³stica, inÃ­cio ou nÃ£o de tratamento medicamentoso e resposta Ã s medidas nÃ£o farmacolÃ³gicas.",
        "Reavaliar comorbidades, lesÃ£o de Ã³rgÃ£o-alvo e necessidade de investigaÃ§Ã£o complementar."
      ]
    },

    apply: {
      problems: [
        { key: "suspeita_has", label: "Suspeita de HAS / PA elevada em avaliaÃ§Ã£o" }
      ]
    },

    governance: {
      status: "ativo",
      version: "1.1.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-21",
      changes: "MigraÃ§Ã£o do legado para o padrÃ£o v1.3.1. RemoÃ§Ã£o de SOAP com placeholders e checkboxes. EstruturaÃ§Ã£o de exams em panelBase, directed e monitoring. ConversÃ£o de guidance e followup em arrays. InclusÃ£o de metadata, ui, longitudinalFocus e apply.problems com foco em suspeita diagnÃ³stica, sem marcar HAS confirmada automaticamente. RevisÃ£o clÃ­nica para APS/MFC. CorreÃ§Ã£o de governanÃ§a com URLs reais distintas.",
      sources: [
        {
          label: "CONITEC â€” PCDT de HipertensÃ£o Arterial SistÃªmica",
          url: "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-hipertensao-arterial-sistemica.pdf/view",
          type: "primary",
          year: "2025"
        },
        {
          label: "Linha de Cuidado â€” HipertensÃ£o Arterial SistÃªmica (HAS) no Adulto",
          url: "https://linhasdecuidado.saude.gov.br/portal/hipertensao-arterial-sistemica-%28HAS%29-no-adulto/",
          type: "secondary",
          year: "2020"
        },
        {
          label: "Caderno de AtenÃ§Ã£o BÃ¡sica nÂº 37 â€” HipertensÃ£o Arterial SistÃªmica",
          url: "https://bvsms.saude.gov.br/bvs/publicacoes/hipertensao_arterial_sistemica_cab37.pdf",
          type: "secondary",
          year: "2014"
        }
      ]
    }
  },

  // â”€â”€ DM2 â€” Retorno v1.3.1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "dm2_retorno",

    metadata: {
      name: "DM2 â€” Retorno",
      description: "Retorno ambulatorial de pessoa com diabete melito tipo 2 em seguimento na APS.",
      category: "cronico",
      tags: ["DM2", "diabetes", "HbA1c", "hipoglicemia", "pÃ© diabÃ©tico", "retorno"],
      status: "ativo",
    },

    indications: [
      "Pessoa adulta com DM2 jÃ¡ diagnosticado, em seguimento ambulatorial na APS.",
      "Consulta de retorno para reavaliaÃ§Ã£o do controle glicÃªmico, adesÃ£o, hipoglicemia, esquema terapÃªutico e rastreio de complicaÃ§Ãµes crÃ´nicas.",
    ],

    dataRequirements: {
      useNow: [
        "Medicamentos em uso, incluindo insulina",
        "AdesÃ£o e relato de hipoglicemias",
        "Contexto clÃ­nico da consulta atual",
      ],
      idealForAdjustment: [
        "HbA1c recente",
        "Registros de glicemia capilar ou automonitorizaÃ§Ã£o",
        "FunÃ§Ã£o renal e albuminÃºria",
        "HistÃ³rico de complicaÃ§Ãµes e rastreios anteriores",
      ],
    },

    ui: {
      subjectivePrompt: "Revisar sintomas de hiperglicemia, hipoglicemias, adesÃ£o ao tratamento, medicaÃ§Ãµes em uso e intercorrÃªncias desde a Ãºltima consulta.",
      objectivePrompt: "Registrar peso, PA, FC e resultado do exame dos pÃ©s.",
      quickNotes: [
        "Comparar HbA1c atual com resultado anterior.",
        "Reavaliar risco de hipoglicemia antes de intensificar metas.",
        "Verificar tÃ©cnica de aplicaÃ§Ã£o de insulina quando pertinente.",
      ],
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente em seguimento por diabete melito tipo 2.",
          "Na consulta, reavaliados controle glicÃªmico, ocorrÃªncia e frequÃªncia de hipoglicemias, adesÃ£o ao tratamento e uso correto das medicaÃ§Ãµes.",
          "Revisados resultados de glicemias capilares disponÃ­veis, sintomas de hiperglicemia e intercorrÃªncias desde a Ãºltima consulta.",
        ],
        objectiveOutputBlocks: [
          "Peso e sinais vitais registrados conforme consulta.",
          "Exame dos pÃ©s realizado conforme avaliaÃ§Ã£o de risco atual.",
        ],
        assessmentBlocks: [
          "Diabete melito tipo 2 em seguimento na APS.",
          "Controle glicÃªmico reavaliado com base em HbA1c, glicemias capilares e avaliaÃ§Ã£o clÃ­nica.",
          "Meta de HbA1c individualizada conforme faixa etÃ¡ria, comorbidades e risco de hipoglicemia: geralmente <7,0% no adulto geral, <7,5% no idoso funcional, <8,0% no idoso com limitaÃ§Ãµes importantes.",
          "Risco de hipoglicemia e seguranÃ§a terapÃªutica reavaliados na consulta.",
        ],
        planBlocks: [
          "Mantenho ou ajusto o esquema antidiabÃ©tico conforme controle glicÃªmico, risco de hipoglicemia, tolerÃ¢ncia e comorbidades.",
          "Oriento alimentaÃ§Ã£o adequada, atividade fÃ­sica regular e uso correto das medicaÃ§Ãµes, incluindo tÃ©cnica de aplicaÃ§Ã£o de insulina quando pertinente.",
          "Oriento inspeÃ§Ã£o diÃ¡ria dos pÃ©s e retorno imediato se houver lesÃ£o, infecÃ§Ã£o, piora visual, vÃ´mitos ou glicemias muito elevadas com sintomas.",
          "Solicito hemoglobina glicada e exames de rotina conforme protocolo e controle clÃ­nico.",
          "Solicito rastreio de nefropatia, retinopatia e pÃ© diabÃ©tico ao menos anualmente.",
          "Programo retorno em 3 a 6 meses se estÃ¡vel, ou antes apÃ³s ajuste terapÃªutico ou descontrole.",
        ],
      },

      exams: {
        panelBase: [
          "Hemoglobina glicada",
          "Glicemia de jejum",
          "Creatinina com TFGe",
          "AlbuminÃºria ou relaÃ§Ã£o albumina-creatinina",
          "Perfil lipÃ­dico",
        ],
        directed: [
          "Fundoscopia para rastreio de retinopatia diabÃ©tica, anualmente.",
          "AvaliaÃ§Ã£o do pÃ© diabÃ©tico e neuropatia, anualmente, com maior frequÃªncia conforme estratificaÃ§Ã£o de risco.",
          "UrinÃ¡lise/EAS, urocultura ou outros exames conforme sintomas, suspeita de infecÃ§Ã£o ou descompensaÃ§Ã£o clÃ­nica.",
        ],
        monitoring: [
          "Hemoglobina glicada a cada 6 meses, podendo antecipar conforme controle.",
          "Rastreio de nefropatia, retinopatia e pÃ© diabÃ©tico ao menos anualmente.",
        ],
      },

      guidance: [
        "Oriento manter alimentaÃ§Ã£o adequada, atividade fÃ­sica regular e uso correto das medicaÃ§Ãµes.",
        "Oriento que a frequÃªncia da automonitorizaÃ§Ã£o glicÃªmica deve ser individualizada.",
        "Oriento nÃ£o pular refeiÃ§Ãµes quando houver risco de hipoglicemia.",
        "Oriento inspeÃ§Ã£o diÃ¡ria dos pÃ©s e retorno imediato se houver lesÃ£o ou sinais de infecÃ§Ã£o.",
      ],

      followup: [
        "Reavalio peso e pressÃ£o arterial em cada consulta.",
        "Programo retorno em 3 a 6 meses se estÃ¡vel, ou antes apÃ³s ajuste terapÃªutico ou descontrole.",
      ],

      specialSituations: [
        "Cetoacidose diabÃ©tica, sÃ­ndrome hiperosmolar hiperglicÃªmica, hipoglicemia grave ou descompensaÃ§Ã£o aguda com rebaixamento do sensÃ³rio.",
        "Glicemia muito elevada com sintomas, desidrataÃ§Ã£o, vÃ´mitos persistentes ou sonolÃªncia.",
        "InfecÃ§Ã£o importante no pÃ©, sinais de isquemia ou lesÃ£o com dÃ©ficit neurolÃ³gico.",
      ],

      longitudinalFocus: [
        "Comparar HbA1c atual com resultados anteriores e com a meta terapÃªutica individualizada.",
        "Revisar evoluÃ§Ã£o do controle glicÃªmico, adesÃ£o e intercorrÃªncias desde a Ãºltima consulta.",
        "Verificar resposta ao esquema terapÃªutico atual e necessidade de ajuste.",
        "Revisar atualizaÃ§Ã£o do rastreio de complicaÃ§Ãµes e situaÃ§Ã£o vacinal.",
      ],
    },

    apply: {
      problems: [{ key: "dm2", label: "Diabete melito tipo 2" }],
    },

    governance: {
      status: "ativo",
      version: "1.1.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-22",
      changes: "MigraÃ§Ã£o para v1.3.1. RemoÃ§Ã£o de SOAP com checkboxes e placeholders. ConversÃ£o de exams para objeto estruturado. InclusÃ£o de ui, longitudinalFocus e apply.problems. RevisÃ£o clÃ­nica para APS/MFC.",
      sources: [
        {
          label: "MS/Conitec â€” PCDT de Diabete Melito Tipo 2",
          url: "https://www.gov.br/saude/pt-br/assuntos/pcdt/d/diabete-melito-tipo-2.pdf/view",
          type: "primary",
          year: "2026",
        },
        {
          label: "Caderno de AtenÃ§Ã£o BÃ¡sica nÂº 36 â€” Diabetes Mellitus",
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
      name: "DM2 â€” InÃ­cio",
      description: "AvaliaÃ§Ã£o inicial de suspeita ou diagnÃ³stico recente de diabete melito tipo 2 na APS.",
      category: "cronico",
      tags: ["DM2", "diabetes", "diagnÃ³stico", "HbA1c", "tratamento inicial"],
      status: "ativo",
    },

    indications: [
      "Adulto com suspeita ou diagnÃ³stico recente de DM2, em avaliaÃ§Ã£o inicial na APS.",
      "Consulta para confirmaÃ§Ã£o diagnÃ³stica, estratificaÃ§Ã£o clÃ­nica, rastreio de complicaÃ§Ãµes e inÃ­cio do plano terapÃªutico.",
    ],

    dataRequirements: {
      useNow: [
        "HbA1c e/ou glicemias que motivaram a consulta",
        "Sintomas de hiperglicemia e contexto clÃ­nico atual",
        "Medicamentos em uso e comorbidades",
      ],
      idealForAdjustment: [
        "EstratificaÃ§Ã£o de risco cardiovascular",
        "Exames basais para investigaÃ§Ã£o de complicaÃ§Ãµes",
        "ConfirmaÃ§Ã£o do critÃ©rio diagnÃ³stico laboratorial",
      ],
    },

    ui: {
      subjectivePrompt: "Revisar sintomas de hiperglicemia, histÃ³ria familiar, comorbidades, risco cardiovascular e sinais de alerta para outro tipo de diabetes.",
      objectivePrompt: "Registrar peso, PA, IMC e resultado do exame dos pÃ©s.",
      quickNotes: [
        "Confirmar critÃ©rio diagnÃ³stico: HbA1c â‰¥6,5%, glicemia de jejum â‰¥126 mg/dL, TTGO 2h â‰¥200 mg/dL ou glicemia aleatÃ³ria â‰¥200 mg/dL com sintomas.",
        "Suspeita de DM1/LADA (adulto jovem, magro, sintomas agudos) exige conduÃ§Ã£o diferenciada.",
      ],
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente em avaliaÃ§Ã£o inicial por suspeita ou diagnÃ³stico recente de diabete melito tipo 2.",
          "Na consulta, revisados sintomas de hiperglicemia, histÃ³ria familiar, comorbidades e fatores de risco cardiovascular.",
          "Avaliada presenÃ§a de sinais de alerta para diagnÃ³stico diferencial com outros tipos de diabetes.",
        ],
        objectiveOutputBlocks: [
          "Peso, IMC e sinais vitais registrados conforme consulta.",
          "Exame dos pÃ©s realizado na avaliaÃ§Ã£o inicial.",
        ],
        assessmentBlocks: [
          "Diabete melito tipo 2 em avaliaÃ§Ã£o diagnÃ³stica ou recÃ©m-confirmado na APS.",
          "CritÃ©rio laboratorial definido conforme exames disponÃ­veis.",
          "Risco cardiovascular e presenÃ§a de complicaÃ§Ãµes iniciais avaliados na consulta.",
        ],
        planBlocks: [
          "Confirmo o diagnÃ³stico com base no critÃ©rio laboratorial disponÃ­vel e, quando necessÃ¡rio, solicito exame complementar para esclarecimento.",
          "Oriento alimentaÃ§Ã£o adequada, atividade fÃ­sica regular, controle de peso quando indicado e carÃ¡ter crÃ´nico do DM2.",
          "Inicio metformina quando nÃ£o houver contraindicaÃ§Ã£o; considero terapia combinada se HbA1c >7,5% ao diagnÃ³stico.",
          "Solicito avaliaÃ§Ã£o basal de complicaÃ§Ãµes: nefropatia, retinopatia, pÃ© diabÃ©tico e perfil lipÃ­dico.",
          "Oriento automonitorizaÃ§Ã£o glicÃªmica quando indicada, com frequÃªncia individualizada.",
          "Reavalio resposta clÃ­nica e laboratorial apÃ³s inÃ­cio do tratamento.",
        ],
      },

      exams: {
        panelBase: [
          "Hemoglobina glicada",
          "Glicemia de jejum",
          "Creatinina com TFGe",
          "AlbuminÃºria ou relaÃ§Ã£o albumina-creatinina",
          "Perfil lipÃ­dico",
        ],
        directed: [
          "TTGO 75 g se necessÃ¡rio para esclarecimento diagnÃ³stico.",
          "Fundoscopia para rastreio de retinopatia, ao diagnÃ³stico.",
          "AvaliaÃ§Ã£o do pÃ© diabÃ©tico e neuropatia, ao diagnÃ³stico.",
          "InvestigaÃ§Ã£o adicional se suspeita de DM1/LADA ou diabetes secundÃ¡rio.",
        ],
        monitoring: [
          "Hemoglobina glicada ao diagnÃ³stico e a cada 6 meses.",
          "Rastreio de nefropatia, retinopatia e pÃ© diabÃ©tico ao diagnÃ³stico e anualmente.",
        ],
      },

      guidance: [
        "Oriento o diagnÃ³stico, o carÃ¡ter crÃ´nico do DM2 e a importÃ¢ncia do acompanhamento regular.",
        "Oriento alimentaÃ§Ã£o adequada, atividade fÃ­sica regular e controle de peso quando indicado.",
        "Oriento cuidado diÃ¡rio com os pÃ©s e retorno imediato se houver lesÃ£o, infecÃ§Ã£o ou glicemias muito elevadas com sintomas.",
      ],

      followup: [
        "Reavalio em 4 a 8 semanas apÃ³s inÃ­cio do tratamento para avaliar tolerÃ¢ncia e resposta.",
        "Programo retorno mais precoce se houver descontrole, sintomas ou necessidade de ajuste.",
      ],

      specialSituations: [
        "Hiperglicemia aguda sintomÃ¡tica com desidrataÃ§Ã£o, vÃ´mitos persistentes ou rebaixamento do sensÃ³rio â€” manejo de urgÃªncia.",
        "Suspeita de cetoacidose, sÃ­ndrome hiperosmolar ou fenÃ³tipo compatÃ­vel com DM1/LADA.",
      ],
    },

    governance: {
      status: "ativo",
      version: "1.1.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-22",
      changes: "MigraÃ§Ã£o para v1.3.1. RemoÃ§Ã£o de SOAP com checkboxes e placeholders. ConversÃ£o de exams para objeto estruturado. InclusÃ£o de ui e specialSituations. RevisÃ£o clÃ­nica para APS/MFC.",
      sources: [
        {
          label: "MS/Conitec â€” PCDT de Diabete Melito Tipo 2",
          url: "https://www.gov.br/saude/pt-br/assuntos/pcdt/d/diabete-melito-tipo-2.pdf/view",
          type: "primary",
          year: "2026",
        },
        {
          label: "Caderno de AtenÃ§Ã£o BÃ¡sica nÂº 36 â€” Diabetes Mellitus",
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
      name: "HAS + DM2 â€” Retorno",
      description: "Seguimento combinado de hipertensÃ£o arterial sistÃªmica e diabete melito tipo 2 na APS.",
      category: "cronico",
      tags: ["HAS", "DM2", "hipertensÃ£o", "diabetes", "risco cardiovascular", "retorno"],
      status: "ativo",
    },

    indications: [
      "Pessoa com HAS e DM2 jÃ¡ diagnosticados, em seguimento ambulatorial na APS.",
      "Consulta de retorno para reavaliaÃ§Ã£o do controle pressÃ³rico e glicÃªmico, adesÃ£o, seguranÃ§a terapÃªutica e rastreio de complicaÃ§Ãµes cardiovasculares e microvasculares.",
    ],

    dataRequirements: {
      useNow: [
        "PA atual aferida corretamente",
        "Medicamentos em uso, incluindo anti-hipertensivos, antidiabÃ©ticos e insulina",
        "AdesÃ£o e relato de hipoglicemias",
        "Contexto clÃ­nico da consulta atual",
      ],
      idealForAdjustment: [
        "HbA1c recente e registros de glicemia capilar",
        "PA domiciliar ou MRPA, quando disponÃ­veis",
        "FunÃ§Ã£o renal e albuminÃºria",
        "HistÃ³rico de complicaÃ§Ãµes e rastreios anteriores",
      ],
    },

    ui: {
      subjectivePrompt: "Revisar PA atual, HbA1c/glicemias recentes, hipoglicemias, adesÃ£o, medicaÃ§Ãµes em uso e intercorrÃªncias desde a Ãºltima consulta.",
      objectivePrompt: "Registrar PA, FC, peso e resultado do exame dos pÃ©s.",
      quickNotes: [
        "Comparar PA e HbA1c com valores anteriores e com metas individualizadas.",
        "Risco cardiovascular Ã© alto ou muito alto nesta dupla condiÃ§Ã£o â€” integrar Ã  intensidade do seguimento.",
        "Reavaliar risco de hipoglicemia antes de intensificar o controle glicÃªmico.",
      ],
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente em seguimento por hipertensÃ£o arterial sistÃªmica e diabete melito tipo 2.",
          "Na consulta, reavaliados controle pressÃ³rico, controle glicÃªmico, ocorrÃªncia de hipoglicemias, adesÃ£o ao tratamento e uso correto das medicaÃ§Ãµes.",
          "Revisados PA domiciliar quando disponÃ­vel, glicemias capilares e intercorrÃªncias desde a Ãºltima consulta.",
        ],
        objectiveOutputBlocks: [
          "PA e sinais vitais registrados conforme consulta.",
          "Exame dos pÃ©s realizado conforme avaliaÃ§Ã£o de risco atual.",
        ],
        assessmentBlocks: [
          "HipertensÃ£o arterial sistÃªmica e diabete melito tipo 2 em seguimento combinado na APS.",
          "Controle pressÃ³rico e glicÃªmico reavaliados com base nos dados da consulta e exames disponÃ­veis.",
          "Risco cardiovascular elevado â€” metas terapÃªuticas individualizadas para PA e HbA1c conforme faixa etÃ¡ria, comorbidades e tolerÃ¢ncia ao tratamento.",
          "FunÃ§Ã£o renal e presenÃ§a de albuminÃºria impactam a escolha e a intensidade do esquema terapÃªutico.",
        ],
        planBlocks: [
          "Mantenho ou ajusto o esquema anti-hipertensivo conforme avaliaÃ§Ã£o clÃ­nica, tolerÃ¢ncia e controle pressÃ³rico.",
          "Mantenho ou ajusto o esquema antidiabÃ©tico conforme controle glicÃªmico, risco de hipoglicemia e comorbidades.",
          "Oriento reduÃ§Ã£o de sal e ultraprocessados, atividade fÃ­sica regular, controle de peso e uso correto das medicaÃ§Ãµes.",
          "Oriento inspeÃ§Ã£o diÃ¡ria dos pÃ©s, levar registros de PA domiciliar e retorno imediato se houver lesÃ£o, infecÃ§Ã£o, glicemias muito elevadas ou PA muito elevada com sintomas.",
          "Solicito hemoglobina glicada, funÃ§Ã£o renal, albuminÃºria e demais exames de rotina conforme protocolo e controle.",
          "Solicito rastreio de nefropatia, retinopatia e pÃ© diabÃ©tico ao menos anualmente.",
          "Programo retorno em 1 a 3 meses se houver descontrole ou ajuste terapÃªutico; 3 a 6 meses se estÃ¡vel.",
        ],
      },

      exams: {
        panelBase: [
          "Hemoglobina glicada",
          "Glicemia de jejum",
          "Creatinina com TFGe",
          "PotÃ¡ssio",
          "AlbuminÃºria ou relaÃ§Ã£o albumina-creatinina",
          "Perfil lipÃ­dico",
        ],
        directed: [
          "Fundoscopia para rastreio de retinopatia diabÃ©tica, ao menos anualmente.",
          "AvaliaÃ§Ã£o do pÃ© diabÃ©tico e neuropatia, ao menos anualmente, com maior frequÃªncia conforme risco.",
          "MRPA ou MAPA se discordÃ¢ncia entre PA de consultÃ³rio e domiciliar ou suspeita de avental branco.",
          "Eletrocardiograma conforme indicaÃ§Ã£o clÃ­nica.",
          "UrinÃ¡lise/EAS ou urocultura conforme sintomas ou suspeita de infecÃ§Ã£o.",
        ],
        monitoring: [
          "Hemoglobina glicada a cada 6 meses, podendo antecipar conforme controle.",
          "Rastreio de nefropatia, retinopatia e pÃ© diabÃ©tico ao menos anualmente.",
          "PotÃ¡ssio com uso de IECA, BRA ou iSGLT2, conforme protocolo.",
        ],
      },

      guidance: [
        "Oriento reduzir sal, aÃ§Ãºcar e ultraprocessados, manter atividade fÃ­sica regular e uso correto das medicaÃ§Ãµes.",
        "Oriento levar registros de PA domiciliar quando disponÃ­veis.",
        "Oriento inspeÃ§Ã£o diÃ¡ria dos pÃ©s e retorno imediato se houver lesÃ£o, infecÃ§Ã£o ou piora visual.",
        "Oriento procurar atendimento imediato se PA muito elevada com sintomas ou glicemias muito elevadas com mal-estar.",
      ],

      followup: [
        "Reavalio peso e pressÃ£o arterial em cada consulta.",
        "Programo retorno em 1 a 3 meses se houver descontrole ou ajuste terapÃªutico; 3 a 6 meses se estÃ¡vel.",
      ],

      specialSituations: [
        "PAS â‰¥180 mmHg ou PAD â‰¥120 mmHg persistente com sintomas ou suspeita de lesÃ£o aguda de Ã³rgÃ£o-alvo.",
        "Cetoacidose diabÃ©tica, sÃ­ndrome hiperosmolar, hipoglicemia grave ou descompensaÃ§Ã£o aguda.",
        "Dor torÃ¡cica, dispneia, dÃ©ficit neurolÃ³gico focal ou rebaixamento do sensÃ³rio.",
        "InfecÃ§Ã£o importante no pÃ© ou sinais de isquemia.",
      ],

      longitudinalFocus: [
        "Comparar PA e HbA1c atuais com valores anteriores e com metas terapÃªuticas individualizadas.",
        "Revisar evoluÃ§Ã£o do controle pressÃ³rico e glicÃªmico desde a Ãºltima consulta.",
        "Verificar adesÃ£o, barreiras ao tratamento e risco de hipoglicemia.",
        "Revisar atualizaÃ§Ã£o do rastreio de complicaÃ§Ãµes microvasculares e cardiovasculares.",
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
      version: "1.1.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-22",
      changes: "MigraÃ§Ã£o para v1.3.1. RemoÃ§Ã£o de SOAP com checkboxes e placeholders. ConversÃ£o de exams para objeto estruturado. InclusÃ£o de ui, longitudinalFocus e apply.problems. RevisÃ£o clÃ­nica para APS/MFC.",
      sources: [
        {
          label: "MS/Conitec â€” PCDT de HipertensÃ£o Arterial SistÃªmica",
          url: "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-hipertensao-arterial-sistemica.pdf/view",
          type: "primary",
          year: "2025",
        },
        {
          label: "MS/Conitec â€” PCDT de Diabete Melito Tipo 2",
          url: "https://www.gov.br/saude/pt-br/assuntos/pcdt/d/diabete-melito-tipo-2.pdf/view",
          type: "primary",
          year: "2026",
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
      name: "Dislipidemia â€” InÃ­cio",
      description: "AvaliaÃ§Ã£o inicial de dislipidemia na APS â€” estratificaÃ§Ã£o de risco cardiovascular e definiÃ§Ã£o do tratamento inicial.",
      category: "cronico",
      tags: ["dislipidemia", "LDL", "estatina", "risco cardiovascular", "ezetimiba"],
      status: "ativo",
    },

    indications: [
      "Adulto com lipidograma alterado ou suspeita de dislipidemia em prevenÃ§Ã£o primÃ¡ria, sem doenÃ§a cardiovascular aterosclerÃ³tica (DCVA) conhecida.",
      "Consulta inicial para estratificaÃ§Ã£o de risco cardiovascular e definiÃ§Ã£o do tratamento.",
    ],

    dataRequirements: {
      useNow: [
        "Lipidograma completo",
        "Comorbidades e fatores de risco cardiovascular",
        "Medicamentos em uso e histÃ³ria de hepatopatia, miopatia ou hipotireoidismo",
      ],
      idealForAdjustment: [
        "Creatinina com TFGe e glicemia de jejum ou HbA1c",
        "EstratificaÃ§Ã£o de risco cardiovascular",
        "TSH se suspeita de dislipidemia secundÃ¡ria",
      ],
    },

    ui: {
      subjectivePrompt: "Revisar fatores de risco cardiovascular, histÃ³ria familiar de DCVA prematura, medicamentos que elevam lipÃ­dios e sintomas sugestivos de causa secundÃ¡ria.",
      objectivePrompt: "Registrar peso, PA, IMC e perÃ­metro abdominal.",
      quickNotes: [
        "LDL-c â‰¥190 mg/dL jÃ¡ define alto risco â€” iniciar estatina de alta intensidade sem aguardar estratificaÃ§Ã£o adicional.",
        "NÃ£o-HDL-c Ã© meta coprimÃ¡ria, especialmente se TG â‰¥150 mg/dL.",
      ],
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente em avaliaÃ§Ã£o inicial por dislipidemia.",
          "Na consulta, revisados fatores de risco cardiovascular, histÃ³ria familiar de DCVA prematura, medicamentos em uso e possÃ­veis causas secundÃ¡rias.",
          "Avaliada presenÃ§a de sintomas sugestivos de pancreatite ou doenÃ§a cardiovascular.",
        ],
        objectiveOutputBlocks: [
          "Peso, PA, IMC e perÃ­metro abdominal registrados conforme consulta.",
        ],
        assessmentBlocks: [
          "Dislipidemia em avaliaÃ§Ã£o inicial na APS.",
          "Perfil lipÃ­dico avaliado com base no lipidograma disponÃ­vel.",
          "Risco cardiovascular estratificado; nÃ£o-HDL-c considerado como meta coprimÃ¡ria quando TG â‰¥150 mg/dL.",
          "Causas secundÃ¡rias avaliadas: hipotireoidismo, hepatopatia, sÃ­ndrome nefrÃ³tica, medicamentos.",
        ],
        planBlocks: [
          "Oriento alimentaÃ§Ã£o com menor carga de gorduras saturadas e ultraprocessados, cessaÃ§Ã£o do tabagismo e atividade fÃ­sica regular.",
          "Inicio estatina como primeira opÃ§Ã£o terapÃªutica conforme risco cardiovascular e perfil lipÃ­dico.",
          "Considero terapia de alta intensidade e associaÃ§Ã£o com ezetimiba se LDL-c â‰¥190 mg/dL ou se a meta exigir reduÃ§Ã£o â‰¥50%.",
          "Considero fibrato se triglicerÃ­deos persistentes â‰¥500 mg/dL.",
          "Solicito investigaÃ§Ã£o de causas secundÃ¡rias e biomarcadores complementares quando indicados.",
          "Programo reavaliaÃ§Ã£o clÃ­nica e laboratorial em 6 a 12 semanas apÃ³s inÃ­cio da terapia.",
        ],
      },

      exams: {
        panelBase: [
          "Lipidograma",
          "Creatinina com TFGe",
          "ALT/AST",
          "Glicemia de jejum ou HbA1c",
        ],
        directed: [
          "TSH se suspeita de hipotireoidismo ou dislipidemia sem causa clara.",
          "ApoB se triglicerÃ­deos elevados, discordÃ¢ncia entre LDL-c e nÃ£o-HDL-c ou risco aterogÃªnico aumentado.",
          "Lp(a) pelo menos uma vez na vida, quando disponÃ­vel, especialmente se histÃ³ria familiar de DCVA prematura.",
          "CK basal se alto risco de evento muscular, antecedente de miopatia ou interaÃ§Ã£o medicamentosa relevante.",
        ],
        monitoring: [
          "Lipidograma em 6 a 12 semanas apÃ³s inÃ­cio ou ajuste da terapia.",
          "ApÃ³s estabilizaÃ§Ã£o, lipidograma a cada 6 a 12 meses.",
          "ALT/AST e CK apenas se houver sintomas ou alto risco de toxicidade.",
        ],
      },

      guidance: [
        "Oriento alimentaÃ§Ã£o com menor carga de gorduras saturadas e ultraprocessados.",
        "Oriento cessaÃ§Ã£o do tabagismo e atividade fÃ­sica regular.",
        "Oriento uso regular da estatina e nÃ£o suspensÃ£o por conta prÃ³pria.",
        "Oriento retorno se houver dor muscular importante, fraqueza, urina escura ou dor abdominal intensa.",
      ],

      followup: [
        "Solicito lipidograma em 6 a 12 semanas apÃ³s inÃ­cio ou ajuste da terapia.",
        "ApÃ³s estabilizaÃ§Ã£o, programo acompanhamento com lipidograma a cada 6 a 12 meses.",
      ],

      specialSituations: [
        "TG persistentes â‰¥500 mg/dL ou quadro compatÃ­vel com pancreatite aguda.",
        "Mialgia importante, fraqueza muscular ou urina escura em uso de estatina.",
        "Suspeita de hipercolesterolemia familiar â€” avaliar encaminhamento.",
      ],
    },

    governance: {
      status: "ativo",
      version: "1.1.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-22",
      changes: "MigraÃ§Ã£o para v1.3.1. RemoÃ§Ã£o de SOAP com checkboxes e placeholders. ConversÃ£o de exams para objeto estruturado. InclusÃ£o de ui e specialSituations. RevisÃ£o clÃ­nica para APS/MFC.",
      sources: [
        {
          label: "SBC â€” Diretriz Brasileira de Dislipidemias e PrevenÃ§Ã£o da Aterosclerose",
          url: "https://abccardiol.org/wp-content/uploads/articles_xml/0066-782X-abc-122-09-e20250640/0066-782X-abc-122-09-e20250640.x66747.pdf",
          type: "primary",
          year: "2025",
        },
      ],
    },
  },

  // â”€â”€ Dislipidemia â€” Retorno v1.3.1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "dislipidemia_retorno",

    metadata: {
      name: "Dislipidemia â€” Retorno",
      description: "Seguimento de dislipidemia em uso de estatina na APS â€” adesÃ£o, metas lipÃ­dicas e necessidade de intensificaÃ§Ã£o.",
      category: "cronico",
      tags: ["dislipidemia", "estatina", "LDL", "nÃ£o-HDL", "risco cardiovascular", "retorno"],
      status: "ativo",
    },

    indications: [
      "Pessoa em seguimento por dislipidemia, em uso de estatina, sem DCVA conhecida.",
      "Consulta de retorno para reavaliaÃ§Ã£o de adesÃ£o, resposta terapÃªutica, metas lipÃ­dicas e seguranÃ§a do tratamento.",
    ],

    dataRequirements: {
      useNow: [
        "Estatina e dose em uso",
        "AdesÃ£o e presenÃ§a de sintomas musculares",
        "Contexto clÃ­nico da consulta atual",
      ],
      idealForAdjustment: [
        "Lipidograma atual",
        "Creatinina com TFGe",
        "ALT/AST e CK se sintomas musculares",
      ],
    },

    ui: {
      subjectivePrompt: "Revisar adesÃ£o Ã  estatina, sintomas musculares, mudanÃ§as em dieta e atividade fÃ­sica e intercorrÃªncias desde a Ãºltima consulta.",
      objectivePrompt: "Registrar peso, PA e IMC.",
      quickNotes: [
        "Comparar LDL-c e nÃ£o-HDL-c atuais com resultados anteriores e com a meta individualizada.",
        "Se meta nÃ£o atingida com estatina na dose mÃ¡xima tolerada, considerar ezetimiba.",
      ],
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente em seguimento por dislipidemia, em uso de estatina.",
          "Na consulta, reavaliados adesÃ£o ao tratamento, sintomas musculares, mudanÃ§as em dieta e atividade fÃ­sica e intercorrÃªncias desde a Ãºltima consulta.",
        ],
        objectiveOutputBlocks: [
          "Peso, PA e IMC registrados conforme consulta.",
        ],
        assessmentBlocks: [
          "Dislipidemia em seguimento na APS.",
          "Perfil lipÃ­dico reavaliado com base no lipidograma atual e na estratificaÃ§Ã£o de risco cardiovascular.",
          "Meta de LDL-c individualizada conforme risco cardiovascular; nÃ£o-HDL-c considerado como meta coprimÃ¡ria quando TG â‰¥150 mg/dL.",
          "AdesÃ£o e seguranÃ§a do tratamento reavaliados na consulta.",
        ],
        planBlocks: [
          "Mantenho ou intensifico o esquema terapÃªutico conforme perfil lipÃ­dico, resposta e tolerÃ¢ncia.",
          "Associo ezetimiba se meta nÃ£o atingida com estatina na dose mÃ¡xima tolerada.",
          "Considero fibrato se triglicerÃ­deos persistentes â‰¥500 mg/dL.",
          "ReforÃ§o adesÃ£o, alimentaÃ§Ã£o adequada e atividade fÃ­sica regular.",
          "Solicito lipidograma em 6 a 12 semanas apÃ³s ajuste e, apÃ³s estabilizaÃ§Ã£o, a cada 6 a 12 meses.",
          "Solicito investigaÃ§Ã£o complementar quando indicada por sintomas ou suspeita de causa secundÃ¡ria.",
        ],
      },

      exams: {
        panelBase: [
          "Lipidograma",
          "Creatinina com TFGe",
          "ALT/AST",
        ],
        directed: [
          "CK se houver sintomas musculares, alto risco de miopatia ou interaÃ§Ã£o medicamentosa relevante.",
          "ApoB se triglicerÃ­deos elevados, discordÃ¢ncia entre LDL-c e nÃ£o-HDL-c ou risco aterogÃªnico aumentado.",
          "Glicemia de jejum ou HbA1c conforme risco metabÃ³lico e contexto clÃ­nico.",
        ],
        monitoring: [
          "Lipidograma em 6 a 12 semanas apÃ³s inÃ­cio ou ajuste da terapia.",
          "ApÃ³s estabilizaÃ§Ã£o, lipidograma a cada 6 a 12 meses.",
          "ALT/AST e CK apenas se houver sintomas ou alto risco de toxicidade.",
        ],
      },

      guidance: [
        "Oriento uso regular da estatina e nÃ£o suspensÃ£o por conta prÃ³pria.",
        "Oriento alimentaÃ§Ã£o com menor carga de gorduras saturadas e ultraprocessados.",
        "Oriento atividade fÃ­sica regular.",
        "Oriento retorno se houver dor muscular importante, fraqueza, urina escura ou dor abdominal intensa.",
      ],

      followup: [
        "Solicito lipidograma em 6 a 12 semanas apÃ³s ajuste da terapia.",
        "ApÃ³s estabilizaÃ§Ã£o, programo acompanhamento com lipidograma a cada 6 a 12 meses.",
      ],

      specialSituations: [
        "TG persistentes â‰¥500 mg/dL ou quadro compatÃ­vel com pancreatite aguda.",
        "Mialgia importante, fraqueza muscular ou urina escura em uso de estatina.",
        "LDL-c muito elevado refratÃ¡rio Ã  terapia mÃ¡xima tolerada â€” avaliar encaminhamento.",
      ],

      longitudinalFocus: [
        "Comparar LDL-c e nÃ£o-HDL-c atuais com resultados anteriores e com a meta terapÃªutica.",
        "Revisar adesÃ£o ao tratamento e mudanÃ§as de hÃ¡bito desde a Ãºltima consulta.",
        "Verificar necessidade de intensificaÃ§Ã£o terapÃªutica ou associaÃ§Ã£o de ezetimiba.",
      ],
    },

    apply: {
      problems: [{ key: "dislipidemia", label: "Dislipidemia" }],
    },

    governance: {
      status: "ativo",
      version: "1.1.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-22",
      changes: "MigraÃ§Ã£o para v1.3.1. RemoÃ§Ã£o de SOAP com checkboxes e placeholders. ConversÃ£o de exams para objeto estruturado. InclusÃ£o de ui, longitudinalFocus e apply.problems.",
      sources: [
        {
          label: "SBC â€” Diretriz Brasileira de Dislipidemias e PrevenÃ§Ã£o da Aterosclerose",
          url: "https://abccardiol.org/wp-content/uploads/articles_xml/0066-782X-abc-122-09-e20250640/0066-782X-abc-122-09-e20250640.x66747.pdf",
          type: "primary",
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
      name: "Hipotireoidismo â€” Retorno",
      description: "Retorno ambulatorial de paciente em uso de levotiroxina na APS.",
      category: "cronico",
      tags: ["hipotireoidismo", "levotiroxina", "TSH", "tireoide"],
      status: "ativo" as const,
    },

    indications: [
      "Paciente com hipotireoidismo em seguimento ambulatorial na APS.",
      "Consulta de retorno para revisÃ£o clÃ­nica, adesÃ£o e controle laboratorial.",
    ],

    dataRequirements: {
      useNow: [
        "Dose atual de levotiroxina",
        "Contexto clÃ­nico da consulta atual",
      ],
      idealForAdjustment: [
        "TSH recente",
        "Peso atual",
        "MedicaÃ§Ãµes em uso",
      ],
    },

    ui: {
      subjectivePrompt: "Revisar sintomas atuais, adesÃ£o, modo de uso da levotiroxina, dose atual e evoluÃ§Ã£o desde a Ãºltima consulta.",
      objectivePrompt: "Registrar peso, PA, FC e outros achados relevantes.",
      quickNotes: [
        "Comparar com TSH anterior se disponÃ­vel.",
        "Revisar interaÃ§Ã£o com cÃ¡lcio, ferro e antiÃ¡cidos.",
      ],
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente em seguimento por hipotireoidismo, em uso de levotiroxina.",
          "Na consulta, reavaliados sintomas relacionados ao controle clÃ­nico do quadro.",
          "Revisados adesÃ£o ao tratamento, modo de uso da medicaÃ§Ã£o e dose atual.",
        ],
        objectiveOutputBlocks: [
          "Peso e sinais vitais registrados conforme consulta.",
        ],
        assessmentBlocks: [
          "Hipotireoidismo em seguimento na APS.",
          "Controle clÃ­nico e laboratorial reavaliado com base em sintomas, adesÃ£o e exames disponÃ­veis.",
        ],
        planBlocks: [
          "Mantenho ou ajusto a dose de levotiroxina conforme avaliaÃ§Ã£o clÃ­nica e laboratorial.",
          "Oriento uso correto da medicaÃ§Ã£o em jejum e afastada de cÃ¡lcio, ferro e antiÃ¡cidos.",
          "Solicito controle laboratorial quando indicado.",
          "Programo retorno conforme evoluÃ§Ã£o clÃ­nica e exames.",
        ],
      },

      exams: {
        panelBase: ["TSH"],
        directed: [
          "T4 livre â€” se TSH fora do alvo ou suspeita de disfunÃ§Ã£o tireoidiana.",
          "Lipidograma â€” se dislipidemia, risco cardiovascular aumentado ou necessidade de reavaliaÃ§Ã£o metabÃ³lica.",
        ],
        monitoring: [
          "Repetir TSH em 6 a 8 semanas apÃ³s ajuste de dose.",
          "Se estÃ¡vel, seguir controle periÃ³dico em 6 a 12 meses.",
        ],
      },

      guidance: [
        "Oriento uso da levotiroxina em jejum, 30 minutos antes do cafÃ©.",
        "Oriento intervalo mÃ­nimo de 4 horas entre levotiroxina e cÃ¡lcio, ferro ou antiÃ¡cidos.",
        "Oriento retorno se palpitaÃ§Ãµes, tremor ou insÃ´nia.",
      ],

      followup: [
        "Reavaliar TSH em 6 a 8 semanas apÃ³s ajuste de dose.",
        "Se estÃ¡vel, seguir controle periÃ³dico em 6 a 12 meses.",
      ],

      specialSituations: [
        "GestaÃ§Ã£o ou suspeita de gestaÃ§Ã£o â€” requer manejo especÃ­fico conforme protocolo vigente.",
        "Suspeita de hipotireoidismo central â€” encaminhar endocrinologia.",
        "Dificuldade persistente de controle apesar de boa adesÃ£o e revisÃ£o de interaÃ§Ãµes/absorÃ§Ã£o â€” encaminhar endocrinologia.",
      ],

      longitudinalFocus: [
        "Comparar TSH atual com resultado anterior.",
        "Revisar resposta clÃ­nica desde a Ãºltima consulta ou ajuste de dose.",
        "Verificar adesÃ£o, barreiras de uso e possÃ­veis interaÃ§Ãµes medicamentosas.",
        "Registrar se houve necessidade de mudanÃ§a de conduta desde o Ãºltimo acompanhamento.",
      ],
    },

    apply: {
      problems: [{ key: "hipotireoidismo", label: "Hipotireoidismo" }],
    },

    governance: {
      status: "ativo" as TemplateStatus,
      version: "1.0.2",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-21",
      changes: "MigraÃ§Ã£o para padrÃ£o v1.3.1. RemoÃ§Ã£o de checkboxes e placeholders do SOAP. ConversÃ£o de exams para objeto estruturado. InclusÃ£o de ui, longitudinalFocus e specialSituations. AdiÃ§Ã£o de apply.problems. TSH em idealForAdjustment â€” nÃ£o bloqueia fluxo de APS. Fontes reordenadas com PCDT CONITEC como primary. Ajuste de conteÃºdo em subjective e objective â€” remoÃ§Ã£o de frases que presumiam negativas nÃ£o verificadas.",
      sources: [
        {
          label: "CONITEC â€” PCDT Resumido do Hipotireoidismo",
          url: "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt_resumido_do_hipotireoidismo.pdf/view",
          type: "primary" as const,
          year: "2023",
        },
        {
          label: "MS â€” Protocolos de Encaminhamento: Endocrinologia Adulto",
          url: "https://bvsms.saude.gov.br/bvs/publicacoes/protocolos_encaminhamento_atencao_endocrinologia_adulto.pdf",
          type: "secondary" as const,
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
      name: "DRC â€” Retorno",
      description: "Acompanhamento de doenÃ§a renal crÃ´nica na APS â€” estadiamento KDIGO, nefroproteÃ§Ã£o e monitoramento de progressÃ£o.",
      category: "cronico",
      tags: ["DRC", "TFG", "KDIGO", "proteinÃºria", "nefroproteÃ§Ã£o", "iSGLT2"],
      status: "ativo",
    },

    indications: [
      "Paciente com doenÃ§a renal crÃ´nica conhecida, em seguimento ambulatorial na APS.",
      "Consulta de retorno para estadiamento KDIGO, otimizaÃ§Ã£o da nefroproteÃ§Ã£o e monitoramento da progressÃ£o.",
    ],

    dataRequirements: {
      useNow: [
        "TFG atual (CKD-EPI)",
        "RelaÃ§Ã£o albumina-creatinina (RAC)",
        "PA atual e medicamentos em uso",
      ],
      idealForAdjustment: [
        "PotÃ¡ssio se em uso de IECA, BRA ou iSGLT2",
        "Hemograma (anemia da DRC)",
        "Bicarbonato e eletrÃ³litos a partir de G3b",
        "Causa base da DRC",
      ],
    },

    ui: {
      subjectivePrompt: "Revisar sintomas urÃªmicos (edema, astenia, nÃ¡usea, prurido), adesÃ£o ao tratamento, PA domiciliar e intercorrÃªncias.",
      objectivePrompt: "Registrar PA, peso e presenÃ§a de edema.",
      quickNotes: [
        "Estadiamento KDIGO: G1 â‰¥90 | G2 60â€“89 | G3a 45â€“59 | G3b 30â€“44 | G4 15â€“29 | G5 <15 mL/min.",
        "RAC: A1 <30 | A2 30â€“300 | A3 >300 mg/g.",
        "Encaminhar nefrologia: TFG <30, RAC >300 persistente ou queda progressiva.",
      ],
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente em seguimento por doenÃ§a renal crÃ´nica.",
          "Na consulta, avaliados sintomas urÃªmicos, adesÃ£o ao tratamento, controle pressÃ³rico e intercorrÃªncias desde a Ãºltima consulta.",
        ],
        objectiveOutputBlocks: [
          "PA, peso e presenÃ§a de edema registrados conforme consulta.",
        ],
        assessmentBlocks: [
          "DoenÃ§a renal crÃ´nica em seguimento na APS.",
          "Estadiamento KDIGO reavaliado com base na TFG atual e na RAC.",
          "Controle pressÃ³rico e nefroproteÃ§Ã£o avaliados na consulta.",
        ],
        planBlocks: [
          "Mantenho ou ajusto o esquema anti-hipertensivo com meta de PA <130/80 mmHg, priorizando IECA ou BRA quando indicado.",
          "Avalio indicaÃ§Ã£o de iSGLT2 conforme TFG, causa base e contexto clÃ­nico â€” nÃ£o restrinjo automaticamente a DM+DRC.",
          "Oriento dieta com restriÃ§Ã£o de sal (<5 g/dia) e evitar anti-inflamatÃ³rios nÃ£o esteroidais.",
          "Solicito vacinaÃ§Ã£o para influenza, pneumocÃ³cica e hepatite B quando indicado.",
          "Solicito TFG, RAC e demais exames conforme estÃ¡gio e protocolo.",
          "Encaminho para nefrologia se TFG <30, RAC >300 ou queda progressiva da funÃ§Ã£o renal.",
          "Programo retorno conforme estÃ¡gio e risco de progressÃ£o.",
        ],
      },

      exams: {
        panelBase: [
          "Creatinina com TFGe",
          "RelaÃ§Ã£o albumina-creatinina (RAC)",
          "PotÃ¡ssio (em uso de IECA, BRA ou iSGLT2)",
          "Hemograma",
        ],
        directed: [
          "SÃ³dio e bicarbonato conforme estÃ¡gio e sintomas.",
          "FÃ³sforo, PTH e vitamina D a partir do estÃ¡gio G3b.",
          "Ferritina e ferro sÃ©rico se anemia da DRC.",
        ],
        monitoring: [
          "TFG e RAC a cada 3 a 12 meses conforme estÃ¡gio e risco de progressÃ£o.",
          "PotÃ¡ssio com ajuste de IECA, BRA ou iSGLT2.",
        ],
      },

      guidance: [
        "Oriento controlar a PA rigorosamente â€” Ã© o principal fator de proteÃ§Ã£o renal.",
        "Oriento dieta com restriÃ§Ã£o de sal (<5 g/dia).",
        "Oriento nÃ£o usar anti-inflamatÃ³rios nÃ£o esteroidais (ibuprofeno, diclofenaco).",
        "Oriento comunicar imediatamente mudanÃ§a no volume de urina, inchaÃ§o sÃºbito ou piora do estado geral.",
      ],

      followup: [
        "Solicito TFG e RAC a cada 3 a 12 meses conforme estÃ¡gio.",
        "Programo retorno conforme estÃ¡gio e risco de progressÃ£o.",
      ],

      specialSituations: [
        "Suspeita de lesÃ£o renal aguda ou queda rÃ¡pida da TFG â€” avaliar urgentemente.",
        "TFG <30 mL/min (G4â€“G5) ou RAC >300 mg/g em progressÃ£o â€” encaminhar nefrologia.",
        "Hipercalemia grave ou sobrecarga volÃªmica importante â€” manejo de urgÃªncia.",
      ],

      longitudinalFocus: [
        "Comparar TFG e RAC atuais com resultados anteriores.",
        "Avaliar velocidade de progressÃ£o e resposta Ã s medidas de nefroproteÃ§Ã£o.",
        "Revisar controle pressÃ³rico e adesÃ£o ao tratamento.",
        "Verificar presenÃ§a e manejo de complicaÃ§Ãµes da DRC: anemia, distÃºrbio mineral-Ã³sseo, acidose.",
      ],
    },

    apply: {
      problems: [{ key: "drc", label: "DRC" }],
    },

    governance: {
      status: "ativo",
      version: "1.1.0",
      schemaVersion: "1.3.1",
      lastRevised: "2026-04-22",
      changes: "MigraÃ§Ã£o para v1.3.1. RemoÃ§Ã£o de SOAP com checkboxes e placeholders. ConversÃ£o de exams para objeto estruturado. InclusÃ£o de ui, longitudinalFocus e apply.problems.",
      sources: [
        {
          label: "KDIGO 2024 â€” Clinical Practice Guideline for the Evaluation and Management of CKD",
          url: "https://kdigo.org/home/guidelines/ckd-evaluation-management/",
          type: "primary",
          year: "2024",
        },
        {
          label: "MS â€” Linha de Cuidado para DRC",
          url: "https://linhasdecuidado.saude.gov.br/",
          type: "secondary",
          year: "2022",
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
      name: "SÃ­ndrome Gripal / IRA â€” Atendimento",
      description: "Atendimento de sÃ­ndrome gripal e infecÃ§Ã£o respiratÃ³ria aguda na APS â€” triagem de sinais de alerta e manejo ambulatorial.",
      category: "agudo",
      tags: ["gripe", "IRA", "oseltamivir", "SpO2", "isolamento", "febre"],
      status: "ativo",
    },

    indications: [
      "Paciente com quadro respiratÃ³rio agudo: febre + tosse ou dor de garganta de inÃ­cio abrupto.",
      "Atendimento ambulatorial para triagem de sinais de alerta e manejo inicial.",
    ],

    dataRequirements: {
      useNow: [
        "SpO2 em ar ambiente",
        "PresenÃ§a de sinais de alerta respiratÃ³rio",
        "Grupo de risco para influenza grave",
      ],
      idealForAdjustment: [
        "SituaÃ§Ã£o vacinal para influenza",
        "Tempo de inÃ­cio dos sintomas (oseltamivir Ã© mais eficaz nas primeiras 48h)",
      ],
    },

    ui: {
      subjectivePrompt: "Revisar inÃ­cio dos sintomas, febre, dispneia, tosse, coriza, mialgia, cefaleia, grupo de risco e situaÃ§Ã£o vacinal.",
      objectivePrompt: "Registrar SpO2, FR, FC, temperatura e ausculta pulmonar.",
      quickNotes: [
        "CritÃ©rio MS de sÃ­ndrome gripal: febre + tosse OU dor de garganta de inÃ­cio abrupto.",
        "Sinais de alerta para internaÃ§Ã£o: SpO2 <95%, FR >24, confusÃ£o, hipotensÃ£o, cianose.",
        "Oseltamivir Ã© mais eficaz nas primeiras 48h do inÃ­cio dos sintomas.",
      ],
    },

    clinical: {
      soap: {
        subjectiveOutputBlocks: [
          "Paciente com quadro de sÃ­ndrome gripal / infecÃ§Ã£o respiratÃ³ria aguda.",
          "Na consulta, avaliados inÃ­cio e evoluÃ§Ã£o dos sintomas, presenÃ§a de dispneia, grupo de risco para influenza grave e situaÃ§Ã£o vacinal.",
        ],
        objectiveOutputBlocks: [
          "SpO2, FR, FC, temperatura e ausculta pulmonar registrados conforme consulta.",
        ],
        assessmentBlocks: [
          "SÃ­ndrome gripal com critÃ©rio clÃ­nico presente: febre associada a tosse ou dor de garganta de inÃ­cio abrupto.",
          "Sinais de alerta avaliados na consulta.",
          "CondiÃ§Ã£o clÃ­nica compatÃ­vel com manejo ambulatorial.",
        ],
        planBlocks: [
          "Oriento repouso e hidrataÃ§Ã£o oral adequada.",
          "Prescrevo paracetamol 500 a 750 mg a cada 6 horas para febre e mialgia â€” orientar evitar AAS em menores de 18 anos.",
          "Inicio oseltamivir 75 mg duas vezes ao dia por 5 dias se paciente pertencer a grupo de risco ou apresentar forma grave.",
          "Oriento isolamento domiciliar por 5 a 7 dias.",
          "Oriento retorno imediato se houver dispneia, queda de SpO2, confusÃ£o mental ou piora apÃ³s perÃ­odo de melhora.",
        ],
      },

      exams: {
        panelBase: [],
        directed: [
          "Hemograma e PCR se quadro prolongado, suspeita de complicaÃ§Ã£o bacteriana ou dÃºvida diagnÃ³stica.",
          "Radiografia de tÃ³rax se suspeita de pneumonia.",
        ],
        monitoring: [],
      },

      guidance: [
        "Oriento repouso e hidrataÃ§Ã£o oral de pelo menos 2 L por dia.",
        "Oriento paracetamol para febre â€” evitar AAS em menores de 18 anos.",
        "Oriento isolamento domiciliar por 5 a 7 dias.",
        "Oriento buscar atendimento imediato se falta de ar, lÃ¡bios azulados, confusÃ£o ou febre que nÃ£o cede.",
      ],

      followup: [
        "Programo retorno em 5 a 7 dias ou antes se sinais de alerta.",
      ],

      specialSituations: [
        "SpO2 <95% em ar ambiente â€” referenciar emergÃªncia.",
        "FR >24 irpm, confusÃ£o mental, hipotensÃ£o ou cianose â€” referenciar internaÃ§Ã£o.",
        "Piora clÃ­nica apÃ³s perÃ­odo inicial de melhora â€” investigar complicaÃ§Ã£o bacteriana.",
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
          label: "MS â€” Protocolo de Manejo ClÃ­nico da Gripe na APS",
          url: "https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/i/influenza",
          type: "primary",
          year: "2023",
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
