/**
 * Static configuration for PDF generation.
 * All assets hosted on Supabase Storage.
 */

const STORAGE_BASE = 'https://jyackmnjhsdllfqqxund.supabase.co/storage/v1/object/public/pdfs';

/**
 * Static promotional images used in the folder.
 */
export const STATIC_PDF_IMAGES = {
  /** 5 event photos — rendered as a mosaic grid */
  eventPhotos: [
    `${STORAGE_BASE}/folder-assets/Prancheta_13.png`,
    `${STORAGE_BASE}/folder-assets/Prancheta_14.png`,
    `${STORAGE_BASE}/folder-assets/Prancheta_15.png`,
    `${STORAGE_BASE}/folder-assets/Prancheta_16.png`,
    `${STORAGE_BASE}/folder-assets/Prancheta_17.png`,
  ] as string[],

  /** Kit Participante — mochila + materiais */
  kitParticipant: `${STORAGE_BASE}/folder-assets/KIT_PARTICIPANTE_LIVRO.png`,

  /** Plenum logo (white version for dark backgrounds) */
  logoUrl: `${STORAGE_BASE}/folder-assets/logo-plenum-aberta2.png`,

  /** Plenum logo white (very light, for subtle use) */
  logoWhite: `${STORAGE_BASE}/folder-assets/logplenumbranco.png`,

  /** Partner logos box (pre-composed image) */
  partnerLogosBox: `${STORAGE_BASE}/folder-assets/caixalogos.png`,

  /** Testimonial photos */
  testimonials: {
    anastasia: `${STORAGE_BASE}/folder-assets/anastasia.png`,
    zymler: `${STORAGE_BASE}/folder-assets/zymler.png`,
    velloso: `${STORAGE_BASE}/folder-assets/velloso.png`,
    jarbas: `${STORAGE_BASE}/folder-assets/jarbas.png`,
  },
} as const;

/**
 * Static testimonials data for the folder.
 */
export const TESTIMONIALS = [
  {
    name: 'Antonio Anastasia',
    role: 'Ministro do Tribunal de Contas da União',
    quote: 'Eu defendo, como professor que sou, a permanente capacitação nas mais diversas áreas. No momento em que o Instituto Plenum faz um evento como esse nós temos que aplaudir.',
    photo: STATIC_PDF_IMAGES.testimonials.anastasia,
  },
  {
    name: 'Benjamin Zymler',
    role: 'Ministro do Tribunal de Contas da União',
    quote: 'Capacitar gestores públicos não é um diferencial — é um requisito de governança. Em um ambiente de crescente complexidade normativa e de maior rigor no controle, a formação técnica contínua fortalece decisões, reduz riscos, melhora a qualidade do planejamento e protege a Administração Pública.',
    photo: STATIC_PDF_IMAGES.testimonials.zymler,
  },
  {
    name: 'Carlos Velloso',
    role: 'Ministro do TSE',
    quote: 'O Instituto ao promover a capacitação dos agentes públicos sobre o que pode e não pode fazer no período de eleição é de grande utilidade pública.',
    photo: STATIC_PDF_IMAGES.testimonials.velloso,
  },
  {
    name: 'Jarbas Soares',
    role: 'Ex Procurador-Geral de Justiça de Minas Gerais',
    quote: 'O gestor tem que se qualificar, preparar para gerir equipes competentes. O Instituto Plenum já adquiriu expertise e credibilidade.',
    photo: STATIC_PDF_IMAGES.testimonials.jarbas,
  },
];

/**
 * Payment data shown on the Investimento page.
 */
export const PAYMENT_INFO: { label: string; value: string }[] = [
  { label: 'Banco',    value: 'Banco do Brasil' },
  { label: 'Agência',  value: '' },
  { label: 'Conta',    value: '' },
  { label: 'CNPJ',     value: '' },
  { label: 'PIX',      value: '' },
];

/**
 * Cancellation policy text.
 */
export const CANCELLATION_POLICY =
  'O não comparecimento ao curso para o qual a inscrição tenha sido confirmada poderá acarretar a cobrança de 50% do valor da inscrição, a título de custeio de materiais, logística e reserva de vaga, salvo se houver solicitação formal de cancelamento em até 72 horas antes da data prevista para o início do curso.';
