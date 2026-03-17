import { h, PAGE_W, PAGE_H, PAD, type PdfContext, type SatoriNode } from '../types';
import { getFontFamily } from '../fonts';
import { getIcon } from '../icons';
import type { FontData } from '../types';

/**
 * Page 2 — Sobre o Curso + Público-Alvo (combined single page)
 *
 * Top: About section (heading + description + about_cards 3-col)
 * Bottom: Público-Alvo (heading + audience_cards 2x2) + info bar
 */
export function renderPresentation(ctx: PdfContext, fonts: FontData[]): SatoriNode {
  const { course, courseDate, ds } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);
  const body    = getFontFamily(ds, 'body', fonts);
  const primary = ds.color_primary;

  const title = course.about_heading || 'Sobre o Curso';
  const description = course.about_description || course.about_subheading || '';
  const aboutCards = course.about_cards || [];
  const audienceCards = course.audience_cards || [];

  // About cards: 3 per row
  const aboutRows: typeof aboutCards[] = [];
  for (let i = 0; i < aboutCards.length; i += 3) {
    aboutRows.push(aboutCards.slice(i, i + 3));
  }

  // Audience cards: 2 per row
  const audienceRows: typeof audienceCards[] = [];
  for (let i = 0; i < audienceCards.length; i += 2) {
    audienceRows.push(audienceCards.slice(i, i + 2));
  }

  // Date formatting
  const startDate = new Date(courseDate.start_date);
  const endDate   = new Date(courseDate.end_date);
  const dateStr   = `${startDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })} a ${endDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`;
  const totalHours = courseDate.program_days?.length ? `${courseDate.program_days.length * 4}h` : '20h';

  const hasAudience = audienceCards.length > 0;

  return h('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      width: PAGE_W,
      height: PAGE_H,
      backgroundColor: ds.color_background,
      padding: PAD,
    },
  },

    // ══════════════════════════════════════════════════════
    // ── SOBRE O CURSO ────────────────────────────────────
    // ══════════════════════════════════════════════════════

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

    // Title (centered, wraps to two lines)
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
          fontSize: hasAudience ? 44 : 56,
          fontFamily: heading,
          fontWeight: 800,
          color: '#ffffff',
          lineHeight: 1.1,
          textAlign: 'center',
        },
      }, title),
    ),

    // Accent underline (centered)
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

    // Description (centered)
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

    // About cards grid (3 per row)
    ...aboutRows.map((row) =>
      h('div', {
        style: { display: 'flex', marginBottom: 14 },
      },
        ...row.map((card, cardIdx) =>
          h('div', {
            style: {
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              padding: '20px 18px',
              borderRadius: 16,
              backgroundColor: `${ds.color_surface}44`,
              border: '1px solid rgba(255,255,255,0.08)',
              marginLeft: cardIdx > 0 ? 14 : 0,
            },
          },
            // Icon
            h('div', {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: primary,
                flexShrink: 0,
                marginBottom: 12,
              },
            }, getIcon(card.icon, 22, '#ffffff')),
            // Title
            h('span', {
              style: {
                fontSize: 16,
                fontFamily: heading,
                fontWeight: 700,
                color: '#ffffff',
                textTransform: 'uppercase',
                marginBottom: 6,
              },
            }, card.title),
            // Description
            h('span', {
              style: { fontSize: 13, fontFamily: body, color: '#ffffff88', lineHeight: 1.5 },
            }, card.description),
          ),
        ),
        // Fill empty slots
        ...(row.length < 3
          ? Array.from({ length: 3 - row.length }, (_, k) =>
              h('div', { style: { flex: 1, marginLeft: 14 } }),
            )
          : []),
      ),
    ),

    // ══════════════════════════════════════════════════════
    // ── PÚBLICO-ALVO ─────────────────────────────────────
    // ══════════════════════════════════════════════════════
    ...(hasAudience
      ? [
          // Divider spacing
          h('div', { style: { marginTop: 12, marginBottom: 14, display: 'flex', justifyContent: 'center', width: '100%' } },
            h('div', { style: { width: 48, height: 2, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 1 } }),
          ),

          // Breadcrumb
          h('div', {
            style: {
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              marginBottom: 6,
            },
          },
            h('span', {
              style: {
                fontSize: 14,
                fontFamily: body,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.35)',
                textTransform: 'uppercase',
                letterSpacing: 5,
              },
            }, 'Público-Alvo'),
          ),

          // Heading
          h('div', {
            style: {
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              marginBottom: 20,
            },
          },
            h('span', {
              style: {
                fontSize: 38,
                fontFamily: heading,
                fontWeight: 700,
                color: '#ffffff',
                textAlign: 'center',
                lineHeight: 1.1,
              },
            }, 'Para quem é esta imersão?'),
          ),

          // Audience cards (2x2 grid)
          ...audienceRows.map((row, rowIdx) =>
            h('div', {
              style: {
                display: 'flex',
                marginBottom: rowIdx < audienceRows.length - 1 ? 14 : 0,
              },
            },
              ...row.map((card, cardIdx) =>
                h('div', {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    padding: '20px 18px',
                    borderRadius: 16,
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    marginLeft: cardIdx > 0 ? 14 : 0,
                  },
                },
                  // Icon box (subtle, matching LP)
                  h('div', {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.10)',
                      flexShrink: 0,
                      marginBottom: 14,
                    },
                  }, getIcon(card.icon, 22, 'rgba(255,255,255,0.55)')),
                  // Title
                  h('span', {
                    style: {
                      fontSize: 17,
                      fontFamily: body,
                      fontWeight: 700,
                      color: 'rgba(255,255,255,0.85)',
                      lineHeight: 1.3,
                      marginBottom: 6,
                    },
                  }, card.title),
                  // Description
                  h('span', {
                    style: {
                      fontSize: 13,
                      fontFamily: body,
                      color: 'rgba(255,255,255,0.35)',
                      lineHeight: 1.5,
                    },
                  }, card.description),
                ),
              ),
              // Fill empty slots
              ...(row.length < 2
                ? [h('div', { style: { flex: 1, marginLeft: 14 } })]
                : []),
            ),
          ),
        ]
      : []),

    // ── Spacer ────────────────────────────────────────────
    h('div', { style: { flexGrow: 1, display: 'flex', minHeight: 8 } }),

    // ── Info bar ──────────────────────────────────────────
    h('div', {
      style: {
        display: 'flex',
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: `1px solid ${primary}22`,
        overflow: 'hidden',
      },
    },
      _infoPill('Carga Horária', totalHours, body),
      _infoPillDivider(primary),
      _infoPill('Local', courseDate.location_venue || 'A definir', body),
      _infoPillDivider(primary),
      _infoPill('Data', dateStr, body),
    ),
  );
}

function _infoPill(label: string, value: string, fontFamily: string): SatoriNode {
  return h('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      alignItems: 'center',
      padding: '16px 14px',
    },
  },
    h('span', { style: { fontSize: 12, fontFamily, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 5 } }, label),
    h('span', { style: { fontSize: 17, fontFamily, fontWeight: 700, color: 'rgba(255,255,255,0.85)', textAlign: 'center' } }, value),
  );
}

function _infoPillDivider(primary: string): SatoriNode {
  return h('div', {
    style: { width: 1, backgroundColor: `${primary}22`, alignSelf: 'stretch' },
  });
}
