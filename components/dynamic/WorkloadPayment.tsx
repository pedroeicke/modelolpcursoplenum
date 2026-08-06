'use client';

import { CheckCircle2, MapPin, Monitor, Users } from 'lucide-react';
import type { IncludedItem, CoursePrices } from '@/types/course';

// ─── Props ─────────────────────────────────────────────
export interface WorkloadPaymentProps {
  heading?: string;
  subtitle?: string;
  items: IncludedItem[];
  whatsappUrl?: string;
  backgroundImageUrl?: string;
  productImageUrl?: string;
  ctaText?: string;
  price?: number | null;
  /** presencial | online | hibrido — define quais linhas de valor aparecem */
  modality?: string;
  prices?: CoursePrices;
}

// ─── Helper: format BRL ────────────────────────────────
function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ─── Defaults ──────────────────────────────────────────
const defaultItems: IncludedItem[] = [
  { icon: 'CheckCircle2', text: 'Kit do aluno (Mochila, Caderno, Caneta, Squeeze, Pulseira, Apostila e Credencial)' },
  { icon: 'CheckCircle2', text: 'Coffee Break incluso em todos os dias' },
  { icon: 'CheckCircle2', text: 'Certificado de Conclusão impresso (mín. 75% de frequência)' },
  { icon: 'CheckCircle2', text: 'Material didático atualizado com as últimas normativas' },
  { icon: 'CheckCircle2', text: 'Acesso ao grupo exclusivo de networking' },
];

