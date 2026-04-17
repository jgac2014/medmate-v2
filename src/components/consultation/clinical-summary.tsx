"use client";

import { useConsultationStore } from "@/stores/consultation-store";
import { SectionHeader } from "@/components/ui/section-header";
import { Tag } from "@/components/ui/tag";
import { getStatus } from "@/lib/reference-values";
import { PRIMARY_EXAM_CARDS, ADDITIONAL_EXAM_CARDS } from "@/lib/constants";
import type { StatusLevel } from "@/types";

function TagGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-2">
      <div className="text-[8px] font-semibold tracking-[0.08em] uppercase text-[var(--on-surface-muted)] mb-[3px]">
        {label}
      </div>
      <div className="flex flex-wrap gap-[2px]">{children}</div>
    </div>
  );
}

export function ClinicalSummary() {
  const { patient, vitals, labs } = useConsultationStore();

  // ── Exames alterados (warn/crit) ──────────────────────────────────────────
  const alteredExams: { label: string; value: string; status: StatusLevel }[] = [];
  for (const card of [...PRIMARY_EXAM_CARDS, ...ADDITIONAL_EXAM_CARDS]) {
    const allFields = [
      ...card.primaryFields,
      ...(card.secondaryFields as readonly { key: string; label: string; unit: string; auto?: boolean }[]),
    ];
    for (const field of allFields) {
      if ("auto" in field && field.auto) continue;
      const val = labs[field.key];
      if (!val || val.trim() === "") continue;
      const num = parseFloat(val);
      if (isNaN(num)) continue;
      const status = getStatus(field.key, num, patient.gender);
      if (status === "warn" || status === "crit") {
        alteredExams.push({ label: field.label, value: val, status });
      }
    }
  }

  // ── Has content for empty state ─────────────────────────────────────────
  const hasVitals = Boolean(vitals.pas || vitals.peso || vitals.fc || vitals.spo2 || vitals.temp);
  const hasSummaryContent = hasVitals || alteredExams.length > 0;

  return (
    <div className="mb-3">
      <SectionHeader label="Resumo Clínico" color="purple" />

      {!hasSummaryContent ? (
        <div className="rounded-xl border border-dashed border-[var(--outline)] bg-[var(--surface-container)] px-3.5 py-3 mb-3">
          <p className="text-[12px] font-medium text-[var(--on-surface)] mb-1">
            {patient.name
              ? "Sem dados clínicos registrados nesta consulta."
              : "Selecione um paciente para carregar o resumo clínico."}
          </p>
          <p className="text-[11px] leading-relaxed text-[var(--on-surface-variant)]">
            {patient.name
              ? "Preencha vitais, problemas ou exames para visualizar os principais achados."
              : "O resumo clínico é montado automaticamente conforme você preenche cada seção."}
          </p>
        </div>
      ) : (
        <>
          {alteredExams.length > 0 && (
            <TagGroup label="Achados anormais">
              {alteredExams.map((e) => (
                <Tag key={`${e.label}-${e.value}`} variant={e.status === "crit" ? "crit" : "warn"}>
                  {e.label}: {e.value}
                </Tag>
              ))}
            </TagGroup>
          )}

          {hasVitals && (
            <TagGroup label="Sinais vitais">
              {vitals.pas && vitals.pad && <Tag variant="info">PA {vitals.pas}/{vitals.pad}</Tag>}
              {vitals.peso && vitals.altura && (
                <Tag variant="info">{vitals.peso} kg</Tag>
              )}
              {vitals.fc && <Tag variant="info">FC {vitals.fc}</Tag>}
              {vitals.spo2 && <Tag variant="info">SpO₂ {vitals.spo2}%</Tag>}
              {vitals.temp && <Tag variant="info">T {vitals.temp}°C</Tag>}
            </TagGroup>
          )}
        </>
      )}
    </div>
  );
}
