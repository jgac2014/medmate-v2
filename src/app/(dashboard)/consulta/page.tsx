"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ConsultationSidebar } from "@/components/consultation/consultation-sidebar";
import { ConsultationRightPanel } from "@/components/consultation/consultation-right-panel";
import { ClinicalSummary } from "@/components/consultation/clinical-summary";
import { SoapForm } from "@/components/consultation/soap-form";
import { HistoryForm } from "@/components/consultation/history-form";
import { DraftRecoveryBanner } from "@/components/consultation/draft-recovery-banner";
import { FollowupPanel } from "@/components/consultation/followup-panel";
import { PreventionList } from "@/components/consultation/prevention-list";
import { PatientInfo } from "@/components/consultation/patient-info";
import { ProblemList } from "@/components/consultation/problem-list";
import { VitalsForm } from "@/components/consultation/vitals-form";
import { ExamGrid } from "@/components/consultation/exam-grid";
import { ExamUploadButton } from "@/components/consultation/exam-upload-button";
import { ExamReviewModal } from "@/components/consultation/exam-review-modal";
import { ConsultaConcluidaModal } from "@/components/consultation/consulta-concluida-modal";
import { useConsultationStore } from "@/stores/consultation-store";
import { useDraftAutosave } from "@/hooks/useDraftAutosave";
import { useSaveConsultation } from "@/hooks/useSaveConsultation";

export default function ConsultaPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const patientName = useConsultationStore((s) => s.patientName);
  const patient = useConsultationStore((s) => s.patient);

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  useDraftAutosave(userId);

  const router = useRouter();
  const { saving, save, modalOpen, esusTextSnapshot, closeModal } = useSaveConsultation(userId);

  const labsExtras = useConsultationStore((s) => s.labsExtras);
  const setLabsExtras = useConsultationStore((s) => s.setLabsExtras);
  const [reviewModal, setReviewModal] = useState<{
    open: boolean;
    matched: Record<string, string>;
    extras: string;
  }>({ open: false, matched: {}, extras: "" });

  async function handleFinalize() {
    await save();
  }

  return (
    <div className="theme-light flex h-[calc(100vh-56px)] overflow-hidden bg-[var(--bg-0)]">
      {/* Coluna esquerda: contexto do paciente */}
      <ConsultationSidebar />

      {/* Coluna central: área de trabalho com scroll */}
      <main className="flex-1 overflow-y-auto min-w-0">
        {/* Topbar da consulta */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-6 h-12 bg-white border-b border-primary/10">
          <div className="flex items-center gap-4">
            <h1 className="font-headline font-bold text-primary flex items-center gap-2 text-[17px]">
              AjudaMed
              <span className="px-1.5 py-0.5 bg-primary/5 text-[9px] font-sans font-bold tracking-tighter text-primary/60 rounded border border-primary/10 uppercase">
                Clinical v4
              </span>
            </h1>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-2 text-[11px] font-medium text-secondary">
              <span className="material-symbols-outlined text-sm">person</span>
              {patientName ?? patient.name ?? "Nenhum paciente"}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 px-2 py-1 bg-[#e9eff2] rounded text-[10px] font-bold text-[#717973] uppercase tracking-tight">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
              Rascunho Salvo
            </div>
            <button
              onClick={handleFinalize}
              disabled={saving}
              className="px-5 py-2 bg-primary text-white text-[11px] rounded font-bold hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2 uppercase tracking-wide disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              {saving ? "Salvando..." : "Finalizar Atendimento"}
            </button>
          </div>
        </header>

        <DraftRecoveryBanner />
        <div className="max-w-3xl mx-auto p-4 space-y-4">

          {/* Bloco 1: Identificação + Problemas */}
          <details className="group">
            <summary className="cursor-pointer text-[11px] font-medium text-[var(--on-surface-muted)] uppercase tracking-wide select-none list-none flex items-center gap-1 hover:text-[var(--on-surface)] transition-colors">
              <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
              Identificação e problemas
            </summary>
            <div className="mt-3 grid grid-cols-2 gap-4 p-4 rounded-xl bg-[var(--surface-lowest)] border border-[var(--outline-variant)]">
              <PatientInfo />
              <ProblemList />
            </div>
          </details>

          {/* Bloco 2: SOAP */}
          <section className="rounded-xl bg-[var(--surface-lowest)] border border-[var(--outline-variant)] p-5">
            <ClinicalSummary />
            <div className="my-3 h-px bg-[var(--outline-variant)]" />
            <SoapForm />
          </section>

          {/* Bloco 3: Dados Objetivos */}
          <section className="rounded-xl bg-[var(--surface-lowest)] border border-[var(--outline-variant)] p-5 space-y-4">
            <ExamUploadButton
              onResult={({ matched, extras }) =>
                setReviewModal({ open: true, matched, extras })
              }
            />
            <VitalsForm />
            <div className="h-px bg-[var(--outline-variant)]" />
            <ExamGrid />
            {labsExtras && (
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-medium text-[var(--on-surface-muted)] uppercase tracking-wide">
                  Outros exames
                </label>
                <textarea
                  value={labsExtras}
                  onChange={(e) => setLabsExtras(e.target.value)}
                  rows={Math.min(6, labsExtras.split("\n").length + 1)}
                  className="w-full text-[13px] text-[var(--on-surface)] bg-transparent border border-[var(--outline-variant)] rounded-lg px-3 py-2 resize-y font-mono focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
            )}
          </section>

          {/* Bloco 4: Antecedentes */}
          <section className="rounded-xl bg-[var(--surface-lowest)] border border-[var(--outline-variant)] p-5">
            <HistoryForm />
          </section>

          {/* Bloco 6: Prevenção e seguimento */}
          <section className="rounded-xl bg-[var(--surface-lowest)] border border-[var(--outline-variant)] p-5 space-y-4">
            <PreventionList />
            <div className="h-px bg-[var(--outline-variant)]" />
            <FollowupPanel />
          </section>

        </div>
      </main>

      {/* Coluna direita: prévia eSUS + status documentação */}
      <ConsultationRightPanel />

      <ExamReviewModal
        open={reviewModal.open}
        matched={reviewModal.matched}
        extras={reviewModal.extras}
        onClose={() => setReviewModal({ open: false, matched: {}, extras: "" })}
      />

      <ConsultaConcluidaModal
        open={modalOpen}
        esusText={esusTextSnapshot}
        patientName={patientName ?? patient.name ?? null}
        onNewConsulta={() => {
          closeModal();
          useConsultationStore.getState().reset();
        }}
        onHistory={() => {
          closeModal();
          router.push("/consulta");
        }}
      />
    </div>
  );
}
