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
  tfg: { value: number; stage: string; uacrCategory?: string } | null;
  fib4: { value: number; risk: string; lowValidity?: boolean } | null;
  rcv: { value: number; risk: string; outOfRange?: boolean } | null;
  ldl: { value: number } | null;
  naoHdl: { value: number } | null;
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
  followupItems: FollowUpItem[];
  labsExtras: string;
  triagens: Record<string, TriagemResult>;
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
  primaryFields: readonly ExamFieldDef[];
  secondaryFields?: readonly ExamFieldDef[];
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

export interface Patient {
  id: string;
  user_id: string;
  name: string;
  birth_date: string | null; // ISO date YYYY-MM-DD, nullable
  gender: string | null;
  race: string | null;
  cpf: string | null;
  phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface FollowUpItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export type SnippetCategory = "orientacao" | "prescricao" | "conduta" | "exames";

export interface UserSnippet {
  id: string;
  user_id: string;
  category: SnippetCategory;
  title: string;
  body: string;
  created_at: string;
}

export interface PatientProblem {
  id: string;
  patient_id: string;
  user_id: string;
  problem_text: string;
  active: boolean;
  created_at: string;
  resolved_at: string | null;
}

export interface PatientRuleInput {
  age: number | null;   // null se não informado
  gender: string;       // "Masculino" | "Feminino" | "Outro" | ""
  problems: string[];
  preventions: string[];
}

export interface ClinicalRule {
  id: string;
  preventionLabel: string;  // deve ser exatamente igual a um item de PREVENTIONS
  description: string;      // texto exibido ao médico (ex: "A cada 2 anos — MS/INCA 2025")
  condition: (p: PatientRuleInput) => boolean;
}

export interface PatientMedication {
  id: string;
  patient_id: string;
  user_id: string;
  medication_name: string;
  dosage: string;
  active: boolean;
  created_at: string;
  discontinued_at: string | null;
}

export type OutputMode = "esus" | "resumido" | "detalhado";

export type InterpretLevel = "ok" | "warn" | "crit";

export interface TriagemResult {
  scaleId: string;
  answers: Record<string, number>;
  score: number;
  interpretation: string;
  level: InterpretLevel;
  appliedAt: string;
}

export type AlertType = "followup" | "chronic";
export type AlertSeverity = "warning" | "alert";

export interface Alert {
  id: string;
  type: AlertType;
  message: string;
  severity: AlertSeverity;
}

// ── Feedback types ───────────────────────────────────────────────────────────

export type FeedbackType = "sugestao" | "bug" | "dificuldade" | "elogio";
export type FeedbackArea = "consulta" | "exames" | "receituario" | "pacientes" | "historico" | "conta" | "outro";
export type FeedbackStatus = "new" | "reviewed" | "planned" | "done" | "rejected";

export interface FeedbackMetadata {
  route?: string;
  component?: string;
  consultation_id?: string;
  timer_seconds?: number;
  template?: string;
  origin: string;
  [key: string]: string | number | boolean | undefined;
}

export interface FeedbackSubmission {
  id: string;
  user_id: string;
  type: FeedbackType;
  area: FeedbackArea;
  message: string;
  status: FeedbackStatus;
  contact_ok: boolean;
  metadata: FeedbackMetadata;
  created_at: string;
}

export interface FeedbackInput {
  type: FeedbackType;
  area: FeedbackArea;
  message: string;
  contact_ok: boolean;
  origin: string;
  consultation_id?: string;
  timer_seconds?: number;
}

// ── Timer types ───────────────────────────────────────────────────────────────

export interface TimerState {
  started_at: string | null;
  finished_at: string | null;
  active_seconds: number;
}

