import { NextRequest, NextResponse } from 'next/server';

const PDF_URL = process.env.PDF_GENERATOR_URL || 'http://77.237.247.129:59542';
const PDF_TOKEN = process.env.PDF_GENERATOR_API_TOKEN || 'plnm-621e4b511104b6c63ccd6b3f5d2d178e';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { edition_id, section_overrides, debug } = body;

    if (!edition_id) {
      return NextResponse.json(
        { error: 'edition_id é obrigatório' },
        { status: 400 },
      );
    }

    // Build request to external PDF generator
    const apiUrl = `${PDF_URL}/api/v1/generate-pdf${debug ? '?debug=true' : ''}`;
    const apiBody: Record<string, unknown> = { edition_id };
    if (section_overrides && Object.keys(section_overrides).length > 0) {
      apiBody.section_overrides = section_overrides;
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PDF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      return NextResponse.json(
        { error: errorData.message || `Erro ${response.status}`, details: errorData },
        { status: response.status },
      );
    }

    // Debug mode returns HTML
    if (debug) {
      const html = await response.text();
      return new NextResponse(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // Normal mode returns JSON with pdf_url
    const data = await response.json();
    return NextResponse.json({
      success: true,
      url: data.pdf_url,
      generated_at: data.generated_at,
      edition_id: data.edition_id,
    });
  } catch (error) {
    console.error('[API generate-pdf] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno' },
      { status: 500 },
    );
  }
}
