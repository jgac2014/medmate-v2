"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/toast";
import { PatientFormModal } from "./patient-form-modal";
import { createClient } from "@/lib/supabase/client";
import { listPatients, searchPatients } from "@/lib/supabase/patients";
import { listConsultationsByPatient } from "@/lib/supabase/consultations";
import { getPatientMedications } from "@/lib/supabase/patient-medications";
import { getPatientProblems } from "@/lib/supabase/patient-problems";
import { prepareConsultationForPatient } from "@/lib/consultation/patient-context";
import { ageFromBirthDate, formatDateBR } from "@/lib/utils";
import { BRAND } from "@/lib/branding";
import { markOnboardingStep } from "@/hooks/useOnboarding";
import type { Patient, PatientMedication } from "@/types";
import type { ConsultationItem } from "@/components/historico/historico-shell";

// Reutiliza o mesmo tipo do Historico-shell para consistência longitudinal

export function PatientsShell() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [activePatientId, setActivePatientId] = useState<string | null>(null);
  const [recentConsultations, setRecentConsultations] = useState<ConsultationItem[]>([]);
  const [activeProblems, setActiveProblems] = useState<string[]>([]);
  const [medications, setMedications] = useState<PatientMedication[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const activePatient = useMemo(
    () => patients.find((patient) => patient.id === activePatientId) ?? null,
    [activePatientId, patients]
  );

  const loadPatients = useCallback(async (uid: string, currentQuery: string): Promise<Patient[]> => {
    setLoadingPatients(true);

    try {
      const nextPatients =
        currentQuery.trim().length >= 2
          ? await searchPatients(uid, currentQuery.trim())
          : await listPatients(uid);

      setPatients(nextPatients);
      setActivePatientId((currentId) => {
        if (currentId && nextPatients.some((patient) => patient.id === currentId)) {
          return currentId;
        }
        return nextPatients[0]?.id ?? null;
      });
      return nextPatients;
    } catch {
      showToast("Erro ao carregar pacientes", "error");
      return [];
    } finally {
      setLoadingPatients(false);
    }
  }, []);

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);
      loadPatients(user.id, "");
    });
  }, [loadPatients]);

  useEffect(() => {
    if (!userId) return;

    const timer = setTimeout(() => {
      loadPatients(userId, query);
    }, 250);

    return () => clearTimeout(timer);
  }, [loadPatients, query, userId]);

  useEffect(() => {
    if (!activePatientId) {
      setRecentConsultations([]);
      setActiveProblems([]);
      setMedications([]);
      return;
    }

    setLoadingDetails(true);

    Promise.all([
      listConsultationsByPatient(activePatientId),
      getPatientProblems(activePatientId),
      getPatientMedications(activePatientId),
    ])
      .then(([consultationsResult, problemsResult, medicationsResult]) => {
        setRecentConsultations((consultationsResult.data ?? []) as unknown as ConsultationItem[]);
        setActiveProblems(problemsResult);
        setMedications(medicationsResult);
      })
      .catch(() => {
        showToast("Erro ao carregar prontuário do paciente", "error");
      })
      .finally(() => setLoadingDetails(false));
  }, [activePatientId]);

  async function handleStartConsultation(patient: Patient) {
    await prepareConsultationForPatient({ userId, patient });
    showToast(`Consulta iniciada para ${patient.name}`, "success");
    router.push("/consulta");
  }

  function handleOpenCreate() {
    setEditingPatient(null);
    setFormOpen(true);
  }

  function handleOpenEdit() {
    if (!activePatient) return;
    setEditingPatient(activePatient);
    setFormOpen(true);
  }

  async function handleSaved(patient: Patient) {
    if (!userId) return;

    // Re-use data already fetched by loadPatients — no extra round-trip needed
    const freshList = await loadPatients(userId, query);
    const freshPatient = freshList.find((p) => p.id === patient.id) ?? patient;
    setActivePatientId(freshPatient.id);

    showToast(editingPatient ? "Paciente atualizado" : "Paciente criado", "success");
    if (!editingPatient) markOnboardingStep("patientCreated", userId);
  }

  return (
    <>
      <PatientFormModal
        open={formOpen}
        userId={userId}
        patient={editingPatient}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
      />

      <div className="grid min-h-[calc(100vh-3.5rem)] grid-cols-[340px_minmax(0,1fr)] bg-surface-lowest">
        <aside className="border-r border-outline-variant bg-surface-low p-5">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h1 className="font-headline text-[28px] font-semibold text-primary">Pacientes</h1>
              <p className="mt-1 text-[13px] text-on-surface-muted">
                Base longitudinal para iniciar consulta sem retrabalho.
              </p>
            </div>
            <Button className="shrink-0" onClick={handleOpenCreate}>
              Novo
            </Button>
          </div>

          <div className="mb-4 rounded-xl border border-outline-variant bg-surface-lowest px-3 py-2.5">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nome ou CPF..."
              className="w-full bg-transparent text-[13px] text-on-surface outline-none placeholder:text-on-surface-muted"
            />
          </div>

          <div className="space-y-2">
            {loadingPatients && (
              <div className="rounded-xl border border-outline-variant/40 bg-surface-lowest px-4 py-6 text-center text-[13px] text-on-surface-muted">
                Carregando pacientes...
              </div>
            )}

            {!loadingPatients && patients.length === 0 && (
              <div className="rounded-xl border border-dashed border-primary/20 bg-primary/[0.02] px-4 py-8 text-center">
                <span className="material-symbols-outlined text-3xl text-primary/30 block mb-3">person_add</span>
                <p className="text-[14px] font-semibold text-primary">Nenhum paciente ainda</p>
                <p className="mt-1 text-[12px] text-on-surface-muted leading-relaxed">
                  Cadastre o primeiro paciente para iniciar o fluxo longitudinal.
                </p>
                <Button className="mt-4" onClick={handleOpenCreate}>
                  Cadastrar primeiro paciente
                </Button>
              </div>
            )}

            {patients.map((patient) => {
              const age = ageFromBirthDate(patient.birth_date);
              const selected = patient.id === activePatientId;

              return (
                <button
                  key={patient.id}
                  onClick={() => setActivePatientId(patient.id)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${
                    selected
                      ? "border-primary/20 bg-primary/5"
                      : "border-outline-variant/40 bg-surface-lowest hover:border-primary/10 hover:bg-surface"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold text-primary">{patient.name}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-wide text-on-surface-muted">
                        {[age !== null ? `${age} anos` : null, patient.gender, patient.cpf].filter(Boolean).join(" • ") || "Sem dados complementares"}
                      </p>
                    </div>
                    <span className="rounded-full bg-surface-container px-2 py-1 text-[10px] font-medium text-on-surface-muted">
                      {formatDateBR(patient.updated_at.slice(0, 10))}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="min-w-0 p-8">
          {!activePatient && !loadingPatients && (
            <div className="flex h-full items-center justify-center">
              <div className="max-w-sm text-center">
                <span className="material-symbols-outlined text-5xl text-primary/20 block mb-4">assignment_ind</span>
                <h2 className="font-headline text-2xl font-medium text-primary">Selecione um paciente</h2>
                <p className="mt-3 text-[14px] leading-relaxed text-on-surface-muted">
                  Clique em um paciente na lista ao lado para ver o prontuário, iniciar consulta ou editar o cadastro.
                </p>
                {patients.length === 0 && (
                  <Button className="mt-5" onClick={handleOpenCreate}>
                    Cadastrar primeiro paciente
                  </Button>
                )}
              </div>
            </div>
          )}

          {activePatient && (
            <div className="space-y-8">
              <section className="flex flex-col gap-5 rounded-2xl border border-outline-variant bg-surface p-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-muted">
                    Cadastro do paciente
                  </p>
                  <h2 className="mt-2 font-headline text-4xl font-medium text-primary">
                    {activePatient.name}
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      ageFromBirthDate(activePatient.birth_date) !== null ? `${ageFromBirthDate(activePatient.birth_date)} anos` : null,
                      activePatient.gender,
                      activePatient.race,
                      activePatient.phone,
                      activePatient.cpf,
                    ]
                      .filter(Boolean)
                      .map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-outline-variant/50 bg-surface-lowest px-3 py-1.5 text-[12px] text-on-surface-variant"
                        >
                          {item}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => handleStartConsultation(activePatient)}>
                    Nova consulta
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => router.push(`/historico?patientId=${activePatient.id}`)}
                  >
                    Ver histórico
                  </Button>
                  <Button variant="ghost" onClick={handleOpenEdit}>
                    Editar cadastro
                  </Button>
                </div>
              </section>

              <section className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
                <div className="rounded-2xl border border-outline-variant bg-surface p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h3 className="font-headline text-2xl font-medium text-primary">Consultas recentes</h3>
                      <p className="mt-1 text-[13px] text-on-surface-muted">
                        Últimos atendimentos salvos para retomada rápida.
                      </p>
                    </div>
                  </div>

                  {loadingDetails && (
                    <div className="rounded-xl border border-outline-variant/40 bg-surface-lowest px-4 py-6 text-[13px] text-on-surface-muted">
                      Carregando prontuário...
                    </div>
                  )}

                  {!loadingDetails && recentConsultations.length === 0 && (
                    <div className="rounded-xl border border-dashed border-outline-variant bg-surface-lowest px-4 py-8 text-center">
                      <p className="text-[14px] font-medium text-on-surface">Sem consultas registradas</p>
                      <p className="mt-1 text-[12px] text-on-surface-muted">
                        Inicie a primeira consulta para construir o histórico longitudinal.
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    {recentConsultations.map((consultation) => {
                      const problems = [
                        ...(consultation.problems ?? []),
                        ...(consultation.problems_other
                          ? consultation.problems_other.split(",").map((s) => s.trim()).filter(Boolean)
                          : []),
                      ];
                      const pa =
                        consultation.vitals?.pas && consultation.vitals?.pad
                          ? `${consultation.vitals.pas}/${consultation.vitals.pad}`
                          : null;

                      return (
                        <div
                          key={consultation.id}
                          className="rounded-xl border border-outline-variant/40 bg-surface-lowest overflow-hidden"
                        >
                          {/* Card header */}
                          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-outline-variant/30">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[12px] font-bold text-primary">{formatDateBR(consultation.date)}</span>
                              {problems.slice(0, 2).map((p) => (
                                <span key={p} className="rounded-full bg-secondary-container/50 border border-secondary/20 px-2 py-0.5 text-[9px] font-semibold text-secondary">
                                  {p}
                                </span>
                              ))}
                            </div>
                            <button
                              onClick={() => router.push(`/historico?patientId=${activePatient.id}`)}
                              className="text-[11px] font-medium text-secondary transition-colors hover:text-primary shrink-0"
                            >
                              Ver histórico →
                            </button>
                          </div>

                          {/* SOAP summary */}
                          <div className="px-4 py-3 grid grid-cols-2 gap-3">
                            {consultation.subjective && (
                              <div>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-muted mb-1">Subjetivo</p>
                                <p className="text-[11px] text-on-surface leading-snug line-clamp-2">{consultation.subjective}</p>
                              </div>
                            )}
                            {consultation.assessment && (
                              <div>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-muted mb-1">Avaliação</p>
                                <p className="text-[11px] text-on-surface leading-snug line-clamp-2">{consultation.assessment}</p>
                              </div>
                            )}
                            {pa && (
                              <div>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-muted mb-1">PA</p>
                                <p className="text-[11px] font-bold text-on-surface">{pa} mmHg</p>
                              </div>
                            )}
                            {consultation.plan && (
                              <div>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-muted mb-1">Plano</p>
                                <p className="text-[11px] text-on-surface leading-snug line-clamp-2">{consultation.plan}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-6">
                  <section className="rounded-2xl border border-outline-variant bg-surface p-6">
                    <h3 className="font-headline text-xl font-medium text-primary">Problemas ativos</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {activeProblems.length > 0 ? (
                        activeProblems.map((problem) => (
                          <span
                            key={problem}
                            className="rounded-full bg-status-crit-bg px-3 py-1.5 text-[12px] text-status-crit"
                          >
                            {problem}
                          </span>
                        ))
                      ) : (
                        <p className="text-[13px] text-on-surface-muted">Nenhum problema longitudinal ativo.</p>
                      )}
                    </div>
                  </section>

                  <section className="rounded-2xl border border-outline-variant bg-surface p-6">
                    <h3 className="font-headline text-xl font-medium text-primary">Medicamentos contínuos</h3>
                    <div className="mt-4 space-y-3">
                      {medications.length > 0 ? (
                        medications.map((medication) => (
                          <div
                            key={medication.id}
                            className="rounded-xl border border-outline-variant/40 bg-surface-lowest px-4 py-3"
                          >
                            <p className="text-[13px] font-semibold text-on-surface">
                              {medication.medication_name}
                            </p>
                            <p className="mt-1 text-[12px] text-on-surface-muted">
                              {medication.dosage || "Dose não informada"}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-[13px] text-on-surface-muted">Nenhum medicamento contínuo cadastrado.</p>
                      )}
                    </div>
                  </section>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
