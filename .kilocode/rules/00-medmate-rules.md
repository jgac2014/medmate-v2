# MedMate — Regras Obrigatórias (Kilo Code / Qwen)

> **LEIA ISSO INTEIRO ANTES DE QUALQUER AÇÃO.**
> O arquivo completo de contexto do projeto está em `CLAUDE.md` na raiz. Leia-o sempre que precisar de detalhes de arquitetura, banco, design system ou store.

---

## Identidade do projeto

Prontuário eletrônico web SaaS para **Médicos de Família (MFC)** no Brasil.
Fluxo central: médico preenche a consulta → sistema gera texto → médico copia para o **eSUS PEC**.
Produto usado 8h/dia em consulta. Performance e clareza visual são critérios médicos, não estéticos.

---

## Stack (resumo crítico)

- **Next.js 16** App Router — `proxy.ts` para middleware (**nunca `middleware.ts`**)
- **TypeScript estrito** — sem `any`
- **Tailwind 4** — `@import "tailwindcss"` (sintaxe diferente do v3)
- **Zustand 5** — estado global
- **Supabase** — Auth + Postgres + RLS
- **Stripe 20** — pagamentos
- **Radix UI** — primitivos (sem shadcn)
- **Design system "Aura Clínica"** — tokens CSS em `globals.css`, modo claro

---

## Antes de qualquer tarefa — protocolo obrigatório

1. **Leia os arquivos relevantes.** Nunca assuma o que está implementado. Use leitura de arquivo ou busca.
2. **Verifique o store** (`consultation-store.ts`) antes de criar qualquer `useState` para dados de consulta.
3. **Verifique `constants.ts`** antes de hardcodar qualquer lista (problemas, prevenções, exames).
4. **Verifique `reference-values.ts`** antes de criar lógica de flags de exame.
5. **Verifique `calculations/index.ts`** antes de implementar qualquer cálculo médico.
6. **Busque antes de criar.** Não reimplemente o que já existe.

---

## Regras absolutas

| # | Regra |
|---|---|
| 1 | Datas `DD/MM/AAAA` na UI e outputs. ISO 8601 no banco. |
| 2 | Nunca crie `middleware.ts` — o projeto usa `proxy.ts` (Next.js 16). |
| 3 | Nunca use `any` no TypeScript. |
| 4 | Nunca hardcode o nome do produto — use `src/lib/branding.ts`. |
| 5 | Nunca hardcode listas de problemas/prevenções/exames — use `constants.ts`. |
| 6 | Cálculos médicos em `src/lib/calculations/` com referência bibliográfica. Nunca inline em componente. |
| 7 | Conteúdo clínico **sempre com fonte oficial brasileira** (MS, CFM, SBC, SBMFC, INCA, etc.). Nunca invente ou aproxime valores clínicos. |
| 8 | RLS ativo em todas as tabelas. Nunca bypasse autenticação. |
| 9 | Cores sempre via variáveis CSS do design system. Nunca valores hardcoded. |
| 10 | Migrations numeradas sequencialmente em `supabase/migrations/`. Nunca pule número. |
| 11 | Imports sempre com `@/`. Nunca `../../`. |
| 12 | Clipboard sempre via `src/lib/clipboard.ts`. |
| 13 | Não use `console.log` em produção. Use `showToast` para feedback. |
| 14 | `'use client'` só quando há interatividade real, hooks de estado ou browser APIs. |
| 15 | Não altere `api/webhooks/stripe/` sem confirmação explícita — lógica de billing crítica. |

---

## Design system (tokens principais)

Definidos em `src/app/globals.css`. Sempre use as variáveis — nunca valores hex diretos.

```
Superfícies:    --surface-lowest / --surface-low / --surface / --surface-container / --surface-high
Texto:          --on-surface / --on-surface-variant / --on-surface-muted
Primária:       --primary / --primary-container / --on-primary
Bordas:         --outline / --outline-variant
Erro:           --error / --error-container
Status clínico: --status-ok / --status-warn / --status-crit / --status-info / --status-calc / --status-misc
```

