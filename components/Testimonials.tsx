'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, Star, MessageSquare } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: 'Maria Helena S.',
    role: 'Secretária de Administração — Prefeitura de Uberlândia/MG',
    text: 'O curso superou todas as expectativas. A abordagem prática trouxe clareza sobre como acessar recursos federais e montar o portfólio de projetos do nosso município.',
    stars: 5,
  },
  {
    name: 'Carlos Eduardo R.',
    role: 'Assessor Parlamentar — Câmara Municipal de Goiânia/GO',
    text: 'Excelente didática. O módulo sobre emendas parlamentares e transferências especiais (PIX) foi muito esclarecedor. Já estamos aplicando os conhecimentos.',
    stars: 5,
  },
  {
    name: 'Ana Paula M.',
    role: 'Coordenadora de Convênios — Prefeitura de Montes Claros/MG',
    text: 'A consultoria pós-curso fez toda a diferença. Conseguimos resolver dúvidas sobre prestação de contas direto com os instrutores por 30 dias.',
    stars: 5,
  },
  {
    name: 'Roberto F.',
    role: 'Procurador Municipal — Prefeitura de Palmas/TO',
    text: 'A visão geral de fontes de recursos além das emendas foi reveladora. Nunca imaginei tantas opções disponíveis para municípios de médio porte.',
    stars: 5,
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.testimonial-card',
        { y: 40, opacity: 0 },
        {
          scrollTrigger: { trigger: '.testimonials-grid', start: 'top 80%' },
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="depoimentos" className="theme-light py-24 md:py-32 px-6 md:px-12 bg-white">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#15803d]/20 text-[#15803d] bg-[#28a745]/10 w-fit mx-auto mb-5">
            <MessageSquare className="w-4 h-4" />
            <span className="text-xs font-semibold tracking-wide uppercase">Depoimentos</span>
          </div>
          <h2 className="font-[var(--font-bricolage)] text-3xl sm:text-4xl md:text-5xl font-bold text-[#0a0a0a] tracking-tight leading-[1.05]">
            O que dizem nossos <span className="text-[#15803d]">participantes</span>
          </h2>
        </div>

        <div className="testimonials-grid grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card bg-[#f8f9fa] border border-black/[0.05] rounded-3xl p-8 flex flex-col gap-5 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/5">
              <Quote className="w-8 h-8 text-[#28a745] absolute top-6 right-6 opacity-30" />
              <div className="flex gap-1">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-[#15803d] fill-[#28a745]" />
                ))}
              </div>
              <p className="text-black/70 text-sm leading-relaxed italic relative z-10">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-auto pt-4 border-t border-black/[0.06]">
                <p className="text-[#0a0a0a] font-bold text-sm">{t.name}</p>
                <p className="text-black/40 text-xs mt-0.5">{t.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-black/40 text-sm">
            Mais de <span className="text-[#15803d] font-bold">12.000 gestores públicos</span> capacitados nos últimos 7 anos.
          </p>
        </div>
      </div>
    </section>
  );
}
