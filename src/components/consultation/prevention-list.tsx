"use client";

import { useConsultationStore } from "@/stores/consultation-store";
import { SectionHeader } from "@/components/ui/section-header";
import { CheckboxItem } from "@/components/ui/checkbox-item";
import { PREVENTIONS } from "@/lib/constants";

export function PreventionList() {
  const { preventions, togglePrevention } = useConsultationStore();

  return (
    <div className="mb-3.5">
      <SectionHeader label="Prevenções" color="green" />
      <div className="flex flex-col gap-0.5">
        {PREVENTIONS.map((p) => (
          <CheckboxItem
            key={p}
            label={p}
            checked={preventions.includes(p)}
            onChange={() => togglePrevention(p)}
          />
        ))}
      </div>
    </div>
  );
}
