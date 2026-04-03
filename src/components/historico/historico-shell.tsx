"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { searchPatients } from "@/lib/supabase/patients";
import { listConsultationsByPatient } from "@/lib/supabase/consultations";
import { getPatientProblems } from "@/lib/supabase/patient-problems";
import { getPatientMedications } from "@/lib/supabase/patient-medications";
import { useConsultationStore } from "@/stores/consultation-store";
import { showToast } from "@/components/ui/toast";
import type { Patient, PatientMedication, FollowUpItem } from "@/types";
import { PatientSidebar } from "./patient-sidebar";
import { HistoryTimeline } from "./history-timeline";
import { MonitoringPanel } from "./monitoring-panel";
import { Search, X } from "lucide-react";
import { formatDateBR, ageFromBirthDate } from "@/lib/utils";

export type ConsultationItem = {
  id: string;
  date: string;
  problems: string[] | null;
  problems_other: string | null;
  vitals: Record<string, string> | null;
  labs: Record<string, string> | null;
  patient_snapshot: { name?: string; age?: string } | null;
  prescription: string | null;
  assessment: string | null;
  followup_items: FollowUpItem[] | null;
};

export function HistoricoShell() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  // Search state
  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);

  // Selected patient data
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [consultations, setConsultations] = useState<ConsultationItem[]>([]);
  const [problems, setProblems] = useState<string[]>([]);
  const [medications, setMedications] = useState<PatientMedication[]>([]);
  const [loadingPatient, setLoadingPatient] = useState(false);

  const searchTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { reset, setPatientId, setPatientName, setPatient } = useConsultationStore();

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => {
        if (user) setUserId(user.id);
      });
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Debounced patient search
  useEffect(() => {
    clearTimeout(searchTimerRef.current);
    if (!userId || inputValue.trim().length < 1) {
      setSearchResults([]);
      return;
    }
    searchTimerRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await searchPatients(userId, inputValue.trim());
        setSearchResults(results);
        setShowDropdown(true);
      } catch {
        showToast("Erro ao buscar pacientes", "error");
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(searchTimerRef.current);
  }, [userId, inputValue]);

  const loadPatientData = useCallback(async (patient: Patient) => {
    setLoadingPatient(true);
    try {
      const [{ data: consults, error }, probs, meds] = await Promise.all([
        listConsultationsByPatient(patient.id),
        getPatientProblems(patient.id),
        getPatientMedications(patient.id),
      ]);
      if (error) throw error;
      setConsultations((consults ?? []) as ConsultationItem[]);
      setProblems(probs);
      setMedications(meds);
    } catch {
      showToast("Erro ao carregar dados do paciente", "error");
    } finally {
      setLoadingPatient(false);
    }
  }, []);

  function handleSelectPatient(patient: Patient) {
    setSelectedPatient(patient);
    setInputValue(patient.name);
    setShowDropdown(false);
    loadPatientData(patient);
  }

  function handleClearPatient() {
    setSelectedPatient(null);
    setConsultations([]);
    setProblems([]);
    setMedications([]);
    setInputValue("");
    setShowDropdown(false);
    inputRef.current?.focus();
  }

  function handleNewConsultation() {
    if (!selectedPatient) return;
    reset();
    setPatientId(selectedPatient.id);
    setPatientName(selectedPatient.name);
    const ageYears = ageFromBirthDate(selectedPatient.birth_date);
    setPatient({
      name: selectedPatient.name,
      age: ageYears !== null ? `${ageYears} anos` : "",
      gender: (selectedPatient.gender as "Masculino" | "Feminino" | "Outro" | "") ?? "",
      race: (selectedPatient.race as "Branco" | "Pardo" | "Preto" | "Amarelo" | "Indígena" | "") ?? "",
    });
    router.push("/consulta");
  }

  const initials = selectedPatient
    ? selectedPatient.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
    : "";

  // Derive last PA for sidebar
  const lastConsult = consultations[0];
  const lastPa =
    lastConsult?.vitals?.pas && lastConsult?.vitals?.pad
      ? `${lastConsult.vitals.pas}/${lastConsult.vitals.pad}`
      : null;
  const lastPaDate = lastConsult?.date ? formatDateBR(lastConsult.date) : null;

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      {/* Left Sidebar */}
      <aside className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-64 bg-surface-low border-r border-outline-variant overflow-y-auto z-10">
        <PatientSidebar
          patient={selectedPatient}
          problems={problems}
          medications={medications}
          initials={initials}
          lastPa={lastPa}
          lastPaDate={lastPaDate}
          onChangePatient={handleClearPatient}
        />
      </aside>

      {/* Center Column */}
      <main className="ml-64 mr-80 flex-1 px-10 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-[28px] font-headline font-semibold text-primary leading-tight">
            Histórico Longitudinal
          </h1>
          <p className="text-on-surface-muted text-[13px] mt-1 italic">
            Eventos clínicos consolidados para continuidade do cuidado.
          </p>
        </div>

        {/* Sticky Patient Search */}
        <div
          ref={dropdownRef}
          className="sticky top-[3.5rem] z-40 bg-surface/95 backdrop-blur-sm py-2 mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-muted w-4 h-4 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                const val = e.target.value;
                setInputValue(val);
                if (selectedPatient && val !== selectedPatient.name) {
                  setSelectedPatient(null);
                  setConsultations([]);
                  setProblems([]);
                  setMedications([]);
                }
                if (val.trim()) setShowDropdown(true);
                else setShowDropdown(false);
              }}
              onFocus={() => {
                if (inputValue.trim() && searchResults.length > 0) setShowDropdown(true);
              }}
              placeholder="Buscar paciente por nome..."
              className="w-full bg-surface-lowest border border-outline-variant pl-10 pr-10 py-2.5 rounded-xl text-[13px] text-on-surface placeholder:text-on-surface-muted focus:ring-1 focus:ring-primary/20 focus:border-primary outline-none shadow-sm transition-all"
            />
            {inputValue && (
              <button
                onClick={handleClearPatient}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-muted hover:text-on-surface transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {showDropdown && inputValue.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-surface-lowest rounded-2xl shadow-[0_8px_30px_rgba(23,28,31,0.12)] border border-outline-variant overflow-hidden z-50">
              {searching ? (
                <div className="px-4 py-3 text-[12px] text-on-surface-muted">Buscando...</div>
              ) : searchResults.length === 0 ? (
                <div className="px-4 py-3 text-[12px] text-on-surface-muted">
                  Nenhum paciente encontrado para &quot;{inputValue}&quot;
                </div>
              ) : (
                <>
                  <div className="px-4 py-2 border-b border-outline-variant/30 bg-surface-container/50">
                    <p className="text-[10px] font-bold text-on-surface-muted uppercase tracking-widest">
                      Pacientes encontrados
                    </p>
                  </div>
                  <div className="divide-y divide-outline-variant/20 max-h-64 overflow-y-auto">
                    {searchResults.map((p) => {
                      const ageYears = ageFromBirthDate(p.birth_date);
                      const ini = p.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
                      return (
                        <button
                          key={p.id}
                          onClick={() => handleSelectPatient(p)}
                          className="w-full px-4 py-3 hover:bg-surface-container flex items-center gap-3 transition-colors cursor-pointer text-left"
                        >
                          <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-[11px] shrink-0">
                            {ini}
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-primary">{p.name}</p>
                            <p className="text-[10px] text-on-surface-muted uppercase tracking-tight">
                              {[ageYears !== null ? `${ageYears}a` : null, p.gender]
                                .filter(Boolean)
                                .join(" • ")}
                              {p.cpf && (
                                <span className="text-primary/60 font-semibold"> • {p.cpf}</span>
                              )}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Timeline */}
        <HistoryTimeline
          consultations={consultations}
          loading={loadingPatient}
          selectedPatient={selectedPatient}
          onNewConsultation={handleNewConsultation}
        />
      </main>

      {/* Right Sidebar */}
      <aside className="fixed right-0 top-14 h-[calc(100vh-3.5rem)] w-80 bg-surface-lowest border-l border-outline-variant overflow-y-auto z-10">
        <MonitoringPanel
          consultations={consultations}
          problems={problems}
          selectedPatient={selectedPatient}
          onNewConsultation={handleNewConsultation}
        />
      </aside>
    </div>
  );
}
