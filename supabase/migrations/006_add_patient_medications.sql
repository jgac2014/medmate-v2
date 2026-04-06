-- 006_add_patient_medications.sql
-- Medicamentos contínuos por paciente

CREATE TABLE IF NOT EXISTS patient_medications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  medication_name TEXT NOT NULL,
  dosage TEXT NOT NULL DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  discontinued_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_patient_medications_patient ON patient_medications(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_medications_user ON patient_medications(user_id);

ALTER TABLE patient_medications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own patient medications"
  ON patient_medications
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
