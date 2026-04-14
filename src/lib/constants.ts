export const PROBLEMS = [
  "HAS",
  "DM2",
  "Tabagismo",
  "Obesidade",
  "DHGNA",
  "DRC",
  "Hipotireoidismo",
  "Dislipidemia",
  "Ansiedade / Depressão",
  "Asma / DPOC",
  "ICC",
  "Fibrilação Atrial",
  "Gota",
  "Osteoporose",
] as const;

/**
 * Lista de prevenções / rastreamentos exibidos ao médico na tela de consulta.
 *
 * Hierarquia de fontes (em ordem de prioridade):
 * 1. Ministério da Saúde / INCA / Portarias / eSUS APS / Linhas de Cuidado
 * 2. Calendário Nacional/Técnico de Vacinação vigente
 * 3. Caderno de Atenção Primária nº 29 (Rastreamento) — apenas fallback histórico
 *    quando não houver regra mais nova e mais específica
 *
 * Categorias (UI):
 * - "padrao"    : Prevenção padrão APS/SUS (INCA, PNI, MS — rastreamento poblacional)
 * - "contextual" : Testagens e rastreios por oportunidade (não universal por idade)
 * - "vacinais"   : Situação vacinal (PNI/MS)
 * - "decisao"    : Decisão compartilhada com o paciente
 *
 * Regras de exclusão de output (output-labels.ts):
 * - isPSA(): PSA — fora da UI e fora dos outputs
 * - isTriageItem(): escalas — existem apenas em Triagens Clínicas (PHQ-9, PHQ-2, IVCF-20, etc.)
 * - isContextualExclude(): densitometria e avaliações funcionais — não entram no output PREVENÇÕES
 *
 * Ao adicionar item: definir categoria + referenciar fonte no código (clinical-rules.ts).
 */
export const PREVENTIONS = [
  // ── Padrão APS/SUS ──────────────────────────────────────────────────────────
  "Mamografia em dia",
  "Rastreamento do colo do útero em dia",
  "dT em dia",

  // ── Contextual por risco / oportunidade ────────────────────────────────────
  "Testagem HIV em dia",
  "Testagem hepatite C em dia",
  "Vacinação hepatite B em dia",
  "Testagem sífilis em dia",
  "Rastreio glicêmico em dia",
  "Perfil lipídico em dia",
  "Vacina influenza em dia",
  "Vacina COVID-19 em dia",
  "Vacina HPV em dia",

  // ── Decisão compartilhada ───────────────────────────────────────────────────
  "Densitometria óssea",

  // ── Oculto por enquanto ─────────────────────────────────────────────────────
  // "Rastreio de depressão em dia (PHQ-2/PHQ-9)" — movido para Triagens Clínicas (escala, não prevenção factual)
  // "IVCF-20: avaliar" — movido para Triagens Clínicas (escala, não prevenção factual)
  // "Colonoscopia / PSOF em dia" — ocultado: diretriz nacional em consulta pública;
  // sem regra SUS fechada. Manter como protocolo local / contextual de risco se necessário.
  //
  // "Hepatite B (anti-HBs)" — removido: anti-HBs universal não é estratégia PNI.
  // Substituído por "Vacinação hepatite B em dia".
  //
  // "Avaliação visual/auditiva (idoso)" — movida para triagens-section como
  // avaliação complementar presencial, não prevenção isolada.
  //
  // "PSA" — ocultado: fora do escopo preventivo padrão SUS/INCA para esta versão.
  // Decisão compartilhada não entra no output. PSA fica totalmente fora do produto.
] as const;

/** Meta-categorias para organização visual na UI */
/** Nota: PHQ-2/PHQ-9 e IVCF-20 foram removidos desta categorização — existem apenas na seção Triagens Clínicas. */
/** Regra: PREVENTION_CATEGORIES só contém prevenção factual. Escalas vivem em Triagens Clínicas. */
export const PREVENTION_CATEGORIES = {
  padrao: [
    "Mamografia em dia",
    "Rastreamento do colo do útero em dia",
    "dT em dia",
  ] as string[],
  contextual: [
    "Testagem HIV em dia",
    "Testagem hepatite C em dia",
    "Testagem sífilis em dia",
    "Rastreio glicêmico em dia",
    "Perfil lipídico em dia",
  ] as string[],
  vacinais: [
    "Vacinação hepatite B em dia",
    "Vacina influenza em dia",
    "Vacina COVID-19 em dia",
    "Vacina HPV em dia",
  ] as string[],
  decisao: [
    "Densitometria óssea",
  ] as string[],
} as const;

