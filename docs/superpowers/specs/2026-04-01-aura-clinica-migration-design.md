# Design Spec: Migração Visual Aura Clínica (Light Mode)

**Data:** 2026-04-01  
**Projeto:** MedMate  
**Escopo:** Migração completa do design system dark mode ("Clinical Linear") para light mode ("Aura Clínica"), redesign de todas as páginas de marketing e das telas internas do app.  
**Referência visual:** Stitch project `3605850038575247794` — arquivos exportados em `stitch-exports/`

---

## Contexto e Motivação

O app atual usa um design system dark ("Clinical Linear") baseado em Linear.app. O Stitch gerou um novo sistema visual chamado **Aura Clínica** — light mode, paleta Forest to Sage, tipografia editorial (Newsreader + Public Sans). O objetivo é substituir o visual por completo, sem alterar nenhuma lógica de negócio, cálculos clínicos, ou integrações (Supabase, Stripe).

---

## Abordagem: Design System First (Opção C)

A migração é feita em 3 fases sequenciais:

1. **Fase 1 — Fundação** (design system + componentes UI)
2. **Fase 2 — Marketing** (4 páginas públicas)
3. **Fase 3 — App Interno** (tela de consulta + 2 novas telas)

Fases são independentes em termos de deploy — cada uma pode ir para produção separadamente.

---

## Fase 1 — Fundação: Design System Aura Clínica

### 1.1 Tokens CSS (`src/app/globals.css`)

Substituir os tokens dark atuais pelos tokens Aura Clínica. Os tokens novos espelham a nomenclatura do Stitch para facilitar manutenção:

```css
:root {
  /* Superfícies */
  --surface:              #f5fafe;   /* fundo base do app */
  --surface-low:          #eff4f8;   /* seções secundárias, sidebar */
  --surface-container:    #e9eff2;   /* cards padrão */
  --surface-high:         #e3e9ec;   /* hover states */
  --surface-highest:      #dee3e7;   /* modais, dropdowns */
  --surface-lowest:       #ffffff;   /* cards de maior prioridade (lift) */
  --surface-dim:          #d5dbde;

  /* Texto */
  --on-surface:           #171c1f;   /* texto primário */
  --on-surface-variant:   #414844;   /* texto secundário */

  /* Primária */
  --primary:              #012d1d;
  --primary-container:    #1b4332;
  --on-primary:           #ffffff;
  --on-primary-container: #86af99;

  /* Secundária */
  --secondary:            #3b6756;
  --secondary-container:  #bdedd7;
  --on-secondary:         #ffffff;
  --on-secondary-container: #416d5c;

  /* Bordas */
  --outline:              #717973;
  --outline-variant:      #c1c8c2;

  /* Estado de erro */
  --error:                #ba1a1a;
  --error-container:      #ffdad6;
  --on-error-container:   #93000a;

  /* Status clínico — mantidos funcionalmente, ajustados para light mode */
  --status-ok:            #1b7a4a;
  --status-warn:          #c77a20;
  --status-crit:          #ba1a1a;
  --status-info:          #1565c0;
  --status-calc:          #00838f;
  --status-misc:          #6a4fc5;

  --status-ok-bg:         rgba(27, 122, 74, 0.08);
  --status-warn-bg:       rgba(199, 122, 32, 0.08);
  --status-crit-bg:       rgba(186, 26, 26, 0.08);
  --status-info-bg:       rgba(21, 101, 192, 0.08);
  --status-calc-bg:       rgba(0, 131, 143, 0.08);
  --status-misc-bg:       rgba(106, 79, 197, 0.08);
}
```

**Regra "No-Line":** bordas 1px sólidas são proibidas para separação de seções. Usar apenas background shifts e espaçamento. Se necessário por acessibilidade: `outline-variant` a 20% de opacidade.

### 1.2 Tipografia (`src/app/layout.tsx`)

Adicionar via `next/font/google`:
- `Newsreader` — pesos 400, 500, 600, 700 (regular + italic) — headlines, nomes de pacientes, títulos de seção
- `Public Sans` — pesos 300, 400, 500, 600, 700 — corpo, labels, UI
- `JetBrains Mono` — mantida para valores numéricos e output eSUS

Aplicar no `<html>`: `font-family: 'Public Sans', sans-serif`. Headlines usam `font-family: 'Newsreader', serif` via classe utilitária `font-headline`.

Escala tipográfica:
- `text-headline-lg`: 2rem, Newsreader Medium
- `text-title`: 1rem, Public Sans
- `text-body`: 0.875rem, Public Sans
- `text-label`: 0.75rem, Public Sans (uppercase + tracking para metadata)

### 1.3 Tailwind Config (`tailwind.config.ts`)

Extender `theme.colors` com aliases Aura Clínica e `theme.fontFamily` com `headline: ['Newsreader']`.

