# MedMate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build MedMate, a professional EHR web app for Brazilian family medicine doctors, optimized for eSUS PEC integration.

**Architecture:** Next.js 14+ App Router with 4-column consultation screen as the core UI. Zustand for client state, Supabase for auth/DB/RLS, Stripe for payments. All medical calculations run client-side. Dark-mode-only "Clinical Linear" design system inspired by Linear.app.

**Tech Stack:** Next.js 14+, TypeScript, Tailwind CSS, Radix UI, Lucide Icons, Zustand, Supabase, Stripe, Vercel

---

## File Structure

```
src/
  app/
    layout.tsx                    -- root layout (fonts, globals)
    page.tsx                      -- redirect to /consulta
    (auth)/
      layout.tsx                  -- auth layout (centered card)
      login/page.tsx
      signup/page.tsx
    (dashboard)/
      layout.tsx                  -- topbar + main content wrapper
      consulta/
        page.tsx                  -- consultation screen (core)
        [id]/page.tsx             -- existing consultation
      pacientes/
        page.tsx                  -- patient list
      configuracoes/
        page.tsx                  -- settings
    api/
      webhooks/stripe/route.ts
  components/
    ui/
      button.tsx
      input.tsx
      exam-input.tsx
      section-header.tsx
      tag.tsx
      toast.tsx
      checkbox-item.tsx
      date-input.tsx
    consultation/
      patient-info.tsx
      problem-list.tsx
      vitals-form.tsx
      prevention-list.tsx
      exam-grid.tsx
      exam-card.tsx
      clinical-summary.tsx
      soap-form.tsx
      history-form.tsx
      esus-summary.tsx
      output-column.tsx
      prescription-editor.tsx
    layout/
      topbar.tsx
      sidebar.tsx
  lib/
    calculations/
      imc.ts
      tfg.ts
      fib4.ts
      rcv.ts
      index.ts                    -- re-exports all calculations
    reference-values.ts
    esus-generator.ts
    clipboard.ts
    utils.ts
    constants.ts
    branding.ts                   -- centralized name/logo config
    supabase/
      client.ts
      server.ts
      middleware.ts
  stores/
    consultation-store.ts         -- Zustand store for consultation state
  types/
    index.ts
    database.ts
  styles/
    globals.css
tailwind.config.ts
```

---

## Phase 1: Project Setup

### Task 1: Initialize Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`
- Create: `src/styles/globals.css`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`

- [ ] **Step 1: Create Next.js project with TypeScript and Tailwind**

```bash
cd "/c/Users/joaog/Ferramenta Medica/Ferramenta Medica/MedMate/medmate-app"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Expected: Project scaffolded with Next.js 14+, TypeScript, Tailwind, App Router, src/ directory.

- [ ] **Step 2: Install dependencies**

```bash
npm install zustand @radix-ui/react-checkbox @radix-ui/react-radio-group @radix-ui/react-tabs @radix-ui/react-tooltip @radix-ui/react-dialog @radix-ui/react-toast lucide-react zod react-hook-form @hookform/resolvers
```

- [ ] **Step 3: Install dev dependencies**

```bash
npm install -D @types/node
```

- [ ] **Step 4: Commit**

```bash
git init
git add .
git commit -m "chore: initialize Next.js project with dependencies"
```

---

### Task 2: Configure Design System CSS variables and Tailwind

**Files:**
- Modify: `src/styles/globals.css`
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Write globals.css with all CSS variables and base styles**

```css
@import 'tailwindcss';

@layer base {
  :root {
    /* Background layers */
    --bg-0: #0c0f1a;
    --bg-1: #131720;
    --bg-2: #1a1f2e;
    --bg-3: #20263a;

    /* Borders */
    --border-subtle: #252d40;
    --border-default: #344060;
    --border-focus: var(--accent);

    /* Text */
    --text-primary: #dde1eb;
    --text-secondary: #7a8499;
    --text-tertiary: #424d62;

    /* Accent */
    --accent: #00d084;
    --accent-hover: #00b870;
    --accent-dim: rgba(0, 208, 132, 0.07);

    /* Status */
    --status-ok: #00d084;
    --status-warn: #f5a623;
    --status-crit: #ff5252;
    --status-info: #4b9eff;
    --status-calc: #22d3ee;
    --status-misc: #9b8af8;

    /* Status backgrounds (7% opacity) */
    --status-ok-bg: rgba(0, 208, 132, 0.07);
    --status-warn-bg: rgba(245, 166, 35, 0.07);
    --status-crit-bg: rgba(255, 82, 82, 0.07);
    --status-info-bg: rgba(75, 158, 255, 0.07);
    --status-calc-bg: rgba(34, 211, 238, 0.07);
    --status-misc-bg: rgba(155, 138, 248, 0.07);
  }
}

@layer base {
  body {
    background: var(--bg-0);
    color: var(--text-primary);
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    line-height: 1.5;
    min-height: 100vh;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 3px; height: 3px; }
  ::-webkit-scrollbar-thumb { background: var(--border-default); border-radius: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }

  /* Selection */
  ::selection { background: rgba(0, 208, 132, 0.2); }
}
```

