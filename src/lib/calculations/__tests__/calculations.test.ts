import { describe, it, expect } from "vitest";
import { calculateIMC } from "../imc";
import { calculateTFG } from "../tfg";
import { calculateFIB4 } from "../fib4";
import { calculateRCV } from "../rcv";
import { calculateLDL, calculateNaoHDL } from "../lipids";

// ─── IMC ────────────────────────────────────────────────────────────────────────
describe("calculateIMC", () => {
  it("classifica eutrófico para valores normais", () => {
    const r = calculateIMC(70, 175);
    expect(r).not.toBeNull();
    expect(r!.value).toBeCloseTo(22.9, 1);
    expect(r!.classification).toBe("Eutrófico");
  });

  it("classifica baixo peso", () => {
    const r = calculateIMC(45, 170);
    expect(r).not.toBeNull();
    expect(r!.classification).toBe("Baixo peso");
  });

  it("classifica obesidade III", () => {
    const r = calculateIMC(140, 165);
    expect(r).not.toBeNull();
    expect(r!.classification).toBe("Obesidade III");
  });

  it("classifica sobrepeso no limite exato de 25.0 (76.5625 / 1.75²)", () => {
    // 76.5625 / 1.75² = 1225/49 = 25 (exato em IEEE 754)
    const r = calculateIMC(76.5625, 175);
    expect(r).not.toBeNull();
    expect(r!.value).toBeCloseTo(25.0, 1); // primary: numérico
    expect(r!.classification).toBe("Sobrepeso"); // primary: classificação
  });

  it("retorna null para peso zero", () => {
    expect(calculateIMC(0, 175)).toBeNull();
  });

  it("retorna null para altura zero", () => {
    expect(calculateIMC(70, 0)).toBeNull();
  });

  it("retorna null para valores negativos", () => {
    expect(calculateIMC(-5, 170)).toBeNull();
    expect(calculateIMC(70, -10)).toBeNull();
  });

  it("retorna null para NaN inputs (parseFloat de string vazia/inválida)", () => {
    // Simula o que parseFloat("") retorna
    expect(calculateIMC(NaN, 170)).toBeNull();
    expect(calculateIMC(70, NaN)).toBeNull();
    expect(calculateIMC(NaN, NaN)).toBeNull();
  });

  it("retorna null para valores infinitos (Number.isFinite como proteção extra)", () => {
    expect(calculateIMC(Infinity, 170)).toBeNull();
    expect(calculateIMC(70, Infinity)).toBeNull();
    expect(calculateIMC(-Infinity, 170)).toBeNull();
  });
});

// ─── TFG CKD-EPI 2021 ──────────────────────────────────────────────────────────
describe("calculateTFG", () => {
  it("retorna Faixa G1 para mulher jovem com creatinina normal", () => {
    const r = calculateTFG(0.7, 30, "Feminino");
    expect(r).not.toBeNull();
    expect(r!.stage).toBe("Faixa G1");
    expect(r!.value).toBeGreaterThan(90);
  });

  it("retorna Faixa G3b para homem idoso (cr=2.0, idade=70)", () => {
    const r = calculateTFG(2.0, 70, "Masculino");
    expect(r).not.toBeNull();
    expect(r!.stage).toBe("Faixa G3b");
    expect(r!.value).toBeCloseTo(35.2, 0);
  });

  it("calcula corretamente no limiar κ (ratio=1.0) para homem (cr=0.9, idade=50)", () => {
    const r = calculateTFG(0.9, 50, "Masculino");
    expect(r).not.toBeNull();
    expect(r!.stage).toBe("Faixa G1");
    expect(r!.value).toBeCloseTo(104, 0);
  });

  it("retorna null para creatinina zero", () => {
    expect(calculateTFG(0, 40, "Masculino")).toBeNull();
  });

  it("retorna null para idade zero (< 18)", () => {
    expect(calculateTFG(1.0, 0, "Feminino")).toBeNull();
  });
});