// ─── Component ────────────────────────────────────────
export default function WorkloadPayment({
  heading = 'Garanta sua Vaga',
  subtitle = 'Invista na sua capacitação com acesso completo aos dias\nde imersão e material de apoio exclusivo.',
  items = defaultItems,
  whatsappUrl = 'https://wa.me/553125311776?text=Olá!%20Gostaria%20de%20informações%20sobre%20o%20curso%20de%20Emendas%20Parlamentares.',
  backgroundImageUrl,
  productImageUrl,
  ctaText = 'Falar com Consultor',
  price,
  modality = 'presencial',
  prices,
}: WorkloadPaymentProps) {
  // valor do presencial: campo próprio ou o preço geral do curso
  const vPresencial = prices?.presencial ?? price ?? null;
  const vOnline = prices?.online ?? null;
  const vGrupos = prices?.grupos ?? null;

  const mostraPresencial = modality !== 'online' && vPresencial != null && vPresencial > 0;
  const mostraOnline = modality !== 'presencial' && vOnline != null && vOnline > 0;
  const temLinhas = mostraPresencial || mostraOnline;

  // nota do lote promocional: "Lote promocional até 18/08 · valor normal R$ 4.490,00"
  const notaPresencial = prices?.presencial_normal
    ? [
        prices.promo_ate ? `Lote promocional até ${prices.promo_ate}` : 'Valor promocional',
        `valor normal R$ ${formatBRL(prices.presencial_normal)}`,
      ].join(' · ')
    : null;

  const linhas = [
    mostraPresencial && { Icone: MapPin, rotulo: 'Presencial', valor: vPresencial!, nota: notaPresencial },
    mostraOnline && { Icone: Monitor, rotulo: 'Online ao vivo', valor: vOnline!, nota: null },
  ].filter(Boolean) as { Icone: typeof MapPin; rotulo: string; valor: number; nota: string | null }[];

  return (
    <section id="investimento" className="relative overflow-hidden">
      {/* Gradient transition from previous section */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[var(--ds-background)] to-transparent z-20 pointer-events-none" />

      <div className={`relative ${productImageUrl ? 'min-h-[500px] md:min-h-[850px]' : 'min-h-[500px] md:min-h-[600px]'}`}>
        {/* Background image */}
        {backgroundImageUrl ? (
          <div
            className="absolute inset-0 bg-right bg-no-repeat"
            style={{ backgroundImage: `url('${backgroundImageUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 75% 35%, var(--ds-primary-10), transparent 55%), linear-gradient(180deg, var(--ds-background-alt), var(--ds-background))',
            }}
          />
        )}

        {/* ── Desktop: Product image — absolutely positioned, right side, full height ── */}
        {productImageUrl && (
          <div className="hidden md:flex absolute right-0 bottom-0 top-0 w-[50%] items-end justify-center z-[5] pointer-events-none pr-[3%]">
            <img
              src={productImageUrl}
              alt="Kit do curso"
              className="max-w-full h-[95%] object-contain object-bottom drop-shadow-2xl"
            />
          </div>
        )}

        <div className="relative z-10 h-full flex flex-col justify-center pt-16 pb-20 md:pt-24 md:pb-28 px-6 md:px-12">
          <div className="max-w-[1100px] mx-auto w-full">
            {/* ── Text content — left side on desktop ── */}
            <div className={productImageUrl ? 'w-full md:w-[48%]' : 'max-w-[550px]'}>

              {/* Title */}
              <h2 className="font-[var(--font-bricolage)] text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] bg-gradient-to-b from-white via-white/90 to-white/55 bg-clip-text text-transparent mb-4">
                {heading}
              </h2>

              {/* Subtitle — some quando os valores por modalidade assumem o lugar */}
              {!temLinhas && (
                <p className="text-white/60 text-base md:text-lg leading-relaxed mb-10">
                  {subtitle.split('\n').map((line, i, arr) => (
                    <span key={i}>
                      {line}
                      {i < arr.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              )}

              {/* Label */}
              <span className="inline-block px-4 py-1.5 rounded-full text-[var(--ds-primary)] text-[11px] uppercase font-bold tracking-widest mb-5" style={{ backgroundColor: 'var(--ds-primary-10)', borderWidth: '1px', borderColor: 'var(--ds-primary-20)' }}>
                O que está incluso
              </span>

              {/* Items */}
              <div className="flex flex-col gap-3.5 mb-8">
                {items.filter(item => item.text?.trim()).map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[var(--ds-primary)] shrink-0 mt-0.5" />
                    <span className="text-white/80 text-base md:text-lg leading-relaxed">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Investimento: um valor por modalidade (ícone + rótulo), desconto de grupos abaixo */}
              {temLinhas && (
                <div className="mb-8">
                  <span className="block text-white/50 text-sm mb-3">Investimento</span>

                  <div className="flex flex-col gap-3">
                    {linhas.map(({ Icone, rotulo, valor, nota }) => (
                      <div key={rotulo} className="flex items-center gap-3">
                        <span
                          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: 'var(--ds-primary-10)', border: '1px solid var(--ds-primary-20)' }}
                        >
                          <Icone className="w-5 h-5 text-[var(--ds-primary)]" />
                        </span>
                        <div className="flex flex-col leading-tight">
                          <span className="text-white/55 text-[13px] uppercase tracking-wider font-semibold">{rotulo}</span>
                          <span className="text-white font-bold tracking-tight text-3xl md:text-4xl">
                            <span className="text-xl md:text-2xl align-top mr-1">R$</span>{formatBRL(valor)}
                          </span>
                          {nota && (
                            <span className="text-white/55 text-[13px] mt-0.5">{nota}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {vGrupos != null && vGrupos > 0 && (
                    <div className="flex items-center gap-2 mt-4">
                      <Users className="w-4 h-4 text-[var(--ds-primary)] shrink-0" />
                      <span className="text-white/70 text-sm md:text-base">
                        Desconto para grupos:{' '}
                        <strong className="text-white font-semibold">R$ {formatBRL(vGrupos)}</strong>
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* CTA Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener"
                id="inscricao"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[var(--ds-primary)] hover:bg-[var(--ds-primary-hover)] text-white font-semibold text-sm transition-all duration-300"
                style={{ boxShadow: '0 0 30px var(--ds-primary-30)' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 40px var(--ds-primary-50)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 30px var(--ds-primary-30)'; }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {ctaText}
              </a>
            </div>

            {/* ── Mobile: Product image — in normal flow below text ── */}
            {productImageUrl && (
              <div className="mt-12 md:hidden w-full flex items-center justify-center">
                <img
                  src={productImageUrl}
                  alt="Kit do curso"
                  className="w-full object-contain drop-shadow-2xl"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
