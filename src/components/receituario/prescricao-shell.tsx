'use client'

"use client";

import { useCallback } from "react";
import { useReceituarioStore } from "@/stores/receituario-store";
import { checkInteractions } from "@/lib/receituario/interactions";
import type { Drug } from "@/lib/receituario/types";
import type { PrescribedDrug } from "@/lib/receituario/types";

import { DrugSearch } from "./drug-search";
import { DrugList } from "./drug-list";
import { PreviewPanel } from "./preview-panel";
import { ProtocolsPanel } from "./protocols-panel";
import { CustomizePanel } from "./customize-panel";
import { SendScreen } from "./send-screen";

const RX_TYPE_LABEL: Record<string, string> = {
  "Receita Simples": "Simples",
  "Notificação Branca": "Ctrl. Esp.",
  "Notificação Especial Amarela": "Ntf. Amarela",
  "Receita Azul": "Receita Azul",
};

export function PrescricaoShell() {
  const {
    screen, setScreen,
    meds, addMed, removeMed, updateMedPosology, updateMedQty, clearMeds,
    patient, setPatient,
    doctor,
    customization, setCustomization,
    useDigitalSignature, setUseDigitalSignature,
    protocolsPanelOpen, setProtocolsPanelOpen,
    customizePanelOpen, setCustomizePanelOpen,
    setDoctor,
    reset,
  } = useReceituarioStore();

  const interactions = checkInteractions(meds);

  // Derived state
  const hasCtrl = meds.some((m) => m.type === "ctrl");
  const hasSimples = meds.some((m) => m.type !== "ctrl");
  const hasMixed = hasCtrl && hasSimples;
  const rxCount = hasMixed ? 2 : (meds.length > 0 ? 1 : 0);

  const handleDrugSelect = useCallback(
    (drug: Drug) => {
      const med: PrescribedDrug = {
        drugId: drug.id,
        name: drug.name,
        form: drug.form,
        rxType: drug.rxType,
        type: drug.type,
        flag: drug.flag,
        posology: drug.defaultPosology,
        qty: "1 cx",
      };
      addMed(med);
    },
    [addMed]
  );

  const handleProtocolApply = useCallback(
    (protocolMeds: PrescribedDrug[]) => {
      protocolMeds.forEach((m) => addMed(m));
    },
    [addMed]
  );

  if (screen === "send") {
    return (
      <>
        <ProtocolsPanel
          open={protocolsPanelOpen}
          onClose={() => setProtocolsPanelOpen(false)}
          onApply={handleProtocolApply}
        />
        <CustomizePanel
          open={customizePanelOpen}
          onClose={() => setCustomizePanelOpen(false)}
          customization={customization}
          doctor={doctor}
          onUpdateCustomization={setCustomization}
          onUpdateDoctor={setDoctor}
        />
        <SendScreen
          meds={meds}
          patient={patient}
          doctor={doctor}
          useDigitalSignature={useDigitalSignature}
          onBack={() => setScreen("create")}
          onNewPrescription={reset}
        />
      </>
    );
  }

  return (
    <>
      <ProtocolsPanel
        open={protocolsPanelOpen}
        onClose={() => setProtocolsPanelOpen(false)}
        onApply={handleProtocolApply}
      />
      <CustomizePanel
        open={customizePanelOpen}
        onClose={() => setCustomizePanelOpen(false)}
        customization={customization}
        doctor={doctor}
        onUpdateCustomization={setCustomization}
        onUpdateDoctor={setDoctor}
      />

      {/* Split screen layout */}
      <div className="flex h-[calc(100vh-56px)] overflow-hidden">
        {/* ─── Editor panel ─────────────────────────────────────── */}
        <div className="w-[520px] shrink-0 flex flex-col border-r border-outline-variant/30 bg-surface-lowest overflow-hidden">
          {/* Editor header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-outline-variant/30 bg-surface-low shrink-0">
            <div className="flex items-center gap-3">
              <h2 className="text-[14px] font-semibold text-on-surface">Prescrição</h2>
              {/* Smart pills */}
              <div className="flex items-center gap-1.5">
                {rxCount > 0 && (
                  <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
                    hasMixed
                      ? "bg-amber-100 text-amber-800 border-amber-200"
                      : hasCtrl
                      ? "bg-purple-100 text-purple-800 border-purple-200"
                      : "bg-green-100 text-green-800 border-green-200"
                  }`}>
                    {rxCount === 2 ? "2 receituários" : hasMixed ? "" : hasCtrl ? "Ctrl. Esp." : "Simples"}
                  </span>
                )}
                {interactions.length > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">
                    ⚠ {interactions.length} interação{interactions.length > 1 ? "ões" : ""}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setProtocolsPanelOpen(true)}
                className="flex items-center gap-1.5 h-7 px-2.5 text-[11px] font-medium text-on-surface-variant hover:text-primary hover:bg-primary/8 border border-outline-variant/40 rounded-lg transition-all cursor-pointer"
              >
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                  <path d="M2 3h8M2 6h6M2 9h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Protocolos
              </button>
              {meds.length > 0 && (
                <button
                  onClick={clearMeds}
                  className="h-7 px-2.5 text-[11px] font-medium text-on-surface-muted hover:text-red-600 hover:bg-red-50 border border-outline-variant/40 rounded-lg transition-all cursor-pointer"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          {/* Editor body — scrollable */}
          <div className="flex-1 overflow-y-auto">
            {/* Patient */}
            <div className="px-5 pt-5 pb-4 border-b border-outline-variant/20">
              <h3 className="text-[11px] font-semibold text-on-surface-muted uppercase tracking-wide mb-3">
                Paciente
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-on-surface-variant mb-1">Nome</label>
                  <input
                    type="text"
                    value={patient.name}
                    onChange={(e) => setPatient({ name: e.target.value })}
                    placeholder="Nome completo"
                    className="w-full bg-surface-container/50 border border-outline-variant/30 rounded-lg px-3 py-2 text-[12px] text-on-surface placeholder:text-on-surface-muted outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-on-surface-variant mb-1">CPF</label>
                  <input
                    type="text"
                    value={patient.cpf}
                    onChange={(e) => setPatient({ cpf: e.target.value })}
                    placeholder="000.000.000-00"
                    className="w-full bg-surface-container/50 border border-outline-variant/30 rounded-lg px-3 py-2 text-[12px] text-on-surface placeholder:text-on-surface-muted outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/10 transition-all"
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-[11px] font-medium text-on-surface-variant mb-1">Data</label>
                <input
                  type="text"
                  value={patient.date}
                  onChange={(e) => setPatient({ date: e.target.value })}
                  className="w-full bg-surface-container/50 border border-outline-variant/30 rounded-lg px-3 py-2 text-[12px] text-on-surface placeholder:text-on-surface-muted outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>

            {/* Drug search */}
            <div className="px-5 pt-4 pb-3 border-b border-outline-variant/20">
              <h3 className="text-[11px] font-semibold text-on-surface-muted uppercase tracking-wide mb-3">
                Adicionar Medicamento
              </h3>
              <DrugSearch onSelect={handleDrugSelect} />
            </div>

            {/* Drug list */}
            <div className="px-5 pt-4 pb-5">
              <DrugList
                meds={meds}
                interactions={interactions}
                onUpdatePosology={updateMedPosology}
                onUpdateQty={updateMedQty}
                onRemove={removeMed}
              />
            </div>
          </div>

          {/* Editor footer */}
          <div className="shrink-0 px-5 py-4 border-t border-outline-variant/30 bg-surface-low">
            {/* Interaction warnings */}
            {interactions.length > 0 && (
              <div className="mb-3 space-y-1.5">
                {interactions.map((ix, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2 px-3 py-2 rounded-xl text-[11px] ${
                      ix.severity === "danger"
                        ? "bg-red-50 border border-red-200 text-red-800"
                        : "bg-amber-50 border border-amber-200 text-amber-800"
                    }`}
                  >
                    <span className="shrink-0 mt-0.5">{ix.severity === "danger" ? "⛔" : "⚠️"}</span>
                    <div>
                      <span className="font-semibold">{ix.drugs.join(" + ")}: </span>
                      {ix.message}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Assinatura digital toggle */}
            <div className="flex items-center justify-between mb-3 py-2 px-3 bg-surface-container rounded-xl">
              <div>
                <p className="text-[12px] font-medium text-on-surface">Assinatura Digital ICP-Brasil</p>
                <p className="text-[10px] text-on-surface-muted">Requer certificado A1/A3 ou VIDAS CFM</p>
              </div>
              <button
                onClick={() => setUseDigitalSignature(!useDigitalSignature)}
                className={`relative w-10 h-5.5 rounded-full transition-colors cursor-pointer ${
                  useDigitalSignature ? "bg-primary" : "bg-outline-variant"
                }`}
                style={{ height: "22px" }}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform ${
                    useDigitalSignature ? "translate-x-[18px]" : "translate-x-0"
                  }`}
                  style={{ width: "18px", height: "18px" }}
                />
              </button>
            </div>

            {/* CTA */}
            <button
              disabled={meds.length === 0}
              onClick={() => setScreen("send")}
              className="w-full py-3 rounded-xl text-[14px] font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-primary text-on-primary hover:bg-primary-container active:scale-[0.99]"
            >
              {meds.length === 0
                ? "Adicione ao menos 1 medicamento"
                : `Avançar → ${rxCount > 0 ? `${rxCount} receituário${rxCount > 1 ? "s" : ""}` : ""}`}
            </button>
          </div>
        </div>

        {/* ─── Preview panel ─────────────────────────────────────── */}
        <div className="flex-1 overflow-hidden">
          <PreviewPanel
            meds={meds}
            patient={patient}
            doctor={doctor}
            customization={customization}
            onCustomize={() => setCustomizePanelOpen(true)}
          />
        </div>
      </div>
    </>
  );
}
