/**
 * HTML/CSS PDF Renderer using Puppeteer.
 * Generates a complete, self-contained HTML document styled with the design system,
 * then rendered to PDF via headless Chrome.
 *
 * Matches the Canva reference folder design EXACTLY:
 * - A4 pages (210x297mm / 595x842pt)
 * - Dark/light page backgrounds
 * - @font-face for heading fonts (PPRadioGrotesk, Bricolage Grotesque)
 * - Full CSS: flexbox, grid, gradients, @page, page-break-after
 * - -webkit-print-color-adjust: exact for background printing
 */

import type { PdfContext, FontData } from './types';
import { getImageSrc } from './types';
import { getFontFamily } from './fonts';
import { STATIC_PDF_IMAGES, TESTIMONIALS } from './config';

// ─── SVG Icon Paths (inline for self-contained HTML) ───────
const SVG_ICONS: Record<string, string> = {
  Check: 'M20 6 9 17l-5-5',
  MapPin: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  Calendar: 'M16 2v4 M8 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  Clock: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 6v6l4 2',
  Users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  Phone: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z',
  Mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
  Globe: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  Target: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
  Award: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  Briefcase: 'M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16 M2 10a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z',
  GraduationCap: 'M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c0 2 2.69 3 6 3s6-1 6-3v-5',
  BookOpen: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
  Shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  ShieldCheck: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4',
  Eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  Lightbulb: 'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5 M9 18h6 M10 22h4',
  Star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z',
  Scale: 'M16 16l3-8 3 8a5.3 5.3 0 0 1-6 0z M2 16l3-8 3 8a5.3 5.3 0 0 1-6 0z M7 21h10 M12 3v18 M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2',
  FileText: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  Landmark: 'M3 22h18 M6 18v-7 M10 18v-7 M14 18v-7 M18 18v-7 M12 2l9 7H3z',
  Zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  Heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  User: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  Handshake: 'M11 17a4 4 0 0 0 8 0c0-2-2-2-2-2H9s-2 0-2 2a4 4 0 0 0 4 4 M2 7l4.41-2.58a3 3 0 0 1 3.18 0L12 6l2.41-1.58a3 3 0 0 1 3.18 0L22 7',
  TrendingUp: 'M22 7l-8.5 8.5-5-5L2 17 M16 7h6v6',
  Building2: 'M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2 M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2 M10 6h4 M10 10h4 M10 14h4 M10 18h4',
};

