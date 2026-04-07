"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createPatient, updatePatient } from "@/lib/supabase/patients";
import type { Patient } from "@/types";

interface PatientFormModalProps {
  open: boolean;
  userId: string | null;
  patient: Patient | null;
  onClose: () => void;
  onSaved: (patient: Patient) => void;
}

export function PatientFormModal({
  open,
  userId,
  patient,
  onClose,
  onSaved,
}: PatientFormModalProps) {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [race, setRace] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setName(patient?.name ?? "");
    setBirthDate(patient?.birth_date ?? "");
    setGender(patient?.gender ?? "");
    setRace(patient?.race ?? "");
    setCpf(patient?.cpf ?? "");
    setPhone(patient?.phone ?? "");
    setError("");
  }, [open, patient]);

  if (!open) return null;

  async function handleSubmit() {
    if (!userId || !name.trim()) return;

    setSaving(true);
    setError("");

    try {
      const payload = {
        name: name.trim(),
        birth_date: birthDate || null,
        gender: gender || null,
        race: race || null,
        cpf: cpf || null,
        phone: phone || null,
      };

      const savedPatient = patient
        ? await updatePatient(patient.id, userId, payload)
        : await createPatient(userId, payload);

      onSaved(savedPatient);
      onClose();
    } catch {
      setError("Não foi possível salvar o paciente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 w-[560px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-outline-variant bg-surface-lowest p-6 shadow-[0_24px_48px_rgba(23,28,31,0.16)]">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-headline text-2xl font-medium text-primary">
              {patient ? "Editar paciente" : "Novo paciente"}
            </h2>
            <p className="mt-1 text-sm text-on-surface-muted">
              Cadastro enxuto para começar a consulta sem atrito.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-xl text-on-surface-muted transition-colors hover:text-on-surface"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Input
              label="Nome completo"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nome do paciente"
            />
          </div>

          <Input
            label="Data de nascimento"
            type="date"
            value={birthDate}
            onChange={(event) => setBirthDate(event.target.value)}
          />

          <Input
            label="Telefone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="(00) 00000-0000"
          />

          <div>
            <label className="mb-1 block text-[13px] font-medium text-on-surface-variant">Sexo</label>
            <select
              value={gender}
              onChange={(event) => setGender(event.target.value)}
              className="h-[40px] w-full border-0 border-b-2 border-outline-variant/40 bg-transparent text-[14px] text-on-surface focus:border-primary focus:outline-none"
            >
              <option value="">—</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-[13px] font-medium text-on-surface-variant">Raça/Cor</label>
            <select
              value={race}
              onChange={(event) => setRace(event.target.value)}
              className="h-[40px] w-full border-0 border-b-2 border-outline-variant/40 bg-transparent text-[14px] text-on-surface focus:border-primary focus:outline-none"
            >
              <option value="">—</option>
              <option value="Branco">Branco</option>
              <option value="Pardo">Pardo</option>
              <option value="Preto">Preto</option>
              <option value="Amarelo">Amarelo</option>
              <option value="Indígena">Indígena</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <Input
              label="CPF"
              value={cpf}
              onChange={(event) => setCpf(event.target.value)}
              placeholder="000.000.000-00"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-status-crit/20 bg-status-crit-bg px-3 py-2.5 text-[13px] text-status-crit">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={saving || !name.trim()}>
            {saving ? "Salvando..." : patient ? "Salvar alterações" : "Criar paciente"}
          </Button>
        </div>
      </div>
    </>
  );
}
