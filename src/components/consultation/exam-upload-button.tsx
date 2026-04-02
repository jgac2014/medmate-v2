"use client";

import { useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { showToast } from "@/components/ui/toast";

interface TranscribeResult {
  matched: Record<string, string>;
  extras: string;
}

interface ExamUploadButtonProps {
  onResult: (result: TranscribeResult) => void;
}

export function ExamUploadButton({ onResult }: ExamUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [notConfigured, setNotConfigured] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    setLoading(true);
    setNotConfigured(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/transcribe-exams", { method: "POST", body: formData });
      const data = await res.json();

      if (data.error === "API_NOT_CONFIGURED") {
        setNotConfigured(true);
        return;
      }

      if (data.error) {
        showToast("Erro ao processar o arquivo. Tente novamente.", "error");
        return;
      }

      const matchedCount = Object.keys(data.matched ?? {}).length;
      if (matchedCount === 0 && !data.extras) {
        showToast("Nenhum valor de exame encontrado no arquivo.", "info");
        return;
      }

      onResult({ matched: data.matched ?? {}, extras: data.extras ?? "" });
    } catch {
      showToast("Erro ao enviar o arquivo. Verifique sua conexão.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={handleFile}
      />
      <button
        type="button"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg border border-outline-variant/40 bg-surface-low text-on-surface-muted hover:text-on-surface hover:border-outline-variant/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <Upload size={12} />
        )}
        {loading ? "Processando..." : "Importar PDF / imagem"}
      </button>

      {notConfigured && (
        <p className="mt-1.5 text-[11px] text-status-warn">
          Funcionalidade indisponível. Configure{" "}
          <code className="font-mono">ANTHROPIC_API_KEY</code> nas variáveis de ambiente do Vercel.
        </p>
      )}
    </div>
  );
}
