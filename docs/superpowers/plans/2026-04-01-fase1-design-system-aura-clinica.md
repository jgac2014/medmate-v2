# Fase 1 — Design System Aura Clínica: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o design system atual pelos tokens Aura Clínica (light mode, Newsreader + Public Sans), mantendo backward-compat para as classes antigas durante a transição das Fases 2 e 3.

**Architecture:** `globals.css` recebe os novos tokens Aura Clínica em `:root` + aliases backward-compat que mapeiam os nomes antigos para os novos valores. Os 9 componentes em `src/components/ui/` são atualizados para usar os novos nomes diretamente. O restante do app continua funcionando via aliases até Fase 3.

**Tech Stack:** Next.js 16, Tailwind CSS v4 (configurado via `globals.css`), `next/font/google`

**Spec:** `docs/superpowers/specs/2026-04-01-aura-clinica-migration-design.md` — Fase 1

---

## Arquivo Map

| Arquivo | Ação |
|---|---|
| `src/app/globals.css` | Substituir `:root` e `@theme inline` — tokens Aura Clínica + aliases compat |
| `src/app/layout.tsx` | Trocar `Inter` por `Public_Sans` + adicionar `Newsreader` |
| `src/components/ui/button.tsx` | Atualizar tokens |
| `src/components/ui/input.tsx` | Atualizar tokens |
| `src/components/ui/exam-input.tsx` | Atualizar tokens |
| `src/components/ui/date-input.tsx` | Atualizar tokens |
| `src/components/ui/tag.tsx` | Atualizar tokens |
| `src/components/ui/checkbox-item.tsx` | Atualizar tokens |
| `src/components/ui/section-header.tsx` | Atualizar tokens |
| `src/components/ui/toast.tsx` | Atualizar tokens |
| `src/components/ui/sparkline.tsx` | Atualizar token de cor default |

---

## Task 1: Tokens CSS — globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Substituir o bloco `:root` e `@theme inline` completo**

Abra `src/app/globals.css` e substitua todo o conteúdo pelo seguinte:

```css
@import "tailwindcss";

/* ─────────────────────────────────────────
   Aura Clínica — Design System Tokens
   ───────────────────────────────────────── */
:root {
  /* Superfícies */
  --surface:              #f5fafe;
  --surface-low:          #eff4f8;
  --surface-container:    #e9eff2;
  --surface-high:         #e3e9ec;
  --surface-highest:      #dee3e7;
  --surface-lowest:       #ffffff;
  --surface-dim:          #d5dbde;

  /* Texto */
  --on-surface:           #171c1f;
  --on-surface-variant:   #414844;
  --on-surface-muted:     #6d7a6e;

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

  /* Erro */
  --error:                #ba1a1a;
  --error-container:      #ffdad6;
  --on-error-container:   #93000a;

  /* Status clínico */
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

  /* ── Backward-compat aliases (remover após Fase 3) ── */
  --bg-0: var(--surface-lowest);
  --bg-1: var(--surface-low);
  --bg-2: var(--surface-container);
  --bg-3: var(--surface-high);
  --border-subtle: var(--outline-variant);
  --border-default: var(--outline);
  --border-focus: var(--primary);
  --text-primary: var(--on-surface);
  --text-secondary: var(--on-surface-variant);
  --text-tertiary: var(--on-surface-muted);
  --accent: var(--primary);
  --accent-hover: var(--primary-container);
  --accent-dim: rgba(1, 45, 29, 0.06);
  --accent-light: var(--secondary);
}

@theme inline {
  /* Novas cores Aura Clínica */
  --color-surface: var(--surface);
  --color-surface-low: var(--surface-low);
  --color-surface-container: var(--surface-container);
  --color-surface-high: var(--surface-high);
  --color-surface-highest: var(--surface-highest);
  --color-surface-lowest: var(--surface-lowest);
  --color-surface-dim: var(--surface-dim);

  --color-on-surface: var(--on-surface);
  --color-on-surface-variant: var(--on-surface-variant);
  --color-on-surface-muted: var(--on-surface-muted);

  --color-primary: var(--primary);
  --color-primary-container: var(--primary-container);
  --color-on-primary: var(--on-primary);
  --color-on-primary-container: var(--on-primary-container);

  --color-secondary: var(--secondary);
  --color-secondary-container: var(--secondary-container);
  --color-on-secondary: var(--on-secondary);
  --color-on-secondary-container: var(--on-secondary-container);

  --color-outline: var(--outline);
  --color-outline-variant: var(--outline-variant);

  --color-error: var(--error);
  --color-error-container: var(--error-container);
  --color-on-error-container: var(--on-error-container);

  /* Status clínico */
  --color-status-ok: var(--status-ok);
  --color-status-warn: var(--status-warn);
  --color-status-crit: var(--status-crit);
  --color-status-info: var(--status-info);
  --color-status-calc: var(--status-calc);
  --color-status-misc: var(--status-misc);
  --color-status-ok-bg: var(--status-ok-bg);
  --color-status-warn-bg: var(--status-warn-bg);
  --color-status-crit-bg: var(--status-crit-bg);
  --color-status-info-bg: var(--status-info-bg);
  --color-status-calc-bg: var(--status-calc-bg);
  --color-status-misc-bg: var(--status-misc-bg);

  /* Backward-compat — tokens antigos (remover após Fase 3) */
  --color-bg-0: var(--bg-0);
  --color-bg-1: var(--bg-1);
  --color-bg-2: var(--bg-2);
  --color-bg-3: var(--bg-3);
  --color-border-subtle: var(--border-subtle);
  --color-border-default: var(--border-default);
  --color-border-focus: var(--border-focus);
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-tertiary: var(--text-tertiary);
  --color-accent: var(--accent);
  --color-accent-hover: var(--accent-hover);
  --color-accent-dim: var(--accent-dim);
  --color-accent-light: var(--accent-light);

  /* Fontes */
  --font-sans: "Public Sans", system-ui, sans-serif;
  --font-headline: "Newsreader", Georgia, serif;
  --font-mono: "JetBrains Mono", monospace;
}

body {
  background: var(--surface);
  color: var(--on-surface);
  font-size: 14px;
  line-height: 1.6;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-thumb { background: var(--outline-variant); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--outline); }
::-webkit-scrollbar-track { background: transparent; }

/* Selection */
::selection { background: rgba(1, 45, 29, 0.12); }
```

