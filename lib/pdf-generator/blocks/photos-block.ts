import type { ContentBlock } from './types';
import { h, PAGE_W, PAD, type PdfContext, type SatoriNode, getImageSrc } from '../types';
import { getFontFamily } from '../fonts';
import { STATIC_PDF_IMAGES } from '../config';
import type { FontData } from '../types';

/**
 * Block: "Somos referência..." heading + 5 event photos in 3+2 grid.
 */
export function createPhotosBlock(ctx: PdfContext, fonts: FontData[]): ContentBlock {
  const { ds } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);

  const photos = STATIC_PDF_IMAGES.eventPhotos.map(
    url => getImageSrc(ctx.imageCache, url, ctx.siteBaseUrl) || url,
  );

  const contentW = PAGE_W - 2 * PAD;
  const photoGap = 10;
  const row1W = Math.floor((contentW - 2 * photoGap) / 3);
  const row2W = Math.floor((contentW - photoGap) / 2);
  const row1H = 220;
  const row2H = 200;

  return {
    id: 'photos-block',
    estimatedHeight: 80 + row1H + photoGap + row2H,
    background: 'dark',
    render(): SatoriNode {
      return h('div', {
        style: { display: 'flex', flexDirection: 'column', width: '100%' },
      },
        // Heading
        h('div', {
          style: { display: 'flex', justifyContent: 'center', width: '100%', marginBottom: 28 },
        },
          h('span', {
            style: {
              fontSize: 26, fontFamily: heading, fontWeight: 700,
              color: '#ffffff', textAlign: 'center', lineHeight: 1.3,
            },
          }, 'Somos referência em capacitação e desenvolvimento de gestores públicos no país.'),
        ),

        // Row 1: 3 photos
        h('div', {
          style: { display: 'flex', flexDirection: 'row', width: '100%', marginBottom: photoGap },
        },
          ...photos.slice(0, 3).map((src, i) =>
            h('img', {
              src,
              width: row1W,
              height: row1H,
              style: { borderRadius: 12, objectFit: 'cover', marginLeft: i > 0 ? photoGap : 0 },
            }),
          ),
        ),

        // Row 2: 2 photos
        h('div', {
          style: { display: 'flex', flexDirection: 'row', width: '100%' },
        },
          ...photos.slice(3, 5).map((src, i) =>
            h('img', {
              src,
              width: row2W,
              height: row2H,
              style: { borderRadius: 12, objectFit: 'cover', marginLeft: i > 0 ? photoGap : 0 },
            }),
          ),
        ),
      );
    },
  };
}
