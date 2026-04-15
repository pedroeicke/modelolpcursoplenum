import type { ContentBlock } from './types';
import { estimateCardGridHeight } from './height-utils';
import { h, type PdfContext, type SatoriNode } from '../types';
import { getFontFamily } from '../fonts';
import { getIcon } from '../icons';
import type { FontData } from '../types';

/**
 * Block: About cards grid (3 per row).
 * Each card has dark surface bg, rounded corners, icon box (primary bg) + title uppercase + description.
 */
export function createAboutCards(ctx: PdfContext, fonts: FontData[]): ContentBlock | null {
  const { course, ds } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);
  const body = getFontFamily(ds, 'body', fonts);
  const primary = ds.color_primary;

  const aboutCards = course.about_cards || [];
  if (aboutCards.length === 0) return null;

  // 3 per row, card ~150px, row gap 14
  const estimatedHeight = estimateCardGridHeight(aboutCards.length, 3, 150, 14);

  const rows: typeof aboutCards[] = [];
  for (let i = 0; i < aboutCards.length; i += 3) {
    rows.push(aboutCards.slice(i, i + 3));
  }

  return {
    id: 'about-cards',
    estimatedHeight,
    background: 'dark',
    render(): SatoriNode {
      return h('div', {
        style: { display: 'flex', flexDirection: 'column', width: '100%' },
      },
        ...rows.map((row, rowIdx) =>
          h('div', {
            style: { display: 'flex', marginBottom: rowIdx < rows.length - 1 ? 14 : 0 },
          },
            ...row.map((card, cardIdx) =>
              h('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  padding: '20px 18px',
                  borderRadius: 14,
                  backgroundColor: ds.color_surface,
                  border: '1px solid rgba(255,255,255,0.06)',
                  marginLeft: cardIdx > 0 ? 14 : 0,
                },
              },
                // Icon box with primary bg
                h('div', {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: primary,
                    flexShrink: 0,
                    marginBottom: 12,
                  },
                }, getIcon(card.icon, 22, '#ffffff')),
                // Title uppercase
                h('span', {
                  style: {
                    fontSize: 17,
                    fontFamily: heading,
                    fontWeight: 700,
                    color: '#ffffff',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    marginBottom: 8,
                  },
                }, card.title),
                // Description
                h('span', {
                  style: {
                    fontSize: 15,
                    fontFamily: body,
                    color: 'rgba(255,255,255,0.55)',
                    lineHeight: 1.55,
                  },
                }, card.description),
              ),
            ),
            // Fill empty slots
            ...(row.length < 3
              ? Array.from({ length: 3 - row.length }, (_, k) =>
                  h('div', { style: { flex: 1, marginLeft: 14 } }),
                )
              : []),
          ),
        ),
      );
    },
  };
}
