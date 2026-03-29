"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { BRAND } from "@/lib/branding";
import { Button } from "@/components/ui/button";
import { useConsultationStore } from "@/stores/consultation-store";
import { showToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import { saveConsultation } from "@/lib/supabase/consultations";
import { getFollowupFromLastConsultation } from "@/lib/supabase/followup";
import { HistoryPanel } from "@/components/consultation/history-panel";
import { PatientSelector } from "@/components/consultation/patient-selector";
import { TemplateSelector } from "@/components/consultation/template-selector";
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
  const { reset, currentConsultationId, setCurrentConsultationId, setPatientId, setPatient, setPatientName, patientName, setFollowupItems } = useConsultationStore();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [patientSelectorOpen, setPatientSelectorOpen] = useState(false);
  const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
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
    if (userId) {
      getFollowupFromLastConsultation(userId, patient.id).then((items) => {
        if (items.length > 0) setFollowupItems(items);
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

      <div className="sticky top-0 z-30 border-b border-white/5 bg-bg-1/88 backdrop-blur-xl shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
        <div className="flex items-center justify-between px-5 h-14">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-[9px] font-bold text-[14px] tracking-[-0.02em] text-text-primary shrink-0">
              <div className="w-8 h-8 rounded-[9px] bg-accent flex items-center justify-center text-black text-[12px] font-extrabold font-mono tracking-[-0.04em] shrink-0 shadow-[0_0_18px_rgba(0,208,132,0.16)]">
                {BRAND.shortName}
              </div>
              <div className="flex flex-col leading-none">
                <span>{BRAND.name}</span>
                <span className="text-[10px] font-medium tracking-[0.08em] uppercase text-text-tertiary mt-1">
                  Área clínica
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 min-w-0">
              <div className="h-6 w-px bg-border-subtle" />
              <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-2/80 px-3 py-1 text-[11px] text-text-secondary">
                <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(0,208,132,0.3)]" />
                <span className="font-medium text-text-primary">Consulta</span>
                <span className="text-text-tertiary">workspace principal</span>
              </div>
            </div>
          </div>

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
                className="px-3 py-1.5 rounded-md text-[11px] font-semibold tracking-wide cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-status-info/20 text-status-info bg-status-info-bg hover:bg-[rgba(75,158,255,0.12)] hover:border-status-info/40"
              >
                {checkoutLoading ? "Redirecionando..." : "Ativar Pro"}
              </button>
            )}

            <button
              onClick={() => setHistoryOpen(true)}
              className="h-[32px] px-3 rounded-md text-[12px] font-medium border border-border-subtle text-text-secondary bg-transparent hover:bg-bg-2 hover:text-text-primary hover:border-border-default transition-colors cursor-pointer"
            >
              Histórico
            </button>

            <button
              onClick={() => setTemplateSelectorOpen(true)}
              className="h-[32px] px-3 rounded-md text-[12px] font-medium border border-border-subtle text-text-secondary bg-transparent hover:bg-bg-2 hover:text-text-primary hover:border-border-default transition-colors cursor-pointer"
            >
              Template
            </button>

            {patientName && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-bg-2 rounded-full border border-border-subtle max-w-[180px]">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span className="text-[11px] text-text-primary truncate font-medium">{patientName}</span>
              </div>
            )}

            <Button
              variant="secondary"
              className="h-[32px] px-3 text-[12px]"
              onClick={() => setPatientSelectorOpen(true)}
            >
              Nova consulta
            </Button>

            <Button
              variant="primary"
              className="h-[32px] px-3.5 text-[12px]"
              onClick={handleSave}
              disabled={saveLoading}
            >
              {saveLoading ? "Salvando..." : currentConsultationId ? "Atualizar" : "Salvar"}
            </Button>

            <div className="relative ml-1" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="h-9 rounded-full border border-border-subtle bg-bg-2/90 pl-1.5 pr-2 flex items-center gap-2 text-left hover:border-border-default transition-colors cursor-pointer"
              >
                <span className="w-7 h-7 rounded-full bg-bg-3 border border-border-subtle flex items-center justify-center text-[11px] font-semibold text-text-secondary">
                  {initials || "?"}
                </span>
                <span className="hidden lg:flex flex-col leading-none min-w-0">
                  <span className="text-[11px] font-medium text-text-primary truncate max-w-[140px]">
                    {userName || "Minha conta"}
                  </span>
                  <span className="text-[10px] text-text-tertiary mt-1">
                    Configurações e assinatura
                  </span>
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-11 w-56 bg-bg-1 border border-border-subtle rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.3)] py-1.5 z-[60]">
                  {userName && (
                    <div className="px-3 py-2.5 border-b border-border-subtle">
                      <p className="text-[12px] font-medium text-text-primary truncate">
                        {userName}
                      </p>
                      <p className="text-[11px] text-text-tertiary mt-0.5">
                        {subscriptionMeta.label}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      router.push("/conta");
                    }}
                    className="w-full text-left px-3 py-2 text-[12px] text-text-secondary hover:text-text-primary hover:bg-bg-2 transition-colors cursor-pointer"
                  >
                    Minha conta
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-[12px] text-text-secondary hover:text-status-crit hover:bg-bg-2 transition-colors cursor-pointer"
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
