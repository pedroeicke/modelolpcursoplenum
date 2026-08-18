'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, MapPin, Monitor } from 'lucide-react';

export interface CursoOption {
  id: string;
  slug: string;
  title: string;
  /** presencial | online | hibrido — define quais opções de participação aparecem */
  modality: 'presencial' | 'online' | 'hibrido' | null;
  turmas: { id: string; label: string }[];
}

const UFS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
];

const TIPOS_INSTITUICAO = ['Órgão Público', 'Particular', 'Empresa'];
const FORMAS_PAGAMENTO = ['Boleto', 'Cartão de Crédito', 'Cheque', 'Dinheiro', 'Depósito Identificado'];

const NAVY = '#030D1F';
const GOLD = '#C9A227';

const inputCls =
  'w-full px-4 py-3 rounded-xl bg-white border border-[#030D1F]/15 text-[#030D1F] text-sm placeholder:text-[#030D1F]/30 focus:outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/25 transition-all';
const labelCls = 'text-[#030D1F]/60 text-[11px] uppercase font-bold tracking-widest block mb-2';
const sectionCls = 'rounded-2xl border border-[#030D1F]/8 bg-white shadow-[0_2px_16px_rgba(3,13,31,0.05)] p-6 md:p-8 space-y-5';
const sectionH2Cls = 'text-[#030D1F] font-bold text-lg flex items-center gap-2.5';
const goldDot = <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: GOLD }} />;

