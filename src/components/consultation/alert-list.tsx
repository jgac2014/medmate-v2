"use client";

import { AlertTriangle, X } from "lucide-react";
import type { Alert } from "@/types";

interface AlertListProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
}

export function AlertList({ alerts, onDismiss }: AlertListProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-start gap-2 rounded-lg px-3 py-2 text-[11px] leading-snug ${
            alert.severity === "warning"
              ? "bg-warning/10 text-warning border border-warning/20"
              : "bg-error/10 text-error border border-error/20"
          }`}
        >
          <AlertTriangle size={12} className="shrink-0 mt-0.5" />
          <span className="flex-1">{alert.message}</span>
          <button
            onClick={() => onDismiss(alert.id)}
            className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Dispensar alerta"
          >
            <X size={11} />
          </button>
        </div>
      ))}
    </div>
  );
}
