"use client";

import type { PrescribedDrug, RxPatient, DoctorProfile } from "@/lib/receituario/types";

interface SendScreenProps {
  meds: PrescribedDrug[];
  patient: RxPatient;
  doctor: DoctorProfile;
  useDigitalSignature: boolean;
  onBack: () => void;
  onNewPrescription: () => void;
}

export function SendScreen({
  meds,
  patient,
  doctor,
  useDigitalSignature,
  onBack,
  onNewPrescription,
}: SendScreenProps) {
  const simpleMeds = meds.filter((m) => m.type !== "ctrl");
  const ctrlMeds = meds.filter((m) => m.type === "ctrl");
  const hasSimples = simpleMeds.length > 0;
  const hasCtrl = ctrlMeds.length > 0;

  const rxGroups = [
    ...(hasSimples ? [{ label: "Receita Simples", meds: simpleMeds, isCtrl: false }] : []),
    ...(hasCtrl ? [{ label: "Receituário Controle Especial", meds: ctrlMeds, isCtrl: true }] : []),
    ...(!hasSimples && !hasCtrl ? [{ label: "Receita Simples", meds, isCtrl: false }] : []),
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Nav */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-outline-variant/30 bg-surface-low">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[13px] font-medium text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Voltar
        </button>
        <span className="text-outline-variant/40">·</span>
        <span className="text-[13px] font-semibold text-on-surface">Enviar Receita</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
          {/* Assinatura digital */}
          <div className={`rounded-2xl p-6 ${
            useDigitalSignature
              ? "bg-gradient-to-br from-primary to-primary-container text-on-primary"
              : "bg-surface-container border border-outline-variant/30"
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                useDigitalSignature ? "bg-white/20" : "bg-surface-highest"
              }`}>
                <svg className={`w-6 h-6 ${useDigitalSignature ? "text-white" : "text-on-surface-muted"}`} viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className={`text-[14px] font-semibold ${useDigitalSignature ? "text-white" : "text-on-surface"}`}>
                  {useDigitalSignature ? "Assinatura Digital ICP-Brasil ativa" : "Assinatura Física"}
                </p>
                <p className={`text-[12px] mt-0.5 ${useDigitalSignature ? "text-white/70" : "text-on-surface-muted"}`}>
                  {useDigitalSignature
                    ? "Documento com validade jurídica — pronto para envio digital"
                    : "Imprima e assine fisicamente antes de entregar ao paciente"}
                </p>
              </div>
            </div>
            {!useDigitalSignature && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-[11px] text-amber-800">
                  Para habilitar assinatura digital ICP-Brasil, vá em{" "}
                  <span className="font-semibold">Minha conta → Certificado Digital</span>.
                  Médicos CFM podem solicitar certificado VIDAS gratuitamente.
                </p>
              </div>
            )}
          </div>

          {/* Resumo dos receituários */}
          {rxGroups.map(({ label, meds: groupMeds, isCtrl }) => (
            <div
              key={label}
              className={`rounded-2xl border overflow-hidden ${
                isCtrl ? "border-purple-200/60" : "border-outline-variant/40"
              }`}
            >
              <div className={`flex items-center justify-between px-5 py-3 ${
                isCtrl ? "bg-purple-50 border-b border-purple-200/40" : "bg-surface-container border-b border-outline-variant/20"
              }`}>
                <div className="flex items-center gap-2">
                  {isCtrl && (
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                  )}
                  <span className={`text-[12px] font-semibold ${isCtrl ? "text-purple-800" : "text-on-surface-variant"}`}>
                    {label}
                  </span>
                  <span className={`text-[11px] ${isCtrl ? "text-purple-600" : "text-on-surface-muted"}`}>
                    · {groupMeds.length} {groupMeds.length === 1 ? "item" : "itens"}
                  </span>
                </div>
                {isCtrl && (
                  <span className="text-[10px] text-purple-600 font-medium">2 vias obrigatórias</span>
                )}
              </div>
              <div className="divide-y divide-outline-variant/20 bg-surface-lowest">
                {groupMeds.map((med) => (
                  <div key={med.drugId} className="flex items-start gap-3 px-5 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-on-surface">{med.name}</p>
                      <p className="text-[11px] text-on-surface-muted mt-0.5 line-clamp-2">{med.posology}</p>
                    </div>
                    {med.qty && (
                      <span className="shrink-0 text-[11px] text-on-surface-muted bg-surface-container px-2 py-0.5 rounded-md">
                        {med.qty}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Paciente */}
          <div className="rounded-2xl border border-outline-variant/40 bg-surface-lowest overflow-hidden">
            <div className="px-5 py-3 bg-surface-container border-b border-outline-variant/20">
              <span className="text-[12px] font-semibold text-on-surface-variant">Dados do Paciente</span>
            </div>
            <div className="px-5 py-4 space-y-2">
              <div className="flex gap-2 text-[13px]">
                <span className="text-on-surface-muted w-20 shrink-0">Paciente</span>
                <span className="font-medium text-on-surface">{patient.name || "—"}</span>
              </div>
              {patient.cpf && (
                <div className="flex gap-2 text-[13px]">
                  <span className="text-on-surface-muted w-20 shrink-0">CPF</span>
                  <span className="font-medium text-on-surface">{patient.cpf}</span>
                </div>
              )}
              <div className="flex gap-2 text-[13px]">
                <span className="text-on-surface-muted w-20 shrink-0">Data</span>
                <span className="font-medium text-on-surface">{patient.date}</span>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="grid grid-cols-3 gap-3">
            <button className="flex flex-col items-center gap-2 py-4 rounded-xl border border-outline-variant/40 bg-surface-lowest hover:bg-surface-container transition-all cursor-pointer group">
              <div className="w-9 h-9 rounded-xl bg-surface-container group-hover:bg-surface-high flex items-center justify-center transition-colors">
                <svg className="w-4.5 h-4.5 text-on-surface-variant" viewBox="0 0 20 20" fill="none">
                  <path d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L13.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m7.316 0H6.34M10 15.75h.008v.008H10v-.008z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-[12px] font-medium text-on-surface-variant">Imprimir</span>
            </button>

            <button className="flex flex-col items-center gap-2 py-4 rounded-xl border border-green-200/60 bg-green-50 hover:bg-green-100 transition-all cursor-pointer group">
              <div className="w-9 h-9 rounded-xl bg-green-100 group-hover:bg-green-200 flex items-center justify-center transition-colors">
                <svg className="w-4.5 h-4.5 text-green-700" viewBox="0 0 20 20" fill="none">
                  <path d="M2 3a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H2zm0 5v8a1 1 0 001 1h14a1 1 0 001-1V8H2z" fill="currentColor" />
                </svg>
              </div>
              <span className="text-[12px] font-medium text-green-800">WhatsApp</span>
            </button>

            <button className="flex flex-col items-center gap-2 py-4 rounded-xl border border-outline-variant/40 bg-surface-lowest hover:bg-surface-container transition-all cursor-pointer group">
              <div className="w-9 h-9 rounded-xl bg-surface-container group-hover:bg-surface-high flex items-center justify-center transition-colors">
                <svg className="w-4.5 h-4.5 text-on-surface-variant" viewBox="0 0 20 20" fill="none">
                  <path d="M3 8l7-5 7 5M5 19h14V8l-7-5-7 5v11z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-[12px] font-medium text-on-surface-variant">E-mail</span>
            </button>
          </div>

          {/* Nova receita */}
          <div className="flex justify-center pt-2">
            <button
              onClick={onNewPrescription}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-primary/20 text-primary bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer text-[13px] font-medium"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Nova receita
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
