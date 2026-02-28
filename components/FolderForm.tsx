'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Download, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/neon-button';
import Grainient from './Grainient';

gsap.registerPlugin(ScrollTrigger);

export default function FolderForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [ctaSubmitted, setCtaSubmitted] = useState(false);
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

              <div className="relative rounded-3xl p-8 md:p-10 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.12] transition-colors">
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

                      <button type="submit" className="w-full mt-2 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#3b82f6] text-[#0a0a0a] text-sm font-bold hover:bg-[#60a5fa] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-300">
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

      {/* ── EnrollCTA — Glass card, edge to edge, rounded top corners ── */}
      <div id="notificacao" className="cta-content relative z-10 mt-24 md:mt-32 -mx-6 md:-mx-12">
        <div className="relative rounded-t-[3.5rem] bg-white/[0.04] backdrop-blur-md border border-white/[0.08] border-b-0 p-8 md:p-16 overflow-hidden">
          <div className="relative z-10 max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h2 className="font-[var(--font-bricolage)] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] text-white mb-5">
                O curso não está com inscrições abertas agora?
              </h2>
              <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-[500px] mx-auto lg:mx-0">
                Deixe seu contato e garanta prioridade na próxima turma antes de qualquer um.
              </p>
            </div>

            <div className="lg:w-1/2 w-full">
              {ctaSubmitted ? (
                <div className="text-center py-12 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#3b82f6]/10 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-[#3b82f6]" />
                  </div>
                  <h3 className="font-[var(--font-bricolage)] text-2xl font-bold text-white">Cadastro realizado!</h3>
                  <p className="text-white/50 text-sm max-w-[280px]">Você será notificado assim que novas turmas forem abertas.</p>
                </div>
              ) : (
                <form onSubmit={handleCtaSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="text-white/60 text-[11px] uppercase font-bold tracking-widest block mb-2">Nome Completo</label>
                    <input type="text" name="nome" required value={ctaForm.nome} onChange={handleCtaChange} placeholder="Seu nome" className="w-full px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-blue-500/40 focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all" />
                  </div>
                  <div>
                    <label className="text-white/60 text-[11px] uppercase font-bold tracking-widest block mb-2">E-mail</label>
                    <input type="email" name="email" required value={ctaForm.email} onChange={handleCtaChange} placeholder="seu@email.com" className="w-full px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-blue-500/40 focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all" />
                  </div>
                  <div>
                    <label className="text-white/60 text-[11px] uppercase font-bold tracking-widest block mb-2">WhatsApp</label>
                    <input type="tel" name="whatsapp" value={ctaForm.whatsapp} onChange={handleCtaChange} placeholder="(00) 00000-0000" className="w-full px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-blue-500/40 focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all" />
                  </div>
                  <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    className="mt-2 w-full inline-flex items-center justify-center gap-2 py-4 text-white text-sm font-medium"
                  >
                    Quero ser avisado
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
