"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BRAND } from "@/lib/branding";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailConfirmRequired, setEmailConfirmRequired] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      setError(translateAuthError(error.message));
      setLoading(false);
      return;
    }

    // Se não há sessão após signUp, o Supabase exige confirmação de email
    if (!data.session) {
      setEmailConfirmRequired(true);
      setLoading(false);
      return;
    }

    router.push("/consulta");
    router.refresh();
  };

  if (emailConfirmRequired) {
    return (
      <div className="w-full max-w-sm bg-bg-1 border border-border-subtle rounded-lg p-8">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-black text-[12px] font-extrabold font-mono">
            {BRAND.shortName}
          </div>
          <span className="font-bold text-[14px] text-text-primary">{BRAND.name}</span>
        </div>
        <div className="text-center space-y-3">
          <p className="text-sm text-text-primary font-medium">Verifique seu email</p>
          <p className="text-xs text-text-secondary">
            Enviamos um link de confirmação para <span className="text-text-primary">{email}</span>.
            Clique no link para ativar sua conta e começar o trial de 14 dias.
          </p>
          <p className="text-xs text-text-tertiary mt-4">
            Não recebeu?{" "}
            <button
              onClick={() => setEmailConfirmRequired(false)}
              className="text-accent hover:underline bg-transparent border-none cursor-pointer"
            >
              Tentar novamente
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm bg-bg-1 border border-border-subtle rounded-lg p-8">
      <div className="flex items-center gap-2 mb-6 justify-center">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-black text-[12px] font-extrabold font-mono">
          {BRAND.shortName}
        </div>
        <span className="font-bold text-[14px] text-text-primary">{BRAND.name}</span>
      </div>

      <form onSubmit={handleSignup} className="space-y-3">
        <Input
          label="Nome completo"
          id="name"
          placeholder="Dr. João Silva"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Email"
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Senha"
          id="password"
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        {error && <p className="text-xs text-status-crit">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Criando..." : "Criar conta — Trial 14 dias"}
        </Button>
      </form>

      <p className="text-xs text-text-tertiary text-center mt-4">
        Já tem conta?{" "}
        <a href="/login" className="text-accent hover:underline">
          Entrar
        </a>
      </p>
    </div>
  );
}

function translateAuthError(msg: string): string {
  if (msg.includes("User already registered")) return "Este email já está cadastrado.";
  if (msg.includes("Password should be at least")) return "A senha deve ter pelo menos 6 caracteres.";
  if (msg.includes("Unable to validate email")) return "Email inválido.";
  if (msg.includes("rate limit")) return "Muitas tentativas. Aguarde um momento.";
  return msg;
}
