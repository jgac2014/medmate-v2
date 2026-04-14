"use client";

import type { Patient, PatientMedication } from "@/types";
import { ageFromBirthDate } from "@/lib/utils";
import { ArrowLeftRight, FilePlus, Calendar } from "lucide-react";

interface PatientSidebarProps {
  patient: Patient | null;
  problems: string[];
  medications: PatientMedication[];
  initials: string;
  lastPa: string | null;
  lastPaDate: string | null;
  onChangePatient: () => void;
  onNewConsultation: () => void;
  consultationCount: number;
}

export function PatientSidebar({
  patient,
  problems,
  medications,
  initials,
  lastPa,
  lastPaDate,
  onChangePatient,
  onNewConsultation,
  consultationCount,
}: PatientSidebarProps) {
  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-5 py-12 text-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-on-surface-muted">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div>
          <p className="text-[13px] font-semibold text-on-surface-variant">Nenhum paciente selecionado</p>
          <p className="text-[11px] text-on-surface-muted mt-1 leading-relaxed">
            Use a busca acima para selecionar um paciente.
          </p>
        </div>
      </div>
    );
  }

  const ageYears = ageFromBirthDate(patient.birth_date);

  return (
    <div className="flex flex-col h-full">
      {/* Header do paciente */}
      <div className="px-4 pt-5 pb-4 border-b border-outline-variant/50">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-bold text-[13px] shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-headline text-[15px] font-semibold text-primary leading-tight truncate">
              {patient.name}
            </h2>
            <p className="text-[10px] font-medium uppercase tracking-wide text-on-surface-muted mt-0.5">
              {[ageYears !== null ? `${ageYears} anos` : null, patient.gender]
                .filter(Boolean)
                .join(" · ")}
            </p>
            {patient.cpf && (
              <p className="text-[10px] text-secondary font-medium mt-0.5">
                CPF {patient.cpf}
              </p>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-3 mt-4">
          <div className="flex-1 rounded-lg bg-surface-lowest border border-outline-variant/40 p-2.5 text-center">
            <p className="text-[16px] font-bold text-primary">{consultationCount}</p>
            <p className="text-[9px] font-medium uppercase tracking-wider text-on-surface-muted mt-0.5">
              {consultationCount === 1 ? "consulta" : "consultas"}
            </p>
          </div>
          <div className="flex-1 rounded-lg bg-surface-lowest border border-outline-variant/40 p-2.5 text-center">
            <p className="text-[16px] font-bold text-primary">{problems.length}</p>
            <p className="text-[9px] font-medium uppercase tracking-wider text-on-surface-muted mt-0.5">
              {problems.length === 1 ? "problema" : "problemas"}
            </p>
          </div>
          <div className="flex-1 rounded-lg bg-surface-lowest border border-outline-variant/40 p-2.5 text-center">
            <p className="text-[16px] font-bold text-primary">{medications.length}</p>
            <p className="text-[9px] font-medium uppercase tracking-wider text-on-surface-muted mt-0.5">
              meds
            </p>
          </div>
        </div>

        <button
          onClick={onChangePatient}
          className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 border border-outline-variant/50 text-[11px] font-medium text-on-surface-variant rounded-lg hover:bg-surface-container hover:text-on-surface transition-all cursor-pointer"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          Trocar paciente
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {/* Última PA */}
        {lastPa && (
          <section>
            <h3 className="text-[9px] font-bold uppercase tracking-widest text-on-surface-muted mb-2">
              Última Pressão
            </h3>
            <div className="flex items-center gap-3 bg-surface-lowest p-3 rounded-xl border border-outline-variant/40 shadow-sm">
              <div className={`w-1 h-8 rounded-full shrink-0 ${
                Number(lastPa.split("/")[0]) >= 140 ? "bg-status-crit" :
                Number(lastPa.split("/")[0]) >= 130 ? "bg-status-warn" :
                "bg-status-ok"
              }`} />
              <div>
                <p className="text-[14px] font-bold text-on-surface">{lastPa} mmHg</p>
                {lastPaDate && (
                  <p className="text-[9px] text-on-surface-muted">{lastPaDate}</p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Problemas Ativos */}
        <section>
          <h3 className="text-[9px] font-bold uppercase tracking-widest text-on-surface-muted mb-2">
            Problemas Ativos
          </h3>
          {problems.length === 0 ? (
            <p className="text-[11px] text-on-surface-muted italic">Nenhum problema registrado</p>
          ) : (
            <div className="space-y-1">
              {problems.slice(0, 8).map((p) => (
                <div
                  key={p}
                  className="flex items-center gap-2 text-[11px] font-medium text-on-surface p-2 bg-surface-lowest border border-outline-variant/40 rounded-lg"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                  <span className="truncate">{p}</span>
                </div>
              ))}
              {problems.length > 8 && (
                <p className="text-[10px] text-on-surface-muted px-1">
                  +{problems.length - 8} mais
                </p>
              )}
            </div>
          )}
        </section>

        {/* Farmacoterapia */}
        <section>
          <h3 className="text-[9px] font-bold uppercase tracking-widest text-on-surface-muted mb-2">
            Farmacoterapia Atual
          </h3>
          {medications.length === 0 ? (
            <p className="text-[11px] text-on-surface-muted italic">Nenhuma medicação registrada</p>
          ) : (
            <div className="space-y-1.5">
              {medications.slice(0, 6).map((m) => (
                <div
                  key={m.id}
                  className="text-[11px] leading-tight text-on-surface bg-surface-lowest p-2.5 rounded-lg border border-outline-variant/40 shadow-sm"
                >
                  <p className="font-semibold truncate">{m.medication_name}</p>
                  {m.dosage && (
                    <p className="text-[9px] text-on-surface-muted mt-0.5">{m.dosage}</p>
                  )}
                </div>
              ))}
              {medications.length > 6 && (
                <p className="text-[10px] text-on-surface-muted px-1">
                  +{medications.length - 6} mais
                </p>
              )}
            </div>
          )}
        </section>
      </div>

      {/* CTA */}
      <div className="px-4 py-4 border-t border-outline-variant/50">
        <button
          onClick={onNewConsultation}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-on-primary text-[12px] font-bold rounded-xl hover:bg-primary-container transition-colors shadow-sm"
        >
          <FilePlus className="w-4 h-4" />
          Nova Consulta
        </button>
      </div>
    </div>
  );
}
