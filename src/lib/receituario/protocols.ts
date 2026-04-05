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
    key: "ansiedade",
    label: "Ansiedade Aguda",
    subtitle: "Crise aguda — uso pontual",
    icon: "🧠",
    drugs: [
      { drugId: "clonazepam-2", posologyOverride: "Tomar ½ comprimido 2x/dia. Reavaliação em 30 dias." },
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
    key: "dm2",
    label: "DM2 — Início de Tratamento",
    subtitle: "Diabetes tipo 2 sem insulina",
    icon: "🩸",
    drugs: [
      { drugId: "metformina-850", posologyOverride: "Tomar 1 comprimido ao almoço por 2 semanas, depois 1 ao almoço + 1 ao jantar" },
    ],
  },
];
