"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BRAND } from "@/lib/branding";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Supabase sets the session automatically from the callback URL hash/code
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionReady(true);
      } else {
        setError("Sessão expirada. Solicite um novo link de recuperação.");
      }
    });
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    // Redirect to app after 2 seconds
    setTimeout(() => {
      router.push("/consulta");
      router.refresh();
    }, 2000);
  };

  return (
    <div className="w-full max-w-sm bg-surface-low border border-outline-variant rounded-lg p-8">
      <div className="flex items-center gap-2 mb-6 justify-center">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-black text-[12px] font-extrabold font-mono">
          {BRAND.shortName}
        </div>
        <span className="font-bold text-[14px] text-on-surface">{BRAND.name}</span>
      </div>

      {success ? (
        <div className="text-center space-y-3">
          <p className="text-sm text-on-surface font-medium">
            Senha atualizada!
          </p>
          <p className="text-xs text-on-surface-variant">
            Redirecionando para o consultório...
          </p>
        </div>
      ) : !sessionReady && error ? (
        <div className="text-center space-y-3">
          <p className="text-xs text-status-crit">{error}</p>
          <a
            href="/forgot-password"
            className="block text-xs text-primary hover:underline"
          >
            Solicitar novo link
          </a>
        </div>
      ) : (
        <>
          <p className="text-xs text-on-surface-variant text-center mb-4">
            Defina sua nova senha.
          </p>

          <form onSubmit={handleResetPassword} className="space-y-3">
            <Input
              label="Nova senha"
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <Input
              label="Confirmar senha"
              id="confirm-password"
              type="password"
              placeholder="Repita a nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />

            {error && <p className="text-xs text-status-crit">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading || !sessionReady}>
              {loading ? "Atualizando..." : "Redefinir senha"}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
