# MedMate — Prompt para Claude Code

> Cole este prompt inteiro no Claude Code como instrução inicial do projeto.
> Ele serve como CLAUDE.md do repositório e como briefing de construção.

---

## Contexto

Você vai construir o **MedMate** — um prontuário eletrônico web para médicos de família e comunidade (MFC) no Brasil, otimizado para uso com o eSUS PEC (sistema do SUS).

**Objetivo de negócio**: produto SaaS com assinatura paga. Trial de 14 dias, depois obrigatório assinar. Precisa ter UX nível profissional — a qualidade visual é um diferencial competitivo. Médicos vão usar isso 8h/dia; tem que ser denso em dados mas nunca confuso.

**Nome**: "MedMate" é provisório. Use-o durante o desenvolvimento, mas a arquitetura deve permitir trocar nome/logo facilmente (variáveis de branding centralizadas).

**Público**: Médicos de Família e Comunidade (MFC) atuando na Atenção Primária à Saúde (APS) brasileira. Usam o eSUS PEC do Ministério da Saúde. O workflow principal é: preencher dados da consulta → gerar texto formatado → colar no eSUS PEC.

---

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **UI**: Tailwind CSS + Radix UI (primitivos acessíveis) + Lucide Icons
- **State**: Zustand (leve, sem boilerplate)
- **Backend/Auth/DB**: Supabase (PostgreSQL + Auth + Row Level Security)
- **Pagamentos**: Stripe (checkout sessions + webhooks para gerenciar assinaturas)
- **Deploy**: Vercel
- **Linguagem**: TypeScript em tudo. Sem `any`.

---

## Design System — Estética "Clinical Linear"

Referência visual principal: **Linear.app**. Adaptar para contexto médico.

### Princípios
1. **Densidade com clareza** — muita informação por tela, mas com hierarquia visual impecável
2. **Cor como dado** — cor comunica status clínico (normal/alerta/crítico), nunca é decorativa
3. **Tipografia precisa** — monospace para valores numéricos, sans-serif para texto
4. **Zero ruído** — sem bordas desnecessárias, sem sombras dramáticas, sem gradientes. Profundidade via background layers
5. **Animações mínimas** — transições de 100-150ms em hover/focus. Nada que distraia

### Paleta (Dark Mode — único tema na v1)

```
Background layers:
  --bg-0: #0c0f1a        (fundo base)
  --bg-1: #131720        (cards, topbar)
  --bg-2: #1a1f2e        (inputs, hover)
  --bg-3: #20263a        (hover ativo)

Borders:
  --border-subtle: #252d40
  --border-default: #344060
  --border-focus: var(--accent)

Text:
  --text-primary: #dde1eb
  --text-secondary: #7a8499
  --text-tertiary: #424d62

Accent (principal):
  --accent: #00d084       (verde — ação primária)
  --accent-hover: #00b870
  --accent-dim: rgba(0,208,132,0.07)

Semânticas (status clínico):
  --status-ok: #00d084     verde — valor normal
  --status-warn: #f5a623   âmbar — valor limítrofe
  --status-crit: #ff5252   vermelho — valor crítico
  --status-info: #4b9eff   azul — informação neutra
  --status-calc: #22d3ee   ciano — campos calculados automaticamente
  --status-misc: #9b8af8   roxo — dados complementares
```

Cada cor semântica tem variante `dim` (7% opacidade) para backgrounds de status:
```
--status-ok-bg: rgba(0,208,132,0.07)
--status-warn-bg: rgba(245,166,35,0.07)
--status-crit-bg: rgba(255,82,82,0.07)
```

### Tipografia
- **Sans**: `'Inter'` (corpo, labels, navegação) — weight 400/500/600
- **Mono**: `'JetBrains Mono'` (valores numéricos, campos calculados, output de texto)
- **Scale**: 10px (micro-labels) / 11px (campos, tags) / 12px (nav, botões) / 13px (corpo) / 14px (títulos de seção)

### Componentes-chave

