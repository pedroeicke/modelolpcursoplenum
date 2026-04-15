import type { ContentBlock } from './types';
import { estimateTextHeight } from './height-utils';
import { h, type PdfContext, type SatoriNode } from '../types';
import { getFontFamily } from '../fonts';
import type { FontData } from '../types';

/**
 * Creates multiple blocks for General Info:
 * 1. Header block ("Informações Gerais" title) — sticky with first item
 * 2. Individual item blocks (each can flow to next page)
 */
export function createGeneralInfoBlocks(ctx: PdfContext, fonts: FontData[]): ContentBlock[] {
  const { course, ds } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);
  const body = getFontFamily(ds, 'body', fonts);
  const primary = ds.color_primary;

  const items = course.general_info_items || [];
  if (items.length === 0) return [];

  const blocks: ContentBlock[] = [];

  // Header block
  blocks.push({
    id: 'general-info-header',
    estimatedHeight: 100,
    background: 'dark',
    stickyWithNext: true,
    render(): SatoriNode {
      return h('div', {
        style: { display: 'flex', flexDirection: 'column', width: '100%' },
      },
        h('div', {
          style: { display: 'flex', fontSize: 13, fontFamily: body, color: `${primary}99`, textTransform: 'uppercase', letterSpacing: 4, marginBottom: 6 },
        }, 'Detalhes'),
        h('div', {
          style: { display: 'flex', fontSize: 36, fontFamily: heading, fontWeight: 800, color: '#ffffff', lineHeight: 1.15, marginBottom: 10 },
        }, 'Informa\u00e7\u00f5es Gerais'),
        h('div', {
          style: { width: 56, height: 4, backgroundColor: primary, borderRadius: 2 },
        }),
      );
    },
  });

  // Individual item blocks
  items.forEach((item, idx) => {
    const contentH = estimateTextHeight(item.content, 17, 1.6, 1020);
    const itemH = 40 + contentH + 20;

    blocks.push({
      id: `general-info-item-${idx}`,
      estimatedHeight: itemH,
      background: 'dark',
      render(): SatoriNode {
        return h('div', {
          style: {
            display: 'flex',
            flexDirection: 'column',
            padding: '18px 22px',
            borderRadius: 12,
            backgroundColor: `${ds.color_surface}66`,
            border: `1px solid ${primary}15`,
            width: '100%',
          },
        },
          h('span', {
            style: { fontSize: 18, fontFamily: heading, fontWeight: 700, color: '#ffffff', marginBottom: 10 },
          }, item.title),
          h('span', {
            style: { fontSize: 17, fontFamily: body, color: '#ffffffaa', lineHeight: 1.6 },
          }, item.content),
        );
      },
    });
  });

  return blocks;
}
