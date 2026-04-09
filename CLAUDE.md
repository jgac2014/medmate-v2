# MedMate — Contexto do Projeto para Claude Code

> Leia este arquivo inteiro antes de escrever qualquer código. É a fonte de verdade do projeto.
> Última atualização: 08/04/2026
>
> **Plano mestre e histórico de sessões:** `../PLANO.md` — leia primeiro em qualquer nova sessão.

---

## Visão Geral

Prontuário web SaaS para MFC/APS brasileira. Plano completo, roadmap e histórico → `../PLANO.md`.

---

## Stack

| Tecnologia | Versão/Uso |
|---|---|
| Next.js | 14+ App Router — `next.config.ts` |
| TypeScript | Estrito. Sem `any`. — `tsconfig.json` |
| Tailwind CSS | v4 com `@import "tailwindcss"` — `globals.css` |
| Zustand | State management — `src/stores/` |
| Supabase | Auth + DB (Postgres + RLS) — `src/lib/supabase/` |
| Stripe | Pagamentos, webhooks, portal — `src/lib/stripe.ts` |
| Radix UI | Componentes acessíveis |
| Vercel | Deploy — `.vercel/project.json` |

---

## Rotas do App

```
/                          → Landing page (marketing)
/login                     → Autenticação
/signup                    → Cadastro
/forgot-password           → Recuperação de senha
/reset-password            → Redefinição de senha

/(dashboard)               → Layout com Topbar
  /nova-consulta           → Iniciar nova consulta (seleção de paciente/template)
  /consulta                → Tela principal de consulta (layout multi-coluna)
  /historico               → Histórico longitudinal do paciente (timeline 3 colunas)
  /receituario             → Receituário Particular (split-screen WYSIWYG)

/conta                     → Configurações do usuário + billing
/planos                    → Página de planos
/funcionalidades           → Features
/faq                       → FAQ
/seguranca                 → Política de segurança
/politica-de-privacidade   → LGPD
/sucesso                   → Pós-checkout Stripe
/cancelado                 → Cancelamento
/bloqueado                 → Acesso bloqueado (assinatura expirada)
```

---

## Estado Atual — O que está implementado

### Autenticação
- Login, signup, magic link, forgot/reset password (`src/app/(auth)/`)
- Middleware de autenticação com proteção de rotas (`src/lib/supabase/middleware.ts`)

### Tela de Consulta (`/consulta`)
- Layout multi-coluna com sidebar de navegação
- `ConsultationSidebar` — navegação entre seções
- `ConsultationRightPanel` — output e eSUS PEC
- `SoapForm` — notas SOAP
- `VitalsForm` — sinais vitais com cálculos automáticos (IMC, TFG, FIB-4, RCV)
- `ProblemList` — lista de problemas ativos (toggle)
- `PreventionList` — prevenções em dia (toggle)
- `ExamGrid` / `ExamCard` — exames laboratoriais com flags ok/warn/crit
- `ExamUploadButton` / `ExamReviewModal` — upload e leitura de laudos por IA (Vision)
- `ObjectiveDataDrawer` — dados objetivos (exame físico)
- `HistoryForm` — antecedentes pessoais, familiares, hábitos, medicações, alergias
- `FollowupPanel` — pendências da última consulta
- `AlertList` — alertas clínicos contextuais
- `ClinicalSummary` — resumo clínico gerado automaticamente
- `SnippetPopover` — snippets de texto salvos
- `TemplateSelector` — templates de consulta
- `DocumentationChecklist` — checklist de documentação
- `ConsultaConcluídaModal` — confirmação de finalização
- `DraftRecoveryBanner` — recuperação de rascunho

### Nova Consulta (`/nova-consulta`)
- Seleção de paciente
- Seleção de template
- Dashboard do paciente (`PatientDashboard`)

### Histórico (`/historico`)
- Busca de paciente com seleção
- Timeline longitudinal de consultas
- Painel de monitoramento de tendências (sparklines)
- `PatientSidebar` — dados do paciente na lateral

### Receituário (`/receituario`) — **módulo novo**
- Split-screen: editor (520px) + pré-visualização do papel ao vivo
- Busca de medicamentos com navegação por teclado (↑↓ Enter)
- Auto-detecção de tipo de receita (Simples / Controle Especial) por medicamento
- Divisão automática em 2 receituários quando há medicamentos mistos
- Verificação de interações medicamentosas em tempo real (10 pares)
- 8 protocolos clínicos pré-configurados (ITU, amigdalite, sinusite, dor, ansiedade, insônia, HAS, DM2)
- Preview do papel: formato CFM Notificação Branca (controle especial) e Receita Simples
- Painel de personalização (fonte, cor, alinhamento, dados profissionais)
- Tela de envio (impressão, WhatsApp, e-mail)
- Toggle de assinatura digital ICP-Brasil (infra pronta para A1/A3/VIDAS)
- Geração de PDF server-side via pdf-lib (`/api/generate-prescription-pdf`)
- Persistência de prescrições na tabela `prescricoes` (salvo ao baixar PDF)