**Section Header**: barra vertical colorida (3×14px, border-radius 2px) + label uppercase 10px letter-spacing 0.09em + linha divisória sutil
```
[|] IDENTIFICAÇÃO
─────────────────
```

**Input**: height 30px, bg-2, border-subtle, focus ring com accent 10% opacity. Readonly: bg com status-calc 5%, borda ciano 20%, texto ciano, fonte mono

**Exam Input (compacto)**: height 22px, width 58px, text-align right, font mono 10px. Classes de status (.ok/.warn/.crit) aplicam borda + texto + background tintado

**Tag/Pill**: border-radius 20px, padding 2px 8px, font 10.5px, peso 500. Variantes por status (ok/warn/crit/info)

**Nav (topbar)**: itens com border-bottom 2px transparent, ativo = borda accent. SEM bullets, SEM background. Transição suave

**Botão primário**: bg accent, texto #000, font-weight 700, hover com box-shadow glow 25% opacity

**Toast**: posição fixed bottom-right, bg-3, borda accent quando sucesso, transição de slide-up + fade

---

## Arquitetura de Dados (Supabase/PostgreSQL)

### Tabelas principais

```sql
-- Médico/usuário
users (
  id uuid PK (= auth.uid()),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  crm text,            -- registro profissional
  specialty text DEFAULT 'MFC',
  subscription_status text DEFAULT 'trial',  -- trial | active | expired | cancelled
  trial_ends_at timestamptz,
  stripe_customer_id text,
  created_at timestamptz DEFAULT now()
)

-- Pacientes
patients (
  id uuid PK DEFAULT gen_random_uuid(),
  user_id uuid FK → users(id) NOT NULL,
  name text NOT NULL,
  birth_date date,
  gender text,          -- Masculino | Feminino | Outro
  race text,            -- Branco | Pardo | Preto | Amarelo | Indígena
  cpf text,             -- opcional, criptografado
  phone text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)

-- Consultas
consultations (
  id uuid PK DEFAULT gen_random_uuid(),
  patient_id uuid FK → patients(id) NOT NULL,
  user_id uuid FK → users(id) NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,

  -- Exame físico (JSONB compacto)
  vitals jsonb,
  -- { pas, pad, peso, altura, imc, ca_abd, fc, spo2, temp }

  -- Lista de problemas ativos (array de strings)
  problems text[],
  problems_other text,

  -- Exames complementares (JSONB por categoria)
  labs jsonb,
  -- { lipidograma: {ct, hdl, ldl, trig, nao_hdl}, renal: {cr, ur, au, rac}, ... }
  labs_date date,

  -- Imagens e outros exames
  imaging jsonb,
  -- { date, entries: ["ECG: ritmo sinusal", "USG abd: esteatose"] }

  -- Cálculos automáticos (gerados no frontend, salvos para histórico)
  calculations jsonb,
  -- { imc: {value, classification}, tfg: {value, stage}, fib4: {value, risk}, rcv: {value, risk} }

  -- SOAP
  subjective text,
  objective text,
  assessment text,
  plan text,

  -- Antecedentes
  history jsonb,
  -- { personal, family, habits, medications, allergies, comorbidities }

  -- Prevenções em dia (array de strings)
  preventions text[],

  -- Prescrição, exames solicitados, orientações
  prescription text,
  requested_exams text,
  patient_instructions text,

  -- Texto gerado para eSUS PEC
  esus_summary text,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)
```

### Row Level Security
Toda tabela com `user_id` precisa de RLS:
```sql
CREATE POLICY "users_own_data" ON patients
  FOR ALL USING (user_id = auth.uid());
-- Mesma lógica para consultations
```

---

## Features — MVP (v1)

### 1. Autenticação
- Login com email/senha (Supabase Auth)
- Magic link como opção
- Trial automático de 14 dias ao criar conta
- Redirect para página de pagamento quando trial expira

### 2. Tela de Consulta (core — 80% do produto)

Layout: 4 colunas em tela wide (≥1440px), colapsa para 2 colunas + tabs em telas menores.

