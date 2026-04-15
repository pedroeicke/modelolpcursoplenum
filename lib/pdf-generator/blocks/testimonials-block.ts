import type { ContentBlock } from './types';
import { h, type PdfContext, type SatoriNode, getImageSrc } from '../types';
import { getFontFamily } from '../fonts';
import { TESTIMONIALS, STATIC_PDF_IMAGES } from '../config';
import type { FontData } from '../types';

/**
 * Block: Testimonials (4 cards in ROW like Canva) + Partner logos.
 */
export function createTestimonialsBlock(ctx: PdfContext, fonts: FontData[]): ContentBlock {
  const { ds } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);
  const body = getFontFamily(ds, 'body', fonts);
  const primary = ds.color_primary;

  const partnerLogosSrc = getImageSrc(ctx.imageCache, STATIC_PDF_IMAGES.partnerLogosBox, ctx.siteBaseUrl)
    || STATIC_PDF_IMAGES.partnerLogosBox;

  return {
    id: 'testimonials-block',
    estimatedHeight: 900,
    background: 'dark',
    render(): SatoriNode {
      return h('div', {
        style: { display: 'flex', flexDirection: 'column', width: '100%' },
      },
        // Heading
        h('div', {
          style: { display: 'flex', justifyContent: 'center', width: '100%', marginBottom: 24 },
        },
          h('span', {
            style: {
              fontSize: 28, fontFamily: heading, fontWeight: 700,
              color: '#ffffff77', textAlign: 'center',
            },
          }, 'Veja quem já esteve aqui:'),
        ),

        // 4 cards in a ROW (like Canva reference)
        h('div', {
          style: { display: 'flex', flexDirection: 'row', marginBottom: 36 },
        },
          ...TESTIMONIALS.map((t, i) => {
            const photoSrc = getImageSrc(ctx.imageCache, t.photo, ctx.siteBaseUrl) || t.photo;
            return h('div', {
              style: {
                display: 'flex', flexDirection: 'column', flex: 1,
                padding: '18px 14px', borderRadius: 14,
                backgroundColor: ds.color_surface,
                border: `1px solid ${primary}22`,
                marginLeft: i > 0 ? 10 : 0,
              },
            },
              // Photo circular
              h('div', {
                style: { display: 'flex', justifyContent: 'center', marginBottom: 12 },
              },
                h('img', {
                  src: photoSrc,
                  width: 90,
                  height: 90,
                  style: { borderRadius: 45, objectFit: 'cover', border: `3px solid ${primary}44` },
                }),
              ),
              // Quote
              h('span', {
                style: {
                  fontSize: 14, fontFamily: body, color: '#ffffffbb',
                  lineHeight: 1.55, marginBottom: 14, textAlign: 'center',
                },
              }, `\u201C${t.quote}\u201D`),
              // Spacer to push name/role to bottom
              h('div', { style: { flexGrow: 1, display: 'flex', minHeight: 4 } }),
              // Name
              h('span', {
                style: {
                  fontSize: 16, fontFamily: heading, fontWeight: 700,
                  color: '#ffffff', textAlign: 'center', marginBottom: 4,
                },
              }, t.name),
              // Role
              h('span', {
                style: {
                  fontSize: 14, fontFamily: body, fontWeight: 700,
                  color: primary, textTransform: 'uppercase',
                  textAlign: 'center', letterSpacing: 1.5,
                },
              }, t.role),
            );
          }),
        ),

        // "Instituições" heading
        h('div', {
          style: { display: 'flex', justifyContent: 'center', width: '100%', marginBottom: 20 },
        },
          h('span', {
            style: {
              fontSize: 24, fontFamily: heading, fontWeight: 700,
              color: '#ffffff', textAlign: 'center',
            },
          }, 'Instituições que já se capacitaram conosco'),
        ),

        // Partner logos — FULL WIDTH white card, logos BIG
        h('div', {
          style: {
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            backgroundColor: '#ffffff', borderRadius: 16,
            padding: '28px 32px', width: '100%',
          },
        },
          h('img', {
            src: partnerLogosSrc,
            width: 1060,
            height: 120,
            style: { objectFit: 'contain' },
          }),
        ),
      );
    },
  };
}
