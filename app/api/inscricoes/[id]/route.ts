import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';

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

/** O que o vendedor pode corrigir. Curso, turma, datas e status ficam de fora. */
const CAMPOS_EDITAVEIS = [
  'num_inscritos', 'nomes_inscritos', 'municipio', 'estado',
  'razao_social', 'cnpj', 'cep', 'endereco', 'numero', 'complemento', 'bairro', 'cidade', 'uf',
  'resp_nome', 'resp_cpf', 'resp_email', 'resp_telefone',
] as const;

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
    if (Object.keys(mudancas).length === 0) {
      return NextResponse.json({ error: 'Nada para alterar' }, { status: 400 });
    }

    const servico = createServiceClient();
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
