/* eslint-disable react-hooks/set-state-in-effect */
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

export interface OutputSummaryState {
  summary: string;
  isManualEdit: boolean;
  isStale: boolean;
  regenerate: () => void;
  keepCurrent: () => void;
  onManualEdit: (text: string) => void;
  outputMode: OutputMode;
  setOutputMode: (mode: OutputMode) => void;
}

export function useOutputSummary(initialMode: OutputMode = "esus"): OutputSummaryState {
  const [outputMode, setOutputMode] = useState<OutputMode>(initialMode);
  const [summary, setSummary] = useState(
    () => getOutput(useConsultationStore.getState(), initialMode)
  );
  const [isManualEdit, setIsManualEdit] = useState(false);
  const [isStale, setIsStale] = useState(false);
  const [customText, setCustomText] = useState<string | null>(null);

  // Hidratação: quando o store é carregado de uma consulta existente com customEsusText,
  // sincroniza o estado local para manter o texto manual salvo
  useEffect(() => {
    const storeText = useConsultationStore.getState().customEsusText;
    if (storeText !== null && storeText !== customText) {
      setCustomText(storeText);
      setIsManualEdit(true);
      setSummary(storeText);
    }
  // eslint-disable-next-line react-hooks/set-state-in-effect
  }, []);

  // Mantém a última geração automática para comparar quando store muda
  const prevGeneratedRef = useRef(getOutput(useConsultationStore.getState(), initialMode));
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Troca de modo: limpa edições manuais e regenera
  useEffect(() => {
    setIsManualEdit(false);
    setIsStale(false);
    setCustomText(null);
    const next = getOutput(useConsultationStore.getState(), outputMode);
    prevGeneratedRef.current = next;
    setSummary(next);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [outputMode]);

  // Store muda: detecta se geração automática mudou e avisa se houve edição manual
  useEffect(() => {
    const unsub = useConsultationStore.subscribe(() => {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const next = getOutput(useConsultationStore.getState(), outputMode);

        if (isManualEdit) {
          // Usuário editou manualmente: marcar como potencialmente desatualizado
          const generatedChanged = next !== prevGeneratedRef.current;
          if (generatedChanged) {
            setIsStale(true);
          }
          // Mantém o texto customizado visível até o usuário decidir
        } else {
          // Sem edição manual: atualizar normalmente
          prevGeneratedRef.current = next;
          setSummary(next);
        }
      }, 300);
    });
    return () => {
      unsub();
      clearTimeout(debounceRef.current);
    };
  // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [isManualEdit, outputMode]);

  function regenerate() {
    const next = getOutput(useConsultationStore.getState(), outputMode);
    prevGeneratedRef.current = next;
    setIsManualEdit(false);
    setIsStale(false);
    setCustomText(null);
    setSummary(next);
    useConsultationStore.getState().setCustomEsusText(null);
  }

  function keepCurrent() {
    // Aceita o texto atual (customizado) como definitiva
    setIsStale(false);
  }

  function onManualEdit(text: string) {
    setIsManualEdit(true);
    setCustomText(text);
    setSummary(text);
    setIsStale(false);
    // Também persiste no store para sobreviver ao save
    useConsultationStore.getState().setCustomEsusText(text);
  }

  return {
    summary,
    isManualEdit,
    isStale,
    regenerate,
    keepCurrent,
    onManualEdit,
    outputMode,
    setOutputMode,
  };
}
