"use client";

import { useState } from "react";
import { Check, ClipboardList } from "lucide-react";
import { useConsultationStore } from "@/stores/consultation-store";
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
  const [confirming, setConfirming] = useState(false);
  const { vitals, labs, calculations } = useConsultationStore();

  const hasData = Object.values(vitals).some((v) => v && v !== "") ||
    Object.values(labs).some((v) => v && v !== "");

  function handleApply() {
    const text = formatObjectiveText(vitals, labs, calculations);
    if (!text.trim()) return;

    if (hasExistingContent && !confirming) {
      setConfirming(true);
      return;
    }

    onApply(text);
    setConfirming(false);
  }

  if (!hasData) return null;

  if (confirming) {
    return (
      <div className="mt-1 flex items-center gap-3">
        <span className="text-[11px] text-warning">
          Substituir o texto atual do campo O?
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
      </div>
    );
  }

  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={handleApply}
        className="flex items-center gap-1 text-[11px] text-primary/70 hover:text-primary transition-colors"
      >
        <ClipboardList size={11} />
        Aplicar dados objetivos ao campo O
      </button>
    </div>
  );
}
