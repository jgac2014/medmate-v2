import Link from "next/link";
import { BRAND } from "@/lib/branding";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { LandingCheckoutButton } from "@/components/landing/checkout-button";

function Logo({ size = "lg" }: { size?: "sm" | "lg" }) {
  const dim = size === "lg" ? "w-10 h-10" : "w-7 h-7";
  const text = size === "lg" ? "text-[14px]" : "text-[12px]";
  const label = size === "lg" ? "text-[18px]" : "text-[14px]";
  return (
    <div className="flex items-center gap-2">
      <div
        className={`${dim} rounded-lg bg-accent flex items-center justify-center text-black ${text} font-extrabold font-mono`}
      >
        {BRAND.shortName}
      </div>
      <span className={`font-bold ${label} text-text-primary`}>
        {BRAND.name}
      </span>
    </div>
  );
}

const STEPS = [
  {
    num: "1",
    title: "Preencha a consulta",
    desc: "Dados do paciente, problemas, vitais e exames numa interface limpa e rápida.",
  },
  {
    num: "2",
    title: "Cálculos automáticos",
    desc: "IMC, TFG, risco cardiovascular e FIB-4 calculados em tempo real conforme você digita.",
  },
  {
    num: "3",
    title: "Copie para o eSUS",
    desc: "Texto estruturado gerado automaticamente — cole direto no eSUS PEC sem retrabalho.",
  },
];

const BENEFITS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Economize tempo",
    desc: "Consultas documentadas em minutos, não em meia hora. Menos digitação repetitiva.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
      </svg>
    ),
    title: "Estrutura clínica pronta",
    desc: "SOAP, lista de problemas, prevenção e exames organizados como você precisa na APS.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007v-.008zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
      </svg>
    ),
    title: "Cálculos integrados",
    desc: "IMC, TFG (CKD-EPI), risco cardiovascular e FIB-4 — sem precisar de calculadoras externas.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3" />
      </svg>
    ),
    title: "Texto pronto para o eSUS",
    desc: "Gera o texto formatado da consulta. Copie e cole direto no PEC sem editar.",
  },
];

const FAQS = [
  {
    q: "O MedMate substitui o eSUS PEC?",
    a: "Não. O MedMate complementa o eSUS. Você estrutura a consulta aqui e cola o texto no PEC. Nenhum dado é enviado ao eSUS automaticamente.",
  },
  {
    q: "Meus dados ficam seguros?",
    a: "Sim. Usamos Supabase com criptografia em trânsito e em repouso. Seus dados ficam isolados por conta e nunca são compartilhados.",
  },
  {
    q: "Posso cancelar a qualquer momento?",
    a: "Sim. Sem fidelidade. Cancele pelo painel da sua conta e o acesso continua até o fim do período pago.",
  },
  {
    q: "Funciona no celular?",
    a: "O MedMate é otimizado para uso em desktop/notebook, que é como a maioria dos médicos usa o eSUS PEC no consultório.",
  },
  {
    q: "Preciso instalar alguma coisa?",
    a: "Não. O MedMate roda no navegador. Basta acessar, logar e usar.",
  },
];

const OUTPUT_PREVIEW_WIDTHS = [92, 71, 88, 77, 96, 69, 84, 74];

