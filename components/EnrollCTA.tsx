'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, CalendarDays, MapPin, Clock, AlertCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function EnrollCTA() {
    const sectionRef = useRef<HTMLElement>(null);

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

    return (
        <section ref={sectionRef} id="inscricao" className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden">
            {/* BG */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#041025] via-[#030d1f] to-[#041228] z-0" />
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(231,249,154,0.08)_0%,transparent_70%)] z-0" />
            <div className="absolute bottom-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(231,249,154,0.04)_0%,transparent_70%)] z-0" />

            <div className="cta-content max-w-[800px] mx-auto relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#28a745]/30 text-[#28a745] bg-transparent w-fit mx-auto mb-6">
                    <AlertCircle className="w-4 h-4 animate-pulse" />
                    <span className="text-xs font-semibold tracking-wide">Vagas Limitadas</span>
                </div>

                <h2 className="font-[var(--font-bricolage)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1] mb-6">
                    Inscreva-se <span className="text-[#28a745]">agora!</span>
                </h2>

                <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-[500px] mx-auto mb-10">
                    Garanta sua vaga no curso de Relacionamento Governamental e Captação de Recursos. Presencial em Brasília/DF.
                </p>

                {/* Info tags */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/10">
                        <CalendarDays className="w-4 h-4 text-[#28a745]" />
                        <span className="text-white/70 text-sm font-medium">10 a 13 de Março, 2026</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/10">
                        <MapPin className="w-4 h-4 text-[#28a745]" />
                        <span className="text-white/70 text-sm font-medium">Brasília/DF</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/10">
                        <Clock className="w-4 h-4 text-[#28a745]" />
                        <span className="text-white/70 text-sm font-medium">12h de Aula</span>
                    </div>
                </div>

                <a
                    href="https://materiais.plenumbrasil.com.br/presencial-df-relacionamento-governamental-e-captacao-de-recursos-marco-2026"
                    target="_blank"
                    rel="noopener"
                    className="btn-primary !text-lg !py-5 !px-12 mx-auto"
                >
                    Fazer Inscrição <ArrowRight className="w-5 h-5" />
                </a>
            </div>
        </section>
    );
}
