'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { AboutCard } from '@/types/course';
import { getIcon } from '@/lib/icon-map';

gsap.registerPlugin(ScrollTrigger);

// ─── Props ─────────────────────────────────────────────
export interface AboutProps {
  cards: AboutCard[];
  heading?: string;
  subheading?: string;
  iconUrl?: string;
}

// ─── Defaults ──────────────────────────────────────────
// Sem texto próprio cadastrado a seção não aparece. Default com conteúdo de
// outro curso (ou lorem ipsum) vazaria para landing pages que não são dele.
const defaultCards: AboutCard[] = [];

// ─── Component ────────────────────────────────────────
export default function About({
  cards = defaultCards,
  heading = '',
  subheading = '',
  iconUrl = '/icon.svg',
}: AboutProps) {
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

  const headingLines = heading.split('\n');

  if (!heading && cards.length === 0) return null;

  return (
    <section ref={sectionRef} id="diferenciais" className="py-24 md:py-32 px-6 md:px-12 bg-[var(--ds-background)] relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto relative z-10">

        {/* Header */}
        <div className="mb-14 text-center flex flex-col items-center">
          {/* Icon with glow — colors from design system */}
          <div className="relative mb-6">
            <div
              className="absolute inset-0 blur-2xl rounded-full scale-150"
              style={{ backgroundColor: 'var(--ds-primary-20)' }}
            />
            <div
              className="relative w-20 h-20"
              style={{
                backgroundColor: 'var(--ds-primary)',
                WebkitMaskImage: `url(${iconUrl})`,
                WebkitMaskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskImage: `url(${iconUrl})`,
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
                filter: 'drop-shadow(0 0 12px var(--ds-primary-50))',
              }}
            />
          </div>
          <h2 className="font-[var(--font-bricolage)] text-3xl sm:text-4xl md:text-[52px] font-bold tracking-tight leading-[1.08] mb-4 bg-gradient-to-b from-white via-white/90 to-white/60 bg-clip-text text-transparent">
            {headingLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < headingLines.length - 1 && <br />}
              </span>
            ))}
          </h2>
          <p className="text-white/40 text-base md:text-lg max-w-[600px] leading-relaxed mx-auto">
            {subheading}
          </p>
        </div>

        {/* 3 equal cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map((card, i) => {
            const IconComponent = getIcon(card.icon);
            return (
              <div
                key={i}
                className="benefit-card group relative rounded-[20px] border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-8 md:p-10 flex flex-col transition-all duration-400"
                style={{ ['--hover-border' as string]: 'var(--ds-primary-30)', ['--hover-bg' as string]: 'var(--ds-primary-4)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ds-primary-30)'; e.currentTarget.style.backgroundColor = 'var(--ds-primary-4)'; e.currentTarget.style.boxShadow = '0 0 30px var(--ds-primary-8), inset 0 1px 0 var(--ds-primary-10)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-[var(--ds-primary)] flex items-center justify-center mb-6 transition-all duration-400">
                  {IconComponent && <IconComponent className="w-6 h-6 text-white" />}
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
