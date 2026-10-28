import { APP_MODE, AppMode } from './appMode';
import { MARKET, MarketCode } from './market';
import { getFlavorManifestEntry } from './flavorManifest';

export function getDisplayName(
  market: MarketCode = MARKET,
  mode: AppMode = APP_MODE
): string {
  return getFlavorManifestEntry(mode, market).displayName;
}

export const displayName = getDisplayName();
export const documentTitle = displayName;