export const GENDER_OPTIONS = ["Masculino", "Feminino", "Outro"] as const;

export const RACE_OPTIONS = [
  "Branco",
  "Pardo",
  "Preto",
  "Amarelo",
  "Indígena",
] as const;

/**
 * Cards principais — sempre visíveis no grid 3 colunas.
 * primaryFields: sempre visíveis no card.
 * secondaryFields: expandidos ao clicar "Mostrar mais".
 */
export const PRIMARY_EXAM_CARDS = [
  {
    id: "lipidograma",
    title: "Lipidograma",
    primaryFields: [
      { key: "ct", label: "Colesterol total", unit: "mg/dL" },
      { key: "hdl", label: "HDL-c", unit: "mg/dL" },
      { key: "ldl", label: "LDL-c", unit: "mg/dL" },
      { key: "trig", label: "Triglicerídeos", unit: "mg/dL" },
      { key: "nao_hdl", label: "Não-HDL-c", unit: "mg/dL", auto: true },
    ],
    secondaryFields: [] as readonly { key: string; label: string; unit: string; auto?: boolean }[],
  },
  {
    id: "glicemico",
    title: "Perfil glicêmico",
    primaryFields: [
      { key: "gj", label: "Glicemia", unit: "mg/dL" },
      { key: "hba1c", label: "HbA1c", unit: "%" },
    ],
    secondaryFields: [] as readonly { key: string; label: string; unit: string; auto?: boolean }[],
  },
  {
    id: "renal",
    title: "Perfil renal",
    primaryFields: [
      { key: "cr", label: "Creatinina", unit: "mg/dL" },
      { key: "rac", label: "RAC / UACR urinária", unit: "mg/g" },
    ],
    secondaryFields: [
      { key: "ur", label: "Ureia", unit: "mg/dL" },
      { key: "au", label: "Ácido úrico", unit: "mg/dL" },
    ] as const,
  },
  {
    id: "hepatico",
    title: "Perfil hepático",
    primaryFields: [
      { key: "ast", label: "AST / TGO", unit: "U/L" },
      { key: "alt", label: "ALT / TGP", unit: "U/L" },
      { key: "ggt", label: "GGT", unit: "U/L" },
      { key: "fa", label: "Fosfatase alcalina", unit: "U/L" },
      { key: "bt", label: "Bilirrubina total", unit: "mg/dL" },
    ],
    secondaryFields: [
      { key: "albumina", label: "Albumina", unit: "g/dL" },
    ] as const,
  },
  {
    id: "hemograma",
    title: "Hemograma",
    primaryFields: [
      { key: "hb", label: "Hemoglobina", unit: "g/dL" },
      { key: "ht", label: "Hematócrito", unit: "%" },
      { key: "vcm", label: "VCM", unit: "fL" },
      { key: "leuco", label: "Leucócitos", unit: "/mm³" },
      { key: "plaq", label: "Plaquetas", unit: "mil/mm³" },
    ],
    secondaryFields: [] as readonly { key: string; label: string; unit: string; auto?: boolean }[],
  },
  {
    id: "tireoide",
    title: "Tireoide",
    primaryFields: [
      { key: "tsh", label: "TSH", unit: "mUI/L" },
      { key: "t4l", label: "T4 livre", unit: "ng/dL" },
    ],
    secondaryFields: [
      { key: "t3l", label: "T3 livre", unit: "pg/mL" },
      { key: "anti_tpo", label: "Anti-TPO", unit: "UI/mL" },
      { key: "anti_tg", label: "Anti-TG", unit: "UI/mL" },
    ] as const,
  },
  {
    id: "inflamacao",
    title: "Inflamação",
    primaryFields: [
      { key: "pcr", label: "PCR", unit: "mg/L" },
    ],
    secondaryFields: [
      { key: "vhs", label: "VHS", unit: "mm/h" },
    ] as const,
  },
] as const;

