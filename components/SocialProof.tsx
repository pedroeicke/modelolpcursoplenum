'use client';

import React, { useState } from 'react';
import { Play, X } from 'lucide-react';
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
    <section id="depoimentos" className="py-24 md:py-32 bg-[#030d1f] relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat pointer-events-none"
        style={{ backgroundImage: "url('/fundodepo.png')", backgroundPosition: 'center 10%' }}
      />

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
    </section>
  );
}
