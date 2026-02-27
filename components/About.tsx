'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, Shield, Lightbulb, HeadphonesIcon, GraduationCap, Award, Star } from 'lucide-react';
import SpotlightCard from './SpotlightCard';

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Conteúdo',
    description: 'Neste curso, serão abordados os principais temas sobre Relacionamento Governamental e Captação de Recursos: Como Transformar Agendas em Brasília em Recursos, Convênios e Resultados para o Município.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Regularidade',
    description: 'O Instituto Plenum Brasil já capacitou mais de 12 mil gestores públicos nos últimos 7 anos. Somos referência no ensino e possuímos todos documentos necessários para contratação com os órgãos públicos.',
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: 'Metodologia e Didática',
    description: 'Adequamos o conteúdo teórico com a realidade diária dos participantes. Estudo de casos concretos, simulações e material de apoio.',
  },
  {
    icon: <HeadphonesIcon className="w-6 h-6" />,
    title: 'Consultoria',
    description: 'Disponibilizamos para nossos participantes consultoria durante a realização dos nossos treinamentos e após o término do curso a equipe de instrutores do Instituto Plenum Brasil estará à sua disposição por 30 dias para esclarecimentos de dúvidas sobre o tema.',
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: 'Instrutores de Alto Nível',
    description: 'Nosso corpo docente é formado por técnicos que, além de títulos, possuem vivência teórica e prática nos temas que ensinam.',
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: 'Certificação',
    description: 'Nossos alunos, após exigência mínima de 75% de cumprimento da carga horária, recebem o certificado de conclusão do curso.',
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const cards = sectionRef.current.querySelectorAll('.benefit-card');
    gsap.fromTo(
      cards,
      { y: 40, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} id="motivos" className="theme-light py-24 md:py-32 px-6 md:px-12 bg-[#F5F5F5] flex justify-center">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#15803d]/20 text-[#15803d] bg-[#28a745]/10 w-fit mb-5">
              <Star className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-wide uppercase">Por que participar</span>
            </div>
            <h2 className="font-[var(--font-bricolage)] text-3xl sm:text-4xl md:text-5xl font-bold text-[#0a0a0a] tracking-tight leading-[1.05]">
              Por que <span className="text-[#15803d]">participar?</span>
            </h2>
          </div>
          <p className="text-black/60 text-base md:text-lg max-w-[440px] leading-relaxed">
            Conheça os diferenciais que fazem do Instituto Plenum Brasil a referência nacional em capacitação para gestores públicos.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((item, index) => (
            <SpotlightCard
              key={index}
              className="benefit-card rounded-3xl bg-[#F7F7F7]/80 backdrop-blur-md border border-white/60 shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-8 flex flex-col gap-5 hover:-translate-y-1 transition-all duration-300"
              spotlightColor="rgba(40, 167, 69, 0.15)"
            >
              <div className="w-12 h-12 rounded-xl bg-[#1a1a2e]/5 flex items-center justify-center text-[#28a745] shadow-sm">
                {item.icon}
              </div>
              <h3 className="font-[var(--font-bricolage)] text-xl font-bold text-[#1a1a2e] tracking-tight">
                {item.title}
              </h3>
              <p className="text-[#1a1a2e]/60 text-sm leading-relaxed">
                {item.description}
              </p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}

