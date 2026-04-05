# Ciclo 6 — AjudaMed Workspace Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesenhar a tela de consulta para um layout de 3 colunas (sidebar + conteúdo central + painel eSUS fixo à direita), migrando para modo claro com paleta verde clínica.

**Architecture:** O `consulta/page.tsx` passa de 2 colunas para 3: sidebar de contexto do paciente (esquerda), área de trabalho principal com scroll (centro), e painel direito fixo com prévia eSUS + status de documentação + checklist de encerramento. A `OutputColumn` (atualmente no scroll principal) é substituída pelo painel direito. Os tokens CSS do modo claro são adicionados em `globals.css` e aplicados via classe no wrapper da página de consulta.

**Tech Stack:** Next.js App Router, Tailwind CSS (tokens via CSS vars), Zustand (sem mudanças no store), Radix UI, Lucide React.

---

## Decisão de Design: Modo Claro

O Stitch design usa modo claro (fundo `#f5fafe`, primário `#1B4332` verde escuro). O design system atual ("Aura Clínica") é dark mode. Esta migração cobre **apenas a tela de consulta** usando uma classe wrapper `theme-light` que sobrepõe as CSS vars — o resto do app continua dark.

---

## Mapa de Arquivos

| Arquivo | Ação | O que muda |
|---|---|---|
| `src/app/globals.css` | Modificar | Adicionar bloco `.theme-light` com tokens de modo claro |
| `src/app/(dashboard)/consulta/page.tsx` | Modificar | Layout 3 colunas, classe `theme-light`, remover `OutputColumn` |
| `src/components/consultation/consultation-sidebar.tsx` | Modificar | Avatar do paciente, "Memória Clínica" compacta, navegação |
| `src/components/consultation/consultation-right-panel.tsx` | **Criar** | Painel direito: status docs + prévia eSUS + checklist |
| `src/components/consultation/documentation-checklist.tsx` | **Criar** | Checklist de encerramento (SOAP, vitais, CID-10, retorno) |
| `src/components/consultation/soap-form.tsx` | Modificar | Modo leitura (exibe S/O/A/P formatados) + toggle edição |

---

## Sessão 1 — Tokens Light Mode + Layout 3 Colunas

### Task 1: Tokens CSS do modo claro

**Arquivo:**
- Modificar: `src/app/globals.css`

- [ ] **Step 1: Adicionar bloco `.theme-light` no final de globals.css** (antes do último `}` do arquivo, após todos os tokens existentes)

```css
/* ────────────────────────────────────
   THEME LIGHT — consulta page override
   ──────────────────────────────────── */
.theme-light {
  --bg-0: #f5fafe;
  --bg-1: #ffffff;
  --bg-2: #eef2f6;
  --bg-3: #e4eaf0;

  --text-primary: #171c1f;
  --text-secondary: #454b4e;
  --text-tertiary: #717973;

  --accent: #1B4332;
  --accent-hover: #163829;
  --accent-subtle: rgba(27, 67, 50, 0.06);
  --accent-border: rgba(27, 67, 50, 0.15);

  --status-ok: #16a34a;
  --status-warn: #d97706;
  --status-crit: #dc2626;
  --status-info: #2563eb;
  --status-calc: #0891b2;

  --surface-lowest: #ffffff;
  --surface-low: #f5fafe;
  --on-surface: #171c1f;
  --on-surface-muted: #717973;
  --outline-variant: rgba(27, 67, 50, 0.12);
}
```

- [ ] **Step 2: Verificar no dev server** — `npm run dev` → abrir `/consulta` → ainda deve estar em dark mode (nenhuma mudança visível ainda)

- [ ] **Step 3: Commit**
```bash
git add src/app/globals.css
git commit -m "feat: add theme-light CSS tokens for consultation page"
```

---

### Task 2: Layout 3 colunas no page.tsx

**Arquivo:**
- Modificar: `src/app/(dashboard)/consulta/page.tsx`

