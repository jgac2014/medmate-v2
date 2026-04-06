"use client";

import type { Patient } from "@/types";
import type { ConsultationItem } from "./historico-shell";
import { TrendingUp, Minus, CheckSquare, Zap, FilePlus } from "lucide-react";

interface MonitoringPanelProps {
  consultations: ConsultationItem[];
  problems: string[];
  selectedPatient: Patient | null;
  onNewConsultation: () => void;
}

function PaTrend({ consultations }: { consultations: ConsultationItem[] }) {
  const withPa = consultations.filter(
    (c) => c.vitals?.pas && !isNaN(Number(c.vitals.pas))
  );
  if (withPa.length < 2) {
    return withPa.length === 1 ? (
      <div className="flex items-center justify-between p-3.5 bg-surface-container rounded-2xl border border-outline-variant">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-10 bg-secondary rounded-full" />
          <div className="leading-tight">
            <p className="text-[10px] font-bold text-on-surface-muted uppercase tracking-tight">Média PA</p>
            <p className="text-[15px] font-bold text-on-surface">
              {withPa[0].vitals!.pas}/{withPa[0].vitals!.pad}{" "}
              <span className="text-[10px] text-on-surface-muted font-normal">mmHg</span>
            </p>
          </div>
        </div>
      </div>
    ) : null;
  }

  const latest = Number(withPa[0].vitals!.pas);
  const prev = Number(withPa[1].vitals!.pas);
  const diff = latest - prev;
  const isUp = diff > 5;
  const isDown = diff < -5;

  return (
    <div className="flex items-center justify-between p-3.5 bg-surface-container rounded-2xl border border-outline-variant">
      <div className="flex items-center gap-3">
        <div className={`w-1.5 h-10 rounded-full ${isUp ? "bg-status-crit" : isDown ? "bg-status-ok" : "bg-secondary"}`} />
        <div className="leading-tight">
          <p className="text-[10px] font-bold text-on-surface-muted uppercase tracking-tight">Última PA</p>
          <p className="text-[15px] font-bold text-on-surface">
            {withPa[0].vitals!.pas}/{withPa[0].vitals!.pad}{" "}
            <span className={`text-[10px] font-bold ${isUp ? "text-status-crit" : isDown ? "text-status-ok" : "text-secondary"}`}>
              {isUp ? `+${diff}` : isDown ? `${diff}` : "Estável"}
            </span>
          </p>
        </div>
      </div>
      {isUp ? (
        <TrendingUp className="w-5 h-5 text-status-crit" />
      ) : isDown ? (
        <TrendingUp className="w-5 h-5 text-status-ok rotate-180" />
      ) : (
        <Minus className="w-5 h-5 text-secondary" />
      )}
    </div>
  );
}

