/**
 * Triagens Clínicas — Tipos
 * Referências: PHQ-9 (Kroenke & Spitzer 2002), GAD-7 (Spitzer et al. 2006),
 * AUDIT-C (Bush et al. 1998), Mini-Cog (Borson et al. 2000),
 * Edmonton Frailty Scale (Rolfson et al. 2006)
 */

export interface ScaleOption {
  label: string;
  value: number;
}

export interface ScaleQuestion {
  id: string;
  text: string;
  options: ScaleOption[];
}

export type InterpretLevel = "ok" | "warn" | "crit";

export interface Interpretation {
  label: string;
  level: InterpretLevel;
  note?: string;
}

export interface ScaleDef {
  id: string;
  name: string;
  shortName: string;
  description: string;
  timeFrame?: string; // "Últimas 2 semanas", etc.
  questions: ScaleQuestion[];
  maxScore: number;
  interpret: (score: number, gender?: string) => Interpretation;
  source: string;
  sourceYear: number;
  /** Se true, a interpretação depende do sexo do paciente (ex: AUDIT-C) */
  genderAware?: boolean;
  /** Se true, requer avaliação presencial do examinador */
  requiresInPerson?: boolean;
}

export interface TriagemResult {
  scaleId: string;
  answers: Record<string, number>;
  score: number;
  interpretation: string;
  level: InterpretLevel;
  appliedAt: string;
}
