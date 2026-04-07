import { describe, it, expect } from "vitest";
import { generateEsusSummary } from "../esus-generator";
import type { ConsultationState } from "@/types";

/** Factory que retorna um ConsultationState mínimo vazio com overrides. */
function makeState(overrides: Partial<ConsultationState> = {}): ConsultationState {
  const base: ConsultationState = {
    patient: { name: "", age: "", gender: "", race: "", consultationDate: "" },
    vitals: { pas: "", pad: "", peso: "", altura: "", imc: "", ca_abd: "", fc: "", spo2: "", temp: "" },
    problems: [],
    problemsOther: "",
    preventions: [],
    labs: {},
    labsDate: "",
    imaging: { date: "", entries: "" },
    calculations: { imc: null, tfg: null, fib4: null, rcv: null },
    soap: { subjective: "", objective: "", assessment: "", plan: "" },
    history: { personal: "", family: "", habits: "", medications: "", allergies: "", comorbidities: "" },
    prescription: "",
    requestedExams: "",
    patientInstructions: "",
    followupItems: [],
    labsExtras: "",
  };

  return {
    ...base,
    ...overrides,
    patient: { ...base.patient, ...(overrides.patient ?? {}) },
    soap: { ...base.soap, ...(overrides.soap ?? {}) },
    history: { ...base.history, ...(overrides.history ?? {}) },
    imaging: { ...base.imaging, ...(overrides.imaging ?? {}) },
    calculations: { ...base.calculations, ...(overrides.calculations ?? {}) },
  } as ConsultationState;
}

describe("generateEsusSummary", () => {
  it("retorna string vazia para state completamente vazio", () => {
    const output = generateEsusSummary(makeState());
    expect(output).toBe("");
  });

  it("gera seções completas quando todos os campos estão preenchidos", () => {
    const state = makeState({
      problems: ["HAS", "DM2"],
      problemsOther: "Gota",
      history: {
        personal: "Cirurgia prévia",
        family: "Pai com IAM",
        habits: "Sedentário",
        medications: "Metformina 850mg\nLosartana 50mg",
        allergies: "Dipirona",
        comorbidities: "HAS\nDM2",
      },
      preventions: ["Mamografia em dia"],
      soap: {
        subjective: "Dor torácica",
        objective: "PA 140/90",
        assessment: "HAS mal controlada",
        plan: "Ajustar medicação",
      },
      prescription: "Losartana 100mg 1x/dia\nHCTZ 25mg 1x/dia",
      requestedExams: "ECG, Hemograma",
      patientInstructions: "Medir PA em casa diariamente.",
      calculations: {
        imc: null,
        tfg: { value: 85.3, stage: "G2" },
        fib4: { value: 0.8, risk: "Baixo risco (F0-F2)" },
        rcv: { value: 12.5, risk: "Intermediário" },
      },
    });

    const output = generateEsusSummary(state);

    expect(output).toContain("LISTA DE PROBLEMAS");
    expect(output).toContain("• HAS");
    expect(output).toContain("• DM2");
    expect(output).toContain("• Gota");
    expect(output).toContain("DOENÇA ATUAL");
    expect(output).toContain("• História Clínica");
    expect(output).toContain("PRESCRIÇÃO");
    expect(output).toContain("1. Losartana 100mg 1x/dia");
    expect(output).toContain("2. HCTZ 25mg 1x/dia");
    expect(output).toContain("EXAMES SOLICITADOS");
    expect(output).toContain("ORIENTAÇÕES");
    expect(output).toContain("RASTREAMENTOS");
    expect(output).toContain("ANTECEDENTES");
    expect(output).toContain("MUC");
    expect(output).toContain("ALERGIAS");
    expect(output).toContain("PREVENÇÕES");
  });

  it("lista problemas de problems + problemsOther (vírgula) com bullets individuais", () => {
    const output = generateEsusSummary(
      makeState({ problems: ["HAS", "DM2"], problemsOther: "Gota, DPOC" })
    );
    // Robusto: verifica conteúdo sem assumir posição da seção
    expect(output).toMatch(/LISTA DE PROBLEMAS[\s\S]*• HAS/);
    expect(output).toContain("• DM2");
    expect(output).toContain("• Gota");
    expect(output).toContain("• DPOC");
  });

  it("problemsOther com item único (sem vírgula) também gera bullet", () => {
    const output = generateEsusSummary(
      makeState({ problemsOther: "Gota" })
    );
    expect(output).toContain("• Gota");
  });

  it("numera cada linha da prescrição sequencialmente", () => {
    const lines = Array.from({ length: 12 }, (_, i) => `Medicamento ${i + 1}`);
    const output = generateEsusSummary(makeState({ prescription: lines.join("\n") }));
    for (let i = 1; i <= 12; i++) {
      expect(output).toContain(`${i}. Medicamento ${i}`);
    }
  });

  it("renderiza SOAP parcial apenas com subjective", () => {
    const output = generateEsusSummary(
      makeState({ soap: { subjective: "Cefaleia intensa", objective: "", assessment: "", plan: "" } })
    );
    expect(output).toContain("DOENÇA ATUAL");
    expect(output).toContain("• História Clínica");
    expect(output).toContain("Cefaleia intensa");
    expect(output).not.toContain("Exame Físico");
    expect(output).not.toContain("Hipótese Diagnóstica");
    expect(output).not.toContain("Plano");
  });

  it("renderiza alergias multilinhas com bullets individuais", () => {
    const output = generateEsusSummary(
      makeState({
        history: {
          personal: "", family: "", habits: "", medications: "",
          allergies: "Dipirona\nAAS",
          comorbidities: "",
        },
      })
    );
    expect(output).toContain("ALERGIAS");
    expect(output).toContain("• Dipirona");
    expect(output).toContain("• AAS");
  });
});
