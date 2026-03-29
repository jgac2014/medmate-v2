# Ciclo 3 — Prontuário Longitudinal + Produtividade Clínica

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar o MedMate de formulário por consulta em prontuário eletrônico longitudinal — ficha do paciente com histórico, gráficos de tendência, medicamentos contínuos, rastreamento completo MS e atalhos de produtividade.

**Architecture:** Cada sessão é uma entrega independente e testável. Sessão 3 requer migration SQL aplicada manualmente no Supabase Dashboard antes da execução. Sessão 4 requer WebSearch para conteúdo clínico de fontes oficiais (MS/INCA/CFM) antes de escrever qualquer valor.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Zustand, Supabase, Tailwind — padrões existentes do projeto. Consultar `AGENTS.md` e `node_modules/next/dist/docs/` antes de alterar convenções de rota ou middleware.

---

## Sessão 1 — Ficha do Paciente (Patient Dashboard Drawer)

**Objetivo:** Drawer lateral (500px) que abre quando um paciente está selecionado, mostrando: dados demográficos, problemas ativos, lista de consultas passadas com resumo.

### Mapa de arquivos

| Ação | Arquivo |
|------|---------|
| Modify | `src/lib/supabase/consultations.ts` |
| Create | `src/components/consultation/patient-dashboard.tsx` |
| Modify | `src/components/layout/topbar.tsx` |

---

### Task 1: Adicionar query de consultas por paciente

**Files:**
- Modify: `src/lib/supabase/consultations.ts`

- [ ] **Step 1: Adicionar função `listConsultationsByPatient`**

Após a função `listConsultations`, adicionar:

```typescript
export async function listConsultationsByPatient(patientId: string) {
  const supabase = createClient();
  return supabase
    .from("consultations")
    .select("id, date, created_at, problems, problems_other, vitals, labs, patient_snapshot, prescription, assessment, followup_items")
    .eq("patient_id", patientId)
    .order("date", { ascending: false })
    .limit(50);
}
```

- [ ] **Step 2: Verificar TypeScript**

```bash
cd "C:/Users/joaog/Ferramenta Medica/Ferramenta Medica/MedMate/medmate-app"
npx tsc --noEmit 2>&1 | head -20
```
Expected: nenhum erro

- [ ] **Step 3: Commit**

```bash
git add src/lib/supabase/consultations.ts
git commit -m "feat: add listConsultationsByPatient query"
```

---

### Task 2: Criar o componente PatientDashboard

**Files:**
- Create: `src/components/consultation/patient-dashboard.tsx`

- [ ] **Step 1: Criar o componente completo**

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { listConsultationsByPatient } from "@/lib/supabase/consultations";
import { getPatientProblems } from "@/lib/supabase/patient-problems";
import { useConsultationStore } from "@/stores/consultation-store";
import { formatDateBR } from "@/lib/utils";

interface PatientDashboardProps {
  open: boolean;
  onClose: () => void;
}

type ConsultationSummary = {
  id: string;
  date: string;
  problems: string[] | null;
  problems_other: string | null;
  vitals: { pas?: string; pad?: string; peso?: string; imc?: string } | null;
  labs: Record<string, string> | null;
  assessment: string | null;
  prescription: string | null;
};

