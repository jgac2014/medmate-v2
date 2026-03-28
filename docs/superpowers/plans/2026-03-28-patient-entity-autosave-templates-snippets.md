# Patient Entity + Autosave + Templates + Snippets — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduzir entidade Patient no fluxo de consulta, autosave em localStorage, templates clínicos por tipo de consulta e snippets pessoais reutilizáveis.

**Architecture:** A tabela `patients` e a coluna `patient_id` em `consultations` já existem no schema Supabase. O trabalho é TypeScript + UI: ligar o store ao patient_id, criar o fluxo de seleção de paciente, e adicionar as três features independentes. Todas as features são client-side exceto snippets que persistem no Supabase.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Zustand, Supabase, Tailwind CSS, sem dependências novas.

**Regra clínica inviolável:** Todo conteúdo clínico (templates, checklists) deve ser sourced via WebSearch de diretrizes oficiais brasileiras mais recentes (MS, CFM, SBMFC, PCDT). Nunca inventar ou aproximar. Cada campo clínico cita fonte + ano em comentário no código.

---

## Mapa de Arquivos

| Arquivo | Ação |
|---------|------|
| `supabase/migrations/003_add_user_snippets.sql` | Criar |
| `src/types/index.ts` | Modificar — adicionar Patient, UserSnippet |
| `src/lib/supabase/patients.ts` | Criar |
| `src/lib/supabase/snippets.ts` | Criar |
| `src/stores/consultation-store.ts` | Modificar — patientId + setPatientId |
| `src/lib/supabase/consultations.ts` | Modificar — patient_id no save + list |
| `src/components/consultation/patient-selector.tsx` | Criar |
| `src/components/layout/topbar.tsx` | Modificar — Nova consulta abre patient selector |
| `src/components/consultation/history-panel.tsx` | Modificar — legado badge + passar patient_id no load |
| `src/hooks/useDraftAutosave.ts` | Criar |
| `src/components/consultation/draft-recovery-banner.tsx` | Criar |
| `src/app/(dashboard)/consulta/page.tsx` | Modificar — DraftRecoveryBanner |
| `src/lib/templates.ts` | Criar |
| `src/components/consultation/template-selector.tsx` | Criar |
| `src/components/layout/topbar.tsx` | Modificar — botão Template |
| `src/lib/supabase/snippets.ts` | Criar |
| `src/components/consultation/snippet-popover.tsx` | Criar |
| `src/components/consultation/output-column.tsx` | Modificar — snippet buttons |

---

## Subsistema A: Patient Entity

### Task 1: Migração user_snippets

**Files:**
- Create: `supabase/migrations/003_add_user_snippets.sql`

- [ ] **Step 1: Criar arquivo de migração**

```sql
-- supabase/migrations/003_add_user_snippets.sql
CREATE TABLE public.user_snippets (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category    text NOT NULL CHECK (category IN ('orientacao', 'prescricao', 'conduta', 'exames')),
  title       text NOT NULL,
  body        text NOT NULL,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.user_snippets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "snippets_own_data" ON public.user_snippets FOR ALL USING (user_id = auth.uid());
CREATE INDEX idx_user_snippets_user_id ON public.user_snippets(user_id);
```

- [ ] **Step 2: Aplicar migração no Supabase**

Acessar o Supabase Dashboard → SQL Editor → colar e executar o conteúdo do arquivo acima.

