import { h, type PdfContext, type SatoriNode, getImageSrc } from '../types';
import { getFontFamily } from '../fonts';
import type { FontData } from '../types';

export const PAGE_HEADER_HEIGHT = 80;

/**
 * Mini-header that repeats on top of every page (except cover).
 * Left: course title (compact)
 * Right: date + location
 * Adapts colors for dark/light backgrounds.
 */
export function renderPageHeader(ctx: PdfContext, fonts: FontData[], background: 'dark' | 'light' = 'dark'): SatoriNode {
  const { course, courseDate, ds } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);
  const body = getFontFamily(ds, 'body', fonts);
  const primary = ds.color_primary;

  const isLight = background === 'light';

  // Format date
  const startDate = new Date(courseDate.start_date);
  const endDate = new Date(courseDate.end_date);
  const dateStr = `${startDate.toLocaleDateString('pt-BR', { day: '2-digit' })} A ${endDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`.toUpperCase();
  const location = courseDate.location_venue?.includes('Belo Horizonte') ? 'BELO HORIZONTE - MG'
    : courseDate.location_venue?.includes('Brasília') || courseDate.location_address?.includes('Brasília') ? 'BRASÍLIA - DF'
    : (courseDate.location_venue || '').toUpperCase();

  // Colors based on background
  const titleColor = isLight ? '#1a1a1a' : '#ffffff';
  const dateColor = primary;
  const locationColor = isLight ? '#666666' : '#ffffff88';
  const borderColor = isLight ? `${primary}22` : `${primary}22`;
  const categoryColor = isLight ? primary : primary;

  return h('div', {
    style: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 20,
      paddingBottom: 14,
      borderBottom: `1px solid ${borderColor}`,
    },
  },
    // Left: category pill + course title
    h('div', {
      style: { display: 'flex', flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 20 },
    },
      course.category_label
        ? h('span', {
            style: {
              fontSize: 9,
              fontFamily: body,
              fontWeight: 700,
              color: isLight ? '#ffffff' : '#ffffff',
              backgroundColor: categoryColor,
              padding: '4px 12px',
              borderRadius: 4,
              textTransform: 'uppercase',
              letterSpacing: 2,
              marginRight: 14,
              flexShrink: 0,
            },
          }, course.category_label.toUpperCase())
        : null,
      h('span', {
        style: {
          fontSize: 13,
          fontFamily: heading,
          fontWeight: 700,
          color: titleColor,
          lineHeight: 1.2,
        },
      }, course.title.length > 60 ? course.title.substring(0, 57) + '...' : course.title),
    ),

    // Right: date + location
    h('div', {
      style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 },
    },
      h('span', {
        style: { fontSize: 10, fontFamily: body, fontWeight: 700, color: dateColor, letterSpacing: 1.5 },
      }, dateStr),
      h('span', {
        style: { fontSize: 10, fontFamily: body, fontWeight: 600, color: locationColor, letterSpacing: 1 },
      }, location),
    ),
  );
}
