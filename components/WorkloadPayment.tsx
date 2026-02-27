'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, CreditCard, Building2, Banknote, CheckCircle2, Phone } from 'lucide-react';

import SpotlightCard from './SpotlightCard';

gsap.registerPlugin(ScrollTrigger);

export default function WorkloadPayment() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.wp-card',
                { y: 40, opacity: 0 },
                {
                    scrollTrigger: { trigger: '.wp-grid', start: 'top 80%' },
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.15,
                    ease: 'power3.out',
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="investimento" className="theme-light py-24 md:py-32 px-6 md:px-12 bg-[#F5F5F5]">
            <div className="max-w-[1200px] mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#15803d]/20 text-[#15803d] bg-[#28a745]/10 w-fit mx-auto mb-5">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-semibold tracking-wide uppercase">Carga Horária e Investimento</span>
                    </div>
                    <h2 className="font-[var(--font-bricolage)] text-3xl sm:text-4xl md:text-5xl font-bold text-[#0a0a0a] tracking-tight leading-[1.05]">
                        Informações <span className="text-[#15803d]">do Curso</span>
                    </h2>
                </div>

                <div className="wp-grid grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1100px] mx-auto">
                    {/* Carga Horária */}
                    <SpotlightCard
                        className="wp-card rounded-3xl bg-[#F7F7F7]/80 backdrop-blur-md border border-white/60 shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-8 flex flex-col items-center text-center gap-5 hover:-translate-y-1 transition-all duration-300"
                        spotlightColor="rgba(40, 167, 69, 0.15)"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-[#1a1a2e]/5 flex items-center justify-center shadow-sm">
                            <Clock className="w-7 h-7 text-[#28a745]" />
                        </div>
                        <h3 className="font-[var(--font-bricolage)] text-xl font-bold text-[#1a1a2e]">Carga Horária</h3>
                        <p className="text-[#28a745] text-4xl font-[var(--font-bricolage)] font-extrabold">12h</p>
                        <p className="text-[#1a1a2e]/60 text-sm leading-relaxed">
                            12 horas de aula distribuidas em 4 dias de imersão presencial.
                        </p>
                    </SpotlightCard>

                    {/* Formas de Pagamento */}
                    <SpotlightCard
                        className="wp-card rounded-3xl bg-[#F7F7F7]/80 backdrop-blur-md border border-white/60 shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-8 flex flex-col gap-5 hover:-translate-y-1 transition-all duration-300"
                        spotlightColor="rgba(40, 167, 69, 0.15)"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-[#1a1a2e]/5 flex items-center justify-center mx-auto shadow-sm">
                            <CreditCard className="w-7 h-7 text-[#28a745]" />
                        </div>
                        <h3 className="font-[var(--font-bricolage)] text-xl font-bold text-[#1a1a2e] text-center">Formas de Pagamento</h3>
                        <div className="flex flex-col gap-3 mt-2">
                            {[
                                { icon: <Banknote className="w-4 h-4" />, label: 'Boleto Bancário' },
                                { icon: <Building2 className="w-4 h-4" />, label: 'Depósito, TED ou Ordem Bancária' },
                                { icon: <CreditCard className="w-4 h-4" />, label: 'Cheque ou Dinheiro' },
                            ].map((m, i) => (
                                <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/50 border border-black/5 shadow-sm">
                                    <span className="text-[#28a745]">{m.icon}</span>
                                    <span className="text-[#1a1a2e]/80 text-sm font-medium">{m.label}</span>
                                </div>
                            ))}
                        </div>
                    </SpotlightCard>

                    {/* Incluso */}
                    <SpotlightCard
                        className="wp-card rounded-3xl bg-[#F7F7F7]/80 backdrop-blur-md border border-white/60 shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-8 flex flex-col gap-5 hover:-translate-y-1 transition-all duration-300"
                        spotlightColor="rgba(40, 167, 69, 0.15)"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-[#1a1a2e]/5 flex items-center justify-center mx-auto shadow-sm">
                            <CheckCircle2 className="w-7 h-7 text-[#28a745]" />
                        </div>
                        <h3 className="font-[var(--font-bricolage)] text-xl font-bold text-[#1a1a2e] text-center">Incluso no Curso</h3>
                        <div className="flex flex-col gap-3 mt-2">
                            {[
                                'Material de apoio personalizado',
                                'Certificado de participação',
                                'Consultoria por 30 dias pós-curso',
                                'Lista de hotéis parceiros',
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-[#28a745] shrink-0" />
                                    <span className="text-[#1a1a2e]/80 text-sm font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </SpotlightCard>
                </div>

                {/* Investment CTA */}
                <div className="text-center mt-12 flex flex-col items-center">
                    <p className="text-black/40 text-sm mb-5">Solicite o valor de investimento</p>
                    <a
                        href="tel:3125311776"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#28a745] text-[#0a0a0a] text-sm font-bold uppercase hover:bg-[#d4e680] transition-all duration-300 shadow-lg shadow-[#28a745]/10"
                    >
                        <Phone className="w-4 h-4" />
                        Falar com consultor
                    </a>
                </div>
            </div>
        </section>
    );
}
