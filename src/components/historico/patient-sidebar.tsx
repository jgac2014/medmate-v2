"use client";

import type { Patient, PatientMedication } from "@/types";
import { ageFromBirthDate } from "@/lib/utils";
import { ArrowLeftRight } from "lucide-react";

interface PatientSidebarProps {
  patient: Patient | null;
  problems: string[];
  medications: PatientMedication[];
  initials: string;
  lastPa: string | null;
  lastPaDate: string | null;
  onChangePatient: () => void;
}

export function PatientSidebar({
  patient,
  problems,
  medications,
  initials,
  lastPa,
  lastPaDate,
  onChangePatient,
}: PatientSidebarProps) {
  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center gap-3">
        <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center">
          <ArrowLeftRight className="w-5 h-5 text-on-surface-muted" />
        </div>
        <p className="text-[13px] font-medium text-on-surface-variant">Nenhum paciente selecionado</p>
        <p className="text-[11px] text-on-surface-muted leading-relaxed">
          Use a busca acima para selecionar um paciente e ver seu histórico.
        </p>
      </div>
    );
  }

  const ageYears = ageFromBirthDate(patient.birth_date);
  const age = ageYears !== null ? `${ageYears}a` : null;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 flex flex-col gap-5 flex-1">
        {/* Patient Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-outline-variant/50">
          <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-bold text-[13px] shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-headline text-[15px] font-semibold text-primary leading-tight truncate">
              {patient.name}
            </h2>
            <p className="text-[10px] font-medium uppercase tracking-widest text-on-surface-muted mt-0.5">
              {[age, patient.gender].filter(Boolean).join(" • ")}
            </p>
            <button
              onClick={onChangePatient}
              className="mt-2 flex items-center gap-1.5 px-2 py-1 border border-primary/20 text-primary rounded-md text-[9px] font-bold uppercase tracking-wider hover:bg-primary/5 hover:border-primary/40 transition-all cursor-pointer"
            >
              <ArrowLeftRight className="w-3 h-3" />
              Trocar Paciente
            </button>
          </div>
        </div>

        {/* Last PA */}
        {lastPa && (
          <div className="bg-surface-lowest p-3 rounded-xl border border-outline-variant shadow-sm space-y-2">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-muted mb-1">
                Última PA{lastPaDate ? ` (${lastPaDate})` : ""}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-[14px] font-bold text-on-surface">{lastPa}</span>
                <span className="text-[9px] text-on-surface-muted font-medium">mmHg</span>
              </div>
            </div>
          </div>
        )}

        {/* Problemas Ativos */}
        {problems.length > 0 && (
          <section>
            <h3 className="text-[9px] font-bold uppercase tracking-widest text-on-surface-muted mb-2 px-0.5">
              Problemas Ativos
            </h3>
            <div className="space-y-1">
              {problems.slice(0, 6).map((p) => (
                <div
                  key={p}
                  className="flex items-center justify-between text-[11px] font-semibold text-on-surface p-1.5 bg-surface-lowest border border-outline-variant/50 rounded shadow-sm"
                >
                  <span className="truncate">{p}</span>
                </div>
              ))}
              {problems.length > 6 && (
                <p className="text-[10px] text-on-surface-muted px-1.5">
                  +{problems.length - 6} mais
                </p>
              )}
            </div>
          </section>
        )}

        {/* Farmacoterapia */}
        {medications.length > 0 && (
          <section>
            <h3 className="text-[9px] font-bold uppercase tracking-widest text-on-surface-muted mb-2 px-0.5">
              Farmacoterapia Atual
            </h3>
            <div className="space-y-1.5">
              {medications.slice(0, 5).map((m) => (
                <div
                  key={m.id}
                  className="text-[11px] leading-tight text-on-surface bg-surface-lowest p-2 rounded border border-outline-variant/50 shadow-sm"
                >
                  <p className="font-semibold">{m.medication_name}</p>
                  {m.dosage && <p className="text-on-surface-muted text-[9px] mt-0.5">{m.dosage}</p>}
                </div>
              ))}
              {medications.length > 5 && (
                <p className="text-[10px] text-on-surface-muted px-1.5">
                  +{medications.length - 5} mais
                </p>
              )}
            </div>
          </section>
        )}

        {/* Empty medication state */}
        {medications.length === 0 && problems.length === 0 && (
          <div className="px-1 py-2">
            <p className="text-[11px] text-on-surface-muted">
              Nenhum dado longitudinal registrado ainda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
