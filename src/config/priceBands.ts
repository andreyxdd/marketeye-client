import { isTO } from './market';

export type PriceBand = 'lte5' | '5to10' | '10to20' | '20to50';

export const PRICE_BANDS: PriceBand[] = ['lte5', '5to10', '10to20', '20to50'];

const currencySuffix = () => (isTO ? ' CAD' : '');

export function priceBandLabel(band: PriceBand): string {
  const suffix = currencySuffix();
  switch (band) {
    case 'lte5':
      return `≤ $5${suffix}`;
    case '5to10':
      return `$5.01–$10${suffix}`;
    case '10to20':
      return `$10.01–$20${suffix}`;
    case '20to50':
      return `$20.01–$50${suffix}`;
    default:
      return band;
  }
}

export function priceBandTitleSegment(band: PriceBand): string {
  const suffix = currencySuffix();
  switch (band) {
    case 'lte5':
      return `≤ $5${suffix}`;
    case '5to10':
      return `$5.01–$10${suffix}`;
    case '10to20':
      return `$10.01–$20${suffix}`;
    case '20to50':
      return `$20.01–$50${suffix}`;
    default:
      return band;
  }
}
