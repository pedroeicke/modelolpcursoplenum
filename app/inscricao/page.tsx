import { createClient } from '@/lib/supabase/server';
import InscricaoForm, { type CursoOption } from './InscricaoForm';
import { turmaVigente } from '@/lib/turma-vigente';

/* eslint-disable @typescript-eslint/no-explicit-any */

export const metadata = {
  title: 'Inscrição — Instituto Plenum Brasil',
  description: 'Faça sua inscrição nos cursos do Instituto Plenum Brasil.',
};

export const revalidate = 60;

export default async function InscricaoPage({
  searchParams,
}: {
  searchParams: Promise<{ curso?: string; turma?: string; modalidade?: string }>;
}) {
  const { curso: cursoSlug, turma: turmaId, modalidade } = await searchParams;
  const supabase = await createClient();

  // Cursos publicados
  const { data: courses } = await supabase
    .from('courses')
    .select('id, slug, title, modality')
    .eq('status', 'published')
    .order('title', { ascending: true });

  // Turmas abertas de todos os cursos
  const { data: dates } = await supabase
    .from('course_dates')
    .select('id, course_id, label, start_date, end_date, status')
    .eq('status', 'open')
    .order('start_date', { ascending: true });

  // Turma que já aconteceu não entra na lista: sem isso, um link antigo
  // (Google, WhatsApp, folder impresso) ainda inscrevia gente em curso passado.
  const agora = Date.now();
  const turmasByCourse = new Map<string, { id: string; label: string }[]>();
  for (const d of ((dates || []) as any[]).filter((d) => turmaVigente(d, agora))) {
    if (!turmasByCourse.has(d.course_id)) turmasByCourse.set(d.course_id, []);
    turmasByCourse.get(d.course_id)!.push({
      id: d.id,
      label:
        d.label ||
        new Date(d.start_date).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
    });
  }

  const cursos: CursoOption[] = ((courses || []) as any[]).map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    modality: c.modality,
    turmas: turmasByCourse.get(c.id) || [],
  }));

  return (
    <main className="min-h-screen bg-[#F4F5F7] text-[#030D1F]">
      <InscricaoForm
        cursos={cursos}
        cursoSlugInicial={cursoSlug || null}
        turmaIdInicial={turmaId || null}
        modalidadeInicial={modalidade === 'online' ? 'online' : modalidade === 'presencial' ? 'presencial' : null}
      />
    </main>
  );
}
