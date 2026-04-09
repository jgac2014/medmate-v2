"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HistoryPanel } from "@/components/consultation/history-panel";
import { PatientDashboard } from "@/components/consultation/patient-dashboard";
import { PatientSelector } from "@/components/consultation/patient-selector";
import { TemplateSelector } from "@/components/consultation/template-selector";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/toast";
import { useHotkeys } from "@/hooks/useHotkeys";
import { prepareConsultationForPatient } from "@/lib/consultation/patient-context";
import { BRAND } from "@/lib/branding";
import { redirectToCheckout } from "@/lib/billing";
import { createClient } from "@/lib/supabase/client";
import { saveConsultation } from "@/lib/supabase/consultations";
import { upsertPatientProblems } from "@/lib/supabase/patient-problems";
import { useConsultationStore } from "@/stores/consultation-store";
import type { Patient } from "@/types";

const SUBSCRIPTION_META = {
  active: {
    label: "Pro ativo",
    className: "border-status-ok/25 bg-status-ok-bg text-status-ok",
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
  const { reset, currentConsultationId, setCurrentConsultationId, patientName } =
    useConsultationStore();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [patientSelectorOpen, setPatientSelectorOpen] = useState(false);
  const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

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
          .select("name, subscription_status, trial_ends_at")
          .eq("id", user.id)
          .single();

        if (data) {
          setUserName(data.name);
          setSubscriptionStatus(data.subscription_status);
          setTrialEndsAt(data.trial_ends_at ?? null);
        }
      }
    }

    loadUser();
  }, []);

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

      showToast("Consulta salva!", "success");
    } catch {
      showToast("Erro ao salvar consulta", "error");
    } finally {
      setSaveLoading(false);
    }
  }, [currentConsultationId, setCurrentConsultationId, userId]);

  const hotkeyMap = useMemo(
    () => ({
      "mod+s": () => handleSave(),
      "mod+n": () => setPatientSelectorOpen(true),
      "mod+h": () => setHistoryOpen((value) => !value),
      "mod+p": () => {
        if (patientName) setDashboardOpen((value) => !value);
      },
    }),
    [handleSave, patientName]
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

  const trialDaysLeft =
    subscriptionStatus === "trial" && trialEndsAt
      ? Math.max(0, Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / 86_400_000))
      : null;

  const trialLabel =
    trialDaysLeft === null
      ? "Trial"
      : trialDaysLeft === 1
        ? "Trial · expira hoje"
        : `Trial · ${trialDaysLeft}d`;

  const subscriptionMeta =
    subscriptionStatus === "trial"
      ? {
          label: trialLabel,
          className: "border-status-info/25 bg-status-info-bg text-status-info",
        }
      : SUBSCRIPTION_META[subscriptionStatus as keyof typeof SUBSCRIPTION_META] ?? {
          label: subscriptionStatus || "Conta",
          className: "border-outline bg-surface-container text-on-surface-variant",
        };

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

      <div className="sticky top-0 z-30 bg-surface-low">
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex min-w-0 shrink-0 items-center gap-5">
            <button
              onClick={() => router.push("/")}
              className="font-headline text-xl font-bold text-primary transition-opacity hover:opacity-75"
            >
              {BRAND.name}
            </button>
          </div>

          {patientName && (
            <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-status-ok" />
              <span className="max-w-[280px] truncate font-headline text-[15px] italic text-on-surface">
                {patientName}
              </span>
            </div>
          )}

          <nav className="ml-4 hidden items-center gap-1 lg:flex">
            <NavButton
              active={pathname === "/nova-consulta"}
              onClick={() => router.push("/nova-consulta")}
              label="Nova consulta"
            />
            <NavButton
              active={pathname === "/consulta"}
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
            <NavButton
              active={pathname === "/receituario"}
              onClick={() => router.push("/receituario")}
              label="Receituário"
            />
            <NavButton
              active={pathname === "/pedidos"}
              onClick={() => router.push("/pedidos")}
              label="Pedidos"
            />
          </nav>

          <div className="flex items-center gap-2">
            <div
              className={`hidden rounded-full border px-2.5 py-1 text-[11px] font-medium sm:inline-flex ${subscriptionMeta.className}`}
            >
              {subscriptionMeta.label}
            </div>

            {!isPro && (
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="rounded-lg bg-primary px-3 py-1.5 text-[12px] font-semibold text-on-primary transition-all duration-200 hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50"
              >
                {checkoutLoading ? "Redirecionando..." : "Ativar Pro"}
              </button>
            )}

            <button
              onClick={() => setHistoryOpen(true)}
              className="h-[34px] rounded-lg border border-outline-variant/50 bg-surface-lowest px-3 text-[13px] font-medium text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
            >
              SOAP anterior
            </button>

            <button
              onClick={() => setTemplateSelectorOpen(true)}
              className="h-[34px] rounded-lg border border-outline-variant/50 bg-surface-lowest px-3 text-[13px] font-medium text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
            >
              Template
            </button>

            {patientName && (
              <button
                onClick={() => setDashboardOpen(true)}
                className="h-[34px] rounded-lg border border-secondary/30 bg-secondary-container/20 px-3 text-[13px] font-medium text-secondary transition-colors hover:bg-secondary-container/40"
              >
                Prontuário
              </button>
            )}

            <Button
              variant="secondary"
              className="h-[34px] px-3 text-[13px]"
              onClick={() => router.push("/nova-consulta")}
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
                className="flex h-9 items-center gap-2 rounded-full border border-outline-variant/50 bg-surface-lowest pl-1.5 pr-2.5 text-left transition-colors hover:bg-surface-container"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-outline-variant/30 bg-surface-container text-[11px] font-semibold text-on-surface-variant">
                  {initials}
                </span>
                <span className="hidden min-w-0 flex-col leading-none lg:flex">
                  <span className="max-w-[140px] truncate text-[12px] font-medium text-on-surface">
                    {userName || "Minha conta"}
                  </span>
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-11 z-[60] w-56 rounded-xl border border-outline-variant/30 bg-surface-lowest py-1.5 shadow-[0_8px_30px_rgba(23,28,31,0.10)]">
                  {userName && (
                    <div className="border-b border-outline-variant/30 px-4 py-3">
                      <p className="truncate text-[13px] font-medium text-on-surface">{userName}</p>
                      <p className="mt-0.5 text-[12px] text-on-surface-muted">
                        {subscriptionMeta.label}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      router.push("/conta");
                    }}
                    className="w-full px-4 py-2.5 text-left text-[13px] text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
                  >
                    Minha conta
                  </button>
                  <a
                    href={`mailto:${BRAND.supportEmail}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined text-[15px] leading-none">mail</span>
                    Suporte
                  </a>
                  <div className="my-1 border-t border-outline-variant/30" />
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left text-[13px] text-on-surface-variant transition-colors hover:bg-surface-container hover:text-error"
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
