"use client";

import { useState } from "react";
import { useConsultationStore } from "@/stores/consultation-store";

export function FollowupPanel() {
  const {
    followupItems,
    addFollowupItem,
    toggleFollowupItem,
    removeFollowupItem,
  } = useConsultationStore();
  const [newText, setNewText] = useState("");

  function handleAdd() {
    const text = newText.trim();
    if (!text) return;
    addFollowupItem(text);
    setNewText("");
  }

  const pending = followupItems.filter((i) => !i.completed);
  const done = followupItems.filter((i) => i.completed);

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Adicionar para próximo retorno..."
          className="flex-1 bg-[var(--surface-container)] border border-[var(--outline-variant)] rounded-lg px-3 py-1.5 text-[12px] text-[var(--on-surface)] placeholder:text-[var(--on-surface-muted)] focus:outline-none focus:border-primary transition-colors"
        />
        <button
          onClick={handleAdd}
          disabled={!newText.trim()}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-[var(--outline-variant)] text-[var(--on-surface-muted)] hover:text-[var(--on-surface)] hover:bg-[var(--surface-container)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-base leading-none cursor-pointer"
        >
          +
        </button>
      </div>

      {pending.length > 0 && (
        <ul className="space-y-1">
          {pending.map((item) => (
            <li key={item.id} className="flex items-start gap-2 group">
              <input
                type="checkbox"
                checked={false}
                onChange={() => toggleFollowupItem(item.id)}
                className="mt-0.5 accent-accent cursor-pointer"
              />
              <span className="flex-1 text-[12px] text-[var(--on-surface-variant)] leading-relaxed">
                {item.text}
              </span>
              <button
                onClick={() => removeFollowupItem(item.id)}
                className="opacity-0 group-hover:opacity-100 text-[var(--on-surface-muted)] hover:text-status-crit transition-all text-sm leading-none cursor-pointer"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {done.length > 0 && (
        <div className="pt-1">
          <p className="text-[10px] text-[var(--on-surface-muted)] mb-1 uppercase tracking-wide">
            Resolvidos nesta consulta
          </p>
          <ul className="space-y-1">
            {done.map((item) => (
              <li key={item.id} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={true}
                  onChange={() => toggleFollowupItem(item.id)}
                  className="mt-0.5 accent-accent cursor-pointer"
                />
                <span className="flex-1 text-[12px] text-[var(--on-surface-muted)] line-through leading-relaxed">
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {followupItems.length === 0 && (
        <p className="text-[11px] text-[var(--on-surface-muted)]">
          Nenhuma pendência registrada.
        </p>
      )}
    </div>
  );
}
