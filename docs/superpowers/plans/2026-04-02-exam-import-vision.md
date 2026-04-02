# Exam Import via Vision AI — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir upload de PDF/imagem de exame laboratorial, transcrição automática via Claude Vision API, revisão pelo médico e preenchimento do ExamGrid.

**Architecture:** API Route Next.js (server-side) recebe arquivo, chama `claude-sonnet-4-6` com vision, retorna `{ matched, extras }`. UI composta por botão de upload + modal de revisão. Feature fica implementada mas inativa sem `ANTHROPIC_API_KEY`.

**Tech Stack:** Next.js App Router, Zustand, `@anthropic-ai/sdk`, Tailwind, sem dependências novas além do SDK.

---

## Mapa de arquivos

| Arquivo | Operação |
|---|---|
| `src/types/index.ts` | Modificar — adicionar `labsExtras: string` em `ConsultationState` |
| `src/stores/consultation-store.ts` | Modificar — `labsExtras` no estado inicial, `setLabsExtras`, `reset`, `loadState` |
| `src/lib/constants.ts` | Modificar — exportar `EXAM_FIELD_KEYS` |
| `src/app/api/transcribe-exams/route.ts` | Criar — API Route POST |
| `src/components/consultation/exam-upload-button.tsx` | Criar — botão de upload com loading/erro |
| `src/components/consultation/exam-review-modal.tsx` | Criar — modal de revisão com campos editáveis |
| `src/app/(dashboard)/consulta/page.tsx` | Modificar — adicionar botão + textarea extras |
| `src/lib/output-generators/resumido.ts` | Modificar — incluir `labsExtras` |
| `src/lib/output-generators/detalhado.ts` | Modificar — incluir `labsExtras` |

---

## Task 1: Instalar `@anthropic-ai/sdk` e atualizar tipos + store + constants

**Files:**
- Modify: `src/types/index.ts`
- Modify: `src/stores/consultation-store.ts`
- Modify: `src/lib/constants.ts`

- [ ] **Step 1: Instalar SDK**

```bash
cd "Ferramenta Medica/Ferramenta Medica/MedMate/medmate-app"
npm install @anthropic-ai/sdk
```

- [ ] **Step 2: Adicionar `labsExtras` em `ConsultationState` em `src/types/index.ts`**

Localizar a interface `ConsultationState` (linha ~57) e adicionar campo após `followupItems`:

```ts
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
  followupItems: FollowUpItem[];
  labsExtras: string;
}
```

- [ ] **Step 3: Atualizar `src/stores/consultation-store.ts`**

**3a.** No `initialState`, adicionar após `imaging`:
```ts
labsExtras: "",
```

**3b.** Na interface `ConsultationActions`, adicionar após `setImaging`:
```ts
setLabsExtras: (text: string) => void;
```

**3c.** Na implementação do store, adicionar após `setImaging`:
```ts
setLabsExtras: (text) => set({ labsExtras: text }),
```

**3d.** O `reset()` já espalha `...initialState`, então `labsExtras: ""` será incluído automaticamente. Verificar que `loadState` também funciona — como `loadState` faz `set({ ...savedState, ... })`, o campo `labsExtras` do `savedState` será restaurado. Nenhuma alteração adicional necessária.

- [ ] **Step 4: Exportar `EXAM_FIELD_KEYS` em `src/lib/constants.ts`**

Ao final do arquivo, após `EXAM_CARDS`, adicionar:

```ts
export const EXAM_FIELD_KEYS: string[] = EXAM_CARDS.flatMap((c) =>
  c.fields.map((f) => f.key)
);
```

- [ ] **Step 5: Verificar TypeScript**

```bash
npx tsc --noEmit
```

Esperado: sem erros. Se houver, corrigir antes de prosseguir.

- [ ] **Step 6: Commit**

```bash
git add src/types/index.ts src/stores/consultation-store.ts src/lib/constants.ts package.json package-lock.json
git commit -m "feat: add labsExtras to store + EXAM_FIELD_KEYS to constants"
```

---

## Task 2: Criar API Route `/api/transcribe-exams`

**Files:**
- Create: `src/app/api/transcribe-exams/route.ts`

- [ ] **Step 1: Criar o arquivo**

```ts
// src/app/api/transcribe-exams/route.ts
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { EXAM_FIELD_KEYS } from "@/lib/constants";

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "API_NOT_CONFIGURED" });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "NO_FILE" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "INVALID_FILE_TYPE" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  const mediaType = file.type as "image/jpeg" | "image/png" | "image/gif" | "image/webp" | "application/pdf";

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const knownKeys = EXAM_FIELD_KEYS.join(", ");

  const prompt = `Você é um assistente médico. Analise o resultado de exame laboratorial neste documento e extraia os valores encontrados.

