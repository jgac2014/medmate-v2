# MedMate — Contexto do Projeto para Claude Code

> Leia este arquivo inteiro antes de escrever qualquer código. Ele é a memória persistente do projeto.

---

## O que é o MedMate

Prontuário eletrônico web para **Médicos de Família e Comunidade (MFC)** na Atenção Primária à Saúde (APS) brasileira. O workflow principal: médico preenche a consulta → sistema gera texto formatado → médico copia para o **eSUS PEC** (sistema do Ministério da Saúde).

**Modelo de negócio**: SaaS com assinatura paga. Trial de 14 dias automático ao criar conta. Médicos usam isso 8h/dia — qualidade visual e performance são diferenciais competitivos, não opcionais.

**Nome "MedMate" é provisório.** Branding centralizado em `src/lib/branding.ts`. Nunca hardcode o nome do produto fora desse arquivo.

---

## Estado Atual do Projeto

### ✅ Implementado e funcionando

- **Autenticação completa**: login, signup, magic link, forgot/reset password (`src/app/(auth)/`)
- **Tela de consulta** (`src/app/(dashboard)/consulta/`): layout 4 colunas, todos os formulários, cálculos automáticos, geração de resumo eSUS
- **Componentes de consulta** (`src/components/consultation/`): todos os componentes da tela principal estão prontos
- **Design system** (`src/components/ui/`): Button, Input, ExamInput, Tag, SectionHeader, Toast, Checkbox, DateInput, Sparkline
- **Estado global** via Zustand (`src/stores/consultation-store.ts`): store único para toda a tela de consulta
- **Cálculos médicos** (`src/lib/calculations/`): IMC, TFG CKD-EPI 2021, FIB-4, RCV Framingham — todos implementados com referências bibliográficas
- **Valores de referência** (`src/lib/reference-values.ts`): flags ok/warn/crit para todos os exames
- **Geração de output** (`src/lib/output-generators/`): resumido (eSUS PEC) e detalhado — dois modos de saída
- **Gerador eSUS** (`src/lib/esus-generator.ts`): gera texto formatado em tempo real a partir do store
- **Regras clínicas** (`src/lib/clinical-rules.ts`): lógica de status clínico por valores
- **Auto-save com debounce** (`src/hooks/useDraftAutosave.ts`): salva rascunho automaticamente
- **Hotkeys** (`src/hooks/useHotkeys.ts`): atalhos de teclado implementados
- **Pagamentos Stripe**: checkout, webhooks, controle de acesso por status de assinatura
- **Rotas de billing**: `/bloqueado`, `/cancelado`, `/sucesso`, `/conta`
- **Middleware de autenticação**: proteção de rotas implementada
- **Database migrations**: tabelas `users`, `patients`, `consultations` com RLS ativo
- **Templates de consulta** (`src/lib/templates.ts`): templates pré-definidos
- **Snippets** (`src/components/consultation/snippet-popover.tsx`): popover de snippets de texto
- **Trend data** (`src/lib/trend-data.ts`): dados de tendência para sparklines
- **Página de conta** (`/conta`): configurações do usuário

### 🚧 Pendente / Incompleto

- Listagem e histórico de pacientes (rota `/pacientes` não existe ainda)
- Busca de consultas anteriores por paciente
- Exportação de prontuário completo em PDF
- Modo claro (só existe dark mode — previsto para v2)
- Testes automatizados (nenhum test file existe ainda)

---

## Antes de Qualquer Tarefa

**Protocolo obrigatório antes de escrever código:**

1. **Leia os arquivos relevantes primeiro.** Nunca assuma que sabe o que está implementado. Use Read ou Grep.
2. **Verifique o store** (`consultation-store.ts`) antes de criar qualquer estado novo — provavelmente já existe.
3. **Verifique `constants.ts`** antes de hardcodar qualquer lista (problemas, prevenções, exames).
4. **Verifique `reference-values.ts`** antes de criar qualquer lógica de flag de valor.
5. **Verifique `calculations/index.ts`** antes de implementar qualquer cálculo médico.
6. **Leia `AGENTS.md`** — contém aviso crítico sobre esta versão do Next.js ter breaking changes.

---

## Tech Stack (já configurado — não altere sem confirmar)

| Tecnologia | Uso | Config |
|---|---|---|
| Next.js 14+ App Router | Framework | `next.config.ts` |
| TypeScript | Tudo. Sem `any`. | `tsconfig.json` |
| Tailwind CSS | Estilo | `postcss.config.mjs` + `globals.css` |
| Radix UI | Componentes acessíveis | via `@radix-ui/*` |
| Lucide React | Ícones | |
| Zustand | State management | `src/stores/` |
| Supabase | Auth + DB + Storage | `src/lib/supabase/` |
| Stripe | Pagamentos | `src/lib/stripe.ts` |
| Zod | Validação de schemas | |
| React Hook Form | Formulários | |

