-- supabase/migrations/004_add_followup_items.sql
ALTER TABLE consultations
ADD COLUMN IF NOT EXISTS followup_items JSONB DEFAULT '[]'::jsonb;
