"use client";

import { useConsultationStore } from "@/stores/consultation-store";
import { SectionHeader } from "@/components/ui/section-header";

const SOAP_FIELDS = [
  { key: "subjective" as const, label: "S — Subjetivo", placeholder: "Queixa principal, HDA..." },
  { key: "objective" as const, label: "O — Objetivo", placeholder: "Exame físico detalhado..." },
  { key: "assessment" as const, label: "A — Avaliação", placeholder: "Hipótese diagnóstica..." },
  { key: "plan" as const, label: "P — Plano", placeholder: "Conduta, encaminhamentos..." },
];

export function SoapForm() {
  const { soap, setSoap } = useConsultationStore();

  return (
    <div className="mb-3.5">
      <SectionHeader label="SOAP" color="blue" />
      {SOAP_FIELDS.map((f) => (
        <div key={f.key} className="mb-2">
          <label className="block text-[11px] text-on-surface-muted mb-0.5 font-medium">
            {f.label}
          </label>
          <textarea
            placeholder={f.placeholder}
            value={soap[f.key]}
            onChange={(e) => setSoap({ [f.key]: e.target.value })}
            className="w-full h-16 px-0 py-2 border-0 border-b border-outline-variant/50 rounded-none bg-transparent text-on-surface text-[13px] resize-y leading-relaxed placeholder:text-on-surface-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      ))}
    </div>
  );
}