---

## Arquivos Críticos — O que Cada Um Faz

```
src/
  stores/
    consultation-store.ts     — estado global da tela de consulta (Zustand). ÚNICO store.
  lib/
    branding.ts               — nome do produto, tagline, versão. Único lugar para isso.
    constants.ts              — listas: PROBLEMS, PREVENTIONS, exames. Não hardcode em componentes.
    reference-values.ts       — limiares ok/warn/crit para cada campo de exame.
    clinical-rules.ts         — lógica de classificação clínica por valores.
    esus-generator.ts         — gera o texto do eSUS PEC a partir do estado.
    templates.ts              — templates pré-definidos de consulta.
    clipboard.ts              — helper de cópia com fallback para execCommand.
    trend-data.ts             — dados históricos para sparklines.
    calculations/
      imc.ts                  — IMC com classificação OMS.
      tfg.ts                  — TFG CKD-EPI 2021 sem raça (KDIGO 2022).
      fib4.ts                 — FIB-4 (EASL 2023).
      rcv.ts                  — RCV Framingham (Wilson 1998 / SBC 2022).
      index.ts                — exporta todos os cálculos.
    output-generators/
      resumido.ts             — output para eSUS PEC (cópia rápida).
      detalhado.ts            — prontuário completo.
      index.ts                — exporta ambos.
    supabase/
      client.ts               — Supabase client-side.
      server.ts               — Supabase server-side (RSC/Server Actions).
  hooks/
    useDraftAutosave.ts       — auto-save com debounce (300ms).
    useHotkeys.ts             — atalhos de teclado globais.
  types/
    index.ts                  — tipos compartilhados. Consulte antes de criar tipos novos.
```

---

## Estado Global (Zustand)

Toda a tela de consulta usa **um único store**: `useConsultationStore` em `src/stores/consultation-store.ts`.

**Estrutura do estado:**
```ts
patient: PatientInfo          // nome, idade, gênero, raça, data consulta
vitals: Vitals                // PAS, PAD, peso, altura, IMC (calculado), CA, FC, SpO2, temp
problems: string[]            // lista de problemas ativos (toggle)
problemsOther: string         // campo livre de problemas
preventions: string[]         // prevenções em dia (toggle)
labs: Record<string, string>  // exames: chave = nome do campo, valor = string do input
labsDate: string              // data dos exames (ISO)
imaging: ImagingData          // data + texto livre de imagens/outros
calculations: Calculations    // { imc, tfg, fib4, rcv } — gerados automaticamente
soap: SoapNotes               // S, O, A, P
history: History              // pessoais, familiares, hábitos, medicamentos, alergias, comorbidades
prescription: string
requestedExams: string
patientInstructions: string
followupItems: FollowUpItem[]
currentConsultationId: string | null
patientId: string | null
patientName: string | null
```

**Regra**: não crie estado local para dados da consulta. Se falta um campo, adicione ao store.

---

## Design System — "Clinical Linear"

Referência visual: Linear.app adaptado para contexto médico. Dark mode único (v1).

**Tokens CSS** definidos em `src/app/globals.css`. Sempre use as variáveis CSS — nunca valores hardcoded.

```css
/* Backgrounds */
--bg-0: #0c0f1a      /* fundo base */
--bg-1: #131720      /* cards, topbar */
--bg-2: #1a1f2e      /* inputs, hover */
--bg-3: #20263a      /* hover ativo */

/* Texto */
--text-primary: #dde1eb
--text-secondary: #7a8499
--text-tertiary: #424d62

/* Accent */
--accent: #00d084    /* verde — ação primária */

/* Status clínico (cor comunica dado, não é decorativa) */
--status-ok: #00d084    /* valor normal */
--status-warn: #f5a623  /* valor limítrofe */
--status-crit: #ff5252  /* valor crítico */
--status-info: #4b9eff  /* informação neutra */
--status-calc: #22d3ee  /* campos calculados automaticamente */
--status-misc: #9b8af8  /* dados complementares */
```

**Tipografia:**
- `'Inter'` — corpo, labels, navegação
- `'JetBrains Mono'` — valores numéricos, campos calculados, output de texto

**Tamanhos de fonte**: 10px (micro-labels), 11px (campos/tags), 12px (nav/botões), 13px (corpo), 14px (títulos de seção).

