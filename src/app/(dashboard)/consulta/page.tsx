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

export default function ConsultaPage() {
  return (
    <div className="grid grid-cols-[210px_1fr_250px_270px] h-[calc(100vh-48px)] overflow-hidden gap-px bg-border-subtle">
      {/* Coluna 1 — Identificação + Exame Físico */}
      <div className="overflow-y-auto bg-bg-0 p-[14px_12px]">
        <PatientInfo />
        <hr className="border-0 border-t border-border-subtle my-3" />
        <ProblemList />
        <hr className="border-0 border-t border-border-subtle my-3" />
        <VitalsForm />
        <hr className="border-0 border-t border-border-subtle my-3" />
        <PreventionList />
      </div>

      {/* Coluna 2 — Exames Complementares */}
      <div className="overflow-y-auto bg-bg-0 p-[14px_12px]">
        <ExamGrid />
      </div>

      {/* Coluna 3 — Resumo + SOAP + Antecedentes */}
      <div className="overflow-y-auto bg-bg-0 p-[14px_12px]">
        <ClinicalSummary />
        <hr className="border-0 border-t border-border-subtle my-3" />
        <SoapForm />
        <hr className="border-0 border-t border-border-subtle my-3" />
        <HistoryForm />
      </div>

      {/* Coluna 4 — Output */}
      <div className="overflow-y-auto bg-bg-0 p-[14px_12px]">
        <OutputColumn />
      </div>
    </div>
  );
}
