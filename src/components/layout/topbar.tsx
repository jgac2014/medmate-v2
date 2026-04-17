"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HistoryPanel } from "@/components/consultation/history-panel";
import { FeedbackModal } from "@/components/consultation/feedback-modal";
import { PatientDashboard } from "@/components/consultation/patient-dashboard";
import { PatientSelector } from "@/components/consultation/patient-selector";
import { TemplateSelector } from "@/components/consultation/template-selector";
import { showToast } from "@/components/ui/toast";
import { useHotkeys } from "@/hooks/useHotkeys";
import { useDraftAutosave } from "@/hooks/useDraftAutosave";
import { prepareConsultationForPatient } from "@/lib/consultation/patient-context";
import { BRAND } from "@/lib/branding";
import { redirectToCheckout } from "@/lib/billing";
import { createClient } from "@/lib/supabase/client";
import { saveConsultation } from "@/lib/supabase/consultations";
import { upsertPatientProblems } from "@/lib/supabase/patient-problems";
import { useConsultationStore } from "@/stores/consultation-store";
import type { Patient } from "@/types";

export function Topbar() {
  const { reset, currentConsultationId, setCurrentConsultationId, patientName } =
    useConsultationStore();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [patientSelectorOpen, setPatientSelectorOpen] = useState(false);
  const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const lastSavedRef = useRef<Date | null>(null);

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        const { data } = await supabase
          .from("users")
          .select("name, subscription_status")
          .eq("id", user.id)
          .single();

        if (data) {
          setUserName(data.name);
          setSubscriptionStatus(data.subscription_status);
        }
      }
    }

    loadUser();
  }, []);

  // Autosave: debounced local save + DB save indicator
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const patientId = useConsultationStore((s) => s.patientId);
  useDraftAutosave(userId, patientId);

  useEffect(() => {
    // Track changes to trigger "Salvando..." feedback
    const unsub = useConsultationStore.subscribe(() => {
      if (!userId) return;
      clearTimeout(debounceRef.current);
      setSaveStatus("saving");
      debounceRef.current = setTimeout(() => {
        setSaveStatus("saved");
        lastSavedRef.current = new Date();
        // After 3s, go back to idle
        setTimeout(() => setSaveStatus("idle"), 3000);
      }, 1500);
    });
    return () => {
      unsub();
      clearTimeout(debounceRef.current);
    };
  }, [userId]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const handleSave = useCallback(async () => {
    if (!userId) {
      showToast("Sessão expirada, faça login novamente", "error");
      return;
    }

    setSaveStatus("saving");
    try {
      const state = useConsultationStore.getState();
      const { data, error } = await saveConsultation(
        userId,
        state,
        currentConsultationId ?? undefined,
        state.patientId
      );

      if (error) throw error;

      if (data) {
        setCurrentConsultationId(data.id);
      }

      const allProblems = [
        ...state.problems,
        ...(state.problemsOther
          ? state.problemsOther
              .split(",")
              .map((value) => value.trim())
              .filter(Boolean)
          : []),
      ];

      if (state.patientId) {
        upsertPatientProblems(userId, state.patientId, allProblems).catch(() => {});
      }

      setSaveStatus("saved");
      lastSavedRef.current = new Date();
      showToast("Consulta salva!", "success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus("idle");
      showToast("Erro ao salvar consulta", "error");
    }
  }, [currentConsultationId, setCurrentConsultationId, userId]);

  useEffect(() => {
    return () => clearTimeout(saveTimerRef.current);
  }, []);

  const hotkeyMap = useMemo(
    () => ({
      "mod+s": () => handleSave(),
      "mod+n": () => setPatientSelectorOpen(true),
      "mod+h": () => router.push("/historico"),
      "mod+p": () => {
        if (patientName) setDashboardOpen((value) => !value);
      },
    }),
    [handleSave, patientName, router]
  );

  useHotkeys(hotkeyMap);

  async function handleCheckout() {
    setCheckoutLoading(true);
    await redirectToCheckout();
    setCheckoutLoading(false);
  }

  async function handlePatientSelected(patient: Patient) {
    reset();
    await prepareConsultationForPatient({ userId, patient });
    setPatientSelectorOpen(false);
    showToast(`Nova consulta — ${patient.name}`, "info");
    router.push("/consulta");
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  const initials = userName
    ? userName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "?";

  const isPro = subscriptionStatus === "active";
  const isTrial = subscriptionStatus === "trial";

  // Autosave label
  const autosaveLabel = saveStatus === "saving"
    ? "Salvando..."
    : saveStatus === "saved"
    ? "Salvo agora"
    : lastSavedRef.current
    ? `Salvo ${formatRelativeTime(lastSavedRef.current)}`
    : null;

  const isInConsultation = pathname === "/consulta" && patientName;

  // Show autosave and patient context whenever there's an active patient
  const hasPatientContext = Boolean(patientName);

  return (
    <>
      <HistoryPanel open={historyOpen} onClose={() => setHistoryOpen(false)} />
      <PatientSelector
        open={patientSelectorOpen}
        onSelect={handlePatientSelected}
        onClose={() => setPatientSelectorOpen(false)}
      />
      <TemplateSelector open={templateSelectorOpen} onClose={() => setTemplateSelectorOpen(false)} />
      <PatientDashboard open={dashboardOpen} onClose={() => setDashboardOpen(false)} />
      <FeedbackModal open={feedbackOpen} onOpenChange={setFeedbackOpen} />

      <div className="sticky top-0 z-30 bg-surface-low">
        {/* Main row */}
        <div className="flex h-13 items-center px-5 gap-4">
          {/* Left: brand + primary nav */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => router.push("/")}
              className="font-headline text-[17px] font-bold text-primary hover:opacity-70 transition-opacity shrink-0"
            >
              {BRAND.name}
            </button>

            <div className="hidden lg:flex items-center gap-0.5 ml-6 pl-6 border-l border-outline-variant/40">
              <NavButton
                active={pathname === "/consulta" || pathname === "/nova-consulta"}
                onClick={() => router.push("/consulta")}
                label="Consulta"
              />
              <NavButton
                active={pathname === "/pacientes"}
                onClick={() => router.push("/pacientes")}
                label="Pacientes"
              />
              <NavButton
                active={pathname === "/historico"}
                onClick={() => router.push("/historico")}
                label="Histórico"
              />
            </div>
          </div>

          {/* Center: patient + autosave */}
          <div className="flex-1 flex items-center justify-center gap-3 min-w-0">
            {patientName && (
              <>
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-status-ok" />
                <span className="max-w-[240px] truncate font-headline text-[14px] italic text-on-surface">
                  {patientName}
                </span>
              </>
            )}
            {autosaveLabel && hasPatientContext && (
              <span className={`text-[11px] font-medium shrink-0 transition-colors ${
                saveStatus === "saving"
                  ? "text-on-surface-muted"
                  : saveStatus === "saved"
                  ? "text-status-ok"
                  : "text-on-surface-muted"
              }`}>
                {autosaveLabel}
              </span>
            )}
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {patientName && (
              <button
                onClick={() => setDashboardOpen((v) => !v)}
                className="hidden xl:flex h-[34px] items-center gap-1.5 rounded-lg border border-secondary/30 bg-secondary-container/20 px-3 text-[12px] font-medium text-secondary transition-colors hover:bg-secondary-container/40"
              >
                <span className="material-symbols-outlined text-[15px]">person</span>
                Prontuário
              </button>
            )}

            <button
              onClick={() => setHistoryOpen(true)}
              className="hidden md:flex h-[34px] items-center gap-1.5 rounded-lg border border-outline-variant/50 bg-surface-lowest px-3 text-[12px] font-medium text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[15px]">history</span>
              Consultas anteriores
            </button>

            <button
              onClick={handleSave}
              disabled={!patientName || saveStatus === "saving"}
              className="hidden md:flex h-[34px] items-center gap-1.5 rounded-lg border border-outline-variant/50 bg-surface-lowest px-3 text-[12px] font-medium text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[15px]">
                {saveStatus === "saving" ? "sync" : "save"}
              </span>
              {saveStatus === "saving" ? "Salvando..." : "Salvar agora"}
            </button>

            <button
              onClick={() => {
                reset();
                setPatientSelectorOpen(true);
              }}
              className="flex h-[34px] items-center gap-1.5 rounded-lg bg-primary px-4 text-[12px] font-bold text-on-primary transition-colors hover:bg-primary-container active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Nova consulta
            </button>

            {/* User menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant/50 bg-surface-lowest transition-colors hover:bg-surface-container"
              >
                <span className="text-[11px] font-semibold text-on-surface-variant">
                  {initials}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-11 z-[60] w-60 rounded-xl border border-outline-variant/30 bg-surface-lowest py-1.5 shadow-[0_8px_30px_rgba(23,28,31,0.10)]">
                  {userName && (
                    <div className="border-b border-outline-variant/30 px-4 py-3">
                      <p className="truncate text-[13px] font-medium text-on-surface">{userName}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                            isPro
                              ? "border-status-ok/30 bg-status-ok-bg text-status-ok"
                              : isTrial
                              ? "border-status-info/30 bg-status-info-bg text-status-info"
                              : "border-outline bg-surface-container text-on-surface-variant"
                          }`}
                        >
                          {isPro ? "Pro" : isTrial ? "Trial" : subscriptionStatus || "Conta"}
                        </span>
                        {!isPro && (
                          <button
                            onClick={() => {
                              setMenuOpen(false);
                              handleCheckout();
                            }}
                            disabled={checkoutLoading}
                            className="text-[10px] font-semibold text-primary underline hover:text-primary/70 disabled:opacity-50"
                          >
                            {checkoutLoading ? "..." : "Ativar Pro"}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="px-3 py-1.5">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-muted mb-1.5 px-1">
                      Ferramentas
                    </p>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setTemplateSelectorOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-[12px] text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px] text-secondary">description</span>
                      Templates
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        router.push("/receituario");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-[12px] text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px] text-secondary">medication</span>
                      Receituário
                      <span className="ml-auto rounded border border-status-warn/30 bg-status-warn-bg px-1.5 py-0.5 text-[9px] font-bold text-status-warn">beta</span>
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        router.push("/pedidos");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-[12px] text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px] text-secondary">lab_profile</span>
                      Pedidos
                      <span className="ml-auto rounded border border-status-warn/30 bg-status-warn-bg px-1.5 py-0.5 text-[9px] font-bold text-status-warn">beta</span>
                    </button>
                  </div>
                  <div className="my-1 border-t border-outline-variant/30" />
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      router.push("/conta");
                    }}
                    className="w-full px-4 py-2 text-left text-[12px] text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface cursor-pointer"
                  >
                    Minha conta
                  </button>
                  <a
                    href={`mailto:${BRAND.supportEmail}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-[12px] text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined text-[14px]">mail</span>
                    Suporte
                  </a>
                  <div className="my-1 border-t border-outline-variant/30" />
                  <button
                    onClick={() => { setMenuOpen(false); setFeedbackOpen(true); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left text-[12px] text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface cursor-pointer"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    Enviar feedback
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-[12px] text-on-surface-variant transition-colors hover:bg-surface-container hover:text-error cursor-pointer"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Secondary nav row */}
        <div className="flex h-9 items-center gap-1 border-t border-outline-variant/20 px-5">
          <button
            onClick={() => setTemplateSelectorOpen(true)}
            className="flex h-8 items-center gap-1.5 rounded-md px-3 text-[11px] font-medium text-on-surface-muted transition-colors hover:bg-surface-container hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[14px]">description</span>
            Templates
          </button>
          <button
            onClick={() => router.push("/receituario")}
            className="flex h-8 items-center gap-1.5 rounded-md px-3 text-[11px] font-medium text-on-surface-muted transition-colors hover:bg-surface-container hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[14px]">medication</span>
            Receituário
            <span className="rounded border border-status-warn/30 bg-status-warn-bg px-1.5 py-0.5 text-[8px] font-bold text-status-warn leading-none">beta</span>
          </button>
          <button
            onClick={() => router.push("/pedidos")}
            className="flex h-8 items-center gap-1.5 rounded-md px-3 text-[11px] font-medium text-on-surface-muted transition-colors hover:bg-surface-container hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[14px]">lab_profile</span>
            Pedidos
            <span className="rounded border border-status-warn/30 bg-status-warn-bg px-1.5 py-0.5 text-[8px] font-bold text-status-warn leading-none">beta</span>
          </button>
        </div>
      </div>
    </>
  );
}

function NavButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${
        active
          ? "bg-primary/8 font-semibold text-primary"
          : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
      }`}
    >
      {label}
    </button>
  );
}

function formatRelativeTime(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 10) return "agora";
  if (diff < 60) return `há ${diff}s`;
  const min = Math.floor(diff / 60);
  if (min < 60) return `há ${min}min`;
  return `há ${Math.floor(min / 60)}h`;
}
