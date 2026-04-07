# Template de Sessão — Qwen (Kilo Code)

> Use este template para estruturar cada pedido ao Qwen antes de implementar.
> Cole o preenchido direto no chat do Kilo Code.

---

## Template

```
Objetivo da sessão: [1–3 linhas do que será feito]

Tipo da tarefa: [criar feature / spec de sessão / revisar arquitetura / refinar feature / revisar código / modelagem de banco / integrar módulo / ativar feature]

Contexto atual:
  - O que já existe:
  - O que já está pronto:
  - O que não pode quebrar:

Arquivos envolvidos: [paths completos a partir de src/ — ou "não sei"]

Restrições:
  - Não tocar em:
  - Não criar:
  - Não alterar:

Pronto quando: [critério verificável — ex.: componente renderiza, store atualiza, preview confirma visual]

Se houver código, diff, erro ou print: [cole aqui]
```

---

## Exemplo preenchido

```
Objetivo da sessão: Ativar a importação de exames via Vision AI. O código já existe
completo — só precisa conectar a ANTHROPIC_API_KEY e garantir que o fluxo
ExamUploadButton → /api/transcribe-exams → ExamReviewModal está funcional.

Tipo da tarefa: ativar feature

Contexto atual:
  - O que já existe: ExamUploadButton, ExamReviewModal, /api/transcribe-exams, labsExtras no store
  - O que já está pronto: toda a lógica de Vision, revisão de campos, aplicação ao output
  - O que não pode quebrar: ExamGrid existente, VitalsForm, fluxo de salvar consulta

Arquivos envolvidos:
  src/app/api/transcribe-exams/route.ts
  src/components/consultation/exam-upload-button.tsx
  src/components/consultation/exam-review-modal.tsx
  src/stores/consultation-store.ts

Restrições:
  - Não tocar em: ExamGrid, VitalsForm, output-generators/
  - Não criar: novo estado local, novo componente
  - Não alterar: UX da consulta, schema do banco

Pronto quando: botão "Importar PDF / imagem" aparece na seção Dados Objetivos,
modal de revisão abre com campos editáveis, dados são aplicados ao campo O do SOAP.
```

---

## Tipos de tarefa — referência rápida

| Tipo | Quando usar |
|---|---|
| `criar feature` | Componente ou módulo novo do zero |
| `spec de sessão` | Montar o prompt estruturado para o Claude Code |
| `revisar arquitetura` | Decidir abordagem antes de implementar |
| `refinar feature` | Ajuste de comportamento, edge case, UX de algo já pronto |
| `revisar código` | Checar se o que o Claude gerou respeita padrões |
| `modelagem de banco` | Definir schema, RLS e relações antes de migration |
| `integrar módulo` | Encaixar algo já existente em tela nova |
| `ativar feature` | Código existe mas está inativo — conectar e validar |
