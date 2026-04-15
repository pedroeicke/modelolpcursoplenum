import { PAGE_W, PAGE_H, PAD, h, type SatoriNode, type PdfContext } from './types';
import type { ContentBlock } from './blocks/types';
import type { DesignSystemData } from './types';
import { getFontFamily } from './fonts';
import type { FontData } from './types';
import { renderPageHeader, PAGE_HEADER_HEIGHT } from './blocks/page-header';

const PAGE_HEADER_AND_FOOTER = PAGE_HEADER_HEIGHT + 30;
const USABLE_H = PAGE_H - 2 * PAD - PAGE_HEADER_AND_FOOTER; // ~1524px for content
const MIN_GAP = 10;

interface PageSpec {
  blocks: ContentBlock[];
  totalBlockHeight: number;
  background: 'dark' | 'light';
}

/**
 * Pack content blocks into pages.
 * Fills each page as much as possible before starting a new one.
 * Never mixes dark/light backgrounds on the same page.
 * Respects stickyWithNext for orphan protection.
 */
export function packBlocksIntoPages(blocks: ContentBlock[]): PageSpec[] {
  if (blocks.length === 0) return [];

  const pages: PageSpec[] = [];
  let current: PageSpec = { blocks: [], totalBlockHeight: 0, background: blocks[0].background };

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const gapNeeded = current.blocks.length > 0 ? MIN_GAP : 0;

    // Background change forces new page
    if (current.blocks.length > 0 && block.background !== current.background) {
      pages.push(current);
      current = { blocks: [], totalBlockHeight: 0, background: block.background };
    }

    // Calculate needed height (include sticky next if applicable)
    let neededHeight = block.estimatedHeight + gapNeeded;
    if (block.stickyWithNext && i + 1 < blocks.length) {
      neededHeight += blocks[i + 1].estimatedHeight + MIN_GAP;
    }

    const fitsOnCurrent = current.totalBlockHeight + neededHeight <= USABLE_H;

    if (fitsOnCurrent) {
      current.blocks.push(block);
      current.totalBlockHeight += block.estimatedHeight + gapNeeded;
    } else {
      if (current.blocks.length > 0) {
        pages.push(current);
      }
      current = { blocks: [block], totalBlockHeight: block.estimatedHeight, background: block.background };
    }
  }

  if (current.blocks.length > 0) {
    pages.push(current);
  }

  return pages;
}

/**
 * Render a packed page with mini-header, blocks, and footer.
 */
export function renderPackedPage(
  page: PageSpec,
  ctx: PdfContext,
  fonts: FontData[],
): SatoriNode {
  const { ds, company } = ctx;
  const extraSpace = USABLE_H - page.totalBlockHeight;
  const blockCount = page.blocks.length;

  // Distribute extra space between blocks
  const gapsBetween = Math.max(1, blockCount - 1);
  const distributedGap = blockCount > 1
    ? Math.min(28, Math.max(MIN_GAP, Math.floor(extraSpace / gapsBetween)))
    : 0;

  const bgColor = page.background === 'light' ? '#ffffff' : ds.color_background;
  const body = getFontFamily(ds, 'body', fonts);

  const children: unknown[] = [];

  // ── Mini-header (category + title + date + location) ──
  children.push(renderPageHeader(ctx, fonts, page.background));

  // ── Content blocks ──
  page.blocks.forEach((block, i) => {
    if (i > 0) {
      children.push(
        h('div', { style: { height: distributedGap, display: 'flex', flexShrink: 0 } }),
      );
    }
    children.push(block.render());
  });

  // ── Push footer to bottom ──
  children.push(h('div', { style: { flexGrow: 1, display: 'flex', minHeight: 4 } }));

  // ── Page footer ──
  const companyName = company.company_name || 'Instituto Plenum Brasil';
  const footerColor = page.background === 'light' ? '#bbbbbb' : 'rgba(255,255,255,0.15)';
  const borderColor = page.background === 'light' ? '#e0e0e0' : 'rgba(255,255,255,0.06)';
  children.push(
    h('div', {
      style: {
        display: 'flex',
        justifyContent: 'flex-end',
        borderTop: `1px solid ${borderColor}`,
        paddingTop: 8,
      },
    },
      h('span', {
        style: { fontSize: 9, fontFamily: body, color: footerColor, textTransform: 'uppercase', letterSpacing: 2 },
      }, companyName),
    ),
  );

  return h('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      width: PAGE_W,
      height: PAGE_H,
      backgroundColor: bgColor,
      padding: PAD,
    },
  }, ...children);
}
