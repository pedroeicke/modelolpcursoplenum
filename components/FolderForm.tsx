'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Download, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function FolderForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    whatsapp: '',
    email: '',
    estado: '',
    cidade: '',
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

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
    'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
  ];

  const inputClasses = "w-full px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-blue-500/40 focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all";

  return (
    <section ref={sectionRef} id="folder" className="pt-24 md:pt-32 px-6 md:px-12 relative overflow-hidden">
      {/* ── Background image ── */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat pointer-events-none"
        style={{ backgroundImage: "url('/fundodepo.png')", backgroundPosition: 'center top' }}
      />

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
              <span className="text-white/40">Completo do Evento</span>
            </h2>

            <p className="folder-anim text-white/50 text-base md:text-lg leading-relaxed max-w-[480px] mb-8">
              Tenha acesso a programação detalhada, currículo completo dos palestrantes e informações sobre o investimento.
            </p>

            <div className="folder-anim inline-flex items-center gap-4 px-5 py-4 rounded-2xl border border-white/[0.08] bg-[#0b1a30]/50 backdrop-blur-xl w-fit hover:border-white/[0.12] transition-colors">
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

              <div className="relative rounded-3xl p-8 md:p-10 bg-[#0b1a30]/50 backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.12] transition-colors">
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
                        <label className="text-white text-[11px] uppercase font-bold tracking-widest block mb-2">Nome Completo *</label>
                        <input type="text" name="nome" required value={form.nome} onChange={handleChange} placeholder="Seu nome" className={inputClasses} />
                      </div>

                      <div>
                        <label className="text-white text-[11px] uppercase font-bold tracking-widest block mb-2">WhatsApp *</label>
                        <input type="tel" name="whatsapp" required value={form.whatsapp} onChange={handleChange} placeholder="(00) 00000-0000" className={inputClasses} />
                      </div>

                      <div>
                        <label className="text-white text-[11px] uppercase font-bold tracking-widest block mb-2">Email Corporativo *</label>
                        <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="seu@email.com" className={inputClasses} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-white text-[11px] uppercase font-bold tracking-widest block mb-2">Estado *</label>
                          <select name="estado" required value={form.estado} onChange={handleChange} className={`${inputClasses} appearance-none cursor-pointer`}>
                            <option value="" className="bg-[#0a1a33]">UF</option>
                            {estados.map((uf) => (
                              <option key={uf} value={uf} className="bg-[#0a1a33]">{uf}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-white text-[11px] uppercase font-bold tracking-widest block mb-2">Cidade *</label>
                          <input type="text" name="cidade" required value={form.cidade} onChange={handleChange} placeholder="Cidade" className={inputClasses} />
                        </div>
                      </div>

                      <div>
                        <label className="text-white text-[11px] uppercase font-bold tracking-widest block mb-2">Órgão Representante</label>
                        <select name="orgao" required value={form.orgao} onChange={handleChange} className={`${inputClasses} appearance-none cursor-pointer`}>
                          <option value="" className="bg-[#0a1a33]">Selecione o tipo</option>
                          <option value="Prefeitura" className="bg-[#0a1a33]">Prefeitura</option>
                          <option value="Câmara" className="bg-[#0a1a33]">Câmara Municipal</option>
                          <option value="Governo Estadual" className="bg-[#0a1a33]">Governo Estadual</option>
                          <option value="Outro" className="bg-[#0a1a33]">Outro</option>
                        </select>
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

      {/* Spacer bottom */}
      <div className="h-16 md:h-24" />
    </section>
  );
}
