import Link from "next/link";
import { BRAND } from "@/lib/branding";

export const metadata = {
  title: `Política de Privacidade — ${BRAND.name}`,
  description: `Como o ${BRAND.name} coleta, usa e protege seus dados.`,
};

export default function PoliticaDePrivacidadePage() {
  return (
    <div className="min-h-screen bg-bg-0 text-text-primary">
      {/* Nav */}
      <header className="border-b border-border-subtle">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-black text-[11px] font-extrabold font-mono">
              {BRAND.shortName}
            </div>
            <span className="font-bold text-[14px]">{BRAND.name}</span>
          </Link>
          <Link href="/" className="text-[13px] text-text-secondary hover:text-text-primary transition-colors">
            ← Voltar
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-[28px] font-bold tracking-[-0.02em] mb-2">
          Política de Privacidade
        </h1>
        <p className="text-[13px] text-text-tertiary mb-10">
          Última atualização: 27 de março de 2026
        </p>

        <div className="space-y-8 text-[14px] leading-relaxed text-text-secondary">

          <Section title="1. Sobre esta política">
            <p>
              Esta Política de Privacidade descreve como o {BRAND.name} (&quot;nós&quot;, &quot;nosso&quot;)
              coleta, usa, armazena e protege os dados pessoais dos usuários da plataforma
              acessível em medmate.com.br. Ao usar o {BRAND.name}, você concorda com as
              práticas descritas neste documento.
            </p>
          </Section>

          <Section title="2. Dados coletados">
            <p className="mb-3">Coletamos apenas os dados necessários para operar o serviço:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong className="text-text-primary">Dados de conta:</strong> nome, endereço de email e senha (armazenada de forma criptografada).</li>
              <li><strong className="text-text-primary">Dados de assinatura:</strong> informações de pagamento processadas pelo Stripe (não armazenamos dados de cartão).</li>
              <li><strong className="text-text-primary">Dados clínicos:</strong> informações inseridas durante o uso da ferramenta (consultas, pacientes). Esses dados ficam associados à sua conta e não são acessados pela nossa equipe.</li>
              <li><strong className="text-text-primary">Dados de uso:</strong> logs técnicos de acesso para diagnóstico de problemas.</li>
            </ul>
          </Section>

          <Section title="3. Uso dos dados">
            <p className="mb-3">Seus dados são usados exclusivamente para:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Fornecer e manter o serviço contratado.</li>
              <li>Processar pagamentos e gerenciar assinaturas.</li>
              <li>Comunicar atualizações relevantes do serviço.</li>
              <li>Diagnosticar e corrigir problemas técnicos.</li>
            </ul>
            <p className="mt-3">
              Não vendemos, alugamos nem compartilhamos seus dados com terceiros para fins
              de marketing.
            </p>
          </Section>

          <Section title="4. Dados clínicos e sigilo médico">
            <p>
              Os dados clínicos inseridos na plataforma (informações de pacientes, consultas)
              são de sua responsabilidade. O {BRAND.name} age como processador de dados —
              armazenamos as informações conforme você instrui, sem interpretá-las ou
              compartilhá-las. Recomendamos que você siga as normas do CFM e da LGPD ao
              inserir dados de pacientes.
            </p>
          </Section>

          <Section title="5. Armazenamento e segurança">
            <p>
              Os dados são armazenados em servidores seguros fornecidos pelo Supabase
              (PostgreSQL com criptografia em repouso). O acesso é protegido por
              autenticação e políticas de controle de acesso por linha (Row Level Security).
              Utilizamos conexões HTTPS para toda comunicação.
            </p>
          </Section>

          <Section title="6. Retenção de dados">
            <p>
              Seus dados são mantidos enquanto sua conta estiver ativa. Ao solicitar a
              exclusão da conta, removeremos seus dados em até 30 dias, exceto onde a
              retenção for exigida por lei.
            </p>
          </Section>

          <Section title="7. Seus direitos (LGPD)">
            <p className="mb-3">
              Nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem
              direito a:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Confirmar a existência de tratamento de seus dados.</li>
              <li>Acessar seus dados.</li>
              <li>Corrigir dados incompletos ou desatualizados.</li>
              <li>Solicitar a exclusão de dados desnecessários.</li>
              <li>Revogar o consentimento.</li>
              <li>Portabilidade dos dados.</li>
            </ul>
            <p className="mt-3">
              Para exercer esses direitos, entre em contato pelo email{" "}
              <a href="mailto:privacidade@medmate.com.br" className="text-accent hover:underline">
                privacidade@medmate.com.br
              </a>.
            </p>
          </Section>

          <Section title="8. Cookies">
            <p>
              Utilizamos cookies de sessão estritamente necessários para autenticação.
              Não utilizamos cookies de rastreamento ou publicidade.
            </p>
          </Section>

          <Section title="9. Alterações desta política">
            <p>
              Podemos atualizar esta política periodicamente. Notificaremos usuários sobre
              mudanças relevantes por email. O uso continuado do serviço após a notificação
              constitui aceite das novas condições.
            </p>
          </Section>

          <Section title="10. Contato">
            <p>
              Dúvidas sobre privacidade:{" "}
              <a href="mailto:privacidade@medmate.com.br" className="text-accent hover:underline">
                privacidade@medmate.com.br
              </a>
            </p>
          </Section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle mt-16">
        <div className="max-w-3xl mx-auto px-6 py-6 text-[12px] text-text-tertiary">
          &copy; {new Date().getFullYear()} {BRAND.name}. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-[16px] font-semibold text-text-primary mb-3">{title}</h2>
      {children}
    </section>
  );
}
