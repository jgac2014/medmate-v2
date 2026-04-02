import Link from "next/link";
import { BRAND } from "@/lib/branding";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";

const PAIN_POINTS = [
  {
    icon: "description",
    title: "Informação Dispersa",
    desc: "Dados espalhados entre anotações soltas e planilhas. Tempo que deveria ser gasto com o paciente vai para a burocracia digital na APS.",
  },
  {
    icon: "warning",
    title: "Atrito no eSUS PEC",
    desc: "A interface oficial do eSUS PEC é essencial para o registro médico, mas não foi pensada para agilizar o fluxo clínico do MFC.",
  },
  {
    icon: "psychology",
    title: "Fadiga Cognitiva",
    desc: "Dezenas de telas e formulários demandam energia e reduzem a atenção ao paciente. O MedMate resolve isso de forma diferente.",
  },
];

const FEATURES = [
  {
    title: "Identificação e sinais vitais",
    desc: "Cadastro rápido com IMC, TFG e RCV calculados automaticamente enquanto você digita.",
  },
  {
    title: "SOAP estruturado",
    desc: "Nota SOAP com suporte a templates e snippets reutilizáveis para agilizar o registro clínico.",
  },
  {
    title: "Monitoramento longitudinal",
    desc: "Acompanhamento de métricas com sparklines e histórico de consultas por paciente.",
  },
  {
    title: "Resumo pronto para o eSUS PEC",
    desc: "Um clique gera o texto formatado. Sem retrabalho, sem digitação dupla.",
  },
  {
    title: "Rastreamento preventivo",
    desc: "Checklist de prevenção alinhado com o Ministério da Saúde e calendário vacinal.",
  },
  {
    title: "Cálculos clínicos integrados",
    desc: "IMC, TFG CKD-EPI 2021, FIB-4 e RCV Framingham — no fluxo, sem calculadoras externas.",
  },
];

const FLOW_STEPS = [
  { num: "01", title: "Selecione o paciente", desc: "Busca por nome ou CPF. Dados da última consulta carregam automaticamente." },
  { num: "02", title: "Preencha vitais e contexto clínico", desc: "Sinais vitais, problemas ativos e exames — cálculos automáticos em tempo real." },
  { num: "03", title: "Estruture o SOAP e a conduta", desc: "Nota SOAP com templates. Prescrição, exames e orientações em seções separadas." },
  { num: "04", title: "Copie para o eSUS PEC", desc: "Resumo formatado em um clique. Documentação completa em segundos." },
];

