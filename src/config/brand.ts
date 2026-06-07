import { APP_MODE, AppMode } from './appMode';
import { MARKET, MarketCode } from './market';

export function getDisplayName(
  market: MarketCode = MARKET,
  mode: AppMode = APP_MODE
): string {
  if (mode === 'micro') {
    return market === 'TO' ? 'MicroFTM TSX' : 'MicroFTM';
  }
  return market === 'TO' ? 'MarketEye TSX' : 'MarketEye';
}

export const displayName = getDisplayName();
export const documentTitle = displayName;
