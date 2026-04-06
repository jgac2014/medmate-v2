-- supabase/migrations/005_add_patient_problems.sql
CREATE TABLE IF NOT EXISTS patient_problems (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id  UUID        NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  problem_text TEXT       NOT NULL,
  active      BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS patient_problems_patient_idx ON patient_problems(patient_id);
CREATE INDEX IF NOT EXISTS patient_problems_user_idx    ON patient_problems(user_id);

ALTER TABLE patient_problems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own patient problems"
  ON patient_problems FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
