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

import type { SoapNotes, TemplateCategory, TemplateStatus, TemplateGovernance } from "@/types";

export type { TemplateCategory, TemplateStatus, TemplateGovernance } from "@/types";

// ─── Schema lean — uso clínico rápido ────────────────────────────────────────
// Campos essenciais para decisão em segundos, sem perder segurança mínima.
// whenToUse é obrigatório em novos templates; governance deve acompanhar.

export interface ClinicalTemplate {
  // Identificação
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;

  // Uso Clínico
  /** Quando aplicar — cenário clínico específico */
  whenToUse?: string;
  /** Quando NÃO usar — contraindicações ou cenários inapropriados */
  whenNotToUse?: string;
  /** Dados mínimos necessários antes de aplicar */
  minimumData?: string[];

  // Conteúdo
  /** Tags para busca por palavra-chave */
  tags?: string[];
  /** SOAP — guides a documentação, não substitui julgamento clínico */
  soap?: {
    subjective?: string;
    assessment?: string;
    plan?: string;
    /** Campos extras (objective, etc.) do schema antigo */
    [key: string]: string | undefined;
  };
  /** Orientações ao paciente */
  guidance?: string;
  /** Exames a solicitar */
  exams?: string;
  /** Red flags que exigem atenção */
  redFlags?: string[];
  /** Retorno / seguimento recomendado */
  followup?: string;

  // Governança
  governance?: TemplateGovernance;

  // Retrocompatibilidade com templates legados (pré-migração)
  source?: string;
  sourceUrl?: string;
  sourceYear?: number;
  /** @deprecated Use soap, exams, guidance, followup, redFlags */
  fill?: {
    problems?: string[];
    preventions?: string[];
    soap?: { [key: string]: string | undefined };
    requestedExams?: string;
    patientInstructions?: string;
  };
}

// ─── Metadados de fonte por sessão ────────────────────────────────────────────
const GV = {
  ativo: "ativo" as TemplateStatus,
  v: "1.0.0",
  dt: "2026-04-14",
};

// Fontes adicionadas na Sessão 14.5 (11/04/2026):
//   OBESID — MS. CAB nº 38 — Estratégias para o Cuidado da Pessoa com Obesidade, 2014. bvsms.saude.gov.br
//            ABESO. Diretrizes Brasileiras de Obesidade, 2022. abeso.org.br
//   DEP    — MS. Linha de Cuidado para Depressão na Atenção Básica, 2022. linhasdecuidado.saude.gov.br
//   ANSIED — MS. Linha de Cuidado para Transtornos de Ansiedade, 2022. linhasdecuidado.saude.gov.br
//   DRC    — KDIGO 2022 CKD Guidelines. kdigo.org; MS. Linha de Cuidado para DRC. linhasdecuidado.saude.gov.br
//
// Fontes adicionadas na Sessão 15 (15/04/2026):
//   DPOC   — GOLD 2024. goldcopd.org; MS. Linha de Cuidado DPOC
//   ASMA   — GINA 2025. ginacoalition.org; MS. Linha de Cuidado Asma, 2021
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

// Schema lean — migration 2026-04-14. whenToUse obrigatório, governance completo em todos.
// Template acelera — não substitui julgamento clínico.

