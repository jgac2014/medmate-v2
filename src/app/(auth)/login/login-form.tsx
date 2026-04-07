"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BRAND } from "@/lib/branding";
import Link from "next/link";
import { logAuditEvent } from "@/lib/supabase/audit";

export default function LoginForm({ initialError }: { initialError: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(initialError);
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(translateAuthError(error.message));
      setLoading(false);
      return;
    }

    await logAuditEvent({
      eventType: "auth.login",
      entityType: "user",
      metadata: { method: "password" },
    });
    router.push("/consulta");
    router.refresh();
  };

  const handleMagicLink = async () => {
    if (!email) return;
    setLoading(true);
    setError("");
    setInfo("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      setError(translateAuthError(error.message));
      setLoading(false);
      return;
    }

    setInfo("Link mágico enviado! Verifique seu email.");
    setLoading(false);
  };

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-block">
          <span className="text-[26px] font-bold tracking-[-0.03em] text-on-surface">{BRAND.name}</span>
        </Link>
        <p className="text-[14px] text-on-surface-variant mt-1">Bem-vindo de volta</p>
      </div>

      <div className="bg-white border border-outline-variant rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email"
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div>
            <Input
              label="Senha"
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex justify-end mt-1">
              <a href="/forgot-password" className="text-[12px] text-on-surface-muted hover:text-primary transition-colors">
                Esqueceu a senha?
              </a>
            </div>
          </div>

          {error && (
            <div className="px-3 py-2.5 bg-status-crit-bg border border-status-crit/20 rounded-lg">
              <p className="text-[13px] text-status-crit">{error}</p>
            </div>
          )}
          {info && (
            <div className="px-3 py-2.5 bg-status-ok-bg border border-status-ok/20 rounded-lg">
              <p className="text-[13px] text-status-ok">{info}</p>
            </div>
          )}

          <Button type="submit" className="w-full h-[44px] text-[14px]" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <button
          onClick={handleMagicLink}
          className="w-full mt-3 text-[13px] text-on-surface-muted hover:text-on-surface transition-colors bg-transparent border-none cursor-pointer disabled:opacity-40"
          disabled={loading || !email}
        >
          Entrar com link mágico
        </button>
      </div>

      <p className="text-[13px] text-on-surface-muted text-center mt-5">
        Não tem conta?{" "}
        <Link href="/signup" className="text-primary font-medium hover:underline">
          Criar conta grátis
        </Link>
      </p>
    </div>
  );
}

function translateAuthError(msg: string): string {
  if (msg.includes("Invalid login credentials")) return "Email ou senha incorretos.";
  if (msg.includes("Email not confirmed")) return "Email não confirmado. Verifique sua caixa de entrada.";
  if (msg.includes("rate limit") || msg.includes("too many")) return "Muitas tentativas. Aguarde um momento.";
  if (msg.includes("User not found")) return "Usuário não encontrado.";
  return msg;
}
