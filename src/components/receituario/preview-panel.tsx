'use client'

"use client";

import type { PrescribedDrug, RxCustomization, DoctorProfile, RxPatient } from "@/lib/receituario/types";

interface PreviewPanelProps {
  meds: PrescribedDrug[];
  patient: RxPatient;
  doctor: DoctorProfile;
  customization: RxCustomization;
  onCustomize: () => void;
}

const SPACING_MAP = {
  compact: "6px",
  normal: "12px",
  relaxed: "20px",
};

function SimplesPreview({
  meds,
  patient,
  doctor,
  customization,
}: Omit<PreviewPanelProps, "onCustomize">) {
  const simpleMeds = meds.filter((m) => m.type !== "ctrl");
  const allMeds = simpleMeds.length > 0 ? simpleMeds : meds;

  const align = customization.align === "center" ? "text-center" : "text-left";
  const spacing = SPACING_MAP[customization.lineSpacing];

  return (
    <div
      className="bg-white shadow-sm border border-slate-200 rounded-sm"
      style={{
        width: "210mm",
        minHeight: "148mm",
        padding: "14mm 16mm",
        fontFamily: customization.bodyFont,
        fontSize: "11px",
        color: "#1a1a1a",
        lineHeight: "1.5",
      }}
    >
      {/* Cabeçalho */}
      <div className={`pb-3 mb-3 border-b border-slate-200 ${align}`}>
        <p
          style={{
            fontFamily: customization.nameFont,
            fontSize: `${customization.nameSize}px`,
            color: customization.nameColor,
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          {doctor.name || "Dr. Seu Nome"}
        </p>
        <p
          style={{
            fontFamily: customization.descFont,
            fontSize: `${customization.descSize}px`,
            color: customization.descColor,
            marginTop: "2px",
          }}
        >
          {doctor.specialty || "Especialidade"}
          {doctor.crm ? ` — ${doctor.crm}` : ""}
        </p>
        {doctor.address && (
          <p style={{ fontSize: "10px", color: "#9ca3af", marginTop: "2px" }}>
            {doctor.address}{doctor.phone ? ` · ${doctor.phone}` : ""}
          </p>
        )}
      </div>

      {/* Título */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          RECEITUÁRIO SIMPLES
        </p>
        <p className="text-[10px] text-slate-500">{patient.date}</p>
      </div>

      {/* Paciente */}
      <div className="mb-4">
        <p className="text-[11px]">
          <span className="text-slate-500">Paciente: </span>
          <span className="font-medium">{patient.name || "_________________________________"}</span>
        </p>
        {patient.address && (
          <p className="text-[11px] mt-0.5">
            <span className="text-slate-500">Endereço: </span>
            {patient.address}
          </p>
        )}
      </div>

      {/* Medicamentos */}
      <div>
        {allMeds.length === 0 ? (
          <p className="text-[11px] text-slate-400 italic">Adicione medicamentos na coluna ao lado</p>
        ) : (
          allMeds.map((med, i) => (
            <div key={med.drugId} style={{ marginBottom: spacing }}>
              <p style={{ fontWeight: 600, fontSize: "11px" }}>
                {i + 1}. {med.name}
                {med.qty ? ` — ${med.qty}` : ""}
              </p>
              <p style={{ fontSize: "11px", color: "#4b5563", marginLeft: "14px" }}>
                {med.posology}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Assinatura */}
      <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end">
        <div className="text-center w-48">
          <div className="h-8 border-b border-slate-300" />
          <p className="text-[10px] text-slate-500 mt-1">Assinatura e Carimbo</p>
        </div>
      </div>
    </div>
  );
}

function EspecialPreview({
  meds,
  patient,
  doctor,
  customization,
}: Omit<PreviewPanelProps, "onCustomize">) {
  const ctrlMeds = meds.filter((m) => m.type === "ctrl");
  const spacing = SPACING_MAP[customization.lineSpacing];

  return (
    <div
      className="bg-white shadow-sm border border-slate-200 rounded-sm"
      style={{
        width: "210mm",
        fontFamily: customization.bodyFont,
        fontSize: "10px",
        color: "#1a1a1a",
        lineHeight: "1.4",
      }}
    >
      {/* Cabeçalho oficial CFM */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px" }}>
        <tbody>
          <tr>
            <td style={{ border: "1px solid #ccc", padding: "8px 10px", width: "55%", verticalAlign: "top" }}>
              <p style={{ fontWeight: 700, fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280" }}>
                IDENTIFICAÇÃO DO EMITENTE
              </p>
              <p style={{ marginTop: "4px", fontWeight: 700, fontSize: "12px", color: customization.nameColor, fontFamily: customization.nameFont }}>
                {doctor.name || "Dr. Seu Nome"}
              </p>
              <p style={{ fontSize: "10px", color: "#6b7280" }}>
                {doctor.specialty || "Especialidade"}{doctor.crm ? ` — ${doctor.crm}` : ""}
              </p>
              {doctor.address && (
                <p style={{ fontSize: "9px", color: "#9ca3af", marginTop: "2px" }}>
                  {doctor.address}
                </p>
              )}
              {doctor.phone && (
                <p style={{ fontSize: "9px", color: "#9ca3af" }}>Tel: {doctor.phone}</p>
              )}
            </td>
            <td style={{ border: "1px solid #ccc", padding: "8px 10px", verticalAlign: "top" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "11px", textTransform: "uppercase" }}>
                    RECEITUÁRIO DE CONTROLE ESPECIAL
                  </p>
                  <p style={{ fontSize: "9px", color: "#6b7280" }}>Notificação de Receita — 2 vias</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "9px", color: "#6b7280" }}>DATA</p>
                  <p style={{ fontSize: "10px", fontWeight: 600 }}>{patient.date}</p>
                </div>
              </div>
              <div style={{ marginTop: "8px", fontSize: "9px", color: "#6b7280" }}>
                <span style={{ marginRight: "16px" }}>□ 1ª VIA FARMÁCIA</span>
                <span>□ 2ª VIA PACIENTE</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Corpo */}
      <div style={{ padding: "10px 12px" }}>
        <div style={{ marginBottom: "10px" }}>
          <span style={{ fontSize: "10px", color: "#6b7280" }}>Paciente: </span>
          <span style={{ fontWeight: 600 }}>{patient.name || "_________________________________"}</span>
        </div>
        {patient.address && (
          <div style={{ marginBottom: "8px" }}>
            <span style={{ fontSize: "10px", color: "#6b7280" }}>Endereço: </span>
            {patient.address}
          </div>
        )}

        <p style={{ fontWeight: 700, fontSize: "10px", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          Prescrição:
        </p>
        {ctrlMeds.length === 0 ? (
          <p style={{ fontSize: "10px", color: "#9ca3af", fontStyle: "italic" }}>
            Adicione medicamentos de controle especial na coluna ao lado
          </p>
        ) : (
          ctrlMeds.map((med, i) => (
            <div key={med.drugId} style={{ marginBottom: spacing }}>
              <p style={{ fontWeight: 600 }}>
                {i + 1}. {med.name}
                {med.qty ? ` — ${med.qty}` : ""}
              </p>
              <p style={{ color: "#4b5563", paddingLeft: "14px" }}>{med.posology}</p>
            </div>
          ))
        )}

        {/* Assinatura */}
        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <div style={{ display: "inline-block", width: "180px" }}>
            <div style={{ borderBottom: "1px solid #d1d5db", height: "28px" }} />
            <p style={{ fontSize: "9px", color: "#9ca3af", marginTop: "3px" }}>Assinatura e Carimbo do Médico</p>
          </div>
        </div>
      </div>

      {/* Rodapé identificação */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9px" }}>
        <tbody>
          <tr>
            <td style={{ border: "1px solid #ccc", padding: "6px 10px", width: "55%", verticalAlign: "top" }}>
              <p style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "#6b7280" }}>
                IDENTIFICAÇÃO DO COMPRADOR
              </p>
              <div style={{ marginTop: "4px", lineHeight: "1.8" }}>
                <p>Nome: _________________________________</p>
                <p>RG/CPF: _________________________________</p>
                <p>End.: __________________________________</p>
                <p>Tel.: ___________ Cidade: _______________</p>
              </div>
            </td>
            <td style={{ border: "1px solid #ccc", padding: "6px 10px", verticalAlign: "top" }}>
              <p style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "#6b7280" }}>
                IDENTIFICAÇÃO DO FORNECEDOR
              </p>
              <div style={{ marginTop: "4px", lineHeight: "1.8" }}>
                <p>Farmácia: _______________________________</p>
                <p>CNPJ: __________________________________</p>
                <p>Data: ____________ Nº: __________________</p>
                <p>Assinatura Farmacêutico: _________________</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function PreviewPanel({ meds, patient, doctor, customization, onCustomize }: PreviewPanelProps) {
  const hasCtrl = meds.some((m) => m.type === "ctrl");
  const hasSimples = meds.some((m) => m.type !== "ctrl");
  const hasOnly = !hasSimples && hasCtrl;

  const showSimples = hasSimples || meds.length === 0;
  const showEspecial = hasCtrl;

  return (
    <div className="relative h-full flex flex-col">
      {/* Preview header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-outline-variant/30 bg-surface-low">
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide">
            Pré-visualização
          </span>
          {hasCtrl && hasSimples && (
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-800 rounded-full border border-amber-200">
              2 receitas geradas
            </span>
          )}
        </div>
        <button
          onClick={onCustomize}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-on-surface-variant hover:text-primary hover:bg-surface-container border border-outline-variant/40 rounded-lg transition-all cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
            <path d="M9.293 2.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-7 7A1 1 0 016 14H3a1 1 0 01-1-1v-3a1 1 0 01.293-.707l7-7z" fill="currentColor" />
          </svg>
          Personalizar
        </button>
      </div>

      {/* Paper area */}
      <div className="flex-1 overflow-y-auto bg-surface-low px-6 py-6">
        <div className="space-y-6" style={{ maxWidth: "210mm" }}>
          {showSimples && !hasOnly && (
            <div>
              {hasCtrl && hasSimples && (
                <p className="text-[11px] font-semibold text-on-surface-muted uppercase tracking-wide mb-2">
                  Receita Simples
                </p>
              )}
              <SimplesPreview
                meds={meds}
                patient={patient}
                doctor={doctor}
                customization={customization}
              />
            </div>
          )}

          {showEspecial && (
            <div>
              {hasCtrl && hasSimples && (
                <p className="text-[11px] font-semibold text-on-surface-muted uppercase tracking-wide mb-2">
                  Receituário de Controle Especial
                </p>
              )}
              <EspecialPreview
                meds={meds}
                patient={patient}
                doctor={doctor}
                customization={customization}
              />
            </div>
          )}

          {hasOnly && (
            <EspecialPreview
              meds={meds}
              patient={patient}
              doctor={doctor}
              customization={customization}
            />
          )}
        </div>
      </div>
    </div>
  );
}
