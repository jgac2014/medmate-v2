"use client";

import { useConsultationStore } from "@/stores/consultation-store";
import { SectionHeader } from "@/components/ui/section-header";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import { RACE_OPTIONS, GENDER_OPTIONS } from "@/lib/constants";

export function PatientInfo() {
  const { patient, setPatient } = useConsultationStore();

  return (
    <div className="mb-3.5">
      <SectionHeader label="Identificação" color="blue" />
      <Input
        label="Nome"
        id="patient-name"
        placeholder="Nome do paciente"
        value={patient.name}
        onChange={(e) => setPatient({ name: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-[5px]">
        <Input
          label="Idade"
          id="patient-age"
          type="number"
          placeholder="anos"
          min={0}
          max={120}
          value={patient.age}
          onChange={(e) => setPatient({ age: e.target.value })}
        />
        <div className="mb-2">
          <label className="block text-[10.5px] text-on-surface-muted mb-0.5 font-medium">
            Raça
          </label>
          <select
            value={patient.race}
            onChange={(e) => setPatient({ race: e.target.value as typeof patient.race })}
            className="w-full h-[29px] px-2 border border-outline-variant rounded-[5px] bg-surface-container text-on-surface font-sans text-xs cursor-pointer focus:outline-none focus:border-primary"
          >
            <option value="">--</option>
            {RACE_OPTIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mb-2">
        <label className="block text-[10.5px] text-on-surface-muted mb-0.5 font-medium">
          Gênero
        </label>
        <div className="flex gap-3 mt-0.5">
          {GENDER_OPTIONS.map((g) => (
            <label key={g} className="flex items-center gap-1 text-xs cursor-pointer text-on-surface-variant">
              <input
                type="radio"
                name="gender"
                value={g}
                checked={patient.gender === g}
                onChange={() => setPatient({ gender: g })}
                className="accent-accent"
              />
              {g === "Masculino" ? "Masc." : g === "Feminino" ? "Fem." : "Outro"}
            </label>
          ))}
        </div>
      </div>
      <DateInput
        label="Data da consulta"
        value={patient.consultationDate}
        onChange={(v) => setPatient({ consultationDate: v })}
      />
    </div>
  );
}
