'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, MapPin, Users, CalendarDays, ChevronDown, Download } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 192;
const FRAME_PATH = '/frames/frame_';
const FRAME_EXT = '.jpg';

const frameSrc = (i: number) => {
  const num = String(i + 1).padStart(4, '0');
  return `${FRAME_PATH}${num}${FRAME_EXT}`;
};

const turmas = [
  '09 a 13 de março de 2026',
  '07 a 11 de abril de 2026',
  '05 a 09 de maio de 2026',
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [turmaOpen, setTurmaOpen] = useState(false);
  const [selectedTurma, setSelectedTurma] = useState(0);

  /* ── Frame loader ── */
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

  /* ── GSAP scroll-driven frames ── */
  useEffect(() => {
    if (!sectionRef.current || !loaded) return;
    drawFrame(0);
    const ctx = gsap.context(() => {
      const els = sectionRef.current?.querySelectorAll('.hero-anim');
      if (els) {
        gsap.fromTo(els, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out', delay: 0.3 });
      }
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0,
        onUpdate: (self) => {
          const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(self.progress * FRAME_COUNT));
          drawFrame(frameIndex);
        },
      });
    }, sectionRef);
    const onResize = () => drawFrame(0);
    window.addEventListener('resize', onResize);
    return () => { ctx.revert(); window.removeEventListener('resize', onResize); };
  }, [loaded]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[#020617] flex flex-col"
    >
      {/* ── BG: gradient ── */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_85%,_#062060_0%,_#010814_60%)]" />

      {/* ── Canvas — blue wave animation ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[1] w-full h-full mix-blend-screen"
        style={{ opacity: 0.55 }}
      />

      {/* ── Ultra-subtle glass ── */}
      <div className="absolute inset-0 z-[2] bg-white/[0.01] backdrop-blur-[2px]" />

      {/* ── Dark overlay ── */}
      <div className="absolute inset-0 z-[2] bg-black/25 pointer-events-none" />

      {/* ── Top highlight ── */}
      <div className="absolute top-0 inset-x-0 z-[3] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* ── Center glow orb ── */}
      <div className="absolute top-[30%] left-[50%] -translate-x-1/2 z-[3] w-[600px] h-[400px] rounded-full bg-[radial-gradient(ellipse,rgba(59,130,246,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* ═══════ Content ═══════ */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 md:px-12 pt-36 pb-16 max-w-[1200px] mx-auto w-full">

        {/* ── Category label ── */}
        <span className="hero-anim inline-block bg-white text-[#3b82f6] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-4 px-4 py-1.5 rounded-full">
          Imersão
        </span>

        {/* ── Heading — large, center, mixed opacities ── */}
        <h1 className="hero-anim text-center font-[var(--font-bricolage)] text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[5.5rem] xl:text-[6.5rem] font-extrabold leading-[0.95] tracking-tight mb-10">
          <span className="text-white">EMENDAS </span>
          <span className="text-[#3b82f6]">PARLAMENTARES</span>
          <br />
          <span className="text-[#3b82f6]">NA </span>
          <span className="text-white">PRÁTICA.</span>
        </h1>

        {/* ── Subtitle ── */}
        <p className="hero-anim text-center text-white text-lg sm:text-xl md:text-2xl font-medium tracking-wide mb-8 whitespace-nowrap">
          Execução, Transparência e Prestação de Contas (pós-mudanças do STF)
        </p>

        {/* ── Info badges — pill ── */}
        <div className="hero-anim relative z-20 inline-flex flex-col sm:flex-row items-stretch mb-10 rounded-[999px] bg-black/30 backdrop-blur-md border border-white/[0.08] overflow-visible">

          {/* Item 1 — Dias / Brasília */}
          <div className="flex items-center gap-3 px-5 py-3">
            <div className="w-9 h-9 rounded-full bg-white/[0.07] border border-white/[0.08] flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-[#3b82f6]" />
            </div>
            <div>
              <p className="text-[#3b82f6] text-[11px] font-semibold uppercase tracking-wider mb-1">3 Dias de imersão em</p>
              <p className="text-white font-bold text-sm">Brasília | DF</p>
            </div>
          </div>

          <span className="hidden sm:block w-px bg-white/[0.08] self-stretch" />
          <span className="sm:hidden h-px bg-white/[0.08]" />

          {/* Item 2 — Vagas */}
          <div className="flex items-center gap-3 px-5 py-3">
            <div className="w-9 h-9 rounded-full bg-white/[0.07] border border-white/[0.08] flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 text-[#3b82f6]" />
            </div>
            <div>
              <p className="text-[#3b82f6] text-[11px] font-semibold uppercase tracking-wider mb-1">Vagas limitadas</p>
              <p className="text-white font-bold text-sm">Presencial ou Ao Vivo</p>
            </div>
          </div>

          <span className="hidden sm:block w-px bg-white/[0.08] self-stretch" />
          <span className="sm:hidden h-px bg-white/[0.08]" />

          {/* Item 3 — Próxima turma */}
          <div className="flex items-center gap-3 px-5 py-3">
            <div className="w-9 h-9 rounded-full bg-white/[0.07] border border-white/[0.08] flex items-center justify-center shrink-0">
              <CalendarDays className="w-4 h-4 text-[#3b82f6]" />
            </div>
            <div className="relative">
              <p className="text-[#3b82f6] text-[11px] font-semibold uppercase tracking-wider mb-1">Próxima turma</p>
              <button
                onClick={() => setTurmaOpen(!turmaOpen)}
                className="flex items-center gap-1 text-white font-bold text-sm hover:text-white/80 transition-colors cursor-pointer"
              >
                <span>{turmas[selectedTurma]}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${turmaOpen ? 'rotate-180' : ''}`} />
              </button>

              {turmaOpen && (
                <div className="absolute top-full left-0 mt-2 min-w-[220px] rounded-xl bg-[#0a1a3a]/95 backdrop-blur-xl border border-white/10 shadow-2xl py-1.5 z-[999]">
                  {turmas.map((turma, i) => (
                    <button
                      key={i}
                      onClick={() => { setSelectedTurma(i); setTurmaOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        i === selectedTurma
                          ? 'text-white bg-white/10'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {turma}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* ── CTAs ── */}
        <div className="hero-anim flex items-center gap-3 mb-8">
          {/* Baixar Folder */}
          <a
            href="#folder"
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white/[0.06] border border-white/[0.25] backdrop-blur-md text-white text-sm font-medium hover:bg-white/[0.12] hover:border-white/[0.4] transition-all duration-300"
          >
            <Download className="w-4 h-4" />
            Baixar o folder
          </a>

          {/* Quero me inscrever — neon blue */}
          <a
            href="#inscricao"
            className="relative group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 text-white text-sm font-semibold transition-all duration-300"
          >
            <span className="absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 inset-y-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
            Quero me inscrever
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            <span className="absolute group-hover:opacity-30 transition-all duration-500 ease-in-out inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
          </a>
        </div>

        {/* ── Link to last section ── */}
        <a href="#folder" className="hero-anim text-white/40 text-sm hover:text-white/60 transition-colors mb-20 underline underline-offset-4 decoration-white/20 hover:decoration-white/40">
          Solicitar curso In Company
        </a>

      </div>

      {/* ── Bottom gradient fade ── */}
      <div className="absolute bottom-0 inset-x-0 z-[4] h-32 bg-gradient-to-t from-[#030d1f] to-transparent pointer-events-none" />
    </section>
  );
}