**Coluna 1 — Identificação + Exame Físico**:
- Dados do paciente (nome, idade, gênero, raça, data consulta)
- Lista de problemas: checkboxes para os mais comuns na APS + campo "Outros"
  - HAS, DM2, Tabagismo, Obesidade, DHGNA, DRC, Hipotireoidismo, Dislipidemia, Ansiedade/Depressão, Asma/DPOC, ICC, Fibrilação Atrial, Gota
- Exame físico: PAS, PAD, Peso, Altura, IMC (AUTO), C.Abd, FC, SpO2, Temperatura
- Prevenções (checkboxes conforme MS/INCA 2024):
  - Mamografia em dia
  - Papanicolau em dia (NÃO "colposcopia" — colposcopia é exame confirmatório)
  - Colonoscopia / PSOF em dia
  - Densitometria em dia
  - Influenza (vacinado)
  - COVID-19 (vacinado)
  - HPV (vacinado)
  - HIV (testado)
  - Hepatite C (anti-HCV)
  - Hepatite B (anti-HBs)
  - PSA (disc. compartilhada) — INCA não recomenda rastreamento rotineiro

**Coluna 2 — Exames Complementares**:
Grid 3×N de cards compactos. Cada card tem título e lista de campos numéricos com flags automáticas de cor (ok/warn/crit).

Cards:
- Lipidograma (CT, HDL, LDL, Triglicérides, Não-HDL)
- Perfil Renal (Creatinina, Ureia, Ác.Úrico, TFG AUTO, R.A/C)
- Perfil Hepático (AST/TGO, ALT/TGP, GamaGT, Fosf.Alc., Bilirrubina T.)
- Perfil Glicêmico (Glicemia J., HbA1c, Insulina, HOMA-IR, Pept.C)
- Eletrólitos (K, Na, Ca, Mg, Fósforo)
- Vitaminas (Vit.D, Vit.B12, Folato, Zinco)
- Hemograma (Hb, Ht, VCM, Leucócitos, Plaquetas)
- Tireoide (TSH, T4L, T3L, Anti-TPO, Anti-TG)
- Cinética do Ferro (Ferritina, Ferro sérico, Transferrina, Saturação, CTLF)
- Inflamatórios (PCR, VHS, EAS, PSOF, PSA)
- Cálculos Automáticos (FIB-4, TFG CKD-EPI, RCV Framingham) — card especial, span 2 colunas
- Outros/Imagens (campo de data próprio + textarea livre)

Data dos exames: campo de data no topo da coluna (DD/MM/AAAA — formato brasileiro em todo o app). Outros/Imagens tem campo de data separado.

**Coluna 3 — Resumo Clínico + SOAP + Antecedentes**:
- Tags automáticas agrupadas: Paciente, Vitais, Problemas ativos, Exames alterados, Cálculos, Prevenções em dia
- SOAP: S (subjetivo), O (objetivo), A (avaliação/hipótese), P (plano)
- Antecedentes: Pessoais, Familiares, Hábitos de vida, Medicamentos em uso, Alergias, MUC/Morbidades

**Coluna 4 — Output**:
- Resumo para Copiar — eSUS PEC: texto gerado automaticamente em tempo real a partir de todos os campos preenchidos. Botão "Copiar" com feedback visual
- Editor livre: contenteditable com toolbar básica (B/I/U/listas)
- Botão "Gerar prontuário completo" (consolida tudo no editor)
- Prescrição: textarea
- Exames a Solicitar: textarea
- Orientações ao Paciente: textarea

### 3. Cálculos Médicos Automáticos

Implementar com fórmulas exatas e referências:

**IMC** — OMS:
```
IMC = peso / (altura_m)²
<18.5 Baixo peso | 18.5-24.9 Eutrófico | 25-29.9 Sobrepeso | 30-34.9 Obesidade I | 35-39.9 Obesidade II | ≥40 Obesidade III
```

