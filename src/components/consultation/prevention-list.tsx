"use client";

import { useState } from "react";
import { useConsultationStore } from "@/stores/consultation-store";
import { SectionHeader } from "@/components/ui/section-header";
import { CheckboxItem } from "@/components/ui/checkbox-item";
import { PREVENTION_CATEGORIES } from "@/lib/constants";
import { getSuggestedPreventions, parseAge } from "@/lib/clinical-rules";
import { isPSA, isTriageItem, isContextualExclude } from "@/lib/output-labels";
import type { PatientRuleInput } from "@/types";

/** Badge para categoria de prevenção padrão APS/SUS */
function PadraoBadge() {
  return (
    <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded border bg-[var(--primary)]/8 border-[var(--primary)]/20 text-[var(--primary)] shrink-0">
      <svg className="w-2.5 h-2.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 8l3.5 3.5L13 4.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Padrão SUS
    </span>
  );
}

/** Badge para categoria contextual */
function ContextualBadge() {
  return (
    <span className="inline-flex items-center gap-0.5 text-[9px] font-medium px-1.5 py-0.5 rounded border border-[var(--outline-variant)] text-[var(--on-surface-muted)] bg-[var(--surface-container)] shrink-0">
      Contexto
    </span>
  );
}

/** Badge para categoria decisão compartilhada */
function DecisaoBadge() {
  return (
    <span className="inline-flex items-center gap-0.5 text-[9px] font-medium px-1.5 py-0.5 rounded border border-[var(--outline-variant)] text-[var(--status-warn)] bg-[var(--status-warn)]/8 shrink-0">
      <svg className="w-2.5 h-2.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 3v5M8 11v.5" strokeLinecap="round" />
        <circle cx="8" cy="8" r="6.5" />
      </svg>
      Decisão comp.
    </span>
  );
}

/** Badge para núcleo triagem principal */
function NucleoBadge() {
  return (
    <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded border bg-[var(--primary)] text-[var(--on-primary)] border-[var(--primary)]/40 shrink-0">
      Núcleo SUS
    </span>
  );
}

type Category = keyof typeof PREVENTION_CATEGORIES;

interface CategorySectionProps {
  category: Category;
  items: string[];
  checked: string[];
  suggestions: string[];
  onToggle: (item: string) => void;
  patientAge: number | null;
  patientGender: string;
}

function CategorySection({
  category,
  items,
  checked,
  suggestions,
  onToggle,
  patientAge,
  patientGender,
}: CategorySectionProps) {
  // Itens deste category que fazem sentido para este perfil (PSA filtrado)
  const profileRelevant = items.filter((item) => {
    if (isPSA(item)) return false;
    return true;
  });

  const hasItems = profileRelevant.length > 0;
  if (!hasItems) return null;

  function renderBadge() {
    if (category === "padrao") return <PadraoBadge />;
    if (category === "contextual") return <ContextualBadge />;
    if (category === "decisao") return <DecisaoBadge />;
    if (category === "triagem") return <NucleoBadge />;
    return null;
  }

  function categoryLabel() {
    if (category === "padrao") return "Prevenção padrão APS/SUS";
    if (category === "contextual") return "Contextual por risco / oportunidade";
    if (category === "decisao") return "Decisão compartilhada";
    if (category === "triagem") return "Avaliação de saúde mental / cognição";
    return category;
  }

  function categoryNote() {
    if (category === "contextual") return "Aplicar conforme contexto clínico — não universal";
    if (category === "decisao") return "Discutir com o paciente — sem rastreamento populacional";
    if (category === "triagem") return "Usar escala na aba Triagens Clínicas";
    return null;
  }

  return (
    <div className="mb-3">
      {/* Header da categoria */}
      <div className="flex items-center gap-2 mb-1.5">
        {renderBadge()}
        <p className="text-[10px] font-semibold text-[var(--on-surface)] tracking-wide uppercase">
          {categoryLabel()}
        </p>
      </div>
      {categoryNote() && (
        <p className="text-[9.5px] text-[var(--on-surface-muted)] italic mb-1.5 ml-0.5">
          {categoryNote()}
        </p>
      )}

      {/* Itens da categoria */}
      <div className="space-y-0.5 pl-0.5">
        {profileRelevant.map((item) => (
          <CheckboxItem
            key={item}
            label={item}
            checked={checked.includes(item)}
            onChange={() => onToggle(item)}
          />
        ))}
      </div>
    </div>
  );
}

