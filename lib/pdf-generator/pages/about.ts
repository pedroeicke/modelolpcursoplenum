import { h, PAGE_W, PAGE_H, PAD, type PdfContext, type SatoriNode } from '../types';
import { getFontFamily } from '../fonts';
import { getIcon } from '../icons';
import type { FontData } from '../types';

/**
 * Page 3 — Público-Alvo / Para quem é esta imersão?
 *
 * Matches LP TargetAudience section:
 *   - Centered breadcrumb + heading
 *   - 2x2 card grid with subtle icon boxes
 *   - Info bar at the bottom with course logistics
 */
export function renderAbout(ctx: PdfContext, fonts: FontData[]): SatoriNode {
  const { course, courseDate, ds } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);
  const body    = getFontFamily(ds, 'body', fonts);
  const primary = ds.color_primary;

  // ── Date formatting ──
  const startDate = new Date(courseDate.start_date);
  const endDate   = new Date(courseDate.end_date);
  const dateStr   = `${startDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })} a ${endDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`;
  const totalHours = courseDate.program_days?.length ? `${courseDate.program_days.length * 4}h` : '20h';

  const cards = course.audience_cards || [];

  // Build card rows: 2 per row (matching LP grid-cols-2 on mobile / grid-cols-4 but PDF is 2x2)
  const rows: typeof cards[] = [];
  for (let i = 0; i < cards.length; i += 2) {
    rows.push(cards.slice(i, i + 2));
  }

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

    // ── Breadcrumb label (centered, matching LP) ───────
    h('div', {
      style: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 14,
      },
    },
      h('span', {
        style: {
          fontSize: 12,
          fontFamily: body,
          fontWeight: 600,
          color: 'rgba(255,255,255,0.35)',
          textTransform: 'uppercase',
          letterSpacing: 4,
        },
      }, 'Público-Alvo'),
    ),

    // ── Heading (centered, matching LP) ────────────────
    h('div', {
      style: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 44,
      },
    },
      h('span', {
        style: {
          fontSize: 56,
          fontFamily: heading,
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.06,
        },
      }, 'Para quem é esta imersão?'),
    ),

    // ── Cards grid (2x2, matching LP) ──────────────────
    ...rows.map((row, rowIdx) =>
      h('div', {
        style: {
          display: 'flex',
          marginBottom: rowIdx < rows.length - 1 ? 20 : 36,
        },
      },
        ...row.map((card, cardIdx) =>
          h('div', {
            style: {
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              padding: '32px 28px',
              borderRadius: 16,
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.09)',
              marginLeft: cardIdx > 0 ? 20 : 0,
            },
          },
            // Icon box — subtle bg, matching LP (bg white/6%, border white/10%)
            h('div', {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 52,
                height: 52,
                borderRadius: 12,
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.10)',
                flexShrink: 0,
                marginBottom: 20,
              },
            }, getIcon(card.icon, 24, 'rgba(255,255,255,0.55)')),

            // Title — white/85% matching LP
            h('span', {
              style: {
                fontSize: 17,
                fontFamily: body,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.3,
                marginBottom: 8,
              },
            }, card.title),

            // Description — white/35% matching LP
            h('span', {
              style: {
                fontSize: 14,
                fontFamily: body,
                color: 'rgba(255,255,255,0.35)',
                lineHeight: 1.55,
              },
            }, card.description),
          ),
        ),
        // Fill empty slots if row has fewer than 2
        ...(row.length < 2
          ? [h('div', { style: { flex: 1, marginLeft: 20 } })]
          : []),
      ),
    ),

    // ── Spacer to push info bar to bottom ──────────────
    h('div', { style: { flexGrow: 1, display: 'flex', minHeight: 16 } }),

    // ── Info bar ───────────────────────────────────────
    h('div', {
      style: {
        display: 'flex',
        borderRadius: 16,
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
      padding: '20px 16px',
    },
  },
    h('span', { style: { fontSize: 11, fontFamily, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 } }, label),
    h('span', { style: { fontSize: 17, fontFamily, fontWeight: 700, color: 'rgba(255,255,255,0.85)', textAlign: 'center' } }, value),
  );
}

function _infoPillDivider(primary: string): SatoriNode {
  return h('div', {
    style: { width: 1, backgroundColor: `${primary}22`, alignSelf: 'stretch' },
  });
}