**TFG — CKD-EPI 2021 sem raça** (KDIGO 2022 / MS-DRC 2022):
```
κ = 0.7 (F) ou 0.9 (M)
α = -0.241 (F) ou -0.302 (M)
Se Cr/κ ≤ 1: TFG = 142 × (Cr/κ)^α × 0.9938^idade × (1.012 se F)
Se Cr/κ > 1: TFG = 142 × (Cr/κ)^-1.200 × 0.9938^idade × (1.012 se F)

Estadiamento: G1 ≥90 | G2 60-89 | G3a 45-59 | G3b 30-44 | G4 15-29 | G5 <15
```

**FIB-4** — EASL 2023 / Nota Técnica MS-DHGNA:
```
FIB-4 = (Idade × AST) / (Plaquetas_mil × √ALT)
<1.30 Baixo risco (F0-F2) | 1.30-2.67 Indeterminado | >2.67 Alto risco (F3-F4)
```

**RCV Framingham** — Diretriz SBC 2022 / MS-DCNT 2022 (Wilson PW et al. Circulation 1998):
```
Modelo logarítmico com coeficientes por sexo.
Inputs: idade (30-74), PAS, CT, HDL, tabagismo (bool), DM (bool), HAS tratada (bool)

Masculino:
s = 3.06117×ln(idade) + 1.12370×ln(CT) - 0.93263×ln(HDL) + (HAS?1.99881:1.93303)×ln(PAS) + (tabag?0.65451:0) + (DM?0.57367:0) - 23.9802
score = 1 - 0.9402^exp(s)

Feminino:
s = 2.32888×ln(idade) + 1.20904×ln(CT) - 0.70833×ln(HDL) + (HAS?2.82263:2.76157)×ln(PAS) + (tabag?0.52873:0) + (DM?0.69154:0) - 26.1931
score = 1 - 0.9669^exp(s)

<10% Baixo | 10-20% Intermediário | ≥20% Alto
```

### 4. Flags de Valores de Referência

Cada campo de exame tem limiares para classificação automática por cor. Implementar com um mapa de configuração:

```ts
type RefRule = {
  type: 'above' | 'below' | 'range';
  warn: number;
  crit: number;
  // Para 'range': warnLow, warnHigh
}

// Exemplos:
{ ct: { type: 'above', warn: 200, crit: 240 } }
{ hdl: { type: 'below', warn: 40, crit: 35 } }
{ k: { type: 'range', warnLow: 3.5, warnHigh: 5.0 } }
```

Regras com dependência de sexo:
- Hb: homem warn <13, crit <11 | mulher warn <12, crit <10
- Ferritina: homem crit <30 | mulher crit <13
- Vit D: <30 warn, <20 crit (MS Nota Técnica)

### 5. Geração do Resumo eSUS PEC

O texto de resumo é gerado em tempo real a partir de todos os campos. Estrutura:

```
LISTA DE PROBLEMAS
• HAS
• DM2
• ...

ALERGIAS
• Penicilina

PREVENÇÕES
• Mamografia
• Papanicolau
• ...

RASTREAMENTOS
• RCV: 12% — Risco intermediário (Framingham/SBC 2022)
• TFG (CKD-EPI 2021): 85.2 mL/min — G2 (25/03/2026)
• FIB-4: 0.95 — Baixo risco (F0-F2) (25/03/2026)

Bioquímica (25/03/2026):
• CT: 210 ; HDL: 45 ; LDL: 140 ; Trig.: 180
• ...

Imagens / Outros (25/03/2026):
• ECG: ritmo sinusal
• USG abd: esteatose hepática leve

MUC
• HAS estágio 2
• DM2 em controle regular

DOENÇA ATUAL
• História Clínica
  Paciente refere...
• Exame Físico
  Abdome globoso...
• Hipótese Diagnóstica
  ...
• Plano
  ...

ANTECEDENTES
• Pessoais: ...
• Familiares: ...
• Hábitos: ...
• Medicamentos em uso:
  - Metformina 850mg 2x/dia
  - Losartana 50mg 1x/dia

PRESCRIÇÃO
1. Metformina 850mg — 1cp 2x/dia
2. Losartana 50mg — 1cp/dia (manhã)

EXAMES SOLICITADOS
• HbA1c, lipidograma, TSH

ORIENTAÇÕES
Dieta hipossódica, atividade física 150min/semana
```

