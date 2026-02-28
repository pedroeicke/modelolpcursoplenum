'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GlowingEffect } from '@/components/ui/glowing-effect';

gsap.registerPlugin(ScrollTrigger);

/* ── Neon glow wave — card 1 (flowing ribbon) ── */
function GlowWave1() {
  return (
    <svg viewBox="0 0 480 520" fill="none" preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full pointer-events-none">
      <defs>
        <filter id="glow1-soft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="18" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow1-mid" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow1-sharp" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* === WAVE 1 — main wide ribbon === */}
      {/* Outermost soft halo */}
      <path d="M-60,340 C40,290 120,360 200,300 C280,240 340,310 480,270"
        stroke="rgba(20,100,255,0.18)" strokeWidth="130" strokeLinecap="round" fill="none"
        filter="url(#glow1-soft)" />
      {/* Mid glow */}
      <path d="M-60,340 C40,290 120,360 200,300 C280,240 340,310 480,270"
        stroke="rgba(40,140,255,0.35)" strokeWidth="60" strokeLinecap="round" fill="none"
        filter="url(#glow1-mid)" />
      {/* Inner bright */}
      <path d="M-60,340 C40,290 120,360 200,300 C280,240 340,310 480,270"
        stroke="rgba(80,180,255,0.55)" strokeWidth="22" strokeLinecap="round" fill="none"
        filter="url(#glow1-sharp)" />
      {/* Highlight center */}
      <path d="M-60,340 C40,290 120,360 200,300 C280,240 340,310 480,270"
        stroke="rgba(200,235,255,0.85)" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* === WAVE 2 — second ribbon above === */}
      <path d="M-60,390 C60,330 140,410 230,350 C310,295 370,355 480,320"
        stroke="rgba(15,80,220,0.14)" strokeWidth="100" strokeLinecap="round" fill="none"
        filter="url(#glow1-soft)" />
      <path d="M-60,390 C60,330 140,410 230,350 C310,295 370,355 480,320"
        stroke="rgba(35,120,255,0.28)" strokeWidth="45" strokeLinecap="round" fill="none"
        filter="url(#glow1-mid)" />
      <path d="M-60,390 C60,330 140,410 230,350 C310,295 370,355 480,320"
        stroke="rgba(70,165,255,0.45)" strokeWidth="16" strokeLinecap="round" fill="none"
        filter="url(#glow1-sharp)" />
      <path d="M-60,390 C60,330 140,410 230,350 C310,295 370,355 480,320"
        stroke="rgba(190,225,255,0.7)" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* === WAVE 3 — thin accent === */}
      <path d="M-60,445 C80,380 160,455 260,400 C340,350 400,400 480,375"
        stroke="rgba(10,60,200,0.12)" strokeWidth="70" strokeLinecap="round" fill="none"
        filter="url(#glow1-soft)" />
      <path d="M-60,445 C80,380 160,455 260,400 C340,350 400,400 480,375"
        stroke="rgba(30,110,245,0.22)" strokeWidth="30" strokeLinecap="round" fill="none"
        filter="url(#glow1-mid)" />
      <path d="M-60,445 C80,380 160,455 260,400 C340,350 400,400 480,375"
        stroke="rgba(150,200,255,0.5)" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Bottom floor glow */}
      <ellipse cx="240" cy="510" rx="280" ry="30"
        fill="rgba(20,100,255,0.08)" filter="url(#glow1-soft)" />
    </svg>
  );
}

