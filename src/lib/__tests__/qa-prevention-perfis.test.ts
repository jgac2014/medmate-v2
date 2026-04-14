/**
 * QA Clínico — Prevenção e Triagens para 4 perfis de paciente.
 *
 * Perfis:
 * P1: Homem, 30 anos — sem comorbidades
 * P2: Mulher, 55 anos — sem comorbidades
 * P3: Mulher, 70 anos — sem comorbidades
 * P4: Homem, 62 anos — HAS + DM2
 *
 * Valida: sugestões de prevenção, triagens sugeridas, output preventionOutputLabels(),
 * shortLabel compression, separação PREVENÇÕES vs TRIAGENS.
 */

import { describe, it, expect } from "vitest";
import { getSuggestedPreventions } from "../clinical-rules";
import { PREVENTIONS } from "../constants";
import {
  isPSA,
  isTriageItem,
  isContextualExclude,
  preventionOutputLabels,
  preventionShortLabel,
} from "../output-labels";
import type { PatientRuleInput } from "@/types";

type Profile = { label: string; age: number; gender: string; problems: string[] };

const PROFILES: Profile[] = [
  { label: "P1 — Homem, 30a", age: 30, gender: "Masculino", problems: [] },
  { label: "P2 — Mulher, 55a", age: 55, gender: "Feminino", problems: [] },
  { label: "P3 — Mulher, 70a", age: 70, gender: "Feminino", problems: [] },
  { label: "P4 — Homem, 62a c/HAS/DM2", age: 62, gender: "Masculino", problems: ["HAS", "DM2"] },
];

// ─── Testes de isolamento ────────────────────────────────────────────────────

describe("isPSA — filtro de segurança", () => {
  it("captura todos os padrões de PSA", () => {
    expect(isPSA("PSA em dia (decisão compartilhada)")).toBe(true);
    expect(isPSA("Antígeno prostático específico em dia")).toBe(true);
    expect(isPSA("Mamografia em dia")).toBe(false);
  });
});

describe("isTriageItem — separação PREVENÇÕES/TRIAGENS", () => {
  it("captura todos os padrões de escala", () => {
    expect(isTriageItem("Rastreio de depressão em dia (PHQ-2/PHQ-9 — >=18a)")).toBe(true);
    expect(isTriageItem("IVCF-20: avaliar (>60a — avaliação multidimensional)")).toBe(true);
    expect(isTriageItem("Mamografia em dia")).toBe(false);
    expect(isTriageItem("Testagem HIV em dia")).toBe(false);
  });
});

describe("isContextualExclude — exclusão de contextuais do output", () => {
  it("captura densitometria e avaliações funcionais", () => {
    expect(isContextualExclude("Densitometria óssea: considerar")).toBe(true);
    expect(isContextualExclude("Avaliação visual (idoso)")).toBe(true);
    expect(isContextualExclude("Avaliação auditiva (idoso)")).toBe(true);
    expect(isContextualExclude("Mamografia em dia")).toBe(false);
  });
});

describe("preventionShortLabel — compressão de labels", () => {
  it("remove todo o contexto normativo entre parênteses/colchetes/traço e limpa 'reforço:'", () => {
    expect(preventionShortLabel("Mamografia em dia (50–69a, a cada 2 anos)"))
      .toBe("Mamografia em dia");
    expect(preventionShortLabel("dT reforço em dia (a cada 10 anos, >=7a)"))
      .toBe("dT em dia");
    expect(preventionShortLabel("Rastreamento do colo do útero em dia (DNA-HPV ou citologia — conforme oferta local)"))
      .toBe("Rastreamento do colo do útero em dia");
  });

  it("substitui 'em dia' por 'verificado' em testagens opportunísticas (sem dash extra)", () => {
    expect(preventionShortLabel("Testagem HIV em dia (conforme risco / oportunidade)"))
      .toBe("Testagem HIV verificado");
    expect(preventionShortLabel("Sífilis: testagem em dia (conforme risco / oportunidade)"))
      .toBe("Sífilis: testagem verificado");
    expect(preventionShortLabel("Testagem hepatite C em dia (>=40a ou fatores de risco)"))
      .toBe("Testagem hepatite C verificado");
  });

  it("mantém 'vacinado' para vacinas e 'em dia' para padrões", () => {
    expect(preventionShortLabel("Vacinação hepatite B em dia"))
      .toBe("Vacinação hepatite B em dia");
    expect(preventionShortLabel("Influenza: vacinado (conforme grupo prioritário sazonal)"))
      .toBe("Influenza: vacinado");
  });

  it("retorna string vazia para itens excluídos", () => {
    expect(preventionShortLabel("PSA em dia (decisão compartilhada)")).toBe("");
    expect(preventionShortLabel("Rastreio de depressão em dia")).toBe("");
    expect(preventionShortLabel("IVCF-20: avaliar")).toBe("");
    expect(preventionShortLabel("Densitometria óssea: considerar")).toBe("");
  });
});

