export interface ProtocolDrug {
  drugId: string;
  posologyOverride?: string;
}

export interface Protocol {
  key: string;
  label: string;
  subtitle: string;
  icon: string;
  drugs: ProtocolDrug[];
}

export const PROTOCOLS: Protocol[] = [
  // ═══════════════════════════════════════════════════════════
  // INFECÇÕES
  // ═══════════════════════════════════════════════════════════
  {
    key: "itu",
    label: "ITU Não Complicada",
    subtitle: "Infecção urinária baixa em mulher adulta",
    icon: "💊",
    drugs: [
      { drugId: "nitrofurantoina-100", posologyOverride: "Tomar 1 cápsula de 6/6h por 5 dias" },
      { drugId: "fenazopiridina-100", posologyOverride: "Tomar 1 comprimido de 8/8h por 2 dias (alívio sintomático)" },
    ],
  },
  {
    key: "amigdalite",
    label: "Amigdalite Bacteriana",
    subtitle: "Escore Centor ≥ 3",
    icon: "🦠",
    drugs: [
      { drugId: "amoxicilina-500", posologyOverride: "Tomar 1 cápsula de 8/8h por 10 dias" },
      { drugId: "ibuprofeno-600", posologyOverride: "Tomar 1 comprimido de 8/8h por 5 dias, com alimento" },
    ],
  },
  {
    key: "sinusite",
    label: "Sinusite Bacteriana",
    subtitle: "Sintomas > 10 dias ou bifásica",
    icon: "🧪",
    drugs: [
      { drugId: "amoxicilina-clavulanato-875", posologyOverride: "Tomar 1 comprimido de 12/12h por 10 dias" },
      { drugId: "prednisona-20", posologyOverride: "Tomar 1 comprimido pela manhã por 5 dias" },
    ],
  },
  {
    key: "pneumonia-aps",
    label: "Pneumonia Adquirida na Comunidade",
    subtitle: "PAC leve — tratamento ambulatorial",
    icon: "🫁",
    drugs: [
      { drugId: "amoxicilina-500", posologyOverride: "Tomar 1 cápsula de 8/8h por 7-10 dias" },
      { drugId: "azitromicina-500", posologyOverride: "Tomar 1 comprimido 1x/dia por 3 dias" },
    ],
  },
  {
    key: "erisipela",
    label: "Erisipela / Celulite",
    subtitle: "Infecção de pele e partes moles",
    icon: "🔴",
    drugs: [
      { drugId: "amoxicilina-clavulanato-875", posologyOverride: "Tomar 1 comprimido de 12/12h por 10-14 dias" },
      { drugId: "dipirona-500", posologyOverride: "Tomar 1 comprimido de 6/6h se dor ou febre" },
    ],
  },
  {
    key: "impetigo",
    label: "Impetigo",
    subtitle: "Infecção superficial de pele",
    icon: "🟡",
    drugs: [
      { drugId: "cefalexina-500", posologyOverride: "Tomar 1 cápsula de 6/6h por 7 dias" },
      { drugId: "mupirocina-20", posologyOverride: "Aplicar na área afetada 3x/dia por 7-10 dias" },
    ],
  },
  {
    key: "herpes-zoster",
    label: "Herpes Zoster",
    subtitle: "Tratamento antiviral precoce",
    icon: "🔥",
    drugs: [
      { drugId: "aciclovir-800", posologyOverride: "Tomar 1 comprimido de 4/4h (5x/dia) por 7 dias" },
      { drugId: "dipirona-500", posologyOverride: "Tomar 1 comprimido de 6/6h se dor" },
    ],
  },
  {
    key: "candidiase-oral",
    label: "Candidíase Oral (Sapinho)",
    subtitle: "Tratamento tópico",
    icon: "👄",
    drugs: [
      { drugId: "nistatina-100000-5", posologyOverride: "Aplicar 1mL na boca 4x/dia após alimentação por 7-14 dias" },
      { drugId: "fluconazol-150", posologyOverride: "Tomar 1 cápsula, dose única (casos refratários)" },
    ],
  },
  {
    key: "tinha",
    label: "Tinha (Dermatofitose)",
    subtitle: "Infecção fúngica de pele",
    icon: "🔵",
    drugs: [
      { drugId: "cetoconazol-20-creme", posologyOverride: "Aplicar na área afetada 1-2x/dia por 2-4 semanas" },
      { drugId: "terbinafina-250", posologyOverride: "Tomar 1 comprimido 1x/dia por 2-4 semanas (casos extensos)" },
    ],
  },
  {
    key: "onicomocose",
    label: "Onicomicose",
    subtitle: "Infecção fúngica de unha",
    icon: "💅",
    drugs: [
      { drugId: "terbinafina-250", posologyOverride: "Tomar 1 comprimido 1x/dia por 6 semanas (unhas das mãos) ou 12 semanas (unhas dos pés)" },
    ],
  },
  {
    key: "escabiose",
    label: "Escabiose (Sarna)",
    subtitle: "Tratamento do paciente e contactantes",
    icon: "🕷️",
    drugs: [
      { drugId: "permetrina-50", posologyOverride: "Aplicar no corpo todo do pescoço para baixo, deixar 8-14h e lavar. Repetir após 7 dias." },
      { drugId: "ivermectina-6", posologyOverride: "Tomar 1 comprimido de 200mcg/kg, dose única. Repetir após 14 dias." },
    ],
  },
  {
    key: "pediculose",
    label: "Pediculose (Piolho)",
    subtitle: "Tratamento do couro cabeludo",
    icon: "🐛",
    drugs: [
      { drugId: "permetrina-50", posologyOverride: "Aplicar no couro cabeludo, deixar 10min e enxaguar. Repetir após 7 dias." },
      { drugId: "ivermectina-6", posologyOverride: "Tomar 1 comprimido de 200mcg/kg, dose única. Repetir após 14 dias." },
    ],
  },
  {
    key: "giardiase",
    label: "Giardíase",
    subtitle: "Infecção por Giardia lamblia",
    icon: "🔬",
    drugs: [
      { drugId: "metronidazol-250", posologyOverride: "Tomar 1 comprimido de 8/8h por 7 dias" },
      { drugId: "secnidazol-1", posologyOverride: "Dissolver 1 sachê em água, dose única (alternativa)" },
    ],
  },
  {
    key: "amebiase",
    label: "Amebíase",
    subtitle: "Infecção por Entamoeba histolytica",
    icon: "🔬",
    drugs: [
      { drugId: "metronidazol-250", posologyOverride: "Tomar 1 comprimido de 8/8h por 10 dias" },
    ],
  },
  {
    key: "verminose",
    label: "Helmintíase (Desverminação)",
    subtitle: "Tratamento empírico",
    icon: "🪱",
    drugs: [
      { drugId: "albendazol-400", posologyOverride: "Tomar 1 comprimido, dose única. Repetir após 14 dias se necessário." },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // DOR / INFLAMAÇÃO
  // ═══════════════════════════════════════════════════════════
  {
    key: "dor-aguda",
    label: "Dor Aguda",
    subtitle: "Analgesia escalonada leve a moderada",
    icon: "⚡",
    drugs: [
      { drugId: "dipirona-500", posologyOverride: "Tomar 1 comprimido de 6/6h se dor ou febre" },
      { drugId: "ibuprofeno-600", posologyOverride: "Tomar 1 comprimido de 8/8h por 5 dias, com alimento" },
      { drugId: "omeprazol-20", posologyOverride: "Tomar 1 cápsula em jejum enquanto usar AINE" },
    ],
  },
  {
    key: "dor-cronica",
    label: "Dor Crônica",
    subtitle: "Manejo de dor crônica não oncológica",
    icon: "🔁",
    drugs: [
      { drugId: "dipirona-500", posologyOverride: "Tomar 1 comprimido de 6/6h se dor" },
      { drugId: "amitriptilina-25", posologyOverride: "Tomar 1 comprimido à noite. Aumentar gradualmente se necessário." },
      { drugId: "gabapentina-300", posologyOverride: "Tomar 1 cápsula à noite. Aumentar gradualmente até 3x/dia." },
    ],
  },
  {
    key: "colica-nefretica",
    label: "Cólica Nefrética",
    subtitle: "Tratamento agudo da cólica renal",
    icon: "🫘",
    drugs: [
      { drugId: "diclofenaco-50", posologyOverride: "Tomar 1 comprimido de 8/8h por 5 dias, com alimento" },
      { drugId: "butilbrometo-escopolamina-10", posologyOverride: "Tomar 2 comprimidos de 6/8h se cólica" },
      { drugId: "dipirona-500", posologyOverride: "Tomar 1 comprimido de 6/6h se dor" },
    ],
  },
  {
    key: "colica-biliar",
    label: "Cólica Biliar",
    subtitle: "Tratamento sintomático",
    icon: "🟢",
    drugs: [
      { drugId: "diclofenaco-50", posologyOverride: "Tomar 1 comprimido de 8/8h por 5 dias" },
      { drugId: "butilbrometo-escopolamina-10", posologyOverride: "Tomar 2 comprimidos de 6/8h se cólica" },
    ],
  },
  {
    key: "gota-aguda",
    label: "Crise Aguda de Gota",
    subtitle: "Tratamento da crise aguda",
    icon: "🦶",
    drugs: [
      { drugId: "colchicina-0,5", posologyOverride: "Tomar 1 comprimido de 12/12h até melhora (máx 6mg/dia)" },
      { drugId: "ibuprofeno-600", posologyOverride: "Tomar 1 comprimido de 8/8h por 5-7 dias, com alimento" },
      { drugId: "prednisona-20", posologyOverride: "Tomar 1 comprimido pela manhã por 5-7 dias (se contraindicação a AINE)" },
    ],
  },
  {
    key: "gota-cronica",
    label: "Gota — Profilaxia",
    subtitle: "Tratamento de manutenção",
    icon: "🛡️",
    drugs: [
      { drugId: "alopurinol-100", posologyOverride: "Tomar 1 comprimido 1x/dia, após refeição. Aumentar gradualmente." },
      { drugId: "colchicina-0,5", posologyOverride: "Tomar 1 comprimido 1x/dia por 3-6 meses (profilaxia na introdução do alopurinol)" },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // CARDIOVASCULAR
  // ═══════════════════════════════════════════════════════════
  {
    key: "has",
    label: "HAS — Início de Tratamento",
    subtitle: "Hipertensão estágio 1-2 sem DM",
    icon: "❤️",
    drugs: [
      { drugId: "losartana-50", posologyOverride: "Tomar 1 comprimido 1x/dia. Reavaliação em 4 semanas." },
      { drugId: "atorvastatina-20", posologyOverride: "Tomar 1 comprimido à noite" },
    ],
  },
  {
    key: "has-estagio3",
    label: "HAS — Estágio 3 (PA ≥ 180/120)",
    subtitle: "Hipertensão grave — associação",
    icon: "🚨",
    drugs: [
      { drugId: "losartana-50", posologyOverride: "Tomar 1 comprimido 1x/dia" },
      { drugId: "anlodipino-5", posologyOverride: "Tomar 1 comprimido 1x/dia" },
      { drugId: "hidroclorotiazida-25", posologyOverride: "Tomar 1 comprimido pela manhã" },
    ],
  },
  {
    key: "ic",
    label: "Insuficiência Cardíaca",
    subtitle: "Tratamento base (IECA/BRAs + betabloqueador + diurético)",
    icon: "💔",
    drugs: [
      { drugId: "enalapril-10", posologyOverride: "Tomar 1 comprimido de 12/12h. Iniciar com 5mg se naïve." },
      { drugId: "carvedilol-12,5", posologyOverride: "Tomar 1 comprimido de 12/12h. Iniciar com 6,25mg se naïve." },
      { drugId: "espironolactona-25", posologyOverride: "Tomar 1 comprimido 1x/dia. Monitorar K+." },
      { drugId: "furosemida-40", posologyOverride: "Tomar 1 comprimido pela manhã. Ajustar conforme edema." },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // ENDOCRINO / METABÓLICO
  // ═══════════════════════════════════════════════════════════
  {
    key: "dm2",
    label: "DM2 — Início de Tratamento",
    subtitle: "Diabetes tipo 2 sem insulina",
    icon: "🩸",
    drugs: [
      { drugId: "metformina-850", posologyOverride: "Tomar 1 comprimido ao almoço por 2 semanas, depois 1 ao almoço + 1 ao jantar" },
    ],
  },
  {
    key: "dm2-associacao",
    label: "DM2 — Segunda Linha",
    subtitle: "HbA1c não controlada com metformina",
    icon: "💉",
    drugs: [
      { drugId: "metformina-850", posologyOverride: "Manter 1 comprimido de 12/12h" },
      { drugId: "glibenclamida-5", posologyOverride: "Tomar 1 comprimido pela manhã, antes do café" },
    ],
  },
  {
    key: "hipotireoidismo",
    label: "Hipotireoidismo",
    subtitle: "Reposição de levotiroxina",
    icon: "🦋",
    drugs: [
      { drugId: "levotiroxina-50", posologyOverride: "Tomar 1 comprimido em jejum, 30min antes do café. Reavaliar TSH em 6-8 semanas." },
    ],
  },
  {
    key: "hipotireoidismo-idoso",
    label: "Hipotireoidismo — Idoso/Cardiopata",
    subtitle: "Iniciar com dose baixa",
    icon: "🦋",
    drugs: [
      { drugId: "levotiroxina-25", posologyOverride: "Tomar 1 comprimido em jejum, 30min antes do café. Aumentar a cada 6-8 semanas." },
    ],
  },
  {
    key: "hipertireoidismo",
    label: "Hipertireoidismo",
    subtitle: "Tratamento inicial com metimazol",
    icon: "⚡",
    drugs: [
      { drugId: "metimazol-10", posologyOverride: "Tomar 1 comprimido de 8/8h. Reavaliar em 4-6 semanas." },
      { drugId: "propranolol-40", posologyOverride: "Tomar 1 comprimido de 8/8h para controle de sintomas adrenérgicos." },
    ],
  },
  {
    key: "dislipidemia",
    label: "Dislipidemia",
    subtitle: "Tratamento com estatina",
    icon: "🧬",
    drugs: [
      { drugId: "atorvastatina-20", posologyOverride: "Tomar 1 comprimido à noite. Reavaliar lipidograma em 3 meses." },
    ],
  },
  {
    key: "dislipidemia-mista",
    label: "Dislipidemia Mista",
    subtitle: "Colesterol + triglicerídeos elevados",
    icon: "🧬",
    drugs: [
      { drugId: "atorvastatina-20", posologyOverride: "Tomar 1 comprimido à noite" },
      { drugId: "fenofibrato-160", posologyOverride: "Tomar 1 comprimido 1x/dia, com alimento" },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // RESPIRATÓRIO
  // ═══════════════════════════════════════════════════════════
  {
    key: "asma-aguda",
    label: "Crise de Asma Aguda",
    subtitle: "Exacerbação leve a moderada",
    icon: "🌬️",
    drugs: [
      { drugId: "salbutamol-100", posologyOverride: "Inalar 2 jatos de 4/4h se falta de ar" },
      { drugId: "prednisona-20", posologyOverride: "Tomar 1 comprimido pela manhã por 5-7 dias" },
      { drugId: "brometo-ipratropio-20", posologyOverride: "Inalar 2 jatos de 6/6h se crise" },
    ],
  },
  {
    key: "asma-manutencao",
    label: "Asma — Manutenção",
    subtitle: "Tratamento de controle",
    icon: "🫁",
    drugs: [
      { drugId: "budesonida-200", posologyOverride: "Inalar 2 jatos de 12/12h" },
      { drugId: "salbutamol-100", posologyOverride: "Inalar 2 jatos se falta de ar (resgate)" },
    ],
  },
  {
    key: "asma-grave",
    label: "Asma Persistente Grave",
    subtitle: "Associação de corticoide + LABA",
    icon: "🫁",
    drugs: [
      { drugId: "budesonida-formoterol-160-4,5", posologyOverride: "Inalar 2 jatos de 12/12h" },
      { drugId: "salbutamol-100", posologyOverride: "Inalar 2 jatos se falta de ar (resgate)" },
    ],
  },
  {
    key: "dpoc-estavel",
    label: "DPOC — Estável",
    subtitle: "Manutenção de DPOC",
    icon: "💨",
    drugs: [
      { drugId: "tiotropio-18", posologyOverride: "Inalar 1 cápsula 1x/dia" },
      { drugId: "salbutamol-100", posologyOverride: "Inalar 2 jatos se falta de ar (resgate)" },
    ],
  },
  {
    key: "dpoc-exacerbacao",
    label: "DPOC — Exacerbação",
    subtitle: "Exacerbação aguda de DPOC",
    icon: "⚠️",
    drugs: [
      { drugId: "salbutamol-100", posologyOverride: "Inalar 2 jatos de 4/4h se falta de ar" },
      { drugId: "brometo-ipratropio-20", posologyOverride: "Inalar 2 jatos de 6/6h" },
      { drugId: "prednisona-20", posologyOverride: "Tomar 1 comprimido pela manhã por 5-7 dias" },
      { drugId: "amoxicilina-500", posologyOverride: "Tomar 1 cápsula de 8/8h por 7 dias (se sinais de infecção)" },
    ],
  },
  {
    key: "rinite-alergica",
    label: "Rinite Alérgica",
    subtitle: "Tratamento sintomático",
    icon: "🤧",
    drugs: [
      { drugId: "loratadina-10", posologyOverride: "Tomar 1 comprimido 1x/dia" },
      { drugId: "budesonida-200", posologyOverride: "Inalar 2 jatos em cada narina 2x/dia" },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // PSIQUIATRIA / NEUROLOGIA
  // ═══════════════════════════════════════════════════════════
  {
    key: "ansiedade",
    label: "Ansiedade Aguda",
    subtitle: "Crise aguda — uso pontual",
    icon: "🧠",
    drugs: [
      { drugId: "clonazepam-2", posologyOverride: "Tomar ½ comprimido 2x/dia. Reavaliação em 30 dias." },
    ],
  },
  {
    key: "depressao-leve",
    label: "Depressão Leve a Moderada",
    subtitle: "Início de tratamento com ISRS",
    icon: "🌧️",
    drugs: [
      { drugId: "sertralina-50", posologyOverride: "Tomar 1 comprimido pela manhã. Reavaliação em 4-6 semanas." },
    ],
  },
  {
    key: "depressao-moderada",
    label: "Depressão Moderada a Grave",
    subtitle: "ISRS + acompanhamento",
    icon: "🌧️",
    drugs: [
      { drugId: "sertralina-50", posologyOverride: "Tomar 1 comprimido pela manhã. Aumentar para 100mg em 2-4 semanas se necessário." },
    ],
  },
  {
    key: "depressao-insomnia",
    label: "Depressão com Insônia",
    subtitle: "Antidepressivo com efeito sedativo",
    icon: "🌙",
    drugs: [
      { drugId: "mirtazapina-15", posologyOverride: "Tomar 1 comprimido à noite. Reavaliação em 4 semanas." },
    ],
  },
  {
    key: "depressao-dor-cronica",
    label: "Depressão + Dor Crônica",
    subtitle: "Antidepressivo com efeito analgésico",
    icon: "🔁",
    drugs: [
      { drugId: "duloxetina-60", posologyOverride: "Tomar 1 cápsula 1x/dia. Reavaliação em 4 semanas." },
    ],
  },
  {
    key: "insonia",
    label: "Insônia",
    subtitle: "Tratamento de curto prazo",
    icon: "🌙",
    drugs: [
      { drugId: "zolpidem-10", posologyOverride: "Tomar 1 comprimido imediatamente antes de dormir por até 4 semanas" },
    ],
  },
  {
    key: "epilepsia",
    label: "Epilepsia — Manutenção",
    subtitle: "Tratamento anticonvulsivante",
    icon: "⚡",
    drugs: [
      { drugId: "carbamazepina-200", posologyOverride: "Tomar 1 comprimido de 12/12h. Ajustar conforme resposta." },
    ],
  },
  {
    key: "enxaqueca-aguda",
    label: "Enxaqueca — Crise Aguda",
    subtitle: "Tratamento abortivo",
    icon: "🤕",
    drugs: [
      { drugId: "dipirona-500", posologyOverride: "Tomar 1 comprimido de 6/6h se dor" },
      { drugId: "ibuprofeno-600", posologyOverride: "Tomar 1 comprimido de 8/8h se dor, com alimento" },
      { drugId: "metoclopramida-10", posologyOverride: "Tomar 1 comprimido 30min antes do analgésico se náusea" },
    ],
  },
  {
    key: "enxaqueca-profilaxia",
    label: "Enxaqueca — Profilaxia",
    subtitle: "Prevenção de crises",
    icon: "🛡️",
    drugs: [
      { drugId: "propranolol-40", posologyOverride: "Tomar 1 comprimido de 8/8h. Reavaliação em 4-6 semanas." },
      { drugId: "amitriptilina-25", posologyOverride: "Tomar 1 comprimido à noite. Aumentar gradualmente." },
    ],
  },
  {
    key: "vertigem",
    label: "Vertigem / Labirintite",
    subtitle: "Tratamento sintomático",
    icon: "🌀",
    drugs: [
      { drugId: "betaistina-24", posologyOverride: "Tomar 1 comprimido de 8/8h" },
      { drugId: "dimenidrinato-difenidramina-30-50", posologyOverride: "Tomar 1 comprimido de 6/8h se náusea ou tontura" },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // GASTROINTESTINAL
  // ═══════════════════════════════════════════════════════════
  {
    key: "drge",
    label: "DRGE (Doença do Refluxo Gastroesofágico)",
    subtitle: "Tratamento de 4-8 semanas",
    icon: "🔥",
    drugs: [
      { drugId: "omeprazol-20", posologyOverride: "Tomar 1 cápsula em jejum, 30min antes do café, por 4-8 semanas" },
    ],
  },
  {
    key: "dispepsia",
    label: "Dispepsia Funcional",
    subtitle: "Tratamento sintomático",
    icon: "🤢",
    drugs: [
      { drugId: "omeprazol-20", posologyOverride: "Tomar 1 cápsula em jejum por 4 semanas" },
      { drugId: "domperidona-10", posologyOverride: "Tomar 1 comprimido de 8/8h, antes das refeições, por 2 semanas" },
    ],
  },
  {
    key: "gastrite",
    label: "Gastrite",
    subtitle: "Tratamento + investigação de H. pylori",
    icon: "🔥",
    drugs: [
      { drugId: "omeprazol-20", posologyOverride: "Tomar 1 cápsula em jejum, 30min antes do café, por 4-8 semanas" },
      { drugId: "sucralfato-1", posologyOverride: "Tomar 1 comprimido de 6/6h, 1h antes das refeições" },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // DERMATOLOGIA / CUIDADO DE FERIDAS
  // ═══════════════════════════════════════════════════════════
  {
    key: "dermatite-seborreica",
    label: "Dermatite Seborreica",
    subtitle: "Tratamento tópico",
    icon: "🧴",
    drugs: [
      { drugId: "cetoconazol-20-creme", posologyOverride: "Aplicar na área afetada 2x/dia por 2-4 semanas" },
      { drugId: "hidrocortisona-10", posologyOverride: "Aplicar na área afetada 2x/dia por no máx 7 dias" },
    ],
  },
  {
    key: "dermatite-contato",
    label: "Dermatite de Contato",
    subtitle: "Tratamento tópico",
    icon: "🔴",
    drugs: [
      { drugId: "hidrocortisona-10", posologyOverride: "Aplicar na área afetada 2-3x/dia por 7-14 dias" },
      { drugId: "loratadina-10", posologyOverride: "Tomar 1 comprimido 1x/dia se prurido" },
    ],
  },
  {
    key: "psoriase",
    label: "Psoríase Leve",
    subtitle: "Tratamento tópico",
    icon: "🔵",
    drugs: [
      { drugId: "clobetasol-0,5", posologyOverride: "Aplicar na placa 2x/dia por no máx 2 semanas" },
      { drugId: "hidrocortisona-10", posologyOverride: "Aplicar em áreas sensíveis (face, dobras) 2x/dia" },
    ],
  },
  {
    key: "acne-leve",
    label: "Acne Leve a Moderada",
    subtitle: "Tratamento tópico inicial",
    icon: "🫧",
    drugs: [
      { drugId: "peroxido-benzoila-50", posologyOverride: "Aplicar 1x/dia à noite na área afetada" },
      { drugId: "adapaleno-1", posologyOverride: "Aplicar à noite, 1x/dia, na área afetada" },
    ],
  },
  {
    key: "acne-grave",
    label: "Acne Moderada a Grave",
    subtitle: "Tópico + oral",
    icon: "🫧",
    drugs: [
      { drugId: "doxiciclina-100", posologyOverride: "Tomar 1 cápsula 1x/dia por 8-12 semanas" },
      { drugId: "peroxido-benzoila-50", posologyOverride: "Aplicar 1x/dia à noite na área afetada" },
    ],
  },
  {
    key: "ferida-limpeza",
    label: "Limpeza de Ferida",
    subtitle: "Cuidado local de ferida limpa",
    icon: "🩹",
    drugs: [
      { drugId: "soro-fisiologico-0,9", posologyOverride: "Limpar a ferida com SF 0,9%" },
      { drugId: "dipirona-500", posologyOverride: "Tomar 1 comprimido de 6/6h se dor" },
    ],
  },
  {
    key: "ferida-infectada",
    label: "Ferida Infectada",
    subtitle: "Cuidado local + antibioticoterapia",
    icon: "🩹",
    drugs: [
      { drugId: "cefalexina-500", posologyOverride: "Tomar 1 cápsula de 6/6h por 7-10 dias" },
      { drugId: "dipirona-500", posologyOverride: "Tomar 1 comprimido de 6/6h se dor ou febre" },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // SAÚDE DA MULHER
  // ═══════════════════════════════════════════════════════════
  {
    key: "candidiase-vaginal",
    label: "Candidíase Vulvovaginal",
    subtitle: "Tratamento tópico ou oral",
    icon: "🍄",
    drugs: [
      { drugId: "fluconazol-150", posologyOverride: "Tomar 1 cápsula, dose única. Repetir em 7 dias se persistente." },
      { drugId: "clotrimazol-10", posologyOverride: "Aplicar 1 aplicador à noite por 7 dias" },
    ],
  },
  {
    key: "vaginite-tricomonas",
    label: "Vaginite por Tricomonas",
    subtitle: "Tratar parceiro também",
    icon: "🦠",
    drugs: [
      { drugId: "metronidazol-250", posologyOverride: "Tomar 1 comprimido de 8/8h por 7 dias. Tratar parceiro." },
      { drugId: "secnidazol-1", posologyOverride: "Dissolver 1 sachê em água, dose única (alternativa)" },
    ],
  },
  {
    key: "vaginite-bacteriana",
    label: "Vaginose Bacteriana",
    subtitle: "Tratamento com metronidazol",
    icon: "🦠",
    drugs: [
      { drugId: "metronidazol-250", posologyOverride: "Tomar 1 comprimido de 8/8h por 7 dias" },
    ],
  },
  {
    key: "mastite",
    label: "Mastite Puerperal",
    subtitle: "Infecção mamária na lactação",
    icon: "🤱",
    drugs: [
      { drugId: "cefalexina-500", posologyOverride: "Tomar 1 cápsula de 6/6h por 10-14 dias" },
      { drugId: "dipirona-500", posologyOverride: "Tomar 1 comprimido de 6/6h se dor ou febre" },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // SAÚDE DA CRIANÇA
  // ═══════════════════════════════════════════════════════════
  {
    key: "otite-media",
    label: "Otite Média Aguda",
    subtitle: "Tratamento pediátrico",
    icon: "👂",
    drugs: [
      { drugId: "amoxicilina-500", posologyOverride: "Tomar 1 cápsula de 8/8h por 10 dias (ou suspensão pediátrica: 80-90mg/kg/dia)" },
      { drugId: "ibuprofeno-100-5", posologyOverride: "Tomar 5-10mg/kg/dose de 6/8h se dor ou febre" },
    ],
  },
  {
    key: "bronquiolite",
    label: "Bronquiolite",
    subtitle: "Tratamento sintomático",
    icon: "👶",
    drugs: [
      { drugId: "salbutamol-100", posologyOverride: "Inalar 2 jatos de 4/4h se sibilância (teste terapêutico)" },
      { drugId: "dipirona-500", posologyOverride: "Tomar 1 comprimido de 6/6h se febre (ou gotas pediátricas: 1 gota/kg)" },
    ],
  },
  {
    key: "diarreia-aguda",
    label: "Diarreia Aguda",
    subtitle: "Reidratação + sintomático",
    icon: "💧",
    drugs: [
      { drugId: "soro-fisiologico-0,9", posologyOverride: "Oferecer soro de reidratação oral frequentemente" },
      { drugId: "loperamida-2", posologyOverride: "Tomar 1 cápsula inicialmente, depois 1 após cada evacuação líquida (adultos apenas)" },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // PROTOCOLOS NOVOS — CICLO 8
  // ═══════════════════════════════════════════════════════════

  // ── Constipação ────────────────────────────────────────────
  {
    key: "constipacao",
    label: "Constipação Funcional",
    subtitle: "Abordagem escalonada — fibras → osmóticos → estimulantes",
    icon: "🫙",
    drugs: [
      { drugId: "simeticona-80", posologyOverride: "Tomar 1 comprimido de 8/8h (alívio do desconforto abdominal associado)" },
      { drugId: "domperidona-10", posologyOverride: "Tomar 1 comprimido 3x/dia antes das refeições se distensão (curto prazo)" },
    ],
  },

  // ── Síndrome do Pânico ──────────────────────────────────────
  {
    key: "sindrome-panico",
    label: "Síndrome do Pânico",
    subtitle: "Farmacoterapia inicial — ISRS + BZD transitório",
    icon: "💆",
    drugs: [
      { drugId: "sertralina-50", posologyOverride: "Tomar 1 comprimido pela manhã. Iniciar com 25mg/dia por 1 semana, depois 50mg/dia. Reavaliação em 4-6 semanas." },
      { drugId: "clonazepam-2", posologyOverride: "Tomar ½ comprimido 2x/dia por até 4 semanas (transitório, enquanto ISRS não faz efeito)" },
    ],
  },

  // ── Bronquite Aguda ─────────────────────────────────────────
  {
    key: "bronquite-aguda",
    label: "Bronquite Aguda",
    subtitle: "Maioria viral — antibiótico não recomendado rotineiramente",
    icon: "🫁",
    drugs: [
      { drugId: "ibuprofeno-600", posologyOverride: "Tomar 1 comprimido de 8/8h por 5 dias, com alimento (anti-inflamatório + analgésico)" },
      { drugId: "salbutamol-100", posologyOverride: "Inalar 2 jatos de 4/4h se chiado ou dispneia (broncodilatador de resgate)" },
    ],
  },

  // ── Urticária Aguda ─────────────────────────────────────────
  {
    key: "urticaria-aguda",
    label: "Urticária Aguda",
    subtitle: "Anti-histamínico ± corticoide nas formas graves",
    icon: "🔴",
    drugs: [
      { drugId: "loratadina-10", posologyOverride: "Tomar 1 comprimido 1x/dia até resolução (anti-histamínico de 2ª geração)" },
      { drugId: "hidroxizina-25", posologyOverride: "Tomar 1 comprimido de 8/8h se prurido intenso (alternativa sedativa para noite)" },
      { drugId: "prednisona-20", posologyOverride: "Tomar 1 comprimido pela manhã por 5-7 dias se urticária extensa ou angioedema" },
    ],
  },

  // ── Tosse Crônica ───────────────────────────────────────────
  {
    key: "tosse-cronica",
    label: "Tosse Crônica",
    subtitle: "Tratamento por causa base — investigar DRGE, DRN, asma",
    icon: "💨",
    drugs: [
      { drugId: "omeprazol-20", posologyOverride: "Tomar 1 cápsula em jejum por 8 semanas (se suspeita de DRGE como causa)" },
      { drugId: "loratadina-10", posologyOverride: "Tomar 1 comprimido 1x/dia (se gotejamento pós-nasal como causa)" },
      { drugId: "salbutamol-100", posologyOverride: "Inalar 2 jatos de 4/4h se componente broncoespástico (teste terapêutico para asma)" },
    ],
  },

  // ── Otite Externa ───────────────────────────────────────────
  {
    key: "otite-externa",
    label: "Otite Externa (Otite do Nadador)",
    subtitle: "Infecção do canal auditivo externo — tratamento tópico + analgesia",
    icon: "👂",
    drugs: [
      { drugId: "dipirona-500", posologyOverride: "Tomar 1 comprimido de 6/6h se dor (analgesia sistêmica)" },
      { drugId: "ibuprofeno-600", posologyOverride: "Tomar 1 comprimido de 8/8h com alimento se dor moderada (alternativa anti-inflamatória)" },
    ],
  },

  // ── Conjuntivite Bacteriana ─────────────────────────────────
  {
    key: "conjuntivite-bacteriana",
    label: "Conjuntivite Bacteriana",
    subtitle: "Secreção purulenta bilateral — colírio antibiótico + higiene",
    icon: "👁️",
    drugs: [
      { drugId: "dipirona-500", posologyOverride: "Tomar 1 comprimido de 6/6h se dor ou desconforto ocular intenso" },
    ],
  },

  // ── Anticoncepção de Emergência ─────────────────────────────
  {
    key: "anticoncepcao-emergencia",
    label: "Anticoncepção de Emergência",
    subtitle: "Levonorgestrel 1,5mg — até 72h após relação desprotegida",
    icon: "💊",
    drugs: [
      { drugId: "etinilestradiol-levonorgestrel-30-150", posologyOverride: "ATENÇÃO: Solicitar levonorgestrel 1,5mg em dose única (disponível na farmácia popular como anticoncepção de emergência)" },
    ],
  },
];
