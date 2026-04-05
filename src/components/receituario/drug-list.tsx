"use client";

import type { PrescribedDrug } from "@/lib/receituario/types";
import type { ActiveInteraction } from "@/lib/receituario/interactions";

interface DrugListProps {
  meds: PrescribedDrug[];
  interactions: ActiveInteraction[];
  onUpdatePosology: (drugId: string, posology: string) => void;
  onUpdateQty: (drugId: string, qty: string) => void;
  onRemove: (drugId: string) => void;
}

const FLAG_COLORS: Record<string, string> = {
  ATB: "text-amber-700 bg-amber-50 border-amber-200",
  A1: "text-red-700 bg-red-50 border-red-200",
  A2: "text-red-700 bg-red-50 border-red-200",
  A3: "text-red-700 bg-red-50 border-red-200",
  B1: "text-purple-700 bg-purple-50 border-purple-200",
  B2: "text-purple-700 bg-purple-50 border-purple-200",
  C1: "text-blue-700 bg-blue-50 border-blue-200",
  C2: "text-blue-700 bg-blue-50 border-blue-200",
  C3: "text-blue-700 bg-blue-50 border-blue-200",
  C4: "text-blue-700 bg-blue-50 border-blue-200",
  C5: "text-blue-700 bg-blue-50 border-blue-200",
};

function drugHasInteraction(name: string, interactions: ActiveInteraction[]): boolean {
  return interactions.some((ix) =>
    ix.drugs.some((d) => d.toLowerCase() === name.toLowerCase())
  );
}

export function DrugList({ meds, interactions, onUpdatePosology, onUpdateQty, onRemove }: DrugListProps) {
  if (meds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-on-surface-muted" viewBox="0 0 24 24" fill="none">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-[13px] font-medium text-on-surface-variant">Nenhum medicamento adicionado</p>
        <p className="text-[12px] text-on-surface-muted mt-1">Busque pelo nome acima ou use um protocolo</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {meds.map((med, idx) => {
        const hasIx = drugHasInteraction(med.name, interactions);
        const isCtrl = med.type === "ctrl";

        return (
          <div
            key={med.drugId}
            className={`rounded-xl border transition-all ${
              hasIx
                ? "border-red-200 bg-red-50/50"
                : isCtrl
                ? "border-purple-200/60 bg-purple-50/30"
                : "border-outline-variant/40 bg-surface-lowest"
            }`}
          >
            {/* Drug header */}
            <div className="flex items-center gap-3 px-4 pt-3 pb-2">
              <span className="text-[12px] font-mono text-on-surface-muted w-5 shrink-0">{idx + 1}.</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[13px] font-semibold text-on-surface">{med.name}</span>
                  {med.flag && (
                    <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded border ${FLAG_COLORS[med.flag] ?? "text-on-surface-muted bg-surface-container border-outline-variant/40"}`}>
                      {med.flag}
                    </span>
                  )}
                  {hasIx && (
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded border text-red-700 bg-red-100 border-red-200">
                      ⚠ Interação
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-on-surface-muted mt-0.5">{med.form}</p>
              </div>
              <button
                onClick={() => onRemove(med.drugId)}
                className="shrink-0 w-7 h-7 rounded-lg hover:bg-red-100 text-on-surface-muted hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                title="Remover"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Posology */}
            <div className="px-4 pb-3">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-[10px] font-semibold text-on-surface-muted uppercase tracking-wide mb-1">
                    Posologia
                  </label>
                  <input
                    type="text"
                    value={med.posology}
                    onChange={(e) => onUpdatePosology(med.drugId, e.target.value)}
                    className="w-full bg-surface-container/50 border border-outline-variant/30 rounded-lg px-3 py-1.5 text-[12px] text-on-surface placeholder:text-on-surface-muted outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/10 transition-all"
                    placeholder="Posologia..."
                  />
                </div>
                <div className="w-20">
                  <label className="block text-[10px] font-semibold text-on-surface-muted uppercase tracking-wide mb-1">
                    Qtd.
                  </label>
                  <input
                    type="text"
                    value={med.qty}
                    onChange={(e) => onUpdateQty(med.drugId, e.target.value)}
                    className="w-full bg-surface-container/50 border border-outline-variant/30 rounded-lg px-3 py-1.5 text-[12px] text-on-surface placeholder:text-on-surface-muted outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/10 transition-all"
                    placeholder="Qtd."
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
