"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { listConsultations, searchConsultations, loadConsultation, dbRecordToState } from "@/lib/supabase/consultations";
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
  patient_id: string | null;
};

export function HistoryPanel({ open, onClose }: HistoryPanelProps) {
  const [items, setItems] = useState<ConsultationListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [pendingLoadId, setPendingLoadId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const searchTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const { loadState, currentConsultationId, setPatientName } = useConsultationStore();

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const hasFilters = searchQuery.trim() || dateFrom || dateTo;
      const { data, error } = hasFilters
        ? await searchConsultations(user.id, searchQuery, dateFrom || undefined, dateTo || undefined)
        : await listConsultations(user.id);
      if (error) throw error;
      setItems((data as ConsultationListItem[]) ?? []);
    } catch {
      showToast("Erro ao carregar histórico", "error");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, dateFrom, dateTo]);

  useEffect(() => {
    if (open) fetchHistory();
  }, [open, fetchHistory]);

  useEffect(() => {
    if (!open) return;
    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      fetchHistory();
    }, 300);
    return () => clearTimeout(searchTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, dateFrom, dateTo]);

  async function doLoad(id: string) {
    setLoadingId(id);
    try {
      const { data, error } = await loadConsultation(id);
      if (error) throw error;
      loadState(dbRecordToState(data), id, data.patient_id ?? null);
      setPatientName(data.patient_snapshot?.name ?? null);
      showToast("Consulta carregada", "success");
      onClose();
    } catch {
      showToast("Erro ao carregar consulta", "error");
    } finally {
      setLoadingId(null);
    }
  }

  function handleLoad(id: string) {
    if (currentConsultationId && currentConsultationId !== id) {
      setPendingLoadId(id);
      return;
    }
    doLoad(id);
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

      {pendingLoadId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60">
          <div className="bg-[var(--surface-low)] border border-[var(--outline-variant)] rounded-xl p-5 max-w-[320px] w-full mx-4 shadow-[0_20px_40px_rgba(0,0,0,0.15)]">
            <p className="text-[13px] font-semibold text-[var(--on-surface)] mb-1">Substituir consulta atual?</p>
            <p className="text-[12px] text-[var(--on-surface-variant)] leading-relaxed mb-4">
              A consulta em edição será substituída. Salve antes se quiser preservá-la.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setPendingLoadId(null)}
                className="px-3 py-1.5 text-[12px] text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const id = pendingLoadId;
                  setPendingLoadId(null);
                  doLoad(id);
                }}
                className="px-3 py-1.5 text-[12px] bg-status-crit/15 border border-status-crit/25 text-status-crit hover:bg-status-crit/25 rounded-lg transition-colors cursor-pointer"
              >
                Substituir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sliding panel */}
      <div
        className={`fixed left-0 top-0 h-full w-[320px] z-50 bg-[var(--surface-low)] border-r border-[var(--outline-variant)] shadow-[4px_0_32px_rgba(0,0,0,0.12)] transition-transform duration-200 flex flex-col ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-[var(--outline-variant)] shrink-0">
          <div>
            <p className="text-[13px] font-semibold tracking-[-0.01em] text-[var(--on-surface)]">
              Histórico
            </p>
            <p className="text-[11px] text-[var(--on-surface-muted)] mt-0.5">Consultas salvas</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md border border-[var(--outline-variant)] flex items-center justify-center text-[var(--on-surface-muted)] hover:text-[var(--on-surface)] hover:bg-[var(--surface-container)] transition-colors cursor-pointer text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* Search */}
        <div className="px-3 py-2 border-b border-[var(--outline-variant)] space-y-1.5">
          <input
            type="text"
            placeholder="Buscar paciente, problema, texto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 px-2.5 text-[12px] border border-[var(--outline-variant)] rounded-md bg-[var(--surface-container)] text-[var(--on-surface)] placeholder:text-[var(--on-surface-muted)] focus:outline-none focus:border-primary"
          />
          <div className="flex gap-1.5">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="flex-1 h-7 px-2 text-[11px] border border-[var(--outline-variant)] rounded-md bg-[var(--surface-container)] text-[var(--on-surface-variant)] focus:outline-none focus:border-primary"
              title="Data inicial"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="flex-1 h-7 px-2 text-[11px] border border-[var(--outline-variant)] rounded-md bg-[var(--surface-container)] text-[var(--on-surface-variant)] focus:outline-none focus:border-primary"
              title="Data final"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-[12px] text-[var(--on-surface-muted)]">Carregando...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 px-6 text-center">
              <p className="text-[12px] font-medium text-[var(--on-surface-variant)] mb-1">
                Nenhuma consulta salva
              </p>
              <p className="text-[11px] text-[var(--on-surface-muted)] leading-relaxed">
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
                    className={`w-full text-left px-4 py-3 border-b border-[var(--outline-variant)] transition-colors cursor-pointer disabled:opacity-50 ${
                      isActive
                        ? "bg-accent/8 border-l-2 border-l-accent pl-[14px]"
                        : "hover:bg-[var(--surface-container)]"
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-[12px] font-medium text-[var(--on-surface)] truncate flex-1">
                        {patientName}
                      </p>
                      <span className="text-[10px] text-[var(--on-surface-muted)] shrink-0 tabular-nums">
                        {formatDateBR(item.date)}
                      </span>
                    </div>

                    {topProblems.length > 0 && (
                      <p className="text-[10.5px] text-[var(--on-surface-variant)] mt-0.5 truncate">
                        {topProblems.join(" · ")}
                        {extra > 0 && (
                          <span className="text-[var(--on-surface-muted)]"> +{extra}</span>
                        )}
                      </p>
                    )}

                    {!item.patient_id && (
                      <span className="inline-block mt-1 text-[10px] text-[var(--on-surface-muted)] border border-[var(--outline-variant)] rounded px-1.5 py-0.5">
                        legado
                      </span>
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
        <div className="px-4 py-3 border-t border-[var(--outline-variant)] shrink-0">
          <p className="text-[10.5px] text-[var(--on-surface-muted)] leading-relaxed">
            Clique em uma consulta para continuar a edição.
          </p>
        </div>
      </div>
    </>
  );
}
