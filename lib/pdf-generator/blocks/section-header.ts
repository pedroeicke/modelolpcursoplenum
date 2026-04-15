import type { ContentBlock } from './types';
import { estimateTextHeight } from './height-utils';
import { h, type PdfContext, type SatoriNode } from '../types';
import { getFontFamily } from '../fonts';
import type { FontData } from '../types';

/**
 * Block: Sobre o Curso section header.
 * Breadcrumb "Sobre o Curso" + title + underline + description.
 */
export function createSectionHeader(ctx: PdfContext, fonts: FontData[]): ContentBlock {
  const { course, ds } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);
  const body = getFontFamily(ds, 'body', fonts);
  const primary = ds.color_primary;

  const title = course.about_heading || 'Sobre o Curso';
  const description = course.about_description || course.about_subheading || '';

  const titleH = estimateTextHeight(title, 44, 1.1);
  const descH = description ? estimateTextHeight(description, 17, 1.55) + 20 : 0;
  const estimatedHeight = 30 + titleH + 20 + descH + 18;

  return {
    id: 'section-header',
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
            justifyContent: 'center',
            width: '100%',
            fontSize: 14,
            fontFamily: body,
            color: `${primary}99`,
            textTransform: 'uppercase',
            letterSpacing: 5,
            marginBottom: 8,
          },
        }, 'Sobre o Curso'),

        // Title
        h('div', {
          style: {
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            marginBottom: 10,
          },
        },
          h('span', {
            style: {
              fontSize: 44,
              fontFamily: heading,
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.1,
              textAlign: 'center',
            },
          }, title),
        ),

        // Accent underline
        h('div', {
          style: {
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            marginBottom: description ? 12 : 18,
          },
        },
          h('div', { style: { width: 56, height: 4, backgroundColor: primary, borderRadius: 2 } }),
        ),

        // Description
        ...(description
          ? [h('div', {
              style: {
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                marginBottom: 20,
              },
            },
              h('span', {
                style: {
                  fontSize: 17,
                  fontFamily: body,
                  color: '#ffffffaa',
                  lineHeight: 1.55,
                  textAlign: 'center',
                },
              }, description),
            )]
          : []),
      );
    },
  };
}
