import { AppMode } from './appMode';
import { MarketCode } from './market';

export type BuildFlavor = 'standard' | 'micro-us' | 'micro-to';

export function getBuildFlavor(mode: AppMode, market: MarketCode): BuildFlavor {
  if (mode === 'micro') {
    return market === 'TO' ? 'micro-to' : 'micro-us';
  }
  return 'standard';
}

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
