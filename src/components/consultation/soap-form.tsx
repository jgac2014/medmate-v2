"use client";

import { useConsultationStore } from "@/stores/consultation-store";
import { ObjectiveDataDrawer } from "@/components/consultation/objective-data-drawer";

const SOAP_FIELDS = [
  {
    key: "subjective" as const,
    letter: "S",
    label: "Subjetivo",
    placeholder: "Queixa principal, HDA...",
  },
  {
    key: "objective" as const,
    letter: "O",
    label: "Objetivo",
    placeholder: "Exame físico detalhado...",
  },
  {
    key: "assessment" as const,
    letter: "A",
    label: "Avaliação",
    placeholder: "Hipótese diagnóstica...",
  },
  {
    key: "plan" as const,
    letter: "P",
    label: "Plano",
    placeholder: "Conduta, encaminhamentos...",
  },
] as const;

export function SoapForm() {
  const { soap, setSoap } = useConsultationStore();

  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 mb-2 px-3 py-2 -mx-5 -mt-5 bg-primary/5 border-b border-primary/10">
        <span className="material-symbols-outlined text-primary text-[18px]">
          article
        </span>
        <h3 className="font-headline text-md text-primary font-bold">
          SOAP Estruturado
        </h3>
        <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[7px] font-bold rounded uppercase tracking-wider ml-auto">
          Documentação Clínica
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
        {SOAP_FIELDS.map((f) => (
          <div key={f.key} className="space-y-1.5">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 flex items-center justify-center bg-primary text-white font-bold text-[11px] rounded shadow-sm shrink-0">
                {f.letter}
              </span>
              <p className="text-[10px] font-extrabold text-primary uppercase tracking-widest">
                {f.label}
              </p>
            </div>
            <textarea
              id={`soap-${f.key}`}
              placeholder={f.placeholder}
              value={soap[f.key]}
              onChange={(e) => setSoap({ [f.key]: e.target.value })}
              className="w-full min-h-[120px] px-3 py-2 border border-primary/10 rounded-lg bg-surface/40 text-[var(--on-surface)] text-[12px] resize-y leading-relaxed placeholder:text-[var(--on-surface-muted)] focus:outline-none focus:border-primary/40 transition-colors scroll-mt-12"
            />
            {f.key === "objective" && (
              <ObjectiveDataDrawer
                hasExistingContent={soap.objective.trim().length > 0}
                onApply={(text) => setSoap({ objective: text })}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
