"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useConsultationStore } from "@/stores/consultation-store";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { generateEsusSummary } from "@/lib/esus-generator";
import { generateResumoOutput, generateDetalhadoOutput } from "@/lib/output-generators";
import { copyToClipboard } from "@/lib/clipboard";
import { showToast } from "@/components/ui/toast";
import { SnippetPopover } from "@/components/consultation/snippet-popover";
import type { OutputMode, ConsultationState } from "@/types";

function getOutput(state: ConsultationState, mode: OutputMode): string {
  if (mode === "resumido") return generateResumoOutput(state);
  if (mode === "detalhado") return generateDetalhadoOutput(state);
  return generateEsusSummary(state);
}

export function OutputColumn() {
  const store = useConsultationStore();
  const [outputMode, setOutputMode] = useState<OutputMode>("esus");
  const [summary, setSummary] = useState(() =>
    getOutput(useConsultationStore.getState(), "esus")
  );
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const modeRef = useRef<OutputMode>("esus");

  useEffect(() => {
    modeRef.current = outputMode;
    setSummary(getOutput(useConsultationStore.getState(), outputMode));
  }, [outputMode]);

  useEffect(() => {
    const unsub = useConsultationStore.subscribe(() => {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setSummary(getOutput(useConsultationStore.getState(), modeRef.current));
      }, 300);
    });

    return () => {
      unsub();
      clearTimeout(debounceRef.current);
    };
  }, []);

  const hasSummary = summary.trim().length > 0;

  const handleCopy = async () => {
    if (!hasSummary) {
      showToast("Preencha a consulta para gerar o resumo", "info");
      return;
    }

    const ok = await copyToClipboard(summary);
    if (ok) {
      setCopied(true);
      showToast("Copiado!", "success");
      setTimeout(() => setCopied(false), 2000);
    } else {
      showToast("Erro ao copiar", "error");
    }
  };

  const handleGenerateFull = () => {
    if (!hasSummary) {
      showToast("Ainda não há conteúdo para gerar", "info");
      return;
    }

    if (editorRef.current) {
      editorRef.current.innerText = summary;
    }
  };

  const modeLabels: Record<OutputMode, string> = {
    esus: "eSUS",
    resumido: "Resumido",
    detalhado: "Detalhado",
  };

  const sectionLabel =
    outputMode === "resumido"
      ? "Resumo Rápido"
      : outputMode === "detalhado"
      ? "Prontuário Completo"
      : "Resumo eSUS PEC";

  return (
    <div>
      <div className="flex gap-1 mb-3">
        {(["esus", "resumido", "detalhado"] as OutputMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setOutputMode(mode)}
            className={`px-3 py-1.5 text-[12px] rounded-lg transition-colors cursor-pointer font-medium ${
              outputMode === mode
                ? "bg-primary/8 text-primary border-b-2 border-primary"
                : "text-on-surface-muted hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            {modeLabels[mode]}
          </button>
        ))}
      </div>

      <SectionHeader label={sectionLabel} color="cyan" />
      {hasSummary ? (
        <pre className="bg-surface-container rounded-xl p-4 font-mono text-[11px] leading-[1.9] text-on-surface min-h-[240px] whitespace-pre-wrap break-words mb-1">
          {summary}
        </pre>
      ) : (
        <div className="bg-surface-container rounded-xl p-4 min-h-[240px] mb-1 flex flex-col justify-center">
          <p className="text-[13px] font-medium text-on-surface mb-1.5">
            O texto será montado automaticamente.
          </p>
          <p className="text-[12px] text-on-surface-variant leading-relaxed mb-3">
            Este painel organiza a consulta para copiar e colar com menos retrabalho no PEC.
          </p>
          <div className="space-y-1 text-[11px] text-on-surface-muted font-mono">
            <div>- problemas</div>
            <div>- vitais e exames alterados</div>
            <div>- SOAP, prescrição e orientações</div>
          </div>
        </div>
      )}
      <button
        onClick={handleCopy}
        disabled={!hasSummary}
        className={`w-full h-[40px] mt-2 rounded-xl text-[13px] font-semibold cursor-pointer transition-all duration-150 flex items-center justify-center gap-2 ${
          copied
            ? "bg-secondary-container text-on-secondary-container"
            : "bg-primary text-on-primary hover:bg-primary-container"
        } disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {copied ? "Copiado!" : `Copiar — ${modeLabels[outputMode]}`}
      </button>

      <div className="mt-4">
        <SectionHeader label="Editor Livre" color="purple" />
        <div className="flex gap-0.5 mb-1.5">
          {(["bold", "italic", "underline"] as const).map((cmd) => (
            <button
              key={cmd}
              onClick={() => document.execCommand(cmd)}
              className="w-[26px] h-[26px] border border-outline-variant/40 rounded-md bg-surface-container text-on-surface-muted cursor-pointer inline-flex items-center justify-center text-[10px] hover:bg-surface-high hover:text-on-surface transition-all duration-100"
              style={{
                fontWeight: cmd === "bold" ? 700 : undefined,
                fontStyle: cmd === "italic" ? "italic" : undefined,
                textDecoration: cmd === "underline" ? "underline" : undefined,
              }}
            >
              {cmd[0].toUpperCase()}
            </button>
          ))}
        </div>
        <div
          ref={editorRef}
          contentEditable
          className="min-h-[150px] p-3 rounded-xl bg-surface-container text-on-surface text-[13px] leading-[1.75] outline-none"
        />
        <Button
          variant="primary"
          className="w-full mt-[5px] h-[31px] text-xs tracking-[0.02em]"
          onClick={handleGenerateFull}
          disabled={!hasSummary}
        >
          Gerar prontuário completo
        </Button>
      </div>

      <div className="mt-4">
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
          className="w-full h-20 px-0 py-2 border-0 border-b border-outline-variant/50 rounded-none bg-transparent text-on-surface text-[13px] resize-y leading-relaxed placeholder:text-on-surface-muted focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div className="mt-4">
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
          className="w-full h-16 px-0 py-2 border-0 border-b border-outline-variant/50 rounded-none bg-transparent text-on-surface text-[13px] resize-y leading-relaxed placeholder:text-on-surface-muted focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div className="mt-4">
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
          className="w-full h-16 px-0 py-2 border-0 border-b border-outline-variant/50 rounded-none bg-transparent text-on-surface text-[13px] resize-y leading-relaxed placeholder:text-on-surface-muted focus:outline-none focus:border-primary transition-colors"
        />
      </div>
    </div>
  );
}