**Princípios inegociáveis do design:**
- Animações: 100-150ms em hover/focus. Nada que distraia.
- Zero ruído: sem bordas desnecessárias, sem sombras dramáticas, sem gradientes.
- Cor como dado: nunca use cor para decoração.
- Densidade com clareza: muito dado por tela, mas hierarquia visual impecável.

---

## Banco de Dados (Supabase)

**Tabelas existentes** (via migrations em `migrations/`):
- `users` — médico/usuário, status de assinatura, Stripe customer ID
- `patients` — pacientes vinculados ao médico
- `consultations` — consultas com vitals, labs, SOAP, histórico, cálculos (JSONB)

**RLS ativo em todas as tabelas.** Nunca faça query sem passar pelo client correto (`server.ts` em RSC, `client.ts` em Client Components).

**Nunca altere o schema diretamente.** Crie uma nova migration em `migrations/` com o próximo número sequencial.

**Formato de datas no banco**: ISO 8601 (`YYYY-MM-DD`). Na UI: `DD/MM/AAAA`.

---

## Cálculos Médicos (já implementados)

Todos em `src/lib/calculations/`. Cada arquivo tem a referência bibliográfica no comentário do código.

| Cálculo | Arquivo | Referência |
|---|---|---|
| IMC | `imc.ts` | OMS |
| TFG | `tfg.ts` | CKD-EPI 2021 sem raça — KDIGO 2022 |
| FIB-4 | `fib4.ts` | EASL 2023 |
| RCV | `rcv.ts` | Framingham / Wilson 1998 / SBC 2022 |

**Regra**: se precisar adicionar um cálculo, crie um arquivo novo em `calculations/` com a referência no comentário e exporte em `index.ts`. Nunca calcule inline em componentes.

---

## Padrões de Código Estabelecidos

- **Server Components por padrão.** `'use client'` só quando há interatividade, hooks de estado, ou browser APIs.
- **Naming**: PascalCase para componentes, camelCase para funções/variáveis, kebab-case para arquivos/rotas.
- **Imports**: use `@/` para imports absolutos. Nunca `../../`.
- **Formulários**: React Hook Form + Zod resolver.
- **Validação de dados**: Zod em schemas de formulário e API routes.
- **Erro handling**: error boundaries + toast notifications via `useToast` hook.
- **Clipboard**: sempre use `src/lib/clipboard.ts` — tem fallback para `execCommand`.
- **Datas na UI**: sempre `DD/MM/AAAA`. Nunca ISO na interface.
- **Listas de constantes**: sempre importar de `src/lib/constants.ts`.

---

## Comandos

```bash
npm run dev      # desenvolvimento local
npm run build    # build de produção
npm run start    # rodar build localmente
```

O app roda na porta 3000 por padrão.

---

## Regras Inegociáveis

1. **Datas sempre DD/MM/AAAA em toda UI e output.** No banco, ISO 8601.
2. **Nenhum dado médico sem autenticação.** RLS em tudo. Nunca bypasse middleware.
3. **Cálculos médicos com referência bibliográfica no código.** Sem referência = não implementa.
4. **Prevenções alinhadas com MS/INCA 2024.** Papanicolau (não colposcopia). PSA como decisão compartilhada.
5. **Zero dependência de internet para cálculos.** Toda lógica médica roda no frontend.
6. **Performance na tela de consulta.** Debounce na geração de resumo (300ms). Sem lag ao digitar.
7. **Branding centralizado.** Nome do produto sempre via `branding.ts`, nunca hardcoded.
8. **Schema só via migrations.** Nunca edite o banco diretamente ou via Supabase dashboard sem migration correspondente.
9. **TypeScript estrito.** Sem `any`. Se não souber o tipo, pergunte ou derive.
10. **Não reimplemente o que existe.** Leia os arquivos antes de criar.

---

## O que NÃO Fazer

- Não crie estado local (`useState`) para dados que pertencem ao `consultation-store`.
- Não hardcode listas de problemas, prevenções ou exames — use `constants.ts`.
- Não implemente lógica de cálculo dentro de componentes — use `lib/calculations/`.
- Não altere `api/webhooks/stripe/route.ts` sem confirmar — lógica de billing crítica.
- Não crie nova migration sem verificar o número sequencial correto em `migrations/`.
- Não use cores hardcoded no CSS — use as variáveis CSS do design system.
- Não adicione dependências novas sem verificar se já existe algo equivalente no projeto.
- Não use `console.log` em produção — use o sistema de toast para feedback ao usuário.
- Não assuma que uma feature não existe. Grep antes.
