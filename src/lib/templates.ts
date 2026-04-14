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

import type { SoapNotes, TemplateCategory, TemplateStatus } from "@/types";

export type { TemplateCategory, TemplateStatus } from "@/types";

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
  governance?: {
    source: string;
    sourceUrl?: string;
    status: TemplateStatus;
    version: string;
    lastRevised: string;
  };

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
    description: "Retorno de HAS crônica — avaliação de controle e adesão",
    category: "cronico",
    whenToUse: "Paciente em uso de anti-hipertensivo, retorno para reavaliar controle. Avaliar adesão, efeitos adversos e risco cardiovascular.",
    whenNotToUse: "Hipertensão de emergência — referenciar imediatamente.",
    minimumData: ["PA atual", "Lista de medicamentos em uso"],
    tags: ["hipertensão", "HAS", "PA", "anti-hipertensivo", "retorno", "adesão"],
    soap: {
      subjective: "PA atual: ___ | Adesão: [ ] Boa [ ] Irregular | Efeitos adversos: ___ | MRPA: ___",
      assessment: "HAS [ ] controlada <140/90 | [ ] não controlada. Meta <130/80 mmHg se DM/DRC/RCV alto. Risco cardiovascular: [ ] baixo [ ] alto",
      plan: "MNF: sal <5g, exercício ≥150min/sem. [ ] Manter [ ] Ajustar anti-hipertensivo. Retorno em ___ meses.",
    },
    exams: "Creatinina+TFG, potássio, glicemia, lipidograma, EAS, ECG (>2 anos).",
    guidance: "Aferir PA em casa e anotar. Sal <5g/dia. Exercício 30min/dia. Não interromper medicação. Buscar se PA >180/110 ou sintomas (cefaleia intensa, dor no peito).",
    redFlags: ["PA >180/110 mmHg", "Sintomas de urgência hipertensiva"],
    followup: "Retorno em 1–3 meses conforme controle.",
    governance: {
      source: "MS. Linha de Cuidado HAS no Adulto, 2021; CAB nº 37, 2013",
      sourceUrl: "https://linhasdecuidado.saude.gov.br/portal/hipertensao-arterial-sistemica-(HAS)-no-adulto/",
      status: GV.ativo,
      version: GV.v,
      lastRevised: GV.dt,
    },
  },

  // ── DM2 ──────────────────────────────────────────────────────────────────
  {
    id: "dm2_retorno",
    name: "DM2 — Retorno",
    description: "Retorno de DM2 crônico — controle glicêmico e rastreio de complicações",
    category: "cronico",
    whenToUse: "Paciente com DM2 em uso de hipoglicemiante, retorno para reavaliar controle e rastrear complicações.",
    whenNotToUse: "Cetoacidose diabética ou emergência hiperglicêmica — referenciar.",
    minimumData: ["HbA1c ou glicemia recente", "Lista de hipoglicemiantes"],
    tags: ["diabetes", "DM2", "HbA1c", "glicemia", "retorno", "pé diabético"],
    soap: {
      subjective: "Sintomas hiperglicemia: [ ] poliúria [ ] polidipsia [ ] visão turva | Hipoglicemia: [ ] Sim freq:___ [ ] Não | Adesão: [ ] Boa [ ] Irregular",
      assessment: "DM2 [ ] controlado (HbA1c <7%) | [ ] não controlado. Meta HbA1c 7,5–8,5% se idoso frágil. Glicemia jejum: ___ mg/dL.",
      plan: "Dieta: reduzir carboidratos simples. [ ] Manter [ ] Ajustar hipoglicemiante. Avaliar pé diabético. Rastrear retinopatia (oftalmologia). Retorno em ___ meses.",
    },
    exams: "HbA1c (a cada 3 meses se instável), glicemia jejum, lipidograma, creatinina+TFG, RAC, EAS.",
    guidance: "Glicemia em jejum ao acordar e pós-refeições. Não pular refeições. Atividade física regular. Inspecionar pés diariamente. Não interromper medicação. Buscar se glicemia >300 ou sintomas de cetoacidose.",
    redFlags: ["Glicemia >300 mg/dL com sintomas", "Cetoacidose (hálito cetônico,confusão)"],
    followup: "HbA1c a cada 3 meses; retornos a cada 3–6 meses.",
    governance: {
      source: "MS. Linha de Cuidado DM2 no Adulto; CAB nº 36, 2013",
      sourceUrl: "https://linhasdecuidado.saude.gov.br/portal/diabetes-mellitus-tipo-2-(DM2)-no-adulto/",
      status: GV.ativo,
      version: GV.v,
      lastRevised: GV.dt,
    },
  },

  // ── HAS + DM2 ─────────────────────────────────────────────────────────────
  {
    id: "has_dm2_retorno",
    name: "HAS + DM2 — Retorno",
    description: "Retorno combinado para HAS e DM2 crônicos",
    category: "cronico",
    whenToUse: "Paciente com ambas HAS e DM2 — avaliar controle conjunto e risco cardiovascular sinérgico.",
    whenNotToUse: "Emergência hipertensiva ou cetoacidose — referenciar.",
    minimumData: ["PA atual", "HbA1c ou glicemia", "Lista de medicamentos"],
    tags: ["hipertensão", "diabetes", "HAS", "DM2", "retorno", "risco cardiovascular"],
    soap: {
      subjective: "PA: ___ | Glicemia: ___ | Adesão: [ ] Boa [ ] Irregular | MRPA/glicemia domiciliar: ___",
      assessment: "HAS: meta PA <130/80 (paciente com DM). DM2: meta HbA1c <7% (adulto geral). Risco cardiovascular alto pela associação.",
      plan: "MNF: dieta hipossódica + restrição carboidratos simples, exercício ≥150min/sem. [ ] Manter [ ] Ajustar farmacos. Avaliar pé diabético. Retorno em ___ meses.",
    },
    exams: "HbA1c, glicemia jejum, lipidograma, creatinina+TFG, RAC, potássio, EAS, ECG.",
    guidance: "Controlar sal E açúcares. Exercício 30min/dia. Monitorar PA e glicemia em casa. Inspecionar pés. Não interromper medicação. Buscar se PA >180/110 ou glicemia >300.",
    redFlags: ["PA >180/110", "Glicemia >300 mg/dL"],
    followup: "Retorno em 2–3 meses.",
    governance: {
      source: "MS. Linha de Cuidado HAS (2021) e DM2 no Adulto; CAB nº 36 e nº 37, 2013",
      sourceUrl: "https://linhasdecuidado.saude.gov.br/portal/hipertensao-arterial-sistemica-(HAS)-no-adulto/",
      status: GV.ativo,
      version: GV.v,
      lastRevised: GV.dt,
    },
  },

  // ── Dislipidemia ──────────────────────────────────────────────────────────
  {
    id: "dislipidemia_retorno",
    name: "Dislipidemia — Retorno",
    description: "Retorno de dislipidemia — metas de LDL por risco cardiovascular",
    category: "cronico",
    whenToUse: "Paciente em uso de estatina — reavaliar metas LDL conforme risco cardiovascular e adesão.",
    minimumData: ["Lipidograma atual", "Medicamentos em uso"],
    tags: ["dislipidemia", "estatina", "LDL", "colesterol", "risco cardiovascular"],
    soap: {
      subjective: "Mialgia (estatina): [ ] Sim [ ] Não | Adesão estatina: [ ] Regular [ ] Irregular | Dieta/exercício: ___",
      assessment: "LDL-c atual: ___ mg/dL. Metas (SBC 2025): <190 risco baixo | <130 intermediário | <100 alto | <70 muito alto | <50 extremo. Meta Não-HDL = LDL + 30.",
      plan: "MNF: reduzir saturadas/trans, aumentar fibras, exercício. [ ] Manter [ ] Iniciar [ ] Ajustar estatina. Associar ezetimiba se meta não atingida. Repetir lipidograma em 3–6 meses.",
    },
    exams: "Lipidograma completo (CT, HDL, LDL, TG, Não-HDL), glicemia jejum, creatinina+TFG, CPK (se mialgia), AST/ALT (se dose alta).",
    guidance: "Reduzir gorduras saturadas (carnes gordas, laticínios integrais, frituras). Eliminar gordura trans. Aumentar fibras (aveia, leguminosas). Relatar dor ou fraqueza muscular ao médico. Não interromper estatina sem orientação.",
    redFlags: ["Mialgia intensa com CPK elevada"],
    followup: "Lipidograma em 3–6 meses após ajuste.",
    governance: {
      source: "SBC. Diretriz Brasileira de Dislipidemias e Prevenção da Aterosclerose, 2025",
      sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12674852/",
      status: GV.ativo,
      version: GV.v,
      lastRevised: GV.dt,
    },
  },

  // ── Hipotireoidismo ───────────────────────────────────────────────────────
  {
    id: "hipotireoidismo_retorno",
    name: "Hipotireoidismo — Retorno",
    description: "Retorno de hipotireoidismo em uso de levotiroxina",
    category: "cronico",
    whenToUse: "Paciente em uso de levotiroxina — reavaliar TSH e ajustar dose se necessário.",
    minimumData: ["TSH recente", "Dose atual de levotiroxina"],
    tags: ["hipotireoidismo", "levotiroxina", "TSH", "tireoide"],
    soap: {
      subjective: "Sintomas hipotireoidismo: fadiga, ganho peso, constipação, intolerance ao frio? [ ] Sim [ ] Não. Sintomas excesso: palpitações, tremor, insônia? [ ] Sim [ ] Não. Uso correto: [ ] Em jejum ≥30min [ ] Irregular. Dose: ___ mcg/dia.",
      assessment: "TSH atual: ___ mUI/L. [ ] Compensado (TSH normal) | [ ] Descompensado. Encaminhar endocrino se dose >2,5 mcg/kg/dia após investigar adesão.",
      plan: "[ ] Manter dose: ___ mcg/dia | [ ] Ajustar (incrementos 12,5–25 mcg). TSH 6–8 sem após ajuste. Se estável: TSH a cada 6–12 meses. Retorno em ___ meses.",
    },
    exams: "TSH (6–12 meses se estável; 6–8 sem após ajuste). T4 livre se TSH alterado.",
    guidance: "Tomar levotiroxina SEMPRE em jejum, 30min antes do café. Não tomar com cálcio, ferro ou antiácidos (intervalo 2–4h). Não interromper. Retornar se: palpitações, tremor, insônia (sinais de excesso).",
    redFlags: ["Sintomas de hipertireoidismo iatrogênico"],
    followup: "TSH 6–8 semanas após ajuste de dose; a cada 6–12 meses se estável.",
    governance: {
      source: "MS. Protocolos de Encaminhamento: Endocrinologia Adulto, 2022",
      sourceUrl: "https://bvsms.saude.gov.br/bvs/publicacoes/protocolos_encaminhamento_atencao_endocrinologia_adulto.pdf",
      status: GV.ativo,
      version: GV.v,
      lastRevised: GV.dt,
    },
  },

  // ── Asma / DPOC ───────────────────────────────────────────────────────────
  {
    id: "asma_dpoc_retorno",
    name: "Asma / DPOC — Retorno",
    description: "Retorno de asma ou DPOC crônico — avaliação de controle e exacerbações",
    category: "cronico",
    whenToUse: "Paciente com asma ou DPOC — avaliar controle, técnica inalatória e exacerbações.",
    minimumData: ["Sintomas atuais", "Uso de broncodilatador de resgate"],
    tags: ["asma", "DPOC", "inalatório", "bronco", "exacerbação", "corticoide"],
    soap: {
      subjective: "Sintomas: tosse, sibilância, dispneia, aperto torácico — frequência: [ ] diaria [ ] >2x/sem [ ] ≤2x/sem [ ] raro. Resgate última sem: ___ vezes. Exacerbações 12 meses: ___ (internações: ___). Tabagismo: [ ] Ativo [ ] Ex (___ anos) [ ] Nunca.",
      assessment: "Asma: [ ] controlada [ ] parcialmente controlada [ ] não controlada. DPOC: [ ] baixo risco (<2 exacerbações/ano) [ ] alto risco (≥2 ou internação). Espirometria FEV1/CVF: ___.",
      plan: "[ ] Manter terapia inalatória | [ ] Ajustar step. Técnica inalatória revisada: [ ] Adequada [ ] Corrigida. Cessação tabágica. DPOC: reabilitação pulmonar se indicado. Retorno em ___ meses ou se exacerbação.",
    },
    exams: "Espirometria (mínimo anual), oximetria, hemograma (se exacerbação), Rx tórax (se exacerbação/inicial).",
    guidance: "Usar inalador corretamente — técnica é fundamental. Resgate >2x/sem = mau controle. Cessar tabagismo. Vacinar influenza anualmente. Buscar se: dispneia piora, escarro amarelo/verde, febre.",
    redFlags: ["SpO2 <92%", "Exacerbação grave com necessidade de oxigênio"],
    followup: "Retorno em 3–6 meses; antes se exacerbação.",
    governance: {
      source: "MS. Linha de Cuidado Asma (2021); MS. Linha de Cuidado DPOC; MS. PCDT Asma, 2021",
      sourceUrl: "https://linhasdecuidado.saude.gov.br/portal/asma/",
      status: GV.ativo,
      version: GV.v,
      lastRevised: GV.dt,
    },
  },

  // ── Obesidade / S. Metabólica ────────────────────────────────────────────
  {
    id: "obesidade_retorno",
    name: "Obesidade / S. Metabólica — Retorno",
    description: "Retorno de obesidade e síndrome metabólica — metas e terapêutica",
    category: "cronico",
    whenToUse: "Paciente com obesidade ou síndrome metabólica — reavaliar metas, adesão a mudança de estilo de vida e indicação de farmacoterapia.",
    minimumData: ["Peso atual", "PA", "Perímetro abdominal"],
    tags: ["obesidade", "síndrome metabólica", "IMC", "peso", "meta"],
    soap: {
      subjective: "Peso atual: ___ kg (anterior: ___ kg). Padrão alimentar: ___. Atividade física: ___. Complicidades: [ ] HAS [ ] DM2 [ ] Dislipidemia [ ] SAOS.",
      assessment: "IMC: ___ kg/m². Obesidade Grau [ ] I (30–34,9) [ ] II (35–39,9) [ ] III (≥40). CA: ___ cm (alerta ≥80 mulher / ≥94 homem). Risco cardio-metabólico: [ ] baixo [ ] moderado [ ] alto.",
      plan: "Meta: redução 5–10% do peso em 6 meses. [ ] Encaminhar nutricionista/NASF. [ ] Farmacoterapia se IMC ≥30 ou ≥35 com comorbidade. Retorno em ___ meses — controlar peso, CA, PA.",
    },
    exams: "Glicemia/HbA1c, lipidograma, TSH, creatinina+TFG, AST/ALT, ácido úrico.",
    guidance: "Meta: perder 5–10% do peso — já melhora comorbidades. Priorizar alimentos in natura. Reduzir ultraprocessados. Exercício: iniciar 150min/sem, progredir para 300min. Dormir 7–9h.",
    redFlags: ["Ganho de peso significativo não intencional"],
    followup: "Retorno em 3–6 meses.",
    governance: {
      source: "MS. CAB nº 38 — Estratégias para o Cuidado da Pessoa com Obesidade, 2014; ABESO. Diretrizes Brasileiras de Obesidade, 2022",
      sourceUrl: "https://bvsms.saude.gov.br/bvs/publicacoes/estrategias_cuidado_pessoa_doenca_cronica_obesidade_cab38.pdf",
      status: GV.ativo,
      version: GV.v,
      lastRevised: GV.dt,
    },
  },

  // ── Depressão ─────────────────────────────────────────────────────────────
  {
    id: "depressao_retorno",
    name: "Depressão — Retorno",
    description: "Retorno de Transtorno Depressivo Maior — resposta ao tratamento e adesão",
    category: "saude_mental",
    whenToUse: "Paciente em uso de antidepressivo — avaliar resposta (PHQ-9), adesão e ideation suicida.",
    whenNotToUse: "Ideação suicida ativa com plano — internação involuntária ou encaminhamento urgente ao CAPS.",
    minimumData: ["PHQ-9 atual", "Adesão ao antidepressivo"],
    tags: ["depressão", "antidepressivo", "PHQ-9", "suicídio", "CAPS", "TCC"],
    soap: {
      subjective: "PHQ-9: ___/27 (0–4 remissão | 5–9 leve | 10–14 moderada | 15–19 mod-grave | 20–27 grave). Humor, sono, apetite, energia: ___. Ideação suicida (item 9): [ ] Ausente [ ] Presente — risco: ___. Adesão: [ ] Regular [ ] Irregular. Psicoterapia (TCC): [ ] Em curso [ ] Não.",
      assessment: "Depressão [ ] leve [ ] moderada [ ] grave. Resposta: [ ] remissão PHQ-9<5 [ ] parcial (≥50% redução) [ ] nenhuma. [ ] Ideação suicida — avaliar urgência.",
      plan: "Aguardar 4–6 sem de dose terapêutica para avaliar resposta. [ ] Manter [ ] Ajustar [ ] Trocar (se 8 sem sem resposta). [ ] Encaminhar CAPS: grave, suicídio, refratariedade. Manter tratamento ≥6 meses pós-remissão.",
    },
    exams: undefined,
    guidance: "Antidepressivo leva 4–6 sem para fazer efeito — não parar. Não parar abruptamente. Atividade física ajuda. Manter rotina de sono. Se pensamentos de se machucar: CVV 188 ou UPA.",
    redFlags: ["Ideação suicida ativa", "Tentativa de suicídio recente"],
    followup: "Retorno em 4–6 semanas (avaliação inicial) ou 2–3 meses (follow-up).",
    governance: {
      source: "MS. Linha de Cuidado para Depressão na Atenção Básica, 2022; DSM-5-TR (APA, 2022)",
      sourceUrl: "https://linhasdecuidado.saude.gov.br/portal/transtornos-de-humor-e-comportamento/",
      status: GV.ativo,
      version: GV.v,
      lastRevised: GV.dt,
    },
  },

  // ── Ansiedade / TAG ───────────────────────────────────────────────────────
  {
    id: "ansiedade_retorno",
    name: "Ansiedade / TAG — Retorno",
    description: "Retorno de Transtorno de Ansiedade Generalizada",
    category: "saude_mental",
    whenToUse: "Paciente com TAG ou ansiedade — avaliar GAD-7, adesão e impacto funcional.",
    minimumData: ["GAD-7 atual", "Adesão ao tratamento"],
    tags: ["ansiedade", "TAG", "GAD-7", "ISRS", "pânico", "CAPS"],
    soap: {
      subjective: "GAD-7: ___/21 (0–4 mínima | 5–9 leve | 10–14 moderada | ≥15 grave). Preocupação, tensão, insônia, irritabilidade: ___. Crises de pânico: [ ] Ausentes [ ] Presentes freq:___. Adesão: [ ] Regular [ ] Irregular. Impacto funcional: ___.",
      assessment: "TAG [ ] leve [ ] moderada [ ] grave. Resposta: [ ] boa (GAD-7<5) [ ] parcial [ ] nenhuma. [ ] Afastar causas orgânicas: hipertireoidismo, arritmia, anemia.",
      plan: "1ª linha: ISRS (sertralina 50–200mg ou escitalopram 10–20mg). Aguardar 4–6 sem. [ ] Manter [ ] Ajustar. [ ] Encaminhar psicoterapia (TCC). [ ] CAPS se grave/refratário. Evitar benzodiazepínicos como manutenção.",
    },
    exams: undefined,
    guidance: "Técnicas de respiração e relaxamento ajudam. Reduzir cafeína e álcool — pioram ansiedade. Exercício regular reduz ansiedade. Manter rotina de sono. Tratamento funciona melhor com remédio + terapia.",
    redFlags: ["Crise de pânico com sintomas vegetativos intensos"],
    followup: "Retorno em 4–6 semanas (avaliação) ou 2–3 meses (follow-up).",
    governance: {
      source: "MS. Linha de Cuidado para Transtornos de Ansiedade na Atenção Básica, 2022; DSM-5-TR (APA, 2022)",
      sourceUrl: "https://linhasdecuidado.saude.gov.br/portal/transtornos-de-humor-e-comportamento/",
      status: GV.ativo,
      version: GV.v,
      lastRevised: GV.dt,
    },
  },

  // ── DRC ───────────────────────────────────────────────────────────────────
  {
    id: "drc_retorno",
    name: "DRC — Retorno",
    description: "Retorno de Doença Renal Crônica — estadiamento KDIGO e nefroproteção",
    category: "cronico",
    whenToUse: "Paciente com DRC conhecida — estadiar, otimizar nefroproteção e monitorar progressão.",
    minimumData: ["TFG atual", "RAC"],
    tags: ["DRC", "rim", "TFG", "KDIGO", "proteinúria", "nefroproteção", "iSGLT2"],
    soap: {
      subjective: "Sintomas urêmicos: edema, astenia, náusea, prurido? [ ] Sim [ ] Não. Adesão: [ ] Boa [ ] Irregular. PA: ___. Causa base: ___.",
      assessment: "TFG (CKD-EPI): ___ mL/min. RAC: ___ mg/g. Estágio: G[ ]1≥90 G2 60–89 G3a 45–59 G3b 30–44 G4 15–29 G5 <15. RAC: A1<30 A2 30–300 A3>300. [ ] Encaminhar nefrologia: TFG<30, RAC>300, queda progressiva.",
      plan: "Nefroproteção: [ ] IECA/BRA (meta PA <130/80) | [ ] iSGLT2 (empagliflozina/dapagliflozina) se DM+DRC. Dieta: restrição sal. Vacinar: influenza, pneumocócica, hepatite B. TFG+RAC a cada 3–12 meses. Retorno em ___ meses.",
    },
    exams: "Creatinina+TFG, RAC, potássio (com IECA/BRA/iSGLT2), hemograma (anemia), sódio, bicarbonato. A partir de G3b: fósforo, PTH, vitamina D.",
    guidance: "Controlar PA rigorosamente — principal fator de proteção. Sal <5g/dia. Não usar anti-inflamatórios (ibuprofeno, diclofenaco). Vacinar gripe e pneumonia. Comunicar mudança no volume de urina ou inchaço.",
    redFlags: ["TFG <30 (G4–G5)", "Proteinúria >300 mg/g em.progressão"],
    followup: "TFG+RAC a cada 3–12 meses conforme estágio.",
    governance: {
      source: "KDIGO 2022 CKD Clinical Practice Guidelines; MS. Linha de Cuidado para DRC",
      sourceUrl: "https://linhasdecuidado.saude.gov.br/portal/doenca-renal-cronica/",
      status: GV.ativo,
      version: GV.v,
      lastRevised: GV.dt,
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
