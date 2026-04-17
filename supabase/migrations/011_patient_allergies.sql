-- Migration 011: patient_allergies
-- Alergias como registro longitudinal do paciente.
-- Dado crítico que deve estar sempre visível no perfil e alimentar history.allergies da consulta.

CREATE TABLE patient_allergies (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id   UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES auth.users(id),
  allergy_text TEXT NOT NULL,
  severity     TEXT CHECK (severity IN ('leve', 'moderada', 'grave')) DEFAULT 'moderada',
  active       BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE patient_allergies ENABLE ROW LEVEL SECURITY;

-- Proprietário pode criar, ler, atualizar
CREATE POLICY "Owner can manage allergies"
  ON patient_allergies
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Índice para busca rápida por paciente
CREATE INDEX ON patient_allergies (patient_id) WHERE active = true;
