'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle2, Clock, ChevronDown, ChevronUp, ArrowRight, BookOpen } from 'lucide-react';
import Grainient from './Grainient';

gsap.registerPlugin(ScrollTrigger);

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
    description: 'Recepção dos participantes, credenciamento, entrega de material didático e orientações iniciais.',
    topics: [
      { text: 'Credenciamento e recepção dos participantes' },
      { text: 'Entrega de material de apoio personalizado' },
      { text: 'Orientações sobre a dinâmica e objetivos do curso' },
    ],
  },
  {
    tag: 'Dia 2 — Quarta, 11/03',
    time: '08:00 às 12:00',
    title: 'Módulo I — O que é Relacionamento Governamental Estratégico na Prática',
    description: 'Fundamentos do RelGov no contexto municipal: compliance, stakeholders e narrativas de valor público.',
    topics: [
      { text: 'O que é RelGov no contexto municipal e por que importa agora' },
      { text: 'Princípios, limites legais e compliance (transparência, registro e accountability)' },
      { text: 'Leitura de cenário: agenda nacional/estadual/municipal, riscos, oportunidades e "janelas"' },
      { text: 'Mapa de stakeholders: quem decide, quem influencia, quem executa (governo, parlamento, controle, sociedade civil, setor privado)' },
      { text: 'Propósito público, narrativa de valor e alinhamento com o interesse coletivo' },
      { text: 'Ativismo corporativo responsável (quando, como e com quais salvaguardas)' },
      { text: 'Convergência de interesses: identificar "ganha-ganha" entre governo, sociedade e iniciativa privada' },
    ],
  },
  {
    tag: 'Dia 3 — Quinta, 12/03',
    time: '08:00 às 12:00',
    title: 'Módulo II — Estratégia Institucional e Governança da Captação',
    description: 'Papéis do Executivo e Legislativo, portfólio de projetos, calendário de janelas e documentos base.',
    topics: [
      { text: 'Papéis e competências: como Executivo e Legislativo se complementam na captação (PPA–LDO–LOA, plano de governo e agenda legislativa)' },
      { text: 'Portfólio de Projetos: diagnóstico, definição de prioridades, aderência ao PPA e aos programas federais, estimativa orçamentária e impacto' },
      { text: 'Calendário anual de janelas: prazos de LDO/LOA, emendas (municipais/estaduais/federais), programas de adesão e editais' },
      { text: 'Documentos base: plano de trabalho, estudo técnico preliminar, termo de referência, cronograma físico-financeiro, matriz lógica' },
    ],
  },
  {
    tag: 'Dia 4 — Sexta, 13/03',
    time: '08:00 às 12:00',
    title: 'Módulo III — Onde Estão os Recursos (além das emendas) & Como Acessá-los',
    description: 'Transferências, programas federais, emendas parlamentares, fontes alternativas e monitoramento de oportunidades.',
    topics: [
      { text: 'Transferências obrigatórias x voluntárias e o que cabe ao município em cada caso' },
      { text: 'Programas federais de adesão/convênios: uso do Transferegov.br (antiga Plataforma +Brasil) — cadastro, propostas, diligências, execução e prestação de contas' },
      { text: 'Novo PAC e programas setoriais (saúde/SUS, educação/FNDE/PAR, cidades/infra, cultura, esporte, turismo, desenvolvimento social, etc.): como identificar a linha certa e alinhar o projeto local' },
      { text: 'Emendas parlamentares (quando fizer sentido): individuais impositivas, bancada e comissão; transferências especiais (PIX) — regras, vedações, execução e prestação de contas local' },
      {
        text: 'Sem ser emenda (visão geral):',
        children: [
          'Editais de ministérios e secretarias nacionais (chamadas públicas)',
          'Fundos nacionais (Criança/Idoso/Cultura/Esporte etc.) e conselhos',
          'Bancos públicos (CAIXA, BNDES) e linhas para municípios',
          'Organismos internacionais (BID, CAF, ONU-agências) via cooperação',
          'Parcerias com OSCs (Lei 13.019/2014) quando ampliar capacidade de execução fizer sentido',
        ],
      },
      { text: 'Monitoramento de oportunidades: diários oficiais, portais, newsletters, painéis e alertas' },
    ],
  },
];

