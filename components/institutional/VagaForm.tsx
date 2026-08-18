'use client';

import { useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2, Paperclip, X } from 'lucide-react';

const INTERESSES = [
  'Professor / Palestrante',
  'Time administrativo e comercial',
] as const;

const inputCls =
  'w-full rounded-[14px] border border-[#030D1F]/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#C9A227]';

const MAX_MB = 5;

export default function VagaForm() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    interesse: INTERESSES[0] as string,
    area: '',
    linkedin: '',
    mensagem: '',
  });
  const [curriculo, setCurriculo] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (campo: string, valor: string) => setForm((f) => ({ ...f, [campo]: valor }));

  function escolheArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    if (f && f.size > MAX_MB * 1024 * 1024) {
      setErro(`O currículo precisa ter no máximo ${MAX_MB} MB.`);
      e.target.value = '';
      return;
    }
    setErro(null);
    setCurriculo(f);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!form.nome.trim() || !form.email.trim()) {
      setErro('Preencha ao menos o nome e o e-mail.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErro('E-mail inválido.');
      return;
    }

    setEnviando(true);
    const dados = new FormData();
    Object.entries(form).forEach(([k, v]) => dados.append(k, v));
    if (curriculo) dados.append('curriculo', curriculo);

    try {
      const res = await fetch('/api/vagas', { method: 'POST', body: dados });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErro(json.error || 'Não foi possível enviar agora. Tente novamente em instantes.');
        setEnviando(false);
        return;
      }
      setEnviado(true);
    } catch {
      setErro('Falha de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  if (enviado) {
    return (
      <div className="reveal mx-auto max-w-2xl card-light p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-[#C9A227]" />
        <h2 className="font-display text-[26px] leading-tight mb-2">Interesse enviado!</h2>
        <p className="text-sm leading-relaxed text-[#555]">
          Recebemos os seus dados, <strong>{form.nome.split(' ')[0]}</strong>. Nosso time olha todos os
          currículos e entra em contato quando surgir uma oportunidade com o seu perfil.
        </p>
      </div>
    );
  }

  return (
    <div className="reveal mx-auto max-w-2xl card-light p-6 lg:p-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a6e1a] mb-5">
        Formulário de interesse
      </p>

      {erro && (
        <div className="mb-4 rounded-[14px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {erro}
        </div>
      )}

      <form className="space-y-3" onSubmit={handleSubmit}>
        <input
          className={inputCls}
          placeholder="Nome completo *"
          value={form.nome}
          onChange={(e) => set('nome', e.target.value)}
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="email"
            className={inputCls}
            placeholder="E-mail *"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            required
          />
          <input
            className={inputCls}
            placeholder="WhatsApp"
            value={form.whatsapp}
            onChange={(e) => set('whatsapp', e.target.value)}
          />
        </div>

        <select
          className="w-full rounded-[14px] border border-[#C9A227]/25 bg-[#030D1F] px-4 py-3 text-sm text-white outline-none"
          value={form.interesse}
          onChange={(e) => set('interesse', e.target.value)}
        >
          {INTERESSES.map((i) => (
            <option key={i} value={i}>Interesse: {i}</option>
          ))}
        </select>

        <input
          className={inputCls}
          placeholder="Área de especialidade ou cargo de interesse"
          value={form.area}
          onChange={(e) => set('area', e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            className={inputCls}
            placeholder="LinkedIn"
            value={form.linkedin}
            onChange={(e) => set('linkedin', e.target.value)}
          />

          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={escolheArquivo}
          />
          {curriculo ? (
            <div className="flex items-center justify-between gap-2 rounded-[14px] border border-[#C9A227]/40 bg-[#C9A227]/[0.08] px-4 py-3 text-sm">
              <span className="truncate text-[#030D1F]">{curriculo.name}</span>
              <button
                type="button"
                onClick={() => { setCurriculo(null); if (fileRef.current) fileRef.current.value = ''; }}
                aria-label="Remover currículo"
                className="shrink-0 text-[#555] hover:text-[#030D1F]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center justify-center gap-2 rounded-[14px] border border-[#030D1F]/10 bg-white px-4 py-3 text-sm text-[#555] transition-colors hover:border-[#C9A227]"
            >
              <Paperclip className="h-4 w-4 text-[#C9A227]" />
              Anexar currículo
            </button>
          )}
        </div>

        <textarea
          className={`${inputCls} min-h-28`}
          placeholder="Por que você é mão na massa?"
          value={form.mensagem}
          onChange={(e) => set('mensagem', e.target.value)}
        />

        <button type="submit" disabled={enviando} className="pl-btn-primary w-full justify-center disabled:opacity-60">
          {enviando ? (
            <>Enviando... <Loader2 className="w-4 h-4 animate-spin" /></>
          ) : (
            <>Enviar interesse <ArrowRight className="w-4 h-4" /></>
          )}
        </button>

        <p className="pt-1 text-center text-[11px] text-[#888]">
          PDF ou Word, até {MAX_MB} MB. Seus dados são usados apenas no processo seletivo.
        </p>
      </form>
    </div>
  );
}
