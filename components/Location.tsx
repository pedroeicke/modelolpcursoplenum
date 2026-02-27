'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Building, PhoneCall } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Location() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.loc-anim',
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
        <section ref={sectionRef} id="local" className="py-24 md:py-32 px-6 md:px-12 bg-[#030d1f] border-t border-white/[0.03]">
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

                {/* Left Column - Info */}
                <div className="flex flex-col">
                    <div className="loc-anim inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#28a745]/30 text-[#28a745] bg-transparent w-fit mb-4">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs font-semibold tracking-wide">Localização Privilegiada</span>
                    </div>

                    <h2 className="loc-anim font-[var(--font-bricolage)] text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1] mb-6">
                        ONDE VAI <span className="text-[#28a745]">SER</span>
                    </h2>

                    <p className="loc-anim text-white/60 text-base md:text-lg leading-relaxed max-w-[480px] mb-12">
                        Um espaço de excelência preparado para receber os maiores especialistas do país com conforto e acessibilidade no coração da capital federal.
                    </p>

                    <div className="flex flex-col gap-10 border-b border-white/[0.08] pb-12 mb-10">
                        {/* Info Block 1 */}
                        <div className="loc-anim flex items-start gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10 flex items-center justify-center shrink-0 shadow-lg shadow-black/20">
                                <MapPin className="w-6 h-6 text-[#28a745]" />
                            </div>
                            <div className="pt-1">
                                <h3 className="font-[var(--font-bricolage)] text-xl font-bold text-white tracking-tight mb-2 uppercase">
                                    Edifício Morro Vermelho
                                </h3>
                                <p className="text-white/50 text-sm leading-relaxed">
                                    SCS Quadra 01, Bloco H, 8° Andar<br />
                                    Asa Sul, Brasília/DF • CEP 70.399-900
                                </p>
                            </div>
                        </div>

                        {/* Info Block 2 */}
                        <div className="loc-anim flex items-start gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10 flex items-center justify-center shrink-0 shadow-lg shadow-black/20">
                                <Building className="w-6 h-6 text-[#28a745]" />
                            </div>
                            <div className="pt-1">
                                <h3 className="font-[var(--font-bricolage)] text-xl font-bold text-white tracking-tight mb-2 uppercase">
                                    Hospedagem Parceira
                                </h3>
                                <p className="text-white/50 text-sm leading-relaxed max-w-[360px]">
                                    Solicite a lista de hotéis parceiros com tarifas especiais para participantes de cursos do Instituto Plenum Brasil.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Footer */}
                    <div className="loc-anim flex flex-col sm:flex-row gap-8 sm:gap-16">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.02]">
                                <PhoneCall className="w-4 h-4 text-[#28a745]" />
                            </div>
                            <div>
                                <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-0.5">Informações</p>
                                <p className="font-[var(--font-bricolage)] text-white font-semibold">(31) 2531-1776</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.02]">
                                <PhoneCall className="w-4 h-4 text-[#28a745]" />
                            </div>
                            <div>
                                <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-0.5">Atendimento</p>
                                <p className="font-[var(--font-bricolage)] text-white font-semibold">(31) 99898-1776</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Map */}
                <div className="loc-anim relative w-full h-[500px] lg:h-[650px] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl shadow-black/80">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3838.8!2d-47.8825!3d-15.7839!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDQ3JzAyLjAiUyA0N8KwNTInNTcuMCJX!5e0!3m2!1spt-BR!2sbr!4v1600000000000"
                        className="absolute inset-0 w-full h-full border-0 transition-all duration-[1500ms]"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Local do evento"
                    />

                    {/* Floating Pill */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-panel-dark px-8 py-4 rounded-full border border-white/20 whitespace-nowrap shadow-xl">
                        <span className="font-[var(--font-bricolage)] text-white font-bold tracking-wide">
                            SEDE BRASÍLIA/DF
                        </span>
                    </div>
                </div>

            </div>
        </section>
    );
}
