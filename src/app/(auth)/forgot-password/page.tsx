"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BRAND } from "@/lib/branding";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <Link href="/" className="inline-block">
          <span className="text-[26px] font-bold tracking-[-0.03em] text-text-primary">{BRAND.name}</span>
        </Link>
        <p className="text-[14px] text-text-secondary mt-1">Recuperação de senha</p>
      </div>

      <div className="bg-white border border-border-subtle rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
        {success ? (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mx-auto">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <div>
              <p className="text-[16px] font-semibold text-text-primary">Email enviado!</p>
              <p className="text-[14px] text-text-secondary mt-1">
                Verifique sua caixa de entrada e clique no link para redefinir sua senha.
              </p>
            </div>
            <Link href="/login" className="inline-block text-[13px] text-accent hover:underline font-medium mt-2">
              Voltar ao login
            </Link>
          </div>
        ) : (
          <>
            <p className="text-[14px] text-text-secondary mb-6">
              Informe seu email e enviaremos um link para redefinir sua senha.
            </p>
            <form onSubmit={handleReset} className="space-y-4">
              <Input
                label="Email"
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {error && (
                <div className="px-3 py-2.5 bg-status-crit-bg border border-status-crit/20 rounded-lg">
                  <p className="text-[13px] text-status-crit">{error}</p>
                </div>
              )}
              <Button type="submit" className="w-full h-[44px] text-[14px]" disabled={loading}>
                {loading ? "Enviando..." : "Enviar link de recuperação"}
              </Button>
            </form>
            <p className="text-[13px] text-text-tertiary text-center mt-4">
              Lembrou a senha?{" "}
              <Link href="/login" className="text-accent font-medium hover:underline">Entrar</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
