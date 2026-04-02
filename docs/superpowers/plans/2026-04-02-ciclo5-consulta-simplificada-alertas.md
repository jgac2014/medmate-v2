# Ciclo 5 — Consulta Simplificada + Alertas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign a tela de consulta com sidebar fixa de contexto do paciente, alertas clínicos inteligentes e exames opcionais com auto-preenchimento do campo O do SOAP.

**Architecture:** Layout de 2 colunas (sidebar fixa + área principal). A sidebar mostra dados persistentes do paciente (DB). A área principal torna o SOAP o foco primário. Exames são opt-in via drawer expansível. Alertas são calculados ao selecionar paciente, usando dados já existentes no banco.

**Tech Stack:** Next.js App Router, TypeScript, Zustand, Supabase client, Tailwind CSS, Radix UI, Lucide React.

---

## Mapa de arquivos

### Sessão 1 — Novo layout
| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `src/components/consultation/consultation-sidebar.tsx` | **Criar** | Sidebar fixa: nome/idade/sexo do paciente, problemas ativos do DB, medicamentos ativos do DB, seção de alertas (placeholder) |
| `src/app/(dashboard)/consulta/page.tsx` | **Modificar** | Trocar grid de 4 colunas por layout flex 2 colunas (sidebar + main) |

### Sessão 2 — Alertas
| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `src/types/index.ts` | **Modificar** | Adicionar tipo `Alert` |
| `src/lib/supabase/alerts.ts` | **Criar** | `getPatientAlerts(patientId, userId)` — 2 tipos de alerta |
| `src/components/consultation/alert-list.tsx` | **Criar** | Renderiza lista de alertas com dismiss via localStorage |
| `src/components/consultation/consultation-sidebar.tsx` | **Modificar** | Integrar carregamento e exibição de alertas |

### Sessão 3 — Exames opcionais + O auto-preenchido
| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `src/lib/format-objective.ts` | **Criar** | Função pura: vitals + labs → string formatada para campo O |
| `src/components/consultation/objective-data-drawer.tsx` | **Criar** | Seção expansível com VitalsForm + ExamGrid + botão "Aplicar ao campo O" |
| `src/components/consultation/soap-form.tsx` | **Modificar** | Adicionar botão `[+ Dados objetivos]` no campo O que abre o drawer |

---

## Sessão 1 — Novo layout da consulta

### Task 1: Criar `consultation-sidebar.tsx`

**Files:**
- Create: `src/components/consultation/consultation-sidebar.tsx`

- [ ] **Step 1: Criar o componente**

