-- 010: Fix RLS performance (auth.uid() init plan) + search_path security

-- Fix handle_new_user: set search_path = public to prevent privilege escalation
-- SECURITY DEFINER functions with mutable search_path can be exploited to
-- escalate privileges via malicious schema search path.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.users (id, email, name, trial_ends_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Médico'),
    now() + interval '14 days'
  );

  IF NEW.raw_user_meta_data->>'terms_version' IS NOT NULL THEN
    INSERT INTO public.user_consents (user_id, document_type, version, accepted_via)
    VALUES (NEW.id, 'terms', NEW.raw_user_meta_data->>'terms_version', 'signup')
    ON CONFLICT (user_id, document_type, version) DO NOTHING;
  END IF;

  IF NEW.raw_user_meta_data->>'privacy_version' IS NOT NULL THEN
    INSERT INTO public.user_consents (user_id, document_type, version, accepted_via)
    VALUES (NEW.id, 'privacy', NEW.raw_user_meta_data->>'privacy_version', 'signup')
    ON CONFLICT (user_id, document_type, version) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$function$;

-- Fix RLS policies: use (select auth.uid()) to avoid per-row re-evaluation.
-- Without this, auth.uid() is re-evaluated for every row scanned, causing
-- N+1 query overhead at scale (Supabase linter: auth_rls_initplan).
-- Applies to ALL tables with RLS policies.

-- audit_logs
DROP POLICY IF EXISTS audit_logs_read_own ON audit_logs;
CREATE POLICY audit_logs_read_own ON audit_logs FOR SELECT USING (actor_id = (select auth.uid()));

-- consultations
DROP POLICY IF EXISTS consultations_own_data ON consultations;
CREATE POLICY consultations_own_data ON consultations FOR ALL
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- feedback_submissions
DROP POLICY IF EXISTS feedback_own_data ON feedback_submissions;
CREATE POLICY feedback_own_data ON feedback_submissions FOR ALL
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- patients
DROP POLICY IF EXISTS patients_own_data ON patients;
CREATE POLICY patients_own_data ON patients FOR ALL
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- patient_medications
DROP POLICY IF EXISTS "Users manage own patient medications" ON patient_medications;
CREATE POLICY "Users manage own patient medications" ON patient_medications FOR ALL
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- patient_problems
DROP POLICY IF EXISTS "Users manage own patient problems" ON patient_problems;
CREATE POLICY "Users manage own patient problems" ON patient_problems FOR ALL
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- prescricoes
DROP POLICY IF EXISTS prescricoes_select_own ON prescricoes;
CREATE POLICY prescricoes_select_own ON prescricoes FOR SELECT
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS prescricoes_update_own ON prescricoes;
CREATE POLICY prescricoes_update_own ON prescricoes FOR UPDATE
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS prescricoes_delete_own ON prescricoes;
CREATE POLICY prescricoes_delete_own ON prescricoes FOR DELETE
  USING ((select auth.uid()) = user_id);

-- user_consents
DROP POLICY IF EXISTS user_consents_read_own ON user_consents;
CREATE POLICY user_consents_read_own ON user_consents FOR SELECT
  USING ((select auth.uid()) = user_id);

-- user_snippets
DROP POLICY IF EXISTS snippets_own_data ON user_snippets;
CREATE POLICY snippets_own_data ON user_snippets FOR ALL
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- users
DROP POLICY IF EXISTS users_read_own ON users;
CREATE POLICY users_read_own ON users FOR SELECT
  USING (id = (select auth.uid()));

DROP POLICY IF EXISTS users_update_own ON users;
CREATE POLICY users_update_own ON users FOR UPDATE
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));
