"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getPatientById, searchPatients } from "@/lib/supabase/patients";
import { listConsultationsByPatient } from "@/lib/supabase/consultations";
import { getPatientProblems } from "@/lib/supabase/patient-problems";
import { getPatientMedications } from "@/lib/supabase/patient-medications";
import { useConsultationStore } from "@/stores/consultation-store";
import { showToast } from "@/components/ui/toast";
import type { Patient, PatientMedication, FollowUpItem } from "@/types";
import { PatientSidebar } from "./patient-sidebar";
import { HistoryTimeline } from "./history-timeline";
import { MonitoringPanel } from "./monitoring-panel";
import { Search, X, User, FileText } from "lucide-react";
import { ageFromBirthDate, formatDateBR } from "@/lib/utils";
import { prepareConsultationForPatient } from "@/lib/consultation/patient-context";

export type ConsultationItem = {
  id: string;
  date: string;
  problems: string[] | null;
  problems_other: string | null;
  vitals: Record<string, string> | null;
  labs: Record<string, string> | null;
  patient_snapshot: { name?: string; age?: string } | null;
  prescription: string | null;
  requested_exams: string | null;
  subjective: string | null;
  objective: string | null;
  assessment: string | null;
  plan: string | null;
  followup_items: FollowUpItem[] | null;
};

