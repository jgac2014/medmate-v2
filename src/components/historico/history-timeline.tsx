"use client";

import type { Patient } from "@/types";
import type { ConsultationItem } from "./historico-shell";
import { formatDateBR } from "@/lib/utils";
import { Search, FilePlus, RotateCcw, Stethoscope, Pill, ClipboardList, Activity, AlertCircle, Copy } from "lucide-react";
import { useState } from "react";

interface HistoryTimelineProps {
  consultations: ConsultationItem[];
  loading: boolean;
  selectedPatient: Patient | null;
  onNewConsultation: () => void;
  onChangePatient: () => void;
  onUseAsBase?: (consultation: ConsultationItem) => void;
}

export function HistoryTimeline({
  consultations,
  loading,
  selectedPatient,
  onNewConsultation,
  onChangePatient,
  onUseAsBase,
}: HistoryTimelineProps) {
  const [eventSearch, setEventSearch] = useState("");

  if (!selectedPatient) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <div className="w-16 h-16 rounded-3xl bg-surface-container flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-on-surface-muted">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        <div>
          <p className="text-[15px] font-semibold text-on-surface-variant">Busque um paciente</p>
          <p className="text-[12px] text-on-surface-muted mt-1 leading-relaxed max-w-sm">
            Selecione um paciente na busca acima para visualizar seu histórico clínico longitudinal.
          </p>
        </div>
        <button
          onClick={onChangePatient}
          className="mt-2 flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary text-[11px] font-bold rounded-xl hover:bg-primary-container transition-all shadow-sm"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          Buscar paciente
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3">
        <span className="material-symbols-outlined text-[20px] text-secondary animate-spin">
          progress_activity
        </span>
        <p className="text-[13px] text-on-surface-muted">Carregando histórico...</p>
      </div>
    );
  }

  const filtered = consultations.filter((c) => {
    if (!eventSearch.trim()) return true;
    const q = eventSearch.toLowerCase();
    const problems = [
      ...(c.problems ?? []),
      ...(c.problems_other ? c.problems_other.split(",").map((s) => s.trim()).filter(Boolean) : []),
    ];
    return (
      problems.some((p) => p.toLowerCase().includes(q)) ||
      (c.assessment ?? "").toLowerCase().includes(q) ||
      (c.plan ?? "").toLowerCase().includes(q) ||
      (c.subjective ?? "").toLowerCase().includes(q) ||
      (c.prescription ?? "").toLowerCase().includes(q) ||
      formatDateBR(c.date).toLowerCase().includes(q)
    );
  });

  return (
    <>
      {/* Filtro de busca */}
      {consultations.length > 0 && (
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-muted w-4 h-4 pointer-events-none" />
          <input
            type="text"
            value={eventSearch}
            onChange={(e) => setEventSearch(e.target.value)}
            placeholder="Buscar por diagnóstico, conduta, problema..."
            className="w-full bg-surface-lowest border border-outline-variant/50 pl-10 pr-4 py-2.5 rounded-xl text-[13px] text-on-surface placeholder:text-on-surface-muted/60 focus:ring-1 focus:ring-secondary/30 focus:border-secondary outline-none shadow-sm transition-all"
          />
          {eventSearch && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-on-surface-muted">
              {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}

      {/* Empty state: sem consultas */}
      {consultations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-surface-container flex items-center justify-center">
            <ClipboardList className="w-7 h-7 text-on-surface-muted" />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-on-surface-variant">
              Nenhuma consulta registrada
            </p>
            <p className="text-[12px] text-on-surface-muted mt-1 leading-relaxed max-w-sm">
              Este paciente ainda não tem consultas registradas no sistema.
            </p>
          </div>
          <button
            onClick={onNewConsultation}
            className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary text-[11px] font-bold rounded-xl hover:bg-primary-container transition-all shadow-sm"
          >
            <FilePlus className="w-4 h-4" />
            Registrar primeira consulta
          </button>
        </div>
      )}

      {/* Empty state: busca sem resultados */}
      {consultations.length > 0 && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <AlertCircle className="w-8 h-8 text-on-surface-muted/50" />
          <p className="text-[13px] text-on-surface-muted">
            Nenhum evento encontrado para &quot;{eventSearch}&quot;
          </p>
          <button
            onClick={() => setEventSearch("")}
            className="text-[11px] text-secondary font-medium hover:underline"
          >
            Limpar busca
          </button>
        </div>
      )}

      {/* Timeline */}
      {filtered.length > 0 && (
        <div className="relative pl-10">
          <div className="absolute left-[1.1rem] top-0 bottom-0 w-px bg-outline-variant/40" />

          {filtered.map((consult, idx) => {
            const isLatest = idx === 0;
            const problems = [
              ...(consult.problems ?? []),
              ...(consult.problems_other
                ? consult.problems_other.split(",").map((s) => s.trim()).filter(Boolean)
                : []),
            ];
            const pa =
              consult.vitals?.pas && consult.vitals?.pad
                ? `${consult.vitals.pas}/${consult.vitals.pad}`
                : null;
            const peso = consult.vitals?.peso || null;
            const imc = consult.vitals?.imc || null;
            const pendingFollowups = (consult.followup_items ?? []).filter((fi) => !fi.completed);

            return (
              <div key={consult.id} className="relative mb-6 group">
                {/* Timeline dot */}
                <div
                  className={`absolute -left-[3.1rem] top-2.5 w-4 h-4 rounded-full border-4 border-surface z-10 transition-transform group-hover:scale-125 ${
                    isLatest ? "bg-primary shadow-sm" : "bg-secondary"
                  }`}
                />

                {/* Date */}
                <div className="absolute -left-[5.2rem] top-2.5 text-[10px] font-bold text-on-surface-muted text-right leading-none w-14 uppercase tracking-tight">
                  {formatDateBR(consult.date)}
                </div>

                {/* Card */}
                <div
                  className={`rounded-2xl border transition-all hover:shadow-md ${
                    isLatest
                      ? "bg-surface-lowest border-primary/30 shadow-sm ring-1 ring-primary/10"
                      : "bg-surface-lowest border-outline-variant/50 shadow-sm"
                  }`}
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between gap-3 p-4 pb-3">
                    <div className="min-w-0 flex-1">
                      {/* Labels */}
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        {isLatest && (
                          <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[9px] font-bold text-primary uppercase tracking-wider">
                            Mais Recente
                          </span>
                        )}
                        {problems.slice(0, 2).map((p) => (
                          <span
                            key={p}
                            className="rounded-full bg-secondary-container/50 border border-secondary/20 px-2 py-0.5 text-[9px] font-semibold text-secondary"
                          >
                            {p}
                          </span>
                        ))}
                        {problems.length > 2 && (
                          <span className="text-[9px] text-on-surface-muted">
                            +{problems.length - 2} mais
                          </span>
                        )}
                      </div>

                      {/* Metadata row */}
                      <div className="flex items-center gap-4 text-[11px] text-on-surface-muted flex-wrap">
                        <span className="font-semibold">{formatDateBR(consult.date)}</span>
                        {pa && (
                          <span className={`font-bold ${
                            Number(pa.split("/")[0]) >= 140 ? "text-status-crit" :
                            Number(pa.split("/")[0]) >= 130 ? "text-status-warn" :
                            "text-on-surface"
                          }`}>
                            PA {pa}
                          </span>
                        )}
                        {peso && (
                          <span>Peso {peso} kg</span>
                        )}
                        {imc && (
                          <span>IMC {imc}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* SOAP sections */}
                  <div className="px-4 pb-4 grid grid-cols-2 gap-3">
                    {/* Subjetivo */}
                    {consult.subjective && (
                      <div className="bg-surface-container/60 rounded-xl p-3">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-muted mb-1">
                          Subjetivo
                        </p>
                        <p className="text-[11px] text-on-surface leading-snug line-clamp-2">
                          {consult.subjective}
                        </p>
                      </div>
                    )}

                    {/* Avaliação */}
                    {consult.assessment && (
                      <div className="bg-surface-container/60 rounded-xl p-3">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-muted mb-1">
                          Avaliação
                        </p>
                        <p className="text-[11px] text-on-surface leading-snug line-clamp-2">
                          {consult.assessment}
                        </p>
                      </div>
                    )}

                    {/* Plano */}
                    {consult.plan && (
                      <div className="bg-surface-container/60 rounded-xl p-3">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-muted mb-1">
                          Plano
                        </p>
                        <p className="text-[11px] text-on-surface leading-snug line-clamp-2">
                          {consult.plan}
                        </p>
                      </div>
                    )}

                    {/* Prescrição */}
                    {consult.prescription && (
                      <div className="bg-surface-container/60 rounded-xl p-3">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-secondary mb-1">
                          Prescrição
                        </p>
                        <p className="text-[11px] text-on-surface leading-snug line-clamp-2">
                          {consult.prescription}
                        </p>
                      </div>
                    )}

                    {/* Pendências */}
                    {pendingFollowups.length > 0 && (
                      <div className="col-span-2 bg-status-warn-bg rounded-xl p-3 border border-status-warn/20">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-status-warn mb-1.5 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-status-warn" />
                          Pendências no retorno ({pendingFollowups.length})
                        </p>
                        <div className="space-y-1">
                          {pendingFollowups.slice(0, 3).map((fi) => (
                            <p key={fi.id} className="text-[11px] text-on-surface leading-snug">
                              • {fi.text}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card footer */}
                  <div className="flex gap-2 px-4 pb-4">
                    <button
                      onClick={onNewConsultation}
                      className={`flex items-center justify-center gap-2 py-2 text-[11px] font-bold rounded-xl transition-colors shadow-sm ${
                        isLatest
                          ? "flex-[1.5] bg-primary text-on-primary hover:bg-primary-container"
                          : "flex-1 border border-outline-variant text-on-surface-variant hover:bg-surface-container"
                      }`}
                    >
                      <RotateCcw className="w-4 h-4" />
                      {isLatest ? "Novo Retorno" : "Ver consulta"}
                    </button>
                    {onUseAsBase && (
                      <button
                        onClick={() => onUseAsBase(consult)}
                        className="flex items-center justify-center gap-1.5 flex-1 py-2 border border-secondary/30 text-secondary text-[11px] font-medium rounded-xl hover:bg-secondary-container/20 transition-colors"
                        title="Usar esta consulta como base para uma nova"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Usar como base
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
