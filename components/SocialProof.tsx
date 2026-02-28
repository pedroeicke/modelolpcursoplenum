'use client';

import React, { useState } from 'react';
import { Play, X, CheckCircle2, ArrowRight, CreditCard, Info, Building2, MapPin, Phone, Globe, Mail, FileText, ChevronDown } from 'lucide-react';
import Grainient from './Grainient';
import { Button } from '@/components/ui/neon-button';
import { cn } from '@/lib/utils';

const videos = [
  {
    id: 1,
    title: 'Depoimento: Maria Silva',
    role: 'Gestora de Contratos – TJMG',
    thumbnail: '/uploaded_media_0_1770074625239.png',
    youtubeId: 'dQw4w9WgXcQ',
  },
  {
    id: 2,
    title: 'Depoimento: João Santos',
    role: 'Pregoeiro – Prefeitura de BH',
    thumbnail: '/uploaded_media_1770065697827.png',
    youtubeId: 'dQw4w9WgXcQ',
  },
  {
    id: 3,
    title: 'Depoimento: Especialista',
    role: 'Instituto Plenum Brasil',
    thumbnail: '/uploaded_media_1770065858365.png',
    videoSrc: '/03.MOV',
  },
  {
    id: 4,
    title: 'Depoimento: Carlos Lima',
    role: 'Secretário – MPMG',
    thumbnail: '/uploaded_media_0_1770074625239.png',
    youtubeId: 'dQw4w9WgXcQ',
  },
  {
    id: 5,
    title: 'Depoimento: Fernanda Souza',
    role: 'OAB – MG',
    thumbnail: '/uploaded_media_1770065697827.png',
    youtubeId: 'dQw4w9WgXcQ',
  },
];