### 1.4 Componentes UI (`src/components/ui/`)

Cada componente é atualizado para os novos tokens. Nenhuma lógica muda — só classes CSS.

| Componente | Mudanças principais |
|---|---|
| `Button` | Primary: `bg-[--primary]` + texto branco. Secondary: `bg-[--surface-highest]`. Radius 8px. |
| `Input` | Sem borda full — só bottom stroke `outline-variant` a 40%. Focus: `primary` 2px. |
| `Tag` / chips | Medicações: `bg-[--secondary-container]` + `text-[--on-secondary-container]`. |
| `SectionHeader` | Newsreader serif para headers de seção clínica. |
| `Toast` | Fundo `--surface-highest` com backdrop-blur para toasts flutuantes. |
| `Checkbox` | Accent `--primary`. |
| `Sparkline` | Traço em `--secondary` (sage green). |
| `DateInput` | Segue padrão Input — bottom stroke only. |
| `ExamInput` | Flags ok/warn/crit mantidas, cores ajustadas para light mode. |

---

## Fase 2 — Marketing: Páginas Públicas

Referência: arquivos `stitch-exports/html/01_homepage.html`, `02_funcionalidades.html`, `04_planos.html`, `05_seguranca.html`.

Todas as páginas públicas compartilham `LandingNavbar` e `LandingFooter` atualizados (fundo `--surface-low`, sem bordas, logo + nav em `--on-surface`).

### 2.1 Homepage (`src/app/page.tsx`)

Seções (em ordem):
1. **Hero** — headline Newsreader grande, subtítulo Public Sans, CTA "Começar gratuitamente" (botão primary) + "Ver funcionalidades" (botão secondary). Fundo `--surface`.
2. **Pain Points** — 3 cards em grid, fundo `--surface-low`, ícones thin-stroke (Material Symbols Outlined). Separação por espaço, sem bordas.
3. **Features Preview** — grid 2x3 de funcionalidades com título Newsreader e descrição Public Sans. Fundo `--surface`.
4. **Credibilidade / Fluxo** — seção sobre workflow MedMate + eSUS PEC com steps numerados.
5. **CTA Final** — fundo `--primary-container`, headline Newsreader branco, botão `--surface-lowest`.

### 2.2 Funcionalidades (`src/app/funcionalidades/page.tsx`)

Seções:
1. **Hero** — título + subtítulo, sem hero image.
2. **Grid de features** — 6 features do produto com ícone, título Newsreader, descrição e detalhe expandível. Ícones: Material Symbols Outlined (thin-stroke).
3. **Fluxo Step-by-Step** — 4 passos numerados (01–04) do workflow MedMate.
4. **CTA** — botão para /planos.

Conteúdo textual atual (pain points, features) é preservado — só o layout e visual mudam.

### 2.3 Planos (`src/app/planos/page.tsx`)

Seções:
1. **Header** — título + subtítulo.
2. **Cards de plano** — layout side-by-side: Gratuito (trial 14 dias) e Pro (R$49/mês). Fundo dos cards: `--surface-lowest` sobre `--surface-low`. Destaque no card Pro com borda `--primary` a 40% de opacidade.
3. **Tabela de comparação** — features listadas com checkmarks. Sem linhas separadoras — background shift entre linhas pares/ímpares.
4. **CheckoutButton** — componente existente mantido, só estilo atualizado.

### 2.4 Segurança (`src/app/seguranca/page.tsx`)

Seções:
1. **Hero** — "Seus dados protegidos por padrão".
2. **4 blocos de segurança** — LGPD, criptografia em trânsito, isolamento por médico, backups. Cada bloco: ícone escudo + título Newsreader + texto Public Sans largo.
3. **Nota técnica** — RLS Supabase, sem acesso cruzado entre médicos.

---

## Fase 3 — App Interno

Referência: `stitch-exports/html/06_copiloto.html`, `07_conclusao.html`, `08_iniciar_consulta.html`.

**Princípio:** zero mudança em lógica, store, cálculos, geração de output. Apenas visual e layout.

### 3a — Iniciar Consulta: Fricção Zero

**O que é:** Redesign do componente `PatientSelector` (`src/components/consultation/patient-selector.tsx`).

Layout do Stitch:
- Modal/overlay centralizado, fundo `--surface-lowest`, sombra ambiente (on-surface 4% opacidade, blur 32px).
- Campo de busca prominente no topo, sem label — placeholder "Buscar paciente por nome ou CPF".
- Lista de pacientes recentes abaixo (últimos 5), cada item: nome em `--on-surface`, subtítulo (última consulta) em `--on-surface-variant`.
- Botão "Nova consulta" como ação secundária (text-only em `--secondary`).
- Fechar com `Esc` — comportamento existente mantido.

