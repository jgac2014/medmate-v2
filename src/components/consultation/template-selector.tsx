"use client";

import { useState } from "react";
import { useConsultationStore } from "@/stores/consultation-store";
import { CLINICAL_TEMPLATES, type ClinicalTemplate, type TemplateCategory } from "@/lib/templates";
import { showToast } from "@/components/ui/toast";
import type { SoapNotes } from "@/types";

interface TemplateSelectorProps {
  open: boolean;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<TemplateCategory | "all", string> = {
  all: "Todos",
  cronico: "Crônico",
  agudo: "Agudo",
  preventivo: "Preventivo",
};

export function TemplateSelector({ open, onClose }: TemplateSelectorProps) {
  const [category, setCategory] = useState<TemplateCategory | "all">("all");
  const [selected, setSelected] = useState<ClinicalTemplate | null>(null);
  const store = useConsultationStore();

  const filtered =
    category === "all"
      ? CLINICAL_TEMPLATES
      : CLINICAL_TEMPLATES.filter((t) => t.category === category);

  function applyTemplate(template: ClinicalTemplate) {
    const { fill } = template;
    const state = useConsultationStore.getState();

    // Problems: adicionar os que ainda não estão marcados
    if (fill.problems) {
      for (const p of fill.problems) {
        if (!state.problems.includes(p)) {
          store.toggleProblem(p);
        }
      }
    }

    // Preventions: idem
    if (fill.preventions) {
      for (const p of fill.preventions) {
        if (!state.preventions.includes(p)) {
          store.togglePrevention(p);
        }
      }
    }

    // SOAP: preencher vazios; se já preenchido, separar com "---"
    if (fill.soap) {
      const merged: Partial<SoapNotes> = {};
      for (const k of Object.keys(fill.soap) as Array<keyof SoapNotes>) {
        const templateVal = fill.soap[k];
        if (!templateVal) continue;
        const existing = state.soap[k].trim();
        merged[k] = existing ? `${existing}\n\n---\n${templateVal}` : templateVal;
      }
      if (Object.keys(merged).length > 0) store.setSoap(merged);
    }

    // Exames a solicitar: acrescentar
    if (fill.requestedExams) {
      const existing = state.requestedExams.trim();
      store.setRequestedExams(existing ? `${existing}\n${fill.requestedExams}` : fill.requestedExams);
    }

    // Orientações ao paciente: acrescentar
    if (fill.patientInstructions) {
      const existing = state.patientInstructions.trim();
      store.setPatientInstructions(
        existing ? `${existing}\n${fill.patientInstructions}` : fill.patientInstructions
      );
    }

    showToast(`Template "${template.name}" aplicado`, "success");
    onClose();
  }

  function handleClose() {
    setSelected(null);
    onClose();
  }

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-[60] w-[640px] max-w-[96vw] max-h-[88vh] -translate-x-1/2 -translate-y-1/2 bg-surface-low border border-outline-variant rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant shrink-0">
          <div>
            <p className="text-[13px] font-semibold text-on-surface">Templates clínicos</p>
            <p className="text-[11px] text-on-surface-muted mt-0.5">
              Preenche SOAP, exames e orientações com base em diretrizes oficiais brasileiras
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-md border border-outline-variant flex items-center justify-center text-on-surface-muted hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex border-b border-outline-variant shrink-0">
          {(["all", "cronico", "agudo", "preventivo"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setSelected(null);
              }}
              className={`px-4 py-2.5 text-[11.5px] font-medium transition-colors cursor-pointer ${
                category === cat
                  ? "text-on-surface border-b-2 border-primary"
                  : "text-on-surface-muted hover:text-on-surface-variant"
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Body: template list + preview */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Template list */}
          <div className="w-[220px] shrink-0 border-r border-outline-variant overflow-y-auto py-2">
            {filtered.length === 0 ? (
              <p className="text-[11px] text-on-surface-muted text-center py-8">Nenhum template nesta categoria</p>
            ) : (
              filtered.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelected(t)}
                  className={`w-full text-left px-3 py-2.5 transition-colors cursor-pointer border-l-2 ${
                    selected?.id === t.id
                      ? "border-l-accent bg-surface-container text-on-surface"
                      : "border-l-transparent text-on-surface-variant hover:bg-surface-container/60 hover:text-on-surface"
                  }`}
                >
                  <p className="text-[12px] font-medium leading-snug">{t.name}</p>
                  <p className="text-[10.5px] text-on-surface-muted mt-0.5 leading-snug">{t.description}</p>
                </button>
              ))
            )}
          </div>

          {/* Preview */}
          <div className="flex-1 overflow-y-auto p-5">
            {!selected ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
                <p className="text-[12px] text-on-surface-variant">Selecione um template para visualizar</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-[13px] font-semibold text-on-surface">{selected.name}</p>
                  <p className="text-[11px] text-on-surface-muted mt-0.5">{selected.description}</p>
                  <a
                    href={selected.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-1.5 text-[10px] text-on-surface-muted hover:text-primary transition-colors"
                  >
                    <span className="h-[3px] w-[3px] rounded-full bg-text-tertiary" />
                    {selected.source}
                  </a>
                </div>

                {/* O que será preenchido */}
                <div className="space-y-3">
                  {selected.fill.problems && selected.fill.problems.length > 0 && (
                    <PreviewSection label="Problemas" color="red">
                      <div className="flex flex-wrap gap-1">
                        {selected.fill.problems.map((p) => (
                          <span
                            key={p}
                            className="px-2 py-0.5 rounded-full bg-status-crit-bg border border-status-crit/20 text-status-crit text-[10.5px]"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </PreviewSection>
                  )}

                  {selected.fill.soap && (
                    <PreviewSection label="SOAP" color="blue">
                      {Object.entries(selected.fill.soap).map(([key, val]) => (
                        <div key={key} className="mb-2 last:mb-0">
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-muted mb-0.5">
                            {SOAP_LABELS[key as keyof SoapNotes] ?? key}
                          </p>
                          <pre className="text-[10.5px] text-on-surface-variant whitespace-pre-wrap leading-relaxed font-sans">
                            {val}
                          </pre>
                        </div>
                      ))}
                    </PreviewSection>
                  )}

                  {selected.fill.requestedExams && (
                    <PreviewSection label="Exames a Solicitar" color="cyan">
                      <pre className="text-[10.5px] text-on-surface-variant whitespace-pre-wrap leading-relaxed font-sans">
                        {selected.fill.requestedExams}
                      </pre>
                    </PreviewSection>
                  )}

                  {selected.fill.patientInstructions && (
                    <PreviewSection label="Orientações ao Paciente" color="amber">
                      <pre className="text-[10.5px] text-on-surface-variant whitespace-pre-wrap leading-relaxed font-sans">
                        {selected.fill.patientInstructions}
                      </pre>
                    </PreviewSection>
                  )}
                </div>

                <p className="text-[10px] text-on-surface-muted leading-relaxed border-t border-outline-variant pt-3">
                  O template será mesclado com o conteúdo atual — campos vazios serão preenchidos; campos preenchidos receberão o conteúdo adicional com separador.
                </p>

                <button
                  onClick={() => applyTemplate(selected)}
                  className="w-full py-2.5 rounded-lg bg-primary text-black text-[12px] font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Aplicar template — {selected.name}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SOAP_LABELS: Record<keyof SoapNotes, string> = {
  subjective: "Subjetivo (S)",
  objective: "Objetivo (O)",
  assessment: "Avaliação (A)",
  plan: "Plano (P)",
};

const COLOR_MAP: Record<string, string> = {
  red: "border-l-status-crit/40",
  blue: "border-l-status-info/40",
  cyan: "border-l-[rgba(34,211,238,0.4)]",
  amber: "border-l-status-warn/40",
  green: "border-l-status-ok/40",
};

function PreviewSection({
  label,
  color,
  children,
}: {
  label: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`border border-outline-variant border-l-[3px] ${COLOR_MAP[color] ?? "border-l-border-default"} rounded-lg p-3`}>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-muted mb-2">{label}</p>
      {children}
    </div>
  );
}
