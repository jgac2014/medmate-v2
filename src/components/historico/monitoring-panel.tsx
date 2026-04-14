"use client";

import type { Patient } from "@/types";
import type { ConsultationItem } from "./historico-shell";
import { TrendingUp, TrendingDown, Minus, CheckSquare, Zap, FilePlus, AlertTriangle, CheckCircle } from "lucide-react";
import { formatDateBR } from "@/lib/utils";

interface MonitoringPanelProps {
  consultations: ConsultationItem[];
  problems: string[];
  selectedPatient: Patient | null;
  onNewConsultation: () => void;
}

type ClinicalStatus = "ok" | "warn" | "crit" | "unknown";

function statusConfig(status: ClinicalStatus) {
  switch (status) {
    case "ok":
      return { color: "text-status-ok", bg: "bg-status-ok", bar: "bg-status-ok", icon: CheckCircle, label: "Normal" };
    case "warn":
      return { color: "text-status-warn", bg: "bg-status-warn", bar: "bg-status-warn", icon: AlertTriangle, label: "Atenção" };
    case "crit":
      return { color: "text-status-crit", bg: "bg-status-crit", bar: "bg-status-crit", icon: AlertTriangle, label: "Crítico" };
    default:
      return { color: "text-secondary", bg: "bg-secondary", bar: "bg-surface-dim", icon: Minus, label: "" };
  }
}

function LabCard({
  label,
  value,
  unit,
  date,
  status,
}: {
  label: string;
  value: string | null;
  unit: string;
  date: string | null;
  status: ClinicalStatus;
}) {
  if (!value) return null;
  const cfg = statusConfig(status);
  const Icon = cfg.icon;

  return (
    <div className="flex items-center justify-between p-3 bg-surface-container/40 rounded-xl border border-outline-variant/40">
      <div className="flex items-center gap-3">
        <div className={`w-1 h-7 rounded-full shrink-0 ${cfg.bar}`} />
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-on-surface">{label}</span>
            {status !== "unknown" && (
              <span className={`flex items-center gap-0.5 text-[9px] font-bold ${cfg.color}`}>
                <Icon className="w-3 h-3" />
                {cfg.label}
              </span>
            )}
          </div>
          <p className="text-[9px] text-on-surface-muted">{date ? `em ${date}` : ""}</p>
        </div>
      </div>
      <span className={`text-[13px] font-bold ${status !== "unknown" ? cfg.color : "text-on-surface"}`}>
        {value} <span className="text-[9px] font-normal text-on-surface-muted">{unit}</span>
      </span>
    </div>
  );
}

function PaTrend({ consultations }: { consultations: ConsultationItem[] }) {
  const withPa = consultations.filter(
    (c) => c.vitals?.pas && !isNaN(Number(c.vitals.pas))
  );
  if (withPa.length === 0) {
    return (
      <div className="flex items-center gap-3 p-4 bg-surface-container/40 rounded-xl border border-outline-variant/40">
        <div className="w-1.5 h-10 bg-surface-dim rounded-full shrink-0" />
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-muted">PA</p>
          <p className="text-[11px] text-on-surface-muted">Sem dados registrados</p>
        </div>
      </div>
    );
  }

  const latest = withPa[0];
  const latestVal = Number(latest.vitals!.pas);
  const prevVal = withPa.length > 1 ? Number(withPa[1].vitals!.pas) : null;
  const diff = prevVal !== null ? latestVal - prevVal : null;
  const trend =
    diff !== null
      ? diff > 5
        ? "up"
        : diff < -5
        ? "down"
        : "stable"
      : "single";
  const isCrit = latestVal >= 180;
  const isWarn = latestVal >= 140 && !isCrit;
  const status: ClinicalStatus = isCrit ? "crit" : isWarn ? "warn" : "ok";
  const cfg = statusConfig(status);

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-status-crit" : trend === "down" ? "text-status-ok" : "text-secondary";

  return (
    <div className="flex items-center justify-between p-4 bg-surface-container/40 rounded-xl border border-outline-variant/40">
      <div className="flex items-center gap-3">
        <div className={`w-1.5 h-10 rounded-full shrink-0 ${cfg.bar}`} />
        <div>
          <div className="flex items-center gap-1.5">
            <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-muted">PA</p>
            <span className={`flex items-center gap-0.5 text-[9px] font-bold ${cfg.color}`}>
              <cfg.icon className="w-3 h-3" />
              {cfg.label}
            </span>
          </div>
          <p className="text-[15px] font-bold text-on-surface">
            {latest.vitals!.pas}/{latest.vitals!.pad}{" "}
            <span className="text-[10px] font-normal text-on-surface-muted">mmHg</span>
          </p>
          <div className="flex items-center gap-2">
            {diff !== null && (
              <p className={`text-[10px] font-semibold ${trendColor}`}>
                {trend === "up" ? `+${diff}` : trend === "down" ? `${diff}` : "Estável"}
              </p>
            )}
            <p className="text-[9px] text-on-surface-muted">{formatDateBR(latest.date)}</p>
          </div>
        </div>
      </div>
      <TrendIcon className={`w-5 h-5 shrink-0 ${trendColor}`} />
    </div>
  );
}

