"use client";

import { useState } from "react";
import { useConsultationStore } from "@/stores/consultation-store";
import { IVCF20, PHQ9, GAD7, AUDIT_C, MINI_COG, EDMONTON, computeScore } from "@/lib/triagens/scales";
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

/** Badge de categoria visual — diferencia núcleo SUS de complementar */
function CategoryBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded border bg-[var(--primary)] text-[var(--on-primary)] border-[var(--primary)]/40 shrink-0">
      {label}
    </span>
  );
}

function ComplementaryBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-medium px-1.5 py-0.5 rounded border border-[var(--outline-variant)] text-[var(--on-surface-muted)] bg-[var(--surface-container)] shrink-0">
      Complementar
    </span>
  );
}

interface ScaleCardProps {
  scale: ScaleDef;
  gender: string;
  badge?: React.ReactNode;
}

function ScaleCard({ scale, gender, badge }: ScaleCardProps) {
  const saved = useConsultationStore((s) => s.triagens[scale.id]);
  const setTriagemResult = useConsultationStore((s) => s.setTriagemResult);
  const clearTriagemResult = useConsultationStore((s) => s.clearTriagemResult);

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
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-[12px] text-[var(--on-surface)] tracking-wide">
              {scale.name}
            </span>
            {badge}
            {scale.requiresInPerson && (
              <span className="inline-flex items-center gap-1 text-[9px] font-medium px-1.5 py-0.5 rounded border border-[var(--outline-variant)] text-[var(--on-surface-muted)] bg-[var(--surface-container)] shrink-0">
                <svg className="w-2.5 h-2.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M8 1L10 6h5l-4 3 1.5 5L8 11l-4.5 3L5 9 1 6h5z" strokeLinejoin="round" />
                </svg>
                Presencial
              </span>
            )}
            {scale.genderAware && (
              <span className="inline-flex items-center gap-1 text-[9px] font-medium px-1.5 py-0.5 rounded border border-[var(--outline-variant)] text-[var(--on-surface-muted)] bg-[var(--surface-container)] shrink-0">
                Limiar depende do sexo
              </span>
            )}
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
  const ageStr = useConsultationStore((s) => s.patient.age);
  const gender = useConsultationStore((s) => s.patient.gender);
  const appliedCount = useConsultationStore((s) => Object.keys(s.triagens).length);

  // Calcular idade numérica
  const age = (() => {
    const match = ageStr?.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  })();

  const isElderly = age !== null && age >= 60;

  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[13px] font-semibold text-[var(--on-surface)]">Triagens Clínicas</h3>
          <p className="text-[11px] text-[var(--on-surface-muted)] mt-0.5">
            Escalas padronizadas — aplicar conforme indicação clínica e idade
          </p>
        </div>
        {appliedCount > 0 && (
          <span className="text-[10px] font-medium text-[var(--primary)] bg-[var(--primary)]/8 px-2 py-0.5 rounded-full border border-[var(--primary)]/20">
            {appliedCount} aplicada{appliedCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* ── NÚCLEO PRINCIPAL SUS ──────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0" />
          <p className="text-[10px] font-semibold text-[var(--primary)] uppercase tracking-wide">
            Núcleo principal SUS
          </p>
          <span className="text-[9px] text-[var(--on-surface-muted)]">
            — инструментов oficiales MS para APS
          </span>
        </div>
        <div className="space-y-2">
          {/* IVCF-20 — só mostra para idosos */}
          {isElderly && (
            <ScaleCard
              scale={IVCF20}
              gender={gender}
              badge={<CategoryBadge label="Núcleo SUS" />}
            />
          )}
          {!isElderly && (
            <div className="rounded-xl border border-dashed border-[var(--outline-variant)] bg-[var(--surface-low)] px-4 py-3 flex items-start gap-2.5">
              <span className="w-4 h-4 shrink-0 flex items-center justify-center mt-0.5">
                <svg className="w-3.5 h-3.5 text-[var(--on-surface-muted)]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M8 1L10 6h5l-4 3 1.5 5L8 11l-4.5 3L5 9 1 6h5z" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <p className="text-[12px] text-[var(--on-surface)] font-medium">{IVCF20.name}</p>
                <p className="text-[11px] text-[var(--on-surface-muted)]">{IVCF20.description}</p>
                <p className="text-[10px] text-[var(--on-surface-muted)] mt-1 italic">
                  Indicado para pacientes ≥ 60 anos — ferramenta oficial MS para avaliação multidimensional na APS
                </p>
              </div>
            </div>
          )}

          {/* PHQ-9 */}
          <ScaleCard
            scale={PHQ9}
            gender={gender}
            badge={<CategoryBadge label="Núcleo SUS" />}
          />
        </div>
      </div>

      {/* ── TRIAGENS COMPLEMENTARES ÚTEIS ──────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--on-surface-muted)] shrink-0" />
          <p className="text-[10px] font-semibold text-[var(--on-surface-muted)] uppercase tracking-wide">
            Triagens complementares úteis
          </p>
          <span className="text-[9px] text-[var(--on-surface-muted)]">
            — aplicar conforme suspeita clínica
          </span>
        </div>
        <div className="space-y-2">
          <ScaleCard
            scale={GAD7}
            gender={gender}
            badge={<ComplementaryBadge />}
          />
          <ScaleCard
            scale={AUDIT_C}
            gender={gender}
            badge={<ComplementaryBadge />}
          />
        </div>
      </div>

      {/* ── TRIAGENS COMPLEMENTARES GERIÁTRICAS PRESENCIAIS ──────────────────── */}
      {isElderly && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--on-surface-muted)] shrink-0" />
            <p className="text-[10px] font-semibold text-[var(--on-surface-muted)] uppercase tracking-wide">
              Avaliação geriátrica complementar presencial
            </p>
            <span className="text-[9px] text-[var(--on-surface-muted)]">
              — úteis quando IVCF-20 indica vulnerabilidade ou suspeita de declínio
            </span>
          </div>
          <div className="space-y-2">
            <ScaleCard
              scale={MINI_COG}
              gender={gender}
              badge={<ComplementaryBadge />}
            />
            <ScaleCard
              scale={EDMONTON}
              gender={gender}
              badge={<ComplementaryBadge />}
            />
          </div>
        </div>
      )}

      {/* Nota para pacientes < 60: Mini-Cog e Edmonton */}
      {!isElderly && (
        <p className="text-[10px] text-[var(--on-surface-muted)] italic px-1">
          Mini-Cog e Edmonton Frailty Scale: indicados para pacientes ≥ 60 anos
          com suspeita de declínio cognitivo ou fragilidade — aplicar presencialmente
        </p>
      )}
    </div>
  );
}