```tsx
"use client";

import { useEffect, useState } from "react";
import { useConsultationStore } from "@/stores/consultation-store";
import { getPatientProblems } from "@/lib/supabase/patient-problems";
import { getPatientMedications } from "@/lib/supabase/patient-medications";
import { createClient } from "@/lib/supabase/client";
import type { PatientMedication } from "@/types";
import { User, AlertCircle } from "lucide-react";

export function ConsultationSidebar() {
  const { patientId, patientName, patient } = useConsultationStore();
  const [userId, setUserId] = useState<string | null>(null);
  const [activeProblems, setActiveProblems] = useState<string[]>([]);
  const [medications, setMedications] = useState<PatientMedication[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  useEffect(() => {
    if (!patientId) {
      setActiveProblems([]);
      setMedications([]);
      return;
    }
    setLoading(true);
    Promise.all([
      getPatientProblems(patientId),
      getPatientMedications(patientId),
    ])
      .then(([problems, meds]) => {
        setActiveProblems(problems);
        setMedications(meds.filter((m) => m.active));
      })
      .finally(() => setLoading(false));
  }, [patientId]);

  const displayName = patientName ?? patient.name ?? null;
  const age = patient.age ? `${patient.age} anos` : null;
  const gender = patient.gender || null;

  return (
    <aside className="w-72 shrink-0 h-full overflow-y-auto border-r border-outline-variant/20 bg-surface-lowest flex flex-col">
      {/* Cabeçalho do paciente */}
      <div className="px-4 py-4 border-b border-outline-variant/20">
        <div className="flex items-center gap-2 mb-1">
          <User size={14} className="text-on-surface-muted shrink-0" />
          <span className="text-[11px] font-medium text-on-surface-muted uppercase tracking-wide">
            Paciente
          </span>
        </div>
        {displayName ? (
          <>
            <p className="text-[14px] font-semibold text-on-surface leading-tight mt-1">
              {displayName}
            </p>
            {(age || gender) && (
              <p className="text-[11px] text-on-surface-muted mt-0.5">
                {[age, gender].filter(Boolean).join(" · ")}
              </p>
            )}
          </>
        ) : (
          <p className="text-[12px] text-on-surface-muted italic mt-1">
            Nenhum paciente selecionado
          </p>
        )}
      </div>

      {/* Problemas ativos */}
      <div className="px-4 py-3 border-b border-outline-variant/20">
        <p className="text-[10px] font-semibold text-on-surface-muted uppercase tracking-wide mb-2">
          Problemas ativos
        </p>
        {loading ? (
          <p className="text-[11px] text-on-surface-muted italic">Carregando...</p>
        ) : activeProblems.length > 0 ? (
          <div className="flex flex-col gap-1">
            {activeProblems.map((p) => (
              <span
                key={p}
                className="inline-block text-[11px] px-2 py-0.5 rounded bg-error/10 text-error w-fit"
              >
                {p}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-on-surface-muted italic">
            {patientId ? "Nenhum problema registrado" : "—"}
          </p>
        )}
      </div>

      {/* Medicamentos contínuos */}
      <div className="px-4 py-3 border-b border-outline-variant/20">
        <p className="text-[10px] font-semibold text-on-surface-muted uppercase tracking-wide mb-2">
          Medicamentos contínuos
        </p>
        {loading ? (
          <p className="text-[11px] text-on-surface-muted italic">Carregando...</p>
        ) : medications.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            {medications.map((m) => (
              <div key={m.id}>
                <p className="text-[11px] text-on-surface font-medium leading-tight">
                  {m.medication_name}
                </p>
                {m.dosage && (
                  <p className="text-[10px] text-on-surface-muted">{m.dosage}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-on-surface-muted italic">
            {patientId ? "Nenhum medicamento registrado" : "—"}
          </p>
        )}
      </div>

      {/* Placeholder para alertas — Task 4 (Sessão 2) preencherá esta seção */}
      <div id="sidebar-alerts-slot" className="px-4 py-3 flex-1" />
    </aside>
  );
}
```

- [ ] **Step 2: Verificar que `getPatientMedications` existe**

```bash
grep -r "getPatientMedications" src/lib/supabase/
```

Esperado: arquivo `patient-medications.ts` com a função exportada. Se não existir, crie:

```ts
// src/lib/supabase/patient-medications.ts
import { createClient } from "@/lib/supabase/client";
import type { PatientMedication } from "@/types";

export async function getPatientMedications(patientId: string): Promise<PatientMedication[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("patient_medications")
    .select("*")
    .eq("patient_id", patientId)
    .order("created_at", { ascending: true });
  if (error || !data) return [];
  return data as PatientMedication[];
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/consultation/consultation-sidebar.tsx
git commit -m "feat: add ConsultationSidebar with patient context"
```

---

### Task 2: Refatorar `page.tsx` — novo layout 2 colunas

**Files:**
- Modify: `src/app/(dashboard)/consulta/page.tsx`

- [ ] **Step 1: Ler o arquivo atual antes de editar**

```bash
cat src/app/(dashboard)/consulta/page.tsx
```

- [ ] **Step 2: Substituir o layout**

O novo `page.tsx` completo:

```tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ConsultationSidebar } from "@/components/consultation/consultation-sidebar";
import { ClinicalSummary } from "@/components/consultation/clinical-summary";
import { SoapForm } from "@/components/consultation/soap-form";
import { HistoryForm } from "@/components/consultation/history-form";
import { OutputColumn } from "@/components/consultation/output-column";
import { DraftRecoveryBanner } from "@/components/consultation/draft-recovery-banner";
import { FollowupPanel } from "@/components/consultation/followup-panel";
import { PreventionList } from "@/components/consultation/prevention-list";
import { PatientInfo } from "@/components/consultation/patient-info";
import { ProblemList } from "@/components/consultation/problem-list";
import { useDraftAutosave } from "@/hooks/useDraftAutosave";

export default function ConsultaPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  useDraftAutosave(userId);

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden bg-surface-low">
      {/* Sidebar fixa */}
      <ConsultationSidebar />

      {/* Área principal scrollável */}
      <main className="flex-1 overflow-y-auto">
        <DraftRecoveryBanner />
        <div className="max-w-5xl mx-auto p-4 space-y-4">

          {/* Bloco 1: Identificação + Problemas (compacto, menos destaque) */}
          <details className="group">
            <summary className="cursor-pointer text-[11px] font-medium text-on-surface-muted uppercase tracking-wide select-none list-none flex items-center gap-1 hover:text-on-surface transition-colors">
              <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
              Identificação e problemas da consulta
            </summary>
            <div className="mt-3 grid grid-cols-2 gap-4 p-4 rounded-xl bg-surface-lowest border border-outline-variant/20">
              <PatientInfo />
              <ProblemList />
            </div>
          </details>

          {/* Bloco 2: SOAP — foco principal */}
          <section className="rounded-xl bg-surface-lowest border border-outline-variant/20 p-5">
            <ClinicalSummary />
            <div className="my-3 h-px bg-outline-variant/20" />
            <SoapForm />
          </section>

          {/* Bloco 3: Antecedentes */}
          <section className="rounded-xl bg-surface-lowest border border-outline-variant/20 p-5">
            <HistoryForm />
          </section>

          {/* Bloco 4: Saída */}
          <section className="rounded-xl bg-surface-lowest border border-outline-variant/20 p-5">
            <OutputColumn />
          </section>

          {/* Bloco 5: Prevenção e seguimento (menos destaque) */}
          <section className="rounded-xl bg-surface-lowest border border-outline-variant/20 p-5 space-y-4">
            <PreventionList />
            <div className="h-px bg-outline-variant/20" />
            <FollowupPanel />
          </section>

        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Verificar no browser**

```bash
npm run dev
```

Abrir `http://localhost:3000/consulta`. Verificar:
- Sidebar aparece à esquerda com as seções "Paciente", "Problemas ativos", "Medicamentos contínuos"
- Área principal tem SOAP como primeiro bloco visível
- Identificação e problemas ficam colapsados no `<details>`
- Não há scroll horizontal
- Sem erros no console

- [ ] **Step 4: Commit**

```bash
git add src/app/(dashboard)/consulta/page.tsx
git commit -m "feat: redesign consultation layout — sidebar + SOAP-first main area"
```

---

## Sessão 2 — Sistema de alertas contextuais

### Task 3: Adicionar tipo `Alert` em `src/types/index.ts`

**Files:**
- Modify: `src/types/index.ts`

- [ ] **Step 1: Adicionar ao final do arquivo**

```ts
export type AlertType = "followup" | "chronic";
export type AlertSeverity = "warning" | "alert";

export interface Alert {
  id: string;
  type: AlertType;
  message: string;
  severity: AlertSeverity;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add Alert type"
```

---

### Task 4: Criar `src/lib/supabase/alerts.ts`

**Files:**
- Create: `src/lib/supabase/alerts.ts`

- [ ] **Step 1: Criar a função**

