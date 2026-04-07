"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BRAND } from "@/lib/branding";
import { createClient } from "@/lib/supabase/client";
import { showToast, ToastProvider } from "@/components/ui/toast";
import { redirectToCheckout, redirectToPortal } from "@/lib/billing";

type BlockReason =
  | "trial_expired"
  | "trial_active_wrongly_blocked" // middleware bug: trial still valid
  | "payment_failed"
  | "cancelled"
  | "unknown";

// Maps DB subscription_status values (written by the Stripe webhook handler) to a
// UI reason. The webhook maps all Stripe statuses to: active | trial | expired | cancelled.
// "expired" covers past_due, unpaid, incomplete — all payment-failure scenarios.
function getBlockReason(
  status: string | null,
  trialEndsAt: string | null
): BlockReason {
  if (status === "trial") {
    if (!trialEndsAt || new Date(trialEndsAt) <= new Date()) return "trial_expired";
    // Trial still active — should not be here; likely a middleware race condition.
    return "trial_active_wrongly_blocked";
  }
  if (status === "expired") return "payment_failed"; // any Stripe payment-failure state
  if (status === "cancelled") return "cancelled";
  return "unknown"; // null or unrecognised value
}

const REASON_COPY: Record<BlockReason, { title: string; body: string }> = {
  trial_expired: {
    title: "Seu trial de 14 dias encerrou",
    body: "Assine o plano Pro para continuar usando o MedMate e manter acesso ao histórico dos seus pacientes.",
  },
  trial_active_wrongly_blocked: {
    title: "Acesso temporariamente indisponível",
    body: "Seu trial ainda está ativo. Tente recarregar a página ou fazer login novamente. Se o problema persistir, entre em contato com o suporte.",
  },
  payment_failed: {
    title: "Problema com seu pagamento",
    body: "Houve uma falha no pagamento da assinatura. Atualize seu meio de pagamento para reativar o acesso.",
  },
  cancelled: {
    title: "Assinatura cancelada",
    body: "Sua assinatura foi cancelada. Assine novamente para recuperar o acesso completo.",
  },
  unknown: {
    title: "Acesso bloqueado",
    body: "Sua assinatura está inativa. Assine o plano Pro para continuar usando o MedMate.",
  },
};

