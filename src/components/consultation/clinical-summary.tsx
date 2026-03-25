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
      <div className="text-[9px] font-semibold tracking-[0.08em] uppercase text-text-tertiary mb-[5px]">
        {label}
      </div>
      <div className="flex flex-wrap gap-[3px]">{children}</div>
    </div>
  );
}

export function ClinicalSummary() {
  const { patient, vitals, problems, preventions, labs, calculations } = useConsultationStore();

  // Collect altered exams
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

  return (
    <div className="mb-3.5">
      <SectionHeader label="Resumo Clínico" color="purple" />

      {patient.name && (
        <TagGroup label="Paciente">
          <Tag variant="info">{patient.name}</Tag>
          {patient.age && <Tag variant="info">{patient.age} anos</Tag>}
          {patient.gender && <Tag variant="info">{patient.gender === "Masculino" ? "Masc." : patient.gender === "Feminino" ? "Fem." : "Outro"}</Tag>}
          {patient.race && <Tag variant="info">{patient.race}</Tag>}
        </TagGroup>
      )}

      {(vitals.pas || vitals.peso) && (
        <TagGroup label="Vitais">
          {vitals.pas && vitals.pad && <Tag variant="info">PA {vitals.pas}/{vitals.pad}</Tag>}
          {vitals.fc && <Tag variant="info">FC {vitals.fc}</Tag>}
          {vitals.spo2 && <Tag variant="info">SpO₂ {vitals.spo2}%</Tag>}
          {vitals.temp && <Tag variant="info">T {vitals.temp}°C</Tag>}
          {calculations.imc && (
            <Tag variant={calculations.imc.value >= 30 ? "warn" : calculations.imc.value >= 25 ? "warn" : "ok"}>
              IMC {calculations.imc.value} — {calculations.imc.classification}
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
            <Tag key={e.label} variant={e.status === "crit" ? "crit" : "warn"}>
              {e.label}: {e.value}
            </Tag>
          ))}
        </TagGroup>
      )}

      {(calculations.tfg || calculations.fib4 || calculations.rcv) && (
        <TagGroup label="Cálculos">
          {calculations.tfg && <Tag variant="calc">TFG {calculations.tfg.value} — {calculations.tfg.stage}</Tag>}
          {calculations.fib4 && <Tag variant="calc">FIB-4 {calculations.fib4.value} — {calculations.fib4.risk}</Tag>}
          {calculations.rcv && (
            <Tag variant={calculations.rcv.value >= 20 ? "crit" : calculations.rcv.value >= 10 ? "warn" : "ok"}>
              RCV {calculations.rcv.value}% — {calculations.rcv.risk}
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
