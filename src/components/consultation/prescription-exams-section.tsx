"use client";

import { useConsultationStore } from "@/stores/consultation-store";
import { SectionHeader } from "@/components/ui/section-header";
import { SnippetPopover } from "@/components/consultation/snippet-popover";

export function PrescriptionExamsSection() {
  const store = useConsultationStore();

  return (
    <section className="rounded-xl bg-[var(--surface-lowest)] border border-[var(--outline-variant)] p-4">
      {/* Prescrição */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <SectionHeader label="Prescrição" color="green" />
          <SnippetPopover
            category="prescricao"
            onInsert={(text) =>
              store.setPrescription(
                store.prescription.trim() ? `${store.prescription.trim()}\n${text}` : text
              )
            }
          />
        </div>
        <textarea
          placeholder={"1. Metformina 850mg - 1cp 2x/dia\n2. Losartana 50mg - 1cp/dia"}
          value={store.prescription}
          onChange={(e) => store.setPrescription(e.target.value)}
          className="w-full h-20 px-3 py-2 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-low)] text-on-surface text-[13px] resize-y leading-relaxed placeholder:text-on-surface-muted focus:outline-none focus:border-[var(--primary)] transition-colors"
        />
      </div>

      {/* Divisor */}
      <div className="mb-4 h-px bg-[var(--outline-variant)]/40" />

      {/* Exames a Solicitar */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <SectionHeader label="Exames a Solicitar" color="blue" />
          <SnippetPopover
            category="exames"
            onInsert={(text) =>
              store.setRequestedExams(
                store.requestedExams.trim() ? `${store.requestedExams.trim()}\n${text}` : text
              )
            }
          />
        </div>
        <textarea
          placeholder="HbA1c, lipidograma, TSH..."
          value={store.requestedExams}
          onChange={(e) => store.setRequestedExams(e.target.value)}
          className="w-full h-16 px-3 py-2 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-low)] text-on-surface text-[13px] resize-y leading-relaxed placeholder:text-on-surface-muted focus:outline-none focus:border-[var(--primary)] transition-colors"
        />
      </div>

      {/* Divisor */}
      <div className="mb-4 h-px bg-[var(--outline-variant)]/40" />

      {/* Orientações ao Paciente */}
      <div>
        <div className="flex items-center justify-between">
          <SectionHeader label="Orientações ao Paciente" color="amber" />
          <SnippetPopover
            category="orientacao"
            onInsert={(text) =>
              store.setPatientInstructions(
                store.patientInstructions.trim()
                  ? `${store.patientInstructions.trim()}\n${text}`
                  : text
              )
            }
          />
        </div>
        <textarea
          placeholder="Dieta hipossódica, atividade física 150min/semana..."
          value={store.patientInstructions}
          onChange={(e) => store.setPatientInstructions(e.target.value)}
          className="w-full h-16 px-3 py-2 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-low)] text-on-surface text-[13px] resize-y leading-relaxed placeholder:text-on-surface-muted focus:outline-none focus:border-[var(--primary)] transition-colors"
        />
      </div>
    </section>
  );
}
