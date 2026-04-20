'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Loader2, ExternalLink, CheckCircle, ChevronDown, Eye } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface TurmaOption {
  id: string;
  label: string | null;
  start_date: string;
  status: string;
  folder_pdf_url: string | null;
}

interface SectionOverrides {
  about?: Record<string, string>;
  audience?: Record<string, string>;
  program?: Record<string, string>;
  speakers?: Record<string, string>;
}

interface Props {
  courseId: string;
  variant?: 'compact' | 'full';
  onGenerated?: (url: string) => void;
}

// ─── Override field definitions ──────────────────────────
const OVERRIDE_SECTIONS = [
  {
    key: 'about',
    label: 'Sobre o Curso',
    fields: [
      { key: 'margin_top', label: 'Margem superior', hint: 'Base: 10mm. Ex: "5" → 15mm' },
      { key: 'margin_bottom', label: 'Espaço entre cards', hint: 'Base: 3mm. Ex: "-1" → 2mm' },
      { key: 'margin_lateral', label: 'Margens laterais', hint: 'Base: 18mm. Ex: "2" → 20mm' },
      { key: 'icon_size', label: 'Tamanho dos ícones', hint: 'Base: 18px. Ex: "4" → 22px' },
      { key: 'scale', label: 'Escala geral de fontes', hint: 'Base título: 13pt. Ex: "2" → 15pt' },
    ],
  },
  {
    key: 'audience',
    label: 'Público-Alvo',
    fields: [
      { key: 'margin_top', label: 'Margem superior', hint: 'Base: 10mm. Ex: "5" → 15mm' },
      { key: 'card_margin_bottom', label: 'Espaço entre cards', hint: 'Base: 2mm. Ex: "1" → 3mm' },
      { key: 'card_padding_vertical', label: 'Padding interno dos cards', hint: 'Base: 2.5mm' },
      { key: 'card_font_size', label: 'Tamanho da fonte', hint: 'Base: 13pt. Ex: "1" → 14pt' },
      { key: 'icon_size', label: 'Tamanho dos ícones', hint: 'Base: 16px. Ex: "2" → 18px' },
    ],
  },
  {
    key: 'program',
    label: 'Programação',
    fields: [
      { key: 'day_margin_top', label: 'Margem superior das datas', hint: 'Base: 10mm. Ex: "3" → 13mm' },
    ],
  },
  {
    key: 'speakers',
    label: 'Palestrantes',
    fields: [
      { key: 'margin_top', label: 'Margem superior', hint: 'Ajusta posição vertical dos cards' },
      { key: 'scale', label: 'Escala geral', hint: 'Base nome: 20pt, foto: 55mm. Ex: "3" → 23pt/58mm' },
    ],
  },
];

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
  const [showOverrides, setShowOverrides] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, Record<string, string>>>({});
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const selectedTurmaData = turmas.find((t) => t.id === selectedTurma);
  const existingPdfUrl = selectedTurmaData?.folder_pdf_url || null;

  const fetchTurmas = async () => {
    if (turmas.length > 0) return;
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

  // Build section_overrides from form state
  const buildOverrides = (): SectionOverrides | undefined => {
    const result: SectionOverrides = {};
    let hasAny = false;
    for (const section of OVERRIDE_SECTIONS) {
      const sectionData = overrides[section.key];
      if (sectionData) {
        const filtered: Record<string, string> = {};
        for (const [k, v] of Object.entries(sectionData)) {
          if (v && v.trim() !== '') {
            filtered[k] = v.trim();
            hasAny = true;
          }
        }
        if (Object.keys(filtered).length > 0) {
          (result as Record<string, Record<string, string>>)[section.key] = filtered;
        }
      }
    }
    return hasAny ? result : undefined;
  };

  const updateOverride = (section: string, field: string, value: string) => {
    setOverrides((prev) => ({
      ...prev,
      [section]: { ...(prev[section] || {}), [field]: value },
    }));
  };

  const toggleSection = (key: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const handleGenerate = async (debug = false) => {
    if (!selectedTurma) return;
    setLoading(true);
    setResult(null);
    setProgress('Gerando PDF...');

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          edition_id: selectedTurma,
          section_overrides: buildOverrides(),
          debug,
        }),
      });

      if (debug) {
        const html = await response.text();
        const win = window.open('', '_blank');
        if (win) {
          win.document.write(html);
          win.document.close();
        }
        setProgress('');
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao gerar PDF');
      }

      setResult({ success: true, url: data.url });
      setProgress('');

      setTurmas((prev) =>
        prev.map((t) =>
          t.id === selectedTurma ? { ...t, folder_pdf_url: data.url } : t,
        ),
      );

      onGenerated?.(data.url);
      router.refresh();
    } catch (err) {
      console.error('PDF generation error:', err);
      setResult({ success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' });
      setProgress('');
    } finally {
      setLoading(false);
    }
  };

  // ─── Compact variant (opens dialog with full UI) ──────
  if (variant === 'compact') {
    return (
      <Dialog open={showSelector} onOpenChange={(open) => { setShowSelector(open); if (open) fetchTurmas(); }}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => e.stopPropagation()}
            className="text-gray-800 border-gray-300"
          >
            <FileText className="w-3.5 h-3.5 mr-1.5" />
            PDF
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Gerar Folder PDF</DialogTitle>
          </DialogHeader>
          <PdfPanel
            turmas={turmas}
            loadingTurmas={loadingTurmas}
            selectedTurma={selectedTurma}
            setSelectedTurma={setSelectedTurma}
            loading={loading}
            progress={progress}
            result={result}
            existingPdfUrl={existingPdfUrl}
            showOverrides={showOverrides}
            setShowOverrides={setShowOverrides}
            overrides={overrides}
            updateOverride={updateOverride}
            openSections={openSections}
            toggleSection={toggleSection}
            onGenerate={handleGenerate}
          />
        </DialogContent>
      </Dialog>
    );
  }

  // ─── Full variant ─────────────────────────────────────
  useEffect(() => { fetchTurmas(); }, [courseId]);

  return (
    <PdfPanel
      turmas={turmas}
      loadingTurmas={loadingTurmas}
      selectedTurma={selectedTurma}
      setSelectedTurma={setSelectedTurma}
      loading={loading}
      progress={progress}
      result={result}
      existingPdfUrl={existingPdfUrl}
      showOverrides={showOverrides}
      setShowOverrides={setShowOverrides}
      overrides={overrides}
      updateOverride={updateOverride}
      openSections={openSections}
      toggleSection={toggleSection}
      onGenerate={handleGenerate}
    />
  );
}

