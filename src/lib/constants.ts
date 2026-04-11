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

export const PREVENTIONS = [
  "Mamografia em dia",
  "Papanicolau em dia",
  "Colonoscopia / PSOF em dia",
  "Densitometria em dia",
  "Influenza (vacinado)",
  "COVID-19 (vacinado)",
  "HPV (vacinado)",
  "HIV (testado)",
  "Hepatite C (anti-HCV)",
  "Hepatite B (anti-HBs)",
  "PSA (disc. compartilhada)",
  // --- Rastreamentos MS/SBC expandidos ---
  "Glicemia de jejum / TOTG",
  "Perfil lipídico",
  "Sífilis (VDRL/teste rápido)",
  "dT / dTpa (vacinado)",
  "Rastreio depressão (PHQ-2)",
  "Avaliação visual (idoso)",
  "Avaliação auditiva (idoso)",
] as const;

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
