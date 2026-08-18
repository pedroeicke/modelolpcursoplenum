import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { sendClienteConfirmacao, sendPlenumAviso, type InscricaoEmailData } from '@/lib/email';
import { comModalidade, LABEL_MODALIDADE, type Modalidade } from '@/lib/inscricao-modalidade';

/* eslint-disable @typescript-eslint/no-explicit-any */

const CAMPOS_OBRIGATORIOS = [
  'course_id',
  'tipo_instituicao',
  'num_inscritos',
  'nomes_inscritos',
  'municipio',
  'estado',
  'razao_social',
  'cnpj',
  'cep',
  'endereco',
  'numero',
  'bairro',
  'cidade',
  'uf',
  'resp_nome',
  'resp_cpf',
  'resp_email',
  'resp_telefone',
  'forma_pagamento',
] as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const faltando = CAMPOS_OBRIGATORIOS.filter(
      (c) => body[c] === undefined || body[c] === null || String(body[c]).trim() === ''
    );
    if (faltando.length > 0) {
      return NextResponse.json(
        { error: `Campos obrigatórios faltando: ${faltando.join(', ')}` },
        { status: 400 }
      );
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.resp_email);
    if (!emailOk) {
      return NextResponse.json({ error: 'E-mail inválido' }, { status: 400 });
    }

    const supabase = createServiceClient();

    // dados do curso/turma para os e-mails
    const { data: course } = await supabase
      .from('courses')
      .select('id, title')
      .eq('id', body.course_id)
      .single();
    if (!course) {
      return NextResponse.json({ error: 'Curso não encontrado' }, { status: 400 });
    }

    let turmaLabel = 'A definir';
    if (body.course_date_id) {
      const { data: turma } = await supabase
        .from('course_dates')
        .select('id, label, start_date')
        .eq('id', body.course_date_id)
        .single();
      if (turma) {
        turmaLabel =
          (turma as any).label ||
          new Date((turma as any).start_date).toLocaleDateString('pt-BR');
      }
    }

    const inscricao = {
      course_id: body.course_id,
      course_date_id: body.course_date_id || null,
      tipo_instituicao: body.tipo_instituicao,
      num_inscritos: Number(body.num_inscritos) || 1,
      nomes_inscritos: body.nomes_inscritos,
      municipio: body.municipio,
      estado: body.estado,
      razao_social: body.razao_social,
      cnpj: body.cnpj,
      cep: body.cep,
      endereco: body.endereco,
      numero: body.numero,
      complemento: body.complemento || null,
      bairro: body.bairro,
      cidade: body.cidade,
      uf: body.uf,
      resp_nome: body.resp_nome,
      resp_cpf: body.resp_cpf,
      resp_email: body.resp_email,
      resp_telefone: body.resp_telefone,
      observacoes: comModalidade(body.observacoes, body.modalidade),
      forma_pagamento: body.forma_pagamento,
      data_nota_fiscal: body.data_nota_fiscal || null,
      vencimento_igual_inicio: !!body.vencimento_igual_inicio,
    };

    const { data: nova, error } = await supabase
      .from('inscricoes')
      .insert(inscricao as any)
      .select('id')
      .single();

    if (error) {
      console.error('Erro ao inserir inscricao:', error);
      return NextResponse.json(
        { error: 'Erro ao salvar inscrição. Tente novamente.' },
        { status: 500 }
      );
    }

    // ── E-mails (best-effort: falha não derruba a inscrição) ──
    const emailData: InscricaoEmailData = {
      cursoTitulo: (course as any).title,
      turmaLabel,
      respNome: body.resp_nome,
      respEmail: body.resp_email,
      respTelefone: body.resp_telefone,
      numInscritos: Number(body.num_inscritos) || 1,
      nomesInscritos: body.nomes_inscritos,
      orgaoRazaoSocial: body.razao_social,
      municipio: body.municipio,
      estado: body.estado,
      formaPagamento: body.forma_pagamento,
      modalidade:
        body.modalidade === 'online' || body.modalidade === 'presencial'
          ? LABEL_MODALIDADE[body.modalidade as Modalidade]
          : null,
    };

    const [clienteOk, plenumOk] = await Promise.all([
      sendClienteConfirmacao(emailData),
      sendPlenumAviso(emailData),
    ]);

    if (clienteOk || plenumOk) {
      await supabase
        .from('inscricoes')
        .update({
          email_cliente_enviado: clienteOk,
          email_plenum_enviado: plenumOk,
        } as any)
        .eq('id', (nova as any).id);
    }

    return NextResponse.json(
      { success: true, inscricao_id: (nova as any).id },
      { status: 201 }
    );
  } catch (err) {
    console.error('Inscricoes API error:', err);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
