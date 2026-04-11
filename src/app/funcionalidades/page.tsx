import Link from "next/link";
import { BRAND } from "@/lib/branding";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";

const PILLARS = [
  {
    icon: "person",
    title: "Identificação e sinais vitais",
    desc: "Cadastro completo com cálculo automático de IMC, TFG e alertas clínicos por valores de referência.",
    detail: "PA, FC, peso, altura, temperatura: tudo calculado e contextualizado em tempo real conforme você digita.",
  },
  {
    icon: "list_alt",
    title: "Problemas ativos e contexto clínico",
    desc: "Lista longitudinal de problemas com pré-carga da última consulta e rastreio histórico.",
    detail: "Evolução clínica com histórico por problema. Sugestões baseadas no perfil do paciente.",
  },
  {
    icon: "science",
    title: "Exames e monitoramento",
    desc: "Resultados com destaque para valores fora de referência. Sparklines de tendência ao longo do tempo.",
    detail: "Lipidograma, função renal (TFG), glicemia, hemograma, com valores por faixa etária e sexo.",
  },
  {
    icon: "calculate",
    title: "Cálculos automáticos no fluxo",
    desc: "IMC, TFG (CKD-EPI 2021), RCV (Framingham) e FIB-4 calculados automaticamente na consulta.",
    detail: "Sem calculadoras externas. Resultados contextuais, no momento certo.",
  },
  {
    icon: "edit_note",
    title: "SOAP e antecedentes",
    desc: "Nota SOAP estruturada com suporte a templates e snippets reutilizáveis.",
    detail: "Conduta, prescrição e encaminhamentos em seções separadas. Exportação automática formatada.",
  },
  {
    icon: "content_paste_go",
    title: "Resumo pronto para o eSUS PEC",
    desc: "Consolida todos os dados em texto estruturado, pronto para copiar para o prontuário oficial.",
    detail: "Um clique gera o texto formatado. Sem retrabalho, sem digitação dupla.",
  },
];

const FLOW_STEPS = [
  { num: "01", title: "Organize os dados da consulta", desc: "Selecione o paciente. Dados da última consulta carregam automaticamente com alertas ativos." },
  { num: "02", title: "Revise exames e métricas", desc: "Visualize tendências em sparklines e histórico clínico longitudinal com precisão." },
  { num: "03", title: "Estruture SOAP e conduta", desc: "Raciocínio clínico com cálculos automáticos de risco e scores integrados." },
  { num: "04", title: "Copie o resumo para o eSUS PEC", desc: "Um clique gera o texto formatado. O resumo PEC está pronto em segundos." },
];

export default async function FuncionalidadesPage() {
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
      <section className="relative overflow-hidden pt-20 pb-32 bg-surface">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-xl">
            <h1 className="font-headline text-5xl md:text-6xl text-primary leading-tight italic font-medium mb-6">
              Funcionalidades pensadas para o fluxo real da APS.
            </h1>
            <p className="text-lg text-secondary leading-relaxed mb-10">
              Otimize sua consulta na Atenção Primária: registro clínico estruturado, cálculos automáticos e um resumo pronto para o eSUS PEC em um único clique.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={isLoggedIn ? "/consulta" : "/signup"}
                className="px-8 py-4 bg-primary hover:bg-primary-container text-on-primary font-semibold rounded-lg transition-all active:scale-95"
              >
                Começar teste grátis
              </Link>
              <Link
                href="/planos"
                className="px-8 py-4 border border-outline text-primary font-semibold rounded-lg hover:bg-surface-container transition-all active:scale-95"
              >
                Ver planos
              </Link>
            </div>
          </div>

          {/* Mockup badge */}
          <div className="relative hidden lg:block">
            <div className="bg-surface-lowest rounded-xl border border-outline-variant/20 shadow-[0_24px_48px_-12px_rgba(1,45,29,0.10)] p-8">
              <div className="absolute -bottom-6 -left-6 bg-secondary-container p-5 rounded-lg shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-on-secondary-container text-lg">monitor_heart</span>
                  <span className="font-label text-[10px] uppercase tracking-widest text-on-secondary-container font-semibold">Sinais Vitais</span>
                </div>
                <div className="font-headline text-xl text-on-secondary-container">120/80 mmHg</div>
                <div className="text-[10px] text-on-secondary-container/70">Pressão Arterial • Estável</div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "IMC", value: "24.2", status: "Ideal" },
                  { label: "TFG", value: "78 mL/min", status: "Normal" },
                  { label: "RCV", value: "8%", status: "Baixo" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-primary/5">
                    <span className="text-sm font-semibold text-secondary">{item.label}</span>
                    <div className="text-right">
                      <span className="text-sm font-bold text-primary">{item.value}</span>
                      <span className="text-[10px] text-status-ok ml-2">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Pillars */}
      <section className="bg-surface-low py-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-20">
            <h2 className="font-headline text-4xl text-primary mb-4 font-medium">Os 6 Pilares do {BRAND.name}</h2>
            <p className="text-on-surface-variant text-lg max-w-2xl">
              Cada módulo foi desenhado para a realidade clínica da APS brasileira.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PILLARS.map((p) => (
              <div key={p.title} className="bg-surface-lowest p-8 rounded-xl">
                <span className="material-symbols-outlined text-3xl text-primary mb-4 block">{p.icon}</span>
                <h3 className="font-headline text-xl text-primary font-semibold mb-2">{p.title}</h3>
                <p className="text-secondary text-sm leading-relaxed mb-3">{p.desc}</p>
                <p className="text-on-surface-muted text-xs leading-relaxed italic">{p.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flow */}
      <section className="py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="font-headline text-4xl text-primary mb-20 font-medium">
            Do atendimento ao eSUS em 4 passos.
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {FLOW_STEPS.map((s) => (
              <div key={s.num}>
                <span className="font-headline text-6xl text-primary/10 font-medium block mb-4">{s.num}</span>
                <h3 className="font-headline text-lg text-primary font-semibold mb-2">{s.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-surface-low">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <h2 className="font-headline text-3xl text-primary font-medium mb-6">
            Experimente gratuitamente por 14 dias.
          </h2>
          <Link
            href={isLoggedIn ? "/consulta" : "/signup"}
            className="inline-block px-10 py-4 bg-primary hover:bg-primary-container text-on-primary font-bold text-base rounded-lg transition-all active:scale-95"
          >
            {isLoggedIn ? "Ir para o consultório" : "Começar teste grátis"}
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
