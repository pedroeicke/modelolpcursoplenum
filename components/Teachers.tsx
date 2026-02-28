'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram } from 'lucide-react';
gsap.registerPlugin(ScrollTrigger);

export default function Teachers() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.speaker-anim',
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

  return (
    <section
      ref={sectionRef}
      id="instrutor"
      className="relative w-full bg-[#030d1f] overflow-hidden pt-10 pb-16 md:pt-14 md:pb-20 px-6 md:px-12"
    >
      {/* Gradient top — suaviza transição da Programação */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#030d1f] via-[#0a1a3a]/30 to-transparent pointer-events-none z-0" />
      {/* Subtle blue glow center */}
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#1e3a6e]/10 to-transparent pointer-events-none z-0" />

      <div className="max-w-[1000px] mx-auto relative z-10">
        {/* Heading — top center */}
        <div className="speaker-anim mb-14 text-center">
          <h2 className="font-[var(--font-bricolage)] text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] bg-gradient-to-b from-white via-white/90 to-white/55 bg-clip-text text-transparent">
            Quem será<br />o instrutor?
          </h2>
        </div>

        {/* Card — with photo extending out on the right */}
        <div className="speaker-anim relative">
          {/* Glass card */}
          <div className="relative rounded-3xl border border-white/[0.1] bg-white/[0.04] backdrop-blur-md overflow-visible">
            {/* Background glow */}
            <div className="absolute -inset-2 rounded-3xl bg-[#3b82f6]/[0.04] blur-2xl -z-10" />

            {/* Text content — left side, with right padding for image space on desktop */}
            <div className="p-8 md:p-12 md:pr-[300px] text-center md:text-left">
              <h3 className="font-[var(--font-bricolage)] text-2xl md:text-3xl font-bold text-white mb-2">
                Daniel Angotti
              </h3>
              <p className="text-[#3b82f6] text-xs font-semibold uppercase tracking-widest mb-5">
                Palestrante e Consultor Especialista
              </p>
              <p className="text-white/45 text-sm leading-relaxed mb-8 max-w-[480px] md:mx-0 mx-auto">
                Administrador Público e Consultor em Captação de Recursos e
                Relacionamento Governamental. Chefe da Unidade Regional
                SEGOV-MG em Brasília. Diretor e professor universitário por
                mais de 10 anos. Embaixador Liberta Minas e Formado no
                RenovaBR.
              </p>

              {/* Instagram */}
              <div className="flex md:justify-start justify-center">
                <a
                  href="https://instagram.com/danielangotti"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-white/50 hover:text-[#3b82f6] hover:border-[#3b82f6]/30 transition-colors text-sm font-medium"
                >
                  <Instagram className="w-4 h-4" />
                  @danielangotti
                </a>
              </div>
            </div>

            {/* Photo — glued to right edge, bottom aligned, head extends above card */}
            <div className="hidden md:block absolute bottom-0 right-0 z-10">
              <div
                className="w-[280px] h-[430px] overflow-hidden"
                style={{ borderRadius: '140px 140px 0 0' }}
              >
                <img
                  src="/palestrantetste.png"
                  alt="Daniel Angotti"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              {/* Glow behind image */}
              <div className="absolute inset-0 -z-10 blur-3xl bg-[#3b82f6]/10 scale-75" />
            </div>

            {/* Photo — mobile (centered above card) */}
            <div className="md:hidden flex justify-center -mt-[100px] mb-0 absolute -top-[100px] left-1/2 -translate-x-1/2 z-10">
              <div
                className="w-[200px] h-[280px] overflow-hidden shadow-2xl"
                style={{ borderRadius: '100px 100px 12px 12px' }}
              >
                <img
                  src="/palestrantetste.png"
                  alt="Daniel Angotti"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>

          {/* Mobile: add top margin to make room for the photo extending above */}
          <div className="md:hidden h-0 -mt-0" />
        </div>
      </div>
    </section>
  );
}
