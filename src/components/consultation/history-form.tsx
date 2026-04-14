"use client";

import { useConsultationStore } from "@/stores/consultation-store";
import { SectionHeader } from "@/components/ui/section-header";

const HISTORY_FIELDS = [
  { key: "personal" as const, label: "Pessoais", placeholder: "Cirurgias, internações..." },
  { key: "family" as const, label: "Familiares", placeholder: "HAS, DM, CA..." },
  { key: "habits" as const, label: "Hábitos de vida", placeholder: "Etilismo, sedentarismo..." },
  { key: "medications" as const, label: "Medicamentos em uso", placeholder: "Metformina 850mg 2x/dia..." },
  { key: "allergies" as const, label: "Alergias", placeholder: "Penicilina, AAS..." },
];

export function HistoryForm() {
  const { history, setHistory } = useConsultationStore();

  return (
    <div className="mb-3.5">
      <SectionHeader label="Antecedentes" color="amber" />
      {HISTORY_FIELDS.map((f) => (
        <div key={f.key} className="mb-2">
          <label className="block text-[11px] text-[var(--on-surface-muted)] mb-0.5 font-medium">
            {f.label}
          </label>
          <textarea
            placeholder={f.placeholder}
            value={history[f.key]}
            onChange={(e) => setHistory({ [f.key]: e.target.value })}
            className="w-full h-14 px-0 py-2 border-0 border-b border-[var(--outline-variant)] rounded-none bg-transparent text-[var(--on-surface)] text-[13px] resize-y leading-relaxed placeholder:text-[var(--on-surface-muted)] focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      ))}
    </div>
  );
}
