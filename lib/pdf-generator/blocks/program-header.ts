import type { ContentBlock } from './types';
import { h, type PdfContext, type SatoriNode } from '../types';
import { getFontFamily } from '../fonts';
import type { FontData } from '../types';

/**
 * Block: Program section header.
 * Just "PROGRAMACAO" in primary color with wide letter-spacing.
 * Light background. stickyWithNext so it stays with the first day.
 */
export function createProgramHeader(ctx: PdfContext, fonts: FontData[]): ContentBlock {
  const { ds } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);
  const primary = ds.color_primary;

  return {
    id: 'program-header',
    estimatedHeight: 50,
    background: 'light',
    stickyWithNext: true,
    render(): SatoriNode {
      return h('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        },
      },
        h('span', {
          style: {
            fontSize: 18,
            fontFamily: heading,
            fontWeight: 700,
            color: primary,
            textTransform: 'uppercase',
            letterSpacing: 10,
          },
        }, 'Programa\u00e7\u00e3o'),
      );
    },
  };
}