export default async function LandingPage() {
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
      <section className="relative pt-24 pb-20 md:pt-36 md:pb-32 overflow-hidden bg-surface">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 relative z-10">
            <span className="inline-block px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-full text-[11px] font-black tracking-[0.2em] uppercase mb-8 border border-primary/5">
              Projetado para Médicos da APS
            </span>
            <h1 className="font-headline text-5xl md:text-6xl xl:text-7xl font-medium text-primary leading-[1.05] mb-6">
              Organize a consulta. Gere o resumo pronto para o eSUS PEC.
            </h1>
            <p className="text-lg text-secondary leading-relaxed max-w-xl mb-10 font-light">
              {BRAND.name} é o workspace clínico definitivo para a Atenção Primária. Automatize métricas, organize o SOAP e exporte a documentação estruturada direto para o eSUS PEC em segundos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={isLoggedIn ? "/consulta" : "/signup"}
                className="px-8 py-4 bg-primary hover:bg-primary-container text-on-primary font-bold text-base rounded-lg shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:-translate-y-0.5 transition-all active:scale-95 text-center"
              >
                {isLoggedIn ? "Ir para o consultório" : "Começar teste grátis"}
              </Link>
              <Link
                href="/funcionalidades"
                className="px-8 py-4 bg-surface-lowest border border-outline-variant/30 text-primary font-bold text-base rounded-lg hover:bg-surface-container transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                Ver demonstração
              </Link>
            </div>
            {!isLoggedIn && (
              <p className="text-[11px] font-bold text-on-surface-muted uppercase tracking-widest mt-4">
                14 dias grátis — sem cartão de crédito.
              </p>
            )}
          </div>

          {/* Product mockup */}
          <div className="lg:col-span-7 relative">
            <div className="absolute -inset-4 bg-primary-container/5 rounded-[2.5rem] blur-3xl" />
            <div className="relative bg-surface-lowest rounded-xl shadow-[0_32px_64px_-16px_rgba(1,45,29,0.12)] border border-outline-variant/20 overflow-hidden flex flex-col aspect-[4/3] max-h-[520px]">
              {/* Mockup header */}
              <div className="bg-surface-low px-5 py-4 border-b border-outline-variant/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-xs font-bold">MS</div>
                  <div>
                    <p className="text-xs font-bold text-primary">Maria Silva dos Santos</p>
                    <p className="text-[10px] text-secondary">Feminino, 58 anos • HAS • DM2</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <span className="px-2 py-0.5 bg-status-crit-bg text-status-crit text-[9px] font-bold rounded uppercase">Hipertensa</span>
                  <span className="px-2 py-0.5 bg-status-info-bg text-status-info text-[9px] font-bold rounded uppercase">Diabética</span>
                </div>
              </div>
              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-1/3 border-r border-outline-variant/10 bg-surface-lowest p-5 space-y-5">
                  <div>
                    <p className="text-[9px] font-bold text-primary/40 uppercase tracking-widest mb-3">Sinais Vitais</p>
                    <div className="space-y-2">
                      {[["PA", "132/84"], ["IMC", "24.2"], ["FC", "72 bpm"]].map(([label, value]) => (
                        <div key={label} className="flex justify-between items-center p-2 bg-surface rounded border border-primary/5">
                          <span className="text-[10px] font-semibold text-secondary">{label}</span>
                          <span className="text-xs font-bold text-primary">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-primary/40 uppercase tracking-widest mb-2">Problemas</p>
                    <ul className="text-[10px] space-y-1.5 text-primary font-medium">
                      <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-primary/40" /> HAS Estágio 1</li>
                      <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-primary/40" /> DM Tipo 2</li>
                    </ul>
                  </div>
                </div>
                {/* Editor */}
                <div className="flex-1 flex flex-col bg-surface-lowest">
                  <div className="p-5 border-b border-outline-variant/10 flex-1">
                    <p className="text-[9px] font-bold text-primary/40 uppercase tracking-widest mb-4">SOAP</p>
                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] font-bold text-primary uppercase block mb-1">Subjetivo</span>
                        <p className="text-[11px] text-secondary italic border-l-2 border-primary/20 pl-2">
                          Paciente refere cefaleia occipital ocasional...
                        </p>
                      </div>
                      <div className="h-10 bg-surface rounded border border-dashed border-outline-variant/40 flex items-center justify-center text-[10px] text-on-surface-muted italic">
                        Toque para preencher exame físico
                      </div>
                    </div>
                  </div>
                  <div className="p-5 bg-primary/[0.02]">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[9px] font-bold text-primary uppercase tracking-widest">Resumo Pronto para eSUS</p>
                      <button className="bg-primary text-on-primary text-[8px] px-2.5 py-1 rounded font-bold uppercase tracking-wider">Copiar</button>
                    </div>
                    <div className="bg-surface-lowest p-2.5 rounded border border-primary/10 text-[9px] font-mono text-primary leading-relaxed">
                      <p># SUBJETIVO: Pct c/ cefaleia occipital...</p>
                      <p># OBJETIVO: PA 132/84 mmHg, IMC 24.2...</p>
                      <p># AVALIAÇÃO: HAS (I10) controlada...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-24 bg-surface-low">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-headline text-4xl text-primary mb-16 font-medium">
            Por que o MFC precisa de uma ferramenta melhor?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {PAIN_POINTS.map((p) => (
              <div key={p.title} className="bg-surface-lowest p-8 rounded-xl">
                <span className="material-symbols-outlined text-3xl text-primary mb-4 block">{p.icon}</span>
                <h3 className="font-headline text-xl text-primary font-semibold mb-3">{p.title}</h3>
                <p className="text-secondary leading-relaxed text-sm">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-headline text-4xl text-primary mb-4 font-medium">Os 6 Pilares do {BRAND.name}</h2>
          <p className="text-secondary text-lg mb-16 max-w-2xl">
            Cada funcionalidade foi pensada para a realidade clínica da APS brasileira.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((f) => (
              <div key={f.title} className="p-6 bg-surface-lowest rounded-xl border border-outline-variant/20">
                <h3 className="font-headline text-lg text-primary font-semibold mb-2">{f.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flow */}
      <section className="py-24 bg-surface-low">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-headline text-4xl text-primary mb-16 font-medium">Como funciona</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {FLOW_STEPS.map((s) => (
              <div key={s.num}>
                <span className="font-headline text-5xl text-primary/10 font-medium block mb-4">{s.num}</span>
                <h3 className="font-headline text-lg text-primary font-semibold mb-2">{s.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-primary-container">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-headline text-4xl md:text-5xl text-surface-lowest font-medium mb-6">
            Pronto para transformar sua consulta?
          </h2>
          <p className="text-on-primary-container text-lg mb-10">
            14 dias grátis. Sem cartão de crédito. Cancele quando quiser.
          </p>
          <Link
            href={isLoggedIn ? "/consulta" : "/signup"}
            className="inline-block px-10 py-4 bg-surface-lowest text-primary font-bold text-base rounded-lg hover:bg-surface transition-all active:scale-95"
          >
            {isLoggedIn ? "Ir para o consultório" : "Começar teste grátis"}
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
