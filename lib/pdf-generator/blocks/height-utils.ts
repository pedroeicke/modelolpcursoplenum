import { PAGE_W, PAD } from '../types';

const USABLE_WIDTH = PAGE_W - 2 * PAD; // 1120px

/**
 * Estimate text height based on character count and font metrics.
 * Over-estimates by ~10% as safety margin.
 */
export function estimateTextHeight(
  text: string,
  fontSize: number,
  lineHeight: number,
  maxWidth: number = USABLE_WIDTH,
): number {
  if (!text) return 0;
  const avgCharWidth = fontSize * 0.52;
  const charsPerLine = Math.floor(maxWidth / avgCharWidth);
  const lineCount = Math.ceil(text.length / Math.max(charsPerLine, 1));
  return Math.ceil(lineCount * fontSize * lineHeight * 1.1);
}

/**
 * Estimate height of a card grid layout.
 */
export function estimateCardGridHeight(
  cardCount: number,
  cardsPerRow: number,
  cardHeight: number,
  rowGap: number,
): number {
  if (cardCount === 0) return 0;
  const rows = Math.ceil(cardCount / cardsPerRow);
  return rows * cardHeight + Math.max(0, rows - 1) * rowGap;
}

/**
 * Estimate height of a list of text items with icons.
 */
export function estimateListHeight(
  itemCount: number,
  itemHeight: number,
  gap: number,
): number {
  if (itemCount === 0) return 0;
  return itemCount * itemHeight + Math.max(0, itemCount - 1) * gap;
}

/**
 * Estimate program day height based on topic count and text content.
 */
export function estimateProgramDayHeight(
  topicCount: number,
  hasDescription: boolean,
  avgChildrenPerTopic: number = 2,
  titleLength: number = 40,
  descriptionLength: number = 0,
): number {
  // Title can wrap to 2-3 lines for long module names (64px font)
  const titleLines = Math.ceil(titleLength / 30); // ~30 chars per line at 64px
  const headerH = 50 + titleLines * 70; // badge row + title lines
  const descH = hasDescription ? estimateTextHeight(
    'x'.repeat(descriptionLength || 80), 17, 1.55
  ) + 20 : 0;
  const accentLineH = 24;
  // Each topic: card padding (22+22) + text (~50px) + children
  const topicH = topicCount * (55 + avgChildrenPerTopic * 32);
  return headerH + descH + accentLineH + topicH + 30; // +30 margin
}