export function MonitoringPanel({
  consultations,
  problems,
  selectedPatient,
  onNewConsultation,
}: MonitoringPanelProps) {
  if (!selectedPatient) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-5 text-center gap-3">
        <p className="text-[12px] text-on-surface-muted leading-relaxed">
          Selecione um paciente para visualizar tendências e pendências clínicas.
        </p>
      </div>
    );
  }

  // Derive latest labs for trends
  const labConsults = consultations.filter((c) => c.labs && Object.keys(c.labs).some((k) => c.labs![k]));
  const latestLabs = labConsults[0]?.labs ?? {};
  const hba1c = latestLabs["hba1c"] || latestLabs["HbA1c"] || null;
  const ldl = latestLabs["ldl"] || latestLabs["LDL"] || null;

  // Pending follow-up items from the most recent consultation
  const latestFollowups = (consultations[0]?.followup_items ?? []).filter((fi) => !fi.completed);

  // Last consultation date for "no recent visit" warning
  const lastDate = consultations[0]?.date;
  const daysSinceLastVisit = lastDate
    ? Math.floor((new Date().getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="px-5 py-6 flex flex-col gap-8">
      <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2">
        <Zap className="w-4 h-4 text-secondary" />
        Painel de Acompanhamento
      </h2>

      {/* Tendências Clínicas */}
      <section>
        <h3 className="text-[9px] font-bold uppercase tracking-widest text-on-surface-muted mb-3 px-0.5">
          Tendências Clínicas
        </h3>
        <div className="space-y-2.5">
          <PaTrend consultations={consultations} />

          {hba1c && (
            <div className="flex items-center justify-between p-3.5 bg-surface-container rounded-2xl border border-outline-variant">
              <div className="flex items-center gap-3">
                <div className={`w-1.5 h-10 rounded-full ${Number(hba1c) >= 7 ? "bg-status-crit" : "bg-status-ok"}`} />
                <div className="leading-tight">
                  <p className="text-[10px] font-bold text-on-surface-muted uppercase tracking-tight">HbA1c</p>
                  <p className="text-[15px] font-bold text-on-surface">
                    {hba1c}%{" "}
                    <span className={`text-[10px] font-bold ${Number(hba1c) >= 7 ? "text-status-crit" : "text-status-ok"}`}>
                      {Number(hba1c) >= 7 ? "Acima da meta" : "Na meta"}
                    </span>
                  </p>
                </div>
              </div>
              {Number(hba1c) >= 7 ? (
                <TrendingUp className="w-5 h-5 text-status-crit" />
              ) : (
                <Minus className="w-5 h-5 text-status-ok" />
              )}
            </div>
          )}

          {ldl && (
            <div className="flex items-center justify-between p-3.5 bg-surface-container rounded-2xl border border-outline-variant">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-10 bg-secondary rounded-full" />
                <div className="leading-tight">
                  <p className="text-[10px] font-bold text-on-surface-muted uppercase tracking-tight">LDL-c</p>
                  <p className="text-[15px] font-bold text-on-surface">
                    {ldl}{" "}
                    <span className="text-[10px] text-secondary font-medium">mg/dL</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {consultations.length === 0 && (
            <p className="text-[11px] text-on-surface-muted px-1">
              Nenhum dado disponível ainda.
            </p>
          )}
        </div>
      </section>

      {/* Alerta de afastamento */}
      {daysSinceLastVisit !== null && daysSinceLastVisit > 180 && (
        <div className="bg-status-warn-bg border border-status-warn/20 p-3.5 rounded-2xl">
          <p className="text-[10px] font-bold text-status-warn uppercase tracking-widest mb-1">
            Sem consulta recente
          </p>
          <p className="text-[12px] text-on-surface leading-snug">
            Última consulta há <strong>{Math.round(daysSinceLastVisit / 30)} meses</strong>.
            Considere agendar retorno.
          </p>
        </div>
      )}

      {/* Pendências do último retorno */}
      {latestFollowups.length > 0 && (
        <section>
          <h3 className="text-[9px] font-bold uppercase tracking-widest text-on-surface-muted mb-3 flex items-center gap-2 px-0.5">
            <CheckSquare className="w-3.5 h-3.5" />
            Pendências da Última Visita
          </h3>
          <div className="space-y-2">
            {latestFollowups.map((fi) => (
              <div
                key={fi.id}
                className="flex gap-3 items-start p-3 bg-status-warn-bg rounded-xl border border-status-warn/20 shadow-sm"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-status-warn mt-1.5 shrink-0" />
                <p className="text-[11px] font-semibold text-on-surface leading-snug">{fi.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Problemas crônicos ativos */}
      {problems.length > 0 && (
        <section>
          <h3 className="text-[9px] font-bold uppercase tracking-widest text-on-surface-muted mb-3 px-0.5">
            Condições em acompanhamento
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {problems.map((p) => (
              <span
                key={p}
                className="px-2.5 py-1 bg-primary/8 text-primary text-[10px] font-semibold rounded-full border border-primary/15"
              >
                {p}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* CTA nova consulta */}
      <div className="mt-auto space-y-2.5">
        <button
          onClick={onNewConsultation}
          className="w-full py-3 bg-primary text-on-primary text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          <FilePlus className="w-4 h-4" />
          Nova Consulta
        </button>
      </div>
    </div>
  );
}
