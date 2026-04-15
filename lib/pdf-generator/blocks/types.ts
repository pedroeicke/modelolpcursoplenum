import type { SatoriNode } from '../types';

/**
 * A content block that can be packed onto PDF pages.
 * Each block renders independently and reports its estimated height
 * so the packer can decide where page breaks should go.
 */
export interface ContentBlock {
  /** Unique key for debugging (e.g. 'about-header', 'program-day-2') */
  id: string;
  /** Estimated height in pixels (at PAGE_W=1240 scale) */
  estimatedHeight: number;
  /** Background style: 'dark' (DS background) or 'light' (white, for program) */
  background: 'dark' | 'light';
  /** If true, this block must stay on the same page as the next block */
  stickyWithNext?: boolean;
  /** Render the block content (no page wrapper, no padding) */
  render(): SatoriNode;
}
