# Design: Fundação Patient Entity + Features Independentes

**Data:** 2026-03-28
**Status:** Aprovado
**Ciclo:** 1 de 2 (features longitudinais no Ciclo 2)

---

## Contexto

O modelo atual do MedMate trata cada consulta como entidade isolada com dados do paciente embutidos (`ConsultationState.patient`). Não existe uma entidade `Patient` persistente. Isso torna impossível implementar corretamente:

- Pendências do próximo retorno (sem `patient_id`, não há como ligar consultas do mesmo paciente)
- Lista de problemas ativos longitudinal
- Histórico de paciente confiável com muitas consultas

Este ciclo introduz a entidade `Patient` como fundação e entrega 3 features independentes de alto valor imediato: autosave, templates e snippets.

---

## Decisões arquiteturais

- **1 conta = 1 médico.** Sem camada de organização/time.
- **Identidade do paciente:** nome + data de nascimento como par de busca. ID interno gerado pelo sistema (UUID). CPF e CNS são opcionais.
- **Migração:** consultas existentes ficam com `patient_id = null` (legado, ainda visíveis e funcionais). Sem migração automática por heurística de nome — evita duplicatas.
- **Conteúdo clínico:** toda informação clínica (templates, checklist, valores de referência) é sourced exclusivamente de diretrizes oficiais brasileiras mais recentes (MS, CFM, SBMFC, PCDT). Busca obrigatória via WebSearch antes de escrever qualquer conteúdo clínico. Cada item cita fonte e ano no código.

---

## 1. Entidade Patient

### Tabela Supabase: `patients`

```sql
create table patients (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  birth_date  date not null,
  gender      text,
  race        text,
  cpf         text,
  cns         text,
  created_at  timestamptz default now()
);

-- RLS: médico só vê seus próprios pacientes
alter table patients enable row level security;
create policy "own patients" on patients
  using (user_id = auth.uid());
```

### Alteração em `consultations`

```sql
alter table consultations
  add column patient_id uuid references patients(id) on delete set null;
```

Consultas antigas: `patient_id = null` — legado, funcionam normalmente.

### Fluxo de nova consulta

1. Médico clica "Nova consulta"
2. Modal/drawer de seleção de paciente abre
3. Campo de busca por nome — mostra pacientes existentes em tempo real
4. Se não encontrar: botão "Criar novo paciente" com campos: nome, data de nascimento, sexo, raça (CPF/CNS opcionais)
5. Paciente selecionado/criado → consulta inicia com `patient_id` vinculado
6. Campos nome, sexo, raça em `PatientInfo` são pré-preenchidos a partir do paciente selecionado. `age` (string no store) é calculada automaticamente a partir de `birth_date` (ex: "45 anos").

### Compatibilidade com legado

- Consultas com `patient_id = null` continuam aparecendo no histórico normalmente
- Exibem badge "Legado" sutil no HistoryPanel
- O médico pode, opcionalmente, vincular uma consulta legada a um paciente existente (fase futura)

---

## 2. Autosave / Rascunho

### Comportamento

- Estado do store é serializado para `localStorage` com debounce de 30 segundos após qualquer mudança
- Chave: `medmate_draft_${userId}` — isolado por usuário
- Ao abrir a página de consulta: verificar se existe rascunho no localStorage
- Se sim e for diferente do estado inicial: exibir banner de recuperação no topo da página
  - "Rascunho recuperado de [data/hora]. Deseja continuar?" → botão "Continuar" e "Descartar"
- Ao salvar consulta com sucesso: limpar rascunho do localStorage
- Ao clicar "Nova consulta": limpar rascunho

### Implementação

- Hook `useDraftAutosave` que observa o store e persiste no localStorage
- Componente `DraftRecoveryBanner` renderizado condicionalmente no topo da `ConsultaPage`
- Sem dependência de Supabase — zero custo, zero latência

---

## 3. Templates por tipo de consulta

