"use client";

import { useState } from "react";
import { useConsultationStore } from "@/stores/consultation-store";
import { useExamCalculations } from "@/hooks/useExamCalculations";
import { SectionHeader } from "@/components/ui/section-header";
import { DateInput } from "@/components/ui/date-input";
import { ExamCard } from "./exam-card";
import { ClinicalCalculationsCard } from "./clinical-calculations-card";
import { AdditionalExamsSection } from "./additional-exams-section";
import { PRIMARY_EXAM_CARDS, EXAM_FIELD_KEYS } from "@/lib/constants";
import type { ExamCardDef } from "@/types";

const renalCard = PRIMARY_EXAM_CARDS.find((c) => c.id === "renal")!;
const otherPrimaryCards = PRIMARY_EXAM_CARDS.filter((c) => c.id !== "renal");

export function ExamGrid() {
  const [showAdditional, setShowAdditional] = useState(false);

  const labsDate = useConsultationStore((s) => s.labsDate);
  const setLabsDate = useConsultationStore((s) => s.setLabsDate);
  const setLab = useConsultationStore((s) => s.setLab);
  const setCalculations = useConsultationStore((s) => s.setCalculations);
  const imaging = useConsultationStore((s) => s.imaging);
  const setImaging = useConsultationStore((s) => s.setImaging);
  const labsExtras = useConsultationStore((s) => s.labsExtras);

  // Monta os efeitos de cálculo automático (TFG, FIB-4, RCV, LDL, Não-HDL)
  useExamCalculations();

  function handleClear() {
    for (const key of EXAM_FIELD_KEYS) {
      setLab(key, "");
    }
    setCalculations({ tfg: null, fib4: null, rcv: null, ldl: null, naoHdl: null });
  }

  return (
    <div>
      {/* Cabeçalho da seção */}
      <SectionHeader label="Exames Complementares" color="cyan" />
      <p className="text-[10.5px] text-[var(--on-surface-muted)] mb-3 leading-relaxed">
        Preencha apenas os exames relevantes. Os cálculos clínicos são gerados automaticamente quando houver dados suficientes.
      </p>

      {/* Barra de ações */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <div className="flex-1 min-w-[140px]">
          <DateInput
            label="Data dos exames"
            value={labsDate}
            onChange={setLabsDate}
          />
        </div>

        <div className="flex items-center gap-2 mt-3">
          <button
            type="button"
            onClick={() => setShowAdditional((v) => !v)}
            className="text-[10.5px] font-medium text-[var(--on-surface-variant)] hover:text-[var(--primary)] transition-colors duration-100 flex items-center gap-1 py-1 px-2 rounded-md hover:bg-[var(--surface-container)]"
          >
            <svg
              className={`w-3 h-3 transition-transform duration-150 ${showAdditional ? "rotate-180" : ""}`}
              viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"
            >
              <path d="M2 4.5L6 8L10 4.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {showAdditional ? "Ocultar adicionais" : "Mostrar adicionais"}
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="text-[10.5px] font-medium text-[var(--on-surface-muted)] hover:text-[var(--error)] transition-colors duration-100 py-1 px-2 rounded-md hover:bg-[var(--error)]/5"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* Linha de destaque — Perfil Renal + Cálculos Clínicos lado a lado */}
      <div className="grid grid-cols-2 gap-[7px] mb-[7px] sm:grid-cols-1">
        <ExamCard card={renalCard as unknown as ExamCardDef} />
        <ClinicalCalculationsCard />
      </div>

      {/* Grid secundário — demais perfis, 3 cols desktop */}
      <div className="grid grid-cols-3 gap-[7px] mb-2.5 md:grid-cols-2 sm:grid-cols-1">
        {otherPrimaryCards.map((card) => (
          <ExamCard
            key={card.id}
            card={card as unknown as ExamCardDef}
          />
        ))}
      </div>

      {/* Seção adicional — recolhível */}
      <AdditionalExamsSection open={showAdditional} />

      {/* Outros / Imagens */}
      <div className="border border-[var(--outline-variant)] rounded-lg p-[10px] bg-[var(--surface-low)] mt-2.5">
        <div className="text-[9px] font-bold tracking-[0.09em] uppercase text-[var(--on-surface-variant)] mb-2 pb-1.5 border-b border-[var(--outline-variant)]">
          Outros / Imagens
        </div>
        <DateInput
          label="Data"
          value={imaging.date}
          onChange={(v) => setImaging({ date: v })}
        />
        <textarea
          placeholder={"ECG: ritmo sinusal\nUSG abd: esteatose hepática leve"}
          value={imaging.entries}
          onChange={(e) => setImaging({ entries: e.target.value })}
          className="w-full h-20 px-2 py-[7px] border border-[var(--outline-variant)] rounded-[5px] bg-[var(--surface-container)] text-[var(--on-surface)] font-sans text-xs resize-y leading-relaxed placeholder:text-[var(--on-surface-muted)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[0_0_0_2px_rgba(1,45,29,0.1)]"
        />
        {labsExtras && (
          <div className="space-y-1 mt-2">
            <label className="text-[10.5px] font-medium text-[var(--on-surface-muted)] uppercase tracking-wide block">
              Outros exames
            </label>
            <pre className="text-[11px] text-[var(--on-surface)] font-mono whitespace-pre-wrap leading-relaxed">
              {labsExtras}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