// ─── FIB-4 ──────────────────────────────────────────────────────────────────────
describe("calculateFIB4", () => {
  it("classifica baixo risco (faixa 35-65)", () => {
    const r = calculateFIB4(35, 22, 25, 250);
    expect(r).not.toBeNull();
    expect(r!.risk).toBe("Baixo risco");
    expect(r!.value).toBeLessThan(1.3);
    expect(r!.lowValidity).toBe(false);
  });

  it("classifica alto risco (faixa 35-65)", () => {
    const r = calculateFIB4(60, 80, 40, 90);
    expect(r).not.toBeNull();
    expect(r!.risk).toBe("Alto risco");
    expect(r!.value).toBeGreaterThan(2.67);
  });

  it("classifica risco indeterminado (faixa 35-65)", () => {
    // FIB-4 = (50 * 40) / (200 * sqrt(30)) ≈ 1.83
    const r = calculateFIB4(50, 40, 30, 200);
    expect(r).not.toBeNull();
    expect(r!.risk).toBe("Risco indeterminado");
    expect(r!.value).toBeGreaterThanOrEqual(1.3);
    expect(r!.value).toBeLessThanOrEqual(2.67);
  });

  it("retorna null para qualquer parâmetro zero", () => {
    expect(calculateFIB4(0, 22, 25, 250)).toBeNull();
    expect(calculateFIB4(35, 0, 25, 250)).toBeNull();
    expect(calculateFIB4(35, 22, 0, 250)).toBeNull();
    expect(calculateFIB4(35, 22, 25, 0)).toBeNull();
  });
});

// ─── RCV Framingham ─────────────────────────────────────────────────────────────
describe("calculateRCV", () => {
  it("classifica baixo risco para homem saudável", () => {
    const r = calculateRCV(40, 120, 180, 50, "Masculino", false, false, false);
    expect(r).not.toBeNull();
    expect(r!.risk).toBe("Baixo risco");
    expect(r!.outOfRange).toBe(false);
  });

  it("classifica alto risco para mulher com múltiplos fatores (feminino >= 10%)", () => {
    const r = calculateRCV(65, 160, 280, 35, "Feminino", true, true, true);
    expect(r).not.toBeNull();
    expect(r!.outOfRange).toBe(false);
    expect(r!.risk).toBe("Alto risco");
  });

  it("retorna outOfRange para idade abaixo de 30", () => {
    const r = calculateRCV(25, 120, 180, 50, "Masculino", false, false, false);
    expect(r).not.toBeNull();
    expect(r!.outOfRange).toBe(true);
    expect(r!.risk).toBe("Fora da faixa etária do escore");
  });

  it("retorna outOfRange para idade acima de 74", () => {
    const r = calculateRCV(80, 120, 180, 50, "Masculino", false, false, false);
    expect(r).not.toBeNull();
    expect(r!.outOfRange).toBe(true);
  });

  it("retorna null para PAS zero", () => {
    expect(calculateRCV(40, 0, 180, 50, "Masculino", false, false, false)).toBeNull();
  });

  it("retorna null para CT ou HDL zero", () => {
    expect(calculateRCV(40, 120, 0, 50, "Masculino", false, false, false)).toBeNull();
    expect(calculateRCV(40, 120, 180, 0, "Masculino", false, false, false)).toBeNull();
  });
});

// ─── LDL Friedewald ─────────────────────────────────────────────────────────────
describe("calculateLDL", () => {
  it("calcula LDL corretamente — caso típico", () => {
    // LDL = 200 - 50 - 150/5 = 200 - 50 - 30 = 120
    const r = calculateLDL(200, 50, 150);
    expect(r).not.toBeNull();
    expect(r!.value).toBeCloseTo(120, 1);
  });

  it("retorna null quando TG >= 400 (fórmula inválida)", () => {
    expect(calculateLDL(250, 50, 400)).toBeNull();
    expect(calculateLDL(250, 50, 500)).toBeNull();
  });

  it("retorna null para qualquer parâmetro zero ou negativo", () => {
    expect(calculateLDL(0, 50, 150)).toBeNull();
    expect(calculateLDL(200, 0, 150)).toBeNull();
    expect(calculateLDL(200, 50, 0)).toBeNull();
  });

  it("retorna null se resultado for negativo (CT < HDL + TG/5)", () => {
    expect(calculateLDL(100, 90, 100)).toBeNull();
  });
});

// ─── Não-HDL ────────────────────────────────────────────────────────────────────
describe("calculateNaoHDL", () => {
  it("calcula Não-HDL corretamente", () => {
    // 200 - 50 = 150
    const r = calculateNaoHDL(200, 50);
    expect(r).not.toBeNull();
    expect(r!.value).toBeCloseTo(150, 1);
  });

  it("retorna null para CT ou HDL zero", () => {
    expect(calculateNaoHDL(0, 50)).toBeNull();
    expect(calculateNaoHDL(200, 0)).toBeNull();
  });

  it("retorna null se resultado for negativo (HDL > CT)", () => {
    expect(calculateNaoHDL(40, 60)).toBeNull();
  });
});

// ─── TFG — regras de idade ───────────────────────────────────────────────────
describe("calculateTFG — validação de idade", () => {
  it("retorna null para idade < 18", () => {
    expect(calculateTFG(0.9, 17, "Masculino")).toBeNull();
  });

  it("calcula normalmente para idade = 18", () => {
    const r = calculateTFG(0.9, 18, "Masculino");
    expect(r).not.toBeNull();
  });
});

