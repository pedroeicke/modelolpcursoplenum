'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 200, suffix: '+', label: 'Alunos Capacitados' },
  { value: 4, suffix: ' dias', label: 'Imersão Presencial' },
  { value: 12, suffix: 'h', label: 'Carga Horária' },
  { value: 5, suffix: '.0', label: 'Avaliação Média' },
];

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 85%',
      once: true,
      onEnter: () => setTriggered(true),
    });

    return () => st.kill();
  }, []);

  useEffect(() => {
    if (!triggered || !sectionRef.current) return;

    const counters = sectionRef.current.querySelectorAll('.stat-value');
    counters.forEach((el, i) => {
      const target = stats[i];
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target.value,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: () => {
          (el as HTMLElement).textContent = Math.round(obj.val) + target.suffix;
        },
      });
    });
  }, [triggered]);

  return (
    <section ref={sectionRef} className="h-[140px] px-6 md:px-12 relative overflow-hidden flex items-center bg-[#030d1f]">
      {/* Neon line top */}
      {/* Neon line top */}
      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-500 to-transparent" />
      <span className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r w-1/2 mx-auto from-transparent via-blue-500/50 to-transparent blur-sm" />
      {/* Neon line bottom */}
      <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-500 to-transparent" />
      <span className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r w-1/2 mx-auto from-transparent via-blue-500/50 to-transparent blur-sm" />
      <div className="max-w-[1200px] mx-auto w-full relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {stats.map((stat, i) => (
          <div key={i} className="text-center">
            <div className="stat-value font-[var(--font-bricolage)] text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent mb-2">
              0{stat.suffix}
            </div>
            <p className="text-white/40 text-sm font-medium">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
