import Link from "next/link";
import { BRAND } from "@/lib/branding";
import { CURRENT_TERMS_VERSION } from "@/lib/legal";

export const metadata = {
  title: `Termos de Uso — ${BRAND.name}`,
  description: `Condições de uso da plataforma ${BRAND.name}.`,
};

/** Formats "2026-04-07" → "07 de abril de 2026" */
function formatDateBR(iso: string) {
  const months = [
    "janeiro","fevereiro","março","abril","maio","junho",
    "julho","agosto","setembro","outubro","novembro","dezembro",
  ];
  const [y, m, d] = iso.split("-");
  return `${parseInt(d)} de ${months[parseInt(m) - 1]} de ${y}`;
}

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
          Última atualização: {formatDateBR(CURRENT_TERMS_VERSION)}
        </p>

        <div className="space-y-8 text-[14px] leading-relaxed text-on-surface-variant">

          <Section title="1. Apresentação">
            <p>
              Estes Termos de Uso regulam o acesso e a utilização da plataforma {BRAND.name}, uma
              ferramenta web voltada ao apoio da documentação clínica e organização do fluxo
              assistencial por profissionais de saúde.
            </p>
            <p className="mt-3">
              Ao acessar, se cadastrar ou utilizar a plataforma, o usuário declara que leu,
              compreendeu e concorda com estes Termos e com a{" "}
              <Link href="/politica-de-privacidade" className="text-primary hover:underline">
                Política de Privacidade
              </Link>{" "}
              aplicável.
            </p>
          </Section>

          <Section title="2. Natureza da plataforma">
            <p>
              O {BRAND.name} é uma ferramenta de apoio à prática profissional, destinada a auxiliar
              o usuário na estruturação de informações clínicas, organização do atendimento e geração
              de textos e resumos.
            </p>
            <p className="mt-3">O {BRAND.name}:</p>
            <Ul>
              <li>
                não substitui avaliação clínica, exame físico, raciocínio médico, decisão
                profissional ou registro oficial no sistema utilizado pelo serviço de saúde;
              </li>
              <li>não realiza diagnóstico médico autônomo;</li>
              <li>
                não garante correção, suficiência, completude ou adequação clínica automática do
                conteúdo gerado;
              </li>
              <li>
                deve ser utilizado como apoio operacional, cabendo ao profissional revisar
                integralmente toda informação antes de utilizá-la, registrá-la, imprimi-la,
                assiná-la ou compartilhá-la.
              </li>
            </Ul>
            <p className="mt-3">
              Toda decisão clínica, prescrição, solicitação de exame, encaminhamento, orientação,
              emissão de documento e registro em prontuário é de responsabilidade exclusiva do
              profissional usuário.
            </p>
          </Section>

          <Section title="3. Público autorizado">
            <p>
              A plataforma é destinada prioritariamente a médicos, estudantes de medicina e outros
              profissionais de saúde, conforme as funcionalidades disponibilizadas.
            </p>
            <p className="mt-3">Ao utilizar o {BRAND.name}, o usuário declara que:</p>
            <Ul>
              <li>possui capacidade civil para contratar;</li>
              <li>fornecerá informações verdadeiras e atualizadas;</li>
              <li>
                utilizará a ferramenta apenas para fins lícitos e profissionais compatíveis com
                sua habilitação, quando aplicável.
              </li>
            </Ul>
            <p className="mt-3">
              O uso por pessoa não habilitada para atividades privativas de profissão regulamentada
              não transfere ao {BRAND.name} qualquer responsabilidade por atos praticados pelo
              usuário.
            </p>
          </Section>

          <Section title="4. Cadastro e conta">
            <p>
              Para acessar determinadas funcionalidades, o usuário deverá criar uma conta,
              informando dados cadastrais válidos e completos.
            </p>
            <p className="mt-3">O usuário é responsável por:</p>
            <Ul>
              <li>manter a confidencialidade de sua senha e credenciais;</li>
              <li>restringir o acesso à sua conta;</li>
              <li>
                comunicar imediatamente qualquer uso não autorizado, suspeita de violação ou
                incidente de segurança.
              </li>
            </Ul>
            <p className="mt-3">
              O titular da conta responde por toda atividade nela realizada, salvo comprovação de
              falha atribuível exclusivamente à plataforma.
            </p>
          </Section>

          <Section title="5. Planos, trial, assinatura e cobrança">
            <p>
              O {BRAND.name} pode oferecer acesso gratuito, período de teste (trial) e/ou planos
              pagos por assinatura.
            </p>

            <h3 className="mt-5 mb-2 text-[14px] font-semibold text-on-surface">5.1 Trial</h3>
            <p>
              Quando houver trial, ele será concedido nas condições divulgadas no website ou no
              fluxo de contratação, por prazo determinado e com as limitações funcionais
              eventualmente informadas.
            </p>
            <p className="mt-3">Salvo informação expressa em contrário, o término do trial poderá:</p>
            <Ul>
              <li>encerrar o acesso a funcionalidades premium; ou</li>
              <li>
                converter-se em plano pago, quando isso tiver sido claramente informado ao usuário
                no momento da contratação.
              </li>
            </Ul>

            <h3 className="mt-5 mb-2 text-[14px] font-semibold text-on-surface">5.2 Assinatura</h3>
            <p>
              Nos planos pagos, o usuário autoriza a cobrança recorrente conforme periodicidade
              escolhida no momento da contratação.
            </p>

            <h3 className="mt-5 mb-2 text-[14px] font-semibold text-on-surface">5.3 Reajustes e mudanças de preço</h3>
            <p>
              Os valores podem ser alterados mediante comunicação prévia, respeitadas as obrigações
              legais e regulatórias aplicáveis. Mudanças não retroagem sobre período já pago.
            </p>

            <h3 className="mt-5 mb-2 text-[14px] font-semibold text-on-surface">5.4 Inadimplência</h3>
            <p>O não pagamento poderá resultar em:</p>
            <Ul>
              <li>suspensão do acesso;</li>
              <li>limitação de funcionalidades;</li>
              <li>cancelamento da assinatura, após as tratativas cabíveis.</li>
            </Ul>

            <h3 className="mt-5 mb-2 text-[14px] font-semibold text-on-surface">5.5 Cancelamento</h3>
            <p>
              O usuário poderá solicitar o cancelamento da renovação da assinatura a qualquer
              momento, produzindo efeitos para o próximo ciclo, salvo disposição diversa informada
              no ato da contratação.
            </p>
          </Section>

          <Section title="6. Obrigações do usuário">
            <p>O usuário concorda em:</p>
            <Ul>
              <li>
                revisar criticamente todo conteúdo gerado pela plataforma antes de qualquer uso
                clínico ou administrativo;
              </li>
              <li>inserir apenas dados cuja utilização seja legítima e autorizada;</li>
              <li>
                respeitar a legislação aplicável, inclusive regras éticas e de sigilo profissional;
              </li>
              <li>
                utilizar a plataforma de modo compatível com a boa-fé, a ordem pública e a
                finalidade do serviço.
              </li>
            </Ul>
            <p className="mt-3">É proibido:</p>
            <Ul>
              <li>utilizar o {BRAND.name} para fins ilícitos, fraudulentos ou enganosos;</li>
              <li>
                inserir informações falsas com objetivo de manipular documentos, registros ou
                condutas;
              </li>
              <li>
                tentar copiar, desmontar, invadir, explorar vulnerabilidades, extrair código-fonte
                ou contornar mecanismos de segurança;
              </li>
              <li>
                revender, sublicenciar, ceder, alugar ou explorar comercialmente a plataforma sem
                autorização expressa;
              </li>
              <li>
                usar a ferramenta para produzir conteúdo ofensivo, discriminatório, ilegal ou que
                viole direitos de terceiros.
              </li>
            </Ul>
          </Section>

          <Section title="7. Dados pessoais, sigilo e LGPD">
            <p>
              O tratamento de dados pessoais no {BRAND.name} observará a legislação aplicável, em
              especial a Lei Geral de Proteção de Dados Pessoais – LGPD (Lei n.º 13.709/2018), que
              disciplina o tratamento de dados pessoais, inclusive em meios digitais. O uso da
              internet no Brasil também se sujeita ao Marco Civil da Internet (Lei n.º 12.965/2014).
            </p>
            <p className="mt-3">O usuário declara ciência de que:</p>
            <Ul>
              <li>
                dados inseridos na plataforma podem incluir informações pessoais e, conforme o uso,
                dados pessoais sensíveis, inclusive dados de saúde;
              </li>
              <li>
                é sua responsabilidade garantir que possui base legal adequada para inserir e tratar
                tais dados;
              </li>
              <li>
                deve observar deveres de confidencialidade, sigilo profissional e segurança da
                informação.
              </li>
            </Ul>
            <p className="mt-3">
              O {BRAND.name} adotará medidas razoáveis de segurança técnicas e administrativas
              compatíveis com sua operação para proteger os dados, mas nenhum sistema é
              absolutamente imune a falhas, ataques ou indisponibilidades.
            </p>
            <p className="mt-3">
              As regras detalhadas sobre coleta, uso, armazenamento, compartilhamento e retenção de
              dados constarão da{" "}
              <Link href="/politica-de-privacidade" className="text-primary hover:underline">
                Política de Privacidade
              </Link>
              , que integra estes Termos.
            </p>
          </Section>

          <Section title="8. Dados clínicos e responsabilidade profissional">
            <p>
              O usuário reconhece que registros clínicos e conteúdos gerados pela plataforma podem
              exigir validação, correção, complementação e contextualização.
            </p>
            <p className="mt-3">Assim, o usuário é o único responsável por:</p>
            <Ul>
              <li>confirmar a exatidão das informações;</li>
              <li>
                verificar alergias, contraindicações, doses, interações, exames, hipóteses
                diagnósticas e condutas;
              </li>
              <li>
                conferir conformidade com protocolos institucionais, diretrizes aplicáveis e
                exigências regulatórias;
              </li>
              <li>
                validar o texto final antes de inseri-lo em prontuário, sistema oficial, documento
                assistencial ou comunicação ao paciente.
              </li>
            </Ul>
            <p className="mt-3">
              O {BRAND.name} não se responsabiliza por danos decorrentes de:
            </p>
            <Ul>
              <li>uso sem revisão profissional;</li>
              <li>inserção incompleta, incorreta ou desatualizada de dados;</li>
              <li>interpretação equivocada do conteúdo gerado;</li>
              <li>uso incompatível com a finalidade da ferramenta;</li>
              <li>
                falhas decorrentes de sistemas de terceiros, integrações externas ou
                indisponibilidade de internet.
              </li>
            </Ul>
          </Section>

          <Section title="9. Integrações e serviços de terceiros">
            <p>
              A plataforma poderá utilizar ou se integrar a serviços de terceiros, como hospedagem,
              autenticação, analytics, gateways de pagamento e APIs.
            </p>
            <p className="mt-3">
              Esses serviços podem estar sujeitos a termos e políticas próprias. O {BRAND.name} não
              se responsabiliza por indisponibilidades, falhas, alterações ou encerramento de
              serviços de terceiros fora de seu controle razoável.
            </p>
          </Section>

          <Section title="10. Disponibilidade da plataforma">
            <p>
              O {BRAND.name} busca manter a plataforma disponível de forma contínua, mas não
              garante funcionamento ininterrupto ou livre de erros.
            </p>
            <p className="mt-3">A plataforma poderá passar por:</p>
            <Ul>
              <li>manutenção programada;</li>
              <li>atualizações;</li>
              <li>correções;</li>
              <li>interrupções técnicas temporárias;</li>
              <li>limitações decorrentes de caso fortuito, força maior ou fatos de terceiros.</li>
            </Ul>
            <p className="mt-3">
              Sempre que possível, haverá comunicação prévia sobre indisponibilidades relevantes.
            </p>
          </Section>

          <Section title="11. Propriedade intelectual">
            <p>
              Todos os direitos relativos ao {BRAND.name}, incluindo software, interface, design,
              marca, textos, fluxos, estrutura, bancos de dados, modelos, funcionalidades e
              conteúdos proprietários, pertencem ao {BRAND.name} ou a seus licenciantes.
            </p>
            <p className="mt-3">
              Estes Termos não transferem ao usuário qualquer direito de propriedade intelectual,
              apenas licença limitada, não exclusiva, revogável e intransferível para uso da
              plataforma conforme sua finalidade.
            </p>
            <p className="mt-3">
              É vedado copiar, reproduzir, distribuir, modificar, criar obras derivadas, realizar
              engenharia reversa ou explorar economicamente qualquer elemento da plataforma sem
              autorização prévia e expressa.
            </p>
          </Section>

          <Section title="12. Suspensão e encerramento de conta">
            <p>
              O {BRAND.name} poderá suspender, restringir ou encerrar contas, com ou sem aviso
              prévio, em caso de:
            </p>
            <Ul>
              <li>violação destes Termos;</li>
              <li>inadimplência;</li>
              <li>uso fraudulento, abusivo ou ilícito;</li>
              <li>risco à segurança da plataforma, dos dados ou de terceiros;</li>
              <li>determinação legal, judicial ou administrativa.</li>
            </Ul>
            <p className="mt-3">
              Quando viável, o usuário será informado e poderá regularizar a situação.
            </p>
          </Section>

          <Section title="13. Limitação de responsabilidade">
            <p>
              Na máxima extensão permitida pela legislação aplicável, o {BRAND.name} não será
              responsável por:
            </p>
            <Ul>
              <li>
                lucros cessantes, perda de chance, danos indiretos, incidentais, especiais ou
                consequenciais;
              </li>
              <li>prejuízos decorrentes de decisões clínicas tomadas pelo usuário;</li>
              <li>erros decorrentes de dados fornecidos pelo próprio usuário ou por terceiros;</li>
              <li>
                falhas de conectividade, dispositivos, navegadores, sistemas externos ou integrações
                de terceiros.
              </li>
            </Ul>
            <p className="mt-3">
              Nada nestes Termos exclui responsabilidade que não possa ser afastada por lei,
              inclusive nas hipóteses em que a legislação consumerista brasileira for aplicável. O
              Código de Defesa do Consumidor (Lei n.º 8.078/1990) estabelece normas de ordem pública
              para relações de consumo, razão pela qual cláusulas contratuais devem ser interpretadas
              em conformidade com ele.
            </p>
          </Section>

          <Section title="14. Alterações destes Termos">
            <p>
              O {BRAND.name} poderá atualizar estes Termos para refletir mudanças legais,
              regulatórias, técnicas, operacionais ou de produto.
            </p>
            <p className="mt-3">
              A versão vigente será disponibilizada na plataforma ou no website, com indicação da
              data de atualização. O uso continuado da plataforma após a atualização representará
              concordância com a nova versão, ressalvados os direitos legalmente assegurados ao
              usuário.
            </p>
          </Section>

          <Section title="15. Comunicações">
            <p>
              As comunicações do {BRAND.name} poderão ser realizadas por e-mail, notificações no
              sistema, website ou outros canais cadastrados pelo usuário.
            </p>
            <p className="mt-3">
              O usuário compromete-se a manter seus dados de contato atualizados.
            </p>
          </Section>

          <Section title="16. Lei aplicável e foro">
            <p>
              Estes Termos serão regidos pelas leis da República Federativa do Brasil.
            </p>
            <p className="mt-3">
              Fica eleito o foro da comarca de Brasília/DF, salvo disposição legal em contrário,
              especialmente quando houver regra protetiva aplicável ao consumidor.
            </p>
          </Section>

          <Section title="17. Contato">
            <p>
              Em caso de dúvidas, solicitações ou comunicações relacionadas a estes Termos, o
              usuário poderá entrar em contato por:
            </p>
            <ul className="mt-3 space-y-1.5 text-[14px]">
              <li>
                <span className="font-medium text-on-surface">E-mail:</span>{" "}
                <a href={`mailto:${BRAND.supportEmail}`} className="text-primary hover:underline">
                  {BRAND.supportEmail}
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
                <span className="font-medium text-on-surface">Responsável:</span>{" "}
                nome do ex
              </li>
            </ul>
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

function Ul({ children }: { children: React.ReactNode }) {
  return (
    <ul className="mt-2 space-y-1.5 list-disc list-outside pl-5 marker:text-on-surface-muted">
      {children}
    </ul>
  );
}