describe("preventionOutputLabels — pipeline completo de filtragem", () => {
  it("remove PSA, triage items e contextuais; opportunísticas viram 'verificado'", () => {
    const all = [
      "Mamografia em dia (50–69a, a cada 2 anos)",
      "Testagem HIV em dia (conforme risco / oportunidade)",
      "PSA em dia (decisão compartilhada — sem rastreamento universal)",
      "Rastreio de depressão em dia (PHQ-2/PHQ-9 — >=18a)",
      "Densitometria óssea: considerar (>=65a mulheres ou risco)",
      "Vacinação hepatite B em dia",
    ];
    const result = preventionOutputLabels(all).map(preventionShortLabel).filter(Boolean);
    expect(result).toEqual([
      "Mamografia em dia",
      "Testagem HIV verificado",
      "Vacinação hepatite B em dia",
    ]);
  });
});

// ─── Testes por perfil ────────────────────────────────────────────────────────

describe("P1 — Homem, 30a", () => {
  const profile = PROFILES[0];

  it("não sugere mamografia nem colo uterino", () => {
    const rules = getSuggestedPreventions({ age: profile.age, gender: profile.gender, problems: profile.problems, preventions: [] });
    expect(rules.some((r) => r.id === "mamografia")).toBe(false);
    expect(rules.some((r) => r.id === "colo-utero")).toBe(false);
  });

  it("sugere HIV, sífilis, hepatite B opportunísticas (HepC é >=40a → P1=30a NÃO)", () => {
    const rules = getSuggestedPreventions({ age: profile.age, gender: profile.gender, problems: profile.problems, preventions: [] });
    expect(rules.some((r) => r.id === "hiv-testagem")).toBe(true);
    expect(rules.some((r) => r.id === "sifilis-testagem")).toBe(true);
    expect(rules.some((r) => r.id === "hepatite-b-vac")).toBe(true);
    expect(rules.some((r) => r.id === "hepatite-c")).toBe(false); // >=40 — P1 tem 30a
  });

  it("NÃO sugere perfil lipídico para homem <35a", () => {
    const rules = getSuggestedPreventions({ age: profile.age, gender: profile.gender, problems: profile.problems, preventions: [] });
    expect(rules.some((r) => r.id === "perfil-lipidico")).toBe(false); // H>=35
  });

  it("NÃO sugere glicemia rastreio para homem <45a sem fatores de risco", () => {
    const rules = getSuggestedPreventions({ age: profile.age, gender: profile.gender, problems: profile.problems, preventions: [] });
    expect(rules.some((r) => r.id === "glicemia-rastreio")).toBe(false); // >=45
  });

  it("sugere DT para todos >=7a", () => {
    const rules = getSuggestedPreventions({ age: profile.age, gender: profile.gender, problems: profile.problems, preventions: [] });
    expect(rules.some((r) => r.id === "vacina-dt")).toBe(true);
  });

  it("sugere PHQ-2 para >=18a", () => {
    const rules = getSuggestedPreventions({ age: profile.age, gender: profile.gender, problems: profile.problems, preventions: [] });
    expect(rules.some((r) => r.id === "depressao-phq2")).toBe(true);
  });

  it("NÃO sugere IVCF-20 para <60a", () => {
    const rules = getSuggestedPreventions({ age: profile.age, gender: profile.gender, problems: profile.problems, preventions: [] });
    expect(rules.some((r) => r.id === "ivcf20")).toBe(false); // >60
  });

  it("PREVENÇÕES output: apenas DT e HepB vacinado (30a, sem opportunistic)", () => {
    const rules = getSuggestedPreventions({ age: profile.age, gender: profile.gender, problems: profile.problems, preventions: [] });
    const checkedLabels = rules.map((r) => r.preventionLabel);
    const output = preventionOutputLabels(checkedLabels).map(preventionShortLabel).filter(Boolean);
    // HIV/HepC/sífilis: filtrados por opportunistic → saem
    // rastreio glicêmico: >=45 → false para 30a
    // perfil lipídico: H>=35 → false para 30a
    expect(output).toContain("dT em dia");
    expect(output).toContain("Vacinação hepatite B em dia");
    // HIV opportunística para P1=30a (>=15a) → aparece com "verificado"
    expect(output.some((o) => o.toLowerCase().includes("testagem"))).toBe(true);
    expect(output).toContain("Testagem HIV verificado");
  });
});

