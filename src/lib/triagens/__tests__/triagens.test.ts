import { describe, it, expect } from "vitest";
import { PHQ9, GAD7, AUDIT_C, MINI_COG, EDMONTON, computeScore } from "../scales";

describe("computeScore", () => {
  it("soma todos os valores das respostas", () => {
    expect(computeScore({ q1: 1, q2: 2, q3: 0 })).toBe(3);
    expect(computeScore({})).toBe(0);
    expect(computeScore({ q1: 3, q2: 3, q3: 3 })).toBe(9);
  });
});

describe("PHQ-9", () => {
  it("interpreta score 0-4 como Mínimo", () => {
    expect(PHQ9.interpret(0).level).toBe("ok");
    expect(PHQ9.interpret(0).label).toBe("Mínimo");
    expect(PHQ9.interpret(4).label).toBe("Mínimo");
  });

  it("interpreta score 5-9 como Leve", () => {
    expect(PHQ9.interpret(5).label).toBe("Leve");
    expect(PHQ9.interpret(9).label).toBe("Leve");
    expect(PHQ9.interpret(5).level).toBe("ok");
  });

  it("interpreta score 10-14 como Moderado", () => {
    expect(PHQ9.interpret(10).label).toBe("Moderado");
    expect(PHQ9.interpret(14).label).toBe("Moderado");
    expect(PHQ9.interpret(10).level).toBe("warn");
  });

  it("interpreta score 15-19 como Moderadamente grave", () => {
    expect(PHQ9.interpret(15).label).toBe("Moderadamente grave");
    expect(PHQ9.interpret(15).level).toBe("crit");
  });

  it("interpreta score 20-27 como Grave", () => {
    expect(PHQ9.interpret(20).label).toBe("Grave");
    expect(PHQ9.interpret(27).label).toBe("Grave");
    expect(PHQ9.interpret(27).level).toBe("crit");
  });

  it("score máximo é 27 (9 perguntas × 3)", () => {
    expect(PHQ9.maxScore).toBe(27);
    expect(PHQ9.questions).toHaveLength(9);
  });
});

describe("GAD-7", () => {
  it("interpreta score 0-4 como Mínimo", () => {
    expect(GAD7.interpret(0).label).toBe("Mínimo");
    expect(GAD7.interpret(4).level).toBe("ok");
  });

  it("interpreta score 5-9 como Leve", () => {
    expect(GAD7.interpret(5).label).toBe("Leve");
    expect(GAD7.interpret(9).level).toBe("ok");
  });

  it("interpreta score 10-14 como Moderado", () => {
    expect(GAD7.interpret(10).label).toBe("Moderado");
    expect(GAD7.interpret(10).level).toBe("warn");
  });

  it("interpreta score ≥15 como Grave", () => {
    expect(GAD7.interpret(15).label).toBe("Grave");
    expect(GAD7.interpret(21).level).toBe("crit");
  });

  it("score máximo é 21 (7 perguntas × 3)", () => {
    expect(GAD7.maxScore).toBe(21);
    expect(GAD7.questions).toHaveLength(7);
  });
});

describe("AUDIT-C", () => {
  it("triagem negativa para score abaixo do limiar masculino (< 4)", () => {
    expect(AUDIT_C.interpret(3, "Masculino").label).toBe("Triagem negativa");
    expect(AUDIT_C.interpret(3, "Masculino").level).toBe("ok");
  });

  it("triagem negativa para score abaixo do limiar feminino (< 3)", () => {
    expect(AUDIT_C.interpret(2, "Feminino").label).toBe("Triagem negativa");
  });

  it("triagem positiva para score ≥ 4 em homens", () => {
    expect(AUDIT_C.interpret(4, "Masculino").level).toBe("warn");
    expect(AUDIT_C.interpret(4, "Masculino").label).toContain("uso de risco");
  });

  it("triagem positiva para score ≥ 3 em mulheres", () => {
    expect(AUDIT_C.interpret(3, "Feminino").level).toBe("warn");
  });

  it("score muito alto indica uso nocivo", () => {
    expect(AUDIT_C.interpret(8, "Masculino").level).toBe("crit");
    expect(AUDIT_C.interpret(12, "Feminino").level).toBe("crit");
  });

  it("tem 3 perguntas e score máximo 12", () => {
    expect(AUDIT_C.questions).toHaveLength(3);
    expect(AUDIT_C.maxScore).toBe(12);
  });
});

describe("Mini-Cog", () => {
  it("rastreio positivo para score 0-2", () => {
    expect(MINI_COG.interpret(0).level).toBe("crit");
    expect(MINI_COG.interpret(0).label).toContain("positivo");
    expect(MINI_COG.interpret(2).level).toBe("crit");
  });

  it("limítrofe para score 3", () => {
    expect(MINI_COG.interpret(3).level).toBe("warn");
  });

  it("rastreio negativo para score 4-5", () => {
    expect(MINI_COG.interpret(4).level).toBe("ok");
    expect(MINI_COG.interpret(5).label).toBe("Rastreio negativo");
  });

  it("score máximo é 5 (recall 3 + clock 2)", () => {
    expect(MINI_COG.maxScore).toBe(5);
    expect(MINI_COG.questions).toHaveLength(2);
  });
});

describe("Edmonton Frailty Scale", () => {
  it("sem fragilidade para score 0-4", () => {
    expect(EDMONTON.interpret(0).label).toBe("Sem fragilidade");
    expect(EDMONTON.interpret(4).level).toBe("ok");
  });

  it("vulnerável para score 5-6", () => {
    expect(EDMONTON.interpret(5).label).toBe("Vulnerável");
    expect(EDMONTON.interpret(6).level).toBe("ok");
  });

  it("fragilidade leve para score 7-8", () => {
    expect(EDMONTON.interpret(7).label).toBe("Fragilidade leve");
    expect(EDMONTON.interpret(8).level).toBe("warn");
  });

  it("fragilidade moderada para score 9-10", () => {
    expect(EDMONTON.interpret(9).label).toBe("Fragilidade moderada");
    expect(EDMONTON.interpret(10).level).toBe("warn");
  });

  it("fragilidade grave para score ≥ 11", () => {
    expect(EDMONTON.interpret(11).label).toBe("Fragilidade grave");
    expect(EDMONTON.interpret(17).level).toBe("crit");
  });

  it("score máximo é 17", () => {
    expect(EDMONTON.maxScore).toBe(17);
  });
});
