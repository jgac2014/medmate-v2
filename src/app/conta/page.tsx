"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { BRAND } from "@/lib/branding";
import { showToast, ToastProvider } from "@/components/ui/toast";

type UserProfile = {
  name: string;
  email: string;
  subscription_status: string;
  trial_ends_at: string | null;
  stripe_customer_id: string | null;
  created_at: string;
};

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "Pro ativo", color: "text-status-ok", bg: "bg-status-ok-bg" },
  trial: { label: "Trial", color: "text-status-info", bg: "bg-status-info-bg" },
  expired: { label: "Expirado", color: "text-status-crit", bg: "bg-status-crit-bg" },
  cancelled: { label: "Cancelado", color: "text-status-warn", bg: "bg-status-warn-bg" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function isTrialActive(status: string, trialEndsAt: string | null): boolean {
  if (status !== "trial") return false;
  if (!trialEndsAt) return false;
  return new Date(trialEndsAt) > new Date();
}

function trialDaysLeft(trialEndsAt: string | null): number {
  if (!trialEndsAt) return 0;
  const diff = new Date(trialEndsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function ContaPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      const { data } = await supabase
        .from("users")
        .select("name, email, subscription_status, trial_ends_at, stripe_customer_id, created_at")
        .eq("id", user.id)
        .single();
      setProfile(data);
      setLoading(false);
    }
    load();
  }, [router]);

  async function handlePortal() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/create-portal-session", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        showToast(data.error || "Erro ao abrir portal", "error");
      }
    } catch {
      showToast("Erro de conexão", "error");
    } finally {
      setPortalLoading(false);
    }
  }

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

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-0 flex items-center justify-center">
        <div className="text-text-tertiary text-[13px]">Carregando...</div>
      </div>
    );
  }

  if (!profile) return null;

  const statusInfo = STATUS_MAP[profile.subscription_status] ?? {
    label: profile.subscription_status,
    color: "text-text-secondary",
    bg: "bg-bg-2",
  };

  const trialActive = isTrialActive(profile.subscription_status, profile.trial_ends_at);
  const daysLeft = trialDaysLeft(profile.trial_ends_at);
  const hasStripe = !!profile.stripe_customer_id;
  const isActive = profile.subscription_status === "active";
  const isBlocked = !isActive && !trialActive;

  return (
    <div className="min-h-screen bg-bg-0 flex items-center justify-center p-4">
      <div className="bg-bg-1 border border-border-subtle rounded-xl px-8 py-10 max-w-[480px] w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[7px] bg-accent flex items-center justify-center text-black text-[11px] font-extrabold font-mono">
              {BRAND.shortName}
            </div>
            <span className="font-bold text-[14px] text-text-primary">{BRAND.name}</span>
          </div>
          {!isBlocked && (
            <Link
              href="/consulta"
              className="text-[12px] text-text-tertiary hover:text-text-secondary transition-colors"
            >
              Voltar ao consultorio
            </Link>
          )}
        </div>

        <h1 className="text-[18px] font-semibold text-text-primary tracking-[-0.02em] mb-6">
          Minha conta
        </h1>

        {/* User info */}
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center py-2 border-b border-border-subtle">
            <span className="text-[12px] text-text-tertiary">Nome</span>
            <span className="text-[13px] text-text-primary font-medium">{profile.name}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border-subtle">
            <span className="text-[12px] text-text-tertiary">Email</span>
            <span className="text-[13px] text-text-primary">{profile.email}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border-subtle">
            <span className="text-[12px] text-text-tertiary">Membro desde</span>
            <span className="text-[13px] text-text-primary">{formatDate(profile.created_at)}</span>
          </div>
        </div>

        {/* Subscription status */}
        <div className="bg-bg-2 rounded-lg p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] text-text-tertiary uppercase tracking-wider">Assinatura</span>
            <span className={`text-[12px] font-semibold px-2.5 py-0.5 rounded-full ${statusInfo.color} ${statusInfo.bg}`}>
              {statusInfo.label}
            </span>
          </div>

          {/* Trial info */}
          {profile.subscription_status === "trial" && profile.trial_ends_at && (
            <div className="mt-2">
              {trialActive ? (
                <p className="text-[13px] text-text-secondary">
                  Seu trial expira em <span className="text-text-primary font-medium">{daysLeft} dia{daysLeft !== 1 ? "s" : ""}</span>
                  {" "}({formatDate(profile.trial_ends_at)})
                </p>
              ) : (
                <p className="text-[13px] text-status-crit">
                  Seu trial expirou em {formatDate(profile.trial_ends_at)}
                </p>
              )}
            </div>
          )}

          {profile.subscription_status === "expired" && (
            <p className="text-[13px] text-status-crit mt-2">
              Seu pagamento falhou ou está pendente. Atualize seu meio de pagamento.
            </p>
          )}

          {profile.subscription_status === "cancelled" && (
            <p className="text-[13px] text-text-secondary mt-2">
              Sua assinatura foi cancelada. Assine novamente para recuperar o acesso.
            </p>
          )}

          {isActive && (
            <p className="text-[13px] text-text-secondary mt-2">
              Todas as funcionalidades do MedMate estao liberadas.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {/* Show checkout button for users without active subscription */}
          {!isActive && (
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="w-full px-6 py-2.5 bg-accent hover:bg-accent-hover text-bg-0 font-semibold rounded-lg transition-all duration-200 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {checkoutLoading ? "Redirecionando..." : "Assinar plano Pro"}
            </button>
          )}

          {/* Show portal button for users with Stripe customer */}
          {hasStripe && (
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              className="w-full px-6 py-2.5 bg-bg-2 hover:bg-bg-3 text-text-primary font-medium rounded-lg transition-all duration-200 text-[13px] border border-border-subtle disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {portalLoading ? "Abrindo portal..." : "Gerenciar assinatura"}
            </button>
          )}

          <button
            onClick={handleLogout}
            className="text-text-tertiary hover:text-text-secondary text-[12px] mt-2 cursor-pointer transition-colors"
          >
            Sair da conta
          </button>
        </div>
      </div>
      <ToastProvider />
    </div>
  );
}
