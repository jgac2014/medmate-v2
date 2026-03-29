"use client";

import { useState, useEffect, useCallback } from "react";
import { listConsultationsByPatient } from "@/lib/supabase/consultations";
import { getPatientProblems } from "@/lib/supabase/patient-problems";
import { useConsultationStore } from "@/stores/consultation-store";
import { formatDateBR } from "@/lib/utils";
import { Sparkline } from "@/components/ui/sparkline";
import { buildTrendSeries } from "@/lib/trend-data";

interface PatientDashboardProps {
  open: boolean;
  onClose: () => void;
}

type ConsultationSummary = {
  id: string;
  date: string;
  problems: string[] | null;
  problems_other: string | null;
  vitals: { pas?: string; pad?: string; peso?: string; imc?: string } | null;
  labs: Record<string, string> | null;
  assessment: string | null;
  prescription: string | null;
};

export function PatientDashboard({ open, onClose }: PatientDashboardProps) {
  const { patientId, patientName, patient } = useConsultationStore();
  const [consultations, setConsultations] = useState<ConsultationSummary[]>([]);
  const [activeProblems, setActiveProblems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!patientId) return;
    setLoading(true);
    try {
      const [consResult, problems] = await Promise.all([
        listConsultationsByPatient(patientId),
        getPatientProblems(patientId),
      ]);
      setConsultations((consResult.data as ConsultationSummary[]) ?? []);
      setActiveProblems(problems);
    } catch {
      // silencioso
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    if (open && patientId) fetchData();
  }, [open, patientId, fetchData]);

  const trends = buildTrendSeries(consultations);

  if (!patientId) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-[500px] z-50 bg-bg-1 border-l border-border-subtle shadow-[-4px_0_32px_rgba(0,0,0,0.35)] transition-transform duration-200 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="shrink-0 px-5 py-4 border-b border-border-subtle">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-semibold text-text-primary">
                {patientName || patient.name || "Paciente"}
              </p>
              <p className="text-[11px] text-text-tertiary mt-0.5">
                {[patient.age, patient.gender, patient.race].filter(Boolean).join(" · ")}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-md border border-border-subtle flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-2 transition-colors cursor-pointer text-lg leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4">
          {loading ? (
            <p className="text-[12px] text-text-tertiary text-center py-8">Carregando...</p>
          ) : (
            <>
              {/* Problemas ativos */}
              {activeProblems.length > 0 && (
                <section className="mb-5">
                  <p className="text-[10px] text-text-tertiary uppercase tracking-wide mb-2">
                    Problemas ativos
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProblems.map((p) => (
                      <span
                        key={p}
                        className="px-2 py-0.5 text-[11px] rounded-md border border-status-warn/20 bg-status-warn/8 text-status-warn"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Resumo: total de consultas */}
              <section className="mb-5">
                <p className="text-[10px] text-text-tertiary uppercase tracking-wide mb-2">
                  Consultas registradas
                </p>
                <p className="text-[20px] font-bold text-text-primary tabular-nums">
                  {consultations.length}
                </p>
              </section>

              {/* Tendências */}
              {trends.length > 0 && (
                <section className="mb-5">
                  <p className="text-[10px] text-text-tertiary uppercase tracking-wide mb-2">
                    Tendências
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {trends.map((t) => (
                      <Sparkline
                        key={t.label}
                        label={t.label}
                        unit={t.unit}
                        data={t.data}
                        color={t.color}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Lista de consultas */}
              <section>
                <p className="text-[10px] text-text-tertiary uppercase tracking-wide mb-2">
                  Histórico de consultas
                </p>
                {consultations.length === 0 ? (
                  <p className="text-[12px] text-text-tertiary py-4">Nenhuma consulta encontrada.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {consultations.map((c) => {
                      const allProblems = [
                        ...(c.problems ?? []),
                        ...(c.problems_other?.split(",").map((s) => s.trim()).filter(Boolean) ?? []),
                      ];
                      const vitals = c.vitals;
                      const vitalStr = [
                        vitals?.pas && vitals?.pad ? `PA ${vitals.pas}/${vitals.pad}` : "",
                        vitals?.peso ? `${vitals.peso} kg` : "",
                        vitals?.imc ? `IMC ${vitals.imc}` : "",
                      ].filter(Boolean).join(" · ");

                      return (
                        <div
                          key={c.id}
                          className="p-3 rounded-lg border border-border-subtle/60 bg-bg-2/50"
                        >
                          <div className="flex items-baseline justify-between mb-1">
                            <span className="text-[12px] font-medium text-text-primary">
                              {formatDateBR(c.date)}
                            </span>
                          </div>
                          {allProblems.length > 0 && (
                            <p className="text-[11px] text-text-secondary mb-1">
                              {allProblems.join(", ")}
                            </p>
                          )}
                          {vitalStr && (
                            <p className="text-[10.5px] text-text-tertiary font-mono">{vitalStr}</p>
                          )}
                          {c.assessment && (
                            <p className="text-[11px] text-text-secondary mt-1 line-clamp-2">
                              A: {c.assessment}
                            </p>
                          )}
                          {c.prescription && (
                            <p className="text-[10.5px] text-text-tertiary mt-1 line-clamp-2">
                              Rx: {c.prescription}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border-subtle shrink-0">
          <p className="text-[10.5px] text-text-tertiary">
            Prontuário longitudinal — {consultations.length} consulta{consultations.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </>
  );
}