Retorne SOMENTE um JSON válido com exatamente dois campos:
- "matched": objeto onde as chaves são da lista abaixo e os valores são strings numéricas (ex: "1.2", "13.4"). Inclua APENAS os exames explicitamente presentes no documento que correspondam às chaves conhecidas. Não invente valores.
- "extras": string com os demais resultados encontrados no documento que não se encaixam nas chaves conhecidas, no formato "Nome do exame: valor unidade", um por linha. Se não houver, use string vazia "".

Chaves conhecidas: ${knownKeys}

Responda apenas com o JSON, sem markdown, sem explicações.`;

  const messageContent: Anthropic.MessageParam["content"] = mediaType === "application/pdf"
    ? [
        {
          type: "document",
          source: { type: "base64", media_type: "application/pdf", data: base64 },
        } as Anthropic.DocumentBlockParam,
        { type: "text", text: prompt },
      ]
    : [
        {
          type: "image",
          source: { type: "base64", media_type: mediaType, data: base64 },
        } as Anthropic.ImageBlockParam,
        { type: "text", text: prompt },
      ];

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{ role: "user", content: messageContent }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  let parsed: { matched: Record<string, string>; extras: string };
  try {
    parsed = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "PARSE_ERROR" }, { status: 500 });
  }

  return NextResponse.json({ matched: parsed.matched ?? {}, extras: parsed.extras ?? "" });
}
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit
```

Esperado: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/transcribe-exams/route.ts
git commit -m "feat: add transcribe-exams API route with Claude vision"
```

---

## Task 3: Criar `ExamUploadButton`

**Files:**
- Create: `src/components/consultation/exam-upload-button.tsx`

- [ ] **Step 1: Criar o componente**

```tsx
// src/components/consultation/exam-upload-button.tsx
"use client";

import { useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { showToast } from "@/components/ui/toast";

interface TranscribeResult {
  matched: Record<string, string>;
  extras: string;
}

interface ExamUploadButtonProps {
  onResult: (result: TranscribeResult) => void;
}

export function ExamUploadButton({ onResult }: ExamUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [notConfigured, setNotConfigured] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // reset input so the same file can be selected again
    e.target.value = "";

    setLoading(true);
    setNotConfigured(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/transcribe-exams", { method: "POST", body: formData });
      const data = await res.json();

      if (data.error === "API_NOT_CONFIGURED") {
        setNotConfigured(true);
        return;
      }

      if (data.error) {
        showToast("Erro ao processar o arquivo. Tente novamente.", "error");
        return;
      }

      const matchedCount = Object.keys(data.matched ?? {}).length;
      if (matchedCount === 0 && !data.extras) {
        showToast("Nenhum valor de exame encontrado no arquivo.", "info");
        return;
      }

      onResult({ matched: data.matched ?? {}, extras: data.extras ?? "" });
    } catch {
      showToast("Erro ao enviar o arquivo. Verifique sua conexão.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={handleFile}
      />
      <button
        type="button"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg border border-outline-variant/40 bg-surface-low text-on-surface-muted hover:text-on-surface hover:border-outline-variant/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <Upload size={12} />
        )}
        {loading ? "Processando..." : "Importar PDF / imagem"}
      </button>

      {notConfigured && (
        <p className="mt-1.5 text-[11px] text-status-warn">
          Funcionalidade indisponível. Configure{" "}
          <code className="font-mono">ANTHROPIC_API_KEY</code> nas variáveis de ambiente do Vercel.
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/consultation/exam-upload-button.tsx
git commit -m "feat: add ExamUploadButton with loading and API_NOT_CONFIGURED state"
```

---

## Task 4: Criar `ExamReviewModal`

**Files:**
- Create: `src/components/consultation/exam-review-modal.tsx`

O modal usa o padrão existente do projeto (`if (!open) return null` + overlay fixed), não Radix Dialog.

- [ ] **Step 1: Criar o componente**

```tsx
// src/components/consultation/exam-review-modal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { useConsultationStore } from "@/stores/consultation-store";
import { EXAM_CARDS } from "@/lib/constants";

interface ExamReviewModalProps {
  open: boolean;
  matched: Record<string, string>;
  extras: string;
  onClose: () => void;
}

// Mapa de key → label para exibição
const KEY_LABELS: Record<string, string> = Object.fromEntries(
  EXAM_CARDS.flatMap((c) => c.fields.map((f) => [f.key, `${c.title} — ${f.label}`]))
);

export function ExamReviewModal({ open, matched, extras, onClose }: ExamReviewModalProps) {
  const { setLab, setLabsExtras } = useConsultationStore();
  const [editableValues, setEditableValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) setEditableValues({ ...matched });
  }, [open, matched]);

  if (!open) return null;

  const matchedKeys = Object.keys(editableValues);
  const hasExtras = extras.trim().length > 0;

  function handleApply() {
    matchedKeys.forEach((key) => {
      const val = editableValues[key]?.trim();
      if (val) setLab(key, val);
    });
    if (hasExtras) setLabsExtras(extras);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[90] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-surface-low border border-outline-variant/30 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/20">
          <div>
            <h2 className="text-[14px] font-semibold text-on-surface">Revisão dos exames importados</h2>
            <p className="text-[11px] text-on-surface-muted mt-0.5">
              {matchedKeys.length} valor{matchedKeys.length !== 1 ? "es" : ""} reconhecido{matchedKeys.length !== 1 ? "s" : ""}. Edite se necessário antes de aplicar.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-muted hover:text-on-surface transition-colors p-1"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          {/* Valores reconhecidos */}
          {matchedKeys.length > 0 && (
            <div className="space-y-2">
              {matchedKeys.map((key) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-[12px] text-on-surface-muted flex-1 truncate">
                    {KEY_LABELS[key] ?? key}
                  </span>
                  <input
                    type="text"
                    value={editableValues[key] ?? ""}
                    onChange={(e) =>
                      setEditableValues((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    className="w-24 text-[12px] text-on-surface bg-surface border border-outline-variant/40 rounded px-2 py-1 focus:outline-none focus:border-primary text-right font-mono"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Outros valores */}
          {hasExtras && (
            <div className="space-y-1.5">
              <p className="text-[11px] text-on-surface-muted font-medium">
                Valores não reconhecidos — copie manualmente se necessário
              </p>
              <textarea
                readOnly
                value={extras}
                rows={Math.min(6, extras.split("\n").length + 1)}
                className="w-full text-[12px] text-on-surface-muted bg-surface border border-outline-variant/20 rounded-lg px-3 py-2 resize-none font-mono cursor-text focus:outline-none"
              />
            </div>
          )}

          {matchedKeys.length === 0 && !hasExtras && (
            <p className="text-[12px] text-on-surface-muted text-center py-4">
              Nenhum valor encontrado no documento.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-outline-variant/20">
          <button
            type="button"
            onClick={onClose}
            className="text-[12px] text-on-surface-muted hover:text-on-surface transition-colors px-4 py-2"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={matchedKeys.length === 0 && !hasExtras}
            className="flex items-center gap-1.5 text-[12px] px-4 py-2 rounded-lg bg-primary text-black font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Check size={13} />
            Aplicar {matchedKeys.length > 0 ? `${matchedKeys.length} campo${matchedKeys.length !== 1 ? "s" : ""}` : "extras"}
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/consultation/exam-review-modal.tsx
git commit -m "feat: add ExamReviewModal with editable matched fields and extras textarea"
```

---

## Task 5: Integrar na tela de consulta

**Files:**
- Modify: `src/app/(dashboard)/consulta/page.tsx`

- [ ] **Step 1: Adicionar imports no topo de `consulta/page.tsx`**

Após os imports existentes de componentes, adicionar:

```tsx
import { ExamUploadButton } from "@/components/consultation/exam-upload-button";
import { ExamReviewModal } from "@/components/consultation/exam-review-modal";
import { useConsultationStore } from "@/stores/consultation-store";
```

- [ ] **Step 2: Adicionar estado e lógica do modal na função do componente**

Dentro de `ConsultaPage()`, após `useDraftAutosave(userId)`, adicionar:

```tsx
const labsExtras = useConsultationStore((s) => s.labsExtras);
const setLabsExtras = useConsultationStore((s) => s.setLabsExtras);
const [reviewModal, setReviewModal] = useState<{
  open: boolean;
  matched: Record<string, string>;
  extras: string;
}>({ open: false, matched: {}, extras: "" });
```

- [ ] **Step 3: Atualizar a seção "Bloco 3: Dados Objetivos"**

Substituir o bloco existente:

```tsx
{/* Bloco 3: Dados Objetivos */}
<section className="rounded-xl bg-surface-lowest border border-outline-variant/20 p-5 space-y-4">
  <ExamUploadButton
    onResult={({ matched, extras }) =>
      setReviewModal({ open: true, matched, extras })
    }
  />
  <VitalsForm />
  <div className="h-px bg-outline-variant/20" />
  <ExamGrid />
  {labsExtras && (
    <div className="space-y-1.5 pt-1">
      <label className="text-[11px] font-medium text-on-surface-muted uppercase tracking-wide">
        Outros exames
      </label>
      <textarea
        value={labsExtras}
        onChange={(e) => setLabsExtras(e.target.value)}
        rows={Math.min(6, labsExtras.split("\n").length + 1)}
        className="w-full text-[13px] text-on-surface bg-transparent border border-outline-variant/30 rounded-lg px-3 py-2 resize-y font-mono focus:outline-none focus:border-primary transition-colors"
      />
    </div>
  )}
</section>
```

- [ ] **Step 4: Adicionar o modal antes do fechamento do return**

Antes do `</div>` final que fecha o componente (após o `</main>`), adicionar:

```tsx
<ExamReviewModal
  open={reviewModal.open}
  matched={reviewModal.matched}
  extras={reviewModal.extras}
  onClose={() => setReviewModal({ open: false, matched: {}, extras: "" })}
/>
```

- [ ] **Step 5: Verificar TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: Testar manualmente**

```bash
npm run dev
```

1. Acessar `/consulta` logado
2. Verificar que o botão "Importar PDF / imagem" aparece acima do VitalsForm
3. Clicar no botão sem `ANTHROPIC_API_KEY` configurado → deve aparecer a mensagem de aviso em amarelo
4. Verificar que o restante da seção (VitalsForm, ExamGrid) funciona normalmente

- [ ] **Step 7: Commit**

```bash
git add src/app/\(dashboard\)/consulta/page.tsx
git commit -m "feat: integrate ExamUploadButton and ExamReviewModal into consulta page"
```

---

## Task 6: Incluir `labsExtras` nos output generators

**Files:**
- Modify: `src/lib/output-generators/resumido.ts`
- Modify: `src/lib/output-generators/detalhado.ts`

- [ ] **Step 1: Atualizar `resumido.ts`**

Localizar a desestruturação no topo da função `generateResumoOutput`:

```ts
const { patient, vitals, problems, problemsOther, soap, prescription, requestedExams, patientInstructions } = state;
```

Substituir por:

```ts
const { patient, vitals, problems, problemsOther, soap, prescription, requestedExams, patientInstructions, labsExtras } = state;
```

Após o bloco de vitais (linha com `vitalParts`), adicionar:

```ts
if (labsExtras?.trim()) lines.push(`\nOutros exames:\n${labsExtras.trim()}`);
```

- [ ] **Step 2: Atualizar `detalhado.ts`**

Localizar a desestruturação:

```ts
const { patient, vitals, problems, problemsOther, labs, labsDate, imaging, calculations, soap, history, prescription, requestedExams, patientInstructions } = state;
```

Substituir por:

```ts
const { patient, vitals, problems, problemsOther, labs, labsDate, labsExtras, imaging, calculations, soap, history, prescription, requestedExams, patientInstructions } = state;
```

Após o bloco `// Bioquímica` (após o `labLines.forEach`), adicionar:

```ts
if (labsExtras?.trim()) {
  lines.push("\nOUTROS EXAMES");
  labsExtras.trim().split("\n").filter(Boolean).forEach((l) => lines.push(l));
}
```

- [ ] **Step 3: Verificar TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit final**

```bash
git add src/lib/output-generators/resumido.ts src/lib/output-generators/detalhado.ts
git commit -m "feat: include labsExtras in resumido and detalhado output generators"
```

---

## Task 7: Push e deploy

- [ ] **Step 1: Push**

```bash
git push origin master
```

Vercel detecta o push e dispara o deploy automaticamente.

- [ ] **Step 2: Verificar deploy no Vercel**

Acessar o Vercel dashboard e confirmar que o build passou sem erros.

- [ ] **Step 3: Testar em produção (quando `ANTHROPIC_API_KEY` estiver configurada)**

Para ativar a feature em produção:
1. Acessar Vercel → Settings → Environment Variables
2. Adicionar `ANTHROPIC_API_KEY` com o valor da chave Anthropic
3. Fazer redeploy (ou aguardar próximo deploy)
4. Testar upload de imagem de exame real na tela de consulta