- [ ] **Step 2: Verificar build**

```bash
cd "Ferramenta Medica/Ferramenta Medica/MedMate/medmate-app" && npm run build
```

Esperado: build completo sem erros TypeScript. Se houver warnings de CSS, ignorar — são esperados durante a transição.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: tokens Aura Clínica em globals.css + aliases backward-compat"
```

---

## Task 2: Tipografia — layout.tsx

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Substituir o arquivo completo**

```tsx
import type { Metadata } from "next";
import { Newsreader, Public_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-headline",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MedMate — Documente consultas no eSUS mais rápido",
  description:
    "Prontuário eletrônico para médicos de família. Consulta estruturada, cálculos automáticos e texto pronto para colar no eSUS PEC.",
  openGraph: {
    title: "MedMate — Documente consultas no eSUS mais rápido",
    description:
      "Estrutura clínica, cálculos automáticos e texto pronto para colar no eSUS PEC. Menos digitação, mais tempo com o paciente.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${publicSans.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Verificar build**

```bash
npm run build
```

Esperado: build sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: tipografia Aura Clínica — Public Sans + Newsreader + JetBrains Mono"
```

---

## Task 3: Button component

**Files:**
- Modify: `src/components/ui/button.tsx`

- [ ] **Step 1: Substituir o arquivo**

```tsx
"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary font-semibold hover:bg-primary-container active:scale-[0.98]",
  secondary:
    "bg-surface-highest text-on-surface-variant hover:bg-surface-high hover:text-on-surface",
  ghost:
    "bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`px-3.5 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
```

- [ ] **Step 2: Verificar build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/button.tsx
git commit -m "feat(ui): Button com tokens Aura Clínica"
```

---

## Task 4: Input component

**Files:**
- Modify: `src/components/ui/input.tsx`

- [ ] **Step 1: Substituir o arquivo**

```tsx
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
            className="block text-[13px] text-on-surface-variant mb-1 font-medium"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`w-full h-[40px] px-3.5 border-0 border-b-2 border-outline-variant/40 rounded-none bg-transparent text-on-surface font-sans text-[14px] transition-all duration-150 placeholder:text-on-surface-muted focus:outline-none focus:border-primary read-only:text-status-calc read-only:cursor-default read-only:font-mono ${className}`}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";
```

- [ ] **Step 2: Verificar build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/input.tsx
git commit -m "feat(ui): Input com bottom-stroke Aura Clínica"
```

---

## Task 5: ExamInput component

**Files:**
- Modify: `src/components/ui/exam-input.tsx`

- [ ] **Step 1: Substituir o arquivo**

```tsx
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
    void unit;

    return (
      <div className="flex items-center gap-[3px] mb-1">
        <span className="text-[10px] text-on-surface-variant flex-1 whitespace-nowrap">
          {label}
        </span>
        <input
          ref={ref}
          className={`w-[58px] h-[22px] px-1 border border-outline-variant/40 rounded-[3px] bg-surface-container text-on-surface font-mono text-[10px] text-right transition-[border,color,background] duration-150 focus:outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(1,45,29,0.08)] tabular-nums ${
            auto
              ? "bg-status-calc-bg text-status-calc cursor-default border-[rgba(0,131,143,0.25)] font-semibold"
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

- [ ] **Step 2: Verificar build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/exam-input.tsx
git commit -m "feat(ui): ExamInput com tokens Aura Clínica"
```

---

## Task 6: DateInput component

**Files:**
- Modify: `src/components/ui/date-input.tsx`

- [ ] **Step 1: Substituir o arquivo**

```tsx
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
          <label className="block text-[10.5px] text-on-surface-muted mb-0.5 font-medium">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-[29px] px-2 border-0 border-b border-outline-variant/40 bg-transparent text-on-surface font-sans text-xs transition-[border,box-shadow] duration-150 focus:outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(1,45,29,0.08)] ${className}`}
          {...props}
        />
      </div>
    );
  }
);
DateInput.displayName = "DateInput";
```

- [ ] **Step 2: Verificar build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/date-input.tsx
git commit -m "feat(ui): DateInput com bottom-stroke Aura Clínica"
```