Todas as datas no formato **DD/MM/AAAA** (padrão brasileiro).

---

## Padrões de Código

- **Componentes**: React Server Components por padrão, `'use client'` só quando necessário (interatividade, hooks)
- **Naming**: PascalCase para componentes, camelCase para funções/variáveis, kebab-case para arquivos/rotas
- **Validação**: Zod para schemas de formulário e API
- **Formulários**: React Hook Form + Zod resolver
- **Erro handling**: Error boundaries + toast notifications
- **Acessibilidade**: Radix UI garante ARIA. Todos os inputs com labels. Navegação por teclado funcional
- **Responsividade**: mobile-first não é prioridade (médicos usam desktop), mas o layout não pode quebrar em 1024px+

---

## Estrutura de Pastas

```
src/
  app/
    (auth)/
      login/page.tsx
      signup/page.tsx
    (dashboard)/
      layout.tsx          -- sidebar/topbar wrapper
      consulta/
        page.tsx          -- tela principal de consulta
        [id]/page.tsx     -- consulta existente
      pacientes/
        page.tsx          -- lista de pacientes
      configuracoes/
        page.tsx
    api/
      webhooks/stripe/route.ts
  components/
    ui/                   -- componentes genéricos (Button, Input, Tag, Toast, etc.)
    consultation/         -- componentes da tela de consulta
      PatientInfo.tsx
      ProblemList.tsx
      VitalsForm.tsx
      ExamGrid.tsx
      ExamCard.tsx
      ClinicalSummary.tsx
      SoapForm.tsx
      HistoryForm.tsx
      EsusSummary.tsx
      PrescriptionEditor.tsx
    layout/
      Topbar.tsx
      Sidebar.tsx
  lib/
    supabase/
      client.ts
      server.ts
      middleware.ts
    calculations/
      imc.ts
      tfg.ts
      fib4.ts
      rcv.ts
    reference-values.ts   -- mapa de valores de referência
    esus-generator.ts     -- lógica de geração do resumo eSUS
    utils.ts
    constants.ts
  types/
    index.ts              -- tipos compartilhados
    database.ts           -- tipos gerados do Supabase
  styles/
    globals.css           -- variáveis CSS, Tailwind config
```

---

## Ordem de Implementação

1. **Setup**: Next.js + Tailwind + Supabase + estrutura de pastas
2. **Design System**: Componentes UI base (Button, Input, ExamInput, Tag, SectionHeader, Toast)
3. **Tela de Consulta**: Layout 4 colunas + todos os formulários + cálculos automáticos + geração de resumo eSUS. TESTAR TUDO com dados mock
4. **Auth**: Login/signup com Supabase Auth. Middleware de proteção de rotas
5. **Banco de dados**: Migrations, RLS, CRUD de pacientes e consultas
6. **Persistência**: Salvar/carregar consultas. Auto-save com debounce
7. **Stripe**: Checkout, webhooks, controle de acesso por status de assinatura
8. **Polish**: Animações, loading states, empty states, error handling, keyboard shortcuts

---

## Regras Inegociáveis

- **Datas sempre DD/MM/AAAA** em toda UI e output
- **Nenhum dado médico exposto sem autenticação** — RLS em tudo
- **Cálculos com referências citáveis** — cada fórmula tem que ter a referência bibliográfica no código (comentário)
- **Prevenções alinhadas com MS/INCA** — Papanicolau (não colposcopia), PSA como decisão compartilhada, etc.
- **Zero dependência de Internet para cálculos** — toda lógica médica roda no frontend
- **Copiar para clipboard deve funcionar sempre** — fallback para `document.execCommand('copy')` se Clipboard API falhar
- **Performance**: a tela de consulta não pode ter lag perceptível ao digitar. Debounce a geração de resumo (300ms), não recalcular tudo a cada keystroke
