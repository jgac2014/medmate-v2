"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { loadDraft, clearDraft } from "@/hooks/useDraftAutosave";
import { useConsultationStore } from "@/stores/consultation-store";
import { showToast } from "@/components/ui/toast";
import type { ConsultationState } from "@/types";

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function DraftRecoveryBanner() {
  const [userId, setUserId] = useState<string | null>(null);
  const [draftTime, setDraftTime] = useState<string | null>(null);
  const [draftData, setDraftData] = useState<ConsultationState | null>(null);
  const { currentConsultationId, loadState, setPatientName } = useConsultationStore();

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);

      // Só mostrar banner se não há consulta aberta
      if (currentConsultationId) return;

      const draft = loadDraft(user.id);
      if (!draft) return;

      // Verificar se o draft tem conteúdo relevante
      const state = draft.state as ConsultationState;
      const hasContent =
        state?.patient?.name?.trim() ||
        state?.soap?.subjective?.trim() ||
        state?.soap?.assessment?.trim() ||
        (state?.problems?.length ?? 0) > 0;

      if (hasContent) {
        setDraftTime(formatDateTime(draft.savedAt));
        setDraftData(state);
      }
    });
  }, [currentConsultationId]);

  if (!draftTime || !draftData) return null;

  function handleContinue() {
    if (!draftData) return;
    loadState(draftData, null, null);
    setPatientName(null);
    showToast("Rascunho recuperado", "success");
    setDraftTime(null);
    setDraftData(null);
  }

  function handleDiscard() {
    if (userId) clearDraft(userId);
    setDraftTime(null);
    setDraftData(null);
  }

  return (
    <div className="mx-4 mt-3 mb-0 flex items-center justify-between gap-3 rounded-xl border border-status-warn/30 bg-status-warn-bg px-4 py-2.5">
      <p className="text-[11.5px] text-status-warn leading-relaxed">
        Rascunho recuperado de <span className="font-semibold">{draftTime}</span>. Deseja continuar?
      </p>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={handleContinue}
          className="px-3 py-1 rounded-md text-[11px] font-semibold border border-status-warn/40 text-status-warn hover:bg-status-warn/10 transition-colors cursor-pointer"
        >
          Continuar
        </button>
        <button
          onClick={handleDiscard}
          className="px-3 py-1 rounded-md text-[11px] text-text-tertiary hover:text-text-secondary border border-border-subtle hover:bg-bg-2 transition-colors cursor-pointer"
        >
          Descartar
        </button>
      </div>
    </div>
  );
}
