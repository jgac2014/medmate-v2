import Link from "next/link";
import { BRAND } from "@/lib/branding";
import { CURRENT_TERMS_VERSION } from "@/lib/legal";

export const metadata = {
  title: `Termos de Uso — ${BRAND.name}`,
  description: `Condições de uso da plataforma ${BRAND.name}.`,
};

export default function TermosDeUsoPage() {
  return (
    <div className="min-h-screen bg-surface-lowest text-on-surface">
      <header className="border-b border-outline-variant">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-[11px] font-extrabold font-mono text-black">
              {BRAND.shortName}
            </div>
            <span className="text-[14px] font-bold">{BRAND.name}</span>
          </Link>
          <Link href="/" className="text-[13px] text-on-surface-variant transition-colors hover:text-on-surface">
            ← Voltar
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-[28px] font-bold tracking-[-0.02em]">Termos de Uso</h1>
        <p className="mb-10 mt-2 text-[13px] text-on-surface-muted">
          Versão vigente: {CURRENT_TERMS_VERSION}
        </p>

        <div className="space-y-8 text-[14px] leading-relaxed text-on-surface-variant">
          <Section title="1. Objeto">
            <p>
              O {BRAND.name} é uma plataforma web de produtividade clínica para médicos da Atenção Primária à Saúde, com foco em organização da consulta, registro estruturado e geração de texto para uso no eSUS PEC.
            </p>
          </Section>

          <Section title="2. Natureza do serviço">
            <p>
              A plataforma não substitui o eSUS PEC nem sistemas oficiais obrigatórios. O serviço funciona como camada de apoio operacional e documentação clínica para agilizar o fluxo do médico.
            </p>
          </Section>

          <Section title="3. Responsabilidade profissional">
            <p>
              O usuário continua integralmente responsável pelo conteúdo clínico registrado, pela revisão final das informações geradas e pelo cumprimento das normas do CFM, LGPD e demais regras aplicáveis ao prontuário eletrônico.
            </p>
          </Section>

          <Section title="4. Conta e acesso">
            <p>
              O acesso é individual, vinculado à conta do médico assinante. O compartilhamento de credenciais é vedado. O usuário deve manter senha, email e meios de recuperação sob seu controle.
            </p>
          </Section>

          <Section title="5. Assinatura e trial">
            <p>
              O serviço pode ser oferecido por assinatura recorrente com período de trial promocional. Após o término do trial ou em caso de inatividade da assinatura, o acesso pode ser bloqueado até regularização.
            </p>
          </Section>

          <Section title="6. Dados sensíveis e confidencialidade">
            <p>
              O usuário reconhece que dados inseridos sobre pacientes podem constituir dados pessoais sensíveis. O uso da plataforma deve observar base legal adequada, confidencialidade e boas práticas de segurança da informação.
            </p>
          </Section>

          <Section title="7. Disponibilidade e melhorias">
            <p>
              O {BRAND.name} pode evoluir continuamente, com ajustes de interface, recursos e políticas operacionais. Faremos esforço razoável para manter estabilidade e comunicar mudanças relevantes.
            </p>
          </Section>

          <Section title="8. Limitação de uso indevido">
            <p>
              É proibido utilizar a plataforma para fins ilícitos, engenharia reversa maliciosa, acesso indevido a dados de terceiros, automações abusivas ou qualquer prática que comprometa a segurança do serviço.
            </p>
          </Section>

          <Section title="9. Encerramento">
            <p>
              O usuário pode interromper o uso a qualquer momento, observadas as obrigações legais relacionadas à guarda de dados clínicos e às regras de cobrança da assinatura ativa quando aplicáveis.
            </p>
          </Section>

          <Section title="10. Contato">
            <p>
              Para dúvidas contratuais e operacionais, entre em contato pelo email{" "}
              <a href={`mailto:${BRAND.supportEmail}`} className="text-primary hover:underline">
                {BRAND.supportEmail}
              </a>.
            </p>
          </Section>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-[16px] font-semibold text-on-surface">{title}</h2>
      {children}
    </section>
  );
}
