"use client";

import { useState, useEffect, useRef } from "react";
import { useConsultationStore } from "@/stores/consultation-store";
import { generateEsusSummary } from "@/lib/esus-generator";
import { generateResumoOutput, generateDetalhadoOutput } from "@/lib/output-generators";
import type { OutputMode, ConsultationState } from "@/types";

function getOutput(state: ConsultationState, mode: OutputMode): string {
  if (mode === "resumido") return generateResumoOutput(state);
  if (mode === "detalhado") return generateDetalhadoOutput(state);
  return generateEsusSummary(state);
}

export function useOutputSummary(initialMode: OutputMode = "esus") {
  const [outputMode, setOutputMode] = useState<OutputMode>(initialMode);
  const [summary, setSummary] = useState(
    () => getOutput(useConsultationStore.getState(), initialMode)
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const modeRef = useRef<OutputMode>(initialMode);

  useEffect(() => {
    modeRef.current = outputMode;
    setSummary(getOutput(useConsultationStore.getState(), outputMode));
  }, [outputMode]);

  useEffect(() => {
    const unsub = useConsultationStore.subscribe(() => {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setSummary(getOutput(useConsultationStore.getState(), modeRef.current));
      }, 300);
    });
    return () => {
      unsub();
      clearTimeout(debounceRef.current);
    };
  }, []);

  return { summary, outputMode, setOutputMode };
}