function ImcTrend({ consultations }: { consultations: ConsultationItem[] }) {
  const withImc = consultations.filter(
    (c) => c.vitals?.imc && !isNaN(Number(c.vitals.imc))
  );
  if (withImc.length === 0) return null;

  const latest = withImc[0];
  const val = Number(latest.vitals!.imc!);
  const status: ClinicalStatus = val >= 30 ? "crit" : val >= 25 ? "warn" : "ok";
  const cfg = statusConfig(status);

  return (
    <div className="flex items-center justify-between p-4 bg-surface-container/40 rounded-xl border border-outline-variant/40">
      <div className="flex items-center gap-3">
        <div className={`w-1.5 h-10 rounded-full shrink-0 ${cfg.bar}`} />
        <div>
          <div className="flex items-center gap-1.5">
            <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-muted">IMC</p>
            <span className={`flex items-center gap-0.5 text-[9px] font-bold ${cfg.color}`}>
              <cfg.icon className="w-3 h-3" />
              {cfg.label}
            </span>
          </div>
          <p className="text-[15px] font-bold text-on-surface">
            {val.toFixed(1)}{" "}
            <span className="text-[10px] font-normal text-on-surface-muted">kg/m²</span>
          </p>
          <p className="text-[9px] text-on-surface-muted">{formatDateBR(latest.date)}</p>
        </div>
      </div>
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
      <div className="flex flex-col items-center justify-center h-full px-5 py-12 text-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center">
          <Zap className="w-6 h-6 text-on-surface-muted" />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-on-surface-variant">Painel de Acompanhamento</p>
          <p className="text-[11px] text-on-surface-muted mt-1 leading-relaxed">
            Selecione um paciente para visualizar tendências clínicas e pendências.
          </p>
        </div>
      </div>
    );
  }

  // Derive latest labs with dates
  const labConsults = consultations.filter((c) => c.labs && Object.keys(c.labs).some((k) => c.labs![k]));
  const latestLabs = labConsults[0]?.labs ?? {};
  const latestLabsDate = labConsults[0]?.date ? formatDateBR(labConsults[0].date) : null;

  const hba1c = latestLabs["hba1c"] || latestLabs["HbA1c"] || null;
  const ldl = latestLabs["ldl"] || latestLabs["LDL"] || null;
  const creat = latestLabs["creatinina"] || latestLabs["creat"] || null;

  // Latest followups
  const latestFollowups = (consultations[0]?.followup_items ?? []).filter((fi) => !fi.completed);

  // Days since last visit
  const lastDate = consultations[0]?.date;
  const daysSinceLastVisit = lastDate
    ? Math.floor((new Date().getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const hasLabs = [hba1c, ldl, creat].some(Boolean);

  return (
    <div className="px-5 py-5 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-secondary" />
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-primary">
          Acompanhamento Clínico
        </h2>
      </div>

      {/* Sinais Vitais */}
      <section>
        <h3 className="text-[9px] font-bold uppercase tracking-widest text-on-surface-muted mb-3">
          Sinais Vitais
        </h3>
        <div className="space-y-2">
          <PaTrend consultations={consultations} />
          <ImcTrend consultations={consultations} />
        </div>
      </section>

      {/* Labs */}
      {hasLabs && (
        <section>
          <h3 className="text-[9px] font-bold uppercase tracking-widest text-on-surface-muted mb-3">
            Últimos Exames
          </h3>
          <div className="space-y-1.5">
            <LabCard
              label="HbA1c"
              value={hba1c}
              unit="%"
              date={latestLabsDate}
              status={hba1c ? (Number(hba1c) >= 7 ? "crit" : Number(hba1c) >= 6.5 ? "warn" : "ok") : "unknown"}
            />
            <LabCard
              label="LDL-c"
              value={ldl}
              unit="mg/dL"
              date={latestLabsDate}
              status={ldl ? (Number(ldl) >= 160 ? "crit" : Number(ldl) >= 130 ? "warn" : "ok") : "unknown"}
            />
            <LabCard
              label="Creatinina"
              value={creat}
              unit="mg/dL"
              date={latestLabsDate}
              status={creat ? (Number(creat) > 1.2 ? "warn" : "ok") : "unknown"}
            />
          </div>
        </section>
      )}

      {/* Alerta: afastamento */}
      {daysSinceLastVisit !== null && daysSinceLastVisit > 180 && (
        <div className="bg-status-warn-bg border border-status-warn/20 p-3.5 rounded-xl">
          <p className="text-[10px] font-bold text-status-warn uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Sem consulta recente
          </p>
          <p className="text-[12px] text-on-surface leading-snug">
            Última consulta há{" "}
            <strong>{Math.round(daysSinceLastVisit / 30)} meses</strong>.
            Considere acionar o ACS ou agendar retorno.
          </p>
        </div>
      )}

      {/* Pendências */}
      {latestFollowups.length > 0 && (
        <section>
          <h3 className="text-[9px] font-bold uppercase tracking-widest text-on-surface-muted mb-3 flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5" />
            Pendências em Aberto
          </h3>
          <div className="space-y-2">
            {latestFollowups.map((fi) => (
              <div
                key={fi.id}
                className="flex gap-3 items-start p-3 bg-surface-container/40 rounded-xl border border-outline-variant/40"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-status-warn mt-1.5 shrink-0" />
                <p className="text-[11px] text-on-surface leading-snug">{fi.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Condições em acompanhamento */}
      {problems.length > 0 && (
        <section>
          <h3 className="text-[9px] font-bold uppercase tracking-widest text-on-surface-muted mb-3">
            Condições em Acompanhamento
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

      {/* Empty state */}
      {consultations.length === 0 && (
        <div className="py-4">
          <p className="text-[11px] text-on-surface-muted italic text-center">
            Nenhum dado clínico registrado ainda.
          </p>
        </div>
      )}

      {/* CTA */}
      <div className="mt-auto pt-2 space-y-2">
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
