type ConsultationForTrend = {
  date: string;
  vitals: { pas?: string; pad?: string; peso?: string; imc?: string } | null;
  labs: Record<string, string> | null;
};

export interface TrendSeries {
  label: string;
  unit: string;
  data: number[];
  color?: string;
}

function extractNumbers(consultations: ConsultationForTrend[], extractor: (c: ConsultationForTrend) => string | undefined): number[] {
  return consultations
    .map(extractor)
    .filter((v): v is string => v !== undefined && v !== "")
    .map((v) => parseFloat(v))
    .filter((n) => !isNaN(n))
    .reverse(); // cronológico: mais antigo primeiro
}

export function buildTrendSeries(consultations: ConsultationForTrend[]): TrendSeries[] {
  const series: TrendSeries[] = [];

  const pas = extractNumbers(consultations, (c) => c.vitals?.pas);
  if (pas.length >= 2) series.push({ label: "PAS", unit: "mmHg", data: pas, color: "var(--color-status-crit)" });

  const pad = extractNumbers(consultations, (c) => c.vitals?.pad);
  if (pad.length >= 2) series.push({ label: "PAD", unit: "mmHg", data: pad, color: "var(--color-status-warn)" });

  const peso = extractNumbers(consultations, (c) => c.vitals?.peso);
  if (peso.length >= 2) series.push({ label: "Peso", unit: "kg", data: peso });

  const imc = extractNumbers(consultations, (c) => c.vitals?.imc);
  if (imc.length >= 2) series.push({ label: "IMC", unit: "kg/m²", data: imc });

  const hba1c = extractNumbers(consultations, (c) => c.labs?.hba1c);
  if (hba1c.length >= 2) series.push({ label: "HbA1c", unit: "%", data: hba1c, color: "var(--color-status-info)" });

  const creatinina = extractNumbers(consultations, (c) => c.labs?.cr);
  if (creatinina.length >= 2) series.push({ label: "Creatinina", unit: "mg/dL", data: creatinina, color: "var(--color-status-warn)" });

  return series;
}
