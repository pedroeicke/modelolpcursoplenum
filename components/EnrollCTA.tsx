'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/neon-button';

gsap.registerPlugin(ScrollTrigger);

export default function EnrollCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    email: '',
    whatsapp: '',
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section ref={sectionRef} id="notificacao" className="pt-24 md:pt-32 bg-[#030d1f] relative overflow-hidden">

      {/* Glass card — edge to edge, rounded top corners only */}
      <div className="cta-content relative">

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
              {submitted ? (
                <div className="text-center py-12 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#28a745]/10 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-[#28a745]" />
                  </div>
                  <h3 className="font-[var(--font-bricolage)] text-2xl font-bold text-white">Cadastro realizado!</h3>
                  <p className="text-white/50 text-sm max-w-[280px]">Você será notificado assim que novas turmas forem abertas.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="text-white/60 text-[11px] uppercase font-bold tracking-widest block mb-2">Nome Completo</label>
                    <input type="text" name="nome" required value={form.nome} onChange={handleChange} placeholder="Seu nome" className="w-full px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-blue-500/40 focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all" />
                  </div>
                  <div>
                    <label className="text-white/60 text-[11px] uppercase font-bold tracking-widest block mb-2">E-mail</label>
                    <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="seu@email.com" className="w-full px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-blue-500/40 focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all" />
                  </div>
                  <div>
                    <label className="text-white/60 text-[11px] uppercase font-bold tracking-widest block mb-2">WhatsApp</label>
                    <input type="tel" name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="(00) 00000-0000" className="w-full px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-blue-500/40 focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all" />
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