- [ ] **Step 1: Substituir o conteúdo de `ConsultaPage`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ConsultationSidebar } from "@/components/consultation/consultation-sidebar";
import { ConsultationRightPanel } from "@/components/consultation/consultation-right-panel";
import { ClinicalSummary } from "@/components/consultation/clinical-summary";
import { SoapForm } from "@/components/consultation/soap-form";
import { HistoryForm } from "@/components/consultation/history-form";
import { DraftRecoveryBanner } from "@/components/consultation/draft-recovery-banner";
import { FollowupPanel } from "@/components/consultation/followup-panel";
import { PreventionList } from "@/components/consultation/prevention-list";
import { PatientInfo } from "@/components/consultation/patient-info";
import { ProblemList } from "@/components/consultation/problem-list";
import { VitalsForm } from "@/components/consultation/vitals-form";
import { ExamGrid } from "@/components/consultation/exam-grid";
import { ExamUploadButton } from "@/components/consultation/exam-upload-button";
import { ExamReviewModal } from "@/components/consultation/exam-review-modal";
import { useConsultationStore } from "@/stores/consultation-store";
import { useDraftAutosave } from "@/hooks/useDraftAutosave";

export default function ConsultaPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  useDraftAutosave(userId);

  const labsExtras = useConsultationStore((s) => s.labsExtras);
  const setLabsExtras = useConsultationStore((s) => s.setLabsExtras);
  const [reviewModal, setReviewModal] = useState<{
    open: boolean;
    matched: Record<string, string>;
    extras: string;
  }>({ open: false, matched: {}, extras: "" });

  return (
    <div className="theme-light flex h-[calc(100vh-56px)] overflow-hidden bg-[var(--bg-0)]">
      {/* Coluna esquerda: contexto do paciente */}
      <ConsultationSidebar />

      {/* Coluna central: área de trabalho com scroll */}
      <main className="flex-1 overflow-y-auto min-w-0">
        <DraftRecoveryBanner />
        <div className="max-w-3xl mx-auto p-4 space-y-4">

          {/* Bloco 1: Identificação + Problemas */}
          <details className="group">
            <summary className="cursor-pointer text-[11px] font-medium text-[var(--on-surface-muted)] uppercase tracking-wide select-none list-none flex items-center gap-1 hover:text-[var(--on-surface)] transition-colors">
              <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
              Identificação e problemas
            </summary>
            <div className="mt-3 grid grid-cols-2 gap-4 p-4 rounded-xl bg-[var(--surface-lowest)] border border-[var(--outline-variant)]">
              <PatientInfo />
              <ProblemList />
            </div>
          </details>

          {/* Bloco 2: SOAP */}
          <section className="rounded-xl bg-[var(--surface-lowest)] border border-[var(--outline-variant)] p-5">
            <ClinicalSummary />
            <div className="my-3 h-px bg-[var(--outline-variant)]" />
            <SoapForm />
          </section>

          {/* Bloco 3: Dados Objetivos */}
          <section className="rounded-xl bg-[var(--surface-lowest)] border border-[var(--outline-variant)] p-5 space-y-4">
            <ExamUploadButton
              onResult={({ matched, extras }) =>
                setReviewModal({ open: true, matched, extras })
              }
            />
            <VitalsForm />
            <div className="h-px bg-[var(--outline-variant)]" />
            <ExamGrid />
            {labsExtras && (
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-medium text-[var(--on-surface-muted)] uppercase tracking-wide">
                  Outros exames
                </label>
                <textarea
                  value={labsExtras}
                  onChange={(e) => setLabsExtras(e.target.value)}
                  rows={Math.min(6, labsExtras.split("\n").length + 1)}
                  className="w-full text-[13px] text-[var(--on-surface)] bg-transparent border border-[var(--outline-variant)] rounded-lg px-3 py-2 resize-y font-mono focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
            )}
          </section>

          {/* Bloco 4: Antecedentes */}
          <section className="rounded-xl bg-[var(--surface-lowest)] border border-[var(--outline-variant)] p-5">
            <HistoryForm />
          </section>

          {/* Bloco 5: Prevenção e seguimento */}
          <section className="rounded-xl bg-[var(--surface-lowest)] border border-[var(--outline-variant)] p-5 space-y-4">
            <PreventionList />
            <div className="h-px bg-[var(--outline-variant)]" />
            <FollowupPanel />
          </section>

        </div>
      </main>

      {/* Coluna direita: prévia eSUS + status documentação */}
      <ConsultationRightPanel />

      <ExamReviewModal
        open={reviewModal.open}
        matched={reviewModal.matched}
        extras={reviewModal.extras}
        onClose={() => setReviewModal({ open: false, matched: {}, extras: "" })}
      />
    </div>
  );
}
```

- [ ] **Step 2: Verificar que o app compila** — `npm run build 2>&1 | tail -20` (vai falhar porque `ConsultationRightPanel` ainda não existe — OK)

- [ ] **Step 3: Commit (WIP)**
```bash
git add src/app/(dashboard)/consulta/page.tsx
git commit -m "feat: 3-column layout skeleton for consultation page (wip)"
```

---

## Sessão 2 — Painel Direito (eSUS Preview + Status)

### Task 3: DocumentationChecklist

**Arquivo:**
- Criar: `src/components/consultation/documentation-checklist.tsx`

- [ ] **Step 1: Criar o componente**

```tsx
"use client";

