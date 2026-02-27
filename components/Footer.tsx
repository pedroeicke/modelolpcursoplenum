'use client';

import { MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-[#020617] border-t border-white/[0.05] py-10 px-6 md:px-12 flex items-center justify-center min-h-[140px]">
      <div className="w-full max-w-[1440px] flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-4 relative z-10">

        {/* Left: Logo */}
        <div className="flex-1 flex justify-center lg:justify-start">
          <img
            src="/logo-plenum-aberta2.png"
            alt="Instituto Plenum Brasil"
            className="h-12 w-auto object-contain opacity-90"
          />
        </div>

        {/* Center: Consultants */}
        <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">

          {/* Kelly Carolina */}
          <div className="flex flex-col items-center gap-3">
            <div className="text-center">
              <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase mb-1">
                Consultora de Vendas
              </p>
              <p className="text-white font-bold text-sm tracking-wide">
                Kelly Carolina
              </p>
            </div>
            <a
              href="https://wa.me/553125311776?text=Olá%20Kelly!%20Gostaria%20de%20informações%20sobre%20o%20curso."
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-[#1db954] text-white font-bold text-xs hover:bg-[#1ed760] transition-colors shadow-sm"
            >
              WhatsApp
            </a>
          </div>

          {/* Fernando Lemos */}
          <div className="flex flex-col items-center gap-3">
            <div className="text-center">
              <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase mb-1">
                Consultor de Vendas
              </p>
              <p className="text-white font-bold text-sm tracking-wide">
                Fernando Lemos
              </p>
            </div>
            <a
              href="https://wa.me/553125311776?text=Olá%20Fernando!%20Gostaria%20de%20informações%20sobre%20o%20curso."
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-[#1db954] text-white font-bold text-xs hover:bg-[#1ed760] transition-colors shadow-sm"
            >
              WhatsApp
            </a>
          </div>

        </div>

        {/* Right: Contact */}
        <div className="flex-1 flex flex-col items-center lg:items-end gap-1.5 text-center lg:text-right">
          <p className="text-white font-bold text-[15px] tracking-wide">
            (31) 2531-1776
          </p>
          <a
            href="https://www.plenumbrasil.com.br"
            target="_blank"
            rel="noopener"
            className="text-[#f5a623] hover:text-[#ffd166] font-semibold text-xs transition-colors"
          >
            plenumbrasil.com.br
          </a>
        </div>

      </div>

      {/* Floating Global WhatsApp Button (Bottom Right Desktop) */}
      <a
        href="https://wa.me/553125311776?text=Olá!%20Gostaria%20de%20informações%20sobre%20o%20curso."
        target="_blank"
        rel="noopener"
        className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 items-center justify-center w-12 h-12 rounded-full bg-[#25D366] text-white hover:bg-[#20c05c] hover:scale-110 transition-all shadow-lg z-20"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </footer>
  );
}
