import { describe, it, expect } from "vitest";
import { calculateIMC } from "../imc";
import { calculateTFG } from "../tfg";
import { calculateFIB4 } from "../fib4";
import { calculateRCV } from "../rcv";

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
});

// ─── TFG CKD-EPI 2021 ──────────────────────────────────────────────────────────
describe("calculateTFG", () => {
  it("retorna G1 para mulher jovem com creatinina normal", () => {
    const r = calculateTFG(0.7, 30, "Feminino");
    expect(r).not.toBeNull();
    expect(r!.stage).toBe("G1");
    expect(r!.value).toBeGreaterThan(90);
  });

  it("retorna exatamente G3b para homem idoso (cr=2.0, idade=70)", () => {
    // CKD-EPI 2021: 142 × (2/0.9)^-1.2 × 0.9938^70 ≈ 35.2 mL/min → G3b
    const r = calculateTFG(2.0, 70, "Masculino");
    expect(r).not.toBeNull();
    expect(r!.stage).toBe("G3b");
    expect(r!.value).toBeCloseTo(35.2, 0);
  });

  it("calcula corretamente no limiar κ (ratio=1.0) para homem (cr=0.9, idade=50)", () => {
    // ratio = 0.9/0.9 = 1 → branch ≤1 → 142 × 1^-0.302 × 0.9938^50 ≈ 104 mL/min → G1
    const r = calculateTFG(0.9, 50, "Masculino");
    expect(r).not.toBeNull();
    expect(r!.stage).toBe("G1");
    expect(r!.value).toBeCloseTo(104, 0);
  });

  it("retorna null para creatinina zero", () => {
    expect(calculateTFG(0, 40, "Masculino")).toBeNull();
  });

  it("retorna null para idade zero", () => {
    expect(calculateTFG(1.0, 0, "Feminino")).toBeNull();
  });
});

// ─── FIB-4 ──────────────────────────────────────────────────────────────────────
describe("calculateFIB4", () => {
  it("classifica baixo risco", () => {
    const r = calculateFIB4(35, 22, 25, 250);
    expect(r).not.toBeNull();
    expect(r!.risk).toBe("Baixo risco (F0-F2)");
    expect(r!.value).toBeLessThan(1.3);
  });

  it("classifica alto risco", () => {
    const r = calculateFIB4(60, 80, 40, 90);
    expect(r).not.toBeNull();
    expect(r!.risk).toBe("Alto risco (F3-F4)");
    expect(r!.value).toBeGreaterThan(2.67);
  });

  it("classifica indeterminado", () => {
    // FIB-4 = (50 * 40) / (200 * sqrt(30)) ≈ 1.83
    const r = calculateFIB4(50, 40, 30, 200);
    expect(r).not.toBeNull();
    expect(r!.risk).toBe("Indeterminado");
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
    expect(r!.risk).toBe("Baixo");
    expect(r!.value).toBeLessThan(10);
  });

  it("classifica alto risco para mulher com múltiplos fatores", () => {
    const r = calculateRCV(65, 160, 280, 35, "Feminino", true, true, true);
    expect(r).not.toBeNull();
    expect(r!.risk).toBe("Alto");
    expect(r!.value).toBeGreaterThanOrEqual(20);
  });

  it("retorna null para idade abaixo de 30", () => {
    expect(calculateRCV(25, 120, 180, 50, "Masculino", false, false, false)).toBeNull();
  });

  it("retorna null para idade acima de 74", () => {
    expect(calculateRCV(80, 120, 180, 50, "Masculino", false, false, false)).toBeNull();
  });

  it("retorna null para PAS zero", () => {
    expect(calculateRCV(40, 0, 180, 50, "Masculino", false, false, false)).toBeNull();
  });

  it("retorna null para CT ou HDL zero", () => {
    expect(calculateRCV(40, 120, 0, 50, "Masculino", false, false, false)).toBeNull();
    expect(calculateRCV(40, 120, 180, 0, "Masculino", false, false, false)).toBeNull();
  });
});
