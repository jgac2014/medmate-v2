"use client";

import { useEffect, useRef } from "react";
import { useConsultationStore } from "@/stores/consultation-store";

const DRAFT_KEY_PREFIX = "medmate_draft_";

export function getDraftKey(userId: string, patientId?: string): string {
  return patientId
    ? `${DRAFT_KEY_PREFIX}${userId}_${patientId}`
    : `${DRAFT_KEY_PREFIX}${userId}`;
}

export function clearDraft(userId: string, patientId?: string): void {
  try {
    localStorage.removeItem(getDraftKey(userId, patientId));
  } catch {
    // localStorage pode não estar disponível em SSR
  }
}

export function loadDraft(
  userId: string,
  patientId?: string
): { state: object; savedAt: string } | null {
  try {
    const raw = localStorage.getItem(getDraftKey(userId, patientId));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function useDraftAutosave(
  userId: string | null,
  patientId: string | null,
  onSaved?: () => void
) {
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!userId || !patientId) return;

    const unsub = useConsultationStore.subscribe((state) => {
      // Não salvar rascunho de consulta já persistida
      if (state.currentConsultationId) return;

      // Não salvar se o draft atual é de outro paciente
      if (state.patientId && state.patientId !== patientId) return;

      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const draft = {
          state,
          savedAt: new Date().toISOString(),
        };
        try {
          localStorage.setItem(getDraftKey(userId, patientId), JSON.stringify(draft));
          onSaved?.();
        } catch {
          // quota exceeded ou similar — silencioso
        }
      }, 30_000);
    });

    return () => {
      unsub();
      clearTimeout(debounceRef.current);
    };
  }, [userId, patientId, onSaved]);
}
