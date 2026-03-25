"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useConsultationStore } from "@/stores/consultation-store";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { generateEsusSummary } from "@/lib/esus-generator";
import { copyToClipboard } from "@/lib/clipboard";
import { showToast } from "@/components/ui/toast";

export function OutputColumn() {
  const store = useConsultationStore();
  const [summary, setSummary] = useState("");
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const generateSummary = useCallback(() => {
    const state = useConsultationStore.getState();
    return generateEsusSummary(state);
  }, []);

  // Debounced summary generation (300ms)
  useEffect(() => {
    const unsub = useConsultationStore.subscribe(() => {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setSummary(generateSummary());
      }, 300);
    });

    setSummary(generateSummary());

    return () => {
      unsub();
      clearTimeout(debounceRef.current);
    };
  }, [generateSummary]);

  const handleCopy = async () => {
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
    if (editorRef.current) {
      editorRef.current.innerText = summary;
    }
  };

  return (
    <div>
      <SectionHeader label="Resumo eSUS PEC" color="cyan" />
      <pre className="bg-bg-1 border border-border-subtle border-l-[3px] border-l-[rgba(34,211,238,0.35)] rounded-lg p-[11px] font-mono text-[10.5px] leading-[1.9] text-text-primary min-h-[240px] whitespace-pre-wrap break-words mb-1">
        {summary || "Preencha os campos para gerar o resumo..."}
      </pre>
      <button
        onClick={handleCopy}
        className={`w-full h-[28px] mt-[5px] bg-transparent border rounded-[5px] text-xs cursor-pointer font-sans transition-all duration-150 flex items-center justify-center gap-1 ${
          copied
            ? "border-accent text-accent bg-accent-dim"
            : "border-border-default text-text-secondary hover:bg-bg-3 hover:text-text-primary hover:border-text-tertiary"
        }`}
      >
        {copied ? "Copiado!" : "Copiar para eSUS"}
      </button>

      <div className="mt-4">
        <SectionHeader label="Editor Livre" color="purple" />
        <div className="flex gap-0.5 mb-1">
          {(["bold", "italic", "underline"] as const).map((cmd) => (
            <button
              key={cmd}
              onClick={() => document.execCommand(cmd)}
              className="w-[25px] h-[25px] border border-border-default rounded bg-bg-3 text-text-secondary cursor-pointer inline-flex items-center justify-center text-[10px] hover:bg-bg-3 hover:text-text-primary hover:border-text-tertiary transition-all duration-100"
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
          className="min-h-[150px] p-2.5 border border-border-subtle rounded-[5px] bg-bg-3 text-text-primary text-xs leading-[1.75] outline-none transition-[border] duration-150 focus:border-border-default"
        />
        <Button
          variant="primary"
          className="w-full mt-[5px] h-[31px] text-xs tracking-[0.02em]"
          onClick={handleGenerateFull}
        >
          Gerar prontuário completo
        </Button>
      </div>

      <div className="mt-4">
        <SectionHeader label="Prescrição" color="green" />
        <textarea
          placeholder={"1. Metformina 850mg — 1cp 2x/dia\n2. Losartana 50mg — 1cp/dia"}
          value={store.prescription}
          onChange={(e) => store.setPrescription(e.target.value)}
          className="w-full h-20 px-2 py-[7px] border border-border-subtle rounded-[5px] bg-bg-2 text-text-primary font-sans text-xs resize-y leading-relaxed placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)]"
        />
      </div>

      <div className="mt-4">
        <SectionHeader label="Exames a Solicitar" color="blue" />
        <textarea
          placeholder="HbA1c, lipidograma, TSH..."
          value={store.requestedExams}
          onChange={(e) => store.setRequestedExams(e.target.value)}
          className="w-full h-16 px-2 py-[7px] border border-border-subtle rounded-[5px] bg-bg-2 text-text-primary font-sans text-xs resize-y leading-relaxed placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)]"
        />
      </div>

      <div className="mt-4">
        <SectionHeader label="Orientações ao Paciente" color="amber" />
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
