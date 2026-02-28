'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Download, CheckCircle2, ArrowRight, CreditCard, Info, Building2, MapPin, Phone, Globe, Mail, FileText, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/neon-button';
import Grainient from './Grainient';

gsap.registerPlugin(ScrollTrigger);

export default function FolderForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [ctaSubmitted, setCtaSubmitted] = useState(false);
  const [openCancelamento, setOpenCancelamento] = useState(false);
  const [openEmpresa, setOpenEmpresa] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    email: '',
    estado: '',
    cidade: '',
    orgao: '',
    captcha: '',
  });
  const [ctaForm, setCtaForm] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    orgao: '',
  });

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.folder-anim',
        { y: 30, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      );
      gsap.from('.cta-content', {
        scrollTrigger: { trigger: '.cta-content', start: 'top 80%' },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleCtaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCtaForm({ ...ctaForm, [e.target.name]: e.target.value });
  };

  const handleCtaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCtaSubmitted(true);
  };

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
    'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
  ];

  const inputClasses = "w-full px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-blue-500/40 focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all";

  return (
    <section ref={sectionRef} id="folder" className="pt-24 md:pt-32 px-6 md:px-12 relative overflow-hidden">
      {/* ── Grainient background ── */}
      <div className="absolute inset-0 pointer-events-none">
        <Grainient
          color1="#030d1f"
          color2="#378bae"
          color3="#030d1f"
          timeSpeed={2.2}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={1}
          warpSpeed={0}
          warpAmplitude={50}
          blendAngle={52}
          blendSoftness={0.05}
          rotationAmount={0}
          noiseScale={2}
          grainAmount={0.03}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">

          {/* Left — Text */}
          <div className="lg:w-1/2 flex flex-col">
            <div className="folder-anim inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#3b82f6]/20 bg-[#3b82f6]/5 text-[#3b82f6] text-[12px] font-semibold w-fit mb-6">
              <Download className="w-4 h-4" />
              Material Exclusivo
            </div>

            <h2 className="folder-anim font-[var(--font-bricolage)] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-5">
              <span className="bg-gradient-to-b from-white via-white/90 to-white/55 bg-clip-text text-transparent">Baixe o Folder</span><br />
              <span className="bg-gradient-to-r from-white/40 to-white/20 bg-clip-text text-transparent">Completo do Evento</span>
            </h2>

            <p className="folder-anim text-white/50 text-base md:text-lg leading-relaxed max-w-[480px] mb-8">
              Tenha acesso a todos os detalhes técnicos, programação detalhada hora a hora, currículo completo da palestrante e informações de investimento.
            </p>

            <div className="folder-anim inline-flex items-center gap-4 px-5 py-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] w-fit hover:border-white/[0.12] transition-colors">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3b82f6]/20 to-[#60a5fa]/10 flex items-center justify-center text-[#3b82f6]">
                <Download className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm">PDF Completo</span>
                <span className="text-white/40 text-xs">Versão Atualizada</span>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="lg:w-1/2 w-full folder-anim">
            <div className="relative">
              {/* Glow behind form */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#3b82f6]/5 to-[#60a5fa]/3 blur-2xl scale-105 pointer-events-none" />

              <div className="relative rounded-3xl p-8 md:p-10 bg-[#0b1a30] border border-white/[0.08] hover:border-white/[0.12] transition-colors">
                {submitted ? (
                  <div className="text-center py-16 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#3b82f6]/10 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-[#3b82f6]" />
                    </div>
                    <h3 className="font-[var(--font-bricolage)] text-2xl font-bold text-white">Enviado com sucesso!</h3>
                    <p className="text-white/50 text-sm max-w-[280px]">O folder será enviado para o seu e-mail em instantes.</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h3 className="font-[var(--font-bricolage)] text-xl font-bold text-white mb-2">Preencha seus dados</h3>
                      <p className="text-white/40 text-sm">Download imediato após o preenchimento.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                      <div>
                        <label className="text-white/60 text-[11px] uppercase font-bold tracking-widest block mb-2">Nome Completo *</label>
                        <input type="text" name="nome" required value={form.nome} onChange={handleChange} placeholder="Seu nome" className={inputClasses} />
                      </div>

                      <div>
                        <label className="text-white/60 text-[11px] uppercase font-bold tracking-widest block mb-2">Email Corporativo *</label>
                        <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="seu@email.com" className={inputClasses} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-white/60 text-[11px] uppercase font-bold tracking-widest block mb-2">Estado *</label>
                          <select name="estado" required value={form.estado} onChange={handleChange} className={`${inputClasses} appearance-none cursor-pointer`}>
                            <option value="" className="bg-[#0a1a33]">UF</option>
                            {estados.map((uf) => (
                              <option key={uf} value={uf} className="bg-[#0a1a33]">{uf}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-white/60 text-[11px] uppercase font-bold tracking-widest block mb-2">Cidade *</label>
                          <input type="text" name="cidade" required value={form.cidade} onChange={handleChange} placeholder="Cidade" className={inputClasses} />
                        </div>
                      </div>

                      <div>
                        <label className="text-white/60 text-[11px] uppercase font-bold tracking-widest block mb-2">Órgão Representante</label>
                        <select name="orgao" required value={form.orgao} onChange={handleChange} className={`${inputClasses} appearance-none cursor-pointer`}>
                          <option value="" className="bg-[#0a1a33]">Selecione o tipo</option>
                          <option value="Prefeitura" className="bg-[#0a1a33]">Prefeitura</option>
                          <option value="Câmara" className="bg-[#0a1a33]">Câmara Municipal</option>
                          <option value="Governo Estadual" className="bg-[#0a1a33]">Governo Estadual</option>
                          <option value="Outro" className="bg-[#0a1a33]">Outro</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-white/60 text-[11px] uppercase font-bold tracking-widest block mb-2">Quanto é 1 + 1? *</label>
                        <input type="text" name="captcha" required value={form.captcha} onChange={handleChange} placeholder="Responda o número" className={inputClasses} />
                      </div>

                      <button type="submit" className="w-full mt-2 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#3b82f6] text-white text-sm font-bold hover:bg-[#60a5fa] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-300">
                        <Download className="w-4 h-4" />
                        Baixar Agora
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Info Cards ── */}
      <div className="max-w-[1200px] mx-auto relative z-10 mt-10 flex flex-col gap-3">

        {/* 1. Formas de Pagamento */}
        <div className="flex flex-col md:flex-row items-center gap-6 rounded-2xl border border-white/[0.08] bg-[#0b1a30] px-6 py-5">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-11 h-11 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-[#3b82f6] flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white font-bold text-sm uppercase tracking-wider mb-0.5">Formas de Pagamento</p>
              <p className="text-white/45 text-sm leading-relaxed">Boleto bancário, transferência, cheque ou dinheiro.<br className="hidden md:block" />Depósito, TED ou ordem bancária.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="hidden md:block w-px h-10 bg-white/[0.08]" />
            <div className="text-center">
              <p className="text-white/35 text-[10px] uppercase tracking-widest mb-1">Solicite informações no financeiro:</p>
              <a
                href="https://wa.me/553125311776"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2.5 rounded-full bg-[#3b82f6] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#60a5fa] transition-colors"
              >
                Setor Financeiro
              </a>
            </div>
            <div className="hidden md:block w-px h-10 bg-white/[0.08]" />
            <div className="text-center">
              <p className="text-white font-bold text-sm">PIX</p>
              <p className="text-white/35 text-[10px] uppercase tracking-widest">Consulte</p>
            </div>
          </div>
        </div>

        {/* 2. Política de Cancelamento */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0b1a30] overflow-hidden">
          <button
            onClick={() => setOpenCancelamento(!openCancelamento)}
            className="w-full flex items-center justify-between px-6 py-5 text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-[#3b82f6] flex items-center justify-center shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <p className="text-white font-bold text-sm uppercase tracking-wider">Política de Cancelamento</p>
            </div>
            <ChevronDown className={`w-5 h-5 text-white/40 transition-transform duration-300 ${openCancelamento ? 'rotate-180' : ''}`} />
          </button>
          {openCancelamento && (
            <div className="px-6 pb-6 space-y-4">
              <div className="rounded-xl border border-[#3b82f6]/10 bg-[#3b82f6]/5 p-4">
                <p className="text-white/60 text-sm leading-relaxed italic">
                  "O não comparecimento ao curso no qual você tem inscrição confirmada irá gerar a cobrança de{' '}
                  <strong className="text-white not-italic">50% do valor</strong> para custeio do material utilizado,
                  exceto se houver o cancelamento até{' '}
                  <strong className="text-[#3b82f6] not-italic">72 horas antes</strong> do início."
                </p>
              </div>
              <p className="text-white/45 text-sm leading-relaxed">
                O Instituto Plenum Brasil reserva-se o direito de cancelar qualquer evento em caso fortuito, por força maior, ou por falta de quórum.
              </p>
              <div className="flex items-start gap-3 rounded-xl border border-[#3b82f6]/10 bg-[#3b82f6]/5 p-4">
                <Info className="w-4 h-4 text-[#3b82f6] shrink-0 mt-0.5" />
                <p className="text-white/55 text-sm leading-relaxed">
                  <strong className="text-white">Atenção:</strong> Confirme, previamente, a realização do curso antes de efetuar a compra de passagens aéreas e o pagamento da hospedagem.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 3. Dados da Empresa */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0b1a30] overflow-hidden">
          <button
            onClick={() => setOpenEmpresa(!openEmpresa)}
            className="w-full flex items-center justify-between px-6 py-5 text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-[#3b82f6] flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <p className="text-white font-bold text-sm uppercase tracking-wider">Dados da Empresa</p>
            </div>
            <ChevronDown className={`w-5 h-5 text-white/40 transition-transform duration-300 ${openEmpresa ? 'rotate-180' : ''}`} />
          </button>
          {openEmpresa && (
            <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-white/30 text-[10px] uppercase tracking-widest flex items-center gap-2"><MapPin className="w-3 h-3" /> Endereço</p>
                <p className="text-white/65 text-sm leading-relaxed">Rua Espírito Santo, nº 1204, 2º andar – sala 1<br />Bairro Lourdes – BH/MG – CEP: 30.160-033</p>
              </div>
              <div className="space-y-1">
                <p className="text-white/30 text-[10px] uppercase tracking-widest flex items-center gap-2"><Mail className="w-3 h-3" /> E-mails</p>
                <p className="text-white/65 text-sm">plenumgestaooficial@gmail.com</p>
                <p className="text-white/65 text-sm">financeiro@plenumbrasil.com</p>
              </div>
              <div className="space-y-1">
                <p className="text-white/30 text-[10px] uppercase tracking-widest flex items-center gap-2"><Phone className="w-3 h-3" /> Contatos</p>
                <p className="text-white/65 text-sm">31 2531-1776</p>
                <p className="text-white/65 text-sm">31 2531-1750</p>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-white/30 text-[10px] uppercase tracking-widest flex items-center gap-2"><Globe className="w-3 h-3" /> Website</p>
                  <a href="https://www.plenumbrasil.com.br" target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] text-sm hover:text-[#60a5fa] transition-colors">www.plenumbrasil.com.br</a>
                </div>
                <div className="rounded-xl border border-[#3b82f6]/10 bg-[#3b82f6]/5 p-3">
                  <p className="text-white font-bold text-xs flex items-center gap-2 mb-1"><FileText className="w-3 h-3 text-[#3b82f6]" /> Contratação</p>
                  <p className="text-white/45 text-xs italic">"Solicite os documentos e demais informações para contratação."</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── EnrollCTA — Glass card, edge to edge, rounded top corners ── */}
      <div id="notificacao" className="cta-content relative z-10 mt-10 -mx-6 md:-mx-12">
        <div className="relative rounded-t-[3.5rem] bg-white/[0.04] backdrop-blur-md border border-white/[0.08] border-b-0 p-8 md:p-16 overflow-hidden">
          <div className="relative z-10 max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h2 className="font-[var(--font-bricolage)] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] text-white mb-5">
                Quero esse curso<br />no meu órgão
              </h2>
              <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-[500px] mx-auto lg:mx-0">
                Capacite toda sua equipe com uma formação personalizada. Montamos uma turma exclusiva para o seu município, câmara ou órgão estadual.
              </p>
            </div>

            <div className="lg:w-1/2 w-full">
              {ctaSubmitted ? (
                <div className="text-center py-12 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#3b82f6]/10 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-[#3b82f6]" />
                  </div>
                  <h3 className="font-[var(--font-bricolage)] text-2xl font-bold text-white">Proposta solicitada!</h3>
                  <p className="text-white/50 text-sm max-w-[280px]">Nossa equipe entrará em contato para montar a melhor proposta para o seu órgão.</p>
                </div>
              ) : (
                <form onSubmit={handleCtaSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="text-white/60 text-[11px] uppercase font-bold tracking-widest block mb-2">Nome Completo</label>
                    <input type="text" name="nome" required value={ctaForm.nome} onChange={handleCtaChange} placeholder="Seu nome" className="w-full px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-blue-500/40 focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all" />
                  </div>
                  <div>
                    <label className="text-white/60 text-[11px] uppercase font-bold tracking-widest block mb-2">Órgão / Instituição</label>
                    <input type="text" name="orgao" required value={ctaForm.orgao} onChange={handleCtaChange} placeholder="Prefeitura, Câmara, Governo..." className="w-full px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-blue-500/40 focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all" />
                  </div>
                  <div>
                    <label className="text-white/60 text-[11px] uppercase font-bold tracking-widest block mb-2">WhatsApp</label>
                    <input type="tel" name="whatsapp" required value={ctaForm.whatsapp} onChange={handleCtaChange} placeholder="(00) 00000-0000" className="w-full px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-blue-500/40 focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all" />
                  </div>
                  <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    className="mt-2 w-full inline-flex items-center justify-center gap-2 py-4 text-white text-sm font-medium"
                  >
                    Solicitar proposta
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
