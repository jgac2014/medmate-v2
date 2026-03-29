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
          className="flex-1 bg-bg-2 border border-border-subtle rounded-lg px-3 py-1.5 text-[12px] text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent/50 transition-colors"
        />
        <button
          onClick={handleAdd}
          disabled={!newText.trim()}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-border-subtle text-text-tertiary hover:text-text-primary hover:bg-bg-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-base leading-none cursor-pointer"
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
              <span className="flex-1 text-[12px] text-text-secondary leading-relaxed">
                {item.text}
              </span>
              <button
                onClick={() => removeFollowupItem(item.id)}
                className="opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-status-crit transition-all text-sm leading-none cursor-pointer"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {done.length > 0 && (
        <div className="pt-1">
          <p className="text-[10px] text-text-tertiary mb-1 uppercase tracking-wide">
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
                <span className="flex-1 text-[12px] text-text-tertiary line-through leading-relaxed">
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {followupItems.length === 0 && (
        <p className="text-[11px] text-text-tertiary">
          Nenhuma pendência registrada.
        </p>
      )}
    </div>
  );
}
