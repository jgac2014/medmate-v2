"use client";

import { useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import { showToast } from "@/components/ui/toast";
import { useConsultationStore } from "@/stores/consultation-store";

interface TranscribeResult {
  matched: Record<string, string>;
  extras: string;
}

interface ExamUploadButtonProps {
  onResult: (result: TranscribeResult) => void;
}

export function ExamUploadButton({ onResult }: ExamUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const loading = useConsultationStore((s) => s.pendingUploads > 0);
  const pendingCount = useConsultationStore((s) => s.pendingUploads);
  const incrementPendingUploads = useConsultationStore((s) => s.incrementPendingUploads);
  const decrementPendingUploads = useConsultationStore((s) => s.decrementPendingUploads);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    incrementPendingUploads();

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/transcribe-exams", { method: "POST", body: formData });
      const data = await res.json();

      if (data.error === "API_NOT_CONFIGURED") {
        showToast("API de transcrição não configurada", "error");
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
      decrementPendingUploads();
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
    </div>
  );
}
