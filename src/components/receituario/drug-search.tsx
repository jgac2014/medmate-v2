"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { searchDrugs } from "@/lib/receituario/drug-db";
import type { Drug } from "@/lib/receituario/types";

interface DrugSearchProps {
  onSelect: (drug: Drug) => void;
}

const FLAG_STYLES: Record<string, string> = {
  ATB: "bg-amber-100 text-amber-800 border-amber-200",
  A1: "bg-red-100 text-red-800 border-red-200",
  A2: "bg-red-100 text-red-800 border-red-200",
  A3: "bg-red-100 text-red-800 border-red-200",
  B1: "bg-purple-100 text-purple-800 border-purple-200",
  B2: "bg-purple-100 text-purple-800 border-purple-200",
  C1: "bg-blue-100 text-blue-800 border-blue-200",
  C2: "bg-blue-100 text-blue-800 border-blue-200",
  C3: "bg-blue-100 text-blue-800 border-blue-200",
  C4: "bg-blue-100 text-blue-800 border-blue-200",
  C5: "bg-blue-100 text-blue-800 border-blue-200",
};

export function DrugSearch({ onSelect }: DrugSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Drug[]>([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    const found = searchDrugs(q);
    setResults(found);
    setActiveIdx(-1);
  }, []);

  const handleSelect = useCallback(
    (drug: Drug) => {
      onSelect(drug);
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

  // Scroll active item into view
  useEffect(() => {
    if (activeIdx >= 0 && listRef.current) {
      const item = listRef.current.children[activeIdx] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIdx]);

  // Close on outside click
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
          placeholder="Buscar medicamento..."
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
          {results.map((drug, idx) => (
            <button
              key={drug.id}
              onClick={() => handleSelect(drug)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer group ${
                idx === activeIdx
                  ? "bg-primary/8"
                  : "hover:bg-surface-container"
              } ${idx > 0 ? "border-t border-outline-variant/20" : ""}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-on-surface truncate">{drug.name}</span>
                  {drug.flag && (
                    <span
                      className={`shrink-0 px-1.5 py-0.5 text-[10px] font-semibold rounded border ${
                        FLAG_STYLES[drug.flag] ?? "bg-surface-container text-on-surface-muted border-outline-variant/40"
                      }`}
                    >
                      {drug.flag}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-on-surface-muted mt-0.5">
                  {drug.form} · {drug.manufacturer}
                </p>
              </div>
              <div className="shrink-0">
                <span className={`text-[11px] font-medium ${
                  drug.type === "ctrl" ? "text-purple-700" :
                  drug.type === "atb" ? "text-amber-700" :
                  "text-on-surface-muted"
                }`}>
                  {drug.rxType === "Notificação Branca" ? "Ctrl Esp." :
                   drug.rxType === "Notificação Especial Amarela" ? "Ntf Amarela" :
                   "Simples"}
                </span>
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
