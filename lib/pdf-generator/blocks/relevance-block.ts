import type { ContentBlock } from './types';
import { estimateTextHeight } from './height-utils';
import { h, type PdfContext, type SatoriNode } from '../types';
import { getFontFamily } from '../fonts';
import type { FontData } from '../types';

/**
 * Block: Relevance section.
 * Heading "Por que esta capacitacao e relevante?" + paragraphs.
 * Dark background.
 */
export function createRelevanceBlock(ctx: PdfContext, fonts: FontData[]): ContentBlock | null {
  const { course, ds } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);
  const body = getFontFamily(ds, 'body', fonts);
  const primary = ds.color_primary;

  const paragraphs = course.relevance_paragraphs || [];
  if (paragraphs.length === 0) return null;

  const headingH = 60;
  const paragraphsH = paragraphs.reduce(
    (sum, p) => sum + estimateTextHeight(p, 16, 1.6) + 16,
    0,
  );
  const estimatedHeight = headingH + paragraphsH + 20;

  return {
    id: 'relevance-block',
    estimatedHeight,
    background: 'dark',
    render(): SatoriNode {
      return h('div', {
        style: { display: 'flex', flexDirection: 'column', width: '100%' },
      },
        // Breadcrumb
        h('div', {
          style: {
            display: 'flex',
            fontSize: 12,
            fontFamily: body,
            color: `${primary}99`,
            textTransform: 'uppercase',
            letterSpacing: 4,
            marginBottom: 6,
          },
        }, 'Relev\u00e2ncia'),

        // Heading
        h('div', {
          style: {
            display: 'flex',
            fontSize: 36,
            fontFamily: heading,
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.15,
            marginBottom: 10,
          },
        }, 'Por que esta capacita\u00e7\u00e3o \u00e9 relevante?'),

        // Accent underline
        h('div', {
          style: { width: 56, height: 4, backgroundColor: primary, borderRadius: 2, marginBottom: 24 },
        }),

        // Paragraphs
        ...paragraphs.map((text, idx) =>
          h('div', {
            style: {
              display: 'flex',
              fontSize: 16,
              fontFamily: body,
              color: '#ffffffbb',
              lineHeight: 1.6,
              marginBottom: idx < paragraphs.length - 1 ? 16 : 0,
            },
          }, text),
        ),
      );
    },
  };
}