### Estrutura de um template

```ts
interface ConsultationTemplate {
  id: string;
  name: string;
  description: string;
  source: string;      // ex: "Caderno de AB nº 37 — HAS, MS 2013"
  sourceUrl?: string;
  problems?: string[]; // IDs de problemas a pré-selecionar
  soapBase?: {
    subjective?: string;
    objective?: string;
    assessment?: string;
    plan?: string;
  };
  labSuggestions?: string[];      // keys de exames relevantes
  instructionSnippets?: string[]; // orientações frequentes
}
```

### Templates previstos (conteúdo a ser preenchido via busca de diretrizes)

| Template | Fonte a verificar |
|----------|------------------|
| HAS — seguimento | Caderno de AB nº 37 / PCDT HAS MS |
| DM2 — seguimento | PCDT DM2 MS (versão mais recente) |
| HAS + DM2 | Combinação das fontes acima |
| Demanda aguda (IVAS) | Protocolo APS MS |
| Saúde mental | Caderno de AB nº 34 MS |
| Preventivo adulto | Guia de Rastreamento MS / SBMFC |
| Puericultura | Caderno de AB nº 33 MS |
| Pré-natal | Caderno de AB nº 32 MS |
| Retorno de exames | (estrutural — sem conteúdo clínico prescrito) |

> **Regra:** conteúdo clínico de cada template só entra após WebSearch da diretriz mais recente. Templates sem conteúdo verificado entram vazios (só estrutura).

### UX

- Botão "Usar template" no topo da página de consulta
- Modal com lista de templates: nome + descrição + fonte
- Seleção aplica o template via `loadState` parcial (não sobrescreve campos já preenchidos que não sejam padrão)
- Badge discreta na consulta indicando qual template foi usado

---

## 4. Snippets / Favoritos pessoais

### Tabela Supabase: `user_snippets`

```sql
create table user_snippets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  category    text not null check (category in ('orientacao', 'prescricao', 'conduta', 'exames')),
  title       text not null,
  body        text not null,
  created_at  timestamptz default now()
);

alter table user_snippets enable row level security;
create policy "own snippets" on user_snippets
  using (user_id = auth.uid());
```

### UX

- Botão "Snippets" (ícone) ao lado dos campos: `prescription`, `patientInstructions`, `requestedExams`, SOAP `plan`
- Abre popover filtrado pela categoria correspondente ao campo
- Clicar em um snippet: append no campo (não substitui o que já foi digitado)
- Gerenciar snippets: acessível em `/conta` ou via modal inline "Salvar como snippet" a partir de qualquer campo

---

## 5. O que NÃO entra neste ciclo

Estas features dependem da entidade Patient estar rodando com dados limpos:

- Pendências do próximo retorno
- Lista de problemas ativos longitudinal
- Checklist clínico por regras
- Modos de saída (resumido / eSUS / detalhado)
- Busca avançada de pacientes

---

## Ordem de implementação sugerida

1. **Migração Supabase** — tabela `patients` + coluna `patient_id` em `consultations`
2. **Patient selection flow** — modal de busca/criação, pré-preenchimento do store
3. **Autosave** — hook + banner de recuperação (independente, pode entrar a qualquer momento)
4. **Templates** — estrutura + JSON vazio + UI (conteúdo clínico preenchido via pesquisa de diretrizes)
5. **Snippets** — tabela + UI inline nos campos

---

## Critérios de conclusão do ciclo

- [ ] Novas consultas sempre têm `patient_id` vinculado
- [ ] Consultas legadas (`patient_id = null`) continuam funcionando no histórico
- [ ] Rascunho recuperado corretamente após fechar sem salvar
- [ ] Pelo menos 3 templates com conteúdo verificado de fonte oficial
- [ ] Snippets criáveis, listáveis e inseríveis nos campos principais
- [ ] RLS ativo em `patients` e `user_snippets`