- [ ] **Step 2: Configure tailwind.config.ts with design tokens**

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          0: "var(--bg-0)",
          1: "var(--bg-1)",
          2: "var(--bg-2)",
          3: "var(--bg-3)",
        },
        border: {
          subtle: "var(--border-subtle)",
          default: "var(--border-default)",
          focus: "var(--border-focus)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          dim: "var(--accent-dim)",
        },
        status: {
          ok: "var(--status-ok)",
          warn: "var(--status-warn)",
          crit: "var(--status-crit)",
          info: "var(--status-info)",
          calc: "var(--status-calc)",
          misc: "var(--status-misc)",
          "ok-bg": "var(--status-ok-bg)",
          "warn-bg": "var(--status-warn-bg)",
          "crit-bg": "var(--status-crit-bg)",
          "info-bg": "var(--status-info-bg)",
          "calc-bg": "var(--status-calc-bg)",
          "misc-bg": "var(--status-misc-bg)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        micro: ["10px", { lineHeight: "1.4" }],
        xs: ["11px", { lineHeight: "1.4" }],
        sm: ["12px", { lineHeight: "1.5" }],
        base: ["13px", { lineHeight: "1.5" }],
        md: ["14px", { lineHeight: "1.5" }],
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 3: Update root layout with fonts**

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MedMate",
  description: "Prontuário eletrônico para Médicos de Família e Comunidade",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Verify app runs**

```bash
npm run dev
```

Expected: App runs at localhost:3000 with dark background (#0c0f1a).

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: configure design system CSS variables and Tailwind tokens"
```

---

### Task 3: Create branding config and TypeScript types

**Files:**
- Create: `src/lib/branding.ts`
- Create: `src/lib/constants.ts`
- Create: `src/types/index.ts`

- [ ] **Step 1: Create branding.ts**

```ts
// src/lib/branding.ts
export const BRAND = {
  name: "MedMate",
  shortName: "M+",
  tagline: "Prontuário eletrônico para MFC",
  version: "1.0.0",
} as const;
```

- [ ] **Step 2: Create constants.ts with medical constants**

```ts
// src/lib/constants.ts

export const PROBLEMS = [
  "HAS",
  "DM2",
  "Tabagismo",
  "Obesidade",
  "DHGNA",
  "DRC",
  "Hipotireoidismo",
  "Dislipidemia",
  "Ansiedade / Depressão",
  "Asma / DPOC",
  "ICC",
  "Fibrilação Atrial",
  "Gota",
] as const;

export const PREVENTIONS = [
  "Mamografia em dia",
  "Papanicolau em dia",
  "Colonoscopia / PSOF em dia",
  "Densitometria em dia",
  "Influenza (vacinado)",
  "COVID-19 (vacinado)",
  "HPV (vacinado)",
  "HIV (testado)",
  "Hepatite C (anti-HCV)",
  "Hepatite B (anti-HBs)",
  "PSA (disc. compartilhada)",
] as const;

export const GENDER_OPTIONS = ["Masculino", "Feminino", "Outro"] as const;

export const RACE_OPTIONS = [
  "Branco",
  "Pardo",
  "Preto",
  "Amarelo",
  "Indígena",
] as const;

export const EXAM_CARDS = [
  {
    id: "lipidograma",
    title: "Lipidograma",
    fields: [
      { key: "ct", label: "CT", unit: "mg/dL" },
      { key: "hdl", label: "HDL", unit: "mg/dL" },
      { key: "ldl", label: "LDL", unit: "mg/dL" },
      { key: "trig", label: "Triglicérides", unit: "mg/dL" },
      { key: "nao_hdl", label: "Não-HDL", unit: "mg/dL" },
    ],
  },
  {
    id: "renal",
    title: "Perfil Renal",
    fields: [
      { key: "cr", label: "Creatinina", unit: "mg/dL" },
      { key: "ur", label: "Ureia", unit: "mg/dL" },
      { key: "au", label: "Ác. Úrico", unit: "mg/dL" },
      { key: "tfg", label: "TFG", unit: "mL/min", auto: true },
      { key: "rac", label: "R.A/C", unit: "mg/g" },
    ],
  },
  {
    id: "hepatico",
    title: "Perfil Hepático",
    fields: [
      { key: "ast", label: "AST/TGO", unit: "U/L" },
      { key: "alt", label: "ALT/TGP", unit: "U/L" },
      { key: "ggt", label: "GamaGT", unit: "U/L" },
      { key: "fa", label: "Fosf. Alc.", unit: "U/L" },
      { key: "bt", label: "Bilirrubina T.", unit: "mg/dL" },
    ],
  },
  {
    id: "glicemico",
    title: "Perfil Glicêmico",
    fields: [
      { key: "gj", label: "Glicemia J.", unit: "mg/dL" },
      { key: "hba1c", label: "HbA1c", unit: "%" },
      { key: "insulina", label: "Insulina", unit: "µU/mL" },
      { key: "homa_ir", label: "HOMA-IR", unit: "" },
      { key: "peptc", label: "Pept. C", unit: "ng/mL" },
    ],
  },
  {
    id: "eletrolitos",
    title: "Eletrólitos",
    fields: [
      { key: "k", label: "K", unit: "mEq/L" },
      { key: "na", label: "Na", unit: "mEq/L" },
      { key: "ca", label: "Ca", unit: "mg/dL" },
      { key: "mg", label: "Mg", unit: "mg/dL" },
      { key: "p", label: "Fósforo", unit: "mg/dL" },
    ],
  },
  {
    id: "vitaminas",
    title: "Vitaminas",
    fields: [
      { key: "vitd", label: "Vit. D", unit: "ng/mL" },
      { key: "vitb12", label: "Vit. B12", unit: "pg/mL" },
      { key: "folato", label: "Folato", unit: "ng/mL" },
      { key: "zinco", label: "Zinco", unit: "µg/dL" },
    ],
  },
  {
    id: "hemograma",
    title: "Hemograma",
    fields: [
      { key: "hb", label: "Hb", unit: "g/dL" },
      { key: "ht", label: "Ht", unit: "%" },
      { key: "vcm", label: "VCM", unit: "fL" },
      { key: "leuco", label: "Leucócitos", unit: "/mm³" },
      { key: "plaq", label: "Plaquetas", unit: "mil/mm³" },
    ],
  },
  {
    id: "tireoide",
    title: "Tireoide",
    fields: [
      { key: "tsh", label: "TSH", unit: "mUI/L" },
      { key: "t4l", label: "T4L", unit: "ng/dL" },
      { key: "t3l", label: "T3L", unit: "pg/mL" },
      { key: "anti_tpo", label: "Anti-TPO", unit: "UI/mL" },
      { key: "anti_tg", label: "Anti-TG", unit: "UI/mL" },
    ],
  },
  {
    id: "ferro",
    title: "Cinética do Ferro",
    fields: [
      { key: "ferritina", label: "Ferritina", unit: "ng/mL" },
      { key: "ferro_serico", label: "Ferro sérico", unit: "µg/dL" },
      { key: "transferrina", label: "Transferrina", unit: "mg/dL" },
      { key: "sat_transferrina", label: "Saturação", unit: "%" },
      { key: "ctlf", label: "CTLF", unit: "µg/dL" },
    ],
  },
  {
    id: "inflamatorios",
    title: "Inflamatórios",
    fields: [
      { key: "pcr", label: "PCR", unit: "mg/L" },
      { key: "vhs", label: "VHS", unit: "mm/h" },
      { key: "eas", label: "EAS", unit: "" },
      { key: "psof", label: "PSOF", unit: "" },
      { key: "psa", label: "PSA", unit: "ng/mL" },
    ],
  },
] as const;
```

- [ ] **Step 3: Create types/index.ts**

```ts
// src/types/index.ts

export type Gender = "Masculino" | "Feminino" | "Outro";
export type Race = "Branco" | "Pardo" | "Preto" | "Amarelo" | "Indígena";
export type StatusLevel = "ok" | "warn" | "crit" | "none";

export interface PatientInfo {
  name: string;
  age: string;
  gender: Gender | "";
  race: Race | "";
  consultationDate: string;
}

export interface Vitals {
  pas: string;
  pad: string;
  peso: string;
  altura: string;
  imc: string;
  ca_abd: string;
  fc: string;
  spo2: string;
  temp: string;
}

export interface LabValues {
  [key: string]: string;
}

export interface ImagingData {
  date: string;
  entries: string;
}

export interface Calculations {
  imc: { value: number; classification: string } | null;
  tfg: { value: number; stage: string } | null;
  fib4: { value: number; risk: string } | null;
  rcv: { value: number; risk: string } | null;
}

export interface SoapNotes {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface History {
  personal: string;
  family: string;
  habits: string;
  medications: string;
  allergies: string;
  comorbidities: string;
}

export interface ConsultationState {
  patient: PatientInfo;
  vitals: Vitals;
  problems: string[];
  problemsOther: string;
  preventions: string[];
  labs: LabValues;
  labsDate: string;
  imaging: ImagingData;
  calculations: Calculations;
  soap: SoapNotes;
  history: History;
  prescription: string;
  requestedExams: string;
  patientInstructions: string;
}

export interface ExamFieldDef {
  key: string;
  label: string;
  unit: string;
  auto?: boolean;
}

export interface ExamCardDef {
  id: string;
  title: string;
  fields: readonly ExamFieldDef[];
}

export interface RefRule {
  type: "above" | "below" | "range";
  warn?: number;
  crit?: number;
  warnLow?: number;
  warnHigh?: number;
  critLow?: number;
  critHigh?: number;
}

export type RefRuleMap = Record<string, RefRule | ((gender: Gender | "") => RefRule)>;
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add branding config, medical constants, and TypeScript types"
```

---

## Phase 2: Design System Components

### Task 4: Build UI primitives — Button, Input, SectionHeader

**Files:**
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/section-header.tsx`

- [ ] **Step 1: Create Button component**

```tsx
// src/components/ui/button.tsx
"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-accent text-black font-bold hover:bg-accent-hover hover:shadow-[0_0_10px_rgba(0,208,132,0.25)] active:scale-[0.98]",
  secondary:
    "bg-transparent text-text-secondary border border-border-default hover:text-text-primary hover:border-text-tertiary",
  ghost:
    "bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`px-3.5 py-1.5 rounded-[5px] text-sm font-medium cursor-pointer transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
```

- [ ] **Step 2: Create Input component**

```tsx
// src/components/ui/input.tsx
"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className = "", id, ...props }, ref) => {
    return (
      <div className="mb-2">
        {label && (
          <label
            htmlFor={id}
            className="block text-[10.5px] text-text-tertiary mb-0.5 font-medium tracking-[0.01em]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`w-full h-[29px] px-2 border border-border-subtle rounded-[5px] bg-bg-2 text-text-primary font-sans text-xs transition-[border,box-shadow] duration-150 placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)] read-only:bg-status-calc-bg read-only:text-status-calc read-only:cursor-default read-only:font-mono read-only:border-[rgba(34,211,238,0.2)] ${className}`}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";
```

- [ ] **Step 3: Create SectionHeader component**

```tsx
// src/components/ui/section-header.tsx

type SectionColor = "blue" | "red" | "amber" | "green" | "cyan" | "purple";

const colorMap: Record<SectionColor, string> = {
  blue: "bg-status-info",
  red: "bg-status-crit",
  amber: "bg-status-warn",
  green: "bg-status-ok",
  cyan: "bg-status-calc",
  purple: "bg-status-misc",
};

interface SectionHeaderProps {
  label: string;
  color: SectionColor;
}

export function SectionHeader({ label, color }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-[7px] text-micro font-semibold tracking-[0.09em] uppercase text-text-secondary mb-[9px] pb-1.5 border-b border-border-subtle">
      <span
        className={`w-[3px] h-[14px] rounded-sm shrink-0 ${colorMap[color]}`}
      />
      {label}
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/button.tsx src/components/ui/input.tsx src/components/ui/section-header.tsx
git commit -m "feat: add Button, Input, and SectionHeader UI components"
```

---

### Task 5: Build ExamInput, Tag, Toast, CheckboxItem, DateInput

**Files:**
- Create: `src/components/ui/exam-input.tsx`
- Create: `src/components/ui/tag.tsx`
- Create: `src/components/ui/toast.tsx`
- Create: `src/components/ui/checkbox-item.tsx`
- Create: `src/components/ui/date-input.tsx`

- [ ] **Step 1: Create ExamInput component**

```tsx
// src/components/ui/exam-input.tsx
"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import type { StatusLevel } from "@/types";

interface ExamInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  unit?: string;
  status?: StatusLevel;
  auto?: boolean;
}

const statusStyles: Record<StatusLevel, string> = {
  none: "",
  ok: "!border-status-ok !text-status-ok !bg-status-ok-bg",
  warn: "!border-status-warn !text-status-warn !bg-status-warn-bg",
  crit: "!border-status-crit !text-status-crit !bg-status-crit-bg",
};

export const ExamInput = forwardRef<HTMLInputElement, ExamInputProps>(
  ({ label, unit, status = "none", auto = false, className = "", ...props }, ref) => {
    return (
      <div className="flex items-center gap-[3px] mb-1">
        <span className="text-micro text-text-secondary flex-1 whitespace-nowrap">
          {label}
          {unit && <span className="text-text-tertiary ml-0.5">({unit})</span>}
        </span>
        <input
          ref={ref}
          className={`w-[58px] h-[22px] px-1 border border-border-subtle rounded-[3px] bg-bg-2 text-text-primary font-mono text-micro text-right transition-[border,color,background] duration-150 focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)] tabular-nums ${
            auto
              ? "bg-status-calc-bg text-status-calc cursor-default border-[rgba(34,211,238,0.25)] font-semibold"
              : ""
          } ${statusStyles[status]} ${className}`}
          readOnly={auto}
          {...props}
        />
      </div>
    );
  }
);
ExamInput.displayName = "ExamInput";
```

- [ ] **Step 2: Create Tag component**

```tsx
// src/components/ui/tag.tsx

type TagVariant = "ok" | "warn" | "crit" | "info" | "calc" | "misc" | "empty";

const variantStyles: Record<TagVariant, string> = {
  ok: "bg-[rgba(0,208,132,0.06)] text-status-ok border border-[rgba(0,208,132,0.2)]",
  warn: "bg-[rgba(245,166,35,0.06)] text-status-warn border border-[rgba(245,166,35,0.2)]",
  crit: "bg-[rgba(255,82,82,0.06)] text-status-crit border border-[rgba(255,82,82,0.2)]",
  info: "bg-[rgba(75,158,255,0.06)] text-status-info border border-[rgba(75,158,255,0.2)]",
  calc: "bg-[rgba(34,211,238,0.06)] text-status-calc border border-[rgba(34,211,238,0.2)]",
  misc: "bg-[rgba(155,138,248,0.06)] text-status-misc border border-[rgba(155,138,248,0.2)]",
  empty: "bg-bg-3 text-text-tertiary border border-dashed border-border-default",
};

interface TagProps {
  variant?: TagVariant;
  children: React.ReactNode;
}

export function Tag({ variant = "empty", children }: TagProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-[2px] rounded-[20px] text-[10.5px] font-medium tracking-[0.01em] ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 3: Create Toast component**

```tsx
// src/components/ui/toast.tsx
"use client";

import { useEffect, useState, useCallback } from "react";

interface ToastState {
  message: string;
  type: "success" | "error" | "info";
  visible: boolean;
}

let showToastFn: ((message: string, type?: "success" | "error" | "info") => void) | null = null;

export function showToast(message: string, type: "success" | "error" | "info" = "success") {
  showToastFn?.(message, type);
}

const borderColors = {
  success: "border-accent",
  error: "border-status-crit",
  info: "border-status-info",
};

const textColors = {
  success: "text-accent",
  error: "text-status-crit",
  info: "text-status-info",
};

export function ToastProvider() {
  const [toast, setToast] = useState<ToastState>({
    message: "",
    type: "success",
    visible: false,
  });

  const show = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
  }, []);

  useEffect(() => {
    showToastFn = show;
    return () => { showToastFn = null; };
  }, [show]);

  return (
    <div
      className={`fixed bottom-4 right-4 bg-bg-3 border ${borderColors[toast.type]} ${textColors[toast.type]} px-4 py-2 rounded-[5px] text-xs font-medium tracking-[0.01em] z-[9999] transition-all duration-200 ${
        toast.visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-1.5 pointer-events-none"
      }`}
    >
      {toast.message}
    </div>
  );
}
```

- [ ] **Step 4: Create CheckboxItem component**

```tsx
// src/components/ui/checkbox-item.tsx
"use client";

interface CheckboxItemProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function CheckboxItem({ label, checked, onChange }: CheckboxItemProps) {
  return (
    <label className="flex items-center gap-1.5 text-xs cursor-pointer text-text-secondary px-1 py-[3px] rounded hover:bg-bg-3 hover:text-text-primary transition-all duration-100">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-3 h-3 accent-accent"
      />
      {label}
    </label>
  );
}
```

- [ ] **Step 5: Create DateInput component (DD/MM/AAAA)**

```tsx
// src/components/ui/date-input.tsx
"use client";

import { forwardRef, InputHTMLAttributes } from "react";

interface DateInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ label, value, onChange, className = "", ...props }, ref) => {
    return (
      <div className="mb-2">
        {label && (
          <label className="block text-[10.5px] text-text-tertiary mb-0.5 font-medium">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-[29px] px-2 border border-border-subtle rounded-[5px] bg-bg-2 text-text-primary font-sans text-xs transition-[border,box-shadow] duration-150 focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)] ${className}`}
          {...props}
        />
      </div>
    );
  }
);
DateInput.displayName = "DateInput";
```

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add ExamInput, Tag, Toast, CheckboxItem, DateInput components"
```

---

## Phase 3: Medical Calculations & Reference Values

### Task 6: Implement IMC calculation

**Files:**
- Create: `src/lib/calculations/imc.ts`

- [ ] **Step 1: Create imc.ts**

```ts
// src/lib/calculations/imc.ts

/**
 * IMC — Índice de Massa Corporal
 * Referência: OMS (WHO Expert Committee, 1995; WHO Obesity Report, 2000)
 * Fórmula: peso(kg) / altura(m)²
 */

interface ImcResult {
  value: number;
  classification: string;
}

export function calculateIMC(pesoKg: number, alturaCm: number): ImcResult | null {
  if (pesoKg <= 0 || alturaCm <= 0) return null;

  const alturaM = alturaCm / 100;
  const value = pesoKg / (alturaM * alturaM);

  let classification: string;
  if (value < 18.5) classification = "Baixo peso";
  else if (value < 25) classification = "Eutrófico";
  else if (value < 30) classification = "Sobrepeso";
  else if (value < 35) classification = "Obesidade I";
  else if (value < 40) classification = "Obesidade II";
  else classification = "Obesidade III";

  return { value: Math.round(value * 10) / 10, classification };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/calculations/imc.ts
git commit -m "feat: add IMC calculation (OMS reference)"
```

---

### Task 7: Implement TFG CKD-EPI 2021 calculation

**Files:**
- Create: `src/lib/calculations/tfg.ts`

- [ ] **Step 1: Create tfg.ts**

```ts
// src/lib/calculations/tfg.ts

/**
 * TFG — Taxa de Filtração Glomerular
 * Fórmula: CKD-EPI 2021 sem raça (race-free)
 * Referências:
 *   - Inker LA et al. N Engl J Med. 2021;385(19):1737-1749. (CKD-EPI 2021)
 *   - KDIGO 2024 Clinical Practice Guideline for CKD Evaluation and Management
 *   - Ministério da Saúde — Diretrizes Clínicas para o Cuidado ao paciente com DRC, 2022
 *
 * κ = 0.7 (F) ou 0.9 (M)
 * α = -0.241 (F) ou -0.302 (M)
 * Se Cr/κ ≤ 1: TFG = 142 × (Cr/κ)^α × 0.9938^idade × (1.012 se F)
 * Se Cr/κ > 1: TFG = 142 × (Cr/κ)^-1.200 × 0.9938^idade × (1.012 se F)
 */

type Sex = "Masculino" | "Feminino";

interface TfgResult {
  value: number;
  stage: string;
}

export function calculateTFG(creatinina: number, idade: number, sexo: Sex): TfgResult | null {
  if (creatinina <= 0 || idade <= 0) return null;

  const isFemale = sexo === "Feminino";
  const kappa = isFemale ? 0.7 : 0.9;
  const alpha = isFemale ? -0.241 : -0.302;
  const sexMultiplier = isFemale ? 1.012 : 1;

  const ratio = creatinina / kappa;
  let tfg: number;

  if (ratio <= 1) {
    tfg = 142 * Math.pow(ratio, alpha) * Math.pow(0.9938, idade) * sexMultiplier;
  } else {
    tfg = 142 * Math.pow(ratio, -1.200) * Math.pow(0.9938, idade) * sexMultiplier;
  }

  const value = Math.round(tfg * 10) / 10;

  let stage: string;
  if (value >= 90) stage = "G1";
  else if (value >= 60) stage = "G2";
  else if (value >= 45) stage = "G3a";
  else if (value >= 30) stage = "G3b";
  else if (value >= 15) stage = "G4";
  else stage = "G5";

  return { value, stage };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/calculations/tfg.ts
git commit -m "feat: add TFG CKD-EPI 2021 calculation (KDIGO/MS reference)"
```

---

### Task 8: Implement FIB-4 calculation

**Files:**
- Create: `src/lib/calculations/fib4.ts`

- [ ] **Step 1: Create fib4.ts**

```ts
// src/lib/calculations/fib4.ts

/**
 * FIB-4 — Índice de Fibrose Hepática
 * Referências:
 *   - Sterling RK et al. Hepatology 2006;43:1317-1325 (fórmula original)
 *   - EASL Clinical Practice Guidelines 2023 (pontos de corte)
 *   - Ministério da Saúde — Nota Técnica DHGNA 2022
 *
 * FIB-4 = (Idade × AST) / (Plaquetas_mil × √ALT)
 * <1.30 Baixo risco (F0-F2) | 1.30-2.67 Indeterminado | >2.67 Alto risco (F3-F4)
 */

interface Fib4Result {
  value: number;
  risk: string;
}

export function calculateFIB4(
  idade: number,
  ast: number,
  alt: number,
  plaquetasMil: number
): Fib4Result | null {
  if (idade <= 0 || ast <= 0 || alt <= 0 || plaquetasMil <= 0) return null;

  const value = (idade * ast) / (plaquetasMil * Math.sqrt(alt));
  const rounded = Math.round(value * 100) / 100;

  let risk: string;
  if (rounded < 1.3) risk = "Baixo risco (F0-F2)";
  else if (rounded <= 2.67) risk = "Indeterminado";
  else risk = "Alto risco (F3-F4)";

  return { value: rounded, risk };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/calculations/fib4.ts
git commit -m "feat: add FIB-4 calculation (EASL 2023/MS reference)"
```

---

### Task 9: Implement RCV Framingham calculation

**Files:**
- Create: `src/lib/calculations/rcv.ts`

- [ ] **Step 1: Create rcv.ts**

```ts
// src/lib/calculations/rcv.ts

/**
 * RCV — Risco Cardiovascular (Framingham)
 * Referências:
 *   - Wilson PW et al. Circulation 1998;97(18):1837-1847 (modelo original)
 *   - Diretriz Brasileira de Prevenção Cardiovascular — SBC 2022
 *   - Ministério da Saúde — Caderno DCNT 2022
 *
 * Modelo logarítmico com coeficientes por sexo.
 * Inputs: idade (30-74), PAS, CT, HDL, tabagismo, DM, HAS tratada
 */

type Sex = "Masculino" | "Feminino";

interface RcvResult {
  value: number;
  risk: string;
}

export function calculateRCV(
  idade: number,
  pas: number,
  ct: number,
  hdl: number,
  sexo: Sex,
  tabagismo: boolean,
  dm: boolean,
  hasTratada: boolean
): RcvResult | null {
  if (idade < 30 || idade > 74 || pas <= 0 || ct <= 0 || hdl <= 0) return null;

  let s: number;
  let baseline: number;

  if (sexo === "Masculino") {
    s =
      3.06117 * Math.log(idade) +
      1.1237 * Math.log(ct) -
      0.93263 * Math.log(hdl) +
      (hasTratada ? 1.99881 : 1.93303) * Math.log(pas) +
      (tabagismo ? 0.65451 : 0) +
      (dm ? 0.57367 : 0) -
      23.9802;
    baseline = 0.9402;
  } else {
    s =
      2.32888 * Math.log(idade) +
      1.20904 * Math.log(ct) -
      0.70833 * Math.log(hdl) +
      (hasTratada ? 2.82263 : 2.76157) * Math.log(pas) +
      (tabagismo ? 0.52873 : 0) +
      (dm ? 0.69154 : 0) -
      26.1931;
    baseline = 0.9669;
  }

  const score = 1 - Math.pow(baseline, Math.exp(s));
  const percentage = Math.round(score * 1000) / 10; // one decimal

  let risk: string;
  if (percentage < 10) risk = "Baixo";
  else if (percentage < 20) risk = "Intermediário";
  else risk = "Alto";

  return { value: percentage, risk };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/calculations/rcv.ts
git commit -m "feat: add RCV Framingham calculation (SBC 2022/MS reference)"
```

---

### Task 10: Create calculations index and reference values

**Files:**
- Create: `src/lib/calculations/index.ts`
- Create: `src/lib/reference-values.ts`

- [ ] **Step 1: Create calculations/index.ts**

```ts
// src/lib/calculations/index.ts
export { calculateIMC } from "./imc";
export { calculateTFG } from "./tfg";
export { calculateFIB4 } from "./fib4";
export { calculateRCV } from "./rcv";
```

- [ ] **Step 2: Create reference-values.ts**

```ts
// src/lib/reference-values.ts
import type { RefRule, RefRuleMap, Gender } from "@/types";

/**
 * Mapa de valores de referência para exames laboratoriais.
 * Fontes: MS PCDT, Diretrizes SBC 2022, KDIGO 2024, OMS.
 *
 * Regras:
 * - "above": warn/crit acima do limite (ex: CT >200 warn, >240 crit)
 * - "below": warn/crit abaixo do limite (ex: HDL <40 warn, <35 crit)
 * - "range": warn fora de warnLow-warnHigh
 */

export const REFERENCE_VALUES: RefRuleMap = {
  // Lipidograma
  ct: { type: "above", warn: 200, crit: 240 },
  hdl: { type: "below", warn: 40, crit: 35 },
  ldl: { type: "above", warn: 130, crit: 160 },
  trig: { type: "above", warn: 150, crit: 200 },
  nao_hdl: { type: "above", warn: 160, crit: 190 },

  // Perfil Renal
  cr: { type: "above", warn: 1.2, crit: 1.5 },
  ur: { type: "above", warn: 40, crit: 60 },
  au: { type: "above", warn: 7.0, crit: 9.0 },
  rac: { type: "above", warn: 30, crit: 300 },

  // Perfil Hepático
  ast: { type: "above", warn: 40, crit: 80 },
  alt: { type: "above", warn: 41, crit: 80 },
  ggt: { type: "above", warn: 60, crit: 120 },
  fa: { type: "above", warn: 120, crit: 200 },
  bt: { type: "above", warn: 1.2, crit: 2.0 },

  // Perfil Glicêmico
  gj: { type: "above", warn: 100, crit: 126 },
  hba1c: { type: "above", warn: 5.7, crit: 6.5 },
  insulina: { type: "above", warn: 25, crit: 50 },
  homa_ir: { type: "above", warn: 2.5, crit: 4.0 },

  // Eletrólitos
  k: { type: "range", warnLow: 3.5, warnHigh: 5.0, critLow: 3.0, critHigh: 5.5 },
  na: { type: "range", warnLow: 136, warnHigh: 145, critLow: 130, critHigh: 150 },
  ca: { type: "range", warnLow: 8.5, warnHigh: 10.5, critLow: 7.5, critHigh: 11.5 },
  mg: { type: "range", warnLow: 1.7, warnHigh: 2.2, critLow: 1.3, critHigh: 2.6 },
  p: { type: "range", warnLow: 2.5, warnHigh: 4.5, critLow: 2.0, critHigh: 5.5 },

  // Vitaminas
  vitd: { type: "below", warn: 30, crit: 20 },
  vitb12: { type: "below", warn: 300, crit: 200 },
  folato: { type: "below", warn: 5, crit: 3 },

  // Hemograma (com dependência de sexo)
  hb: (gender: Gender | "") => {
    if (gender === "Masculino") return { type: "below" as const, warn: 13, crit: 11 };
    if (gender === "Feminino") return { type: "below" as const, warn: 12, crit: 10 };
    return { type: "below" as const, warn: 12, crit: 10 };
  },
  ht: (gender: Gender | "") => {
    if (gender === "Masculino") return { type: "below" as const, warn: 39, crit: 33 };
    return { type: "below" as const, warn: 36, crit: 30 };
  },
  vcm: { type: "range", warnLow: 80, warnHigh: 100, critLow: 70, critHigh: 110 },
  leuco: { type: "range", warnLow: 4000, warnHigh: 11000, critLow: 2000, critHigh: 20000 },
  plaq: { type: "range", warnLow: 150, warnHigh: 400, critLow: 100, critHigh: 500 },

  // Tireoide
  tsh: { type: "range", warnLow: 0.4, warnHigh: 4.0, critLow: 0.1, critHigh: 10 },
  t4l: { type: "range", warnLow: 0.8, warnHigh: 1.8, critLow: 0.5, critHigh: 2.5 },

  // Cinética do Ferro (com dependência de sexo)
  ferritina: (gender: Gender | "") => {
    if (gender === "Masculino") return { type: "below" as const, warn: 30, crit: 15 };
    return { type: "below" as const, warn: 13, crit: 10 };
  },
  sat_transferrina: { type: "range", warnLow: 20, warnHigh: 50, critLow: 16, critHigh: 60 },

  // Inflamatórios
  pcr: { type: "above", warn: 3, crit: 10 },
  vhs: { type: "above", warn: 20, crit: 40 },
  psa: { type: "above", warn: 4, crit: 10 },
};

export function getRefRule(key: string, gender: Gender | ""): RefRule | null {
  const rule = REFERENCE_VALUES[key];
  if (!rule) return null;
  if (typeof rule === "function") return rule(gender);
  return rule;
}

export function getStatus(key: string, value: number, gender: Gender | ""): "ok" | "warn" | "crit" | "none" {
  const rule = getRefRule(key, gender);
  if (!rule || isNaN(value)) return "none";

  if (rule.type === "above") {
    if (rule.crit !== undefined && value >= rule.crit) return "crit";
    if (rule.warn !== undefined && value >= rule.warn) return "warn";
    return "ok";
  }

  if (rule.type === "below") {
    if (rule.crit !== undefined && value <= rule.crit) return "crit";
    if (rule.warn !== undefined && value <= rule.warn) return "warn";
    return "ok";
  }

  if (rule.type === "range") {
    if ((rule.critLow !== undefined && value <= rule.critLow) ||
        (rule.critHigh !== undefined && value >= rule.critHigh)) return "crit";
    if ((rule.warnLow !== undefined && value < rule.warnLow) ||
        (rule.warnHigh !== undefined && value > rule.warnHigh)) return "warn";
    return "ok";
  }

  return "none";
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/calculations/index.ts src/lib/reference-values.ts
git commit -m "feat: add reference values map and status classification"
```

---

## Phase 4: Zustand Store

### Task 11: Create consultation Zustand store

**Files:**
- Create: `src/stores/consultation-store.ts`

- [ ] **Step 1: Create consultation-store.ts**

```ts
// src/stores/consultation-store.ts
"use client";

import { create } from "zustand";
import type { ConsultationState, PatientInfo, Vitals, SoapNotes, History, ImagingData, Calculations } from "@/types";

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

const initialState: ConsultationState = {
  patient: { name: "", age: "", gender: "", race: "", consultationDate: todayISO() },
  vitals: { pas: "", pad: "", peso: "", altura: "", imc: "", ca_abd: "", fc: "", spo2: "", temp: "" },
  problems: [],
  problemsOther: "",
  preventions: [],
  labs: {},
  labsDate: todayISO(),
  imaging: { date: todayISO(), entries: "" },
  calculations: { imc: null, tfg: null, fib4: null, rcv: null },
  soap: { subjective: "", objective: "", assessment: "", plan: "" },
  history: { personal: "", family: "", habits: "", medications: "", allergies: "", comorbidities: "" },
  prescription: "",
  requestedExams: "",
  patientInstructions: "",
};

interface ConsultationActions {
  setPatient: (patient: Partial<PatientInfo>) => void;
  setVitals: (vitals: Partial<Vitals>) => void;
  toggleProblem: (problem: string) => void;
  setProblemsOther: (value: string) => void;
  togglePrevention: (prevention: string) => void;
  setLab: (key: string, value: string) => void;
  setLabsDate: (date: string) => void;
  setImaging: (imaging: Partial<ImagingData>) => void;
  setCalculations: (calcs: Partial<Calculations>) => void;
  setSoap: (soap: Partial<SoapNotes>) => void;
  setHistory: (history: Partial<History>) => void;
  setPrescription: (value: string) => void;
  setRequestedExams: (value: string) => void;
  setPatientInstructions: (value: string) => void;
  reset: () => void;
}

export type ConsultationStore = ConsultationState & ConsultationActions;

export const useConsultationStore = create<ConsultationStore>((set) => ({
  ...initialState,

  setPatient: (patient) =>
    set((state) => ({ patient: { ...state.patient, ...patient } })),

  setVitals: (vitals) =>
    set((state) => ({ vitals: { ...state.vitals, ...vitals } })),

  toggleProblem: (problem) =>
    set((state) => ({
      problems: state.problems.includes(problem)
        ? state.problems.filter((p) => p !== problem)
        : [...state.problems, problem],
    })),

  setProblemsOther: (value) => set({ problemsOther: value }),

  togglePrevention: (prevention) =>
    set((state) => ({
      preventions: state.preventions.includes(prevention)
        ? state.preventions.filter((p) => p !== prevention)
        : [...state.preventions, prevention],
    })),

  setLab: (key, value) =>
    set((state) => ({ labs: { ...state.labs, [key]: value } })),

  setLabsDate: (date) => set({ labsDate: date }),

  setImaging: (imaging) =>
    set((state) => ({ imaging: { ...state.imaging, ...imaging } })),

  setCalculations: (calcs) =>
    set((state) => ({ calculations: { ...state.calculations, ...calcs } })),

  setSoap: (soap) =>
    set((state) => ({ soap: { ...state.soap, ...soap } })),

  setHistory: (history) =>
    set((state) => ({ history: { ...state.history, ...history } })),

  setPrescription: (value) => set({ prescription: value }),
  setRequestedExams: (value) => set({ requestedExams: value }),
  setPatientInstructions: (value) => set({ patientInstructions: value }),

  reset: () => set({ ...initialState, patient: { ...initialState.patient, consultationDate: todayISO() } }),
}));
```

- [ ] **Step 2: Commit**

```bash
git add src/stores/consultation-store.ts
git commit -m "feat: add Zustand consultation store"
```

---

## Phase 5: Consultation Screen Components

### Task 12: Build PatientInfo component (Column 1 top)

**Files:**
- Create: `src/components/consultation/patient-info.tsx`

- [ ] **Step 1: Create patient-info.tsx**

```tsx
// src/components/consultation/patient-info.tsx
"use client";

import { useConsultationStore } from "@/stores/consultation-store";
import { SectionHeader } from "@/components/ui/section-header";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import { RACE_OPTIONS, GENDER_OPTIONS } from "@/lib/constants";

export function PatientInfo() {
  const { patient, setPatient } = useConsultationStore();

  return (
    <div className="mb-3.5">
      <SectionHeader label="Identificação" color="blue" />
      <Input
        label="Nome"
        id="patient-name"
        placeholder="Nome do paciente"
        value={patient.name}
        onChange={(e) => setPatient({ name: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-[5px]">
        <Input
          label="Idade"
          id="patient-age"
          type="number"
          placeholder="anos"
          min={0}
          max={120}
          value={patient.age}
          onChange={(e) => setPatient({ age: e.target.value })}
        />
        <div className="mb-2">
          <label className="block text-[10.5px] text-text-tertiary mb-0.5 font-medium">
            Raça
          </label>
          <select
            value={patient.race}
            onChange={(e) => setPatient({ race: e.target.value as typeof patient.race })}
            className="w-full h-[29px] px-2 border border-border-subtle rounded-[5px] bg-bg-2 text-text-primary font-sans text-xs cursor-pointer focus:outline-none focus:border-accent"
          >
            <option value="">--</option>
            {RACE_OPTIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mb-2">
        <label className="block text-[10.5px] text-text-tertiary mb-0.5 font-medium">
          Gênero
        </label>
        <div className="flex gap-3 mt-0.5">
          {GENDER_OPTIONS.map((g) => (
            <label key={g} className="flex items-center gap-1 text-xs cursor-pointer text-text-secondary">
              <input
                type="radio"
                name="gender"
                value={g}
                checked={patient.gender === g}
                onChange={() => setPatient({ gender: g })}
                className="accent-accent"
              />
              {g === "Masculino" ? "Masc." : g === "Feminino" ? "Fem." : "Outro"}
            </label>
          ))}
        </div>
      </div>
      <DateInput
        label="Data da consulta"
        value={patient.consultationDate}
        onChange={(v) => setPatient({ consultationDate: v })}
      />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/consultation/patient-info.tsx
git commit -m "feat: add PatientInfo component"
```

---

### Task 13: Build ProblemList, VitalsForm, PreventionList (rest of Column 1)

**Files:**
- Create: `src/components/consultation/problem-list.tsx`
- Create: `src/components/consultation/vitals-form.tsx`
- Create: `src/components/consultation/prevention-list.tsx`

- [ ] **Step 1: Create problem-list.tsx**

```tsx
// src/components/consultation/problem-list.tsx
"use client";

import { useConsultationStore } from "@/stores/consultation-store";
import { SectionHeader } from "@/components/ui/section-header";
import { CheckboxItem } from "@/components/ui/checkbox-item";
import { Input } from "@/components/ui/input";
import { PROBLEMS } from "@/lib/constants";

export function ProblemList() {
  const { problems, problemsOther, toggleProblem, setProblemsOther } = useConsultationStore();

  return (
    <div className="mb-3.5">
      <SectionHeader label="Lista de Problemas" color="red" />
      <div className="flex flex-col gap-0.5">
        {PROBLEMS.map((p) => (
          <CheckboxItem
            key={p}
            label={p}
            checked={problems.includes(p)}
            onChange={() => toggleProblem(p)}
          />
        ))}
      </div>
      <div className="mt-[7px]">
        <Input
          label="Outros"
          id="problems-other"
          placeholder="Ex: ICC (G5A2), Gota..."
          value={problemsOther}
          onChange={(e) => setProblemsOther(e.target.value)}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create vitals-form.tsx with IMC auto-calculation**

```tsx
// src/components/consultation/vitals-form.tsx
"use client";

import { useEffect } from "react";
import { useConsultationStore } from "@/stores/consultation-store";
import { SectionHeader } from "@/components/ui/section-header";
import { Input } from "@/components/ui/input";
import { calculateIMC } from "@/lib/calculations";

export function VitalsForm() {
  const { vitals, setVitals, setCalculations } = useConsultationStore();

  useEffect(() => {
    const peso = parseFloat(vitals.peso);
    const altura = parseFloat(vitals.altura);
    const result = calculateIMC(peso, altura);
    setVitals({ imc: result ? `${result.value} — ${result.classification}` : "" });
    setCalculations({ imc: result });
  }, [vitals.peso, vitals.altura, setVitals, setCalculations]);

  const field = (label: string, key: keyof typeof vitals, placeholder: string, extra?: { step?: string }) => (
    <Input
      label={label}
      id={`vital-${key}`}
      type="number"
      placeholder={placeholder}
      value={vitals[key]}
      onChange={(e) => setVitals({ [key]: e.target.value })}
      step={extra?.step}
    />
  );

  return (
    <div className="mb-3.5">
      <SectionHeader label="Exame Físico" color="amber" />
      <div className="grid grid-cols-2 gap-[5px]">
        {field("PAS (mmHg)", "pas", "120")}
        {field("PAD (mmHg)", "pad", "80")}
      </div>
      <div className="grid grid-cols-2 gap-[5px]">
        {field("Peso (kg)", "peso", "70")}
        {field("Altura (cm)", "altura", "170")}
      </div>
      <div className="grid grid-cols-2 gap-[5px]">
        <div className="mb-2">
          <label className="block text-[10.5px] text-text-tertiary mb-0.5 font-medium">
            IMC <span className="text-[8px] bg-status-calc-bg text-status-calc px-[5px] py-[1px] rounded-[3px] font-bold ml-1 border border-[rgba(34,211,238,0.2)] tracking-[0.05em]">AUTO</span>
          </label>
          <input
            readOnly
            value={vitals.imc}
            className="w-full h-[29px] px-2 border border-[rgba(34,211,238,0.2)] rounded-[5px] bg-status-calc-bg text-status-calc font-mono text-xs cursor-default focus:outline-none"
          />
        </div>
        {field("C. Abd. (cm)", "ca_abd", "—")}
      </div>
      <div className="grid grid-cols-2 gap-[5px]">
        {field("FC (bpm)", "fc", "70")}
        {field("SpO₂ (%)", "spo2", "98")}
      </div>
      {field("Temperatura (°C)", "temp", "36.5", { step: "0.1" })}
    </div>
  );
}
```

- [ ] **Step 3: Create prevention-list.tsx**

```tsx
// src/components/consultation/prevention-list.tsx
"use client";

import { useConsultationStore } from "@/stores/consultation-store";
import { SectionHeader } from "@/components/ui/section-header";
import { CheckboxItem } from "@/components/ui/checkbox-item";
import { PREVENTIONS } from "@/lib/constants";

export function PreventionList() {
  const { preventions, togglePrevention } = useConsultationStore();

  return (
    <div className="mb-3.5">
      <SectionHeader label="Prevenções" color="green" />
      <div className="flex flex-col gap-0.5">
        {PREVENTIONS.map((p) => (
          <CheckboxItem
            key={p}
            label={p}
            checked={preventions.includes(p)}
            onChange={() => togglePrevention(p)}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/consultation/
git commit -m "feat: add ProblemList, VitalsForm, PreventionList components"
```

---

### Task 14: Build ExamCard and ExamGrid (Column 2)

**Files:**
- Create: `src/components/consultation/exam-card.tsx`
- Create: `src/components/consultation/exam-grid.tsx`

- [ ] **Step 1: Create exam-card.tsx**

```tsx
// src/components/consultation/exam-card.tsx
"use client";

import { useConsultationStore } from "@/stores/consultation-store";
import { ExamInput } from "@/components/ui/exam-input";
import { getStatus } from "@/lib/reference-values";
import type { ExamCardDef } from "@/types";

interface ExamCardProps {
  card: ExamCardDef;
  span2?: boolean;
}

export function ExamCard({ card, span2 = false }: ExamCardProps) {
  const { labs, setLab, patient } = useConsultationStore();

  return (
    <div
      className={`border border-border-subtle rounded-lg p-[10px] bg-bg-1 transition-[border-color] duration-150 hover:border-border-default ${
        span2 ? "col-span-2" : ""
      }`}
    >
      <div className="text-[9px] font-bold tracking-[0.09em] uppercase text-text-secondary mb-2 pb-1.5 border-b border-border-subtle">
        {card.title}
      </div>
      {card.fields.map((field) => {
        const value = labs[field.key] ?? "";
        const numValue = parseFloat(value);
        const status = !isNaN(numValue) ? getStatus(field.key, numValue, patient.gender) : "none";

        return (
          <ExamInput
            key={field.key}
            label={field.label}
            unit={field.unit}
            status={field.auto ? "none" : status}
            auto={field.auto}
            value={value}
            onChange={(e) => setLab(field.key, e.target.value)}
          />
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Create exam-grid.tsx with auto-calculations**

```tsx
// src/components/consultation/exam-grid.tsx
"use client";

import { useEffect } from "react";
import { useConsultationStore } from "@/stores/consultation-store";
import { SectionHeader } from "@/components/ui/section-header";
import { DateInput } from "@/components/ui/date-input";
import { ExamCard } from "./exam-card";
import { EXAM_CARDS } from "@/lib/constants";
import { calculateTFG, calculateFIB4, calculateRCV } from "@/lib/calculations";
import type { ExamCardDef } from "@/types";

const CALC_CARD: ExamCardDef = {
  id: "calculos",
  title: "Cálculos Automáticos",
  fields: [
    { key: "fib4_auto", label: "FIB-4", unit: "", auto: true },
    { key: "tfg_auto", label: "TFG CKD-EPI", unit: "mL/min", auto: true },
    { key: "rcv_auto", label: "RCV Framingham", unit: "%", auto: true },
  ],
};

export function ExamGrid() {
  const store = useConsultationStore();
  const { labs, labsDate, setLabsDate, setLab, setCalculations, patient, vitals, problems } = store;

  // Auto-calculate TFG
  useEffect(() => {
    const cr = parseFloat(labs.cr ?? "");
    const idade = parseInt(patient.age);
    const sexo = patient.gender;
    if (!isNaN(cr) && !isNaN(idade) && (sexo === "Masculino" || sexo === "Feminino")) {
      const result = calculateTFG(cr, idade, sexo);
      setLab("tfg", result ? result.value.toString() : "");
      setLab("tfg_auto", result ? `${result.value} — ${result.stage}` : "");
      setCalculations({ tfg: result });
    } else {
      setLab("tfg", "");
      setLab("tfg_auto", "");
      setCalculations({ tfg: null });
    }
  }, [labs.cr, patient.age, patient.gender, setLab, setCalculations]);

  // Auto-calculate FIB-4
  useEffect(() => {
    const idade = parseInt(patient.age);
    const ast = parseFloat(labs.ast ?? "");
    const alt = parseFloat(labs.alt ?? "");
    const plaq = parseFloat(labs.plaq ?? "");
    if (!isNaN(idade) && !isNaN(ast) && !isNaN(alt) && !isNaN(plaq) && plaq > 0) {
      const result = calculateFIB4(idade, ast, alt, plaq);
      setLab("fib4_auto", result ? `${result.value} — ${result.risk}` : "");
      setCalculations({ fib4: result });
    } else {
      setLab("fib4_auto", "");
      setCalculations({ fib4: null });
    }
  }, [patient.age, labs.ast, labs.alt, labs.plaq, setLab, setCalculations]);

  // Auto-calculate RCV
  useEffect(() => {
    const idade = parseInt(patient.age);
    const pas = parseFloat(vitals.pas);
    const ct = parseFloat(labs.ct ?? "");
    const hdl = parseFloat(labs.hdl ?? "");
    const sexo = patient.gender;
    const tabagismo = problems.includes("Tabagismo");
    const dm = problems.includes("DM2");
    const has = problems.includes("HAS");

    if (!isNaN(idade) && !isNaN(pas) && !isNaN(ct) && !isNaN(hdl) && (sexo === "Masculino" || sexo === "Feminino")) {
      const result = calculateRCV(idade, pas, ct, hdl, sexo, tabagismo, dm, has);
      setLab("rcv_auto", result ? `${result.value}% — ${result.risk}` : "");
      setCalculations({ rcv: result });
    } else {
      setLab("rcv_auto", "");
      setCalculations({ rcv: null });
    }
  }, [patient.age, vitals.pas, labs.ct, labs.hdl, patient.gender, problems, setLab, setCalculations]);

  return (
    <div>
      <SectionHeader label="Exames Complementares" color="cyan" />
      <DateInput
        label="Data dos exames"
        value={labsDate}
        onChange={setLabsDate}
      />
      <div className="grid grid-cols-3 gap-[7px] mb-2.5">
        {EXAM_CARDS.map((card) => (
          <ExamCard key={card.id} card={card as ExamCardDef} />
        ))}
        <ExamCard card={CALC_CARD} span2 />
      </div>
      {/* Outros / Imagens */}
      <div className="border border-border-subtle rounded-lg p-[10px] bg-bg-1">
        <div className="text-[9px] font-bold tracking-[0.09em] uppercase text-text-secondary mb-2 pb-1.5 border-b border-border-subtle">
          Outros / Imagens
        </div>
        <DateInput
          label="Data"
          value={store.imaging.date}
          onChange={(v) => store.setImaging({ date: v })}
        />
        <textarea
          placeholder="ECG: ritmo sinusal&#10;USG abd: esteatose hepática leve"
          value={store.imaging.entries}
          onChange={(e) => store.setImaging({ entries: e.target.value })}
          className="w-full h-20 px-2 py-[7px] border border-border-subtle rounded-[5px] bg-bg-2 text-text-primary font-sans text-xs resize-y leading-relaxed placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)]"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/consultation/exam-card.tsx src/components/consultation/exam-grid.tsx
git commit -m "feat: add ExamCard and ExamGrid with auto-calculations"
```

---

### Task 15: Build ClinicalSummary, SoapForm, HistoryForm (Column 3)

**Files:**
- Create: `src/components/consultation/clinical-summary.tsx`
- Create: `src/components/consultation/soap-form.tsx`
- Create: `src/components/consultation/history-form.tsx`

- [ ] **Step 1: Create clinical-summary.tsx with auto-generated tags**

```tsx
// src/components/consultation/clinical-summary.tsx
"use client";

import { useConsultationStore } from "@/stores/consultation-store";
import { SectionHeader } from "@/components/ui/section-header";
import { Tag } from "@/components/ui/tag";
import { getStatus } from "@/lib/reference-values";
import { EXAM_CARDS } from "@/lib/constants";
import type { StatusLevel } from "@/types";

function TagGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-2.5">
      <div className="text-[9px] font-semibold tracking-[0.08em] uppercase text-text-tertiary mb-[5px] flex items-center gap-[5px]">
        {label}
      </div>
      <div className="flex flex-wrap gap-[3px]">{children}</div>
    </div>
  );
}

const tagVariantFromStatus = (s: StatusLevel) => {
  if (s === "ok") return "ok" as const;
  if (s === "warn") return "warn" as const;
  if (s === "crit") return "crit" as const;
  return "empty" as const;
};

export function ClinicalSummary() {
  const { patient, vitals, problems, preventions, labs, calculations } = useConsultationStore();

  // Collect altered exams
  const alteredExams: { label: string; value: string; status: StatusLevel }[] = [];
  for (const card of EXAM_CARDS) {
    for (const field of card.fields) {
      if (field.auto) continue;
      const val = labs[field.key];
      if (!val) continue;
      const num = parseFloat(val);
      if (isNaN(num)) continue;
      const status = getStatus(field.key, num, patient.gender);
      if (status === "warn" || status === "crit") {
        alteredExams.push({ label: field.label, value: val, status });
      }
    }
  }

  return (
    <div className="mb-3.5">
      <SectionHeader label="Resumo Clínico" color="purple" />

      {/* Paciente */}
      {patient.name && (
        <TagGroup label="Paciente">
          <Tag variant="info">{patient.name}</Tag>
          {patient.age && <Tag variant="info">{patient.age} anos</Tag>}
          {patient.gender && <Tag variant="info">{patient.gender === "Masculino" ? "Masc." : patient.gender === "Feminino" ? "Fem." : "Outro"}</Tag>}
          {patient.race && <Tag variant="info">{patient.race}</Tag>}
        </TagGroup>
      )}

      {/* Vitais */}
      {(vitals.pas || vitals.peso) && (
        <TagGroup label="Vitais">
          {vitals.pas && vitals.pad && <Tag variant="info">PA {vitals.pas}/{vitals.pad}</Tag>}
          {vitals.fc && <Tag variant="info">FC {vitals.fc}</Tag>}
          {vitals.spo2 && <Tag variant="info">SpO₂ {vitals.spo2}%</Tag>}
          {vitals.temp && <Tag variant="info">T {vitals.temp}°C</Tag>}
          {calculations.imc && (
            <Tag variant={calculations.imc.value >= 30 ? "warn" : calculations.imc.value >= 25 ? "warn" : "ok"}>
              IMC {calculations.imc.value} — {calculations.imc.classification}
            </Tag>
          )}
        </TagGroup>
      )}

      {/* Problemas */}
      {problems.length > 0 && (
        <TagGroup label="Problemas Ativos">
          {problems.map((p) => (
            <Tag key={p} variant="crit">{p}</Tag>
          ))}
        </TagGroup>
      )}

      {/* Exames alterados */}
      {alteredExams.length > 0 && (
        <TagGroup label="Exames Alterados">
          {alteredExams.map((e) => (
            <Tag key={e.label} variant={tagVariantFromStatus(e.status)}>
              {e.label}: {e.value}
            </Tag>
          ))}
        </TagGroup>
      )}

      {/* Cálculos */}
      {(calculations.tfg || calculations.fib4 || calculations.rcv) && (
        <TagGroup label="Cálculos">
          {calculations.tfg && (
            <Tag variant="calc">TFG {calculations.tfg.value} — {calculations.tfg.stage}</Tag>
          )}
          {calculations.fib4 && (
            <Tag variant="calc">FIB-4 {calculations.fib4.value} — {calculations.fib4.risk}</Tag>
          )}
          {calculations.rcv && (
            <Tag variant={calculations.rcv.value >= 20 ? "crit" : calculations.rcv.value >= 10 ? "warn" : "ok"}>
              RCV {calculations.rcv.value}% — {calculations.rcv.risk}
            </Tag>
          )}
        </TagGroup>
      )}

      {/* Prevenções */}
      {preventions.length > 0 && (
        <TagGroup label="Prevenções em dia">
          {preventions.map((p) => (
            <Tag key={p} variant="ok">{p}</Tag>
          ))}
        </TagGroup>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create soap-form.tsx**

```tsx
// src/components/consultation/soap-form.tsx
"use client";

import { useConsultationStore } from "@/stores/consultation-store";
import { SectionHeader } from "@/components/ui/section-header";

const SOAP_FIELDS = [
  { key: "subjective" as const, label: "S — Subjetivo", placeholder: "Queixa principal, HDA..." },
  { key: "objective" as const, label: "O — Objetivo", placeholder: "Exame físico detalhado..." },
  { key: "assessment" as const, label: "A — Avaliação", placeholder: "Hipótese diagnóstica..." },
  { key: "plan" as const, label: "P — Plano", placeholder: "Conduta, encaminhamentos..." },
];

export function SoapForm() {
  const { soap, setSoap } = useConsultationStore();

  return (
    <div className="mb-3.5">
      <SectionHeader label="SOAP" color="blue" />
      {SOAP_FIELDS.map((f) => (
        <div key={f.key} className="mb-2">
          <label className="block text-[10.5px] text-text-tertiary mb-0.5 font-medium">
            {f.label}
          </label>
          <textarea
            placeholder={f.placeholder}
            value={soap[f.key]}
            onChange={(e) => setSoap({ [f.key]: e.target.value })}
            className="w-full h-16 px-2 py-[7px] border border-border-subtle rounded-[5px] bg-bg-2 text-text-primary font-sans text-xs resize-y leading-relaxed placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)]"
          />
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create history-form.tsx**

```tsx
// src/components/consultation/history-form.tsx
"use client";

import { useConsultationStore } from "@/stores/consultation-store";
import { SectionHeader } from "@/components/ui/section-header";

const HISTORY_FIELDS = [
  { key: "personal" as const, label: "Pessoais", placeholder: "Cirurgias, internações..." },
  { key: "family" as const, label: "Familiares", placeholder: "HAS, DM, CA..." },
  { key: "habits" as const, label: "Hábitos de vida", placeholder: "Etilismo, sedentarismo..." },
  { key: "medications" as const, label: "Medicamentos em uso", placeholder: "Metformina 850mg 2x/dia..." },
  { key: "allergies" as const, label: "Alergias", placeholder: "Penicilina, AAS..." },
  { key: "comorbidities" as const, label: "MUC / Morbidades", placeholder: "HAS estágio 2, DM2 em controle..." },
];

export function HistoryForm() {
  const { history, setHistory } = useConsultationStore();

  return (
    <div className="mb-3.5">
      <SectionHeader label="Antecedentes" color="amber" />
      {HISTORY_FIELDS.map((f) => (
        <div key={f.key} className="mb-2">
          <label className="block text-[10.5px] text-text-tertiary mb-0.5 font-medium">
            {f.label}
          </label>
          <textarea
            placeholder={f.placeholder}
            value={history[f.key]}
            onChange={(e) => setHistory({ [f.key]: e.target.value })}
            className="w-full h-14 px-2 py-[7px] border border-border-subtle rounded-[5px] bg-bg-2 text-text-primary font-sans text-xs resize-y leading-relaxed placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)]"
          />
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/consultation/
git commit -m "feat: add ClinicalSummary, SoapForm, HistoryForm components"
```

---

### Task 16: Build eSUS summary generator and clipboard utility

**Files:**
- Create: `src/lib/esus-generator.ts`
- Create: `src/lib/clipboard.ts`
- Create: `src/lib/utils.ts`

- [ ] **Step 1: Create utils.ts with date formatter**

```ts
// src/lib/utils.ts

/** Converte ISO date (YYYY-MM-DD) para DD/MM/AAAA */
export function formatDateBR(isoDate: string): string {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-");
  if (!y || !m || !d) return isoDate;
  return `${d}/${m}/${y}`;
}
```

- [ ] **Step 2: Create clipboard.ts**

```ts
// src/lib/clipboard.ts

/**
 * Copia texto para clipboard com fallback para document.execCommand.
 * Regra inegociável: copiar deve funcionar sempre.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallback below
  }

  // Fallback: execCommand
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}
```

- [ ] **Step 3: Create esus-generator.ts**

```ts
// src/lib/esus-generator.ts

import type { ConsultationState } from "@/types";
import { formatDateBR } from "./utils";
import { EXAM_CARDS } from "./constants";

/**
 * Gera o texto de resumo formatado para colar no eSUS PEC.
 * Texto gerado em tempo real a partir do estado da consulta.
 */
export function generateEsusSummary(state: ConsultationState): string {
  const lines: string[] = [];

  // LISTA DE PROBLEMAS
  const allProblems = [...state.problems];
  if (state.problemsOther.trim()) {
    allProblems.push(...state.problemsOther.split(",").map((s) => s.trim()).filter(Boolean));
  }
  if (allProblems.length > 0) {
    lines.push("LISTA DE PROBLEMAS");
    allProblems.forEach((p) => lines.push(`• ${p}`));
    lines.push("");
  }

  // ALERGIAS
  if (state.history.allergies.trim()) {
    lines.push("ALERGIAS");
    state.history.allergies.split("\n").filter(Boolean).forEach((a) => lines.push(`• ${a.trim()}`));
    lines.push("");
  }

  // PREVENÇÕES
  if (state.preventions.length > 0) {
    lines.push("PREVENÇÕES");
    state.preventions.forEach((p) => lines.push(`• ${p}`));
    lines.push("");
  }

  // RASTREAMENTOS
  const screenings: string[] = [];
  const dateLab = formatDateBR(state.labsDate);

  if (state.calculations.rcv) {
    screenings.push(`• RCV: ${state.calculations.rcv.value}% — Risco ${state.calculations.rcv.risk} (Framingham/SBC 2022)`);
  }
  if (state.calculations.tfg) {
    screenings.push(`• TFG (CKD-EPI 2021): ${state.calculations.tfg.value} mL/min — ${state.calculations.tfg.stage}${dateLab ? ` (${dateLab})` : ""}`);
  }
  if (state.calculations.fib4) {
    screenings.push(`• FIB-4: ${state.calculations.fib4.value} — ${state.calculations.fib4.risk}${dateLab ? ` (${dateLab})` : ""}`);
  }
  if (screenings.length > 0) {
    lines.push("RASTREAMENTOS");
    lines.push(...screenings);
    lines.push("");
  }

  // BIOQUÍMICA
  const labLines: string[] = [];
  for (const card of EXAM_CARDS) {
    const values = card.fields
      .filter((f) => !f.auto && state.labs[f.key])
      .map((f) => `${f.label}: ${state.labs[f.key]}`)
      .join(" ; ");
    if (values) labLines.push(`• ${values}`);
  }
  if (labLines.length > 0) {
    lines.push(`Bioquímica${dateLab ? ` (${dateLab})` : ""}:`);
    lines.push(...labLines);
    lines.push("");
  }

  // IMAGENS / OUTROS
  if (state.imaging.entries.trim()) {
    const imgDate = formatDateBR(state.imaging.date);
    lines.push(`Imagens / Outros${imgDate ? ` (${imgDate})` : ""}:`);
    state.imaging.entries.split("\n").filter(Boolean).forEach((e) => lines.push(`• ${e.trim()}`));
    lines.push("");
  }

  // MUC
  if (state.history.comorbidities.trim()) {
    lines.push("MUC");
    state.history.comorbidities.split("\n").filter(Boolean).forEach((m) => lines.push(`• ${m.trim()}`));
    lines.push("");
  }

  // DOENÇA ATUAL (SOAP)
  const hasSoap = state.soap.subjective || state.soap.objective || state.soap.assessment || state.soap.plan;
  if (hasSoap) {
    lines.push("DOENÇA ATUAL");
    if (state.soap.subjective) {
      lines.push("• História Clínica");
      lines.push(`  ${state.soap.subjective}`);
    }
    if (state.soap.objective) {
      lines.push("• Exame Físico");
      lines.push(`  ${state.soap.objective}`);
    }
    if (state.soap.assessment) {
      lines.push("• Hipótese Diagnóstica");
      lines.push(`  ${state.soap.assessment}`);
    }
    if (state.soap.plan) {
      lines.push("• Plano");
      lines.push(`  ${state.soap.plan}`);
    }
    lines.push("");
  }

  // ANTECEDENTES
  const antecedentes: string[] = [];
  if (state.history.personal.trim()) antecedentes.push(`• Pessoais: ${state.history.personal}`);
  if (state.history.family.trim()) antecedentes.push(`• Familiares: ${state.history.family}`);
  if (state.history.habits.trim()) antecedentes.push(`• Hábitos: ${state.history.habits}`);
  if (state.history.medications.trim()) {
    antecedentes.push("• Medicamentos em uso:");
    state.history.medications.split("\n").filter(Boolean).forEach((m) => antecedentes.push(`  - ${m.trim()}`));
  }
  if (antecedentes.length > 0) {
    lines.push("ANTECEDENTES");
    lines.push(...antecedentes);
    lines.push("");
  }

  // PRESCRIÇÃO
  if (state.prescription.trim()) {
    lines.push("PRESCRIÇÃO");
    state.prescription.split("\n").filter(Boolean).forEach((p, i) => lines.push(`${i + 1}. ${p.trim()}`));
    lines.push("");
  }

  // EXAMES SOLICITADOS
  if (state.requestedExams.trim()) {
    lines.push("EXAMES SOLICITADOS");
    lines.push(`• ${state.requestedExams}`);
    lines.push("");
  }

  // ORIENTAÇÕES
  if (state.patientInstructions.trim()) {
    lines.push("ORIENTAÇÕES");
    lines.push(state.patientInstructions);
    lines.push("");
  }

  return lines.join("\n").trimEnd();
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/
git commit -m "feat: add eSUS summary generator, clipboard utility, and date formatter"
```

---

### Task 17: Build Output Column (Column 4)

**Files:**
- Create: `src/components/consultation/output-column.tsx`

- [ ] **Step 1: Create output-column.tsx**

```tsx
// src/components/consultation/output-column.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useConsultationStore } from "@/stores/consultation-store";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { generateEsusSummary } from "@/lib/esus-generator";
import { copyToClipboard } from "@/lib/clipboard";
import { showToast } from "@/components/ui/toast";

export function OutputColumn() {
  const store = useConsultationStore();
  const [summary, setSummary] = useState("");
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Debounced summary generation (300ms)
  const generateSummary = useCallback(() => {
    const state = useConsultationStore.getState();
    return generateEsusSummary(state);
  }, []);

  useEffect(() => {
    const unsub = useConsultationStore.subscribe(() => {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setSummary(generateSummary());
      }, 300);
    });

    // Initial generation
    setSummary(generateSummary());

    return () => {
      unsub();
      clearTimeout(debounceRef.current);
    };
  }, [generateSummary]);

  const handleCopy = async () => {
    const ok = await copyToClipboard(summary);
    if (ok) {
      setCopied(true);
      showToast("Copiado!", "success");
      setTimeout(() => setCopied(false), 2000);
    } else {
      showToast("Erro ao copiar", "error");
    }
  };

  const handleGenerateFull = () => {
    if (editorRef.current) {
      editorRef.current.innerText = summary;
    }
  };

  return (
    <div>
      {/* eSUS Summary */}
      <SectionHeader label="Resumo eSUS PEC" color="cyan" />
      <pre className="bg-bg-1 border border-border-subtle border-l-[3px] border-l-[rgba(34,211,238,0.35)] rounded-lg p-[11px] font-mono text-[10.5px] leading-[1.9] text-text-primary min-h-[240px] whitespace-pre-wrap break-words mb-1">
        {summary || "Preencha os campos para gerar o resumo..."}
      </pre>
      <button
        onClick={handleCopy}
        className={`w-full h-[28px] mt-[5px] bg-transparent border rounded-[5px] text-xs cursor-pointer font-sans transition-all duration-150 flex items-center justify-center gap-1 ${
          copied
            ? "border-accent text-accent bg-accent-dim"
            : "border-border-default text-text-secondary hover:bg-bg-3 hover:text-text-primary hover:border-text-tertiary"
        }`}
      >
        {copied ? "Copiado!" : "Copiar para eSUS"}
      </button>

      {/* Editor */}
      <div className="mt-4">
        <SectionHeader label="Editor Livre" color="purple" />
        <div className="flex gap-0.5 mb-1">
          {["B", "I", "U"].map((cmd) => (
            <button
              key={cmd}
              onClick={() => document.execCommand(cmd === "B" ? "bold" : cmd === "I" ? "italic" : "underline")}
              className="w-[25px] h-[25px] border border-border-default rounded bg-bg-3 text-text-secondary cursor-pointer inline-flex items-center justify-center text-micro hover:bg-bg-3 hover:text-text-primary hover:border-text-tertiary transition-all duration-100"
              style={{ fontWeight: cmd === "B" ? 700 : undefined, fontStyle: cmd === "I" ? "italic" : undefined, textDecoration: cmd === "U" ? "underline" : undefined }}
            >
              {cmd}
            </button>
          ))}
        </div>
        <div
          ref={editorRef}
          contentEditable
          className="min-h-[150px] p-2.5 border border-border-subtle rounded-[5px] bg-bg-3 text-text-primary text-xs leading-[1.75] outline-none transition-[border] duration-150 focus:border-border-default"
        />
        <Button
          variant="primary"
          className="w-full mt-[5px] h-[31px] text-xs tracking-[0.02em]"
          onClick={handleGenerateFull}
        >
          Gerar prontuário completo
        </Button>
      </div>

      {/* Prescrição */}
      <div className="mt-4">
        <SectionHeader label="Prescrição" color="green" />
        <textarea
          placeholder="1. Metformina 850mg — 1cp 2x/dia&#10;2. Losartana 50mg — 1cp/dia"
          value={store.prescription}
          onChange={(e) => store.setPrescription(e.target.value)}
          className="w-full h-20 px-2 py-[7px] border border-border-subtle rounded-[5px] bg-bg-2 text-text-primary font-sans text-xs resize-y leading-relaxed placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)]"
        />
      </div>

      {/* Exames a Solicitar */}
      <div className="mt-4">
        <SectionHeader label="Exames a Solicitar" color="blue" />
        <textarea
          placeholder="HbA1c, lipidograma, TSH..."
          value={store.requestedExams}
          onChange={(e) => store.setRequestedExams(e.target.value)}
          className="w-full h-16 px-2 py-[7px] border border-border-subtle rounded-[5px] bg-bg-2 text-text-primary font-sans text-xs resize-y leading-relaxed placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)]"
        />
      </div>

      {/* Orientações */}
      <div className="mt-4">
        <SectionHeader label="Orientações ao Paciente" color="amber" />
        <textarea
          placeholder="Dieta hipossódica, atividade física 150min/semana..."
          value={store.patientInstructions}
          onChange={(e) => store.setPatientInstructions(e.target.value)}
          className="w-full h-16 px-2 py-[7px] border border-border-subtle rounded-[5px] bg-bg-2 text-text-primary font-sans text-xs resize-y leading-relaxed placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)]"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/consultation/output-column.tsx
git commit -m "feat: add OutputColumn with eSUS summary, editor, prescription, exams, orientations"
```

---

### Task 18: Build Topbar and assemble consultation page

**Files:**
- Create: `src/components/layout/topbar.tsx`
- Create: `src/app/(dashboard)/layout.tsx`
- Create: `src/app/(dashboard)/consulta/page.tsx`

- [ ] **Step 1: Create topbar.tsx**

```tsx
// src/components/layout/topbar.tsx
"use client";

import { BRAND } from "@/lib/branding";
import { Button } from "@/components/ui/button";
import { useConsultationStore } from "@/stores/consultation-store";
import { showToast } from "@/components/ui/toast";

const NAV_ITEMS = ["Consulta", "Prescrição", "Exames", "Atestados", "Laudos", "Orientações"];

export function Topbar() {
  const reset = useConsultationStore((s) => s.reset);

  return (
    <div className="bg-bg-1 border-b border-border-subtle flex items-center justify-between px-5 h-12 sticky top-0 z-50">
      <div className="flex items-center gap-5">
        {/* Logo */}
        <div className="flex items-center gap-[9px] font-bold text-md tracking-[-0.02em] text-text-primary">
          <div className="w-7 h-7 rounded-[7px] bg-accent flex items-center justify-center text-black text-sm font-extrabold font-mono tracking-[-0.04em] shrink-0">
            {BRAND.shortName}
          </div>
          {BRAND.name}
        </div>

        {/* Nav */}
        <div className="flex h-12 items-end">
          {NAV_ITEMS.map((item, i) => (
            <button
              key={item}
              className={`px-3 h-[44px] border-b-2 bg-transparent text-sm cursor-pointer font-sans transition-[color,border-color] duration-150 whitespace-nowrap ${
                i === 0
                  ? "text-text-primary font-medium border-b-accent"
                  : "text-text-secondary border-b-transparent hover:text-text-primary"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-1.5">
        <Button variant="secondary" onClick={() => { reset(); showToast("Nova consulta", "info"); }}>
          Nova consulta
        </Button>
        <Button variant="primary" onClick={() => showToast("Salvo!", "success")}>
          Salvar
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create dashboard layout.tsx**

```tsx
// src/app/(dashboard)/layout.tsx
import { Topbar } from "@/components/layout/topbar";
import { ToastProvider } from "@/components/ui/toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg-0">
      <Topbar />
      {children}
      <ToastProvider />
    </div>
  );
}
```

- [ ] **Step 3: Create consultation page with 4-column layout**

```tsx
// src/app/(dashboard)/consulta/page.tsx
"use client";

import { PatientInfo } from "@/components/consultation/patient-info";
import { ProblemList } from "@/components/consultation/problem-list";
import { VitalsForm } from "@/components/consultation/vitals-form";
import { PreventionList } from "@/components/consultation/prevention-list";
import { ExamGrid } from "@/components/consultation/exam-grid";
import { ClinicalSummary } from "@/components/consultation/clinical-summary";
import { SoapForm } from "@/components/consultation/soap-form";
import { HistoryForm } from "@/components/consultation/history-form";
import { OutputColumn } from "@/components/consultation/output-column";

export default function ConsultaPage() {
  return (
    <div className="grid grid-cols-[210px_1fr_250px_270px] h-[calc(100vh-48px)] overflow-hidden gap-px bg-border-subtle">
      {/* Column 1 — Identificação + Exame Físico */}
      <div className="overflow-y-auto bg-bg-0 p-[14px_12px]">
        <PatientInfo />
        <hr className="border-0 border-t border-border-subtle my-3" />
        <ProblemList />
        <hr className="border-0 border-t border-border-subtle my-3" />
        <VitalsForm />
        <hr className="border-0 border-t border-border-subtle my-3" />
        <PreventionList />
      </div>

      {/* Column 2 — Exames Complementares */}
      <div className="overflow-y-auto bg-bg-0 p-[14px_12px]">
        <ExamGrid />
      </div>

      {/* Column 3 — Resumo + SOAP + Antecedentes */}
      <div className="overflow-y-auto bg-bg-0 p-[14px_12px]">
        <ClinicalSummary />
        <hr className="border-0 border-t border-border-subtle my-3" />
        <SoapForm />
        <hr className="border-0 border-t border-border-subtle my-3" />
        <HistoryForm />
      </div>

      {/* Column 4 — Output */}
      <div className="overflow-y-auto bg-bg-0 p-[14px_12px]">
        <OutputColumn />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Update root page to redirect**

```tsx
// src/app/page.tsx
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/consulta");
}
```

- [ ] **Step 5: Verify full app runs**

```bash
npm run dev
```

Expected: App at localhost:3000 shows 4-column consultation screen with topbar, all forms interactive, auto-calculations working, eSUS summary generating.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: assemble consultation page with 4-column layout and topbar"
```

---

## Phase 6: Auth (Supabase)

### Task 19: Setup Supabase client and auth pages

**Files:**
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/middleware.ts`
- Create: `src/app/(auth)/layout.tsx`
- Create: `src/app/(auth)/login/page.tsx`
- Create: `src/app/(auth)/signup/page.tsx`
- Modify: `src/middleware.ts` (create at root of src)

- [ ] **Step 1: Install Supabase dependencies**

```bash
npm install @supabase/supabase-js @supabase/ssr
```

- [ ] **Step 2: Create .env.local template**

Create `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

- [ ] **Step 3: Create supabase/client.ts (browser client)**

```ts
// src/lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

- [ ] **Step 4: Create supabase/server.ts (server client)**

```ts
// src/lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from Server Component — ignore
          }
        },
      },
    }
  );
}
```

- [ ] **Step 5: Create supabase/middleware.ts and src/middleware.ts**

```ts
// src/lib/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/signup");

  if (!user && !isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/consulta";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
```

```ts
// src/middleware.ts
import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/webhooks).*)"],
};
```

- [ ] **Step 6: Create auth layout**

```tsx
// src/app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-0 flex items-center justify-center">
      {children}
    </div>
  );
}
```

- [ ] **Step 7: Create login page**

```tsx
// src/app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BRAND } from "@/lib/branding";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/consulta");
    router.refresh();
  };

  const handleMagicLink = async () => {
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setError("Link mágico enviado! Verifique seu email.");
    setLoading(false);
  };

  return (
    <div className="w-full max-w-sm bg-bg-1 border border-border-subtle rounded-lg p-8">
      <div className="flex items-center gap-2 mb-6 justify-center">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-black text-sm font-extrabold font-mono">
          {BRAND.shortName}
        </div>
        <span className="font-bold text-md text-text-primary">{BRAND.name}</span>
      </div>

      <form onSubmit={handleLogin} className="space-y-3">
        <Input
          label="Email"
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Senha"
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className={`text-xs ${error.includes("Link") ? "text-accent" : "text-status-crit"}`}>
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <button
        onClick={handleMagicLink}
        className="w-full mt-3 text-xs text-text-secondary hover:text-text-primary transition-colors bg-transparent border-none cursor-pointer"
        disabled={loading || !email}
      >
        Entrar com link mágico
      </button>

      <p className="text-xs text-text-tertiary text-center mt-4">
        Não tem conta?{" "}
        <a href="/signup" className="text-accent hover:underline">
          Criar conta
        </a>
      </p>
    </div>
  );
}
```

- [ ] **Step 8: Create signup page**

```tsx
// src/app/(auth)/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BRAND } from "@/lib/branding";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/consulta");
    router.refresh();
  };

  return (
    <div className="w-full max-w-sm bg-bg-1 border border-border-subtle rounded-lg p-8">
      <div className="flex items-center gap-2 mb-6 justify-center">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-black text-sm font-extrabold font-mono">
          {BRAND.shortName}
        </div>
        <span className="font-bold text-md text-text-primary">{BRAND.name}</span>
      </div>

      <form onSubmit={handleSignup} className="space-y-3">
        <Input
          label="Nome completo"
          id="name"
          placeholder="Dr. João Silva"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Email"
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Senha"
          id="password"
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        {error && <p className="text-xs text-status-crit">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Criando..." : "Criar conta — Trial 14 dias"}
        </Button>
      </form>

      <p className="text-xs text-text-tertiary text-center mt-4">
        Já tem conta?{" "}
        <a href="/login" className="text-accent hover:underline">
          Entrar
        </a>
      </p>
    </div>
  );
}
```

- [ ] **Step 9: Commit**

```bash
git add .
git commit -m "feat: add Supabase auth with login, signup, magic link, and middleware"
```

---

## Phase 7: Database (Supabase Migrations)

### Task 20: Create database migrations and RLS policies

**Files:**
- Create: `supabase/migrations/001_create_tables.sql`

- [ ] **Step 1: Install Supabase CLI (if not installed)**

```bash
npm install -D supabase
npx supabase init
```

- [ ] **Step 2: Create migration file**

```sql
-- supabase/migrations/001_create_tables.sql

-- Users (extends auth.users)
CREATE TABLE public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  crm text,
  specialty text DEFAULT 'MFC',
  subscription_status text DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'expired', 'cancelled')),
  trial_ends_at timestamptz,
  stripe_customer_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_read_own" ON public.users FOR SELECT USING (id = auth.uid());
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (id = auth.uid());

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, trial_ends_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Médico'),
    now() + interval '14 days'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Patients
CREATE TABLE public.patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  birth_date date,
  gender text,
  race text,
  cpf text,
  phone text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "patients_own_data" ON public.patients FOR ALL USING (user_id = auth.uid());

-- Consultations
CREATE TABLE public.consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES public.patients(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  vitals jsonb,
  problems text[],
  problems_other text,
  labs jsonb,
  labs_date date,
  imaging jsonb,
  calculations jsonb,
  subjective text,
  objective text,
  assessment text,
  plan text,
  history jsonb,
  preventions text[],
  prescription text,
  requested_exams text,
  patient_instructions text,
  esus_summary text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "consultations_own_data" ON public.consultations FOR ALL USING (user_id = auth.uid());

-- Indexes
CREATE INDEX idx_patients_user_id ON public.patients(user_id);
CREATE INDEX idx_consultations_user_id ON public.consultations(user_id);
CREATE INDEX idx_consultations_patient_id ON public.consultations(patient_id);
CREATE INDEX idx_consultations_date ON public.consultations(date DESC);
```

- [ ] **Step 3: Commit**

```bash
git add supabase/
git commit -m "feat: add database migrations with tables, RLS policies, and auto-profile trigger"
```

---

## Phase 8: Persistence (Save/Load)

### Task 21: Implement save/load consultations with auto-save

This task adds CRUD operations for consultations and a debounced auto-save mechanism.

**Files:**
- Create: `src/lib/supabase/consultations.ts`
- Modify: `src/stores/consultation-store.ts` (add save/load actions)
- Modify: `src/app/(dashboard)/consulta/page.tsx` (add auto-save hook)

- [ ] **Step 1: Create consultations.ts with CRUD**

```ts
// src/lib/supabase/consultations.ts
import { createClient } from "./client";
import type { ConsultationState } from "@/types";

const supabase = createClient();

export async function saveConsultation(userId: string, state: ConsultationState, consultationId?: string) {
  const data = {
    user_id: userId,
    date: state.patient.consultationDate || new Date().toISOString().split("T")[0],
    vitals: state.vitals,
    problems: state.problems,
    problems_other: state.problemsOther,
    labs: state.labs,
    labs_date: state.labsDate || null,
    imaging: state.imaging,
    calculations: state.calculations,
    subjective: state.soap.subjective,
    objective: state.soap.objective,
    assessment: state.soap.assessment,
    plan: state.soap.plan,
    history: state.history,
    preventions: state.preventions,
    prescription: state.prescription,
    requested_exams: state.requestedExams,
    patient_instructions: state.patientInstructions,
    esus_summary: "", // will be generated on demand
    updated_at: new Date().toISOString(),
  };

  if (consultationId) {
    return supabase.from("consultations").update(data).eq("id", consultationId).select().single();
  }

  return supabase.from("consultations").insert(data).select().single();
}

export async function loadConsultation(consultationId: string) {
  return supabase.from("consultations").select("*").eq("id", consultationId).single();
}

export async function listConsultations(userId: string) {
  return supabase
    .from("consultations")
    .select("id, date, created_at, problems, vitals")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(50);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/supabase/consultations.ts
git commit -m "feat: add consultation CRUD with Supabase"
```

---

## Phase 9: Stripe Integration

### Task 22: Setup Stripe checkout and webhooks

**Files:**
- Create: `src/app/api/webhooks/stripe/route.ts`
- Create: `src/lib/stripe.ts`

- [ ] **Step 1: Install Stripe**

```bash
npm install stripe
```

- [ ] **Step 2: Create stripe.ts utility**

```ts
// src/lib/stripe.ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});
```

- [ ] **Step 3: Create Stripe webhook route**

```ts
// src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const customerId = session.customer as string;
      const email = session.customer_email;

      if (email) {
        await supabase
          .from("users")
          .update({ subscription_status: "active", stripe_customer_id: customerId })
          .eq("email", email);
      }
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const customerId = subscription.customer as string;

      await supabase
        .from("users")
        .update({ subscription_status: "cancelled" })
        .eq("stripe_customer_id", customerId);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
```

- [ ] **Step 4: Add env variables template**

Add to `.env.local`:
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/stripe.ts src/app/api/webhooks/stripe/route.ts
git commit -m "feat: add Stripe webhook for subscription management"
```

---

## Phase 10: Polish

### Task 23: Add loading states, error boundaries, and responsive tweaks

**Files:**
- Create: `src/app/error.tsx`
- Create: `src/app/loading.tsx`
- Modify: `src/app/(dashboard)/consulta/page.tsx` (responsive breakpoints)

- [ ] **Step 1: Create error boundary**

```tsx
// src/app/error.tsx
"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-bg-0 flex items-center justify-center">
      <div className="bg-bg-1 border border-border-subtle rounded-lg p-8 max-w-md text-center">
        <h2 className="text-md text-text-primary font-semibold mb-2">Algo deu errado</h2>
        <p className="text-xs text-text-secondary mb-4">{error.message}</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-accent text-black rounded-[5px] text-sm font-bold cursor-pointer hover:bg-accent-hover"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create loading component**

```tsx
// src/app/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-bg-0 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
```

- [ ] **Step 3: Add responsive breakpoint to consultation page**

In `src/app/(dashboard)/consulta/page.tsx`, update the grid class:

```tsx
// Change:
// grid-cols-[210px_1fr_250px_270px]
// To support smaller screens:
<div className="grid grid-cols-[210px_1fr_250px_270px] xl:grid-cols-[210px_1fr_250px_270px] lg:grid-cols-2 h-[calc(100vh-48px)] overflow-hidden gap-px bg-border-subtle">
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add error boundary, loading state, and responsive breakpoints"
```

---

## Phase 11: CLAUDE.md

### Task 24: Create CLAUDE.md for the project

**Files:**
- Create: `CLAUDE.md` at project root

- [ ] **Step 1: Write CLAUDE.md**

Save the full project spec as CLAUDE.md at the project root for future reference by AI assistants.

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add CLAUDE.md project reference"
```