export default function InscricaoForm({
  cursos,
  cursoSlugInicial,
  turmaIdInicial,
  modalidadeInicial,
}: {
  cursos: CursoOption[];
  cursoSlugInicial: string | null;
  turmaIdInicial: string | null;
  modalidadeInicial: 'presencial' | 'online' | null;
}) {
  const cursoInicial = cursos.find((c) => c.slug === cursoSlugInicial) || null;

  const [courseId, setCourseId] = useState<string>(cursoInicial?.id || '');
  const [turmaId, setTurmaId] = useState<string>(() => {
    if (turmaIdInicial && cursoInicial?.turmas.some((t) => t.id === turmaIdInicial)) return turmaIdInicial;
    return cursoInicial?.turmas[0]?.id || '';
  });
  // vem escolhida do botão da landing page; o inscrito ainda pode trocar aqui
  const [modalidade, setModalidade] = useState<'presencial' | 'online'>(modalidadeInicial || 'presencial');

  const [form, setForm] = useState({
    tipo_instituicao: '',
    num_inscritos: '1',
    nomes_inscritos: '',
    municipio: '',
    estado: '',
    razao_social: '',
    cnpj: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    resp_nome: '',
    resp_cpf: '',
    resp_email: '',
    resp_telefone: '',
    observacoes: '',
    forma_pagamento: '',
    data_nota_fiscal: '',
    vencimento_igual_inicio: false,
  });

  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const cursoSelecionado = useMemo(() => cursos.find((c) => c.id === courseId) || null, [cursos, courseId]);

  // curso só presencial não oferece online, e vice-versa
  const opcoesModalidade = useMemo<Array<'presencial' | 'online'>>(() => {
    if (cursoSelecionado?.modality === 'presencial') return ['presencial'];
    if (cursoSelecionado?.modality === 'online') return ['online'];
    return ['presencial', 'online'];
  }, [cursoSelecionado]);

  const modalidadeEfetiva = opcoesModalidade.includes(modalidade) ? modalidade : opcoesModalidade[0];

  function set(name: string, value: string | boolean) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const t = e.target;
    set(t.name, t.type === 'checkbox' ? (t as HTMLInputElement).checked : t.value);
  }

  function handleCursoChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value;
    setCourseId(id);
    const c = cursos.find((x) => x.id === id);
    setTurmaId(c?.turmas[0]?.id || '');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    if (!courseId) {
      setErro('Selecione o curso.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setEnviando(true);
    const corpo = JSON.stringify({
      course_id: courseId,
      course_date_id: turmaId || null,
      modalidade: modalidadeEfetiva,
      ...form,
    });

    // falha de rede é comum em rede de órgão público: tenta 3x antes de desistir
    let ultimoErro: unknown = null;
    for (let tentativa = 1; tentativa <= 3; tentativa++) {
      try {
        const res = await fetch('/api/inscricoes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: corpo,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          // erro de validação/servidor: repetir não resolve
          setErro(data.error || 'Não foi possível concluir a inscrição. Tente novamente.');
          setEnviando(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        setEnviado(true);
        setEnviando(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      } catch (err) {
        ultimoErro = err;
        if (tentativa < 3) await new Promise((r) => setTimeout(r, tentativa * 1500));
      }
    }

    console.error('Falha ao enviar inscrição:', ultimoErro);
    setErro(
      'Não conseguimos enviar sua inscrição — parece instabilidade na conexão. ' +
        'Seus dados continuam preenchidos: aguarde alguns segundos e clique novamente. ' +
        'Se persistir, fale com a gente pelo WhatsApp (31) 2531-1776.'
    );
    setEnviando(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (enviado) {
    return (
      <div className="max-w-[640px] mx-auto px-6 py-24 text-center">
        <CheckCircle2 className="w-16 h-16 mx-auto mb-6" style={{ color: GOLD }} />
        <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: NAVY }}>
          Inscrição enviada!
        </h1>
        <p className="text-[#030D1F]/60 leading-relaxed mb-3">
          Recebemos a sua inscrição no curso{' '}
          <strong style={{ color: NAVY }}>{cursoSelecionado?.title}</strong>.
        </p>
        <p className="text-[#030D1F]/60 leading-relaxed mb-10">
          Você receberá um e-mail de confirmação e nossa equipe entrará em contato em breve para
          finalizar os detalhes.
        </p>
        <a
          href={cursoSelecionado ? `/cursos/${cursoSelecionado.slug}` : '/'}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold uppercase tracking-wide transition-colors hover:bg-[#e4bc44]"
          style={{ backgroundColor: GOLD, color: NAVY }}
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para o curso
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-[820px] mx-auto px-6 py-12 md:py-16">
      {/* Header */}
      <div className="mb-10">
        {cursoSelecionado && (
          <a
            href={`/cursos/${cursoSelecionado.slug}`}
            className="inline-flex items-center gap-2 text-[#030D1F]/40 hover:text-[#030D1F]/70 text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o curso
          </a>
        )}
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: GOLD }}>
          {goldDot}
          Inscrição
        </p>
        <h1 className="text-3xl md:text-5xl font-semibold leading-[1.1] tracking-[-0.02em] mb-3" style={{ color: NAVY }}>
          Garanta sua vaga
        </h1>
        <p className="text-[#030D1F]/55 text-sm md:text-base leading-relaxed max-w-[560px]">
          Preencha os dados abaixo e nossa equipe entrará em contato para confirmar sua inscrição.
        </p>
      </div>

      {erro && (
        <div className="mb-6 px-5 py-4 rounded-xl border border-red-300 bg-red-50 text-red-700 text-sm">
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── Seção 1: Curso ── */}
        <div className={sectionCls}>
          <h2 className={sectionH2Cls}>{goldDot}Curso</h2>

          <div>
            <label className={labelCls}>Curso *</label>
            <select name="curso" required value={courseId} onChange={handleCursoChange} className={inputCls}>
              <option value="">Selecione o curso...</option>
              {cursos.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          {cursoSelecionado && cursoSelecionado.turmas.length > 0 && (
            <div>
              <label className={labelCls}>Turma *</label>
              <select name="turma" required value={turmaId} onChange={(e) => setTurmaId(e.target.value)} className={inputCls}>
                {cursoSelecionado.turmas.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>
          )}

          {opcoesModalidade.length > 1 && (
          <div>
            <label className={labelCls}>Como vai participar? *</label>
            <div className="grid grid-cols-2 gap-3">
              {opcoesModalidade.map((m) => {
                const ativo = modalidadeEfetiva === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setModalidade(m)}
                    aria-pressed={ativo}
                    className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all"
                    style={{
                      borderColor: ativo ? GOLD : '#D8DCE3',
                      backgroundColor: ativo ? `${GOLD}14` : '#fff',
                      color: ativo ? NAVY : '#6B7280',
                    }}
                  >
                    {m === 'presencial' ? <MapPin className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                    {m === 'presencial' ? 'Presencial' : 'Online (ao vivo)'}
                  </button>
                );
              })}
            </div>
          </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Tipo de Instituição *</label>
              <select name="tipo_instituicao" required value={form.tipo_instituicao} onChange={handleChange} className={inputCls}>
                <option value="">Selecione...</option>
                {TIPOS_INSTITUICAO.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Número de Inscritos *</label>
              <select name="num_inscritos" required value={form.num_inscritos} onChange={handleChange} className={inputCls}>
                {Array.from({ length: 20 }, (_, i) => String(i + 1)).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Nome dos Inscritos * <span className="normal-case font-normal tracking-normal">(um por linha)</span></label>
            <textarea
              name="nomes_inscritos"
              required
              value={form.nomes_inscritos}
              onChange={handleChange}
              rows={Math.max(2, Number(form.num_inscritos))}
              placeholder={'Nome completo do inscrito 1\nNome completo do inscrito 2'}
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Município *</label>
              <input type="text" name="municipio" required value={form.municipio} onChange={handleChange} placeholder="Belo Horizonte" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Estado *</label>
              <select name="estado" required value={form.estado} onChange={handleChange} className={inputCls}>
                <option value="">UF...</option>
                {UFS.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Seção 2: Nota Fiscal ── */}
        <div className={sectionCls}>
          <h2 className={sectionH2Cls}>{goldDot}Dados para a Nota Fiscal</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Razão Social *</label>
              <input type="text" name="razao_social" required value={form.razao_social} onChange={handleChange} placeholder="Prefeitura Municipal de..." className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>CNPJ *</label>
              <input type="text" name="cnpj" required value={form.cnpj} onChange={handleChange} placeholder="00.000.000/0001-00" className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className={labelCls}>CEP *</label>
              <input type="text" name="cep" required value={form.cep} onChange={handleChange} placeholder="00000-000" className={inputCls} />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Endereço *</label>
              <input type="text" name="endereco" required value={form.endereco} onChange={handleChange} placeholder="Rua, avenida..." className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className={labelCls}>Número *</label>
              <input type="text" name="numero" required value={form.numero} onChange={handleChange} placeholder="123" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Complemento</label>
              <input type="text" name="complemento" value={form.complemento} onChange={handleChange} placeholder="Sala, andar..." className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Bairro *</label>
              <input type="text" name="bairro" required value={form.bairro} onChange={handleChange} placeholder="Centro" className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Cidade *</label>
              <input type="text" name="cidade" required value={form.cidade} onChange={handleChange} placeholder="Belo Horizonte" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>UF *</label>
              <select name="uf" required value={form.uf} onChange={handleChange} className={inputCls}>
                <option value="">UF...</option>
                {UFS.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Seção 3: Responsável ── */}
        <div className={sectionCls}>
          <h2 className={sectionH2Cls}>{goldDot}Responsável pela Inscrição</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Nome *</label>
              <input type="text" name="resp_nome" required value={form.resp_nome} onChange={handleChange} placeholder="Seu nome completo" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>CPF *</label>
              <input type="text" name="resp_cpf" required value={form.resp_cpf} onChange={handleChange} placeholder="000.000.000-00" className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>E-mail *</label>
              <input type="email" name="resp_email" required value={form.resp_email} onChange={handleChange} placeholder="voce@orgao.gov.br" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Telefone *</label>
              <input type="tel" name="resp_telefone" required value={form.resp_telefone} onChange={handleChange} placeholder="(00) 00000-0000" className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Observações</label>
            <textarea name="observacoes" value={form.observacoes} onChange={handleChange} rows={3} placeholder="Alguma observação sobre a inscrição? (opcional)" className={inputCls} />
          </div>
        </div>

        {/* ── Seção 4: Pagamento ── */}
        <div className={sectionCls}>
          <h2 className={sectionH2Cls}>{goldDot}Pagamento</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Forma de Pagamento *</label>
              <select name="forma_pagamento" required value={form.forma_pagamento} onChange={handleChange} className={inputCls}>
                <option value="">Selecione...</option>
                {FORMAS_PAGAMENTO.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Data para Nota Fiscal</label>
              <input type="date" name="data_nota_fiscal" value={form.data_nota_fiscal} onChange={handleChange} className={inputCls} />
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer text-sm text-[#030D1F]/60">
            <input
              type="checkbox"
              name="vencimento_igual_inicio"
              checked={form.vencimento_igual_inicio}
              onChange={handleChange}
              className="mt-0.5 w-4 h-4 rounded accent-[#C9A227]"
            />
            Vencimento do boleto igual à data de início do curso
          </label>
        </div>

        <button
          type="submit"
          disabled={enviando}
          className="w-full inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-sm font-semibold uppercase tracking-wide transition-colors hover:bg-[#e4bc44] disabled:opacity-60"
          style={{ backgroundColor: GOLD, color: NAVY }}
        >
          {enviando ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              Enviar inscrição
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-[#030D1F]/35 text-xs text-center leading-relaxed">
          Ao enviar, você receberá um e-mail de confirmação e nossa equipe entrará em contato.
        </p>
      </form>
    </div>
  );
}
