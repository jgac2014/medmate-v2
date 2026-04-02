"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { useConsultationStore } from "@/stores/consultation-store";
import { VitalsForm } from "@/components/consultation/vitals-form";
import { ExamGrid } from "@/components/consultation/exam-grid";
import { formatObjectiveText } from "@/lib/format-objective";

interface ObjectiveDataDrawerProps {
  /** Chamado com o texto formatado para inserir no campo O */
  onApply: (text: string) => void;
  /** Se o campo O já tem conteúdo */
  hasExistingContent: boolean;
}

export function ObjectiveDataDrawer({
  onApply,
  hasExistingContent,
}: ObjectiveDataDrawerProps) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const { vitals, labs, calculations } = useConsultationStore();

  function handleApply() {
    const text = formatObjectiveText(vitals, labs, calculations);
    if (!text.trim()) return;

    if (hasExistingContent && !confirming) {
      setConfirming(true);
      return;
    }

    onApply(text);
    setConfirming(false);
    setOpen(false);
  }

  return (
    <div className="mt-1">
      {/* Botão toggle */}
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          setConfirming(false);
        }}
        className="flex items-center gap-1 text-[11px] text-on-surface-muted hover:text-primary transition-colors"
      >
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        {open ? "Fechar dados objetivos" : "+ Dados objetivos"}
      </button>

      {/* Painel expansível */}
      {open && (
        <div className="mt-3 rounded-lg border border-outline-variant/30 bg-surface-low p-4 space-y-4">
          <VitalsForm />
          <div className="h-px bg-outline-variant/20" />
          <ExamGrid />

          <div className="flex items-center gap-3 pt-1">
            {confirming ? (
              <>
                <span className="text-[11px] text-warning">
                  Isso substituirá o texto atual do campo O. Confirmar?
                </span>
                <button
                  type="button"
                  onClick={handleApply}
                  className="flex items-center gap-1 text-[11px] px-3 py-1 rounded bg-warning/20 text-warning hover:bg-warning/30 transition-colors"
                >
                  <Check size={11} />
                  Confirmar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="text-[11px] text-on-surface-muted hover:text-on-surface transition-colors"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleApply}
                className="flex items-center gap-1 text-[11px] px-3 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <Check size={11} />
                Aplicar ao campo O
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
