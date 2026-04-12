"use client";

import { useEffect, useState } from "react";
import { copyToClipboard } from "@/lib/clipboard";
import { showToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import { useConsultationStore } from "@/stores/consultation-store";
import { logAuditEvent } from "@/lib/supabase/audit";
import { submitFeedback } from "@/lib/feedback";

interface ConsultaConcluidaModalProps {
  open: boolean;
  esusText: string;
  patientName: string | null;
  onNewConsulta: () => void;
  onHistory: () => void;
}

export function ConsultaConcluidaModal({
  open,
  esusText,
  patientName,
  onNewConsulta,
  onHistory,
}: ConsultaConcluidaModalProps) {
  const [copied, setCopied] = useState(false);
  const [microSent, setMicroSent] = useState(false);
  // Pre-resolved on mount so the copy handler never blocks on an async auth round-trip.
  // fire-and-forget pattern: if actorId is unavailable the audit event is silently skipped.
  const [actorId, setActorId] = useState<string | null>(null);

  const timerState = useConsultationStore((s) => s.timerState);
  const copiesThisSession = useConsultationStore((s) => s.copiesThisSession);

  function calcElapsed(): number {
    if (timerState.finished_at) return timerState.active_seconds;
    if (timerState.started_at) {
      return timerState.active_seconds + Math.floor((Date.now() - new Date(timerState.started_at).getTime()) / 1000);
    }
    return timerState.active_seconds;
  }

  const shouldShowMicroFeedback = !microSent && calcElapsed() < 3 * 60 && copiesThisSession === 0;

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => setActorId(user?.id ?? null));
  }, []);

  if (!open) return null;

  async function handleCopy() {
    const ok = await copyToClipboard(esusText);
    if (ok) {
      const state = useConsultationStore.getState();
      setCopied(true);
      showToast("Copiado para a área de transferência!", "success");
      // fire-and-forget: actorId already resolved — no async auth call in this handler
      logAuditEvent({
        actorId,
        eventType: "summary.copied",
        entityType: "consultation",
        entityId: state.currentConsultationId,
        metadata: {
          outputMode: "esus",
          patientId: state.patientId,
          source: "completion_modal",
        },
      });
      setTimeout(() => setCopied(false), 3000);
    } else {
      showToast("Erro ao copiar", "error");
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-surface flex flex-col items-center justify-center p-6">
      {/* Atmospheric blobs */}
      <div className="fixed bottom-0 left-0 w-full h-1/3 pointer-events-none overflow-hidden">
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary-container opacity-15 blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 opacity-30 blur-[100px] rounded-full" />
      </div>

      {/* Check icon */}
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-secondary-container blur-3xl opacity-25 rounded-full" />
        <div className="relative w-20 h-20 bg-surface-lowest rounded-full flex items-center justify-center shadow-sm">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-secondary">
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md w-full text-center space-y-6 relative z-10">
        <header className="space-y-2">
          <h1 className="font-headline text-4xl font-medium text-primary">
            Pronto para o eSUS
          </h1>
          {patientName && (
            <p className="font-headline italic text-secondary text-lg opacity-80">
              {patientName}
            </p>
          )}
          <p className="text-on-surface-muted text-[14px]">
            Documentação clínica gerada — pronta para colar no sistema oficial
          </p>
        </header>

        {/* Checklist */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-muted mb-2 text-left">
            Gerado automaticamente:
          </p>
          <div className="bg-surface-lowest p-6 rounded-xl space-y-3 text-left shadow-sm border border-outline-variant/20">
            {["SOAP estruturado", "Conduta definida", "Pronto para o eSUS"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#416d5c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-[14px] font-medium text-on-surface">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Microfeedback */}
        {shouldShowMicroFeedback && (
          <div className="bg-surface-low border border-outline-variant rounded-lg px-4 py-3 mb-4">
            <p className="text-[12px] text-on-surface-muted mb-2">Algo atrapalhou?</p>
            <div className="flex flex-wrap gap-1.5">
              {(["Exames", "Tela", "Prescrição", "Lentidão", "Outro"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={async () => {
                    await submitFeedback({
                      type: "dificuldade",
                      area: "consulta",
                      message: opt,
                      contact_ok: false,
                      origin: "micro_finish",
                    });
                    setMicroSent(true);
                  }}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={handleCopy}
            className={`w-full py-4 px-6 rounded-xl text-[15px] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              copied
                ? "bg-secondary-container text-on-secondary-container"
                : "bg-primary text-on-primary hover:bg-primary-container active:scale-[0.98]"
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
            </svg>
            {copied ? "Copiado!" : "Copiar para eSUS PEC"}
          </button>

          <div className="flex gap-3">
            <button
              onClick={onHistory}
              className="flex-1 py-3 px-4 rounded-xl border border-outline-variant/50 text-on-surface-variant text-[14px] font-medium hover:bg-surface-container transition-colors cursor-pointer"
            >
              Ver histórico
            </button>
            <button
              onClick={onNewConsulta}
              className="flex-1 py-3 px-4 rounded-xl border border-outline-variant/50 text-on-surface-variant text-[14px] font-medium hover:bg-surface-container transition-colors cursor-pointer"
            >
              Nova consulta
            </button>
          </div>
        </div>

        <p className="text-[10px] text-on-surface-muted text-center">
          Formato pronto para colar diretamente no prontuário oficial
        </p>
      </div>
    </div>
  );
}
