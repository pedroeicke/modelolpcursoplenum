import { createClient } from '@/lib/supabase/server';
import GerarPdfForm from './GerarPdfForm';

export const dynamic = 'force-dynamic';

interface CourseOption {
  id: string;
  slug: string;
  title: string;
}

export default async function GerarPdfPage() {
  const supabase = await createClient();

  // NOTE: a tabela de cursos neste projeto é `courses` (não `lp_courses`).
  const { data } = await supabase
    .from('courses')
    .select('id, slug, title')
    .order('updated_at', { ascending: false });

  const courses = (data ?? []) as CourseOption[];

  return (
    <div className="max-w-6xl mx-auto py-8 px-2 sm:px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Gerar Folder PDF</h1>
        <p className="text-sm text-gray-500 mt-1">
          Selecione o curso e a turma, ajuste o layout se necessário e gere o folder em PDF.
        </p>
      </div>

      <GerarPdfForm courses={courses} />
    </div>
  );
}
