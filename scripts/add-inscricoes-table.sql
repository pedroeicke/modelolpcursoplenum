-- Tabela de inscrições (formulário "Quero me inscrever")
-- Rodar em: https://supabase.com/dashboard/project/jyackmnjhsdllfqqxund/sql/new

create table if not exists public.inscricoes (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id),
  course_date_id uuid references public.course_dates(id),

  -- Seção 1: Curso
  tipo_instituicao text not null,          -- Órgão Público | Particular | Empresa
  num_inscritos int not null default 1,
  nomes_inscritos text not null,           -- nomes separados por linha
  municipio text not null,
  estado text not null,

  -- Seção 2: Dados para Nota Fiscal
  razao_social text not null,
  cnpj text not null,
  cep text not null,
  endereco text not null,
  numero text not null,
  complemento text,
  bairro text not null,
  cidade text not null,
  uf text not null,

  -- Seção 3: Responsável pela inscrição
  resp_nome text not null,
  resp_cpf text not null,
  resp_email text not null,
  resp_telefone text not null,
  observacoes text,

  -- Seção 4: Pagamento
  forma_pagamento text not null,           -- Cartão de Crédito | Boleto | Cheque | Dinheiro | Depósito Identificado
  data_nota_fiscal date,
  vencimento_igual_inicio boolean not null default false,

  -- Controle
  status text not null default 'nova',     -- nova | em_atendimento | confirmada | cancelada
  email_cliente_enviado boolean not null default false,
  email_plenum_enviado boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists inscricoes_course_id_idx on public.inscricoes(course_id);
create index if not exists inscricoes_created_at_idx on public.inscricoes(created_at desc);

alter table public.inscricoes enable row level security;

-- Admin logado lê as inscrições (igual à tabela leads)
drop policy if exists "Authenticated can read inscricoes" on public.inscricoes;
create policy "Authenticated can read inscricoes"
  on public.inscricoes for select
  to authenticated
  using (true);

-- Inserção só via service_role (API do site) — nenhuma policy de insert para anon/authenticated