describe("P2 — Mulher, 55a", () => {
  const profile = PROFILES[1];

  it("sugere mamografia (50-69a)", () => {
    const rules = getSuggestedPreventions({ age: profile.age, gender: profile.gender, problems: profile.problems, preventions: [] });
    expect(rules.some((r) => r.id === "mamografia")).toBe(true);
  });

  it("sugere colo uterino (25-64a)", () => {
    const rules = getSuggestedPreventions({ age: profile.age, gender: profile.gender, problems: profile.problems, preventions: [] });
    expect(rules.some((r) => r.id === "colo-utero")).toBe(true);
  });

  it("sugere opportunísticas (HIV, sífilis, HepB vacinado)", () => {
    const rules = getSuggestedPreventions({ age: profile.age, gender: profile.gender, problems: profile.problems, preventions: [] });
    expect(rules.some((r) => r.id === "hiv-testagem")).toBe(true);
    expect(rules.some((r) => r.id === "sifilis-testagem")).toBe(true);
    expect(rules.some((r) => r.id === "hepatite-b-vac")).toBe(true);
  });

  it("sugere glicemia rastreio (>=45a)", () => {
    const rules = getSuggestedPreventions({ age: profile.age, gender: profile.gender, problems: profile.problems, preventions: [] });
    expect(rules.some((r) => r.id === "glicemia-rastreio")).toBe(true);
  });

  it("sugere perfil lipídico (M>=45a)", () => {
    const rules = getSuggestedPreventions({ age: profile.age, gender: profile.gender, problems: profile.problems, preventions: [] });
    expect(rules.some((r) => r.id === "perfil-lipidico")).toBe(true);
  });

  it("NÃO sugere IVCF-20 para <60a", () => {
    const rules = getSuggestedPreventions({ age: profile.age, gender: profile.gender, problems: profile.problems, preventions: [] });
    expect(rules.some((r) => r.id === "ivcf20")).toBe(false);
  });

  it("sugere PHQ-2 para >=18a", () => {
    const rules = getSuggestedPreventions({ age: profile.age, gender: profile.gender, problems: profile.problems, preventions: [] });
    expect(rules.some((r) => r.id === "depressao-phq2")).toBe(true);
  });

  it("PREVENÇÕES output: mamografia, colo útero, DT, opportunistic verificados", () => {
    const rules = getSuggestedPreventions({ age: profile.age, gender: profile.gender, problems: profile.problems, preventions: [] });
    const checkedLabels = rules.map((r) => r.preventionLabel);
    const output = preventionOutputLabels(checkedLabels).map(preventionShortLabel).filter(Boolean);
    expect(output).toContain("Mamografia em dia");
    expect(output).toContain("Rastreamento do colo do útero em dia");
    expect(output).toContain("Testagem HIV verificado");
    expect(output).toContain("Sífilis: testagem verificado");
    expect(output).toContain("Rastreio glicêmico verificado");
    expect(output).toContain("Perfil lipídico verificado");
    // Sem duplicação TRIAGENS
    expect(output.some((o) => o.toLowerCase().includes("depressão"))).toBe(false);
    expect(output.some((o) => o.toLowerCase().includes("ivcf"))).toBe(false);
  });
});

