"use client";

import { create } from "zustand";
import type { ConsultationState, PatientInfo, Vitals, SoapNotes, History, ImagingData, Calculations } from "@/types";

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

const initialState: ConsultationState = {
  patient: { name: "", age: "", gender: "", race: "", consultationDate: todayISO() },
  vitals: { pas: "", pad: "", peso: "", altura: "", imc: "", ca_abd: "", fc: "", spo2: "", temp: "" },
  problems: [],
  problemsOther: "",
  preventions: [],
  labs: {},
  labsDate: todayISO(),
  imaging: { date: todayISO(), entries: "" },
  calculations: { imc: null, tfg: null, fib4: null, rcv: null },
  soap: { subjective: "", objective: "", assessment: "", plan: "" },
  history: { personal: "", family: "", habits: "", medications: "", allergies: "", comorbidities: "" },
  prescription: "",
  requestedExams: "",
  patientInstructions: "",
};

interface ConsultationActions {
  setPatient: (patient: Partial<PatientInfo>) => void;
  setVitals: (vitals: Partial<Vitals>) => void;
  toggleProblem: (problem: string) => void;
  setProblemsOther: (value: string) => void;
  togglePrevention: (prevention: string) => void;
  setLab: (key: string, value: string) => void;
  setLabsDate: (date: string) => void;
  setImaging: (imaging: Partial<ImagingData>) => void;
  setCalculations: (calcs: Partial<Calculations>) => void;
  setSoap: (soap: Partial<SoapNotes>) => void;
  setHistory: (history: Partial<History>) => void;
  setPrescription: (value: string) => void;
  setRequestedExams: (value: string) => void;
  setPatientInstructions: (value: string) => void;
  currentConsultationId: string | null;
  setCurrentConsultationId: (id: string | null) => void;
  loadState: (savedState: ConsultationState, id: string) => void;
  reset: () => void;
}

export type ConsultationStore = ConsultationState & ConsultationActions;

export const useConsultationStore = create<ConsultationStore>((set) => ({
  ...initialState,
  currentConsultationId: null,

  setCurrentConsultationId: (id) => set({ currentConsultationId: id }),

  loadState: (savedState, id) => set({ ...savedState, currentConsultationId: id }),


  setPatient: (patient) =>
    set((state) => ({ patient: { ...state.patient, ...patient } })),

  setVitals: (vitals) =>
    set((state) => ({ vitals: { ...state.vitals, ...vitals } })),

  toggleProblem: (problem) =>
    set((state) => ({
      problems: state.problems.includes(problem)
        ? state.problems.filter((p) => p !== problem)
        : [...state.problems, problem],
    })),

  setProblemsOther: (value) => set({ problemsOther: value }),

  togglePrevention: (prevention) =>
    set((state) => ({
      preventions: state.preventions.includes(prevention)
        ? state.preventions.filter((p) => p !== prevention)
        : [...state.preventions, prevention],
    })),

  setLab: (key, value) =>
    set((state) => ({ labs: { ...state.labs, [key]: value } })),

  setLabsDate: (date) => set({ labsDate: date }),

  setImaging: (imaging) =>
    set((state) => ({ imaging: { ...state.imaging, ...imaging } })),

  setCalculations: (calcs) =>
    set((state) => ({ calculations: { ...state.calculations, ...calcs } })),

  setSoap: (soap) =>
    set((state) => ({ soap: { ...state.soap, ...soap } })),

  setHistory: (history) =>
    set((state) => ({ history: { ...state.history, ...history } })),

  setPrescription: (value) => set({ prescription: value }),
  setRequestedExams: (value) => set({ requestedExams: value }),
  setPatientInstructions: (value) => set({ patientInstructions: value }),

  reset: () => set({ ...initialState, patient: { ...initialState.patient, consultationDate: todayISO() }, currentConsultationId: null }),
}));
