import type { ContentBlock } from './types';
import { estimateTextHeight } from './height-utils';
import { h, getImageSrc, type PdfContext, type SatoriNode, type InstructorData } from '../types';
import { getFontFamily } from '../fonts';
import type { FontData } from '../types';

/**
 * Block: Single instructor card — horizontal layout matching Canva reference.
 * Photo LARGE (~160x190px) on LEFT, info on RIGHT.
 * Card: dark surface bg, rounded 16px, border subtle.
 * Name: large uppercase, letter-spacing. Role: primary color, uppercase. Bio: gray text.
 */
export function createSpeakerBlock(
  instructor: InstructorData,
  ctx: PdfContext,
  fonts: FontData[],
): ContentBlock {
  const { ds } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);
  const body = getFontFamily(ds, 'body', fonts);
  const primary = ds.color_primary;

  const bioH = instructor.bio ? estimateTextHeight(instructor.bio, 14, 1.55, 750) : 0;
  const estimatedHeight = Math.max(190, 40 + 24 + bioH) + 56; // card padding + content

  return {
    id: `speaker-${instructor.name?.replace(/\s/g, '-') || 'unknown'}`,
    estimatedHeight,
    background: 'dark',
    render(): SatoriNode {
      const photoSrc = instructor.photo_url
        ? getImageSrc(ctx.imageCache, instructor.photo_url, ctx.siteBaseUrl)
        : '';

      return h('div', {
        style: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          padding: '24px 28px',
          borderRadius: 16,
          backgroundColor: ds.color_surface,
          border: '1px solid rgba(255,255,255,0.08)',
          width: '100%',
          marginBottom: 0,
        },
      },
        // Photo (left, large, rounded)
        photoSrc
          ? h('img', {
              src: photoSrc,
              width: 160,
              height: 190,
              style: {
                borderRadius: 12,
                objectFit: 'cover',
                flexShrink: 0,
                marginRight: 28,
              },
            })
          : h('div', {
              style: {
                width: 160,
                height: 190,
                borderRadius: 12,
                backgroundColor: primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 52,
                fontFamily: heading,
                fontWeight: 700,
                color: '#ffffff',
                flexShrink: 0,
                marginRight: 28,
              },
            }, instructor.name?.charAt(0) || '?'),

        // Info (right)
        h('div', {
          style: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
          },
        },
          // Name (uppercase, large, letter-spacing)
          h('span', {
            style: {
              fontSize: 22,
              fontFamily: heading,
              fontWeight: 800,
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: 2,
              marginBottom: 6,
            },
          }, instructor.name),

          // Role (primary color, uppercase, smaller)
          instructor.role
            ? h('span', {
                style: {
                  fontSize: 15,
                  fontFamily: body,
                  fontWeight: 700,
                  color: primary,
                  textTransform: 'uppercase',
                  letterSpacing: 1.5,
                  marginBottom: 14,
                },
              }, instructor.role)
            : null,

          // Bio (gray text, normal weight)
          instructor.bio
            ? h('span', {
                style: {
                  fontSize: 16,
                  fontFamily: body,
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: 1.55,
                },
              }, instructor.bio)
            : null,
        ),
      );
    },
  };
}
