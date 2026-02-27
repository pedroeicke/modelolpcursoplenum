'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mic2, Instagram } from 'lucide-react';

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
    <section ref={sectionRef} id="instrutor" className="relative w-full bg-[#030d1f] overflow-hidden flex flex-col lg:flex-row min-h-[80vh] lg:h-[720px]">

      {/* Left Column - Text Info */}
      <div className="w-full lg:w-1/2 px-8 md:px-16 lg:px-24 py-16 lg:py-0 flex flex-col justify-center border-t border-b lg:border-b-0 lg:border-r border-white/5 relative z-10 h-full">

        {/* Badge */}
        <div className="speaker-anim mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#28a745]/30 text-[#28a745] bg-transparent">
            <Mic2 className="w-4 h-4" />
            <span className="text-xs font-semibold tracking-widest uppercase">Palestrante</span>
          </div>
        </div>

        {/* Huge Bio Text */}
        <h2 className="speaker-anim font-[var(--font-bricolage)] text-2xl sm:text-3xl md:text-[2.2rem] lg:text-[2.5rem] font-medium text-white tracking-tight leading-[1.3] mb-12 max-w-[600px]">
          Administrador Público e Consultor, Daniel Angotti atua em Captação de Recursos e Relacionamento Governamental, com vasta experiência em gestão pública e privada.
        </h2>

        {/* Small Speaker Info */}
        <div className="speaker-anim flex items-center gap-6 mb-16">
          <div className="h-full w-0.5 bg-gradient-to-b from-[#28a745] to-transparent self-stretch" />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <p className="font-[var(--font-bricolage)] text-lg font-bold text-white tracking-wide">Daniel Angotti</p>
              <a
                href="https://instagram.com/danielangotti"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#28a745] hover:bg-white/10 transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
            <p className="text-white/40 text-sm font-medium">Palestrante e Consultor Especialista</p>
          </div>
        </div>

      </div>

      {/* Right Column - Edge to Edge Image */}
      <div className="w-full lg:w-1/2 relative min-h-[500px] h-full lg:rounded-l-[40px] overflow-hidden bg-[#030d1f]">
        <img
          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1200"
          alt="Daniel Angotti"
          className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
        />

        {/* Gradient Overlay for bottom text readability */}
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Floating Glass Bio Card */}
        <div className="speaker-anim absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 w-[90%] md:w-[600px] md:h-[150px] z-20">
          <div className="w-full h-full rounded-2xl md:rounded-3xl p-6 md:px-10 flex flex-col justify-center border border-white/20 shadow-2xl backdrop-blur-md bg-white/5 text-left">
            <h3 className="font-[var(--font-bricolage)] text-2xl md:text-3xl font-bold text-white mb-2 md:mb-1">Daniel Angotti</h3>
            <p className="text-white/80 text-xs md:text-sm leading-relaxed line-clamp-3">
              Chefe da Unidade Regional SEGOV-MG em Brasília. Diretor e professor universitário por mais de 10 anos. Embaixador Liberta Minas e Formado no RenovaBR.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}
