"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { listSnippets, createSnippet, deleteSnippet } from "@/lib/supabase/snippets";
import { showToast } from "@/components/ui/toast";
import type { UserSnippet, SnippetCategory } from "@/types";

interface SnippetPopoverProps {
  category: SnippetCategory;
  onInsert: (text: string) => void;
}

export function SnippetPopover({ category, onInsert }: SnippetPopoverProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"list" | "create">("list");
  const [userId, setUserId] = useState<string | null>(null);
  const [snippets, setSnippets] = useState<UserSnippet[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [saving, setSaving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => {
        if (user) setUserId(user.id);
      });
  }, []);

  useEffect(() => {
    if (!open || !userId) return;
    setLoading(true);
    listSnippets(userId, category)
      .then(setSnippets)
      .catch(() => showToast("Erro ao carregar favoritos", "error"))
      .finally(() => setLoading(false));
  }, [open, userId, category]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function handleInsert(snippet: UserSnippet) {
    onInsert(snippet.body);
    setOpen(false);
    showToast(`"${snippet.title}" inserido`, "success");
  }

  async function handleCreate() {
    if (!userId || !newTitle.trim() || !newBody.trim()) return;
    setSaving(true);
    try {
      const created = await createSnippet(userId, {
        category,
        title: newTitle.trim(),
        body: newBody.trim(),
      });
      setSnippets((prev) => [...prev, created]);
      setNewTitle("");
      setNewBody("");
      setView("list");
      showToast("Favorito salvo", "success");
    } catch {
      showToast("Erro ao salvar favorito", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteSnippet(id);
      setSnippets((prev) => prev.filter((s) => s.id !== id));
    } catch {
      showToast("Erro ao excluir favorito", "error");
    }
  }

  function handleToggle() {
    setOpen((v) => !v);
    setView("list");
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        onClick={handleToggle}
        title="Favoritos"
        className="w-[22px] h-[22px] rounded-md border border-outline-variant flex items-center justify-center text-on-surface-muted hover:text-on-surface hover:bg-surface-container hover:border-text-tertiary transition-colors cursor-pointer text-[11px]"
      >
        ★
      </button>

      {/* Popover panel */}
      {open && (
        <div className="absolute right-0 top-full mt-1 z-[80] w-[280px] bg-surface-low border border-outline-variant rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-outline-variant">
            <p className="text-[11.5px] font-semibold text-on-surface">Favoritos</p>
            <div className="flex gap-1">
              {view === "list" && (
                <button
                  onClick={() => setView("create")}
                  className="text-[10px] text-on-surface-muted hover:text-primary transition-colors cursor-pointer px-1.5 py-0.5 rounded border border-outline-variant hover:border-primary"
                >
                  + Novo
                </button>
              )}
              {view === "create" && (
                <button
                  onClick={() => setView("list")}
                  className="text-[10px] text-on-surface-muted hover:text-on-surface transition-colors cursor-pointer"
                >
                  ← Voltar
                </button>
              )}
            </div>
          </div>

          {/* List view */}
          {view === "list" && (
            <div className="overflow-y-auto max-h-[240px]">
              {loading ? (
                <p className="text-[11px] text-on-surface-muted text-center py-6">Carregando…</p>
              ) : snippets.length === 0 ? (
                <div className="px-3 py-6 text-center">
                  <p className="text-[11px] text-on-surface-variant mb-1">Nenhum favorito ainda.</p>
                  <p className="text-[10.5px] text-on-surface-muted">Clique em &quot;+ Novo&quot; para criar.</p>
                </div>
              ) : (
                snippets.map((s) => (
                  <div
                    key={s.id}
                    className="group flex items-start gap-2 px-3 py-2.5 hover:bg-surface-container/60 transition-colors border-b border-outline-variant/50 last:border-b-0"
                  >
                    <button
                      onClick={() => handleInsert(s)}
                      className="flex-1 text-left min-w-0 cursor-pointer"
                    >
                      <p className="text-[11.5px] font-medium text-on-surface leading-snug truncate">
                        {s.title}
                      </p>
                      <p className="text-[10.5px] text-on-surface-muted mt-0.5 leading-snug line-clamp-2">
                        {s.body}
                      </p>
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      title="Excluir"
                      className="shrink-0 w-5 h-5 flex items-center justify-center text-on-surface-muted hover:text-status-crit transition-colors cursor-pointer opacity-0 group-hover:opacity-100 text-[13px] mt-0.5"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Create view */}
          {view === "create" && (
            <div className="px-3 py-3 space-y-2">
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Título (ex: Metformina padrão)"
                className="w-full px-2 py-1.5 text-[11.5px] border border-outline-variant rounded-md bg-surface-container text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:border-primary"
              />
              <textarea
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                placeholder="Texto do favorito…"
                rows={4}
                className="w-full px-2 py-1.5 text-[11.5px] border border-outline-variant rounded-md bg-surface-container text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:border-primary resize-none leading-relaxed"
              />
              <button
                onClick={handleCreate}
                disabled={saving || !newTitle.trim() || !newBody.trim()}
                className="w-full py-1.5 rounded-md bg-primary text-black text-[11.5px] font-semibold hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Salvando…" : "Salvar favorito"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
