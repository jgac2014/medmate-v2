"use client";

import { useState, useEffect, useCallback } from "react";
import { listConsultationsByPatient } from "@/lib/supabase/consultations";
import { getPatientProblems } from "@/lib/supabase/patient-problems";
import { getPatientMedications, addPatientMedication, discontinuePatientMedication } from "@/lib/supabase/patient-medications";
import { createClient } from "@/lib/supabase/client";
import { useConsultationStore } from "@/stores/consultation-store";
import { formatDateBR } from "@/lib/utils";
import { Sparkline } from "@/components/ui/sparkline";
import { buildTrendSeries } from "@/lib/trend-data";
import { showToast } from "@/components/ui/toast";
import type { PatientMedication } from "@/types";

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
  const [medications, setMedications] = useState<PatientMedication[]>([]);
  const [newMedName, setNewMedName] = useState("");
  const [newMedDosage, setNewMedDosage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  const fetchData = useCallback(async () => {
    if (!patientId) return;
    setLoading(true);
    try {
      const [consResult, problems, meds] = await Promise.all([
        listConsultationsByPatient(patientId),
        getPatientProblems(patientId),
        getPatientMedications(patientId),
      ]);
      setConsultations((consResult.data as ConsultationSummary[]) ?? []);
      setActiveProblems(problems);
      setMedications(meds);
    } catch {
      showToast("Erro ao carregar dados do paciente", "error");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    if (open && patientId) fetchData();
  }, [open, patientId, fetchData]);

  const trends = buildTrendSeries(consultations);

  async function handleAddMedication() {
    if (!userId || !patientId || !newMedName.trim()) return;
    try {
      const med = await addPatientMedication(userId, patientId, newMedName.trim(), newMedDosage.trim());
      setMedications((prev) => [...prev, med]);
      setNewMedName("");
      setNewMedDosage("");
    } catch {
      showToast("Erro ao adicionar medicamento", "error");
    }
  }

  async function handleDiscontinue(medId: string) {
    try {
      await discontinuePatientMedication(medId);
      setMedications((prev) => prev.filter((m) => m.id !== medId));
    } catch {
      showToast("Erro ao descontinuar medicamento", "error");
    }
  }

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
        className={`fixed right-0 top-0 h-full w-[500px] z-50 bg-surface-low border-l border-outline-variant shadow-[-4px_0_32px_rgba(0,0,0,0.35)] transition-transform duration-200 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="shrink-0 px-5 py-4 border-b border-outline-variant">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-semibold text-on-surface">
                {patientName || patient.name || "Paciente"}
              </p>
              <p className="text-[11px] text-on-surface-muted mt-0.5">
                {[patient.age, patient.gender, patient.race].filter(Boolean).join(" · ")}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-md border border-outline-variant flex items-center justify-center text-on-surface-muted hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer text-lg leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4">
          {loading ? (
            <p className="text-[12px] text-on-surface-muted text-center py-8">Carregando...</p>
          ) : (
            <>
              {/* Problemas ativos */}
              {activeProblems.length > 0 && (
                <section className="mb-5">
                  <p className="text-[10px] text-on-surface-muted uppercase tracking-wide mb-2">
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

              {/* Medicamentos contínuos */}
              <section className="mb-5">
                <p className="text-[10px] text-on-surface-muted uppercase tracking-wide mb-2">
                  Medicamentos contínuos
                </p>
                {medications.length > 0 ? (
                  <div className="flex flex-col gap-1 mb-2">
                    {medications.map((med) => (
                      <div key={med.id} className="flex items-center justify-between gap-2 py-1 px-2 rounded-md bg-surface-container/50 border border-outline-variant/40">
                        <div className="min-w-0">
                          <p className="text-[11px] text-on-surface truncate">{med.medication_name}</p>
                          {med.dosage && (
                            <p className="text-[10px] text-on-surface-muted">{med.dosage}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDiscontinue(med.id)}
                          className="text-[10px] text-on-surface-muted hover:text-status-crit transition-colors cursor-pointer shrink-0"
                          title="Suspender"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-on-surface-muted mb-2">Nenhum medicamento registrado.</p>
                )}
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Medicamento"
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddMedication()}
                    className="flex-1 h-7 px-2 text-[11px] border border-outline-variant rounded-md bg-surface-container text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    placeholder="Dose"
                    value={newMedDosage}
                    onChange={(e) => setNewMedDosage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddMedication()}
                    className="w-24 h-7 px-2 text-[11px] border border-outline-variant rounded-md bg-surface-container text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:border-primary"
                  />
                  <button
                    onClick={handleAddMedication}
                    disabled={!newMedName.trim()}
                    className="h-7 px-2 text-[11px] rounded-md border border-primary/20 text-primary bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </section>

              {/* Resumo: total de consultas */}
              <section className="mb-5">
                <p className="text-[10px] text-on-surface-muted uppercase tracking-wide mb-2">
                  Consultas registradas
                </p>
                <p className="text-[20px] font-bold text-on-surface tabular-nums">
                  {consultations.length}
                </p>
              </section>

              {/* Tendências */}
              {trends.length > 0 && (
                <section className="mb-5">
                  <p className="text-[10px] text-on-surface-muted uppercase tracking-wide mb-2">
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
                <p className="text-[10px] text-on-surface-muted uppercase tracking-wide mb-2">
                  Histórico de consultas
                </p>
                {consultations.length === 0 ? (
                  <p className="text-[12px] text-on-surface-muted py-4">Nenhuma consulta encontrada.</p>
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
                          className="p-3 rounded-lg border border-outline-variant/60 bg-surface-container/50"
                        >
                          <div className="flex items-baseline justify-between mb-1">
                            <span className="text-[12px] font-medium text-on-surface">
                              {formatDateBR(c.date)}
                            </span>
                          </div>
                          {allProblems.length > 0 && (
                            <p className="text-[11px] text-on-surface-variant mb-1">
                              {allProblems.join(", ")}
                            </p>
                          )}
                          {vitalStr && (
                            <p className="text-[10.5px] text-on-surface-muted font-mono">{vitalStr}</p>
                          )}
                          {c.assessment && (
                            <p className="text-[11px] text-on-surface-variant mt-1 line-clamp-2">
                              A: {c.assessment}
                            </p>
                          )}
                          {c.prescription && (
                            <p className="text-[10.5px] text-on-surface-muted mt-1 line-clamp-2">
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
        <div className="px-5 py-3 border-t border-outline-variant shrink-0">
          <p className="text-[10.5px] text-on-surface-muted">
            Prontuário longitudinal — {consultations.length} consulta{consultations.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </>
  );
}
