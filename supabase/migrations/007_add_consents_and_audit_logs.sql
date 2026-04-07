CREATE TABLE IF NOT EXISTS public.user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('terms', 'privacy')),
  version TEXT NOT NULL,
  accepted_via TEXT NOT NULL DEFAULT 'signup',
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS user_consents_user_document_version_idx
  ON public.user_consents(user_id, document_type, version);

CREATE INDEX IF NOT EXISTS user_consents_user_idx
  ON public.user_consents(user_id);

ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_consents_read_own"
  ON public.user_consents FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "user_consents_insert_own"
  ON public.user_consents FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS audit_logs_actor_idx
  ON public.audit_logs(actor_id, created_at DESC);

CREATE INDEX IF NOT EXISTS audit_logs_event_idx
  ON public.audit_logs(event_type, created_at DESC);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_logs_read_own"
  ON public.audit_logs FOR SELECT
  USING (actor_id = auth.uid());

CREATE POLICY "audit_logs_insert_own"
  ON public.audit_logs FOR INSERT
  WITH CHECK (actor_id = auth.uid());

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;
