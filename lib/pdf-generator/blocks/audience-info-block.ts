import type { ContentBlock } from './types';
import { estimateListHeight } from './height-utils';
import { h, type PdfContext, type SatoriNode } from '../types';
import { getFontFamily } from '../fonts';
import { getIcon } from '../icons';
import type { FontData } from '../types';

/**
 * Block: Two-column layout with Audience list (left ~55%) + Info cards (right ~45%).
 *
 * Left side: "PUBLICO-ALVO" breadcrumb + "Para quem e esta imersao?" heading +
 *            vertical list of audience items (one per row, pill-style dark cards).
 *
 * Right side: Stacked info cards — Local, Data, Carga Horaria.
 *             Each card: icon circle (primary bg) + label + value in primary color.
 */
export function createAudienceInfoBlock(ctx: PdfContext, fonts: FontData[]): ContentBlock | null {
  const { course, courseDate, ds } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);
  const body = getFontFamily(ds, 'body', fonts);
  const primary = ds.color_primary;

  const audienceCards = course.audience_cards || [];
  // If no audience cards, still show info cards
  const hasAudience = audienceCards.length > 0;

  // Date formatting
  const startDate = new Date(courseDate.start_date);
  const endDate = new Date(courseDate.end_date);
  const dateStr = `${startDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })} a ${endDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`;
  const totalHours = courseDate.program_days?.length ? `${courseDate.program_days.length * 4}h` : '20h';

  // Height estimation
  const headerH = hasAudience ? 100 : 0; // breadcrumb + heading
  const audienceListH = hasAudience ? estimateListHeight(audienceCards.length, 52, 10) : 0;
  const infoCardsH = 3 * 70 + 2 * 12; // 3 cards * 70px + 2 gaps
  const estimatedHeight = headerH + Math.max(audienceListH, infoCardsH) + 20;

  return {
    id: 'audience-info-block',
    estimatedHeight,
    background: 'dark',
    render(): SatoriNode {
      // ── Info cards (right side) ──
      const infoCards = _buildInfoCards(
        courseDate.location_venue || 'A definir',
        courseDate.location_address || '',
        dateStr,
        totalHours,
        primary,
        ds.color_surface,
        body,
        heading,
      );

      // If no audience cards, render info cards full width
      if (!hasAudience) {
        return h('div', {
          style: { display: 'flex', flexDirection: 'column', width: '100%' },
        }, ...infoCards);
      }

      return h('div', {
        style: { display: 'flex', flexDirection: 'column', width: '100%' },
      },
        // ── Two-column row ──
        h('div', {
          style: { display: 'flex', flexDirection: 'row', width: '100%' },
        },
          // LEFT: Audience (55%)
          h('div', {
            style: {
              display: 'flex',
              flexDirection: 'column',
              width: '55%',
              marginRight: 24,
            },
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
            }, 'Publico-Alvo'),

            // Heading
            h('span', {
              style: {
                fontSize: 32,
                fontFamily: heading,
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.15,
                marginBottom: 20,
              },
            }, 'Para quem \u00e9 esta imers\u00e3o?'),

            // Audience items — vertical list, one per row
            ...audienceCards.map((card, idx) =>
              h('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '12px 18px',
                  borderRadius: 12,
                  backgroundColor: ds.color_surface,
                  border: '1px solid rgba(255,255,255,0.06)',
                  marginTop: idx > 0 ? 10 : 0,
                },
              },
                // Icon box
                h('div', {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: `${primary}20`,
                    border: `1px solid ${primary}30`,
                    flexShrink: 0,
                    marginRight: 14,
                  },
                }, getIcon(card.icon, 18, `${primary}cc`)),
                // Title
                h('span', {
                  style: {
                    fontSize: 15,
                    fontFamily: body,
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.85)',
                    lineHeight: 1.3,
                  },
                }, card.title),
              ),
            ),
          ),

          // RIGHT: Info cards (45%)
          h('div', {
            style: {
              display: 'flex',
              flexDirection: 'column',
              width: '45%',
            },
          }, ...infoCards),
        ),
      );
    },
  };
}

/**
 * Build stacked info cards: Local, Data, Carga Horaria.
 */
function _buildInfoCards(
  venue: string,
  address: string,
  dateStr: string,
  totalHours: string,
  primary: string,
  surface: string,
  body: string,
  heading: string,
): SatoriNode[] {
  const cards: { icon: string; label: string; value: string; secondary?: string }[] = [
    { icon: 'MapPin', label: 'Local:', value: venue, secondary: address },
    { icon: 'Calendar', label: 'Data:', value: dateStr },
    { icon: 'Clock', label: 'Carga Hor\u00e1ria:', value: totalHours },
  ];

  return cards.map((card, idx) =>
    h('div', {
      style: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '14px 18px',
        borderRadius: 14,
        backgroundColor: `${surface}88`,
        border: '1px solid rgba(255,255,255,0.06)',
        marginTop: idx > 0 ? 12 : 0,
      },
    },
      // Icon circle
      h('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: primary,
          flexShrink: 0,
          marginRight: 14,
        },
      }, getIcon(card.icon, 18, '#ffffff')),
      // Text column
      h('div', {
        style: { display: 'flex', flexDirection: 'column', flex: 1 },
      },
        h('span', {
          style: {
            fontSize: 14,
            fontFamily: body,
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            marginBottom: 3,
          },
        }, card.label),
        h('span', {
          style: {
            fontSize: 16,
            fontFamily: heading,
            fontWeight: 700,
            color: primary,
            lineHeight: 1.3,
          },
        }, card.value),
        ...(card.secondary
          ? [h('span', {
              style: {
                fontSize: 14,
                fontFamily: body,
                color: 'rgba(255,255,255,0.45)',
                lineHeight: 1.4,
                marginTop: 2,
              },
            }, card.secondary)]
          : []),
      ),
    ),
  );
}