export function HistoricoShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<string | null>(null);

  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [consultations, setConsultations] = useState<ConsultationItem[]>([]);
  const [problems, setProblems] = useState<string[]>([]);
  const [medications, setMedications] = useState<PatientMedication[]>([]);
  const [loadingPatient, setLoadingPatient] = useState(false);

  const searchTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { reset } = useConsultationStore();

  const loadPatientData = useCallback(async (patient: Patient) => {
    setLoadingPatient(true);
    try {
      const [{ data: consults, error }, probs, meds] = await Promise.all([
        listConsultationsByPatient(patient.id),
        getPatientProblems(patient.id),
        getPatientMedications(patient.id),
      ]);
      if (error) throw error;
      setConsultations((consults ?? []) as unknown as ConsultationItem[]);
      setProblems(probs);
      setMedications(meds);
    } catch {
      showToast("Erro ao carregar dados do paciente", "error");
    } finally {
      setLoadingPatient(false);
    }
  }, []);

  const handleSelectPatient = useCallback(
    (patient: Patient) => {
      setSelectedPatient(patient);
      setInputValue(patient.name);
      setShowDropdown(false);
      loadPatientData(patient);
    },
    [loadPatientData]
  );

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => {
        if (user) setUserId(user.id);
      });
  }, []);

  useEffect(() => {
    const patientId = searchParams.get("patientId");
    if (!patientId) return;
    if (!userId) return;
    if (selectedPatient?.id === patientId) return;

    getPatientById(patientId)
      .then((patient) => {
        if (!patient) return;
        handleSelectPatient(patient);
      })
      .catch(() => {
        showToast("Não foi possível abrir o paciente pelo link", "error");
      });
  }, [handleSelectPatient, searchParams, selectedPatient, userId]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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

  function handleClearPatient() {
    setSelectedPatient(null);
    setConsultations([]);
    setProblems([]);
    setMedications([]);
    setInputValue("");
    setShowDropdown(false);
    inputRef.current?.focus();
  }

  async function handleNewConsultation() {
    if (!selectedPatient) return;
    reset();
    await prepareConsultationForPatient({ userId, patient: selectedPatient });
    router.push("/consulta");
  }

  async function handleUseAsBase(consult: ConsultationItem) {
    if (!selectedPatient || !userId) return;
    reset();
    await prepareConsultationForPatient({ userId, patient: selectedPatient });

    // Pre-fill SOAP from the past consultation
    const store = useConsultationStore.getState();
    if (consult.subjective) store.setSoap({ subjective: consult.subjective });
    if (consult.objective) store.setSoap({ objective: consult.objective });
    if (consult.assessment) store.setSoap({ assessment: consult.assessment });
    if (consult.plan) store.setSoap({ plan: consult.plan });

    showToast(`Baseada em consulta de ${formatDateBR(consult.date)}`, "info");
    router.push("/consulta");
  }

  const initials = selectedPatient
    ? selectedPatient.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
    : "";

  const lastConsult = consultations[0];
  const lastPa =
    lastConsult?.vitals?.pas && lastConsult?.vitals?.pad
      ? `${lastConsult.vitals.pas}/${lastConsult.vitals.pad}`
      : null;
  const lastPaDate = lastConsult?.date ? formatDateBR(lastConsult.date) : null;

  return (
    <div className="flex min-h-[calc(100vh-8rem)]">
      {/* Coluna esquerda: resumo do paciente */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 bg-surface-low border-r border-outline-variant overflow-y-auto">
        <PatientSidebar
          patient={selectedPatient}
          problems={problems}
          medications={medications}
          initials={initials}
          lastPa={lastPa}
          lastPaDate={lastPaDate}
          onChangePatient={handleClearPatient}
          onNewConsultation={handleNewConsultation}
          consultationCount={consultations.length}
        />
      </aside>

      {/* Coluna central: timeline */}
      <main className="flex-1 min-w-0 px-8 py-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-headline text-[22px] font-semibold text-primary leading-tight">
              Histórico Longitudinal
            </h1>
            {selectedPatient && (
              <p className="text-[12px] text-on-surface-muted mt-0.5">
                {consultations.length} {consultations.length === 1 ? "consulta" : "consultas"} registradas
              </p>
            )}
          </div>
          {selectedPatient && (
            <button
              onClick={handleNewConsultation}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[12px] font-bold text-on-primary transition-colors hover:bg-primary-container shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Nova Consulta
            </button>
          )}
        </div>

        {/* Busca */}
        <div ref={dropdownRef} className="relative mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-muted w-4 h-4 pointer-events-none" />
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
              placeholder="Buscar por nome, CPF ou problema clínico..."
              className="w-full bg-surface-lowest border border-outline-variant/50 pl-11 pr-10 py-3 rounded-xl text-[13px] text-on-surface placeholder:text-on-surface-muted/60 focus:ring-1 focus:ring-secondary/30 focus:border-secondary outline-none shadow-sm transition-all"
            />
            {inputValue && (
              <button
                onClick={handleClearPatient}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-muted hover:text-on-surface transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {showDropdown && inputValue.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-surface-lowest rounded-2xl shadow-[0_8px_30px_rgba(23,28,31,0.12)] border border-outline-variant/50 overflow-hidden z-50">
              {searching ? (
                <div className="px-4 py-4 text-[12px] text-on-surface-muted flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                  Buscando...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="px-4 py-6 text-center">
                  <p className="text-[12px] text-on-surface-muted">Nenhum paciente encontrado</p>
                  <p className="text-[11px] text-on-surface-muted/60 mt-1">
                    Tente buscar por nome, CPF ou parte do nome
                  </p>
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto">
                  <div className="px-4 py-2 border-b border-outline-variant/30 bg-surface-container/50">
                    <p className="text-[10px] font-bold text-on-surface-muted uppercase tracking-widest">
                      {searchResults.length} paciente{searchResults.length !== 1 ? "s" : ""} encontrado{searchResults.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  {searchResults.map((p) => {
                    const ageYears = ageFromBirthDate(p.birth_date);
                    const ini = p.name
                      .split(" ")
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase();
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleSelectPatient(p)}
                        className="w-full px-4 py-3.5 hover:bg-surface-container flex items-center gap-3 transition-colors cursor-pointer text-left border-b border-outline-variant/20 last:border-0"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-bold text-[12px] shrink-0">
                          {ini}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-semibold text-primary truncate">{p.name}</p>
                          <p className="text-[10px] text-on-surface-muted uppercase tracking-tight">
                            {[ageYears !== null ? `${ageYears}a` : null, p.gender]
                              .filter(Boolean)
                              .join(" · ")}
                            {p.cpf && (
                              <span className="text-secondary font-semibold ml-1">
                                · CPF {p.cpf}
                              </span>
                            )}
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-[16px] text-secondary/40">
                          arrow_forward
                        </span>
                      </button>
                    );
                  })}
                </div>
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
          onChangePatient={() => inputRef.current?.focus()}
          onUseAsBase={handleUseAsBase}
        />
      </main>

      {/* Coluna direita: painel de acompanhamento */}
      <aside className="hidden xl:flex xl:flex-col xl:w-80 xl:shrink-0 bg-surface-low border-l border-outline-variant overflow-y-auto">
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
