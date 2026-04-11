"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import type { StatusLevel } from "@/types";

interface ExamFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  unit?: string;
  status?: StatusLevel;
}

const statusRing: Record<StatusLevel, string> = {
  none: "border-[var(--outline-variant)]/40 focus:border-[var(--primary)]",
  ok:   "border-[var(--status-ok)]/50 text-[var(--status-ok)]",
  warn: "border-[var(--status-warn)]/50 text-[var(--status-warn)]",
  crit: "border-[var(--status-crit)]/50 text-[var(--status-crit)]",
};

/**
 * Campo de input compacto para exames laboratoriais manuais.
 * Status ok/warn/crit reflete via cor de borda e texto do valor.
 */
export const ExamField = forwardRef<HTMLInputElement, ExamFieldProps>(
  ({ label, unit, status = "none", className = "", ...props }, ref) => (
    <div className="flex items-center gap-1.5 py-[3px]">
      <span className="text-[10.5px] text-[var(--on-surface-variant)] flex-1 leading-tight">
        {label}
        {unit && (
          <span className="text-[9.5px] text-[var(--on-surface-muted)] ml-0.5">
            ({unit})
          </span>
        )}
      </span>
      <input
        ref={ref}
        className={`w-[60px] h-[22px] px-1.5 border rounded-[4px] bg-[var(--surface-container)] text-[var(--on-surface)] font-mono text-[10.5px] text-right transition-[border-color,color,box-shadow] duration-100 focus:outline-none focus:shadow-[0_0_0_2px_rgba(1,45,29,0.08)] tabular-nums ${statusRing[status]} ${className}`}
        {...props}
      />
    </div>
  )
);
ExamField.displayName = "ExamField";
