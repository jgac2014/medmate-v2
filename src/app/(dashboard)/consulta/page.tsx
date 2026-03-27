"use client";

import { PatientInfo } from "@/components/consultation/patient-info";
import { ProblemList } from "@/components/consultation/problem-list";
import { VitalsForm } from "@/components/consultation/vitals-form";
import { PreventionList } from "@/components/consultation/prevention-list";
import { ExamGrid } from "@/components/consultation/exam-grid";
import { ClinicalSummary } from "@/components/consultation/clinical-summary";
import { SoapForm } from "@/components/consultation/soap-form";
import { HistoryForm } from "@/components/consultation/history-form";
import { OutputColumn } from "@/components/consultation/output-column";

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
    <section className="min-h-0 rounded-2xl border border-white/6 bg-bg-1/88 shadow-[0_20px_40px_rgba(0,0,0,0.22)] backdrop-blur-sm overflow-hidden">
      <div className="px-4 pt-4 pb-3 border-b border-border-subtle/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.015),transparent)]">
        <p className="text-[12px] font-semibold tracking-[-0.01em] text-text-primary">
          {title}
        </p>
        <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
          {description}
        </p>
      </div>
      <div className="h-[calc(100%-62px)] overflow-y-auto px-4 py-4">
        {children}
      </div>
    </section>
  );
}

export default function ConsultaPage() {
  return (
    <div className="h-[calc(100vh-56px)] overflow-x-auto">
      <div className="min-w-[1360px] h-full p-4">
        <div className="grid grid-cols-[220px_minmax(420px,1fr)_285px_320px] h-full gap-3">
          <WorkspacePanel
            title="Paciente e triagem"
            description="IdentificaÃ§Ã£o, problemas ativos, vitais e prevenÃ§Ãµes relevantes para a consulta."
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
            title="Exames e apoio diagnÃ³stico"
            description="Resultados laboratoriais, imagens e cÃ¡lculos automÃ¡ticos organizados em um bloco central."
          >
            <ExamGrid />
          </WorkspacePanel>

          <WorkspacePanel
            title="Leitura clÃ­nica"
            description="Resumo sintÃ©tico da consulta, SOAP e antecedentes no mesmo fluxo de raciocÃ­nio."
          >
            <ClinicalSummary />
            <hr className="border-0 border-t border-border-subtle my-4" />
            <SoapForm />
            <hr className="border-0 border-t border-border-subtle my-4" />
            <HistoryForm />
          </WorkspacePanel>

          <WorkspacePanel
            title="SaÃ­da e documentaÃ§Ã£o"
            description="Resumo para eSUS, editor livre, prescriÃ§Ã£o e orientaÃ§Ãµes finais para a consulta."
          >
            <OutputColumn />
          </WorkspacePanel>
        </div>
      </div>
    </div>
  );
}
