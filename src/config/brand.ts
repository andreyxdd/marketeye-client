import { MARKET, MarketCode } from './market';

export function getDisplayName(market: MarketCode = MARKET): string {
  return market === 'TO' ? 'MarketEye TSX' : 'MarketEye';
}

export const displayName = getDisplayName();
export const documentTitle = displayName;
