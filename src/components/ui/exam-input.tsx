"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import type { StatusLevel } from "@/types";

interface ExamInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  unit?: string;
  status?: StatusLevel;
  auto?: boolean;
}

const statusStyles: Record<StatusLevel, string> = {
  none: "",
  ok: "!border-status-ok !text-status-ok !bg-status-ok-bg",
  warn: "!border-status-warn !text-status-warn !bg-status-warn-bg",
  crit: "!border-status-crit !text-status-crit !bg-status-crit-bg",
};

export const ExamInput = forwardRef<HTMLInputElement, ExamInputProps>(
  ({ label, unit, status = "none", auto = false, className = "", ...props }, ref) => {
    void unit;

    return (
      <div className="flex items-center gap-[3px] mb-1">
        <span className="text-[10px] text-on-surface-variant flex-1 whitespace-nowrap">
          {label}
        </span>
        <input
          ref={ref}
          className={`w-[58px] h-[22px] px-1 border border-outline-variant/40 rounded-[3px] bg-surface-container text-on-surface font-mono text-[10px] text-right transition-[border,color,background] duration-150 focus:outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(1,45,29,0.08)] tabular-nums ${
            auto
              ? "bg-status-calc-bg text-status-calc cursor-default border-[rgba(0,131,143,0.25)] font-semibold"
              : ""
          } ${statusStyles[status]} ${className}`}
          readOnly={auto}
          {...props}
        />
      </div>
    );
  }
);
ExamInput.displayName = "ExamInput";
