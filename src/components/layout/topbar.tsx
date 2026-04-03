"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { BRAND } from "@/lib/branding";
import { Button } from "@/components/ui/button";
import { useConsultationStore } from "@/stores/consultation-store";
import { showToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import { saveConsultation } from "@/lib/supabase/consultations";
import { getFollowupFromLastConsultation } from "@/lib/supabase/followup";
import { getPatientProblems, upsertPatientProblems } from "@/lib/supabase/patient-problems";
import { getPatientMedications } from "@/lib/supabase/patient-medications";
import { PROBLEMS } from "@/lib/constants";
import { HistoryPanel } from "@/components/consultation/history-panel";
import { PatientSelector } from "@/components/consultation/patient-selector";
import { TemplateSelector } from "@/components/consultation/template-selector";
import { PatientDashboard } from "@/components/consultation/patient-dashboard";
import { useHotkeys } from "@/hooks/useHotkeys";
import type { Patient } from "@/types";

const SUBSCRIPTION_META = {
  active: {
    label: "Pro ativo",
    className: "border-status-ok/25 bg-status-ok-bg text-status-ok",
  },
  trial: {
    label: "Trial",
    className: "border-status-info/25 bg-status-info-bg text-status-info",
  },
  expired: {
    label: "Acesso pendente",
    className: "border-status-crit/25 bg-status-crit-bg text-status-crit",
  },
  cancelled: {
    label: "Cancelado",
    className: "border-status-warn/25 bg-status-warn-bg text-status-warn",
  },
} as const;

export function Topbar() {
  const { reset, currentConsultationId, setCurrentConsultationId, setPatientId, setPatient, setPatientName, patientName, setFollowupItems, toggleProblem, setProblemsOther } = useConsultationStore();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [patientSelectorOpen, setPatientSelectorOpen] = useState(false);
  const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const pathname = usePathname();
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const hotkeyMap = useMemo(
    () => ({
      "mod+s": () => handleSave(),
      "mod+n": () => setPatientSelectorOpen(true),
      "mod+h": () => setHistoryOpen((v) => !v),
      "mod+p": () => { if (patientName) setDashboardOpen((v) => !v); },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userId, patientName]
  );

  useHotkeys(hotkeyMap);

  async function handleCheckout() {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        showToast(data.error || "Erro ao iniciar checkout", "error");
      }
    } catch {
      showToast("Erro de conexão", "error");
    } finally {
      setCheckoutLoading(false);
    }
  }

  async function handleSave() {
    if (!userId) {
      showToast("Sessão expirada, faça login novamente", "error");
      return;
    }

    setSaveLoading(true);
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

      showToast("Consulta salva!", "success");
      // Persistir problemas longitudinais no nível do paciente
      const currentState = useConsultationStore.getState();
      if (currentState.patientId) {
        const allProblems = [
          ...currentState.problems,
          ...(currentState.problemsOther
            ? currentState.problemsOther.split(",").map((s) => s.trim()).filter(Boolean)
            : []),
        ];
        upsertPatientProblems(userId, currentState.patientId, allProblems).catch(() => {
          // silencioso — não bloqueia o fluxo principal
        });
      }
    } catch {
      showToast("Erro ao salvar consulta", "error");
    } finally {
      setSaveLoading(false);
    }
  }

  function handlePatientSelected(patient: Patient) {
    reset();
    setPatientId(patient.id);
    setPatientName(patient.name);
    // Carregar pendências da última consulta deste paciente
    // Usa getState() após reset() para obter currentConsultationId pós-reset (null em nova consulta)
    if (userId) {
      const selectedPatientId = patient.id;
      const excludeId = useConsultationStore.getState().currentConsultationId ?? undefined;
      getFollowupFromLastConsultation(userId, patient.id, excludeId).then((items) => {
        if (useConsultationStore.getState().patientId === selectedPatientId && items.length > 0) {
          setFollowupItems(items);
        }
      });
      // Pré-carregar medicamentos contínuos no campo prescrição
      getPatientMedications(patient.id).then((meds) => {
        if (meds.length > 0 && useConsultationStore.getState().patientId === selectedPatientId) {
          const medLines = meds.map((m) =>
            m.dosage ? `${m.medication_name} - ${m.dosage}` : m.medication_name
          );
          useConsultationStore.getState().setPrescription(medLines.join("\n"));
        }
      });
      // Pré-marcar problemas ativos do paciente
      getPatientProblems(patient.id).then((activeProblems) => {
        const knownSet = new Set<string>(PROBLEMS);
        const freeProblems: string[] = [];

        activeProblems.forEach((p) => {
          if (knownSet.has(p)) {
            useConsultationStore.getState().toggleProblem(p);
          } else {
            freeProblems.push(p);
          }
        });

        if (freeProblems.length > 0) {
          setProblemsOther(freeProblems.join(", "));
        }
      });
    }
    const age = patient.birth_date
      ? (() => {
          const today = new Date();
          const birth = new Date(patient.birth_date!);
          let a = today.getFullYear() - birth.getFullYear();
          const m = today.getMonth() - birth.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--;
          return `${a} anos`;
        })()
      : "";
    setPatient({
      name: patient.name,
      age,
      gender: (patient.gender as "Masculino" | "Feminino" | "Outro" | "") ?? "",
      race: (patient.race as "Branco" | "Pardo" | "Preto" | "Amarelo" | "Indígena" | "") ?? "",
    });
    setPatientSelectorOpen(false);
    showToast(`Nova consulta — ${patient.name}`, "info");
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  const initials = userName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const isPro = subscriptionStatus === "active";
  const subscriptionMeta =
    SUBSCRIPTION_META[subscriptionStatus as keyof typeof SUBSCRIPTION_META] ?? {
      label: subscriptionStatus || "Conta",
      className: "border-border-default bg-bg-2 text-text-secondary",
    };

  return (
    <>
      <HistoryPanel open={historyOpen} onClose={() => setHistoryOpen(false)} />
      <PatientSelector
        open={patientSelectorOpen}
        onSelect={handlePatientSelected}
        onClose={() => setPatientSelectorOpen(false)}
      />
      <TemplateSelector
        open={templateSelectorOpen}
        onClose={() => setTemplateSelectorOpen(false)}
      />
      <PatientDashboard
        open={dashboardOpen}
        onClose={() => setDashboardOpen(false)}
      />
      <div className="sticky top-0 z-30 bg-surface-low">
        <div className="flex items-center justify-between px-6 h-14">
          {/* Logo */}
          <div className="flex items-center gap-5 min-w-0 shrink-0">
            <span className="font-headline text-xl font-bold text-primary">{BRAND.name}</span>
          </div>

          {/* Patient name — centro */}
          {patientName && (
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-status-ok shrink-0" />
              <span className="font-headline italic text-[15px] text-on-surface truncate max-w-[280px]">
                {patientName}
              </span>
            </div>
          )}

          {/* Nav — centro-esquerda */}
          <nav className="hidden lg:flex items-center gap-1 ml-4">
            <button
              onClick={() => router.push("/consulta")}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors cursor-pointer ${
                pathname === "/consulta"
                  ? "bg-primary/8 text-primary font-semibold"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              Consulta
            </button>
            <button
              onClick={() => router.push("/historico")}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors cursor-pointer ${
                pathname === "/historico"
                  ? "bg-primary/8 text-primary font-semibold"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              Histórico
            </button>
          </nav>

          {/* Ações — direita */}
          <div className="flex gap-2 items-center">
            <div
              className={`hidden sm:inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium ${subscriptionMeta.className}`}
            >
              {subscriptionMeta.label}
            </div>

            {!isPro && (
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="px-3 py-1.5 rounded-lg text-[12px] font-semibold cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-on-primary hover:bg-primary-container"
              >
                {checkoutLoading ? "Redirecionando..." : "Ativar Pro"}
              </button>
            )}

            <button
              onClick={() => setHistoryOpen(true)}
              className="h-[34px] px-3 rounded-lg text-[13px] font-medium border border-outline-variant/50 text-on-surface-variant bg-surface-lowest hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
            >
              SOAP anterior
            </button>

            <button
              onClick={() => setTemplateSelectorOpen(true)}
              className="h-[34px] px-3 rounded-lg text-[13px] font-medium border border-outline-variant/50 text-on-surface-variant bg-surface-lowest hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
            >
              Template
            </button>

            {patientName && (
              <button
                onClick={() => setDashboardOpen(true)}
                className="h-[34px] px-3 rounded-lg text-[13px] font-medium border border-secondary/30 text-secondary bg-secondary-container/20 hover:bg-secondary-container/40 transition-colors cursor-pointer"
              >
                Prontuário
              </button>
            )}

            <Button
              variant="secondary"
              className="h-[34px] px-3 text-[13px]"
              onClick={() => setPatientSelectorOpen(true)}
            >
              Nova consulta
            </Button>

            <Button
              variant="primary"
              className="h-[34px] px-4 text-[13px]"
              onClick={handleSave}
              disabled={saveLoading}
            >
              {saveLoading ? "Salvando..." : currentConsultationId ? "Atualizar" : "Salvar"}
            </Button>

            <div className="relative ml-1" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="h-9 rounded-full border border-outline-variant/50 bg-surface-lowest pl-1.5 pr-2.5 flex items-center gap-2 text-left hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="w-7 h-7 rounded-full bg-surface-container border border-outline-variant/30 flex items-center justify-center text-[11px] font-semibold text-on-surface-variant">
                  {initials || "?"}
                </span>
                <span className="hidden lg:flex flex-col leading-none min-w-0">
                  <span className="text-[12px] font-medium text-on-surface truncate max-w-[140px]">
                    {userName || "Minha conta"}
                  </span>
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-11 w-56 bg-surface-lowest border border-outline-variant/30 rounded-xl shadow-[0_8px_30px_rgba(23,28,31,0.10)] py-1.5 z-[60]">
                  {userName && (
                    <div className="px-4 py-3 border-b border-outline-variant/30">
                      <p className="text-[13px] font-medium text-on-surface truncate">
                        {userName}
                      </p>
                      <p className="text-[12px] text-on-surface-muted mt-0.5">
                        {subscriptionMeta.label}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={() => { setMenuOpen(false); router.push("/conta"); }}
                    className="w-full text-left px-4 py-2.5 text-[13px] text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                  >
                    Minha conta
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-[13px] text-on-surface-variant hover:text-error hover:bg-surface-container transition-colors cursor-pointer"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
