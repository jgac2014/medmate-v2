"use client";

import { useState, useEffect, useRef } from "react";
import { copyToClipboard } from "@/lib/clipboard";
import { showToast } from "@/components/ui/toast";
import { submitFeedback } from "@/lib/feedback";
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

export function ConsultationRightPanel() {
  const {
    summary,
    isManualEdit,
    isStale,
    regenerate,
    keepCurrent,
    onManualEdit,
    outputMode,
    setOutputMode,
  } = useOutputSummary("esus");

  const [copied, setCopied] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState(summary);
  const [panelVisible, setPanelVisible] = useState(true);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [microOpen, setMicroOpen] = useState(false);
  const [microSent, setMicroSent] = useState(false);

  useEffect(() => {
    setEditingText(summary);
  }, [summary]);

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

  function handleTextChange(value: string) {
    setEditingText(value);
    onManualEdit(value);
  }

  function handleRegenerate() {
    regenerate();
    setEditingText(summary);
    showToast("Texto regenerado a partir da consulta", "info");
  }

  function handleKeepCurrent() {
    keepCurrent();
    showToast("Texto personalizado mantido", "info");
  }

  const handleCopy = async () => {
    if (!editingText.trim()) {
      showToast("Preencha a consulta para gerar o resumo", "info");
      return;
    }
    const ok = await copyToClipboard(editingText);

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
        metadata: { outputMode, patientId: state.patientId },
      });
      copiedTimerRef.current = setTimeout(() => setCopied(false), 2000);
      const newCount = useConsultationStore.getState().copiesThisSession + 1;
      if (!microSent && newCount >= 3) {
        setMicroOpen(true);
      }
    } else {
      showToast("Erro ao copiar", "error");
      if (!microSent) setMicroOpen(true);
    }
  };

  return (
    <>
      {panelVisible ? (
        <aside className="w-80 shrink-0 h-full overflow-y-auto border-l border-[var(--outline-variant)] bg-[var(--surface-lowest)] flex-col hidden lg:flex">
          {/* Header compacto com toggle */}
          <div className="flex items-center justify-between p-3 border-b border-[var(--outline-variant)]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px] text-primary">description</span>
              <span className="text-[10px] font-semibold text-primary uppercase tracking-wide">eSUS</span>
            </div>
            <button
              onClick={() => setPanelVisible(false)}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--surface-high)] transition-colors"
              title="Ocultar painel"
            >
              <span className="material-symbols-outlined text-[13px] text-[var(--on-surface-muted)]">close</span>
            </button>
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
                    editingText.trim()
                      ? isStale
                        ? "bg-[var(--status-warn)]"
                        : isManualEdit
                        ? "bg-[var(--status-info)]"
                        : "bg-[var(--status-ok)]"
                      : "bg-[var(--outline-variant)]"
                  }`}
                />
                <span className="text-[9px] font-bold text-[var(--on-surface-muted)] uppercase tracking-wider">
                  {editingText.trim()
                    ? isStale
                      ? "desatualizado"
                      : isManualEdit
                      ? "editado"
                      : "pronto"
                    : "aguardando"}
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

            {/* Banner de desatualização */}
            {isStale && (
              <div className="mb-2 flex items-start gap-2 rounded-lg border border-[var(--status-warn)]/30 bg-[var(--status-warn)]/8 px-3 py-2.5">
                <span className="text-[12px] text-[var(--status-warn)] mt-0.5 shrink-0">⚠</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-[var(--status-warn)] leading-snug mb-2">
                    Os dados da consulta mudaram — o texto gerado pode estar desatualizado.
                  </p>
                  <div className="flex gap-1.5">
                    <button
                      onClick={handleRegenerate}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-[var(--status-warn)] text-white hover:bg-[var(--status-warn)]/90 transition-colors"
                    >
                      Regenerar
                    </button>
                    <button
                      onClick={handleKeepCurrent}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-medium border border-[var(--outline-variant)] text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] transition-colors"
                    >
                      Manter atual
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Área de texto editável */}
            <div className="flex-1 min-h-0 relative" style={{ minHeight: "200px" }}>
              <div className="absolute inset-0 overflow-hidden rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-low)]">
                {editingText.trim() ? (
                  <textarea
                    value={editingText}
                    onChange={(e) => handleTextChange(e.target.value)}
                    className="w-full h-full px-3 py-3 text-[11px] text-[var(--on-surface)] leading-relaxed font-mono bg-transparent resize-none focus:outline-none focus:border-[var(--status-info)]/30 border-0 placeholder:text-[var(--on-surface-muted)]"
                    placeholder="O texto aparece aqui conforme você preenche a consulta..."
                    spellCheck={false}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 px-4 py-6">
                    <span className="material-symbols-outlined text-[28px] text-[var(--outline-variant)]">auto_awesome</span>
                    <div className="text-center">
                      <p className="text-[11px] font-medium text-[var(--on-surface-muted)] mb-1">
                        Texto gerado automaticamente
                      </p>
                      <p className="text-[10px] text-[var(--on-surface-muted)] opacity-70">
                        Preencha a consulta — o resumo aparece aqui conforme você preenche cada seção.
                      </p>
                    </div>
                    <div className="w-full flex items-center gap-1.5">
                      <div className="flex-1 h-0.5 rounded-full bg-[var(--surface-high)]" />
                      <div className="flex-1 h-0.5 rounded-full bg-[var(--surface-high)]" />
                      <div className="flex-1 h-0.5 rounded-full bg-[var(--outline-variant)]" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Indicação de edição manual */}
            {isManualEdit && !isStale && (
              <p className="mt-1.5 text-[9.5px] text-[var(--status-info)] flex items-center gap-1">
                <span>✎</span>
                Texto personalizado — alterações não são sobrepostas automaticamente
              </p>
            )}

            {/* Botão copiar */}
            <button
              onClick={handleCopy}
              className={`mt-2.5 w-full py-2 rounded-lg text-[12px] font-bold transition-all ${
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
      ) : (
        <div />
      )}

      {/* Botão flutuante para reabrir painel */}
      {!panelVisible && (
        <button
          onClick={() => setPanelVisible(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-30 flex items-center gap-1.5 px-2.5 py-3 bg-primary text-white rounded-l-lg shadow-lg hover:bg-primary/90 transition-all group"
          title="Mostrar painel eSUS"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          <span className="material-symbols-outlined text-[16px]">description</span>
          <span className="text-[10px] font-bold tracking-wide">eSUS</span>
        </button>
      )}
    </>
  );
}
