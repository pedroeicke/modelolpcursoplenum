'use client';

import { useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';
import type { GeneralInfoItem } from '@/types/course';

export interface GeneralInfoProps {
  items: GeneralInfoItem[];
  heading?: string;
}

export default function GeneralInfo({
  items = [],
  heading = 'Informações Gerais',
}: GeneralInfoProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!items || items.length === 0) return null;

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="informacoes-gerais" className="py-16 md:py-32 px-4 md:px-12 bg-[var(--ds-background)]">
      <div className="max-w-[900px] mx-auto">
        <div className="text-center mb-8 md:mb-14">
          <h2 className="font-[var(--font-bricolage)] text-2xl sm:text-4xl md:text-[52px] font-bold tracking-tight leading-[1.1] bg-gradient-to-b from-white via-white/90 to-white/60 bg-clip-text text-transparent">
            {heading}
          </h2>
        </div>

        <div className="flex flex-col gap-2.5 md:gap-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl md:rounded-2xl border border-white/[0.08] overflow-hidden"
              style={{ backgroundColor: 'color-mix(in srgb, var(--ds-surface) 50%, transparent)' }}
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between px-4 py-4 md:px-6 md:py-5 text-left"
              >
                <div className="flex items-center gap-3 md:gap-4 min-w-0">
                  <div
                    className="w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl border flex items-center justify-center shrink-0 text-[var(--ds-primary)]"
                    style={{ backgroundColor: 'var(--ds-primary-10)', borderColor: 'var(--ds-primary-20)' }}
                  >
                    <Info className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <p className="text-white font-bold text-xs md:text-sm uppercase tracking-wider leading-tight">
                    {item.title}
                  </p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 md:w-5 md:h-5 text-white/40 shrink-0 ml-2 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`}
                />
              </button>
              {openIndex === i && (
                <div className="px-4 pb-4 md:px-6 md:pb-6">
                  <div
                    className="rounded-lg md:rounded-xl border p-3 md:p-4"
                    style={{ borderColor: 'var(--ds-primary-10)', backgroundColor: 'var(--ds-primary-5)' }}
                  >
                    <p className="text-white/60 text-xs md:text-sm leading-relaxed whitespace-pre-line">
                      {item.content}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
