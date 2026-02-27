'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Download, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 192;
const FRAME_PATH = '/frames/frame_';
const FRAME_EXT = '.jpg';

// Generate frame src with zero-padding: frame_0001.jpg
const frameSrc = (i: number) => {
  const num = String(i + 1).padStart(4, '0');
  return `${FRAME_PATH}${num}${FRAME_EXT}`;
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Pre-load all frames
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = frameSrc(i);
      img.onload = img.onerror = () => {
        loadedCount++;
        if (loadedCount === FRAME_COUNT) {
          framesRef.current = images;
          setLoaded(true);
        }
      };
      images.push(img);
    }
  }, []);

  // Draw frame on canvas
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = framesRef.current[index];
    if (!canvas || !ctx || !img?.complete) return;

    const cw = canvas.offsetWidth;
    const ch = canvas.offsetHeight;

    if (canvas.width !== cw * window.devicePixelRatio || canvas.height !== ch * window.devicePixelRatio) {
      canvas.width = cw * window.devicePixelRatio;
      canvas.height = ch * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    // Cover fit
    const vw = img.width;
    const vh = img.height;
    const scale = Math.max(cw / vw, ch / vh);
    const w = vw * scale;
    const h = vh * scale;
    const x = (cw - w) / 2;
    const y = (ch - h) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, x, y, w, h);
  };

  // Scroll-driven frame animation + Hero content animations
  useEffect(() => {
    if (!sectionRef.current || !loaded) return;

    // Draw first frame immediately
    drawFrame(0);

    const ctx = gsap.context(() => {
      // Animate Hero content
      const els = sectionRef.current?.querySelectorAll('.hero-anim');
      if (els) {
        gsap.fromTo(
          els,
          { y: 30, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out', delay: 0.3 }
        );
      }

      // Scroll-driven frame swap
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0,
        onUpdate: (self) => {
          const frameIndex = Math.min(
            FRAME_COUNT - 1,
            Math.floor(self.progress * FRAME_COUNT)
          );
          drawFrame(frameIndex);
        },
      });
    }, sectionRef);

    // Handle resize
    const onResize = () => drawFrame(0);
    window.addEventListener('resize', onResize);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', onResize);
    };
  }, [loaded]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center px-6 md:px-12 overflow-hidden bg-[#020617]"
    >
      {/* Background Deep Blue Gradient */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_#051953_0%,_#01040a_100%)] opacity-80" />

      {/* Scroll-driven Video Canvas with Blur */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[1] w-full h-full opacity-40 mix-blend-screen blur-[8px] scale-105"
      />

      {/* Darker Blue Overlay for Depth */}
      <div className="absolute inset-0 z-[2] bg-[#020617]/40 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10 max-w-[1240px] w-full mx-auto text-left flex flex-col items-start pt-[140px] pb-16">
        {/* Label Badge (No Icon) */}
        <div className="hero-anim inline-flex items-center px-4 py-2 rounded-full border border-[#28a745]/30 text-[#28a745] bg-[#28a745]/5 mb-8">
          <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase">Curso de Capacitação e Aperfeiçoamento</span>
        </div>

        {/* Title */}
        <h1 className="hero-anim font-[var(--font-bricolage)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-8">
          Relacionamento <span className="text-[#28a745]">Governamental</span><br />
          <span className="text-[#28a745]">e Captação de Recursos</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-anim text-white/60 text-lg sm:text-xl md:text-2xl italic leading-relaxed max-w-[700px] mb-10">
          Como Transformar Agendas em Brasília em Recursos, Convênios e Resultados para o Município
        </p>

        {/* Info Group: Date + Location */}
        <div className="hero-anim flex flex-col items-start gap-8 mb-12">
          {/* Date */}
          <div className="flex flex-col items-start gap-2">
            <span className="font-[var(--font-bricolage)] text-white text-3xl sm:text-4xl font-bold tracking-tight">
              10/03 a 13/03
            </span>
            <div className="w-32 h-[3px] bg-gradient-to-r from-[#28a745] to-transparent rounded-full" />
          </div>

          {/* Location */}
          <div className="flex flex-col items-start gap-2 max-w-[400px]">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#28a745]" />
              <span className="text-white font-semibold text-sm">
                Sede Brasília/DF: <span className="text-[#28a745]">Edifício Morro Vermelho</span>
              </span>
            </div>
            <p className="text-white/40 text-xs leading-relaxed">
              SCS Quadra 01, Bloco H, 8° Andar, Asa Sul, Brasília/DF
            </p>
          </div>
        </div>

        {/* CTAs row */}
        <div className="hero-anim flex flex-row items-center gap-4 w-full">
          <a
            href="https://materiais.plenumbrasil.com.br/presencial-df-relacionamento-governamental-e-captacao-de-recursos-marco-2026"
            target="_blank"
            rel="noopener"
            className="btn-primary !px-10 !py-4"
          >
            Fazer Inscrição <ArrowRight className="w-5 h-5" />
          </a>
          <a href="#folder" className="btn-outline !px-10 !py-4">
            <Download className="w-5 h-5" /> Baixar Folder
          </a>
        </div>
      </div>
    </section>
  );
}
