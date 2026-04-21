"use client";

import { useState, useMemo, useCallback } from "react";
import { useConsultationStore } from "@/stores/consultation-store";
import { CLINICAL_TEMPLATES, type ClinicalTemplate } from "@/lib/templates";
import type { TemplateCategory, TemplateStatus } from "@/types";
import { showToast } from "@/components/ui/toast";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  cronico: "Crônico",
  agudo: "Agudo",
  saude_mental: "Saúde Mental",
  preventivo: "Preventivo",
  retorno_exames: "Retorno / Exames",
};

const CATEGORY_ICONS: Record<TemplateCategory, string> = {
  cronico: "favorite",
  agudo: "bolt",
  saude_mental: "psychology",
  preventivo: "shield",
  retorno_exames: "science",
};

const STATUS_CONFIG: Record<TemplateStatus, { label: string; color: string; bg: string; dot: string }> = {
  ativo: {
    label: "Ativo",
    color: "text-[var(--status-ok)]",
    bg: "bg-[var(--status-ok)]/8",
    dot: "bg-[var(--status-ok)]",
  },
  em_revisao: {
    label: "Em revisão",
    color: "text-[var(--status-warn)]",
    bg: "bg-[var(--status-warn)]/8",
    dot: "bg-[var(--status-warn)]",
  },
  desatualizado: {
    label: "Desatualizado",
    color: "text-[var(--status-crit)]",
    bg: "bg-[var(--status-crit)]/8",
    dot: "bg-[var(--status-crit)]",
  },
  rascunho: {
    label: "Rascunho",
    color: "text-[var(--on-surface-muted)]",
    bg: "bg-[var(--surface-high)]",
    dot: "bg-[var(--on-surface-muted)]",
  },
};

type QuickFilter = "all" | "ativo" | "em_revisao" | "favoritos" | "recentes";

// ─── Local Storage Helpers ─────────────────────────────────────────────────────

const FAVORITES_KEY = "medmate_template_favorites";
const RECENT_KEY = "medmate_template_recent";

function getFavorites(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function getRecents(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveFavorites(ids: Set<string>) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...ids]));
}

function saveRecent(id: string) {
  const recents = getRecents().filter((r) => r !== id);
  recents.unshift(id);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recents.slice(0, 5)));
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStatus(t: ClinicalTemplate): TemplateStatus {
  return t.governance?.status ?? "ativo";
}

function getName(t: ClinicalTemplate): string {
  return t.metadata?.name ?? t.name ?? "—";
}

function getDescription(t: ClinicalTemplate): string {
  return t.metadata?.description ?? t.description ?? "—";
}

function getCategory(t: ClinicalTemplate): TemplateCategory {
  return t.metadata?.category ?? t.category ?? "cronico";
}

function getPrimarySource(t: ClinicalTemplate) {
  const sources = t.governance?.sources;
  if (!sources || sources.length === 0) return null;
  return sources.find((s) => s.type === "primary") ?? sources[0] ?? null;
}

function getSourceLabel(t: ClinicalTemplate): string {
  const primary = getPrimarySource(t);
  if (primary?.label) return primary.label;
  return t.governance?.source ?? t.source ?? "—";
}

function getSourceUrl(t: ClinicalTemplate): string | undefined {
  const primary = getPrimarySource(t);
  if (primary?.url) return primary.url;
  return t.governance?.sourceUrl ?? t.sourceUrl;
}

function getVersion(t: ClinicalTemplate): string {
  return t.governance?.version ?? "1.0.0";
}

function getLastRevised(t: ClinicalTemplate): string {
  return t.governance?.lastRevised ?? "";
}

function getTags(t: ClinicalTemplate): string[] {
  return t.metadata?.tags ?? t.tags ?? [];
}

function getWhenToUse(t: ClinicalTemplate): string | undefined {
  if (t.indications && t.indications.length > 0) {
    return t.indications.join(" ");
  }
  return t.whenToUse;
}

function getMinimumData(t: ClinicalTemplate): string[] {
  return t.dataRequirements?.useNow ?? t.minimumData ?? [];
}

function getRedFlags(t: ClinicalTemplate): string[] {
  return t.clinical?.specialSituations ?? t.redFlags ?? [];
}

