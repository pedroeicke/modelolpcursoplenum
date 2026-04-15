'use client';

import { MapPin, Phone, Building2 } from 'lucide-react';
import type { PhoneEntry } from '@/types/company';
import { getIcon } from '@/lib/icon-map';
import { useTurma } from '@/hooks/use-turma';

// ─── Props ─────────────────────────────────────────────
export interface LocationProps {
  phones?: PhoneEntry[];
  heading?: string;
  description?: string;
}

// ─── Component ────────────────────────────────────────
export default function Location({
  phones = [],
  heading = 'Onde vai ser',
  description = 'Um espaço de excelência preparado para receber os maiores especialistas do país com conforto e acessibilidade.',
}: LocationProps) {
  const { locationVenue, locationAddress, locationMapEmbed, locationExtra } = useTurma();

  // Don't render if no location data
  if (!locationVenue || !locationMapEmbed) return null;

  return (
    <section id="local" className="py-16 md:py-28 px-5 md:px-12 bg-[var(--ds-background-deep)] relative overflow-hidden">
      <div className="max-w-[1100px] mx-auto">

        {/* ── Mobile: stacked vertical layout ── */}
        <div className="lg:hidden flex flex-col gap-8">
          {/* 1. Heading + description */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 uppercase tracking-widest text-xs font-semibold text-[var(--ds-primary)]">
              <MapPin className="w-3.5 h-3.5" />
              <span>Localização</span>
            </div>
            <h2 className="font-[var(--font-bricolage)] text-3xl sm:text-[42px] font-bold tracking-tight leading-[1.05] bg-gradient-to-b from-white via-white/90 to-white/55 bg-clip-text text-transparent">
              {heading}
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              {description}
            </p>
          </div>

          {/* 2. Map */}
          <div className="h-[280px] w-full rounded-2xl overflow-hidden relative border border-white/[0.08] shadow-[0_0_40px_rgba(0,0,0,0.4)]">
            <iframe
              key={locationMapEmbed}
              src={locationMapEmbed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, color-mix(in srgb, var(--ds-background) 50%, transparent), transparent 40%)' }} />
            <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
              <div className="bg-white/[0.08] backdrop-blur-xl px-3 py-2 rounded-xl border border-white/[0.15]">
                <p className="text-white font-bold text-xs">{locationVenue}</p>
              </div>
            </div>
          </div>

          {/* 3. Address card */}
          <div className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.03]">
            <div className="w-10 h-10 rounded-lg bg-[var(--ds-primary)] text-white flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white mb-1">{locationVenue}</h3>
              <p className="text-white/45 leading-relaxed text-xs">
                {locationAddress.split('\n').map((line, i, arr) => (
                  <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                ))}
              </p>
            </div>
          </div>

          {/* Extra location info */}
          {locationExtra.map((extra, i) => {
            const ExtraIcon = extra.icon ? getIcon(extra.icon) : Building2;
            return (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.03]">
                <div className="w-10 h-10 rounded-lg bg-[var(--ds-primary)] text-white flex items-center justify-center shrink-0">
                  {ExtraIcon && <ExtraIcon className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="font-bold text-base text-white mb-1">{extra.label}</h3>
                  <p className="text-white/45 leading-relaxed text-xs">{extra.value}</p>
                </div>
              </div>
            );
          })}

          {/* 4. Phones */}
          {phones.length > 0 && (
            <div className="flex flex-col gap-4 pt-2 border-t border-white/[0.06]">
              {phones.map((phone, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[var(--ds-primary)] text-white flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/35 uppercase tracking-wider mb-0.5">{phone.label}</p>
                    <a href={`tel:${phone.number.replace(/\D/g, '')}`} className="font-bold text-white text-sm hover:text-[var(--ds-primary)] transition-colors">
                      {phone.number}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Desktop: side-by-side layout ── */}
        <div className="hidden lg:flex flex-row gap-20 items-center">
          {/* Info — Left */}
          <div className="lg:w-1/2 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2 uppercase tracking-widest text-sm font-semibold text-[var(--ds-primary)]">
                <MapPin className="w-4 h-4" />
                <span>Localização</span>
              </div>
              <h2 className="font-[var(--font-bricolage)] text-[52px] font-bold tracking-tight leading-[1.05] bg-gradient-to-b from-white via-white/90 to-white/55 bg-clip-text text-transparent">
                {heading}
              </h2>
              <p className="text-white/50 text-lg leading-relaxed">
                {description}
              </p>
            </div>

            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start gap-5 p-4 rounded-2xl border border-transparent bg-transparent hover:border-[var(--ds-primary-25)] hover:bg-[var(--ds-primary-6)] hover:backdrop-blur-sm transition-all duration-300 group">
                <div className="w-11 h-11 rounded-xl bg-[var(--ds-primary)] text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white mb-1">{locationVenue}</h3>
                  <p className="text-white/45 leading-relaxed text-sm">
                    {locationAddress.split('\n').map((line, i, arr) => (
                      <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                    ))}
                  </p>
                </div>
              </div>

              {/* Extra location info */}
              {locationExtra.map((extra, i) => {
                const ExtraIcon = extra.icon ? getIcon(extra.icon) : Building2;
                return (
                  <div key={i} className="flex items-start gap-5 p-4 rounded-2xl border border-transparent bg-transparent hover:border-[var(--ds-primary-25)] hover:bg-[var(--ds-primary-6)] hover:backdrop-blur-sm transition-all duration-300 group">
                    <div className="w-11 h-11 rounded-xl bg-[var(--ds-primary)] text-white flex items-center justify-center shrink-0">
                      {ExtraIcon && <ExtraIcon className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white mb-1">{extra.label}</h3>
                      <p className="text-white/45 leading-relaxed text-sm">{extra.value}</p>
                    </div>
                  </div>
                );
              })}

              {/* Phones */}
              {phones.length > 0 && (
                <div className="pt-4 flex flex-row gap-6 border-t border-white/[0.06]">
                  {phones.map((phone, i) => (
                    <div key={i} className="flex items-center gap-4 group/phone">
                      <div className="w-10 h-10 rounded-full bg-[var(--ds-primary)] text-white flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-white/35 uppercase tracking-wider mb-0.5">{phone.label}</p>
                        <a href={`tel:${phone.number.replace(/\D/g, '')}`} className="font-bold text-white text-base hover:text-[var(--ds-primary)] transition-colors">
                          {phone.number}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Map — Right */}
          <div className="lg:w-1/2 h-[480px] w-full rounded-3xl overflow-hidden relative border border-white/[0.08] shadow-[0_0_60px_rgba(0,0,0,0.5)]">
            <iframe
              key={locationMapEmbed}
              src={locationMapEmbed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, color-mix(in srgb, var(--ds-background) 60%, transparent), transparent)' }} />
            <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
              <div className="bg-white/[0.08] backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/[0.15]">
                <p className="text-white font-bold text-sm">{locationVenue}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
