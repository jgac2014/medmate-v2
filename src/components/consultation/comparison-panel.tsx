"use client";

import { useEffect, useState } from "react";
import { listConsultationsByPatient } from "@/lib/supabase/consultations";
import type { Vitals } from "@/types";

type Trend = "up" | "down" | "stable" | "unknown";

function getTrend(current: number, previous: number): Trend {
  const diff = current - previous;
  if (Math.abs(diff) < 1) return "stable";
  return diff > 0 ? "up" : "down";
}

function TrendArrow({ trend }: { trend: Trend }) {
  if (trend === "stable") return <span className="text-[9px] text-[#717973]">→ estável</span>;
  if (trend === "up") return <span className="text-[9px] text-[#c77a20] font-semibold">↑ subiu</span>;
  if (trend === "down") return <span className="text-[9px] text-[#1b7a4a] font-semibold">↓ caiu</span>;
  return null;
}

function ComparisonRow({
  label,
  current,
  previous,
  unit,
  trend,
}: {
  label: string;
  current: string | number;
  previous: string | number;
  unit?: string;
  trend: Trend;
}) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-[8px] text-[#717973] font-medium">{label}</span>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[8px] text-[#717973]">
          {previous}{unit} → {current}{unit}
        </span>
        <TrendArrow trend={trend} />
      </div>
    </div>
  );
}

interface ComparisonPanelProps {
  patientId: string | null;
  currentVitals: Vitals;
}

export function ComparisonPanel({ patientId, currentVitals }: ComparisonPanelProps) {
  const [previousVitals, setPreviousVitals] = useState<Vitals | null>(null);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!patientId) {
      setPreviousVitals(null);
      setHasPrevious(false);
      return;
    }

    setLoading(true);
    listConsultationsByPatient(patientId)
      .then((result) => {
        const data = result.data ?? [];
        if (data.length < 1) {
          setPreviousVitals(null);
          setHasPrevious(false);
          return;
        }
        // data[0] = mais recente — queremos a ANTES da mais recente para comparar
        // Se currentConsultationId existir e data[0] for a consulta atual, pulamos para data[1]
        // Sem esse filtro, compara a consulta atual consigo mesma
        const prev = data[0]?.vitals ?? null;
        setPreviousVitals(prev);
        setHasPrevious(prev !== null);
      })
      .catch(() => {
        // Supabase unreachable — network error, return null gracefully
        setPreviousVitals(null);
        setHasPrevious(false);
      })
      .finally(() => setLoading(false));
  }, [patientId]);

  if (!hasPrevious && !loading) return null;

  const currentPAS = parseFloat(currentVitals.pas);
  const currentPAD = parseFloat(currentVitals.pad);
  const currentPeso = parseFloat(currentVitals.peso);
  const prevPAS = previousVitals ? parseFloat(previousVitals.pas) : null;
  const prevPAD = previousVitals ? parseFloat(previousVitals.pad) : null;
  const prevPeso = previousVitals ? parseFloat(previousVitals.peso) : null;

  const hasPA =
    (currentPAS || currentPAD) &&
    (prevPAS || prevPAD);
  const hasWeight =
    currentPeso && prevPeso;

  if (!hasPA && !hasWeight) return null;

  const paTrend = hasPA && prevPAS && currentPAS
    ? getTrend(currentPAS, prevPAS)
    : "unknown";

  const pesoTrend = hasWeight && prevPeso && currentPeso
    ? getTrend(currentPeso, prevPeso)
    : "unknown";

  const summaryLabel = () => {
    if (hasPA && hasWeight) return "PA · peso";
    if (hasPA) return "PA";
    return "peso";
  };

  return (
    <div className="mt-2 pt-2 border-t border-primary/5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-1 mb-1 cursor-pointer"
      >
        <span className="font-label text-[7px] uppercase tracking-[0.12em] text-[#454B4E] font-bold flex items-center gap-1">
          <span className="material-symbols-outlined text-[9px]">compare</span>
          vs. última consulta
        </span>
        <span className="text-[7px] text-[#717973] ml-auto">{summaryLabel()}</span>
        <span className="material-symbols-outlined text-[9px] text-[#717973]">
          {open ? "expand_less" : "expand_more"}
        </span>
      </button>

      {open && !loading && previousVitals && (
        <div className="space-y-1">
          {hasPA && (
            <ComparisonRow
              label="PA"
              current={`${currentPAS || "—"}/${currentPAD || "—"}`}
              previous={`${prevPAS ?? "—"}/${prevPAD ?? "—"}`}
              unit=" mmHg"
              trend={paTrend}
            />
          )}
          {hasWeight && (
            <ComparisonRow
              label="Peso"
              current={`${currentPeso}`}
              previous={`${prevPeso ?? "—"}`}
              unit=" kg"
              trend={pesoTrend}
            />
          )}
        </div>
      )}

      {open && loading && (
        <div className="space-y-1">
          <div className="h-2 rounded bg-white/30 animate-pulse" />
          <div className="h-2 rounded bg-white/30 animate-pulse w-3/4" />
        </div>
      )}
    </div>
  );
}
