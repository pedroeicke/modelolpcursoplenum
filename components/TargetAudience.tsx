'use client';

import Image from 'next/image';
import { Landmark, FileSpreadsheet, Shield, User } from 'lucide-react';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import {
  BentoGrid,
  InverseContainerScroll,
  InverseBentoCell,
  InverseContainerScale,
} from '@/components/blocks/hero-gallery-scroll-animation';

const audiences = [
  {
    Icon: Landmark,
    title: 'Prefeitos e Gestores',
    description:
      'Líderes municipais responsáveis pela captação, direcionamento e execução final dos recursos orçamentários.',
  },
  {
    Icon: FileSpreadsheet,
    title: 'Secretários de Finanças',
    description:
      'Profissionais encarregados do planejamento financeiro e alocação estratégica de emendas na gestão local.',
  },
  {
    Icon: Shield,
    title: 'Controladores e Auditores',
    description:
      'Focados em garantir a conformidade técnica, transparência e prestação de contas alinhada aos órgãos de controle.',
  },
  {
    Icon: User,
    title: 'Assessores Parlamentares',
    description:
      'Especialistas que articulam a destinação das emendas e precisam dominar as novas regras do STF para orientação segura.',
  },
];

/* ── 5 images — default bento layout ──────────────────────────────────
   Slot 1: large left  (col-span-6, row-span-3) → move left + up
   Slot 2: top-right   (col-span-2, row-span-2) → move right + up
   Slot 3: btm-right   (col-span-2, row-span-2) → move right + down
   Slot 4: btm-left    (col-span-3, row 4)      → move left + down
   Slot 5: btm-center  (col-span-3, row 4)      → move down
──────────────────────────────────────────────────────────────────── */
const cells = [
  { src: '/imgses/photo-1498036882173-b41c28a8ba34.avif', xDir: -1, yDir: -1, sizes: '75vw' },
  { src: '/imgses/photo-1503899036084-c55cdd92da26.avif', xDir:  1, yDir: -1, sizes: '25vw' },
  { src: '/imgses/photo-1536098561742-ca998e48cbcc.avif', xDir:  1, yDir:  1, sizes: '25vw' },
  { src: '/imgses/photo-1540959733332-eab4deabeeaf.avif', xDir: -1, yDir:  1, sizes: '37vw' },
  { src: '/imgses/photo-1551641506-ee5bf4cb45f1.avif',   xDir:  0, yDir:  1, sizes: '37vw' },
];

export default function TargetAudience() {
  return (
    <InverseContainerScroll id="publico">

      {/* ── Gallery — asymmetric bento grid, cells spread out on scroll ── */}
      <BentoGrid
        variant="default"
        className="absolute inset-0 h-full gap-4 p-4 [&>div]:rounded-2xl"
      >
        {cells.map(({ src, xDir, yDir, sizes }) => (
          <InverseBentoCell key={src} xDir={xDir} yDir={yDir}>
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes={sizes}
              priority
            />
          </InverseBentoCell>
        ))}
      </BentoGrid>

      {/* ── Center content — fades in as gallery opens ── */}
      <InverseContainerScale>
        <div className="pointer-events-auto w-full max-w-[1300px]">
          <div className="text-center mb-12">
            <span className="inline-block text-sm uppercase font-semibold tracking-[0.2em] text-white/35 mb-5">
              Público-Alvo
            </span>
            <h2 className="font-[var(--font-bricolage)] text-5xl sm:text-6xl md:text-[72px] font-bold tracking-tight leading-[1.06] bg-gradient-to-b from-white via-white/90 to-white/55 bg-clip-text text-transparent">
              Para quem é<br />esta imersão?
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {audiences.map(({ Icon, title, description }) => (
              <div
                key={title}
                className="relative bg-[#030d1f]/85 backdrop-blur-md border border-white/[0.09] rounded-2xl p-7 md:p-9 flex flex-col gap-5"
              >
                <GlowingEffect disabled={false} spread={40} proximity={60} borderWidth={1.5} />
                <div className="w-13 h-13 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white/55">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-white/85 text-base font-semibold leading-snug">{title}</p>
                  <p className="text-white/35 text-sm leading-relaxed mt-2">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </InverseContainerScale>

    </InverseContainerScroll>
  );
}
