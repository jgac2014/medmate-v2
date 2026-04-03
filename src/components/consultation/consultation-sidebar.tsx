"use client";

import { useCallback, useEffect, useState } from "react";
import { useConsultationStore } from "@/stores/consultation-store";
import { getPatientProblems } from "@/lib/supabase/patient-problems";
import { getPatientMedications } from "@/lib/supabase/patient-medications";
import { getPatientAlerts } from "@/lib/supabase/alerts";
import { AlertList } from "@/components/consultation/alert-list";
import { createClient } from "@/lib/supabase/client";
import type { PatientMedication, Alert } from "@/types";

function getDismissedAlerts(): Set<string> {
  try {
    const raw = localStorage.getItem("medmate_dismissed_alerts");
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

interface PatientData {
  problems: string[];
  medications: PatientMedication[];
  alerts: Alert[];
}

const EMPTY_DATA: PatientData = { problems: [], medications: [], alerts: [] };

export function ConsultationSidebar() {
  const { patientId, patientName, patient } = useConsultationStore();
  const [userId, setUserId] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<PatientData>(EMPTY_DATA);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  const fetchPatientData = useCallback(async () => {
    if (!patientId || !userId) return;
    setLoading(true);
    try {
      const [problems, meds, newAlerts] = await Promise.all([
        getPatientProblems(patientId),
        getPatientMedications(patientId),
        getPatientAlerts(patientId, userId),
      ]);
      const dismissed = getDismissedAlerts();
      setPatientData({
        problems,
        medications: meds.filter((m) => m.active),
        alerts: newAlerts.filter((a) => !dismissed.has(a.id)),
      });
    } finally {
      setLoading(false);
    }
  }, [patientId, userId]);

  useEffect(() => {
    if (patientId && userId) fetchPatientData();
  }, [patientId, userId, fetchPatientData]);

  function handleDismiss(id: string) {
    try {
      const dismissed = getDismissedAlerts();
      dismissed.add(id);
      localStorage.setItem("medmate_dismissed_alerts", JSON.stringify([...dismissed]));
    } catch {
      // silencioso
    }
    setPatientData((prev) => ({
      ...prev,
      alerts: prev.alerts.filter((a) => a.id !== id),
    }));
  }

  // Derive displayed data: clear when no patient selected (avoids sync setState in effect)
  const { problems: activeProblems, medications, alerts } = patientId ? patientData : EMPTY_DATA;
  const displayName = patientName ?? patient.name ?? null;
  const age = patient.age ? `${patient.age} anos` : null;
  const gender = patient.gender || null;

  return (
    <aside className="w-72 shrink-0 h-full overflow-y-auto border-r border-[var(--outline-variant)] bg-[var(--bg-1)] flex flex-col">

      {/* Header: Avatar + Nome + Badge */}
      <div className="p-4 border-b border-[var(--outline-variant)]">
        <div className="flex items-center gap-3 mb-3">
          {/* Avatar com inicial */}
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full bg-[var(--accent-subtle)] border border-[var(--accent-border)] flex items-center justify-center">
              <span className="text-[15px] font-bold text-[var(--accent)]">
                {displayName ? displayName[0].toUpperCase() : "?"}
              </span>
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[var(--status-ok)] border-2 border-[var(--bg-1)] rounded-full" />
          </div>
          {/* Nome e dados */}
          <div className="min-w-0">
            {displayName ? (
              <>
                <p className="text-[14px] font-semibold text-[var(--on-surface)] leading-tight truncate">
                  {displayName}
                </p>
                <p className="text-[11px] text-[var(--on-surface-muted)] mt-0.5">
                  {[age, gender].filter(Boolean).join(" · ")}
                </p>
              </>
            ) : (
              <p className="text-[12px] text-[var(--on-surface-muted)] italic">
                Nenhum paciente selecionado
              </p>
            )}
          </div>
        </div>

        {/* Memória Clínica compacta */}
        {patientId && (
          <div className="bg-[var(--bg-0)] rounded-lg p-2.5 border border-[var(--outline-variant)] space-y-2">
            <p className="text-[9px] uppercase font-bold text-[var(--on-surface-muted)] tracking-wider">
              Memória Clínica
            </p>
            {activeProblems.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {activeProblems.slice(0, 4).map((p) => (
                  <span
                    key={p}
                    className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-border)]"
                  >
                    {p}
                  </span>
                ))}
                {activeProblems.length > 4 && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-[var(--bg-2)] text-[var(--on-surface-muted)]">
                    +{activeProblems.length - 4}
                  </span>
                )}
              </div>
            ) : (
              <p className="text-[10px] text-[var(--on-surface-muted)] italic">
                Nenhum problema registrado
              </p>
            )}
          </div>
        )}
      </div>

      {/* Medicamentos contínuos */}
      <div className="px-4 py-3 border-b border-[var(--outline-variant)]">
        <p className="text-[10px] font-semibold text-[var(--on-surface-muted)] uppercase tracking-wide mb-2">
          Medicamentos contínuos
        </p>
        {loading ? (
          <p className="text-[11px] text-[var(--on-surface-muted)] italic">Carregando...</p>
        ) : medications.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            {medications.map((m) => (
              <div key={m.id}>
                <p className="text-[11px] text-[var(--on-surface)] font-medium leading-tight">
                  {m.medication_name}
                </p>
                {m.dosage && (
                  <p className="text-[10px] text-[var(--on-surface-muted)]">{m.dosage}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-[var(--on-surface-muted)] italic">
            {patientId ? "Nenhum medicamento" : "—"}
          </p>
        )}
      </div>

      {/* Alertas clínicos */}
      {alerts.length > 0 && (
        <div className="px-4 py-3 border-b border-[var(--outline-variant)]">
          <p className="text-[10px] font-semibold text-[var(--on-surface-muted)] uppercase tracking-wide mb-2">
            Alertas
          </p>
          <AlertList alerts={alerts} onDismiss={handleDismiss} />
        </div>
      )}

      <div className="flex-1" />
    </aside>
  );
}
