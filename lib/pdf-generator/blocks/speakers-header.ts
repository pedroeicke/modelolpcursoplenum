import type { ContentBlock } from './types';
import { h, type PdfContext, type SatoriNode } from '../types';
import { getFontFamily } from '../fonts';
import type { FontData } from '../types';

/**
 * Block: Speakers section header.
 * "PALESTRANTES" breadcrumb + "Palestrantes" large heading + underline + subtitle.
 * stickyWithNext so it stays with the first speaker card.
 */
export function createSpeakersHeader(ctx: PdfContext, fonts: FontData[]): ContentBlock {
  const { ds } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);
  const body = getFontFamily(ds, 'body', fonts);
  const primary = ds.color_primary;

  const estimatedHeight = 160;

  return {
    id: 'speakers-header',
    estimatedHeight,
    background: 'dark',
    stickyWithNext: true,
    render(): SatoriNode {
      return h('div', {
        style: { display: 'flex', flexDirection: 'column', width: '100%' },
      },
        // Breadcrumb
        h('div', {
          style: {
            display: 'flex',
            fontSize: 15,
            fontFamily: body,
            fontWeight: 600,
            color: `${primary}99`,
            textTransform: 'uppercase',
            letterSpacing: 5,
            marginBottom: 8,
          },
        }, 'Palestrantes'),

        // Title
        h('span', {
          style: {
            fontSize: 48,
            fontFamily: heading,
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: 10,
          },
        }, 'Palestrantes'),

        // Accent underline
        h('div', {
          style: {
            width: 56,
            height: 4,
            backgroundColor: primary,
            borderRadius: 2,
            marginBottom: 16,
          },
        }),

        // Sub-heading
        h('span', {
          style: {
            fontSize: 16,
            fontFamily: body,
            color: '#ffffffaa',
            marginBottom: 28,
          },
        }, 'Conhe\u00e7a os profissionais que conduzir\u00e3o o curso.'),
      );
    },
  };
}
