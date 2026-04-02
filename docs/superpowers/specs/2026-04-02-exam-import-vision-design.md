# Spec: Importação de Exames via PDF/Imagem (Vision AI)

**Data:** 2026-04-02
**Status:** Aguardando implementação (requer `ANTHROPIC_API_KEY`)

---

## Objetivo

Permitir que o médico faça upload de um PDF ou imagem de resultado de exame laboratorial. O sistema transcreve automaticamente os valores para os campos do ExamGrid. Valores fora do ExamGrid são exibidos como texto livre formatado. O médico revisa e confirma antes de qualquer campo ser preenchido.

---

## Fluxo completo

1. Médico clica em **"Importar exames"** (botão no topo da seção Dados Objetivos)
2. File picker abre — aceita `.pdf`, `.jpg`, `.jpeg`, `.png`
3. Arquivo enviado via `FormData` para `POST /api/transcribe-exams`
4. API route converte o arquivo para base64 e envia para `claude-sonnet-4-6` com vision
5. Claude retorna JSON com dois campos: `matched` e `extras`
6. **Modal de revisão** abre com:
   - Lista de campos matched com valor extraído (editável antes de confirmar)
   - Área de texto read-only com os `extras` formatados (para copiar manualmente)
7. Médico clica **"Aplicar"** → `setLab()` chamado para cada campo matched, `setLabsExtras()` para os extras
8. ExamGrid e textarea de extras preenchidos

---

## Arquitetura

### API Route — `src/app/api/transcribe-exams/route.ts`

- Método: `POST`
- Input: `FormData` com campo `file` (File — PDF ou imagem)
- Verifica presença de `process.env.ANTHROPIC_API_KEY`; se ausente, retorna `{ error: "API_NOT_CONFIGURED" }` com status 200
- Converte o arquivo para base64
- Chama `claude-sonnet-4-6` com o arquivo + prompt estruturado
- Retorna `{ matched: Record<string, string>, extras: string }`

**Prompt enviado ao Claude:**

```
Você é um assistente médico. Analise o resultado de exame laboratorial na imagem/PDF e extraia os valores numéricos.

Retorne SOMENTE um JSON válido com dois campos:
- "matched": objeto com os valores encontrados que correspondam às seguintes chaves conhecidas: [lista de todas as keys do EXAM_CARDS]
  - Use exatamente as chaves listadas acima. Inclua apenas os valores explicitamente presentes no documento.
  - Valores numéricos como string (ex: "1.2", "13.4").
- "extras": string com os demais valores encontrados no documento que não se encaixam nas chaves acima, formatados como "Nome do exame: valor unidade", um por linha.

Não invente valores. Se um exame não estiver no documento, não o inclua.
```

### Novos componentes

**`src/components/consultation/exam-upload-button.tsx`**
- Botão pequeno `"Importar PDF/imagem"` com ícone de upload
- Ao clicar: abre input file (aceita `image/*,.pdf`)
- Ao selecionar arquivo: chama a API route, exibe loading state
- Se `API_NOT_CONFIGURED`: exibe mensagem inline com instrução de configuração
- Se erro genérico: toast de erro
- Se sucesso: abre `ExamReviewModal` com os dados retornados

**`src/components/consultation/exam-review-modal.tsx`**
- Modal (Dialog Radix) que recebe `{ matched, extras }` como props
- Seção 1 — **Valores reconhecidos**: lista de campos matched com label do ExamGrid + valor extraído em input editável. Apenas campos com valor aparecem.
- Seção 2 — **Outros valores**: textarea read-only com o texto `extras`. Aparece somente se `extras` não estiver vazio. Label: "Valores não reconhecidos — copie manualmente se necessário."
- Rodapé: botão "Cancelar" (fecha sem aplicar) e "Aplicar X campos" (onde X = count de matched)
- Ao aplicar: chama `setLab()` para cada matched, `setLabsExtras(extras)` se extras não vazio

### Modificações no store — `src/stores/consultation-store.ts`

Adicionar ao estado:
```ts
labsExtras: string   // valores de exames fora do ExamGrid, texto livre
```

Adicionar ação:
```ts
setLabsExtras: (text: string) => void
```

Inicializar como `""`, incluir no `reset()` e no `loadState()`.

### Modificações em constants — `src/lib/constants.ts`

Exportar lista flat de todas as keys para uso no prompt:
```ts
export const EXAM_FIELD_KEYS: string[] = EXAM_CARDS.flatMap(c => c.fields.map(f => f.key))
```

### Exibição dos extras — `src/app/(dashboard)/consulta/page.tsx`

Adicionar JSX inline abaixo do `<ExamGrid />` na seção Dados Objetivos: uma textarea editável que lê/grava `labsExtras` do store via `useConsultationStore()`. Renderizada condicionalmente — só aparece se `labsExtras` não estiver vazio. Label: "Outros exames".

### Inclusão no output — `src/lib/output-generators/`

Adicionar `labsExtras` ao output detalhado e ao resumido (após os campos calculados de exames), formatado como:

```
Outros exames: <conteúdo de labsExtras>
```

### Modificação na tela — `src/app/(dashboard)/consulta/page.tsx`

Adicionar `<ExamUploadButton />` no topo da seção Dados Objetivos, antes do `<VitalsForm />`.

---

## Estado "API não configurada"

Quando `ANTHROPIC_API_KEY` não está presente:
- A route retorna `{ error: "API_NOT_CONFIGURED" }`
- O botão `ExamUploadButton` exibe mensagem inline: *"Funcionalidade indisponível. Configure `ANTHROPIC_API_KEY` nas variáveis de ambiente do Vercel."*
- Nenhum modal é aberto

Isso permite que toda a UI esteja implementada e funcione imediatamente ao adicionar a chave.

---

## Arquivos criados

| Arquivo | Tipo |
|---|---|
| `src/app/api/transcribe-exams/route.ts` | Novo |
| `src/components/consultation/exam-upload-button.tsx` | Novo |
| `src/components/consultation/exam-review-modal.tsx` | Novo |

## Arquivos modificados

| Arquivo | Mudança |
|---|---|
| `src/stores/consultation-store.ts` | `labsExtras` + `setLabsExtras` |
| `src/lib/constants.ts` | `EXAM_FIELD_KEYS` export |
| `src/app/(dashboard)/consulta/page.tsx` | `<ExamUploadButton />` + textarea inline para `labsExtras` |
| `src/lib/output-generators/resumido.ts` | Incluir `labsExtras` no output |
| `src/lib/output-generators/detalhado.ts` | Incluir `labsExtras` no output |

---

## Dependências externas

- `@anthropic-ai/sdk` — a instalar no momento da implementação
- Variável de ambiente: `ANTHROPIC_API_KEY` (Vercel + `.env.local`)

---

## Fora do escopo

- Armazenamento do arquivo original no Supabase Storage
- Histórico de importações
- Suporte a múltiplos arquivos por vez
- Modo claro
