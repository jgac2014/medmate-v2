"use client";

import { useState } from "react";
import { useConsultationStore } from "@/stores/consultation-store";
import { ExamField } from "@/components/ui/exam-field";
import { AutoResult } from "@/components/ui/auto-result";
import { getStatus } from "@/lib/reference-values";
import type { ExamCardDef } from "@/types";

interface ExamCardProps {
  card: ExamCardDef;
}

function filledCount(
  fields: readonly { key: string; auto?: boolean }[],
  labs: Record<string, string>
): number {
  return fields.filter((f) => !f.auto && (labs[f.key] ?? "").trim() !== "").length;
}

function manualCount(fields: readonly { key: string; auto?: boolean }[]): number {
  return fields.filter((f) => !f.auto).length;
}

export function ExamCard({ card }: ExamCardProps) {
  const { labs, setLab, patient } = useConsultationStore();
  const [expanded, setExpanded] = useState(false);

  const hasSecondary = (card.secondaryFields?.length ?? 0) > 0;
  const allFields = [...card.primaryFields, ...(card.secondaryFields ?? [])];

  const filled = filledCount(allFields, labs);
  const total = manualCount(allFields);
  const hasFilled = filled > 0;

  return (
    <div className="rounded-xl p-3 bg-[var(--surface-lowest)] border border-[var(--outline-variant)]/40 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.07)] transition-shadow duration-150">

      {/* Header do card */}
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[var(--outline-variant)]/30">
        <span className="text-[9.5px] font-bold tracking-[0.10em] uppercase text-[var(--on-surface-muted)]">
          {card.title}
        </span>
        {total > 0 && (
          <span className={`text-[9px] tabular-nums font-mono ${hasFilled ? "text-[var(--status-calc)]" : "text-[var(--on-surface-muted)]"}`}>
            {filled}/{total}
          </span>
        )}
      </div>

      {/* Primary fields */}
      <div className="space-y-0">
        {card.primaryFields.map((field) => {
          const value = labs[field.key] ?? "";
          if (field.auto) {
            return (
              <AutoResult
                key={field.key}
                label={field.label}
                value={value !== "" ? value : null}
              />
            );
          }
          const numValue = parseFloat(value);
          const status = !isNaN(numValue) ? getStatus(field.key, numValue, patient.gender) : "none";
          return (
            <ExamField
              key={field.key}
              label={field.label}
              unit={field.unit}
              status={status}
              value={value}
              onChange={(e) => setLab(field.key, e.target.value)}
              type="text"
              inputMode="decimal"
            />
          );
        })}
      </div>

      {/* Secondary fields — expandíveis */}
      {hasSecondary && (
        <>
          {expanded && (
            <div className="mt-1 pt-1 border-t border-[var(--outline-variant)]/20 space-y-0">
              {card.secondaryFields!.map((field) => {
                const value = labs[field.key] ?? "";
                const numValue = parseFloat(value);
                const status = !isNaN(numValue) ? getStatus(field.key, numValue, patient.gender) : "none";
                return (
                  <ExamField
                    key={field.key}
                    label={field.label}
                    unit={field.unit}
                    status={status}
                    value={value}
                    onChange={(e) => setLab(field.key, e.target.value)}
                    type="text"
                    inputMode="decimal"
                  />
                );
              })}
            </div>
          )}
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-1.5 text-[9.5px] text-[var(--on-surface-muted)] hover:text-[var(--primary)] transition-colors duration-100 flex items-center gap-0.5 font-medium"
          >
            <svg
              className={`w-2.5 h-2.5 transition-transform duration-150 ${expanded ? "rotate-180" : ""}`}
              viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"
            >
              <path d="M2 3.5L5 6.5L8 3.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {expanded ? "Ocultar" : "Mostrar mais"}
          </button>
        </>
      )}
    </div>
  );
}
