'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, Eye, FileCheck, Scale, BookOpen, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    icon: ShieldCheck,
    title: 'Segurança Jurídica',
    description:
      'Entenda detalhadamente os novos entendimentos do STF e garanta que cada etapa do processo cumpra integralmente as diretrizes do Tribunal de Contas da União.',
  },
  {
    icon: Eye,
    title: 'Transparência Total',
    description:
      'Aprenda a estruturar fluxos de informação, portais e relatórios que blindam a gestão pública contra acusações de opacidade e irregularidades.',
  },
  {
    icon: FileCheck,
    title: 'Prestação de Contas',
    description:
      'Técnicas práticas para organização documental e aprovação célere de contas, garantindo a viabilidade de repasses futuros para o seu município.',
  },
  {
    icon: Scale,
    title: 'Conformidade Legal',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim.',
  },
  {
    icon: BookOpen,
    title: 'Capacitação Prática',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.',
  },
  {
    icon: Users,
    title: 'Gestão Colaborativa',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const els = sectionRef.current!.querySelectorAll('.benefit-card');
      gsap.fromTo(els, { y: 40, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, duration: 0.7,
        stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current!, start: 'top 80%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="diferenciais" className="py-24 md:py-32 px-6 md:px-12 bg-[#030d1f] relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto relative z-10">

        {/* Header */}
        <div className="mb-14 text-center flex flex-col items-center">
          {/* Icon with glow */}
          <div className="relative mb-6">
            <div className="absolute inset-0 blur-2xl bg-[#3b82f6]/20 rounded-full scale-150" />
            <img src="/icon.svg" alt="" className="relative w-20 h-20 drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]" style={{ filter: 'brightness(0) saturate(100%) invert(45%) sepia(85%) saturate(1500%) hue-rotate(200deg) brightness(100%) contrast(95%)' }} />
          </div>
          <h2 className="font-[var(--font-bricolage)] text-3xl sm:text-4xl md:text-[52px] font-bold tracking-tight leading-[1.08] mb-4 bg-gradient-to-b from-white via-white/90 to-white/60 bg-clip-text text-transparent">
            Domine as Novas Regras de<br />
            Execução Orçamentária
          </h2>
          <p className="text-white/40 text-base md:text-lg max-w-[600px] leading-relaxed mx-auto">
            Compreenda as recentes decisões do STF e as normativas do TCU sobre emendas parlamentares.
          </p>
        </div>

        {/* 3 equal cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map((card, i) => (
            <div
              key={i}
              className="benefit-card group relative rounded-[20px] border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-8 md:p-10 flex flex-col hover:border-[#3b82f6]/30 hover:bg-[#3b82f6]/[0.04] hover:shadow-[0_0_30px_rgba(59,130,246,0.08),inset_0_1px_0_rgba(59,130,246,0.1)] transition-all duration-400"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-[#3b82f6] flex items-center justify-center mb-6 transition-all duration-400">
                <card.icon className="w-6 h-6 text-white" />
              </div>

              {/* Title */}
              <h3 className="font-[var(--font-bricolage)] text-lg md:text-xl font-bold tracking-tight leading-tight mb-4 text-white uppercase">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-white/50">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