describe("P3 — Mulher, 70a", () => {
  const profile = PROFILES[2];

  it("NÃO sugere mamografia (>69a)", () => {
    const rules = getSuggestedPreventions({ age: profile.age, gender: profile.gender, problems: profile.problems, preventions: [] });
    expect(rules.some((r) => r.id === "mamografia")).toBe(false);
  });

  it("NÃO sugere colo uterino (>64a)", () => {
    const rules = getSuggestedPreventions({ age: profile.age, gender: profile.gender, problems: profile.problems, preventions: [] });
    expect(rules.some((r) => r.id === "colo-utero")).toBe(false);
  });

  it("sugere HepC opportunística (>=40a)", () => {
    const rules = getSuggestedPreventions({ age: profile.age, gender: profile.gender, problems: profile.problems, preventions: [] });
    expect(rules.some((r) => r.id === "hepatite-c")).toBe(true);
  });

  it("sugere influenza e COVID (>=60a)", () => {
    const rules = getSuggestedPreventions({ age: profile.age, gender: profile.gender, problems: profile.problems, preventions: [] });
    expect(rules.some((r) => r.id === "influenza")).toBe(true);
    expect(rules.some((r) => r.id === "covid19")).toBe(true);
  });

  it("sugere densitometria (M>=65a)", () => {
    const rules = getSuggestedPreventions({ age: profile.age, gender: profile.gender, problems: profile.problems, preventions: [] });
    expect(rules.some((r) => r.id === "densitometria")).toBe(true);
  });

  it("sugere IVCF-20 (>60a)", () => {
    const rules = getSuggestedPreventions({ age: profile.age, gender: profile.gender, problems: profile.problems, preventions: [] });
    expect(rules.some((r) => r.id === "ivcf20")).toBe(true);
  });

  it("PREVENÇÕES output: nenhum item de triagem aparece, densitometria não aparece", () => {
    const rules = getSuggestedPreventions({ age: profile.age, gender: profile.gender, problems: profile.problems, preventions: [] });
    const checkedLabels = rules.map((r) => r.preventionLabel);
    const output = preventionOutputLabels(checkedLabels).map(preventionShortLabel).filter(Boolean);
    // Densitometria: filtrada
    expect(output.some((o) => o.toLowerCase().includes("densitometria"))).toBe(false);
    // IVCF-20: filtrada (triage item)
    expect(output.some((o) => o.toLowerCase().includes("ivcf"))).toBe(false);
    // Rastreio depressão: filtrado (triage item)
    expect(output.some((o) => o.toLowerCase().includes("depressão"))).toBe(false);
    // Opportunísticas presentes
    expect(output.some((o) => o.toLowerCase().includes("hepatite c"))).toBe(true);
  });
});

describe("P4 — Homem, 62a c/HAS/DM2", () => {
  const profile = PROFILES[3];

  it("sugere opportunísticas completas + rastreio metabólico + geriátricas", () => {
    const rules = getSuggestedPreventions({ age: profile.age, gender: profile.gender, problems: profile.problems, preventions: [] });
    expect(rules.some((r) => r.id === "hiv-testagem")).toBe(true);
    expect(rules.some((r) => r.id === "hepatite-c")).toBe(true);
    expect(rules.some((r) => r.id === "hepatite-b-vac")).toBe(true);
    expect(rules.some((r) => r.id === "sifilis-testagem")).toBe(true);
    expect(rules.some((r) => r.id === "glicemia-rastreio")).toBe(true);
    expect(rules.some((r) => r.id === "perfil-lipidico")).toBe(true);
    expect(rules.some((r) => r.id === "influenza")).toBe(true);
    expect(rules.some((r) => r.id === "covid19")).toBe(true);
    expect(rules.some((r) => r.id === "ivcf20")).toBe(true);
    expect(rules.some((r) => r.id === "depressao-phq2")).toBe(true);
  });

  it("NÃO sugere mamografia nem colo uterino", () => {
    const rules = getSuggestedPreventions({ age: profile.age, gender: profile.gender, problems: profile.problems, preventions: [] });
    expect(rules.some((r) => r.id === "mamografia")).toBe(false);
    expect(rules.some((r) => r.id === "colo-utero")).toBe(false);
  });

  it("PSA não aparece na suggestions nem no output", () => {
    const rules = getSuggestedPreventions({ age: profile.age, gender: profile.gender, problems: profile.problems, preventions: [] });
    const checkedLabels = rules.map((r) => r.preventionLabel);
    const output = preventionOutputLabels(checkedLabels).map(preventionShortLabel).filter(Boolean);
    expect(rules.some((r) => isPSA(r.preventionLabel))).toBe(false);
    expect(output.some((o) => o.toLowerCase().includes("psa"))).toBe(false);
  });

  it("PREVENÇÕES output: apenas o que é factual (sem duplicação TRIAGENS)", () => {
    const rules = getSuggestedPreventions({ age: profile.age, gender: profile.gender, problems: profile.problems, preventions: [] });
    const checkedLabels = rules.map((r) => r.preventionLabel);
    const output = preventionOutputLabels(checkedLabels).map(preventionShortLabel).filter(Boolean);
    // Verificações positivas
    expect(output).toContain("dT em dia");
    expect(output).toContain("Testagem HIV verificado");
    expect(output).toContain("Testagem hepatite C verificado");
    expect(output).toContain("Vacinação hepatite B em dia");
    expect(output).toContain("Sífilis: testagem verificado");
    expect(output).toContain("Rastreio glicêmico verificado");
    expect(output).toContain("Perfil lipídico verificado");
    expect(output).toContain("Influenza: vacinado");
    expect(output).toContain("COVID-19: vacinado");
    // Sem duplicação TRIAGENS
    expect(output.some((o) => o.toLowerCase().includes("depressão"))).toBe(false);
    expect(output.some((o) => o.toLowerCase().includes("ivcf"))).toBe(false);
  });
});
