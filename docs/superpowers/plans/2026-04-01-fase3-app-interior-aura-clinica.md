# Fase 3 — App Interior Aura Clínica: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrar o interior do app (tela de consulta, topbar, modais) do visual dark "Clinical Linear" para o design system light "Aura Clínica", sem alterar nenhuma lógica, store, cálculos ou integrações.

**Architecture:** Pure visual refactor — todos os props, stores, hooks e lógica permanecem intocados. Os tokens CSS backward-compat (bg-0, text-primary, etc.) em globals.css já mapeiam para os novos valores Aura, então o app está funcionalmente em light mode; este plano aplica as intenções visuais do Stitch (layout, tipografia Newsreader, estrutura de cards) e adiciona o modal de conclusão.

**Tech Stack:** Next.js App Router, Tailwind CSS (Aura tokens em globals.css), Newsreader + Public Sans via next/font (já carregadas em layout.tsx pela Fase 1).

**Referências visuais:** `stitch-exports/html/06_copiloto.html`, `07_conclusao.html`, `08_iniciar_consulta.html`

**O que NÃO muda:** `consultation-store.ts`, `lib/calculations/`, `lib/esus-generator.ts`, `lib/output-generators/`, `lib/clinical-rules.ts`, `lib/constants.ts`, `lib/templates.ts`, migrations, webhooks Stripe, proxy.ts.

---

## File Map

| Arquivo | Ação |
|---|---|
| `src/app/(dashboard)/consulta/page.tsx` | Modify — WorkspacePanel + page bg |
| `src/components/consultation/patient-selector.tsx` | Modify — friction-zero redesign |
| `src/components/layout/topbar.tsx` | Modify — Aura visual + ConsultaConcluidaModal state |
| `src/components/consultation/exam-card.tsx` | Modify — Aura card styling |
| `src/components/consultation/soap-form.tsx` | Modify — textareas bottom-stroke |
| `src/components/consultation/history-form.tsx` | Modify — textareas bottom-stroke |
| `src/components/consultation/output-column.tsx` | Modify — tabs, pre block, copy button, textareas |
| `src/components/consultation/consulta-concluida-modal.tsx` | **Create** — modal pós-save |
| `src/app/globals.css` | Modify — remover aliases backward-compat (Task 8) |

---

## Task 1: WorkspacePanel + Layout Shell

**Files:**
- Modify: `src/app/(dashboard)/consulta/page.tsx`

- [ ] **Step 1: Substituir o componente WorkspacePanel**

Substituir a função `WorkspacePanel` completa por:

