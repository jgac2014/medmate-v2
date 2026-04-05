"use client";

import { useEffect } from "react";
import { PROTOCOLS } from "@/lib/receituario/protocols";
import { getDrugById } from "@/lib/receituario/drug-db";
import type { PrescribedDrug } from "@/lib/receituario/types";

interface ProtocolsPanelProps {
  open: boolean;
  onClose: () => void;
  onApply: (meds: PrescribedDrug[]) => void;
}

export function ProtocolsPanel({ open, onClose, onApply }: ProtocolsPanelProps) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function handleApply(key: string) {
    const protocol = PROTOCOLS.find((p) => p.key === key);
    if (!protocol) return;

    const meds: PrescribedDrug[] = protocol.drugs.flatMap((pd) => {
      const drug = getDrugById(pd.drugId);
      if (!drug) return [];
      return [{
        drugId: drug.id,
        name: drug.name,
        form: drug.form,
        rxType: drug.rxType,
        type: drug.type,
        flag: drug.flag,
        posology: pd.posologyOverride ?? drug.defaultPosology,
        qty: "1 cx",
      }];
    });

    onApply(meds);
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed left-0 top-0 bottom-0 z-50 w-80 bg-surface-lowest shadow-[4px_0_30px_rgba(23,28,31,0.12)] transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/30">
            <div>
              <h3 className="text-[14px] font-semibold text-on-surface">Protocolos Clínicos</h3>
              <p className="text-[11px] text-on-surface-muted mt-0.5">Prescrições pré-configuradas por condição</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-muted hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Protocol list */}
          <div className="flex-1 overflow-y-auto py-3">
            {PROTOCOLS.map((protocol) => {
              const drugs = protocol.drugs.flatMap((pd) => {
                const d = getDrugById(pd.drugId);
                return d ? [d.name] : [];
              });

              return (
                <button
                  key={protocol.key}
                  onClick={() => handleApply(protocol.key)}
                  className="w-full text-left px-5 py-3.5 hover:bg-surface-container transition-colors cursor-pointer group border-b border-outline-variant/20 last:border-0"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">{protocol.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-on-surface group-hover:text-primary transition-colors">
                          {protocol.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-on-surface-muted mt-0.5">{protocol.subtitle}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {drugs.map((name) => (
                          <span
                            key={name}
                            className="px-2 py-0.5 text-[10px] bg-surface-container text-on-surface-variant rounded-md border border-outline-variant/30"
                          >
                            {name.split(" ").slice(0, 2).join(" ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="px-5 py-4 border-t border-outline-variant/30 bg-surface-low">
            <p className="text-[11px] text-on-surface-muted leading-relaxed">
              Protocolos são pontos de partida — revise posologia e ajuste conforme o paciente.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