### 3b — Copiloto Clínico Ativo: Redesign da Tela de Consulta

**O que é:** Redesign visual do layout `src/app/(dashboard)/consulta/page.tsx` e todos os componentes filhos em `src/components/consultation/`.

Layout geral (estrutura de 4 colunas mantida):
- **Topbar** (`topbar.tsx`): fundo `--surface-low`, logo à esquerda, nome do paciente em Newsreader italic ao centro, ações à direita. Sem bordas — separação por background shift.
- **Coluna 1 — Paciente/Vitais**: cards em `--surface-lowest` sobre fundo `--surface-low`. Vitais agrupados por espaçamento (sem linhas). IMC/TFG calculados em `--status-calc` preservado.
- **Coluna 2 — Contexto Clínico**: problemas, prevenções, exames. SectionHeaders em Newsreader. ExamInputs com bottom stroke.
- **Coluna 3 — SOAP**: área de texto em `--surface-lowest`, headline "Raciocínio clínico" em Newsreader italic, campos S/O/A/P com espaçamento generoso.
- **Coluna 4 — Output**: "Resumo pronto para o eSUS" em Newsreader, chips de medicação em `--secondary-container`, botão copiar em `--primary`. Modos de output (resumido/detalhado/eSUS) como tabs discretas.

Todos os componentes de consulta são atualizados para os novos tokens. Nenhum prop, nenhuma lógica de store, nenhum cálculo é alterado.

### 3c — Conclusão & Satisfação Clínica

**O que é:** Tela nova exibida após "Finalizar Atendimento".

**Rota:** Modal fullscreen sobre `/consulta` (sem nova rota). Razão: o store Zustand ainda está populado nesse momento — exibir os dados do resumo sem precisar de passagem de estado via URL ou query param. O modal abre automaticamente após o save com sucesso, e fecha ao clicar em "Nova consulta" (que chama `store.reset()`).

Seções:
1. **Header**: "Pronto para o eSUS" em Newsreader 4xl, subtítulo com nome do paciente.
2. **Resumo eSUS**: texto gerado pelo `esus-generator.ts` exibido em caixa `--surface-lowest`, fonte JetBrains Mono.
3. **Botão CTA**: "Copiar para o eSUS PEC" — usa `clipboard.ts` existente.
4. **Micro-feedback** (opcional): campo de satisfação do médico — rating 1–5 ou campo livre. Pode ser implementado como componente simples sem integração com banco na v1.
5. **Ações secundárias**: "Nova consulta" (limpa store + volta ao início) e "Ver histórico".

---

## O que NÃO muda em nenhuma fase

- `consultation-store.ts` — zero alteração
- `src/lib/calculations/` — zero alteração
- `src/lib/esus-generator.ts` — zero alteração
- `src/lib/output-generators/` — zero alteração
- `src/lib/clinical-rules.ts` — zero alteração
- `src/lib/constants.ts` — zero alteração
- `src/lib/templates.ts` — zero alteração
- `migrations/` — zero alteração (sem mudança de schema)
- `api/webhooks/stripe/` — zero alteração
- `proxy.ts` / middleware — zero alteração

---

## Dependências entre Fases

```
Fase 1 (Design System) → Fase 2 (Marketing)
                       ↘ Fase 3 (App Interno)
```

- Fase 2 e Fase 3 dependem da Fase 1 — só começam após a fundação concluída
- Fase 2 e Fase 3 são **independentes entre si** — podem ser desenvolvidas em paralelo ou em sequência, conforme capacidade

---

## Arquivos com maior impacto (por fase)

**Fase 1:**
- `src/app/globals.css`
- `src/app/layout.tsx`
- `tailwind.config.ts`
- `src/components/ui/` (todos os arquivos)

**Fase 2:**
- `src/app/page.tsx`
- `src/app/funcionalidades/page.tsx`
- `src/app/planos/page.tsx`
- `src/app/seguranca/page.tsx`
- `src/components/landing/navbar.tsx`
- `src/components/landing/footer.tsx`

**Fase 3:**
- `src/app/(dashboard)/consulta/page.tsx`
- `src/components/consultation/` (todos os componentes)
- `src/components/consultation/patient-selector.tsx`
- `src/app/(dashboard)/consulta/concluida/page.tsx` (novo)
- `src/components/layout/topbar.tsx`

---

## Critérios de sucesso

1. App inteiro roda em light mode — nenhum token dark restante
2. Todas as 4 páginas de marketing correspondem visualmente ao HTML do Stitch
3. Tela de consulta usa Aura Clínica mas mantém todas as funcionalidades existentes sem regressão
4. `PatientSelector` abre com o novo layout fricção-zero
5. Tela de conclusão exibe o resumo eSUS e permite cópia com um clique
6. `npm run build` passa sem erros TypeScript
