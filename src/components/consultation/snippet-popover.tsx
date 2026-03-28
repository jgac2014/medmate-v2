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
        className="w-[22px] h-[22px] rounded-md border border-border-subtle flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-2 hover:border-text-tertiary transition-colors cursor-pointer text-[11px]"
      >
        ★
      </button>

      {/* Popover panel */}
      {open && (
        <div className="absolute right-0 top-full mt-1 z-[80] w-[280px] bg-bg-1 border border-border-subtle rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border-subtle">
            <p className="text-[11.5px] font-semibold text-text-primary">Favoritos</p>
            <div className="flex gap-1">
              {view === "list" && (
                <button
                  onClick={() => setView("create")}
                  className="text-[10px] text-text-tertiary hover:text-accent transition-colors cursor-pointer px-1.5 py-0.5 rounded border border-border-subtle hover:border-accent"
                >
                  + Novo
                </button>
              )}
              {view === "create" && (
                <button
                  onClick={() => setView("list")}
                  className="text-[10px] text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
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
                <p className="text-[11px] text-text-tertiary text-center py-6">Carregando…</p>
              ) : snippets.length === 0 ? (
                <div className="px-3 py-6 text-center">
                  <p className="text-[11px] text-text-secondary mb-1">Nenhum favorito ainda.</p>
                  <p className="text-[10.5px] text-text-tertiary">Clique em "+ Novo" para criar.</p>
                </div>
              ) : (
                snippets.map((s) => (
                  <div
                    key={s.id}
                    className="group flex items-start gap-2 px-3 py-2.5 hover:bg-bg-2/60 transition-colors border-b border-border-subtle/50 last:border-b-0"
                  >
                    <button
                      onClick={() => handleInsert(s)}
                      className="flex-1 text-left min-w-0 cursor-pointer"
                    >
                      <p className="text-[11.5px] font-medium text-text-primary leading-snug truncate">
                        {s.title}
                      </p>
                      <p className="text-[10.5px] text-text-tertiary mt-0.5 leading-snug line-clamp-2">
                        {s.body}
                      </p>
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      title="Excluir"
                      className="shrink-0 w-5 h-5 flex items-center justify-center text-text-tertiary hover:text-status-crit transition-colors cursor-pointer opacity-0 group-hover:opacity-100 text-[13px] mt-0.5"
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
                className="w-full px-2 py-1.5 text-[11.5px] border border-border-subtle rounded-md bg-bg-2 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
              />
              <textarea
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                placeholder="Texto do favorito…"
                rows={4}
                className="w-full px-2 py-1.5 text-[11.5px] border border-border-subtle rounded-md bg-bg-2 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent resize-none leading-relaxed"
              />
              <button
                onClick={handleCreate}
                disabled={saving || !newTitle.trim() || !newBody.trim()}
                className="w-full py-1.5 rounded-md bg-accent text-black text-[11.5px] font-semibold hover:bg-accent/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