```ts
import { createClient } from "@/lib/supabase/client";
import type { Alert, FollowUpItem } from "@/types";

/** Condições crônicas monitoradas — substrings dos textos em patient_problems */
const CHRONIC_KEYWORDS = [
  "HAS",
  "DM2",
  "Obesidade",
  "DRC",
  "Hipotireoidismo",
  "Dislipidemia",
  "Asma",
  "DPOC",
  "ICC",
  "Fibrilação Atrial",
  "Gota",
];

function formatDateBR(isoDate: string): string {
  const [y, m, d] = isoDate.split("T")[0].split("-");
  return `${d}/${m}/${y}`;
}

/**
 * Retorna alertas clínicos contextuais para um paciente.
 * - Alerta 1: pendências não resolvidas da última consulta há mais de 30 dias
 * - Alerta 2: condição crônica ativa com última consulta há mais de 180 dias
 */
export async function getPatientAlerts(
  patientId: string,
  userId: string
): Promise<Alert[]> {
  const supabase = createClient();
  const alerts: Alert[] = [];

  // Busca a última consulta do paciente
  const { data: lastConsult } = await supabase
    .from("consultations")
    .select("id, created_at, followup_items")
    .eq("user_id", userId)
    .eq("patient_id", patientId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const lastDate = lastConsult ? new Date(lastConsult.created_at) : null;
  const daysSince = lastDate
    ? Math.floor((Date.now() - lastDate.getTime()) / 86_400_000)
    : 999;

  // Alerta 1: pendências não resolvidas de consulta com mais de 30 dias
  if (lastConsult && daysSince > 30) {
    const items = (lastConsult.followup_items ?? []) as FollowUpItem[];
    const pending = items.filter((i) => !i.completed);
    if (pending.length > 0) {
      alerts.push({
        id: `followup-${lastConsult.id}`,
        type: "followup",
        severity: "warning",
        message: `${pending.length} pendência${pending.length > 1 ? "s" : ""} não resolvida${pending.length > 1 ? "s" : ""} da consulta de ${formatDateBR(lastConsult.created_at)}`,
      });
    }
  }

  // Alerta 2: condição crônica ativa + última consulta há mais de 180 dias
  if (daysSince > 180) {
    const { data: problems } = await supabase
      .from("patient_problems")
      .select("problem_text")
      .eq("patient_id", patientId)
      .eq("active", true);

    const chronicActive = (problems ?? [])
      .map((p) => p.problem_text)
      .filter((text) => CHRONIC_KEYWORDS.some((kw) => text.includes(kw)));

    if (chronicActive.length > 0) {
      const months = Math.floor(daysSince / 30);
      alerts.push({
        id: `chronic-${patientId}`,
        type: "chronic",
        severity: "alert",
        message: `${chronicActive[0]} ativo — última consulta há ${months} ${months === 1 ? "mês" : "meses"}`,
      });
    }
  }

  return alerts;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/supabase/alerts.ts
git commit -m "feat: add getPatientAlerts — followup + chronic condition alerts"
```

---

### Task 5: Criar `src/components/consultation/alert-list.tsx`

**Files:**
- Create: `src/components/consultation/alert-list.tsx`

- [ ] **Step 1: Criar o componente**

```tsx
"use client";

import { AlertTriangle, X } from "lucide-react";
import type { Alert } from "@/types";

interface AlertListProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
}

export function AlertList({ alerts, onDismiss }: AlertListProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-start gap-2 rounded-lg px-3 py-2 text-[11px] leading-snug ${
            alert.severity === "warning"
              ? "bg-warning/10 text-warning border border-warning/20"
              : "bg-error/10 text-error border border-error/20"
          }`}
        >
          <AlertTriangle size={12} className="shrink-0 mt-0.5" />
          <span className="flex-1">{alert.message}</span>
          <button
            onClick={() => onDismiss(alert.id)}
            className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Dispensar alerta"
          >
            <X size={11} />
          </button>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/consultation/alert-list.tsx
