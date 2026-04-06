"use client";

import { useState, useEffect, useCallback } from "react";
import { ExamSearch } from "./exam-search";
import { CategoryBrowser } from "./category-browser";
import type { LabExam, SelectedExam } from "@/lib/pedidos/types";
import type { DoctorProfile } from "@/lib/receituario/types";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/components/ui/toast";

type Tab = "search" | "categories";

export function PedidosShell() {
  const [selectedExams, setSelectedExams] = useState<SelectedExam[]>([]);
  const [patientName, setPatientName] = useState("");
  const [patientCpf, setPatientCpf] = useState("");
  const [clinicalInfo, setClinicalInfo] = useState("");
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("search");
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    async function loadDoctor() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("users")
          .select("name, crm, specialty, city")
          .eq("id", user.id)
          .single();
        if (data) {
          setDoctorProfile({
            name: data.name,
            crm: data.crm || "",
            specialty: data.specialty || "Medicina de Família e Comunidade",
            address: "",
            phone: "",
            city: data.city || "",
          });
        }
      }
    }
    loadDoctor();
  }, []);

  const handleSelectExam = useCallback((exam: LabExam) => {
    setSelectedExams((prev) => {
      if (prev.some((e) => e.examId === exam.id)) return prev;
      return [...prev, { examId: exam.id, name: exam.name, notes: "" }];
    });
  }, []);

  const handleRemoveExam = useCallback((examId: string) => {
    setSelectedExams((prev) => prev.filter((e) => e.examId !== examId));
  }, []);

  const handleUpdateNotes = useCallback((examId: string, notes: string) => {
    setSelectedExams((prev) =>
      prev.map((e) => (e.examId === examId ? { ...e, notes } : e))
    );
  }, []);

  const selectedIds = new Set(selectedExams.map((e) => e.examId));

  const generateRequestText = useCallback(() => {
    const lines: string[] = [];

    if (doctorProfile) {
      lines.push(`Dr(a). ${doctorProfile.name}`);
      if (doctorProfile.crm) lines.push(`CRM: ${doctorProfile.crm}`);
      if (doctorProfile.specialty) lines.push(doctorProfile.specialty);
      lines.push("");
    }

    lines.push("SOLICITAÇÃO DE EXAMES");
    lines.push("=".repeat(40));
    lines.push("");

    if (patientName) lines.push(`Paciente: ${patientName}`);
    if (patientCpf) lines.push(`CPF: ${patientCpf}`);
    if (lines.length > 0) lines.push("");

    if (clinicalInfo) {
      lines.push(`Informação clínica: ${clinicalInfo}`);
      lines.push("");
    }

    lines.push("EXAMES SOLICITADOS:");
    lines.push("-".repeat(40));

    selectedExams.forEach((exam, i) => {
      lines.push(`${i + 1}. ${exam.name}`);
      if (exam.notes) lines.push(`   Obs: ${exam.notes}`);
    });

    lines.push("");
    lines.push("-".repeat(40));

    if (doctorProfile?.city) {
      lines.push(`${doctorProfile.city}, ${new Date().toLocaleDateString("pt-BR")}`);
    } else {
      lines.push(new Date().toLocaleDateString("pt-BR"));
    }

    lines.push("");
    if (doctorProfile) {
      lines.push("_________________________________");
      lines.push(doctorProfile.name);
      if (doctorProfile.crm) lines.push(`CRM ${doctorProfile.crm}`);
    }

    return lines.join("\n");
  }, [selectedExams, patientName, patientCpf, clinicalInfo, doctorProfile]);

  const handleCopyToClipboard = useCallback(async () => {
    const text = generateRequestText();
    try {
      await navigator.clipboard.writeText(text);
      showToast("Pedido copiado!", "success");
    } catch {
      showToast("Erro ao copiar", "error");
    }
  }, [generateRequestText]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-on-surface">Pedidos de Exames</h1>
        <p className="text-[13px] text-on-surface-muted mt-1">
          Selecione os exames e gere o pedido formatado para o eSUS
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-surface-lowest border border-outline-variant/30 rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab("search")}
          className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
            activeTab === "search"
              ? "bg-primary/8 text-primary font-semibold"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Buscar
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
            activeTab === "categories"
              ? "bg-primary/8 text-primary font-semibold"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Categorias
        </button>
      </div>

      {/* Patient info */}
      <div className="bg-surface-lowest border border-outline-variant/30 rounded-xl p-4 mb-4">
        <h3 className="text-[12px] font-semibold text-on-surface-muted uppercase tracking-wider mb-3">
          Dados do Paciente
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] text-on-surface-muted mb-1">Nome</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Nome do paciente"
              className="w-full bg-surface-container/30 border border-outline-variant/40 rounded-lg px-3 py-2 text-[13px] text-on-surface placeholder:text-on-surface-muted outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/10 transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] text-on-surface-muted mb-1">CPF</label>
            <input
              type="text"
              value={patientCpf}
              onChange={(e) => setPatientCpf(e.target.value)}
              placeholder="000.000.000-00"
              className="w-full bg-surface-container/30 border border-outline-variant/40 rounded-lg px-3 py-2 text-[13px] text-on-surface placeholder:text-on-surface-muted outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/10 transition-all"
            />
          </div>
        </div>
        <div className="mt-3">
          <label className="block text-[11px] text-on-surface-muted mb-1">Informação Clínica</label>
          <textarea
            value={clinicalInfo}
            onChange={(e) => setClinicalInfo(e.target.value)}
            placeholder="Hipertensão arterial, DM2 em acompanhamento..."
            rows={2}
            className="w-full bg-surface-container/30 border border-outline-variant/40 rounded-lg px-3 py-2 text-[13px] text-on-surface placeholder:text-on-surface-muted outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/10 transition-all resize-none"
          />
        </div>
      </div>

      {/* Exam selection */}
      <div className="mb-4">
        {activeTab === "search" ? (
          <ExamSearch onSelect={handleSelectExam} />
        ) : (
          <CategoryBrowser onSelect={handleSelectExam} selectedIds={selectedIds} />
        )}
      </div>

      {/* Selected exams */}
      {selectedExams.length > 0 && (
        <div className="bg-surface-lowest border border-outline-variant/30 rounded-xl overflow-hidden mb-4">
          <div className="px-4 py-2.5 border-b border-outline-variant/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[13px] font-medium text-on-surface">
                {selectedExams.length} exame{selectedExams.length > 1 ? "s" : ""} selecionado{selectedExams.length > 1 ? "s" : ""}
              </span>
            </div>
            <button
              onClick={() => setSelectedExams([])}
              className="text-[11px] text-on-surface-muted hover:text-error transition-colors cursor-pointer"
            >
              Limpar tudo
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto divide-y divide-outline-variant/10">
            {selectedExams.map((exam) => (
              <div key={exam.examId} className="px-4 py-3 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <span className="text-[13px] font-medium text-on-surface">{exam.name}</span>
                  <input
                    type="text"
                    value={exam.notes}
                    onChange={(e) => handleUpdateNotes(exam.examId, e.target.value)}
                    placeholder="Observações (opcional)"
                    className="w-full mt-1 bg-surface-container/30 border border-outline-variant/30 rounded-lg px-2.5 py-1.5 text-[12px] text-on-surface placeholder:text-on-surface-muted outline-none focus:border-primary/40 transition-all"
                  />
                </div>
                <button
                  onClick={() => handleRemoveExam(exam.examId)}
                  className="shrink-0 p-1.5 rounded-lg text-on-surface-muted hover:text-error hover:bg-error/8 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => setPreviewOpen(true)}
          disabled={selectedExams.length === 0}
          className="px-4 py-2.5 rounded-xl text-[13px] font-medium border border-outline-variant/50 text-on-surface-variant bg-surface-lowest hover:bg-surface-container hover:text-on-surface transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Pré-visualizar
        </button>
        <button
          onClick={handleCopyToClipboard}
          disabled={selectedExams.length === 0}
          className="px-6 py-2.5 rounded-xl text-[13px] font-semibold bg-primary text-on-primary hover:bg-primary-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Copiar Pedido
        </button>
      </div>

      {/* Preview modal */}
      {previewOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setPreviewOpen(false)}>
          <div
            className="bg-surface-lowest border border-outline-variant/30 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
              <h2 className="text-[15px] font-semibold text-on-surface">Pré-visualização do Pedido</h2>
              <button
                onClick={() => setPreviewOpen(false)}
                className="p-1.5 rounded-lg text-on-surface-muted hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <pre className="text-[13px] text-on-surface whitespace-pre-wrap font-sans leading-relaxed">
                {generateRequestText()}
              </pre>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-outline-variant/20">
              <button
                onClick={() => setPreviewOpen(false)}
                className="px-4 py-2 rounded-xl text-[13px] font-medium border border-outline-variant/50 text-on-surface-variant bg-surface-lowest hover:bg-surface-container transition-colors cursor-pointer"
              >
                Fechar
              </button>
              <button
                onClick={handleCopyToClipboard}
                className="px-6 py-2 rounded-xl text-[13px] font-semibold bg-primary text-on-primary hover:bg-primary-container transition-colors cursor-pointer"
              >
                Copiar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
