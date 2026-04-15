import type { ContentBlock } from './types';
import type { PdfContext, FontData } from '../types';

import { createSectionHeader } from './section-header';
import { createAboutCards } from './about-cards';
import { createAudienceInfoBlock } from './audience-info-block';
import { createProgramHeader } from './program-header';
import { createProgramDayBlocks } from './program-day';
import { createSpeakersHeader } from './speakers-header';
import { createSpeakerBlock } from './speaker-block';
import { createInvestmentBlock } from './investment-block';
import { createContactBlock } from './contact-block';
import { createClosingFooter } from './closing-footer';
import { createRelevanceBlock } from './relevance-block';
import { createGeneralInfoBlocks } from './general-info-block';
import { createPhotosBlock } from './photos-block';
import { createTestimonialsBlock } from './testimonials-block';

/**
 * Build all content blocks for a course PDF in the correct order.
 * Skips sections that have no data.
 */
export function buildContentBlocks(ctx: PdfContext, fonts: FontData[]): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const { courseDate, instructors } = ctx;

  // ── Sobre o Curso ──────────────────────────────────────
  blocks.push(createSectionHeader(ctx, fonts));

  const aboutCards = createAboutCards(ctx, fonts);
  if (aboutCards) blocks.push(aboutCards);

  // ── Publico-Alvo + Info (two-column block) ─────────────
  const audienceInfo = createAudienceInfoBlock(ctx, fonts);
  if (audienceInfo) blocks.push(audienceInfo);

  // ── Relevancia ─────────────────────────────────────────
  const relevance = createRelevanceBlock(ctx, fonts);
  if (relevance) blocks.push(relevance);

  // ── Informacoes Gerais ─────────────────────────────────
  const generalInfoBlocks = createGeneralInfoBlocks(ctx, fonts);
  blocks.push(...generalInfoBlocks);

  // ── Programacao ────────────────────────────────────────
  const days = courseDate.program_days || [];
  if (days.length > 0) {
    blocks.push(createProgramHeader(ctx, fonts));
    days.forEach((day, idx) => {
      const dayBlocks = createProgramDayBlocks(day, idx, ctx, fonts);
      blocks.push(...dayBlocks);
    });
  }

  // ── Palestrantes ───────────────────────────────────────
  if (instructors.length > 0) {
    blocks.push(createSpeakersHeader(ctx, fonts));
    instructors.forEach((inst) => {
      blocks.push(createSpeakerBlock(inst, ctx, fonts));
    });
  }

  // ── Fotos do Evento ─────────────────────────────────────
  blocks.push(createPhotosBlock(ctx, fonts));

  // ── Investimento ───────────────────────────────────────
  blocks.push(createInvestmentBlock(ctx, fonts));

  // ── Depoimentos + Parceiros ────────────────────────────
  blocks.push(createTestimonialsBlock(ctx, fonts));

  // ── Contato + Footer ───────────────────────────────────
  blocks.push(createContactBlock(ctx, fonts));
  blocks.push(createClosingFooter(ctx, fonts));

  return blocks;
}

// Re-export types and individual factories for external use
export type { ContentBlock } from './types';
export { createSectionHeader } from './section-header';
export { createAboutCards } from './about-cards';
export { createAudienceInfoBlock } from './audience-info-block';
export { createProgramHeader } from './program-header';
export { createProgramDayBlocks } from './program-day';
export { createSpeakersHeader } from './speakers-header';
export { createSpeakerBlock } from './speaker-block';
export { createInvestmentBlock } from './investment-block';
export { createContactBlock } from './contact-block';
export { createClosingFooter } from './closing-footer';
export { createRelevanceBlock } from './relevance-block';
export { createGeneralInfoBlocks } from './general-info-block';
