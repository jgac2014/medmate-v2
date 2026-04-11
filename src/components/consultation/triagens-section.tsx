"use client";

import { useState } from "react";
import { useConsultationStore } from "@/stores/consultation-store";
import { ALL_SCALES, computeScore } from "@/lib/triagens/scales";
import type { ScaleDef, InterpretLevel } from "@/lib/triagens/types";

function levelClass(level: InterpretLevel) {
  if (level === "ok") return "text-[var(--status-ok)] bg-[var(--status-ok)]/8 border-[var(--status-ok)]/20";
  if (level === "warn") return "text-[var(--status-warn)] bg-[var(--status-warn)]/8 border-[var(--status-warn)]/20";
  return "text-[var(--status-crit)] bg-[var(--status-crit)]/8 border-[var(--status-crit)]/20";
}

function levelDot(level: InterpretLevel) {
  if (level === "ok") return "bg-[var(--status-ok)]";
  if (level === "warn") return "bg-[var(--status-warn)]";
  return "bg-[var(--status-crit)]";
}

interface ScaleCardProps {
  scale: ScaleDef;
  gender: string;
}

function ScaleCard({ scale, gender }: ScaleCardProps) {
  const { triagens, setTriagemResult, clearTriagemResult } = useConsultationStore(
    (s) => ({ triagens: s.triagens, setTriagemResult: s.setTriagemResult, clearTriagemResult: s.clearTriagemResult })
  );
  const saved = triagens[scale.id];

  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>(saved?.answers ?? {});

  const answered = scale.questions.filter((q) => answers[q.id] !== undefined).length;
  const total = scale.questions.length;
  const allAnswered = answered === total;
  const score = computeScore(answers);
  const interp = allAnswered ? scale.interpret(score, gender) : null;

  function handleSave() {
    if (!allAnswered) return;
    const result = scale.interpret(score, gender);
    setTriagemResult({
      scaleId: scale.id,
      answers,
      score,
      interpretation: result.label,
      level: result.level,
      appliedAt: new Date().toISOString(),
    });
    setOpen(false);
  }

  function handleClear() {
    clearTriagemResult(scale.id);
    setAnswers({});
    setOpen(false);
  }

  function handleOpen() {
    if (saved) setAnswers(saved.answers);
    setOpen(true);
  }

  return (
    <div className="rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-lowest)] overflow-hidden">
      {/* Cabeçalho do card */}
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-[12px] text-[var(--on-surface)] tracking-wide">
              {scale.name}
            </span>
            {saved && (
              <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded border ${levelClass(saved.level)}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${levelDot(saved.level)}`} />
                {saved.score}/{scale.maxScore} · {saved.interpretation}
              </span>
            )}
          </div>
          <p className="text-[11px] text-[var(--on-surface-muted)] mt-0.5">{scale.description}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {saved && !open && (
            <button
              onClick={handleClear}
              className="text-[10px] text-[var(--on-surface-muted)] hover:text-[var(--error)] px-2 py-1 rounded transition-colors"
            >
              Limpar
            </button>
          )}
          <button
            onClick={open ? () => setOpen(false) : handleOpen}
            className="text-[11px] font-medium text-[var(--primary)] hover:text-[var(--secondary)] px-2.5 py-1 rounded-lg border border-[var(--primary)]/20 hover:bg-[var(--primary)]/5 transition-colors"
          >
            {open ? "Fechar" : saved ? "Editar" : "Aplicar"}
          </button>
        </div>
      </div>

      {/* Formulário expandido */}
      {open && (
        <div className="border-t border-[var(--outline-variant)] px-4 py-4 space-y-4 bg-[var(--surface-low)]">
          {scale.timeFrame && (
            <p className="text-[11px] text-[var(--on-surface-variant)] italic">{scale.timeFrame}</p>
          )}

          <div className="space-y-3">
            {scale.questions.map((q) => (
              <div key={q.id}>
                <p className="text-[12px] text-[var(--on-surface)] mb-1.5 leading-snug">{q.text}</p>
                <div className="flex flex-wrap gap-1.5">
                  {q.options.map((opt) => {
                    const selected = answers[q.id] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.value }))}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
                          selected
                            ? "bg-[var(--primary)] text-[var(--on-primary)] border-[var(--primary)]"
                            : "bg-[var(--surface-lowest)] text-[var(--on-surface-variant)] border-[var(--outline-variant)] hover:border-[var(--primary)]/40"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Score em tempo real */}
          {answered > 0 && (
            <div className="pt-2 border-t border-[var(--outline-variant)] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-[var(--on-surface-muted)]">
                  {answered}/{total} respondidas
                </span>
                {allAnswered && interp && (
                  <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded border ${levelClass(interp.level)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${levelDot(interp.level)}`} />
                    {score}/{scale.maxScore} · {interp.label}
                  </span>
                )}
              </div>
              <button
                onClick={handleSave}
                disabled={!allAnswered}
                className={`text-[11px] font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  allAnswered
                    ? "bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[var(--primary-container)]"
                    : "bg-[var(--surface-high)] text-[var(--on-surface-muted)] cursor-not-allowed"
                }`}
              >
                Salvar resultado
              </button>
            </div>
          )}

          {/* Nota de interpretação */}
          {allAnswered && interp?.note && (
            <p className="text-[11px] text-[var(--on-surface-variant)] italic bg-[var(--surface-container)] px-3 py-2 rounded-lg">
              {interp.note}
            </p>
          )}

          <p className="text-[10px] text-[var(--on-surface-muted)]">
            Fonte: {scale.source}
          </p>
        </div>
      )}
    </div>
  );
}

export function TriagensSection() {
  const { triagens, patient } = useConsultationStore(
    (s) => ({ triagens: s.triagens, patient: s.patient })
  );

  const applied = ALL_SCALES.filter((s) => triagens[s.id]);

  return (
    <div className="space-y-3">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[13px] font-semibold text-[var(--on-surface)]">Triagens Clínicas</h3>
          <p className="text-[11px] text-[var(--on-surface-muted)] mt-0.5">
            Escalas padronizadas — aplicar conforme indicação clínica
          </p>
        </div>
        {applied.length > 0 && (
          <span className="text-[10px] font-medium text-[var(--primary)] bg-[var(--primary)]/8 px-2 py-0.5 rounded-full border border-[var(--primary)]/20">
            {applied.length} aplicada{applied.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Cards das escalas */}
      <div className="space-y-2">
        {ALL_SCALES.map((scale) => (
          <ScaleCard key={scale.id} scale={scale} gender={patient.gender} />
        ))}
      </div>
    </div>
  );
}
