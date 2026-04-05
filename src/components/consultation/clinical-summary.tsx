"use client";

import { useConsultationStore } from "@/stores/consultation-store";
import { SectionHeader } from "@/components/ui/section-header";
import { Tag } from "@/components/ui/tag";
import { getStatus } from "@/lib/reference-values";
import { EXAM_CARDS } from "@/lib/constants";
import type { StatusLevel } from "@/types";

function TagGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-2.5">
      <div className="text-[9px] font-semibold tracking-[0.08em] uppercase text-[var(--on-surface-muted)] mb-[5px]">
        {label}
      </div>
      <div className="flex flex-wrap gap-[3px]">{children}</div>
    </div>
  );
}

export function ClinicalSummary() {
  const { patient, vitals, problems, preventions, labs, calculations } = useConsultationStore();

  const alteredExams: { label: string; value: string; status: StatusLevel }[] = [];
  for (const card of EXAM_CARDS) {
    for (const field of card.fields) {
      if ("auto" in field && field.auto) continue;
      const val = labs[field.key];
      if (!val) continue;
      const num = parseFloat(val);
      if (isNaN(num)) continue;
      const status = getStatus(field.key, num, patient.gender);
      if (status === "warn" || status === "crit") {
        alteredExams.push({ label: field.label, value: val, status });
      }
    }
  }

  const hasSummaryContent =
    Boolean(patient.name) ||
    Boolean(vitals.pas || vitals.peso || vitals.fc || vitals.spo2 || vitals.temp) ||
    problems.length > 0 ||
    alteredExams.length > 0 ||
    Boolean(calculations.tfg || calculations.fib4 || calculations.rcv || calculations.imc) ||
    preventions.length > 0;

  return (
    <div className="mb-3.5">
      <SectionHeader label="Resumo Clínico" color="purple" />

      {!hasSummaryContent && (
        <div className="rounded-xl border border-dashed border-[var(--outline)] bg-[var(--surface-container)] px-3.5 py-3 mb-3">
          <p className="text-[12px] font-medium text-[var(--on-surface)] mb-1">
            O resumo clínico aparece conforme a consulta ganha contexto.
          </p>
          <p className="text-[11px] leading-relaxed text-[var(--on-surface-variant)]">
            Preencha identificação, vitais, problemas ou exames para visualizar os principais sinais desta consulta em um bloco só.
          </p>
        </div>
      )}

      {patient.name && (
        <TagGroup label="Paciente">
          <Tag variant="info">{patient.name}</Tag>
          {patient.age && <Tag variant="info">{patient.age} anos</Tag>}
          {patient.gender && (
            <Tag variant="info">
              {patient.gender === "Masculino" ? "Masc." : patient.gender === "Feminino" ? "Fem." : "Outro"}
            </Tag>
          )}
          {patient.race && <Tag variant="info">{patient.race}</Tag>}
        </TagGroup>
      )}

      {(vitals.pas || vitals.peso || vitals.fc || vitals.spo2 || vitals.temp || calculations.imc) && (
        <TagGroup label="Vitais">
          {vitals.pas && vitals.pad && <Tag variant="info">PA {vitals.pas}/{vitals.pad}</Tag>}
          {vitals.fc && <Tag variant="info">FC {vitals.fc}</Tag>}
          {vitals.spo2 && <Tag variant="info">SpO2 {vitals.spo2}%</Tag>}
          {vitals.temp && <Tag variant="info">T {vitals.temp}°C</Tag>}
          {calculations.imc && (
            <Tag variant={calculations.imc.value >= 25 ? "warn" : "ok"}>
              IMC {calculations.imc.value} - {calculations.imc.classification}
            </Tag>
          )}
        </TagGroup>
      )}

      {problems.length > 0 && (
        <TagGroup label="Problemas Ativos">
          {problems.map((p) => (
            <Tag key={p} variant="crit">{p}</Tag>
          ))}
        </TagGroup>
      )}

      {alteredExams.length > 0 && (
        <TagGroup label="Exames Alterados">
          {alteredExams.map((e) => (
            <Tag key={`${e.label}-${e.value}`} variant={e.status === "crit" ? "crit" : "warn"}>
              {e.label}: {e.value}
            </Tag>
          ))}
        </TagGroup>
      )}

      {(calculations.tfg || calculations.fib4 || calculations.rcv) && (
        <TagGroup label="Cálculos">
          {calculations.tfg && <Tag variant="calc">TFG {calculations.tfg.value} - {calculations.tfg.stage}</Tag>}
          {calculations.fib4 && <Tag variant="calc">FIB-4 {calculations.fib4.value} - {calculations.fib4.risk}</Tag>}
          {calculations.rcv && (
            <Tag variant={calculations.rcv.value >= 20 ? "crit" : calculations.rcv.value >= 10 ? "warn" : "ok"}>
              RCV {calculations.rcv.value}% - {calculations.rcv.risk}
            </Tag>
          )}
        </TagGroup>
      )}

      {preventions.length > 0 && (
        <TagGroup label="Prevenções em dia">
          {preventions.map((p) => (
            <Tag key={p} variant="ok">{p}</Tag>
          ))}
        </TagGroup>
      )}
    </div>
  );
}