/**
 * Cards adicionais — exibidos em seção recolhível ("Mostrar adicionais").
 */
export const ADDITIONAL_EXAM_CARDS = [
  {
    id: "ferro",
    title: "Cinética do ferro",
    primaryFields: [
      { key: "ferritina", label: "Ferritina", unit: "ng/mL" },
      { key: "ferro_serico", label: "Ferro sérico", unit: "µg/dL" },
      { key: "transferrina", label: "Transferrina", unit: "mg/dL" },
      { key: "sat_transferrina", label: "Saturação de transferrina", unit: "%" },
      { key: "ctlf", label: "CTLF / TIBC", unit: "µg/dL" },
    ],
    secondaryFields: [] as readonly { key: string; label: string; unit: string; auto?: boolean }[],
  },
  {
    id: "eletrolitos",
    title: "Eletrólitos",
    primaryFields: [
      { key: "na", label: "Sódio", unit: "mEq/L" },
      { key: "k", label: "Potássio", unit: "mEq/L" },
      { key: "ca", label: "Cálcio", unit: "mg/dL" },
      { key: "mg_exam", label: "Magnésio", unit: "mg/dL" },
      { key: "p", label: "Fósforo", unit: "mg/dL" },
    ],
    secondaryFields: [] as readonly { key: string; label: string; unit: string; auto?: boolean }[],
  },
  {
    id: "vitaminas",
    title: "Vitaminas e micronutrientes",
    primaryFields: [
      { key: "vitd", label: "Vitamina D", unit: "ng/mL" },
      { key: "vitb12", label: "Vitamina B12", unit: "pg/mL" },
      { key: "folato", label: "Folato", unit: "ng/mL" },
      { key: "zinco", label: "Zinco", unit: "µg/dL" },
    ],
    secondaryFields: [] as readonly { key: string; label: string; unit: string; auto?: boolean }[],
  },
  {
    id: "urina-rastreios",
    title: "Urina e rastreios",
    primaryFields: [
      { key: "eas", label: "EAS", unit: "" },
      { key: "psof", label: "PSOF", unit: "" },
      { key: "psa", label: "PSA", unit: "ng/mL" },
    ],
    secondaryFields: [] as readonly { key: string; label: string; unit: string; auto?: boolean }[],
  },
  {
    id: "lipidios-avancados",
    title: "Lipídios avançados",
    primaryFields: [
      { key: "apob", label: "ApoB", unit: "mg/dL" },
      { key: "lpa", label: "Lp(a)", unit: "mg/dL" },
    ],
    secondaryFields: [] as readonly { key: string; label: string; unit: string; auto?: boolean }[],
  },
] as const;

/** Todas as chaves de campos de exames (para persistência e clear) */
export const EXAM_FIELD_KEYS: string[] = [
  ...PRIMARY_EXAM_CARDS.flatMap((c) => [
    ...c.primaryFields.map((f) => f.key),
    ...(c.secondaryFields as readonly { key: string }[]).map((f) => f.key),
  ]),
  ...ADDITIONAL_EXAM_CARDS.flatMap((c) => [
    ...c.primaryFields.map((f) => f.key),
    ...(c.secondaryFields as readonly { key: string }[]).map((f) => f.key),
  ]),
];

/**
 * @deprecated Use PRIMARY_EXAM_CARDS e ADDITIONAL_EXAM_CARDS.
 * Mantido para compatibilidade com esus-generator.ts e output-generators/detalhado.ts.
 */
export const EXAM_CARDS = [
  ...PRIMARY_EXAM_CARDS.map((c) => ({
    ...c,
    fields: [...c.primaryFields, ...(c.secondaryFields as readonly { key: string; label: string; unit: string; auto?: boolean }[])],
  })),
  ...ADDITIONAL_EXAM_CARDS.map((c) => ({
    ...c,
    fields: [...c.primaryFields, ...(c.secondaryFields as readonly { key: string; label: string; unit: string; auto?: boolean }[])],
  })),
];