function DayBlock({ day, index }: { day: DayData; index: number }) {
  const [expanded, setExpanded] = useState(index <= 1);

  return (
    <div className="program-block rounded-3xl overflow-hidden bg-black/20 backdrop-blur-xl border border-white/[0.12] shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
      {/* Header - always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 md:p-8 gap-4 text-left cursor-pointer hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4 flex-wrap">
          <span className="section-tag !text-[12px] !py-1.5 !px-3">{day.tag}</span>
          <span className="flex items-center gap-1.5 text-white/40 text-xs font-medium">
            <Clock className="w-3.5 h-3.5" /> {day.time}
          </span>
        </div>
        <div className="flex items-center gap-3 flex-1 sm:ml-4">
          <h3 className="font-[var(--font-bricolage)] text-base md:text-lg font-bold text-white tracking-tight leading-snug flex-1">
            {day.title}
          </h3>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-[#28a745] shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 text-white/40 shrink-0" />
          )}
        </div>
      </button>

      {/* Content - collapsible */}
      {expanded && (
        <div className="border-t border-white/[0.06]">
          <div className="flex flex-col lg:flex-row">
            {/* Left - description */}
            <div className="lg:w-[35%] p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-white/[0.06]">
              <p className="text-white/50 text-sm leading-relaxed">{day.description}</p>
            </div>

            {/* Right - topics */}
            <div className="lg:w-[65%] p-6 md:p-8 flex flex-col gap-3">
              {day.topics.map((topic, j) => (
                <div key={j}>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#28a745] shrink-0 mt-0.5" />
                    <span className="text-white/80 text-sm font-medium leading-relaxed">{topic.text}</span>
                  </div>
                  {topic.children && (
                    <div className="ml-8 mt-2 flex flex-col gap-2 pl-4 border-l border-white/[0.08]">
                      {topic.children.map((child, k) => (
                        <div key={k} className="flex items-start gap-2">
                          <span className="text-[#28a745] text-xs mt-1">●</span>
                          <span className="text-white/60 text-[13px] leading-relaxed">{child}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Program() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.program-block', {
        scrollTrigger: { trigger: '.program-blocks', start: 'top 80%' },
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="programacao" className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden">
      {/* Grainient Background */}
      <div className="absolute inset-0 z-0">
        <Grainient
          color1="#031435"
          color2="#384870"
          color3="#001742"
          timeSpeed={0.35}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={1.4}
          warpSpeed={1.9}
          warpAmplitude={50}
          blendAngle={1}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={1.5}
          grainAmount={0.04}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1.3}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>
      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#28a745]/30 text-[#28a745] bg-transparent w-fit mb-5">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-wide">Conteúdo Programático</span>
            </div>
            <h2 className="font-[var(--font-bricolage)] text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.05]">
              Programação<br />
              <span className="text-[#28a745]">do Curso</span>
            </h2>
          </div>
          <p className="text-white text-base md:text-lg max-w-[440px] leading-relaxed">
            4 dias de imersão presencial em Brasília/DF. Carga horária total de 12 horas-aula. Encerramento na sexta-feira às 12h.
          </p>
        </div>

        {/* Blocks */}
        <div className="program-blocks flex flex-col gap-4">
          {days.map((day, i) => (
            <DayBlock key={i} day={day} index={i} />
          ))}
        </div>

        {/* Enrollment CTA below Program */}
        <div className="mt-16 text-center">
          <a
            href="https://materiais.plenumbrasil.com.br/presencial-df-relacionamento-governamental-e-captacao-de-recursos-marco-2026"
            target="_blank"
            rel="noopener"
            className="btn-primary inline-flex !text-lg !py-4 !px-10"
          >
            Garantir Minha Vaga <ArrowRight className="w-5 h-5 ml-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
