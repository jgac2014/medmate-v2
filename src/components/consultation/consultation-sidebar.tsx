"use client";

import { useEffect, useState } from "react";
import { useConsultationStore } from "@/stores/consultation-store";
import { getPatientProblems } from "@/lib/supabase/patient-problems";
import { getPatientMedications } from "@/lib/supabase/patient-medications";
import { createClient } from "@/lib/supabase/client";
import type { PatientMedication } from "@/types";
import { User, AlertCircle } from "lucide-react";

export function ConsultationSidebar() {
  const { patientId, patientName, patient } = useConsultationStore();
  const [userId, setUserId] = useState<string | null>(null);
  const [activeProblems, setActiveProblems] = useState<string[]>([]);
  const [medications, setMedications] = useState<PatientMedication[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  useEffect(() => {
    if (!patientId) {
      setActiveProblems([]);
      setMedications([]);
      return;
    }
    setLoading(true);
    Promise.all([
      getPatientProblems(patientId),
      getPatientMedications(patientId),
    ])
      .then(([problems, meds]) => {
        setActiveProblems(problems);
        setMedications(meds.filter((m) => m.active));
      })
      .finally(() => setLoading(false));
  }, [patientId]);

  const displayName = patientName ?? patient.name ?? null;
  const age = patient.age ? `${patient.age} anos` : null;
  const gender = patient.gender || null;

  return (
    <aside className="w-72 shrink-0 h-full overflow-y-auto border-r border-outline-variant/20 bg-surface-lowest flex flex-col">
      {/* Cabeçalho do paciente */}
      <div className="px-4 py-4 border-b border-outline-variant/20">
        <div className="flex items-center gap-2 mb-1">
          <User size={14} className="text-on-surface-muted shrink-0" />
          <span className="text-[11px] font-medium text-on-surface-muted uppercase tracking-wide">
            Paciente
          </span>
        </div>
        {displayName ? (
          <>
            <p className="text-[14px] font-semibold text-on-surface leading-tight mt-1">
              {displayName}
            </p>
            {(age || gender) && (
              <p className="text-[11px] text-on-surface-muted mt-0.5">
                {[age, gender].filter(Boolean).join(" · ")}
              </p>
            )}
          </>
        ) : (
          <p className="text-[12px] text-on-surface-muted italic mt-1">
            Nenhum paciente selecionado
          </p>
        )}
      </div>

      {/* Problemas ativos */}
      <div className="px-4 py-3 border-b border-outline-variant/20">
        <p className="text-[10px] font-semibold text-on-surface-muted uppercase tracking-wide mb-2">
          Problemas ativos
        </p>
        {loading ? (
          <p className="text-[11px] text-on-surface-muted italic">Carregando...</p>
        ) : activeProblems.length > 0 ? (
          <div className="flex flex-col gap-1">
            {activeProblems.map((p) => (
              <span
                key={p}
                className="inline-block text-[11px] px-2 py-0.5 rounded bg-error/10 text-error w-fit"
              >
                {p}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-on-surface-muted italic">
            {patientId ? "Nenhum problema registrado" : "—"}
          </p>
        )}
      </div>

      {/* Medicamentos contínuos */}
      <div className="px-4 py-3 border-b border-outline-variant/20">
        <p className="text-[10px] font-semibold text-on-surface-muted uppercase tracking-wide mb-2">
          Medicamentos contínuos
        </p>
        {loading ? (
          <p className="text-[11px] text-on-surface-muted italic">Carregando...</p>
        ) : medications.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            {medications.map((m) => (
              <div key={m.id}>
                <p className="text-[11px] text-on-surface font-medium leading-tight">
                  {m.medication_name}
                </p>
                {m.dosage && (
                  <p className="text-[10px] text-on-surface-muted">{m.dosage}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-on-surface-muted italic">
            {patientId ? "Nenhum medicamento registrado" : "—"}
          </p>
        )}
      </div>

      {/* Placeholder para alertas — Task 6 (Sessão 2) preencherá esta seção */}
      <div id="sidebar-alerts-slot" className="px-4 py-3 flex-1" />
    </aside>
  );
}
