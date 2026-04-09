-- Migration 008: Tabela de prescrições avulsas (Receituário Particular)
-- Referência: Plano_Receituario_Particular.docx — Abril 2026

CREATE TABLE IF NOT EXISTS public.prescricoes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  -- Dados do paciente (sem criar prontuário)
  patient_name  TEXT NOT NULL,
  patient_cpf   TEXT,
  patient_address TEXT,

  -- Data da prescrição (ISO 8601 no banco; DD/MM/AAAA na UI)
  rx_date       DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Tipo: simples | controle_especial | misto
  rx_type       TEXT NOT NULL CHECK (rx_type IN ('simples', 'controle_especial', 'misto')),

  -- Lista de medicamentos prescritos (snapshot completo)
  meds          JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- PDF gerado (caminho no Supabase Storage, bucket 'prescricoes')
  pdf_path      TEXT,

  -- Assinatura digital ICP-Brasil
  digital_signature_used BOOLEAN NOT NULL DEFAULT false,
  signature_provider     TEXT,    -- 'vidas' | 'a1' | 'a3' | null

  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS prescricoes_user_idx
  ON public.prescricoes(user_id, created_at DESC);

ALTER TABLE public.prescricoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "prescricoes_select_own"
  ON public.prescricoes FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "prescricoes_insert_own"
  ON public.prescricoes FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "prescricoes_update_own"
  ON public.prescricoes FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "prescricoes_delete_own"
  ON public.prescricoes FOR DELETE
  USING (user_id = auth.uid());
