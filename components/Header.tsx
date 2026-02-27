'use client';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import gsap from 'gsap';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLightBackground, setIsLightBackground] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const navItems = [
    { label: 'Por que participar', href: '#motivos' },
    { label: 'Programação', href: '#programacao' },
    { label: 'Palestrante', href: '#instrutor' },
    { label: 'Material Exclusivo', href: '#folder' },
    { label: 'Localização', href: '#local' },
    { label: 'Investimento', href: '#investimento' },
    { label: 'Depoimentos', href: '#depoimentos' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: -80, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out'
      });
    }, headerRef);

    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);

    // Intersection Observer for dynamic header color
    const headerHeight = 80; // Approximate height
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLightBackground(entry.target.classList.contains('theme-light'));
          }
        });
      },
      {
        rootMargin: `-${headerHeight / 2}px 0px -${window.innerHeight - headerHeight}px 0px`,
      }
    );

    // Observe all sections to detect background changes
    document.querySelectorAll('section').forEach((section) => {
      observer.observe(section);
    });

    return () => {
      ctx.revert();
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 py-3 px-4 lg:px-6"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Desktop pill header */}
        <div className={`hidden lg:flex items-center justify-between h-[80px] rounded-full border px-6 transition-all duration-500 ${scrolled
          ? isLightBackground
            ? 'bg-white/80 border-black/10 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.08)]' // Light scrolled
            : 'bg-white/10 border-white/20 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.3)]'  // Dark scrolled
          : 'bg-white/5 border-white/10 backdrop-blur-lg' // Not scrolled (always dark initially due to hero)
          }`}>
          <a href="#" className="flex items-center shrink-0">
            <img
              src={isLightBackground && scrolled ? "/logo.svg" : "/logo-plenum-aberta2.png"}
              alt="Plenum Brasil Logo"
              className="h-7 lg:h-8 w-auto object-contain transition-all duration-500"
            />
          </a>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`px-3 py-2 text-[12px] font-medium tracking-wide transition-colors uppercase inline-flex items-center gap-1 ${isLightBackground && scrolled
                  ? 'text-black/60 hover:text-black'
                  : 'text-white/80 hover:text-white'
                  }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href="https://materiais.plenumbrasil.com.br/presencial-df-relacionamento-governamental-e-captacao-de-recursos-marco-2026"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full bg-[#28a745] text-[#0a0a0a] text-[13px] font-semibold uppercase hover:bg-[#d4e680] transition-colors"
          >
            Fazer Inscrição
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile pill header */}
        <div className={`lg:hidden flex items-center justify-between rounded-full border backdrop-blur-xl px-4 py-2.5 transition-colors duration-500 ${isLightBackground && scrolled
          ? 'bg-white/90 border-black/10 shadow-sm'
          : 'bg-white/10 border-white/10'
          }`}>
          <a href="#" className="flex items-center shrink-0">
            <img
              src={isLightBackground && scrolled ? "/logo.svg" : "/logo-plenum-aberta2.png"}
              alt="Plenum Brasil Logo"
              className="h-6 w-auto object-contain transition-all duration-500"
            />
          </a>
          <button
            className={`w-10 h-10 flex items-center justify-center transition-colors duration-500 ${isLightBackground && scrolled ? 'text-[#0a0a0a]' : 'text-white'}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="lg:hidden mt-3 mx-2 rounded-2xl bg-black/80 backdrop-blur-2xl border border-white/10 p-6 shadow-2xl">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-sm text-white/80 hover:text-white transition-colors uppercase tracking-wide"
            >
              {item.label}
            </a>
          ))}
          <a
            href="https://materiais.plenumbrasil.com.br/presencial-df-relacionamento-governamental-e-captacao-de-recursos-marco-2026"
            target="_blank"
            rel="noopener"
            className="mt-4 w-full text-center block px-6 py-3 bg-[#28a745] text-[#0a0a0a] rounded-full font-semibold text-sm uppercase tracking-wide"
          >
            Fazer Inscrição
          </a>
        </div>
      )}
    </header>
  );
}
