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
      className={`rounded-xl p-3 bg-surface-lowest shadow-sm transition-shadow duration-150 hover:shadow-md ${
        span2 ? "col-span-2" : ""
      }`}
    >
      <div className="text-[9px] font-bold tracking-[0.10em] uppercase text-on-surface-muted mb-2 pb-1.5">
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
