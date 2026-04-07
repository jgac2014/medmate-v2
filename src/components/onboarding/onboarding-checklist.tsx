"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useOnboarding } from "@/hooks/useOnboarding";
import { createClient } from "@/lib/supabase/client";
import { BRAND } from "@/lib/branding";

const STEPS = [
  {
    key: "patientCreated" as const,
    num: "1",
    title: "Cadastre seu primeiro paciente",
    desc: "Vá para Pacientes e crie o prontuário longitudinal.",
    href: "/pacientes",
    cta: "Ir para Pacientes",
  },
  {
    key: "consultationStarted" as const,
    num: "2",
    title: "Inicie uma consulta",
    desc: "Selecione o paciente e abra o workspace clínico.",
    href: "/consulta",
    cta: "Abrir Consulta",
  },
  {
    key: "summaryCopied" as const,
    num: "3",
    title: "Copie o resumo para o eSUS PEC",
    desc: "Clique em 'Copiar' no painel direito para gerar o texto formatado.",
    href: null,
    cta: null,
  },
];

export function OnboardingChecklist() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => {
        setUserId(user?.id ?? null);
      });
  }, []);

  const { state, visible, allDone, dismiss } = useOnboarding(userId);

  // Auto-dismiss 3 s after all steps complete
  useEffect(() => {
    if (!allDone) return;
    const timer = setTimeout(() => dismiss(), 3000);
    return () => clearTimeout(timer);
  }, [allDone, dismiss]);

  if (!visible) return null;

  const completedCount = STEPS.filter((s) => state[s.key]).length;

  if (allDone) {
    return (
      <div className="mx-6 mt-5 rounded-2xl border border-primary/20 bg-primary/[0.04] p-5 flex items-center gap-4">
        <span className="material-symbols-outlined text-2xl text-primary">task_alt</span>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-primary">
            Tudo pronto! Você já domina o fluxo do {BRAND.name}.
          </p>
          <p className="text-[12px] text-on-surface-muted mt-0.5">
            Este painel vai desaparecer em alguns instantes.
          </p>
        </div>
        <button
          onClick={dismiss}
          className="text-[11px] font-medium text-on-surface-muted hover:text-primary transition-colors shrink-0"
          aria-label="Fechar"
        >
          Fechar
        </button>
      </div>
    );
  }

  return (
    <div className="mx-6 mt-5 rounded-2xl border border-primary/15 bg-primary/[0.03] p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="font-headline text-[17px] font-semibold text-primary">
            Primeiros passos
          </h2>
          <p className="text-[13px] text-on-surface-muted mt-0.5">
            {completedCount} de {STEPS.length} concluídos
          </p>
        </div>
        <button
          onClick={dismiss}
          className="text-[11px] font-medium text-on-surface-muted hover:text-primary transition-colors shrink-0 mt-0.5"
          aria-label="Dispensar onboarding"
        >
          Dispensar
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 rounded-full bg-outline-variant/30 mb-5 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${(completedCount / STEPS.length) * 100}%` }}
        />
      </div>

      <div className="space-y-3">
        {STEPS.map((step) => {
          const done = state[step.key];
          return (
            <div
              key={step.key}
              className={`flex items-start gap-4 rounded-xl border p-4 transition-all ${
                done
                  ? "border-primary/10 bg-primary/5 opacity-70"
                  : "border-outline-variant/30 bg-surface-lowest"
              }`}
            >
              {/* Check circle */}
              <div
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-bold transition-all ${
                  done
                    ? "border-primary bg-primary text-on-primary"
                    : "border-outline-variant text-on-surface-muted"
                }`}
              >
                {done ? (
                  <span className="material-symbols-outlined text-[14px]">check</span>
                ) : (
                  step.num
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className={`text-[14px] font-semibold ${
                    done ? "line-through text-on-surface-muted" : "text-primary"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-[12px] text-on-surface-muted mt-0.5 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {!done && step.href && (
                <Link
                  href={step.href}
                  className="shrink-0 px-3 py-1.5 bg-primary text-on-primary text-[12px] font-semibold rounded-lg hover:bg-primary/90 transition-all active:scale-95"
                >
                  {step.cta}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