export default function BloqueadoPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  // null while loading — prevents premature render of wrong copy
  const [reason, setReason] = useState<BlockReason | null>(null);
  const [hasStripe, setHasStripe] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/billing-status");
        if (!res.ok) {
          showToast("Não foi possível carregar dados da conta", "error");
          setReason("unknown");
          return;
        }
        const data = await res.json();
        setReason(getBlockReason(data.subscriptionStatus, data.trialEndsAt));
        setHasStripe(data.hasStripe);
      } catch {
        showToast("Não foi possível carregar dados da conta", "error");
        setReason("unknown");
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  async function handleCheckout() {
    setCheckoutLoading(true);
    await redirectToCheckout();
    setCheckoutLoading(false);
  }

  async function handlePortal() {
    setPortalLoading(true);
    await redirectToPortal();
    setPortalLoading(false);
  }

  async function handleLogout() {
    setLogoutLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  // Determine primary CTA.
  // Rule: if the user already has a Stripe customer, prefer portal over checkout
  // for any blocked state — avoids creating a duplicate subscription.
  function renderPrimaryCTA() {
    if (isLoading || reason === null) {
      return (
        <div className="w-full px-6 py-2.5 bg-surface-container rounded-lg text-[13px] text-on-surface-muted text-center animate-pulse">
          &nbsp;
        </div>
      );
    }

    if (reason === "trial_active_wrongly_blocked") {
      return (
        <button
          onClick={() => { window.location.href = "/consulta"; }}
          className="w-full px-6 py-2.5 bg-primary hover:bg-primary-hover text-bg-0 font-semibold rounded-lg transition-all duration-200 text-[13px] cursor-pointer"
        >
          Tentar novamente
        </button>
      );
    }

    if (reason === "payment_failed" && hasStripe) {
      return (
        <button
          onClick={handlePortal}
          disabled={portalLoading}
          className="w-full px-6 py-2.5 bg-primary hover:bg-primary-hover text-bg-0 font-semibold rounded-lg transition-all duration-200 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {portalLoading ? "Abrindo portal..." : "Atualizar meio de pagamento"}
        </button>
      );
    }

    if (reason === "payment_failed" && !hasStripe) {
      return (
        <p className="text-[13px] text-on-surface-variant bg-surface-container rounded-lg px-4 py-3">
          Entre em contato com o suporte para resolver a situação da sua conta.
        </p>
      );
    }

    // cancelled + Stripe customer → reactivate via portal (avoids duplicate subscription)
    if (reason === "cancelled" && hasStripe) {
      return (
        <button
          onClick={handlePortal}
          disabled={portalLoading}
          className="w-full px-6 py-2.5 bg-primary hover:bg-primary-hover text-bg-0 font-semibold rounded-lg transition-all duration-200 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {portalLoading ? "Abrindo portal..." : "Reativar assinatura"}
        </button>
      );
    }

    // unknown + hasStripe → portal to avoid duplicate subscription
    if (reason === "unknown" && hasStripe) {
      return (
        <button
          onClick={handlePortal}
          disabled={portalLoading}
          className="w-full px-6 py-2.5 bg-primary hover:bg-primary-hover text-bg-0 font-semibold rounded-lg transition-all duration-200 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {portalLoading ? "Abrindo portal..." : "Gerenciar assinatura"}
        </button>
      );
    }

    // trial_expired | cancelled (no Stripe) | unknown (no Stripe) → new subscription
    return (
      <button
        onClick={handleCheckout}
        disabled={checkoutLoading}
        className="w-full px-6 py-2.5 bg-primary hover:bg-primary-hover text-bg-0 font-semibold rounded-lg transition-all duration-200 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {checkoutLoading
          ? "Redirecionando..."
          : `Assinar plano Pro — ${BRAND.planPrice}`}
      </button>
    );
  }

  // While loading: neutral skeleton header so the user isn't alarmed by "wrong" copy
  const displayTitle = isLoading || reason === null
    ? "Verificando sua assinatura..."
    : REASON_COPY[reason].title;
  const displayBody = isLoading || reason === null
    ? ""
    : REASON_COPY[reason].body;
  return (
    <div className="min-h-screen bg-surface-lowest flex items-center justify-center">
      <div className="bg-surface-low border border-outline-variant rounded-xl px-10 py-12 max-w-[460px] w-full text-center">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-black text-[12px] font-extrabold font-mono">
            {BRAND.shortName}
          </div>
          <span className="font-bold text-[14px] text-on-surface">{BRAND.name}</span>
        </div>

        {/* Icon */}
        <div className="mx-auto mb-6 w-14 h-14 rounded-full bg-status-warn-bg flex items-center justify-center">
          <svg
            className="w-7 h-7 text-status-warn"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>

        <h1 className="text-[20px] font-semibold text-on-surface tracking-[-0.02em] mb-2">
          {displayTitle}
        </h1>

        {/* Reserve fixed height to prevent CLS when body text appears */}
        <p className="text-on-surface-variant text-[13px] leading-relaxed mb-8 max-w-[340px] mx-auto min-h-[3.5rem]">
          {displayBody}
        </p>

        <div className="flex flex-col gap-3">
          {renderPrimaryCTA()}

          {!isLoading && reason !== null && reason !== "trial_active_wrongly_blocked" && (
            <Link
              href="/conta"
              className="w-full px-6 py-2.5 bg-surface-container hover:bg-surface-high text-on-surface font-medium rounded-lg transition-all duration-200 text-[13px] border border-outline-variant inline-block"
            >
              Ver detalhes da conta
            </Link>
          )}

          <button
            onClick={handleLogout}
            disabled={logoutLoading || isLoading}
            className="text-on-surface-muted hover:text-on-surface-variant text-[12px] mt-2 cursor-pointer transition-colors disabled:opacity-50"
          >
            {logoutLoading ? "Saindo..." : "Sair da conta"}
          </button>
        </div>
      </div>
      <ToastProvider />
    </div>
  );
}
