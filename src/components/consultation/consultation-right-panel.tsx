"use client";

import { useState, useEffect, useRef } from "react";
import { useConsultationStore } from "@/stores/consultation-store";
import { generateEsusSummary } from "@/lib/esus-generator";
import { generateResumoOutput, generateDetalhadoOutput } from "@/lib/output-generators";
import { copyToClipboard } from "@/lib/clipboard";
import { showToast } from "@/components/ui/toast";
import { DocumentationChecklist } from "@/components/consultation/documentation-checklist";
import type { OutputMode, ConsultationState } from "@/types";

function getOutput(state: ConsultationState, mode: OutputMode): string {
  if (mode === "resumido") return generateResumoOutput(state);
  if (mode === "detalhado") return generateDetalhadoOutput(state);
  return generateEsusSummary(state);
}

const MODE_LABELS: Record<OutputMode, string> = {
  esus: "eSUS",
  resumido: "Resumo",
  detalhado: "Completo",
};

export function ConsultationRightPanel() {
  const [outputMode, setOutputMode] = useState<OutputMode>("esus");
  const [summary, setSummary] = useState(() =>
    getOutput(useConsultationStore.getState(), "esus")
  );
  const [copied, setCopied] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const modeRef = useRef<OutputMode>("esus");

  useEffect(() => {
    modeRef.current = outputMode;
    setSummary(getOutput(useConsultationStore.getState(), outputMode));
  }, [outputMode]);

  useEffect(() => {
    const unsub = useConsultationStore.subscribe(() => {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setSummary(getOutput(useConsultationStore.getState(), modeRef.current));
      }, 300);
    });
    return () => {
      unsub();
      clearTimeout(debounceRef.current);
    };
  }, []);

  const handleCopy = async () => {
    if (!summary.trim()) {
      showToast("Preencha a consulta para gerar o resumo", "info");
      return;
    }
    const ok = await copyToClipboard(summary);
    if (ok) {
      setCopied(true);
      showToast("Copiado!", "success");
      setTimeout(() => setCopied(false), 2000);
    } else {
      showToast("Erro ao copiar", "error");
    }
  };

  return (
    <aside className="w-80 shrink-0 h-full overflow-y-auto border-l border-[var(--outline-variant)] bg-[var(--surface-lowest)] flex flex-col">
      {/* Seção: Status de documentação */}
      <div className="p-4 border-b border-[var(--outline-variant)]">
        <DocumentationChecklist />
      </div>

      {/* Seção: Prévia eSUS */}
      <div className="flex-1 flex flex-col p-4 min-h-0">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-semibold text-[var(--on-surface)] uppercase tracking-wide">
            Texto para eSUS
          </span>
          <div className="flex items-center gap-1">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                summary.trim() ? "bg-[var(--status-ok)]" : "bg-[var(--outline-variant)]"
              }`}
            />
            <span className="text-[9px] font-bold text-[var(--on-surface-muted)] uppercase tracking-wider">
              {summary.trim() ? "pronto" : "aguardando"}
            </span>
          </div>
        </div>

        {/* Tabs de modo */}
        <div className="flex border-b border-[var(--outline-variant)] mb-3">
          {(["esus", "resumido", "detalhado"] as OutputMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setOutputMode(mode)}
              className={`px-2.5 py-1.5 text-[10px] font-semibold transition-colors ${
                outputMode === mode
                  ? "text-[var(--accent)] border-b-2 border-[var(--accent)]"
                  : "text-[var(--on-surface-muted)] hover:text-[var(--on-surface)]"
              }`}
            >
              {MODE_LABELS[mode]}
            </button>
          ))}
        </div>

        {/* Área de texto */}
        <div className="flex-1 min-h-0 relative" style={{ minHeight: "200px" }}>
          <div className="absolute inset-0 overflow-y-auto rounded-lg bg-[var(--bg-2)] border border-[var(--outline-variant)] p-3">
            {summary.trim() ? (
              <pre className="text-[11px] text-[var(--on-surface)] leading-relaxed whitespace-pre-wrap font-mono">
                {summary}
              </pre>
            ) : (
              <p className="text-[11px] text-[var(--on-surface-muted)] italic">
                Preencha a consulta para gerar o texto...
              </p>
            )}
          </div>
        </div>

        {/* Botão copiar */}
        <button
          onClick={handleCopy}
          className={`mt-3 w-full py-2 rounded-lg text-[12px] font-bold transition-all ${
            copied
              ? "bg-[var(--status-ok)] text-white"
              : "bg-[var(--accent)] text-white hover:opacity-90 active:scale-[0.98]"
          }`}
        >
          {copied ? "✓ Copiado!" : "Copiar para eSUS"}
        </button>
      </div>
    </aside>
  );
}