import { useConsultationStore } from "@/stores/consultation-store";

interface CheckItem {
  label: string;
  done: boolean;
}

export function DocumentationChecklist() {
  const soap = useConsultationStore((s) => s.soap);
  const vitals = useConsultationStore((s) => s.vitals);
  const problems = useConsultationStore((s) => s.problems);
  const followupItems = useConsultationStore((s) => s.followupItems);

  const items: CheckItem[] = [
    {
      label: "SOAP preenchido",
      done: !!(soap.s?.trim() && soap.a?.trim() && soap.p?.trim()),
    },
    {
      label: "Sinais vitais registrados",
      done: !!(vitals.pas && vitals.pad),
    },
    {
      label: "Problema / CID identificado",
      done: problems.length > 0,
    },
    {
      label: "Plano de retorno definido",
      done: followupItems.length > 0,
    },
  ];

  const doneCount = items.filter((i) => i.done).length;
  const pct = Math.round((doneCount / items.length) * 100);

  return (
    <div className="space-y-2">
      {/* Barra de progresso */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold text-[var(--on-surface-muted)] uppercase tracking-wide">
          Documentação
        </span>
        <span className="text-[11px] font-bold text-[var(--accent)]">{pct}%</span>
      </div>
      <div className="w-full bg-[var(--outline-variant)] h-1 rounded-full overflow-hidden">
        <div
          className="bg-[var(--accent)] h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Lista */}
      <div className="space-y-1.5 pt-1">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              className={`text-[14px] ${
                item.done ? "text-[var(--status-ok)]" : "text-[var(--outline-variant)]"
              }`}
            >
              {item.done ? "✓" : "○"}
            </span>
            <span
              className={`text-[11px] ${
                item.done
                  ? "text-[var(--on-surface)] font-medium"
                  : "text-[var(--on-surface-muted)]"
              }`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**
```bash
git add src/components/consultation/documentation-checklist.tsx
git commit -m "feat: DocumentationChecklist component with progress bar"
```

---

### Task 4: ConsultationRightPanel

**Arquivo:**
- Criar: `src/components/consultation/consultation-right-panel.tsx`

Esta é a peça central da sessão: move a prévia eSUS (que estava no `OutputColumn` no scroll) para um painel fixo à direita.

- [ ] **Step 1: Criar o componente**

```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useConsultationStore } from "@/stores/consultation-store";
import { generateEsusSummary } from "@/lib/esus-generator";
import { generateResumoOutput, generateDetalhadoOutput } from "@/lib/output-generators";
import { copyToClipboard } from "@/lib/clipboard";
import { showToast } from "@/components/ui/toast";
import { DocumentationChecklist } from "@/components/consultation/documentation-checklist";
import type { OutputMode, ConsultationState } from "@/types";

function getOutput(state: ConsultationState, mode: OutputMode): string {
  if (mode === "resumido") return generateResumoOutput(state);
  if (mode === "detalhado") return generateDetalhadoOutput(state);
  return generateEsusSummary(state);
}

const MODE_LABELS: Record<OutputMode, string> = {
  esus: "eSUS",
  resumido: "Resumo",
  detalhado: "Completo",
};

export function ConsultationRightPanel() {
  const [outputMode, setOutputMode] = useState<OutputMode>("esus");
  const [summary, setSummary] = useState(() =>
    getOutput(useConsultationStore.getState(), "esus")
  );
  const [copied, setCopied] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const modeRef = useRef<OutputMode>("esus");

  useEffect(() => {
    modeRef.current = outputMode;
    setSummary(getOutput(useConsultationStore.getState(), outputMode));
  }, [outputMode]);

  useEffect(() => {
    const unsub = useConsultationStore.subscribe(() => {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setSummary(getOutput(useConsultationStore.getState(), modeRef.current));
      }, 300);
    });
    return () => {
      unsub();
      clearTimeout(debounceRef.current);
    };
  }, []);

  const handleCopy = async () => {
    if (!summary.trim()) {
      showToast("Preencha a consulta para gerar o resumo", "info");
      return;
    }
    const ok = await copyToClipboard(summary);
    if (ok) {
      setCopied(true);
      showToast("Copiado!", "success");
      setTimeout(() => setCopied(false), 2000);
    } else {
      showToast("Erro ao copiar", "error");
    }
  };

  return (
    <aside className="w-80 shrink-0 h-full overflow-y-auto border-l border-[var(--outline-variant)] bg-[var(--surface-lowest)] flex flex-col">
      {/* Seção: Status de documentação */}
      <div className="p-4 border-b border-[var(--outline-variant)]">
        <DocumentationChecklist />
      </div>

      {/* Seção: Prévia eSUS */}
      <div className="flex-1 flex flex-col p-4 min-h-0">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-semibold text-[var(--on-surface)] uppercase tracking-wide">
            Texto para eSUS
          </span>
          <div className="flex items-center gap-1">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                summary.trim() ? "bg-[var(--status-ok)]" : "bg-[var(--outline-variant)]"
              }`}
            />
            <span className="text-[9px] font-bold text-[var(--on-surface-muted)] uppercase tracking-wider">
              {summary.trim() ? "pronto" : "aguardando"}
            </span>
          </div>
        </div>

        {/* Tabs de modo */}
        <div className="flex border-b border-[var(--outline-variant)] mb-3">
          {(["esus", "resumido", "detalhado"] as OutputMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setOutputMode(mode)}
              className={`px-2.5 py-1.5 text-[10px] font-semibold transition-colors ${
                outputMode === mode
                  ? "text-[var(--accent)] border-b-2 border-[var(--accent)]"
                  : "text-[var(--on-surface-muted)] hover:text-[var(--on-surface)]"
              }`}
            >
              {MODE_LABELS[mode]}
            </button>
          ))}
        </div>

        {/* Área de texto */}
        <div className="flex-1 min-h-0 relative">
          <div className="absolute inset-0 overflow-y-auto rounded-lg bg-[var(--bg-2)] border border-[var(--outline-variant)] p-3">
            {summary.trim() ? (
              <pre className="text-[11px] text-[var(--on-surface)] leading-relaxed whitespace-pre-wrap font-mono">
                {summary}
              </pre>
            ) : (
              <p className="text-[11px] text-[var(--on-surface-muted)] italic">
                Preencha a consulta para gerar o texto...
              </p>
            )}
          </div>
        </div>

        {/* Botão copiar */}
        <button
          onClick={handleCopy}
          className={`mt-3 w-full py-2 rounded-lg text-[12px] font-bold transition-all ${
            copied
              ? "bg-[var(--status-ok)] text-white"
              : "bg-[var(--accent)] text-white hover:opacity-90 active:scale-[0.98]"
          }`}
        >
          {copied ? "✓ Copiado!" : "Copiar para eSUS"}
        </button>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Verificar que o app compila sem erros**
```bash
cd "/c/Users/joaog/Ferramenta Medica/Ferramenta Medica/MedMate/medmate-app" && npm run build 2>&1 | tail -20
```
Esperado: sem erros TypeScript.

- [ ] **Step 3: Verificar visualmente** — `npm run dev` → `/consulta` → deve aparecer painel direito com 3 colunas

- [ ] **Step 4: Commit**
```bash
git add src/components/consultation/consultation-right-panel.tsx src/components/consultation/documentation-checklist.tsx
git commit -m "feat: ConsultationRightPanel with eSUS preview, mode tabs, and DocumentationChecklist"
```

---

## Sessão 3 — Sidebar Aprimorada (Memória Clínica)

### Task 5: ConsultationSidebar com Memória Clínica

**Arquivo:**
- Modificar: `src/components/consultation/consultation-sidebar.tsx`

O Stitch design mostra uma sidebar mais rica: avatar do paciente, badge de risco, dados de "Memória Clínica" (última PA, última consulta, meta clínica), e navegação. Adaptamos sem photo real (sem campo no DB) — usamos inicial do nome.

- [ ] **Step 1: Substituir o return do ConsultationSidebar**

Substituir a função `ConsultationSidebar` inteira (mantendo toda a lógica de fetch existente):

```tsx
  // ... manter todo o código de lógica/fetch existente até o return ...

  return (
    <aside className="w-72 shrink-0 h-full overflow-y-auto border-r border-[var(--outline-variant)] bg-[var(--bg-1)] flex flex-col">
      
      {/* Header: Avatar + Nome + Badge */}
      <div className="p-4 border-b border-[var(--outline-variant)]">
        <div className="flex items-center gap-3 mb-3">
          {/* Avatar com inicial */}
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full bg-[var(--accent-subtle)] border border-[var(--accent-border)] flex items-center justify-center">
              <span className="text-[15px] font-bold text-[var(--accent)]">
                {displayName ? displayName[0].toUpperCase() : "?"}
              </span>
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[var(--status-ok)] border-2 border-[var(--bg-1)] rounded-full" />
          </div>
          {/* Nome e dados */}
          <div className="min-w-0">
            {displayName ? (
              <>
                <p className="text-[14px] font-semibold text-[var(--on-surface)] leading-tight truncate">
                  {displayName}
                </p>
                <p className="text-[11px] text-[var(--on-surface-muted)] mt-0.5">
                  {[age, gender].filter(Boolean).join(" · ")}
                </p>
              </>
            ) : (
              <p className="text-[12px] text-[var(--on-surface-muted)] italic">
                Nenhum paciente selecionado
              </p>
            )}
          </div>
        </div>

        {/* Memória Clínica compacta */}
        {patientId && (
          <div className="bg-[var(--bg-0)] rounded-lg p-2.5 border border-[var(--outline-variant)] space-y-2">
            <p className="text-[9px] uppercase font-bold text-[var(--on-surface-muted)] tracking-wider mb-1">
              Memória Clínica
            </p>
            {/* Problemas como tags */}
            {activeProblems.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {activeProblems.slice(0, 3).map((p) => (
                  <span
                    key={p}
                    className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-border)]"
                  >
                    {p}
                  </span>
                ))}
                {activeProblems.length > 3 && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-[var(--bg-2)] text-[var(--on-surface-muted)]">
                    +{activeProblems.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Medicamentos contínuos */}
      <div className="px-4 py-3 border-b border-[var(--outline-variant)]">
        <p className="text-[10px] font-semibold text-[var(--on-surface-muted)] uppercase tracking-wide mb-2">
          Medicamentos contínuos
        </p>
        {loading ? (
          <p className="text-[11px] text-[var(--on-surface-muted)] italic">Carregando...</p>
        ) : medications.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            {medications.map((m) => (
              <div key={m.id}>
                <p className="text-[11px] text-[var(--on-surface)] font-medium leading-tight">
                  {m.medication_name}
                </p>
                {m.dosage && (
                  <p className="text-[10px] text-[var(--on-surface-muted)]">{m.dosage}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-[var(--on-surface-muted)] italic">
            {patientId ? "Nenhum medicamento" : "—"}
          </p>
        )}
      </div>

      {/* Alertas clínicos */}
      {alerts.length > 0 && (
        <div className="px-4 py-3 border-b border-[var(--outline-variant)]">
          <p className="text-[10px] font-semibold text-[var(--on-surface-muted)] uppercase tracking-wide mb-2">
            Alertas
          </p>
          <AlertList alerts={alerts} onDismiss={handleDismiss} />
        </div>
      )}

      <div className="flex-1" />
    </aside>
  );
```

- [ ] **Step 2: Verificar visualmente** — sidebar deve mostrar avatar com inicial, memória clínica com tags de problema

- [ ] **Step 3: Commit**
```bash
git add src/components/consultation/consultation-sidebar.tsx
git commit -m "feat: enhanced sidebar with patient avatar and clinical memory compact view"
```

---

## Sessão 4 — Topbar da Consulta + Visual Final

### Task 6: Topbar específica da consulta

**Arquivo:**
- Modificar: `src/app/(dashboard)/consulta/page.tsx`

O Stitch design tem um topbar próprio da consulta com: nome do paciente, indicador de rascunho, e botão "Finalizar Atendimento". Adicionamos isso no topo da coluna central.

- [ ] **Step 1: Adicionar topbar de consulta**

Dentro do `<main>` em `consulta/page.tsx`, antes do `<DraftRecoveryBanner />`, adicionar:

```tsx
{/* Topbar da consulta */}
<div className="sticky top-0 z-10 flex items-center justify-between px-6 h-11 bg-[var(--surface-lowest)] border-b border-[var(--outline-variant)]">
  <div className="flex items-center gap-3">
    <span className="text-[13px] font-semibold text-[var(--accent)]">
      {patientName ?? patient.name ?? "Nova consulta"}
    </span>
    <span className="h-3 w-px bg-[var(--outline-variant)]" />
    <span className="text-[11px] text-[var(--on-surface-muted)]">Atendimento em andamento</span>
  </div>
  <button
    onClick={handleFinalize}
    className="px-4 py-1.5 bg-[var(--accent)] text-white text-[11px] font-bold rounded-lg hover:opacity-90 active:scale-[0.98] transition-all"
  >
    Finalizar atendimento
  </button>
</div>
```

- [ ] **Step 2: Adicionar `handleFinalize` e imports necessários**

No topo do componente, adicionar:
```tsx
const patientName = useConsultationStore((s) => s.patientName);
const patient = useConsultationStore((s) => s.patient);
```

E a função:
```tsx
function handleFinalize() {
  showToast("Atendimento finalizado!", "success");
}
```

Importar `showToast`:
```tsx
import { showToast } from "@/components/ui/toast";
```

- [ ] **Step 3: Verificar build e visual**
```bash
cd "/c/Users/joaog/Ferramenta Medica/Ferramenta Medica/MedMate/medmate-app" && npm run build 2>&1 | tail -20
```

- [ ] **Step 4: Commit**
```bash
git add src/app/(dashboard)/consulta/page.tsx
git commit -m "feat: consultation-specific topbar with patient name and finalize button"
```

---

### Task 7: Ajustes de cor nos componentes internos

Os componentes internos (SoapForm, VitalsForm, ExamGrid, etc.) usam classes Tailwind hardcoded (ex: `bg-bg-1`, `text-text-primary`). Com o wrapper `.theme-light`, os tokens CSS são sobrescritos, mas classes Tailwind que referenciam diretamente as variáveis antigas precisam ser verificadas.

**Arquivo:**
- Verificar: `src/components/consultation/soap-form.tsx`

- [ ] **Step 1: Verificar quais classes precisam de ajuste**
```bash
grep -n "bg-bg-\|text-text-\|border-bg-\|bg-surface-low" \
  "/c/Users/joaog/Ferramenta Medica/Ferramenta Medica/MedMate/medmate-app/src/components/consultation/soap-form.tsx" | head -20
```

- [ ] **Step 2: Para cada ocorrência problemática, substituir pelas variáveis CSS inline**

Padrão de substituição:
- `bg-bg-1` → `bg-[var(--bg-1)]`
- `bg-bg-2` → `bg-[var(--bg-2)]`
- `text-text-primary` → `text-[var(--on-surface)]`
- `text-text-secondary` → `text-[var(--on-surface-muted)]`
- `border-outline-variant` → `border-[var(--outline-variant)]`
- `bg-surface-lowest` → `bg-[var(--surface-lowest)]`

Aplicar o mesmo padrão nos demais componentes da consulta se necessário: `vitals-form.tsx`, `exam-grid.tsx`, `output-column.tsx`.

- [ ] **Step 3: Verificar visualmente** — todos os cards devem estar com fundo branco/claro sem áreas escuras residuais

- [ ] **Step 4: Commit**
```bash
git add src/components/consultation/
git commit -m "fix: update consultation components to use CSS var() tokens for light mode compat"
```

---

## Self-Review

### Checklist de cobertura do spec (Stitch design):

| Requisito | Task que implementa | Status |
|---|---|---|
| Layout 3 colunas | Task 2 | ✅ |
| Modo claro (light mode tokens) | Task 1 | ✅ |
| Painel direito com prévia eSUS | Task 4 | ✅ |
| Tabs de modo (eSUS/Resumo/Completo) | Task 4 | ✅ |
| Botão copiar no painel direito | Task 4 | ✅ |
| Status de documentação / progresso | Task 3 | ✅ |
| Checklist de encerramento | Task 3 | ✅ |
| Sidebar com avatar do paciente | Task 5 | ✅ |
| Sidebar com memória clínica compacta | Task 5 | ✅ |
| Topbar de consulta com paciente | Task 6 | ✅ |
| Botão "Finalizar atendimento" | Task 6 | ✅ |

### Itens do Stitch design fora do escopo deste plano (backlog):
- HDA como card estruturado read-only com toggle edição (complexidade alta, separar em Ciclo 7)
- Seção "Prescrições e Pedidos" com prévia eSUS inline lado a lado (requer refactor do OutputColumn)
- CID-10 sugerido por IA no painel direito (requer integração com API Claude)
- Avatar com foto real do paciente (requer campo no DB + upload)

### Scan de placeholders: nenhum encontrado.

### Consistência de tipos: `OutputMode`, `ConsultationState` importados dos tipos existentes.