// ─── Reusable PDF Panel ────────────────────────────────
interface PdfPanelProps {
  turmas: TurmaOption[];
  loadingTurmas: boolean;
  selectedTurma: string;
  setSelectedTurma: (v: string) => void;
  loading: boolean;
  progress: string;
  result: { success: boolean; url?: string; error?: string } | null;
  existingPdfUrl: string | null;
  showOverrides: boolean;
  setShowOverrides: (v: boolean) => void;
  overrides: Record<string, Record<string, string>>;
  updateOverride: (section: string, field: string, value: string) => void;
  openSections: Set<string>;
  toggleSection: (key: string) => void;
  onGenerate: (debug?: boolean) => void;
}

function PdfPanel({
  turmas,
  loadingTurmas,
  selectedTurma,
  setSelectedTurma,
  loading,
  progress,
  result,
  existingPdfUrl,
  showOverrides,
  setShowOverrides,
  overrides,
  updateOverride,
  openSections,
  toggleSection,
  onGenerate,
}: PdfPanelProps) {
  return (
    <div className="space-y-4">
      {/* Turma selector + buttons */}
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
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => onGenerate()} disabled={loading || !selectedTurma}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
          {loading ? 'Gerando...' : existingPdfUrl ? 'Regerar PDF' : 'Gerar PDF'}
        </Button>

        <Button variant="outline" onClick={() => onGenerate(true)} disabled={loading || !selectedTurma}>
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
      </div>

      {/* Toggle overrides */}
      <button
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        onClick={() => setShowOverrides(!showOverrides)}
      >
        <ChevronDown className={`w-4 h-4 transition-transform ${showOverrides ? 'rotate-180' : ''}`} />
        Ajustes visuais do PDF
      </button>

      {/* Section overrides */}
      {showOverrides && (
        <div className="space-y-3 border rounded-lg p-4 bg-gray-50">
          <p className="text-xs text-gray-500">
            Valores positivos somam ao base, negativos subtraem. Deixe vazio para usar o padrão.
          </p>
          {OVERRIDE_SECTIONS.map((section) => (
            <div key={section.key} className="border rounded-lg bg-white overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                onClick={() => toggleSection(section.key)}
              >
                <span className="text-sm font-medium text-gray-700">{section.label}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openSections.has(section.key) ? 'rotate-180' : ''}`} />
              </button>
              {openSections.has(section.key) && (
                <div className="px-4 pb-4 space-y-3 border-t">
                  {section.fields.map((field) => (
                    <div key={field.key} className="space-y-1 pt-3">
                      <Label className="text-xs text-gray-600">{field.label}</Label>
                      <Input
                        type="text"
                        placeholder="0"
                        value={overrides[section.key]?.[field.key] || ''}
                        onChange={(e) => updateOverride(section.key, field.key, e.target.value)}
                        className="h-8 text-sm"
                      />
                      <p className="text-[10px] text-gray-400">{field.hint}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Progress */}
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

      {!loading && ((result?.success && result.url) || existingPdfUrl) && (
        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-green-700">
              {result?.success ? 'PDF gerado com sucesso!' : 'PDF existente'}
            </p>
            <a href={result?.url || existingPdfUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline truncate block">
              {result?.url || existingPdfUrl}
            </a>
          </div>
          <a href={result?.url || existingPdfUrl || '#'} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 text-green-500" />
          </a>
        </div>
      )}
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
