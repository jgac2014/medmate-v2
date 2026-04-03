"use client";

import { useConsultationStore } from "@/stores/consultation-store";

interface CheckItem {
  label: string;
  done: boolean;
}

export function DocumentationChecklist() {
  const soap = useConsultationStore((s) => s.soap);
  const vitals = useConsultationStore((s) => s.vitals);
  const problems = useConsultationStore((s) => s.problems);
  const followupItems = useConsultationStore((s) => s.followupItems);

  const items: CheckItem[] = [
    {
      label: "SOAP preenchido",
      done: !!(soap.subjective?.trim() && soap.assessment?.trim() && soap.plan?.trim()),
    },
    {
      label: "Sinais vitais registrados",
      done: !!(vitals.pas && vitals.pad),
    },
    {
      label: "Problema / CID identificado",
      done: problems.length > 0,
    },
    {
      label: "Plano de retorno definido",
      done: (followupItems ?? []).length > 0,
    },
  ];

  const doneCount = items.filter((i) => i.done).length;
  const pct = Math.round((doneCount / items.length) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold text-[var(--on-surface-muted)] uppercase tracking-wide">
          Documentação
        </span>
        <span className="text-[11px] font-bold text-[var(--accent)]">{pct}%</span>
      </div>
      <div className="w-full bg-[var(--outline-variant)] h-1 rounded-full overflow-hidden">
        <div
          className="bg-[var(--accent)] h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="space-y-1.5 pt-1">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              className={`text-[14px] ${
                item.done ? "text-[var(--status-ok)]" : "text-[var(--outline-variant)]"
              }`}
            >
              {item.done ? "✓" : "○"}
            </span>
            <span
              className={`text-[11px] ${
                item.done
                  ? "text-[var(--on-surface)] font-medium"
                  : "text-[var(--on-surface-muted)]"
              }`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
