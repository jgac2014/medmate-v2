import Link from "next/link";
import { BRAND } from "@/lib/branding";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";

const FAQ_GROUPS = [
  {
    category: "Sobre o produto",
    items: [
      {
        q: "O MedMate substitui o eSUS PEC?",
        a: "Não. O MedMate é um workspace clínico que complementa o eSUS PEC. Você estrutura a consulta aqui, e o sistema gera o texto de evolução pronto para copiar e colar diretamente no prontuário oficial. Nenhum dado é enviado automaticamente ao eSUS.",
      },
      {
        q: "Para quais médicos o MedMate foi desenvolvido?",
        a: "O MedMate foi desenvolvido especificamente para Médicos de Família e Comunidade (MFC) que atuam na Atenção Primária à Saúde (APS) e utilizam o eSUS PEC diariamente. O sistema é otimizado para o fluxo de trabalho e os desafios específicos dessa especialidade.",
      },
      {
        q: "O que o MedMate faz exatamente?",
        a: "O MedMate organiza e estrutura a documentação clínica da consulta: registro de dados do paciente, sinais vitais com cálculos automáticos (IMC, TFG, risco cardiovascular), lista de problemas, nota SOAP, exames e geração automática do texto formatado para o eSUS PEC.",
      },
      {
        q: "Os cálculos clínicos são automáticos?",
        a: "Sim. IMC, TFG (CKD-EPI), risco cardiovascular (Framingham) e FIB-4 são calculados em tempo real conforme você preenche os dados, sem precisar abrir calculadoras externas.",
      },
    ],
  },
  {
    category: "Conta e assinatura",
    items: [
      {
        q: "Existe teste gratuito?",
        a: "Sim. Você tem 14 dias de acesso completo a todas as funcionalidades do MedMate, sem precisar informar cartão de crédito. Após o período, é possível assinar o plano Pro para continuar.",
      },
      {
        q: "Preciso informar cartão de crédito no cadastro?",
        a: "Não. O trial é completamente gratuito e não exige cartão. Você só precisará informar dados de pagamento caso decida assinar ao final do período de teste.",
      },
      {
        q: "Como funciona o cancelamento?",
        a: "Sem fidelidade e sem burocracia. Cancele a qualquer momento diretamente pelo painel da sua conta. O acesso continua ativo até o final do período já pago.",
      },
      {
        q: "Existe desconto para residentes ou estudantes?",
        a: "No momento não temos planos diferenciados por categoria. Qualquer médico pode começar pelo trial gratuito de 14 dias para avaliar se o MedMate faz sentido para sua rotina.",
      },
    ],
  },
  {
    category: "Segurança e privacidade",
    items: [
      {
        q: "Meus dados clínicos estão seguros?",
        a: "Sim. Todos os dados são criptografados em trânsito (TLS 1.3) e em repouso (AES-256). A infraestrutura utiliza Row Level Security (RLS) para garantir que cada médico acesse apenas seus próprios dados. Estamos em conformidade com a LGPD.",
      },
      {
        q: "Os dados dos pacientes são compartilhados com terceiros?",
        a: "Não. Os dados inseridos no MedMate são de uso exclusivo do médico titular da conta. Não compartilhamos, vendemos ou utilizamos os dados clínicos para qualquer finalidade além da prestação do serviço.",
      },
      {
        q: "O MedMate está em conformidade com a LGPD?",
        a: "Sim. O sistema foi desenvolvido seguindo os princípios da Lei Geral de Proteção de Dados (LGPD) e as diretrizes do Conselho Federal de Medicina sobre prontuário eletrônico e sigilo médico.",
      },
    ],
  },
  {
    category: "Acesso e suporte",
    items: [
      {
        q: "Preciso instalar algum software?",
        a: "Não. O MedMate roda 100% no navegador. Basta acessar pelo Chrome ou Edge em qualquer computador da unidade de saúde. Sem instalação, sem configuração.",
      },
      {
        q: "Funciona no celular?",
        a: "O MedMate é otimizado para uso em desktop e notebook, que é como a maioria dos médicos trabalha com o eSUS PEC. O acesso mobile existe mas a experiência é mais limitada.",
      },
      {
        q: "Como funciona o suporte?",
        a: "Oferecemos suporte por WhatsApp para todos os assinantes. Você pode também entrar em contato pelo e-mail contato@medmate.com.br.",
      },
    ],
  },
];

export default async function FAQPage() {
  let isLoggedIn = false;
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    isLoggedIn = !!user;
  } catch { /* not logged in */ }

  return (
    <div className="min-h-screen bg-white text-on-surface">
      <LandingNavbar isLoggedIn={isLoggedIn} />

      {/* Hero */}
      <section className="bg-surface-low border-b border-outline-variant">
        <div className="max-w-3xl mx-auto px-6 py-16 md:py-20 text-center">
          <div className="inline-block px-3 py-1.5 mb-5 rounded-full border border-primary/15 bg-primary/5 text-[12px] font-medium text-primary tracking-wide uppercase">
            FAQ
          </div>
          <h1 className="text-[36px] sm:text-[44px] font-bold leading-[1.08] tracking-[-0.03em] mb-4">
            Tudo o que você precisa saber sobre o {BRAND.name}.
          </h1>
          <p className="text-[17px] text-on-surface-variant leading-relaxed">
            Perguntas frequentes sobre o produto, assinatura, segurança e suporte.
          </p>
        </div>
      </section>

      {/* FAQ content */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="space-y-14">
          {FAQ_GROUPS.map((group) => (
            <div key={group.category}>
              <h2 className="text-[11px] font-semibold text-on-surface-muted uppercase tracking-wider mb-5 pb-3 border-b border-outline-variant">
                {group.category}
              </h2>
              <div className="space-y-3">
                {group.items.map((faq) => (
                  <details key={faq.q} className="group bg-surface-low border border-outline-variant rounded-xl">
                    <summary className="flex items-center justify-between px-6 py-5 cursor-pointer text-[15px] font-medium list-none [&::-webkit-details-marker]:hidden">
                      {faq.q}
                      <svg className="w-5 h-5 text-on-surface-muted shrink-0 ml-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </summary>
                    <div className="px-6 pb-5 text-[14px] text-on-surface-variant leading-relaxed">{faq.a}</div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions? */}
        <div className="mt-16 bg-surface-low border border-outline-variant rounded-2xl p-8 text-center">
          <h3 className="text-[20px] font-bold mb-2">Ainda tem dúvidas?</h3>
          <p className="text-[14px] text-on-surface-variant mb-6">
            Fale com a gente pelo WhatsApp ou e-mail. Respondemos em até 24 horas.
          </p>
          <a
            href="mailto:contato@medmate.com.br"
            className="inline-block px-6 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg text-[14px] shadow-sm transition-all"
          >
            Falar com suporte
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-primary pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-[30px] sm:text-[38px] font-bold text-white tracking-[-0.02em] mb-4">
            Pronto para experimentar?
          </h2>
          <p className="text-[16px] text-white/80 mb-8">
            14 dias grátis, sem cartão de crédito.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={isLoggedIn ? "/consulta" : "/signup"}
              className="px-7 py-3.5 bg-white hover:bg-surface-low text-primary font-bold rounded-lg text-[15px] shadow-sm transition-all">
              {isLoggedIn ? "Ir para o consultório" : "Começar teste grátis"}
            </Link>
            <Link href="/planos"
              className="px-7 py-3.5 border border-white/30 hover:bg-white/10 text-white font-semibold rounded-lg text-[15px] transition-colors">
              Ver planos
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
