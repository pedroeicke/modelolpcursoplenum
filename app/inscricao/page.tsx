import { createClient } from '@/lib/supabase/server';
import InscricaoForm, { type CursoOption } from './InscricaoForm';
import { inscricoesEncerradas, turmaVigente } from '@/lib/turma-vigente';

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

  // Turmas abertas e encerradas de todos os cursos (as encerradas só para saber
  // quais cursos estão com as inscrições encerradas)
  const { data: dates } = await supabase
    .from('course_dates')
    .select('id, course_id, label, start_date, end_date, status')
    .in('status', ['open', 'closed'])
    .order('start_date', { ascending: true });

  const agora = Date.now();
  const turmasDoCurso = new Map<string, any[]>();
  for (const d of (dates || []) as any[]) {
    if (!turmasDoCurso.has(d.course_id)) turmasDoCurso.set(d.course_id, []);
    turmasDoCurso.get(d.course_id)!.push(d);
  }

  // Turma que já aconteceu não entra na lista: sem isso, um link antigo
  // (Google, WhatsApp, folder impresso) ainda inscrevia gente em curso passado.
  const turmasByCourse = new Map<string, { id: string; label: string }[]>();
  for (const d of ((dates || []) as any[]).filter((d) => d.status === 'open' && turmaVigente(d, agora))) {
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

  // Curso com as inscrições encerradas não é oferecido (nem por link com ?curso=)
  const cursos: CursoOption[] = ((courses || []) as any[])
    .filter((c) => !inscricoesEncerradas(turmasDoCurso.get(c.id) || [], agora))
    .map((c) => ({
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