export function PreventionList() {
  const { preventions, togglePrevention, patient, problems } = useConsultationStore();
  const [showAll, setShowAll] = useState(false);

  const ruleInput: PatientRuleInput = {
    age: parseAge(patient.age),
    gender: patient.gender,
    problems,
    preventions,
  };

  // Todas as sugestões aplicáveis ao perfil (PSA filtrado)
  const suggestions = getSuggestedPreventions(ruleInput).filter(
    (s) => !isPSA(s.preventionLabel)
  );

  // Itens checked mas que não são mais sugestões (satisfeitos)
  // PSA, itens de triagem e contextuais puros ficam de fora —tracked via TRIAGENS/output
  const satisfied = preventions
    .filter((p) => !isPSA(p) && !isTriageItem(p) && !isContextualExclude(p))
    .filter((p) => !suggestions.some((s) => s.preventionLabel === p));

  // Itens que não se aplicam ao perfil (PSA filtrado)
  const irrelevant = (
    Object.values(PREVENTION_CATEGORIES).flat() as string[]
  ).filter(
    (p) => !isPSA(p) &&
      !preventions.includes(p) &&
      !suggestions.some((s) => s.preventionLabel === p)
  );

  const patientAge = parseAge(patient.age);

  return (
    <div className="mb-3.5">
      <SectionHeader label="Prevenções" color="green" />

      {/* ── Sugestões contextuais ───────────────────────────────────────────── */}
      {suggestions.length > 0 && (
        <div className="mb-3 pb-3 border-b border-[var(--outline-variant)]/40">
          <p className="text-[9.5px] font-semibold text-[var(--primary)] uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0" />
            Considerar nesta consulta
          </p>
          <div className="flex flex-col gap-1">
            {suggestions.slice(0, 6).map((rule) => (
              <button
                key={rule.id}
                onClick={() => togglePrevention(rule.preventionLabel)}
                className="flex items-start gap-2 text-left group cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-status-warn mt-1.5 shrink-0 group-hover:bg-primary transition-colors" />
                <div>
                  <p className="text-[12px] text-on-surface-variant group-hover:text-on-surface transition-colors leading-snug">
                    {rule.preventionLabel}
                  </p>
                  <p className="text-[10px] text-on-surface-muted leading-relaxed mt-0.5">
                    {rule.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Categorias de prevenção ─────────────────────────────────────────── */}
      {(Object.keys(PREVENTION_CATEGORIES) as Category[]).map((cat) => (
        <CategorySection
          key={cat}
          category={cat}
          // Filtrar itens deste category: relevantes ou já marcados
          items={(
            PREVENTION_CATEGORIES[cat] as readonly string[]
          ).filter(
            (item) =>
              suggestions.some((s) => s.preventionLabel === item) ||
              preventions.includes(item)
          )}
          checked={preventions}
          suggestions={suggestions.map((s) => s.preventionLabel)}
          onToggle={togglePrevention}
          patientAge={patientAge}
          patientGender={patient.gender}
        />
      ))}

      {/* ── Itens satisfeitos (marcados mas não mais sugeridos) ─────────────── */}
      {satisfied.length > 0 && (
        <div className="mt-2 pt-2 border-t border-[var(--outline-variant)]/40">
          <p className="text-[9.5px] font-semibold text-[var(--status-ok)] uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 8l3.5 3.5L13 4.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Em dia
          </p>
          <div className="space-y-0.5 pl-0.5">
            {satisfied.map((item) => (
              <CheckboxItem
                key={item}
                label={item}
                checked={true}
                onChange={() => togglePrevention(item)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Itens não aplicáveis ────────────────────────────────────────────── */}
      {irrelevant.length > 0 && (
        <div className="mt-1">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="text-[10px] text-on-surface-muted hover:text-on-surface flex items-center gap-1.5 transition-colors cursor-pointer py-1"
          >
            <svg
              className={`w-2.5 h-2.5 transition-transform duration-150 ${showAll ? "rotate-90" : ""}`}
              viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"
            >
              <path d="M3 2.5L7 5L3 7.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {showAll ? "Ocultar" : `${irrelevant.length} não indicado${irrelevant.length > 1 ? "s" : ""} para este perfil`}
          </button>

          {showAll && (
            <div className="mt-1 pl-0.5">
              {irrelevant.map((p) => (
                <div key={p} className="flex items-center gap-2.5 py-0.5 opacity-40">
                  <svg className="w-3 h-3 text-on-surface-muted shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="8" cy="8" r="6.5" />
                    <path d="M5.5 8h5M8 5.5v5" strokeLinecap="round" opacity="0.4" />
                  </svg>
                  <span className="text-[11px] text-on-surface-muted line-through">{p}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Nota: colorretal ocultado ───────────────────────────────────────── */}
      <p className="text-[9px] text-on-surface-muted italic mt-2 px-1">
        Rastreamento colorretal: ocultado por enquanto — diretriz nacional em definição.
        Implementar conforme protocolo local ou expansão futura do MS.
      </p>
    </div>
  );
}
