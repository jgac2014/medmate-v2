"use client";

import { useConsultationTimer } from "@/hooks/useConsultationTimer";

interface ConsultationTimerProps {
  userId: string | null;
}

function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function ConsultationTimer({ userId }: ConsultationTimerProps) {
  const { elapsed, isRunning, isPaused, pause, resume } = useConsultationTimer(userId);

  if (isPaused && elapsed === 0) return null;

  return (
    <div className="flex items-center gap-1.5">
      {/* Dot indicador */}
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isRunning ? "bg-secondary" : "bg-outline"
        }`}
      />
      {/* Tempo */}
      <span className="font-mono text-[13px] text-secondary tabular-nums">
        {formatElapsed(elapsed)}
      </span>
      {/* Pause/Resume — só se já começou */}
      {elapsed > 0 && (
        <button
          onClick={isRunning ? pause : resume}
          className="flex items-center justify-center w-5 h-5 rounded text-on-surface-muted hover:text-on-surface transition-colors cursor-pointer"
          title={isRunning ? "Pausar cronômetro" : "Retomar cronômetro"}
        >
          {isRunning ? (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1"/>
              <rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5.14v14l11-7-11-7z"/>
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
