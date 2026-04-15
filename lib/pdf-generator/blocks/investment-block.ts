import type { ContentBlock } from './types';
import { h, type PdfContext, type SatoriNode, getImageSrc } from '../types';
import { getFontFamily } from '../fonts';
import { getCheckIcon } from '../icons';
import type { FontData } from '../types';

/**
 * Block: Investment section — Canva reference style.
 *
 * "Garanta a sua vaga" heading + "Invista na sua capacitacao..." description.
 * Two-column layout:
 *   LEFT: "O QUE ESTA INCLUSO:" label + check items list
 *   RIGHT: product image (mochila ~200px wide)
 */
export function createInvestmentBlock(ctx: PdfContext, fonts: FontData[]): ContentBlock {
  const { course, ds } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);
  const body = getFontFamily(ds, 'body', fonts);
  const primary = ds.color_primary;

  const includedItems = course.included_items || [];

  // Investment needs breathing room — heading + desc + items + mochila
  const estimatedHeight = 120 + 50 + Math.max(includedItems.length * 46, 400) + 40;

  return {
    id: 'investment-block',
    estimatedHeight,
    background: 'dark',
    render(): SatoriNode {
      const productSrc = course.product_image_url
        ? getImageSrc(ctx.imageCache, course.product_image_url, ctx.siteBaseUrl)
        : '';

      return h('div', {
        style: { display: 'flex', flexDirection: 'column', width: '100%' },
      },
        // ── Heading ──
        h('span', {
          style: {
            fontSize: 40,
            fontFamily: heading,
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: 12,
          },
        }, course.investment_heading || 'Garanta a sua vaga'),

        // ── Description ──
        h('span', {
          style: {
            fontSize: 16,
            fontFamily: body,
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.55,
            marginBottom: 28,
          },
        }, course.investment_subtitle || 'Invista na sua capacita\u00e7\u00e3o profissional e garanta sua vaga nesta imers\u00e3o exclusiva.'),

        // ── Two-column: items (left) + product image (right) ──
        h('div', {
          style: { display: 'flex', flexDirection: 'row', width: '100%' },
        },
          // LEFT: Included items
          h('div', {
            style: {
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              marginRight: productSrc ? 28 : 0,
            },
          },
            // "O QUE ESTA INCLUSO:" label
            h('span', {
              style: {
                fontSize: 16,
                fontFamily: body,
                fontWeight: 700,
                color: primary,
                textTransform: 'uppercase',
                letterSpacing: 2.5,
                marginBottom: 18,
              },
            }, 'O que est\u00e1 incluso:'),

            // Check items list
            ...includedItems.map((item, idx) =>
              h('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: idx > 0 ? 12 : 0,
                },
              },
                h('div', {
                  style: { display: 'flex', flexShrink: 0, marginRight: 14 },
                }, getCheckIcon(22, primary)),
                h('span', {
                  style: {
                    fontSize: 18,
                    fontFamily: body,
                    color: 'rgba(255,255,255,0.85)',
                    lineHeight: 1.45,
                  },
                }, item.text),
              ),
            ),
          ),

          // RIGHT: Product image
          ...(productSrc
            ? [h('div', {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 480,
                  flexShrink: 0,
                },
              },
                h('img', {
                  src: productSrc,
                  width: 440,
                  height: 440,
                  style: { objectFit: 'contain' },
                }),
              )]
            : []),
        ),
      );
    },
  };
}
