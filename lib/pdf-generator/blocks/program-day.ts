import type { ContentBlock } from './types';
import { estimateTextHeight } from './height-utils';
import { h, type PdfContext, type SatoriNode, type ProgramDay } from '../types';
import { getFontFamily } from '../fonts';
import { getIcon } from '../icons';
import type { FontData } from '../types';

/**
 * Creates blocks for a single program day — matching Canva reference.
 *
 * Day header: pill badge (primary bg, white text "Dia X - DayName, DD/MM") +
 *             clock icon + time next to it. Title large black. Description gray.
 *             Blue accent bar.
 *
 * Topics: each in a DARK CARD (bg #1a2332, rounded 10px, padding 14px 18px,
 *         text white ~14px). Cards stacked with ~8px gap.
 *         NO check circles, NO bullets — just dark rounded cards with text.
 */
export function createProgramDayBlocks(
  day: ProgramDay,
  dayIndex: number,
  ctx: PdfContext,
  fonts: FontData[],
): ContentBlock[] {
  const { ds } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);
  const body = getFontFamily(ds, 'body', fonts);
  const primary = ds.color_primary;

  const blocks: ContentBlock[] = [];

  // Parse tag: "Dia 1 - Terca, 15/09"
  const dayLabel = day.tag || `Dia ${dayIndex + 1}`;

  // ── Day header block ──
  const titleH = estimateTextHeight(day.title || '', 28, 1.2, 1050);
  const descH = day.description ? estimateTextHeight(day.description, 16, 1.5, 1050) + 12 : 0;
  const headerH = 50 + titleH + descH + 30; // badge row + title + desc + accent bar + margin

  blocks.push({
    id: `program-day-${dayIndex}-header`,
    estimatedHeight: headerH,
    background: 'light',
    stickyWithNext: day.topics.length > 0,
    render(): SatoriNode {
      return h('div', {
        style: { display: 'flex', flexDirection: 'column', width: '100%', marginTop: dayIndex > 0 ? 28 : 0 },
      },

        // ── Row: Badge pill + Clock + Time ──
        h('div', {
          style: { display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
        },
          // Badge pill
          h('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              padding: '6px 16px',
              borderRadius: 20,
              backgroundColor: primary,
            },
          },
            h('span', {
              style: {
                fontSize: 15,
                fontFamily: body,
                fontWeight: 600,
                color: '#ffffff',
                letterSpacing: 1.5,
              },
            }, dayLabel),
          ),

          // Clock icon + time
          ...(day.time
            ? [
                h('div', {
                  style: { display: 'flex', alignItems: 'center', marginLeft: 14 },
                },
                  getIcon('Clock', 16, '#999999'),
                ),
                h('span', {
                  style: {
                    fontSize: 15,
                    fontFamily: body,
                    fontWeight: 500,
                    color: '#999999',
                    marginLeft: 6,
                  },
                }, day.time),
              ]
            : []),
        ),

        // ── Title ──
        h('span', {
          style: {
            fontSize: 28,
            fontFamily: heading,
            fontWeight: 700,
            color: '#1a1a1a',
            lineHeight: 1.2,
            marginBottom: day.description ? 8 : 12,
          },
        }, day.title || ''),

        // ── Description (if exists) ──
        ...(day.description
          ? [h('span', {
              style: {
                fontSize: 16,
                fontFamily: body,
                color: '#777777',
                lineHeight: 1.5,
                marginBottom: 12,
              },
            }, day.description)]
          : []),

        // ── Accent bar ──
        h('div', {
          style: {
            width: 44,
            height: 4,
            backgroundColor: ds.color_accent || primary,
            borderRadius: 2,
            marginBottom: 4,
          },
        }),
      );
    },
  });

  // ── Individual topic blocks — DARK CARDS ──
  day.topics.forEach((topic, topicIdx) => {
    // Main text + children text
    const mainTextH = estimateTextHeight(topic.text, 14, 1.55, 1040);
    const childrenH = (topic.children || []).reduce(
      (sum, child) => sum + estimateTextHeight(child, 13, 1.45, 1000) + 6,
      0,
    );
    const topicH = 28 + mainTextH + childrenH + 8; // padding + text + children + gap

    blocks.push({
      id: `program-day-${dayIndex}-topic-${topicIdx}`,
      estimatedHeight: topicH,
      background: 'light',
      render(): SatoriNode {
        return h('div', {
          style: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            padding: '14px 18px',
            borderRadius: 10,
            backgroundColor: '#1a2332',
            marginTop: topicIdx === 0 ? 8 : 8,
          },
        },
          // Main topic text
          h('span', {
            style: {
               fontSize: 17,
              fontFamily: body,
              fontWeight: 500,
              color: '#ffffff',
              lineHeight: 1.55,
            },
          }, topic.text),

          // Children as sub-items (slightly indented, smaller, lighter)
          ...(topic.children || []).map((child) =>
            h('span', {
              style: {
                fontSize: 15,
                fontFamily: body,
                color: 'rgba(255,255,255,0.65)',
                lineHeight: 1.5,
                marginTop: 6,
                marginLeft: 16,
              },
            }, `\u2022 ${child}`),
          ),
        );
      },
    });
  });

  return blocks;
}

export const createProgramDay = createProgramDayBlocks;
