import Link from "next/link";
import { BRAND } from "@/lib/branding";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { LandingCheckoutButton } from "@/components/landing/checkout-button";

const PLAN_FEATURES = [
  "Resumo pronto para o eSUS PEC",
  "Calculadoras clínicas no fluxo",
  "Organização de consultas e SOAP",
  "Histórico e antecedentes rápidos",
  "Sinais vitais e gráficos de tendência",
  "Uso em qualquer navegador",
  "Suporte técnico dedicado",
  "Segurança com criptografia e LGPD",
];

const VALUE_ITEMS = [
  { icon: "verified_user", text: "Cancelamento instantâneo em um clique." },
  { icon: "lock", text: "Em conformidade com a LGPD." },
  { icon: "update", text: "Novas funcionalidades sem custo adicional." },
];

const FAQS = [
  {
    q: "Preciso de cartão de crédito para testar?",
    a: "Não. O trial de 14 dias é completamente gratuito, sem necessidade de cartão de crédito.",
  },
  {
    q: "Posso cancelar a qualquer momento?",
    a: "Sim. O cancelamento é instantâneo via portal de assinatura. Sem taxas ou multas.",
  },
  {
    q: "O MedMate funciona em qualquer dispositivo?",
    a: "Sim. Roda diretamente no navegador — Chrome, Edge, Safari. Sem instalação.",
  },
  {
    q: "Meus dados ficam salvos?",
    a: "Sim. Consultas, pacientes e histórico são salvos automaticamente em nuvem com criptografia.",
  },
];

export default async function PlanosPage() {
  let isLoggedIn = false;
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    isLoggedIn = !!user;
  } catch {
    // Not logged in
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <LandingNavbar isLoggedIn={isLoggedIn} />

      {/* Hero */}
      <section className="relative pt-24 pb-32 overflow-hidden px-6 bg-surface">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <span className="text-secondary font-medium tracking-widest text-xs uppercase mb-6 block">
            Assinatura Simplificada
          </span>
          <h1 className="font-headline italic text-5xl md:text-7xl text-primary leading-[1.1] max-w-4xl mb-8">
            Um plano simples para a rotina real da APS.
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed mb-12">
            {BRAND.name} foi desenhado para médicos da Atenção Primária que precisam organizar a consulta, automatizar métricas e gerar documentação com excelência no fluxo do eSUS PEC.
          </p>
          {!isLoggedIn && (
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Link
                href="/signup"
                className="px-8 py-4 bg-primary hover:bg-primary-container text-on-primary font-semibold text-lg rounded-lg transition-all shadow-lg shadow-primary/10 active:scale-95"
              >
                Começar teste grátis
              </Link>
              <Link
                href="/funcionalidades"
                className="px-8 py-4 bg-surface-highest text-on-surface-variant font-semibold text-lg rounded-lg hover:bg-surface-dim transition-all active:scale-95"
              >
                Ver demonstração
              </Link>
            </div>
          )}
        </div>
        {/* Background decorations */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary-container/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 -left-24 w-64 h-64 bg-primary-container/10 rounded-full blur-[100px] pointer-events-none" />
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 bg-surface-low">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left: value prop */}
            <div className="lg:col-span-5">
              <h2 className="font-headline text-4xl md:text-5xl text-primary mb-6">
                Investimento único,<br />foco total no paciente.
              </h2>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
                Um único plano com todas as funcionalidades liberadas. Sem módulos extras, sem taxas escondidas.
              </p>
              <div className="space-y-4">
                {VALUE_ITEMS.map((item) => (
                  <div key={item.text} className="flex items-center gap-4 text-secondary">
                    <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: pricing card */}
            <div className="lg:col-span-7">
              <div className="bg-surface-lowest p-8 md:p-12 rounded-xl shadow-[0_24px_48px_-12px_rgba(1,45,29,0.10)] border border-outline-variant/20 relative">
                <div className="absolute top-0 right-12 transform -translate-y-1/2 bg-primary text-on-primary px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded-full">
                  Plano Médico APS
                </div>
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-10 gap-4">
                  <div>
                    <h3 className="font-headline text-3xl text-primary mb-2">Médico APS</h3>
                    <p className="text-on-surface-variant text-sm">Acesso ilimitado a todas as ferramentas.</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-secondary font-medium text-[11px] mb-1 italic">Comece com 14 dias grátis.</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-primary">R$ 49</span>
                      <span className="text-on-surface-variant text-sm">/mês</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-10">
                  {PLAN_FEATURES.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-secondary text-xl shrink-0">check_circle</span>
                      <span className="text-on-surface text-sm leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>

                {isLoggedIn ? (
                  <LandingCheckoutButton className="w-full py-5 text-lg font-bold" />
                ) : (
                  <Link
                    href="/signup"
                    className="w-full block text-center py-5 bg-primary hover:bg-primary-container text-on-primary font-bold text-lg rounded-lg transition-all shadow-lg shadow-primary/10 active:scale-95"
                  >
                    Começar teste grátis
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-headline text-4xl text-primary font-medium text-center mb-16">
            Perguntas Frequentes
          </h2>
          <div className="space-y-6">
            {FAQS.map((faq) => (
              <div key={faq.q} className="pb-6 border-b border-outline-variant/20">
                <h3 className="font-headline text-xl text-primary font-medium mb-3">{faq.q}</h3>
                <p className="text-secondary leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
