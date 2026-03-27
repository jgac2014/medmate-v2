"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BRAND } from "@/lib/branding";

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
    <div className="w-full max-w-sm bg-bg-1 border border-border-subtle rounded-lg p-8">
      <div className="flex items-center gap-2 mb-6 justify-center">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-black text-[12px] font-extrabold font-mono">
          {BRAND.shortName}
        </div>
        <span className="font-bold text-[14px] text-text-primary">{BRAND.name}</span>
      </div>

      {success ? (
        <div className="text-center space-y-3">
          <p className="text-sm text-text-primary font-medium">
            Email enviado!
          </p>
          <p className="text-xs text-text-secondary">
            Verifique sua caixa de entrada e clique no link para redefinir sua senha.
          </p>
          <a
            href="/login"
            className="block text-xs text-accent hover:underline mt-4"
          >
            Voltar ao login
          </a>
        </div>
      ) : (
        <>
          <p className="text-xs text-text-secondary text-center mb-4">
            Informe seu email e enviaremos um link para redefinir sua senha.
          </p>

          <form onSubmit={handleReset} className="space-y-3">
            <Input
              label="Email"
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {error && <p className="text-xs text-status-crit">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Enviando..." : "Enviar link de recuperação"}
            </Button>
          </form>

          <p className="text-xs text-text-tertiary text-center mt-4">
            Lembrou a senha?{" "}
            <a href="/login" className="text-accent hover:underline">
              Entrar
            </a>
          </p>
        </>
      )}
    </div>
  );
}
