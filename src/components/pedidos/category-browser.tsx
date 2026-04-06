import type { LabExam } from "@/lib/pedidos/types";
import { getExamsByCategory, EXAM_CATEGORIES } from "@/lib/pedidos/exam-db";
import { useState, useMemo } from "react";

interface CategoryBrowserProps {
  onSelect: (exam: LabExam) => void;
  selectedIds: Set<string>;
}

export function CategoryBrowser({ onSelect, selectedIds }: CategoryBrowserProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const examsByCategory = useMemo(() => {
    if (!activeCategory) return [];
    return getExamsByCategory(activeCategory);
  }, [activeCategory]);

  const activeCatObj = EXAM_CATEGORIES.find((c) => c.key === activeCategory);

  return (
    <div className="flex gap-4">
      {/* Category sidebar */}
      <div className="w-48 shrink-0">
        <div className="bg-surface-lowest border border-outline-variant/30 rounded-xl overflow-hidden">
          <div className="px-3 py-2.5 border-b border-outline-variant/20">
            <span className="text-[11px] font-semibold text-on-surface-muted uppercase tracking-wider">Categorias</span>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {EXAM_CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key === activeCategory ? null : cat.key)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left text-[12px] transition-colors cursor-pointer ${
                  activeCategory === cat.key
                    ? "bg-primary/8 text-primary font-medium"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                <span className="text-sm">{cat.icon}</span>
                <span className="truncate">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Exam list */}
      <div className="flex-1 min-w-0">
        {activeCategory ? (
          <div className="bg-surface-lowest border border-outline-variant/30 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-outline-variant/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>{activeCatObj?.icon}</span>
                <span className="text-[13px] font-medium text-on-surface">{activeCatObj?.label}</span>
              </div>
              <span className="text-[11px] text-on-surface-muted">{examsByCategory.length} exames</span>
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-outline-variant/10">
              {examsByCategory.map((exam) => {
                const isSelected = selectedIds.has(exam.id);
                return (
                  <button
                    key={exam.id}
                    onClick={() => !isSelected && onSelect(exam)}
                    disabled={isSelected}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-status-ok/8 opacity-60 cursor-default"
                        : "hover:bg-surface-container"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-[13px] font-medium text-on-surface">{exam.name}</span>
                      <p className="text-[11px] text-on-surface-muted mt-0.5">{exam.description}</p>
                    </div>
                    {isSelected ? (
                      <span className="text-[11px] font-medium text-status-ok shrink-0">Adicionado</span>
                    ) : (
                      <svg className="w-4 h-4 text-on-surface-muted shrink-0" viewBox="0 0 16 16" fill="none">
                        <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 text-on-surface-muted text-[13px]">
            Selecione uma categoria para ver os exames
          </div>
        )}
      </div>
    </div>
  );
}
