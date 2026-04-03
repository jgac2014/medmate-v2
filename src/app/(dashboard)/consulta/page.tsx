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
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 h-11 bg-[var(--surface-lowest)] border-b border-[var(--outline-variant)]">
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-semibold text-[var(--accent)]">
              {patientName ?? patient.name ?? "Nova consulta"}
            </span>
            <span className="h-3 w-px bg-[var(--outline-variant)]" />
            <span className="text-[11px] text-[var(--on-surface-muted)]">Atendimento em andamento</span>
          </div>
          <button
            onClick={handleFinalize}
            disabled={saving}
            className="px-4 py-1.5 bg-[var(--accent)] text-white text-[11px] font-bold rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Salvando..." : "Finalizar atendimento"}
          </button>
        </div>

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
