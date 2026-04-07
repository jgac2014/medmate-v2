"use client";

import { useCallback, useEffect, useState } from "react";

export type OnboardingStep = "patientCreated" | "consultationStarted" | "summaryCopied";

type OnboardingState = {
  patientCreated: boolean;
  consultationStarted: boolean;
  summaryCopied: boolean;
  dismissed: boolean;
};

const KEY_PREFIX = "medmate_onboarding_v1";
const IN_TAB_EVENT = "medmate-onboarding-update";

function getKey(userId: string | null): string {
  return userId ? `${KEY_PREFIX}_${userId}` : KEY_PREFIX;
}

function read(userId: string | null): OnboardingState {
  if (typeof window === "undefined") {
    return { patientCreated: false, consultationStarted: false, summaryCopied: false, dismissed: false };
  }
  try {
    const raw = localStorage.getItem(getKey(userId));
    if (raw) return JSON.parse(raw) as OnboardingState;
  } catch {
    // ignore
  }
  return { patientCreated: false, consultationStarted: false, summaryCopied: false, dismissed: false };
}

function write(state: OnboardingState, userId: string | null) {
  try {
    localStorage.setItem(getKey(userId), JSON.stringify(state));
  } catch {
    // ignore
  }
}

/** Call this from any component that triggers an onboarding milestone. */
export function markOnboardingStep(step: OnboardingStep, userId: string | null) {
  const state = read(userId);
  if (!state[step]) {
    write({ ...state, [step]: true }, userId);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(IN_TAB_EVENT));
    }
  }
}

export function useOnboarding(userId: string | null) {
  const [state, setState] = useState<OnboardingState>(() => read(userId));

  // Re-read when userId resolves (e.g. after async getUser)
  useEffect(() => {
    setState(read(userId));
  }, [userId]);

  useEffect(() => {
    function sync() {
      setState(read(userId));
    }
    // "storage" fires in OTHER tabs; IN_TAB_EVENT fires in THIS tab
    window.addEventListener("storage", sync);
    window.addEventListener(IN_TAB_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(IN_TAB_EVENT, sync);
    };
  }, [userId]);

  const dismiss = useCallback(() => {
    const next = { ...read(userId), dismissed: true };
    write(next, userId);
    setState(next);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(IN_TAB_EVENT));
    }
  }, [userId]);

  const allDone = state.patientCreated && state.consultationStarted && state.summaryCopied;
  const visible = !state.dismissed;

  return { state, visible, allDone, dismiss };
}
