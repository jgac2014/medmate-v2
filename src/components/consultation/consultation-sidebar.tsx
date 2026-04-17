"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useConsultationStore } from "@/stores/consultation-store";
import { getPatientProblems } from "@/lib/supabase/patient-problems";
import { getPatientMedications } from "@/lib/supabase/patient-medications";
import { usePatientMedications } from "@/hooks/usePatientMedications";
import { getPatientAlerts } from "@/lib/supabase/alerts";
import { parseAge } from "@/lib/clinical-rules";
import { AlertList } from "@/components/consultation/alert-list";
import { ComparisonPanel } from "@/components/consultation/comparison-panel";
import type { PatientMedication, Alert } from "@/types";

const NAV_ITEMS = [
  { label: "Atendimento", icon: "clinical_notes", id: "consulta" },
  { label: "Exames", icon: "biotech", id: "exames" },
  { label: "Prontuário", icon: "history", id: "historico" },
  { label: "Prevenção", icon: "vaccines", id: "prevencao" },
  { label: "Triagens", icon: "psychology", id: "triagens" },
] as const;

type NavId = (typeof NAV_ITEMS)[number]["id"];

function getDismissedAlerts(): Set<string> {
  try {
    const raw = localStorage.getItem("medmate_dismissed_alerts");
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

interface PatientData {
  problems: string[];
  medications: PatientMedication[];
  alerts: Alert[];
}

const EMPTY_DATA: PatientData = { problems: [], medications: [], alerts: [] };

interface ConsultationSidebarProps {
  open?: boolean;
}

export function ConsultationSidebar({ open = false }: ConsultationSidebarProps) {
  const { patientId, patientName, patient, vitals, currentConsultationId } = useConsultationStore();
  const [userId, setUserId] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<PatientData>(EMPTY_DATA);
  const [loading, setLoading] = useState(false);
  const [activeNav, setActiveNav] = useState<NavId>("consulta");
  const isScrollingRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const router = useRouter();
  const { medications: continuousMeds, loading: medsLoading } = usePatientMedications(patientId);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => {
        if (user) setUserId(user.id);
      });
  }, []);

  useEffect(() => {
    const mainEl = document.querySelector("main");
    const observers: IntersectionObserver[] = [];

    NAV_ITEMS.forEach((item) => {
      const el = document.getElementById(`section-${item.id}`);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isScrollingRef.current) {
            setActiveNav(item.id);
          }
        },
        { root: mainEl, threshold: 0.25 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
      clearTimeout(scrollTimerRef.current);
    };
  }, []);

  function handleNavClick(id: NavId) {
    setActiveNav(id);
    isScrollingRef.current = true;
    clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const fetchPatientData = useCallback(async () => {
    if (!patientId || !userId) return;
    setLoading(true);
    try {
      const [problems, meds, newAlerts] = await Promise.all([
        getPatientProblems(patientId),
        getPatientMedications(patientId),
        getPatientAlerts(patientId, userId),
      ]);
      const dismissed = getDismissedAlerts();
      setPatientData({
        problems,
        medications: meds.filter((m: PatientMedication) => m.active),
        alerts: newAlerts.filter((a: Alert) => !dismissed.has(a.id)),
      });
    } finally {
      setLoading(false);
    }
  }, [patientId, userId]);

  useEffect(() => {
    if (patientId && userId) fetchPatientData();
  }, [patientId, userId, fetchPatientData]);

  function handleDismiss(id: string) {
    try {
      const dismissed = getDismissedAlerts();
      dismissed.add(id);
      localStorage.setItem(
        "medmate_dismissed_alerts",
        JSON.stringify([...dismissed])
      );
    } catch {
      // silencioso
    }
    setPatientData((prev) => ({
      ...prev,
      alerts: prev.alerts.filter((a) => a.id !== id),
    }));
  }

  const { problems: activeProblems, medications, alerts } = patientId ? patientData : EMPTY_DATA;
  const displayName = patientName ?? patient.name ?? null;
  const ageNum = parseAge(patient.age);
  const age = ageNum !== null ? `${ageNum}a` : null;
  const gender = patient.gender || null;
  const currentPA =
    vitals.pas && vitals.pad ? `${vitals.pas}/${vitals.pad} mmHg` : null;

  return (
    <aside className={`w-56 shrink-0 h-full flex-col bg-[#F5F7F6] border-r border-primary/10 ${open ? "flex" : "hidden lg:flex"}`}>
      {/* Header: Patient */}
      <div className="p-2.5 border-b border-primary/5">
        <div className="flex items-center gap-2 mb-2">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="text-[13px] font-bold text-primary">
                {displayName ? displayName[0].toUpperCase() : "?"}
              </span>
            </div>
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-[#F5F7F6] rounded-full" />
          </div>

          {/* Nome + badge */}
          <div className="min-w-0 flex-1">
            {displayName ? (
              <>
                <h2 className="font-headline italic text-[14px] text-primary truncate leading-tight">
                  {displayName}
                </h2>
                <p className="font-label text-[8px] tracking-wider uppercase text-[#454B4E]">
                  {[age, gender].filter(Boolean).join(" · ")}
                </p>
              </>
            ) : (
              <p className="text-[11px] text-[#717973] italic">
                Nenhum paciente
              </p>
            )}
          </div>
          {alerts.length > 0 && (
            <span className="px-1.5 py-0.5 bg-error/10 text-error text-[8px] font-bold rounded uppercase tracking-tighter shrink-0">
              {alerts.length}
            </span>
          )}
        </div>

        {/* Memória Clínica */}
        {patientId && (
          <div className="bg-white/50 p-2 rounded border border-primary/5 space-y-1">
            <p className="font-label text-[7px] uppercase tracking-[0.12em] text-primary/70 font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[9px]">
                history_edu
              </span>
              Memória Clínica
            </p>

            {currentPA && (
              <div className="flex justify-between items-baseline">
                <span className="text-[8px] text-[#717973] font-medium">
                  PA atual
                </span>
                <span className="text-[9px] font-bold text-primary">
                  {currentPA}
                </span>
              </div>
            )}

            {medications.length > 0 && (
              <div className="flex justify-between items-baseline">
                <span className="text-[8px] text-[#717973] font-medium">
                  Medicamentos
                </span>
                <span className="text-[9px] font-bold text-[#454B4E]">
                  {medications.length} ativo{medications.length > 1 ? "s" : ""}
                </span>
              </div>
            )}

            {loading && (
              <p className="text-[8px] text-[#717973] italic">Carregando...</p>
            )}

            {activeProblems.length > 0 && (
              <div className="flex flex-wrap gap-0.5 pt-1 border-t border-primary/5">
                {activeProblems.slice(0, 3).map((p) => (
                  <span
                    key={p}
                    className="px-1 py-0.5 bg-[#bdedd7]/40 text-[#416d5c] text-[7px] rounded font-bold border border-[#3b6756]/10"
                  >
                    {p}
                  </span>
                ))}
                {activeProblems.length > 3 && (
                  <span className="px-1 py-0.5 bg-gray-100 text-[#717973] text-[7px] rounded font-bold">
                    +{activeProblems.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        <ComparisonPanel
          patientId={patientId}
          currentConsultationId={currentConsultationId}
          currentVitals={vitals}
        />

        {/* Medicação contínua — contexto longitudinal */}
        {(medsLoading || continuousMeds.length > 0) && (
          <div className="mt-2 pt-2 border-t border-primary/5">
            <p className="font-label text-[7px] uppercase tracking-[0.12em] text-secondary font-bold flex items-center gap-1 mb-1">
              <span className="material-symbols-outlined text-[9px]">medication</span>
              Medicação contínua
            </p>
            {medsLoading ? (
              <div className="space-y-1">
                <div className="h-2 rounded bg-white/30 animate-pulse" />
                <div className="h-2 rounded bg-white/30 animate-pulse w-3/4" />
              </div>
            ) : (
              <div className="space-y-0.5">
                {continuousMeds.slice(0, 5).map((med) => (
                  <div key={med.id} className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-secondary shrink-0" />
                    <span className="text-[7px] text-secondary leading-tight truncate">
                      {med.medication_name}
                      {med.dosage ? ` ${med.dosage}` : ""}
                    </span>
                  </div>
                ))}
                {continuousMeds.length > 5 && (
                  <span className="text-[7px] text-[#717973] italic">
                    e mais {continuousMeds.length - 5}...
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navegação */}
      <nav className="flex-1 py-1.5 px-1.5 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`w-full flex items-center gap-2 px-2 py-1.5 text-left transition-colors ${
              activeNav === item.id
                ? "text-primary font-bold bg-primary/5 border-l-[3px] border-primary"
                : "text-[#454B4E] hover:bg-primary/5 hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">
              {item.icon}
            </span>
            <span className="font-label text-[9px] tracking-widest uppercase">
              {item.label}
            </span>
          </button>
        ))}

        {/* Alertas clínicos */}
        {alerts.length > 0 && (
          <div className="mt-3 px-2">
            <p className="text-[9px] font-bold text-[#717973] uppercase tracking-wider mb-1.5">
              Alertas
            </p>
            <AlertList alerts={alerts} onDismiss={handleDismiss} />
          </div>
        )}
      </nav>

      {/* Rodapé */}
      <div className="p-2 border-t border-primary/10 bg-white/30">
        <div className="flex justify-between items-center text-[9px] text-[#454B4E]">
          <button
            onClick={() => router.push("/conta")}
            className="hover:text-primary flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[13px]">
              settings
            </span>
            Ajustes
          </button>
          <button
            onClick={async () => {
              await createClient().auth.signOut();
              router.push("/auth/login");
            }}
            className="hover:text-error flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[13px]">
              logout
            </span>
            Sair
          </button>
        </div>
      </div>
    </aside>
  );
}
