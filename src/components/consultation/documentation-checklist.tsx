"use client";

import { useConsultationStore } from "@/stores/consultation-store";

interface CheckItem {
  label: string;
  done: boolean;
  targetId: string;
  sectionId: string;
}

function buildCheckItems(
  soap: ReturnType<typeof useConsultationStore.getState>["soap"],
  vitals: ReturnType<typeof useConsultationStore.getState>["vitals"],
  problems: ReturnType<typeof useConsultationStore.getState>["problems"],
  followupItems: ReturnType<typeof useConsultationStore.getState>["followupItems"],
): CheckItem[] {
  return [
    {
      label: "SOAP preenchido",
      done: !!(soap.subjective?.trim() && soap.assessment?.trim() && soap.plan?.trim()),
      targetId: "soap-subjective",
      sectionId: "section-consulta",
    },
    {
      label: "Sinais vitais registrados",
      done: !!(vitals.pas && vitals.pad),
      targetId: "section-exames",
      sectionId: "section-exames",
    },
    {
      label: "Problema / CID identificado",
      done: problems.length > 0,
      targetId: "problems-other",
      sectionId: "section-problemas",
    },
    {
      label: "Plano de retorno definido",
      done: (followupItems ?? []).length > 0,
      targetId: "section-retorno",
      sectionId: "section-retorno",
    },
  ];
}

export function getDocumentationCompletion(): {
  doneCount: number;
  total: number;
  pct: number;
  missing: string[];
} {
  const { soap, vitals, problems, followupItems } = useConsultationStore.getState();
  const items = buildCheckItems(soap, vitals, problems, followupItems);
  const doneCount = items.filter((i) => i.done).length;
  return {
    doneCount,
    total: items.length,
    pct: Math.round((doneCount / items.length) * 100),
    missing: items.filter((i) => !i.done).map((i) => i.label),
  };
}

/**
 * Opens all <details> ancestors of `element` so they don't block visibility.
 */
function openAncestorDetails(element: Element | null) {
  if (!element) return;
  openAncestorDetails(element.parentElement);
  if (element.tagName === "DETAILS" && !(element as HTMLDetailsElement).open) {
    (element as HTMLDetailsElement).open = true;
  }
}

/**
 * Highlights an element with a ring animation, then focuses it.
 */
function highlightAndFocus(el: Element | null) {
  if (!el) return;
  el.classList.add("nav-highlight");
  el.addEventListener("animationend", () => el.classList.remove("nav-highlight"), { once: true });
  const input = el.querySelector<HTMLElement>(
    "input:not([readonly]), textarea:not([readonly]), [contenteditable]"
  );
  if (input) {
    setTimeout(() => input.focus(), 100);
  }
}

/**
 * Determines the most important missing field within a checklist item
 * and navigates there with a visual highlight.
 */
function navigateToMissing(item: CheckItem) {
  const soapData = useConsultationStore.getState().soap;
  const vitalsData = useConsultationStore.getState().vitals;

  let targetEl: Element | null = null;

  if (item.label === "SOAP preenchido") {
    // Prioridade: S → A → P → O
    const order = ["subjective", "assessment", "plan", "objective"] as const;
    for (const key of order) {
      if (!soapData[key]?.trim()) {
        targetEl = document.getElementById(`soap-${key}`);
        if (targetEl) break;
      }
    }
    if (!targetEl) targetEl = document.getElementById("section-consulta");
  } else if (item.label === "Sinais vitais registrados") {
    // Prioridade: PAS → PAD
    if (!vitalsData.pas) {
      targetEl = document.getElementById("vital-pas");
    } else if (!vitalsData.pad) {
      targetEl = document.getElementById("vital-pad");
    }
    if (!targetEl) targetEl = document.getElementById("section-exames");
  } else if (item.label === "Problema / CID identificado") {
    targetEl = document.getElementById("problems-other");
    if (!targetEl) targetEl = document.getElementById("section-problemas");
  } else {
    targetEl = document.getElementById(item.targetId);
  }

  if (!targetEl) return;

  // 1. Open any closed <details> ancestors
  openAncestorDetails(targetEl);

  // 2. Scroll to section with offset for sticky header
  const sectionId = item.sectionId;
  const sectionEl = document.getElementById(sectionId);
  if (sectionEl) {
    sectionEl.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // 3. Highlight + focus
  setTimeout(() => highlightAndFocus(targetEl), 300);
}

export function DocumentationChecklist() {
  const soap = useConsultationStore((s) => s.soap);
  const vitals = useConsultationStore((s) => s.vitals);
  const problems = useConsultationStore((s) => s.problems);
  const followupItems = useConsultationStore((s) => s.followupItems);

  const items = buildCheckItems(soap, vitals, problems, followupItems);
  const doneCount = items.filter((i) => i.done).length;
  const pct = Math.round((doneCount / items.length) * 100);

  const missing = items.filter((i) => !i.done);
  const isComplete = pct === 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-semibold text-[var(--on-surface-muted)] uppercase tracking-wide">
          Documentação
        </span>
        <div className="flex items-center gap-1.5">
          {isComplete ? (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[var(--status-ok)]/10 text-[var(--status-ok)] text-[10px] font-bold">
              <span>✓</span> Completo
            </span>
          ) : (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[var(--status-warn)]/10 text-[var(--status-warn)] text-[10px] font-bold">
              {missing.length} pendência{missing.length > 1 ? "s" : ""}
            </span>
          )}
          <span className={`text-[12px] font-black ${isComplete ? "text-[var(--status-ok)]" : "text-[var(--primary)]"}`}>
            {pct}%
          </span>
        </div>
      </div>
      <div className="w-full bg-[var(--surface-high)] h-1.5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            backgroundColor: pct === 100
              ? "var(--status-ok)"
              : pct >= 50
              ? "var(--primary)"
              : "var(--status-warn)",
          }}
        />
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5">
            <span
              className={`w-4 h-4 shrink-0 rounded-full flex items-center justify-center transition-all ${
                item.done
                  ? "bg-[var(--status-ok)]"
                  : "border-2 border-[var(--outline-variant)]"
              }`}
            >
              {item.done && (
                <span className="text-white text-[9px] font-black">✓</span>
              )}
            </span>
            {item.done ? (
              <span className="text-[11px] text-[var(--on-surface)] font-medium">
                {item.label}
              </span>
            ) : (
              <button
                onClick={() => navigateToMissing(item)}
                className="text-[11px] text-[var(--on-surface-muted)] hover:text-[var(--primary)] hover:underline text-left flex items-center gap-1 cursor-pointer transition-colors"
              >
                {item.label}
                <span className="text-[9px] opacity-60">→</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
