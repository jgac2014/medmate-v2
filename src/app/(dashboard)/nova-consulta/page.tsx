"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useConsultationStore } from "@/stores/consultation-store";
import { PatientSelector } from "@/components/consultation/patient-selector";
import { createClient } from "@/lib/supabase/client";
import { getFollowupFromLastConsultation } from "@/lib/supabase/followup";
import { getPatientMedications } from "@/lib/supabase/patient-medications";
import { getPatientProblems } from "@/lib/supabase/patient-problems";
import { PROBLEMS } from "@/lib/constants";
import { showToast } from "@/components/ui/toast";
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
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const {
    reset,
    setPatientId,
    setPatientName,
    setPatient,
    setSoap,
    setFollowupItems,
    setProblemsOther,
  } = useConsultationStore();

  useEffect(() => {
    setMounted(true);
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
    setPatientId(patient.id);
    setPatientName(patient.name);
    setSoap({ subjective: queixa.trim() });

    const age = patient.birth_date
      ? (() => {
          const today = new Date();
          const birth = new Date(patient.birth_date!);
          let a = today.getFullYear() - birth.getFullYear();
          const m = today.getMonth() - birth.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--;
          return `${a} anos`;
        })()
      : "";

    setPatient({
      name: patient.name,
      age,
      gender: (patient.gender as "Masculino" | "Feminino" | "Outro" | "") ?? "",
      race: (patient.race as "Branco" | "Pardo" | "Preto" | "Amarelo" | "Indígena" | "") ?? "",
    });

    if (userId) {
      const uid = userId;
      getFollowupFromLastConsultation(uid, patient.id).then((items) => {
        if (useConsultationStore.getState().patientId === patient.id && items.length > 0) {
          setFollowupItems(items);
        }
      });

      getPatientMedications(patient.id).then((meds) => {
        if (meds.length > 0 && useConsultationStore.getState().patientId === patient.id) {
          const medLines = meds.map((m) =>
            m.dosage ? `${m.medication_name} - ${m.dosage}` : m.medication_name
          );
          useConsultationStore.getState().setPrescription(medLines.join("\n"));
        }
      });

      getPatientProblems(patient.id).then((activeProblems) => {
        if (useConsultationStore.getState().patientId !== patient.id) return;
        const knownSet = new Set<string>(PROBLEMS);
        const freeProblems: string[] = [];
        activeProblems.forEach((p) => {
          if (knownSet.has(p)) {
            useConsultationStore.getState().toggleProblem(p);
          } else {
            freeProblems.push(p);
          }
        });
        if (freeProblems.length > 0) {
          setProblemsOther(freeProblems.join(", "));
        }
      });
    }

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

      <main className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-6 relative overflow-hidden bg-surface">
        {/* Ambient blobs */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-secondary-container blur-[120px] opacity-50"
            style={{ transition: "opacity 0.6s ease" }}
          />
          <div
            className="absolute bottom-[-10%] left-[-5%] w-[30vw] h-[30vw] rounded-full blur-[100px] opacity-40"
            style={{ background: "var(--primary-container)" }}
          />
        </div>

        {/* Content */}
        <div
          className="z-10 w-full max-w-3xl text-center space-y-10"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          {/* Headline */}
          <div className="space-y-3">
            <h1 className="font-headline text-5xl md:text-6xl font-medium text-primary tracking-tight leading-tight">
              Digite a queixa.{" "}
              <br />
              <span className="italic text-secondary">O resto a gente organiza.</span>
            </h1>
            <p className="text-on-surface-variant text-lg max-w-xl mx-auto leading-relaxed">
              Descreva a queixa em linguagem livre. A IA organiza a consulta e gera o prontuário.
            </p>
          </div>

          {/* Input card */}
          <div className="bg-surface-lowest rounded-xl border border-outline-variant/40 shadow-sm focus-within:shadow-md focus-within:border-secondary/30 transition-all duration-300 p-3 md:p-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <div className="relative flex-grow">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[22px]">
                  clinical_notes
                </span>
                <input
                  autoFocus
                  value={queixa}
                  onChange={(e) => setQueixa(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && queixa.trim()) handleGerar();
                  }}
                  className="w-full pl-12 pr-4 bg-transparent border-none outline-none text-[20px] text-on-surface placeholder:text-outline/50 py-5 font-body"
                  placeholder="Ex: dor torácica há 2 dias, piora ao esforço"
                />
              </div>

              <div className="hidden md:flex items-center px-3 text-outline/40 text-xs font-body select-none gap-1.5">
                <span>Pressione</span>
                <kbd className="px-1.5 py-0.5 border border-outline/20 rounded text-[10px] font-bold bg-surface-container">
                  ENTER ↵
                </kbd>
              </div>

              <button
                onClick={handleGerar}
                disabled={!queixa.trim()}
                className="flex items-center justify-center gap-2 bg-primary text-on-primary px-7 py-4 rounded-lg font-semibold text-base hover:bg-primary-container active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                <div className="flex flex-col items-start">
                  <span>Gerar consulta</span>
                  <span className="text-[10px] uppercase tracking-wider opacity-80 font-normal leading-none mt-0.5">
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

          {/* Quick suggestions */}
          <div
            className="space-y-4 transition-opacity duration-300"
            style={{ opacity: queixa ? 0.2 : 1, pointerEvents: queixa ? "none" : "auto" }}
          >
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-outline">
              Sugestões rápidas
            </span>
            <div className="flex flex-wrap justify-center gap-3">
              {QUICK_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setQueixa(s)}
                  className="px-5 py-2.5 border border-transparent hover:border-secondary-container hover:bg-surface-lowest rounded-full transition-all duration-200 text-sm font-medium bg-surface-container/40 text-on-surface-variant"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div
          className="z-10 mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl"
          style={{
            opacity: mounted ? 0.6 : 0,
            transition: "opacity 0.8s ease 0.2s",
          }}
        >
          {INFO_CARDS.map((card) => (
            <div
              key={card.title}
              className="p-6 rounded-xl bg-surface-container/50 space-y-2 text-left"
            >
              <span className="material-symbols-outlined text-secondary text-[28px]">
                {card.icon}
              </span>
              <h3 className="font-headline text-xl text-primary">{card.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