---

## Task 7: Tag component

**Files:**
- Modify: `src/components/ui/tag.tsx`

- [ ] **Step 1: Substituir o arquivo**

```tsx
type TagVariant = "ok" | "warn" | "crit" | "info" | "calc" | "misc" | "empty" | "medication";

const variantStyles: Record<TagVariant, string> = {
  ok:         "bg-status-ok-bg text-status-ok border border-status-ok/20",
  warn:       "bg-status-warn-bg text-status-warn border border-status-warn/20",
  crit:       "bg-status-crit-bg text-status-crit border border-status-crit/20",
  info:       "bg-status-info-bg text-status-info border border-status-info/20",
  calc:       "bg-status-calc-bg text-status-calc border border-status-calc/20",
  misc:       "bg-status-misc-bg text-status-misc border border-status-misc/20",
  empty:      "bg-surface-high text-on-surface-muted border border-dashed border-outline-variant",
  medication: "bg-secondary-container text-on-secondary-container",
};

interface TagProps {
  variant?: TagVariant;
  children: React.ReactNode;
}

export function Tag({ variant = "empty", children }: TagProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-[2px] rounded-full text-[10.5px] font-medium tracking-[0.01em] ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 2: Verificar build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/tag.tsx
git commit -m "feat(ui): Tag com tokens Aura Clínica + variant medication"
```

---

## Task 8: CheckboxItem component

**Files:**
- Modify: `src/components/ui/checkbox-item.tsx`

- [ ] **Step 1: Substituir o arquivo**

```tsx
"use client";

interface CheckboxItemProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function CheckboxItem({ label, checked, onChange }: CheckboxItemProps) {
  return (
    <label className="flex items-center gap-1.5 text-xs cursor-pointer text-on-surface-variant px-1 py-[3px] rounded hover:bg-surface-container hover:text-on-surface transition-all duration-100">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-3 h-3 accent-primary"
      />
      {label}
    </label>
  );
}
```

- [ ] **Step 2: Verificar build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/checkbox-item.tsx
git commit -m "feat(ui): CheckboxItem com tokens Aura Clínica"
```

---

## Task 9: SectionHeader component

**Files:**
- Modify: `src/components/ui/section-header.tsx`

- [ ] **Step 1: Substituir o arquivo**

```tsx
type SectionColor = "blue" | "red" | "amber" | "green" | "cyan" | "purple";

