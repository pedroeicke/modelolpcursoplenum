import { createClient } from '@supabase/supabase-js';
import { fetchPdfData } from './lib/data.ts';
import { loadFonts } from './lib/fonts.ts';
import { renderPageToPng, assemblePdf, wasmReady } from './lib/renderer.ts';
import type { PdfContext, SatoriNode, ImageCache } from './lib/types.ts';

// Page renderers — only cover + closing to stay within Edge Function timeout
import { renderCover } from './pages/cover.ts';
import { renderClosing } from './pages/closing.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function ts(): string {
  return new Date().toISOString();
}

Deno.serve(async (req: Request) => {
  console.log(`[${ts()}] ▶ Edge Function invoked: ${req.method} ${req.url}`);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    // ─── STEP 1: Auth ─────────────────────────────────────────
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await authClient.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    console.log(`[${ts()}] ✓ Auth OK: ${user.email}`);

    // ─── STEP 2: Parse body ───────────────────────────────────
    let body: Record<string, string>;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { course_id, course_date_id } = body;
    if (!course_id || !course_date_id) {
      return new Response(JSON.stringify({ error: 'Missing course_id or course_date_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    console.log(`[${ts()}] ✓ Body: course_id=${course_id}, date=${course_date_id}`);

    // ─── STEP 3: PARALLEL — fetch data + ensure WASM ready ───
    console.log(`[${ts()}] [PARALLEL] Starting data fetch + WASM init...`);
    const parallelStart = Date.now();
    const [data] = await Promise.all([
      fetchPdfData(course_id, course_date_id),
      wasmReady,
    ]);
    console.log(`[${ts()}] ✓ Data + WASM ready in ${Date.now() - parallelStart}ms`);

    const siteBaseUrl = Deno.env.get('SITE_BASE_URL') || 'https://plenumbrasil.com.br';

    // ─── STEP 4: Load fonts ───────────────────────────────────
    console.log(`[${ts()}] Loading fonts...`);
    const fontStart = Date.now();
    const fonts = await loadFonts(data.ds);
    const imageCache: ImageCache = new Map();
    console.log(`[${ts()}] ✓ ${fonts.length} fonts loaded in ${Date.now() - fontStart}ms`);

    // ─── STEP 5: Build pages (cover + closing only) ───────────
    const ctx: PdfContext = { ...data, siteBaseUrl, imageCache };
    const pageElements: SatoriNode[] = [];

    console.log(`[${ts()}] Building cover...`);
    pageElements.push(renderCover(ctx, fonts));

    console.log(`[${ts()}] Building closing...`);
    pageElements.push(renderClosing(ctx, fonts));

    console.log(`[${ts()}] ✓ ${pageElements.length} pages built`);

    // ─── STEP 6: Render to PNG ────────────────────────────────
    console.log(`[${ts()}] Rendering ${pageElements.length} pages to PNG...`);
    const pngPages: Uint8Array[] = [];
    for (let i = 0; i < pageElements.length; i++) {
      const t0 = Date.now();
      const png = await renderPageToPng(pageElements[i], fonts);
      console.log(`[${ts()}] ✓ Page ${i + 1}: ${(png.length / 1024).toFixed(0)}KB in ${Date.now() - t0}ms`);
      pngPages.push(png);
    }

    // ─── STEP 7: Assemble PDF ─────────────────────────────────
    console.log(`[${ts()}] Assembling PDF...`);
    const pdfBytes = await assemblePdf(pngPages);
    console.log(`[${ts()}] ✓ PDF: ${(pdfBytes.length / 1024).toFixed(0)}KB`);

    // ─── STEP 8: Upload ───────────────────────────────────────
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const adminClient = createClient(supabaseUrl, serviceKey);

    const fileName = `${data.course.slug}-${course_date_id.slice(0, 8)}-${Date.now()}.pdf`;
    const filePath = `generated/${fileName}`;

    console.log(`[${ts()}] Uploading ${filePath}...`);
    const { error: uploadError } = await adminClient.storage
      .from('pdfs')
      .upload(filePath, pdfBytes, { contentType: 'application/pdf', upsert: true });

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

    const { data: { publicUrl } } = adminClient.storage
      .from('pdfs')
      .getPublicUrl(filePath);

    await adminClient
      .from('course_dates')
      .update({ folder_pdf_url: publicUrl })
      .eq('id', course_date_id);

    const totalMs = Date.now() - startTime;
    console.log(`[${ts()}] ✅ PDF DONE in ${totalMs}ms — ${publicUrl}`);

    return new Response(JSON.stringify({ success: true, url: publicUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const totalMs = Date.now() - startTime;
    console.error(`[${ts()}] ❌ FAILED after ${totalMs}ms:`, error instanceof Error ? error.message : error);
    if (error instanceof Error && error.stack) console.error(error.stack);

    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
