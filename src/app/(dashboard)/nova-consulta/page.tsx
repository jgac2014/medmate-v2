"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PatientSelector } from "@/components/consultation/patient-selector";
import { showToast } from "@/components/ui/toast";
import { prepareConsultationForPatient } from "@/lib/consultation/patient-context";
import { trackEvent } from "@/lib/analytics";
import { createClient } from "@/lib/supabase/client";
import { useConsultationStore } from "@/stores/consultation-store";
import type { Patient } from "@/types";

const QUICK_SUGGESTIONS = [
  "Dor abdominal",
  "Cefaleia",
  "Renovação de receita",
  "Febre e tosse",
];

const INFO_CARDS = [
  {
    icon: "history",
    title: "Histórico Integrado",
    description: "Cruzamento imediato com prontuários anteriores e alergias registradas.",
  },
  {
    icon: "lab_research",
    title: "Apoio à Decisão",
    description: "Sugestões de exames baseadas em protocolos clínicos atualizados.",
  },
  {
    icon: "edit_document",
    title: "Evolução Inteligente",
    description: "Documentação estruturada gerada a partir da conversa com o paciente.",
  },
];

export default function NovaConsultaPage() {
  const [queixa, setQueixa] = useState("");
  const [patientSelectorOpen, setPatientSelectorOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const { reset } = useConsultationStore();

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => {
        if (user) setUserId(user.id);
      });
  }, []);

  function handleGerar() {
    if (!queixa.trim()) return;
    setPatientSelectorOpen(true);
  }

  async function handlePatientSelected(patient: Patient) {
    reset();
    await prepareConsultationForPatient({
      userId,
      patient,
      subjective: queixa.trim(),
    });

    trackEvent("consultation_started");
    setPatientSelectorOpen(false);
    showToast(`Nova consulta — ${patient.name}`, "info");
    router.push("/consulta");
  }

  return (
    <>
      <PatientSelector
        open={patientSelectorOpen}
        onSelect={handlePatientSelected}
        onClose={() => setPatientSelectorOpen(false)}
      />

      <main className="relative flex min-h-[calc(100vh-56px)] flex-col items-center justify-center overflow-hidden bg-surface px-6">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div
            className="absolute right-[-5%] top-[-10%] h-[40vw] w-[40vw] rounded-full bg-secondary-container opacity-50 blur-[120px]"
            style={{ transition: "opacity 0.6s ease" }}
          />
          <div
            className="absolute bottom-[-10%] left-[-5%] h-[30vw] w-[30vw] rounded-full opacity-40 blur-[100px]"
            style={{ background: "var(--primary-container)" }}
          />
        </div>

        <div
          className="z-10 w-full max-w-3xl space-y-10 text-center"
          style={{ transition: "opacity 0.5s ease, transform 0.5s ease" }}
        >
          <div className="space-y-3">
            <h1 className="font-headline text-5xl font-medium leading-tight tracking-tight text-primary md:text-6xl">
              Digite a queixa.
              <br />
              <span className="italic text-secondary">O resto a gente organiza.</span>
            </h1>
            <p className="mx-auto max-w-xl text-lg leading-relaxed text-on-surface-variant">
              Descreva a queixa em linguagem livre. A IA organiza a consulta e gera o
              prontuário.
            </p>
          </div>

          <div className="rounded-xl border border-outline-variant/40 bg-surface-lowest p-3 shadow-sm transition-all duration-300 focus-within:border-secondary/30 focus-within:shadow-md md:p-4">
            <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
              <div className="relative flex-grow">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[22px] text-outline">
                  clinical_notes
                </span>
                <input
                  autoFocus
                  value={queixa}
                  onChange={(event) => setQueixa(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && queixa.trim()) handleGerar();
                  }}
                  className="w-full border-none bg-transparent py-5 pl-12 pr-4 font-body text-[20px] text-on-surface outline-none placeholder:text-outline/50"
                  placeholder="Ex: dor torácica há 2 dias, piora ao esforço"
                />
              </div>

              <div className="hidden select-none items-center gap-1.5 px-3 font-body text-xs text-outline/40 md:flex">
                <span>Pressione</span>
                <kbd className="rounded border border-outline/20 bg-surface-container px-1.5 py-0.5 text-[10px] font-bold">
                  ENTER ↵
                </kbd>
              </div>

              <button
                onClick={handleGerar}
                disabled={!queixa.trim()}
                className="flex items-center justify-center gap-2 rounded-lg bg-primary px-7 py-4 text-base font-semibold text-on-primary transition-all duration-200 hover:bg-primary-container active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
              >
                <div className="flex flex-col items-start">
                  <span>Gerar consulta</span>
                  <span className="mt-0.5 text-[10px] font-normal uppercase leading-none tracking-wider opacity-80">
                    Leva poucos segundos
                  </span>
                </div>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </div>

          <p className="text-sm text-on-surface-muted">
            Você pode escrever de forma livre. A IA organiza automaticamente.
          </p>

          <div
            className="space-y-4 transition-opacity duration-300"
            style={{ opacity: queixa ? 0.2 : 1, pointerEvents: queixa ? "none" : "auto" }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-outline">
              Sugestões rápidas
            </span>
            <div className="flex flex-wrap justify-center gap-3">
              {QUICK_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setQueixa(suggestion)}
                  className="rounded-full border border-transparent bg-surface-container/40 px-5 py-2.5 text-sm font-medium text-on-surface-variant transition-all duration-200 hover:border-secondary-container hover:bg-surface-lowest"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="z-10 mt-24 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3"
          style={{ opacity: 0.6, transition: "opacity 0.8s ease 0.2s" }}
        >
          {INFO_CARDS.map((card) => (
            <div key={card.title} className="space-y-2 rounded-xl bg-surface-container/50 p-6 text-left">
              <span className="material-symbols-outlined text-[28px] text-secondary">
                {card.icon}
              </span>
              <h3 className="font-headline text-xl text-primary">{card.title}</h3>
              <p className="text-sm leading-relaxed text-on-surface-variant">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}