/* ── Neon glow wave — card 2 (different path, more diagonal) ── */
function GlowWave2() {
  return (
    <svg viewBox="0 0 480 520" fill="none" preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full pointer-events-none">
      <defs>
        <filter id="glow2-soft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="18" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow2-mid" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow2-sharp" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* WAVE 1 */}
      <path d="M480,310 C360,270 260,350 160,290 C80,240 20,300 -60,275"
        stroke="rgba(20,100,255,0.18)" strokeWidth="130" strokeLinecap="round" fill="none"
        filter="url(#glow2-soft)" />
      <path d="M480,310 C360,270 260,350 160,290 C80,240 20,300 -60,275"
        stroke="rgba(40,140,255,0.35)" strokeWidth="60" strokeLinecap="round" fill="none"
        filter="url(#glow2-mid)" />
      <path d="M480,310 C360,270 260,350 160,290 C80,240 20,300 -60,275"
        stroke="rgba(80,180,255,0.55)" strokeWidth="22" strokeLinecap="round" fill="none"
        filter="url(#glow2-sharp)" />
      <path d="M480,310 C360,270 260,350 160,290 C80,240 20,300 -60,275"
        stroke="rgba(200,235,255,0.85)" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* WAVE 2 */}
      <path d="M480,370 C350,320 240,400 140,340 C70,295 10,350 -60,330"
        stroke="rgba(15,80,220,0.14)" strokeWidth="100" strokeLinecap="round" fill="none"
        filter="url(#glow2-soft)" />
      <path d="M480,370 C350,320 240,400 140,340 C70,295 10,350 -60,330"
        stroke="rgba(35,120,255,0.28)" strokeWidth="45" strokeLinecap="round" fill="none"
        filter="url(#glow2-mid)" />
      <path d="M480,370 C350,320 240,400 140,340 C70,295 10,350 -60,330"
        stroke="rgba(70,165,255,0.45)" strokeWidth="16" strokeLinecap="round" fill="none"
        filter="url(#glow2-sharp)" />
      <path d="M480,370 C350,320 240,400 140,340 C70,295 10,350 -60,330"
        stroke="rgba(190,225,255,0.7)" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* WAVE 3 */}
      <path d="M480,430 C370,375 250,445 150,390 C80,350 20,395 -60,375"
        stroke="rgba(30,110,245,0.2)" strokeWidth="60" strokeLinecap="round" fill="none"
        filter="url(#glow2-mid)" />
      <path d="M480,430 C370,375 250,445 150,390 C80,350 20,395 -60,375"
        stroke="rgba(150,200,255,0.5)" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      <ellipse cx="240" cy="510" rx="280" ry="30"
        fill="rgba(20,100,255,0.08)" filter="url(#glow2-soft)" />
    </svg>
  );
}