Fontes: `Inter` (texto) · `JetBrains Mono` (números e outputs de texto clínico)
Tamanhos: 10px (micro-labels) · 11px (campos/tags) · 12px (nav/botões) · 13px (corpo) · 14px (títulos de seção)
Animações: 100-150ms em hover/focus. Nada além disso.

---

## Stores Zustand

### `consultation-store.ts` — todos os dados da consulta atual
Campos: `patient`, `vitals`, `problems`, `preventions`, `labs`, `soap`, `history`, `prescription`, `requestedExams`, `patientInstructions`, `followupItems`, `patientId`, `patientName`, `currentConsultationId`

**Regra:** se falta um campo, adicione ao store. Nunca crie `useState` para dados da consulta.

### `receituario-store.ts` — módulo de receituário
Campos: `screen`, `meds`, `patient`, `doctor`, `customization`, `useDigitalSignature`, `protocolsPanelOpen`, `customizePanelOpen`

---

## Estrutura de arquivos (referência rápida)

```
src/
  app/(auth)/          — login, signup, forgot/reset-password
  app/(dashboard)/     — consulta, historico, nova-consulta, receituario, pedidos, conta
  app/api/             — transcribe-exams, stripe webhooks
  components/
    consultation/      — 22 componentes da tela de consulta
    historico/         — HistoricoShell, PatientSidebar, HistoryTimeline, MonitoringPanel
    receituario/       — PrescricaoShell, DrugSearch, DrugList, ProtocolsPanel, PreviewPanel, SendScreen, CustomizePanel
    pedidos/           — PedidosShell, ExamSearch, CategoryBrowser
    layout/            — topbar, nav
    ui/                — primitivos do design system
  stores/              — consultation-store.ts, receituario-store.ts
  lib/
    branding.ts        — nome do produto (único lugar)
    constants.ts       — listas de problemas, prevenções, exames
    reference-values.ts — limites ok/warn/crit dos exames
    clinical-rules.ts  — regras clínicas com fontes oficiais
    templates.ts       — 6 templates clínicos (HAS, DM2, HAS+DM2, Dislipidemia, Hipotireoidismo, Asma/DPOC)
    calculations/      — imc.ts, tfg.ts, fib4.ts, rcv.ts
    output-generators/ — resumido.ts, detalhado.ts
    esus-generator.ts  — gerador de texto eSUS PEC
    supabase/          — client.ts, server.ts, admin.ts + queries por entidade
    receituario/       — types.ts, drug-db.ts, interactions.ts, protocols.ts
  types/index.ts       — todos os tipos compartilhados
  proxy.ts             — middleware de autenticação e gating de assinatura
```

---

## Banco de dados (tabelas existentes)

- `patients` — id, user_id, name, birth_date, gender, race, cpf, phone, notes
- `consultations` — id, user_id, patient_id (FK → patients CASCADE), soap, vitals, labs, followup_items, created_at
- `patient_problems` — id, patient_id, user_id, problem_text, active, created_at, resolved_at
- `patient_medications` — id, patient_id, user_id, medication_name, dosage, active, created_at, discontinued_at
- `user_snippets` — id, user_id, section, content, created_at

Migrations em `supabase/migrations/` (001–006). Próxima: `007_...sql`.

---

## O que NÃO fazer

- Não crie `middleware.ts` (Next.js 16 usa `proxy.ts`)
- Não use shadcn — componentes são próprios
- Não use `useState` para dados da consulta — use o store
- Não hardcode listas clínicas — use `constants.ts`
- Não implemente cálculo médico em componente — use `lib/calculations/`
- Não invente valores clínicos sem fonte oficial
- Não altere schema do banco sem migration numerada
- Não use cores hardcoded — use variáveis CSS do design system
- Não modifique `api/webhooks/stripe/` sem confirmação explícita
- Não faça alterações fora do escopo da tarefa pedida

---

*Para contexto completo de arquitetura, histórico de ciclos e status detalhado: leia `CLAUDE.md` na raiz do projeto.*
