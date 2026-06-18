import { AppMode } from './appMode';
import { getFlavorManifestEntry } from './flavorManifest';
import { MarketCode } from './market';

export const US_PRIMARY = '#1976d2';

export const TO_PRIMARY = '#1B2A4A';
export const TO_PRIMARY_DARK = '#0F1A2E';
export const TO_SECONDARY = '#C9A227';

export const MICRO_US_PRIMARY = '#00897B';
export const MICRO_US_PRIMARY_DARK = '#00695C';

export const MICRO_TO_PRIMARY = '#37474F';
export const MICRO_TO_PRIMARY_DARK = '#263238';
export const MICRO_TO_SECONDARY = '#D4A574';

export const WHITE = '#FFFFFF';

/** Accent color used when compositing flavor icons onto the base glyph. */
export function getFlavorIconColor(mode: AppMode, market: MarketCode): string {
  return getFlavorManifestEntry(mode, market).color;
}