/* ── Neon glow wave — card 3 (sweeping from bottom-left) ── */
function GlowWave3() {
  return (
    <svg viewBox="0 0 480 520" fill="none" preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full pointer-events-none">
      <defs>
        <filter id="glow3-soft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="18" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow3-mid" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow3-sharp" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* WAVE 1 — swooping arc */}
      <path d="M-60,460 C60,380 180,430 280,360 C360,305 420,340 530,300"
        stroke="rgba(20,100,255,0.18)" strokeWidth="130" strokeLinecap="round" fill="none"
        filter="url(#glow3-soft)" />
      <path d="M-60,460 C60,380 180,430 280,360 C360,305 420,340 530,300"
        stroke="rgba(40,140,255,0.35)" strokeWidth="60" strokeLinecap="round" fill="none"
        filter="url(#glow3-mid)" />
      <path d="M-60,460 C60,380 180,430 280,360 C360,305 420,340 530,300"
        stroke="rgba(80,180,255,0.55)" strokeWidth="22" strokeLinecap="round" fill="none"
        filter="url(#glow3-sharp)" />
      <path d="M-60,460 C60,380 180,430 280,360 C360,305 420,340 530,300"
        stroke="rgba(200,235,255,0.85)" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* WAVE 2 */}
      <path d="M-60,510 C80,425 200,480 310,410 C390,360 445,390 530,355"
        stroke="rgba(15,80,220,0.14)" strokeWidth="100" strokeLinecap="round" fill="none"
        filter="url(#glow3-soft)" />
      <path d="M-60,510 C80,425 200,480 310,410 C390,360 445,390 530,355"
        stroke="rgba(35,120,255,0.28)" strokeWidth="45" strokeLinecap="round" fill="none"
        filter="url(#glow3-mid)" />
      <path d="M-60,510 C80,425 200,480 310,410 C390,360 445,390 530,355"
        stroke="rgba(70,165,255,0.45)" strokeWidth="16" strokeLinecap="round" fill="none"
        filter="url(#glow3-sharp)" />
      <path d="M-60,510 C80,425 200,480 310,410 C390,360 445,390 530,355"
        stroke="rgba(190,225,255,0.7)" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* Thin accent */}
      <path d="M-60,400 C100,340 210,390 320,330 C400,285 450,315 530,285"
        stroke="rgba(30,110,245,0.18)" strokeWidth="50" strokeLinecap="round" fill="none"
        filter="url(#glow3-mid)" />
      <path d="M-60,400 C100,340 210,390 320,330 C400,285 450,315 530,285"
        stroke="rgba(150,200,255,0.45)" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      <ellipse cx="240" cy="510" rx="280" ry="30"
        fill="rgba(20,100,255,0.08)" filter="url(#glow3-soft)" />
    </svg>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const cards = sectionRef.current!.querySelectorAll('.benefit-card');
      gsap.fromTo(cards, { y: 40, autoAlpha: 0 }, {
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
        <div className="mb-14">
          <h2 className="font-[var(--font-bricolage)] text-3xl sm:text-4xl md:text-[52px] font-bold tracking-tight leading-[1.08] mb-4 bg-gradient-to-b from-white via-white/90 to-white/60 bg-clip-text text-transparent">
            Domine as Novas Regras de<br />
            Execução Orçamentária
          </h2>
          <p className="text-white/40 text-base md:text-lg max-w-[600px] leading-relaxed">
            Compreenda as recentes decisões do STF e as normativas do TCU sobre emendas parlamentares.
          </p>
        </div>

        {/* 3 equal cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Card 1 — Segurança Jurídica */}
          <div className="benefit-card group relative rounded-[24px] border border-white/[0.06] min-h-[520px] flex flex-col">
            <div className="absolute inset-0 rounded-[24px] overflow-hidden z-0">
              <img src="/card1.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-[inherit] group-hover:opacity-0 transition-opacity duration-500">
              <GlowingEffect alwaysActive spread={60} borderWidth={1.5} />
            </div>
            <div className="relative z-10 p-8 md:p-10">
              <h3 className="font-[var(--font-bricolage)] text-[24px] md:text-[28px] font-bold tracking-tight leading-tight mb-5 text-white">
                Segurança Jurídica
              </h3>
              <p className="text-[14px] leading-relaxed max-w-[280px] text-white/60">
                Entenda detalhadamente os novos entendimentos do STF e garanta que cada etapa do processo cumpra integralmente as diretrizes do Tribunal de Contas da União.
              </p>
            </div>
          </div>

          {/* Card 2 — Transparência Total */}
          <div className="benefit-card group relative rounded-[24px] border border-white/[0.06] min-h-[520px] flex flex-col">
            <div className="absolute inset-0 rounded-[24px] overflow-hidden z-0">
              <img src="/card2.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-[inherit] group-hover:opacity-0 transition-opacity duration-500">
              <GlowingEffect alwaysActive spread={60} borderWidth={1.5} />
            </div>
            <div className="relative z-10 p-8 md:p-10">
              <h3 className="font-[var(--font-bricolage)] text-[24px] md:text-[28px] font-bold tracking-tight leading-tight mb-5 text-white">
                Transparência Total
              </h3>
              <p className="text-[14px] leading-relaxed max-w-[280px] text-white/60">
                Aprenda a estruturar fluxos de informação, portais e relatórios que blindam a gestão pública contra acusações de opacidade e irregularidades.
              </p>
            </div>
          </div>

          {/* Card 3 — Prestação de Contas */}
          <div className="benefit-card group relative rounded-[24px] border border-white/[0.06] min-h-[520px] flex flex-col">
            <div className="absolute inset-0 rounded-[24px] overflow-hidden z-0">
              <img src="/card3.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-[inherit] group-hover:opacity-0 transition-opacity duration-500">
              <GlowingEffect alwaysActive spread={60} borderWidth={1.5} />
            </div>
            <div className="relative z-10 p-8 md:p-10">
              <h3 className="font-[var(--font-bricolage)] text-[24px] md:text-[28px] font-bold tracking-tight leading-tight mb-5 text-white">
                Prestação de Contas
              </h3>
              <p className="text-[14px] leading-relaxed max-w-[280px] text-white/60">
                Técnicas práticas para organização documental e aprovação célere de contas, garantindo a viabilidade de repasses futuros para o seu município.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
