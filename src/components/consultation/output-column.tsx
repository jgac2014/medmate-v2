"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useConsultationStore } from "@/stores/consultation-store";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { generateEsusSummary } from "@/lib/esus-generator";
import { copyToClipboard } from "@/lib/clipboard";
import { showToast } from "@/components/ui/toast";
import { SnippetPopover } from "@/components/consultation/snippet-popover";

export function OutputColumn() {
  const store = useConsultationStore();
  const [summary, setSummary] = useState(() =>
    generateEsusSummary(useConsultationStore.getState())
  );
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const generateSummary = useCallback(() => {
    const state = useConsultationStore.getState();
    return generateEsusSummary(state);
  }, []);

  useEffect(() => {
    const unsub = useConsultationStore.subscribe(() => {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setSummary(generateSummary());
      }, 300);
    });

    return () => {
      unsub();
      clearTimeout(debounceRef.current);
    };
  }, [generateSummary]);

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

  return (
    <div>
      <SectionHeader label="Resumo eSUS PEC" color="cyan" />
      {hasSummary ? (
        <pre className="bg-bg-1 border border-border-subtle border-l-[3px] border-l-[rgba(34,211,238,0.35)] rounded-xl p-3 font-mono text-[10.5px] leading-[1.9] text-text-primary min-h-[240px] whitespace-pre-wrap break-words mb-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
          {summary}
        </pre>
      ) : (
        <div className="bg-bg-1 border border-dashed border-border-default rounded-xl p-3 min-h-[240px] mb-1 flex flex-col justify-center">
          <p className="text-[12px] font-medium text-text-primary mb-1.5">
            O texto para o eSUS será montado automaticamente.
          </p>
          <p className="text-[11px] text-text-secondary leading-relaxed mb-3">
            Este painel organiza a consulta para copiar e colar com menos retrabalho no PEC.
          </p>
          <div className="space-y-1 text-[10.5px] text-text-tertiary font-mono">
            <div>- problemas</div>
            <div>- vitais e exames alterados</div>
            <div>- SOAP, prescrição e orientações</div>
          </div>
        </div>
      )}
      <button
        onClick={handleCopy}
        disabled={!hasSummary}
        className={`w-full h-[28px] mt-[5px] bg-transparent border rounded-[5px] text-xs cursor-pointer font-sans transition-all duration-150 flex items-center justify-center gap-1 ${
          copied
            ? "border-accent text-accent bg-accent-dim"
            : "border-border-default text-text-secondary hover:bg-bg-3 hover:text-text-primary hover:border-text-tertiary"
        } disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {copied ? "Copiado!" : "Copiar para eSUS"}
      </button>

      <div className="mt-4">
        <SectionHeader label="Editor Livre" color="purple" />
        <div className="flex gap-0.5 mb-1.5">
          {(["bold", "italic", "underline"] as const).map((cmd) => (
            <button
              key={cmd}
              onClick={() => document.execCommand(cmd)}
              className="w-[26px] h-[26px] border border-border-default rounded-md bg-bg-3 text-text-secondary cursor-pointer inline-flex items-center justify-center text-[10px] hover:bg-bg-2 hover:text-text-primary hover:border-text-tertiary transition-all duration-100"
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
          className="min-h-[150px] p-3 border border-border-subtle rounded-xl bg-bg-3/85 text-text-primary text-xs leading-[1.75] outline-none transition-[border,background-color] duration-150 focus:border-border-default focus:bg-bg-3"
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
          className="w-full h-20 px-2 py-[7px] border border-border-subtle rounded-[5px] bg-bg-2 text-text-primary font-sans text-xs resize-y leading-relaxed placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)]"
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
          className="w-full h-16 px-2 py-[7px] border border-border-subtle rounded-[5px] bg-bg-2 text-text-primary font-sans text-xs resize-y leading-relaxed placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)]"
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
          className="w-full h-16 px-2 py-[7px] border border-border-subtle rounded-[5px] bg-bg-2 text-text-primary font-sans text-xs resize-y leading-relaxed placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)]"
        />
      </div>
    </div>
  );
}
