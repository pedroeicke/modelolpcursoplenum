import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/* eslint-disable @typescript-eslint/no-explicit-any */

const ALLOWED_ORIGINS = [
  'https://improbidadecurso.vercel.app',
  'https://plenumbrasil.com.br',
];

function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return NextResponse.json(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const cors = corsHeaders(origin);

  try {
    const body = await request.json();

    const {
      course_id,
      course_date_id,
      form_type,
      nome,
      email,
      whatsapp,
      estado,
      cidade,
      orgao,
    } = body;

    // Validate required fields
    if (!course_id || !form_type || !nome || !email) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: course_id, form_type, nome, email' },
        { status: 400, headers: cors }
      );
    }

    // Validate form_type
    if (!['folder', 'in_company', 'notification'].includes(form_type)) {
      return NextResponse.json(
        { error: 'form_type inválido. Use: folder, in_company ou notification' },
        { status: 400, headers: cors }
      );
    }

    const supabase = await createClient();

    // ── Check if lead already exists for this course + email ──
    const { data: existing } = await supabase
      .from('leads')
      .select('id, created_at')
      .eq('course_id', course_id)
      .eq('email', email)
      .limit(1)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { success: true, existing: true, lead_id: existing.id },
        { status: 200, headers: cors }
      );
    }

    // ── Create new lead ──
    const lead = {
      course_id,
      course_date_id: course_date_id || null,
      form_type,
      nome,
      email,
      whatsapp: whatsapp || null,
      estado: estado || null,
      cidade: cidade || null,
      orgao: orgao || null,
    };

    const { data: newLead, error } = await supabase
      .from('leads')
      .insert(lead as any)
      .select('id')
      .single();

    if (error) {
      console.error('Error inserting lead:', error);
      return NextResponse.json(
        { error: 'Erro ao salvar dados. Tente novamente.' },
        { status: 500, headers: cors }
      );
    }

    return NextResponse.json(
      { success: true, existing: false, lead_id: (newLead as any)?.id },
      { status: 201, headers: cors }
    );
  } catch (err) {
    console.error('Leads API error:', err);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500, headers: cors }
    );
  }
}
