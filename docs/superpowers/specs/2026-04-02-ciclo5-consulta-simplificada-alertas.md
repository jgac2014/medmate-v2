# Spec: Ciclo 5 — Consulta Simplificada + Alertas Inteligentes

**Data:** 2026-04-02
**Status:** Aprovado — aguardando plano de implementação

---

## Contexto e motivação

O usuário alvo é o médico de família (MFC) de UBS que usa o PEC obrigatoriamente para documentação formal (prescrições, encaminhamentos, atestados) e usa o MedMate como ferramenta de apoio ao raciocínio clínico durante a consulta.

O problema central identificado: a tela de consulta atual exibe todos os componentes simultaneamente, criando sobrecarga cognitiva ("painel de avião"). Um médico que atende 20–30 pacientes/dia não pode gastar tempo entendendo a interface. Se ele não sabe o que fazer no próximo segundo, o design falhou.

Princípio guia deste ciclo: **o fluxo padrão deve ser o mais simples possível. Complexidade é opt-in, não obrigatória.**

---

## O que este ciclo entrega

### 1. Novo layout da consulta (Sessão 1)

**Estrutura:**
- **Sidebar fixa à esquerda** — contexto do paciente sempre visível
- **Área principal à direita** — SOAP como foco central + saída

**Sidebar contém:**
- Nome, idade, sexo do paciente
- Lista de problemas ativos (`patient_problems`)
- Medicamentos contínuos ativos (`patient_medications`)
- Seção de alertas (ver Sessão 2)

**Área principal contém:**
- Campos SOAP: S, O, A, P
- Botão `[+] Adicionar dados objetivos` no campo O (ver Sessão 3)
- Seção de saída/output ao final (modos eSUS / Resumido / Detalhado — já existentes)

**O que sai da view principal:**
- `PatientInfo` — absorvido pela sidebar
- `ProblemList` — absorvido pela sidebar
- `VitalsForm` e `ExamGrid` — movidos para o fluxo opcional dentro do O (Sessão 3)
- `FollowupPanel` e `PreventionList` — permanecem, mas em posição mais discreta abaixo do SOAP

**Componentes novos:**
- `src/components/consultation/consultation-sidebar.tsx`

**Componentes refatorados:**
- `src/app/(dashboard)/consulta/page.tsx` — novo layout de duas colunas
- `src/components/consultation/soap-form.tsx` — aceita `objectiveText` como prop auto-preenchida

---

### 2. Sistema de alertas contextuais (Sessão 2)

Alertas aparecem na sidebar quando o médico abre um paciente. Dois tipos implementados, construídos sobre dados já existentes no banco.

**Alerta 1 — Follow-up vencido**
- Fonte: tabela `followup_items` (já existe)
- Lógica: itens com `due_date < hoje` para o paciente selecionado
- Mensagem: `"Retorno previsto em DD/MM/AAAA — não realizado"`

**Alerta 2 — Condição crônica sem consulta recente**
- Fonte: `patient_problems` (ativo) + data da última consulta em `consultations`
- Lógica: paciente tem problema ativo com CID de condição crônica (HAS, DM2, etc.) E última consulta há mais de 180 dias
- Mensagem: `"[Problema] ativo — última consulta há X meses"`
- Lista de condições crônicas monitoradas: HAS, DM2, Dislipidemia, Hipotireoidismo, Asma, DPOC, ICC, DAC

**Comportamento dos alertas:**
- Carregados ao selecionar o paciente (`setPatientId` no store)
- Podem ser dispensados com clique em "Ciente" — dismissal armazenado em `localStorage` por paciente+sessão (não persiste no banco para não criar complexidade)
- Severidade visual: amarelo (follow-up), laranja (condição crônica)

**Novos arquivos:**
- `src/lib/supabase/alerts.ts` — `getPatientAlerts(patientId, userId): Promise<Alert[]>`
- `src/types/index.ts` — tipo `Alert { id, type, message, severity }`
- `src/components/consultation/alert-list.tsx` — renderiza alertas na sidebar

---

### 3. Exames opcionais + auto-preenchimento do O (Sessão 3)

**Fluxo padrão (toda consulta):**
O campo O do SOAP aparece como textarea normal. O médico digita livremente se quiser.

**Fluxo estendido (quando há dados objetivos):**
O médico clica em `[+ Dados objetivos]` no campo O. Uma seção se expande inline com os campos de vitais e exames já existentes (VitalsForm + ExamGrid reutilizados). Ao fechar, o campo O recebe texto formatado automaticamente.

**Formato gerado automaticamente no O:**
```
PA: 140/90 mmHg | FC: 78 bpm | SpO2: 97% | Temp: 36,5°C
Peso: 72 kg | Altura: 1,72 m | IMC: 24,3
Glicemia capilar: 110 mg/dL | [outros campos preenchidos]
```
- Apenas campos com valor preenchido aparecem no texto
- Texto é editável após gerado — o médico pode ajustar livremente
- Se o médico já tinha texto no O, uma confirmação pergunta se deseja substituir

**Componentes novos:**
- `src/components/consultation/objective-data-drawer.tsx` — seção expansível com VitalsForm + ExamGrid
- `src/lib/format-objective.ts` — função pura que recebe vitals/exams do store e retorna string formatada

**Componentes refatorados:**
- `src/components/consultation/soap-form.tsx` — campo O recebe `onInsertObjective` callback + botão `[+ Dados objetivos]`

---

## O que NÃO está no escopo deste ciclo

- Agenda / scheduling
- Exportação PDF
- AI copilot / Claude API
- Painel da carteira (populational dashboard)
- Alertas de exame pedido sem resultado (sem estrutura de dados suficiente)
- Persistência do dismiss de alertas no banco

---

## Dependências e riscos

| Item | Risco | Mitigação |
|---|---|---|
| Refactor do layout da consulta | Médio — muitos componentes existentes | Manter todos os componentes, só reorganizar posição |
| Query de alertas | Baixo — dados já existem | Queries simples, sem joins complexos |
| Auto-preenchimento do O | Baixo — dados já no Zustand store | Função pura de formatação, sem side effects |
| Dismissal de alertas em localStorage | Baixo | Escopo limitado a sessão, sem dependência de banco |

---

## Schema Supabase

Nenhuma migration necessária. Todas as queries usam tabelas existentes:
- `followup_items` — alertas de follow-up
- `patient_problems` — alertas de condição crônica
- `consultations` — data da última consulta
- `patient_medications` — sidebar de medicamentos

---

## Sessões planejadas

| Sessão | Entregável | Componentes |
|---|---|---|
| 1 | Novo layout da consulta | `consultation-sidebar.tsx`, refactor `page.tsx`, refactor `soap-form.tsx` |
| 2 | Alertas contextuais | `alerts.ts`, `Alert` type, `alert-list.tsx` |
| 3 | Exames opcionais + O auto-preenchido | `objective-data-drawer.tsx`, `format-objective.ts`, refactor `soap-form.tsx` |