const colorMap: Record<SectionColor, string> = {
  blue:   "bg-status-info",
  red:    "bg-status-crit",
  amber:  "bg-status-warn",
  green:  "bg-status-ok",
  cyan:   "bg-status-calc",
  purple: "bg-status-misc",
};

interface SectionHeaderProps {
  label: string;
  color: SectionColor;
}

export function SectionHeader({ label, color }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 text-[10.5px] font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-3">
      <span
        className={`w-[3px] h-[14px] rounded-sm shrink-0 ${colorMap[color]}`}
      />
      {label}
    </div>
  );
}
```

Nota: removida a `border-b` — segue a regra "No-Line" do Aura Clínica. Separação passa a ser feita por espaçamento.

- [ ] **Step 2: Verificar build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/section-header.tsx
git commit -m "feat(ui): SectionHeader sem border-b (regra No-Line Aura Clínica)"
```

---

## Task 10: Toast component

**Files:**
- Modify: `src/components/ui/toast.tsx`

- [ ] **Step 1: Substituir o arquivo**

```tsx
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
  success: "border-primary",
  error:   "border-error",
  info:    "border-status-info",
};

const textColors = {
  success: "text-primary",
  error:   "text-error",
  info:    "text-status-info",
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
      className={`fixed bottom-4 right-4 bg-surface-highest/90 backdrop-blur-xl border ${borderColors[toast.type]} ${textColors[toast.type]} px-4 py-2 rounded-lg text-xs font-medium tracking-[0.01em] z-[9999] transition-all duration-200 ${
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

- [ ] **Step 2: Verificar build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/toast.tsx
git commit -m "feat(ui): Toast com glassmorphism Aura Clínica"
```

---

## Task 11: Sparkline component

**Files:**
- Modify: `src/components/ui/sparkline.tsx`

- [ ] **Step 1: Alterar apenas o valor default de `color`**

Na linha 12 do arquivo atual, alterar:
```tsx
// DE:
export function Sparkline({ data, width = 120, height = 32, color = "var(--color-accent)", label, unit }: SparklineProps) {

// PARA:
export function Sparkline({ data, width = 120, height = 32, color = "var(--color-secondary)", label, unit }: SparklineProps) {
```

Também atualizar as classes de texto:
- `text-text-tertiary` → `text-on-surface-muted`
- `text-text-primary` → `text-on-surface`
- `text-text-tertiary` (unit) → `text-on-surface-muted`

Resultado final do arquivo:

```tsx
"use client";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  label: string;
  unit: string;
}

export function Sparkline({ data, width = 120, height = 32, color = "var(--color-secondary)", label, unit }: SparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;

  const pointsArr = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return { x, y };
  });

  const points = pointsArr.map((p) => `${p.x},${p.y}`).join(" ");
  const last = data[data.length - 1];
  const lastPoint = pointsArr[pointsArr.length - 1];

  return (
    <div className="flex items-center gap-2">
      <div className="min-w-0">
        <p className="text-[10px] text-on-surface-muted truncate">{label}</p>
        <p className="text-[13px] font-semibold text-on-surface tabular-nums">
          {last} <span className="text-[10px] font-normal text-on-surface-muted">{unit}</span>
        </p>
      </div>
      <svg width={width} height={height} className="shrink-0">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />
        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r="2.5"
          fill={color}
        />
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Verificar build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/sparkline.tsx
git commit -m "feat(ui): Sparkline com cor secondary Aura Clínica"
```

---

## Task 12: Build final e verificação

**Files:** nenhum arquivo novo

- [ ] **Step 1: Build completo de produção**

```bash
npm run build
```

Esperado: `✓ Compiled successfully`. Zero erros TypeScript.

- [ ] **Step 2: Iniciar dev e inspecionar visualmente**

```bash
npm run dev
```

Abrir `http://localhost:3000` e verificar:
- Fundo da página: `#f5fafe` (levemente azulado, não branco puro)
- Texto principal: `#171c1f` (quase preto, não puro)
- Botões primários: `#012d1d` (verde escuro) com texto branco
- Inputs: sem borda full — apenas linha inferior
- SectionHeaders: sem border-b inferior

- [ ] **Step 3: Commit final da fase**

```bash
git add -A
git commit -m "feat: Fase 1 completa — design system Aura Clínica"
```
