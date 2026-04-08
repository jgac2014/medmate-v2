import Link from "next/link";
import { BRAND } from "@/lib/branding";
import { CURRENT_PRIVACY_VERSION } from "@/lib/legal";

export const metadata = {
  title: `Política de Privacidade — ${BRAND.name}`,
  description: `Como o ${BRAND.name} coleta, usa e protege seus dados.`,
};

function formatDateBR(iso: string) {
  const months = [
    "janeiro","fevereiro","março","abril","maio","junho",
    "julho","agosto","setembro","outubro","novembro","dezembro",
  ];
  const [y, m, d] = iso.split("-");
  return `${parseInt(d)} de ${months[parseInt(m) - 1]} de ${y}`;
}

export default function PoliticaDePrivacidadePage() {
  return (
    <div className="min-h-screen bg-surface-lowest text-on-surface">
      <header className="border-b border-outline-variant">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-black text-[11px] font-extrabold font-mono">
              {BRAND.shortName}
            </div>
            <span className="font-bold text-[14px]">{BRAND.name}</span>
          </Link>
          <Link href="/" className="text-[13px] text-on-surface-variant hover:text-on-surface transition-colors">
            ← Voltar
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-[28px] font-bold tracking-[-0.02em] mb-2">
          Política de Privacidade
        </h1>
        <p className="text-[13px] text-on-surface-muted mb-10">
          Última atualização: {formatDateBR(CURRENT_PRIVACY_VERSION)}
        </p>

        <div className="space-y-8 text-[14px] leading-relaxed text-on-surface-variant">

          <Section title="1. Apresentação">
            <p>
              Esta Política de Privacidade explica como o {BRAND.name} trata dados pessoais no
              contexto da disponibilização de sua plataforma web, acessível em{" "}
              <a
                href={`https://${BRAND.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {BRAND.domain}
              </a>
              , incluindo cadastro, autenticação, uso da ferramenta, cobrança, suporte, segurança
              e operação do serviço.
            </p>
            <p className="mt-3">
              Esta Política deve ser lida em conjunto com os{" "}
              <Link href="/termos-de-uso" className="text-primary hover:underline">
                Termos de Uso
              </Link>{" "}
              do {BRAND.name}.
            </p>
            <p className="mt-3">
              O tratamento de dados pessoais realizado pelo {BRAND.name} observa a legislação
              aplicável, em especial a Lei Geral de Proteção de Dados Pessoais – LGPD (Lei
              n.º 13.709/2018) e, quando pertinente ao ambiente digital, o Marco Civil da Internet
              (Lei n.º 12.965/2014).
            </p>
          </Section>

          <Section title="2. Quem somos e nosso papel no tratamento dos dados">
            <p>
              O {BRAND.name} é uma plataforma de apoio à documentação clínica e à organização do
              fluxo de trabalho do profissional de saúde.
            </p>
            <p className="mt-3">
              Dependendo da categoria de dado e da finalidade do tratamento, o {BRAND.name} poderá
              atuar como:
            </p>
            <Ul>
              <li>
                <strong className="text-on-surface">controlador</strong>, quando toma decisões
                sobre dados relacionados à própria operação do serviço, como cadastro, login,
                cobrança, segurança, prevenção a fraude, suporte e comunicações operacionais; e
              </li>
              <li>
                <strong className="text-on-surface">operador</strong>, quando tratar dados
                inseridos pelo usuário na plataforma em nome dele, conforme suas instruções e dentro
                da finalidade contratada, especialmente no contexto de dados clínicos e de
                pacientes.
              </li>
            </Ul>
          </Section>

          <Section title="3. Quais dados coletamos">
            <p>Podemos tratar as seguintes categorias de dados:</p>

            <h3 className="mt-5 mb-2 text-[14px] font-semibold text-on-surface">
              3.1 Dados de conta e identificação
            </h3>
            <Ul>
              <li>nome;</li>
              <li>endereço de e-mail;</li>
              <li>senha armazenada de forma protegida e não legível em texto simples;</li>
              <li>informações de autenticação e acesso à conta.</li>
            </Ul>

            <h3 className="mt-5 mb-2 text-[14px] font-semibold text-on-surface">
              3.2 Dados de assinatura e cobrança
            </h3>
            <Ul>
              <li>plano contratado;</li>
              <li>status da assinatura;</li>
              <li>
                identificadores e registros de transação fornecidos por processadores de pagamento;
              </li>
              <li>histórico de cobrança e eventos financeiros relacionados ao uso do serviço.</li>
            </Ul>
            <p className="mt-3">
              O {BRAND.name} não armazena dados completos de cartão de crédito quando o
              processamento é realizado por gateway de pagamento terceirizado.
            </p>

            <h3 className="mt-5 mb-2 text-[14px] font-semibold text-on-surface">
              3.3 Dados clínicos e conteúdo inserido pelo usuário
            </h3>
            <Ul>
              <li>dados de pacientes;</li>
              <li>dados de consultas;</li>
              <li>
                informações clínicas, laboratoriais e textuais inseridas na plataforma;
              </li>
              <li>
                documentos, anotações e demais conteúdos produzidos pelo usuário dentro da
                ferramenta.
              </li>
            </Ul>
            <p className="mt-3">
              Como dados referentes à saúde são considerados dados pessoais sensíveis pela LGPD,
              seu tratamento demanda proteção especial.
            </p>

            <h3 className="mt-5 mb-2 text-[14px] font-semibold text-on-surface">
              3.4 Dados técnicos e de uso
            </h3>
            <Ul>
              <li>logs de acesso;</li>
              <li>data e hora de uso;</li>
              <li>endereço IP;</li>
              <li>identificadores de sessão;</li>
              <li>
                navegador, dispositivo, sistema operacional e eventos técnicos relevantes para
                estabilidade e segurança da plataforma.
              </li>
            </Ul>

            <h3 className="mt-5 mb-2 text-[14px] font-semibold text-on-surface">
              3.5 Dados de suporte e comunicação
            </h3>
            <Ul>
              <li>mensagens enviadas ao suporte;</li>
              <li>registros de atendimento;</li>
              <li>
                informações necessárias para responder solicitações, resolver erros e prestar
                suporte técnico.
              </li>
            </Ul>
          </Section>

          <Section title="4. Finalidades do tratamento">
            <p>Tratamos dados pessoais para as seguintes finalidades:</p>
            <Ul>
              <li>criar, autenticar e administrar contas;</li>
              <li>disponibilizar, manter e melhorar a plataforma;</li>
              <li>processar assinaturas, cobranças e gestão do plano contratado;</li>
              <li>
                permitir o armazenamento e a organização dos dados inseridos pelo usuário;
              </li>
              <li>proteger a segurança da conta, da infraestrutura e dos dados;</li>
              <li>prevenir fraude, uso abusivo e incidentes de segurança;</li>
              <li>atender solicitações de suporte;</li>
              <li>
                enviar comunicações operacionais, técnicas, contratuais e administrativas;
              </li>
              <li>
                cumprir obrigações legais, regulatórias ou determinações de autoridades
                competentes;
              </li>
              <li>exercer direitos em processos judiciais, administrativos ou arbitrais.</li>
            </Ul>
          </Section>

          <Section title="5. Bases legais do tratamento">
            <p>
              A LGPD prevê diferentes bases legais para o tratamento de dados pessoais. No contexto
              do {BRAND.name}, o tratamento pode ocorrer, conforme o caso, com fundamento em:
            </p>
            <Ul>
              <li>
                execução de contrato e procedimentos preliminares relacionados à contratação do
                serviço;
              </li>
              <li>cumprimento de obrigação legal ou regulatória;</li>
              <li>exercício regular de direitos em processo judicial, administrativo ou arbitral;</li>
              <li>proteção do crédito e prevenção à fraude, quando aplicável;</li>
              <li>
                legítimo interesse, quando cabível e compatível com os direitos e expectativas do
                titular;
              </li>
              <li>
                consentimento, quando essa for a base adequada para uma finalidade específica.
              </li>
            </Ul>
            <p className="mt-3">
              No caso de dados pessoais sensíveis, inclusive dados de saúde, o tratamento
              observará as hipóteses legais específicas da LGPD aplicáveis ao contexto concreto.
            </p>
          </Section>

          <Section title="6. Dados clínicos, responsabilidade do usuário e sigilo">
            <p>
              O usuário reconhece que os dados clínicos e dados de pacientes inseridos na
              plataforma são de sua responsabilidade quanto à legitimidade de coleta, inserção, uso
              e tratamento, devendo observar a legislação aplicável, o dever de sigilo profissional
              e as normas éticas e regulatórias pertinentes.
            </p>
            <p className="mt-3">
              O acesso interno a dados clínicos pelo time do {BRAND.name} é restrito e limitado
              às hipóteses necessárias, como:
            </p>
            <Ul>
              <li>suporte técnico solicitado ou autorizado;</li>
              <li>investigação de falhas ou incidentes de segurança;</li>
              <li>
                cumprimento de obrigação legal, regulatória ou ordem de autoridade competente;
              </li>
              <li>
                medidas indispensáveis à manutenção da integridade, disponibilidade e segurança
                da plataforma.
              </li>
            </Ul>
          </Section>

          <Section title="7. Compartilhamento de dados">
            <p>
              O {BRAND.name} poderá compartilhar dados pessoais apenas nas hipóteses abaixo,
              conforme necessário para a operação do serviço:
            </p>
            <Ul>
              <li>
                com provedores de infraestrutura, hospedagem, banco de dados, autenticação e
                armazenamento;
              </li>
              <li>com processadores de pagamento e parceiros de cobrança;</li>
              <li>
                com ferramentas de e-mail transacional, suporte e monitoramento técnico;
              </li>
              <li>
                com autoridades públicas, judiciais, administrativas ou regulatórias, quando
                houver obrigação legal ou requisição válida;
              </li>
              <li>
                em operações societárias, como reorganização, incorporação, fusão ou aquisição,
                observadas as salvaguardas cabíveis.
              </li>
            </Ul>
            <p className="mt-3">
              O {BRAND.name} não vende dados pessoais nem os compartilha com terceiros para
              publicidade comportamental ou marketing de terceiros.
            </p>
          </Section>

          <Section title="8. Transferência internacional de dados">
            <p>
              Alguns fornecedores utilizados na operação do {BRAND.name} poderão processar ou
              armazenar dados fora do Brasil. Nesses casos, o {BRAND.name} adotará medidas
              razoáveis para assegurar que a transferência internacional ocorra em conformidade com
              a legislação aplicável e com mecanismos contratuais e técnicos adequados.
            </p>
          </Section>

          <Section title="9. Segurança da informação">
            <p>
              O {BRAND.name} adota medidas técnicas, administrativas e organizacionais razoáveis
              para proteger os dados pessoais contra acessos não autorizados, destruição, perda,
              alteração, comunicação ou qualquer forma de tratamento inadequado ou ilícito.
            </p>
            <p className="mt-3">Entre as medidas adotadas, podem estar incluídas:</p>
            <Ul>
              <li>uso de conexões seguras por HTTPS;</li>
              <li>controle de acesso e autenticação;</li>
              <li>segregação lógica de dados;</li>
              <li>criptografia em repouso e/ou em trânsito, conforme a arquitetura empregada;</li>
              <li>logs de auditoria e monitoramento;</li>
              <li>políticas de privilégio mínimo;</li>
              <li>mecanismos de proteção da infraestrutura e banco de dados.</li>
            </Ul>
            <p className="mt-3">
              Ainda assim, nenhum sistema é completamente invulnerável, e não é possível garantir
              segurança absoluta.
            </p>
          </Section>

          <Section title="10. Retenção, exclusão e backups">
            <p>
              Os dados pessoais serão mantidos pelo tempo necessário para cumprir as finalidades
              descritas nesta Política, inclusive para:
            </p>
            <Ul>
              <li>execução do contrato;</li>
              <li>suporte e continuidade do serviço;</li>
              <li>cumprimento de obrigações legais e regulatórias;</li>
              <li>exercício regular de direitos;</li>
              <li>prevenção a fraudes e segurança.</li>
            </Ul>
            <p className="mt-3">
              Quando a conta for encerrada ou houver solicitação válida de exclusão, os dados serão
              eliminados, anonimizados ou mantidos de forma bloqueada, conforme aplicável,
              respeitados prazos legais e obrigações regulatórias. A exclusão operacional será
              iniciada em até 30 dias, sem prejuízo da manutenção temporária em backups e de
              retenções legalmente exigidas.
            </p>
          </Section>

          <Section title="11. Direitos dos titulares">
            <p>
              Nos termos da LGPD, o titular de dados pessoais pode solicitar, observados os limites
              legais e regulatórios:
            </p>
            <Ul>
              <li>confirmação da existência de tratamento;</li>
              <li>acesso aos dados;</li>
              <li>correção de dados incompletos, inexatos ou desatualizados;</li>
              <li>
                anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou
                tratados em desconformidade;
              </li>
              <li>portabilidade, quando aplicável;</li>
              <li>eliminação dos dados tratados com consentimento, quando cabível;</li>
              <li>informação sobre compartilhamento;</li>
              <li>revogação do consentimento, quando o tratamento se basear em consentimento;</li>
              <li>oposição ao tratamento, nas hipóteses previstas em lei.</li>
            </Ul>
          </Section>

          <Section title="12. Como exercer seus direitos">
            <p>
              Para exercer direitos relacionados a dados pessoais ou enviar dúvidas sobre
              privacidade, o titular poderá entrar em contato pelo canal abaixo:
            </p>
            <ul className="mt-3 space-y-1.5 text-[14px]">
              <li>
                <span className="font-medium text-on-surface">E-mail:</span>{" "}
                <a href={`mailto:${BRAND.privacyEmail}`} className="text-primary hover:underline">
                  {BRAND.privacyEmail}
                </a>
              </li>
              <li>
                <span className="font-medium text-on-surface">Assunto sugerido:</span>{" "}
                Solicitação LGPD
              </li>
            </ul>
            <p className="mt-3">
              O {BRAND.name} poderá solicitar informações adicionais razoáveis para confirmar a
              identidade do solicitante e evitar acessos indevidos.
            </p>
          </Section>

          <Section title="13. Cookies e tecnologias semelhantes">
            <p>
              O {BRAND.name} utiliza cookies e tecnologias semelhantes estritamente necessários
              para:
            </p>
            <Ul>
              <li>autenticação de sessão;</li>
              <li>segurança;</li>
              <li>manutenção do login;</li>
              <li>funcionamento essencial da plataforma;</li>
              <li>análise técnica de estabilidade e performance, quando aplicável.</li>
            </Ul>
            <p className="mt-3">
              O {BRAND.name} não utiliza cookies publicitários de terceiros para rastreamento
              comportamental, salvo se isso vier a ser expressamente informado em política
              atualizada.
            </p>
          </Section>

          <Section title="14. Incidentes de segurança">
            <p>
              Em caso de incidente de segurança que possa acarretar risco ou dano relevante aos
              titulares, o {BRAND.name} adotará as medidas cabíveis de resposta, contenção e
              avaliação, além de realizar as comunicações legalmente exigidas, quando aplicável.
            </p>
          </Section>

          <Section title="15. Alterações desta Política">
            <p>
              Esta Política poderá ser atualizada periodicamente para refletir mudanças legais,
              regulatórias, técnicas ou operacionais.
            </p>
            <p className="mt-3">
              A versão vigente estará sempre disponível no website ou na plataforma, com indicação
              da data de atualização. Quando as alterações forem relevantes, o {BRAND.name} poderá
              comunicar os usuários por e-mail, aviso no sistema ou outro canal apropriado.
            </p>
          </Section>

          <Section title="16. Contato">
            <p>
              Para dúvidas sobre esta Política ou sobre o tratamento de dados pessoais:
            </p>
            <ul className="mt-3 space-y-1.5 text-[14px]">
              <li>
                <span className="font-medium text-on-surface">E-mail:</span>{" "}
                <a href={`mailto:${BRAND.privacyEmail}`} className="text-primary hover:underline">
                  {BRAND.privacyEmail}
                </a>
              </li>
              <li>
                <span className="font-medium text-on-surface">Website:</span>{" "}
                <a
                  href={`https://${BRAND.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {BRAND.domain}
                </a>
              </li>
              <li>
                {/* TODO: adicionar CNPJ e endereço empresarial */}
                <span className="font-medium text-on-surface">Responsável legal:</span>{" "}
                nome do ex
              </li>
            </ul>
          </Section>

        </div>
      </main>

      <footer className="border-t border-outline-variant mt-16">
        <div className="max-w-3xl mx-auto px-6 py-6 text-[12px] text-on-surface-muted">
          &copy; {new Date().getFullYear()} {BRAND.name}. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-[16px] font-semibold text-on-surface mb-3">{title}</h2>
      {children}
    </section>
  );
}

function Ul({ children }: { children: React.ReactNode }) {
  return (
    <ul className="mt-2 space-y-1.5 list-disc list-outside pl-5 marker:text-on-surface-muted">
      {children}
    </ul>
  );
}
