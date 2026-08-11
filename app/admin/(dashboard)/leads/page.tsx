import { createClient } from '@/lib/supabase/server';
import { getAllCourses } from '@/lib/queries/courses';
import LeadsClient, { type InscricaoRow, type LeadRow } from '@/components/admin/LeadsClient';

export default async function AdminLeadsPage() {
  const supabase = await createClient();

  const [{ data: leadsData }, { data: inscricoesData }] = await Promise.all([
    supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(200),
    supabase.from('inscricoes').select('*').order('created_at', { ascending: false }).limit(200),
  ]);

  const leads = (leadsData || []) as unknown as LeadRow[];
  const inscricoes = (inscricoesData || []) as unknown as InscricaoRow[];

  const courses = await getAllCourses();
  const cursos = courses.map((c) => ({ id: c.id, title: c.title }));

  return <LeadsClient leads={leads} inscricoes={inscricoes} cursos={cursos} />;
}