function svgIcon(name: string, size: number, color: string): string {
  const pathData = SVG_ICONS[name];
  if (!pathData) return `<span style="display:inline-block;width:${size}px;height:${size}px;"></span>`;
  const paths = pathData.split(/(?= M)/).map(d => d.trim());
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths.map(d => `<path d="${d}"/>`).join('')}</svg>`;
}

function checkSvg(size: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;
}

function esc(str: string | null | undefined): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ─── Main Export ────────────────────────────────────────────

export function generateFolderHTML(ctx: PdfContext, fonts: FontData[]): string {
  const { course, courseDate, instructors, ds, company } = ctx;
  const headingFont = getFontFamily(ds, 'heading', fonts);
  const bodyFont = getFontFamily(ds, 'body', fonts);
  const primary = ds.color_primary;
  const bg = ds.color_background;
  const surface = ds.color_surface;
  const bgDeep = (ds as any).color_background_deep || bg;
  const gradMid = ds.color_hero_gradient_mid || primary;

  // ── Resolve images ──
  const _img = (url: string | null | undefined) => getImageSrc(ctx.imageCache, url, ctx.siteBaseUrl);
  const logoSrc = _img(company.logo_url) || _img(company.logo_dark_url) || '';
  const plenumLogoSrc = _img(STATIC_PDF_IMAGES.logoUrl) || _img(STATIC_PDF_IMAGES.logoWhite) || logoSrc;
  const frameSrc = course.hero_frames_path
    ? _img(`${course.hero_frames_path}0001${course.hero_frame_ext || '.jpg'}`) || ''
    : '';
  const productSrc = _img(course.product_image_url) || '';
  const partnerLogosSrc = _img(STATIC_PDF_IMAGES.partnerLogosBox) || '';
  const eventPhotos = STATIC_PDF_IMAGES.eventPhotos.map(url => _img(url) || url);
  const kitSrc = _img(STATIC_PDF_IMAGES.kitParticipant) || '';

  // ── Data ──
  const aboutCards = course.about_cards || [];
  const audienceCards = course.audience_cards || [];
  const programDays = courseDate.program_days || [];
  const includedItems = course.included_items || [];
  const relevanceParagraphs = (course as any).relevance_paragraphs || [];
  const generalInfoItems = (course as any).general_info_items || [];
  const heroBadges = course.hero_badges || [];

  // ── Date formatting ──
  const startDate = new Date(courseDate.start_date);
  const endDate = new Date(courseDate.end_date);
  const dateStr = (isNaN(startDate.getTime()) || isNaN(endDate.getTime()))
    ? 'Consulte as datas'
    : `${startDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })} a ${endDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`;
  const totalHours = programDays.length ? `${programDays.length * 4}h` : '20h';
  const location = courseDate.location_venue || 'A definir';
  const locationAddr = courseDate.location_address || '';

  // ── Title parts ──
  const titleParts = course.title_parts && course.title_parts.length > 0
    ? course.title_parts
    : [{ text: course.title, color: 'white' as const }];

  // ── Parse bg hex to RGB for gradient ──
  const bgR = parseInt(bg.slice(1, 3), 16) || 0;
  const bgG = parseInt(bg.slice(3, 5), 16) || 0;
  const bgB = parseInt(bg.slice(5, 7), 16) || 0;

  // ── Resolve hero badges with dynamic values ──
  const badges = heroBadges
    .filter(b => b.label || b.value)
    .map(badge => {
      let value = badge.value;
      if (value === 'dropdown') value = dateStr;
      if (value === 'location_dynamic') value = location;
      return { ...badge, value };
    });

  // ── Build @font-face declarations ──
  const fontFaceRules: string[] = [];
  const seenFontFaces = new Set<string>();
  for (const font of fonts) {
    const key = `${font.name}-${font.weight}-${font.style}`;
    if (seenFontFaces.has(key)) continue;
    seenFontFaces.add(key);
    // For fonts loaded as ArrayBuffer, we convert to base64 inline data
    if (font.data && font.data.byteLength > 0) {
      const bytes = new Uint8Array(font.data);
      let binary = '';
      const chunk = 32768;
      for (let i = 0; i < bytes.length; i += chunk) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
      }
      const b64 = btoa(binary);
      fontFaceRules.push(`
        @font-face {
          font-family: '${font.name}';
          src: url('data:font/truetype;base64,${b64}') format('truetype');
          font-weight: ${font.weight};
          font-style: ${font.style};
          font-display: block;
        }
      `);
    }
  }

  // ── Page header helper ──
  function pageHeader(isLight = false): string {
    const textColor = isLight ? '#333333' : '#ffffff';
    const locColor = isLight ? '#888888' : 'rgba(255,255,255,0.5)';
    const borderColor = isLight ? `${primary}22` : `${primary}33`;
    const truncTitle = course.title.length > 50 ? course.title.substring(0, 47) + '...' : course.title;
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:8px;margin-bottom:12px;border-bottom:1px solid ${borderColor};">
        <div style="display:flex;align-items:center;gap:8px;">
          ${course.category_label ? `<span style="background:${primary};color:#fff;padding:2px 8px;border-radius:3px;font-size:5pt;font-weight:700;text-transform:uppercase;letter-spacing:1px;font-family:'${bodyFont}',sans-serif;">${esc(course.category_label)}</span>` : ''}
          <span style="font-weight:700;font-size:7pt;color:${textColor};font-family:'${headingFont}',sans-serif;">${esc(truncTitle)}</span>
        </div>
        <div style="text-align:right;">
          <div style="color:${primary};font-weight:700;font-size:6pt;letter-spacing:1px;font-family:'${bodyFont}',sans-serif;">${esc(dateStr.toUpperCase())}</div>
          <div style="color:${locColor};font-size:5.5pt;font-family:'${bodyFont}',sans-serif;">${esc(location)}</div>
        </div>
      </div>
    `;
  }

  // ── Page footer helper ──
  function pageFooter(isLight = false): string {
    const color = isLight ? '#cccccc' : 'rgba(255,255,255,0.15)';
    return `<div style="position:absolute;bottom:12px;right:28px;font-size:5pt;color:${color};text-transform:uppercase;letter-spacing:1.5px;font-family:'${bodyFont}',sans-serif;">${esc(company.company_name || 'Instituto Plenum Brasil')}</div>`;
  }

  // ══════════════════════════════════════════════════════════
  // PAGE 1: COVER
  // ══════════════════════════════════════════════════════════
  const titleHTML = titleParts.map(p =>
    `<span style="color:${p.color === 'accent' ? primary : '#ffffff'};">${esc(p.text)}</span>`
  ).join(' ');

  const badgesHTML = badges.length > 0 ? `
    <div style="display:flex;justify-content:center;margin-top:auto;padding:0 20px 0 20px;">
      <div style="display:inline-flex;align-items:center;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.08);border-radius:999px;">
        ${badges.map((b, i) => `
          ${i > 0 ? `<div style="width:1px;align-self:stretch;background:rgba(255,255,255,0.08);"></div>` : ''}
          <div style="display:flex;align-items:center;gap:8px;padding:8px 16px;">
            <div style="width:22px;height:22px;border-radius:50%;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              ${svgIcon(b.icon || 'Target', 11, primary)}
            </div>
            <div style="display:flex;flex-direction:column;">
              ${b.label ? `<span style="font-size:5pt;font-weight:700;color:${primary};text-transform:uppercase;letter-spacing:2px;font-family:'${bodyFont}',sans-serif;">${esc(b.label.toUpperCase())}</span>` : ''}
              <span style="font-size:7pt;font-weight:700;color:#ffffff;font-family:'${bodyFont}',sans-serif;">${esc(b.value)}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  const page1 = `
    <div class="page page-dark" style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;position:relative;">
      <!-- Background gradient -->
      <div style="position:absolute;inset:0;z-index:0;background:radial-gradient(ellipse 90% 60% at 50% 85%, ${gradMid} 0%, ${bgDeep} 60%);"></div>
      <!-- Frame image -->
      ${frameSrc ? `<div style="position:absolute;inset:0;z-index:1;opacity:0.35;background:url('${frameSrc}') center/cover no-repeat;"></div>` : ''}
      <!-- Gradient overlay -->
      <div style="position:absolute;inset:0;z-index:2;background:linear-gradient(to bottom, rgba(${bgR},${bgG},${bgB},0) 0%, rgba(${bgR},${bgG},${bgB},0.4) 40%, rgba(${bgR},${bgG},${bgB},0.85) 70%, ${bg} 100%);"></div>
      <!-- Content -->
      <div style="position:relative;z-index:10;display:flex;flex-direction:column;align-items:center;width:100%;height:100%;padding:28px 10px;">
        <!-- Logo -->
        ${logoSrc ? `<img src="${logoSrc}" style="height:28px;object-fit:contain;margin-bottom:auto;" alt="Logo">` : `<div style="font-size:16px;font-weight:700;margin-bottom:auto;font-family:'${headingFont}',sans-serif;">${esc(company.company_name || 'Instituto Plenum Brasil')}</div>`}

        <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;">
          <!-- Category pill -->
          ${course.category_label ? `<div style="background:#ffffff;color:${primary};padding:4px 14px;border-radius:20px;font-size:7pt;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:14px;font-family:'${bodyFont}',sans-serif;">${esc(course.category_label.toUpperCase())}</div>` : ''}

          <!-- Main title -->
          <div style="font-family:'${headingFont}',serif;font-size:32pt;font-weight:800;line-height:1.1;margin-bottom:14px;max-width:520px;text-align:center;">
            ${titleHTML}
          </div>

          <!-- Subtitle -->
          ${course.subtitle ? `<div style="font-size:11pt;font-weight:400;color:rgba(255,255,255,0.8);margin-bottom:30px;max-width:440px;line-height:1.5;text-align:center;font-family:'${bodyFont}',sans-serif;">${esc(course.subtitle)}</div>` : ''}
        </div>

        <!-- Badge strip -->
        ${badgesHTML}
        <div style="height:40px;flex-shrink:0;"></div>
      </div>
    </div>
  `;

  // ══════════════════════════════════════════════════════════
  // PAGE 2: APRESENTACAO (Sobre + Publico + Info Cards)
  // ══════════════════════════════════════════════════════════
  // Two-column layout: LEFT = presentation text, RIGHT = audience list
  // Below: info cards (Local, Data, Carga)

  const descriptionText = course.about_description || course.about_subheading || '';

  const page2 = `
    <div class="page page-dark" style="position:relative;">
      ${pageHeader()}

      <!-- Section: Apresentacao heading -->
      <div style="text-align:center;margin-bottom:12px;">
        <div style="font-family:'${headingFont}',serif;font-size:22pt;font-weight:800;color:#ffffff;margin-bottom:6px;line-height:1.15;">
          Apresenta${'\u00e7\u00e3'}o
        </div>
        <div style="width:28px;height:2px;background:${primary};margin:0 auto 10px;border-radius:1px;"></div>
      </div>

      <!-- Two-column: Description (left) + Audience (right) -->
      <div style="display:flex;gap:16px;margin-bottom:14px;">
        <!-- LEFT: Description text -->
        <div style="flex:1;min-width:0;">
          ${descriptionText ? `<div style="font-size:7.5pt;color:rgba(255,255,255,0.65);line-height:1.65;text-align:justify;font-family:'${bodyFont}',sans-serif;">${esc(descriptionText)}</div>` : ''}
          ${relevanceParagraphs.length > 0 ? relevanceParagraphs.map((p: string) => `
            <div style="font-size:7.5pt;color:rgba(255,255,255,0.65);line-height:1.65;margin-top:8px;text-align:justify;font-family:'${bodyFont}',sans-serif;">${esc(p)}</div>
          `).join('') : ''}
        </div>
        <!-- RIGHT: Audience list -->
        ${audienceCards.length > 0 ? `
        <div style="width:48%;flex-shrink:0;">
          <div style="font-family:'${headingFont}',serif;font-size:13pt;font-weight:700;color:#ffffff;margin-bottom:10px;">Para quem ${'\u00e9'}?</div>
          ${audienceCards.map(c => `
            <div style="display:flex;align-items:center;gap:8px;background:${surface};border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:7px 10px;margin-bottom:5px;">
              <div style="width:18px;height:18px;background:${primary}20;border:1px solid ${primary}30;border-radius:5px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                ${svgIcon('Users', 10, `${primary}cc`)}
              </div>
              <span style="font-size:6.5pt;font-weight:700;color:rgba(255,255,255,0.85);font-family:'${bodyFont}',sans-serif;">${esc(c.title)}</span>
            </div>
          `).join('')}
        </div>` : ''}
      </div>

      <!-- Info cards row: Local, Data, Carga -->
      <div style="display:flex;gap:8px;margin-top:auto;">
        <!-- Date card -->
        <div style="flex:1;display:flex;align-items:center;gap:8px;background:${surface}99;border-radius:10px;padding:10px 12px;">
          <div style="width:28px;height:28px;border-radius:50%;background:${primary};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            ${svgIcon('Calendar', 14, '#ffffff')}
          </div>
          <div>
            <div style="font-size:5pt;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:1px;font-family:'${bodyFont}',sans-serif;">Data:</div>
            <div style="font-size:7.5pt;font-weight:700;color:${primary};font-family:'${headingFont}',sans-serif;">${esc(dateStr)}</div>
          </div>
        </div>
        <!-- Location card -->
        <div style="flex:1.2;display:flex;align-items:center;gap:8px;background:${surface}99;border-radius:10px;padding:10px 12px;">
          <div style="width:28px;height:28px;border-radius:50%;background:${primary};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            ${svgIcon('MapPin', 14, '#ffffff')}
          </div>
          <div>
            <div style="font-size:5pt;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:1px;font-family:'${bodyFont}',sans-serif;">Local:</div>
            <div style="font-size:7.5pt;font-weight:700;color:${primary};font-family:'${headingFont}',sans-serif;">${esc(location)}</div>
            ${locationAddr ? `<div style="font-size:5.5pt;color:rgba(255,255,255,0.45);line-height:1.4;font-family:'${bodyFont}',sans-serif;">${esc(locationAddr)}</div>` : ''}
          </div>
        </div>
        <!-- Carga card -->
        <div style="flex:0.8;display:flex;align-items:center;gap:8px;background:${surface}99;border-radius:10px;padding:10px 12px;">
          <div style="width:28px;height:28px;border-radius:50%;background:${primary};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            ${svgIcon('Clock', 14, '#ffffff')}
          </div>
          <div>
            <div style="font-size:5pt;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:1px;font-family:'${bodyFont}',sans-serif;">Carga Hor${'\u00e1'}ria:</div>
            <div style="font-size:7.5pt;font-weight:700;color:${primary};font-family:'${headingFont}',sans-serif;">${esc(totalHours)}</div>
          </div>
        </div>
      </div>

      <!-- Plenum logo bottom right -->
      ${plenumLogoSrc ? `<div style="position:absolute;bottom:12px;right:28px;"><img src="${plenumLogoSrc}" style="height:18px;opacity:0.5;object-fit:contain;" alt=""></div>` : ''}
    </div>
  `;

  // ══════════════════════════════════════════════════════════
  // PAGE 3: SOBRE O CURSO (About Cards - 3x2 grid)
  // ══════════════════════════════════════════════════════════
  const page3 = aboutCards.length > 0 ? `
    <div class="page page-dark" style="position:relative;">
      ${pageHeader()}

      <!-- Large centered statement -->
      <div style="text-align:center;margin-bottom:20px;padding:0 20px;">
        <div style="margin-bottom:14px;display:flex;justify-content:center;">
          ${svgIcon('Target', 32, primary)}
        </div>
        <div style="font-family:'${headingFont}',serif;font-size:16pt;font-weight:700;color:#ffffff;line-height:1.3;max-width:85%;margin:0 auto;">
          ${esc(course.about_heading || 'Sobre o Curso')}
        </div>
      </div>

      <!-- 3x2 About Cards Grid -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;">
        ${aboutCards.map(c => `
          <div style="background:${surface};border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:10px;">
            <div style="width:20px;height:20px;background:${primary};border-radius:5px;display:flex;align-items:center;justify-content:center;margin-bottom:7px;">
              ${svgIcon(c.icon || 'Star', 11, '#ffffff')}
            </div>
            <div style="font-size:6.5pt;font-weight:700;color:#ffffff;text-transform:uppercase;margin-bottom:3px;font-family:'${bodyFont}',sans-serif;">${esc(c.title)}</div>
            <div style="font-size:6pt;color:rgba(255,255,255,0.55);line-height:1.5;font-family:'${bodyFont}',sans-serif;">${esc(c.description)}</div>
          </div>
        `).join('')}
      </div>

      ${plenumLogoSrc ? `<div style="position:absolute;bottom:12px;right:28px;"><img src="${plenumLogoSrc}" style="height:18px;opacity:0.5;object-fit:contain;" alt=""></div>` : ''}
    </div>
  ` : '';

  // ══════════════════════════════════════════════════════════
  // PROGRAM PAGES (white background)
  // ══════════════════════════════════════════════════════════
  const programPages: string[] = [];

  if (programDays.length > 0) {
    // Group days into pages - each day typically gets its own page
    for (let dayIdx = 0; dayIdx < programDays.length; dayIdx++) {
      const day = programDays[dayIdx];
      const dayLabel = day.tag || `Dia ${dayIdx + 1}`;

      // Try to find the instructor for this module
      const inst = instructors[dayIdx % instructors.length] || instructors[0];
      const instPhotoSrc = inst?.photo_url ? _img(inst.photo_url) : null;
      const moduleNum = dayIdx + 1;

      // Parse day tag for date display
      const tagParts = day.tag.split(',');
      const dateDisplay = tagParts.length > 1 ? tagParts[0].trim() : day.tag.trim();
      const weekMatch = day.tag.match(/(Segunda|Ter[çc]a|Quarta|Quinta|Sexta|S[aá]bado|Domingo)/i);
      const weekDay = weekMatch ? weekMatch[1] + (weekMatch[1].match(/feira$/i) ? '' : '-feira') : '';

      // Extract day/month for the date badge
      const dateNumMatch = day.tag.match(/(\d{1,2})\s*(\/|de\s+)?(\w+)?/);
      const dayNum = dateNumMatch ? dateNumMatch[1] : '';
      const dayMonth = dateNumMatch && dateNumMatch[3] ? dateNumMatch[3].toUpperCase().substring(0, 3) : '';

      programPages.push(`
        <div class="page page-light" style="position:relative;">
          ${pageHeader(true)}

          <!-- Date + PROGRAMACAO header row -->
          <div style="display:flex;align-items:flex-end;gap:14px;margin-bottom:14px;">
            <div>
              <div style="font-family:'${headingFont}',serif;font-size:14pt;font-weight:700;color:${primary};text-decoration:underline;text-underline-offset:3px;">${esc(dateDisplay)}</div>
              ${weekDay ? `<div style="font-size:6pt;font-style:italic;color:#999999;font-family:'${bodyFont}',sans-serif;">${esc(weekDay)}</div>` : ''}
            </div>
            <div style="width:1px;height:22px;background:#dddddd;"></div>
            <div style="font-family:'${headingFont}',sans-serif;font-size:10pt;color:#bbbbbb;letter-spacing:8px;text-transform:uppercase;">PROGRAMA${'\u00c7\u00c3'}O</div>
          </div>

          <!-- Module card -->
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px;background:${primary};border-radius:10px;padding:12px 16px;">
            ${instPhotoSrc ? `<img src="${instPhotoSrc}" style="width:54px;height:54px;border-radius:8px;object-fit:cover;border:2px solid rgba(255,255,255,0.2);flex-shrink:0;" alt="">` : inst ? `<div style="width:54px;height:54px;border-radius:8px;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-family:'${headingFont}',sans-serif;font-size:20pt;font-weight:700;color:#fff;flex-shrink:0;">${esc(inst.name.charAt(0))}</div>` : ''}
            <div style="color:#ffffff;">
              <div style="font-family:'${headingFont}',sans-serif;font-size:14pt;font-weight:700;">M${'\u00d3'}DULO ${moduleNum}</div>
              ${inst ? `<div style="font-size:6.5pt;font-family:'${bodyFont}',sans-serif;">PALESTRANTE: <strong>${esc(inst.name)}</strong>${inst.role ? ` (${esc(inst.role)})` : ''}</div>` : ''}
              ${day.time ? `<div style="display:inline-flex;align-items:center;gap:4px;margin-top:3px;font-size:6.5pt;font-family:'${bodyFont}',sans-serif;opacity:0.9;">${svgIcon('Clock', 10, '#ffffff')} Hor${'\u00e1'}rio &mdash; ${esc(day.time)}</div>` : ''}
            </div>
          </div>

          <!-- Content label -->
          <div style="font-size:7pt;font-weight:700;color:#1a1a1a;border-top:1px solid #e8e8e8;padding-top:8px;margin-bottom:8px;font-family:'${bodyFont}',sans-serif;">
            CONTE${'\u00da'}DO &mdash; ${esc(day.description || day.title)}
          </div>

          <!-- Topic cards: DARK navy cards -->
          <div style="display:flex;flex-direction:column;gap:5px;">
            ${day.topics.map(t => `
              <div style="background:#1a2332;border-radius:6px;padding:8px 12px;">
                <div style="font-size:7pt;color:#ffffff;line-height:1.55;font-family:'${bodyFont}',sans-serif;">${esc(t.text)}</div>
                ${(t.children || []).length > 0 ? t.children.map(child => `
                  <div style="font-size:6.5pt;color:rgba(255,255,255,0.6);line-height:1.45;margin-top:3px;margin-left:10px;font-family:'${bodyFont}',sans-serif;">&bull; ${esc(child)}</div>
                `).join('') : ''}
              </div>
            `).join('')}
          </div>

          ${plenumLogoSrc ? `<div style="position:absolute;bottom:12px;right:28px;"><img src="${plenumLogoSrc}" style="height:18px;opacity:0.3;object-fit:contain;" alt=""></div>` : ''}
        </div>
      `);
    }
  }

  // ══════════════════════════════════════════════════════════
  // SPEAKERS PAGE (dark bg)
  // ══════════════════════════════════════════════════════════
  const speakersPage = instructors.length > 0 ? `
    <div class="page page-dark" style="position:relative;">
      ${pageHeader()}

      <!-- Speakers header -->
      <div style="margin-bottom:14px;">
        <div style="font-size:7pt;color:${primary};text-transform:uppercase;letter-spacing:2px;margin-bottom:2px;font-family:'${bodyFont}',sans-serif;">Palestrantes</div>
        <div style="font-family:'${headingFont}',serif;font-size:22pt;font-weight:800;color:#ffffff;margin-bottom:5px;">Palestrantes</div>
        <div style="width:28px;height:3px;background:${primary};border-radius:1px;margin-bottom:8px;"></div>
        <div style="font-size:7.5pt;color:rgba(255,255,255,0.65);font-family:'${bodyFont}',sans-serif;">Conhe${'\u00e7'}a os profissionais que conduzir${'\u00e3'}o esta imers${'\u00e3'}o.</div>
      </div>

      <!-- Speaker cards (horizontal layout) -->
      ${instructors.map(inst => {
        const photoSrc = inst.photo_url ? _img(inst.photo_url) : null;
        const initials = inst.name?.charAt(0) || '?';
        return `
          <div style="display:flex;align-items:flex-start;gap:16px;background:${surface};border:1px solid ${primary}22;border-radius:12px;padding:14px 16px;margin-bottom:8px;">
            <!-- Photo -->
            ${photoSrc ? `<img src="${photoSrc}" style="width:100px;height:120px;border-radius:8px;object-fit:cover;flex-shrink:0;" alt="">` : `<div style="width:100px;height:120px;border-radius:8px;background:${primary};display:flex;align-items:center;justify-content:center;font-family:'${headingFont}',sans-serif;font-size:32pt;font-weight:700;color:#ffffff;flex-shrink:0;">${initials}</div>`}
            <!-- Info -->
            <div style="display:flex;flex-direction:column;flex:1;justify-content:center;">
              <div style="font-family:'${headingFont}',sans-serif;font-size:11pt;font-weight:800;color:#ffffff;text-transform:uppercase;letter-spacing:2px;margin-bottom:3px;">${esc(inst.name)}</div>
              ${inst.role ? `<div style="font-size:6.5pt;color:${primary};font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px;font-family:'${bodyFont}',sans-serif;">${esc(inst.role)}</div>` : ''}
              ${inst.bio ? `<div style="font-size:7pt;color:rgba(255,255,255,0.6);line-height:1.55;font-family:'${bodyFont}',sans-serif;">${esc(inst.bio)}</div>` : ''}
            </div>
          </div>
        `;
      }).join('')}

      ${plenumLogoSrc ? `<div style="position:absolute;bottom:12px;right:28px;"><img src="${plenumLogoSrc}" style="height:18px;opacity:0.5;object-fit:contain;" alt=""></div>` : ''}
    </div>
  ` : '';

  // ══════════════════════════════════════════════════════════
  // PHOTOS + INVESTMENT PAGE (dark bg)
  // ══════════════════════════════════════════════════════════
  const photosInvestPage = `
    <div class="page page-dark" style="position:relative;">
      ${pageHeader()}

      <!-- Statement heading -->
      <div style="font-family:'${headingFont}',serif;font-size:12pt;font-weight:700;color:#ffffff;text-align:center;line-height:1.3;margin-bottom:12px;">
        Somos refer${'\u00ea'}ncia em capacita${'\u00e7\u00e3'}o e<br>desenvolvimento de gestores p${'\u00fa'}blicos no pa${'\u00ed'}s.
      </div>

      <!-- Photo grid: 3 top + 2 bottom -->
      <div style="margin-bottom:14px;">
        <div style="display:flex;gap:5px;margin-bottom:5px;">
          ${eventPhotos.slice(0, 3).map(src => `
            <div style="flex:1;height:85px;border-radius:8px;overflow:hidden;">
              <img src="${src}" style="width:100%;height:100%;object-fit:cover;" alt="">
            </div>
          `).join('')}
        </div>
        <div style="display:flex;gap:5px;">
          ${eventPhotos.slice(3, 5).map(src => `
            <div style="flex:1;height:85px;border-radius:8px;overflow:hidden;">
              <img src="${src}" style="width:100%;height:100%;object-fit:cover;" alt="">
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Investment heading -->
      <div style="font-family:'${headingFont}',serif;font-size:14pt;font-weight:800;color:#ffffff;margin-bottom:4px;">
        ${esc(course.investment_heading || 'Garanta a sua vaga')}
      </div>
      <div style="font-size:7.5pt;color:rgba(255,255,255,0.65);line-height:1.5;margin-bottom:10px;font-family:'${bodyFont}',sans-serif;">
        ${esc(course.investment_subtitle || 'Invista na sua capacita\u00e7\u00e3o profissional e garanta sua vaga nesta imers\u00e3o exclusiva.')}
      </div>

      <!-- "O QUE ESTA INCLUSO" + two-column -->
      <div style="font-size:5.5pt;color:rgba(255,255,255,0.55);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px;font-family:'${bodyFont}',sans-serif;">O que est${'\u00e1'} incluso:</div>

      <div style="display:flex;gap:14px;align-items:flex-start;">
        <!-- LEFT: included items -->
        <div style="flex:1;display:flex;flex-direction:column;gap:5px;">
          ${includedItems.map(item => `
            <div style="display:flex;align-items:center;gap:6px;">
              <div style="width:14px;height:14px;border-radius:50%;background:${primary};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                ${checkSvg(8)}
              </div>
              <span style="font-size:7pt;color:rgba(255,255,255,0.85);font-family:'${bodyFont}',sans-serif;">${esc(item.text)}</span>
            </div>
          `).join('')}
        </div>
        <!-- RIGHT: product image -->
        ${productSrc || kitSrc ? `
          <div style="width:140px;flex-shrink:0;display:flex;align-items:center;justify-content:center;">
            <img src="${productSrc || kitSrc}" style="max-width:130px;max-height:160px;object-fit:contain;" alt="">
          </div>
        ` : ''}
      </div>

      ${pageFooter()}
    </div>
  `;

  // ══════════════════════════════════════════════════════════
  // TESTIMONIALS + PARTNERS + CONTACT PAGE (dark bg)
  // ══════════════════════════════════════════════════════════
  const testimonialsPage = `
    <div class="page page-dark" style="position:relative;">
      ${pageHeader()}

      <!-- "Veja quem ja esteve aqui:" -->
      <div style="font-family:'${headingFont}',serif;font-size:12pt;font-weight:700;color:rgba(255,255,255,0.55);text-align:center;margin-bottom:10px;">
        Veja quem j${'\u00e1'} esteve aqui:
      </div>

      <!-- 4 testimonial cards in row -->
      <div style="display:flex;gap:6px;margin-bottom:14px;">
        ${TESTIMONIALS.map(t => {
          const photoSrc = _img(t.photo) || t.photo;
          return `
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;background:${surface}cc;border:1px solid ${primary}22;border-radius:10px;padding:10px 8px;">
              <img src="${photoSrc}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid ${primary}44;margin-bottom:6px;" alt="">
              <div style="font-size:6pt;color:rgba(255,255,255,0.65);line-height:1.5;margin-bottom:6px;font-family:'${bodyFont}',sans-serif;">&ldquo;${esc(t.quote)}&rdquo;</div>
              <div style="font-size:6.5pt;font-weight:700;color:#ffffff;font-family:'${headingFont}',sans-serif;">${esc(t.name)}</div>
              <div style="font-size:5pt;color:${primary};font-weight:700;text-transform:uppercase;letter-spacing:0.5px;font-family:'${bodyFont}',sans-serif;">${esc(t.role)}</div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Partner institutions -->
      <div style="font-family:'${headingFont}',serif;font-size:11pt;font-weight:700;color:#ffffff;text-align:center;margin-bottom:10px;">
        Institui${'\u00e7\u00f5'}es que j${'\u00e1'} se capacitaram conosco
      </div>

      ${partnerLogosSrc ? `
        <div style="background:#ffffff;border-radius:10px;padding:12px 16px;margin-bottom:14px;display:flex;justify-content:center;">
          <img src="${partnerLogosSrc}" style="max-width:100%;height:auto;max-height:50px;object-fit:contain;" alt="">
        </div>
      ` : ''}

      <!-- Contact section -->
      <div style="text-align:center;margin-top:auto;">
        <div style="font-size:5.5pt;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;font-family:'${bodyFont}',sans-serif;">Entre em contato:</div>

        <!-- Plenum logo -->
        ${plenumLogoSrc ? `<div style="display:flex;justify-content:center;margin-bottom:8px;"><img src="${plenumLogoSrc}" style="height:30px;object-fit:contain;" alt=""></div>` : ''}

        <!-- Contact info row -->
        <div style="display:flex;justify-content:center;flex-wrap:wrap;gap:14px;margin-bottom:8px;">
          ${(company.phones || []).map((p: any) => `
            <div style="display:flex;align-items:center;gap:4px;font-size:5.5pt;color:rgba(255,255,255,0.55);font-family:'${bodyFont}',sans-serif;">
              ${svgIcon('Phone', 9, primary)} ${esc(p.label ? `${p.label}: ` : '')}${esc(p.number)}
            </div>
          `).join('')}
          ${(company.emails || []).map((e: any) => `
            <div style="display:flex;align-items:center;gap:4px;font-size:5.5pt;color:rgba(255,255,255,0.55);font-family:'${bodyFont}',sans-serif;">
              ${svgIcon('Mail', 9, primary)} ${esc(e.email)}
            </div>
          `).join('')}
          ${company.website ? `
            <div style="display:flex;align-items:center;gap:4px;font-size:5.5pt;color:rgba(255,255,255,0.55);font-family:'${bodyFont}',sans-serif;">
              ${svgIcon('Globe', 9, primary)} ${esc(company.website)}
            </div>
          ` : ''}
        </div>

        <!-- "Ate breve!" -->
        <div style="font-size:8pt;color:rgba(255,255,255,0.55);letter-spacing:2px;font-family:'${bodyFont}',sans-serif;">At${'\u00e9'} breve!</div>
      </div>

      ${pageFooter()}
    </div>
  `;

  // ══════════════════════════════════════════════════════════
  // OPTIONAL: General Info page (if items exist and not already shown)
  // ══════════════════════════════════════════════════════════
  const generalInfoPage = generalInfoItems.length > 0 ? `
    <div class="page page-dark" style="position:relative;">
      ${pageHeader()}

      <div style="margin-bottom:12px;">
        <div style="font-size:6pt;color:${primary}99;text-transform:uppercase;letter-spacing:2px;margin-bottom:4px;font-family:'${bodyFont}',sans-serif;">Detalhes</div>
        <div style="font-family:'${headingFont}',serif;font-size:16pt;font-weight:800;color:#ffffff;margin-bottom:4px;">Informa${'\u00e7\u00f5'}es Gerais</div>
        <div style="width:28px;height:2px;background:${primary};border-radius:1px;margin-bottom:12px;"></div>
      </div>

      ${generalInfoItems.map((item: any) => `
        <div style="background:${surface}66;border:1px solid ${primary}15;border-radius:8px;padding:10px 12px;margin-bottom:6px;">
          <div style="font-size:8pt;font-weight:700;color:#ffffff;margin-bottom:4px;font-family:'${headingFont}',sans-serif;">${esc(item.title)}</div>
          <div style="font-size:6.5pt;color:rgba(255,255,255,0.65);line-height:1.6;font-family:'${bodyFont}',sans-serif;">${esc(item.content)}</div>
        </div>
      `).join('')}

      ${plenumLogoSrc ? `<div style="position:absolute;bottom:12px;right:28px;"><img src="${plenumLogoSrc}" style="height:18px;opacity:0.5;object-fit:contain;" alt=""></div>` : ''}
    </div>
  ` : '';

  // ══════════════════════════════════════════════════════════
  // ASSEMBLE ALL PAGES
  // ══════════════════════════════════════════════════════════
  const allPages = [
    page1,
    page2,
    page3,
    generalInfoPage,
    ...programPages,
    speakersPage,
    photosInvestPage,
    testimonialsPage,
  ].filter(Boolean);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  /* ─── Font-face declarations ─── */
  ${fontFaceRules.join('\n')}

  /* ─── Print / Page Setup ─── */
  @page {
    size: A4;
    margin: 0;
  }

  /* ─── Reset ─── */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 210mm;
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  body {
    font-family: '${bodyFont}', 'Satoshi', 'Inter', system-ui, -apple-system, sans-serif;
    color: #ffffff;
    background: #000000;
    font-size: 8pt;
    line-height: 1.4;
  }

  img {
    display: block;
    max-width: 100%;
  }

  /* ─── Page Base ─── */
  .page {
    width: 210mm;
    height: 297mm;
    position: relative;
    overflow: hidden;
    page-break-after: always;
    padding: 10mm;
  }

  .page:last-child {
    page-break-after: auto;
  }

  .page-dark {
    background: ${bg};
    color: #ffffff;
  }

  .page-light {
    background: #ffffff;
    color: #1a1a1a;
  }

  /* ─── Flexbox utility on pages ─── */
  .page {
    display: flex;
    flex-direction: column;
  }

  /* ─── Background frames ─── */
  .page-dark::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 60mm;
    background: linear-gradient(135deg, ${gradMid}33 0%, transparent 50%);
    z-index: 0;
    pointer-events: none;
  }

  .page > * {
    position: relative;
    z-index: 1;
  }
</style>
</head>
<body>
${allPages.join('\n')}
</body>
</html>`;
}
