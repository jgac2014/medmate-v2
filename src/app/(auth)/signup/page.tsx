"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BRAND } from "@/lib/branding";
import { LEGAL_DOCUMENTS } from "@/lib/legal";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailConfirmRequired, setEmailConfirmRequired] = useState(false);
  const [acceptedLegal, setAcceptedLegal] = useState(false);
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
        data: {
          name,
          terms_version: LEGAL_DOCUMENTS.terms.version,
          privacy_version: LEGAL_DOCUMENTS.privacy.version,
        },
      },
    });

    if (error) {
      setError(translateAuthError(error.message));
      setLoading(false);
      return;
    }

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
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-[26px] font-bold tracking-[-0.03em] text-on-surface">{BRAND.name}</span>
          </Link>
        </div>
        <div className="bg-white border border-outline-variant rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <div>
            <p className="text-[16px] font-semibold text-on-surface">Verifique seu email</p>
            <p className="text-[14px] text-on-surface-variant mt-1">
              Enviamos um link de confirmação para{" "}
              <span className="font-medium text-on-surface">{email}</span>.
              Clique no link para ativar sua conta e começar o trial de 14 dias.
            </p>
          </div>
          <button
            onClick={() => setEmailConfirmRequired(false)}
            className="text-[13px] text-on-surface-muted hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
          >
            Não recebeu? Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <Link href="/" className="inline-block">
          <span className="text-[26px] font-bold tracking-[-0.03em] text-on-surface">{BRAND.name}</span>
        </Link>
        <p className="text-[14px] text-on-surface-variant mt-1">14 dias grátis, sem cartão</p>
      </div>

      <div className="bg-white border border-outline-variant rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
        <form onSubmit={handleSignup} className="space-y-4">
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

          <label className="flex items-start gap-3 rounded-xl border border-outline-variant bg-surface-lowest px-4 py-3">
            <input
              type="checkbox"
              checked={acceptedLegal}
              onChange={(event) => setAcceptedLegal(event.target.checked)}
              className="mt-1 h-4 w-4 accent-[var(--primary)]"
              required
            />
            <span className="text-[12px] leading-relaxed text-on-surface-variant">
              Li e aceito os{" "}
              <Link href={LEGAL_DOCUMENTS.terms.path} className="text-primary hover:underline">
                Termos de Uso
              </Link>{" "}
              e a{" "}
              <Link href={LEGAL_DOCUMENTS.privacy.path} className="text-primary hover:underline">
                Política de Privacidade
              </Link>.
            </span>
          </label>

          {error && (
            <div className="px-3 py-2.5 bg-status-crit-bg border border-status-crit/20 rounded-lg">
              <p className="text-[13px] text-status-crit">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full h-[44px] text-[14px]" disabled={loading || !acceptedLegal}>
            {loading ? "Criando conta..." : "Criar conta — Trial 14 dias"}
          </Button>
        </form>

        <p className="text-[12px] text-on-surface-muted text-center mt-4 leading-relaxed">
          Ao criar a conta, você concorda com nossos{" "}
          <Link href={LEGAL_DOCUMENTS.terms.path} className="text-primary hover:underline">Termos</Link>
          {" "}e{" "}
          <Link href={LEGAL_DOCUMENTS.privacy.path} className="text-primary hover:underline">Privacidade</Link>.
        </p>
      </div>

      <p className="text-[13px] text-on-surface-muted text-center mt-5">
        Já tem conta?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Entrar
        </Link>
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
