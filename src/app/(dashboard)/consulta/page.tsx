"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ConsultationSidebar } from "@/components/consultation/consultation-sidebar";
import { ConsultationRightPanel } from "@/components/consultation/consultation-right-panel";
import { ConsultationTimer } from "@/components/consultation/consultation-timer";
import { ClinicalSummary } from "@/components/consultation/clinical-summary";
import { SoapForm } from "@/components/consultation/soap-form";
import { HistoryForm } from "@/components/consultation/history-form";
import { DraftRecoveryBanner } from "@/components/consultation/draft-recovery-banner";
import { FollowupPanel } from "@/components/consultation/followup-panel";
import { PreventionList } from "@/components/consultation/prevention-list";
import { PatientInfo } from "@/components/consultation/patient-info";
import { ProblemList } from "@/components/consultation/problem-list";
import { VitalsForm } from "@/components/consultation/vitals-form";
import { ExamGrid } from "@/components/consultation/exam-grid";
import { ExamUploadButton } from "@/components/consultation/exam-upload-button";
import { ExamReviewModal } from "@/components/consultation/exam-review-modal";
import { ConsultaConcluidaModal } from "@/components/consultation/consulta-concluida-modal";
import { useConsultationStore } from "@/stores/consultation-store";
import { useDraftAutosave } from "@/hooks/useDraftAutosave";
import { useSaveConsultation } from "@/hooks/useSaveConsultation";
import { BRAND } from "@/lib/branding";
import { markOnboardingStep } from "@/hooks/useOnboarding";
import { PrescriptionExamsSection } from "@/components/consultation/prescription-exams-section";
import { TriagensSection } from "@/components/consultation/triagens-section";
import { getDocumentationCompletion } from "@/components/consultation/documentation-checklist";
import { useHotkeys } from "@/hooks/useHotkeys";
import { showToast } from "@/components/ui/toast";
import { trackEvent } from "@/lib/analytics";

