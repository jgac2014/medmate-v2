"use client";

import { create } from "zustand";
import type {
  PrescribedDrug,
  DoctorProfile,
  RxCustomization,
  RxPatient,
  RxScreen,
} from "@/lib/receituario/types";

function todayBR(): string {
  return new Date().toLocaleDateString("pt-BR");
}

const defaultDoctor: DoctorProfile = {
  name: "",
  crm: "",
  specialty: "Medicina de Família e Comunidade",
  address: "",
  phone: "",
  city: "",
};

const defaultCustomization: RxCustomization = {
  align: "left",
  nameFont: "Inter",
  nameSize: 18,
  nameColor: "#012d1d",
  descFont: "Inter",
  descSize: 12,
  descColor: "#6d7a6e",
  bodyFont: "Inter",
  lineSpacing: "normal",
  showLogo: false,
  logoUrl: null,
};

const defaultPatient: RxPatient = {
  name: "",
  cpf: "",
  address: "",
  date: todayBR(),
};

interface ReceituarioState {
  screen: RxScreen;
  meds: PrescribedDrug[];
  patient: RxPatient;
  doctor: DoctorProfile;
  customization: RxCustomization;
  useDigitalSignature: boolean;
  protocolsPanelOpen: boolean;
  customizePanelOpen: boolean;
}

interface ReceituarioActions {
  setScreen: (screen: RxScreen) => void;
  addMed: (med: PrescribedDrug) => void;
  removeMed: (drugId: string) => void;
  updateMedPosology: (drugId: string, posology: string) => void;
  updateMedQty: (drugId: string, qty: string) => void;
  clearMeds: () => void;
  setPatient: (patient: Partial<RxPatient>) => void;
  setDoctor: (doctor: Partial<DoctorProfile>) => void;
  setCustomization: (c: Partial<RxCustomization>) => void;
  setUseDigitalSignature: (val: boolean) => void;
  setProtocolsPanelOpen: (val: boolean) => void;
  setCustomizePanelOpen: (val: boolean) => void;
  reset: () => void;
}

const initialState: ReceituarioState = {
  screen: "create",
  meds: [],
  patient: defaultPatient,
  doctor: defaultDoctor,
  customization: defaultCustomization,
  useDigitalSignature: false,
  protocolsPanelOpen: false,
  customizePanelOpen: false,
};

export const useReceituarioStore = create<ReceituarioState & ReceituarioActions>((set) => ({
  ...initialState,

  setScreen: (screen) => set({ screen }),

  addMed: (med) =>
    set((s) => {
      if (s.meds.some((m) => m.drugId === med.drugId)) return s;
      return { meds: [...s.meds, med] };
    }),

  removeMed: (drugId) =>
    set((s) => ({ meds: s.meds.filter((m) => m.drugId !== drugId) })),

  updateMedPosology: (drugId, posology) =>
    set((s) => ({
      meds: s.meds.map((m) => (m.drugId === drugId ? { ...m, posology } : m)),
    })),

  updateMedQty: (drugId, qty) =>
    set((s) => ({
      meds: s.meds.map((m) => (m.drugId === drugId ? { ...m, qty } : m)),
    })),

  clearMeds: () => set({ meds: [] }),

  setPatient: (patient) =>
    set((s) => ({ patient: { ...s.patient, ...patient } })),

  setDoctor: (doctor) =>
    set((s) => ({ doctor: { ...s.doctor, ...doctor } })),

  setCustomization: (c) =>
    set((s) => ({ customization: { ...s.customization, ...c } })),

  setUseDigitalSignature: (val) => set({ useDigitalSignature: val }),

  setProtocolsPanelOpen: (val) => set({ protocolsPanelOpen: val }),

  setCustomizePanelOpen: (val) => set({ customizePanelOpen: val }),

  reset: () => set({ ...initialState, patient: { ...defaultPatient, date: todayBR() } }),
}));
