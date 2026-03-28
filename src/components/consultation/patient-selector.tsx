"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { searchPatients, createPatient } from "@/lib/supabase/patients";
import type { Patient } from "@/types";

function ageFromBirthDate(birthDate: string): string {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return `${age} anos`;
}

interface PatientSelectorProps {
  open: boolean;
  onSelect: (patient: Patient) => void;
  onClose: () => void;
}

type View = "search" | "create";

export function PatientSelector({ open, onSelect, onClose }: PatientSelectorProps) {
  const [view, setView] = useState<View>("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Patient[]>([]);
  const [searching, setSearching] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Create form state
  const [newName, setNewName] = useState("");
  const [newBirthDate, setNewBirthDate] = useState("");
  const [newGender, setNewGender] = useState("");
  const [newRace, setNewRace] = useState("");
  const [newCpf, setNewCpf] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  const runSearch = useCallback(async (q: string, uid: string) => {
    setSearching(true);
    try {
      const patients = await searchPatients(uid, q);
      setResults(patients);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    if (!userId || !open) return;
    clearTimeout(debounceRef.current);
    if (query.length < 2) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(() => runSearch(query, userId), 300);
    return () => clearTimeout(debounceRef.current);
  }, [query, userId, open, runSearch]);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setView("search");
      setQuery("");
      setResults([]);
      setNewName("");
      setNewBirthDate("");
      setNewGender("");
      setNewRace("");
      setNewCpf("");
      setCreateError("");
    }
  }, [open]);

  async function handleCreate() {
    if (!userId || !newName.trim()) return;
    setCreating(true);
    setCreateError("");
    try {
      const patient = await createPatient(userId, {
        name: newName.trim(),
        birth_date: newBirthDate || null,
        gender: newGender || null,
        race: newRace || null,
        cpf: newCpf || null,
        phone: null,
      });
      onSelect(patient);
    } catch {
      setCreateError("Erro ao criar paciente. Tente novamente.");
    } finally {
      setCreating(false);
    }
  }

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-[60] w-[480px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 bg-bg-1 border border-border-subtle rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
          <div>
            <p className="text-[13px] font-semibold text-text-primary">Selecionar paciente</p>
            <p className="text-[11px] text-text-tertiary mt-0.5">Nova consulta</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md border border-border-subtle flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-2 transition-colors cursor-pointer text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border-subtle">
          {(["search", "create"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`flex-1 py-2.5 text-[12px] font-medium transition-colors cursor-pointer ${
                view === v
                  ? "text-text-primary border-b-2 border-accent"
                  : "text-text-tertiary hover:text-text-secondary"
              }`}
            >
              {v === "search" ? "Buscar existente" : "Novo paciente"}
            </button>
          ))}
        </div>

        <div className="p-5">
          {view === "search" ? (
            <>
              <input
                autoFocus
                type="text"
                placeholder="Digite o nome do paciente..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-3 py-2 border border-border-subtle rounded-lg bg-bg-2 text-text-primary text-[12px] placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)]"
              />

              <div className="mt-3 min-h-[120px]">
                {searching && (
                  <p className="text-[11px] text-text-tertiary text-center py-8">Buscando...</p>
                )}
                {!searching && query.length >= 2 && results.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-[12px] text-text-secondary">Nenhum paciente encontrado</p>
                    <button
                      onClick={() => setView("create")}
                      className="mt-2 text-[11px] text-accent hover:underline cursor-pointer"
                    >
                      Criar novo paciente
                    </button>
                  </div>
                )}
                {!searching && results.length > 0 && (
                  <div className="space-y-1 max-h-[240px] overflow-y-auto">
                    {results.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => onSelect(p)}
                        className="w-full text-left px-3 py-2.5 rounded-lg border border-border-subtle hover:border-border-default hover:bg-bg-2 transition-colors cursor-pointer"
                      >
                        <p className="text-[12px] font-medium text-text-primary">{p.name}</p>
                        <p className="text-[10.5px] text-text-tertiary mt-0.5">
                          {p.birth_date ? ageFromBirthDate(p.birth_date) : "Idade não informada"}
                          {p.gender ? ` · ${p.gender}` : ""}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
                {!searching && query.length < 2 && (
                  <p className="text-[11px] text-text-tertiary text-center py-8">
                    Digite pelo menos 2 caracteres para buscar
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-text-secondary mb-1">Nome completo *</label>
                <input
                  autoFocus
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-border-subtle rounded-lg bg-bg-2 text-text-primary text-[12px] placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)]"
                  placeholder="Nome do paciente"
                />
              </div>
              <div>
                <label className="block text-[11px] text-text-secondary mb-1">Data de nascimento</label>
                <input
                  type="date"
                  value={newBirthDate}
                  onChange={(e) => setNewBirthDate(e.target.value)}
                  className="w-full px-3 py-2 border border-border-subtle rounded-lg bg-bg-2 text-text-primary text-[12px] focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-text-secondary mb-1">Sexo</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    className="w-full px-3 py-2 border border-border-subtle rounded-lg bg-bg-2 text-text-primary text-[12px] focus:outline-none focus:border-accent"
                  >
                    <option value="">—</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-text-secondary mb-1">Raça/Cor</label>
                  <select
                    value={newRace}
                    onChange={(e) => setNewRace(e.target.value)}
                    className="w-full px-3 py-2 border border-border-subtle rounded-lg bg-bg-2 text-text-primary text-[12px] focus:outline-none focus:border-accent"
                  >
                    <option value="">—</option>
                    <option value="Branco">Branco</option>
                    <option value="Pardo">Pardo</option>
                    <option value="Preto">Preto</option>
                    <option value="Amarelo">Amarelo</option>
                    <option value="Indígena">Indígena</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-text-secondary mb-1">CPF (opcional)</label>
                <input
                  type="text"
                  value={newCpf}
                  onChange={(e) => setNewCpf(e.target.value)}
                  className="w-full px-3 py-2 border border-border-subtle rounded-lg bg-bg-2 text-text-primary text-[12px] placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)]"
                  placeholder="000.000.000-00"
                />
              </div>
              {createError && (
                <p className="text-[11px] text-status-crit">{createError}</p>
              )}
              <button
                onClick={handleCreate}
                disabled={!newName.trim() || creating}
                className="w-full py-2.5 rounded-lg bg-accent text-black text-[12px] font-semibold hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {creating ? "Criando..." : "Criar paciente e iniciar consulta"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
