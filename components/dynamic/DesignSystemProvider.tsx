import type { DesignSystem } from '@/types/design-system';
import { generateCSSVars, generateFontFaces } from '@/lib/design-system';

interface DesignSystemProviderProps {
  designSystem: DesignSystem;
  children: React.ReactNode;
}

/**
 * Injects CSS custom properties and @font-face declarations
 * from the DesignSystem into the page via a <style> tag.
 * Server component — renders inline styles in the initial HTML
 * to prevent FOUC (flash of unstyled content).
 */
export default function DesignSystemProvider({
  designSystem,
  children,
}: DesignSystemProviderProps) {
  const cssVars = generateCSSVars(designSystem);
  const fontFaces = generateFontFaces(designSystem);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: fontFaces + cssVars }} />
      {children}
    </>
  );
}