export default function ConsultaPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Save status: sincronizado com autosave (localStorage) e save (banco)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  // Guard contra re-entrada: so permite um timer-init por sessao
  const timerInitializedRef = useRef(false);
  const patientName = useConsultationStore((s) => s.patientName);
  const patient = useConsultationStore((s) => s.patient);
  const timerState = useConsultationStore((s) => s.timerState);
  const setTimerState = useConsultationStore((s) => s.setTimerState);

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  useEffect(() => {
    if (patientName || patient.name) {
      markOnboardingStep("consultationStarted", userId);
    }
  }, [patientName, patient.name, userId]);

    // Timer-init: dispara uma unica vez quando paciente e carregado.
  // Nao faz save aqui -- apenas marca o inicio da consulta.
  useEffect(() => {
    if (!patientName || !userId) return;
    if (timerState.started_at || timerState.finished_at) return;
    if (timerInitializedRef.current) return;
    timerInitializedRef.current = true;

    const now = new Date().toISOString();
    setTimerState({ started_at: now, finished_at: null, active_seconds: 0 });
    trackEvent("timer_started");
  }, [patientName, userId, timerState.started_at, timerState.finished_at, setTimerState]);

  // Draft autosave callback — marca "salvo local" quando autosave dispara
  const handleDraftSaved = () => {
    setSaveStatus("saved");
    setLastSavedAt(new Date());
    const t = setTimeout(() => setSaveStatus("idle"), 5000);
  };

  const patientId = useConsultationStore((s) => s.patientId);
  useDraftAutosave(userId, patientId, handleDraftSaved);

  const router = useRouter();
  const { saving, save, modalOpen, esusTextSnapshot, closeModal } = useSaveConsultation(userId);

  const labsExtras = useConsultationStore((s) => s.labsExtras);
  const setLabsExtras = useConsultationStore((s) => s.setLabsExtras);
  const pendingUploads = useConsultationStore((s) => s.pendingUploads);
  const [reviewModal, setReviewModal] = useState<{
    open: boolean;
    matched: Record<string, string>;
    extras: string;
  }>({ open: false, matched: {}, extras: "" });

  async function handleFinalize() {
    const { missing } = getDocumentationCompletion();
    if (missing.length > 0) {
      showToast(`Documentação incompleta: ${missing.join(", ")}`, "info");
    }
    await save();
  }

  // Sync save status to button state
  useEffect(() => {
    if (saving) {
      setSaveStatus("saving");
    } else if (saving === false) {
      setSaveStatus("saved");
      setLastSavedAt(new Date());
      const t = setTimeout(() => setSaveStatus("idle"), 5000);
      return () => clearTimeout(t);
    }
  }, [saving]);

  useHotkeys({ "mod+s": () => handleFinalize() });

  return (
    <div className="theme-light flex h-screen overflow-hidden bg-[var(--surface-lowest)]">
      {/* Coluna esquerda: contexto do paciente */}
      <ConsultationSidebar open={sidebarOpen} />

      {/* Coluna central: área de trabalho com scroll */}
      <main className="flex-1 overflow-y-auto min-w-0">
        {/* Topbar da consulta */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-6 h-12 bg-white border-b border-primary/10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/nova-consulta")}
              className="flex items-center gap-1 text-[11px] font-medium text-on-surface-muted hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">arrow_back</span>
              Dashboard
            </button>
            <div className="h-4 w-px bg-gray-200" />
            <h1 className="font-headline font-bold text-primary flex items-center gap-2 text-[17px]">
              {BRAND.name}
              <span className="px-1.5 py-0.5 bg-primary/5 text-[9px] font-sans font-bold tracking-tighter text-primary/60 rounded border border-primary/10 uppercase">
                Clinical v4
              </span>
            </h1>
            {userId && patientName && (
              <>
                <div className="h-4 w-px bg-gray-200" />
                <ConsultationTimer userId={userId} />
              </>
            )}
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-2 text-[11px] font-medium text-secondary">
              <span className="material-symbols-outlined text-sm">person</span>
              {patientName ?? patient.name ?? "Nenhum paciente"}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Mobile toggles */}
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-surface-container transition-colors"
              aria-label="Alternar sidebar"
            >
              <span className="material-symbols-outlined text-[18px] text-on-surface-muted">menu</span>
            </button>
            {saveStatus === "saving" ? (
              <div className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium uppercase tracking-tight text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse inline-block" />
                Salvando...
              </div>
            ) : saveStatus === "error" ? (
              <div className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium uppercase tracking-tight text-[var(--error)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--error)] inline-block" />
                Erro ao salvar
              </div>
            ) : saveStatus === "saved" && lastSavedAt ? (
              <div className="flex items-center gap-1 px-2 py-1 bg-[#e9eff2] rounded text-[10px] font-bold text-[#717973] uppercase tracking-tight">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
                Salvo às {lastSavedAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </div>
            ) : null}
            <button
              onClick={handleFinalize}
              disabled={saving}
              className="px-5 py-2 bg-primary text-white text-[11px] rounded font-bold hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2 uppercase tracking-wide disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              {saving ? "Salvando..." : "Finalizar Atendimento"}
            </button>
          </div>
        </header>

        <DraftRecoveryBanner />

        {/* Empty state: nenhum paciente selecionado */}
        {!(patientName ?? patient.name) && (
          <div className="mx-4 mt-4 flex items-start gap-4 rounded-xl border border-dashed border-primary/20 bg-primary/[0.025] p-5">
            <span className="material-symbols-outlined text-2xl text-primary/40 shrink-0 mt-0.5">person_search</span>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-primary">Nenhum paciente selecionado</p>
              <p className="text-[12px] text-on-surface-muted mt-0.5 leading-relaxed">
                Vá para <a href="/pacientes" className="text-primary font-medium hover:underline">Pacientes</a> e clique em &quot;Nova consulta&quot; para carregar o contexto clínico aqui.
              </p>
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto p-4 space-y-4">

          {/* Bloco 1: Identificação + Problemas */}
          <section className="rounded-xl bg-[var(--surface-lowest)] border border-[var(--outline-variant)] p-4">
            <div className="mb-3 flex items-center gap-1 text-[11px] font-medium text-[var(--on-surface-muted)] uppercase tracking-wide">
              Identificação e problemas
            </div>
            <div className="grid grid-cols-2 gap-4">
              <PatientInfo />
              <ProblemList />
            </div>
          </section>

          {/* Bloco 2: SOAP */}
          <section id="section-consulta" className="rounded-xl bg-[var(--surface-lowest)] border border-[var(--outline-variant)] p-5">
            <ClinicalSummary />
            <div className="my-3 h-px bg-[var(--outline-variant)]" />
            <SoapForm />
          </section>

          {/* Bloco 3: Conduta */}
          <div id="section-conduta">
            <PrescriptionExamsSection />
          </div>

          {/* Bloco 4a: Sinais Vitais e Cálculos */}
          <section id="section-exames" className="rounded-xl bg-[var(--surface-lowest)] border border-[var(--outline-variant)] p-5">
            <VitalsForm />
          </section>

          {/* Bloco 4b: Exames Complementares */}
          <section className="rounded-xl bg-[var(--surface-lowest)] border border-[var(--outline-variant)] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[var(--on-surface-muted)] uppercase tracking-wide">
                Exames Complementares
              </span>
              <ExamUploadButton
                onResult={({ matched, extras }) =>
                  setReviewModal({ open: true, matched, extras })
                }
              />
            </div>
            {pendingUploads > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--primary)]/5 border border-[var(--primary)]/15 text-[11px] text-[var(--primary)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse inline-block" />
                {pendingUploads} upload{pendingUploads > 1 ? "s" : ""} processando...
              </div>
            )}
            <ExamGrid />
            {labsExtras && (
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-medium text-[var(--on-surface-muted)] uppercase tracking-wide">
                  Outros exames
                </label>
                <textarea
                  value={labsExtras}
                  onChange={(e) => setLabsExtras(e.target.value)}
                  rows={Math.min(6, labsExtras.split("\n").length + 1)}
                  className="w-full text-[13px] text-[var(--on-surface)] bg-transparent border border-[var(--outline-variant)] rounded-lg px-3 py-2 resize-y font-mono focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>
            )}
          </section>

          {/* Bloco 5: Antecedentes */}
          <section id="section-historico" className="rounded-xl bg-[var(--surface-lowest)] border border-[var(--outline-variant)] p-5">
            <HistoryForm />
          </section>

          {/* Bloco 6: Prevenção e Seguimento */}
          <section id="section-prevencao" className="rounded-xl bg-[var(--surface-lowest)] border border-[var(--outline-variant)] p-5 space-y-4">
            <PreventionList />
            <div className="h-px bg-[var(--outline-variant)]" />
            <FollowupPanel />
          </section>

          {/* Bloco 7: Triagens Clínicas */}
          <section id="section-triagens" className="rounded-xl bg-[var(--surface-lowest)] border border-[var(--outline-variant)] p-5">
            <TriagensSection />
          </section>

        </div>
      </main>

      {/* Coluna direita: prévia eSUS + status documentação */}
      <ConsultationRightPanel />

      <ExamReviewModal
        open={reviewModal.open}
        matched={reviewModal.matched}
        extras={reviewModal.extras}
        onClose={() => setReviewModal({ open: false, matched: {}, extras: "" })}
      />

      <ConsultaConcluidaModal
        open={modalOpen}
        esusText={esusTextSnapshot}
        patientName={patientName ?? patient.name ?? null}
        onNewConsulta={() => {
          closeModal();
          useConsultationStore.getState().reset();
        }}
        onHistory={() => {
          closeModal();
          const patientId = useConsultationStore.getState().patientId;
          router.push(patientId ? `/historico?patientId=${patientId}` : "/historico");
        }}
      />
    </div>
  );
}
