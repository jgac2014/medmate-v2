"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BRAND } from "@/lib/branding";

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
    <div className="w-full max-w-sm bg-bg-1 border border-border-subtle rounded-lg p-8">
      <div className="flex items-center gap-2 mb-6 justify-center">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-black text-[12px] font-extrabold font-mono">
          {BRAND.shortName}
        </div>
        <span className="font-bold text-[14px] text-text-primary">{BRAND.name}</span>
      </div>

      <form onSubmit={handleLogin} className="space-y-3">
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
            <a href="/forgot-password" className="text-xs text-text-tertiary hover:text-accent transition-colors">
              Esqueceu a senha?
            </a>
          </div>
        </div>

        {error && <p className="text-xs text-status-crit">{error}</p>}
        {info && <p className="text-xs text-accent">{info}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <button
        onClick={handleMagicLink}
        className="w-full mt-3 text-xs text-text-secondary hover:text-text-primary transition-colors bg-transparent border-none cursor-pointer"
        disabled={loading || !email}
      >
        Entrar com link mágico
      </button>

      <p className="text-xs text-text-tertiary text-center mt-4">
        Não tem conta?{" "}
        <a href="/signup" className="text-accent hover:underline">
          Criar conta
        </a>
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
