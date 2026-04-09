"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useConsultationStore } from "@/stores/consultation-store";
import { getPatientProblems } from "@/lib/supabase/patient-problems";
import { getPatientMedications } from "@/lib/supabase/patient-medications";
import { getPatientAlerts } from "@/lib/supabase/alerts";
import { AlertList } from "@/components/consultation/alert-list";
import type { PatientMedication, Alert } from "@/types";

const NAV_ITEMS = [
  { label: "Atendimento", icon: "clinical_notes", id: "consulta" },
  { label: "Exames", icon: "biotech", id: "exames" },
  { label: "Prontuário", icon: "history", id: "historico" },
  { label: "Prevenção", icon: "vaccines", id: "prevencao" },
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
  const { patientId, patientName, patient, vitals } = useConsultationStore();
  const [userId, setUserId] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<PatientData>(EMPTY_DATA);
  const [loading, setLoading] = useState(false);
  const [activeNav, setActiveNav] = useState<NavId>("consulta");
  const isScrollingRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const router = useRouter();

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
        medications: meds.filter((m) => m.active),
        alerts: newAlerts.filter((a) => !dismissed.has(a.id)),
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
  const age = patient.age ? `${patient.age}a` : null;
  const gender = patient.gender || null;
  const currentPA =
    vitals.pas && vitals.pad ? `${vitals.pas}/${vitals.pad} mmHg` : null;

  return (
    <aside className={`w-64 shrink-0 h-full flex-col bg-[#F5F7F6] border-r border-primary/10 ${open ? "flex" : "hidden lg:flex"}`}>
      {/* Header: Patient */}
      <div className="p-3 border-b border-primary/5">
        <div className="flex items-center gap-3 mb-3">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="text-[15px] font-bold text-primary">
                {displayName ? displayName[0].toUpperCase() : "?"}
              </span>
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#F5F7F6] rounded-full" />
          </div>

          {/* Nome + badge */}
          <div className="min-w-0">
            {displayName ? (
              <>
                <h2 className="font-headline italic text-lg text-primary truncate leading-tight">
                  {displayName}
                </h2>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="font-label text-[9px] tracking-wider uppercase text-[#454B4E]">
                    {[age, gender].filter(Boolean).join(" • ")}
                  </p>
                  {alerts.length > 0 && (
                    <span className="px-1.5 py-0.5 bg-error/10 text-error text-[8px] font-bold rounded uppercase tracking-tighter">
                      {alerts.length} alerta{alerts.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <p className="text-[12px] text-[#717973] italic">
                Nenhum paciente
              </p>
            )}
          </div>
        </div>

        {/* Memória Clínica */}
        {patientId && (
          <div className="bg-white/50 p-2 rounded border border-primary/5 space-y-1.5">
            <p className="font-label text-[8px] uppercase tracking-[0.12em] text-primary/70 font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[10px]">
                history_edu
              </span>
              Memória Clínica
            </p>

            {currentPA && (
              <div className="flex justify-between items-baseline">
                <span className="text-[9px] text-[#717973] font-medium">
                  PA atual
                </span>
                <span className="text-[10px] font-bold text-primary">
                  {currentPA}
                </span>
              </div>
            )}

            {medications.length > 0 && (
              <div className="flex justify-between items-baseline">
                <span className="text-[9px] text-[#717973] font-medium">
                  Medicamentos
                </span>
                <span className="text-[10px] font-bold text-[#454B4E]">
                  {medications.length} ativo{medications.length > 1 ? "s" : ""}
                </span>
              </div>
            )}

            {loading && (
              <p className="text-[9px] text-[#717973] italic">Carregando...</p>
            )}

            {activeProblems.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1.5 border-t border-primary/5">
                {activeProblems.slice(0, 3).map((p) => (
                  <span
                    key={p}
                    className="px-1 py-0.5 bg-[#bdedd7]/40 text-[#416d5c] text-[8px] rounded font-bold border border-[#3b6756]/10"
                  >
                    {p}
                  </span>
                ))}
                {activeProblems.length > 3 && (
                  <span className="px-1 py-0.5 bg-gray-100 text-[#717973] text-[8px] rounded font-bold">
                    +{activeProblems.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navegação */}
      <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
              activeNav === item.id
                ? "text-primary font-bold bg-primary/5 border-l-4 border-primary"
                : "text-[#454B4E] hover:bg-primary/5 hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              {item.icon}
            </span>
            <span className="font-label text-[10px] tracking-widest uppercase">
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
      <div className="p-3 border-t border-primary/10 bg-white/30">
        <div className="flex justify-between items-center text-[10px] text-[#454B4E]">
          <button
            onClick={() => router.push("/conta")}
            className="hover:text-primary flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">
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
            <span className="material-symbols-outlined text-[14px]">
              logout
            </span>
            Sair
          </button>
        </div>
      </div>
    </aside>
  );
}
