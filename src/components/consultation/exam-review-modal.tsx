"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";
import { useConsultationStore } from "@/stores/consultation-store";
import { EXAM_CARDS } from "@/lib/constants";
import { showToast } from "@/components/ui/toast";

interface ExamReviewModalProps {
  open: boolean;
  matched: Record<string, string>;
  extras: string;
  onClose: () => void;
}

const KEY_LABELS: Record<string, string> = Object.fromEntries(
  EXAM_CARDS.flatMap((c) => c.fields.map((f) => [f.key, `${c.title} — ${f.label}`]))
);

function ExamReviewContent({ matched, extras, onClose }: { matched: Record<string, string>; extras: string; onClose: () => void }) {
  const { setLab, setLabsExtras } = useConsultationStore();
  const [editableValues, setEditableValues] = useState({ ...matched });

  const matchedKeys = Object.keys(editableValues);
  const hasExtras = extras.trim().length > 0;

  function handleApply() {
    const today = new Date().toISOString().split("T")[0];
    matchedKeys.forEach((key) => {
      const val = editableValues[key]?.trim();
      if (val) setLab(key, val);
    });
    if (hasExtras) {
      const existing = useConsultationStore.getState().labsExtras;
      const merged = existing ? `${existing}\n${extras}` : extras;
      setLabsExtras(merged);
    }
    useConsultationStore.getState().setLabsDate(today);
    const count = matchedKeys.length + (hasExtras ? 1 : 0);
    showToast(`${count} valor${count !== 1 ? "es" : ""} de exame aplicado${count !== 1 ? "s" : ""}`, "success");
    onClose();
  }

  return (
    <div className="bg-surface-low border border-outline-variant/30 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/20">
        <div>
          <h2 className="text-[14px] font-semibold text-on-surface">Revisão dos exames importados</h2>
          <p className="text-[11px] text-on-surface-muted mt-0.5">
            {matchedKeys.length} valor{matchedKeys.length !== 1 ? "es" : ""} reconhecido{matchedKeys.length !== 1 ? "s" : ""}. Edite se necessário antes de aplicar.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-on-surface-muted hover:text-on-surface transition-colors p-1"
        >
          <X size={16} />
        </button>
      </div>

      {/* Body */}
      <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
        {matchedKeys.length > 0 && (
          <div className="space-y-2">
            {matchedKeys.map((key) => (
              <div key={key} className="flex items-center gap-3">
                <span className="text-[12px] text-on-surface-muted flex-1 truncate">
                  {KEY_LABELS[key] ?? key}
                </span>
                <input
                  type="text"
                  value={editableValues[key] ?? ""}
                  onChange={(e) =>
                    setEditableValues((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  className="w-24 text-[12px] text-on-surface bg-surface border border-outline-variant/40 rounded px-2 py-1 focus:outline-none focus:border-primary text-right font-mono"
                />
              </div>
            ))}
          </div>
        )}

        {hasExtras && (
          <div className="space-y-1.5">
            <p className="text-[11px] text-on-surface-muted font-medium">
              Valores não reconhecidos — copie manualmente se necessário
            </p>
            <textarea
              readOnly
              value={extras}
              rows={Math.min(6, extras.split("\n").length + 1)}
              className="w-full text-[12px] text-on-surface-muted bg-surface border border-outline-variant/20 rounded-lg px-3 py-2 resize-none font-mono cursor-text focus:outline-none"
            />
          </div>
        )}

        {matchedKeys.length === 0 && !hasExtras && (
          <p className="text-[12px] text-on-surface-muted text-center py-4">
            Nenhum valor encontrado no documento.
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-outline-variant/20">
        <button
          type="button"
          onClick={onClose}
          className="text-[12px] text-on-surface-muted hover:text-on-surface transition-colors px-4 py-2"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleApply}
          disabled={matchedKeys.length === 0 && !hasExtras}
          className="flex items-center gap-1.5 text-[12px] px-4 py-2 rounded-lg bg-primary text-black font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Check size={13} />
          Aplicar {matchedKeys.length > 0 ? `${matchedKeys.length} campo${matchedKeys.length !== 1 ? "s" : ""}` : "extras"}
        </button>
      </div>
    </div>
  );
}

export function ExamReviewModal({ open, matched, extras, onClose }: ExamReviewModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] bg-black/60 flex items-center justify-center p-4">
      <ExamReviewContent key={JSON.stringify(matched)} matched={matched} extras={extras} onClose={onClose} />
    </div>
  );
}
