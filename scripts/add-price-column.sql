-- Adiciona o campo de preço (por curso) na tabela courses.
-- Rode no Supabase: Dashboard > SQL Editor > New query > cole e Run.
-- Valor em reais (ex: 1590.00). NULL = sem preço definido (não exibe na LP).

ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS price numeric(10,2);

COMMENT ON COLUMN public.courses.price IS 'Valor da inscrição do curso, em reais. NULL = não exibir.';
