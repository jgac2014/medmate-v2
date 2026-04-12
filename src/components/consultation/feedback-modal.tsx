"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { submitFeedback } from "@/lib/feedback";
import { useConsultationStore } from "@/stores/consultation-store";
import { showToast } from "@/components/ui/toast";
import type { FeedbackType, FeedbackArea } from "@/types";

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TIPO_OPTIONS: { value: FeedbackType; label: string }[] = [
  { value: "sugestao", label: "Sugestão" },
  { value: "bug", label: "Bug" },
  { value: "dificuldade", label: "Dificuldade" },
  { value: "elogio", label: "Elogio" },
];

const AREA_OPTIONS: { value: FeedbackArea; label: string }[] = [
  { value: "consulta", label: "Consulta" },
  { value: "exames", label: "Exames" },
  { value: "receituario", label: "Receituário" },
  { value: "pacientes", label: "Pacientes" },
  { value: "historico", label: "Histórico" },
  { value: "conta", label: "Conta" },
  { value: "outro", label: "Outro" },
];

function calcTimerSeconds(timerState: { started_at: string | null; finished_at: string | null; active_seconds: number }): number | undefined {
  if (timerState.finished_at) return timerState.active_seconds;
  if (timerState.started_at) {
    return timerState.active_seconds +
      Math.floor((Date.now() - new Date(timerState.started_at).getTime()) / 1000);
  }
  return undefined;
}

export function FeedbackModal({ open, onOpenChange }: FeedbackModalProps) {
  const [type, setType] = useState<FeedbackType>("sugestao");
  const [area, setArea] = useState<FeedbackArea>("consulta");
  const [message, setMessage] = useState("");
  const [contactOk, setContactOk] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const timerState = useConsultationStore((s) => s.timerState);
  const currentConsultationId = useConsultationStore((s) => s.currentConsultationId);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await submitFeedback({
        type,
        area,
        message,
        contact_ok: contactOk,
        origin: "topbar_menu",
        consultation_id: currentConsultationId ?? undefined,
        timer_seconds: calcTimerSeconds(timerState),
      });
      showToast("Feedback enviado — obrigado!", "success");
      setMessage("");
      setContactOk(false);
      setType("sugestao");
      setArea("consulta");
      onOpenChange(false);
    } catch {
      showToast("Erro ao enviar feedback", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/20 z-[200] animate-in fade-in duration-150" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] bg-surface-lowest rounded-xl border border-outline-variant shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-[15px] font-semibold text-on-surface">
              Enviar feedback
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-on-surface-muted hover:text-on-surface transition-colors cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-4">
            {/* Tipo */}
            <div>
              <label className="block text-[11px] font-medium text-on-surface-muted uppercase tracking-wide mb-1.5">
                Tipo
              </label>
              <div className="flex flex-wrap gap-2">
                {TIPO_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setType(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors cursor-pointer ${
                      type === opt.value
                        ? "bg-primary text-white border-primary"
                        : "bg-surface-low border-outline-variant text-on-surface-variant hover:border-outline"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Área */}
            <div>
              <label className="block text-[11px] font-medium text-on-surface-muted uppercase tracking-wide mb-1.5">
                Área
              </label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value as FeedbackArea)}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-low text-[13px] text-on-surface focus:outline-none focus:border-primary transition-colors"
              >
                {AREA_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Mensagem */}
            <div>
              <label className="block text-[11px] font-medium text-on-surface-muted uppercase tracking-wide mb-1.5">
                Mensagem
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Descreva sua sugestão, bug ou dificuldade..."
                className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-low text-[13px] text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            {/* Aviso de privacidade */}
            <div className="bg-status-warn-bg border border-status-warn/20 rounded-lg px-3 py-2">
              <p className="text-[11px] text-status-warn leading-relaxed">
                Não inclua nome de paciente, CPF ou informações clínicas sensíveis.
              </p>
            </div>

            {/* Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={contactOk}
                onChange={(e) => setContactOk(e.target.checked)}
                className="w-4 h-4 rounded border-outline-variant accent-[var(--primary)]"
              />
              <span className="text-[12px] text-on-surface-variant">
                Pode me contatar sobre isso
              </span>
            </label>
          </div>

          {/* Ações */}
          <div className="flex gap-2 mt-5 pt-4 border-t border-outline-variant">
            <Dialog.Close asChild>
              <button className="flex-1 py-2.5 px-4 rounded-lg border border-outline-variant text-[13px] font-medium text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer">
                Cancelar
              </button>
            </Dialog.Close>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 py-2.5 px-4 rounded-lg bg-primary text-white text-[13px] font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 cursor-pointer"
            >
              {submitting ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
