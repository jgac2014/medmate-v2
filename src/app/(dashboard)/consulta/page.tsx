"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ConsultationSidebar } from "@/components/consultation/consultation-sidebar";
import { ClinicalSummary } from "@/components/consultation/clinical-summary";
import { SoapForm } from "@/components/consultation/soap-form";
import { HistoryForm } from "@/components/consultation/history-form";
import { OutputColumn } from "@/components/consultation/output-column";
import { DraftRecoveryBanner } from "@/components/consultation/draft-recovery-banner";
import { FollowupPanel } from "@/components/consultation/followup-panel";
import { PreventionList } from "@/components/consultation/prevention-list";
import { PatientInfo } from "@/components/consultation/patient-info";
import { ProblemList } from "@/components/consultation/problem-list";
import { VitalsForm } from "@/components/consultation/vitals-form";
import { ExamGrid } from "@/components/consultation/exam-grid";
import { ExamUploadButton } from "@/components/consultation/exam-upload-button";
import { ExamReviewModal } from "@/components/consultation/exam-review-modal";
import { useConsultationStore } from "@/stores/consultation-store";
import { useDraftAutosave } from "@/hooks/useDraftAutosave";

export default function ConsultaPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  useDraftAutosave(userId);

  const labsExtras = useConsultationStore((s) => s.labsExtras);
  const setLabsExtras = useConsultationStore((s) => s.setLabsExtras);
  const [reviewModal, setReviewModal] = useState<{
    open: boolean;
    matched: Record<string, string>;
    extras: string;
  }>({ open: false, matched: {}, extras: "" });

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden bg-surface-low">
      {/* Sidebar fixa */}
      <ConsultationSidebar />

      {/* Área principal scrollável */}
      <main className="flex-1 overflow-y-auto">
        <DraftRecoveryBanner />
        <div className="max-w-5xl mx-auto p-4 space-y-4">

          {/* Bloco 1: Identificação + Problemas (compacto, menos destaque) */}
          <details className="group">
            <summary className="cursor-pointer text-[11px] font-medium text-on-surface-muted uppercase tracking-wide select-none list-none flex items-center gap-1 hover:text-on-surface transition-colors">
              <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
              Identificação e problemas da consulta
            </summary>
            <div className="mt-3 grid grid-cols-2 gap-4 p-4 rounded-xl bg-surface-lowest border border-outline-variant/20">
              <PatientInfo />
              <ProblemList />
            </div>
          </details>

          {/* Bloco 2: SOAP — foco principal */}
          <section className="rounded-xl bg-surface-lowest border border-outline-variant/20 p-5">
            <ClinicalSummary />
            <div className="my-3 h-px bg-outline-variant/20" />
            <SoapForm />
          </section>

          {/* Bloco 3: Dados Objetivos */}
          <section className="rounded-xl bg-surface-lowest border border-outline-variant/20 p-5 space-y-4">
            <ExamUploadButton
              onResult={({ matched, extras }) =>
                setReviewModal({ open: true, matched, extras })
              }
            />
            <VitalsForm />
            <div className="h-px bg-outline-variant/20" />
            <ExamGrid />
            {labsExtras && (
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-medium text-on-surface-muted uppercase tracking-wide">
                  Outros exames
                </label>
                <textarea
                  value={labsExtras}
                  onChange={(e) => setLabsExtras(e.target.value)}
                  rows={Math.min(6, labsExtras.split("\n").length + 1)}
                  className="w-full text-[13px] text-on-surface bg-transparent border border-outline-variant/30 rounded-lg px-3 py-2 resize-y font-mono focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            )}
          </section>

          {/* Bloco 4: Antecedentes */}
          <section className="rounded-xl bg-surface-lowest border border-outline-variant/20 p-5">
            <HistoryForm />
          </section>

          {/* Bloco 4: Saída */}
          <section className="rounded-xl bg-surface-lowest border border-outline-variant/20 p-5">
            <OutputColumn />
          </section>

          {/* Bloco 5: Prevenção e seguimento (menos destaque) */}
          <section className="rounded-xl bg-surface-lowest border border-outline-variant/20 p-5 space-y-4">
            <PreventionList />
            <div className="h-px bg-outline-variant/20" />
            <FollowupPanel />
          </section>

        </div>
      </main>

      <ExamReviewModal
        open={reviewModal.open}
        matched={reviewModal.matched}
        extras={reviewModal.extras}
        onClose={() => setReviewModal({ open: false, matched: {}, extras: "" })}
      />
    </div>
  );
}
