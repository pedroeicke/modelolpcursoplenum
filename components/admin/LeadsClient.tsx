'use client';

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ban, Check, ChevronDown, Download, Pencil, RotateCcw, Search, X } from 'lucide-react';
import { leModalidade } from '@/lib/inscricao-modalidade';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

/** Mesmas opções do formulário público de inscrição (app/inscricao/InscricaoForm.tsx). */
const TIPOS_INSTITUICAO = ['Órgão Público', 'Particular', 'Empresa'];

/** Opções definidas pelo comercial para a correção da inscrição. */
const FORMAS_PAGAMENTO = ['PIX', 'Transferência bancária', 'Boleto', 'Link de cartão de crédito'];

const formTypeMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  folder: { label: 'Folder', variant: 'default' },
  in_company: { label: 'In Company', variant: 'secondary' },
  notification: { label: 'Notificação', variant: 'outline' },
};

const statusMap: Record<string, { label: string; cls: string }> = {
  nova: { label: 'Nova', cls: 'bg-emerald-100 text-emerald-800' },
  em_atendimento: { label: 'Em atendimento', cls: 'bg-amber-100 text-amber-800' },
  confirmada: { label: 'Confirmada', cls: 'bg-blue-100 text-blue-800' },
  cancelada: { label: 'Cancelada', cls: 'bg-gray-200 text-gray-600' },
};

export interface LeadRow {
  id: string;
  course_id: string | null;
  form_type: string;
  nome: string;
  email: string | null;
  whatsapp: string | null;
  estado: string | null;
  cidade: string | null;
  orgao: string | null;
  created_at: string;
}

export interface InscricaoRow {
  id: string;
  course_id: string | null;
  course_date_id: string | null;
  tipo_instituicao: string;
  num_inscritos: number;
  nomes_inscritos: string;
  municipio: string;
  estado: string;
  razao_social: string;
  cnpj: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cidade: string;
  uf: string;
  resp_nome: string;
  resp_cpf: string;
  resp_email: string;
  resp_telefone: string;
  observacoes: string | null;
  forma_pagamento: string;
  data_nota_fiscal: string | null;
  vencimento_igual_inicio: boolean;
  status: string;
  email_cliente_enviado: boolean;
  email_plenum_enviado: boolean;
  created_at: string;
}

export interface CursoOpcao {
  id: string;
  title: string;
}

function Campo({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">{label}</p>
      <p className="text-sm text-gray-900">{value || '—'}</p>
    </div>
  );
}

