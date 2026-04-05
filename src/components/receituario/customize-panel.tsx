'use client'

"use client";

import { useEffect } from "react";
import type { RxCustomization, DoctorProfile } from "@/lib/receituario/types";

interface CustomizePanelProps {
  open: boolean;
  onClose: () => void;
  customization: RxCustomization;
  doctor: DoctorProfile;
  onUpdateCustomization: (c: Partial<RxCustomization>) => void;
  onUpdateDoctor: (d: Partial<DoctorProfile>) => void;
}

const FONTS = ["Inter", "Georgia", "Times New Roman", "Courier New", "Arial", "Palatino"];
const SPACING_OPTIONS = [
  { value: "compact", label: "Compacto" },
  { value: "normal", label: "Normal" },
  { value: "relaxed", label: "Espaçado" },
];

export function CustomizePanel({
  open,
  onClose,
  customization,
  doctor,
  onUpdateCustomization,
  onUpdateDoctor,
}: CustomizePanelProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed right-0 top-0 bottom-0 z-50 w-80 bg-surface-lowest shadow-[-4px_0_30px_rgba(23,28,31,0.12)] transition-transform duration-300 ease-out overflow-y-auto ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col min-h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/30 sticky top-0 bg-surface-lowest z-10">
            <div>
              <h3 className="text-[14px] font-semibold text-on-surface">Personalizar Receita</h3>
              <p className="text-[11px] text-on-surface-muted mt-0.5">Aparência e dados profissionais</p>
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

          <div className="flex-1 p-5 space-y-6">
            {/* Dados Profissionais */}
            <section>
              <h4 className="text-[11px] font-semibold text-on-surface-muted uppercase tracking-wide mb-3">
                Dados Profissionais
              </h4>
              <div className="space-y-3">
                {(
                  [
                    { key: "name", label: "Nome completo", placeholder: "Dr. João Silva" },
                    { key: "crm", label: "CRM", placeholder: "CRM/SP 123456" },
                    { key: "specialty", label: "Especialidade", placeholder: "Medicina de Família e Comunidade" },
                    { key: "address", label: "Endereço", placeholder: "Rua das Flores, 100" },
                    { key: "phone", label: "Telefone", placeholder: "(11) 99999-9999" },
                    { key: "city", label: "Cidade / UF", placeholder: "São Paulo / SP" },
                  ] as { key: keyof DoctorProfile; label: string; placeholder: string }[]
                ).map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-[11px] font-medium text-on-surface-variant mb-1">{label}</label>
                    <input
                      type="text"
                      value={doctor[key]}
                      onChange={(e) => onUpdateDoctor({ [key]: e.target.value })}
                      placeholder={placeholder}
                      className="w-full bg-surface-container/50 border border-outline-variant/30 rounded-lg px-3 py-2 text-[12px] text-on-surface placeholder:text-on-surface-muted outline-none focus:border-primary/40 transition-all"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Alinhamento */}
            <section>
              <h4 className="text-[11px] font-semibold text-on-surface-muted uppercase tracking-wide mb-3">
                Alinhamento do Cabeçalho
              </h4>
              <div className="flex gap-2">
                {(["left", "center"] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() => onUpdateCustomization({ align })}
                    className={`flex-1 py-2 rounded-lg text-[12px] font-medium border transition-all cursor-pointer ${
                      customization.align === align
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-surface-container border-outline-variant/30 text-on-surface-muted hover:text-on-surface"
                    }`}
                  >
                    {align === "left" ? "← Esquerda" : "Centro"}
                  </button>
                ))}
              </div>
            </section>

            {/* Nome */}
            <section>
              <h4 className="text-[11px] font-semibold text-on-surface-muted uppercase tracking-wide mb-3">
                Nome na Receita
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-on-surface-variant mb-1">Fonte</label>
                  <select
                    value={customization.nameFont}
                    onChange={(e) => onUpdateCustomization({ nameFont: e.target.value })}
                    className="w-full bg-surface-container/50 border border-outline-variant/30 rounded-lg px-3 py-2 text-[12px] text-on-surface outline-none focus:border-primary/40 transition-all cursor-pointer"
                  >
                    {FONTS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-[11px] font-medium text-on-surface-variant mb-1">Tamanho</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={12}
                        max={28}
                        value={customization.nameSize}
                        onChange={(e) => onUpdateCustomization({ nameSize: Number(e.target.value) })}
                        className="flex-1 accent-primary"
                      />
                      <span className="text-[12px] text-on-surface w-8 text-right">{customization.nameSize}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-on-surface-variant mb-1">Cor</label>
                    <input
                      type="color"
                      value={customization.nameColor}
                      onChange={(e) => onUpdateCustomization({ nameColor: e.target.value })}
                      className="w-9 h-9 rounded-lg border border-outline-variant/30 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Descrição */}
            <section>
              <h4 className="text-[11px] font-semibold text-on-surface-muted uppercase tracking-wide mb-3">
                Subtítulo / Especialidade
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-on-surface-variant mb-1">Fonte</label>
                  <select
                    value={customization.descFont}
                    onChange={(e) => onUpdateCustomization({ descFont: e.target.value })}
                    className="w-full bg-surface-container/50 border border-outline-variant/30 rounded-lg px-3 py-2 text-[12px] text-on-surface outline-none focus:border-primary/40 transition-all cursor-pointer"
                  >
                    {FONTS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-[11px] font-medium text-on-surface-variant mb-1">Tamanho</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={9}
                        max={16}
                        value={customization.descSize}
                        onChange={(e) => onUpdateCustomization({ descSize: Number(e.target.value) })}
                        className="flex-1 accent-primary"
                      />
                      <span className="text-[12px] text-on-surface w-8 text-right">{customization.descSize}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-on-surface-variant mb-1">Cor</label>
                    <input
                      type="color"
                      value={customization.descColor}
                      onChange={(e) => onUpdateCustomization({ descColor: e.target.value })}
                      className="w-9 h-9 rounded-lg border border-outline-variant/30 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Espaçamento */}
            <section>
              <h4 className="text-[11px] font-semibold text-on-surface-muted uppercase tracking-wide mb-3">
                Espaçamento entre Itens
              </h4>
              <div className="flex gap-2">
                {SPACING_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => onUpdateCustomization({ lineSpacing: value as RxCustomization["lineSpacing"] })}
                    className={`flex-1 py-2 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${
                      customization.lineSpacing === value
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-surface-container border-outline-variant/30 text-on-surface-muted hover:text-on-surface"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