function getFollowup(t: ClinicalTemplate): string | undefined {
  if (t.clinical?.followup && t.clinical.followup.length > 0) {
    return t.clinical.followup.join(" ");
  }
  return t.followup;
}

function getSoapPreview(t: ClinicalTemplate): { subjective?: string; assessment?: string; plan?: string } | undefined {
  if (t.clinical?.soap) {
    const s = t.clinical.soap;
    return {
      subjective: s.subjectiveOutputBlocks?.join("\n"),
      assessment: s.assessmentBlocks?.join("\n"),
      plan: s.planBlocks?.join("\n"),
    };
  }
  return t.soap;
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

// Map legacy fill to new structure
function getProblems(t: ClinicalTemplate): string[] {
  return t.fill?.problems ?? [];
}
function getSoap(t: ClinicalTemplate) {
  return t.soap ?? t.fill?.soap;
}
function getExams(t: ClinicalTemplate) {
  return t.exams ?? t.fill?.requestedExams;
}
function getGuidance(t: ClinicalTemplate) {
  return t.guidance ?? t.fill?.patientInstructions;
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: TemplateStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-[10px] font-medium border ${cfg.bg} ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`} />
      {cfg.label}
    </span>
  );
}

function CategoryPill({ category }: { category: TemplateCategory }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-[10px] bg-[var(--surface-container)] border border-[var(--outline-variant)] text-[var(--on-surface-variant)]">
      <span className="material-symbols-outlined text-[11px]">{CATEGORY_ICONS[category]}</span>
      {CATEGORY_LABELS[category]}
    </span>
  );
}

function Tag({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center px-1.5 py-[1px] rounded-full text-[10px] bg-[var(--surface-container)] text-[var(--on-surface-muted)]">
      {children}
    </span>
  );
}

// Section with left border accent + icon
function PreviewBlock({
  icon,
  label,
  color,
  children,
  secondary = false,
}: {
  icon: string;
  label: string;
  color: string;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  const borders: Record<string, string> = {
    green: "border-l-[var(--status-ok)]",
    blue: "border-l-[var(--status-info)]",
    cyan: "border-l-[var(--status-calc)]",
    amber: "border-l-[var(--status-warn)]",
    red: "border-l-[var(--status-crit)]",
    gray: "border-l-[var(--outline-variant)]",
  };

  return (
    <div
      className={`rounded-lg p-3 ${secondary ? "bg-[var(--surface-container)]/50" : "bg-[var(--surface-lowest)]"} border border-[var(--outline-variant)] border-l-[3px] ${borders[color] ?? borders.gray}`}
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="material-symbols-outlined text-[12px] text-[var(--on-surface-muted)]">{icon}</span>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--on-surface-muted)]">{label}</p>
      </div>
      {children}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

interface TemplateSelectorProps {
  open: boolean;
  onClose: () => void;
}

export function TemplateSelector({ open, onClose }: TemplateSelectorProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | "all">("all");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");
  const [selected, setSelected] = useState<ClinicalTemplate | null>(null);
  const [showWhenNotToUse, setShowWhenNotToUse] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(() => getFavorites());

  const store = useConsultationStore();

  const filtered = useMemo(() => {
    let list = CLINICAL_TEMPLATES;

    if (selectedCategory !== "all") {
      list = list.filter((t) => getCategory(t) === selectedCategory);
    }

    const recents = getRecents();
    switch (quickFilter) {
      case "ativo":
        list = list.filter((t) => getStatus(t) === "ativo");
        break;
      case "em_revisao":
        list = list.filter((t) => getStatus(t) === "em_revisao");
        break;
      case "favoritos":
        list = favorites.size > 0 ? list.filter((t) => favorites.has(t.id)) : [];
        break;
      case "recentes":
        list = recents.length > 0 ? list.filter((t) => recents.includes(t.id)) : [];
        break;
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (t) =>
          getName(t).toLowerCase().includes(q) ||
          getDescription(t).toLowerCase().includes(q) ||
          getTags(t).some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return list;
  }, [search, selectedCategory, quickFilter, favorites]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      saveFavorites(next);
      return next;
    });
  }, []);

  function applyTemplate(template: ClinicalTemplate) {
    const soap = getSoap(template);
    const exams = getExams(template);
    const guidance = getGuidance(template);
    const problems = getProblems(template);

    const state = useConsultationStore.getState();

    // Problems
    for (const p of problems) {
      if (!state.problems.includes(p)) store.toggleProblem(p);
    }

    // SOAP
    if (soap) {
      const merged: Record<string, string> = {};
      for (const [k, val] of Object.entries(soap)) {
        if (!val) continue;
        const existing = ((state.soap as unknown) as Record<string, string>)[k]?.trim() ?? "";
        merged[k] = existing ? `${existing}\n\n---\n${val}` : val;
      }
      if (Object.keys(merged).length > 0) {
        store.setSoap(merged as unknown as Parameters<typeof store.setSoap>[0]);
      }
    }

    // Exams
    if (exams) {
      const existing = state.requestedExams.trim();
      store.setRequestedExams(existing ? `${existing}\n${exams}` : exams);
    }

    // Guidance
    if (guidance) {
      const existing = state.patientInstructions.trim();
      store.setPatientInstructions(existing ? `${existing}\n${guidance}` : guidance);
    }

    saveRecent(template.id);
    showToast(`Template "${template.name}" aplicado`, "success");
    onClose();
  }

  function handleClose() {
    setSelected(null);
    setShowWhenNotToUse(false);
    onClose();
  }

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal 3 colunas */}
      <div className="fixed inset-4 z-[60] bg-[var(--surface)] rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden border border-[var(--outline-variant)]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--outline-variant)] shrink-0 bg-[var(--surface-low)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--primary)] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white text-xl">assignment</span>
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[var(--on-surface)]">Templates</p>
              <p className="text-[11px] text-[var(--on-surface-muted)] mt-0.5">
                {CLINICAL_TEMPLATES.length} templates — revisar sempre antes de aplicar
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg border border-[var(--outline-variant)] flex items-center justify-center text-[var(--on-surface-muted)] hover:text-[var(--on-surface)] hover:bg-[var(--surface-container)] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl leading-none">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* ═══ COLUNA ESQUERDA — Busca e Filtros ═══════════════════════════ */}
          <aside className="w-64 shrink-0 border-r border-[var(--outline-variant)] bg-[var(--surface-low)] overflow-y-auto flex flex-col">

            {/* Busca */}
            <div className="p-4 border-b border-[var(--outline-variant)]">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--on-surface-muted)] text-lg">search</span>
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-[var(--surface-lowest)] border border-[var(--outline-variant)] text-[12px] text-[var(--on-surface)] placeholder:text-[var(--on-surface-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--on-surface-muted)] hover:text-[var(--on-surface)] cursor-pointer">
                    <span className="material-symbols-outlined text-base leading-none">close</span>
                  </button>
                )}
              </div>
            </div>

            {/* Filtros rápido */}
            <div className="px-4 py-3 border-b border-[var(--outline-variant)]">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--on-surface-muted)] mb-2">Filtros</p>
              <div className="flex flex-col gap-0.5">
                {([
                  ["all", "Todos", null],
                  ["ativo", "Ativos", "status-ok"],
                  ["em_revisao", "Em revisão", "status-warn"],
                  ["favoritos", "★ Favoritos", favorites.size > 0 ? favorites.size : null],
                  ["recentes", "↻ Recentes", null],
                ] as const).map(([value, label, badge]) => (
                  <button
                    key={value}
                    onClick={() => setQuickFilter(value as QuickFilter)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-[12px] font-medium transition-colors cursor-pointer flex items-center gap-2 ${
                      quickFilter === value
                        ? "bg-[var(--primary)] text-white"
                        : "text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] hover:text-[var(--on-surface)]"
                    }`}
                  >
                    {label}
                    {badge !== null && typeof badge === "number" && (
                      <span className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] bg-[var(--surface-container)] text-[var(--on-surface-muted)]">
                        {badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Categorias */}
            <div className="px-4 py-3 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--on-surface-muted)] mb-2">Categorias</p>
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => { setSelectedCategory("all"); setSearch(""); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-[12px] font-medium transition-colors cursor-pointer flex items-center gap-2 ${
                    selectedCategory === "all"
                      ? "bg-[var(--surface-container)] text-[var(--on-surface)] border border-[var(--primary)]/30"
                      : "text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">apps</span>
                  Todas
                  <span className="ml-auto text-[10px] text-[var(--on-surface-muted)]">{CLINICAL_TEMPLATES.length}</span>
                </button>
                {(Object.entries(CATEGORY_LABELS) as [TemplateCategory, string][]).map(([cat, label]) => {
                  const count = CLINICAL_TEMPLATES.filter((t) => getCategory(t) === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setSearch(""); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-[12px] font-medium transition-colors cursor-pointer flex items-center gap-2 ${
                        selectedCategory === cat
                          ? "bg-[var(--surface-container)] text-[var(--on-surface)] border border-[var(--primary)]/30"
                          : "text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">{CATEGORY_ICONS[cat]}</span>
                      {label}
                      <span className="ml-auto text-[10px] text-[var(--on-surface-muted)]">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-4 border-t border-[var(--outline-variant)]">
              <div className="rounded-xl border border-[var(--status-info)]/20 bg-[var(--status-info)]/5 p-3">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[var(--status-info)] text-[13px] shrink-0 mt-0.5">info</span>
                  <p className="text-[10.5px] text-[var(--on-surface-muted)] leading-relaxed">
                    Template acelera — não automatiza. Revisão manual sempre necessária.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* ═══ COLUNA CENTRAL — Lista de Cards ══════════════════════════════ */}
          <div className="flex-1 overflow-y-auto">
            {/* Results header */}
            <div className="px-5 py-2.5 border-b border-[var(--outline-variant)] flex items-center justify-between">
              <p className="text-[11px] text-[var(--on-surface-muted)]">
                {filtered.length === 0
                  ? "Nenhum template"
                  : `${filtered.length} template${filtered.length !== 1 ? "s" : ""}`}
                {search && <span className="ml-1">— "{search}"</span>}
              </p>
              {quickFilter !== "all" && (
                <button onClick={() => setQuickFilter("all")} className="text-[10.5px] text-[var(--status-info)] hover:underline cursor-pointer">
                  Limpar
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <span className="material-symbols-outlined text-4xl text-[var(--primary)]/15 mb-2 block">
                    {search ? "search_off" : favorites.size === 0 ? "star_border" : "history"}
                  </span>
                  <p className="text-[11px] text-[var(--on-surface-muted)] leading-relaxed max-w-[200px]">
                    {search
                      ? `Nenhum template para "${search}"`
                      : quickFilter === "favoritos"
                      ? "Nenhum favorito ainda — clique na estrela"
                      : quickFilter === "recentes"
                      ? "Nenhum uso recente"
                      : "Nenhum template nesta categoria"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 grid gap-2">
                {filtered.map((t) => {
                  const status = getStatus(t);
                  const isSelected = selected?.id === t.id;
                  const isFav = favorites.has(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => { setSelected(t); setShowWhenNotToUse(false); }}
                      className={`w-full text-left rounded-xl border transition-all cursor-pointer p-3.5 ${
                        isSelected
                          ? "border-[var(--primary)]/40 bg-[var(--surface-container)] shadow-sm"
                          : "border-[var(--outline-variant)] bg-[var(--surface-lowest)] hover:border-[var(--outline)]"
                      }`}
                    >
                      {/* Name + Status */}
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <p className="text-[13px] font-semibold text-[var(--on-surface)] leading-snug">{getName(t)}</p>
                        <StatusBadge status={status} />
                      </div>
                      {/* Description */}
                      <p className="text-[11px] text-[var(--on-surface-muted)] leading-relaxed mb-2">{getDescription(t)}</p>
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        <CategoryPill category={getCategory(t)} />
                        {getTags(t).slice(0, 3).map((tag) => <Tag key={tag}>{tag}</Tag>)}
                      </div>
                      {/* Meta row */}
                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[var(--outline-variant)]/50">
                        <span className="text-[10px] text-[var(--on-surface-muted)]">
                          {getLastRevised(t) ? `v${getVersion(t)} · ${formatDate(getLastRevised(t))}` : `v${getVersion(t)}`}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleFavorite(t.id); }}
                          className="cursor-pointer p-0.5"
                        >
                          <span className={`material-symbols-outlined text-[15px] ${isFav ? "text-[var(--status-warn)]" : "text-[var(--on-surface-muted)]"}`}>
                            {isFav ? "star" : "star_border"}
                          </span>
                        </button>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ═══ COLUNA DIREITA — Preview Lean ════════════════════════════════ */}
          <aside className="w-[380px] shrink-0 border-l border-[var(--outline-variant)] bg-[var(--surface-low)] overflow-y-auto">
            {!selected ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[260px] px-6">
                <span className="material-symbols-outlined text-4xl text-[var(--primary)]/10 mb-3">assignment_ind</span>
                <p className="text-[12px] font-medium text-[var(--on-surface-variant)] text-center mb-1">Selecione um template</p>
                <p className="text-[11px] text-[var(--on-surface-muted)] text-center leading-relaxed">
                  Visualize quando usar, SOAP e orientações para decidir em segundos.
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {/* Header compacto */}
                <div className="pb-3 border-b border-[var(--outline-variant)]">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h2 className="text-[15px] font-headline font-semibold text-[var(--on-surface)] leading-snug">{getName(selected)}</h2>
                    <StatusBadge status={getStatus(selected)} />
                  </div>
                  <p className="text-[11.5px] text-[var(--on-surface-muted)] leading-relaxed mb-2">{getDescription(selected)}</p>
                  <div className="flex flex-wrap gap-1">
                    <CategoryPill category={getCategory(selected)} />
                    {getTags(selected).map((tag) => <Tag key={tag}>{tag}</Tag>)}
                  </div>
                </div>

                {/* Quando usar — sempre visível, verde */}
                {getWhenToUse(selected) && (
                  <PreviewBlock icon="play_circle" label="Quando usar" color="green">
                    <p className="text-[11.5px] text-[var(--on-surface-variant)] leading-relaxed whitespace-pre-wrap">{getWhenToUse(selected)}</p>
                  </PreviewBlock>
                )}

                {/* Quando não usar — colapsável, secundário */}
                {selected.whenNotToUse && (
                  <div className="rounded-lg border border-[var(--outline-variant)] border-l-[3px] border-l-[var(--status-crit)]/30 bg-[var(--status-crit)]/5 overflow-hidden">
                    <button
                      onClick={() => setShowWhenNotToUse(!showWhenNotToUse)}
                      className="w-full flex items-center justify-between px-3 py-2.5 cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[12px] text-[var(--status-crit)]">block</span>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--status-crit)]">Quando NÃO usar</p>
                      </div>
                      <span className={`material-symbols-outlined text-[14px] text-[var(--on-surface-muted)] transition-transform ${showWhenNotToUse ? "rotate-180" : ""}`}>
                        expand_more
                      </span>
                    </button>
                    {showWhenNotToUse && (
                      <div className="px-3 pb-2.5">
                        <p className="text-[11px] text-[var(--on-surface-variant)] leading-relaxed whitespace-pre-wrap">
                          {selected.whenNotToUse}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Dados mínimos */}
                {(() => {
                  const md = getMinimumData(selected);
                  return md.length > 0 ? (
                    <PreviewBlock icon="checklist" label="Dados mínimos" color="blue">
                      <ul className="space-y-1">
                        {md.map((d, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-info)] shrink-0 mt-1.5" />
                            <span className="text-[11px] text-[var(--on-surface-variant)] leading-relaxed">{d}</span>
                          </li>
                        ))}
                      </ul>
                    </PreviewBlock>
                  ) : null;
                })()}

                {/* SOAP — plano sempre visível, subjetivo colapsável */}
                {(() => {
                  const soap = getSoapPreview(selected);
                  if (!soap) return null;
                  return (
                    <PreviewBlock icon="medical_information" label="SOAP" color="blue">
                      {soap.subjective && (
                        <div className="mb-2.5">
                          <p className="text-[9.5px] font-semibold uppercase tracking-widest text-[var(--on-surface-muted)] mb-1">Subjetivo (S) — perguntas guia</p>
                          <pre className="text-[10.5px] text-[var(--on-surface-variant)] whitespace-pre-wrap leading-relaxed">{soap.subjective}</pre>
                        </div>
                      )}
                      {soap.assessment && (
                        <div className="mb-2.5">
                          <p className="text-[9.5px] font-semibold uppercase tracking-widest text-[var(--on-surface-muted)] mb-1">Avaliação (A)</p>
                          <pre className="text-[10.5px] text-[var(--on-surface-variant)] whitespace-pre-wrap leading-relaxed">{soap.assessment}</pre>
                        </div>
                      )}
                      {soap.plan && (
                        <div>
                          <p className="text-[9.5px] font-semibold uppercase tracking-widest text-[var(--on-surface-muted)] mb-1">Plano (P) — conduta</p>
                          <pre className="text-[10.5px] text-[var(--on-surface-variant)] whitespace-pre-wrap leading-relaxed">{soap.plan}</pre>
                        </div>
                      )}
                    </PreviewBlock>
                  );
                })()}

                {/* Exames */}
                {getExams(selected) && (
                  <PreviewBlock icon="science" label="Exames" color="cyan">
                    <pre className="text-[11px] text-[var(--on-surface-variant)] whitespace-pre-wrap leading-relaxed">{getExams(selected)}</pre>
                  </PreviewBlock>
                )}

                {/* Orientações */}
                {getGuidance(selected) && (
                  <PreviewBlock icon="patient_info" label="Orientações" color="amber">
                    <pre className="text-[11px] text-[var(--on-surface-variant)] whitespace-pre-wrap leading-relaxed">{getGuidance(selected)}</pre>
                  </PreviewBlock>
                )}

                {/* Red Flags */}
                {(() => {
                  const rfs = getRedFlags(selected);
                  return rfs.length > 0 ? (
                    <PreviewBlock icon="warning" label="Red flags" color="red">
                      <ul className="space-y-1">
                        {rfs.map((rf, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-[12px] text-[var(--status-crit)] shrink-0 mt-0.5">warning</span>
                            <span className="text-[11px] text-[var(--on-surface-variant)] leading-relaxed">{rf}</span>
                          </li>
                        ))}
                      </ul>
                    </PreviewBlock>
                  ) : null;
                })()}

                {/* Seguimento */}
                {getFollowup(selected) && (
                  <PreviewBlock icon="calendar_month" label="Seguimento" color="gray">
                    <p className="text-[11px] text-[var(--on-surface-variant)] leading-relaxed whitespace-pre-wrap">{getFollowup(selected)}</p>
                  </PreviewBlock>
                )}

                {/* Fonte + governança compacta */}
                <div className="rounded-lg border border-[var(--outline-variant)] p-3 bg-[var(--surface-lowest)]">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--on-surface-muted)] mb-1">
                    {getSourceUrl(selected) ? (
                      <a href={getSourceUrl(selected)!} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--status-info)]">
                        Fonte ↗
                      </a>
                    ) : (
                      "Fonte"
                    )}
                  </p>
                  <p className="text-[11px] text-[var(--on-surface-variant)] leading-relaxed mb-2">{getSourceLabel(selected)}</p>
                  <div className="flex items-center gap-3 text-[10px] text-[var(--on-surface-muted)]">
                    <span>v{getVersion(selected)}</span>
                    {getLastRevised(selected) && <span>· {formatDate(getLastRevised(selected))}</span>}
                    <span className="ml-auto">
                      <StatusBadge status={getStatus(selected)} />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Footer fixo */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-[var(--outline-variant)] bg-[var(--surface-low)] shrink-0">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg border border-[var(--outline-variant)] text-[12px] font-medium text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <div className="flex items-center gap-2">
            {selected && (
              <>
                <button
                  onClick={() => toggleFavorite(selected.id)}
                  className="px-3 py-2 rounded-lg border border-[var(--outline-variant)] text-[12px] font-medium text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className={`material-symbols-outlined text-[15px] ${favorites.has(selected.id) ? "text-[var(--status-warn)]" : ""}`}>
                    {favorites.has(selected.id) ? "star" : "star_border"}
                  </span>
                  {favorites.has(selected.id) ? "Favorito" : "Favoritar"}
                </button>
                <button
                  onClick={() => applyTemplate(selected)}
                  className="px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white text-[12px] font-semibold hover:bg-[var(--primary-container)] transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Aplicar template
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}