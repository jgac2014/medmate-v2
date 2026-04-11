import type { RefRule, RefRuleMap, Gender } from "@/types";

/**
 * Mapa de valores de referência para exames laboratoriais.
 * Fontes: MS PCDT, Diretrizes SBC 2022, KDIGO 2024, OMS.
 */

export const REFERENCE_VALUES: RefRuleMap = {
  // Lipidograma
  ct: { type: "above", warn: 200, crit: 240 },
  hdl: { type: "below", warn: 40, crit: 35 },
  ldl: { type: "above", warn: 130, crit: 160 },
  trig: { type: "above", warn: 150, crit: 200 },
  nao_hdl: { type: "above", warn: 160, crit: 190 },

  // Perfil Renal
  cr: { type: "above", warn: 1.2, crit: 1.5 },
  ur: { type: "above", warn: 40, crit: 60 },
  au: { type: "above", warn: 7.0, crit: 9.0 },
  rac: { type: "above", warn: 30, crit: 300 },

  // Perfil Hepático
  ast: { type: "above", warn: 40, crit: 80 },
  alt: { type: "above", warn: 41, crit: 80 },
  ggt: { type: "above", warn: 60, crit: 120 },
  fa: { type: "above", warn: 120, crit: 200 },
  bt: { type: "above", warn: 1.2, crit: 2.0 },

  // Perfil Glicêmico
  gj: { type: "above", warn: 100, crit: 126 },
  hba1c: { type: "above", warn: 5.7, crit: 6.5 },

  // Eletrólitos
  k: { type: "range", warnLow: 3.5, warnHigh: 5.0, critLow: 3.0, critHigh: 5.5 },
  na: { type: "range", warnLow: 136, warnHigh: 145, critLow: 130, critHigh: 150 },
  ca: { type: "range", warnLow: 8.5, warnHigh: 10.5, critLow: 7.5, critHigh: 11.5 },
  mg_exam: { type: "range", warnLow: 1.7, warnHigh: 2.2, critLow: 1.3, critHigh: 2.6 },
  p: { type: "range", warnLow: 2.5, warnHigh: 4.5, critLow: 2.0, critHigh: 5.5 },

  // Vitaminas (MS Nota Técnica)
  vitd: { type: "below", warn: 30, crit: 20 },
  vitb12: { type: "below", warn: 300, crit: 200 },
  folato: { type: "below", warn: 5, crit: 3 },

  // Hemograma (com dependência de sexo)
  hb: (gender: Gender | "") => {
    if (gender === "Masculino") return { type: "below" as const, warn: 13, crit: 11 };
    if (gender === "Feminino") return { type: "below" as const, warn: 12, crit: 10 };
    return { type: "below" as const, warn: 12, crit: 10 };
  },
  ht: (gender: Gender | "") => {
    if (gender === "Masculino") return { type: "below" as const, warn: 39, crit: 33 };
    return { type: "below" as const, warn: 36, crit: 30 };
  },
  vcm: { type: "range", warnLow: 80, warnHigh: 100, critLow: 70, critHigh: 110 },
  leuco: { type: "range", warnLow: 4000, warnHigh: 11000, critLow: 2000, critHigh: 20000 },
  plaq: { type: "range", warnLow: 150, warnHigh: 400, critLow: 100, critHigh: 500 },

  // Tireoide
  tsh: { type: "range", warnLow: 0.4, warnHigh: 4.0, critLow: 0.1, critHigh: 10 },
  t4l: { type: "range", warnLow: 0.8, warnHigh: 1.8, critLow: 0.5, critHigh: 2.5 },

  // Cinética do Ferro (com dependência de sexo)
  ferritina: (gender: Gender | "") => {
    if (gender === "Masculino") return { type: "below" as const, warn: 30, crit: 15 };
    return { type: "below" as const, warn: 13, crit: 10 };
  },
  sat_transferrina: { type: "range", warnLow: 20, warnHigh: 50, critLow: 16, critHigh: 60 },

  // Inflamatórios
  pcr: { type: "above", warn: 3, crit: 10 },
  vhs: { type: "above", warn: 20, crit: 40 },
  psa: { type: "above", warn: 4, crit: 10 },
};

export function getRefRule(key: string, gender: Gender | ""): RefRule | null {
  const rule = REFERENCE_VALUES[key];
  if (!rule) return null;
  if (typeof rule === "function") return rule(gender);
  return rule;
}

export function getStatus(key: string, value: number, gender: Gender | ""): "ok" | "warn" | "crit" | "none" {
  const rule = getRefRule(key, gender);
  if (!rule || isNaN(value)) return "none";

  if (rule.type === "above") {
    if (rule.crit !== undefined && value >= rule.crit) return "crit";
    if (rule.warn !== undefined && value >= rule.warn) return "warn";
    return "ok";
  }

  if (rule.type === "below") {
    if (rule.crit !== undefined && value <= rule.crit) return "crit";
    if (rule.warn !== undefined && value <= rule.warn) return "warn";
    return "ok";
  }

  if (rule.type === "range") {
    if ((rule.critLow !== undefined && value <= rule.critLow) ||
        (rule.critHigh !== undefined && value >= rule.critHigh)) return "crit";
    if ((rule.warnLow !== undefined && value < rule.warnLow) ||
        (rule.warnHigh !== undefined && value > rule.warnHigh)) return "warn";
    return "ok";
  }

  return "none";
}
