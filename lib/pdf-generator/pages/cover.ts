import { h, getImageSrc, PAGE_W, PAGE_H, type PdfContext, type SatoriNode } from '../types';
import { getFontFamily } from '../fonts';
import { getIcon } from '../icons';
import type { FontData } from '../types';

/**
 * Cover page — replicates the website hero section.
 *
 * Layout (top → bottom, all centered):
 *   1. Company logo
 *   2. Category pill (e.g. "IMERSÃO") — white bg, blue text
 *   3. Title (PP Radio Grotesk 800) — accent parts in #3B82F6
 *   4. Subtitle
 *   5. 3 info badges (location, modality, date)
 *   6. Background: frame01 from hero animation
 */
export function renderCover(ctx: PdfContext, fonts: FontData[]): SatoriNode {
  const { course, courseDate, ds, company } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);
  const body = getFontFamily(ds, 'body', fonts);

  // ── Dynamic colors from design system ──
  const ACCENT = ds.color_primary || '#3B82F6';
  const BG_BASE = ds.color_background || '#030D1F';

  // Parse BG_BASE hex to RGB for gradient rgba() stops
  const bgR = parseInt(BG_BASE.slice(1, 3), 16) || 0;
  const bgG = parseInt(BG_BASE.slice(3, 5), 16) || 0;
  const bgB = parseInt(BG_BASE.slice(5, 7), 16) || 0;

  // ── Resolve background image (frame01) ──
  const frame01Url = course.hero_frames_path
    ? `${course.hero_frames_path}0001${course.hero_frame_ext || '.jpg'}`
    : null;
  const bgSrc = getImageSrc(ctx.imageCache, frame01Url, ctx.siteBaseUrl);

  // ── Title parts (ensure each word is trimmed — spacing handled by flex gap) ──
  const titleParts = course.title_parts && course.title_parts.length > 0
    ? course.title_parts.map((p) => ({ ...p, text: p.text.trim() }))
    : [{ text: course.title, color: 'white' as const }];

  // ── Date formatting ──
  const startDate = new Date(courseDate.start_date);
  const endDate = new Date(courseDate.end_date);
  const dateStr = courseDate.label || `${startDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })} a ${endDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`;

  // ── Resolve hero_badges with dynamic values ──
  const badges = (course.hero_badges || [])
    .filter((b) => b.label || b.value)
    .map((badge) => {
      let value = badge.value;
      // Replace "dropdown" with turma label/date
      if (value === 'dropdown') {
        value = dateStr;
      }
      // Replace "location_dynamic" with actual venue
      if (value === 'location_dynamic') {
        value = courseDate.location_venue || 'A definir';
      }
      return { ...badge, value };
    });

  // ── Build page ──
  const children: unknown[] = [];

  // Background image (absolute positioned)
  if (bgSrc) {
    children.push(
      h('img', {
        src: bgSrc,
        width: PAGE_W,
        height: PAGE_H,
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: PAGE_W,
          height: PAGE_H,
          objectFit: 'cover',
          opacity: 0.35,
        },
      }),
    );
    // Gradient overlay: transparent top → ds.color_background bottom
    children.push(
      h('div', {
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: PAGE_W,
          height: PAGE_H,
          background: `linear-gradient(to bottom, rgba(${bgR},${bgG},${bgB},0) 0%, rgba(${bgR},${bgG},${bgB},0.4) 40%, rgba(${bgR},${bgG},${bgB},0.85) 70%, ${BG_BASE} 100%)`,
        },
      }),
    );
  }

  // ── Content container (over background) ──
  const content: unknown[] = [];

  // 1. Logo — top center
  const logoSrc = getImageSrc(ctx.imageCache, company.logo_url, ctx.siteBaseUrl);
  if (logoSrc) {
    content.push(
      h('img', {
        src: logoSrc,
        width: 260,
        height: 75,
        style: { objectFit: 'contain', alignSelf: 'center', marginTop: 60 },
      }),
    );
  } else {
    content.push(
      h('div', {
        style: {
          display: 'flex',
          justifyContent: 'center',
          marginTop: 60,
          fontSize: 32,
          fontFamily: heading,
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: 4,
        },
      }, company.company_name.toUpperCase()),
    );
  }

  // Spacer
  content.push(h('div', { style: { flexGrow: 1, display: 'flex', minHeight: 80 } }));

  // 2. Category pill — white bg, blue text (matching website: text-xs tracking-[0.2em])
  if (course.category_label) {
    content.push(
      h('div', {
        style: {
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 20,
        },
      },
        h('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 28,
            paddingRight: 28,
            paddingTop: 12,
            paddingBottom: 12,
            borderRadius: 50,
            backgroundColor: '#ffffff',
            fontSize: 17,
            fontFamily: body,
            fontWeight: 700,
            color: ACCENT,
            letterSpacing: 3.5,
            textTransform: 'uppercase',
          },
        }, course.category_label.toUpperCase()),
      ),
    );
  }

  // 3. Title — large, centered, multipart with accent color
  // Merge adjacent parts of the same color and add spaces between parts.
  // This gives natural word spacing instead of fixed marginRight.
  const titleSpans: unknown[] = titleParts.map((part, i) =>
    h('span', {
      style: {
        fontSize: 104,
        fontFamily: heading,
        fontWeight: 800,
        color: part.color === 'accent' ? ACCENT : '#ffffff',
      },
    }, (i > 0 ? ' ' : '') + part.text.trim()),
  );

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
          lineHeight: 1.15,
        },
      },
        ...titleSpans,
      ),
    ),
  );

  // 4. Subtitle (matching website: font-medium tracking-wide)
  if (course.subtitle) {
    content.push(
      h('div', {
        style: {
          display: 'flex',
          justifyContent: 'center',
          fontSize: 28,
          fontFamily: body,
          fontWeight: 500,
          color: '#ffffff',
          textAlign: 'center',
          marginBottom: 44,
          paddingLeft: 80,
          paddingRight: 80,
          lineHeight: 1.5,
          letterSpacing: 0.5,
        },
      }, course.subtitle),
    );
  }

  // 5. Info badges — single pill strip (right below subtitle)
  if (badges.length > 0) {
    const badgeItems: unknown[] = [];
    badges.forEach((badge, i) => {
      // Divider between badges
      if (i > 0) {
        badgeItems.push(
          h('div', {
            style: {
              width: 1,
              alignSelf: 'stretch',
              backgroundColor: 'rgba(255,255,255,0.08)',
            },
          }),
        );
      }
      // Badge content: icon circle + text column
      badgeItems.push(
        h('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            paddingLeft: 32,
            paddingRight: 32,
            paddingTop: 18,
            paddingBottom: 18,
          },
        },
          // Icon circle with SVG icon (matching LP hero badges)
          h('div', {
            style: {
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            },
          }, getIcon(badge.icon || '', 22, ACCENT)),
          // Text: label + value
          h('div', {
            style: {
              display: 'flex',
              flexDirection: 'column',
            },
          },
            badge.label
              ? h('span', {
                  style: {
                    fontSize: 14,
                    fontFamily: body,
                    fontWeight: 700,
                    color: ACCENT,
                    textTransform: 'uppercase',
                    letterSpacing: 2,
                    marginBottom: 4,
                  },
                }, badge.label.toUpperCase())
              : null,
            h('span', {
              style: {
                fontSize: 18,
                fontFamily: body,
                fontWeight: 700,
                color: '#ffffff',
              },
            }, badge.value),
          ),
        ),
      );
    });

    content.push(
      h('div', {
        style: {
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 0,
          paddingLeft: 40,
          paddingRight: 40,
        },
      },
        h('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            borderRadius: 999,
            backgroundColor: 'rgba(0,0,0,0.30)',
            border: '1px solid rgba(255,255,255,0.08)',
          },
        }, ...badgeItems),
      ),
    );
  }

  // Spacer bottom (larger than top to push content upward)
  content.push(h('div', { style: { flexGrow: 2, display: 'flex', minHeight: 230 } }));

  // Wrap content in a flex column over the background
  children.push(
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

  return h('div', {
    style: {
      display: 'flex',
      width: PAGE_W,
      height: PAGE_H,
      backgroundColor: ds.color_background,
      position: 'relative',
      overflow: 'hidden',
    },
  }, ...children);
}
