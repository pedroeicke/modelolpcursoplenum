import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { sendVagaAviso, sendVagaConfirmacao, isEmailConfigured, type VagaEmailData } from '@/lib/email';

/** Currículo fica em bucket privado; o link do e-mail vale 1 ano. */
const BUCKET = 'curriculos';
const VALIDADE_LINK = 60 * 60 * 24 * 365;
const MAX_BYTES = 5 * 1024 * 1024;

function nomeSeguro(nome: string) {
  return nome
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .slice(-80);
}

export async function POST(request: NextRequest) {
  try {
    const dados = await request.formData();
    const texto = (campo: string) => (dados.get(campo)?.toString() || '').trim();

    const nome = texto('nome');
    const email = texto('email');
    if (!nome || !email) {
      return NextResponse.json({ error: 'Preencha ao menos o nome e o e-mail.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 });
    }

    // sem SMTP nada sai; avisa antes de guardar o currículo de alguém à toa
    if (!isEmailConfigured()) {
      console.error('[vagas] SMTP não configurado — candidatura não entregue:', nome, email);
      return NextResponse.json(
        { error: 'O envio por e-mail ainda não está ativo. Escreva para plenumbrasil@gmail.com.' },
        { status: 503 }
      );
    }

    // ── Currículo (opcional) ──
    let curriculoUrl: string | null = null;
    let curriculoNome: string | null = null;
    const arquivo = dados.get('curriculo');
    if (arquivo && arquivo instanceof File && arquivo.size > 0) {
      if (arquivo.size > MAX_BYTES) {
        return NextResponse.json({ error: 'O currículo precisa ter no máximo 5 MB.' }, { status: 400 });
      }
      const supabase = createServiceClient();
      const caminho = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${nomeSeguro(arquivo.name)}`;
      const { error: erroUpload } = await supabase.storage
        .from(BUCKET)
        .upload(caminho, arquivo, { contentType: arquivo.type || 'application/octet-stream', upsert: false });

      if (erroUpload) {
        console.error('[vagas] falha ao guardar currículo:', erroUpload);
      } else {
        curriculoNome = arquivo.name;
        const { data: assinado } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(caminho, VALIDADE_LINK);
        curriculoUrl = assinado?.signedUrl || null;
      }
    }

    const vaga: VagaEmailData = {
      nome,
      email,
      whatsapp: texto('whatsapp') || null,
      interesse: texto('interesse') || 'Não informado',
      area: texto('area') || null,
      linkedin: texto('linkedin') || null,
      mensagem: texto('mensagem') || null,
      curriculoUrl,
      curriculoNome,
    };

    const [avisoOk] = await Promise.all([sendVagaAviso(vaga), sendVagaConfirmacao(vaga)]);
    if (!avisoOk) {
      return NextResponse.json(
        { error: 'Não conseguimos enviar agora. Tente de novo em instantes.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('[vagas] erro:', err);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
