'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText, Loader2, ChevronDown, BookOpen, DollarSign,
  Phone, LayoutGrid, Eye, Download, Minus, Plus, RotateCcw,
  Sliders, CheckCircle, Calendar,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────
interface CourseOption {
  id: string;
  slug: string;
  title: string;
}

interface TurmaOption {
  id: string;
  course_id: string;
  label: string | null;
  start_date: string;
  status: string;
  folder_pdf_url: string | null;
}

interface ContactState {
  phone1: string;
  phone2: string;
  email: string;
  site: string;
}

// ─── Override sections (espelha app/api/generate-pdf + GeneratePdfButton) ──
interface FineField {
  key: string;
  label: string;
  base: string;
}
interface FineSection {
  key: 'about' | 'audience' | 'program' | 'speakers';
  label: string;
  fields: FineField[];
}

const FINE_SECTIONS: FineSection[] = [
  {
    key: 'about',
    label: 'Sobre o Curso',
    fields: [
      { key: 'margin_top', label: 'Margem superior', base: '10mm' },
      { key: 'margin_bottom', label: 'Espaço entre cards', base: '3mm' },
      { key: 'margin_lateral', label: 'Margens laterais', base: '18mm' },
      { key: 'icon_size', label: 'Tamanho dos ícones', base: '18px' },
      { key: 'scale', label: 'Escala geral de fontes', base: '13pt' },
    ],
  },
  {
    key: 'audience',
    label: 'Público-Alvo',
    fields: [
      { key: 'margin_top', label: 'Margem superior', base: '10mm' },
      { key: 'card_margin_bottom', label: 'Espaço entre cards', base: '2mm' },
      { key: 'card_padding_vertical', label: 'Padding interno dos cards', base: '2.5mm' },
      { key: 'card_font_size', label: 'Tamanho da fonte', base: '13pt' },
      { key: 'icon_size', label: 'Tamanho dos ícones', base: '16px' },
    ],
  },
  {
    key: 'program',
    label: 'Programação',
    fields: [
      { key: 'day_margin_top', label: 'Margem superior das datas', base: '10mm' },
    ],
  },
  {
    key: 'speakers',
    label: 'Palestrantes',
    fields: [
      { key: 'margin_top', label: 'Margem superior', base: '—' },
      { key: 'scale', label: 'Escala geral', base: '20pt' },
    ],
  },
];

// ─── Helpers ───────────────────────────────────────────
function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function turmaText(t: TurmaOption): string {
  const base = t.label || formatDate(t.start_date);
  const st = t.status !== 'open' ? ` (${t.status})` : '';
  const pdf = t.folder_pdf_url ? ' 📄' : '';
  return `${base}${st}${pdf}`;
}

