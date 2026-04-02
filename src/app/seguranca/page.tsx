import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";

const PILLARS = [
  {
    icon: "content_paste_go",
    title: "Resumo pronto para o eSUS PEC",
    desc: "Segurança é não perder tempo. Copie sua evolução estruturada e cole diretamente no prontuário oficial com total integridade clínica.",
  },
  {
    icon: "fingerprint",
    title: "Rastreabilidade Ética",
    desc: "Acesso individual para cada médico. Sua responsabilidade técnica protegida por credenciais exclusivas e não compartilháveis.",
  },
  {
    icon: "cloud_done",
    title: "Navegador e Nuvem",
    desc: "Acesse em qualquer unidade de saúde via Chrome ou Edge. Sem rastros locais, dados protegidos em servidores de alta segurança.",
  },
  {
    icon: "inventory_2",
    title: "Organização Clínica Real",
    desc: "Interface que guia seu raciocínio. Menos chance de erro, mais qualidade no registro médico para a Atenção Primária.",
  },
  {
    icon: "gavel",
    title: "Conformidade LGPD",
    desc: "Tratamento de dados sensíveis seguindo rigorosamente a legislação brasileira e os preceitos do sigilo médico.",
  },
  {
    icon: "bolt",
    title: "Rapidez sem Compromisso",
    desc: "Projetado para consultas de alto volume na APS, onde a segurança do registro não pode ser sacrificada pela pressa.",
  },
];

const FAQS = [
  {
    q: "Meus dados ficam protegidos?",
    a: "Sim. Utilizamos criptografia em trânsito (TLS) e em repouso para todos os dados clínicos. Acesso isolado por conta médica — nenhum dado é compartilhado entre usuários.",
  },
  {
    q: "O MedMate substitui o eSUS PEC?",
    a: "Não. O MedMate complementa o eSUS PEC. Você estrutura a consulta aqui e cola o resumo gerado automaticamente no prontuário oficial. Nenhum dado é enviado ao eSUS sem sua ação explícita.",
  },
  {
    q: "O MedMate está em conformidade com a LGPD?",
    a: "Sim. Seguimos rigorosamente a Lei Geral de Proteção de Dados. Seus dados são tratados com base legal adequada e você tem direito à portabilidade e exclusão.",
  },
  {
    q: "Onde os dados são armazenados?",
    a: "Em servidores seguros com backups automáticos. Utilizamos infraestrutura com certificação SOC 2 e isolamento de dados por conta médica via Row Level Security.",
  },
];

export default async function SegurancaPage() {
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
      <header className="relative pt-20 pb-16 overflow-hidden bg-surface">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-headline text-5xl lg:text-6xl text-primary font-medium tracking-tight mb-6 leading-[1.1]">
              Segurança e seriedade no registro clínico.
            </h1>
            <p className="text-lg text-secondary max-w-xl mb-10 leading-relaxed">
              O {`MedMate`} foi desenhado para médicos da <strong>Atenção Primária</strong> que buscam conformidade ética e produtividade. Garantia de sigilo de dados e um <strong>resumo pronto para o eSUS PEC</strong> em segundos.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={isLoggedIn ? "/consulta" : "/signup"}
                className="px-8 py-4 bg-primary hover:bg-primary-container text-on-primary font-semibold rounded-lg transition-all active:scale-95"
              >
                Começar teste grátis
              </Link>
              <Link
                href="/funcionalidades"
                className="px-8 py-4 bg-surface-highest text-on-surface-variant font-semibold rounded-lg hover:bg-surface-dim transition-colors active:scale-95"
              >
                Ver demonstração
              </Link>
            </div>
          </div>

          {/* Security badge mockup */}
          <div className="relative hidden lg:block">
            <div className="bg-primary rounded-2xl p-8 shadow-2xl shadow-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-secondary-container text-2xl">verified_user</span>
                <span className="text-on-primary-container text-sm font-semibold uppercase tracking-widest">Workspace Protegido</span>
              </div>
              <p className="text-on-primary-container/80 text-sm leading-relaxed">
                Dados criptografados e fluxos otimizados para a rotina da <strong className="text-on-primary-container">APS</strong>. Isolamento por conta médica via Row Level Security.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { icon: "lock", label: "TLS 1.3" },
                  { icon: "shield", label: "LGPD" },
                  { icon: "storage", label: "Backups diários" },
                  { icon: "key", label: "RLS ativo" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 bg-surface-lowest/10 rounded-lg p-3">
                    <span className="material-symbols-outlined text-secondary-container text-lg">{item.icon}</span>
                    <span className="text-on-primary-container text-xs font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Pillars */}
      <section className="py-24 bg-surface-low">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {PILLARS.map((p) => (
              <div key={p.title} className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-surface-lowest rounded-lg flex items-center justify-center shadow-sm border border-outline-variant/20">
                  <span className="material-symbols-outlined text-primary text-3xl">{p.icon}</span>
                </div>
                <h3 className="font-headline text-2xl text-primary font-semibold">{p.title}</h3>
                <p className="text-secondary leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote section */}
      <section className="py-24 bg-surface-lowest">
        <div className="max-w-7xl mx-auto px-8">
          <div className="bg-primary rounded-[2rem] p-12 lg:p-16 relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <span className="text-secondary-container font-semibold tracking-widest text-sm uppercase mb-6 block">
                Credibilidade Médica
              </span>
              <h2 className="font-headline text-4xl lg:text-5xl text-on-primary font-medium mb-8 leading-tight">
                Criado por médico para a realidade de outros médicos na APS.
              </h2>
              <p className="text-on-primary-container/80 text-lg leading-relaxed font-light italic mb-8">
                &ldquo;Entendo a fricção do eSUS PEC e a pressão de uma agenda lotada. O MedMate não nasceu em um laboratório de software, mas dentro de uma Unidade Básica de Saúde, para resolver a dor de quem precisa documentar com excelência em um cenário de alta demanda.&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">stethoscope</span>
                </div>
                <div>
                  <p className="text-on-primary font-semibold">Equipe MedMate</p>
                  <p className="text-on-primary-container/70 text-sm">Médicos de Família e Comunidade</p>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-surface-lowest/5 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-surface-lowest/5 rounded-full blur-3xl -ml-48 -mb-48" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-surface">
        <div className="max-w-3xl mx-auto px-8">
          <h2 className="font-headline text-4xl text-primary font-medium text-center mb-16">
            Dúvidas Frequentes
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
