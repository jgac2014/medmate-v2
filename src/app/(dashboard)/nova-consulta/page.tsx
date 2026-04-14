"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PatientSelector } from "@/components/consultation/patient-selector";
import { TemplateSelector } from "@/components/consultation/template-selector";
import { showToast } from "@/components/ui/toast";
import { prepareConsultationForPatient } from "@/lib/consultation/patient-context";
import { trackEvent } from "@/lib/analytics";
import { createClient } from "@/lib/supabase/client";
import { listPatients } from "@/lib/supabase/patients";
import { useConsultationStore } from "@/stores/consultation-store";
import { loadDraft, clearDraft } from "@/hooks/useDraftAutosave";
import type { Patient } from "@/types";
import { ageFromBirthDate } from "@/lib/utils";

// Sugestões reais de APS/UBS
const QUICK_SUGGESTIONS = [
  "Dor abdominal difusa há 3 dias",
  "Cefaleia tensional recorrente",
  "Renovação de receita de metformina",
  "Febre e tosse há 5 dias",
  "Dispneia aos esforços moderados",
  "Dor lombar aguda",
  "Tontura episódica",
  "Edema de membros inferiores",
];

export default function NovaConsultaPage() {
  const [queixa, setQueixa] = useState("");
  const [patientSelectorOpen, setPatientSelectorOpen] = useState(false);
  const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [draftActive, setDraftActive] = useState(false);
  const router = useRouter();
  const { reset } = useConsultationStore();

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => {
        if (user) setUserId(user.id);
      });
  }, []);

  // Load recent patients and check for active draft
  useEffect(() => {
    if (!userId) return;
    const uid = userId;

    async function load() {
      const draft = loadDraft(uid);
      if (draft) setDraftActive(true);
      const patients = await listPatients(uid);
      setRecentPatients(patients.slice(0, 6));
    }
    load();
  }, [userId]);

  function handleGerar() {
    if (!queixa.trim()) return;
    setPatientSelectorOpen(true);
  }

  async function handlePatientSelected(patient: Patient) {
    reset();
    await prepareConsultationForPatient({
      userId,
      patient,
      subjective: queixa.trim(),
    });

    trackEvent("consultation_started");
    setPatientSelectorOpen(false);
    showToast(`Nova consulta — ${patient.name}`, "info");
    router.push("/consulta");
  }

  function handleResumeDraft() {
    if (!userId) return;
    const uid = userId;
    const draft = loadDraft(uid);
    if (!draft) return;

    const { loadState } = useConsultationStore.getState();
    loadState(draft.state as Parameters<typeof loadState>[0], null);
    clearDraft(uid);
    showToast("Rascunho restaurado", "info");
    router.push("/consulta");
  }

  async function handleOpenRecentPatient(patient: Patient) {
    reset();
    await prepareConsultationForPatient({ userId, patient });
    showToast(`Retomando ${patient.name}`, "info");
    router.push("/consulta");
  }

  return (
    <>
      <PatientSelector
        open={patientSelectorOpen}
        onSelect={handlePatientSelected}
        onClose={() => setPatientSelectorOpen(false)}
      />
      <TemplateSelector open={templateSelectorOpen} onClose={() => setTemplateSelectorOpen(false)} />

      <main className="flex min-h-[calc(100vh-8rem)] flex-col overflow-y-auto bg-surface-lowest">
        {/* Header */}
        <div className="border-b border-outline-variant/30 bg-surface-low px-8 py-5">
          <h1 className="font-headline text-[22px] font-semibold text-primary leading-tight">
            Nova Consulta
          </h1>
          <p className="text-[12px] text-on-surface-muted mt-0.5 italic">
            Descreva a queixa principal ou selecione uma das opções abaixo
          </p>
        </div>

        {/* Main content */}
        <div className="flex flex-1 gap-0">

          {/* Left: workspace area */}
          <div className="flex-1 min-w-0 px-8 py-6 space-y-6 max-w-2xl">

            {/* Input principal */}
            <div className="rounded-xl border border-outline-variant/50 bg-surface-lowest p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined mt-1 text-[20px] text-secondary shrink-0">
                  clinical_notes
                </span>
                <div className="flex-1 min-w-0">
                  <textarea
                    autoFocus
                    value={queixa}
                    onChange={(e) => setQueixa(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey && queixa.trim()) {
                        e.preventDefault();
                        handleGerar();
                      }
                    }}
                    rows={3}
                    className="w-full resize-none border-none bg-transparent text-[16px] text-on-surface outline-none placeholder:text-on-surface-muted/60 leading-relaxed"
                    placeholder="Ex: dor torácica há 2 dias, piora ao esforço, sem irradiação..."
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-on-surface-muted/60">
                      Enter para iniciar · Shift+Enter para nova linha
                    </span>
                    <button
                      onClick={handleGerar}
                      disabled={!queixa.trim()}
                      className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[12px] font-bold text-on-primary transition-colors hover:bg-primary-container disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      Iniciar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Acesso rápido */}
            {draftActive && (
              <div className="rounded-xl border border-status-info/30 bg-status-info-bg p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px] text-status-info">draft</span>
                  <div>
                    <p className="text-[12px] font-semibold text-status-info">Rascunho em andamento</p>
                    <p className="text-[11px] text-on-surface-muted">Você tem uma consulta não salva em andamento</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={handleResumeDraft}
                    className="flex items-center gap-1.5 rounded-lg bg-status-info px-3 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-status-info/80"
                  >
                    Retomar
                  </button>
                  <button
                    onClick={() => {
                      if (!userId) return;
                      clearDraft(userId);
                      setDraftActive(false);
                    }}
                    className="flex items-center gap-1.5 rounded-lg border border-outline-variant px-3 py-1.5 text-[11px] font-medium text-on-surface-variant transition-colors hover:bg-surface-container"
                  >
                    Descartar
                  </button>
                </div>
              </div>
            )}

            {/* Quick actions grid */}
            <div className="grid grid-cols-2 gap-3">
              <QuickActionCard
                icon="replay"
                label="Retomar consulta"
                description="Continuar uma consulta em edição"
                onClick={() => setPatientSelectorOpen(true)}
                disabled={!queixa.trim()}
              />
              <QuickActionCard
                icon="person"
                label="Abrir paciente recente"
                description="Selecionar paciente já atendido"
                onClick={() => router.push("/pacientes")}
              />
              <QuickActionCard
                icon="history"
                label="Consultas anteriores"
                description="Ver histórico de um paciente"
                onClick={() => router.push("/historico")}
              />
              <QuickActionCard
                icon="description"
                label="Usar template"
                description="Iniciar com modelo clínico"
                onClick={() => setTemplateSelectorOpen(true)}
              />
            </div>

            {/* Sugestões rápidas */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-muted mb-2">
                Casos comuns em APS
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQueixa(s)}
                    className="rounded-full border border-outline-variant/50 bg-surface-lowest px-3.5 py-1.5 text-[11px] font-medium text-on-surface-variant transition-all hover:border-secondary/40 hover:bg-secondary-container/20 hover:text-secondary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Pacientes recentes */}
            {recentPatients.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-muted mb-2">
                  Últimos pacientes
                </p>
                <div className="space-y-1.5">
                  {recentPatients.map((p) => {
                    const ini = p.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
                    const age = ageFromBirthDate(p.birth_date);
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleOpenRecentPatient(p)}
                        className="w-full flex items-center gap-3 rounded-xl border border-outline-variant/40 bg-surface-lowest p-3 text-left transition-all hover:border-secondary/40 hover:bg-secondary-container/10 hover:shadow-sm group"
                      >
                        <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-[11px] shrink-0">
                          {ini}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-semibold text-primary truncate">{p.name}</p>
                          <p className="text-[10px] text-on-surface-muted">
                            {[age !== null ? `${age}a` : null, p.gender].filter(Boolean).join(" · ")}
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-[16px] text-secondary/40 group-hover:text-secondary transition-colors">
                          arrow_forward
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: secondary info */}
          <div className="hidden xl:block w-72 shrink-0 border-l border-outline-variant/30 px-6 py-6 space-y-6">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-muted mb-3">
                Atalhos
              </p>
              <div className="space-y-1.5">
                <Shortcut hint="Iniciar consulta" keys={["Ctrl", "N"]} />
                <Shortcut hint="Salvar consulta" keys={["Ctrl", "S"]} />
                <Shortcut hint="Ver histórico" keys={["Ctrl", "H"]} />
                <Shortcut hint="Prontuário" keys={["Ctrl", "P"]} />
              </div>
            </div>

            <div className="h-px bg-outline-variant/30" />

            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-muted mb-3">
                Templates
              </p>
              <div className="space-y-1.5">
                <TemplateHint label="HAS" desc="Hipertensão arterial" onClick={() => router.push("/consulta")} />
                <TemplateHint label="DM2" desc="Diabetes tipo 2" onClick={() => router.push("/consulta")} />
                <TemplateHint label="Dor" desc="Avaliação de dor aguda" onClick={() => router.push("/consulta")} />
                <button
                  onClick={() => setTemplateSelectorOpen(true)}
                  className="w-full flex items-center gap-2 rounded-lg border border-dashed border-outline-variant/50 px-3 py-2 text-left text-[11px] text-on-surface-muted hover:border-secondary/40 hover:text-secondary transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">add</span>
                  Ver todos os templates
                </button>
              </div>
            </div>

            <div className="h-px bg-outline-variant/30" />

            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-muted mb-3">
                Ferramentas
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => router.push("/receituario")}
                  className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left text-[12px] text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px] text-secondary">medication</span>
                  Receituário
                  <span className="ml-auto rounded border border-status-warn/30 bg-status-warn-bg px-1.5 py-0.5 text-[9px] font-bold text-status-warn">beta</span>
                </button>
                <button
                  onClick={() => router.push("/pedidos")}
                  className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left text-[12px] text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px] text-secondary">lab_profile</span>
                  Pedidos de exame
                  <span className="ml-auto rounded border border-status-warn/30 bg-status-warn-bg px-1.5 py-0.5 text-[9px] font-bold text-status-warn">beta</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function QuickActionCard({
  icon,
  label,
  description,
  onClick,
  disabled,
}: {
  icon: string;
  label: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-start gap-3 rounded-xl border border-outline-variant/50 bg-surface-lowest p-4 text-left transition-all hover:border-secondary/40 hover:bg-secondary-container/10 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
    >
      <span className="material-symbols-outlined text-[20px] text-secondary/60 group-hover:text-secondary transition-colors shrink-0">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[12px] font-semibold text-primary">{label}</p>
        <p className="text-[11px] text-on-surface-muted mt-0.5 leading-snug">{description}</p>
      </div>
    </button>
  );
}

function Shortcut({ hint, keys }: { hint: string; keys: string[] }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[11px] text-on-surface-muted">{hint}</span>
      <div className="flex gap-1">
        {keys.map((k) => (
          <kbd key={k} className="rounded border border-outline-variant/50 bg-surface-container px-1.5 py-0.5 text-[9px] font-bold text-on-surface-muted">
            {k}
          </kbd>
        ))}
      </div>
    </div>
  );
}

function TemplateHint({ label, desc, onClick }: { label: string; desc: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left hover:bg-surface-container transition-colors group"
    >
      <span className="rounded border border-primary/20 bg-primary/5 px-1.5 py-0.5 text-[9px] font-bold text-primary shrink-0">
        {label}
      </span>
      <span className="text-[11px] text-on-surface-muted group-hover:text-on-surface transition-colors truncate">
        {desc}
      </span>
    </button>
  );
}
