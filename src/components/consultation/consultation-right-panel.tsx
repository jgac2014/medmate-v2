"use client";

import { useState, useEffect, useRef } from "react";
import { copyToClipboard } from "@/lib/clipboard";
import { showToast } from "@/components/ui/toast";
import { submitFeedback } from "@/lib/feedback";
import { DocumentationChecklist } from "@/components/consultation/documentation-checklist";
import { useOutputSummary } from "@/hooks/useOutputSummary";
import { markOnboardingStep } from "@/hooks/useOnboarding";
import { trackEvent } from "@/lib/analytics";
import { createClient } from "@/lib/supabase/client";
import { logAuditEvent } from "@/lib/supabase/audit";
import { useConsultationStore } from "@/stores/consultation-store";
import type { OutputMode } from "@/types";

const MODE_LABELS: Record<OutputMode, string> = {
  esus: "eSUS",
  resumido: "Resumido",
  detalhado: "Detalhado",
};

interface ConsultationRightPanelProps {
  open?: boolean;
}

export function ConsultationRightPanel({ open = false }: ConsultationRightPanelProps) {
  const { summary, outputMode, setOutputMode } = useOutputSummary("esus");
  const [copied, setCopied] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [microOpen, setMicroOpen] = useState(false);
  const [microSent, setMicroSent] = useState(false);

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(copiedTimerRef.current);
    };
  }, []);

  const copiesThisSession = useConsultationStore((s) => s.copiesThisSession);
  const incrementCopies = useConsultationStore((s) => s.incrementCopies);
  const currentConsultationId = useConsultationStore((s) => s.currentConsultationId);
  const timerState = useConsultationStore((s) => s.timerState);

  function calcElapsed(): number {
    if (timerState.finished_at) return timerState.active_seconds;
    if (timerState.started_at) {
      return timerState.active_seconds + Math.floor((Date.now() - new Date(timerState.started_at).getTime()) / 1000);
    }
    return timerState.active_seconds;
  }

  const handleCopy = async () => {
    if (!summary.trim()) {
      showToast("Preencha a consulta para gerar o resumo", "info");
      return;
    }
    const ok = await copyToClipboard(summary);

    if (ok) {
      incrementCopies();

      setCopied(true);
      trackEvent("summary_copied", { outputMode });
      markOnboardingStep("summaryCopied", userId);
      showToast("Copiado!", "success");
      const state = useConsultationStore.getState();
      logAuditEvent({
        actorId: userId,
        eventType: "summary.copied",
        entityType: "consultation",
        entityId: state.currentConsultationId,
        metadata: {
          outputMode,
          patientId: state.patientId,
        },
      });
      copiedTimerRef.current = setTimeout(() => setCopied(false), 2000);
      // Microfeedback: only triggers if 3+ copies
      const newCount = useConsultationStore.getState().copiesThisSession + 1;
      if (!microSent && newCount >= 3) {
        setMicroOpen(true);
      }
    } else {
      // Copy failed → real friction
      showToast("Erro ao copiar", "error");
      if (!microSent) {
        setMicroOpen(true);
      }
    }
  };

  return (
    <aside className={`w-80 shrink-0 h-full overflow-y-auto border-l border-[var(--outline-variant)] bg-[var(--surface-lowest)] flex-col ${open ? "flex" : "hidden lg:flex"}`}>
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
                  ? "text-[var(--primary)] border-b-2 border-[var(--primary)]"
                  : "text-[var(--on-surface-muted)] hover:text-[var(--on-surface)]"
              }`}
            >
              {MODE_LABELS[mode]}
            </button>
          ))}
        </div>

        {/* Área de texto */}
        <div className="flex-1 min-h-0 relative" style={{ minHeight: "200px" }}>
          <div className="absolute inset-0 overflow-y-auto rounded-lg bg-[var(--surface-low)] border border-[var(--outline-variant)] p-3">
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
              : "bg-[var(--primary)] text-white hover:opacity-90 active:scale-[0.98]"
          }`}
        >
          {copied ? "✓ Copiado!" : "Copiar para eSUS"}
        </button>

        {/* Microfeedback pós-cópia */}
        {microOpen && !microSent && (
          <div className="mt-2 bg-[var(--surface-low)] border border-[var(--outline-variant)] rounded-lg px-3 py-2">
            <p className="text-[11px] text-[var(--on-surface-muted)] mb-1.5">Esse resumo ficou útil?</p>
            <div className="flex gap-1.5">
              {[
                { label: "Sim", value: "elogio" },
                { label: "Mais ou menos", value: "dificuldade" },
                { label: "Não", value: "dificuldade" },
              ].map(({ label, value }) => (
                <button
                  key={label}
                  onClick={async () => {
                    await submitFeedback({
                      type: value as "elogio" | "dificuldade",
                      area: "consulta",
                      message: "",
                      contact_ok: false,
                      origin: "micro_copy",
                      consultation_id: currentConsultationId ?? undefined,
                      timer_seconds: calcElapsed(),
                    }).catch(() => {});
                    setMicroSent(true);
                    setMicroOpen(false);
                  }}
                  className="flex-1 py-1.5 rounded-lg text-[11px] font-medium border border-[var(--outline-variant)] text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] transition-colors cursor-pointer"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
