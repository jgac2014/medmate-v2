"use client";

import { useConsultationStore } from "@/stores/consultation-store";
import { ExamInput } from "@/components/ui/exam-input";
import { getStatus } from "@/lib/reference-values";
import type { ExamCardDef } from "@/types";

interface ExamCardProps {
  card: ExamCardDef;
  span2?: boolean;
}

export function ExamCard({ card, span2 = false }: ExamCardProps) {
  const { labs, setLab, patient } = useConsultationStore();

  return (
    <div
      className={`border border-border-subtle rounded-lg p-[10px] bg-bg-1 transition-[border-color] duration-150 hover:border-border-default ${
        span2 ? "col-span-2" : ""
      }`}
    >
      <div className="text-[9px] font-bold tracking-[0.09em] uppercase text-text-secondary mb-2 pb-1.5 border-b border-border-subtle">
        {card.title}
      </div>
      {card.fields.map((field) => {
        const value = labs[field.key] ?? "";
        const numValue = parseFloat(value);
        const status = !isNaN(numValue) && !field.auto ? getStatus(field.key, numValue, patient.gender) : "none";

        return (
          <ExamInput
            key={field.key}
            label={field.label}
            unit={field.unit}
            status={field.auto ? "none" : status}
            auto={field.auto}
            value={value}
            onChange={(e) => setLab(field.key, e.target.value)}
          />
        );
      })}
    </div>
  );
}