export const CLINICAL_TEMPLATES: ClinicalTemplate[] = [
  // ── HAS ──────────────────────────────────────────────────────────────────
  {
    id: "has_retorno",
    name: "HAS — Retorno",
    description: "Seguimento de hipertensão arterial sistêmica na APS — controle pressórico, adesão, segurança e ajuste terapêutico",
    category: "cronico",
    whenToUse: "Adulto com HAS já diagnosticada, em seguimento ambulatorial/APS, para reavaliar controle pressórico, adesão, efeitos adversos, risco cardiovascular e necessidade de ajuste do tratamento.",
    whenNotToUse: "Primeira avaliação diagnóstica de HAS. Urgência/emergência hipertensiva ou suspeita de lesão aguda de órgão-alvo. Gestante com hipertensão.",
    minimumData: [
      "PA atual",
      "Medicamentos em uso e adesão",
      "Efeitos adversos ou sintomas de hipotensão",
      "PA domiciliar/MRPA, se houver",
    ],
    tags: ["HAS", "hipertensão", "anti-hipertensivo", "adesão", "retorno"],
    soap: {
      subjective: "PA atual: ___ | PA domiciliar/MRPA: ___ | Adesão: [ ] boa [ ] irregular | Efeitos adversos/hipotensão: ___ | Uso de AINEs, álcool ou outros fatores que elevam PA: ___",
      assessment: "HAS [ ] no alvo terapêutico | [ ] fora do alvo. Risco cardiovascular: [ ] baixo [ ] moderado [ ] alto [ ] muito alto | Lesão de órgão-alvo/comorbidades: ___",
      plan: "Reforçar medidas não farmacológicas. [ ] Manter esquema atual | [ ] Ajustar tratamento | [ ] Reforçar adesão e técnica de medida da PA | [ ] Solicitar/atualizar exames | Retorno conforme controle.",
    },
    exams:
      "PAINEL BASE: creatinina com TFGe, potássio, glicemia de jejum ou HbA1c, perfil lipídico, urinálise/EAS, eletrocardiograma; sódio se uso de diurético tiazídico.\n" +
      "EXAME DIRIGIDO: MRPA/MAPA se suspeita de avental branco, hipertensão mascarada, discordância entre PA do consultório e domiciliar, ou sintomas de hipotensão.\n" +
      "EXAME DIRIGIDO: albuminúria/relação albumina-creatinina, ecocardiograma ou outros exames conforme DRC, DM, lesão de órgão-alvo, suspeita de HAS secundária ou comorbidades.",
    guidance: "Não interromper medicação por conta própria. Levar registro de PA domiciliar quando disponível. Reduzir sal e ultraprocessados, manter atividade física regular e retornar antes se PA muito elevada ou sintomas de alarme.",
    redFlags: [
      "PAS ≥180 mmHg ou PAD ≥120 mmHg, especialmente se persistente ou sintomática",
      "Dor torácica, dispneia, déficit neurológico focal, alteração visual importante, rebaixamento do sensório ou oligúria",
    ],
    followup: "Reavaliar em 1 mês após início ou mudança do tratamento, até atingir o alvo terapêutico. Depois acompanhar 2–4 vezes no primeiro ano, idealmente a cada 3–6 meses; após controle, seguimento semestral. Exames laboratoriais anuais ou pelo menos a cada 2 anos; ECG conforme indicação clínica.",
    governance: {
      source: "MS/Conitec. PCDT de Hipertensão Arterial Sistêmica, 2025; Linha de Cuidado da HAS no Adulto, 2021; CAB nº 37 como referência complementar.",
      sourceUrl: "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-hipertensao-arterial-sistemica.pdf",
      status: "ativo",
      version: "1.1.0",
      lastRevised: "2026-04-17",
    },
  },

  // ── HAS — Início ────────────────────────────────────────────────────────
  {
    id: "has_inicial",
    name: "HAS — Início",
    description: "Avaliação inicial de pressão arterial elevada/suspeita de HAS na APS — confirmação diagnóstica, estratificação de risco e definição da conduta inicial",
    category: "cronico",
    whenToUse: "Adulto com PA elevada no consultório ou fora dele, sem diagnóstico fechado de HAS, para confirmar o diagnóstico, estratificar risco cardiovascular e definir seguimento ou início de tratamento.",
    whenNotToUse: "Urgência/emergência hipertensiva ou suspeita de lesão aguda de órgão-alvo. Gestante com hipertensão. Paciente já com HAS confirmada em seguimento regular.",
    minimumData: [
      "PA aferida corretamente em ≥2 medidas na consulta",
      "Aferições prévias e/ou MRPA/MAPA, se houver",
      "Risco cardiovascular, comorbidades e lesão de órgão-alvo",
      "Medicamentos/substâncias que possam elevar PA",
    ],
    tags: ["HAS", "hipertensão", "diagnóstico", "MRPA", "MAPA", "risco cardiovascular"],
    soap: {
      subjective: "PA consultório: ___/___ mmHg em ___ medidas | Aferições prévias: ___ | MRPA/MAPA: ___ | Comorbidades/lesão de órgão-alvo: ___ | Medicamentos/substâncias que elevam PA: ___ | Sintomas de alarme: ___",
      assessment: "Classificação: [ ] ótima (<120/<80) | [ ] normal (120-129/80-84) | [ ] normal alta (130-139/85-89) | [ ] HAS grau 1 (140-159/90-99) | [ ] HAS grau 2 (160-179/100-109) | [ ] HAS grau 3 (≥180/≥110). Confirmação diagnóstica: [ ] pendente | [ ] confirmada. Risco cardiovascular: [ ] baixo | [ ] moderado | [ ] alto | [ ] muito alto | Suspeita de HAS secundária: ___",
      plan: "Confirmar diagnóstico com medidas seriadas e, quando indicado, MAPA ou, se indisponível, MRPA. Medidas não farmacológicas para todos. [ ] PA normal alta com muito alto risco: considerar tratamento medicamentoso | [ ] HAS grau 1 com RCV baixo: reavaliar em 3–6 meses | [ ] HAS grau 1 com RCV moderado/alto ou lesão de órgão-alvo: iniciar tratamento medicamentoso | [ ] HAS grau 2/3: iniciar tratamento medicamentoso | [ ] Solicitar exames iniciais e fundo de olho.",
    },
    exams:
      "PAINEL BASE: creatinina com TFGe, potássio, sódio, ácido úrico, albuminúria, glicemia de jejum, perfil lipídico, urinálise/EAS e eletrocardiograma.\n" +
      "EXAME DIRIGIDO: MAPA ou, se indisponível, MRPA, para confirmação diagnóstica quando indicado.\n" +
      "EXAME DIRIGIDO: TSH/T4 livre, relação aldosterona-renina, ecocardiograma, Doppler de artérias renais ou outros exames conforme suspeita de HAS secundária, lesão de órgão-alvo ou comorbidades.",
    guidance: "Explicar que o diagnóstico de HAS deve ser confirmado com medidas seriadas e, quando indicado, MAPA/MRPA. Orientar técnica correta de medida da PA, redução de sal e ultraprocessados, controle de peso, atividade física regular, redução de álcool e cessação do tabagismo.",
    redFlags: [
      "PAS ≥180 mmHg ou PAD ≥120 mmHg, especialmente se houver sintomas ou suspeita de lesão aguda de órgão-alvo",
      "Dor torácica, dispneia, déficit neurológico focal, alteração visual importante, rebaixamento do sensório ou edema agudo de pulmão",
    ],
    followup: "Se iniciar ou modificar tratamento, reavaliar em 1 mês. Se PA normal alta ou HAS grau 1 com baixo risco sem tratamento medicamentoso inicial, reavaliar PA e risco cardiovascular em 3–6 meses. Após confirmação diagnóstica e estabilização, seguir monitoramento periódico conforme controle pressórico.",
    governance: {
      source: "MS/Conitec. PCDT de Hipertensão Arterial Sistêmica, 2025; Linha de Cuidado da HAS no Adulto, 2021; CAB nº 37 como referência complementar.",
      sourceUrl: "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-hipertensao-arterial-sistemica.pdf",
      status: "ativo",
      version: "1.0.0",
      lastRevised: "2026-04-17",
    },
  },

  // ── DM2 ──────────────────────────────────────────────────────────────────
  {
    id: "dm2_retorno",
    name: "DM2 — Retorno",
    description: "Seguimento de diabete melito tipo 2 na APS — controle glicêmico, segurança terapêutica e rastreio de complicações crônicas",
    category: "cronico",
    whenToUse: "Pessoa adulta com DM2 já diagnosticado, em seguimento ambulatorial/APS, para reavaliar controle glicêmico, adesão, hipoglicemia, tratamento em uso e rastrear complicações.",
    whenNotToUse: "Cetoacidose diabética, síndrome hiperosmolar hiperglicêmica, hipoglicemia grave ou descompensação aguda com rebaixamento do sensório, vômitos persistentes ou sinais de desidratação importante.",
    minimumData: [
      "HbA1c e/ou glicemias recentes",
      "Medicamentos em uso, incluindo insulina",
      "Hipoglicemias e adesão ao tratamento",
      "Função renal/albuminúria e rastreio prévio de complicações, se houver"
    ],
    tags: ["DM2", "diabetes", "HbA1c", "hipoglicemia", "pé diabético", "retorno"],
    soap: {
      subjective: "Sintomas de hiperglicemia: ___ | Hipoglicemias: [ ] não [ ] sim, frequência/gravidade: ___ | Adesão: [ ] boa [ ] irregular | Medicações em uso: ___ | Glicemias capilares/automonitorização: ___ | Lesão nos pés, parestesias ou piora visual: ___",
      assessment: "DM2 [ ] no alvo glicêmico | [ ] fora do alvo. Meta HbA1c: [ ] <7,0% (adulto geral) | [ ] <7,5% (idoso saudável) | [ ] <8,0% (idoso comprometido) | [ ] evitar sintomas de hiper/hipoglicemia (idoso muito comprometido). Complicações/comorbidades: ___",
      plan: "Reforçar medidas não farmacológicas e educação em autocuidado. [ ] Manter tratamento atual | [ ] Ajustar esquema medicamentoso | [ ] Rever risco de hipoglicemia e técnica de uso das medicações/insulina | [ ] Solicitar/atualizar rastreio de nefropatia, retinopatia e pé diabético | Retorno conforme controle.",
    },
    exams:
      "PAINEL BASE: hemoglobina glicada, glicemia de jejum, creatinina com TFGe, albuminúria/relação albumina-creatinina e perfil lipídico.\n" +
      "EXAME DIRIGIDO: fundoscopia para rastreio de retinopatia diabética, ao diagnóstico e anualmente.\n" +
      "EXAME DIRIGIDO: avaliação do pé diabético/neuropatia, ao diagnóstico e anualmente, com maior frequência conforme estratificação de risco.\n" +
      "EXAME DIRIGIDO: urinálise/EAS, urocultura ou outros exames conforme sintomas, suspeita de infecção, descompensação clínica ou complicações.",
    guidance: "Manter alimentação adequada, atividade física regular e uso correto das medicações. A frequência da automonitorização glicêmica deve ser individualizada. Não pular refeições se houver risco de hipoglicemia. Inspecionar os pés diariamente e procurar atendimento se houver lesão, sinais de infecção, piora visual, vômitos persistentes ou glicemias muito elevadas com sintomas.",
    redFlags: [
      "Glicemia muito elevada com sintomas importantes, desidratação, vômitos persistentes, sonolência ou suspeita de cetoacidose/síndrome hiperosmolar",
      "Hipoglicemia grave, confusão, convulsão, rebaixamento do sensório, infecção importante no pé ou sinais de isquemia"
    ],
    followup: "Peso e pressão arterial em cada consulta. Hemoglobina glicada e glicemia de jejum a cada 6 meses, podendo antecipar conforme controle. Rastreio de nefropatia, retinopatia e pé diabético ao menos anualmente. Retorno em 3–6 meses se estável, ou antes após ajuste terapêutico ou descontrole.",
    governance: {
      source: "MS/Conitec. PCDT de Diabete Melito Tipo 2, 2026; CAB nº 36 como referência complementar.",
      sourceUrl: "https://www.gov.br/saude/pt-br/assuntos/pcdt/d/diabete-melito-tipo-2.pdf/view",
      status: GV.ativo,
      version: "1.1.0",
      lastRevised: "2026-04-17",
    },
  },

  // ── DM2 — Início ──────────────────────────────────────────────────────────
  {
    id: "dm2_inicial",
    name: "DM2 — Início",
    description: "Avaliação inicial de diabete melito tipo 2 na APS — confirmação diagnóstica, estratificação clínica e definição do tratamento inicial",
    category: "cronico",
    whenToUse: "Adulto com suspeita ou diagnóstico recente de DM2, em avaliação inicial na APS, para confirmar o diagnóstico, identificar gravidade, rastrear complicações e iniciar o plano terapêutico.",
    whenNotToUse: "Cetoacidose diabética, síndrome hiperosmolar hiperglicêmica, hiperglicemia aguda sintomática com desidratação ou rebaixamento do sensório. Suspeita de DM1/LADA ou diabetes gestacional requerem condução específica.",
    minimumData: [
      "HbA1c e/ou glicemias usadas para o diagnóstico",
      "Sintomas de hiperglicemia e perda de peso",
      "Comorbidades, risco cardiovascular e sinais de complicações",
      "Medicamentos em uso e condições que possam interferir no diagnóstico"
    ],
    tags: ["DM2", "diabetes", "diagnóstico", "HbA1c", "tratamento inicial", "complicações"],
    soap: {
      subjective: "Sintomas de hiperglicemia: ___ | Perda de peso, infecções de repetição ou candidíase: ___ | Exames prévios: HbA1c ___ / glicemia ___ | História familiar/comorbidades: ___ | Medicamentos que alteram glicemia: ___ | Sinais de alerta ou suspeita de outro tipo de diabetes: ___",
      assessment: "DM2 [ ] confirmado | [ ] em confirmação. Critério laboratorial: [ ] HbA1c ≥6,5% | [ ] glicemia de jejum ≥126 mg/dL | [ ] TTGO 2h ≥200 mg/dL | [ ] glicemia aleatória ≥200 mg/dL com sintomas. Gravidade/complicações iniciais: ___ | Risco cardiovascular: [ ] baixo | [ ] moderado | [ ] alto | [ ] muito alto",
      plan: "Medidas não farmacológicas para todos. [ ] Iniciar metformina, se não houver contraindicação | [ ] Considerar terapia de combinação se HbA1c >7,5% ao diagnóstico | [ ] Solicitar avaliação basal de complicações e exames iniciais | [ ] Orientar automonitorização quando indicada | [ ] Reavaliar resposta clínica e laboratorial após início do tratamento.",
    },
    exams:
      "PAINEL BASE: hemoglobina glicada, glicemia de jejum, creatinina com TFGe, albuminúria/relação albumina-creatinina e perfil lipídico.\n" +
      "EXAME DIRIGIDO: TTGO 75 g se necessário para esclarecimento diagnóstico quando apropriado.\n" +
      "EXAME DIRIGIDO: fundoscopia para rastreio de retinopatia, ao diagnóstico e anualmente.\n" +
      "EXAME DIRIGIDO: avaliação do pé diabético/neuropatia, ao diagnóstico e anualmente, com maior frequência conforme estratificação de risco.\n" +
      "EXAME DIRIGIDO: investigação adicional se suspeita de DM1/LADA, diabetes secundário ou condição que distorça a HbA1c.",
    guidance: "Explicar o diagnóstico e o caráter crônico do DM2. Reforçar alimentação adequada, atividade física regular, redução de peso quando indicado e uso correto das medicações. A automonitorização glicêmica deve ser individualizada. Orientar cuidado diário com os pés e procurar atendimento se houver vômitos persistentes, desidratação, sonolência, glicemias muito elevadas com sintomas ou lesões/infecção nos pés.",
    redFlags: [
      "Hiperglicemia aguda sintomática, especialmente com glicemia aleatória ≥250 mg/dL, desidratação, vômitos persistentes ou rebaixamento do sensório",
      "Suspeita de cetoacidose, síndrome hiperosmolar, hipoglicemia grave ou fenótipo compatível com DM1/LADA"
    ],
    followup: "Peso e pressão arterial em cada consulta. Hemoglobina glicada e glicemia de jejum ao diagnóstico e a cada 6 meses, podendo antecipar conforme necessidade clínica. Rastreio de pé diabético, nefropatia, dislipidemia e retinopatia ao diagnóstico e anualmente. Reavaliar mais cedo após início do tratamento ou se houver descontrole/sintomas.",
    governance: {
      source: "MS/Conitec. PCDT de Diabete Melito Tipo 2, 2026; CAB nº 36 como referência complementar.",
      sourceUrl: "https://www.gov.br/saude/pt-br/assuntos/pcdt/d/diabete-melito-tipo-2.pdf/view",
      status: "ativo",
      version: "1.0.0",
      lastRevised: "2026-04-17",
    },
  },

  // ── HAS + DM2 ─────────────────────────────────────────────────────────────
  {
    id: "has_dm2_retorno",
    name: "HAS + DM2 — Retorno",
    description: "Seguimento combinado de hipertensão arterial sistêmica e diabete melito tipo 2 na APS — controle pressórico, controle glicêmico e rastreio de complicações cardiovasculares e microvasculares",
    category: "cronico",
    whenToUse: "Pessoa com HAS e DM2 já diagnosticados, em seguimento ambulatorial/APS, para reavaliar controle pressórico e glicêmico, adesão, segurança terapêutica e rastrear complicações.",
    whenNotToUse: "Emergência/urgência hipertensiva, cetoacidose diabética, síndrome hiperosmolar hiperglicêmica, hipoglicemia grave ou descompensação aguda com rebaixamento do sensório, vômitos persistentes ou desidratação importante.",
    minimumData: [
      "PA atual e, se houver, PA domiciliar/MRPA",
      "HbA1c e/ou glicemias recentes",
      "Medicamentos em uso, incluindo anti-hipertensivos, antidiabéticos e insulina",
      "Função renal/albuminúria e rastreio prévio de complicações, se houver"
    ],
    tags: ["HAS", "DM2", "hipertensão", "diabetes", "risco cardiovascular", "retorno"],
    soap: {
      subjective: "PA atual: ___ | PA domiciliar/MRPA: ___ | HbA1c/glicemias recentes: ___ | Hipoglicemias: [ ] não [ ] sim, frequência/gravidade: ___ | Adesão: [ ] boa [ ] irregular | Medicações em uso: ___ | Sintomas de alarme, lesão nos pés, parestesias ou piora visual: ___",
      assessment: "HAS [ ] no alvo terapêutico | [ ] fora do alvo. DM2 [ ] no alvo glicêmico | [ ] fora do alvo. Meta HbA1c: [ ] <7,0% (adulto geral) | [ ] <7,5% (idoso saudável) | [ ] <8,0% (idoso comprometido) | [ ] evitar sintomas de hiper/hipoglicemia (idoso muito comprometido). Risco cardiovascular: [ ] alto | [ ] muito alto | DRC/albuminúria/lesão de órgão-alvo/DCV estabelecida: ___",
      plan: "Reforçar medidas não farmacológicas e autocuidado. [ ] Manter tratamento atual | [ ] Ajustar anti-hipertensivos | [ ] Ajustar esquema antidiabético/insulina | [ ] Rever risco de hipoglicemia e adesão | [ ] Atualizar rastreio de nefropatia, retinopatia e pé diabético | [ ] Reavaliar função renal e albuminúria | Retorno conforme controle.",
    },
    exams:
      "PAINEL BASE: hemoglobina glicada, glicemia de jejum, creatinina com TFGe, albuminúria/relação albumina-creatinina, perfil lipídico e potássio.\n" +
      "EXAME DIRIGIDO: fundoscopia para rastreio de retinopatia diabética, ao menos anualmente.\n" +
      "EXAME DIRIGIDO: avaliação do pé diabético/neuropatia, ao menos anualmente, com maior frequência conforme estratificação de risco.\n" +
      "EXAME DIRIGIDO: eletrocardiograma, urinálise/EAS, urocultura, MRPA/MAPA ou outros exames conforme sintomas, controle pressórico, suspeita de infecção, descompensação clínica ou complicações.",
    guidance: "Reduzir sal, açúcar e ultraprocessados, manter atividade física regular e uso correto das medicações. A automonitorização glicêmica deve ser individualizada. Levar registros de PA domiciliar quando disponíveis. Inspecionar os pés diariamente e procurar atendimento se houver lesão, infecção, piora visual, glicemias muito elevadas com sintomas, vômitos persistentes, desidratação ou PA muito elevada com sintomas.",
    redFlags: [
      "PAS ≥180 mmHg ou PAD ≥120 mmHg, especialmente se persistente ou acompanhada de sintomas/lesão aguda de órgão-alvo",
      "Glicemia muito elevada com sintomas importantes, desidratação, vômitos persistentes, sonolência ou suspeita de cetoacidose/síndrome hiperosmolar",
      "Hipoglicemia grave, dor torácica, dispneia, déficit neurológico focal, rebaixamento do sensório, infecção importante no pé ou sinais de isquemia"
    ],
    followup: "Peso e pressão arterial em cada consulta. Hemoglobina glicada e glicemia de jejum a cada 6 meses, podendo antecipar conforme controle. Rastreio de nefropatia, retinopatia e pé diabético ao menos anualmente. Reavaliar em 1–3 meses se descontrole ou ajuste terapêutico; 3–6 meses se estável.",
    governance: {
      source: "MS/Conitec. PCDT de Hipertensão Arterial Sistêmica, 2025; MS/Conitec. PCDT de Diabete Melito Tipo 2, 2026.",
      sourceUrl: "https://www.gov.br/saude/pt-br/assuntos/pcdt/d/diabete-melito-tipo-2.pdf/view",
      status: "ativo",
      version: "1.1.0",
      lastRevised: "2026-04-17",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DISLIPIDEMIA — SBC 2025 (PREVENT)
  // Fonte: SBC. Diretriz Brasileira de Dislipidemias e Prevenção da Aterosclerose, 2025.
  //        pmc.ncbi.nlm.nih.gov/articles/PMC12674852/
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Dislipidemia — Início ─────────────────────────────────────────────────
  {
    id: "dislipidemia_inicial",
    name: "Dislipidemia — Início",
    description: "Avaliação inicial de dislipidemia — estratificação PREVENT e decisão de tratamento",
    category: "cronico",
    whenToUse: "Adulto com lipidograma alterado ou em avaliação de prevenção primária — estratificar risco cardiovascular PREVENT e definir conduta.",
    whenNotToUse: "Gestação, lactação, hepatopatia ativa descompensada — referenciar. LDL ≥190 mg/dL: iniciar estatina alta intensidade SEM calcular escore — direto ao plano.",
    minimumData: ["Lipidograma completo", "PA", "Creatinina+TFG", "Glicemia jejum ou HbA1c"],
    tags: ["dislipidemia", "estatina", "LDL", "PREVENT", "prevenção primária", "risco cardiovascular", "ezetimiba"],
    soap: {
      subjective:
        "Fatores de risco cardiovascular: [ ] HAS [ ] DM2 [ ] Tabagismo [ ] Obesidade [ ] Dislipidemia familiar.\n" +
        "Antecedente familiar: DAC prematura <55a (homem) / <65a (mulher)? [ ] Sim [ ] Não.\n" +
        "Sintomas de DCV: dispneia aos esforços, dor torácica atípica? [ ] Sim [ ] Não.\n" +
        "Interações medicamentosas: ciclosporina, gemfibrozil, azólicos, macrolídeos? [ ] Sim [ ] Não.\n" +
        "Hepatopatia prévia, miopatia, hipotireoidismo não controlado? ___",
      assessment:
        "LDL-c: ___ mg/dL | TG: ___ mg/dL | HDL: ___ mg/dL | Não-HDL: ___ mg/dL.\n" +
        "Se LDL ≥190 mg/dL → iniciar estatina ALTA intensidade, SEM escore PREVENT.\n" +
        "Se LDL <190 mg/dL → calcular escore PREVENT 10 anos (SBC 2025).\n" +
        "  • PREVENT Baixo       → LDL meta <115 mg/dL — MNF isolado 3–6 meses.\n" +
        "  • PREVENT Moderado    → LDL meta <100 mg/dL — considerar estatina moderada.\n" +
        "  • PREVENT Alto        → LDL meta <70  mg/dL — estatina moderada a alta.\n" +
        "  • PREVENT Muito alto  → LDL meta <50  mg/dL — estatina alta + ezetimiba.\n" +
        "Se TG ≥150 mg/dL → Não-HDL = meta coprimária (LDL + 30 mg/dL).\n" +
        "Avaliar função renal/TFG para escolha e ajuste de dose de estatina quando necessário.",
      plan:
        "[ ] LDL ≥190 mg/dL → iniciar rosuvastatina 20mg OU atorvastatina 40mg 1x/dia.\n" +
        "[ ] LDL <190 + PREVENT moderado-alto → estatina moderada intensidade.\n" +
        "[ ] TG ≥440 mg/dL jejum confirmado → referenciar ou iniciar fibrato.\n" +
        "MNF: dieta hipolipídica, exercício, cessação tabágica.\n" +
        "Reavaliar lipidograma em 4–12 semanas e função hepática (AST/ALT).",
    },
    exams:
      "PAINEL BASE: lipidograma (jejum não obrigatório na rotina), creatinina+TFG, AST/ALT, glicemia jejum.\n" +
      "EXAME DIRIGIDO: Jejum 12–14h apenas se TG >440 mg/dL para confirmação.\n" +
      "EXAME DIRIGIDO: TSH — se sinais de hipotireoidismo OU dislipidemia sem fator de risco claro.\n" +
      "EXAME DIRIGIDO: HbA1c — se glicemia jejum ≥100 mg/dL OU diagnóstico prévio de DM2.\n" +
      "EXAME DIRIGIDO: ApoB — se TG elevados, discordância aterogênica ou risco aumentado.\n" +
      "EXAME DIRIGIDO: Lp(a) — considerar dosagem pelo menos uma vez na vida; priorizar se DAC familiar prematura.\n" +
      "EXAME DIRIGIDO: ECG — se >40a OU com fatores de risco cardiovascular.",
    guidance:
      "Tomar a estatina 1x/dia em horário fixo. Para sinvastatina, preferir uso noturno; para atorvastatina/rosuvastatina, manter horário regular conforme prescrição.\n" +
      "Não suspender sem orientação — o efeito é cumulativo.\n" +
      "Relatar dor muscular intensa ou urina escura — pode ser miopatia.\n" +
      "Dieta: preferir in natura, evitar ultraprocessados, frituras, embutidos.\n" +
      "Atividade física ≥150 min/sem.\n" +
      "Se LDL ≥190 mg/dL, risco cardiovascular já é alto — controle rigoroso.",
    redFlags: [
      "LDL ≥190 mg/dL — indicação absoluta de estatina de alta intensidade",
      "TG ≥440 mg/dL em jejum confirmado — risco de pancreatite aguda",
      "Mialgia + CPK elevada em uso de estatina — risco de rabdomiólise",
    ],
    followup:
      "Lipidograma e AST/ALT + CPK em 4–12 semanas após início.\n" +
      "Depois estável: lipidograma a cada 6–12 meses.",
    governance: {
      source: "SBC. Diretriz Brasileira de Dislipidemias e Prevenção da Aterosclerose, 2025 (PREVENT)",
      sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12674852/",
      status: "ativo",
      version: "1.2.0",
      lastRevised: "2026-04-17",
    },
  },

  // ── Dislipidemia — Retorno ────────────────────────────────────────────────
  {
    id: "dislipidemia_retorno",
    name: "Dislipidemia — Retorno",
    description: "Retorno de dislipidemia em uso de estatina — metas LDL/não-HDL por PREVENT",
    category: "cronico",
    whenToUse: "Paciente em uso de estatina — reavaliar adesão, metas conforme PREVENT e necessidade de escalonar terapia.",
    whenNotToUse: "Gestação, lactação, hepatopatia ativa descompensada, miopatia em uso de estatina — referenciar ou suspender e encaminhar.",
    minimumData: ["Lipidograma atual", "Estatina e dose em uso", "PA", "Creatinina+TFG"],
    tags: ["dislipidemia", "estatina", "LDL", "não-HDL", "PREVENT", "risco cardiovascular", "ezetimiba"],
    soap: {
      subjective:
        "Adesão à estatina: [ ] Regular [ ] Irregular.\n" +
        "Mialgia/dor muscular: [ ] Não [ ] Sim → CPK? ___.\n" +
        "Dieta/exercício: [ ] Melhora [ ] Sem mudança.\n" +
        "Sintomas novos: ___.",
      assessment:
        "LDL-c: ___ mg/dL | TG: ___ mg/dL | HDL: ___ mg/dL | Não-HDL: ___ mg/dL.\n" +
        "Se TG ≥150 mg/dL → usar Não-HDL como meta (LDL isolado subestima carga aterogênica).\n" +
        "Metas LDL-c por PREVENT (SBC 2025):\n" +
        "  • PREVENT Baixo       → LDL <115 mg/dL\n" +
        "  • PREVENT Moderado    → LDL <100 mg/dL\n" +
        "  • PREVENT Alto        → LDL <70  mg/dL\n" +
        "  • PREVENT Muito alto  → LDL <50  mg/dL\n" +
        "  • Risco extremo      → LDL <40  mg/dL (DCV estabelecida)\n" +
        "Meta Não-HDL = LDL + 30 mg/dL.\n" +
        "Intensidade estatina:\n" +
        "  [ ] Alta (rosuvastatina 20-40mg, atorvastatina 40-80mg)\n" +
        "  [ ] Moderada (atorvastatina 10-20mg, rosuvastatina 5-10mg)\n" +
        "  [ ] Baixa (sinvastatina, pravastatina, lovastatina)\n" +
        "Meta atingida? [ ] Sim [ ] Não.\n" +
        "TG ≥440? [ ] Sim → coletar jejum confirmatório.",
      plan:
        "Estatina: [ ] Manter [ ] Aumentar intensidade [ ] Reduzir.\n" +
        "Se meta NÃO atingida com estatina máxima tolerada → associar ezetimiba 10mg/dia.\n" +
        "Se TG ≥440 mg/dL jejum confirmado → referenciar ou iniciar fibrato.\n" +
        "MNF: saturadas <7% calórico total, eliminar trans, fibra solúvel 10-25g/dia,\n" +
        "      EPA/DHA 2g/dia se TG elevados, atividade física ≥150 min/sem.\n" +
        "Repetir lipidograma em 4–12 semanas após ajuste; a cada 6–12 meses se estável.",
    },
    exams:
      "PAINEL BASE: lipidograma (jejum não obrigatório de rotina), creatinina+TFG, AST/ALT.\n" +
      "EXAME DIRIGIDO: Jejum 12–14h — se TG ≥440 mg/dL na amostra casual (confirmação de pancreatite).\n" +
      "EXAME DIRIGIDO: CPK — se mialgia.\n" +
      "EXAME DIRIGIDO: Glicemia jejum + HbA1c — anualmente (rastreio de DM2 — risco sinérgico).\n" +
      "EXAME DIRIGIDO: Lp(a) — considerar dosagem pelo menos uma vez na vida; priorizado se DAC familiar prematura.\n" +
      "EXAME DIRIGIDO: ApoB — se TG elevados, discordância aterogênica ou risco aumentado.",
    guidance:
      "Tomar a estatina 1x/dia em horário fixo. Para sinvastatina, preferir à noite; para atorvastatina/rosuvastatina, manter horário regular conforme prescrição.\n" +
      "Evitar grapefruit (aumenta concentração de estatina).\n" +
      "Relatar imediatamente: dor muscular intensa, urina escura, fraqueza — pode ser miopatia.\n" +
      "Dieta: carnes magras, laticínios desnatados, azeite, frutas, verduras, grãos integrais, peixe.\n" +
      "Evitar: frituras, embutidos, biscoitos recheados, margarina hidrogenada.\n" +
      "Atividade física ≥150 min/sem.\n" +
      "Não interromper estatina sem orientação médica.",
    redFlags: [
      "Mialgia + CPK elevada ou urina escura (rabdomiólise — suspender estatina imediatamente)",
      "TG ≥440 mg/dL confirmado em jejum (risco de pancreatite aguda)",
      "LDL ≥190 mg/dL (indicação de estatina de alta intensidade sem necessidade de escore)",
    ],
    followup:
      "Lipidograma 4–12 semanas após ajuste de estatina; a cada 6–12 meses se estável.\n" +
      "AST/ALT + CPK: monitorar se sintomas musculares.",
    governance: {
      source: "SBC. Diretriz Brasileira de Dislipidemias e Prevenção da Aterosclerose, 2025 (PREVENT)",
      sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12674852/",
      status: "ativo",
      version: "1.2.0",
      lastRevised: "2026-04-17",
    },
  },

  // ── Hipotireoidismo ───────────────────────────────────────────────────────
  {
    id: "hipotireoidismo_retorno",
    name: "Hipotireoidismo — Retorno",
    description: "Retorno de hipotireoidismo em uso de levotiroxina",
    category: "cronico",
    whenToUse: "Paciente em uso de levotiroxina — reavaliar TSH e ajustar dose se necessário.",
    whenNotToUse: "Suspeita de hipotireoidismo central, gestação, ou necessidade de dose >2,5 mcg/kg/dia apesar de adesão/interações/absorção adequadamente revisadas — encaminhar endocrinologia.",
    minimumData: ["TSH recente", "Dose atual de levotiroxina"],
    tags: ["hipotireoidismo", "levotiroxina", "TSH", "tireoide"],
    soap: {
      subjective: "Sintomas hipotireoidismo: fadiga, ganho peso, constipação, intolerância ao frio? [ ] Sim [ ] Não. Sintomas excesso: palpitações, tremor, insônia? [ ] Sim [ ] Não. Uso correto: [ ] Em jejum ≥30min [ ] Irregular. Dose: ___ mcg/dia.",
      assessment: "TSH atual: ___ mUI/L. [ ] Compensado (TSH normal) | [ ] Descompensado. Encaminhar endocrinologia se suspeita de hipotireoidismo central ou necessidade de dose >2,5 mcg/kg/dia após revisar adesão, interações e absorção.",
      plan: "[ ] Manter dose: ___ mcg/dia | [ ] Ajustar (incrementos 12,5–25 mcg). TSH 6–8 sem após ajuste. Se estável: TSH a cada 6–12 meses. Retorno em ___ meses.",
    },
    exams:
      "PAINEL BASE: TSH (6–12 meses se estável; 6–8 sem após ajuste).\n" +
      "EXAME DIRIGIDO: T4 livre — se TSH fora do alvo ou sintomas de disfunção tireoidiana.\n" +
      "EXAME DIRIGIDO: Lipidograma — se dislipidemia, risco cardiovascular aumentado ou necessidade de reavaliação metabólica.",
    guidance: "Tomar levotiroxina SEMPRE em jejum, 30min antes do café. Não tomar com cálcio, ferro ou antiácidos (intervalo mínimo 4h). Não interromper. Retornar se: palpitações, tremor, insônia (sinais de excesso).",
    redFlags: ["Palpitações, tremor, insônia — possíveis sinais de hipertireoidismo iatrogênico"],
    followup: "TSH 6–8 semanas após ajuste de dose; a cada 6–12 meses se estável.",
    governance: {
      source: "MS. Protocolos de Encaminhamento: Endocrinologia Adulto, 2022; PCDT Hipotireoidismo como referência complementar.",
      sourceUrl: "https://bvsms.saude.gov.br/bvs/publicacoes/protocolos_encaminhamento_atencao_endocrinologia_adulto.pdf",
      status: GV.ativo,
      version: "1.0.1",
      lastRevised: "2026-04-17",
    },
  },

  // ── Asma / DPOC ───────────────────────────────────────────────────────────
  // STATUS: DESATUALIZADO (15/04/2026)
  // Substituído por dois templates próprios:
  //   - dpoc_retorno  (classificação GOLD 2024 ABE)
  //   - asma_retorno  (classificação GINA/MS)
  // Mantido para audit trail — não excluir.
  {
    id: "asma_dpoc_retorno",
    name: "Asma / DPOC — Retorno",
    description: "Template legado — usar dpoc_retorno ou asma_retorno.",
    category: "cronico",
    whenToUse: undefined,
    whenNotToUse: "DESATUALIZADO. Usar dpoc_retorno (DPOC) ou asma_retorno (Asma).",
    minimumData: undefined,
    tags: [],
    soap: {
      subjective: "DESATUALIZADO — usar dpoc_retorno ou asma_retorno.",
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

  // ═══════════════════════════════════════════════════════════════════════════
  // DPOC — Retorno
  // Padrão mestre: seção 6, sessão 15 (15/04/2026)
  // Fonte principal: GOLD 2024 — Global Strategy for Diagnosis, Management
  //   and Prevention of COPD; goldcopd.org
  // Fonte secundária: MS. Linha de Cuidado DPOC
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "dpoc_retorno",
    name: "DPOC — Retorno",
    description:
      "Doença Pulmonar Obstrutiva Crônica — acompanhamento de DPOC confirmado por espirometria.",
    category: "cronico",
    whenToUse:
      "Paciente com DPOC confirmado por espirometria (VEF1/CVF pós-broncodilatador <0,70) — reavaliar controle, exacerbações, técnica inalatória e plano de manejo eletivo.",
    whenNotToUse:
      "Não usar para tosse ou sibilância sem espirometria confirmatória. Não usar em exacerbação aguda (manejo de crise). Não usar para asma sem componente obstrutivo de DPOC.",
    minimumData: [
      "Dispneia atual (escala mMRC)",
      "Pontuação CAT",
      "Uso de broncodilatador de resgate na última semana",
      "Exacerbações e internações nos últimos 12 meses",
    ],
    tags: ["DPOC", "bronco", "LAMA", "LABA", "exacerbação", "tabagismo", "espiro", "mMRC", "CAT"],
    soap: {
      subjective:
        "Dispneia (mMRC): [ ] 0 — só esforços grandes [ ] 1 — anda rápido no plano ou em subida leve [ ] 2 — mais devagar que pares no plano [ ] 3 — para após poucos minutos no plano [ ] 4 — ao vestir-se ou ao tomar banho. Escarro: volume/cor: ___. Resgate última sem: ___ vezes. Exacerbações 12 meses: ___ (internações: ___). Tabagismo: [ ] Ativo (___ maços-ano) [ ] Ex (___ anos) [ ] Nunca. Comorbidades: [ ] HAS [ ] DM2 [ ] ICC [ ] DRC.",
      assessment:
        "Grupo GOLD ABE: [ ] A — baixo risco, poucos sintomas (mMRC 0-1 ou CAT <10) | [ ] B — baixo risco, muitos sintomas (mMRC ≥2 e CAT ≥10) | [ ] E — alto risco (≥1 hospitalização ou ≥2 exacerbações moderadas no último ano). CAT: ___ / 40. Espirometria: VEF1: ___L (___% previsto). Exacerbação atual: [ ] não [ ] sim — gravidade: [ ] leve [ ] moderada [ ] grave. Eosinófilos (se disponível): ___ cél/µL.",
      plan:
        "Grupo A: [ ] broncodilatador conforme dispneia (preferencialmente longa ação se disponível e acessível — pode ser LAMA ou LABA; se indisponível, SABA/SAMA como alternativa). Grupo B: [ ] LAMA + LABA (dual therapy — mesmo sendo baixo risco, requer dois broncodilatadores por sintoma). Grupo E: [ ] LAMA + LABA + corticoide inalatório (avaliar se eosinófilos ≥300 cél/µL) [ ] ou LAMA + LABA + roflumilast (bronquite crônica + exacerbações). Resgate: [ ] SABA ou SAMA. Cessação tabágica: [ ] orientação breve [ ] TRN (adesivo/nicotina/goma) ou bupropiona — disponíveis via cuidado estruturado do SUS conforme protocolo local [ ] encaminhamento tabacologia. Reabilitação pulmonar se indicada (mMRC ≥2 ou CAT ≥10). Vacinação: influenza + pneumocócica (verificar PNI vigente). Retorno em ___ meses.",
    },
    exams:
      "PAINEL BASE: Oximetria em todas as consultas.\n" +
      "EXAME DIRIGIDO: Espirometria — a cada 1-3 anos se estável leve-moderado; antes se mudança clínica.\n" +
      "EXAME DIRIGIDO: Hemograma — se suspeita de policitemia (SpO2 persistentemente baixa) OU exacerbação.\n" +
      "EXAME DIRIGIDO: Rx tórax — se exacerbação grave, hemoptise ou diagnóstico diferencial.\n" +
      "EXAME DIRIGIDO: Eosinófilos — guia para corticoide inalatório no grupo E.",
    followup:
      "Grupo A ou B estável: retorno em 6 meses. Grupo E ou instável: retorno em 1-3 meses. Ajustar antes se exacerbação ou piora clínica.",
    guidance:
      "Objetivo: reduzir exacerbações e mortalidade. Técnica inalatória é fundamental — revisar a cada consulta. Resgate >2x/dia = mau controle. Cessar tabagismo é a intervenção de maior impacto. Vacinar influenza anualmente. Verificar situação vacinal pneumocócica conforme PNI vigente. Buscar atendimento se: aumento da dispneia, escarro amarelo/verde, febre, resgate >4x/dia.",
    redFlags: [
      "SpO2 <88% em ar ambiente — avaliar necessidade de oxigentoterapia",
      "Confusão mental ou sonolência diurna — hipercapnia/retensão de CO2",
      "Perda de peso não intencional — enfisema avançado",
      "Exacerbação grave: dispneia em repouso, uso de musculatura acessória, cianose",
      "Hemoptise — investigar",
    ],
    governance: {
      source:
        "GOLD 2025 — Global Strategy for Diagnosis, Management and Prevention of COPD; goldcopd.org; MS. Linha de Cuidado DPOC (complementar).",
      sourceUrl: "https://goldcopd.org/",
      status: "ativo",
      version: "2.2",
      lastRevised: "2026-04-17",
    },
  },

  {
    id: "asma_retorno",
    name: "Asma — Retorno",
    description:
      "Asma brônquica — acompanhamento de asma confirmada por história clínica (± espirometria).",
    category: "cronico",
    whenToUse:
      "Paciente com asma diagnosticada — reavaliar controle, técnica inalatória, desencadeantes e plano de manejo eletivo.",
    whenNotToUse:
      "Não usar para DPOC sem componente asmático (usar dpoc_retorno). Não usar em crise asmática aguda (manejo de crise). Não usar para tosse sem diagnóstico de asma.",
    minimumData: [
      "Sintomas da última semana (dispneia, tosse, sibilância, aperto torácico)",
      "Uso de broncodilatador de resgate (última semana)",
      "Desencadeantes conhecidos",
      "Exacerbações e internações nos últimos 12 meses",
    ],
    tags: ["asma", "inalatório", "bronco", "exacerbação", "corticoide", "ICS", "GINA"],
    soap: {
      subjective:
        "Sintomas última semana: tosse [ ] s [ ] n | sibilância [ ] s [ ] n | dispneia [ ] s [ ] n | aperto torácico [ ] s [ ] n. Frequência: [ ] diária [ ] >2x/sem [ ] ≤2x/sem [ ] raro. Desencadeantes: [ ] ácaro [ ] pólens [ ] frio [ ] exercício [ ] infecção [ ] outros: ___. Resgate última sem: ___ vezes. Exacerbações 12 meses: ___ (internações: ___ / UTI: ___). Comorbidades: [ ] rinite [ ] sinusite [ ] DPOC [ ] pólipos nasais.",
      assessment:
        "Classificação GINA de controle: [ ] bem controlada [ ] parcialmente controlada (≥1 item abaixo) [ ] não controlada (≥3 itens abaixo). ACT: ___ / 25 (≤19 = não controlada — ferramenta de rastreio, não substitui classificação GINA). Sintomas: [ ] <2x/sem [ ] >2x/sem [ ] diários [ ] contínuos. Exacerbação atual: [ ] não [ ] sim — OC oral: [ ] não [ ] sim. Espirometria: VEF1: ___L (___% previsto) se disponível.",
      plan:
        "Track 1 (preferido — GINA 2025): Steps 1–2: baixa dose budesonida-formoterol ou beclometasona-formoterol sob demanda (reliever + controller simultâneo). Step 3: MART — manutenção diária budesonida-formoterol dose baixa + mesmo ICS-formoterol como reliever. Step 4: MART — manutenção diária budesonida-formoterol dose média + mesmo ICS-formoterol como reliever. Step 5: asma grave / difícil controle — encaminhar/reavaliar com especialista; considerar add-ons (anti-IgE, anti-IL5/IL4R, tiotropina) conforme avaliação especializada; manutenção com corticoide oral = último recurso — evitar uso crônico, nunca como solução de primeira linha. Track 2 (alternativo): Step 1: SABA como reliever — associar ICS a cada uso. Step 2: CI baixa dose manutenção diária + SABA PRN. Step 3: CI-LABA baixa dose manutenção + SABA PRN. Step 4: CI-LABA dose média manutenção + SABA PRN. ⚠️ LABA NUNCA em monoterapia na asma — risco de morte. Para PRN/MART: apenas budesonida-formoterol ou beclometasona-formoterol (ICS + formoterol) — nenhum outro LABA serve para resgate ou regime MART. Antagonista LT: [ ] sim [ ] não. Plano de ação escrito entregue: [ ] sim [ ] não. Técnica inalatória revisada: [ ] adequada [ ] corrigida. Retorno em ___ meses.",
    },
    exams:
      "PAINEL BASE: nenhum — asma é diagnóstico e seguimento predominantemente clínicos.\n" +
      "EXAME DIRIGIDO: Espirometria — a cada 1-2 anos ou antes se mudança clínica significativa.\n" +
      "EXAME DIRIGIDO: Peak flow (PEF) — monitoramento domiciliar se asma moderada-grave.\n" +
      "EXAME DIRIGIDO: Eosinófilos — marcador de resposta a corticoide inalatório.\n" +
      "EXAME DIRIGIDO: IgE total/especial — se suspeita de atopia e qualificação para biológicos.",
    followup:
      "Asma controlada: retorno em 3-6 meses. Parcialmente controlada: retorno em 1-3 meses. Não controlada: reavaliar em 4-6 semanas. Crise: atendimento imediato.",
    guidance:
      "Técnica inalatória é o problema mais comum — revisar a cada consulta. Resgate >2x/sem = mau controle, não negligenciar. Plano de ação escrito reduz exacerbações. Vacinar influenza anualmente. Atividade física é recomendada. Buscar se: resgate >4x/dia, acordar à noite por asma, crise não melhora com resgate.",
    redFlags: [
      "Crise asmática: dispneia em repouso, sibilância intensa, dificuldade em completar frases",
      "Peak flow <50% do melhor pessoal — risco de crise grave",
      "Resgate não controla sintomas — necessidade de OC oral ou urgência",
      "SpO2 <92% durante crise",
    ],
    governance: {
      source:
        "GINA 2025 — Global Strategy for Diagnosis, Management and Prevention of Asthma; ginacoalition.org; MS. Linha de Cuidado Asma, 2021 (complementar).",
      sourceUrl: "https://ginacoalition.org/",
      status: "ativo",
      version: "2.6",
      lastRevised: "2026-04-17",
    },
  },

  // ── Obesidade / S. Metabólica ────────────────────────────────────────────
  {
    id: "obesidade_retorno",
    name: "Obesidade / S. Metabólica — Retorno",
    description: "Retorno de obesidade — metas clínicas, adesão e seguimento",
    category: "cronico",
    whenToUse: "Paciente com obesidade em seguimento — reavaliar metas, adesão, comorbidades e necessidade de escalonamento terapêutico.",
    whenNotToUse: "Suspeita de causa secundária relevante, perda/ganho ponderal atípico importante, gestação ou necessidade de manejo especializado fora da APS — avaliar encaminhamento.",
    minimumData: ["Peso atual", "PA", "Perímetro abdominal"],
    tags: ["obesidade", "síndrome metabólica", "IMC", "peso", "meta"],
    soap: {
      subjective: "Peso atual: ___ kg (anterior: ___ kg). Padrão alimentar: ___. Atividade física: ___. Comorbidades: [ ] HAS [ ] DM2 [ ] Dislipidemia [ ] SAOS.",
      assessment: "IMC: ___ kg/m². Obesidade Grau [ ] I (30–34,9) [ ] II (35–39,9) [ ] III (≥40). CA: ___ cm (aumentada conforme sexo e referência utilizada). Risco cardio-metabólico: [ ] baixo [ ] moderado [ ] alto.",
      plan: "Meta: redução 5–10% do peso em 6 meses. [ ] Encaminhar nutricionista/NASF. [ ] Avaliar indicação de farmacoterapia conforme PCDT, disponibilidade e contexto clínico; considerar encaminhamento quando necessário. Retorno em ___ meses — controlar peso, CA, PA.",
    },
    exams:
      "PAINEL BASE: Glicemia jejum, lipidograma, creatinina+TFG, AST/ALT.\n" +
      "EXAME DIRIGIDO: HbA1c — se glicemia jejum ≥100 mg/dL OU diagnóstico de DM2.\n" +
      "EXAME DIRIGIDO: TSH — se sinais de hipotireoidismo.\n" +
      "EXAME DIRIGIDO: Ácido úrico — se antecedente de gota OU uso de tiazídico.",
    guidance: "Meta: perder 5–10% do peso — já melhora comorbidades. Priorizar alimentos in natura. Reduzir ultraprocessados. Atividade física: iniciar ≥150 min/sem, progredir conforme tolerância. Dormir 7–9h. Não interromper tratamento por conta própria.",
    redFlags: ["Ganho de peso significativo não intencional"],
    followup: "Retorno em 3–6 meses.",
    governance: {
      source: "MS/Conitec. PCDT de Sobrepeso e Obesidade em Adultos; ABESO. Diretrizes Brasileiras de Obesidade, 2022.",
      sourceUrl: "https://bvsms.saude.gov.br/bvs/publicacoes/estrategias_cuidado_pessoa_doenca_cronica_obesidade_cab38.pdf",
      status: GV.ativo,
      version: "1.0.1",
      lastRevised: "2026-04-17",
    },
  },

  // ── Depressão ─────────────────────────────────────────────────────────────
  {
    id: "depressao_retorno",
    name: "Depressão — Retorno",
    description: "Retorno de Transtorno Depressivo Maior — resposta ao tratamento e adesão",
    category: "saude_mental",
    whenToUse: "Paciente em uso de antidepressivo — avaliar resposta (PHQ-9), adesão e ideação suicida.",
    whenNotToUse: "Risco agudo / ideação suicida ativa com plano ou intenção / tentativa recente — encaminhar urgentemente para avaliação em serviço de urgência/emergência e articular CAPS/RAPS conforme rede local.",
    minimumData: ["PHQ-9 atual", "Adesão ao antidepressivo"],
    tags: ["depressão", "antidepressivo", "PHQ-9", "suicídio", "CAPS", "TCC"],
    soap: {
      subjective: "PHQ-9: ___/27 (0–4 remissão | 5–9 leve | 10–14 moderada | 15–19 mod-grave | 20–27 grave). Humor, sono, apetite, energia: ___. Ideação suicida (item 9): [ ] Ausente [ ] Presente — risco: ___. Adesão: [ ] Regular [ ] Irregular. Psicoterapia (TCC): [ ] Em curso [ ] Não.",
      assessment: "Depressão [ ] leve [ ] moderada [ ] grave. Resposta: [ ] remissão PHQ-9<5 [ ] parcial (≥50% redução) [ ] nenhuma. [ ] Ideação suicida — avaliar urgência.",
      plan: "Reavaliar adesão, efeitos adversos e risco em 2–4 semanas na fase inicial; resposta terapêutica em 4–6 semanas; considerar ajuste ou troca se não houver resposta adequada após tempo suficiente em dose terapêutica. [ ] Manter [ ] Ajustar [ ] Trocar. [ ] Encaminhar conforme rede local (CAPS/RAPS/urgência): gravidade, risco suicida, refratariedade. Manter tratamento ≥6 meses pós-remissão.",
    },
    exams: "PAINEL BASE: nenhum — avaliação predominantemente clínica.",
    guidance: "Antidepressivo leva 4–6 sem para fazer efeito — não parar. Não parar abruptamente. Atividade física ajuda. Manter rotina de sono. Se surgirem pensamentos de autoagressão ou piora importante, procurar imediatamente suporte da rede de urgência / CVV 188 / serviço local.",
    redFlags: ["Ideação suicida ativa", "Tentativa de suicídio recente"],
    followup: "Retorno em 2–4 semanas na fase inicial; depois 4–8 semanas conforme gravidade, risco e resposta.",
    governance: {
      source: "MS. Linha de Cuidado da Depressão no Adulto, 2022; DSM-5-TR (APA, 2022) como referência complementar.",
      sourceUrl: "https://linhasdecuidado.saude.gov.br/portal/transtornos-de-humor-e-comportamento/",
      status: GV.ativo,
      version: "1.0.1",
      lastRevised: "2026-04-17",
    },
  },

  // ── Insônia ───────────────────────────────────────────────────────────────
  {
    id: "insonia",
    name: "Insônia",
    description: "Avaliação e manejo de insônia crônica em APS — higiene do sono e TCC-I como primeira linha",
    category: "saude_mental",
    whenToUse: "Paciente ≥18a com queixa de insônia crônica (≥3 meses, ≥3x/sem) com impacto funcional diurno, após exclusão de causas secundárias (médicas, psiquiátricas, medicamentosas).",
    whenNotToUse: "Insônia aguda situacional (<1 mês); causa secundária não investigada; suspeita clínica forte de SAOS sem avaliação; risco agudo psiquiátrico (suicídio, psicose, mania); uso problemático atual de benzodiazepínico ou hipnótico que exija descontinuação supervisionada.",
    minimumData: ["ISI ou PSQI pontuação", "Duração e frequência dos sintomas", "Impacto diurno", "Suspeita de causa secundária investigada", "Hábitos de sono", "Screening SAOS (Epworth, ronco, apneia)", "PHQ-2 / GAD-2"],
    tags: ["insônia", "sono", "zolpidem", "TCC-I", "higiene do sono", "SAOS", "hipnótico"],
    soap: {
      subjective: "ISI: ___/28 (0–7 normal | 8–14 limítrofe | 15–21 moderada | 22–28 grave). Duração: ___ meses. Frequência: ≥3x/sem. Início do sono: ___min. Acordares noturnos: ___/noite. Despertar antecipado: [ ] Sim [ ] Não. Impacto diurno: [ ] Fadiga [ ] Sonolência [ ] Déficit cognitivo [ ] Irritabilidade. Epworth: ___/24. Ronco: [ ] Não [ ] Ocasional [ ] Frequente. Apneia testemunhada: [ ] Não [ ] Sim. IMC: ___kg/m². Caféína após 14h: [ ] Sim [ ] Não. Álcool: [ ] Sim [ ] Não. Telas antes de dormir: [ ] Sim [ ] Não. PHQ-2: ___. GAD-2: ___. Medicações atuais: ___. Tratamento prévio insônia: [ ] Não [ ] Sim — qual:___.",
      objective: "IMC: ___kg/m². PA: ___/___mmHg. Cardio: ___. Pulmões: ___. Rinofaringe: ___. MMII: ___. Epworth: ___/24.",
      assessment: "Insônia [ ] aguda [ ] crônica primária [ ] crônica secundária — impacto: [ ] leve [ ] moderado [ ] grave. CID-10: G47.0 / F51.0. Diagnóstico diferencial avaliado: [ ] SAOS [ ] SPI [ ] transtorno humor [ ] transtorno ansiedade [ ] uso substâncias [ ] medicações [ ] dor crônica.",
      plan: "1) Primeira linha — Higiene do sono: horário fixo deitar/acordar, evitar telas 1h antes, cafeína após 14h, álcool 3h antes de dormir, exercício regular não após 20h, quarto escuro/fresco/silencioso. 2) TCC-I: orientar princípios na consulta; referenciar CAPS/seguimento se disponível. 3) Reavaliar em 2 sem — se falha de medidas não farmacológicas após 2 semanas: farmacoterapia na menor dose eficaz pelo menor tempo possível. 4) NÃO prescrever benzodiazepínicos como 1ª linha. 5) Investigar SAOS se suspeita clínica (Epworth ≥10 + ronco + IMC ≥30) — adiar hipnótico até investigar. 6) Reavaliar em 4 semanas — suspender ou manter (benefício > risco). Nunca manter por inércia. 7) Suspensão: reduzir gradualmente — não interromper abruptamente.",
    },
    exams:
      "EXAME DIRIGIDO: Glicemia jejum, TSH, ureia/creatinina — investigar causas secundárias de insônia.\n" +
      "EXAME DIRIGIDO: Hemograma — se fadiga diurna significativa ou suspeita de anemia.\n" +
      "EXAME DIRIGIDO: Ferritina — se suspeita de déficit de ferro (SPI, fadiga).\n" +
      "EXAME DIRIGIDO: Polissonografia — se Epworth ≥10 + ronco frequente + IMC ≥30.",
    guidance: "TCC-I é o tratamento de escolha para insônia crônica — funciona melhor que hipnóticos a longo prazo e sem riscos de dependência. Medicação é adjuvante: menor dose eficaz, menor tempo possível. Zolpidem: máx 10mg/dia — qualquer concentração exige Notificação de Receita B (Anvisa/Portaria 344). Idosos >65a: iniciar 5mg. Sonolência residual pode ocorrer mesmo em doses terapêuticas — atenção ao dirigir. Nunca interromper abruptamente uso prolongado — risco de insônia rebound. Associar com álcool ou outros depressores do SNC é contraindicado — risco de depressão respiratória. CMAE (comportamentos complexos do sono): descontinuar imediatamente se ocorrer.",
    redFlags: [
      "Ronco + apneia testemunhada + sonolência diurna excessiva → INVESTIGAR SAOS ANTES DE INICIAR HIPNÓTICO (não é contraindicação absoluta, mas hipnótico pode mascarar sintomas e retardar diagnóstico)",
      "Ideação suicida → CAPS/emergência",
      "Insônia refractária após 8 semanas de tratamento adequado → encaminhamento psiquiatria",
      "Sintomas de pernas inquietas → encaminhamento neurologia",
    ],
    followup: "2 semanas: higiene do sono sendo seguida? Resposta inicial se farmacoterapia iniciada? 4 semanas: reavaliar — suspender ou manter (benefício > risco). Nunca manter por inércia. >8 semanas: encaminhamento atenção especializada.",
    governance: {
      source: "ICSD-3 (AASM, 2014) — diagnóstico; AASM 2021 Behavioral Treatment of Chronic Insomnia — tratamento não farmacológico (TCC-I); AASM 2017 Pharmacologic Treatment of Chronic Insomnia — farmacoterapia; Portaria SVS/MS 344/1998; RDC/Anvisa 26/2012 — notificação Receita B para zolpidem.",
      sourceUrl: "https://aasm.org/clinical-practice-guideline/pharmacologic-treatment-of-chronic-insomnia/",
      status: GV.ativo,
      version: "1.0.0",
      lastRevised: "2026-04-17",
    },
  },

  // ── Ansiedade / TAG ───────────────────────────────────────────────────────
  {
    id: "ansiedade_retorno",
    name: "Ansiedade / TAG — Retorno",
    description: "Retorno de Transtorno de Ansiedade Generalizada",
    category: "saude_mental",
    whenToUse: "Paciente com TAG ou ansiedade — avaliar GAD-7, adesão e impacto funcional.",
    whenNotToUse: "Risco agudo de suicídio, auto/heteroagressão, sintomas psicóticos ou maniformes, intoxicação/abstinência importante ou crise aguda que exija manejo de urgência — encaminhar para urgência/emergência e articular RAPS conforme rede local.",
    minimumData: ["GAD-7 atual", "Adesão ao tratamento"],
    tags: ["ansiedade", "TAG", "GAD-7", "ISRS", "pânico", "CAPS"],
    soap: {
      subjective: "GAD-7: ___/21 (0–4 mínima | 5–9 leve | 10–14 moderada | ≥15 grave). Preocupação, tensão, insônia, irritabilidade: ___. Crises de pânico: [ ] Ausentes [ ] Presentes freq:___. Adesão: [ ] Regular [ ] Irregular. Impacto funcional: ___.",
      assessment: "TAG [ ] leve [ ] moderada [ ] grave. Resposta: [ ] boa (GAD-7<5) [ ] parcial [ ] nenhuma. [ ] Afastar causas orgânicas: hipertireoidismo, arritmia, anemia.",
      plan: "1ª linha: ISRS (sertralina 50–200mg ou escitalopram 10–20mg). Aguardar 4–6 sem. [ ] Manter [ ] Ajustar. [ ] Encaminhar psicoterapia (TCC). [ ] Encaminhar/compartilhar cuidado com psicoterapia e RAPS/atenção especializada conforme gravidade, refratariedade, comorbidades relevantes ou risco. Evitar benzodiazepínicos como manutenção.",
    },
    exams:
      "PAINEL BASE: nenhum — avaliação predominantemente clínica.\n" +
      "EXAME DIRIGIDO: TSH — se sintomas compatíveis com hiper/hipotireoidismo.\n" +
      "EXAME DIRIGIDO: Hemograma — se suspeita de anemia ou fadiga desproporcional.\n" +
      "EXAME DIRIGIDO: ECG — se palpitações, síncope, dor torácica ou forte dúvida de causa cardíaca.",
    guidance: "Técnicas de respiração e relaxamento ajudam. Reduzir cafeína e álcool — pioram ansiedade. Exercício regular reduz ansiedade. Manter rotina de sono. Tratamento funciona melhor com remédio + terapia.",
    redFlags: [
      "Risco agudo de suicídio ou auto/heteroagressão",
      "Sintomas psicóticos ou maniformes",
      "Crise com síncope, rebaixamento de nível de consciência ou importante dúvida de causa orgânica/cardíaca",
    ],
    followup: "Retorno em 2–4 semanas na fase inicial; depois 4–8 semanas conforme gravidade, risco e resposta.",
    governance: {
      source: "MS. Linha de Cuidado — Transtornos de Ansiedade no Adulto, 2022; DSM-5-TR (APA, 2022) como referência complementar.",
      sourceUrl: "https://linhasdecuidado.saude.gov.br/portal/transtornos-de-humor-e-comportamento/",
      status: GV.ativo,
      version: "1.0.1",
      lastRevised: "2026-04-17",
    },
  },

  // ── DRC ───────────────────────────────────────────────────────────────────
  {
    id: "drc_retorno",
    name: "DRC — Retorno",
    description: "Retorno de Doença Renal Crônica — estadiamento KDIGO e nefroproteção",
    category: "cronico",
    whenToUse: "Paciente com DRC conhecida — estadiar, otimizar nefroproteção e monitorar progressão.",
    whenNotToUse: "Suspeita de lesão renal aguda, queda rápida da função renal, síndrome nefrótica/nefrítica, hipercalemia grave ou sobrecarga volêmica importante — avaliar urgentemente/encaminhar.",
    minimumData: ["TFG atual", "RAC"],
    tags: ["DRC", "rim", "TFG", "KDIGO", "proteinúria", "nefroproteção", "iSGLT2"],
    soap: {
      subjective: "Sintomas urêmicos: edema, astenia, náusea, prurido? [ ] Sim [ ] Não. Adesão: [ ] Boa [ ] Irregular. PA: ___. Causa base: ___.",
      assessment: "TFG (CKD-EPI): ___ mL/min. RAC: ___ mg/g. Estágio: G[ ]1≥90 G2 60–89 G3a 45–59 G3b 30–44 G4 15–29 G5 <15. RAC: A1<30 A2 30–300 A3>300. [ ] Encaminhar nefrologia: TFG<30, RAC>300, queda progressiva.",
      plan: "Nefroproteção: [ ] IECA/BRA (meta PA <130/80) | [ ] iSGLT2 — avaliar conforme indicação renal/cardiovascular, TFG e contexto clínico; não restringir automaticamente apenas a DM+DRC. Dieta: restrição sal. Vacinar: influenza, pneumocócica, hepatite B. TFG+RAC a cada 3–12 meses. Retorno em ___ meses.",
    },
    exams: "Creatinina+TFG, RAC, potássio (com IECA/BRA/iSGLT2), hemograma (anemia), sódio, bicarbonato. A partir de G3b: fósforo, PTH, vitamina D.",
    guidance: "Controlar PA rigorosamente — principal fator de proteção. Sal <5g/dia. Não usar anti-inflamatórios (ibuprofeno, diclofenaco). Vacinar gripe e pneumonia. Comunicar mudança no volume de urina ou inchaço.",
    redFlags: ["TFG <30 mL/min (G4–G5)", "Proteinúria >300 mg/g em progressão"],
    followup: "TFG+RAC a cada 3–12 meses conforme estágio.",
    governance: {
      source: "KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of CKD; MS. Linha de Cuidado para DRC (complementar).",
      sourceUrl: "https://kdigo.org/home/guidelines/ckd-evaluation-management/",
      status: GV.ativo,
      version: "1.0.1",
      lastRevised: "2026-04-17",
    },
  },

  // ── Gota ──────────────────────────────────────────────────────────────────
  {
    id: "gota_retorno",
    name: "Gota — Retorno",
    description: "Retorno de gota — meta de ácido úrico e prevenção de crises",
    category: "cronico",
    whenToUse: "Paciente com gota — monitorar ácido úrico, ajustar alopurinol e orientar profilaxia de crise.",
    minimumData: ["Ácido úrico sérico atual"],
    tags: ["gota", "ácido úrico", "alopurinol", "colchicina", "crise gotosa"],
    soap: {
      subjective: "Crises últimos 12 meses: ___. Última: ___ articulação:___. Alopurinol: ___ mg/dia | Adesão: [ ] Regular [ ] Irregular. Tofos: [ ] Ausentes [ ] Presentes. Dieta (carnes, frutos do mar, álcool): ___",
      assessment: "AU sérico: ___ mg/dL. Meta: <6 mg/dL geral | <5 mg/dL se tofos/artropatia crônica (SBR 2022). [ ] Controlada | [ ] Não controlada.",
      plan: "Alopurinol: manter ou aumentar 100mg a cada 4 sem até meta. NÃO ajustar durante crise aguda — aguardar 2–4 sem pós-crise. [ ] Profilaxia com colchicina 0,5mg/dia durante ajuste. Retorno em ___ meses.",
    },
    exams: "AU sérico, creatinina+TFG (ajuste alopurinol na DRC), lipidograma+glicemia (síndrome metabólica associada).",
    guidance: "Reduzir: carnes vermelhas, frutos do mar, cerveja. Evitar frutose industrializada. Água ≥2L/dia. Manter peso. Não interromper alopurinol durante crise — continuar base.",
    redFlags: ["Crise gotosa polyarticular ou com febre"],
    followup: "AU sérico a cada 3–6 meses.",
    governance: {
      source: "SBR. Consenso Brasileiro para o Diagnóstico e Tratamento da Gota, 2022",
      sourceUrl: "https://www.reumatologia.org.br/",
      status: GV.ativo,
      version: GV.v,
      lastRevised: GV.dt,
    },
  },

  // ── Osteoporose ───────────────────────────────────────────────────────────
  {
    id: "osteoporose_retorno",
    name: "Osteoporose — Retorno",
    description: "Retorno de osteoporose — densitometria, risco de fratura e tratamento",
    category: "cronico",
    whenToUse: "Paciente com osteoporose ou osteopenia significativa — monitorar DXA, adesão ao bisfosfonato e risco de queda.",
    minimumData: ["DXA recente", "Uso atual de bisfosfonato"],
    tags: ["osteoporose", "DXA", "bisfosfonato", "cálcio", "vitamina D", "queda", "fratura"],
    soap: {
      subjective: "Fraturas 12 meses: [ ] Não [ ] Sim — local:___. Quedas: ___ episódios. Uso cálcio/vit D: [ ] Sim dose:___ [ ] Não. Adesão bisfosfonato: [ ] Regular (em jejum c/ água) [ ] Irregular.",
      assessment: "DXA — coluna L1–L4: T-score ___ | fêmur: T-score ___. OMS: [ ] Osteopenia (−1 a −2,5) [ ] Osteoporose (≤−2,5). FRAX: quadril ___% major ___%.",
      plan: "Cálcio 1.000–1.200 mg/dia (dieta preferencialmente). Vit D: 1.000–2.000 UI/dia se deficiente. [ ] Alendronato 70mg 1×/sem VO (jejum, 30min em pé após). [ ] Exercícios resistência/equilíbrio. Avaliar risco de quedas. DXA em 1–2 anos.",
    },
    exams: "DXA (periodicidade conforme risco), vitamina D (25-OH), cálcio, fósforo, PTH (se hipercalcemia), TSH.",
    guidance: "Alendronato: jejum com água cheia, 30min em pé após. Não tomar com cálcio ou antiácidos. Aumentar cálcio: laticínios, couve, sardinha. Sol 15–30 min/dia. Exercício com suporte de peso. Adaptar casa para prevenir quedas.",
    redFlags: ["Nova fratura vertebral ou de quadril"],
    followup: "DXA em 1–2 anos; retornos a cada 6–12 meses.",
    governance: {
      source: "MS. PCDT Osteoporose. Portaria SCTIE/MS nº 39/2022",
      sourceUrl: "https://www.gov.br/saude/pt-br/assuntos/protocolos-clinicos-e-diretrizes-terapeuticas/o/osteoporose",
      status: GV.ativo,
      version: GV.v,
      lastRevised: GV.dt,
    },
  },

  // ── ICC ───────────────────────────────────────────────────────────────────
  {
    id: "icc_retorno",
    name: "ICC — Retorno",
    description: "Retorno de Insuficiência Cardíaca Crônica — classe funcional e otimização",
    category: "cronico",
    whenToUse: "Paciente com ICC crônica — avaliar classe funcional NYHA, adesão e farmacoterapia baseada em evidências.",
    whenNotToUse: "ICC descompensada com dispneia em repouso, edema pulmonar ou shock cardiogênico — referenciar internação.",
    minimumData: ["Classe funcional NYHA", "Peso atual", "PA", "Medicamentos"],
    tags: ["ICC", "insuficiência cardíaca", "NYHA", "FEVE", "iSGLT2", "diurético"],
    soap: {
      subjective: "Dispneia: [ ] Ausente [ ] CF I–II grandes esforços [ ] CF III pequenos [ ] CF IV repouso. Ortopneia: ___ travesseiros. DPN: [ ] Sim [ ] Não. Edema MMII: [ ]/+ /++ /+++. Peso: ___ kg. Ganho ≥2kg/3dias: [ ] Sim [ ] Não. Adesão medicação/restrição sal: ___",
      assessment: "FEVE: [ ] ICFEr <40% [ ] ICFEi 40–49% [ ] ICFEp ≥50%. NYHA: [ ] I [ ] II [ ] III [ ] IV. [ ] Compensada | [ ] Descompensada — avaliar internação.",
      plan: "ICFEr — 4 pilares: IECA/BRA/ARNI + betabloqueador + ARM (espironolactona) + iSGLT2 (empagliflozina). [ ] Revisar/otimizar farmacoterapia. Controle creatinina+potássio. Restrição hídrica 1,5L/dia se CF III–IV. Sal <2g/dia. [ ] Encaminhar cardio: FEVE<35% ou CF III–IV refratária.",
    },
    exams: "BNP/NT-proBNP, creatinina+TFG+potássio, hemograma (anemia), ECG, ecocardiograma.",
    guidance: "Pesagem DIÁRIA (manhã jejum). Procurar se ganhar ≥2kg em 3 dias. Sal <2g/dia. Limitar líquidos ~1,5L se CF III–IV. Não usar anti-inflamatórios. Vacinas: influenza, pneumocócica.",
    redFlags: ["Dispneia em repouso", "Edema pulmonar", "Ganho ponderal rápido (≥2kg/3 dias)"],
    followup: "Retorno em 1–2 meses ou antes se descompensação.",
    governance: {
      source: "SBC. Diretriz Brasileira de Insuficiência Cardíaca Crônica e Aguda, 2023",
      sourceUrl: "https://www.arquivosonline.com.br/",
      status: GV.ativo,
      version: GV.v,
      lastRevised: GV.dt,
    },
  },

  // ── Síndrome Gripal / IRA ──────────────────────────────────────────────────
  {
    id: "sindrome_gripal",
    name: "Síndrome Gripal / IRA — Atendimento",
    description: "Atendimento de síndrome gripal e infecção respiratória aguda na APS",
    category: "agudo",
    whenToUse: "Paciente com quadro respiratório agudo (febre + tosse OU dor garganta início abrupto).",
    whenNotToUse: "Dispneia grave, SpO2 <95%, confusão mental — referenciar emergência.",
    minimumData: ["SpO2", "Sinais de alerta respiratório"],
    tags: ["gripe", "IRA", "oseltamivir", "SpO2", "isolamento", "agudo"],
    soap: {
      subjective: "Início: ___. Febre: [ ] Sim máx:___°C [ ] Não. Sintomas: tosse, coriza, congestão, dor garganta, mialgia, cefaleia? Dispneia: [ ] Sim [ ] Não. Grupo risco: [ ] gestante [ ] ≥60 anos [ ] imunodeprimido [ ] DM/cardiopatia/DRC [ ] nenhum. Vacina gripe esta temporada: [ ] Sim [ ] Não",
      assessment: "Síndrome gripal (critério MS): febre + tosse OU dor garganta início abrupto. Alertas (internação): [ ] SpO2<95% [ ] FR>24 [ ] confusão [ ] hipotensão [ ] cianose [ ] piora após melhora. [ ] Ambulatorial | [ ] Encaminhar hospital.",
      plan: "[ ] Oseltamivir 75mg 2×/dia 5d (se grupo risco ou forma grave). [ ] Paracetamol 500–750mg 6/6h (evitar AAS <18 anos). Isolamento 5–7 dias. Retorno IMEDIATO se: dispneia, SpO2↓, confusão, piora.",
    },
    exams: undefined,
    guidance: "Repouso e hidratação ≥2L/dia. Paracetamol para febre (evitar AAS <18 anos). Isolamento em casa 5–7 dias. Usar máscara se sair. Buscar IMEDIATAMENTE se: falta de ar, lábios azulados, confusão, febre que não cede.",
    redFlags: ["SpO2 <95%", "FR >24 irpm", "Confusão mental", "Piora após melhora inicial"],
    followup: "Retorno em 5–7 dias ou antes se sinais de alerta.",
    governance: {
      source: "MS. Protocolo de Manejo Clínico da Gripe na APS, 2023",
      sourceUrl: "https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/i/influenza",
      status: GV.ativo,
      version: GV.v,
      lastRevised: GV.dt,
    },
  },

  // ── ITU não complicada ────────────────────────────────────────────────────
  {
    id: "itu_nao_complicada",
    name: "ITU não complicada — Atendimento",
    description: "Cistite aguda não complicada em mulher adulta não gestante",
    category: "agudo",
    whenToUse: "Disúria + polaciúria ± urgência miccional em mulher não gestante sem febre/dor lombar.",
    whenNotToUse: "Febre, dor lombar, gestante, homem, ITU recorrente (≥3/ano) — protocolo diferente ou referenciar.",
    minimumData: ["Presença de febre", "Gestação"],
    tags: ["ITU", "cistite", "disúria", "fosfomicina", "nitrofurantoína", "agudo"],
    soap: {
      subjective: "Disúria: [ ] Sim [ ] Não. Polaciúria: [ ] Sim [ ] Não. Urgência: [ ] Sim [ ] Não. Urina turva/odor: [ ] Sim [ ] Não. Hematúria: [ ] Sim [ ] Não. Febre: [ ] Não [ ] Sim — ___°C. Dor lombar: [ ] Não [ ] Sim. ITU recorrente: [ ] Não [ ] Sim. Gestante: [ ] Não [ ] Sim.",
      assessment: "[ ] Cistite não complicada (não gestante, sem febre/dor lombar). [ ] Pielonefrite (febre + dor lombar) — antibiótico mais longo. EAS/urocultura: ___.",
      plan: "Cistite não complicada — 1ª linha (RENAME 2023): [ ] Fosfomicina 3g dose única | [ ] Nitrofurantoína 100mg 2×/dia 5d | [ ] TMP-SMX 160/800mg 2×/dia 3d (se resistência <20%). Retorno se não melhora 48–72h.",
    },
    exams: undefined,
    guidance: "Água ≥2L/dia. Completar antibiótico mesmo se melhorar antes. Higiene íntima: frente para trás. Urinar após relação sexual. Retornar se: febre, dor nas costas, não melhorar em 48h.",
    redFlags: ["Febre", "Dor lombar/costovertebral", "Náuseas/vômitos"],
    followup: "Retorno em 48–72h se não melhora.",
    governance: {
      source: "MS/FEBRASGO. Protocolo Clínico de ITU não Complicada na APS, 2021; MS. RENAME 2023",
      sourceUrl: "https://www.gov.br/saude/pt-br/assuntos/rename",
      status: GV.ativo,
      version: GV.v,
      lastRevised: GV.dt,
    },
  },

  // ── Amigdalite / Faringite ────────────────────────────────────────────────
  {
    id: "amigdalite_faringite",
    name: "Amigdalite / Faringite — Atendimento",
    description: "Faringoamigdalite aguda — score de Centor/McIsaac para decisão de antibiótico",
    category: "agudo",
    whenToUse: "Paciente com dor de garganta aguda — aplicar score Centor/McIsaac para decidir necessidade de antibiótico.",
    minimumData: ["Score Centor/McIsaac", "Febre"],
    tags: ["faringite", "amigdalite", "Centor", "estreptococo", "antibiótico", "agudo"],
    soap: {
      subjective: "Início: ___. Febre: [ ] Sim — ___°C [ ] Não. Tosse: [ ] Ausente (a favor estreptococo) [ ] Presente (sugestivo viral). Coriza/obstrução nasal: [ ] Presente (viral) [ ] Ausente. Deglutição: [ ] Leve [ ] Moderada [ ] Grave (não engole).覆盖覆当て",
      assessment: "Score Centor/McIsaac: ___/4 (≥3 = alto risco streptococcus grupo A). Critérios: febre + ausência tosse + exsudato/amígdalas + sensibilidade cervical. [ ] Alto risco — Cultura/estreptotest | [ ] Baixo risco — sintomáticos.",
      plan: "Alto risco (≥3): [ ] Estreptotest/Cultura positiva → penicilina V 500mg 3×/dia 10d ou amoxicilina 500mg 3×/dia 10d. [ ] Negativo → sintomáticos. Baixo risco: [ ] AINE/paracetamol sintomáticos. Retorno se: piora, dispneia, incapacidade de engolir.",
    },
    exams: undefined,
    guidance: "Sintomáticos: paracetamol ou ibuprofeno para dor e febre. Hidratação. Mel/gargarejo (≥1 ano). Evitar tabaco. Retornar se: piora, dificuldade para engolir saliva, respiração ruidosa, excesso de salivação.",
    redFlags: ["Incapacidade de engolir saliva (disfagia total)", "Desvio de via aérea", "Sialorreia intensa"],
    followup: "Retorno em 5–7 dias ou antes se piora.",
    governance: {
      source: "Score McIsaac (Can Fam Physician, 2003); MS. RENAME 2023",
      sourceUrl: "https://www.gov.br/saude/pt-br/assuntos/rename",
      status: GV.ativo,
      version: GV.v,
      lastRevised: GV.dt,
    },
  },

  // ── Dor Lombar Aguda ──────────────────────────────────────────────────────
  {
    id: "dor_lombar_aguda",
    name: "Dor Lombar Aguda — Atendimento",
    description: "Dor lombar aguda inespecífica — identificar bandeiras vermelhas e manejo conservador",
    category: "agudo",
    whenToUse: "Paciente com dor lombar aguda —筛查出 bandeiras vermelhas e manejar conservadoramente.",
    whenNotToUse: "Bandeiras vermelhas (suspeita de causa específica) — investigar ou referenciar.",
    minimumData: ["Presença de bandeiras vermelhas", "Exame neurológico"],
    tags: ["dor lombar", "coluna", "bandeiras vermelhas", "ciatalgia", "fisioterapia", "agudo"],
    soap: {
      subjective: "Início: ___. Mecanismo: ___. Intensidade (EVA): ___/10. Melhora com repouso: [ ] Sim [ ] Não. Irradiação MI: [ ] Não [ ] Sim — nível:___. Parestesias: [ ] Sim [ ] Não. Disfunção vesical/intestinal: [ ] Não [ ] Sim (EMERGÊNCIA).",
      assessment: "Bandeiras vermelhas: [ ] Febre/perda peso | [ ] Trauma significativo | [ ] Déficit neurológico progressivo | [ ] Disfunção vesical/intestinal (Cauda Equina) | [ ] Dor não melhora em nenhuma posição. [ ] Inespecífica (sem alertas — 90% dos casos) | [ ] Ciatalgia.",
      plan: "[ ] Paracetamol 500–750mg 6/6h ± ibuprofeno 400–600mg 8/8h. [ ] Ciclobenzaprina 5mg 3×/dia ≤7d se espasmo. MANTER ATIVIDADE — repouso piora prognóstico. [ ] Fisioterapia se não melhora 4 sem. Imagem SOMENTE se alertas — não de rotina.",
    },
    exams: undefined,
    guidance: "CONTINUAR SE MOVENDO — repouso piora. Calor local (bolsa quente) para espasmo. Analgésico no horário prescrito. Evitar carregar peso. Raio-X/RM NÃO indicado agora. Buscar IMEDIATAMENTE se: fraqueza na perna, dormência perineal, perda de controle bexiga/intestino.",
    redFlags: ["Disfunção vesical/intestinal (cauda equina)", "Déficit neurológico progressivo", "Febre + dor lombar (infecção)"],
    followup: "Retorno em 4–6 semanas ou antes se alertas.",
    governance: {
      source: "MS. Caderno de Atenção Básica — Dorsalgia, 2023",
      sourceUrl: "https://bvsms.saude.gov.br/",
      status: GV.ativo,
      version: GV.v,
      lastRevised: GV.dt,
    },
  },

  // ── Cefaleia ──────────────────────────────────────────────────────────────
  {
    id: "cefaleia",
    name: "Cefaleia — Atendimento",
    description: "Avaliação de cefaleia primária na APS — triagem de bandeiras vermelhas",
    category: "agudo",
    whenToUse: "Paciente com cefaleia — excluir causas secundárias graves (bandeiras vermelhas), classificar primária.",
    whenNotToUse: "Bandeiras vermelhas presentes — investigar causa secundária e referenciar.",
    minimumData: ["Presença de bandeiras vermelhas", "Características da cefaleia"],
    tags: ["cefaleia", "enxaqueca", "tensional", "bandeiras vermelhas", "triptano", "agudo"],
    soap: {
      subjective: "Frequência: ___ dias/mês. Início: ___. Localização:___. Qualidade:___. Intensidade:___/10. Duração:___. Náuseas/vômitos: [ ] Sim [ ] Não. Foto/fonofobia: [ ] Sim [ ] Não. Aura: [ ] Não [ ] Sim — ___. Analgésico uso: ___ dias/mês. Gatilhos: ___",
      assessment: "Bandeiras vermelhas: [ ] Início súbito (pior cefaleia vida) | [ ] Febre+rigidez nucal | [ ] Déficit neurológico focal | [ ] >50 anos primeiro episódio | [ ] Piora progressiva. Classificação: [ ] Tensional episódica | [ ] Tensional crônica (≥15d) | [ ] Enxaqueca sem aura | [ ] Enxaqueca com aura.",
      plan: "Crise — Tensional: AINE ou paracetamol 750mg. Crise — Enxaqueca leve/moderada: ibuprofeno 400–600mg + metoclopramida 10mg se náusea. Crise — Enxaqueca grave: triptano (sumatriptana 50–100mg VO). Profilaxia ≥4 crises/mês: [ ] propranolol 40–80mg/d | [ ] amitriptilina 10–25mg/noite. Alertar abuso analgésico (>10d/mês → cefaleia crônica).",
    },
    exams: undefined,
    guidance: "Diário de cefaleias: data, duração, intensidade, gatilho, analgésico. Identificar/evitar gatilhos. Horários regulares de sono/refeições. NÃO usar analgésico >10d/mês (causa rebote). Buscar emergência se: início súbito (pior vida), febre+rigidez pescoço, fraqueza súbita.",
    redFlags: ["Início súbito (thunderclap)", "Febre + rigidez nucal", "Déficit neurológico focal", "Primeiro episódio >50 anos"],
    followup: "Retorno em 4–6 semanas para avaliar profilaxia.",
    governance: {
      source: "SBCef. Diretrizes Diagnósticas e Terapêuticas de Cefaleias Primárias do Adulto, 2022",
      sourceUrl: "https://sbcef.org.br/",
      status: GV.ativo,
      version: GV.v,
      lastRevised: GV.dt,
    },
  },

  // ── Saúde da Mulher ────────────────────────────────────────────────────────
  {
    id: "saude_mulher",
    name: "Saúde da Mulher — Rastreio",
    description: "Consulta de saúde da mulher — rastreamentos oncológicos e planejamento reprodutivo",
    category: "preventivo",
    whenToUse: "Mulher em idade reprodutiva ou menopausa — rastrear câncer cervical/mamário e orientar planejamento familiar.",
    minimumData: ["Última citologia", "Última mamografia (se ≥50 anos)"],
    tags: ["mulher", "Papanicolau", "mamografia", "rastreio", "câncer", "contracepção", "preventivo"],
    soap: {
      subjective: "DUM:___. Ciclo:___d. Regularidade:___. Corrimento, dispareunia, sangramento irregular, dismenorreia? Método anticoncepcional: ___ | Adequado: [ ] Sim [ ] Não. Planeja gestação: [ ] Sim [ ] Não. Última citologia: ___ resultado:___. Última mamografia: ___ resultado:___",
      assessment: "Rastreio MS/INCA 2024: Colo útero: Papanicolau 25–64a (anual 2 anos, após 3a). Mama: mamografia 50–69a a cada 2 anos. [ ] Rastreios em dia | [ ] Pendentes: ___. Planejamento: [ ] Adequado [ ] Necessita orientação.",
      plan: "[ ] Coleta Papanicolau (se indicado). [ ] Solicitar mamografia (50–69a ou risco elevado). [ ] Orientar/prescrever método anticoncepcional. [ ] Solicitar sorologias IST se indicado. [ ] Encaminhar colposcopia se citologia ASC-US+ | mastologia se nódulo/BI-RADS≥4. Vacina HPV: oferecer 9–45a.",
    },
    exams: "Citologia oncótica (Papanicolau), mamografia (50–69a), sorologias IST conforme risco.",
    guidance: "Papanicolau detecta alterações anos antes do câncer — não pular. Mamografia a cada 2 anos dos 50–69 anos. Retornar se: corrimento com odor, sangramento fora do período, nódulo na mama. Planeamento familiar: há método para cada momento.",
    redFlags: ["Sangramento vaginal pós-menopausa", "Nódulo mamário palpável"],
    followup: "Anual ou conforme screening — Papanicolau 1–3 anos, mamografia 2 anos.",
    governance: {
      source: "MS/INCA. Diretrizes para Rastreamento do Câncer no Brasil, 2024",
      sourceUrl: "https://www.inca.gov.br/publicacoes/livros/rastreamento-do-cancer",
      status: GV.ativo,
      version: GV.v,
      lastRevised: GV.dt,
    },
  },

  // ── Saúde do Idoso ────────────────────────────────────────────────────────
  {
    id: "saude_idoso",
    name: "Saúde do Idoso — Avaliação",
    description: "Consulta de saúde do idoso — avaliação funcional, cognitiva, quedas e polypharmacy",
    category: "preventivo",
    whenToUse: "Idoso ≥60 anos — avaliação multidimensional: funcional, cognitivo, humor, nutrição, medicações e prevenção de quedas.",
    minimumData: ["Avaliação funcional (AVDs)", "Medicações em uso"],
    tags: ["idoso", "fragilidade", "queda", "cognição", "MEEM", "TUG", "polifarmácia", "preventivo"],
    soap: {
      subjective: "Queixa:___. AVDs básicas (banho, higiene, alimentação, transferência): [ ] Independente [ ] Dependente parcial:___. AVDs instrumentais (compras, finanças, meds): [ ] Preservadas [ ] Comprometidas:___. Quedas 12 meses:___ episódios. Medo cair: [ ] Sim [ ] Não. Cognição (memória): [ ] Sim queixa:___ [ ] Não. Humor (GDS-2):___. Polifarmácia (≥5 meds): [ ] Sim lista:___ [ ] Não.",
      assessment: "[ ] Envelhecimento saudável [ ] Pré-frágil [ ] Frágil. Fenótipo Fried: perda peso, fadiga, fraqueza, lentidão, sedentarismo — ≥3=frágil. MEEM:___/30 (corte: analfabeto≥13|1–7 esc≥18|≥8 esc≥26). TUG:___s (>12s=risco queda).",
      plan: "[ ] Revisar meds — suspender inapropriados (Beers). [ ] Exercícios equilíbrio/fortecimento. [ ] Orientar adaptações domicílio. [ ] Fisioterapia se risco queda/sarcopenia. [ ] Solicitar DXA se >2 anos. [ ] Oftalmologia/audiologia se déficit. [ ] NASF/social se dependência. Vacinas: influenza, pneumocócica, dT/dTpa.",
    },
    exams: "MEEM, TUG, creatinina+TFG, vitamina B12/folato, vitamina D, TSH, hemograma.",
    guidance: "Exercício regular (caminhada, equilíbrio) previne quedas. Adaptar casa: tapetes, corrimãos, iluminação. Não autogerenciar meds — comunicar ao médico. Vacinar gripe anualmente. Manter atividades sociais e cognição (leitura, jogos).",
    redFlags: ["TUG >12s (alto risco de queda)", "MEEM abaixo do corte", "Deterioração funcional rápida"],
    followup: "A cada 6–12 meses conforme vulnerabilidade.",
    governance: {
      source: "MS. CAB nº 19 — Envelhecimento e Saúde da Pessoa Idosa, 2023",
      sourceUrl: "https://bvsms.saude.gov.br/bvs/publicacoes/envelhecimento_saude_pessoa_idosa.pdf",
      status: GV.ativo,
      version: GV.v,
      lastRevised: GV.dt,
    },
  },

  // ── Saúde do Homem ────────────────────────────────────────────────────────
  {
    id: "saude_homem",
    name: "Saúde do Homem — Rastreio",
    description: "Consulta de saúde do homem — rastreamentos, ISTs e prevenção na APS",
    category: "preventivo",
    whenToUse: "Homem adulto — rastreio de canceres (próstata, colorretal), HAS, DM, dislipidemia e fatores de risco comportamentais.",
    minimumData: ["PA", "História familiar de câncer de próstata"],
    tags: ["homem", "PSA", "colorretal", "PSOF", "tabagismo", "álcool", "IST", "preventivo"],
    soap: {
      subjective: "Sintomas urinários (jato fraco, hesitância, noctúria, urgência)? IPSS:___pts. Disfunção erétil: [ ] Sim —___ [ ] Não. Tabagismo: [ ] Nunca [ ] Ex (___anos) [ ] Ativo —___cigarros/dia. Álcool: doses/sem:___. AUDIT-C:___pts (≥3=positivo).",
      assessment: "Rastreios PNAISH 2023: PSA — decisão compartilhada ≥50a (≥45 se afro/histórico familiar). Câncer colorretal: PSOF 50–75a (anual) ou colonoscopia (10 anos). HAS, DM, dislipidemia: conforme risco. ISTs: oferecer teste se risco.",
      plan: "[ ] Decisão compartilhada sobre PSA — explicar prós/contras. [ ] PSOF ou colonoscopia (50–75a). [ ] PA + glicemia + lipidograma (rastreio metabólico). [ ] Abordar tabagismo — aconselhamento + farmacoterapia. [ ] Intervenção breve álcool se AUDIT-C≥3. [ ] Urologia se IPSS>7 ou PSA alterado.",
    },
    exams: "PSA (com decisão compartilhada), PSOF ou colonoscopia, PA, glicemia jejum, lipidograma, sorologias IST conforme risco.",
    guidance: "Consulta preventiva é para todos — não esperar doença. PSA tem limitações — discutir antes de solicitar. Cessar tabagismo é o ato de maior impacto individual em saúde. Álcool >14 doses/semana aumenta risco de câncer, cirrose, cardiopatia. Saúde sexual faz parte da saúde geral.",
    redFlags: ["PSA >4 ng/mL", "Sangramento retal"],
    followup: "Anual ou conforme fatores de risco.",
    governance: {
      source: "MS. PNAISH, 2023",
      sourceUrl: "https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-do-homem",
      status: GV.ativo,
      version: GV.v,
      lastRevised: GV.dt,
    },
  },

  // ── Pré-natal ─────────────────────────────────────────────────────────────
  {
    id: "prenatal",
    name: "Pré-natal — Consulta",
    description: "Consulta de pré-natal de baixo risco na APS — roteiro trimestral e exames",
    category: "preventivo",
    whenToUse: "Gestante em acompanhamento de pré-natal de baixo risco — roteiro por trimestre.",
    whenNotToUse: "Critérios de alto risco (PA ≥140/90, proteinúria, diabetes gestacional, sangramento ativo) — encaminhar pré-natal especializado.",
    minimumData: ["Idade gestacional (IG)", "PA", "Situação vacinal"],
    tags: ["gestante", "pré-natal", "IG", "trimestre", "exames", "vacina", "preventivo"],
    soap: {
      subjective: "IG: ___ sem+___d. DUM:___. DPP:___. Queixas: náuseas, dor pélvica, corrimento, sangramento, cefaleia, edema, visão turva? Movimentos fetais (após 20 sem): [ ] Presentes [ ] Diminuídos. Vacinas: dTpa (≥20 sem): [ ] Feita [ ] Pendente. Influenza: [ ] Feita [ ] Pendente. Suplementação: ácido fólico: [ ] Sim [ ] Não. Ferro (após 20 sem): [ ] Sim [ ] Não.",
      assessment: "Pré-natal de [ ] baixo risco | [ ] alto risco — referenciar. Sinais alerta: PA ≥160/110, sangramento ativo, ausência movimentos fetais, convulsões, cefaleia+visão turva+epigastralgia, edema súbito.",
      plan: "1º trim (≤13 sem): ácido fólico 400mcg/dia (até 12 sem), exames (Ht/Hb, ABO/Rh, glicemia, EAS, sorologias, TSH), USG 11–14 sem. 2º trim (14–27 sem): sulfato ferroso 40mg/d de Fe (após 20 sem), TOTG 75g (24–28 sem), USG morfológico 20–24 sem, dTpa ≥20 sem. 3º trim (28–40 sem): repetir sorologias, cultura SGB (35–37 sem), USG 34–36 sem.",
    },
    exams: "1º trim: Ht/Hb, tipagem ABO/Rh, glicemia jejum, EAS, sorologias (HIV, sífilis, toxo IgM/IgG, rubéola IgG, hepatite B/C), TSH, USG. 2º trim: repetir sorologias, TOTG 75g 24–28 sem, USG morfológico. 3º trim: repetir Ht/Hb, EAS, sorologias, cultura SGB 35–37 sem, USG.",
    guidance: "Consultas mensais até 28 sem, quinzenais 28–36 sem, semanais 36–40 sem. Vacinas: influenza (qualquer idade gestacional), dTpa (após 20 sem). Ferro: tomar com vitamina C, não com café/chá. movimentos fetais: contar a partir de 28 sem. Buscar se: sangramento, dor abdominal intensa, cefaleia forte, visão turva, edema súbito.",
    redFlags: ["PA ≥160/110 mmHg", "Sangramento ativo", "Ausência de movimentos fetais após 28 sem", "Convulsões", "Cefaleia + visão turva + epigastralgia"],
    followup: "Mensal até 28 sem; quinzenal 28–36 sem; semanal 36–40 sem.",
    governance: {
      source: "MS. CAB nº 32 — Atenção ao Pré-Natal de Baixo Risco, 2013 (atualizado 2022); MS. Rede Cegonha",
      sourceUrl: "https://bvsms.saude.gov.br/bvs/publicacoes/cadernos_atencao_basica_32_prenatal.pdf",
      status: GV.ativo,
      version: GV.v,
      lastRevised: GV.dt,
    },
  },

  // ── Puericultura ──────────────────────────────────────────────────────────
  {
    id: "puericultura",
    name: "Puericultura — Crescimento",
    description: "Consulta de puericultura — vigilância de crescimento, desenvolvimento e vacinação",
    category: "preventivo",
    whenToUse: "Criança de 0 a 6 anos — vigilância de crescimento (peso/estatura/PC), marcos do desenvolvimento e atualização vacinal conforme Calendário PNI.",
    minimumData: ["Peso e estatura atuais", "Situação vacinal"],
    tags: ["criança", "puericultura", "crescimento", "desenvolvimento", "vacina", "Caderneta", "preventivo"],
    soap: {
      subjective: "Idade: ___m/___a. Queixa responsáveis:___. Alimentação: [ ] AME até 6m [ ] Misto [ ] Artificial [ ] Diversificada. Introdução alimentar (após 6m): adequada? [ ] Sim [ ] Não. Sono:___h/d. Posição dormir (<1a): [ ] Decúbito dorsal ✓ [ ] Outra — orientar. Desenvolvimento: responsáveis notaram alteração visão/audição/fala/motor? ___",
      assessment: "Peso:___kg (escore-z P/I:___ | P/E:___). Estatura:___cm (E/I:___). IMC/I:___ escore-z. PC:___cm (registrar até 2a). Curvas OMS (Caderneta): [ ] Adequado [ ] Alerta:___. Marcos: [ ] Adequados [ ] Atraso em:___. Vacinação (PNI): [ ] Em dia [ ] Atrasada:___",
      plan: "[ ] Plotar peso/estatura/PC nas curvas OMS (Caderneta). [ ] Atualizar vacinação conforme PNI. [ ] Orientar alimentação por faixa etária. [ ] Ferro profilático 1mg/kg/d de 6 a 24m. [ ] Estimular desenvolvimento: conversar, ler, brincar. [ ] Encaminhar se: atraso marcos, déficit visual/auditivo, crescimento inadequado.",
    },
    exams: undefined,
    guidance: "AME até 6 meses — protege contra infecções e alergias. Introdução alimentar aos 6m: alimentos família sem sal/açúcar/mel (<1a). Dormir de costas (<1a) — previne morte súbita. Telas: evitar <2a, limitar <1h/dia 2–5a. Vacinas em dia — trazer Caderneta sempre. Retornar se: febre, recusa alimentar, choro inconsolável, marcos atrasados.",
    redFlags: ["Crescimento inadequado (escore-z <-2)", "Atraso em ≥2 marcos do desenvolvimento"],
    followup: "Calendário MS: nascimento, 15d, 1, 2, 4, 6, 9, 12, 18, 24m; anual 3–6a.",
    governance: {
      source: "MS. CAB nº 33 — Saúde da Criança: Crescimento e Desenvolvimento, 2012; MS. Caderneta da Criança, 2023",
      sourceUrl: "https://bvsms.saude.gov.br/bvs/publicacoes/saude_crianca_crescimento_desenvolvimento.pdf",
      status: GV.ativo,
      version: GV.v,
      lastRevised: GV.dt,
    },
  },
];
