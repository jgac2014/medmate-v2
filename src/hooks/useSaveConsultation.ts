"use client";

import { useState, useCallback, useRef } from "react";
import { useConsultationStore } from "@/stores/consultation-store";
import { saveConsultation } from "@/lib/supabase/consultations";
import { upsertPatientProblems } from "@/lib/supabase/patient-problems";
import { generateEsusSummary } from "@/lib/esus-generator";
import { showToast } from "@/components/ui/toast";

interface SaveResult {
  saving: boolean;
  save: () => Promise<void>;
  modalOpen: boolean;
  esusTextSnapshot: string;
  closeModal: () => void;
}

export function useSaveConsultation(userId: string | null): SaveResult {
  const { setCurrentConsultationId } = useConsultationStore();
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [esusTextSnapshot, setEsusTextSnapshot] = useState("");
  // Idempotency: evitar duplicate INSERT se já há save in-flight
  const saveInFlightRef = useRef(false);

  const save = useCallback(async () => {
    if (!userId) {
      showToast("Sessão expirada, faça login novamente", "error");
      return;
    }

    if (saveInFlightRef.current) {
      showToast("Salvamento em andamento, aguarde...", "info");
      return;
    }
    saveInFlightRef.current = true;

    setSaving(true);
    try {
      const state = useConsultationStore.getState();
      const { data, error } = await saveConsultation(
        userId,
        state,
        state.currentConsultationId ?? undefined,
        state.patientId
      );

      if (error) {
        saveInFlightRef.current = false;
        const msg = error.message ?? "Erro desconhecido do banco";
        showToast(`Erro ao salvar: ${msg}`, "error");
        throw error;
      }

      if (data) {
        setCurrentConsultationId(data.id);
      }

      showToast("Consulta salva!", "success");

      // Snapshot do texto eSUS para o modal — usa edição manual se existir
      const esusText = state.customEsusText ?? generateEsusSummary(state);
      setEsusTextSnapshot(esusText);
      setModalOpen(true);

      // Persistir problemas longitudinais no paciente (silencioso)
      const currentState = useConsultationStore.getState();
      if (currentState.patientId) {
        const allProblems = [
          ...currentState.problems,
          ...(currentState.problemsOther
            ? currentState.problemsOther.split(",").map((s) => s.trim()).filter(Boolean)
            : []),
        ];
        upsertPatientProblems(userId, currentState.patientId, allProblems).catch(() => {});
      }
    } finally {
      setSaving(false);
      saveInFlightRef.current = false;
    }
  }, [userId, setCurrentConsultationId]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  return { saving, save, modalOpen, esusTextSnapshot, closeModal };
}
