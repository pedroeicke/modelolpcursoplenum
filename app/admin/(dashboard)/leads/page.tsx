import { createClient } from '@/lib/supabase/server';
import { getAllCourses } from '@/lib/queries/courses';
import LeadsClient, { type InscricaoRow, type LeadRow, type TurmaOpcao } from '@/components/admin/LeadsClient';

// Traz a tabela inteira, mais recentes primeiro. O Supabase devolve no máximo
// 1000 linhas por consulta, então busca em lotes. Antes havia um limite de 200:
// leads e inscrições mais antigos sumiam da lista e o curso deles nem aparecia
// no filtro (out/2026, Compras Diretas Avançado DF).
async function buscaTudo(
  lote: (de: number, ate: number) => PromiseLike<{ data: unknown[] | null; error: unknown }>
) {
  const TAMANHO = 1000;
  const linhas: unknown[] = [];
  for (let de = 0; ; de += TAMANHO) {
    const { data, error } = await lote(de, de + TAMANHO - 1);
    if (error) throw error;
    linhas.push(...(data || []));
    if (!data || data.length < TAMANHO) return linhas;
  }
}

export default async function AdminLeadsPage() {
  const supabase = await createClient();

  const [leadsData, inscricoesData, { data: turmasData }] = await Promise.all([
    buscaTudo((de, ate) =>
      supabase.from('leads').select('*').order('created_at', { ascending: false }).order('id').range(de, ate)
    ),
    buscaTudo((de, ate) =>
      supabase.from('inscricoes').select('*').order('created_at', { ascending: false }).order('id').range(de, ate)
    ),
    // a data da turma aparece junto do curso no card da inscrição
    supabase.from('course_dates').select('id, label, start_date'),
  ]);

  const leads = leadsData as unknown as LeadRow[];
  const inscricoes = inscricoesData as unknown as InscricaoRow[];

  const courses = await getAllCourses();
  const cursos = courses.map((c) => ({ id: c.id, title: c.title }));
  const turmas = (turmasData || []) as unknown as TurmaOpcao[];

  return <LeadsClient leads={leads} inscricoes={inscricoes} cursos={cursos} turmas={turmas} />;
}