### Pagamentos
- Checkout Stripe (`/api/create-checkout-session`)
- Portal do cliente (`/api/create-portal-session`)
- Webhooks (`/api/webhooks/stripe`)
- Controle de acesso por `subscription_status`

### Infraestrutura
- Auto-save com debounce (`src/hooks/useDraftAutosave.ts`)
- Hotkeys globais (`src/hooks/useHotkeys.ts`)
- Output generators: resumido (eSUS PEC) e detalhado (`src/lib/output-generators/`)
- Gerador eSUS (`src/lib/esus-generator.ts`)
- Transcrição de exames via IA (`/api/transcribe-exams`)

---

## Arquivos Críticos

```
src/
  stores/
    consultation-store.ts     — estado global da tela de consulta. ÚNICO store de consulta.
    receituario-store.ts      — estado do módulo de receituário. Store separado.

  lib/
    branding.ts               — nome do produto. ÚNICO lugar. Nunca hardcode.
    constants.ts              — listas: PROBLEMS, PREVENTIONS, exames. Não hardcode em componentes.
    reference-values.ts       — limiares ok/warn/crit para cada campo de exame laboratorial.
    clinical-rules.ts         — lógica de classificação clínica por valores.
    esus-generator.ts         — gera o texto do eSUS PEC a partir do store.
    templates.ts              — templates pré-definidos de consulta.
    clipboard.ts              — helper de cópia com fallback para execCommand.
    trend-data.ts             — dados históricos para sparklines no histórico.
    format-objective.ts       — formatação de dados objetivos para o output.

    calculations/             — cálculos médicos. Cada um tem referência bibliográfica no código.
      imc.ts                  — IMC com classificação OMS.
      tfg.ts                  — TFG CKD-EPI 2021 sem raça (KDIGO 2022).
      fib4.ts                 — FIB-4 (EASL 2023).
      rcv.ts                  — RCV Framingham (Wilson 1998 / SBC 2022).
      index.ts                — exporta todos os cálculos.

    output-generators/
      resumido.ts             — output para eSUS PEC.
      detalhado.ts            — prontuário completo.
      index.ts                — exporta ambos.

    receituario/              — data layer do módulo de receituário.
      types.ts                — tipos: Drug, PrescribedDrug, Interaction, DoctorProfile, etc.
      drug-db.ts              — banco de 382 medicamentos com classificação e posologia padrão.
      interactions.ts         — 10 pares de interação com severidade + checkInteractions().
      protocols.ts            — 8 protocolos clínicos pré-configurados.

    supabase/
      client.ts               — Supabase client-side (Client Components).
      server.ts               — Supabase server-side (RSC / Server Actions).
      admin.ts                — Supabase admin (webhooks, operações privilegiadas).
      middleware.ts           — proteção de rotas.
      consultations.ts        — queries de consultas.
      patients.ts             — queries de pacientes.
      patient-problems.ts     — problemas longitudinais do paciente.
      patient-medications.ts  — medicações contínuas do paciente.
      followup.ts             — pendências entre consultas.
      alerts.ts               — alertas clínicos.
      snippets.ts             — snippets de texto do usuário.

  types/
    index.ts                  — tipos compartilhados. Consulte antes de criar tipos novos.
```

---

## Design System — "Aura Clínica"

**Light mode.** Tokens definidos em `src/app/globals.css`. Sempre use variáveis CSS — nunca valores hardcoded.

```css
/* Superfícies (do mais claro para mais escuro) */
--surface-lowest: #ffffff
--surface-low:    #eff4f8
--surface:        #f5fafe
--surface-container: #e9eff2
--surface-high:   #e3e9ec
--surface-highest:#dee3e7
--surface-dim:    #d5dbde

/* Texto */
--on-surface:         #171c1f   /* texto principal */
--on-surface-variant: #414844   /* texto secundário */
--on-surface-muted:   #6d7a6e   /* texto terciário */

/* Primária (verde escuro) */
--primary:              #012d1d
--primary-container:    #1b4332
--on-primary:           #ffffff
--on-primary-container: #86af99

/* Secundária */
--secondary:            #3b6756
--secondary-container:  #bdedd7

/* Bordas */
--outline:         #717973
--outline-variant: #c1c8c2

/* Erro */
--error:           #ba1a1a
--error-container: #ffdad6

/* Status clínico (cor comunica dado, não é decorativa) */
--status-ok:   #1b7a4a   /* valor normal */
--status-warn: #c77a20   /* valor limítrofe */
--status-crit: #ba1a1a   /* valor crítico */
--status-info: #1565c0   /* informação neutra */
--status-calc: #00838f   /* campos calculados */
--status-misc: #6a4fc5   /* dados complementares */
```

**Tipografia:** `Inter` — corpo, labels, navegação. `JetBrains Mono` — valores numéricos, outputs de texto.