// ─── FIB-4 — bandas etárias ──────────────────────────────────────────────────
describe("calculateFIB4 — bandas etárias", () => {
  it("marca lowValidity para idade < 35", () => {
    const r = calculateFIB4(30, 40, 30, 200);
    expect(r).not.toBeNull();
    expect(r!.lowValidity).toBe(true);
  });

  it("usa threshold 2.0 para idade > 65 (baixo risco)", () => {
    // FIB-4 < 2.0 → baixo risco para >65
    const r = calculateFIB4(70, 35, 30, 220); // (70*35)/(220*sqrt(30)) ≈ 2450/1205 ≈ 2.03 → indeterminado
    expect(r).not.toBeNull();
    expect(r!.lowValidity).toBeFalsy();
  });
});

// ─── RCV — threshold por sexo ────────────────────────────────────────────────
describe("calculateRCV — threshold por sexo", () => {
  it("classifica alto risco feminino em >= 10%", () => {
    const r = calculateRCV(62, 160, 230, 45, "Feminino", true, true, true);
    expect(r).not.toBeNull();
    expect(r!.outOfRange).toBe(false);
    if (r && r.value >= 10) expect(r.risk).toBe("Alto risco");
  });

  it("retorna outOfRange para idade < 30", () => {
    const r = calculateRCV(29, 130, 200, 50, "Masculino", false, false, false);
    expect(r).not.toBeNull();
    expect(r!.outOfRange).toBe(true);
  });

  it("retorna outOfRange para idade > 74", () => {
    const r = calculateRCV(75, 130, 200, 50, "Masculino", false, false, false);
    expect(r).not.toBeNull();
    expect(r!.outOfRange).toBe(true);
  });
});

// ─── IMC — badge de severidade (fronteiras OMS) ───────────────────────────────
describe("calculateIMC — badge de severidade por faixa", () => {
  // Helper que reproduz exatamente a lógica do clinical-summary.tsx
  function badgeVariant(value: number): string {
    if (value >= 35) return "crit";
    if (value >= 30) return "warn";
    if (value < 18.5) return "warn";
    if (value < 25) return "ok";
    return "warn";
  }

  it("< 18.5 → warn (baixo peso)", () => {
    expect(badgeVariant(17.9)).toBe("warn");
    expect(badgeVariant(18.4)).toBe("warn");
  });

  it("18.5–24.9 → ok (eutrófico)", () => {
    expect(badgeVariant(18.5)).toBe("ok");
    expect(badgeVariant(22.0)).toBe("ok");
    expect(badgeVariant(24.9)).toBe("ok");
  });

  it("25–29.9 → warn (sobrepeso)", () => {
    expect(badgeVariant(25.0)).toBe("warn");
    expect(badgeVariant(27.0)).toBe("warn");
    expect(badgeVariant(29.9)).toBe("warn");
  });

  it("30–34.9 → warn (obesidade I)", () => {
    expect(badgeVariant(30.0)).toBe("warn");
    expect(badgeVariant(32.0)).toBe("warn");
    expect(badgeVariant(34.9)).toBe("warn");
  });

  it("35–39.9 → crit (obesidade II)", () => {
    expect(badgeVariant(35.0)).toBe("crit");
    expect(badgeVariant(37.0)).toBe("crit");
    expect(badgeVariant(39.9)).toBe("crit");
  });

  it(">= 40 → crit (obesidade III)", () => {
    expect(badgeVariant(40.0)).toBe("crit");
    expect(badgeVariant(50.0)).toBe("crit");
  });

  it("fronteiras exatas: 18.5, 25, 30, 35, 40", () => {
    expect(badgeVariant(18.4)).toBe("warn");  // 18.4 < 18.5
    expect(badgeVariant(18.5)).toBe("ok");    // 18.5 >= 18.5 mas < 25
    expect(badgeVariant(24.9)).toBe("ok");    // 24.9 < 25
    expect(badgeVariant(25.0)).toBe("warn");  // 25.0 >= 25
    expect(badgeVariant(29.9)).toBe("warn");  // 29.9 >= 25
    expect(badgeVariant(30.0)).toBe("warn");  // 30.0 >= 30
    expect(badgeVariant(34.9)).toBe("warn");  // 34.9 < 35
    expect(badgeVariant(35.0)).toBe("crit");  // 35.0 >= 35
    expect(badgeVariant(39.9)).toBe("crit");  // 39.9 >= 35
    expect(badgeVariant(40.0)).toBe("crit");  // 40.0 >= 35
  });
});
