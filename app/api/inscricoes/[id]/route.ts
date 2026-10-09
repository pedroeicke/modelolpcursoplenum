import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { comModalidade, leModalidade } from '@/lib/inscricao-modalidade';

/**
 * Correção de inscrição pelo painel.
 *
 * O vendedor digita os dados do cliente por telefone e erra nome, CPF ou
 * e-mail de vez em quando; antes disso aqui não havia como consertar — a tela
 * de Leads e Inscrições era só leitura.
 *
 * Só quem está logado no admin edita. A gravação usa a chave de serviço porque
 * o RLS da tabela não libera escrita para a chave pública.
 */

/** O que o vendedor pode corrigir. Curso, turma e datas ficam de fora; status e modalidade vão à parte. */
const CAMPOS_EDITAVEIS = [
  'tipo_instituicao', 'forma_pagamento',
  'num_inscritos', 'nomes_inscritos', 'municipio', 'estado',
  'razao_social', 'cnpj', 'cep', 'endereco', 'numero', 'complemento', 'bairro', 'cidade', 'uf',
  'resp_nome', 'resp_cpf', 'resp_email', 'resp_telefone',
] as const;

/**
 * Status que o painel pode gravar: aguardando confirmação (contato feito, falta
 * o cliente confirmar), cancelar (duplicada ou desistência) e voltar para nova.
 */
const STATUS_PERMITIDOS = ['nova', 'aguardando_confirmacao', 'cancelada'];

const TIPOS_INSTITUICAO = ['Órgão Público', 'Particular', 'Empresa'];
const FORMAS_PAGAMENTO = ['PIX', 'Transferência bancária', 'Boleto', 'Link de cartão de crédito'];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const mudancas: Record<string, unknown> = {};
    for (const campo of CAMPOS_EDITAVEIS) {
      if (campo in body) {
        const v = body[campo];
        mudancas[campo] = campo === 'num_inscritos' ? Number(v) || 1
          : typeof v === 'string' ? v.trim()
          : v;
      }
    }
    if ('num_inscritos' in mudancas) {
      const n = mudancas.num_inscritos as number;
      if (!Number.isInteger(n) || n < 1 || n > 200) {
        return NextResponse.json({ error: 'Quantidade de inscritos inválida' }, { status: 400 });
      }
    }
    if ('status' in body) {
      if (!STATUS_PERMITIDOS.includes(body.status)) {
        return NextResponse.json({ error: 'Status inválido' }, { status: 400 });
      }
      mudancas.status = body.status;
    }

    // Mesmas opções do formulário público: qualquer outra coisa quebraria os
    // rótulos da tela (Particular troca Razão social/CNPJ por Nome/CPF).
    if ('tipo_instituicao' in mudancas &&
        !TIPOS_INSTITUICAO.includes(mudancas.tipo_instituicao as string)) {
      return NextResponse.json({ error: 'Tipo de instituição inválido' }, { status: 400 });
    }

    if ('forma_pagamento' in mudancas &&
        !FORMAS_PAGAMENTO.includes(mudancas.forma_pagamento as string)) {
      return NextResponse.json({ error: 'Forma de pagamento inválida' }, { status: 400 });
    }

    const servico = createServiceClient();

    // Modalidade não tem coluna: fica marcada no começo das observações. Troca a
    // marca e preserva o que o inscrito escreveu.
    if ('modalidade' in body) {
      if (body.modalidade !== 'presencial' && body.modalidade !== 'online') {
        return NextResponse.json({ error: 'Modalidade inválida' }, { status: 400 });
      }
      const { data: atual, error: erroLeitura } = await (servico as any)
        .from('inscricoes').select('observacoes').eq('id', id).single();
      if (erroLeitura || !atual) {
        return NextResponse.json({ error: 'Inscrição não encontrada' }, { status: 404 });
      }
      mudancas.observacoes = comModalidade(leModalidade(atual.observacoes).observacoes, body.modalidade);
    }

    if (Object.keys(mudancas).length === 0) {
      return NextResponse.json({ error: 'Nada para alterar' }, { status: 400 });
    }

    const { data, error } = await (servico as any)
      .from('inscricoes')
      .update(mudancas)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[inscricoes] erro ao corrigir', error);
      return NextResponse.json({ error: 'Não foi possível salvar' }, { status: 500 });
    }

    return NextResponse.json({ inscricao: data });
  } catch (e) {
    console.error('[inscricoes] erro inesperado', e);
    return NextResponse.json({ error: 'Erro inesperado' }, { status: 500 });
  }
}