// ─── Component ─────────────────────────────────────────
export default function GerarPdfForm({ courses }: { courses: CourseOption[] }) {
  const [courseId, setCourseId] = useState('');

  // Aceita ?course_id= na URL como valor inicial (client-only, evita suspense).
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('course_id');
    if (fromUrl) setCourseId(fromUrl);
  }, []);
  const [turmas, setTurmas] = useState<TurmaOption[]>([]);
  const [turmaId, setTurmaId] = useState('');
  const [loadingTurmas, setLoadingTurmas] = useState(false);

  const [proposalValue, setProposalValue] = useState('');
  const [contact, setContact] = useState<ContactState>({ phone1: '', phone2: '', email: '', site: '' });

  const [overrides, setOverrides] = useState<Record<string, Record<string, string>>>({});
  const [openFine, setOpenFine] = useState(false);
  const [openContact, setOpenContact] = useState(false);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; url?: string; error?: string } | null>(null);

  const selectedCourse = courses.find((c) => c.id === courseId) || null;
  const selectedTurma = turmas.find((t) => t.id === turmaId) || null;
  const existingPdfUrl = selectedTurma?.folder_pdf_url || null;

  // ─── Fetch turmas when course changes ───
  useEffect(() => {
    if (!courseId) {
      setTurmas([]);
      setTurmaId('');
      return;
    }
    let active = true;
    (async () => {
      setLoadingTurmas(true);
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('course_dates')
          .select('id, course_id, label, start_date, status, folder_pdf_url')
          .eq('course_id', courseId)
          .order('start_date', { ascending: false }) as { data: TurmaOption[] | null };

        if (!active) return;
        const list = data || [];
        setTurmas(list);
        const firstOpen = list.find((t) => t.status === 'open');
        setTurmaId(firstOpen?.id || list[0]?.id || '');
      } finally {
        if (active) setLoadingTurmas(false);
      }
    })();
    return () => { active = false; };
  }, [courseId]);

  // ─── Override helpers ───
  const updateOverride = (section: string, field: string, value: string) => {
    setOverrides((prev) => ({
      ...prev,
      [section]: { ...(prev[section] || {}), [field]: value },
    }));
  };

  const activeAdjustments = useMemo(() => {
    let n = 0;
    for (const sec of Object.values(overrides)) {
      for (const v of Object.values(sec)) {
        if (v && v.trim() !== '') n++;
      }
    }
    return n;
  }, [overrides]);

  const clearAdjustments = () => setOverrides({});

  const toggleSection = (key: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  // ─── Build request body (apenas o que a API aceita: edition_id + section_overrides) ───
  const buildSectionOverrides = (): Record<string, Record<string, string>> | undefined => {
    const out: Record<string, Record<string, string>> = {};
    let hasAny = false;
    for (const section of FINE_SECTIONS) {
      const data = overrides[section.key];
      if (!data) continue;
      const filtered: Record<string, string> = {};
      for (const [k, v] of Object.entries(data)) {
        if (v && v.trim() !== '') { filtered[k] = v.trim(); hasAny = true; }
      }
      if (Object.keys(filtered).length > 0) out[section.key] = filtered;
    }
    return hasAny ? out : undefined;
  };

  const handleGenerate = async (debug = false) => {
    if (!turmaId) return;
    setLoading(true);
    setResult(null);
    try {
      const body: Record<string, unknown> = {
        edition_id: turmaId,
        section_overrides: buildSectionOverrides(),
      };
      if (debug) body.debug = true;

      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (debug) {
        const html = await response.text();
        const win = window.open('', '_blank');
        if (win) { win.document.write(html); win.document.close(); }
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Erro ao gerar PDF');

      setResult({ success: true, url: data.url });
      setTurmas((prev) => prev.map((t) => (t.id === turmaId ? { ...t, folder_pdf_url: data.url } : t)));
    } catch (err) {
      setResult({ success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' });
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ───
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
      {/* ════ Coluna esquerda ════ */}
      <div className="space-y-5">
        {/* Card 1 — Curso */}
        <SectionCard icon={<BookOpen className="w-5 h-5 text-blue-600" />} iconBg="bg-blue-50" title="Curso">
          <Label className="text-[11px] text-gray-500">Selecione o curso</Label>
          <Select value={courseId} onValueChange={setCourseId}>
            <SelectTrigger className="mt-1.5 w-full">
              <SelectValue placeholder="Escolha um curso" />
            </SelectTrigger>
            <SelectContent position="popper" className="max-h-80 w-[var(--radix-select-trigger-width)]">
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.id} className="whitespace-normal leading-snug">{c.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SectionCard>

        {/* Card 2 — Turma */}
        <SectionCard icon={<Calendar className="w-5 h-5 text-indigo-600" />} iconBg="bg-indigo-50" title="Turma">
          <Label className="text-[11px] text-gray-500">Selecione a turma</Label>
          <Select value={turmaId} onValueChange={setTurmaId} disabled={!courseId || loadingTurmas}>
            <SelectTrigger className="mt-1.5 w-full">
              <SelectValue placeholder={
                !courseId ? 'Selecione um curso primeiro'
                  : loadingTurmas ? 'Carregando turmas...'
                  : turmas.length === 0 ? 'Nenhuma turma encontrada'
                  : 'Escolha uma turma'
              } />
            </SelectTrigger>
            <SelectContent position="popper" className="max-h-80 w-[var(--radix-select-trigger-width)]">
              {turmas.map((t) => (
                <SelectItem key={t.id} value={t.id} className="whitespace-normal leading-snug">{turmaText(t)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SectionCard>

        {/* Card 3 — Proposta Comercial */}
        <SectionCard icon={<DollarSign className="w-5 h-5 text-green-600" />} iconBg="bg-green-50" title="Proposta Comercial">
          <Label className="text-[11px] text-gray-500">Valor</Label>
          <div className="mt-1.5 flex items-center rounded-md border bg-white focus-within:ring-1 focus-within:ring-gray-400">
            <span className="px-3 text-sm text-gray-500 border-r">R$</span>
            <input
              type="text"
              inputMode="decimal"
              value={proposalValue}
              onChange={(e) => setProposalValue(e.target.value)}
              placeholder="0,00"
              className="flex-1 px-3 py-2 text-sm bg-transparent outline-none rounded-r-md"
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">Opcional — se preenchido, aparece na última página.</p>
        </SectionCard>

        {/* Card 4 — Contato (colapsável) */}
        <CollapsibleCard
          icon={<Phone className="w-5 h-5 text-orange-600" />}
          iconBg="bg-orange-50"
          title="Contato"
          subtitle="Sobrescreve os dados padrão do template"
          open={openContact}
          onToggle={() => setOpenContact((v) => !v)}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Telefone 1" value={contact.phone1} onChange={(v) => setContact((c) => ({ ...c, phone1: v }))} />
            <Field label="Telefone 2" value={contact.phone2} onChange={(v) => setContact((c) => ({ ...c, phone2: v }))} />
            <Field label="E-mail" value={contact.email} onChange={(v) => setContact((c) => ({ ...c, email: v }))} />
            <Field label="Site" value={contact.site} onChange={(v) => setContact((c) => ({ ...c, site: v }))} />
          </div>
        </CollapsibleCard>

        {/* Card 5 — Ajustes Finos (colapsável) */}
        <div className="rounded-xl border shadow-sm bg-white overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
              <Sliders className="w-5 h-5 text-purple-600" />
            </div>
            <button className="flex-1 flex items-center justify-between text-left" onClick={() => setOpenFine((v) => !v)}>
              <div>
                <span className="font-semibold text-gray-900 block">Ajustes Finos</span>
                <span className="text-xs text-gray-400">Layout do PDF — opcional</span>
              </div>
              <div className="flex items-center gap-3">
                {activeAdjustments > 0 && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                    {activeAdjustments} ativo{activeAdjustments > 1 ? 's' : ''}
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openFine ? 'rotate-180' : ''}`} />
              </div>
            </button>
          </div>

          {openFine && (
            <div className="px-5 pb-5 space-y-3 border-t pt-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">Valores positivos somam ao base, negativos subtraem.</p>
                {activeAdjustments > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAdjustments} className="h-7 text-xs text-gray-500">
                    <RotateCcw className="w-3.5 h-3.5 mr-1" /> Limpar
                  </Button>
                )}
              </div>

              {FINE_SECTIONS.map((section) => (
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
                        <div key={field.key} className="flex items-center justify-between gap-3 pt-3">
                          <Label className="text-xs text-gray-600 flex-1">{field.label}</Label>
                          <Stepper
                            value={overrides[section.key]?.[field.key] || ''}
                            onChange={(v) => updateOverride(section.key, field.key, v)}
                            base={field.base}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ════ Coluna direita — sticky ════ */}
      <div className="lg:sticky lg:top-6 h-fit space-y-4">
        {/* Resumo */}
        <div className="rounded-xl border shadow-sm bg-white p-5 space-y-4">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-gray-400" />
            <h3 className="font-semibold text-gray-900">Resumo</h3>
          </div>
          <SummaryRow label="Curso" value={selectedCourse?.title} />
          <SummaryRow label="Turma" value={selectedTurma ? turmaText(selectedTurma) : undefined} />
          <SummaryRow label="Proposta" value={proposalValue ? `R$ ${proposalValue}` : undefined} />
          <SummaryRow label="Ajustes ativos" value={activeAdjustments > 0 ? String(activeAdjustments) : '0'} />
        </div>

        {/* PDF pronto (verde) */}
        {((result?.success && result.url) || existingPdfUrl) && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-5 space-y-3">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">{result?.success ? 'PDF gerado!' : 'PDF existente'}</span>
            </div>
            <a
              href={result?.url || existingPdfUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" /> Baixar PDF
            </a>
          </div>
        )}

        {/* Erro (vermelho) */}
        {result?.error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {result.error}
          </div>
        )}

        {/* Ações */}
        <div className="space-y-2">
          <Button
            className="w-full bg-gray-900 hover:bg-gray-800 text-white"
            disabled={loading || !turmaId}
            onClick={() => handleGenerate(false)}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
            {loading ? 'Gerando...' : existingPdfUrl ? 'Regerar PDF' : 'Gerar PDF'}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            disabled={loading || !turmaId}
            onClick={() => handleGenerate(true)}
          >
            <Eye className="w-4 h-4 mr-2" /> Preview HTML
          </Button>
          <p className="text-[11px] text-gray-400 text-center">O Preview abre em nova aba sem gerar o PDF final.</p>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-componentes ───────────────────────────────────
function SectionCard({ icon, iconBg, title, children }: {
  icon: React.ReactNode; iconBg: string; title: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border shadow-sm bg-white p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>{icon}</div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function CollapsibleCard({ icon, iconBg, title, subtitle, open, onToggle, children }: {
  icon: React.ReactNode; iconBg: string; title: string; subtitle?: string;
  open: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border shadow-sm bg-white overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4">
        <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>{icon}</div>
        <button className="flex-1 flex items-center justify-between text-left" onClick={onToggle}>
          <div>
            <span className="font-semibold text-gray-900 block">{title}</span>
            {subtitle && <span className="text-xs text-gray-400">{subtitle}</span>}
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {open && <div className="px-5 pb-5 border-t pt-4">{children}</div>}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-[11px] text-gray-500 shrink-0 pt-0.5">{label}</span>
      <span className={`text-sm text-right ${value ? 'font-semibold text-gray-900' : 'text-gray-300'}`}>
        {value || '—'}
      </span>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <Label className="text-[11px] text-gray-500">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="h-9 text-sm" />
    </div>
  );
}

function Stepper({ value, onChange, base }: { value: string; onChange: (v: string) => void; base: string }) {
  const step = (delta: number) => {
    const current = parseInt(value, 10);
    const next = (Number.isNaN(current) ? 0 : current) + delta;
    onChange(next === 0 ? '' : String(next));
  };
  return (
    <div className="flex items-center gap-1">
      <button type="button" onClick={() => step(-1)} className="h-8 w-8 rounded-md border bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600">
        <Minus className="w-3.5 h-3.5" />
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className="h-8 w-20 text-center font-mono text-sm rounded-md border bg-white outline-none focus:ring-1 focus:ring-gray-400"
      />
      <button type="button" onClick={() => step(1)} className="h-8 w-8 rounded-md border bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600">
        <Plus className="w-3.5 h-3.5" />
      </button>
      <span className="text-[11px] text-gray-400 ml-1 w-14 shrink-0">base {base}</span>
    </div>
  );
}
