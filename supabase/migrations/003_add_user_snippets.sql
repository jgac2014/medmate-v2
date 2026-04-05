-- supabase/migrations/003_add_user_snippets.sql
CREATE TABLE public.user_snippets (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category    text NOT NULL CHECK (category IN ('orientacao', 'prescricao', 'conduta', 'exames')),
  title       text NOT NULL,
  body        text NOT NULL,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.user_snippets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "snippets_own_data" ON public.user_snippets FOR ALL USING (user_id = auth.uid());
CREATE INDEX idx_user_snippets_user_id ON public.user_snippets(user_id);