/** Mesmo visual do Campo, mas editável — usado no modo de correção. */
function CampoEdit({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  const comum =
    'mt-0.5 w-full rounded border border-gray-300 px-2 py-1 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500';
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">{label}</p>
      {multiline ? (
        <textarea rows={3} className={comum} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input type="text" className={comum} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

/** Excel do Brasil abre melhor com ; e precisa do BOM para os acentos. */
const BOM = String.fromCharCode(0xfeff);          // Excel reconhece o UTF-8
const QUEBRA = String.fromCharCode(13, 10);       // fim de linha do CSV
const QUEBRA_LINHA = String.fromCharCode(10);     // separador dos nomes no cadastro

function baixaCsv(nomeArquivo: string, linhas: string[][]) {
  const escapa = (v: string) => `"${(v ?? '').replace(/"/g, '""')}"`;
  const conteudo = BOM + linhas.map((l) => l.map(escapa).join(';')).join(QUEBRA);
  const url = URL.createObjectURL(new Blob([conteudo], { type: 'text/csv;charset=utf-8;' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = nomeArquivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function LeadsClient({
  leads,
  inscricoes,
  cursos,
}: {
  leads: LeadRow[];
  inscricoes: InscricaoRow[];
  cursos: CursoOpcao[];
}) {
  const [cursoId, setCursoId] = useState('todos');
  const [busca, setBusca] = useState('');

  // Correção de inscrição: qual está aberta, o rascunho e o que já foi salvo.
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [rascunho, setRascunho] = useState<Partial<InscricaoRow>>({});
  const [salvando, setSalvando] = useState(false);
  const [erroEdicao, setErroEdicao] = useState<string | null>(null);
  const [corrigidas, setCorrigidas] = useState<Record<string, InscricaoRow>>({});

  function abreEdicao(i: InscricaoRow) {
    setEditandoId(i.id);
    setErroEdicao(null);
    setRascunho({
      tipo_instituicao: i.tipo_instituicao,
      num_inscritos: i.num_inscritos, nomes_inscritos: i.nomes_inscritos,
      municipio: i.municipio, estado: i.estado,
      razao_social: i.razao_social, cnpj: i.cnpj, cep: i.cep,
      endereco: i.endereco, numero: i.numero, complemento: i.complemento, bairro: i.bairro,
      cidade: i.cidade, uf: i.uf,
      resp_nome: i.resp_nome, resp_cpf: i.resp_cpf,
      resp_email: i.resp_email, resp_telefone: i.resp_telefone,
    });
  }

  async function salvaEdicao(id: string) {
    setSalvando(true);
    setErroEdicao(null);
    try {
      const r = await fetch(`/api/inscricoes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rascunho),
      });
      const dados = await r.json();
      if (!r.ok) throw new Error(dados?.error || 'Não foi possível salvar');
      setCorrigidas((antes) => ({ ...antes, [id]: dados.inscricao }));
      setEditandoId(null);
    } catch (e) {
      setErroEdicao(e instanceof Error ? e.message : 'Não foi possível salvar');
    } finally {
      setSalvando(false);
    }
  }

  // Cancelamento: inscrição duplicada ou desistência. Não apaga — só muda o
  // status, e dá para reativar se cancelou a errada.
  const [mudandoStatus, setMudandoStatus] = useState<string | null>(null);

  async function mudaStatus(i: InscricaoRow, status: 'cancelada' | 'nova') {
    const pergunta = status === 'cancelada'
      ? `Cancelar a inscrição de ${i.resp_nome}? Ela sai da contagem e da lista de presença.`
      : `Reativar a inscrição de ${i.resp_nome}?`;
    if (!window.confirm(pergunta)) return;
    setMudandoStatus(i.id);
    try {
      const r = await fetch(`/api/inscricoes/${i.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const dados = await r.json();
      if (!r.ok) throw new Error(dados?.error || 'Não foi possível salvar');
      setCorrigidas((antes) => ({ ...antes, [i.id]: dados.inscricao }));
    } catch (e) {
      window.alert(e instanceof Error ? e.message : 'Não foi possível salvar');
    } finally {
      setMudandoStatus(null);
    }
  }

  const campo = (k: keyof InscricaoRow) => String(rascunho[k] ?? '');
  const mudaCampo = (k: keyof InscricaoRow) => (v: string) =>
    setRascunho((r) => ({ ...r, [k]: v }));

  const courseMap = useMemo(
    () => new Map(cursos.map((c) => [c.id, c.title])),
    [cursos]
  );

  // só lista no dropdown os cursos que realmente têm inscrição ou lead
  const cursosComRegistro = useMemo(() => {
    const usados = new Set<string>();
    inscricoes.forEach((i) => i.course_id && usados.add(i.course_id));
    leads.forEach((l) => l.course_id && usados.add(l.course_id));
    return cursos
      .filter((c) => usados.has(c.id))
      .sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
  }, [cursos, inscricoes, leads]);

  const termo = busca.trim().toLowerCase();

  const inscricoesFiltradas = useMemo(() => {
    let lista = cursoId === 'todos' ? inscricoes : inscricoes.filter((i) => i.course_id === cursoId);
    if (termo) {
      lista = lista.filter((i) =>
        [i.resp_email, i.resp_nome, i.razao_social, i.cnpj, i.resp_telefone, i.municipio]
          .join(' ')
          .toLowerCase()
          .includes(termo)
      );
    }
    return lista;
  }, [inscricoes, cursoId, termo]);

  const leadsFiltrados = useMemo(() => {
    let lista = cursoId === 'todos' ? leads : leads.filter((l) => l.course_id === cursoId);
    if (termo) {
      lista = lista.filter((l) =>
        [l.email, l.nome, l.orgao, l.whatsapp, l.cidade].join(' ').toLowerCase().includes(termo)
      );
    }
    return lista;
  }, [leads, cursoId, termo]);

  // status atual: o que foi salvo nesta tela vale mais que o carregado da página
  const cancelada = (i: InscricaoRow) => (corrigidas[i.id] || i).status === 'cancelada';
  const inscricoesAtivas = inscricoesFiltradas.filter((i) => !cancelada(i));

  /** Uma linha por participante — é isso que vira lista de presença. Cancelada fica de fora. */
  function exportaPresenca() {
    const linhas: string[][] = [[
      'Curso', 'Modalidade', 'Participante', 'Órgão / Razão social',
      'Município', 'UF', 'Responsável', 'E-mail', 'Telefone', 'Data da inscrição',
    ]];
    for (const i of inscricoesAtivas.map((x) => corrigidas[x.id] || x)) {
      const { modalidade } = leModalidade(i.observacoes);
      const nomes = (i.nomes_inscritos || '')
        .split(QUEBRA_LINHA)
        .map((n) => n.trim())
        .filter(Boolean);
      const participantes = nomes.length > 0 ? nomes : [i.resp_nome];
      for (const nome of participantes) {
        linhas.push([
          (i.course_id && courseMap.get(i.course_id)) || '',
          modalidade || 'não informada',
          nome,
          i.razao_social || '',
          i.municipio || '',
          i.estado || '',
          i.resp_nome || '',
          i.resp_email || '',
          i.resp_telefone || '',
          new Date(i.created_at).toLocaleDateString('pt-BR'),
        ]);
      }
    }
    const curso = cursoId === 'todos' ? 'todos-os-cursos' : (courseMap.get(cursoId) || 'curso');
    const nomeArquivo = `lista-presenca-${curso}`
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/-+$/, '')
      .toLowerCase()
      .slice(0, 70);
    baixaCsv(`${nomeArquivo}.csv`, linhas);
  }

  const totalParticipantes = inscricoesAtivas.reduce(
    (soma, i) => soma + (i.num_inscritos || 1),
    0
  );

  const contaInscricoes = (id: string) =>
    id === 'todos' ? inscricoes.length : inscricoes.filter((i) => i.course_id === id).length;
  const contaLeads = (id: string) =>
    id === 'todos' ? leads.length : leads.filter((l) => l.course_id === id).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500 mt-1">
            {inscricoesFiltradas.length} inscriç{inscricoesFiltradas.length === 1 ? 'ão' : 'ões'} ·{' '}
            {leadsFiltrados.length} lead{leadsFiltrados.length !== 1 ? 's' : ''}
            {cursoId !== 'todos' && ' neste curso'}
          </p>
        </div>

        <div className="min-w-[300px] flex-1 max-w-md">
          <label
            htmlFor="busca-cliente"
            className="block text-[11px] uppercase tracking-wide text-gray-400 font-semibold mb-1"
          >
            Buscar cliente
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="busca-cliente"
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="E-mail, nome, órgão, CNPJ ou telefone"
              className="h-10 w-full rounded-md border border-gray-300 bg-white pl-9 pr-9 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {busca && (
              <button
                type="button"
                onClick={() => setBusca('')}
                aria-label="Limpar busca"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="min-w-[260px]">
          <label
            htmlFor="filtro-curso"
            className="block text-[11px] uppercase tracking-wide text-gray-400 font-semibold mb-1"
          >
            Filtrar por curso
          </label>
          <select
            id="filtro-curso"
            value={cursoId}
            onChange={(e) => setCursoId(e.target.value)}
            className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="todos">
              Todos os cursos ({contaInscricoes('todos')} insc. / {contaLeads('todos')} leads)
            </option>
            {cursosComRegistro.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({contaInscricoes(c.id)} insc. / {contaLeads(c.id)} leads)
              </option>
            ))}
          </select>
        </div>
      </div>

      <Tabs defaultValue="inscricoes">
        <TabsList>
          <TabsTrigger value="inscricoes">
            Inscrições
            <span className="ml-2 px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              {inscricoesFiltradas.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="leads">
            Leads
            <span className="ml-2 px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[11px] font-bold">
              {leadsFiltrados.length}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* ── Aba Inscrições ── */}
        <TabsContent value="inscricoes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
              <div>
                <CardTitle>Inscrições nos cursos</CardTitle>
                <p className="mt-1 text-sm text-gray-500">
                  {totalParticipantes} participante{totalParticipantes === 1 ? '' : 's'} em{' '}
                  {inscricoesAtivas.length} inscriç{inscricoesAtivas.length === 1 ? 'ão' : 'ões'}
                  {inscricoesAtivas.length < inscricoesFiltradas.length &&
                    ` · ${inscricoesFiltradas.length - inscricoesAtivas.length} cancelada${inscricoesFiltradas.length - inscricoesAtivas.length === 1 ? '' : 's'}`}
                </p>
              </div>
              <button
                type="button"
                onClick={exportaPresenca}
                disabled={inscricoesAtivas.length === 0}
                className="inline-flex shrink-0 items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Download className="h-4 w-4" />
                Baixar lista de presença
              </button>
            </CardHeader>
            <CardContent>
              {inscricoesFiltradas.length === 0 ? (
                <p className="text-sm text-gray-500 py-8 text-center">
                  {termo
                    ? `Nenhuma inscrição encontrada para "${busca.trim()}".`
                    : cursoId === 'todos'
                      ? 'Nenhuma inscrição recebida ainda.'
                      : 'Nenhuma inscrição neste curso ainda.'}
                </p>
              ) : (
                <div className="space-y-3">
                  {inscricoesFiltradas.map((original) => {
                    const i = corrigidas[original.id] || original;
                    const editando = editandoId === i.id;
                    const st = statusMap[i.status] || statusMap.nova;
                    return (
                      <details
                        key={i.id}
                        className={`group rounded-lg border border-gray-200 open:shadow-sm ${i.status === 'cancelada' ? 'opacity-60' : ''}`}
                      >
                        <summary className="flex items-center gap-4 px-4 py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                          <ChevronDown className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180 shrink-0" />
                          <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-5 gap-x-4 gap-y-1 items-center">
                            <span className="font-medium text-sm text-gray-900 truncate">{i.resp_nome}</span>
                            <span className="text-sm text-gray-500 truncate hidden md:block">
                              {i.course_id ? courseMap.get(i.course_id) || '—' : '—'}
                            </span>
                            <span className="text-sm text-gray-500">
                              {i.num_inscritos} inscrito{i.num_inscritos > 1 ? 's' : ''}
                              {leModalidade(i.observacoes).modalidade && (
                                <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-700">
                                  {leModalidade(i.observacoes).modalidade}
                                </span>
                              )}
                            </span>
                            <span className={`justify-self-start px-2 py-0.5 rounded-full text-[11px] font-bold ${st.cls}`}>
                              {st.label}
                            </span>
                            <span className="text-sm text-gray-400 whitespace-nowrap">
                              {new Date(i.created_at).toLocaleDateString('pt-BR')}{' '}
                              {new Date(i.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </summary>

                        <div className="border-t border-gray-100 px-5 py-5 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5 bg-gray-50/50">
                          {/* Correção dos dados: o vendedor digita por telefone e erra de vez em quando */}
                          <div className="md:col-span-3 flex items-center justify-end gap-2">
                            {erroEdicao && editando && (
                              <span className="mr-auto text-sm text-red-600">{erroEdicao}</span>
                            )}
                            {editando ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => { setEditandoId(null); setErroEdicao(null); }}
                                  disabled={salvando}
                                  className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                  <X className="h-3.5 w-3.5" />
                                  Cancelar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => salvaEdicao(i.id)}
                                  disabled={salvando}
                                  className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                  {salvando ? 'Salvando...' : 'Salvar'}
                                </button>
                              </>
                            ) : (
                              <>
                                {i.status === 'cancelada' ? (
                                  <button
                                    type="button"
                                    onClick={() => mudaStatus(i, 'nova')}
                                    disabled={mudandoStatus === i.id}
                                    className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                  >
                                    <RotateCcw className="h-3.5 w-3.5" />
                                    {mudandoStatus === i.id ? 'Salvando...' : 'Reativar inscrição'}
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => mudaStatus(i, 'cancelada')}
                                    disabled={mudandoStatus === i.id}
                                    className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                                  >
                                    <Ban className="h-3.5 w-3.5" />
                                    {mudandoStatus === i.id ? 'Cancelando...' : 'Cancelar inscrição'}
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => abreEdicao(i)}
                                  className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                  Corrigir dados
                                </button>
                              </>
                            )}
                          </div>

                          <div className="md:col-span-3">
                            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">Curso</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3">
                              <Campo label="Curso" value={i.course_id ? courseMap.get(i.course_id) : '—'} />
                              <Campo label="Modalidade" value={leModalidade(i.observacoes).modalidade} />
                              {editando ? (
                                <div>
                                  <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">Tipo de instituição</p>
                                  <select
                                    className="mt-0.5 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    value={campo('tipo_instituicao')}
                                    onChange={(e) => mudaCampo('tipo_instituicao')(e.target.value)}
                                  >
                                    {TIPOS_INSTITUICAO.map((t) => (
                                      <option key={t} value={t}>{t}</option>
                                    ))}
                                  </select>
                                </div>
                              ) : (
                                <Campo label="Tipo de instituição" value={i.tipo_instituicao} />
                              )}
                              {editando ? (
                                <>
                                  <CampoEdit label="Município" value={campo('municipio')} onChange={mudaCampo('municipio')} />
                                  <CampoEdit label="UF" value={campo('estado')} onChange={mudaCampo('estado')} />
                                </>
                              ) : (
                                <Campo label="Município/UF" value={`${i.municipio}/${i.estado}`} />
                              )}
                              <div className="md:col-span-3">
                                {editando ? (
                                  <CampoEdit
                                    label="Inscritos (um por linha)"
                                    value={campo('nomes_inscritos')}
                                    onChange={mudaCampo('nomes_inscritos')}
                                    multiline
                                  />
                                ) : (
                                  <Campo
                                    label={`Inscritos (${i.num_inscritos})`}
                                    value={<span className="whitespace-pre-line">{i.nomes_inscritos}</span>}
                                  />
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="md:col-span-3">
                            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">Nota Fiscal</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3">
                              {editando ? (
                                <>
                                  <CampoEdit
                                    label={campo('tipo_instituicao') === 'Particular' ? 'Nome completo' : 'Razão social'}
                                    value={campo('razao_social')} onChange={mudaCampo('razao_social')}
                                  />
                                  <CampoEdit
                                    label={campo('tipo_instituicao') === 'Particular' ? 'CPF' : 'CNPJ'}
                                    value={campo('cnpj')} onChange={mudaCampo('cnpj')}
                                  />
                                  <CampoEdit label="CEP" value={campo('cep')} onChange={mudaCampo('cep')} />
                                  <CampoEdit label="Endereço" value={campo('endereco')} onChange={mudaCampo('endereco')} />
                                  <CampoEdit label="Número" value={campo('numero')} onChange={mudaCampo('numero')} />
                                  <CampoEdit label="Complemento" value={campo('complemento')} onChange={mudaCampo('complemento')} />
                                  <CampoEdit label="Bairro" value={campo('bairro')} onChange={mudaCampo('bairro')} />
                                  <CampoEdit label="Cidade" value={campo('cidade')} onChange={mudaCampo('cidade')} />
                                  <CampoEdit label="UF" value={campo('uf')} onChange={mudaCampo('uf')} />
                                </>
                              ) : (
                                <>
                                  <Campo
                                    label={i.tipo_instituicao === 'Particular' ? 'Nome completo' : 'Razão social'}
                                    value={i.razao_social}
                                  />
                                  <Campo
                                    label={i.tipo_instituicao === 'Particular' ? 'CPF' : 'CNPJ'}
                                    value={i.cnpj}
                                  />
                                  <Campo label="CEP" value={i.cep} />
                                  <Campo
                                    label="Endereço"
                                    value={`${i.endereco}, ${i.numero}${i.complemento ? ` — ${i.complemento}` : ''}`}
                                  />
                                  <Campo label="Bairro" value={i.bairro} />
                                  <Campo label="Cidade/UF" value={`${i.cidade}/${i.uf}`} />
                                </>
                              )}
                            </div>
                          </div>

                          <div className="md:col-span-3">
                            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">Responsável</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3">
                              {editando ? (
                                <>
                                  <CampoEdit label="Nome" value={campo('resp_nome')} onChange={mudaCampo('resp_nome')} />
                                  <CampoEdit label="CPF" value={campo('resp_cpf')} onChange={mudaCampo('resp_cpf')} />
                                  <CampoEdit label="E-mail" value={campo('resp_email')} onChange={mudaCampo('resp_email')} />
                                  <CampoEdit label="Telefone" value={campo('resp_telefone')} onChange={mudaCampo('resp_telefone')} />
                                </>
                              ) : (
                                <>
                                  <Campo label="Nome" value={i.resp_nome} />
                                  <Campo label="CPF" value={i.resp_cpf} />
                                  <Campo label="E-mail" value={i.resp_email} />
                                  <Campo label="Telefone" value={i.resp_telefone} />
                                </>
                              )}
                              <div className="md:col-span-2">
                                <Campo label="Observações" value={leModalidade(i.observacoes).observacoes} />
                              </div>
                            </div>
                          </div>

                          <div className="md:col-span-3">
                            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">Pagamento</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3">
                              {editando ? (
                                <div>
                                  <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">Forma de pagamento</p>
                                  <select
                                    className="mt-0.5 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    value={rascunho.forma_pagamento ?? i.forma_pagamento ?? ''}
                                    onChange={(e) => {
                                      const v = e.target.value;
                                      // Só envia quando muda: inscrições antigas têm opções que não
                                      // existem mais ("Cartão de Crédito", "Cheque"...) e continuam valendo.
                                      setRascunho((r) => {
                                        const { forma_pagamento: _, ...resto } = r;
                                        return v === i.forma_pagamento ? resto : { ...resto, forma_pagamento: v };
                                      });
                                    }}
                                  >
                                    {i.forma_pagamento && !FORMAS_PAGAMENTO.includes(i.forma_pagamento) && (
                                      <option value={i.forma_pagamento}>{i.forma_pagamento}</option>
                                    )}
                                    {FORMAS_PAGAMENTO.map((f) => (
                                      <option key={f} value={f}>{f}</option>
                                    ))}
                                  </select>
                                </div>
                              ) : (
                                <Campo label="Forma de pagamento" value={i.forma_pagamento} />
                              )}
                              <Campo
                                label="Data para NF"
                                value={i.data_nota_fiscal ? new Date(i.data_nota_fiscal + 'T12:00:00').toLocaleDateString('pt-BR') : '—'}
                              />
                              <Campo
                                label="Vencimento = início do curso"
                                value={i.vencimento_igual_inicio ? 'Sim' : 'Não'}
                              />
                              <Campo
                                label="E-mails"
                                value={`Cliente: ${i.email_cliente_enviado ? 'enviado ✓' : 'não enviado'} · Plenum: ${i.email_plenum_enviado ? 'enviado ✓' : 'não enviado'}`}
                              />
                            </div>
                          </div>
                        </div>
                      </details>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Aba Leads ── */}
        <TabsContent value="leads">
          <Card>
            <CardHeader>
              <CardTitle>Últimos Leads</CardTitle>
            </CardHeader>
            <CardContent>
              {leadsFiltrados.length === 0 ? (
                <p className="text-sm text-gray-500 py-8 text-center">
                  {termo
                    ? `Nenhum lead encontrado para "${busca.trim()}".`
                    : cursoId === 'todos'
                      ? 'Nenhum lead capturado ainda.'
                      : 'Nenhum lead neste curso ainda.'}
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>WhatsApp</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Curso</TableHead>
                        <TableHead>UF</TableHead>
                        <TableHead>Órgão</TableHead>
                        <TableHead>Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leadsFiltrados.map((lead) => {
                        const ft = formTypeMap[lead.form_type] || formTypeMap.folder;
                        return (
                          <TableRow key={lead.id}>
                            <TableCell className="font-medium">{lead.nome}</TableCell>
                            <TableCell className="text-sm">{lead.email || '—'}</TableCell>
                            <TableCell className="text-sm">{lead.whatsapp || '—'}</TableCell>
                            <TableCell>
                              <Badge variant={ft.variant}>{ft.label}</Badge>
                            </TableCell>
                            <TableCell className="text-sm max-w-[150px] truncate">
                              {lead.course_id ? (courseMap.get(lead.course_id) || lead.course_id) : '—'}
                            </TableCell>
                            <TableCell className="text-sm">{lead.estado || '—'}</TableCell>
                            <TableCell className="text-sm">{lead.orgao || '—'}</TableCell>
                            <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                              {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
