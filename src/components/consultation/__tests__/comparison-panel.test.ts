import { describe, it, expect } from "vitest";
import { getPreviousVitals, getTrend } from "../comparison-panel";
import type { Vitals } from "@/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeVitals(pas: string, pad: string, peso: string): Vitals {
  return {
    pas,
    pad,
    peso,
    altura: "",
    imc: "",
    ca_abd: "",
    fc: "",
    spo2: "",
    temp: "",
  };
}

function makeConsultation(id: string, vitals: Vitals | null = null) {
  return { id, vitals };
}

// ---------------------------------------------------------------------------
// getPreviousVitals
// ---------------------------------------------------------------------------

describe("getPreviousVitals", () => {
  it("paciente sem histórico — retorna null", () => {
    expect(getPreviousVitals([], null)).toBeNull();
  });

  it("paciente com 1 consulta anterior e nova consulta (currentId=null) — retorna vitals da consulta salva", () => {
    const vitals = makeVitals("120", "80", "70");
    const data = [makeConsultation("consulta-1", vitals)];
    expect(getPreviousVitals(data, null)).toEqual(vitals);
  });

  it("consulta atual já salva (currentId = data[0]) — ignora data[0] e retorna data[1]", () => {
    const current = makeVitals("150", "95", "85");
    const previous = makeVitals("130", "85", "80");
    const data = [
      makeConsultation("consulta-atual", current),
      makeConsultation("consulta-anterior", previous),
    ];
    expect(getPreviousVitals(data, "consulta-atual")).toEqual(previous);
  });

  it("consulta atual é a única — retorna null (não compara consigo mesmo)", () => {
    const vitals = makeVitals("120", "80", "70");
    const data = [makeConsultation("consulta-unica", vitals)];
    expect(getPreviousVitals(data, "consulta-unica")).toBeNull();
  });

  it("consulta anterior com vitals null — retorna null", () => {
    const data = [makeConsultation("consulta-1", null)];
    expect(getPreviousVitals(data, null)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// getTrend
// ---------------------------------------------------------------------------

describe("getTrend", () => {
  it("valores iguais — estável", () => {
    expect(getTrend(120, 120)).toBe("stable");
  });

  it("diferença < 1 — estável (threshold)", () => {
    expect(getTrend(120.5, 120)).toBe("stable");
  });

  it("valor atual maior — subiu", () => {
    expect(getTrend(150, 120)).toBe("up");
  });

  it("valor atual menor — caiu", () => {
    expect(getTrend(110, 130)).toBe("down");
  });

  it("diferença exatamente 1 — subiu (threshold exclusivo)", () => {
    expect(getTrend(121, 120)).toBe("up");
  });
});
