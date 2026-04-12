"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useConsultationStore } from "@/stores/consultation-store";
import { saveConsultation } from "@/lib/supabase/consultations";

export interface UseConsultationTimer {
  elapsed: number;
  isRunning: boolean;
  isPaused: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  finalize: () => void;
}

export function useConsultationTimer(userId: string | null): UseConsultationTimer {
  const timerState = useConsultationStore((s) => s.timerState);
  const setTimerState = useConsultationStore((s) => s.setTimerState);
  const currentConsultationId = useConsultationStore((s) => s.currentConsultationId);
  const getStore = useConsultationStore.getState;

  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const [elapsed, setElapsed] = useState(0);

  // Calcula elapsed a partir do estado atual do store
  const calcElapsed = useCallback((): number => {
    const state = timerState;
    if (state.finished_at) return state.active_seconds;
    if (state.started_at) {
      const started = new Date(state.started_at).getTime();
      const now = Date.now();
      return state.active_seconds + Math.floor((now - started) / 1000);
    }
    return state.active_seconds;
  }, [timerState]);

  // Atualiza elapsed a cada segundo
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setElapsed(calcElapsed());
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [calcElapsed]);

  // Sync com store em mudança
  useEffect(() => {
    setElapsed(calcElapsed());
  }, [timerState, calcElapsed]);

  // Persiste no banco (fire-and-forget)
  const persist = useCallback(
    async (patch: Partial<typeof timerState>) => {
      if (!userId) return;
      setTimerState(patch);
      const state = getStore();
      if (currentConsultationId) {
        saveConsultation(userId, state, currentConsultationId, state.patientId).catch(() => {});
      }
    },
    [userId, currentConsultationId, getStore, setTimerState]
  );

  const start = useCallback(() => {
    const now = new Date().toISOString();
    setTimerState({ started_at: now, finished_at: null, active_seconds: 0 });
    persist({ started_at: now, finished_at: null, active_seconds: 0 });
  }, [setTimerState, persist]);

  const pause = useCallback(() => {
    const state = getStore().timerState;
    if (!state.started_at) return;
    const now = Date.now();
    const started = new Date(state.started_at).getTime();
    const delta = Math.floor((now - started) / 1000);
    const newActive = state.active_seconds + delta;
    setTimerState({ started_at: null, active_seconds: newActive });
    persist({ started_at: null, active_seconds: newActive });
  }, [getStore, setTimerState, persist]);

  const resume = useCallback(() => {
    const now = new Date().toISOString();
    setTimerState({ started_at: now });
    persist({ started_at: now });
  }, [setTimerState, persist]);

  const finalize = useCallback(() => {
    const state = getStore().timerState;
    const now = new Date().toISOString();
    let finalSeconds = state.active_seconds;
    if (state.started_at) {
      finalSeconds = state.active_seconds + Math.floor((Date.now() - new Date(state.started_at).getTime()) / 1000);
    }
    setTimerState({ started_at: null, finished_at: now, active_seconds: finalSeconds });
    persist({ started_at: null, finished_at: now, active_seconds: finalSeconds });
  }, [getStore, setTimerState, persist]);

  return {
    elapsed,
    isRunning: timerState.started_at !== null && timerState.finished_at === null,
    isPaused: timerState.started_at === null && timerState.finished_at === null && elapsed > 0,
    start,
    pause,
    resume,
    finalize,
  };
}
