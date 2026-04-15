import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateFolderPdf } from '@/lib/pdf-generator';

export async function POST(request: NextRequest) {
  try {
    const { course_id, course_date_id } = await request.json();

    if (!course_id || !course_date_id) {
      return NextResponse.json(
        { error: 'Missing course_id or course_date_id' },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const pdfBytes = await generateFolderPdf({
      courseId: course_id,
      courseDateId: course_date_id,
      supabase,
      siteBaseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://plenumbrasil.com.br',
      onProgress: (msg) => console.log(`[API PDF] ${msg}`),
    });

    // Upload to Supabase Storage
    const { data: courseData } = await supabase
      .from('courses')
      .select('slug')
      .eq('id', course_id)
      .single();

    const slug = courseData?.slug || 'curso';
    const fileName = `${slug}-${course_date_id.slice(0, 8)}-${Date.now()}.pdf`;
    const filePath = `generated/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('pdfs')
      .upload(filePath, pdfBytes, { contentType: 'application/pdf', upsert: true });

    if (uploadError) {
      return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage
      .from('pdfs')
      .getPublicUrl(filePath);

    // Update course_dates with PDF URL
    await supabase
      .from('course_dates')
      .update({ folder_pdf_url: publicUrl })
      .eq('id', course_date_id);

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('[API PDF] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
