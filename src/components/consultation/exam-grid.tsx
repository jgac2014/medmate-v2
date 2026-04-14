"use client";

import { useState } from "react";
import { useConsultationStore } from "@/stores/consultation-store";
import { useExamCalculations } from "@/hooks/useExamCalculations";
import { SectionHeader } from "@/components/ui/section-header";
import { DateInput } from "@/components/ui/date-input";
import { ExamCard } from "./exam-card";
import { ClinicalCalculationsCard } from "./clinical-calculations-card";
import { AdditionalExamsSection } from "./additional-exams-section";
import { PRIMARY_EXAM_CARDS, ADDITIONAL_EXAM_CARDS, EXAM_FIELD_KEYS } from "@/lib/constants";
import type { ExamCardDef } from "@/types";

const renalCard = PRIMARY_EXAM_CARDS.find((c) => c.id === "renal")!;
const otherPrimaryCards = PRIMARY_EXAM_CARDS.filter((c) => c.id !== "renal");

function countFilledExams(labs: Record<string, string>): number {
  return EXAM_FIELD_KEYS.filter((key) => {
    const val = labs[key];
    return val !== undefined && val.trim() !== "";
  }).length;
}

function countTotalExams(): number {
  return EXAM_FIELD_KEYS.length;
}

export function ExamGrid() {
  const [showAdditional, setShowAdditional] = useState(false);

  const labsDate = useConsultationStore((s) => s.labsDate);
  const setLabsDate = useConsultationStore((s) => s.setLabsDate);
  const labs = useConsultationStore((s) => s.labs);
  const setLab = useConsultationStore((s) => s.setLab);
  const setCalculations = useConsultationStore((s) => s.setCalculations);
  const imaging = useConsultationStore((s) => s.imaging);
  const setImaging = useConsultationStore((s) => s.setImaging);
  const addImagingItem = useConsultationStore((s) => s.addImagingItem);
  const removeImagingItem = useConsultationStore((s) => s.removeImagingItem);
  const updateImagingItem = useConsultationStore((s) => s.updateImagingItem);
  const labsExtras = useConsultationStore((s) => s.labsExtras);
  const setLabsExtras = useConsultationStore((s) => s.setLabsExtras);

  useExamCalculations();

  const filledCount = countFilledExams(labs);
  const totalCount = countTotalExams();
  const hasFilledExams = filledCount > 0;

  function handleClear() {
    for (const key of EXAM_FIELD_KEYS) {
      setLab(key, "");
    }
    setCalculations({ tfg: null, fib4: null, rcv: null, ldl: null, naoHdl: null });
    setLabsExtras("");
    setImaging({ date: new Date().toISOString().split("T")[0], entries: "", items: [] });
  }

  function handleAddItem() {
    addImagingItem({ examDate: "", name: "", result: "", notes: "" });
  }

  return (
    <div>
      <SectionHeader label="Exames Complementares" color="cyan" />

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        {/* Data dos exames */}
        <div className="shrink-0">
          <DateInput
            label="Data dos exames"
            value={labsDate}
            onChange={setLabsDate}
          />
        </div>

        {/* Contador de exames preenchidos */}
        {hasFilledExams && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--surface-container)] border border-[var(--outline-variant)]/40">
            <span className="material-symbols-outlined text-[14px] text-[var(--status-calc)]">
              check_circle
            </span>
            <span className="text-[11px] font-semibold text-[var(--on-surface-variant)]">
              <span className="font-mono tabular-nums text-[var(--status-calc)]">{filledCount}</span>
              {" "}/{" "}
              <span className="tabular-nums text-[var(--on-surface-muted)]">{totalCount}</span>
              {" "}campos
            </span>
          </div>
        )}

        {/* Spacer + ações */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={() => setShowAdditional((v) => !v)}
            className={`text-[10.5px] font-medium transition-colors duration-100 flex items-center gap-1 py-1 px-2.5 rounded-md border ${
              showAdditional
                ? "bg-[var(--primary)]/8 border-[var(--primary)]/20 text-[var(--primary)]"
                : "border-[var(--outline-variant)] text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] hover:text-[var(--primary)] hover:border-[var(--primary)]/20"
            }`}
          >
            <svg
              className={`w-3 h-3 transition-transform duration-150 ${showAdditional ? "rotate-180" : ""}`}
              viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"
            >
              <path d="M2 4.5L6 8L10 4.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {showAdditional ? "Ocultar adicionais" : `Adicionais (${ADDITIONAL_EXAM_CARDS.length})`}
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="text-[10.5px] font-medium text-[var(--on-surface-muted)] hover:text-[var(--error)] transition-colors duration-100 py-1 px-2.5 rounded-md hover:bg-[var(--error)]/5"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* Linha de destaque — Renal + Cálculos Clínicos */}
      <div className="grid grid-cols-2 gap-[7px] mb-[7px] sm:grid-cols-1">
        <ExamCard card={renalCard as unknown as ExamCardDef} />
        <ClinicalCalculationsCard />
      </div>

      {/* Grid secundário — perfis principais */}
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

      {/* ── Exames e Imagens ── */}
      <div className="border border-[var(--outline-variant)] rounded-lg p-[10px] bg-[var(--surface-low)] mt-2.5">
        <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[var(--outline-variant)]">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[13px] text-[var(--on-surface-muted)]">
              folder_open
            </span>
            <span className="text-[9px] font-bold tracking-[0.09em] uppercase text-[var(--on-surface-variant)]">
              Exames e Imagens
            </span>
          </div>
          <button
            type="button"
            onClick={handleAddItem}
            className="text-[10px] font-medium text-[var(--primary)] hover:text-[var(--primary)]/80 flex items-center gap-1 transition-colors duration-100"
          >
            <span className="text-base leading-none font-light">+</span>
            Adicionar
          </button>
        </div>

        {/* Items estruturados — do store */}
        {imaging.items.length > 0 && (
          <div className="space-y-2 mb-2">
            {imaging.items.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-[var(--outline-variant)]/60 bg-[var(--surface-lowest)] p-2.5 space-y-1.5 group"
              >
                <div className="flex items-start gap-2">
                  {/* Data por item */}
                  <div className="shrink-0 w-24">
                    <DateInput
                      label="Data"
                      value={item.examDate}
                      onChange={(v) => updateImagingItem(item.id, { examDate: v })}
                    />
                  </div>
                  {/* Nome */}
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      placeholder="Nome do exame ou documento"
                      value={item.name}
                      onChange={(e) => updateImagingItem(item.id, { name: e.target.value })}
                      className="w-full text-[11px] font-medium text-[var(--on-surface)] bg-transparent border-b border-[var(--outline-variant)]/40 pb-1 focus:outline-none focus:border-[var(--primary)] transition-colors placeholder:text-[var(--on-surface-muted)]"
                    />
                    <input
                      type="text"
                      placeholder="Resultado"
                      value={item.result}
                      onChange={(e) => updateImagingItem(item.id, { result: e.target.value })}
                      className="w-full text-[11px] text-[var(--on-surface)] bg-transparent border-b border-[var(--outline-variant)]/40 pb-1 mt-1 focus:outline-none focus:border-[var(--primary)] transition-colors placeholder:text-[var(--on-surface-muted)]"
                    />
                    <input
                      type="text"
                      placeholder="Observação (opcional)"
                      value={item.notes}
                      onChange={(e) => updateImagingItem(item.id, { notes: e.target.value })}
                      className="w-full text-[10.5px] text-[var(--on-surface-muted)] bg-transparent border-b border-[var(--outline-variant)]/40 pb-0.5 mt-1 focus:outline-none focus:border-[var(--primary)] transition-colors placeholder:text-[var(--on-surface-muted)] italic"
                    />
                  </div>
                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removeImagingItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-[var(--on-surface-muted)] hover:text-[var(--error)] transition-all text-base leading-none mt-5 shrink-0 cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Legacy labsExtras — preservado para dados do ExamReviewModal */}
        {labsExtras && (
          <div className="space-y-1 mt-2 pt-2 border-t border-[var(--outline-variant)]/40">
            <label className="text-[10px] font-medium text-[var(--on-surface-muted)] uppercase tracking-wide block">
              Outros exames
            </label>
            <pre className="text-[11px] text-[var(--on-surface)] font-mono whitespace-pre-wrap leading-relaxed">
              {labsExtras}
            </pre>
          </div>
        )}

        {/* Empty state */}
        {imaging.items.length === 0 && !labsExtras && !imaging.entries.trim() && (
          <p className="text-[11px] text-[var(--on-surface-muted)] text-center py-2">
            Adicione exames ou documentos disponíveis.
          </p>
        )}
      </div>
    </div>
  );
}
