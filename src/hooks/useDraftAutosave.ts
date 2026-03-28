"use client";

import { useEffect, useRef } from "react";
import { useConsultationStore } from "@/stores/consultation-store";

const DRAFT_KEY_PREFIX = "medmate_draft_";

export function getDraftKey(userId: string): string {
  return `${DRAFT_KEY_PREFIX}${userId}`;
}

export function clearDraft(userId: string): void {
  try {
    localStorage.removeItem(getDraftKey(userId));
  } catch {
    // localStorage pode não estar disponível em SSR
  }
}

export function loadDraft(userId: string): { state: object; savedAt: string } | null {
  try {
    const raw = localStorage.getItem(getDraftKey(userId));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function useDraftAutosave(userId: string | null) {
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!userId) return;

    const unsub = useConsultationStore.subscribe((state) => {
      // Não salvar rascunho de consulta já persistida
      if (state.currentConsultationId) return;

      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        // JSON.stringify ignora funções automaticamente — só os campos de dados são serializados
        const draft = {
          state,
          savedAt: new Date().toISOString(),
        };
        try {
          localStorage.setItem(getDraftKey(userId), JSON.stringify(draft));
        } catch {
          // quota exceeded ou similar — silencioso
        }
      }, 30_000);
    });

    return () => {
      unsub();
      clearTimeout(debounceRef.current);
    };
  }, [userId]);
}