export default async function LandingPage() {
  // Check if user is logged in to show contextual CTA
  let isLoggedIn = false;
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isLoggedIn = !!user;
  } catch {
    // Not logged in
  }

  return (
    <div className="min-h-screen bg-bg-0 text-text-primary">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-bg-0/80 backdrop-blur-md border-b border-border-subtle">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 h-14">
          <Logo size="lg" />
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                href="/consulta"
                className="px-4 py-2 bg-accent hover:bg-accent-hover text-black font-semibold rounded-lg text-[13px] transition-colors"
              >
                Ir para o consultório
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-text-secondary hover:text-text-primary text-[13px] transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-accent hover:bg-accent-hover text-black font-semibold rounded-lg text-[13px] transition-colors"
                >
                  Começar grátis
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block px-3 py-1 mb-6 rounded-full border border-border-subtle bg-bg-1 text-[12px] text-text-secondary">
          Pensado para médicos que usam eSUS PEC
        </div>
        <h1 className="text-[36px] sm:text-[48px] font-bold leading-[1.1] tracking-[-0.03em] max-w-3xl mx-auto mb-5">
          Documente consultas no eSUS{" "}
          <span className="text-accent">mais rápido</span>
        </h1>
        <p className="text-[16px] sm:text-[18px] text-text-secondary leading-relaxed max-w-xl mx-auto mb-8">
          Estrutura clínica, cálculos automáticos e texto pronto para colar.
          Menos digitação repetitiva, mais tempo com o paciente.
        </p>
        <div className="flex items-center justify-center gap-3">
          {isLoggedIn ? (
            <Link
              href="/consulta"
              className="px-6 py-3 bg-accent hover:bg-accent-hover text-black font-bold rounded-lg text-[15px] transition-all hover:shadow-[0_0_20px_rgba(0,208,132,0.3)]"
            >
              Ir para o consultório
            </Link>
          ) : (
            <>
              <Link
                href="/signup"
                className="px-6 py-3 bg-accent hover:bg-accent-hover text-black font-bold rounded-lg text-[15px] transition-all hover:shadow-[0_0_20px_rgba(0,208,132,0.3)]"
              >
                Começar grátis — 14 dias
              </Link>
              <a
                href="#pricing"
                className="px-6 py-3 bg-bg-2 hover:bg-bg-3 text-text-primary font-medium rounded-lg text-[15px] border border-border-subtle transition-colors"
              >
                Ver planos
              </a>
            </>
          )}
        </div>

        {/* App preview mockup */}
        <div className="mt-14 max-w-4xl mx-auto rounded-xl border border-border-subtle bg-bg-1 overflow-hidden shadow-2xl shadow-black/40">
          {/* Fake topbar */}
          <div className="flex items-center gap-2 px-4 h-10 bg-bg-1 border-b border-border-subtle">
            <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center text-black text-[9px] font-extrabold font-mono">
              {BRAND.shortName}
            </div>
            <span className="text-[11px] font-semibold text-text-primary">
              {BRAND.name}
            </span>
            <div className="flex gap-4 ml-6">
              {["Consulta", "Prescrição", "Exames"].map((t, i) => (
                <span
                  key={t}
                  className={`text-[10px] ${i === 0 ? "text-text-primary font-medium" : "text-text-tertiary"}`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          {/* Fake content grid */}
          <div className="grid grid-cols-4 gap-px bg-border-subtle/30 p-4 min-h-[260px]">
            {/* Col 1: Patient info */}
            <div className="bg-bg-2 rounded-lg p-3 space-y-2">
              <div className="text-[9px] font-semibold text-accent uppercase tracking-wider mb-2">
                Paciente
              </div>
              {["Nome", "Idade", "Sexo", "Problemas"].map((f) => (
                <div key={f} className="space-y-1">
                  <div className="text-[8px] text-text-tertiary">{f}</div>
                  <div className="h-5 bg-bg-3 rounded" />
                </div>
              ))}
              <div className="mt-2 text-[9px] font-semibold text-accent uppercase tracking-wider">
                Sinais Vitais
              </div>
              <div className="grid grid-cols-2 gap-1">
                {["PA", "FC", "Peso", "Alt."].map((v) => (
                  <div key={v} className="space-y-0.5">
                    <div className="text-[7px] text-text-tertiary">{v}</div>
                    <div className="h-4 bg-bg-3 rounded" />
                  </div>
                ))}
              </div>
            </div>
            {/* Col 2: Exames */}
            <div className="bg-bg-2 rounded-lg p-3 space-y-2">
              <div className="text-[9px] font-semibold text-accent uppercase tracking-wider mb-2">
                Exames
              </div>
              {["Lipidograma", "Perfil Renal", "Glicêmico"].map((e) => (
                <div key={e} className="bg-bg-3 rounded p-2 space-y-1">
                  <div className="text-[8px] text-text-secondary">{e}</div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="h-3 bg-bg-1 rounded" />
                    <div className="h-3 bg-bg-1 rounded" />
                  </div>
                </div>
              ))}
            </div>
            {/* Col 3: SOAP */}
            <div className="bg-bg-2 rounded-lg p-3 space-y-2">
              <div className="text-[9px] font-semibold text-accent uppercase tracking-wider mb-2">
                SOAP
              </div>
              {["Subjetivo", "Objetivo", "Avaliação", "Plano"].map((s) => (
                <div key={s} className="space-y-1">
                  <div className="text-[8px] text-text-tertiary">{s}</div>
                  <div className="h-8 bg-bg-3 rounded" />
                </div>
              ))}
            </div>
            {/* Col 4: Output */}
            <div className="bg-bg-2 rounded-lg p-3 space-y-2">
              <div className="text-[9px] font-semibold text-accent uppercase tracking-wider mb-2">
                Texto para eSUS
              </div>
              <div className="space-y-1">
                {OUTPUT_PREVIEW_WIDTHS.map((width, i) => (
                  <div
                    key={i}
                    className="h-3 bg-bg-3 rounded"
                    style={{ width: `${width}%` }}
                  />
                ))}
              </div>
              <div className="mt-3 h-7 bg-accent/10 border border-accent/20 rounded flex items-center justify-center">
                <span className="text-[8px] text-accent font-medium">
                  Copiar para eSUS
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-[24px] font-bold text-center mb-3 tracking-[-0.02em]">
          Como funciona
        </h2>
        <p className="text-text-secondary text-center text-[14px] mb-12 max-w-lg mx-auto">
          Três passos entre abrir o MedMate e ter o texto pronto no eSUS PEC.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="bg-bg-1 border border-border-subtle rounded-xl p-6"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent font-bold text-[14px] flex items-center justify-center mb-4">
                {step.num}
              </div>
              <h3 className="text-[15px] font-semibold mb-2">{step.title}</h3>
              <p className="text-[13px] text-text-secondary leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pain point */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-bg-1 border border-border-subtle rounded-2xl p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-[22px] font-bold mb-4 tracking-[-0.02em] leading-tight">
              Você documenta no eSUS PEC e sabe que poderia ser mais rápido
            </h2>
            <p className="text-[14px] text-text-secondary leading-relaxed mb-4">
              Campos soltos, sem estrutura SOAP, sem cálculos integrados. O texto
              fica bagunçado, e no final do dia são horas perdidas com
              retrabalho.
            </p>
            <p className="text-[14px] text-text-secondary leading-relaxed">
              O MedMate organiza a consulta do jeito que o MFC precisa e gera o
              texto formatado para colar direto no PEC. Simples assim.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Antes", items: ["Texto livre sem estrutura", "Cálculos em sites separados", "Copiar/colar manual", "Retrabalho todo dia"] },
              { label: "Com MedMate", items: ["SOAP estruturado", "Cálculos automáticos", "Texto pronto, um clique", "Minutos, não meia hora"] },
            ].map((col) => (
              <div key={col.label} className="space-y-2">
                <div className={`text-[11px] font-semibold uppercase tracking-wider ${col.label === "Antes" ? "text-status-crit" : "text-accent"}`}>
                  {col.label}
                </div>
                {col.items.map((item) => (
                  <div
                    key={item}
                    className="text-[12px] text-text-secondary bg-bg-2 rounded-lg px-3 py-2 border border-border-subtle"
                  >
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-[24px] font-bold text-center mb-12 tracking-[-0.02em]">
          Feito para a rotina da APS
        </h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="flex gap-4 bg-bg-1 border border-border-subtle rounded-xl p-5"
            >
              <div className="w-10 h-10 shrink-0 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                {b.icon}
              </div>
              <div>
                <h3 className="text-[14px] font-semibold mb-1">{b.title}</h3>
                <p className="text-[13px] text-text-secondary leading-relaxed">
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-[24px] font-bold text-center mb-3 tracking-[-0.02em]">
          Planos simples
        </h2>
        <p className="text-text-secondary text-center text-[14px] mb-10">
          Comece grátis. Assine quando fizer sentido.
        </p>
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Trial */}
          <div className="bg-bg-1 border border-border-subtle rounded-2xl p-7">
            <div className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-3">
              Trial
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-[32px] font-bold tracking-tight">R$ 0</span>
            </div>
            <p className="text-[13px] text-text-secondary mb-6">
              14 dias grátis, acesso completo
            </p>
            <ul className="space-y-2.5 mb-7">
              {[
                "Consulta estruturada completa",
                "Cálculos automáticos",
                "Geração de texto para eSUS",
                "Sem cartão de crédito",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-[13px] text-text-secondary">
                  <svg className="w-4 h-4 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="block w-full text-center px-5 py-2.5 bg-bg-2 hover:bg-bg-3 text-text-primary font-semibold rounded-lg text-[13px] border border-border-subtle transition-colors"
            >
              Criar conta grátis
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-bg-1 border-2 border-accent/40 rounded-2xl p-7 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-accent text-black text-[10px] font-bold rounded-full uppercase tracking-wider">
              Recomendado
            </div>
            <div className="text-[11px] font-semibold text-accent uppercase tracking-wider mb-3">
              Pro
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              {/* sync with Stripe */}
              <span className="text-[32px] font-bold tracking-tight">R$ 49</span>
              <span className="text-[13px] text-text-tertiary">/mês</span>
            </div>
            <p className="text-[13px] text-text-secondary mb-6">
              Tudo do trial, sem limite de tempo
            </p>
            <ul className="space-y-2.5 mb-7">
              {[
                "Tudo do trial incluído",
                "Uso ilimitado",
                "Atualizações e novos recursos",
                "Cancele quando quiser",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-[13px] text-text-secondary">
                  <svg className="w-4 h-4 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            {isLoggedIn ? (
              <LandingCheckoutButton />
            ) : (
              <Link
                href="/signup"
                className="block w-full text-center px-5 py-2.5 bg-accent hover:bg-accent-hover text-black font-bold rounded-lg text-[13px] transition-all hover:shadow-[0_0_12px_rgba(0,208,132,0.25)]"
              >
                Começar grátis — 14 dias
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-[24px] font-bold text-center mb-10 tracking-[-0.02em]">
          Perguntas frequentes
        </h2>
        <div className="space-y-4">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="group bg-bg-1 border border-border-subtle rounded-xl"
            >
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-[14px] font-medium text-text-primary list-none [&::-webkit-details-marker]:hidden">
                {faq.q}
                <svg
                  className="w-4 h-4 text-text-tertiary shrink-0 transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </summary>
              <div className="px-5 pb-4 text-[13px] text-text-secondary leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <div className="bg-bg-1 border border-border-subtle rounded-2xl p-10">
          <h2 className="text-[24px] font-bold mb-3 tracking-[-0.02em]">
            Pronto para documentar mais rápido?
          </h2>
          <p className="text-[14px] text-text-secondary mb-6 max-w-md mx-auto">
            14 dias grátis. Sem cartão. Cancele quando quiser.
          </p>
          {isLoggedIn ? (
            <Link
              href="/consulta"
              className="inline-block px-8 py-3 bg-accent hover:bg-accent-hover text-black font-bold rounded-lg text-[15px] transition-all hover:shadow-[0_0_20px_rgba(0,208,132,0.3)]"
            >
              Ir para o consultório
            </Link>
          ) : (
            <Link
              href="/signup"
              className="inline-block px-8 py-3 bg-accent hover:bg-accent-hover text-black font-bold rounded-lg text-[15px] transition-all hover:shadow-[0_0_20px_rgba(0,208,132,0.3)]"
            >
              Começar grátis — 14 dias
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-subtle">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <Logo size="sm" />
              <p className="text-[12px] text-text-tertiary mt-2">
                Desenvolvido para a rotina da Atenção Primária à Saúde.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-text-secondary">
              <Link href="/login" className="hover:text-text-primary transition-colors">
                Entrar
              </Link>
              <Link href="/signup" className="hover:text-text-primary transition-colors">
                Criar conta
              </Link>
              <a href="mailto:contato@medmate.com.br" className="hover:text-text-primary transition-colors">
                Contato
              </a>
              <Link href="/politica-de-privacidade" className="hover:text-text-primary transition-colors">
                Privacidade
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border-subtle text-[11px] text-text-tertiary">
            &copy; {new Date().getFullYear()} MedMate. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
