import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getCourseById } from '@/lib/queries/courses';
import GeneratePdfButton from '@/components/admin/GeneratePdfButton';

export default async function AjustarPdfPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getCourseById(id);
  if (!course) notFound();

  return (
    <div className="max-w-4xl mx-auto py-8 px-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/cursos"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para cursos
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Ajustar PDF</h1>
          <p className="text-sm text-gray-500 mt-1">{course.title}</p>
        </div>
      </div>

      {/* Panel */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <GeneratePdfButton courseId={course.id} variant="full" />
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-900 space-y-2">
        <p className="font-semibold">Como funciona</p>
        <ul className="list-disc pl-5 space-y-1 text-blue-800">
          <li>Selecione a turma para a qual deseja gerar o folder.</li>
          <li>Use <strong>Preview</strong> para visualizar o HTML rapidamente em uma nova aba.</li>
          <li>Os campos de <strong>Ajustes visuais</strong> são deltas: positivos somam ao base, negativos subtraem. Deixe vazio para manter o padrão.</li>
          <li>Clique em <strong>Gerar PDF</strong> para criar o folder final e salvar o link na turma.</li>
        </ul>
      </div>
    </div>
  );
}
