"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/branding";
import { LEGAL_DOCUMENTS } from "@/lib/legal";
import { createClient } from "@/lib/supabase/client";
import { acceptRequiredConsents, hasRequiredConsents } from "@/lib/supabase/consents";

export default function ConsentimentoPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);

      const alreadyAccepted = await hasRequiredConsents(user.id);
      if (alreadyAccepted) {
        router.push("/consulta");
        return;
      }

      setLoading(false);
    }

    load();
  }, [router]);

  async function handleAccept() {
    if (!userId || !accepted) return;

    setSubmitting(true);
    setError("");

    try {
      await acceptRequiredConsents(userId);
      router.push("/consulta");
    } catch {
      setError("Não foi possível registrar o aceite agora.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-lowest text-[13px] text-on-surface-muted">
        Carregando...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-lowest p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-outline-variant bg-surface-low p-8 shadow-[0_24px_48px_rgba(23,28,31,0.12)]">
        <div className="mb-8">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-on-surface-muted">
            {BRAND.name}
          </p>
          <h1 className="mt-3 font-headline text-4xl font-medium text-primary">
            Confirme os documentos obrigatórios
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-on-surface-variant">
            Antes de continuar usando a plataforma com dados clínicos, precisamos registrar o seu aceite dos documentos legais vigentes.
          </p>
        </div>

        <div className="space-y-4 rounded-2xl border border-outline-variant bg-surface-lowest p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[14px] font-semibold text-on-surface">{LEGAL_DOCUMENTS.terms.label}</p>
              <p className="mt-1 text-[12px] text-on-surface-muted">
                Versão {LEGAL_DOCUMENTS.terms.version}
              </p>
            </div>
            <Link href={LEGAL_DOCUMENTS.terms.path} className="text-[13px] font-medium text-secondary hover:text-primary">
              Ler documento
            </Link>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[14px] font-semibold text-on-surface">{LEGAL_DOCUMENTS.privacy.label}</p>
              <p className="mt-1 text-[12px] text-on-surface-muted">
                Versão {LEGAL_DOCUMENTS.privacy.version}
              </p>
            </div>
            <Link href={LEGAL_DOCUMENTS.privacy.path} className="text-[13px] font-medium text-secondary hover:text-primary">
              Ler documento
            </Link>
          </div>
        </div>

        <label className="mt-6 flex items-start gap-3 rounded-xl border border-outline-variant bg-surface-lowest px-4 py-4">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
            className="mt-1 h-4 w-4 accent-[var(--primary)]"
          />
          <span className="text-[13px] leading-relaxed text-on-surface-variant">
            Confirmo que li e aceito os Termos de Uso e a Política de Privacidade vigentes, incluindo as regras de tratamento de dados sensíveis de saúde.
          </span>
        </label>

        {error && (
          <div className="mt-4 rounded-lg border border-status-crit/20 bg-status-crit-bg px-3 py-2.5 text-[13px] text-status-crit">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button onClick={handleAccept} disabled={!accepted || submitting}>
            {submitting ? "Registrando aceite..." : "Continuar para o consultório"}
          </Button>
        </div>
      </div>
    </div>
  );
}
