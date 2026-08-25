'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, ChevronUp } from 'lucide-react';
import ColorBends from '@/components/ColorBends';
import type { ShaderColors } from '@/types/design-system';
import { useTurma } from '@/hooks/use-turma';
import { corrigeDiaDaSemana } from '@/lib/dia-da-semana';

// ─── Props ─────────────────────────────────────────────
export interface ProgramProps {
  heading?: string;
  description?: string;
  shaderColors?: ShaderColors['colorbends'];
}

// ─── Component ────────────────────────────────────────
export default function Program({
  heading = 'Programação',
  description = '',
  shaderColors = ['#007bff', '#4097bf'] as [string, string],
}: ProgramProps) {
  const { programDays, courseDateId, activeCourseDate } = useTurma();

  const [openSet, setOpenSet] = useState<Set<number>>(
    new Set(programDays.map((_, i) => i))
  );

  // Reset accordion state when turma changes (programDays comes from a different course_date)
  useEffect(() => {
    setOpenSet(new Set(programDays.map((_, i) => i)));
  }, [courseDateId]);

  // If no program days, don't render
  if (programDays.length === 0) return null;

  return (
    <section id="programacao" className="pt-[66px] pb-10 md:pb-14 px-6 md:px-12 bg-[var(--ds-background)] relative overflow-hidden">
      <div className="absolute inset-0 z-0 blur-2xl opacity-40">
        <ColorBends
          rotation={0}
          speed={0.39}
          colors={shaderColors}
          transparent
          autoRotate={0}
          scale={1.2}
          frequency={1}
          warpStrength={1}
          mouseInfluence={0.7}
          parallax={0.5}
          noise={0.1}
        />
      </div>
      <div className="max-w-[1100px] mx-auto relative z-10">
        {/* ── Header ── */}
        <div className="mb-12">
          <h2 className="font-[var(--font-bricolage)] text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-3 pb-1 bg-gradient-to-b from-white via-white/90 to-white/55 bg-clip-text text-transparent">
            {heading}
          </h2>
          {description && (
            <p className="text-white/40 text-base md:text-lg">
              {description}
            </p>
          )}
        </div>

        {/* ── List ── */}
        <div className="flex flex-col gap-4">
          {programDays.map((day, i) => {
            const isOpen = openSet.has(i);

            return (
              <div
                key={`${day.tag}-${i}`}
                className="rounded-2xl transition-all duration-300 backdrop-blur-md border"
                style={{
                  background: `linear-gradient(to bottom right, var(--ds-primary-8), var(--ds-primary-4))`,
                  borderColor: 'var(--ds-primary-20)',
                  boxShadow: '0 0 30px var(--ds-primary-6)',
                }}
              >
                {/* ── Header row ── */}
                <button
                  onClick={() => {
                    setOpenSet(prev => {
                      const next = new Set(prev);
                      next.has(i) ? next.delete(i) : next.add(i);
                      return next;
                    });
                  }}
                  className="w-full text-left flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 py-4 sm:px-6 sm:py-5 cursor-pointer"
                >
                  <div className="flex items-center justify-between sm:contents">
                    {/* Day pill */}
                    <span className="shrink-0 text-[11px] sm:text-[12px] font-semibold border border-white/[0.15] rounded-full px-2.5 py-1 sm:px-3 text-white/60 tracking-wide">
                      {/* o dia da semana vem calculado da data, não do que foi digitado */}
                      {corrigeDiaDaSemana(day.tag, activeCourseDate?.start_date)}
                    </span>

                    {/* Time — visible on mobile next to pill, hidden on sm+ */}
                    {day.time && (
                      <span className="flex sm:hidden items-center gap-1 text-white/35 text-[11px] shrink-0">
                        <Clock className="w-3 h-3" />
                        {day.time}
                      </span>
                    )}

                    {/* Chevron — visible on mobile next to pill */}
                    <ChevronUp
                      className={`w-4 h-4 sm:hidden text-white/35 shrink-0 transition-transform duration-300 ${
                        isOpen ? '' : 'rotate-180'
                      }`}
                    />
                  </div>

                  {/* Title */}
                  <span className="flex-1 text-white/90 text-base sm:text-lg md:text-xl font-semibold leading-snug">
                    {day.title}
                  </span>

                  {/* Time — desktop only */}
                  <span className="hidden sm:flex items-center gap-1.5 text-white/35 text-[12px] shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    {day.time}
                  </span>

                  {/* Chevron — desktop only */}
                  <ChevronUp
                    className={`w-5 h-5 text-white/35 shrink-0 transition-transform duration-300 hidden sm:block ${
                      isOpen ? '' : 'rotate-180'
                    }`}
                  />
                </button>

                {/* ── Expanded content ── */}
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-6 sm:pb-6 border-t border-white/[0.07] pt-4 sm:pt-5">
                    <div className="flex flex-col gap-2.5 sm:gap-3">
                      {day.topics.map((topic, j) => (
                        <div key={j}>
                          <div className="flex items-start gap-2.5 sm:gap-3">
                            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--ds-primary-light)] shrink-0 mt-0.5" />
                            <span className="text-white/75 text-base sm:text-lg leading-relaxed">{topic.text}</span>
                          </div>
                          {topic.children && topic.children.length > 0 && (
                            <div className="ml-7 mt-2 flex flex-col gap-1.5 pl-3 border-l border-white/[0.07]">
                              {topic.children.map((child, k) => (
                                <div key={k} className="flex items-start gap-2">
                                  <span className="text-[var(--ds-primary-light)] text-[10px] mt-1.5">●</span>
                                  <span className="text-white/50 text-[15px] leading-relaxed">{child}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
