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
import { useDraftAutosave } from "@/hooks/useDraftAutosave";

export default function ConsultaPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  useDraftAutosave(userId);

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

          {/* Bloco 3: Antecedentes */}
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
    </div>
  );
}