```tsx
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
    <section className="min-h-0 rounded-xl bg-surface-lowest shadow-sm overflow-hidden flex flex-col">
      <div className="shrink-0 px-5 pt-5 pb-3">
        <p className="font-headline text-[15px] font-semibold text-primary">{title}</p>
        <p className="text-[11px] text-on-surface-muted mt-0.5 leading-relaxed">{description}</p>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-3">
        {children}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Atualizar o container da página e remover `<hr>` separators**

No JSX de `ConsultaPage`, substituir:
```tsx
<div className="h-[calc(100vh-56px)] overflow-x-auto">
```
por:
```tsx
<div className="h-[calc(100vh-56px)] overflow-x-auto bg-surface-low">
```

Remover todas as linhas `<hr className="border-0 border-t border-border-subtle my-4" />` dentro dos WorkspacePanels — substituir por `<div className="my-4" />` onde o espaçamento for necessário.

- [ ] **Step 3: Commit**

```bash
cd "C:/Users/joaog/Ferramenta Medica/Ferramenta Medica/MedMate/medmate-app"
git add src/app/\(dashboard\)/consulta/page.tsx
git commit -m "feat(fase3): WorkspacePanel Aura — card branco sobre surface-low, sem bordas"
```

---

## Task 2: PatientSelector — Friction-Zero Redesign

**Files:**
- Modify: `src/components/consultation/patient-selector.tsx`

- [ ] **Step 1: Substituir o JSX do modal (manter toda a lógica acima do `return`)**

Manter todo o código de lógica (hooks, handlers, `if (!open) return null`) e substituir apenas o bloco `return (...)` por:

```tsx
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-[60] w-[520px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 bg-surface-lowest rounded-2xl shadow-[0_32px_64px_-12px_rgba(23,28,31,0.12)] overflow-hidden">

        {/* Decorative blobs */}
        <div className="absolute top-[-15%] right-[-5%] w-[40%] h-[40%] rounded-full bg-secondary-container opacity-30 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-[60px] pointer-events-none" />

        {/* Content */}
        <div className="relative p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-headline text-2xl font-medium text-primary">
                {view === "search" ? "Iniciar consulta" : "Novo paciente"}
              </h2>
              <p className="text-sm text-on-surface-muted mt-0.5">
                {view === "search" ? "Busque o paciente ou crie um novo" : "Preencha os dados do paciente"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-muted hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer text-xl leading-none"
            >
              ×
            </button>
          </div>

          {view === "search" ? (
            <>
              <div className="relative mb-5">
                <input
                  autoFocus
                  type="text"
                  placeholder="Buscar paciente por nome ou CPF..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full h-14 pl-5 pr-4 border-0 border-b-2 border-outline-variant/50 bg-transparent text-on-surface text-lg placeholder:text-on-surface-muted focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="min-h-[140px]">
                {searching && (
                  <p className="text-sm text-on-surface-muted text-center py-10">Buscando...</p>
                )}
                {!searching && query.length >= 2 && results.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-sm text-on-surface-variant">Nenhum paciente encontrado</p>
                    <button
                      onClick={() => setView("create")}
                      className="mt-2 text-sm text-secondary hover:underline cursor-pointer"
                    >
                      Criar novo paciente
                    </button>
                  </div>
                )}
                {!searching && results.length > 0 && (
                  <div className="space-y-1 max-h-[280px] overflow-y-auto">
                    {results.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => onSelect(p)}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-surface-container transition-colors cursor-pointer group"
                      >
                        <p className="text-[14px] font-medium text-on-surface group-hover:text-primary transition-colors">{p.name}</p>
                        <p className="text-[12px] text-on-surface-muted mt-0.5">
                          {p.birth_date ? ageFromBirthDate(p.birth_date) : "Idade não informada"}
                          {p.gender ? ` · ${p.gender}` : ""}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
                {!searching && query.length < 2 && (
                  <p className="text-sm text-on-surface-muted text-center py-10">
                    Digite pelo menos 2 caracteres para buscar
                  </p>
                )}
              </div>

              <div className="mt-6 pt-5 border-t border-outline-variant/30 flex justify-between items-center">
                <button
                  onClick={() => setView("create")}
                  className="text-sm text-secondary hover:text-primary transition-colors cursor-pointer font-medium"
                >
                  + Novo paciente
                </button>
                <button
                  onClick={onClose}
                  className="text-sm text-on-surface-muted hover:text-on-surface transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] text-on-surface-variant mb-1 font-medium">Nome completo *</label>
                <input
                  autoFocus
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full h-11 border-0 border-b-2 border-outline-variant/50 bg-transparent text-on-surface text-[14px] placeholder:text-on-surface-muted focus:outline-none focus:border-primary transition-colors"
                  placeholder="Nome do paciente"
                />
              </div>
              <div>
                <label className="block text-[13px] text-on-surface-variant mb-1 font-medium">Data de nascimento</label>
                <input
                  type="date"
                  value={newBirthDate}
                  onChange={(e) => setNewBirthDate(e.target.value)}
                  className="w-full h-11 border-0 border-b-2 border-outline-variant/50 bg-transparent text-on-surface text-[14px] focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] text-on-surface-variant mb-1 font-medium">Sexo</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    className="w-full h-11 border-0 border-b-2 border-outline-variant/50 bg-transparent text-on-surface text-[14px] focus:outline-none focus:border-primary transition-colors cursor-pointer"
                  >
                    <option value="">—</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] text-on-surface-variant mb-1 font-medium">Raça/Cor</label>
                  <select
                    value={newRace}
                    onChange={(e) => setNewRace(e.target.value)}
                    className="w-full h-11 border-0 border-b-2 border-outline-variant/50 bg-transparent text-on-surface text-[14px] focus:outline-none focus:border-primary transition-colors cursor-pointer"
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
                <label className="block text-[13px] text-on-surface-variant mb-1 font-medium">CPF (opcional)</label>
                <input
                  type="text"
                  value={newCpf}
                  onChange={(e) => setNewCpf(e.target.value)}
                  className="w-full h-11 border-0 border-b-2 border-outline-variant/50 bg-transparent text-on-surface text-[14px] placeholder:text-on-surface-muted focus:outline-none focus:border-primary transition-colors"
                  placeholder="000.000.000-00"
                />
              </div>
              {createError && (
                <p className="text-[13px] text-error">{createError}</p>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setView("search")}
                  className="flex-1 h-12 rounded-xl border border-outline-variant/50 text-on-surface-variant text-[14px] font-medium hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newName.trim() || creating}
                  className="flex-1 h-12 rounded-xl bg-primary text-on-primary text-[14px] font-semibold hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {creating ? "Criando..." : "Criar e iniciar"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
```

- [ ] **Step 2: Commit**

```bash
git add src/components/consultation/patient-selector.tsx
git commit -m "feat(fase3): PatientSelector friction-zero — Aura Clínica modal redesign"
```

---

## Task 3: Topbar — Aura Redesign

**Files:**
- Modify: `src/components/layout/topbar.tsx`

- [ ] **Step 1: Substituir o bloco JSX da topbar (o `<div className="sticky top-0 ...">` e seu conteúdo)**

Localizar o bloco que começa com:
```tsx
<div className="sticky top-0 z-30 border-b border-border-subtle bg-white/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.06)]">
```

Substituir esse bloco inteiro (até o `</div>` que fecha o sticky wrapper) por:

```tsx
<div className="sticky top-0 z-30 bg-surface-low">
  <div className="flex items-center justify-between px-6 h-14">
    {/* Logo */}
    <div className="flex items-center gap-5 min-w-0 shrink-0">
      <span className="font-headline text-xl font-bold text-primary">{BRAND.name}</span>
    </div>

    {/* Patient name — centro */}
    {patientName && (
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-status-ok shrink-0" />
        <span className="font-headline italic text-[15px] text-on-surface truncate max-w-[280px]">
          {patientName}
        </span>
      </div>
    )}

    {/* Ações — direita */}
    <div className="flex gap-2 items-center">
      <div
        className={`hidden sm:inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium ${subscriptionMeta.className}`}
      >
        {subscriptionMeta.label}
      </div>

      {!isPro && (
        <button
          onClick={handleCheckout}
          disabled={checkoutLoading}
          className="px-3 py-1.5 rounded-lg text-[12px] font-semibold cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-on-primary hover:bg-primary-container"
        >
          {checkoutLoading ? "Redirecionando..." : "Ativar Pro"}
        </button>
      )}

      <button
        onClick={() => setHistoryOpen(true)}
        className="h-[34px] px-3 rounded-lg text-[13px] font-medium border border-outline-variant/50 text-on-surface-variant bg-surface-lowest hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
      >
        Histórico
      </button>

      <button
        onClick={() => setTemplateSelectorOpen(true)}
        className="h-[34px] px-3 rounded-lg text-[13px] font-medium border border-outline-variant/50 text-on-surface-variant bg-surface-lowest hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
      >
        Template
      </button>

      {patientName && (
        <button
          onClick={() => setDashboardOpen(true)}
          className="h-[34px] px-3 rounded-lg text-[13px] font-medium border border-secondary/30 text-secondary bg-secondary-container/20 hover:bg-secondary-container/40 transition-colors cursor-pointer"
        >
          Prontuário
        </button>
      )}

      <Button
        variant="secondary"
        className="h-[34px] px-3 text-[13px]"
        onClick={() => setPatientSelectorOpen(true)}
      >
        Nova consulta
      </Button>

      <Button
        variant="primary"
        className="h-[34px] px-4 text-[13px]"
        onClick={handleSave}
        disabled={saveLoading}
      >
        {saveLoading ? "Salvando..." : currentConsultationId ? "Atualizar" : "Salvar"}
      </Button>

      <div className="relative ml-1" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="h-9 rounded-full border border-outline-variant/50 bg-surface-lowest pl-1.5 pr-2.5 flex items-center gap-2 text-left hover:bg-surface-container transition-colors cursor-pointer"
        >
          <span className="w-7 h-7 rounded-full bg-surface-container border border-outline-variant/30 flex items-center justify-center text-[11px] font-semibold text-on-surface-variant">
            {initials || "?"}
          </span>
          <span className="hidden lg:flex flex-col leading-none min-w-0">
            <span className="text-[12px] font-medium text-on-surface truncate max-w-[140px]">
              {userName || "Minha conta"}
            </span>
          </span>
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-11 w-56 bg-surface-lowest border border-outline-variant/30 rounded-xl shadow-[0_8px_30px_rgba(23,28,31,0.10)] py-1.5 z-[60]">
            {userName && (
              <div className="px-4 py-3 border-b border-outline-variant/30">
                <p className="text-[13px] font-medium text-on-surface truncate">
                  {userName}
                </p>
                <p className="text-[12px] text-on-surface-muted mt-0.5">
                  {subscriptionMeta.label}
                </p>
              </div>
            )}
            <button
              onClick={() => { setMenuOpen(false); router.push("/conta"); }}
              className="w-full text-left px-4 py-2.5 text-[13px] text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            >
              Minha conta
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 text-[13px] text-on-surface-variant hover:text-error hover:bg-surface-container transition-colors cursor-pointer"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/topbar.tsx
git commit -m "feat(fase3): Topbar Aura — surface-low bg, logo Newsreader, patient name italic center"
```

---

## Task 4: ExamCard — Aura Styling

**Files:**
- Modify: `src/components/consultation/exam-card.tsx`

- [ ] **Step 1: Substituir o JSX do card**

Substituir o bloco `return (...)` por:

```tsx
  return (
    <div
      className={`rounded-xl p-3 bg-surface-lowest shadow-sm transition-shadow duration-150 hover:shadow-md ${
        span2 ? "col-span-2" : ""
      }`}
    >
      <div className="text-[9px] font-bold tracking-[0.10em] uppercase text-on-surface-muted mb-2 pb-1.5">
        {card.title}
      </div>
      {card.fields.map((field) => {
        const value = labs[field.key] ?? "";
        const numValue = parseFloat(value);
        const status = !isNaN(numValue) && !field.auto ? getStatus(field.key, numValue, patient.gender) : "none";

        return (
          <ExamInput
            key={field.key}
            label={field.label}
            unit={field.unit}
            status={field.auto ? "none" : status}
            auto={field.auto}
            value={value}
            onChange={(e) => setLab(field.key, e.target.value)}
          />
        );
      })}
    </div>
  );
```

- [ ] **Step 2: Commit**

```bash
git add src/components/consultation/exam-card.tsx
git commit -m "feat(fase3): ExamCard Aura — surface-lowest card, shadow-sm, sem bordas"
```

---

## Task 5: SoapForm + HistoryForm — Textareas Bottom-Stroke

**Files:**
- Modify: `src/components/consultation/soap-form.tsx`
- Modify: `src/components/consultation/history-form.tsx`

- [ ] **Step 1: Atualizar textareas em SoapForm**

Em `soap-form.tsx`, substituir a className da `<textarea>`:

De:
```tsx
className="w-full h-16 px-2 py-[7px] border border-border-subtle rounded-[5px] bg-bg-2 text-text-primary font-sans text-xs resize-y leading-relaxed placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)]"
```

Para:
```tsx
className="w-full h-16 px-0 py-2 border-0 border-b border-outline-variant/50 rounded-none bg-transparent text-on-surface text-[13px] resize-y leading-relaxed placeholder:text-on-surface-muted focus:outline-none focus:border-primary transition-colors"
```

Também atualizar os labels de `text-text-tertiary` para `text-on-surface-muted`:
```tsx
<label className="block text-[11px] text-on-surface-muted mb-0.5 font-medium">
```

- [ ] **Step 2: Atualizar textareas em HistoryForm**

Em `history-form.tsx`, substituir a className da `<textarea>`:

De:
```tsx
className="w-full h-14 px-2 py-[7px] border border-border-subtle rounded-[5px] bg-bg-2 text-text-primary font-sans text-xs resize-y leading-relaxed placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)]"
```

Para:
```tsx
className="w-full h-14 px-0 py-2 border-0 border-b border-outline-variant/50 rounded-none bg-transparent text-on-surface text-[13px] resize-y leading-relaxed placeholder:text-on-surface-muted focus:outline-none focus:border-primary transition-colors"
```

Também atualizar os labels de `text-text-tertiary` para `text-on-surface-muted`:
```tsx
<label className="block text-[11px] text-on-surface-muted mb-0.5 font-medium">
```

- [ ] **Step 3: Commit**

```bash
git add src/components/consultation/soap-form.tsx src/components/consultation/history-form.tsx
git commit -m "feat(fase3): SoapForm + HistoryForm — textareas bottom-stroke Aura"
```

---

## Task 6: OutputColumn — Aura Redesign

**Files:**
- Modify: `src/components/consultation/output-column.tsx`

- [ ] **Step 1: Atualizar tabs de modo de output**

Localizar o map dos mode buttons (linha ~95-107) e substituir a className do button:

De:
```tsx
className={`px-2.5 py-1 text-[11px] rounded-md border transition-colors cursor-pointer ${
  outputMode === mode
    ? "bg-accent/15 border-accent/30 text-accent font-medium"
    : "bg-transparent border-border-subtle text-text-tertiary hover:text-text-secondary"
}`}
```

Para:
```tsx
className={`px-3 py-1.5 text-[12px] rounded-lg transition-colors cursor-pointer font-medium ${
  outputMode === mode
    ? "bg-primary/8 text-primary border-b-2 border-primary"
    : "text-on-surface-muted hover:text-on-surface hover:bg-surface-container"
}`}
```

- [ ] **Step 2: Atualizar o bloco pre do resumo eSUS**

Localizar a `<pre>` e substituir:

De:
```tsx
<pre className="bg-bg-1 border border-border-subtle border-l-[3px] border-l-[rgba(34,211,238,0.35)] rounded-xl p-3 font-mono text-[10.5px] leading-[1.9] text-text-primary min-h-[240px] whitespace-pre-wrap break-words mb-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
```

Para:
```tsx
<pre className="bg-surface-container rounded-xl p-4 font-mono text-[11px] leading-[1.9] text-on-surface min-h-[240px] whitespace-pre-wrap break-words mb-1">
```

E o bloco vazio (quando `!hasSummary`):

De:
```tsx
<div className="bg-bg-1 border border-dashed border-border-default rounded-xl p-3 min-h-[240px] mb-1 flex flex-col justify-center">
  <p className="text-[12px] font-medium text-text-primary mb-1.5">
  <p className="text-[11px] text-text-secondary leading-relaxed mb-3">
  <div className="space-y-1 text-[10.5px] text-text-tertiary font-mono">
```

Para:
```tsx
<div className="bg-surface-container rounded-xl p-4 min-h-[240px] mb-1 flex flex-col justify-center">
  <p className="text-[13px] font-medium text-on-surface mb-1.5">
  <p className="text-[12px] text-on-surface-variant leading-relaxed mb-3">
  <div className="space-y-1 text-[11px] text-on-surface-muted font-mono">
```

- [ ] **Step 3: Atualizar botão Copiar**

De:
```tsx
className={`w-full h-[28px] mt-[5px] bg-transparent border rounded-[5px] text-xs cursor-pointer font-sans transition-all duration-150 flex items-center justify-center gap-1 ${
  copied
    ? "border-accent text-accent bg-accent-dim"
    : "border-border-default text-text-secondary hover:bg-bg-3 hover:text-text-primary hover:border-text-tertiary"
} disabled:cursor-not-allowed disabled:opacity-50`}
```

Para:
```tsx
className={`w-full h-[40px] mt-2 rounded-xl text-[13px] font-semibold cursor-pointer transition-all duration-150 flex items-center justify-center gap-2 ${
  copied
    ? "bg-secondary-container text-on-secondary-container"
    : "bg-primary text-on-primary hover:bg-primary-container"
} disabled:cursor-not-allowed disabled:opacity-50`}
```

- [ ] **Step 4: Atualizar o editor livre e textareas de Prescrição, Exames, Orientações**

Editor livre (`contentEditable div`):

De:
```tsx
className="min-h-[150px] p-3 border border-border-subtle rounded-xl bg-bg-3/85 text-text-primary text-xs leading-[1.75] outline-none transition-[border,background-color] duration-150 focus:border-border-default focus:bg-bg-3"
```

Para:
```tsx
className="min-h-[150px] p-3 rounded-xl bg-surface-container text-on-surface text-[13px] leading-[1.75] outline-none"
```

Botões de formatação (bold/italic/underline):

De:
```tsx
className="w-[26px] h-[26px] border border-border-default rounded-md bg-bg-3 text-text-secondary cursor-pointer inline-flex items-center justify-center text-[10px] hover:bg-bg-2 hover:text-text-primary hover:border-text-tertiary transition-all duration-100"
```

Para:
```tsx
className="w-[26px] h-[26px] border border-outline-variant/40 rounded-md bg-surface-container text-on-surface-muted cursor-pointer inline-flex items-center justify-center text-[10px] hover:bg-surface-high hover:text-on-surface transition-all duration-100"
```

Textareas de Prescrição, Exames a Solicitar e Orientações ao Paciente:

De (padrão igual nas três):
```tsx
className="w-full h-20 px-2 py-[7px] border border-border-subtle rounded-[5px] bg-bg-2 text-text-primary font-sans text-xs resize-y leading-relaxed placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)]"
```

Para (aplicar nas três textareas):
```tsx
className="w-full h-20 px-0 py-2 border-0 border-b border-outline-variant/50 rounded-none bg-transparent text-on-surface text-[13px] resize-y leading-relaxed placeholder:text-on-surface-muted focus:outline-none focus:border-primary transition-colors"
```

Também atualizar o height do textarea de Prescrição de `h-20` para `h-24` (tem mais conteúdo tipicamente).

- [ ] **Step 5: Commit**

```bash
git add src/components/consultation/output-column.tsx
git commit -m "feat(fase3): OutputColumn Aura — tabs, pre block, botão copiar primary, textareas bottom-stroke"
```

---

## Task 7: ConsultaConcluidaModal — Novo Componente

**Files:**
- Create: `src/components/consultation/consulta-concluida-modal.tsx`

- [ ] **Step 1: Criar o arquivo**

Criar `src/components/consultation/consulta-concluida-modal.tsx` com o conteúdo:

```tsx
"use client";

import { useState } from "react";
import { copyToClipboard } from "@/lib/clipboard";
import { showToast } from "@/components/ui/toast";

interface ConsultaConcluidaModalProps {
  open: boolean;
  esusText: string;
  patientName: string | null;
  onNewConsulta: () => void;
  onHistory: () => void;
}

export function ConsultaConcluidaModal({
  open,
  esusText,
  patientName,
  onNewConsulta,
  onHistory,
}: ConsultaConcluidaModalProps) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  async function handleCopy() {
    const ok = await copyToClipboard(esusText);
    if (ok) {
      setCopied(true);
      showToast("Copiado para a área de transferência!", "success");
      setTimeout(() => setCopied(false), 3000);
    } else {
      showToast("Erro ao copiar", "error");
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-surface flex flex-col items-center justify-center p-6">
      {/* Atmospheric blobs */}
      <div className="fixed bottom-0 left-0 w-full h-1/3 pointer-events-none overflow-hidden">
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary-container opacity-15 blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 opacity-30 blur-[100px] rounded-full" />
      </div>

      {/* Check icon */}
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-secondary-container blur-3xl opacity-25 rounded-full" />
        <div className="relative w-20 h-20 bg-surface-lowest rounded-full flex items-center justify-center shadow-sm">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-secondary">
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md w-full text-center space-y-6 relative z-10">
        <header className="space-y-2">
          <h1 className="font-headline text-4xl font-medium text-primary">
            Pronto para o eSUS
          </h1>
          {patientName && (
            <p className="font-headline italic text-secondary text-lg opacity-80">
              {patientName}
            </p>
          )}
          <p className="text-on-surface-muted text-[14px]">
            Documentação clínica gerada — pronta para colar no sistema oficial
          </p>
        </header>

        {/* Checklist */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-muted mb-2 text-left">
            Gerado automaticamente:
          </p>
          <div className="bg-surface-lowest p-6 rounded-xl space-y-3 text-left shadow-sm border border-outline-variant/20">
            {["SOAP estruturado", "Conduta definida", "Pronto para o eSUS"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#416d5c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-[14px] font-medium text-on-surface">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={handleCopy}
            className={`w-full py-4 px-6 rounded-xl text-[15px] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              copied
                ? "bg-secondary-container text-on-secondary-container"
                : "bg-primary text-on-primary hover:bg-primary-container active:scale-[0.98]"
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
            </svg>
            {copied ? "Copiado!" : "Copiar para eSUS PEC"}
          </button>

          <div className="flex gap-3">
            <button
              onClick={onHistory}
              className="flex-1 py-3 px-4 rounded-xl border border-outline-variant/50 text-on-surface-variant text-[14px] font-medium hover:bg-surface-container transition-colors cursor-pointer"
            >
              Ver histórico
            </button>
            <button
              onClick={onNewConsulta}
              className="flex-1 py-3 px-4 rounded-xl border border-outline-variant/50 text-on-surface-variant text-[14px] font-medium hover:bg-surface-container transition-colors cursor-pointer"
            >
              Nova consulta
            </button>
          </div>
        </div>

        <p className="text-[10px] text-on-surface-muted text-center">
          Formato pronto para colar diretamente no prontuário oficial
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/consultation/consulta-concluida-modal.tsx
git commit -m "feat(fase3): ConsultaConcluidaModal — tela pós-save com cópia eSUS e ações"
```

---

## Task 8: Integração do Modal + Remover Compat Aliases + Build

**Files:**
- Modify: `src/components/layout/topbar.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Adicionar state e import do modal em topbar.tsx**

No topo do arquivo, adicionar o import:
```tsx
import { ConsultaConcluidaModal } from "@/components/consultation/consulta-concluida-modal";
import { generateEsusSummary } from "@/lib/esus-generator";
```

No bloco de states (próximo dos outros `useState`), adicionar:
```tsx
const [consultaConcluida, setConsultaConcluida] = useState(false);
const [esusTextSnapshot, setEsusTextSnapshot] = useState("");
```

- [ ] **Step 2: Alterar handleSave para abrir o modal no sucesso**

No final da função `handleSave`, após `showToast("Consulta salva!", "success")`, adicionar:
```tsx
      // Capturar texto eSUS e abrir modal de conclusão
      const esusText = generateEsusSummary(useConsultationStore.getState());
      setEsusTextSnapshot(esusText);
      setConsultaConcluida(true);
```

- [ ] **Step 3: Adicionar ConsultaConcluidaModal no return do Topbar**

Logo após a tag `<PatientDashboard .../>` (dentro do `<>` raiz do return), adicionar:
```tsx
      <ConsultaConcluidaModal
        open={consultaConcluida}
        esusText={esusTextSnapshot}
        patientName={patientName}
        onNewConsulta={() => {
          setConsultaConcluida(false);
          setPatientSelectorOpen(true);
          reset();
        }}
        onHistory={() => {
          setConsultaConcluida(false);
          setHistoryOpen(true);
        }}
      />
```

- [ ] **Step 4: Remover aliases backward-compat de globals.css**

Em `src/app/globals.css`, remover o bloco inteiro entre os comentários:
```css
  /* ── Backward-compat aliases (remover após Fase 3) ── */
  --bg-0: var(--surface-lowest);
  ... (todas as linhas até --accent-light)
```

E no bloco `@theme inline { ... }`, remover as linhas do comentário `/* Backward-compat — tokens antigos (remover após Fase 3) */` até o último `--color-accent-light`.

**Nota:** Após esta remoção, o build irá revelar qualquer classe `bg-bg-0/1/2/3`, `text-text-primary/secondary/tertiary`, `border-border-subtle/default`, `bg-accent`, `text-accent` ainda em uso. Nesse caso, **não remover os aliases** — apenas pular este step e fazer commit sem a remoção.

- [ ] **Step 5: Verificar build**

```bash
cd "C:/Users/joaog/Ferramenta Medica/Ferramenta Medica/MedMate/medmate-app"
npm run build 2>&1 | tail -30
```

Se o build passar: ótimo. Se houver erros TypeScript referentes a classes CSS desconhecidas (Tailwind não gera erros de TypeScript por classes), verificar se são erros reais de TypeScript e corrigir.

Se o build falhar por causa da remoção dos aliases, restaurar os aliases em globals.css:
```bash
git checkout src/app/globals.css
```
E fazer o build de novo para confirmar que passa sem a remoção.

- [ ] **Step 6: Commit final**

```bash
git add src/components/layout/topbar.tsx src/app/globals.css
git commit -m "feat(fase3): modal integrado ao save + remoção de compat aliases — Fase 3 completa"
```

---

## Critérios de Sucesso

1. `npm run build` passa sem erros TypeScript
2. WorkspacePanel usa `bg-surface-lowest shadow-sm` — sem glass effect dark
3. PatientSelector abre com modal limpo, busca proeminente, backdrop translúcido claro
4. Topbar usa `bg-surface-low`, logo Newsreader, nome do paciente italic ao centro
5. ExamCards em `bg-surface-lowest shadow-sm` sem bordas
6. Textareas SOAP/Antecedentes/Output em bottom-stroke, fundo transparente
7. Botão Copiar em `bg-primary text-on-primary`
8. ConsultaConcluidaModal abre após save bem-sucedido, permite copiar eSUS e iniciar nova consulta
