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
          <label className="block text-[10.5px] text-text-tertiary mb-0.5 font-medium">
            {f.label}
          </label>
          <textarea
            placeholder={f.placeholder}
            value={soap[f.key]}
            onChange={(e) => setSoap({ [f.key]: e.target.value })}
            className="w-full h-16 px-2 py-[7px] border border-border-subtle rounded-[5px] bg-bg-2 text-text-primary font-sans text-xs resize-y leading-relaxed placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)]"
          />
        </div>
      ))}
    </div>
  );
}
