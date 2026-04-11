"use client";

import { ExamCard } from "./exam-card";
import { ADDITIONAL_EXAM_CARDS } from "@/lib/constants";
import type { ExamCardDef } from "@/types";

interface AdditionalExamsSectionProps {
  open: boolean;
}

/**
 * Seção recolhível com os cards adicionais de exames.
 * Visibilidade controlada pelo pai (ExamGrid).
 */
export function AdditionalExamsSection({ open }: AdditionalExamsSectionProps) {
  if (!open) return null;

  return (
    <div className="mt-2">
      <div className="text-[9px] font-semibold tracking-[0.10em] uppercase text-[var(--on-surface-muted)] mb-2">
        Exames adicionais
      </div>
      <div className="grid grid-cols-3 gap-[7px] sm:grid-cols-2 [&]:max-sm:grid-cols-1">
        {ADDITIONAL_EXAM_CARDS.map((card) => (
          <ExamCard
            key={card.id}
            card={card as unknown as ExamCardDef}
          />
        ))}
      </div>
    </div>
  );
}
