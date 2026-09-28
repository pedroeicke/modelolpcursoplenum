import { createClient } from '@/lib/supabase/server';
import { getAllCourses } from '@/lib/queries/courses';
import LeadsClient, { type InscricaoRow, type LeadRow, type TurmaOpcao } from '@/components/admin/LeadsClient';

export default async function AdminLeadsPage() {
  const supabase = await createClient();

  const [{ data: leadsData }, { data: inscricoesData }, { data: turmasData }] = await Promise.all([
    supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(200),
    supabase.from('inscricoes').select('*').order('created_at', { ascending: false }).limit(200),
    // a data da turma aparece junto do curso no card da inscrição
    supabase.from('course_dates').select('id, label, start_date'),
  ]);

  const leads = (leadsData || []) as unknown as LeadRow[];
  const inscricoes = (inscricoesData || []) as unknown as InscricaoRow[];

  const courses = await getAllCourses();
  const cursos = courses.map((c) => ({ id: c.id, title: c.title }));
  const turmas = (turmasData || []) as unknown as TurmaOpcao[];

  return <LeadsClient leads={leads} inscricoes={inscricoes} cursos={cursos} turmas={turmas} />;
}
