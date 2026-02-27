'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AlertCircle, Building } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function CancellationPolicy() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.policy-content', {
                scrollTrigger: { trigger: '.policy-content', start: 'top 85%' },
                y: 30,
                opacity: 0,
                duration: 0.6,
                ease: 'power3.out',
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="theme-light py-20 md:py-24 px-6 md:px-12 bg-white border-t border-black/[0.05]">
            <div className="policy-content max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Política de Cancelamento */}
                <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#1a1a2e]/5 flex items-center justify-center shadow-sm text-[#28a745]">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <h3 className="font-[var(--font-bricolage)] text-xl font-bold text-[#0a0a0a]">Política de Cancelamento</h3>
                    </div>
                    <div className="flex flex-col gap-3 text-black/60 text-sm leading-relaxed">
                        <p>
                            O não comparecimento ao curso no qual você tem inscrição confirmada irá gerar a cobrança de <span className="text-black/90 font-bold">50% do valor</span> para custeio do material utilizado, exceto se houver o cancelamento até <span className="text-black/90 font-bold">72 horas antes</span> da data de início programada.
                        </p>
                        <p>
                            O Instituto Plenum Brasil reserva-se o direito de cancelar qualquer evento em caso fortuito, por força maior, ou por falta de quórum.
                        </p>
                        <p className="bg-[#28a745]/10 p-4 rounded-xl border border-[#28a745]/30">
                            <span className="text-black/90 font-bold block mb-1">Atenção:</span>
                            Confirme, previamente, a realização do curso antes de efetuar a compra de passagens aéreas e o pagamento da hospedagem.
                        </p>
                    </div>
                </div>

                {/* Dados da Empresa */}
                <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#1a1a2e]/5 flex items-center justify-center shadow-sm text-[#28a745]">
                            <Building className="w-5 h-5" />
                        </div>
                        <h3 className="font-[var(--font-bricolage)] text-xl font-bold text-[#0a0a0a]">Dados da Empresa</h3>
                    </div>
                    <div className="flex flex-col gap-3 text-black/60 text-sm leading-relaxed">
                        <div>
                            <p className="text-black/90 font-bold">Instituto Plenum Brasil</p>
                            <p>Capacitação e Aperfeiçoamento de Pessoal</p>
                        </div>
                        <div>
                            <p><span className="text-black/80 font-semibold">Endereço:</span> Rua Espírito Santo, n° 1204, 2° andar - sala 1 - Bairro Lourdes - BH/MG - CEP: 30.160-033</p>
                            <p><span className="text-black/80 font-semibold">Tels:</span> (31) 2531-1776, (31) 2531-1750</p>
                        </div>
                        <div>
                            <p><span className="text-black/80 font-semibold">E-mails:</span></p>
                            <p>plenumgestaooficial@gmail.com</p>
                            <p>financeiro@plenumbrasil.com</p>
                        </div>
                        <div className="pt-2">
                            <p className="italic">Solicite os documentos e demais informações para contratação.</p>
                            <p className="text-[#15803d] font-bold mt-1">www.plenumbrasil.com.br</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
