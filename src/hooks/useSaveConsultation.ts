"use client";

import { useState, useCallback } from "react";
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

  const save = useCallback(async () => {
    if (!userId) {
      showToast("Sessão expirada, faça login novamente", "error");
      return;
    }

    setSaving(true);
    try {
      const state = useConsultationStore.getState();
      const { data, error } = await saveConsultation(
        userId,
        state,
        state.currentConsultationId ?? undefined,
        state.patientId
      );

      if (error) throw error;

      if (data) {
        setCurrentConsultationId(data.id);
      }

      showToast("Consulta salva!", "success");

      // Snapshot do texto eSUS para o modal
      const esusText = generateEsusSummary(useConsultationStore.getState());
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
    } catch {
      showToast("Erro ao salvar consulta", "error");
    } finally {
      setSaving(false);
    }
  }, [userId, setCurrentConsultationId]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  return { saving, save, modalOpen, esusTextSnapshot, closeModal };
}
