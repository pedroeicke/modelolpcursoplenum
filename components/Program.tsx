'use client';

import { useState } from 'react';
import { CheckCircle2, Clock, ChevronUp } from 'lucide-react';
import ColorBends from '@/components/ColorBends';

interface SubItem {
  text: string;
  children?: string[];
}

interface DayData {
  tag: string;
  time: string;
  title: string;
  description: string;
  topics: SubItem[];
}

const days: DayData[] = [
  {
    tag: 'Dia 1 — Terça, 10/03',
    time: '14:00 às 18:00',
    title: 'Credenciamento e Entrega de Materiais',
    description: 'Recepção dos participantes, credenciamento, entrega de material didático e orientações iniciais sobre a dinâmica do curso.',
    topics: [
      { text: 'Credenciamento e recepção dos participantes' },
      { text: 'Entrega de material de apoio personalizado' },
      { text: 'Orientações sobre a dinâmica e objetivos do curso' },
    ],
  },
  {
    tag: 'Dia 2 — Quarta, 11/03',
    time: '08:00 às 12:00',
    title: 'Módulo I — Relacionamento Governamental Estratégico na Prática',
    description: 'Fundamentos do RelGov no contexto municipal: compliance, stakeholders e narrativas de valor público.',
    topics: [
      { text: 'O que é RelGov no contexto municipal e por que importa agora' },
      { text: 'Princípios, limites legais e compliance' },
      { text: 'Leitura de cenário: agenda nacional/estadual/municipal' },
      { text: 'Mapa de stakeholders: quem decide, quem influencia, quem executa' },
      { text: 'Propósito público, narrativa de valor e alinhamento com o interesse coletivo' },
    ],
  },
  {
    tag: 'Dia 3 — Quinta, 12/03',
    time: '08:00 às 12:00',
    title: 'Módulo II — Estratégia Institucional e Governança da Captação',
    description: 'Papéis do Executivo e Legislativo, portfólio de projetos, calendário de janelas e documentos base.',
    topics: [
      { text: 'Papéis e competências: como Executivo e Legislativo se complementam na captação' },
      { text: 'Portfólio de Projetos: diagnóstico, definição de prioridades, aderência ao PPA' },
      { text: 'Calendário anual de janelas: prazos de LDO/LOA, emendas e editais' },
      { text: 'Documentos base: plano de trabalho, estudo técnico, cronograma' },
    ],
  },
  {
    tag: 'Dia 4 — Sexta, 13/03',
    time: '08:00 às 12:00',
    title: 'Módulo III — Onde Estão os Recursos & Como Acessá-los',
    description: 'Transferências, programas federais, emendas parlamentares, fontes alternativas e monitoramento de oportunidades.',
    topics: [
      { text: 'Transferências obrigatórias x voluntárias e o que cabe ao município' },
      { text: 'Programas federais de adesão/convênios: uso do Transferegov.br' },
      { text: 'Novo PAC e programas setoriais (saúde, educação, cidades, cultura)' },
      { text: 'Emendas parlamentares: individuais impositivas, bancada e comissão' },
      { text: 'Fontes alternativas: fundos nacionais, bancos públicos e organismos internacionais' },
      { text: 'Monitoramento de oportunidades: diários oficiais, portais e alertas' },
    ],
  },
];

export default function Program() {
  const [openSet, setOpenSet] = useState<Set<number>>(new Set([0, 1, 2, 3]));

  return (
    <section id="programacao" className="pt-[66px] pb-24 md:pb-32 px-6 md:px-12 bg-[#030d1f] relative overflow-hidden">
      <div className="absolute inset-0 z-0 blur-2xl opacity-40">
        <ColorBends
          rotation={0}
          speed={0.39}
          colors={["#007bff","#4097bf"]}
          transparent
          autoRotate={0}
          scale={1.2}
          frequency={1}
          warpStrength={1}
          mouseInfluence={0.7}
          parallax={0.5}
          noise={0.1}
        />
      </div>
      <div className="max-w-[1100px] mx-auto relative z-10">
        {/* ── Header ── */}
        <div className="mb-12">
          <h2 className="font-[var(--font-bricolage)] text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-none mb-3 bg-gradient-to-b from-white via-white/90 to-white/55 bg-clip-text text-transparent">
            Programação
          </h2>
          <p className="text-white/40 text-base md:text-lg">
            4 dias de imersão presencial em Brasília/DF. Carga horária total de 12 horas-aula.
          </p>
        </div>

        {/* ── List ── */}
        <div className="flex flex-col gap-4">
          {days.map((day, i) => {
            const isOpen = openSet.has(i);

            return (
              <div
                key={i}
                className={`rounded-2xl transition-all duration-300 ${
                  isOpen
                    ? 'bg-gradient-to-br from-[#0d2854]/70 to-[#091a38]/70 backdrop-blur-md border border-[#1e4a8a]/50 shadow-[0_0_30px_rgba(30,74,138,0.12)]'
                    : 'bg-gradient-to-br from-[#0d2854]/70 to-[#091a38]/70 backdrop-blur-md border border-[#1e4a8a]/50 shadow-[0_0_30px_rgba(30,74,138,0.12)]'
                }`}
              >
                {/* ── Header row ── */}
                <button
                  onClick={() => {
                    setOpenSet(prev => {
                      const next = new Set(prev);
                      next.has(i) ? next.delete(i) : next.add(i);
                      return next;
                    });
                  }}
                  className="w-full text-left flex items-center gap-4 px-6 py-5 cursor-pointer"
                >
                  {/* Day pill */}
                  <span className="shrink-0 text-[11px] font-semibold border border-white/[0.15] rounded-full px-3 py-1 text-white/55 tracking-wide">
                    {day.tag}
                  </span>

                  {/* Time */}
                  <span className="hidden sm:flex items-center gap-1.5 text-white/35 text-[12px] shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    {day.time}
                  </span>

                  {/* Title */}
                  <span className="flex-1 text-white/90 text-base md:text-lg font-semibold leading-snug">
                    {day.title}
                  </span>

                  {/* Chevron */}
                  <ChevronUp
                    className={`w-5 h-5 text-white/35 shrink-0 transition-transform duration-300 ${
                      isOpen ? '' : 'rotate-180'
                    }`}
                  />
                </button>

                {/* ── Expanded content ── */}
                {isOpen && (
                  <div className="px-6 pb-6 border-t border-white/[0.07] pt-5 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 md:gap-10">
                    {/* Description */}
                    <p className="text-white/40 text-sm leading-relaxed">{day.description}</p>

                    {/* Topics */}
                    <div className="flex flex-col gap-3">
                      {day.topics.map((topic, j) => (
                        <div key={j}>
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-4 h-4 text-[#5b9cf6] shrink-0 mt-0.5" />
                            <span className="text-white/70 text-sm leading-relaxed">{topic.text}</span>
                          </div>
                          {topic.children && (
                            <div className="ml-7 mt-2 flex flex-col gap-1.5 pl-3 border-l border-white/[0.07]">
                              {topic.children.map((child, k) => (
                                <div key={k} className="flex items-start gap-2">
                                  <span className="text-[#5b9cf6] text-[10px] mt-1.5">●</span>
                                  <span className="text-white/45 text-[13px] leading-relaxed">{child}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
