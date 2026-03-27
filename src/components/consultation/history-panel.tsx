"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { listConsultations, loadConsultation, dbRecordToState } from "@/lib/supabase/consultations";
import { useConsultationStore } from "@/stores/consultation-store";
import { showToast } from "@/components/ui/toast";
import { formatDateBR } from "@/lib/utils";

interface HistoryPanelProps {
  open: boolean;
  onClose: () => void;
}

type ConsultationListItem = {
  id: string;
  date: string;
  patient_snapshot: { name?: string; age?: string } | null;
  problems: string[] | null;
};

export function HistoryPanel({ open, onClose }: HistoryPanelProps) {
  const [items, setItems] = useState<ConsultationListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { loadState, currentConsultationId } = useConsultationStore();

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await listConsultations(user.id);
      if (error) throw error;
      setItems((data as ConsultationListItem[]) ?? []);
    } catch {
      showToast("Erro ao carregar histórico", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) fetchHistory();
  }, [open, fetchHistory]);

  async function handleLoad(id: string) {
    setLoadingId(id);
    try {
      const { data, error } = await loadConsultation(id);
      if (error) throw error;
      loadState(dbRecordToState(data), id);
      showToast("Consulta carregada", "success");
      onClose();
    } catch {
      showToast("Erro ao carregar consulta", "error");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sliding panel */}
      <div
        className={`fixed left-0 top-0 h-full w-[320px] z-50 bg-bg-1 border-r border-border-subtle shadow-[4px_0_32px_rgba(0,0,0,0.35)] transition-transform duration-200 flex flex-col ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-border-subtle shrink-0">
          <div>
            <p className="text-[13px] font-semibold tracking-[-0.01em] text-text-primary">
              Histórico
            </p>
            <p className="text-[11px] text-text-tertiary mt-0.5">Consultas salvas</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md border border-border-subtle flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-2 transition-colors cursor-pointer text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-[12px] text-text-tertiary">Carregando...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 px-6 text-center">
              <p className="text-[12px] font-medium text-text-secondary mb-1">
                Nenhuma consulta salva
              </p>
              <p className="text-[11px] text-text-tertiary leading-relaxed">
                Salve uma consulta para vê-la aqui.
              </p>
            </div>
          ) : (
            <div className="py-1">
              {items.map((item) => {
                const isActive = item.id === currentConsultationId;
                const patientName = item.patient_snapshot?.name?.trim() || "Paciente sem nome";
                const problems = item.problems ?? [];
                const topProblems = problems.slice(0, 2);
                const extra = problems.length - 2;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleLoad(item.id)}
                    disabled={loadingId === item.id}
                    className={`w-full text-left px-4 py-3 border-b border-border-subtle/40 transition-colors cursor-pointer disabled:opacity-50 ${
                      isActive
                        ? "bg-accent/8 border-l-2 border-l-accent pl-[14px]"
                        : "hover:bg-bg-2"
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-[12px] font-medium text-text-primary truncate flex-1">
                        {patientName}
                      </p>
                      <span className="text-[10px] text-text-tertiary shrink-0 tabular-nums">
                        {formatDateBR(item.date)}
                      </span>
                    </div>

                    {topProblems.length > 0 && (
                      <p className="text-[10.5px] text-text-secondary mt-0.5 truncate">
                        {topProblems.join(" · ")}
                        {extra > 0 && (
                          <span className="text-text-tertiary"> +{extra}</span>
                        )}
                      </p>
                    )}

                    {loadingId === item.id && (
                      <p className="text-[10px] text-accent mt-1">Abrindo...</p>
                    )}

                    {isActive && (
                      <span className="inline-block mt-1 text-[10px] text-accent font-medium">
                        em edição
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-3 border-t border-border-subtle shrink-0">
          <p className="text-[10.5px] text-text-tertiary leading-relaxed">
            Clique em uma consulta para continuar a edição.
          </p>
        </div>
      </div>
    </>
  );
}
