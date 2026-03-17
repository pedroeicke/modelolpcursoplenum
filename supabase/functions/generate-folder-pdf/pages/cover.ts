import { h, PAGE_W, PAGE_H, type PdfContext, type SatoriNode } from '../lib/types.ts';
import { getFontFamily } from '../lib/fonts.ts';
import type { FontData } from '../lib/types.ts';

/**
 * Cover page — replicates the website hero section.
 *
 * Layout (top → bottom, all centered):
 *   1. Company logo (text fallback)
 *   2. Category pill (e.g. "IMERSÃO") — white bg, blue text
 *   3. Title (large, bold) — accent parts in #3B82F6
 *   4. Subtitle
 *   5. 3 info badges (location, modality, date)
 *   6. Background: radial gradient matching hero section
 */
export function renderCover(ctx: PdfContext, fonts: FontData[]): SatoriNode {
  const { course, courseDate, ds, company } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);
  const body = getFontFamily(ds, 'body', fonts);

  const ACCENT = '#3B82F6';

  // ── Title parts ──
  const titleParts = course.title_parts && course.title_parts.length > 0
    ? course.title_parts
    : [{ text: course.title, color: 'white' as const }];

  // ── Date formatting ──
  const startDate = new Date(courseDate.start_date);
  const endDate = new Date(courseDate.end_date);
  const dateStr = courseDate.label || `${startDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })} a ${endDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`;

  // ── Resolve hero_badges with dynamic values ──
  const badges = (course.hero_badges || [])
    .filter((b: { label?: string; value?: string }) => b.label || b.value)
    .map((badge: { icon?: string; label: string; value: string }) => {
      let value = badge.value;
      if (value === 'dropdown') value = dateStr;
      if (value === 'location_dynamic') value = courseDate.location_venue || 'A definir';
      return { ...badge, value };
    });

  // ── Content elements ──
  const content: unknown[] = [];

  // 1. Logo text — top center
  content.push(
    h('div', {
      style: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: 80,
        fontSize: 28,
        fontFamily: heading,
        fontWeight: 700,
        color: '#ffffff',
        letterSpacing: 4,
      },
    }, company.company_name.toUpperCase()),
  );

  // Spacer
  content.push(h('div', { style: { flexGrow: 1, display: 'flex', minHeight: 80 } }));

  // 2. Category pill — white bg, blue text
  if (course.category_label) {
    content.push(
      h('div', {
        style: {
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 32,
        },
      },
        h('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 24,
            paddingRight: 24,
            paddingTop: 8,
            paddingBottom: 8,
            borderRadius: 50,
            backgroundColor: '#ffffff',
            fontSize: 14,
            fontFamily: body,
            fontWeight: 700,
            color: ACCENT,
            letterSpacing: 3,
            textTransform: 'uppercase',
          },
        }, course.category_label.toUpperCase()),
      ),
    );
  }

  // 3. Title — large, centered, multipart with accent color
  content.push(
    h('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 24,
        paddingLeft: 60,
        paddingRight: 60,
      },
    },
      h('div', {
        style: {
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          textAlign: 'center',
          lineHeight: 1.05,
        },
      },
        ...titleParts.map((part: { text: string; color: string }) =>
          h('span', {
            style: {
              fontSize: 72,
              fontFamily: heading,
              fontWeight: 700,
              color: part.color === 'accent' ? ACCENT : '#ffffff',
            },
          }, part.text),
        ),
      ),
    ),
  );

  // 4. Subtitle
  if (course.subtitle) {
    content.push(
      h('div', {
        style: {
          display: 'flex',
          justifyContent: 'center',
          fontSize: 22,
          fontFamily: body,
          fontWeight: 400,
          color: '#ffffff',
          textAlign: 'center',
          marginBottom: 48,
          paddingLeft: 80,
          paddingRight: 80,
          lineHeight: 1.5,
        },
      }, course.subtitle),
    );
  }

  // Spacer
  content.push(h('div', { style: { flexGrow: 1, display: 'flex', minHeight: 40 } }));

  // 5. Info badges row — glass-morphism style cards
  if (badges.length > 0) {
    content.push(
      h('div', {
        style: {
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          marginBottom: 80,
          paddingLeft: 40,
          paddingRight: 40,
        },
      },
        ...badges.map((badge: { label: string; value: string }) =>
          h('div', {
            style: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              maxWidth: 340,
              paddingTop: 20,
              paddingBottom: 20,
              paddingLeft: 24,
              paddingRight: 24,
              borderRadius: 16,
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
            },
          },
            badge.label
              ? h('span', {
                  style: {
                    fontSize: 11,
                    fontFamily: body,
                    fontWeight: 700,
                    color: ACCENT,
                    textTransform: 'uppercase',
                    letterSpacing: 1.5,
                    marginBottom: 6,
                  },
                }, badge.label.toUpperCase())
              : null,
            h('span', {
              style: {
                fontSize: 16,
                fontFamily: body,
                fontWeight: 700,
                color: '#ffffff',
                textAlign: 'center',
              },
            }, badge.value),
          ),
        ),
      ),
    );
  }

  // ── Page root with gradient background ──
  return h('div', {
    style: {
      display: 'flex',
      width: PAGE_W,
      height: PAGE_H,
      position: 'relative',
      overflow: 'hidden',
      // Hero-style radial gradient background
      background: 'radial-gradient(ellipse 90% 60% at 50% 85%, #062060, #010814)',
    },
  },
    // Subtle accent glow orb at center
    h('div', {
      style: {
        position: 'absolute',
        top: '30%',
        left: '25%',
        width: '50%',
        height: '40%',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
      },
    }),
    // Content column
    h('div', {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: PAGE_W,
        height: PAGE_H,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 2,
      },
    }, ...content),
  );
}