**Tamanhos de fonte:** 10px (micro-labels) · 11px (campos/tags) · 12px (nav/botões) · 13px (corpo) · 14px (títulos de seção).

**Princípios inegociáveis:**
- Animações 100-150ms em hover/focus. Nada que distraia durante consulta.
- Zero ruído visual: sem bordas desnecessárias, sem gradientes decorativos.
- Cor como dado clínico: `--status-ok/warn/crit` comunicam estado, não decoração.
- Densidade com clareza: muita informação por tela, hierarquia visual impecável.

---

## Banco de Dados

**Migrations em `supabase/migrations/`** (001–008):
- `001` — tabelas base: `users`, `patients`, `consultations`
- `002` — snapshot do paciente em consultas
- `003` — snippets de texto do usuário
- `004` — itens de follow-up entre consultas
- `005` — problemas longitudinais do paciente
- `006` — medicações contínuas do paciente
- `007` — consentimentos e logs de auditoria
- `008` — prescrições avulsas (Receituário Particular)

**RLS ativo em todas as tabelas.** Use `server.ts` em RSC e `client.ts` em Client Components.

**Para criar nova migration:** arquivo `009_descricao.sql` em `supabase/migrations/`. Nunca pule números.

**Datas:** ISO 8601 no banco (`YYYY-MM-DD`). `DD/MM/AAAA` na UI e outputs.

---

## Estado Global (Zustand)

### `consultation-store.ts` — tela de consulta
```ts
patient: PatientInfo          // nome, idade, gênero, raça, data
vitals: Vitals                // PAS, PAD, peso, altura, IMC, CA, FC, SpO2, temp
problems: string[]            // toggle de problemas ativos
problemsOther: string         // campo livre
preventions: string[]         // toggle de prevenções
labs: Record<string, string>  // chave = campo, valor = string
labsDate: string
imaging: ImagingData
calculations: Calculations    // { imc, tfg, fib4, rcv } — calculados automaticamente
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

**Regra:** não crie `useState` para dados da consulta. Se falta campo, adicione ao store.

### `receituario-store.ts` — receituário
```ts
screen: 'create' | 'send'
meds: PrescribedDrug[]
patient: RxPatient            // nome, CPF, endereço, data
doctor: DoctorProfile         // nome, CRM, especialidade, endereço, tel, cidade
customization: RxCustomization // fontes, cores, alinhamento
useDigitalSignature: boolean
protocolsPanelOpen: boolean
customizePanelOpen: boolean
```

---

## Cálculos Médicos Implementados

Todos em `src/lib/calculations/`. Cada arquivo tem referência bibliográfica no comentário.

| Cálculo | Arquivo | Referência |
|---|---|---|
| IMC | `imc.ts` | OMS |
| TFG | `tfg.ts` | CKD-EPI 2021 sem raça — KDIGO 2022 |
| FIB-4 | `fib4.ts` | EASL 2023 |
| RCV | `rcv.ts` | Framingham / Wilson 1998 / SBC 2022 |

**Regra:** novo cálculo = novo arquivo em `calculations/` com referência + export em `index.ts`. Nunca inline em componente.

---

## Padrões de Código

- **Server Components por padrão.** `'use client'` só quando há interatividade, hooks de estado, ou browser APIs.
- **Naming:** PascalCase para componentes, camelCase para funções/variáveis, kebab-case para arquivos/rotas.
- **Imports:** sempre `@/` para imports absolutos. Nunca `../../`.
- **Clipboard:** sempre `src/lib/clipboard.ts` — tem fallback para `execCommand`.
- **Listas de constantes:** sempre `src/lib/constants.ts`. Nunca hardcode em componente.
- **Hotkeys:** registrar via `src/hooks/useHotkeys.ts`.
- **Toasts:** via `src/components/ui/toast.tsx` (`showToast`).

---

## Regras Inegociáveis

1. **Datas DD/MM/AAAA em toda UI e output.** ISO 8601 no banco.
2. **Nenhum dado médico sem autenticação.** RLS em tudo. Nunca bypasse middleware.
3. **Cálculos médicos com referência bibliográfica no código.** Sem referência = não implementa.
4. **Prevenções alinhadas com MS/INCA 2024.** Papanicolau (não colposcopia). PSA como decisão compartilhada.
5. **Zero dependência de internet para cálculos.** Toda lógica médica roda no frontend.
6. **Performance na tela de consulta.** Debounce na geração de resumo (300ms). Sem lag ao digitar.
7. **Branding centralizado.** Nome do produto sempre via `branding.ts`.
8. **Schema só via migrations numeradas.** Nunca edite banco direto sem migration correspondente.
9. **TypeScript estrito.** Sem `any`. Se não souber o tipo, derive ou pergunte.
10. **Grep antes de criar.** Não reimplemente o que existe.
11. **Stripe webhook handler é crítico.** Nunca modifique `api/webhooks/stripe/route.ts` sem confirmar com o usuário.
12. **Dependências novas:** verifique se já existe equivalente antes de `npm install`.