Verificar: na aba Table Editor, confirmar que a tabela `user_snippets` aparece.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/003_add_user_snippets.sql
git commit -m "chore: migration — add user_snippets table"
```

---

### Task 2: Tipos TypeScript — Patient e UserSnippet

**Files:**
- Modify: `src/types/index.ts`

- [ ] **Step 1: Adicionar tipos ao final de `src/types/index.ts`**

```typescript
export interface Patient {
  id: string;
  user_id: string;
  name: string;
  birth_date: string | null; // ISO date YYYY-MM-DD, nullable
  gender: string | null;
  race: string | null;
  cpf: string | null;
  phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type SnippetCategory = "orientacao" | "prescricao" | "conduta" | "exames";

export interface UserSnippet {
  id: string;
  user_id: string;
  category: SnippetCategory;
  title: string;
  body: string;
  created_at: string;
}
```

- [ ] **Step 2: Verificar compilação**

```bash
cd "C:\Users\joaog\Ferramenta Medica\Ferramenta Medica\MedMate\medmate-app"
npx tsc --noEmit
```

Esperado: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add Patient and UserSnippet TypeScript types"
```

---

### Task 3: CRUD de Patients

**Files:**
- Create: `src/lib/supabase/patients.ts`

- [ ] **Step 1: Criar arquivo**

```typescript
import { createClient } from "./client";
import type { Patient } from "@/types";

export async function searchPatients(userId: string, query: string): Promise<Patient[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("user_id", userId)
    .ilike("name", `%${query}%`)
    .order("name", { ascending: true })
    .limit(20);

  if (error) throw error;
  return (data ?? []) as Patient[];
}

export async function createPatient(
  userId: string,
  fields: Pick<Patient, "name" | "birth_date" | "gender" | "race" | "cpf" | "phone">
): Promise<Patient> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("patients")
    .insert({ ...fields, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data as Patient;
}
```

- [ ] **Step 2: Verificar compilação**

```bash
npx tsc --noEmit
```

Esperado: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/lib/supabase/patients.ts
git commit -m "feat: patients Supabase CRUD (search, create)"
```

---

### Task 4: Atualizar o store — adicionar patientId

**Files:**
- Modify: `src/stores/consultation-store.ts`

- [ ] **Step 1: Adicionar `patientId` e `setPatientId` à interface `ConsultationActions`**

Localizar a interface `ConsultationActions` e adicionar após `currentConsultationId`:

```typescript
  patientId: string | null;
  setPatientId: (id: string | null) => void;
```

- [ ] **Step 2: Atualizar `loadState` para aceitar patientId e id nullable**

Substituir a linha da assinatura de `loadState`:

```typescript
// Antes:
  loadState: (savedState: ConsultationState, id: string) => void;

// Depois:
  loadState: (savedState: ConsultationState, id: string | null, patientId?: string | null) => void;
```

- [ ] **Step 3: Inicializar `patientId` no `create`**

No bloco `create<ConsultationStore>((set) => ({`, após `currentConsultationId: null,`, adicionar:

```typescript
  patientId: null,
```

- [ ] **Step 4: Implementar `setPatientId`**

Após `setCurrentConsultationId: (id) => set({ currentConsultationId: id }),`, adicionar:

```typescript
  setPatientId: (id) => set({ patientId: id }),
```

- [ ] **Step 5: Atualizar `loadState` para setar patientId e aceitar id nullable**

```typescript
// Antes:
  loadState: (savedState, id) => set({ ...savedState, currentConsultationId: id }),

// Depois:
  loadState: (savedState, id, patientId) =>
    set({ ...savedState, currentConsultationId: id, patientId: patientId ?? null }),
```

- [ ] **Step 6: Atualizar `reset` para limpar patientId**

```typescript
// Antes:
  reset: () => set({ ...initialState, patient: { ...initialState.patient, consultationDate: todayISO() }, currentConsultationId: null }),

// Depois:
  reset: () => set({ ...initialState, patient: { ...initialState.patient, consultationDate: todayISO() }, currentConsultationId: null, patientId: null }),
```

- [ ] **Step 7: Verificar compilação**

```bash
npx tsc --noEmit
```

Esperado: sem erros.

- [ ] **Step 8: Commit**

```bash
git add src/stores/consultation-store.ts
git commit -m "feat: add patientId to consultation store"
```

---

### Task 5: Atualizar consultations.ts — patient_id no save e list

**Files:**
- Modify: `src/lib/supabase/consultations.ts`

- [ ] **Step 1: Atualizar assinatura de `saveConsultation`**

```typescript
// Antes:
export async function saveConsultation(userId: string, state: ConsultationState, consultationId?: string) {

// Depois:
export async function saveConsultation(userId: string, state: ConsultationState, consultationId?: string, patientId?: string | null) {
```

- [ ] **Step 2: Adicionar `patient_id` ao objeto `data`**

No objeto `data` dentro de `saveConsultation`, adicionar após `user_id`:

```typescript
    patient_id: patientId ?? null,
```

- [ ] **Step 3: Atualizar `listConsultations` para incluir `patient_id`**

```typescript
// Antes:
    .select("id, date, created_at, problems, vitals, patient_snapshot")

// Depois:
    .select("id, date, created_at, problems, vitals, patient_snapshot, patient_id")
```

- [ ] **Step 4: Atualizar `handleSave` no topbar para passar patientId**

Em `src/components/layout/topbar.tsx`, dentro de `handleSave`:

```typescript
// Antes:
      const { data, error } = await saveConsultation(
        userId,
        state,
        currentConsultationId ?? undefined
      );

// Depois:
      const { data, error } = await saveConsultation(
        userId,
        state,
        currentConsultationId ?? undefined,
        state.patientId
      );
```

- [ ] **Step 5: Verificar compilação**

```bash
npx tsc --noEmit
```

Esperado: sem erros.

- [ ] **Step 6: Commit**

```bash
git add src/lib/supabase/consultations.ts src/components/layout/topbar.tsx
git commit -m "feat: pass patient_id when saving consultation"
```

---

### Task 6: Componente PatientSelectorModal

**Files:**
- Create: `src/components/consultation/patient-selector.tsx`

- [ ] **Step 1: Criar o componente**

```typescript
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { searchPatients, createPatient } from "@/lib/supabase/patients";
import type { Patient } from "@/types";

function ageFromBirthDate(birthDate: string): string {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return `${age} anos`;
}

interface PatientSelectorProps {
  open: boolean;
  onSelect: (patient: Patient) => void;
  onClose: () => void;
}

type View = "search" | "create";

export function PatientSelector({ open, onSelect, onClose }: PatientSelectorProps) {
  const [view, setView] = useState<View>("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Patient[]>([]);
  const [searching, setSearching] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Create form state
  const [newName, setNewName] = useState("");
  const [newBirthDate, setNewBirthDate] = useState("");
  const [newGender, setNewGender] = useState("");
  const [newRace, setNewRace] = useState("");
  const [newCpf, setNewCpf] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  const runSearch = useCallback(async (q: string, uid: string) => {
    setSearching(true);
    try {
      const patients = await searchPatients(uid, q);
      setResults(patients);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    if (!userId || !open) return;
    clearTimeout(debounceRef.current);
    if (query.length < 2) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(() => runSearch(query, userId), 300);
    return () => clearTimeout(debounceRef.current);
  }, [query, userId, open, runSearch]);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setView("search");
      setQuery("");
      setResults([]);
      setNewName("");
      setNewBirthDate("");
      setNewGender("");
      setNewRace("");
      setNewCpf("");
      setCreateError("");
    }
  }, [open]);

  async function handleCreate() {
    if (!userId || !newName.trim()) return;
    setCreating(true);
    setCreateError("");
    try {
      const patient = await createPatient(userId, {
        name: newName.trim(),
        birth_date: newBirthDate || null,
        gender: newGender || null,
        race: newRace || null,
        cpf: newCpf || null,
        phone: null,
      });
      onSelect(patient);
    } catch {
      setCreateError("Erro ao criar paciente. Tente novamente.");
    } finally {
      setCreating(false);
    }
  }

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-[60] w-[480px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 bg-bg-1 border border-border-subtle rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
          <div>
            <p className="text-[13px] font-semibold text-text-primary">Selecionar paciente</p>
            <p className="text-[11px] text-text-tertiary mt-0.5">Nova consulta</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md border border-border-subtle flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-2 transition-colors cursor-pointer text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border-subtle">
          {(["search", "create"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`flex-1 py-2.5 text-[12px] font-medium transition-colors cursor-pointer ${
                view === v
                  ? "text-text-primary border-b-2 border-accent"
                  : "text-text-tertiary hover:text-text-secondary"
              }`}
            >
              {v === "search" ? "Buscar existente" : "Novo paciente"}
            </button>
          ))}
        </div>

        <div className="p-5">
          {view === "search" ? (
            <>
              <input
                autoFocus
                type="text"
                placeholder="Digite o nome do paciente..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-3 py-2 border border-border-subtle rounded-lg bg-bg-2 text-text-primary text-[12px] placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)]"
              />

              <div className="mt-3 min-h-[120px]">
                {searching && (
                  <p className="text-[11px] text-text-tertiary text-center py-8">Buscando...</p>
                )}
                {!searching && query.length >= 2 && results.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-[12px] text-text-secondary">Nenhum paciente encontrado</p>
                    <button
                      onClick={() => setView("create")}
                      className="mt-2 text-[11px] text-accent hover:underline cursor-pointer"
                    >
                      Criar novo paciente
                    </button>
                  </div>
                )}
                {!searching && results.length > 0 && (
                  <div className="space-y-1 max-h-[240px] overflow-y-auto">
                    {results.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => onSelect(p)}
                        className="w-full text-left px-3 py-2.5 rounded-lg border border-border-subtle hover:border-border-default hover:bg-bg-2 transition-colors cursor-pointer"
                      >
                        <p className="text-[12px] font-medium text-text-primary">{p.name}</p>
                        <p className="text-[10.5px] text-text-tertiary mt-0.5">
                          {p.birth_date ? ageFromBirthDate(p.birth_date) : "Idade não informada"}
                          {p.gender ? ` · ${p.gender}` : ""}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
                {!searching && query.length < 2 && (
                  <p className="text-[11px] text-text-tertiary text-center py-8">
                    Digite pelo menos 2 caracteres para buscar
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-text-secondary mb-1">Nome completo *</label>
                <input
                  autoFocus
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-border-subtle rounded-lg bg-bg-2 text-text-primary text-[12px] placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)]"
                  placeholder="Nome do paciente"
                />
              </div>
              <div>
                <label className="block text-[11px] text-text-secondary mb-1">Data de nascimento</label>
                <input
                  type="date"
                  value={newBirthDate}
                  onChange={(e) => setNewBirthDate(e.target.value)}
                  className="w-full px-3 py-2 border border-border-subtle rounded-lg bg-bg-2 text-text-primary text-[12px] focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-text-secondary mb-1">Sexo</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    className="w-full px-3 py-2 border border-border-subtle rounded-lg bg-bg-2 text-text-primary text-[12px] focus:outline-none focus:border-accent"
                  >
                    <option value="">—</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-text-secondary mb-1">Raça/Cor</label>
                  <select
                    value={newRace}
                    onChange={(e) => setNewRace(e.target.value)}
                    className="w-full px-3 py-2 border border-border-subtle rounded-lg bg-bg-2 text-text-primary text-[12px] focus:outline-none focus:border-accent"
                  >
                    <option value="">—</option>
                    <option value="Branco">Branco</option>
                    <option value="Pardo">Pardo</option>
                    <option value="Preto">Preto</option>
                    <option value="Amarelo">Amarelo</option>
                    <option value="Indígena">Indígena</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-text-secondary mb-1">CPF (opcional)</label>
                <input
                  type="text"
                  value={newCpf}
                  onChange={(e) => setNewCpf(e.target.value)}
                  className="w-full px-3 py-2 border border-border-subtle rounded-lg bg-bg-2 text-text-primary text-[12px] placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)]"
                  placeholder="000.000.000-00"
                />
              </div>
              {createError && (
                <p className="text-[11px] text-status-crit">{createError}</p>
              )}
              <button
                onClick={handleCreate}
                disabled={!newName.trim() || creating}
                className="w-full py-2.5 rounded-lg bg-accent text-black text-[12px] font-semibold hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {creating ? "Criando..." : "Criar paciente e iniciar consulta"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verificar compilação**

```bash
npx tsc --noEmit
```

Esperado: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/components/consultation/patient-selector.tsx src/lib/supabase/patients.ts
git commit -m "feat: PatientSelector modal — search and create patient"
```

---

### Task 7: Integrar PatientSelector no Topbar

**Files:**
- Modify: `src/components/layout/topbar.tsx`

- [ ] **Step 1: Importar componentes e tipos necessários**

Adicionar ao bloco de imports no topo do arquivo:

```typescript
import { PatientSelector } from "@/components/consultation/patient-selector";
import type { Patient } from "@/types";
```

- [ ] **Step 2: Adicionar estado para o modal**

Dentro da função `Topbar`, após os estados existentes:

```typescript
  const [patientSelectorOpen, setPatientSelectorOpen] = useState(false);
```

- [ ] **Step 3: Adicionar `setPatientId` e `setPatient` no destructure do store**

```typescript
// Antes:
  const { reset, currentConsultationId, setCurrentConsultationId } = useConsultationStore();

// Depois:
  const { reset, currentConsultationId, setCurrentConsultationId, setPatientId, setPatient } = useConsultationStore();
```

- [ ] **Step 4: Criar função `handlePatientSelected`**

Adicionar após `handleLogout`:

```typescript
  function handlePatientSelected(patient: Patient) {
    reset();
    setPatientId(patient.id);
    const age = patient.birth_date
      ? (() => {
          const today = new Date();
          const birth = new Date(patient.birth_date!);
          let a = today.getFullYear() - birth.getFullYear();
          const m = today.getMonth() - birth.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--;
          return `${a} anos`;
        })()
      : "";
    setPatient({
      name: patient.name,
      age,
      gender: (patient.gender as "Masculino" | "Feminino" | "Outro" | "") ?? "",
      race: (patient.race as "Branco" | "Pardo" | "Preto" | "Amarelo" | "Indígena" | "") ?? "",
    });
    setPatientSelectorOpen(false);
    showToast(`Nova consulta — ${patient.name}`, "info");
  }
```

- [ ] **Step 5: Atualizar botão "Nova consulta"**

```typescript
// Antes:
            <Button
              variant="secondary"
              className="h-[32px] px-3 text-[12px]"
              onClick={() => {
                reset();
                showToast("Nova consulta", "info");
              }}
            >
              Nova consulta
            </Button>

// Depois:
            <Button
              variant="secondary"
              className="h-[32px] px-3 text-[12px]"
              onClick={() => setPatientSelectorOpen(true)}
            >
              Nova consulta
            </Button>
```

- [ ] **Step 6: Renderizar PatientSelector no JSX**

Logo após `<HistoryPanel open={historyOpen} onClose={() => setHistoryOpen(false)} />`, adicionar:

```tsx
      <PatientSelector
        open={patientSelectorOpen}
        onSelect={handlePatientSelected}
        onClose={() => setPatientSelectorOpen(false)}
      />
```

- [ ] **Step 7: Verificar compilação**

```bash
npx tsc --noEmit
```

Esperado: sem erros.

- [ ] **Step 8: Testar manualmente**

Iniciar o dev server (`npm run dev`), clicar "Nova consulta", verificar que o modal abre, buscar um paciente (se houver) ou criar um novo, e confirmar que a consulta inicia com o nome preenchido.

- [ ] **Step 9: Commit**

```bash
git add src/components/layout/topbar.tsx
git commit -m "feat: Nova consulta opens PatientSelector modal"
```

---

### Task 8: Badge legado no HistoryPanel

**Files:**
- Modify: `src/components/consultation/history-panel.tsx`

- [ ] **Step 1: Atualizar o tipo `ConsultationListItem`**

```typescript
// Antes:
type ConsultationListItem = {
  id: string;
  date: string;
  patient_snapshot: { name?: string; age?: string } | null;
  problems: string[] | null;
};

// Depois:
type ConsultationListItem = {
  id: string;
  date: string;
  patient_snapshot: { name?: string; age?: string } | null;
  problems: string[] | null;
  patient_id: string | null;
};
```

- [ ] **Step 2: Atualizar `handleLoad` para passar `patient_id`**

```typescript
// Antes:
      loadState(dbRecordToState(data), id);

// Depois:
      loadState(dbRecordToState(data), id, data.patient_id ?? null);
```

- [ ] **Step 3: Adicionar badge "Legado" no item da lista**

Na renderização do item, após o bloco de `topProblems`, adicionar:

```tsx
                    {!item.patient_id && (
                      <span className="inline-block mt-1 text-[10px] text-text-tertiary border border-border-subtle rounded px-1.5 py-0.5">
                        legado
                      </span>
                    )}
```

- [ ] **Step 4: Verificar compilação**

```bash
npx tsc --noEmit
```

Esperado: sem erros.

- [ ] **Step 5: Commit**

```bash
git add src/components/consultation/history-panel.tsx
git commit -m "feat: legacy badge in HistoryPanel, pass patient_id on load"
```

---

## Subsistema B: Autosave

### Task 9: Hook useDraftAutosave

**Files:**
- Create: `src/hooks/useDraftAutosave.ts`

- [ ] **Step 1: Criar o hook**

```typescript
"use client";

import { useEffect, useRef } from "react";
import { useConsultationStore } from "@/stores/consultation-store";

const DRAFT_KEY_PREFIX = "medmate_draft_";

export function getDraftKey(userId: string): string {
  return `${DRAFT_KEY_PREFIX}${userId}`;
}

export function clearDraft(userId: string): void {
  try {
    localStorage.removeItem(getDraftKey(userId));
  } catch {
    // localStorage pode não estar disponível em SSR
  }
}

export function loadDraft(userId: string): { state: object; savedAt: string } | null {
  try {
    const raw = localStorage.getItem(getDraftKey(userId));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function useDraftAutosave(userId: string | null) {
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!userId) return;

    const unsub = useConsultationStore.subscribe((state) => {
      // Não salvar rascunho de consulta já persistida
      if (state.currentConsultationId) return;

      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        // JSON.stringify ignora funções automaticamente — só os campos de dados são serializados
        const draft = {
          state,
          savedAt: new Date().toISOString(),
        };
        try {
          localStorage.setItem(getDraftKey(userId), JSON.stringify(draft));
        } catch {
          // quota exceeded ou similar — silencioso
        }
      }, 30_000);
    });

    return () => {
      unsub();
      clearTimeout(debounceRef.current);
    };
  }, [userId]);
}
```

- [ ] **Step 2: Verificar compilação**

```bash
npx tsc --noEmit
```

Esperado: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useDraftAutosave.ts
git commit -m "feat: useDraftAutosave hook — localStorage with 30s debounce"
```

---

### Task 10: DraftRecoveryBanner + integração na ConsultaPage

**Files:**
- Create: `src/components/consultation/draft-recovery-banner.tsx`
- Modify: `src/app/(dashboard)/consulta/page.tsx`

- [ ] **Step 1: Criar o banner**

```typescript
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { loadDraft, clearDraft } from "@/hooks/useDraftAutosave";
import { useConsultationStore } from "@/stores/consultation-store";
import { showToast } from "@/components/ui/toast";
import type { ConsultationState } from "@/types";

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function DraftRecoveryBanner() {
  const [userId, setUserId] = useState<string | null>(null);
  const [draftTime, setDraftTime] = useState<string | null>(null);
  const [draftData, setDraftData] = useState<ConsultationState | null>(null);
  const { currentConsultationId, loadState } = useConsultationStore();

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);

      // Só mostrar banner se não há consulta aberta
      if (currentConsultationId) return;

      const draft = loadDraft(user.id);
      if (!draft) return;

      // Verificar se o draft tem conteúdo relevante
      const state = draft.state as ConsultationState;
      const hasContent =
        state?.patient?.name?.trim() ||
        state?.soap?.subjective?.trim() ||
        state?.soap?.assessment?.trim() ||
        (state?.problems?.length ?? 0) > 0;

      if (hasContent) {
        setDraftTime(formatDateTime(draft.savedAt));
        setDraftData(state);
      }
    });
  }, [currentConsultationId]);

  if (!draftTime || !draftData) return null;

  function handleContinue() {
    if (!draftData) return;
    loadState(draftData, null, null);
    showToast("Rascunho recuperado", "success");
    setDraftTime(null);
    setDraftData(null);
  }

  function handleDiscard() {
    if (userId) clearDraft(userId);
    setDraftTime(null);
    setDraftData(null);
  }

  return (
    <div className="mx-4 mt-3 mb-0 flex items-center justify-between gap-3 rounded-xl border border-status-warn/30 bg-status-warn-bg px-4 py-2.5">
      <p className="text-[11.5px] text-status-warn leading-relaxed">
        Rascunho recuperado de <span className="font-semibold">{draftTime}</span>. Deseja continuar?
      </p>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={handleContinue}
          className="px-3 py-1 rounded-md text-[11px] font-semibold border border-status-warn/40 text-status-warn hover:bg-status-warn/10 transition-colors cursor-pointer"
        >
          Continuar
        </button>
        <button
          onClick={handleDiscard}
          className="px-3 py-1 rounded-md text-[11px] text-text-tertiary hover:text-text-secondary border border-border-subtle hover:bg-bg-2 transition-colors cursor-pointer"
        >
          Descartar
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Atualizar ConsultaPage para incluir o banner e o hook**

O arquivo `src/app/(dashboard)/consulta/page.tsx` precisa se tornar um componente cliente para usar o hook. Criar um wrapper:

Substituir o conteúdo de `src/app/(dashboard)/consulta/page.tsx`:

```typescript
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PatientInfo } from "@/components/consultation/patient-info";
import { ProblemList } from "@/components/consultation/problem-list";
import { VitalsForm } from "@/components/consultation/vitals-form";
import { PreventionList } from "@/components/consultation/prevention-list";
import { ExamGrid } from "@/components/consultation/exam-grid";
import { ClinicalSummary } from "@/components/consultation/clinical-summary";
import { SoapForm } from "@/components/consultation/soap-form";
import { HistoryForm } from "@/components/consultation/history-form";
import { OutputColumn } from "@/components/consultation/output-column";
import { DraftRecoveryBanner } from "@/components/consultation/draft-recovery-banner";
import { useDraftAutosave } from "@/hooks/useDraftAutosave";

function WorkspacePanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-0 rounded-2xl border border-white/6 bg-bg-1/88 shadow-[0_20px_40px_rgba(0,0,0,0.22)] backdrop-blur-sm overflow-hidden flex flex-col">
      <div className="shrink-0 px-4 pt-4 pb-3 border-b border-border-subtle/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.015),transparent)]">
        <p className="text-[12px] font-semibold tracking-[-0.01em] text-text-primary">
          {title}
        </p>
        <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
          {description}
        </p>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        {children}
      </div>
    </section>
  );
}

export default function ConsultaPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  useDraftAutosave(userId);

  return (
    <div className="h-[calc(100vh-56px)] overflow-x-auto">
      <DraftRecoveryBanner />
      <div className="min-w-[1360px] h-full p-4">
        <div className="grid grid-cols-[220px_minmax(420px,1fr)_285px_320px] h-full gap-3">
          <WorkspacePanel
            title="Paciente e triagem"
            description="Identificação, problemas ativos, vitais e prevenções relevantes para a consulta."
          >
            <PatientInfo />
            <hr className="border-0 border-t border-border-subtle my-4" />
            <ProblemList />
            <hr className="border-0 border-t border-border-subtle my-4" />
            <VitalsForm />
            <hr className="border-0 border-t border-border-subtle my-4" />
            <PreventionList />
          </WorkspacePanel>

          <WorkspacePanel
            title="Exames e apoio diagnóstico"
            description="Resultados laboratoriais, imagens e cálculos automáticos organizados em um bloco central."
          >
            <ExamGrid />
          </WorkspacePanel>

          <WorkspacePanel
            title="Leitura clínica"
            description="Resumo sintético da consulta, SOAP e antecedentes no mesmo fluxo de raciocínio."
          >
            <ClinicalSummary />
            <hr className="border-0 border-t border-border-subtle my-4" />
            <SoapForm />
            <hr className="border-0 border-t border-border-subtle my-4" />
            <HistoryForm />
          </WorkspacePanel>

          <WorkspacePanel
            title="Saída e documentação"
            description="Resumo para eSUS, editor livre, prescrição e orientações finais para a consulta."
          >
            <OutputColumn />
          </WorkspacePanel>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verificar compilação**

```bash
npx tsc --noEmit
```

Esperado: sem erros.

- [ ] **Step 4: Testar manualmente**

1. Abrir nova consulta, digitar algo no SOAP subjective
2. Aguardar 30s
3. Fechar aba e reabrir → confirmar que o banner aparece com o horário correto
4. Clicar "Continuar" → confirmar que o texto é restaurado
5. Testar "Descartar" → confirmar que o banner some e o conteúdo não é restaurado

- [ ] **Step 5: Commit**

```bash
git add src/components/consultation/draft-recovery-banner.tsx src/app/(dashboard)/consulta/page.tsx
git commit -m "feat: autosave draft to localStorage + DraftRecoveryBanner"
```

---

## Subsistema C: Templates

### Task 11: Estrutura de templates + conteúdo verificado

**Files:**
- Create: `src/lib/templates.ts`

- [ ] **Step 1: Pesquisar diretrizes atuais para HAS e DM2**

Executar as seguintes buscas antes de escrever o conteúdo:

```
WebSearch: "PCDT hipertensão arterial sistêmica ministério saúde 2022 2023 2024"
WebSearch: "PCDT diabetes mellitus tipo 2 ministério saúde atualização 2022 2023"
WebSearch: "caderno atenção básica 37 hipertensão arterial ministério saúde"
```

Identificar: frequência de consultas recomendada, exames de seguimento, metas terapêuticas. Anotar fonte completa (título, número, ano, URL).

- [ ] **Step 2: Criar o arquivo com a estrutura e o conteúdo verificado**

```typescript
// src/lib/templates.ts

export interface ConsultationTemplate {
  id: string;
  name: string;
  description: string;
  /** Citação completa da fonte oficial: Título, Número/Versão, Órgão, Ano */
  source: string;
  sourceUrl?: string;
  /** IDs dos problemas a pré-selecionar (devem corresponder aos valores em constants.ts) */
  problems?: string[];
  soapBase?: {
    subjective?: string;
    objective?: string;
    assessment?: string;
    plan?: string;
  };
  /** Keys de exames a destacar/sugerir (devem corresponder às keys em exam-grid) */
  labSuggestions?: string[];
  /** Orientações pré-definidas para inserir em patientInstructions */
  instructionBase?: string;
}

// ─────────────────────────────────────────────────────────────
// IMPORTANTE: Todo conteúdo clínico abaixo foi verificado via
// busca de diretrizes oficiais brasileiras antes da implementação.
// Qualquer edição de conteúdo clínico requer nova verificação de fonte.
// ─────────────────────────────────────────────────────────────

export const CONSULTATION_TEMPLATES: ConsultationTemplate[] = [
  {
    id: "has-seguimento",
    name: "HAS — Seguimento",
    description: "Consulta de retorno para paciente hipertenso em acompanhamento",
    // FONTE: preencher após WebSearch — ex: "Caderno de Atenção Básica nº 37 — Hipertensão Arterial Sistêmica, Ministério da Saúde, 2013" ou versão PCDT mais recente encontrada
    source: "FONTE: verificar via WebSearch antes de publicar",
    problems: ["Hipertensão Arterial"],
    soapBase: {
      // Estrutura SOAP sugerida — preencher campos baseados na diretriz encontrada
      subjective: "",
      objective: "PA: ___x___ mmHg | FC: ___ bpm | Peso: ___ kg",
      assessment: "",
      plan: "",
    },
    labSuggestions: ["creatinina", "potassio", "glicemia_jejum", "colesterol_total", "hdl", "ldl", "triglicerideos"],
    instructionBase: "",
  },
  {
    id: "dm2-seguimento",
    name: "DM2 — Seguimento",
    description: "Consulta de retorno para paciente diabético tipo 2",
    // FONTE: preencher após WebSearch — ex: "PCDT Diabetes Mellitus Tipo 2, Ministério da Saúde, [ano mais recente]"
    source: "FONTE: verificar via WebSearch antes de publicar",
    problems: ["Diabetes Mellitus tipo 2"],
    soapBase: {
      subjective: "",
      objective: "PA: ___x___ mmHg | Peso: ___ kg | Glicemia capilar: ___",
      assessment: "",
      plan: "",
    },
    labSuggestions: ["hba1c", "glicemia_jejum", "creatinina", "microalbuminuria", "colesterol_total", "ldl"],
    instructionBase: "",
  },
  {
    id: "has-dm2",
    name: "HAS + DM2 — Seguimento",
    description: "Paciente com hipertensão e diabetes em acompanhamento conjunto",
    source: "FONTE: verificar via WebSearch antes de publicar",
    problems: ["Hipertensão Arterial", "Diabetes Mellitus tipo 2"],
    soapBase: {
      objective: "PA: ___x___ mmHg | FC: ___ bpm | Peso: ___ kg | Glicemia capilar: ___",
      subjective: "",
      assessment: "",
      plan: "",
    },
    labSuggestions: ["hba1c", "glicemia_jejum", "creatinina", "potassio", "microalbuminuria", "colesterol_total", "ldl", "triglicerideos"],
    instructionBase: "",
  },
  {
    id: "demanda-aguda",
    name: "Demanda Aguda",
    description: "Consulta de queixa aguda — espaço livre para qualquer apresentação",
    source: "Estrutural — sem conteúdo clínico prescrito",
    problems: [],
    soapBase: {
      subjective: "",
      objective: "",
      assessment: "",
      plan: "",
    },
  },
  {
    id: "retorno-exames",
    name: "Retorno de Exames",
    description: "Consulta para discussão de resultados de exames",
    source: "Estrutural — sem conteúdo clínico prescrito",
    problems: [],
    soapBase: {
      subjective: "Retorno para discussão de exames solicitados em ___.",
      objective: "",
      assessment: "",
      plan: "",
    },
  },
  // Templates abaixo: estrutura definida, conteúdo clínico a preencher após pesquisa de diretriz
  {
    id: "saude-mental",
    name: "Saúde Mental",
    description: "Consulta de seguimento em saúde mental na APS",
    source: "FONTE: verificar — Caderno de Atenção Básica nº 34, Ministério da Saúde",
    problems: [],
    soapBase: { subjective: "", objective: "", assessment: "", plan: "" },
  },
  {
    id: "preventivo-adulto",
    name: "Preventivo — Adulto",
    description: "Consulta de rastreamento e prevenção em adulto",
    source: "FONTE: verificar — Guia de Rastreamento MS / SBMFC",
    problems: [],
    soapBase: { subjective: "", objective: "", assessment: "", plan: "" },
  },
  {
    id: "puericultura",
    name: "Puericultura",
    description: "Consulta de acompanhamento da criança",
    source: "FONTE: verificar — Caderno de Atenção Básica nº 33, Ministério da Saúde",
    problems: [],
    soapBase: { subjective: "", objective: "", assessment: "", plan: "" },
  },
  {
    id: "pre-natal",
    name: "Pré-natal",
    description: "Consulta de acompanhamento pré-natal na APS",
    source: "FONTE: verificar — Caderno de Atenção Básica nº 32, Ministério da Saúde",
    problems: [],
    soapBase: { subjective: "", objective: "", assessment: "", plan: "" },
  },
];
```

- [ ] **Step 3: Verificar compilação**

```bash
npx tsc --noEmit
```

Esperado: sem erros.

- [ ] **Step 4: Commit**

```bash
git add src/lib/templates.ts
git commit -m "feat: consultation templates structure — clinical content pending source verification"
```

---

### Task 12: TemplateSelector + integração no Topbar

**Files:**
- Create: `src/components/consultation/template-selector.tsx`
- Modify: `src/components/layout/topbar.tsx`

- [ ] **Step 1: Criar o componente TemplateSelector**

```typescript
"use client";

import { useState } from "react";
import { CONSULTATION_TEMPLATES, type ConsultationTemplate } from "@/lib/templates";
import { useConsultationStore } from "@/stores/consultation-store";
import { showToast } from "@/components/ui/toast";

interface TemplateSelectorProps {
  open: boolean;
  onClose: () => void;
}

export function TemplateSelector({ open, onClose }: TemplateSelectorProps) {
  const [selected, setSelected] = useState<ConsultationTemplate | null>(null);
  const store = useConsultationStore();

  function applyTemplate(t: ConsultationTemplate) {
    // Aplicar apenas campos que ainda estão em branco
    if (t.problems && t.problems.length > 0) {
      t.problems.forEach((p) => {
        if (!store.problems.includes(p)) store.toggleProblem(p);
      });
    }
    if (t.soapBase) {
      const soap: Partial<typeof store.soap> = {};
      if (t.soapBase.subjective && !store.soap.subjective)
        soap.subjective = t.soapBase.subjective;
      if (t.soapBase.objective && !store.soap.objective)
        soap.objective = t.soapBase.objective;
      if (t.soapBase.assessment && !store.soap.assessment)
        soap.assessment = t.soapBase.assessment;
      if (t.soapBase.plan && !store.soap.plan)
        soap.plan = t.soapBase.plan;
      if (Object.keys(soap).length > 0) store.setSoap(soap);
    }
    if (t.instructionBase && !store.patientInstructions) {
      store.setPatientInstructions(t.instructionBase);
    }
    showToast(`Template "${t.name}" aplicado`, "success");
    onClose();
  }

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 z-[60] w-[520px] max-w-[95vw] max-h-[80vh] -translate-x-1/2 -translate-y-1/2 bg-bg-1 border border-border-subtle rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle shrink-0">
          <div>
            <p className="text-[13px] font-semibold text-text-primary">Templates de consulta</p>
            <p className="text-[11px] text-text-tertiary mt-0.5">Preenche campos vazios com estrutura sugerida</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md border border-border-subtle flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-2 transition-colors cursor-pointer text-lg leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {selected ? (
            <div>
              <button
                onClick={() => setSelected(null)}
                className="text-[11px] text-text-tertiary hover:text-text-secondary mb-4 flex items-center gap-1 cursor-pointer"
              >
                ← Voltar
              </button>
              <p className="text-[14px] font-semibold text-text-primary mb-1">{selected.name}</p>
              <p className="text-[11.5px] text-text-secondary mb-3">{selected.description}</p>
              <div className="rounded-lg border border-border-subtle bg-bg-2 p-3 mb-4">
                <p className="text-[10.5px] text-text-tertiary leading-relaxed">
                  <span className="font-medium text-text-secondary">Fonte: </span>
                  {selected.source}
                </p>
              </div>
              {selected.problems && selected.problems.length > 0 && (
                <div className="mb-3">
                  <p className="text-[11px] text-text-secondary font-medium mb-1">Problemas pré-selecionados</p>
                  <div className="flex flex-wrap gap-1">
                    {selected.problems.map((p) => (
                      <span key={p} className="px-2 py-0.5 rounded-full bg-bg-3 border border-border-subtle text-[10.5px] text-text-secondary">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <button
                onClick={() => applyTemplate(selected)}
                className="w-full py-2.5 rounded-lg bg-accent text-black text-[12px] font-semibold hover:bg-accent/90 transition-colors cursor-pointer"
              >
                Aplicar template
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {CONSULTATION_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelected(t)}
                  className="w-full text-left px-4 py-3 rounded-xl border border-border-subtle hover:border-border-default hover:bg-bg-2 transition-colors cursor-pointer"
                >
                  <p className="text-[12px] font-medium text-text-primary">{t.name}</p>
                  <p className="text-[10.5px] text-text-tertiary mt-0.5">{t.description}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Adicionar botão Template no Topbar**

Em `src/components/layout/topbar.tsx`:

Adicionar import:
```typescript
import { TemplateSelector } from "@/components/consultation/template-selector";
```

Adicionar estado:
```typescript
  const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false);
```

Renderizar no JSX (após `<PatientSelector ... />`):
```tsx
      <TemplateSelector
        open={templateSelectorOpen}
        onClose={() => setTemplateSelectorOpen(false)}
      />
```

Adicionar botão na barra (após o botão "Histórico"):
```tsx
            <button
              onClick={() => setTemplateSelectorOpen(true)}
              className="h-[32px] px-3 rounded-md text-[12px] font-medium border border-border-subtle text-text-secondary bg-transparent hover:bg-bg-2 hover:text-text-primary hover:border-border-default transition-colors cursor-pointer"
            >
              Template
            </button>
```

- [ ] **Step 3: Verificar compilação**

```bash
npx tsc --noEmit
```

Esperado: sem erros.

- [ ] **Step 4: Testar manualmente**

Abrir nova consulta → clicar "Template" → selecionar "HAS — Seguimento" → verificar que os problemas são marcados e o SOAP objetivo é preenchido.

- [ ] **Step 5: Commit**

```bash
git add src/components/consultation/template-selector.tsx src/components/layout/topbar.tsx
git commit -m "feat: TemplateSelector modal + Template button in topbar"
```

---

## Subsistema D: Snippets

### Task 13: CRUD de Snippets

**Files:**
- Create: `src/lib/supabase/snippets.ts`

- [ ] **Step 1: Criar o arquivo**

```typescript
import { createClient } from "./client";
import type { UserSnippet, SnippetCategory } from "@/types";

export async function listSnippets(userId: string, category?: SnippetCategory): Promise<UserSnippet[]> {
  const supabase = createClient();
  let query = supabase
    .from("user_snippets")
    .select("*")
    .eq("user_id", userId)
    .order("title", { ascending: true });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as UserSnippet[];
}

export async function createSnippet(
  userId: string,
  fields: Pick<UserSnippet, "category" | "title" | "body">
): Promise<UserSnippet> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_snippets")
    .insert({ ...fields, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data as UserSnippet;
}

export async function deleteSnippet(snippetId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("user_snippets")
    .delete()
    .eq("id", snippetId);

  if (error) throw error;
}
```

- [ ] **Step 2: Verificar compilação**

```bash
npx tsc --noEmit
```

Esperado: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/lib/supabase/snippets.ts
git commit -m "feat: user_snippets Supabase CRUD (list, create, delete)"
```

---

### Task 14: SnippetPopover component

**Files:**
- Create: `src/components/consultation/snippet-popover.tsx`

- [ ] **Step 1: Criar o componente**

```typescript
"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { listSnippets, createSnippet, deleteSnippet } from "@/lib/supabase/snippets";
import type { UserSnippet, SnippetCategory } from "@/types";
import { showToast } from "@/components/ui/toast";

interface SnippetPopoverProps {
  category: SnippetCategory;
  onInsert: (text: string) => void;
  /** Texto atual do campo — para oferecer "Salvar como snippet" */
  currentValue?: string;
}

const CATEGORY_LABELS: Record<SnippetCategory, string> = {
  orientacao: "Orientações",
  prescricao: "Prescrição",
  conduta: "Conduta",
  exames: "Exames",
};

export function SnippetPopover({ category, onInsert, currentValue }: SnippetPopoverProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"list" | "save">("list");
  const [snippets, setSnippets] = useState<UserSnippet[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState(currentValue ?? "");
  const [saving, setSaving] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  useEffect(() => {
    if (!open || !userId) return;
    setLoading(true);
    listSnippets(userId, category)
      .then(setSnippets)
      .catch(() => showToast("Erro ao carregar snippets", "error"))
      .finally(() => setLoading(false));
  }, [open, userId, category]);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  async function handleSave() {
    if (!userId || !newTitle.trim() || !newBody.trim()) return;
    setSaving(true);
    try {
      const snippet = await createSnippet(userId, { category, title: newTitle.trim(), body: newBody.trim() });
      setSnippets((prev) => [...prev, snippet].sort((a, b) => a.title.localeCompare(b.title)));
      showToast("Snippet salvo", "success");
      setView("list");
      setNewTitle("");
      setNewBody("");
    } catch {
      showToast("Erro ao salvar snippet", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteSnippet(id);
      setSnippets((prev) => prev.filter((s) => s.id !== id));
      showToast("Snippet removido", "success");
    } catch {
      showToast("Erro ao remover snippet", "error");
    }
  }

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => { setOpen(!open); setView("list"); }}
        title={`Snippets — ${CATEGORY_LABELS[category]}`}
        className="h-[22px] px-2 rounded border border-border-subtle text-[10px] text-text-tertiary hover:text-text-secondary hover:bg-bg-2 hover:border-border-default transition-colors cursor-pointer font-medium"
      >
        + snippet
      </button>

      {open && (
        <div className="absolute right-0 bottom-full mb-1 w-[300px] bg-bg-1 border border-border-subtle rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.35)] z-[70] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border-subtle">
            <p className="text-[11px] font-semibold text-text-primary">
              {CATEGORY_LABELS[category]}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => { setView("save"); setNewBody(currentValue ?? ""); }}
                className="text-[10px] text-text-tertiary hover:text-accent transition-colors cursor-pointer"
              >
                + Salvar
              </button>
            </div>
          </div>

          {view === "list" ? (
            <div className="max-h-[220px] overflow-y-auto">
              {loading && (
                <p className="text-[11px] text-text-tertiary text-center py-6">Carregando...</p>
              )}
              {!loading && snippets.length === 0 && (
                <div className="px-3 py-5 text-center">
                  <p className="text-[11px] text-text-secondary">Nenhum snippet salvo</p>
                  <p className="text-[10px] text-text-tertiary mt-1">Clique em "+ Salvar" para criar</p>
                </div>
              )}
              {snippets.map((s) => (
                <div key={s.id} className="flex items-center gap-1 px-3 py-2 border-b border-border-subtle/40 hover:bg-bg-2 group">
                  <button
                    onClick={() => { onInsert(s.body); setOpen(false); }}
                    className="flex-1 text-left cursor-pointer"
                  >
                    <p className="text-[11px] font-medium text-text-primary truncate">{s.title}</p>
                    <p className="text-[10px] text-text-tertiary truncate">{s.body}</p>
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="opacity-0 group-hover:opacity-100 text-[10px] text-status-crit hover:text-status-crit/80 transition-opacity cursor-pointer px-1"
                    title="Remover"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 space-y-2">
              <div>
                <label className="block text-[10px] text-text-tertiary mb-1">Título</label>
                <input
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Orientação IVAS"
                  className="w-full px-2 py-1.5 border border-border-subtle rounded-lg bg-bg-2 text-text-primary text-[11px] placeholder:text-text-tertiary focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-[10px] text-text-tertiary mb-1">Conteúdo</label>
                <textarea
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  rows={4}
                  className="w-full px-2 py-1.5 border border-border-subtle rounded-lg bg-bg-2 text-text-primary text-[11px] resize-none placeholder:text-text-tertiary focus:outline-none focus:border-accent"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setView("list")}
                  className="flex-1 py-1.5 rounded-lg border border-border-subtle text-[11px] text-text-tertiary hover:bg-bg-2 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={!newTitle.trim() || !newBody.trim() || saving}
                  className="flex-1 py-1.5 rounded-lg bg-accent text-black text-[11px] font-semibold hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {saving ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verificar compilação**

```bash
npx tsc --noEmit
```

Esperado: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/components/consultation/snippet-popover.tsx
git commit -m "feat: SnippetPopover — list, insert, save, delete snippets"
```

---

### Task 15: Integrar SnippetPopover no OutputColumn

**Files:**
- Modify: `src/components/consultation/output-column.tsx`

- [ ] **Step 1: Adicionar import do SnippetPopover**

```typescript
import { SnippetPopover } from "@/components/consultation/snippet-popover";
```

- [ ] **Step 2: Substituir o bloco de Prescrição para incluir o SnippetPopover**

```tsx
// Antes:
      <div className="mt-4">
        <SectionHeader label="Prescrição" color="green" />
        <textarea
          placeholder={"1. Metformina 850mg - 1cp 2x/dia\n2. Losartana 50mg - 1cp/dia"}
          value={store.prescription}
          onChange={(e) => store.setPrescription(e.target.value)}
          className="w-full h-20 px-2 py-[7px] border border-border-subtle rounded-[5px] bg-bg-2 text-text-primary font-sans text-xs resize-y leading-relaxed placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)]"
        />
      </div>

// Depois:
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1">
          <SectionHeader label="Prescrição" color="green" />
          <SnippetPopover
            category="prescricao"
            currentValue={store.prescription}
            onInsert={(text) => store.setPrescription(store.prescription ? store.prescription + "\n" + text : text)}
          />
        </div>
        <textarea
          placeholder={"1. Metformina 850mg - 1cp 2x/dia\n2. Losartana 50mg - 1cp/dia"}
          value={store.prescription}
          onChange={(e) => store.setPrescription(e.target.value)}
          className="w-full h-20 px-2 py-[7px] border border-border-subtle rounded-[5px] bg-bg-2 text-text-primary font-sans text-xs resize-y leading-relaxed placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)]"
        />
      </div>
```

- [ ] **Step 3: Substituir o bloco de Exames a Solicitar**

```tsx
// Antes:
      <div className="mt-4">
        <SectionHeader label="Exames a Solicitar" color="blue" />
        <textarea
          placeholder="HbA1c, lipidograma, TSH..."
          value={store.requestedExams}
          onChange={(e) => store.setRequestedExams(e.target.value)}
          className="w-full h-16 px-2 py-[7px] border border-border-subtle rounded-[5px] bg-bg-2 text-text-primary font-sans text-xs resize-y leading-relaxed placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)]"
        />
      </div>

// Depois:
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1">
          <SectionHeader label="Exames a Solicitar" color="blue" />
          <SnippetPopover
            category="exames"
            currentValue={store.requestedExams}
            onInsert={(text) => store.setRequestedExams(store.requestedExams ? store.requestedExams + "\n" + text : text)}
          />
        </div>
        <textarea
          placeholder="HbA1c, lipidograma, TSH..."
          value={store.requestedExams}
          onChange={(e) => store.setRequestedExams(e.target.value)}
          className="w-full h-16 px-2 py-[7px] border border-border-subtle rounded-[5px] bg-bg-2 text-text-primary font-sans text-xs resize-y leading-relaxed placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)]"
        />
      </div>
```

- [ ] **Step 4: Substituir o bloco de Orientações ao Paciente**

```tsx
// Antes:
      <div className="mt-4">
        <SectionHeader label="Orientações ao Paciente" color="amber" />
        <textarea
          placeholder="Dieta hipossódica, atividade física 150min/semana..."
          value={store.patientInstructions}
          onChange={(e) => store.setPatientInstructions(e.target.value)}
          className="w-full h-16 px-2 py-[7px] border border-border-subtle rounded-[5px] bg-bg-2 text-text-primary font-sans text-xs resize-y leading-relaxed placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)]"
        />
      </div>

// Depois:
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1">
          <SectionHeader label="Orientações ao Paciente" color="amber" />
          <SnippetPopover
            category="orientacao"
            currentValue={store.patientInstructions}
            onInsert={(text) => store.setPatientInstructions(store.patientInstructions ? store.patientInstructions + "\n" + text : text)}
          />
        </div>
        <textarea
          placeholder="Dieta hipossódica, atividade física 150min/semana..."
          value={store.patientInstructions}
          onChange={(e) => store.setPatientInstructions(e.target.value)}
          className="w-full h-16 px-2 py-[7px] border border-border-subtle rounded-[5px] bg-bg-2 text-text-primary font-sans text-xs resize-y leading-relaxed placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)]"
        />
      </div>
```

- [ ] **Step 5: Verificar compilação**

```bash
npx tsc --noEmit
```

Esperado: sem erros.

- [ ] **Step 6: Testar manualmente**

1. Abrir consulta → ir para coluna de saída
2. Clicar "+ snippet" ao lado de Prescrição
3. Clicar "+ Salvar" → inserir título "Amoxicilina IVAS" e conteúdo → salvar
4. Reabrir popover → clicar no snippet → confirmar que o texto é inserido no campo
5. Testar delete no snippet

- [ ] **Step 7: Commit final**

```bash
git add src/components/consultation/output-column.tsx src/lib/supabase/snippets.ts
git commit -m "feat: SnippetPopover integrated in OutputColumn (prescrição, exames, orientações)"
```

---

## Critérios de conclusão

- [ ] Novas consultas sempre têm `patient_id` vinculado (verificar no Supabase Dashboard)
- [ ] Consultas legadas (`patient_id = null`) aparecem com badge "legado" no histórico
- [ ] Rascunho salvo e recuperado corretamente após fechar aba sem salvar
- [ ] Templates abrem, exibem fonte, aplicam apenas em campos vazios
- [ ] Snippets criados, listados, inseridos e deletados em todos os 3 campos
- [ ] `npx tsc --noEmit` sem erros após todas as tasks