export function PatientDashboard({ open, onClose }: PatientDashboardProps) {
  const { patientId, patientName, patient } = useConsultationStore();
  const [consultations, setConsultations] = useState<ConsultationSummary[]>([]);
  const [activeProblems, setActiveProblems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!patientId) return;
    setLoading(true);
    try {
      const [consResult, problems] = await Promise.all([
        listConsultationsByPatient(patientId),
        getPatientProblems(patientId),
      ]);
      setConsultations((consResult.data as ConsultationSummary[]) ?? []);
      setActiveProblems(problems);
    } catch {
      // silencioso
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    if (open && patientId) fetchData();
  }, [open, patientId, fetchData]);

  if (!patientId) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-[500px] z-50 bg-bg-1 border-l border-border-subtle shadow-[-4px_0_32px_rgba(0,0,0,0.35)] transition-transform duration-200 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="shrink-0 px-5 py-4 border-b border-border-subtle">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-semibold text-text-primary">
                {patientName || patient.name || "Paciente"}
              </p>
              <p className="text-[11px] text-text-tertiary mt-0.5">
                {[patient.age, patient.gender, patient.race].filter(Boolean).join(" · ")}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-md border border-border-subtle flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-2 transition-colors cursor-pointer text-lg leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4">
          {loading ? (
            <p className="text-[12px] text-text-tertiary text-center py-8">Carregando...</p>
          ) : (
            <>
              {/* Problemas ativos */}
              {activeProblems.length > 0 && (
                <section className="mb-5">
                  <p className="text-[10px] text-text-tertiary uppercase tracking-wide mb-2">
                    Problemas ativos
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProblems.map((p) => (
                      <span
                        key={p}
                        className="px-2 py-0.5 text-[11px] rounded-md border border-status-warn/20 bg-status-warn/8 text-status-warn"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Resumo: total de consultas */}
              <section className="mb-5">
                <p className="text-[10px] text-text-tertiary uppercase tracking-wide mb-2">
                  Consultas registradas
                </p>
                <p className="text-[20px] font-bold text-text-primary tabular-nums">
                  {consultations.length}
                </p>
              </section>

              {/* Lista de consultas */}
              <section>
                <p className="text-[10px] text-text-tertiary uppercase tracking-wide mb-2">
                  Histórico de consultas
                </p>
                {consultations.length === 0 ? (
                  <p className="text-[12px] text-text-tertiary py-4">Nenhuma consulta encontrada.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {consultations.map((c) => {
                      const allProblems = [
                        ...(c.problems ?? []),
                        ...(c.problems_other?.split(",").map((s) => s.trim()).filter(Boolean) ?? []),
                      ];
                      const vitals = c.vitals;
                      const vitalStr = [
                        vitals?.pas && vitals?.pad ? `PA ${vitals.pas}/${vitals.pad}` : "",
                        vitals?.peso ? `${vitals.peso} kg` : "",
                        vitals?.imc ? `IMC ${vitals.imc}` : "",
                      ].filter(Boolean).join(" · ");

                      return (
                        <div
                          key={c.id}
                          className="p-3 rounded-lg border border-border-subtle/60 bg-bg-2/50"
                        >
                          <div className="flex items-baseline justify-between mb-1">
                            <span className="text-[12px] font-medium text-text-primary">
                              {formatDateBR(c.date)}
                            </span>
                          </div>
                          {allProblems.length > 0 && (
                            <p className="text-[11px] text-text-secondary mb-1">
                              {allProblems.join(", ")}
                            </p>
                          )}
                          {vitalStr && (
                            <p className="text-[10.5px] text-text-tertiary font-mono">{vitalStr}</p>
                          )}
                          {c.assessment && (
                            <p className="text-[11px] text-text-secondary mt-1 line-clamp-2">
                              A: {c.assessment}
                            </p>
                          )}
                          {c.prescription && (
                            <p className="text-[10.5px] text-text-tertiary mt-1 line-clamp-2">
                              Rx: {c.prescription}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border-subtle shrink-0">
          <p className="text-[10.5px] text-text-tertiary">
            Prontuário longitudinal — {consultations.length} consulta{consultations.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add src/components/consultation/patient-dashboard.tsx
git commit -m "feat: add PatientDashboard drawer component"
```

---

### Task 3: Integrar no topbar — botão "Prontuário"

**Files:**
- Modify: `src/components/layout/topbar.tsx`

- [ ] **Step 1: Importar PatientDashboard**

Após o import de `TemplateSelector`:

```typescript
import { PatientDashboard } from "@/components/consultation/patient-dashboard";
```

- [ ] **Step 2: Adicionar state para o drawer**

Após `const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false);`:

```typescript
const [dashboardOpen, setDashboardOpen] = useState(false);
```

- [ ] **Step 3: Renderizar o PatientDashboard**

Após `<TemplateSelector ... />`:

```tsx
<PatientDashboard
  open={dashboardOpen}
  onClose={() => setDashboardOpen(false)}
/>
```

- [ ] **Step 4: Adicionar botão "Prontuário" no topbar**

Inserir ANTES do badge `patientName`:

```tsx
{patientName && (
  <button
    onClick={() => setDashboardOpen(true)}
    className="h-[32px] px-3 rounded-md text-[12px] font-medium border border-accent/20 text-accent bg-accent/5 hover:bg-accent/10 hover:border-accent/30 transition-colors cursor-pointer"
  >
    Prontuário
  </button>
)}
```

- [ ] **Step 5: Verificar TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 6: Testar no browser**
  1. Selecionar um paciente que tenha consultas salvas
  2. Botão "Prontuário" deve aparecer no topbar
  3. Clicar → drawer abre à direita com problemas ativos + lista de consultas
  4. Sem paciente selecionado → botão não aparece

- [ ] **Step 7: Commit**

```bash
git add src/components/layout/topbar.tsx
git commit -m "feat(topbar): add Prontuário button to open PatientDashboard drawer"
```

---

## Sessão 2 — Gráficos de Tendência (Sparklines)

**Objetivo:** Componente SVG leve que mostra evolução de vitais (PA, peso, IMC) e exames-chave (HbA1c, creatinina) ao longo das consultas no PatientDashboard.

### Mapa de arquivos

| Ação | Arquivo |
|------|---------|
| Create | `src/components/ui/sparkline.tsx` |
| Create | `src/lib/trend-data.ts` |
| Modify | `src/components/consultation/patient-dashboard.tsx` |

---

### Task 4: Criar componente Sparkline SVG

**Files:**
- Create: `src/components/ui/sparkline.tsx`

- [ ] **Step 1: Criar o componente**

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

export function Sparkline({ data, width = 120, height = 32, color = "var(--color-accent)", label, unit }: SparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(" ");

  const last = data[data.length - 1];

  return (
    <div className="flex items-center gap-2">
      <div className="min-w-0">
        <p className="text-[10px] text-text-tertiary truncate">{label}</p>
        <p className="text-[13px] font-semibold text-text-primary tabular-nums">
          {last} <span className="text-[10px] font-normal text-text-tertiary">{unit}</span>
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
          cx={parseFloat(points.split(" ").pop()!.split(",")[0])}
          cy={parseFloat(points.split(" ").pop()!.split(",")[1])}
          r="2.5"
          fill={color}
        />
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/sparkline.tsx
git commit -m "feat: add Sparkline SVG component"
```

---

### Task 5: Extrair dados de tendência das consultas

**Files:**
- Create: `src/lib/trend-data.ts`

- [ ] **Step 1: Criar o extrator**

```typescript
type ConsultationForTrend = {
  date: string;
  vitals: { pas?: string; pad?: string; peso?: string; imc?: string } | null;
  labs: Record<string, string> | null;
};

export interface TrendSeries {
  label: string;
  unit: string;
  data: number[];
  color?: string;
}

function extractNumbers(consultations: ConsultationForTrend[], extractor: (c: ConsultationForTrend) => string | undefined): number[] {
  return consultations
    .map(extractor)
    .filter((v): v is string => v !== undefined && v !== "")
    .map((v) => parseFloat(v))
    .filter((n) => !isNaN(n))
    .reverse(); // cronológico: mais antigo primeiro
}

export function buildTrendSeries(consultations: ConsultationForTrend[]): TrendSeries[] {
  const series: TrendSeries[] = [];

  const pas = extractNumbers(consultations, (c) => c.vitals?.pas);
  if (pas.length >= 2) series.push({ label: "PAS", unit: "mmHg", data: pas, color: "var(--color-status-crit)" });

  const pad = extractNumbers(consultations, (c) => c.vitals?.pad);
  if (pad.length >= 2) series.push({ label: "PAD", unit: "mmHg", data: pad, color: "var(--color-status-warn)" });

  const peso = extractNumbers(consultations, (c) => c.vitals?.peso);
  if (peso.length >= 2) series.push({ label: "Peso", unit: "kg", data: peso });

  const imc = extractNumbers(consultations, (c) => c.vitals?.imc);
  if (imc.length >= 2) series.push({ label: "IMC", unit: "kg/m²", data: imc });

  const hba1c = extractNumbers(consultations, (c) => c.labs?.hba1c);
  if (hba1c.length >= 2) series.push({ label: "HbA1c", unit: "%", data: hba1c, color: "var(--color-status-info)" });

  const creatinina = extractNumbers(consultations, (c) => c.labs?.creatinina);
  if (creatinina.length >= 2) series.push({ label: "Creatinina", unit: "mg/dL", data: creatinina, color: "var(--color-status-warn)" });

  return series;
}
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/trend-data.ts
git commit -m "feat: add trend data extractor for patient sparklines"
```

---

### Task 6: Integrar sparklines no PatientDashboard

**Files:**
- Modify: `src/components/consultation/patient-dashboard.tsx`

- [ ] **Step 1: Importar dependências**

Adicionar no topo:

```typescript
import { Sparkline } from "@/components/ui/sparkline";
import { buildTrendSeries } from "@/lib/trend-data";
```

- [ ] **Step 2: Calcular séries de tendência**

Dentro do componente, após o `fetchData`, adicionar um memo:

```typescript
const trends = buildTrendSeries(consultations);
```

- [ ] **Step 3: Adicionar seção de tendências no JSX**

Após a seção "Consultas registradas" e antes de "Histórico de consultas":

```tsx
{/* Tendências */}
{trends.length > 0 && (
  <section className="mb-5">
    <p className="text-[10px] text-text-tertiary uppercase tracking-wide mb-2">
      Tendências
    </p>
    <div className="grid grid-cols-2 gap-3">
      {trends.map((t) => (
        <Sparkline
          key={t.label}
          label={t.label}
          unit={t.unit}
          data={t.data}
          color={t.color}
        />
      ))}
    </div>
  </section>
)}
```

- [ ] **Step 4: Verificar TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 5: Testar no browser**
  1. Paciente com 2+ consultas salvas com vitais preenchidos
  2. Abrir Prontuário → seção "Tendências" com sparklines de PA, peso, IMC
  3. Paciente com 1 consulta → sem sparklines (mínimo 2 pontos)
  4. Verificar que os valores mais recentes aparecem ao lado do gráfico

- [ ] **Step 6: Commit**

```bash
git add src/components/consultation/patient-dashboard.tsx
git commit -m "feat(patient-dashboard): add sparkline trends for vitals and labs"
```

---

## Sessão 3 — Medicamentos Contínuos

**Objetivo:** Campo de medicamentos contínuos persistente por paciente (não por consulta). Tabela `patient_medications` no Supabase + UI no PatientDashboard + pré-carga no campo Prescrição.

**⚠️ PREREQUISITO:** Aplicar a migration SQL no Supabase Dashboard ANTES de iniciar esta sessão.

### Mapa de arquivos

| Ação | Arquivo |
|------|---------|
| Create | `migrations/006_add_patient_medications.sql` |
| Modify | `src/types/index.ts` |
| Create | `src/lib/supabase/patient-medications.ts` |
| Modify | `src/components/consultation/patient-dashboard.tsx` |
| Modify | `src/components/layout/topbar.tsx` |

---

### Task 7: Migration SQL

**Files:**
- Create: `migrations/006_add_patient_medications.sql`

- [ ] **Step 1: Criar o arquivo de migration**

```sql
-- 006_add_patient_medications.sql
-- Medicamentos contínuos por paciente

CREATE TABLE patient_medications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  medication_name TEXT NOT NULL,
  dosage TEXT NOT NULL DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  discontinued_at TIMESTAMPTZ
);

CREATE INDEX idx_patient_medications_patient ON patient_medications(patient_id);
CREATE INDEX idx_patient_medications_user ON patient_medications(user_id);

ALTER TABLE patient_medications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own patient medications"
  ON patient_medications
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

- [ ] **Step 2: Commit**

```bash
git add migrations/006_add_patient_medications.sql
git commit -m "feat(db): add patient_medications table for continuous medications"
```

**⚠️ PARAR AQUI — aplicar migration no Supabase Dashboard antes de continuar.**

---

### Task 8: Tipo e CRUD de medicamentos

**Files:**
- Modify: `src/types/index.ts`
- Create: `src/lib/supabase/patient-medications.ts`

- [ ] **Step 1: Adicionar tipo em `src/types/index.ts`**

Após `PatientProblem`:

```typescript
export interface PatientMedication {
  id: string;
  patient_id: string;
  user_id: string;
  medication_name: string;
  dosage: string;
  active: boolean;
  created_at: string;
  discontinued_at: string | null;
}
```

- [ ] **Step 2: Criar `src/lib/supabase/patient-medications.ts`**

```typescript
import { createClient } from "./client";
import type { PatientMedication } from "@/types";

export async function getPatientMedications(patientId: string): Promise<PatientMedication[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("patient_medications")
    .select("*")
    .eq("patient_id", patientId)
    .eq("active", true)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as PatientMedication[];
}

export async function addPatientMedication(
  userId: string,
  patientId: string,
  medicationName: string,
  dosage: string
): Promise<PatientMedication> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("patient_medications")
    .insert({ user_id: userId, patient_id: patientId, medication_name: medicationName, dosage })
    .select()
    .single();

  if (error) throw error;
  return data as PatientMedication;
}

export async function discontinuePatientMedication(medicationId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("patient_medications")
    .update({ active: false, discontinued_at: new Date().toISOString() })
    .eq("id", medicationId);

  if (error) throw error;
}
```

- [ ] **Step 3: Verificar TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 4: Commit**

```bash
git add src/types/index.ts src/lib/supabase/patient-medications.ts
git commit -m "feat: add PatientMedication type and CRUD functions"
```

---

### Task 9: UI de medicamentos no PatientDashboard

**Files:**
- Modify: `src/components/consultation/patient-dashboard.tsx`

- [ ] **Step 1: Importar funções de medicamentos**

```typescript
import { getPatientMedications, addPatientMedication, discontinuePatientMedication } from "@/lib/supabase/patient-medications";
import type { PatientMedication } from "@/types";
```

- [ ] **Step 2: Adicionar state de medicamentos**

No componente, junto aos outros states:

```typescript
const [medications, setMedications] = useState<PatientMedication[]>([]);
const [newMedName, setNewMedName] = useState("");
const [newMedDosage, setNewMedDosage] = useState("");
```

- [ ] **Step 3: Carregar medicamentos no fetchData**

Alterar o `Promise.all` no `fetchData` para incluir medicamentos:

```typescript
const [consResult, problems, meds] = await Promise.all([
  listConsultationsByPatient(patientId),
  getPatientProblems(patientId),
  getPatientMedications(patientId),
]);
setConsultations((consResult.data as ConsultationSummary[]) ?? []);
setActiveProblems(problems);
setMedications(meds);
```

- [ ] **Step 4: Extrair userId via `createClient().auth.getUser()` no componente**

Adicionar no topo do componente:

```typescript
const [userId, setUserId] = useState<string | null>(null);

useEffect(() => {
  createClient().auth.getUser().then(({ data: { user } }) => {
    if (user) setUserId(user.id);
  });
}, []);
```

Importar `createClient`:

```typescript
import { createClient } from "@/lib/supabase/client";
```

- [ ] **Step 5: Adicionar handlers para add/remove**

```typescript
async function handleAddMedication() {
  if (!userId || !patientId || !newMedName.trim()) return;
  try {
    const med = await addPatientMedication(userId, patientId, newMedName.trim(), newMedDosage.trim());
    setMedications((prev) => [...prev, med]);
    setNewMedName("");
    setNewMedDosage("");
  } catch {
    // silencioso
  }
}

async function handleDiscontinue(medId: string) {
  try {
    await discontinuePatientMedication(medId);
    setMedications((prev) => prev.filter((m) => m.id !== medId));
  } catch {
    // silencioso
  }
}
```

- [ ] **Step 6: Adicionar seção de medicamentos no JSX**

Após a seção de problemas ativos:

```tsx
{/* Medicamentos contínuos */}
<section className="mb-5">
  <p className="text-[10px] text-text-tertiary uppercase tracking-wide mb-2">
    Medicamentos contínuos
  </p>
  {medications.length > 0 ? (
    <div className="flex flex-col gap-1 mb-2">
      {medications.map((med) => (
        <div key={med.id} className="flex items-center justify-between gap-2 py-1 px-2 rounded-md bg-bg-2/50 border border-border-subtle/40">
          <div className="min-w-0">
            <p className="text-[11px] text-text-primary truncate">{med.medication_name}</p>
            {med.dosage && (
              <p className="text-[10px] text-text-tertiary">{med.dosage}</p>
            )}
          </div>
          <button
            onClick={() => handleDiscontinue(med.id)}
            className="text-[10px] text-text-tertiary hover:text-status-crit transition-colors cursor-pointer shrink-0"
            title="Suspender"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-[11px] text-text-tertiary mb-2">Nenhum medicamento registrado.</p>
  )}
  <div className="flex gap-1.5">
    <input
      type="text"
      placeholder="Medicamento"
      value={newMedName}
      onChange={(e) => setNewMedName(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleAddMedication()}
      className="flex-1 h-7 px-2 text-[11px] border border-border-subtle rounded-md bg-bg-2 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
    />
    <input
      type="text"
      placeholder="Dose"
      value={newMedDosage}
      onChange={(e) => setNewMedDosage(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleAddMedication()}
      className="w-24 h-7 px-2 text-[11px] border border-border-subtle rounded-md bg-bg-2 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
    />
    <button
      onClick={handleAddMedication}
      disabled={!newMedName.trim()}
      className="h-7 px-2 text-[11px] rounded-md border border-accent/20 text-accent bg-accent/5 hover:bg-accent/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
    >
      +
    </button>
  </div>
</section>
```

- [ ] **Step 7: Verificar TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 8: Testar no browser**
  1. Abrir prontuário de paciente → seção medicamentos vazia
  2. Digitar "Metformina 850mg" + "1cp 2x/dia" + clicar "+" → medicamento adicionado
  3. Fechar e reabrir drawer → medicamento persiste
  4. Clicar "×" → medicamento removido (suspendido)

- [ ] **Step 9: Commit**

```bash
git add src/components/consultation/patient-dashboard.tsx
git commit -m "feat(patient-dashboard): add continuous medications CRUD section"
```

---

### Task 10: Pré-carregar medicamentos no campo Prescrição ao selecionar paciente

**Files:**
- Modify: `src/components/layout/topbar.tsx`

- [ ] **Step 1: Importar `getPatientMedications`**

```typescript
import { getPatientMedications } from "@/lib/supabase/patient-medications";
```

- [ ] **Step 2: Atualizar `handlePatientSelected` para carregar medicamentos**

Dentro de `if (userId) { ... }`, após o bloco de `getPatientProblems`, adicionar:

```typescript
// Pré-carregar medicamentos contínuos no campo prescrição
getPatientMedications(patient.id).then((meds) => {
  if (meds.length > 0 && useConsultationStore.getState().patientId === selectedPatientId) {
    const medLines = meds.map((m) =>
      m.dosage ? `${m.medication_name} - ${m.dosage}` : m.medication_name
    );
    useConsultationStore.getState().setPrescription(medLines.join("\n"));
  }
});
```

- [ ] **Step 3: Verificar TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/topbar.tsx
git commit -m "feat(topbar): pre-load continuous medications into prescription on patient select"
```

---

## Sessão 4 — Rastreamento Completo MS

**Objetivo:** Expandir `clinical-rules.ts` com TODOS os rastreamentos preconizados pelo Ministério da Saúde para atenção primária.

**⚠️ OBRIGATÓRIO:** Buscar as diretrizes vigentes via WebSearch ANTES de escrever qualquer valor. Fontes aceitas: INCA, Ministério da Saúde, CFM, SBC, SBMFC, SBD. Nunca aproximar ou inventar conteúdo clínico.

### Mapa de arquivos

| Ação | Arquivo |
|------|---------|
| Modify | `src/lib/constants.ts` — expandir array PREVENTIONS |
| Modify | `src/lib/clinical-rules.ts` — adicionar regras |

---

### Task 11: Pesquisar diretrizes e expandir PREVENTIONS

**Files:**
- Modify: `src/lib/constants.ts`

- [ ] **Step 1: WebSearch — rastreamento DM2**

Buscar: `"Ministério da Saúde rastreamento diabetes tipo 2 glicemia atenção primária recomendação 2024 Brasil"`

Registrar: público-alvo, frequência, URL da fonte.

- [ ] **Step 2: WebSearch — rastreamento dislipidemia**

Buscar: `"SBC rastreamento dislipidemia perfil lipídico faixa etária recomendação Brasil 2024"`

Registrar.

- [ ] **Step 3: WebSearch — HIV testagem**

Buscar: `"Ministério da Saúde testagem HIV atenção primária população geral recomendação 2024 Brasil"`

Registrar.

- [ ] **Step 4: WebSearch — hepatites B e C**

Buscar: `"Ministério da Saúde rastreamento hepatite B C anti-HCV HBsAg atenção primária recomendação 2024"`

Registrar.

- [ ] **Step 5: WebSearch — sífilis**

Buscar: `"Ministério da Saúde rastreamento sífilis VDRL atenção primária gestante população geral 2024"`

Registrar.

- [ ] **Step 6: WebSearch — tuberculose (ILTB)**

Buscar: `"Ministério da Saúde rastreamento tuberculose latente ILTB contactante atenção primária 2024"`

Registrar.

- [ ] **Step 7: WebSearch — vacinas do adulto (calendário PNI)**

Buscar: `"PNI calendário vacinação adulto 2024 influenza COVID dT hepatite B"`

Registrar.

- [ ] **Step 8: WebSearch — rastreamento visual / auditivo idoso**

Buscar: `"Ministério da Saúde rastreamento visual auditivo idoso atenção primária caderno 2024"`

Registrar.

- [ ] **Step 9: WebSearch — rastreamento depressão atenção primária**

Buscar: `"Ministério da Saúde rastreamento depressão PHQ-2 atenção primária recomendação Brasil 2024"`

Registrar.

- [ ] **Step 10: Expandir array PREVENTIONS em `src/lib/constants.ts`**

Adicionar os novos itens ao array `PREVENTIONS`, mantendo os existentes inalterados. Novos itens estimados (confirmar após pesquisa):

```typescript
export const PREVENTIONS = [
  // --- Existentes ---
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
  // --- Novos ---
  "Glicemia de jejum / TOTG",
  "Perfil lipídico",
  "Sífilis (VDRL/teste rápido)",
  "dT / dTpa (vacinado)",
  "Rastreio depressão (PHQ-2)",
  "Avaliação visual (idoso)",
  "Avaliação auditiva (idoso)",
] as const;
```

**NOTA:** A lista acima é um rascunho. Os itens finais devem ser confirmados pelas pesquisas dos Steps 1–9. Não adicionar itens sem fonte verificada.

- [ ] **Step 11: Verificar TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 12: Commit**

```bash
git add src/lib/constants.ts
git commit -m "feat: expand PREVENTIONS with comprehensive MS screening items"
```

---

### Task 12: Adicionar regras clínicas para novos rastreamentos

**Files:**
- Modify: `src/lib/clinical-rules.ts`

- [ ] **Step 1: Adicionar regras com valores pesquisados**

Expandir o array `CLINICAL_RULES` com regras para cada novo item de PREVENTIONS. Exemplo de estrutura (valores reais das pesquisas):

```typescript
{
  id: "glicemia-rastreio",
  preventionLabel: "Glicemia de jejum / TOTG",
  description: "/* PREENCHER COM FONTE PESQUISADA */",
  condition: (p) =>
    p.age !== null && p.age >= /* IDADE_PESQUISADA */ 45,
},
```

**ATENÇÃO:** Cada regra deve ter:
- `preventionLabel` idêntico ao item em PREVENTIONS
- `description` com frequência + fonte oficial (ex: "A cada 3 anos, ≥ 45 anos — SBD/MS 2024")
- `condition` com valores exatos das pesquisas

Não commitar com placeholders.

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Testar no browser**
  1. Paciente feminina, 70 anos → deve sugerir: mamografia, papanicolau, colonoscopia, densitometria, glicemia, lipídico, depressão, visual, auditivo
  2. Paciente masculino, 30 anos → poucas sugestões (HIV, hepatites se aplicável)
  3. Marcar uma sugestão → sai da lista

- [ ] **Step 4: Commit**

```bash
git add src/lib/clinical-rules.ts
git commit -m "feat: add comprehensive MS clinical screening rules with verified sources"
```

---

## Sessão 5 — Atalhos de Teclado

**Objetivo:** Atalhos globais para produtividade: Ctrl+S salvar, Ctrl+N nova consulta, Ctrl+H histórico, Ctrl+P prontuário.

### Mapa de arquivos

| Ação | Arquivo |
|------|---------|
| Create | `src/hooks/useHotkeys.ts` |
| Modify | `src/components/layout/topbar.tsx` |

---

### Task 13: Criar hook de hotkeys

**Files:**
- Create: `src/hooks/useHotkeys.ts`

- [ ] **Step 1: Criar o hook**

```typescript
"use client";

import { useEffect } from "react";

type HotkeyMap = Record<string, (e: KeyboardEvent) => void>;

export function useHotkeys(hotkeys: HotkeyMap) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const key = [
        e.ctrlKey || e.metaKey ? "mod" : "",
        e.shiftKey ? "shift" : "",
        e.key.toLowerCase(),
      ]
        .filter(Boolean)
        .join("+");

      const action = hotkeys[key];
      if (action) {
        e.preventDefault();
        action(e);
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [hotkeys]);
}
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useHotkeys.ts
git commit -m "feat: add useHotkeys hook for global keyboard shortcuts"
```

---

### Task 14: Integrar hotkeys no Topbar

**Files:**
- Modify: `src/components/layout/topbar.tsx`

- [ ] **Step 1: Importar hook**

```typescript
import { useHotkeys } from "@/hooks/useHotkeys";
```

- [ ] **Step 2: Adicionar `useMemo` para o mapa de atalhos**

Após os `useEffect` existentes:

```typescript
import { useMemo } from "react";

// ... dentro do componente, após useEffect:
const hotkeyMap = useMemo(
  () => ({
    "mod+s": () => handleSave(),
    "mod+n": () => setPatientSelectorOpen(true),
    "mod+h": () => setHistoryOpen((v) => !v),
    "mod+p": () => { if (patientName) setDashboardOpen((v) => !v); },
  }),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [userId, patientName]
);

useHotkeys(hotkeyMap);
```

**NOTA:** O `useMemo` com deps reduzidas é intencional — os handlers usam `useConsultationStore.getState()` para ler estado fresco e as funções `handleSave` / `set*` são estáveis do `useState`.

- [ ] **Step 3: Verificar TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 4: Testar no browser**
  1. Ctrl+S → salva consulta (ou mostra toast se nada preenchido)
  2. Ctrl+N → abre modal de seleção de paciente
  3. Ctrl+H → abre/fecha painel de histórico
  4. Ctrl+P com paciente → abre/fecha prontuário; sem paciente → nada acontece
  5. Verificar que atalhos não disparam dentro de textareas/inputs normalmente (o `preventDefault` no handler cuida disso)

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/topbar.tsx
git commit -m "feat(topbar): add keyboard shortcuts Ctrl+S/N/H/P"
```

---

## Sessão 6 — Busca e Filtros no Histórico

**Objetivo:** Campo de busca no HistoryPanel que filtra consultas por nome do paciente, problema ou texto livre. Filtro por intervalo de datas.

### Mapa de arquivos

| Ação | Arquivo |
|------|---------|
| Modify | `src/lib/supabase/consultations.ts` |
| Modify | `src/components/consultation/history-panel.tsx` |

---

### Task 15: Adicionar busca server-side

**Files:**
- Modify: `src/lib/supabase/consultations.ts`

- [ ] **Step 1: Adicionar função `searchConsultations`**

Após `listConsultations`:

```typescript
export async function searchConsultations(
  userId: string,
  query: string,
  dateFrom?: string,
  dateTo?: string
) {
  const supabase = createClient();
  let q = supabase
    .from("consultations")
    .select("id, date, created_at, problems, vitals, patient_snapshot, patient_id")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(50);

  if (dateFrom) q = q.gte("date", dateFrom);
  if (dateTo) q = q.lte("date", dateTo);

  if (query.trim()) {
    // Busca no patient_snapshot->name ou no assessment ou problems_other
    q = q.or(
      `patient_snapshot->>name.ilike.%${query}%,assessment.ilike.%${query}%,problems_other.ilike.%${query}%,prescription.ilike.%${query}%`
    );
  }

  return q;
}
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/supabase/consultations.ts
git commit -m "feat: add searchConsultations with text and date filters"
```

---

### Task 16: UI de busca no HistoryPanel

**Files:**
- Modify: `src/components/consultation/history-panel.tsx`

- [ ] **Step 1: Importar `searchConsultations`**

```typescript
import { listConsultations, searchConsultations, loadConsultation, dbRecordToState } from "@/lib/supabase/consultations";
```

- [ ] **Step 2: Adicionar states de busca**

Junto aos outros states no componente:

```typescript
const [searchQuery, setSearchQuery] = useState("");
const [dateFrom, setDateFrom] = useState("");
const [dateTo, setDateTo] = useState("");
```

- [ ] **Step 3: Atualizar `fetchHistory` para usar busca**

Substituir a chamada a `listConsultations` por:

```typescript
const hasFilters = searchQuery.trim() || dateFrom || dateTo;
const { data, error } = hasFilters
  ? await searchConsultations(user.id, searchQuery, dateFrom || undefined, dateTo || undefined)
  : await listConsultations(user.id);
```

- [ ] **Step 4: Adicionar debounce de busca**

```typescript
const searchTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

useEffect(() => {
  if (!open) return;
  clearTimeout(searchTimerRef.current);
  searchTimerRef.current = setTimeout(() => {
    fetchHistory();
  }, 300);
  return () => clearTimeout(searchTimerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [searchQuery, dateFrom, dateTo]);
```

- [ ] **Step 5: Adicionar campos de busca no JSX**

Após o header e antes do `{/* List */}`:

```tsx
{/* Search */}
<div className="px-3 py-2 border-b border-border-subtle/60 space-y-1.5">
  <input
    type="text"
    placeholder="Buscar paciente, problema, texto..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full h-8 px-2.5 text-[12px] border border-border-subtle rounded-md bg-bg-2 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
  />
  <div className="flex gap-1.5">
    <input
      type="date"
      value={dateFrom}
      onChange={(e) => setDateFrom(e.target.value)}
      className="flex-1 h-7 px-2 text-[11px] border border-border-subtle rounded-md bg-bg-2 text-text-secondary focus:outline-none focus:border-accent"
      title="Data inicial"
    />
    <input
      type="date"
      value={dateTo}
      onChange={(e) => setDateTo(e.target.value)}
      className="flex-1 h-7 px-2 text-[11px] border border-border-subtle rounded-md bg-bg-2 text-text-secondary focus:outline-none focus:border-accent"
      title="Data final"
    />
  </div>
</div>
```

- [ ] **Step 6: Verificar TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 7: Testar no browser**
  1. Abrir histórico → campo de busca visível
  2. Digitar nome de paciente → lista filtra automaticamente (300ms debounce)
  3. Selecionar datas → filtra por intervalo
  4. Limpar busca → lista completa retorna
  5. Buscar por texto de prescrição (ex: "Metformina") → consultas relevantes aparecem

- [ ] **Step 8: Commit**

```bash
git add src/components/consultation/history-panel.tsx
git commit -m "feat(history-panel): add search and date filter UI"
```

---

## Resumo das Sessões

| Sessão | Objetivo | Tasks | DB Migration |
|--------|----------|-------|-------------|
| 1 | Ficha do Paciente (Drawer) | 1–3 | — |
| 2 | Gráficos de Tendência (Sparklines) | 4–6 | — |
| 3 | Medicamentos Contínuos | 7–10 | `006_add_patient_medications.sql` |
| 4 | Rastreamento Completo MS | 11–12 | — |
| 5 | Atalhos de Teclado | 13–14 | — |
| 6 | Busca no Histórico | 15–16 | — |

**Ordem de execução obrigatória para Sessão 3:** aplicar a migration SQL no Supabase Dashboard **antes** de iniciar a sessão.

**Sessão 4 é bloqueante de conteúdo:** os Tasks 11–12 exigem WebSearch para todos os valores clínicos antes de escrever o código. Nenhum valor pode ser hardcoded sem fonte verificada.
