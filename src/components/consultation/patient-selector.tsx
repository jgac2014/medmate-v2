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
        className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-[60] w-[520px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 bg-surface-lowest rounded-2xl shadow-[0_32px_64px_-12px_rgba(23,28,31,0.12)] overflow-hidden">

        {/* Decorative blobs */}
        <div className="absolute top-[-15%] right-[-5%] w-[40%] h-[40%] rounded-full bg-secondary-container opacity-30 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-[60px] pointer-events-none" />

        {/* Content */}
        <div className="relative p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-headline text-2xl font-medium text-primary">
                {view === "search" ? "Iniciar consulta" : "Novo paciente"}
              </h2>
              <p className="text-sm text-on-surface-muted mt-0.5">
                {view === "search" ? "Busque o paciente ou crie um novo" : "Preencha os dados do paciente"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-muted hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer text-xl leading-none"
            >
              ×
            </button>
          </div>

          {view === "search" ? (
            <>
              <div className="relative mb-5">
                <input
                  autoFocus
                  type="text"
                  placeholder="Buscar paciente por nome ou CPF..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full h-14 pl-5 pr-4 border-0 border-b-2 border-outline-variant/50 bg-transparent text-on-surface text-lg placeholder:text-on-surface-muted focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="min-h-[140px]">
                {searching && (
                  <p className="text-sm text-on-surface-muted text-center py-10">Buscando...</p>
                )}
                {!searching && query.length >= 2 && results.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-sm text-on-surface-variant">Nenhum paciente encontrado</p>
                    <button
                      onClick={() => setView("create")}
                      className="mt-2 text-sm text-secondary hover:underline cursor-pointer"
                    >
                      Criar novo paciente
                    </button>
                  </div>
                )}
                {!searching && results.length > 0 && (
                  <div className="space-y-1 max-h-[280px] overflow-y-auto">
                    {results.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => onSelect(p)}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-surface-container transition-colors cursor-pointer group"
                      >
                        <p className="text-[14px] font-medium text-on-surface group-hover:text-primary transition-colors">{p.name}</p>
                        <p className="text-[12px] text-on-surface-muted mt-0.5">
                          {p.birth_date ? ageFromBirthDate(p.birth_date) : "Idade não informada"}
                          {p.gender ? ` · ${p.gender}` : ""}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
                {!searching && query.length < 2 && (
                  <p className="text-sm text-on-surface-muted text-center py-10">
                    Digite pelo menos 2 caracteres para buscar
                  </p>
                )}
              </div>

              <div className="mt-6 pt-5 border-t border-outline-variant/30 flex justify-between items-center">
                <button
                  onClick={() => setView("create")}
                  className="text-sm text-secondary hover:text-primary transition-colors cursor-pointer font-medium"
                >
                  + Novo paciente
                </button>
                <button
                  onClick={onClose}
                  className="text-sm text-on-surface-muted hover:text-on-surface transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] text-on-surface-variant mb-1 font-medium">Nome completo *</label>
                <input
                  autoFocus
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full h-11 border-0 border-b-2 border-outline-variant/50 bg-transparent text-on-surface text-[14px] placeholder:text-on-surface-muted focus:outline-none focus:border-primary transition-colors"
                  placeholder="Nome do paciente"
                />
              </div>
              <div>
                <label className="block text-[13px] text-on-surface-variant mb-1 font-medium">Data de nascimento</label>
                <input
                  type="date"
                  value={newBirthDate}
                  onChange={(e) => setNewBirthDate(e.target.value)}
                  className="w-full h-11 border-0 border-b-2 border-outline-variant/50 bg-transparent text-on-surface text-[14px] focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] text-on-surface-variant mb-1 font-medium">Sexo</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    className="w-full h-11 border-0 border-b-2 border-outline-variant/50 bg-transparent text-on-surface text-[14px] focus:outline-none focus:border-primary transition-colors cursor-pointer"
                  >
                    <option value="">—</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] text-on-surface-variant mb-1 font-medium">Raça/Cor</label>
                  <select
                    value={newRace}
                    onChange={(e) => setNewRace(e.target.value)}
                    className="w-full h-11 border-0 border-b-2 border-outline-variant/50 bg-transparent text-on-surface text-[14px] focus:outline-none focus:border-primary transition-colors cursor-pointer"
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
                <label className="block text-[13px] text-on-surface-variant mb-1 font-medium">CPF (opcional)</label>
                <input
                  type="text"
                  value={newCpf}
                  onChange={(e) => setNewCpf(e.target.value)}
                  className="w-full h-11 border-0 border-b-2 border-outline-variant/50 bg-transparent text-on-surface text-[14px] placeholder:text-on-surface-muted focus:outline-none focus:border-primary transition-colors"
                  placeholder="000.000.000-00"
                />
              </div>
              {createError && (
                <p className="text-[13px] text-error">{createError}</p>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setView("search")}
                  className="flex-1 h-12 rounded-xl border border-outline-variant/50 text-on-surface-variant text-[14px] font-medium hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newName.trim() || creating}
                  className="flex-1 h-12 rounded-xl bg-primary text-on-primary text-[14px] font-semibold hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {creating ? "Criando..." : "Criar e iniciar"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
