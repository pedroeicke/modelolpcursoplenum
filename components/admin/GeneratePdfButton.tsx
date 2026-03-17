'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Loader2, ExternalLink, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface TurmaOption {
  id: string;
  label: string | null;
  start_date: string;
  status: string;
  folder_pdf_url: string | null;
}

interface Props {
  courseId: string;
  /** Compact mode for dashboard row (inline) vs full mode for TabMidias */
  variant?: 'compact' | 'full';
  /** Callback when PDF is generated */
  onGenerated?: (url: string) => void;
}

export default function GeneratePdfButton({
  courseId,
  variant = 'compact',
  onGenerated,
}: Props) {
  const router = useRouter();
  const [turmas, setTurmas] = useState<TurmaOption[]>([]);
  const [selectedTurma, setSelectedTurma] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingTurmas, setLoadingTurmas] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [result, setResult] = useState<{ success: boolean; url?: string; error?: string } | null>(null);
  const [showSelector, setShowSelector] = useState(false);

  // Get existing PDF URL for selected turma
  const selectedTurmaData = turmas.find((t) => t.id === selectedTurma);
  const existingPdfUrl = selectedTurmaData?.folder_pdf_url || null;

  // Fetch turmas when selector is opened
  const fetchTurmas = async () => {
    if (turmas.length > 0) return; // Already loaded
    setLoadingTurmas(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('course_dates')
        .select('id, label, start_date, status, folder_pdf_url')
        .eq('course_id', courseId)
        .order('start_date', { ascending: false }) as { data: TurmaOption[] | null };

      setTurmas(data || []);
      const firstOpen = data?.find((t) => t.status === 'open');
      if (firstOpen) setSelectedTurma(firstOpen.id);
      else if (data && data.length > 0) setSelectedTurma(data[0].id);
    } catch (err) {
      console.error('Error fetching turmas:', err);
    } finally {
      setLoadingTurmas(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedTurma) return;
    setLoading(true);
    setResult(null);
    setProgress('Iniciando...');

    try {
      const supabase = createClient();

      // ─── Generate PDF in the browser (no Edge Function, no timeout!) ───
      const { generateFolderPdf } = await import('@/lib/pdf-generator');

      const pdfBytes = await generateFolderPdf({
        courseId,
        courseDateId: selectedTurma,
        supabase,
        siteBaseUrl: window.location.origin,
        onProgress: (msg) => setProgress(msg),
      });

      // ─── Upload to Supabase Storage ───
      setProgress('Enviando PDF para o servidor...');

      // Get course slug for filename
      const { data: courseData } = await supabase
        .from('courses')
        .select('slug')
        .eq('id', courseId)
        .single();

      const slug = courseData?.slug || 'curso';
      const fileName = `${slug}-${selectedTurma.slice(0, 8)}-${Date.now()}.pdf`;
      const filePath = `generated/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('pdfs')
        .upload(filePath, pdfBytes, {
          contentType: 'application/pdf',
          upsert: true,
        });

      if (uploadError) throw new Error(`Upload falhou: ${uploadError.message}`);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('pdfs')
        .getPublicUrl(filePath);

      // Save URL to course_dates
      await supabase
        .from('course_dates')
        .update({ folder_pdf_url: publicUrl })
        .eq('id', selectedTurma);

      setResult({ success: true, url: publicUrl });
      setProgress('');

      // Update local turma data with new PDF URL
      setTurmas((prev) =>
        prev.map((t) =>
          t.id === selectedTurma ? { ...t, folder_pdf_url: publicUrl } : t,
        ),
      );

      onGenerated?.(publicUrl);
      router.refresh();
    } catch (err) {
      console.error('PDF generation error:', err);
      setResult({ success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' });
      setProgress('');
    } finally {
      setLoading(false);
    }
  };

  // Compact variant: button that opens selector inline
  if (variant === 'compact') {
    if (!showSelector) {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setShowSelector(true);
            fetchTurmas();
          }}
          className="text-gray-800 border-gray-300"
        >
          <FileText className="w-3.5 h-3.5 mr-1.5" />
          PDF
        </Button>
      );
    }

    return (
      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        {loadingTurmas ? (
          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
        ) : (
          <Select value={selectedTurma} onValueChange={setSelectedTurma}>
            <SelectTrigger className="w-48 h-8 text-xs">
              <SelectValue placeholder="Turma..." />
            </SelectTrigger>
            <SelectContent>
              {turmas.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.label || formatDate(t.start_date)} {t.status !== 'open' ? `(${t.status})` : ''} {t.folder_pdf_url ? '📄' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Button
          size="sm"
          onClick={handleGenerate}
          disabled={loading || !selectedTurma || loadingTurmas}
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <FileText className="w-3.5 h-3.5" />
          )}
          <span className="ml-1">{loading ? 'Gerando...' : existingPdfUrl ? 'Regerar' : 'Gerar'}</span>
        </Button>

        {/* Progress indicator */}
        {loading && progress && (
          <span className="text-xs text-blue-500 max-w-48 truncate" title={progress}>
            {progress}
          </span>
        )}

        {/* Show existing or just-generated PDF link */}
        {!loading && ((result?.success && result.url) || existingPdfUrl) ? (
          <a
            href={result?.url || existingPdfUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            title="Abrir PDF"
          >
            <CheckCircle className="w-4 h-4 text-green-500" />
          </a>
        ) : null}

        {result?.error && (
          <span className="text-xs text-red-500 max-w-32 truncate" title={result.error}>
            {result.error}
          </span>
        )}

        <button
          className="text-xs text-gray-400 hover:text-gray-600"
          onClick={() => {
            setShowSelector(false);
            setResult(null);
            setProgress('');
          }}
        >
          ✕
        </button>
      </div>
    );
  }

  // Full variant: for TabMidias
  useEffect(() => { fetchTurmas(); }, [courseId]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Select value={selectedTurma} onValueChange={setSelectedTurma}>
            <SelectTrigger>
              <SelectValue placeholder={loadingTurmas ? 'Carregando turmas...' : 'Selecione uma turma'} />
            </SelectTrigger>
            <SelectContent>
              {turmas.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.label || formatDate(t.start_date)} {t.status !== 'open' ? `(${t.status})` : ''} {t.folder_pdf_url ? '📄' : ''}
                </SelectItem>
              ))}
              {turmas.length === 0 && !loadingTurmas && (
                <div className="px-3 py-2 text-sm text-gray-400">Nenhuma turma encontrada</div>
              )}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={loading || !selectedTurma}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <FileText className="w-4 h-4 mr-2" />
          )}
          {loading ? 'Gerando PDF...' : existingPdfUrl ? 'Regerar Folder PDF' : 'Gerar Folder PDF'}
        </Button>
      </div>

      {/* Progress bar */}
      {loading && progress && (
        <div className="text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          {progress}
        </div>
      )}

      {result?.error && (
        <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg p-3">
          {result.error}
        </div>
      )}

      {/* Show existing PDF for selected turma or just-generated */}
      {!loading && ((result?.success && result.url) || existingPdfUrl) ? (
        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-green-700">
              {result?.success ? 'PDF gerado com sucesso!' : 'PDF já gerado para esta turma'}
            </p>
            <a
              href={result?.url || existingPdfUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-green-600 hover:underline truncate block"
            >
              {result?.url || existingPdfUrl}
            </a>
          </div>
          <a
            href={result?.url || existingPdfUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="w-4 h-4 text-green-500" />
          </a>
        </div>
      ) : null}
    </div>
  );
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}