git commit -m "feat: add AlertList component"
```

---

### Task 6: Integrar alertas no `consultation-sidebar.tsx`

**Files:**
- Modify: `src/components/consultation/consultation-sidebar.tsx`

- [ ] **Step 1: Ler o arquivo atual**

```bash
cat src/components/consultation/consultation-sidebar.tsx
```

- [ ] **Step 2: Adicionar imports e lógica de alertas**

Adicionar no topo dos imports:
```tsx
import { getPatientAlerts } from "@/lib/supabase/alerts";
import { AlertList } from "@/components/consultation/alert-list";
import type { Alert } from "@/types";
```

Adicionar estado dentro do componente (após os estados existentes):
```tsx
const [alerts, setAlerts] = useState<Alert[]>([]);
```

Substituir o `useEffect` que carrega problemas/medicamentos para incluir alertas:
```tsx
useEffect(() => {
  if (!patientId || !userId) {
    setActiveProblems([]);
    setMedications([]);
    setAlerts([]);
    return;
  }
  setLoading(true);
  Promise.all([
    getPatientProblems(patientId),
    getPatientMedications(patientId),
    getPatientAlerts(patientId, userId),
  ])
    .then(([problems, meds, newAlerts]) => {
      setActiveProblems(problems);
      setMedications(meds.filter((m) => m.active));
      // Filtrar alertas já dispensados (localStorage)
      const dismissed = getDismissedAlerts();
      setAlerts(newAlerts.filter((a) => !dismissed.has(a.id)));
    })
    .finally(() => setLoading(false));
}, [patientId, userId]);
```

Adicionar funções de dismiss antes do return:
```tsx
function getDismissedAlerts(): Set<string> {
  try {
    const raw = localStorage.getItem("medmate_dismissed_alerts");
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function handleDismiss(id: string) {
  try {
    const dismissed = getDismissedAlerts();
    dismissed.add(id);
    localStorage.setItem("medmate_dismissed_alerts", JSON.stringify([...dismissed]));
  } catch {
    // silencioso
  }
  setAlerts((prev) => prev.filter((a) => a.id !== id));
}
```

Substituir o `<div id="sidebar-alerts-slot">` por:
```tsx
{alerts.length > 0 && (
  <div className="px-4 py-3 border-t border-outline-variant/20">
    <p className="text-[10px] font-semibold text-on-surface-muted uppercase tracking-wide mb-2">
      Alertas
    </p>
    <AlertList alerts={alerts} onDismiss={handleDismiss} />
  </div>
)}
```

- [ ] **Step 3: Verificar no browser**

Abrir `http://localhost:3000/consulta`. Selecionar um paciente com histórico de consultas. Verificar:
- Alertas aparecem na seção "Alertas" da sidebar se existentes
- Botão X dispensa o alerta visualmente
- Após dispensar e recarregar a página, o alerta não reaparece

- [ ] **Step 4: Commit**

```bash
git add src/components/consultation/consultation-sidebar.tsx
git commit -m "feat: integrate clinical alerts into consultation sidebar"
```

---

## Sessão 3 — Exames opcionais + O auto-preenchido

### Task 7: Criar `src/lib/format-objective.ts`

**Files:**
- Create: `src/lib/format-objective.ts`

- [ ] **Step 1: Criar a função pura**

```ts
import type { Vitals, Calculations } from "@/types";
import { EXAM_CARDS } from "@/lib/constants";

/** Mapa key → label construído a partir de EXAM_CARDS */
const LAB_LABEL_MAP: Record<string, string> = {};
for (const card of EXAM_CARDS) {
  for (const field of card.fields) {
    if (!field.auto) {
      LAB_LABEL_MAP[field.key] = `${field.label} (${field.unit})`.replace(" ()", "");
    }
  }
}

/**
 * Gera o texto formatado para o campo O do SOAP a partir dos dados objetivos.
 * Apenas campos com valor preenchido são incluídos.
 */
export function formatObjectiveText(
  vitals: Vitals,
  labs: Record<string, string>,
  calculations: Calculations
): string {
  const lines: string[] = [];

  // Sinais vitais
  const vitalParts: string[] = [];
  if (vitals.pas && vitals.pad)
    vitalParts.push(`PA: ${vitals.pas}/${vitals.pad} mmHg`);
  if (vitals.fc) vitalParts.push(`FC: ${vitals.fc} bpm`);
  if (vitals.spo2) vitalParts.push(`SpO2: ${vitals.spo2}%`);
  if (vitals.temp) vitalParts.push(`Temp: ${vitals.temp}°C`);
  if (vitalParts.length > 0) lines.push(vitalParts.join(" | "));

  // Antropometria
  const anthropoParts: string[] = [];
  if (vitals.peso) anthropoParts.push(`Peso: ${vitals.peso} kg`);
  if (vitals.altura) anthropoParts.push(`Altura: ${vitals.altura} m`);
  if (calculations.imc)
    anthropoParts.push(
      `IMC: ${calculations.imc.value.toFixed(1)} kg/m² (${calculations.imc.classification})`
    );
  if (vitals.ca_abd) anthropoParts.push(`CA: ${vitals.ca_abd} cm`);
  if (anthropoParts.length > 0) lines.push(anthropoParts.join(" | "));

  // Exames laboratoriais (apenas preenchidos, excluindo calculados)
  const filledLabs = Object.entries(labs)
    .filter(([key, value]) => value.trim() !== "" && key !== "tfg" && key !== "homa_ir")
    .map(([key, value]) => {
      const label = LAB_LABEL_MAP[key] ?? key;
      return `${label}: ${value}`;
    });
  if (filledLabs.length > 0) lines.push(filledLabs.join(" | "));

  return lines.join("\n");
}
```

- [ ] **Step 2: Verificar tipos importados**

Confirmar que `Vitals`, `Calculations` estão em `src/types/index.ts` (já existem) e `EXAM_CARDS` está em `src/lib/constants.ts` (já existe).

- [ ] **Step 3: Commit**

```bash
git add src/lib/format-objective.ts
git commit -m "feat: add formatObjectiveText pure function"
```

---

### Task 8: Criar `objective-data-drawer.tsx`

**Files:**
- Create: `src/components/consultation/objective-data-drawer.tsx`

- [ ] **Step 1: Criar o componente**

```tsx
"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { useConsultationStore } from "@/stores/consultation-store";
import { VitalsForm } from "@/components/consultation/vitals-form";
import { ExamGrid } from "@/components/consultation/exam-grid";
import { formatObjectiveText } from "@/lib/format-objective";

interface ObjectiveDataDrawerProps {
  /** Chamado com o texto formatado para inserir no campo O */
  onApply: (text: string) => void;
  /** Se o campo O já tem conteúdo */
  hasExistingContent: boolean;
}

export function ObjectiveDataDrawer({
  onApply,
  hasExistingContent,
}: ObjectiveDataDrawerProps) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const { vitals, labs, calculations } = useConsultationStore();

  function handleApply() {
    const text = formatObjectiveText(vitals, labs, calculations);
    if (!text.trim()) return;

    if (hasExistingContent && !confirming) {
      setConfirming(true);
      return;
    }

    onApply(text);
    setConfirming(false);
    setOpen(false);
  }

  return (
    <div className="mt-1">
      {/* Botão toggle */}
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          setConfirming(false);
        }}
        className="flex items-center gap-1 text-[11px] text-on-surface-muted hover:text-primary transition-colors"
      >
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        {open ? "Fechar dados objetivos" : "+ Dados objetivos"}
      </button>

      {/* Painel expansível */}
      {open && (
        <div className="mt-3 rounded-lg border border-outline-variant/30 bg-surface-low p-4 space-y-4">
          <VitalsForm />
          <div className="h-px bg-outline-variant/20" />
          <ExamGrid />

          <div className="flex items-center gap-3 pt-1">
            {confirming ? (
              <>
                <span className="text-[11px] text-warning">
                  Isso substituirá o texto atual do campo O. Confirmar?
                </span>
                <button
                  type="button"
                  onClick={handleApply}
                  className="flex items-center gap-1 text-[11px] px-3 py-1 rounded bg-warning/20 text-warning hover:bg-warning/30 transition-colors"
                >
                  <Check size={11} />
                  Confirmar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="text-[11px] text-on-surface-muted hover:text-on-surface transition-colors"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleApply}
                className="flex items-center gap-1 text-[11px] px-3 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <Check size={11} />
                Aplicar ao campo O
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/consultation/objective-data-drawer.tsx
git commit -m "feat: add ObjectiveDataDrawer — optional exam section with O auto-fill"
```

---

### Task 9: Refatorar `soap-form.tsx` — integrar drawer no campo O

**Files:**
- Modify: `src/components/consultation/soap-form.tsx`

- [ ] **Step 1: Ler o arquivo atual**

```bash
cat src/components/consultation/soap-form.tsx
```

- [ ] **Step 2: Substituir o arquivo**

```tsx
"use client";

import { useConsultationStore } from "@/stores/consultation-store";
import { SectionHeader } from "@/components/ui/section-header";
import { ObjectiveDataDrawer } from "@/components/consultation/objective-data-drawer";

const SOAP_FIELDS = [
  { key: "subjective" as const, label: "S — Subjetivo", placeholder: "Queixa principal, HDA..." },
  { key: "objective" as const, label: "O — Objetivo", placeholder: "Exame físico detalhado..." },
  { key: "assessment" as const, label: "A — Avaliação", placeholder: "Hipótese diagnóstica..." },
  { key: "plan" as const, label: "P — Plano", placeholder: "Conduta, encaminhamentos..." },
] as const;

export function SoapForm() {
  const { soap, setSoap } = useConsultationStore();

  return (
    <div className="mb-3.5">
      <SectionHeader label="SOAP" color="blue" />
      {SOAP_FIELDS.map((f) => (
        <div key={f.key} className="mb-3">
          <label className="block text-[11px] text-on-surface-muted mb-0.5 font-medium">
            {f.label}
          </label>
          <textarea
            placeholder={f.placeholder}
            value={soap[f.key]}
            onChange={(e) => setSoap({ [f.key]: e.target.value })}
            className="w-full h-16 px-0 py-2 border-0 border-b border-outline-variant/50 rounded-none bg-transparent text-on-surface text-[13px] resize-y leading-relaxed placeholder:text-on-surface-muted focus:outline-none focus:border-primary transition-colors"
          />
          {f.key === "objective" && (
            <ObjectiveDataDrawer
              hasExistingContent={soap.objective.trim().length > 0}
              onApply={(text) => setSoap({ objective: text })}
            />
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Verificar no browser**

Abrir `http://localhost:3000/consulta`. Verificar:
- Abaixo do campo O, aparece o link "+ Dados objetivos"
- Ao clicar, expande VitalsForm + ExamGrid
- Preencher PA: 130/80, FC: 72, Peso: 75, Altura: 1.75
- Clicar "Aplicar ao campo O"
- Campo O deve receber: `PA: 130/80 mmHg | FC: 72 bpm\nPeso: 75 kg | Altura: 1.75 m | IMC: 24,5 kg/m² (Peso normal)`
- Ao clicar novamente com campo O já preenchido, deve aparecer confirmação

- [ ] **Step 4: Commit**

```bash
git add src/components/consultation/soap-form.tsx
git commit -m "feat: integrate ObjectiveDataDrawer into SOAP form O field"
```

---

## Self-Review

**Spec coverage:**
- ✅ Novo layout 2 colunas (Task 2)
- ✅ Sidebar com patient context — nome, problemas, medicamentos (Task 1)
- ✅ Alertas follow-up vencido (Task 4 — lógica em `alerts.ts`)
- ✅ Alertas condição crônica sem consulta (Task 4 — mesma função)
- ✅ Dismiss de alertas via localStorage (Task 6)
- ✅ SOAP como foco principal da área principal (Task 2)
- ✅ Exames opcionais inline no campo O (Task 8)
- ✅ Auto-preenchimento do O formatado (Task 7 + Task 9)
- ✅ Confirmação ao substituir O já preenchido (Task 8)
- ✅ Nenhuma migration nova necessária

**Consistência de tipos:**
- `Alert` definido em Task 3, usado em Tasks 4, 5, 6
- `PatientMedication` já existe em `src/types/index.ts`
- `FollowUpItem` já existe em `src/types/index.ts`
- `Vitals`, `Calculations` já existem — usados em Task 7

**Sem placeholders:** Todos os steps têm código completo.
