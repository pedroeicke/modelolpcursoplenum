'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface RelevanceProps {
  paragraphs: string[];
  heading?: string;
}

export default function Relevance({
  paragraphs = [],
  heading = 'Por que esta capacitação é relevante?',
}: RelevanceProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const els = sectionRef.current!.querySelectorAll('.relevance-p');
      gsap.fromTo(els, { y: 30, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, duration: 0.7,
        stagger: 0.2, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current!, start: 'top 80%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  if (!paragraphs || paragraphs.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="relevancia"
      className="py-16 md:py-32 px-5 md:px-12 bg-[var(--ds-background)] relative overflow-hidden"
    >
      <div className="max-w-[900px] mx-auto relative z-10">
        <div className="text-center mb-8 md:mb-14">
          <span className="inline-block text-[11px] md:text-sm uppercase font-semibold tracking-[0.2em] text-white/35 mb-3 md:mb-5">
            Relevância
          </span>
          <h2 className="font-[var(--font-bricolage)] text-2xl sm:text-4xl md:text-[52px] font-bold tracking-tight leading-[1.1] bg-gradient-to-b from-white via-white/90 to-white/60 bg-clip-text text-transparent">
            {heading}
          </h2>
        </div>

        <div className="flex flex-col gap-5 md:gap-8">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="relevance-p text-white/55 text-sm md:text-lg leading-relaxed"
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
