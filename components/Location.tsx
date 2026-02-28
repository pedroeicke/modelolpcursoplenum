'use client';

import { MapPin, Phone, Building2 } from 'lucide-react';

export default function Location() {
  return (
    <section id="local" className="py-20 md:py-28 px-6 md:px-12 bg-[#010914] relative overflow-hidden">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">

          {/* Info — Left */}
          <div className="lg:w-1/2 space-y-10 order-2 lg:order-1">
            <div className="space-y-4">
              <div className="flex items-center gap-2 uppercase tracking-widest text-sm font-semibold text-[#3b82f6]">
                <MapPin className="w-4 h-4" />
                <span>Localização</span>
              </div>
              <h2 className="font-[var(--font-bricolage)] text-[52px] lg:text-[72px] font-bold tracking-tight leading-[1.05] bg-gradient-to-b from-white via-white/90 to-white/55 bg-clip-text text-transparent">
                Onde vai ser
              </h2>
              <p className="text-white/50 text-lg leading-relaxed">
                Um espaço de excelência preparado para receber os maiores especialistas do país com conforto e acessibilidade.
              </p>
            </div>

            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start gap-5 p-4 rounded-2xl border border-transparent bg-transparent hover:border-[#3b82f6]/25 hover:bg-[#3b82f6]/[0.06] hover:backdrop-blur-sm transition-all duration-300 group">
                <div className="w-11 h-11 rounded-xl bg-[#3b82f6] text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white mb-1">Faculdade de Direito da UFMG</h3>
                  <p className="text-white/45 leading-relaxed text-sm">
                    Avenida João Pinheiro, 100 – Centro<br />
                    Belo Horizonte / MG · CEP 30.130-180
                  </p>
                </div>
              </div>

              {/* Hotel */}
              <div className="flex items-start gap-5 p-4 rounded-2xl border border-transparent bg-transparent hover:border-[#3b82f6]/25 hover:bg-[#3b82f6]/[0.06] hover:backdrop-blur-sm transition-all duration-300 group">
                <div className="w-11 h-11 rounded-xl bg-[#3b82f6] text-white flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white mb-1">Hospedagem Parceira</h3>
                  <p className="text-white/45 leading-relaxed text-sm">
                    Solicite a lista de hotéis parceiros com tarifas especiais para participantes de cursos do Instituto Plenum Brasil.
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="pt-4 flex flex-col sm:flex-row gap-6 border-t border-white/[0.06]">
                <div className="flex items-center gap-4 group/phone">
                  <div className="w-10 h-10 rounded-full bg-[#3b82f6] text-white flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/35 uppercase tracking-wider mb-0.5">Informações</p>
                    <a href="tel:3125311776" className="font-bold text-white text-base hover:text-[#3b82f6] transition-colors">(31) 2531-1776</a>
                  </div>
                </div>
                <div className="flex items-center gap-4 group/phone2">
                  <div className="w-10 h-10 rounded-full bg-[#3b82f6] text-white flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/35 uppercase tracking-wider mb-0.5">Atendimento</p>
                    <a href="tel:3140034961" className="font-bold text-white text-base hover:text-[#3b82f6] transition-colors">(31) 4003-4961</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map — Right */}
          <div className="lg:w-1/2 h-[380px] lg:h-[480px] w-full rounded-3xl overflow-hidden relative border border-white/[0.08] shadow-[0_0_60px_rgba(0,0,0,0.5)] order-1 lg:order-2">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3750.9649262321777!2d-43.94151851384342!3d-19.925882790365527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa699e686e23e61%3A0xfb45aeef3d8c0cd4!2sFaculdade%20de%20Direito%20da%20UFMG!5e0!3m2!1spt-BR!2sbr!4v1769994180604!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030d1f]/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
              <div className="bg-white/[0.08] backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/[0.15]">
                <p className="text-white font-bold text-sm">Auditório Central UFMG</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
