-- Migration 009: Timer columns and feedback_submissions table

-- 1. ALTER TABLE consultations — add timer columns
ALTER TABLE consultations
  ADD COLUMN consultation_started_at timestamptz,
  ADD COLUMN consultation_finished_at timestamptz,
  ADD COLUMN consultation_active_seconds int;

-- 2. CREATE TABLE feedback_submissions
CREATE TABLE feedback_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('sugestao', 'bug', 'dificuldade', 'elogio')),
  area text NOT NULL CHECK (area IN ('consulta', 'exames', 'receituario', 'pacientes', 'historico', 'conta', 'outro')),
  message text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'planned', 'done', 'rejected')),
  contact_ok boolean NOT NULL DEFAULT false,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. RLS
ALTER TABLE feedback_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY feedback_own_data ON feedback_submissions
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 4. Indexes
CREATE INDEX idx_feedback_user_id ON feedback_submissions(user_id);
CREATE INDEX idx_feedback_status ON feedback_submissions(status);
CREATE INDEX idx_feedback_created_at ON feedback_submissions(created_at DESC);
