export type DrugType = "simples" | "atb" | "ctrl";

export type ControlledClass =
  | "A1" | "A2" | "A3" | "B1" | "B2" | "C1" | "C2" | "C3" | "C4" | "C5"
  | "ATB" | null;

export type RxType = "Receita Simples" | "Notificação Branca" | "Notificação Especial Amarela" | "Receita Azul";

export interface Drug {
  id: string;
  name: string;
  form: string;
  manufacturer: string;
  type: DrugType;
  flag: string | null;
  rxType: RxType;
  defaultPosology: string;
}

export interface PrescribedDrug {
  drugId: string;
  name: string;
  form: string;
  rxType: RxType;
  type: DrugType;
  flag: string | null;
  posology: string;
  qty: string;
}

export interface Interaction {
  drugA: string; // partial name match
  drugB: string;
  severity: "warning" | "danger";
  message: string;
}

export interface Protocol {
  key: string;
  label: string;
  icon: string;
  drugs: Array<{ drugId: string; posology?: string }>;
}

export interface DoctorProfile {
  name: string;
  crm: string;
  specialty: string;
  address: string;
  phone: string;
  city: string;
}

export interface RxCustomization {
  align: "left" | "center";
  nameFont: string;
  nameSize: number;
  nameColor: string;
  descFont: string;
  descSize: number;
  descColor: string;
  bodyFont: string;
  lineSpacing: "compact" | "normal" | "relaxed";
  showLogo: boolean;
  logoUrl: string | null;
}

export interface RxPatient {
  name: string;
  cpf: string;
  address: string;
  date: string;
}

export type RxScreen = "create" | "send";
