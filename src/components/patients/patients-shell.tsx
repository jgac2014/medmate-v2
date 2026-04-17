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
import { getPatientAllergies } from "@/lib/supabase/patient-allergies";
import type { PatientAllergy } from "@/lib/supabase/patient-allergies";
import { prepareConsultationForPatient } from "@/lib/consultation/patient-context";
import { deactivatePatientAllergy } from "@/lib/supabase/patient-allergies";
import { AllergyPopover } from "./allergy-popover";
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
  const [lastConsultation, setLastConsultation] = useState<ConsultationItem | null>(null);
  const [activeProblems, setActiveProblems] = useState<string[]>([]);
  const [medications, setMedications] = useState<PatientMedication[]>([]);
  const [allergies, setAllergies] = useState<PatientAllergy[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [editingAllergy, setEditingAllergy] = useState<PatientAllergy | undefined>(undefined);

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
      setLastConsultation(null);
      setActiveProblems([]);
      setMedications([]);
      return;
    }

    setLoadingDetails(true);
    setAllergies([]);

    Promise.all([
      listConsultationsByPatient(activePatientId),
      getPatientProblems(activePatientId),
      getPatientMedications(activePatientId),
      getPatientAllergies(activePatientId),
    ])
      .then(([consultationsResult, problemsResult, medicationsResult, allergiesResult]) => {
        const allConsultations = (consultationsResult.data ?? []) as unknown as ConsultationItem[];
        setLastConsultation(allConsultations[0] ?? null);
        setActiveProblems(problemsResult);
        setMedications(medicationsResult);
        setAllergies((allergiesResult as PatientAllergy[]) ?? []);
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

  async function handleDeactivate(allergyId: string) {
    if (!userId) return;
    try {
      await deactivatePatientAllergy(userId, allergyId);
      setAllergies((prev) => prev.filter((a) => a.id !== allergyId));
      showToast("Alergia desativada", "success");
    } catch {
      showToast("Erro ao desativar alergia", "error");
    }
  }

  async function handleAllergySaved() {
    if (!activePatientId) return;
    const { getPatientAllergies } = await import("@/lib/supabase/patient-allergies");
    const fresh = await getPatientAllergies(activePatientId);
    setAllergies(fresh);
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

      <AllergyPopover
        open={popoverOpen}
        initialAllergy={editingAllergy}
        userId={userId ?? ""}
        patientId={activePatientId ?? ""}
        onSaved={handleAllergySaved}
        onClose={() => { setPopoverOpen(false); setEditingAllergy(undefined); }}
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
              {/* Alergias — bloco crítico, sempre visível quando existir */}
              {allergies.length > 0 && (
                <div className="rounded-xl border border-[var(--error)]/30 bg-[var(--error-container)] px-4 py-3">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--error)]">
                        ⚠ Alergias ({allergies.length})
                      </span>
                      <span className="text-[10px] text-[var(--error)] opacity-70">
                        {allergies.filter((a) => a.severity === "grave").length > 0
                          ? "· Contém alergia grave"
                          : null}
                      </span>
                    </div>
                    <button
                      onClick={() => { setEditingAllergy(undefined); setPopoverOpen(true); }}
                      className="flex items-center gap-1 px-2 py-1 rounded-md border border-[var(--error)]/30 bg-[var(--error)]/5 text-[11px] font-semibold text-[var(--error)] hover:bg-[var(--error)]/10 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[13px]">add</span>
                      Adicionar
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allergies.map((allergy) => (
                      <div
                        key={allergy.id}
                        className={`group relative rounded-full px-3 py-1 text-[12px] font-semibold border cursor-pointer transition-colors ${
                          allergy.severity === "grave"
                            ? "bg-[var(--error)] text-white border-[var(--error)]"
                            : allergy.severity === "moderada"
                            ? "bg-[var(--error-container)] text-[var(--error)] border-[var(--error)]/30"
                            : "bg-[var(--surface-highest)] text-on-surface-variant border-[var(--outline-variant)]"
                        }`}
                        onClick={() => { setEditingAllergy(allergy); setPopoverOpen(true); }}
                        title="Clique para editar"
                      >
                        <span>{allergy.allergy_text}</span>
                        {allergy.severity !== "moderada" ? (
                          <span className="ml-0.5 text-[10px] opacity-75">({allergy.severity})</span>
                        ) : null}
                        <button
                          className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity w-4 h-4 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/30 cursor-pointer"
                          onClick={(e) => { e.stopPropagation(); handleDeactivate(allergy.id); }}
                          title="Desativar"
                        >
                          <span className="text-white text-[11px] leading-none">×</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {allergies.length === 0 && activePatient && (
                <button
                  onClick={() => { setEditingAllergy(undefined); setPopoverOpen(true); }}
                  className="w-full rounded-xl border border-dashed border-[var(--error)]/20 bg-[var(--error)]/5 px-4 py-3 text-left text-[12px] text-[var(--error)] hover:bg-[var(--error)]/10 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  Adicionar alergia
                </button>
              )}

              {/* Ações principais — nome visível como título da área */}
              <div className="rounded-2xl border border-outline-variant bg-surface p-5">
                <h2 className="font-headline text-2xl font-medium text-primary mb-4">
                  {activePatient.name}
                  {ageFromBirthDate(activePatient.birth_date) !== null && (
                    <span className="ml-3 text-base font-normal text-on-surface-muted">
                      · {ageFromBirthDate(activePatient.birth_date)}a
                    </span>
                  )}
                </h2>
                <div className="flex flex-wrap gap-2">
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
              </div>

              {/* Contexto Longitudinal */}
              <section className="space-y-5">

                {/* 2. Problemas ativos */}
                <div className="rounded-2xl border border-outline-variant bg-surface p-5">
                  <h3 className="font-headline text-lg font-medium text-primary mb-3">Problemas ativos</h3>
                  {activeProblems.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {activeProblems.map((problem) => (
                        <span
                          key={problem}
                          className="rounded-full bg-status-crit-bg px-3 py-1.5 text-[12px] font-medium text-status-crit"
                        >
                          {problem}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[13px] text-on-surface-muted">Nenhum problema ativo.</p>
                  )}
                </div>

                {/* 3. Medicação contínua */}
                <div className="rounded-2xl border border-outline-variant bg-surface p-5">
                  <h3 className="font-headline text-lg font-medium text-primary mb-3">Medicação contínua</h3>
                  {medications.length > 0 ? (
                    <div className="space-y-2">
                      {medications.map((medication) => (
                        <div key={medication.id} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-[13px] font-semibold text-on-surface">{medication.medication_name}</span>
                            {medication.dosage && (
                              <span className="text-[12px] text-on-surface-muted">{medication.dosage}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[13px] text-on-surface-muted">Nenhum medicamento contínuo cadastrado.</p>
                  )}
                </div>

                {/* 4. Última consulta */}
                <div className="rounded-2xl border border-outline-variant bg-surface p-5">
                  <h3 className="font-headline text-lg font-medium text-primary mb-3">Última consulta</h3>
                  {loadingDetails ? (
                    <div className="space-y-2">
                      <div className="h-4 bg-surface-lowest rounded animate-pulse w-1/3" />
                      <div className="h-3 bg-surface-lowest rounded animate-pulse w-2/3" />
                    </div>
                  ) : lastConsultation ? (
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="text-[12px] font-bold text-primary">{formatDateBR(lastConsultation.date)}</span>
                        <button
                          onClick={() => router.push(`/historico?patientId=${activePatient.id}`)}
                          className="text-[11px] font-medium text-secondary hover:text-primary transition-colors"
                        >
                          Ver histórico completo →
                        </button>
                      </div>
                      {/* Resumo compacto de 1 linha */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        {lastConsultation.vitals?.pas && lastConsultation.vitals?.pad && (
                          <span className="text-[11px] text-on-surface-muted">
                            PA {lastConsultation.vitals.pas}/{lastConsultation.vitals.pad} mmHg
                          </span>
                        )}
                        {lastConsultation.assessment && (
                          <span className="text-[11px] text-on-surface-muted line-clamp-1">
                            {lastConsultation.assessment.slice(0, 120)}
                            {lastConsultation.assessment.length > 120 ? "..." : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-outline-variant bg-surface-lowest px-4 py-5 text-center">
                      <p className="text-[13px] text-on-surface-muted">
                        Nenhuma consulta registrada. Inicie a primeira consulta para construir o histórico longitudinal.
                      </p>
                    </div>
                  )}
                </div>

              </section>

              {/* TODO(P3): preventivos pendentes — requer query de datas de últimos preventivos por paciente + lógica INCA/MS de elegibilidade */}

            </div>
          )}
        </main>
      </div>
    </>
  );
}
