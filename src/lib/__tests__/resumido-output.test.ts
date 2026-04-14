/**
 * Testa completeness do output resumido pós-Sessão 12 QA.
 * Valida que campos adicionados estão presentes no output.
 */

import { describe, it, expect } from "vitest";
import { generateResumoOutput } from "../output-generators/resumido";
import type { ConsultationState } from "@/types";

function makeState(overrides: Partial<ConsultationState> = {}): ConsultationState {
  const base: ConsultationState = {
    patient: { name: "", age: "", gender: "", race: "", consultationDate: "" },
    vitals: { pas: "", pad: "", peso: "", altura: "", imc: "", ca_abd: "", fc: "", spo2: "", temp: "" },
    problems: [],
    problemsOther: "",
    preventions: [],
    labs: {},
    labsDate: "",
    imaging: { date: "", entries: "", items: [] },
    calculations: { imc: null, tfg: null, fib4: null, rcv: null, ldl: null, naoHdl: null },
    soap: { subjective: "", objective: "", assessment: "", plan: "" },
    history: { personal: "", family: "", habits: "", medications: "", allergies: "", comorbidities: "" },
    prescription: "",
    requestedExams: "",
    patientInstructions: "",
    followupItems: [],
    labsExtras: "",
    triagens: {},
    timerState: { started_at: null, finished_at: null, active_seconds: 0 },
    copiesThisSession: 0,
    customEsusText: null,
  };
  return { ...base, ...overrides } as ConsultationState;
}

describe("generateResumoOutput — completude pós-QA S12", () => {
  it("inclui soap.subjective e soap.objective (não apenas A/P)", () => {
    const state = makeState({
      soap: {
        subjective: "Paciente refere cefaleia há 3 dias",
        objective: "PA 140/90, FC 78",
        assessment: "HAS borderline",
        plan: "Ajustar Losartana",
      },
    });
    const output = generateResumoOutput(state);
    expect(output).toContain("S: Paciente refere cefaleia há 3 dias");
    expect(output).toContain("O: PA 140/90, FC 78");
    expect(output).toContain("A: HAS borderline");
    expect(output).toContain("P: Ajustar Losartana");
  });

  it("inclui vitais expandidos (fc, spo2, temp, altura, ca_abd)", () => {
    const state = makeState({
      vitals: {
        pas: "140", pad: "90", peso: "78", altura: "165", imc: "28.7",
        ca_abd: "92", fc: "78", spo2: "98", temp: "36.8",
      },
    });
    const output = generateResumoOutput(state);
    expect(output).toContain("PA 140/90");
    expect(output).toContain("78 kg");
    expect(output).toContain("FC 78 bpm");
    expect(output).toContain("SpO2 98%");
    expect(output).toContain("Temp 36.8 °C");
    expect(output).toContain("165 cm");
    expect(output).toContain("CA 92 cm");
  });

  it("inclui history.allergies (alergias)", () => {
    const state = makeState({
      history: {
        personal: "", family: "", habits: "", medications: "",
        allergies: "Dipirona\nAAS",
        comorbidities: "",
      },
    });
    const output = generateResumoOutput(state);
    expect(output).toContain("Alergias:");
    expect(output).toContain("Dipirona");
    expect(output).toContain("AAS");
  });

  it("inclui calculations (tfg, fib4, rcv, ldl, naoHdl)", () => {
    const state = makeState({
      calculations: {
        imc: null,
        tfg: { value: 75.3, stage: "G1" },
        fib4: { value: 1.2, risk: "Intermediário" },
        rcv: { value: 8.5, risk: "Baixo" },
        ldl: { value: 118 },
        naoHdl: { value: 142 },
      },
    });
    const output = generateResumoOutput(state);
    expect(output).toContain("TFG 75 mL/min");
    expect(output).toContain("FIB-4");
    expect(output).toContain("RCV");
    expect(output).toContain("LDL 118 mg/dL");
    expect(output).toContain("Não-HDL 142 mg/dL");
  });

  it("inclui labsExtras", () => {
    const state = makeState({ labsExtras: "Vitamina D: 28 ng/mL\nFerritina: 150" });
    const output = generateResumoOutput(state);
    expect(output).toContain("Exames:");
    expect(output).toContain("Vitamina D");
    expect(output).toContain("Ferritina");
  });

  it("não gera output vazio quando só patient.name existe", () => {
    const state = makeState({ patient: { name: "João", age: "45", gender: "Masculino", race: "", consultationDate: "" } });
    const output = generateResumoOutput(state);
    expect(output.trim()).toBe("**João · 45 · Masculino**");
  });

  it("triagens clínicas aparecem no resumido", () => {
    const state = makeState({
      triagens: {
        phq9: { scaleId: "phq9", answers: {}, score: 8, interpretation: "Leve", level: "ok", appliedAt: "" },
      },
    });
    const output = generateResumoOutput(state);
    expect(output).toContain("Triagens clínicas");
    expect(output).toContain("PHQ9");
    expect(output).toContain("8 pts");
  });
});
