# Fase 2 — Páginas de Marketing: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Pré-requisito:** Fase 1 concluída (`docs/superpowers/plans/2026-04-01-fase1-design-system-aura-clinica.md`).

**Goal:** Reescrever as 4 páginas públicas (Homepage, Funcionalidades, Planos, Segurança) e os componentes compartilhados (Navbar, Footer) com base no design Aura Clínica do Stitch.

**Architecture:** Todos Server Components (exceto Navbar que usa `usePathname`). Conteúdo textual atual preservado, layout e visual inteiramente substituídos. `CheckoutButton` mantém lógica, só atualiza estilo.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS v4, tokens Aura Clínica (Fase 1), `BRAND` de `@/lib/branding`

**Spec:** `docs/superpowers/specs/2026-04-01-aura-clinica-migration-design.md` — Fase 2

---

## Arquivo Map

| Arquivo | Ação |
|---|---|
| `src/components/landing/navbar.tsx` | Reescrever — Aura Clínica |
| `src/components/landing/footer.tsx` | Reescrever — Aura Clínica |
| `src/components/landing/checkout-button.tsx` | Atualizar tokens |
| `src/app/page.tsx` | Reescrever — Homepage Stitch |
| `src/app/funcionalidades/page.tsx` | Reescrever — Funcionalidades Stitch |
| `src/app/planos/page.tsx` | Reescrever — Planos Stitch |
| `src/app/seguranca/page.tsx` | Reescrever — Segurança Stitch |

---

## Task 1: LandingNavbar — Aura Clínica

**Files:**
- Modify: `src/components/landing/navbar.tsx`

- [ ] **Step 1: Substituir o arquivo completo**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/branding";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Funcionalidades", href: "/funcionalidades" },
  { label: "Planos", href: "/planos" },
  { label: "Segurança", href: "/seguranca" },
  { label: "FAQ", href: "/faq" },
];

