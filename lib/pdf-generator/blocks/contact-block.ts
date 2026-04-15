import type { ContentBlock } from './types';
import { h, type PdfContext, type SatoriNode } from '../types';
import { getFontFamily } from '../fonts';
import { getIcon } from '../icons';
import type { FontData } from '../types';

/**
 * Block: "Entre em Contato" card.
 * Phones, emails, website, address in a two-column layout.
 */
export function createContactBlock(ctx: PdfContext, fonts: FontData[]): ContentBlock {
  const { company, ds } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);
  const body = getFontFamily(ds, 'body', fonts);
  const primary = ds.color_primary;

  const estimatedHeight = 200;

  return {
    id: 'contact-block',
    estimatedHeight,
    background: 'dark',
    render(): SatoriNode {
      return h('div', {
        style: {
          display: 'flex',
          flexDirection: 'column',
          padding: '28px 32px',
          borderRadius: 16,
          backgroundColor: `${ds.color_surface}cc`,
          border: `1px solid ${primary}33`,
          width: '100%',
        },
      },
        h('span', {
          style: { fontSize: 22, fontFamily: heading, fontWeight: 700, color: '#ffffff', marginBottom: 20 },
        }, 'Entre em Contato'),

        h('div', {
          style: { display: 'flex', flexDirection: 'row' },
        },
          // Left: phones + emails
          h('div', {
            style: { display: 'flex', flexDirection: 'column', flex: 1 },
          },
            ...(company.phones || []).map((p, idx) =>
              h('div', {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: idx > 0 ? 13 : 0,
                },
              },
                h('div', { style: { display: 'flex', marginRight: 12 } },
                  getIcon('Phone', 18, primary),
                ),
                h('span', { style: { fontSize: 16, fontFamily: body, color: '#ffffffdd' } },
                  `${p.label}: ${p.number}`),
              ),
            ),
            ...(company.emails || []).map((e, idx) =>
              h('div', {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: 13,
                },
              },
                h('div', { style: { display: 'flex', marginRight: 12 } },
                  getIcon('Mail', 18, primary),
                ),
                h('span', { style: { fontSize: 16, fontFamily: body, color: '#ffffffdd' } }, e.email),
              ),
            ),
          ),

          // Right: website + address
          h('div', {
            style: { display: 'flex', flexDirection: 'column', flex: 1, marginLeft: 48 },
          },
            company.website
              ? h('div', {
                  style: { display: 'flex', alignItems: 'center' },
                },
                  h('div', { style: { display: 'flex', marginRight: 12 } },
                    getIcon('Globe', 18, primary),
                  ),
                  h('span', { style: { fontSize: 16, fontFamily: body, color: '#ffffffdd' } }, company.website),
                )
              : null,
            company.address
              ? h('div', {
                  style: {
                    display: 'flex',
                    alignItems: 'flex-start',
                    marginTop: 13,
                  },
                },
                  h('div', { style: { display: 'flex', flexShrink: 0, marginTop: 1, marginRight: 12 } },
                    getIcon('MapPin', 18, primary),
                  ),
                  h('span', {
                    style: { fontSize: 16, fontFamily: body, color: '#ffffffdd', lineHeight: 1.5 },
                  }, company.address),
                )
              : null,
          ),
        ),
      );
    },
  };
}
