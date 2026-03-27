"use client";

import { useState } from "react";
import Link from "next/link";
import { BRAND } from "@/lib/branding";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/components/ui/toast";
import { ToastProvider } from "@/components/ui/toast";

export default function BloqueadoPage() {
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

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
    setLogoutLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-bg-0 flex items-center justify-center">
      <div className="bg-bg-1 border border-border-subtle rounded-xl px-10 py-12 max-w-[460px] w-full text-center">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-black text-[12px] font-extrabold font-mono">
            {BRAND.shortName}
          </div>
          <span className="font-bold text-[14px] text-text-primary">{BRAND.name}</span>
        </div>

        {/* Icon */}
        <div className="mx-auto mb-6 w-14 h-14 rounded-full bg-status-warn-bg flex items-center justify-center">
          <svg className="w-7 h-7 text-status-warn" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>

        <h1 className="text-[20px] font-semibold text-text-primary tracking-[-0.02em] mb-2">
          Acesso bloqueado
        </h1>

        <p className="text-text-secondary text-[13px] leading-relaxed mb-8 max-w-[340px] mx-auto">
          Seu período de teste expirou ou sua assinatura está inativa. Assine o plano Pro para continuar usando o MedMate.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="w-full px-6 py-2.5 bg-accent hover:bg-accent-hover text-bg-0 font-semibold rounded-lg transition-all duration-200 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {checkoutLoading ? "Redirecionando..." : "Assinar plano Pro"}
          </button>

          <Link
            href="/conta"
            className="w-full px-6 py-2.5 bg-bg-2 hover:bg-bg-3 text-text-primary font-medium rounded-lg transition-all duration-200 text-[13px] border border-border-subtle inline-block"
          >
            Ver detalhes da conta
          </Link>

          <button
            onClick={handleLogout}
            disabled={logoutLoading}
            className="text-text-tertiary hover:text-text-secondary text-[12px] mt-2 cursor-pointer transition-colors"
          >
            {logoutLoading ? "Saindo..." : "Sair da conta"}
          </button>
        </div>
      </div>
      <ToastProvider />
    </div>
  );
}