export default function SocialProof() {
  const [position, setPosition] = useState(3);
  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null);
  const [ctaSubmitted, setCtaSubmitted] = useState(false);
  const [ctaForm, setCtaForm] = useState({ nome: '', email: '', orgao: '', whatsapp: '' });
  const [openCancelamento, setOpenCancelamento] = useState(false);
  const [openEmpresa, setOpenEmpresa] = useState(false);

  const handleCtaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCtaForm({ ...ctaForm, [e.target.name]: e.target.value });
  };
  const handleCtaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCtaSubmitted(true);
  };

  const handleCardClick = (offset: number) => {
    if (position !== offset) {
      setPosition(offset);
      setPlayingVideoId(null);
    }
  };

  const handlePlayClick = (e: React.MouseEvent, videoId: number) => {
    e.stopPropagation();
    setPlayingVideoId(videoId);
  };

  const handleCloseVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlayingVideoId(null);
  };

  return (
    <section id="depoimentos" className="pt-24 md:pt-32 pb-0 bg-[#030d1f] relative overflow-hidden">
      {/* Grainient background */}
      <div className="absolute inset-0 pointer-events-none">
        <Grainient
          color1="#030d1f"
          color2="#378bae"
          color3="#030d1f"
          timeSpeed={2.2}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={1}
          warpSpeed={0}
          warpAmplitude={50}
          blendAngle={52}
          blendSoftness={0.05}
          rotationAmount={0}
          noiseScale={2}
          grainAmount={0.03}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[#3b82f6] text-sm font-bold tracking-[0.2em] uppercase mb-4 inline-block">
            Depoimentos
          </span>
          <h2 className="font-[var(--font-bricolage)] text-[52px] lg:text-[72px] font-bold tracking-tight leading-[1.05] bg-gradient-to-b from-white via-white/90 to-white/55 bg-clip-text text-transparent">
            O que estão falando da gente
          </h2>
        </div>

        {/* Carousel */}
        <div
          className={cn(
            'w-full flex items-center justify-center relative transition-all duration-500',
            playingVideoId !== null ? 'h-[600px]' : 'h-[500px]'
          )}
        >
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{
              perspective: '1000px',
              transformStyle: 'preserve-3d',
              '--position': position,
            } as React.CSSProperties}
          >
            {videos.map((video, index) => {
              const offset = index + 1;
              const isPlaying = playingVideoId === video.id;
              const isActive = position === offset;

              return (
                <div
                  key={video.id}
                  className={cn(
                    'absolute transition-all ease-out cursor-pointer',
                    isPlaying ? 'w-full max-w-[900px] h-full z-[100]' : 'w-[300px] h-[400px]'
                  )}
                  onClick={() => handleCardClick(offset)}
                  style={
                    !isPlaying
                      ? ({
                          '--offset': offset,
                          '--r': 'calc(var(--position) - var(--offset))',
                          '--abs': 'max(calc(var(--r) * -1), var(--r))',
                          transform: 'rotateY(calc(-10deg * var(--r))) translateX(calc(-290px * var(--r)))',
                          zIndex: 'calc(10 - var(--abs))',
                          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                          opacity: 'calc(1 - (0.2 * var(--abs)))',
                        } as React.CSSProperties)
                      : ({
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        } as React.CSSProperties)
                  }
                >
                  <div
                    className={cn(
                      'w-full h-full relative rounded-3xl overflow-hidden group bg-[#0a1628]',
                      !isPlaying && 'shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/[0.08]'
                    )}
                  >
                    {isPlaying ? (
                      <div className="w-full h-full relative">
                        <button
                          onClick={handleCloseVideo}
                          className="absolute top-4 right-4 z-[110] bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition-all"
                        >
                          <X className="w-6 h-6" />
                        </button>
                        {video.videoSrc ? (
                          <video
                            src={video.videoSrc}
                            className="w-full h-full object-contain bg-black"
                            controls
                            autoPlay
                          />
                        ) : (
                          <iframe
                            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
                            title={video.title}
                            className="w-full h-full border-none"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        )}
                      </div>
                    ) : (
                      <>
                        {/* Thumbnail */}
                        {video.videoSrc ? (
                          <video
                            src={video.videoSrc}
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                            muted
                            playsInline
                            loop
                            preload="metadata"
                            onMouseOver={(e) => e.currentTarget.play()}
                            onMouseOut={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                          />
                        ) : (
                          <div
                            className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                            style={{ backgroundImage: `url(${video.thumbnail})` }}
                          />
                        )}

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />

                        {/* Play button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <button
                            onClick={(e) => handlePlayClick(e, video.id)}
                            className={cn(
                              'w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-500 backdrop-blur-sm',
                              isActive
                                ? 'bg-[#3b82f6] scale-100 opacity-100'
                                : 'bg-white/10 scale-75 opacity-0 group-hover:opacity-40'
                            )}
                          >
                            <Play className="w-6 h-6 ml-1 fill-current" />
                          </button>
                        </div>

                        {/* Card info */}
                        <div className="absolute bottom-0 left-0 w-full p-6">
                          <h3 className="text-white font-bold text-lg leading-tight mb-1">{video.title}</h3>
                          <p className="text-[#3b82f6] text-xs uppercase tracking-widest font-bold opacity-80">{video.role}</p>
                        </div>

                        {/* Active highlight */}
                        {isActive && (
                          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent pointer-events-none" />
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots */}
        <div
          className={cn(
            'flex justify-center gap-4 mt-12 transition-opacity duration-300',
            playingVideoId !== null ? 'opacity-0 pointer-events-none' : 'opacity-100'
          )}
        >
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => setPosition(index + 1)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-500',
                position === index + 1
                  ? 'bg-[#3b82f6] w-10'
                  : 'bg-white/20 hover:bg-white/40 w-4'
              )}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>

      </div>

      {/* ── Quero esse curso no meu órgão — full width ── */}
      <div id="notificacao" className="mt-20 md:mt-28 relative w-full bg-white/[0.04] backdrop-blur-md border-t border-white/[0.08] rounded-t-[72px] px-6 md:px-12 pt-14 md:pt-20 overflow-hidden">
        <div className="absolute -inset-2 bg-[#3b82f6]/[0.04] blur-2xl -z-10" />

        <div className="relative z-10 max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h2 className="font-[var(--font-bricolage)] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] text-white mb-5">
              Quero esse curso<br />no meu órgão
            </h2>
            <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-[500px] mx-auto lg:mx-0">
              Capacite toda sua equipe com uma formação personalizada. Montamos uma turma exclusiva para o seu município, câmara ou órgão estadual.
            </p>
          </div>

          <div className="lg:w-1/2 w-full">
            {ctaSubmitted ? (
              <div className="text-center py-12 flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#3b82f6]/10 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-[#3b82f6]" />
                </div>
                <h3 className="font-[var(--font-bricolage)] text-2xl font-bold text-white">Proposta solicitada!</h3>
                <p className="text-white/50 text-sm max-w-[280px]">Nossa equipe entrará em contato para montar a melhor proposta para o seu órgão.</p>
              </div>
            ) : (
              <form onSubmit={handleCtaSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-white/60 text-[11px] uppercase font-bold tracking-widest block mb-2">Nome Completo</label>
                  <input type="text" name="nome" required value={ctaForm.nome} onChange={handleCtaChange} placeholder="Seu nome" className="w-full px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-blue-500/40 focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all" />
                </div>
                <div>
                  <label className="text-white/60 text-[11px] uppercase font-bold tracking-widest block mb-2">Email Corporativo</label>
                  <input type="email" name="email" required value={ctaForm.email} onChange={handleCtaChange} placeholder="seu@email.com" className="w-full px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-blue-500/40 focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all" />
                </div>
                <div>
                  <label className="text-white/60 text-[11px] uppercase font-bold tracking-widest block mb-2">Órgão / Instituição</label>
                  <input type="text" name="orgao" required value={ctaForm.orgao} onChange={handleCtaChange} placeholder="Prefeitura, Câmara, Governo..." className="w-full px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-blue-500/40 focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all" />
                </div>
                <div>
                  <label className="text-white/60 text-[11px] uppercase font-bold tracking-widest block mb-2">WhatsApp</label>
                  <input type="tel" name="whatsapp" required value={ctaForm.whatsapp} onChange={handleCtaChange} placeholder="(00) 00000-0000" className="w-full px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-blue-500/40 focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all" />
                </div>
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="mt-2 w-full inline-flex items-center justify-center gap-2 py-4 text-white text-sm font-medium"
                >
                  Solicitar proposta
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* ── Info Cards ── */}
        <div className="mt-14 md:mt-20 max-w-[1200px] mx-auto flex flex-col gap-3 pb-14 md:pb-20">

          {/* 1. Formas de Pagamento */}
          <div className="flex flex-col md:flex-row items-center gap-6 rounded-2xl border border-white/[0.08] bg-[#0b1a30]/50 backdrop-blur-xl px-6 py-5">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-11 h-11 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-[#3b82f6] flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-bold text-sm uppercase tracking-wider mb-0.5">Formas de Pagamento</p>
                <p className="text-white/45 text-sm leading-relaxed">Boleto bancário, transferência, cheque ou dinheiro.<br className="hidden md:block" />Depósito, TED ou ordem bancária.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="hidden md:block w-px h-10 bg-white/[0.08]" />
              <div className="text-center">
                <p className="text-white/35 text-[10px] uppercase tracking-widest mb-1">Solicite informações no financeiro:</p>
                <a
                  href="https://wa.me/553125311776"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-2.5 rounded-full bg-[#3b82f6] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#60a5fa] transition-colors"
                >
                  Setor Financeiro
                </a>
              </div>
              <div className="hidden md:block w-px h-10 bg-white/[0.08]" />
              <div className="text-center">
                <p className="text-white font-bold text-sm">PIX</p>
                <p className="text-white/35 text-[10px] uppercase tracking-widest">Consulte</p>
              </div>
            </div>
          </div>

          {/* 2. Política de Cancelamento */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0b1a30]/50 backdrop-blur-xl overflow-hidden">
            <button
              onClick={() => setOpenCancelamento(!openCancelamento)}
              className="w-full flex items-center justify-between px-6 py-5 text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-[#3b82f6] flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5" />
                </div>
                <p className="text-white font-bold text-sm uppercase tracking-wider">Política de Cancelamento</p>
              </div>
              <ChevronDown className={`w-5 h-5 text-white/40 transition-transform duration-300 ${openCancelamento ? 'rotate-180' : ''}`} />
            </button>
            {openCancelamento && (
              <div className="px-6 pb-6 space-y-4">
                <div className="rounded-xl border border-[#3b82f6]/10 bg-[#3b82f6]/5 p-4">
                  <p className="text-white/60 text-sm leading-relaxed italic">
                    &quot;O não comparecimento ao curso no qual você tem inscrição confirmada irá gerar a cobrança de{' '}
                    <strong className="text-white not-italic">50% do valor</strong> para custeio do material utilizado,
                    exceto se houver o cancelamento até{' '}
                    <strong className="text-[#3b82f6] not-italic">72 horas antes</strong> do início.&quot;
                  </p>
                </div>
                <p className="text-white/45 text-sm leading-relaxed">
                  O Instituto Plenum Brasil reserva-se o direito de cancelar qualquer evento em caso fortuito, por força maior, ou por falta de quórum.
                </p>
                <div className="flex items-start gap-3 rounded-xl border border-[#3b82f6]/10 bg-[#3b82f6]/5 p-4">
                  <Info className="w-4 h-4 text-[#3b82f6] shrink-0 mt-0.5" />
                  <p className="text-white/55 text-sm leading-relaxed">
                    <strong className="text-white">Atenção:</strong> Confirme, previamente, a realização do curso antes de efetuar a compra de passagens aéreas e o pagamento da hospedagem.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 3. Dados da Empresa */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0b1a30]/50 backdrop-blur-xl overflow-hidden">
            <button
              onClick={() => setOpenEmpresa(!openEmpresa)}
              className="w-full flex items-center justify-between px-6 py-5 text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-[#3b82f6] flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <p className="text-white font-bold text-sm uppercase tracking-wider">Dados da Empresa</p>
              </div>
              <ChevronDown className={`w-5 h-5 text-white/40 transition-transform duration-300 ${openEmpresa ? 'rotate-180' : ''}`} />
            </button>
            {openEmpresa && (
              <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-white/30 text-[10px] uppercase tracking-widest flex items-center gap-2"><MapPin className="w-3 h-3" /> Endereço</p>
                  <p className="text-white/65 text-sm leading-relaxed">Rua Espírito Santo, nº 1204, 2º andar – sala 1<br />Bairro Lourdes – BH/MG – CEP: 30.160-033</p>
                </div>
                <div className="space-y-1">
                  <p className="text-white/30 text-[10px] uppercase tracking-widest flex items-center gap-2"><Mail className="w-3 h-3" /> E-mails</p>
                  <p className="text-white/65 text-sm">plenumgestaooficial@gmail.com</p>
                  <p className="text-white/65 text-sm">financeiro@plenumbrasil.com</p>
                </div>
                <div className="space-y-1">
                  <p className="text-white/30 text-[10px] uppercase tracking-widest flex items-center gap-2"><Phone className="w-3 h-3" /> Contatos</p>
                  <p className="text-white/65 text-sm">31 2531-1776</p>
                  <p className="text-white/65 text-sm">31 2531-1750</p>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-white/30 text-[10px] uppercase tracking-widest flex items-center gap-2"><Globe className="w-3 h-3" /> Website</p>
                    <a href="https://www.plenumbrasil.com.br" target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] text-sm hover:text-[#60a5fa] transition-colors">www.plenumbrasil.com.br</a>
                  </div>
                  <div className="rounded-xl border border-[#3b82f6]/10 bg-[#3b82f6]/5 p-3">
                    <p className="text-white font-bold text-xs flex items-center gap-2 mb-1"><FileText className="w-3 h-3 text-[#3b82f6]" /> Contratação</p>
                    <p className="text-white/45 text-xs italic">&quot;Solicite os documentos e demais informações para contratação.&quot;</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
