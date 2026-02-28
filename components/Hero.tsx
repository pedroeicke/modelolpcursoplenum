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
  '09 a 13 de março de 2026 (08h às 17h)',
  '07 a 11 de abril de 2026 (08h às 17h)',
  '05 a 09 de maio de 2026 (08h às 17h)',
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

        {/* ── Heading — large, center, mixed opacities ── */}
        <h1 className="hero-anim text-center font-[var(--font-bricolage)] text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[5.5rem] xl:text-[6.5rem] font-extrabold leading-[0.95] tracking-tight mb-10">
          <span className="text-white">EMENDAS </span>
          <span className="text-white/40">PARLAMENTARES</span>
          <br />
          <span className="text-white/40">NA </span>
          <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">PRÁTICA.</span>
        </h1>

        {/* ── Subtitle ── */}
        <p className="hero-anim text-center text-white/50 text-base sm:text-lg md:text-xl font-medium tracking-wide mb-8 max-w-[700px]">
          Execução, Transparência e Prestação de Contas
          <span className="text-white/30"> (pós-mudanças do STF)</span>
        </p>

        {/* ── Info badges ── */}
        <div className="hero-anim relative z-20 flex flex-col sm:flex-row items-center gap-3 sm:gap-5 mb-10">
          {/* Brasília */}
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <MapPin className="w-4 h-4 text-[#3b82f6]" />
            <span>3 Dias de imersão em <strong className="text-white/80">Brasília | DF</strong></span>
          </div>

          <span className="hidden sm:block w-px h-4 bg-white/15" />

          {/* Vagas */}
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Users className="w-4 h-4 text-[#3b82f6]" />
            <span>Vagas limitadas · Presencial ou Ao Vivo</span>
          </div>

          <span className="hidden sm:block w-px h-4 bg-white/15" />

          {/* Próxima turma — clickable dropdown */}
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <CalendarDays className="w-4 h-4 text-[#3b82f6] shrink-0" />
            <div className="relative">
              <button
                onClick={() => setTurmaOpen(!turmaOpen)}
                className="flex items-center gap-1.5 hover:text-white/80 transition-colors cursor-pointer"
              >
                <span>Próxima turma: <strong className="text-white/80">{turmas[selectedTurma]}</strong></span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${turmaOpen ? 'rotate-180' : ''}`} />
              </button>

              {turmaOpen && (
                <div className="absolute top-full left-0 mt-2 w-full rounded-xl bg-[#0a1a3a]/95 backdrop-blur-xl border border-white/10 shadow-2xl py-1.5 z-[999]">
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
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white/[0.06] border border-white/[0.12] backdrop-blur-md text-white text-sm font-medium hover:bg-white/[0.12] hover:border-white/[0.2] transition-all duration-300"
          >
            <Download className="w-4 h-4" />
            Baixar o folder
          </a>

          {/* Quero me inscrever — neon blue */}
          <a
            href="#inscricao"
            className="relative group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/0 text-white text-sm font-semibold transition-all duration-300"
          >
            <span className="absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 inset-y-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
            Quero me inscrever
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            <span className="absolute group-hover:opacity-30 transition-all duration-500 ease-in-out inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
          </a>
        </div>

        {/* ── Trust badge ── */}
        <div className="hero-anim flex items-center gap-3 mb-20">
          <span className="bg-white/[0.08] border border-white/[0.1] text-white text-sm font-bold px-3 py-1.5 rounded-lg">5.0</span>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-white/40 text-sm">Avaliação dos participantes</span>
        </div>

      </div>

      {/* ── Bottom gradient fade ── */}
      <div className="absolute bottom-0 inset-x-0 z-[4] h-32 bg-gradient-to-t from-[#030d1f] to-transparent pointer-events-none" />
    </section>
  );
}
