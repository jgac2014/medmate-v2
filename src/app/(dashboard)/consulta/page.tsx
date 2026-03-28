"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PatientInfo } from "@/components/consultation/patient-info";
import { ProblemList } from "@/components/consultation/problem-list";
import { VitalsForm } from "@/components/consultation/vitals-form";
import { PreventionList } from "@/components/consultation/prevention-list";
import { ExamGrid } from "@/components/consultation/exam-grid";
import { ClinicalSummary } from "@/components/consultation/clinical-summary";
import { SoapForm } from "@/components/consultation/soap-form";
import { HistoryForm } from "@/components/consultation/history-form";
import { OutputColumn } from "@/components/consultation/output-column";
import { DraftRecoveryBanner } from "@/components/consultation/draft-recovery-banner";
import { useDraftAutosave } from "@/hooks/useDraftAutosave";

function WorkspacePanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-0 rounded-2xl border border-white/6 bg-bg-1/88 shadow-[0_20px_40px_rgba(0,0,0,0.22)] backdrop-blur-sm overflow-hidden flex flex-col">
      <div className="shrink-0 px-4 pt-4 pb-3 border-b border-border-subtle/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.015),transparent)]">
        <p className="text-[12px] font-semibold tracking-[-0.01em] text-text-primary">
          {title}
        </p>
        <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
          {description}
        </p>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        {children}
      </div>
    </section>
  );
}

export default function ConsultaPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  useDraftAutosave(userId);

  return (
    <div className="h-[calc(100vh-56px)] overflow-x-auto">
      <DraftRecoveryBanner />
      <div className="min-w-[1360px] h-full p-4">
        <div className="grid grid-cols-[220px_minmax(420px,1fr)_285px_320px] h-full gap-3">
          <WorkspacePanel
            title="Paciente e triagem"
            description="Identificação, problemas ativos, vitais e prevenções relevantes para a consulta."
          >
            <PatientInfo />
            <hr className="border-0 border-t border-border-subtle my-4" />
            <ProblemList />
            <hr className="border-0 border-t border-border-subtle my-4" />
            <VitalsForm />
            <hr className="border-0 border-t border-border-subtle my-4" />
            <PreventionList />
          </WorkspacePanel>

          <WorkspacePanel
            title="Exames e apoio diagnóstico"
            description="Resultados laboratoriais, imagens e cálculos automáticos organizados em um bloco central."
          >
            <ExamGrid />
          </WorkspacePanel>

          <WorkspacePanel
            title="Leitura clínica"
            description="Resumo sintético da consulta, SOAP e antecedentes no mesmo fluxo de raciocínio."
          >
            <ClinicalSummary />
            <hr className="border-0 border-t border-border-subtle my-4" />
            <SoapForm />
            <hr className="border-0 border-t border-border-subtle my-4" />
            <HistoryForm />
          </WorkspacePanel>

          <WorkspacePanel
            title="Saída e documentação"
            description="Resumo para eSUS, editor livre, prescrição e orientações finais para a consulta."
          >
            <OutputColumn />
          </WorkspacePanel>
        </div>
      </div>
    </div>
  );
}
