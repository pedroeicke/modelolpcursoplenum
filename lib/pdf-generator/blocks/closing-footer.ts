import type { ContentBlock } from './types';
import { h, getImageSrc, type PdfContext, type SatoriNode } from '../types';
import { getFontFamily } from '../fonts';
import { STATIC_PDF_IMAGES } from '../config';
import type { FontData } from '../types';

/**
 * Block: Closing footer with company logo + "Ate breve!" + website.
 */
export function createClosingFooter(ctx: PdfContext, fonts: FontData[]): ContentBlock {
  const { company, ds } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);
  const body = getFontFamily(ds, 'body', fonts);
  const primary = ds.color_primary;

  const estimatedHeight = 150;

  return {
    id: 'closing-footer',
    estimatedHeight,
    background: 'dark',
    render(): SatoriNode {
      const logoSrc =
        getImageSrc(ctx.imageCache, company.logo_url, ctx.siteBaseUrl) ??
        getImageSrc(ctx.imageCache, STATIC_PDF_IMAGES.logoUrl, ctx.siteBaseUrl);

      return h('div', {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 24,
          borderTop: `1px solid ${primary}22`,
          width: '100%',
        },
      },
        // Logo
        logoSrc
          ? h('img', {
              src: logoSrc,
              width: 220,
              height: 64,
              style: { objectFit: 'contain', marginBottom: 12 },
            })
          : h('span', {
              style: { fontSize: 28, fontFamily: heading, fontWeight: 700, color: '#ffffff', marginBottom: 12 },
            }, company.company_name),

        h('span', {
          style: { fontSize: 18, fontFamily: body, color: '#ffffffaa', letterSpacing: 4, marginBottom: 12 },
        }, 'At\u00e9 breve!'),

        company.website
          ? h('span', {
              style: { fontSize: 12, fontFamily: body, color: '#ffffff44', letterSpacing: 2 },
            }, company.website)
          : null,
      );
    },
  };
}
