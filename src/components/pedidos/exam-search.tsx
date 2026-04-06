import type { LabExam } from "@/lib/pedidos/types";
import { searchExams } from "@/lib/pedidos/exam-db";
import { useState, useRef, useCallback, useEffect } from "react";

interface ExamSearchProps {
  onSelect: (exam: LabExam) => void;
}

export function ExamSearch({ onSelect }: ExamSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LabExam[]>([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    const found = searchExams(q);
    setResults(found);
    setActiveIdx(-1);
  }, []);

  const handleSelect = useCallback(
    (exam: LabExam) => {
      onSelect(exam);
      setQuery("");
      setResults([]);
      setActiveIdx(-1);
      inputRef.current?.focus();
    },
    [onSelect]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!results.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, -1));
      } else if (e.key === "Enter" && activeIdx >= 0) {
        e.preventDefault();
        handleSelect(results[activeIdx]);
      } else if (e.key === "Escape") {
        setResults([]);
        setQuery("");
      }
    },
    [results, activeIdx, handleSelect]
  );

  useEffect(() => {
    if (activeIdx >= 0 && listRef.current) {
      const item = listRef.current.children[activeIdx] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIdx]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target as Node) &&
        listRef.current &&
        !listRef.current.contains(e.target as Node)
      ) {
        setResults([]);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-surface-lowest border border-outline-variant/50 rounded-xl px-3 py-2.5 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
        <svg className="w-4 h-4 text-on-surface-muted shrink-0" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10.5 10.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Buscar exame..."
          className="flex-1 bg-transparent text-[13px] text-on-surface placeholder:text-on-surface-muted outline-none"
          autoComplete="off"
          spellCheck={false}
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setResults([]); }}
            className="text-on-surface-muted hover:text-on-surface transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
              <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
        <div className="hidden sm:flex items-center gap-1 shrink-0">
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-surface-container rounded border border-outline-variant/40 text-on-surface-muted">↑↓</kbd>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-surface-container rounded border border-outline-variant/40 text-on-surface-muted">Enter</kbd>
        </div>
      </div>

      {results.length > 0 && (
        <div
          ref={listRef}
          className="absolute top-full left-0 right-0 mt-1.5 bg-surface-lowest border border-outline-variant/30 rounded-xl shadow-[0_8px_30px_rgba(23,28,31,0.12)] overflow-hidden z-20 max-h-72 overflow-y-auto"
        >
          {results.map((exam, idx) => (
            <button
              key={exam.id}
              onClick={() => handleSelect(exam)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer group ${
                idx === activeIdx
                  ? "bg-primary/8"
                  : "hover:bg-surface-container"
              } ${idx > 0 ? "border-t border-outline-variant/20" : ""}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-on-surface truncate">{exam.name}</span>
                </div>
                <p className="text-[11px] text-on-surface-muted mt-0.5">
                  {exam.description}
                  {exam.instructions && (
                    <span className="ml-1 text-on-surface-muted/70">· {exam.instructions}</span>
                  )}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {query && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-surface-lowest border border-outline-variant/30 rounded-xl shadow-md py-4 px-4 z-20">
          <p className="text-[13px] text-on-surface-muted text-center">
            Nenhum resultado para <span className="font-medium text-on-surface">&ldquo;{query}&rdquo;</span>
          </p>
        </div>
      )}
    </div>
  );
}