export function LandingNavbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-surface-lowest/90 backdrop-blur-md border-b border-outline-variant/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 bg-primary rounded flex items-center justify-center text-on-primary text-sm font-bold">
            M
          </span>
          <span className="font-headline text-xl font-semibold text-primary">
            {BRAND.name}
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm tracking-wide transition-colors duration-200 ${
                pathname === link.href
                  ? "text-primary font-bold border-b-2 border-primary pb-0.5"
                  : "text-secondary hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <Link
              href="/consulta"
              className="px-6 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-semibold rounded-lg text-sm transition-all shadow-sm"
            >
              Ir para o consultório
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-primary hover:bg-surface-container-low font-medium text-sm rounded transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-semibold rounded-lg text-sm transition-all shadow-sm active:scale-95"
              >
                Começar teste grátis
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
          aria-label="Menu"
        >
          <span className={`w-5 h-0.5 bg-on-surface transition-transform ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-5 h-0.5 bg-on-surface transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`w-5 h-0.5 bg-on-surface transition-transform ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface-lowest border-t border-outline-variant/10 px-6 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block py-2 text-[15px] ${
                pathname === link.href
                  ? "text-primary font-medium"
                  : "text-on-surface-variant"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-outline-variant/10 space-y-2">
            {isLoggedIn ? (
              <Link
                href="/consulta"
                className="block text-center px-5 py-2.5 bg-primary text-on-primary font-semibold rounded-lg text-sm"
              >
                Ir para o consultório
              </Link>
            ) : (
              <>
                <Link href="/login" className="block text-center py-2 text-on-surface-variant text-sm">
                  Entrar
                </Link>
                <Link
                  href="/signup"
                  className="block text-center px-5 py-2.5 bg-primary text-on-primary font-semibold rounded-lg text-sm"
                >
                  Começar teste grátis
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
```

- [ ] **Step 2: Verificar build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/navbar.tsx
git commit -m "feat(landing): LandingNavbar Aura Clínica"
```

---

## Task 2: LandingFooter e CheckoutButton

**Files:**
- Modify: `src/components/landing/footer.tsx`
- Modify: `src/components/landing/checkout-button.tsx`

- [ ] **Step 1: Substituir footer.tsx**

```tsx
import Link from "next/link";
import { BRAND } from "@/lib/branding";

const FOOTER_SECTIONS = [
  {
    title: "Produto",
    links: [
      { label: "Funcionalidades", href: "/funcionalidades" },
      { label: "Planos", href: "/planos" },
      { label: "Segurança", href: "/seguranca" },
    ],
  },
  {
    title: "Suporte",
    links: [
      { label: "Central de Ajuda", href: "mailto:contato@medmate.com.br" },
      { label: "FAQ", href: "/faq" },
      { label: "Contato", href: "mailto:contato@medmate.com.br" },
    ],
  },
  {
    title: "Jurídico",
    links: [
      { label: "Termos de Uso", href: "/politica-de-privacidade" },
      { label: "Privacidade", href: "/politica-de-privacidade" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="bg-surface-low">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 bg-primary rounded flex items-center justify-center text-on-primary text-xs font-bold">
                M
              </span>
              <span className="font-headline text-lg font-semibold text-primary">
                {BRAND.name}
              </span>
            </div>
            <p className="text-[13px] text-on-surface-variant leading-relaxed max-w-[240px]">
              Excelência em documentação clínica para APS. Tecnologia pensada por médicos para médicos.
            </p>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="text-[11px] font-semibold text-on-surface-muted uppercase tracking-wider mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-on-surface-variant hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-on-surface-muted">
            &copy; {new Date().getFullYear()} {BRAND.name}. Em conformidade com a LGPD.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Substituir checkout-button.tsx**

```tsx
"use client";

import { useState } from "react";

export function LandingCheckoutButton({ className = "" }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // Silently fail — user can retry
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={`px-5 py-3 bg-primary hover:bg-primary-container text-on-primary font-semibold rounded-lg text-[14px] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95 ${className}`}
    >
      {loading ? "Redirecionando..." : "Assinar agora"}
    </button>
  );
}
```

- [ ] **Step 3: Verificar build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/footer.tsx src/components/landing/checkout-button.tsx
git commit -m "feat(landing): Footer e CheckoutButton Aura Clínica"
```

---

## Task 3: Homepage (`/`)

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Substituir o arquivo completo**

```tsx
import Link from "next/link";
import { BRAND } from "@/lib/branding";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";

const PAIN_POINTS = [
  {
    icon: "description",
    title: "Informação Dispersa",
    desc: "Dados espalhados entre anotações soltas e planilhas. Tempo que deveria ser gasto com o paciente vai para a burocracia digital na APS.",
  },
  {
    icon: "warning",
    title: "Atrito no eSUS PEC",
    desc: "A interface oficial do eSUS PEC é essencial para o registro médico, mas não foi pensada para agilizar o fluxo clínico do MFC.",
  },
  {
    icon: "psychology",
    title: "Fadiga Cognitiva",
    desc: "Dezenas de telas e formulários demandam energia e reduzem a atenção ao paciente. O MedMate resolve isso de forma diferente.",
  },
];

const FEATURES = [
  {
    title: "Identificação e sinais vitais",
    desc: "Cadastro rápido com IMC, TFG e RCV calculados automaticamente enquanto você digita.",
  },
  {
    title: "SOAP estruturado",
    desc: "Nota SOAP com suporte a templates e snippets reutilizáveis para agilizar o registro clínico.",
  },
  {
    title: "Monitoramento longitudinal",
    desc: "Acompanhamento de métricas com sparklines e histórico de consultas por paciente.",
  },
  {
    title: "Resumo pronto para o eSUS PEC",
    desc: "Um clique gera o texto formatado. Sem retrabalho, sem digitação dupla.",
  },
  {
    title: "Rastreamento preventivo",
    desc: "Checklist de prevenção alinhado com o Ministério da Saúde e calendário vacinal.",
  },
  {
    title: "Cálculos clínicos integrados",
    desc: "IMC, TFG CKD-EPI 2021, FIB-4 e RCV Framingham — no fluxo, sem calculadoras externas.",
  },
];

const FLOW_STEPS = [
  { num: "01", title: "Selecione o paciente", desc: "Busca por nome ou CPF. Dados da última consulta carregam automaticamente." },
  { num: "02", title: "Preencha vitais e contexto clínico", desc: "Sinais vitais, problemas ativos e exames — cálculos automáticos em tempo real." },
  { num: "03", title: "Estruture o SOAP e a conduta", desc: "Nota SOAP com templates. Prescrição, exames e orientações em seções separadas." },
  { num: "04", title: "Copie para o eSUS PEC", desc: "Resumo formatado em um clique. Documentação completa em segundos." },
];

export default async function LandingPage() {
  let isLoggedIn = false;
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    isLoggedIn = !!user;
  } catch {
    // Not logged in
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <LandingNavbar isLoggedIn={isLoggedIn} />

      {/* Hero */}
      <section className="relative pt-24 pb-20 md:pt-36 md:pb-32 overflow-hidden bg-surface">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 relative z-10">
            <span className="inline-block px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-full text-[11px] font-black tracking-[0.2em] uppercase mb-8 border border-primary/5">
              Projetado para Médicos da APS
            </span>
            <h1 className="font-headline text-5xl md:text-6xl xl:text-7xl font-medium text-primary leading-[1.05] mb-6">
              Organize a consulta. Gere o resumo pronto para o eSUS PEC.
            </h1>
            <p className="text-lg text-secondary leading-relaxed max-w-xl mb-10 font-light">
              {BRAND.name} é o workspace clínico definitivo para a Atenção Primária. Automatize métricas, organize o SOAP e exporte a documentação estruturada direto para o eSUS PEC em segundos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={isLoggedIn ? "/consulta" : "/signup"}
                className="px-8 py-4 bg-primary hover:bg-primary-container text-on-primary font-bold text-base rounded-lg shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:-translate-y-0.5 transition-all active:scale-95 text-center"
              >
                {isLoggedIn ? "Ir para o consultório" : "Começar teste grátis"}
              </Link>
              <Link
                href="/funcionalidades"
                className="px-8 py-4 bg-surface-lowest border border-outline-variant/30 text-primary font-bold text-base rounded-lg hover:bg-surface-container transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                Ver demonstração
              </Link>
            </div>
            {!isLoggedIn && (
              <p className="text-[11px] font-bold text-on-surface-muted uppercase tracking-widest mt-4">
                14 dias grátis — sem cartão de crédito.
              </p>
            )}
          </div>

          {/* Product mockup */}
          <div className="lg:col-span-7 relative">
            <div className="absolute -inset-4 bg-primary-container/5 rounded-[2.5rem] blur-3xl" />
            <div className="relative bg-surface-lowest rounded-xl shadow-[0_32px_64px_-16px_rgba(1,45,29,0.12)] border border-outline-variant/20 overflow-hidden flex flex-col aspect-[4/3] max-h-[520px]">
              {/* Mockup header */}
              <div className="bg-surface-low px-5 py-4 border-b border-outline-variant/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-xs font-bold">MS</div>
                  <div>
                    <p className="text-xs font-bold text-primary">Maria Silva dos Santos</p>
                    <p className="text-[10px] text-secondary">Feminino, 58 anos • HAS • DM2</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <span className="px-2 py-0.5 bg-status-crit-bg text-status-crit text-[9px] font-bold rounded uppercase">Hipertensa</span>
                  <span className="px-2 py-0.5 bg-status-info-bg text-status-info text-[9px] font-bold rounded uppercase">Diabética</span>
                </div>
              </div>
              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-1/3 border-r border-outline-variant/10 bg-surface-lowest p-5 space-y-5">
                  <div>
                    <p className="text-[9px] font-bold text-primary/40 uppercase tracking-widest mb-3">Sinais Vitais</p>
                    <div className="space-y-2">
                      {[["PA", "132/84"], ["IMC", "24.2"], ["FC", "72 bpm"]].map(([label, value]) => (
                        <div key={label} className="flex justify-between items-center p-2 bg-surface rounded border border-primary/5">
                          <span className="text-[10px] font-semibold text-secondary">{label}</span>
                          <span className="text-xs font-bold text-primary">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-primary/40 uppercase tracking-widest mb-2">Problemas</p>
                    <ul className="text-[10px] space-y-1.5 text-primary font-medium">
                      <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-primary/40" /> HAS Estágio 1</li>
                      <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-primary/40" /> DM Tipo 2</li>
                    </ul>
                  </div>
                </div>
                {/* Editor */}
                <div className="flex-1 flex flex-col bg-surface-lowest">
                  <div className="p-5 border-b border-outline-variant/10 flex-1">
                    <p className="text-[9px] font-bold text-primary/40 uppercase tracking-widest mb-4">SOAP</p>
                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] font-bold text-primary uppercase block mb-1">Subjetivo</span>
                        <p className="text-[11px] text-secondary italic border-l-2 border-primary/20 pl-2">
                          Paciente refere cefaleia occipital ocasional...
                        </p>
                      </div>
                      <div className="h-10 bg-surface rounded border border-dashed border-outline-variant/40 flex items-center justify-center text-[10px] text-on-surface-muted italic">
                        Toque para preencher exame físico
                      </div>
                    </div>
                  </div>
                  <div className="p-5 bg-primary/[0.02]">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[9px] font-bold text-primary uppercase tracking-widest">Resumo Pronto para eSUS</p>
                      <button className="bg-primary text-on-primary text-[8px] px-2.5 py-1 rounded font-bold uppercase tracking-wider">Copiar</button>
                    </div>
                    <div className="bg-surface-lowest p-2.5 rounded border border-primary/10 text-[9px] font-mono text-primary leading-relaxed">
                      <p># SUBJETIVO: Pct c/ cefaleia occipital...</p>
                      <p># OBJETIVO: PA 132/84 mmHg, IMC 24.2...</p>
                      <p># AVALIAÇÃO: HAS (I10) controlada...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-24 bg-surface-low">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-headline text-4xl text-primary mb-16 font-medium">
            Por que o MFC precisa de uma ferramenta melhor?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {PAIN_POINTS.map((p) => (
              <div key={p.title} className="bg-surface-lowest p-8 rounded-xl">
                <span className="material-symbols-outlined text-3xl text-primary mb-4 block">{p.icon}</span>
                <h3 className="font-headline text-xl text-primary font-semibold mb-3">{p.title}</h3>
                <p className="text-secondary leading-relaxed text-sm">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-headline text-4xl text-primary mb-4 font-medium">Os 6 Pilares do {BRAND.name}</h2>
          <p className="text-secondary text-lg mb-16 max-w-2xl">
            Cada funcionalidade foi pensada para a realidade clínica da APS brasileira.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((f) => (
              <div key={f.title} className="p-6 bg-surface-lowest rounded-xl border border-outline-variant/20">
                <h3 className="font-headline text-lg text-primary font-semibold mb-2">{f.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flow */}
      <section className="py-24 bg-surface-low">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-headline text-4xl text-primary mb-16 font-medium">Como funciona</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {FLOW_STEPS.map((s) => (
              <div key={s.num}>
                <span className="font-headline text-5xl text-primary/10 font-medium block mb-4">{s.num}</span>
                <h3 className="font-headline text-lg text-primary font-semibold mb-2">{s.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-primary-container">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-headline text-4xl md:text-5xl text-surface-lowest font-medium mb-6">
            Pronto para transformar sua consulta?
          </h2>
          <p className="text-on-primary-container text-lg mb-10">
            14 dias grátis. Sem cartão de crédito. Cancele quando quiser.
          </p>
          <Link
            href={isLoggedIn ? "/consulta" : "/signup"}
            className="inline-block px-10 py-4 bg-surface-lowest text-primary font-bold text-base rounded-lg hover:bg-surface transition-all active:scale-95"
          >
            {isLoggedIn ? "Ir para o consultório" : "Começar teste grátis"}
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
```

Nota: o componente usa `material-symbols-outlined` (carregado via Google Fonts no `layout.tsx`). Adicionar ao `layout.tsx` se não estiver presente:

```tsx
// Em src/app/layout.tsx, dentro de <head> via metadata ou como link direto no RootLayout:
// Adicionar após as fontes existentes no layout:
<link
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
  rel="stylesheet"
/>
```

Para isso, converter RootLayout para exportar `<html>` com um link adicional no `<head>`, ou adicionar via `metadata.other`. A forma mais simples no Next.js App Router é via tag `<link>` no `layout.tsx`:

```tsx
// src/app/layout.tsx — adicionar dentro do <html> antes do <body>:
<head>
  <link
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
    rel="stylesheet"
  />
</head>
```

- [ ] **Step 2: Adicionar Material Symbols ao layout.tsx**

Em `src/app/layout.tsx`, adicionar `<head>` com o link do Material Symbols entre `<html>` e `<body>`:

```tsx
return (
  <html lang="pt-BR" className={`${publicSans.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}>
    <head>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        rel="stylesheet"
      />
    </head>
    <body>{children}</body>
  </html>
);
```

- [ ] **Step 3: Verificar build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/app/layout.tsx
git commit -m "feat(landing): Homepage Aura Clínica com mockup do produto"
```

---

## Task 4: Funcionalidades (`/funcionalidades`)

**Files:**
- Modify: `src/app/funcionalidades/page.tsx`

- [ ] **Step 1: Substituir o arquivo completo**

```tsx
import Link from "next/link";
import { BRAND } from "@/lib/branding";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";

const PILLARS = [
  {
    icon: "person",
    title: "Identificação e sinais vitais",
    desc: "Cadastro completo com cálculo automático de IMC, TFG e alertas clínicos por valores de referência.",
    detail: "PA, FC, peso, altura, temperatura — tudo calculado e contextualizado em tempo real conforme você digita.",
  },
  {
    icon: "list_alt",
    title: "Problemas ativos e contexto clínico",
    desc: "Lista longitudinal de problemas com pré-carga da última consulta e rastreio histórico.",
    detail: "Evolução clínica com histórico por problema. Sugestões baseadas no perfil do paciente.",
  },
  {
    icon: "science",
    title: "Exames e monitoramento",
    desc: "Resultados com destaque para valores fora de referência. Sparklines de tendência ao longo do tempo.",
    detail: "Lipidograma, função renal (TFG), glicemia, hemograma — com valores por faixa etária e sexo.",
  },
  {
    icon: "calculate",
    title: "Cálculos automáticos no fluxo",
    desc: "IMC, TFG (CKD-EPI 2021), RCV (Framingham) e FIB-4 calculados automaticamente na consulta.",
    detail: "Sem calculadoras externas. Resultados contextuais, no momento certo.",
  },
  {
    icon: "edit_note",
    title: "SOAP e antecedentes",
    desc: "Nota SOAP estruturada com suporte a templates e snippets reutilizáveis.",
    detail: "Conduta, prescrição e encaminhamentos em seções separadas. Exportação automática formatada.",
  },
  {
    icon: "content_paste_go",
    title: "Resumo pronto para o eSUS PEC",
    desc: "Consolida todos os dados em texto estruturado, pronto para copiar para o prontuário oficial.",
    detail: "Um clique gera o texto formatado. Sem retrabalho, sem digitação dupla.",
  },
];

const FLOW_STEPS = [
  { num: "01", title: "Organize os dados da consulta", desc: "Selecione o paciente. Dados da última consulta carregam automaticamente com alertas ativos." },
  { num: "02", title: "Revise exames e métricas", desc: "Visualize tendências em sparklines e histórico clínico longitudinal com precisão." },
  { num: "03", title: "Estruture SOAP e conduta", desc: "Raciocínio clínico com cálculos automáticos de risco e scores integrados." },
  { num: "04", title: "Copie o resumo para o eSUS PEC", desc: "Um clique gera o texto formatado. O resumo PEC está pronto em segundos." },
];

export default async function FuncionalidadesPage() {
  let isLoggedIn = false;
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    isLoggedIn = !!user;
  } catch {
    // Not logged in
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <LandingNavbar isLoggedIn={isLoggedIn} />

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-32 bg-surface">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-xl">
            <h1 className="font-headline text-5xl md:text-6xl text-primary leading-tight italic font-medium mb-6">
              Funcionalidades pensadas para o fluxo real da APS.
            </h1>
            <p className="text-lg text-secondary leading-relaxed mb-10">
              Otimize sua consulta na Atenção Primária: registro clínico estruturado, cálculos automáticos e um resumo pronto para o eSUS PEC em um único clique.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={isLoggedIn ? "/consulta" : "/signup"}
                className="px-8 py-4 bg-primary hover:bg-primary-container text-on-primary font-semibold rounded-lg transition-all active:scale-95"
              >
                Começar teste grátis
              </Link>
              <Link
                href="/planos"
                className="px-8 py-4 border border-outline text-primary font-semibold rounded-lg hover:bg-surface-container transition-all active:scale-95"
              >
                Ver planos
              </Link>
            </div>
          </div>

          {/* Mockup badge */}
          <div className="relative hidden lg:block">
            <div className="bg-surface-lowest rounded-xl border border-outline-variant/20 shadow-[0_24px_48px_-12px_rgba(1,45,29,0.10)] p-8">
              <div className="absolute -bottom-6 -left-6 bg-secondary-container p-5 rounded-lg shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-on-secondary-container text-lg">monitor_heart</span>
                  <span className="font-label text-[10px] uppercase tracking-widest text-on-secondary-container font-semibold">Sinais Vitais</span>
                </div>
                <div className="font-headline text-xl text-on-secondary-container">120/80 mmHg</div>
                <div className="text-[10px] text-on-secondary-container/70">Pressão Arterial • Estável</div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "IMC", value: "24.2", status: "Ideal" },
                  { label: "TFG", value: "78 mL/min", status: "Normal" },
                  { label: "RCV", value: "8%", status: "Baixo" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-primary/5">
                    <span className="text-sm font-semibold text-secondary">{item.label}</span>
                    <div className="text-right">
                      <span className="text-sm font-bold text-primary">{item.value}</span>
                      <span className="text-[10px] text-status-ok ml-2">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Pillars */}
      <section className="bg-surface-low py-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-20">
            <h2 className="font-headline text-4xl text-primary mb-4 font-medium">Os 6 Pilares do {BRAND.name}</h2>
            <p className="text-on-surface-variant text-lg max-w-2xl">
              Cada módulo foi desenhado para a realidade clínica da APS brasileira.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PILLARS.map((p) => (
              <div key={p.title} className="bg-surface-lowest p-8 rounded-xl">
                <span className="material-symbols-outlined text-3xl text-primary mb-4 block">{p.icon}</span>
                <h3 className="font-headline text-xl text-primary font-semibold mb-2">{p.title}</h3>
                <p className="text-secondary text-sm leading-relaxed mb-3">{p.desc}</p>
                <p className="text-on-surface-muted text-xs leading-relaxed italic">{p.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flow */}
      <section className="py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="font-headline text-4xl text-primary mb-20 font-medium">
            Do atendimento ao eSUS em 4 passos.
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {FLOW_STEPS.map((s) => (
              <div key={s.num}>
                <span className="font-headline text-6xl text-primary/10 font-medium block mb-4">{s.num}</span>
                <h3 className="font-headline text-lg text-primary font-semibold mb-2">{s.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-surface-low">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <h2 className="font-headline text-3xl text-primary font-medium mb-6">
            Experimente gratuitamente por 14 dias.
          </h2>
          <Link
            href={isLoggedIn ? "/consulta" : "/signup"}
            className="inline-block px-10 py-4 bg-primary hover:bg-primary-container text-on-primary font-bold text-base rounded-lg transition-all active:scale-95"
          >
            {isLoggedIn ? "Ir para o consultório" : "Começar teste grátis"}
          </Link>
        </div>
      </section>

      <LandingFooter />
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
git add src/app/funcionalidades/page.tsx
git commit -m "feat(landing): Funcionalidades Aura Clínica"
```

---

## Task 5: Planos (`/planos`)

**Files:**
- Modify: `src/app/planos/page.tsx`

- [ ] **Step 1: Substituir o arquivo completo**

```tsx
import Link from "next/link";
import { BRAND } from "@/lib/branding";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { LandingCheckoutButton } from "@/components/landing/checkout-button";

const PLAN_FEATURES = [
  "Resumo pronto para o eSUS PEC",
  "Calculadoras clínicas no fluxo",
  "Organização de consultas e SOAP",
  "Histórico e antecedentes rápidos",
  "Sinais vitais e gráficos de tendência",
  "Uso em qualquer navegador",
  "Suporte técnico dedicado",
  "Segurança com criptografia e LGPD",
];

const VALUE_ITEMS = [
  { icon: "verified_user", text: "Cancelamento instantâneo em um clique." },
  { icon: "lock", text: "Em conformidade com a LGPD." },
  { icon: "update", text: "Novas funcionalidades sem custo adicional." },
];

const FAQS = [
  {
    q: "Preciso de cartão de crédito para testar?",
    a: "Não. O trial de 14 dias é completamente gratuito, sem necessidade de cartão de crédito.",
  },
  {
    q: "Posso cancelar a qualquer momento?",
    a: "Sim. O cancelamento é instantâneo via portal de assinatura. Sem taxas ou multas.",
  },
  {
    q: "O MedMate funciona em qualquer dispositivo?",
    a: "Sim. Roda diretamente no navegador — Chrome, Edge, Safari. Sem instalação.",
  },
  {
    q: "Meus dados ficam salvos?",
    a: "Sim. Consultas, pacientes e histórico são salvos automaticamente em nuvem com criptografia.",
  },
];

export default async function PlanosPage() {
  let isLoggedIn = false;
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    isLoggedIn = !!user;
  } catch {
    // Not logged in
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <LandingNavbar isLoggedIn={isLoggedIn} />

      {/* Hero */}
      <section className="relative pt-24 pb-32 overflow-hidden px-6 bg-surface">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <span className="text-secondary font-medium tracking-widest text-xs uppercase mb-6 block">
            Assinatura Simplificada
          </span>
          <h1 className="font-headline italic text-5xl md:text-7xl text-primary leading-[1.1] max-w-4xl mb-8">
            Um plano simples para a rotina real da APS.
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed mb-12">
            {BRAND.name} foi desenhado para médicos da Atenção Primária que precisam organizar a consulta, automatizar métricas e gerar documentação com excelência no fluxo do eSUS PEC.
          </p>
          {!isLoggedIn && (
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Link
                href="/signup"
                className="px-8 py-4 bg-primary hover:bg-primary-container text-on-primary font-semibold text-lg rounded-lg transition-all shadow-lg shadow-primary/10 active:scale-95"
              >
                Começar teste grátis
              </Link>
              <Link
                href="/funcionalidades"
                className="px-8 py-4 bg-surface-highest text-on-surface-variant font-semibold text-lg rounded-lg hover:bg-surface-dim transition-all active:scale-95"
              >
                Ver demonstração
              </Link>
            </div>
          )}
        </div>
        {/* Background decorations */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary-container/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 -left-24 w-64 h-64 bg-primary-container/10 rounded-full blur-[100px] pointer-events-none" />
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 bg-surface-low">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left: value prop */}
            <div className="lg:col-span-5">
              <h2 className="font-headline text-4xl md:text-5xl text-primary mb-6">
                Investimento único,<br />foco total no paciente.
              </h2>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
                Um único plano com todas as funcionalidades liberadas. Sem módulos extras, sem taxas escondidas.
              </p>
              <div className="space-y-4">
                {VALUE_ITEMS.map((item) => (
                  <div key={item.text} className="flex items-center gap-4 text-secondary">
                    <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: pricing card */}
            <div className="lg:col-span-7">
              <div className="bg-surface-lowest p-8 md:p-12 rounded-xl shadow-[0_24px_48px_-12px_rgba(1,45,29,0.10)] border border-outline-variant/20 relative">
                <div className="absolute top-0 right-12 transform -translate-y-1/2 bg-primary text-on-primary px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded-full">
                  Plano Médico APS
                </div>
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-10 gap-4">
                  <div>
                    <h3 className="font-headline text-3xl text-primary mb-2">Médico APS</h3>
                    <p className="text-on-surface-variant text-sm">Acesso ilimitado a todas as ferramentas.</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-secondary font-medium text-[11px] mb-1 italic">Comece com 14 dias grátis.</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-primary">R$ 49</span>
                      <span className="text-on-surface-variant text-sm">/mês</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-10">
                  {PLAN_FEATURES.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-secondary text-xl shrink-0">check_circle</span>
                      <span className="text-on-surface text-sm leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>

                {isLoggedIn ? (
                  <LandingCheckoutButton className="w-full py-5 text-lg font-bold" />
                ) : (
                  <Link
                    href="/signup"
                    className="w-full block text-center py-5 bg-primary hover:bg-primary-container text-on-primary font-bold text-lg rounded-lg transition-all shadow-lg shadow-primary/10 active:scale-95"
                  >
                    Começar teste grátis
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-headline text-4xl text-primary font-medium text-center mb-16">
            Perguntas Frequentes
          </h2>
          <div className="space-y-6">
            {FAQS.map((faq) => (
              <div key={faq.q} className="pb-6 border-b border-outline-variant/20">
                <h3 className="font-headline text-xl text-primary font-medium mb-3">{faq.q}</h3>
                <p className="text-secondary leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LandingFooter />
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
git add src/app/planos/page.tsx
git commit -m "feat(landing): Planos Aura Clínica com card de pricing"
```

---

## Task 6: Segurança (`/seguranca`)

**Files:**
- Modify: `src/app/seguranca/page.tsx`

- [ ] **Step 1: Substituir o arquivo completo**

```tsx
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";

const PILLARS = [
  {
    icon: "content_paste_go",
    title: "Resumo pronto para o eSUS PEC",
    desc: "Segurança é não perder tempo. Copie sua evolução estruturada e cole diretamente no prontuário oficial com total integridade clínica.",
  },
  {
    icon: "fingerprint",
    title: "Rastreabilidade Ética",
    desc: "Acesso individual para cada médico. Sua responsabilidade técnica protegida por credenciais exclusivas e não compartilháveis.",
  },
  {
    icon: "cloud_done",
    title: "Navegador e Nuvem",
    desc: "Acesse em qualquer unidade de saúde via Chrome ou Edge. Sem rastros locais, dados protegidos em servidores de alta segurança.",
  },
  {
    icon: "inventory_2",
    title: "Organização Clínica Real",
    desc: "Interface que guia seu raciocínio. Menos chance de erro, mais qualidade no registro médico para a Atenção Primária.",
  },
  {
    icon: "gavel",
    title: "Conformidade LGPD",
    desc: "Tratamento de dados sensíveis seguindo rigorosamente a legislação brasileira e os preceitos do sigilo médico.",
  },
  {
    icon: "bolt",
    title: "Rapidez sem Compromisso",
    desc: "Projetado para consultas de alto volume na APS, onde a segurança do registro não pode ser sacrificada pela pressa.",
  },
];

const FAQS = [
  {
    q: "Meus dados ficam protegidos?",
    a: "Sim. Utilizamos criptografia em trânsito (TLS) e em repouso para todos os dados clínicos. Acesso isolado por conta médica — nenhum dado é compartilhado entre usuários.",
  },
  {
    q: "O MedMate substitui o eSUS PEC?",
    a: "Não. O MedMate complementa o eSUS PEC. Você estrutura a consulta aqui e cola o resumo gerado automaticamente no prontuário oficial. Nenhum dado é enviado ao eSUS sem sua ação explícita.",
  },
  {
    q: "O MedMate está em conformidade com a LGPD?",
    a: "Sim. Seguimos rigorosamente a Lei Geral de Proteção de Dados. Seus dados são tratados com base legal adequada e você tem direito à portabilidade e exclusão.",
  },
  {
    q: "Onde os dados são armazenados?",
    a: "Em servidores seguros com backups automáticos. Utilizamos infraestrutura com certificação SOC 2 e isolamento de dados por conta médica via Row Level Security.",
  },
];

export default async function SegurancaPage() {
  let isLoggedIn = false;
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    isLoggedIn = !!user;
  } catch {
    // Not logged in
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <LandingNavbar isLoggedIn={isLoggedIn} />

      {/* Hero */}
      <header className="relative pt-20 pb-16 overflow-hidden bg-surface">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-headline text-5xl lg:text-6xl text-primary font-medium tracking-tight mb-6 leading-[1.1]">
              Segurança e seriedade no registro clínico.
            </h1>
            <p className="text-lg text-secondary max-w-xl mb-10 leading-relaxed">
              O {`MedMate`} foi desenhado para médicos da <strong>Atenção Primária</strong> que buscam conformidade ética e produtividade. Garantia de sigilo de dados e um <strong>resumo pronto para o eSUS PEC</strong> em segundos.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={isLoggedIn ? "/consulta" : "/signup"}
                className="px-8 py-4 bg-primary hover:bg-primary-container text-on-primary font-semibold rounded-lg transition-all active:scale-95"
              >
                Começar teste grátis
              </Link>
              <Link
                href="/funcionalidades"
                className="px-8 py-4 bg-surface-highest text-on-surface-variant font-semibold rounded-lg hover:bg-surface-dim transition-colors active:scale-95"
              >
                Ver demonstração
              </Link>
            </div>
          </div>

          {/* Security badge mockup */}
          <div className="relative hidden lg:block">
            <div className="bg-primary rounded-2xl p-8 shadow-2xl shadow-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-secondary-container text-2xl">verified_user</span>
                <span className="text-on-primary-container text-sm font-semibold uppercase tracking-widest">Workspace Protegido</span>
              </div>
              <p className="text-on-primary-container/80 text-sm leading-relaxed">
                Dados criptografados e fluxos otimizados para a rotina da <strong className="text-on-primary-container">APS</strong>. Isolamento por conta médica via Row Level Security.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { icon: "lock", label: "TLS 1.3" },
                  { icon: "shield", label: "LGPD" },
                  { icon: "storage", label: "Backups diários" },
                  { icon: "key", label: "RLS ativo" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 bg-surface-lowest/10 rounded-lg p-3">
                    <span className="material-symbols-outlined text-secondary-container text-lg">{item.icon}</span>
                    <span className="text-on-primary-container text-xs font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Pillars */}
      <section className="py-24 bg-surface-low">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {PILLARS.map((p) => (
              <div key={p.title} className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-surface-lowest rounded-lg flex items-center justify-center shadow-sm border border-outline-variant/20">
                  <span className="material-symbols-outlined text-primary text-3xl">{p.icon}</span>
                </div>
                <h3 className="font-headline text-2xl text-primary font-semibold">{p.title}</h3>
                <p className="text-secondary leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote section */}
      <section className="py-24 bg-surface-lowest">
        <div className="max-w-7xl mx-auto px-8">
          <div className="bg-primary rounded-[2rem] p-12 lg:p-16 relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <span className="text-secondary-container font-semibold tracking-widest text-sm uppercase mb-6 block">
                Credibilidade Médica
              </span>
              <h2 className="font-headline text-4xl lg:text-5xl text-on-primary font-medium mb-8 leading-tight">
                Criado por médico para a realidade de outros médicos na APS.
              </h2>
              <p className="text-on-primary-container/80 text-lg leading-relaxed font-light italic mb-8">
                &ldquo;Entendo a fricção do eSUS PEC e a pressão de uma agenda lotada. O MedMate não nasceu em um laboratório de software, mas dentro de uma Unidade Básica de Saúde, para resolver a dor de quem precisa documentar com excelência em um cenário de alta demanda.&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">stethoscope</span>
                </div>
                <div>
                  <p className="text-on-primary font-semibold">Equipe MedMate</p>
                  <p className="text-on-primary-container/70 text-sm">Médicos de Família e Comunidade</p>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-surface-lowest/5 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-surface-lowest/5 rounded-full blur-3xl -ml-48 -mb-48" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-surface">
        <div className="max-w-3xl mx-auto px-8">
          <h2 className="font-headline text-4xl text-primary font-medium text-center mb-16">
            Dúvidas Frequentes
          </h2>
          <div className="space-y-6">
            {FAQS.map((faq) => (
              <div key={faq.q} className="pb-6 border-b border-outline-variant/20">
                <h3 className="font-headline text-xl text-primary font-medium mb-3">{faq.q}</h3>
                <p className="text-secondary leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LandingFooter />
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
git add src/app/seguranca/page.tsx
git commit -m "feat(landing): Segurança Aura Clínica com pillars e quote"
```

---

## Task 7: Build final e verificação visual

**Files:** nenhum arquivo novo

- [ ] **Step 1: Build de produção**

```bash
npm run build
```

Esperado: `✓ Compiled successfully`. Zero erros TypeScript.

- [ ] **Step 2: Servidor de desenvolvimento**

```bash
npm run dev
```

Verificar visualmente cada página:
- `http://localhost:3000` — Homepage com mockup do produto
- `http://localhost:3000/funcionalidades` — 6 pilares com grid Aura Clínica
- `http://localhost:3000/planos` — Card de pricing com features
- `http://localhost:3000/seguranca` — Pillars + quote do fundador + FAQ

Confirmar em cada página:
- Navbar sticky com logo `M` verde e Newsreader
- Fundo `#f5fafe` (levemente azulado)
- Botões primários `#012d1d` com texto branco
- Inputs/links sem bordas desnecessárias
- Material Symbols carregados (ícones visíveis)

- [ ] **Step 3: Commit final da fase**

```bash
git add -A
git commit -m "feat: Fase 2 completa — páginas de marketing Aura Clínica"
```
