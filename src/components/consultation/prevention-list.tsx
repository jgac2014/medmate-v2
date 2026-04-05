"use client";

import { useConsultationStore } from "@/stores/consultation-store";
import { SectionHeader } from "@/components/ui/section-header";
import { CheckboxItem } from "@/components/ui/checkbox-item";
import { PREVENTIONS } from "@/lib/constants";
import { getSuggestedPreventions, parseAge } from "@/lib/clinical-rules";
import type { PatientRuleInput } from "@/types";

export function PreventionList() {
  const { preventions, togglePrevention, patient, problems } = useConsultationStore();

  const ruleInput: PatientRuleInput = {
    age: parseAge(patient.age),
    gender: patient.gender,
    problems,
    preventions,
  };
  const suggestions = getSuggestedPreventions(ruleInput);

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
      {suggestions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-outline-variant/60">
          <p className="text-[10px] text-on-surface-muted uppercase tracking-wide mb-2">
            Sugestões por perfil
          </p>
          <div className="flex flex-col gap-1">
            {suggestions.map((rule) => (
              <button
                key={rule.id}
                onClick={() => togglePrevention(rule.preventionLabel)}
                className="flex items-start gap-2 text-left group cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-status-warn mt-1.5 shrink-0 group-hover:bg-primary transition-colors" />
                <div>
                  <p className="text-[12px] text-on-surface-variant group-hover:text-on-surface transition-colors">
                    {rule.preventionLabel}
                  </p>
                  <p className="text-[10px] text-on-surface-muted">{rule.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
