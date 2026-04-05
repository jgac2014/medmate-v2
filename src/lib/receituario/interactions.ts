import type { Interaction, PrescribedDrug } from "./types";

export const INTERACTIONS: Interaction[] = [
  {
    drugA: "Codeína",
    drugB: "Tramadol",
    severity: "danger",
    message: "Associação de opioides — risco de depressão respiratória",
  },
  {
    drugA: "Clonazepam",
    drugB: "Zolpidem",
    severity: "danger",
    message: "Associação de benzodiazepínico + hipnótico — potencialização sedativa grave",
  },
  {
    drugA: "Diazepam",
    drugB: "Zolpidem",
    severity: "danger",
    message: "Benzodiazepínico + hipnótico — risco de sedação excessiva",
  },
  {
    drugA: "Clonazepam",
    drugB: "Diazepam",
    severity: "danger",
    message: "Dois benzodiazepínicos — risco aumentado de sedação e depressão respiratória",
  },
  {
    drugA: "Atorvastatina",
    drugB: "Amiodarona",
    severity: "warning",
    message: "Estatina + amiodarona — risco aumentado de miopatia",
  },
  {
    drugA: "Metformina",
    drugB: "Contraste iodado",
    severity: "warning",
    message: "Metformina + contraste — suspender 48h antes de exames com contraste",
  },
  {
    drugA: "Ibuprofeno",
    drugB: "Enalapril",
    severity: "warning",
    message: "AINE + IECA — redução do efeito anti-hipertensivo e risco de lesão renal",
  },
  {
    drugA: "Ibuprofeno",
    drugB: "Losartana",
    severity: "warning",
    message: "AINE + BRA — redução do efeito anti-hipertensivo e risco de lesão renal",
  },
  {
    drugA: "Tramadol",
    drugB: "Amitriptilina",
    severity: "warning",
    message: "Tramadol + antidepressivo tricíclico — risco de síndrome serotoninérgica",
  },
  {
    drugA: "Bupropiona",
    drugB: "Tramadol",
    severity: "warning",
    message: "Bupropiona + tramadol — risco de convulsões e síndrome serotoninérgica",
  },
];

export interface ActiveInteraction {
  severity: "warning" | "danger";
  message: string;
  drugs: [string, string];
}

export function checkInteractions(meds: PrescribedDrug[]): ActiveInteraction[] {
  const active: ActiveInteraction[] = [];

  for (let i = 0; i < meds.length; i++) {
    for (let j = i + 1; j < meds.length; j++) {
      const nameA = meds[i].name.toLowerCase();
      const nameB = meds[j].name.toLowerCase();

      for (const ix of INTERACTIONS) {
        const a = ix.drugA.toLowerCase();
        const b = ix.drugB.toLowerCase();

        const matchAB = nameA.includes(a) && nameB.includes(b);
        const matchBA = nameA.includes(b) && nameB.includes(a);

        if (matchAB || matchBA) {
          active.push({
            severity: ix.severity,
            message: ix.message,
            drugs: [meds[i].name, meds[j].name],
          });
        }
      }
    }
  }

  return active;
}
