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
    { label: 'Diferenciais', href: '#diferenciais' },
    { label: 'Para quem é', href: '#publico' },
    { label: 'Programação', href: '#programacao' },
    { label: 'Instrutora', href: '#instrutor' },
    { label: 'Investimento', href: '#investimento' },
    { label: 'Material', href: '#folder' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: -80, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out'
      });
    }, headerRef);

    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);

    const headerHeight = 80;
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
            ? 'bg-white/80 border-black/10 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.08)]'
            : 'bg-white/10 border-white/20 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.3)]'
          : 'bg-white/5 border-white/10 backdrop-blur-lg'
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
            href="#inscricao"
            className="relative group inline-flex items-center justify-center gap-1.5 px-7 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/0 text-white text-[13px] font-semibold uppercase transition-all"
          >
            <span className="absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 inset-y-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
            Quero me inscrever
            <ArrowRight className="w-3.5 h-3.5" />
            <span className="absolute group-hover:opacity-30 transition-all duration-500 ease-in-out inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
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
            href="#inscricao"
            className="relative group mt-4 w-full inline-flex items-center justify-center px-10 py-3 rounded-full border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/0 text-white text-sm font-semibold uppercase tracking-wide transition-all"
          >
            <span className="absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 inset-y-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
            Quero me inscrever
            <span className="absolute group-hover:opacity-30 transition-all duration-500 ease-in-out inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
          </a>
        </div>
      )}
    </header>
  );
}
