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
] as const;

export const GENDER_OPTIONS = ["Masculino", "Feminino", "Outro"] as const;

export const RACE_OPTIONS = [
  "Branco",
  "Pardo",
  "Preto",
  "Amarelo",
  "Indígena",
] as const;

export const EXAM_CARDS = [
  {
    id: "lipidograma",
    title: "Lipidograma",
    fields: [
      { key: "ct", label: "CT", unit: "mg/dL" },
      { key: "hdl", label: "HDL", unit: "mg/dL" },
      { key: "ldl", label: "LDL", unit: "mg/dL" },
      { key: "trig", label: "Triglicérides", unit: "mg/dL" },
      { key: "nao_hdl", label: "Não-HDL", unit: "mg/dL" },
    ],
  },
  {
    id: "renal",
    title: "Perfil Renal",
    fields: [
      { key: "cr", label: "Creatinina", unit: "mg/dL" },
      { key: "ur", label: "Ureia", unit: "mg/dL" },
      { key: "au", label: "Ác. Úrico", unit: "mg/dL" },
      { key: "tfg", label: "TFG", unit: "mL/min", auto: true },
      { key: "rac", label: "R.A/C", unit: "mg/g" },
    ],
  },
  {
    id: "hepatico",
    title: "Perfil Hepático",
    fields: [
      { key: "ast", label: "AST/TGO", unit: "U/L" },
      { key: "alt", label: "ALT/TGP", unit: "U/L" },
      { key: "ggt", label: "GamaGT", unit: "U/L" },
      { key: "fa", label: "Fosf. Alc.", unit: "U/L" },
      { key: "bt", label: "Bilirrubina T.", unit: "mg/dL" },
    ],
  },
  {
    id: "glicemico",
    title: "Perfil Glicêmico",
    fields: [
      { key: "gj", label: "Glicemia J.", unit: "mg/dL" },
      { key: "hba1c", label: "HbA1c", unit: "%" },
      { key: "insulina", label: "Insulina", unit: "µU/mL" },
      { key: "homa_ir", label: "HOMA-IR", unit: "" },
      { key: "peptc", label: "Pept. C", unit: "ng/mL" },
    ],
  },
  {
    id: "eletrolitos",
    title: "Eletrólitos",
    fields: [
      { key: "k", label: "K", unit: "mEq/L" },
      { key: "na", label: "Na", unit: "mEq/L" },
      { key: "ca", label: "Ca", unit: "mg/dL" },
      { key: "mg_exam", label: "Mg", unit: "mg/dL" },
      { key: "p", label: "Fósforo", unit: "mg/dL" },
    ],
  },
  {
    id: "vitaminas",
    title: "Vitaminas",
    fields: [
      { key: "vitd", label: "Vit. D", unit: "ng/mL" },
      { key: "vitb12", label: "Vit. B12", unit: "pg/mL" },
      { key: "folato", label: "Folato", unit: "ng/mL" },
      { key: "zinco", label: "Zinco", unit: "µg/dL" },
    ],
  },
  {
    id: "hemograma",
    title: "Hemograma",
    fields: [
      { key: "hb", label: "Hb", unit: "g/dL" },
      { key: "ht", label: "Ht", unit: "%" },
      { key: "vcm", label: "VCM", unit: "fL" },
      { key: "leuco", label: "Leucócitos", unit: "/mm³" },
      { key: "plaq", label: "Plaquetas", unit: "mil/mm³" },
    ],
  },
  {
    id: "tireoide",
    title: "Tireoide",
    fields: [
      { key: "tsh", label: "TSH", unit: "mUI/L" },
      { key: "t4l", label: "T4L", unit: "ng/dL" },
      { key: "t3l", label: "T3L", unit: "pg/mL" },
      { key: "anti_tpo", label: "Anti-TPO", unit: "UI/mL" },
      { key: "anti_tg", label: "Anti-TG", unit: "UI/mL" },
    ],
  },
  {
    id: "ferro",
    title: "Cinética do Ferro",
    fields: [
      { key: "ferritina", label: "Ferritina", unit: "ng/mL" },
      { key: "ferro_serico", label: "Ferro sérico", unit: "µg/dL" },
      { key: "transferrina", label: "Transferrina", unit: "mg/dL" },
      { key: "sat_transferrina", label: "Saturação", unit: "%" },
      { key: "ctlf", label: "CTLF", unit: "µg/dL" },
    ],
  },
  {
    id: "inflamatorios",
    title: "Inflamatórios",
    fields: [
      { key: "pcr", label: "PCR", unit: "mg/L" },
      { key: "vhs", label: "VHS", unit: "mm/h" },
      { key: "eas", label: "EAS", unit: "" },
      { key: "psof", label: "PSOF", unit: "" },
      { key: "psa", label: "PSA", unit: "ng/mL" },
    ],
  },
] as const;
