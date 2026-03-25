export type Gender = "Masculino" | "Feminino" | "Outro";
export type Race = "Branco" | "Pardo" | "Preto" | "Amarelo" | "Indígena";
export type StatusLevel = "ok" | "warn" | "crit" | "none";

export interface PatientInfo {
  name: string;
  age: string;
  gender: Gender | "";
  race: Race | "";
  consultationDate: string;
}

export interface Vitals {
  pas: string;
  pad: string;
  peso: string;
  altura: string;
  imc: string;
  ca_abd: string;
  fc: string;
  spo2: string;
  temp: string;
}

export interface LabValues {
  [key: string]: string;
}

export interface ImagingData {
  date: string;
  entries: string;
}

export interface Calculations {
  imc: { value: number; classification: string } | null;
  tfg: { value: number; stage: string } | null;
  fib4: { value: number; risk: string } | null;
  rcv: { value: number; risk: string } | null;
}

export interface SoapNotes {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface History {
  personal: string;
  family: string;
  habits: string;
  medications: string;
  allergies: string;
  comorbidities: string;
}

export interface ConsultationState {
  patient: PatientInfo;
  vitals: Vitals;
  problems: string[];
  problemsOther: string;
  preventions: string[];
  labs: LabValues;
  labsDate: string;
  imaging: ImagingData;
  calculations: Calculations;
  soap: SoapNotes;
  history: History;
  prescription: string;
  requestedExams: string;
  patientInstructions: string;
}

export interface ExamFieldDef {
  key: string;
  label: string;
  unit: string;
  auto?: boolean;
}

export interface ExamCardDef {
  id: string;
  title: string;
  fields: readonly ExamFieldDef[];
}

export interface RefRule {
  type: "above" | "below" | "range";
  warn?: number;
  crit?: number;
  warnLow?: number;
  warnHigh?: number;
  critLow?: number;
  critHigh?: number;
}

export type RefRuleMap = Record<string, RefRule | ((gender: Gender | "") => RefRule)>;
