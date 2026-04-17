"use client";

import { useEffect, useRef, useState } from "react";
import type { PatientAllergy } from "@/lib/supabase/patient-allergies";
import { showToast } from "@/components/ui/toast";
import { upsertPatientAllergies } from "@/lib/supabase/patient-allergies";

interface AllergyPopoverProps {
  open: boolean;
  initialAllergy?: PatientAllergy;
  userId: string;
  patientId: string;
  onSaved: () => void;
  onClose: () => void;
}

type Severity = "leve" | "moderada" | "grave";

const SEVERITY_LABELS: Record<Severity, string> = {
  leve: "Leve",
  moderada: "Moderada",
  grave: "Grave",
};

export function AllergyPopover({
  open,
  initialAllergy,
  userId,
  patientId,
  onSaved,
  onClose,
}: AllergyPopoverProps) {
  const [text, setText] = useState(initialAllergy?.allergy_text ?? "");
  const [severity, setSeverity] = useState<Severity>(
    initialAllergy?.severity ?? "moderada"
  );
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setText(initialAllergy?.allergy_text ?? "");
      setSeverity(initialAllergy?.severity ?? "moderada");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, initialAllergy]);

  async function handleSave() {
    const trimmed = text.trim();
    if (!trimmed) {
      showToast("Informe o texto da alergia", "error");
      return;
    }
    setSaving(true);
    try {
      await upsertPatientAllergies(userId, patientId, [
        {
          id: initialAllergy?.id,
          text: trimmed,
          severity,
          active: true,
        },
      ]);
      showToast(
        initialAllergy ? "Alergia atualizada" : "Alergia adicionada",
        "success"
      );
      onSaved();
      onClose();
    } catch {
      showToast("Erro ao salvar alergia", "error");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Popover */}
      <div className="fixed top-1/2 left-1/2 z-50 w-80 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-outline-variant/30 bg-surface-lowest shadow-[0_8px_30px_rgba(23,28,31,0.12)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-headline text-[15px] font-semibold text-on-surface">
            {initialAllergy ? "Editar alergia" : "Adicionar alergia"}
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-on-surface-muted hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {/* Texto */}
        <div className="mb-4">
          <label className="text-[11px] font-medium text-on-surface-muted uppercase tracking-wide mb-1.5 block">
            Descrição da alergia
          </label>
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            placeholder="Ex: dipirona, penicilina, sulfa..."
            className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-lowest text-[13px] text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Gravidade */}
        <div className="mb-5">
          <label className="text-[11px] font-medium text-on-surface-muted uppercase tracking-wide mb-2 block">
            Gravidade
          </label>
          <div className="flex gap-2">
            {(["leve", "moderada", "grave"] as Severity[]).map((s) => (
              <button
                key={s}
                onClick={() => setSeverity(s)}
                className={`flex-1 py-2 rounded-lg text-[12px] font-semibold border transition-colors cursor-pointer ${
                  severity === s
                    ? s === "grave"
                      ? "bg-error text-white border-error"
                      : s === "moderada"
                      ? "bg-error-container text-error border-error/30"
                      : "bg-surface-high text-on-surface border-outline-variant"
                    : "bg-surface-lowest text-on-surface-variant border-outline-variant/50 hover:bg-surface-container"
                }`}
              >
                {SEVERITY_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg text-[12px] font-medium text-on-surface-variant border border-outline-variant/50 hover:bg-surface-container transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2 rounded-lg text-[12px] font-bold bg-primary text-on-primary hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </>
  );
}