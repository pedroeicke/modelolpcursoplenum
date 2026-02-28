'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle2, MessageCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const inclusosItems = [
  'Kit do aluno (Mochila, Caderno, Caneta, Squeeze, Pulseira, Apostila e Credencial)',
  'Coffee Break incluso em todos os dias',
  'Certificado de Conclusão impresso (mín. 75% de frequência)',
  'Material didático atualizado com as últimas normativas',
  'Acesso ao grupo exclusivo de networking',
];

export default function WorkloadPayment() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current || !pinRef.current || !ctaRef.current) return;

    const ctx = gsap.context(() => {
      const items = itemRefs.current.filter(Boolean) as HTMLDivElement[];
      const totalSteps = items.length + 1; // items + CTA
      const step = 1 / totalSteps;

      // ── Set initial states — all items hidden below ──
      items.forEach((item) => {
        gsap.set(item, { autoAlpha: 0, y: 25 });
      });
      gsap.set(ctaRef.current!, { autoAlpha: 0, y: 20 });

      // ── Build scroll-driven timeline ──
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=300%',
          scrub: 0.3,
          pin: pinRef.current!,
          pinSpacing: true,
        },
      });

      // Each item slides in and STAYS — stacking one below the other
      items.forEach((item, i) => {
        const start = i * step;

        tl.to(item, {
          autoAlpha: 1,
          y: 0,
          duration: step * 0.6,
          ease: 'power2.out',
        }, start);
      });

      // CTA button fades in last, after all items are visible
      const ctaStart = items.length * step;
      tl.to(ctaRef.current!, {
        autoAlpha: 1,
        y: 0,
        duration: step,
        ease: 'power2.out',
      }, ctaStart);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="investimento" className="relative">
      <div
        ref={pinRef}
        className="relative h-screen overflow-hidden"
      >
        {/* Background image — fixed during pin */}
        <div
          className="absolute inset-0 bg-right bg-no-repeat"
          style={{ backgroundImage: "url('/bgvg.png')", backgroundSize: '100% auto' }}
        />

        <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24">
          <div className="max-w-[550px]">

            {/* Title — always visible */}
            <h2 className="font-[var(--font-bricolage)] text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] bg-gradient-to-b from-white via-white/90 to-white/55 bg-clip-text text-transparent mb-4">
              Garanta sua Vaga
            </h2>

            {/* Subtitle — always visible */}
            <p className="text-white/60 text-base md:text-lg leading-relaxed mb-10">
              Invista na sua capacitação com acesso completo aos dias<br />de imersão e material de apoio exclusivo.
            </p>

            {/* Label — always visible */}
            <p className="text-white/35 text-[11px] uppercase font-bold tracking-widest mb-5">
              O que está incluso
            </p>

            {/* Items stack up one by one as user scrolls */}
            <div className="flex flex-col gap-3.5 mb-8">
              {inclusosItems.map((item, i) => (
                <div
                  key={i}
                  ref={(el) => { itemRefs.current[i] = el; }}
                  className="flex items-start gap-3 invisible"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#3b82f6] shrink-0 mt-0.5" />
                  <span className="text-white/80 text-base md:text-lg leading-relaxed">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button — appears after all items */}
            <div ref={ctaRef} className="invisible">
              <a
                href="https://wa.me/553125311776?text=Olá!%20Gostaria%20de%20informações%20sobre%20o%20curso%20de%20Emendas%20Parlamentares."
                target="_blank"
                rel="noopener"
                id="inscricao"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#3b82f6] hover:bg-[#60a5fa] text-white font-semibold text-sm transition-all duration-300 shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]"
              >
                <MessageCircle className="w-4 h-4" />
                Falar com Consultor
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
