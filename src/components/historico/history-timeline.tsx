"use client";

import type { Patient } from "@/types";
import type { ConsultationItem } from "./historico-shell";
import { formatDateBR } from "@/lib/utils";
import { Search, FilePlus, RotateCcw, ClipboardList } from "lucide-react";
import { useState } from "react";

interface HistoryTimelineProps {
  consultations: ConsultationItem[];
  loading: boolean;
  selectedPatient: Patient | null;
  onNewConsultation: () => void;
}

export function HistoryTimeline({
  consultations,
  loading,
  selectedPatient,
  onNewConsultation,
}: HistoryTimelineProps) {
  const [eventSearch, setEventSearch] = useState("");

  if (!selectedPatient) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center">
          <Search className="w-6 h-6 text-on-surface-muted" />
        </div>
        <p className="text-[15px] font-semibold text-on-surface-variant">Busque um paciente</p>
        <p className="text-[13px] text-on-surface-muted leading-relaxed max-w-xs">
          Use a busca acima para selecionar um paciente e visualizar o histórico longitudinal.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-[13px] text-on-surface-muted">Carregando histórico...</p>
      </div>
    );
  }

  const filtered = consultations.filter((c) => {
    const matchesSearch =
      !eventSearch.trim() ||
      (c.assessment ?? "").toLowerCase().includes(eventSearch.toLowerCase()) ||
      (c.problems ?? []).some((p) => p.toLowerCase().includes(eventSearch.toLowerCase())) ||
      (c.prescription ?? "").toLowerCase().includes(eventSearch.toLowerCase());
    return matchesSearch;
  });

  return (
    <>
      {/* Filtros */}
      <div className="flex items-center gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-muted w-4 h-4" />
          <input
            type="text"
            value={eventSearch}
            onChange={(e) => setEventSearch(e.target.value)}
            placeholder="Buscar diagnóstico, conduta ou exame..."
            className="w-full bg-surface-lowest border border-outline-variant pl-10 pr-4 py-2.5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-muted focus:ring-1 focus:ring-primary/20 focus:border-primary outline-none shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-on-surface-muted" />
          </div>
          <p className="text-[13px] font-medium text-on-surface-variant">
            {eventSearch ? "Nenhum evento encontrado" : "Nenhuma consulta registrada"}
          </p>
          {!eventSearch && (
            <button
              onClick={onNewConsultation}
              className="mt-2 flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-primary-container transition-all shadow-sm cursor-pointer"
            >
              <FilePlus className="w-4 h-4" />
              Iniciar primeira consulta
            </button>
          )}
        </div>
      )}

      {/* Timeline */}
      {filtered.length > 0 && (
        <div className="relative pl-12">
          <div className="absolute left-[1.125rem] top-0 bottom-0 w-px bg-outline-variant" />

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
            const pendingFollowups = (consult.followup_items ?? []).filter((fi) => !fi.completed);

            return (
              <div key={consult.id} className="relative mb-8 group">
                {/* Timeline dot */}
                <div
                  className={`absolute -left-[3.15rem] top-2 w-5 h-5 rounded-full border-4 border-surface z-10 transition-transform group-hover:scale-110 ${
                    isLatest ? "bg-primary" : "bg-secondary"
                  }`}
                />

                {/* Date label */}
                <div className="absolute -left-[5.5rem] top-2 text-[10px] font-bold text-on-surface-muted text-right leading-none w-14 uppercase tracking-tighter">
                  {formatDateBR(consult.date)}
                  <br />
                  <span className="font-normal opacity-60">
                    {consult.date.slice(0, 4)}
                  </span>
                </div>

                {/* Event card */}
                {isLatest ? (
                  // Latest consultation - full detail card
                  <div className="bg-surface-lowest border-l-4 border-primary rounded-2xl p-6 shadow-sm ring-1 ring-outline-variant/50 transition-shadow hover:shadow-md">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="px-2 py-0.5 bg-primary text-on-primary text-[9px] font-bold rounded-full uppercase tracking-wider">
                            Mais Recente
                          </span>
                          {problems.length > 0 && (
                            <span className="text-[13px] font-bold text-primary">
                              {problems.slice(0, 2).join(" · ")}
                              {problems.length > 2 && ` +${problems.length - 2}`}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-[12px] text-on-surface-variant flex-wrap">
                          <span className="font-medium">{formatDateBR(consult.date)}</span>
                          {pa && <span className="font-bold">PA: {pa} mmHg</span>}
                          <div className="flex gap-1.5">
                            {consult.assessment && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-surface-container text-[10px] font-bold text-on-surface-variant rounded border border-outline-variant">
                                SOAP
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Assessment */}
                    {consult.assessment && (
                      <div className="grid grid-cols-2 gap-4 mb-5">
                        <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/50">
                          <p className="text-[9px] font-bold text-on-surface-muted uppercase tracking-widest mb-2">
                            Avaliação / Conduta
                          </p>
                          <p className="text-[13px] font-semibold text-on-surface leading-snug line-clamp-3">
                            {consult.assessment}
                          </p>
                        </div>
                        {pendingFollowups.length > 0 && (
                          <div className="bg-surface-container p-4 rounded-xl border border-secondary/20">
                            <p className="text-[9px] font-bold text-secondary uppercase tracking-widest mb-2">
                              Pendências no Retorno
                            </p>
                            <ul className="space-y-1">
                              {pendingFollowups.slice(0, 3).map((fi) => (
                                <li key={fi.id} className="text-[12px] text-on-surface">
                                  • {fi.text}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={onNewConsultation}
                        className="flex-[1.5] py-3 bg-primary text-on-primary text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Nova Consulta — Retorno
                      </button>
                      <button
                        disabled
                        className="flex-1 py-3 border border-outline-variant bg-surface-lowest text-primary text-[11px] font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
                      >
                        <ClipboardList className="w-4 h-4" />
                        Ver SOAP
                      </button>
                    </div>
                  </div>
                ) : (
                  // Older consultations - compact card
                  <div className="bg-surface-lowest border border-outline-variant rounded-2xl p-4 flex items-center justify-between hover:border-secondary/40 transition-colors shadow-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-secondary border border-outline-variant/50 shrink-0">
                        <ClipboardList className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-on-surface text-[13px] truncate">
                          {problems.length > 0
                            ? problems.slice(0, 2).join(" · ")
                            : "Consulta de rotina"}
                        </h3>
                        <p className="text-[10px] text-on-surface-muted uppercase font-semibold tracking-widest mt-0.5 flex items-center gap-2">
                          {formatDateBR(consult.date)}
                          {pa && <span className="text-on-surface-variant">PA: {pa}</span>}
                        </p>
                      </div>
                    </div>
                    {consult.assessment && (
                      <div className="text-right shrink-0 ml-4 max-w-[160px]">
                        <p className="text-[10px] text-on-surface-muted line-clamp-2">
                          {consult.assessment}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
