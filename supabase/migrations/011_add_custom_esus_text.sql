-- 011: Persiste texto eSUS editado manualmente na tabela consultations
-- Permite que edições manuais sobrevivam ao reload/reabertura da consulta

ALTER TABLE consultations
ADD COLUMN IF NOT EXISTS custom_esus_text TEXT;
