import { AppMode } from './appMode';
import { MarketCode } from './market';
import {
  FLAVOR_MANIFEST,
  getBuildFlavor,
  getFlavorManifestEntry,
} from './flavorManifest';

export type { BuildFlavor } from './flavorManifest';
export { FLAVOR_MANIFEST, getBuildFlavor, getFlavorManifestEntry };

export function getFlavorIconDir(mode: AppMode, market: MarketCode): string {
  return `flavors/${getBuildFlavor(mode, market)}`;
}

export function getIconAssetPath(
  mode: AppMode,
  market: MarketCode,
  filename = 'icon.png'
): string {
  return `assets/${getFlavorIconDir(mode, market)}/${filename}`;
}

export function getUpdatesFeedUrl(
  mode: AppMode,
  market: MarketCode
): string {
  return getFlavorManifestEntry(mode, market).updatesFeedUrl;
}
