export type MarketCode = 'US' | 'TO';

const SUPPORTED_MARKETS: MarketCode[] = ['US', 'TO'];

function normalizeMarket(raw: string | undefined): MarketCode {
  const code = (raw ?? 'US').toUpperCase();
  if (!SUPPORTED_MARKETS.includes(code as MarketCode)) {
    throw new Error(
      `unsupported MARKETEYE_MARKET: ${raw ?? '(empty)'}. Use US or TO.`
    );
  }
  return code as MarketCode;
}

export const MARKET = normalizeMarket(process.env.MARKETEYE_MARKET);

export const isUS = MARKET === 'US';
export const isTO = MARKET === 'TO';

/** US-only SP500 / VIX / CVI panel (API has no TO equivalent). */
export const showMarketWidePanel = isUS;

export const HIDDEN_COLUMN_FIELDS_FOR_TO = [
  'fcf',
  'mentions_over_one_day',
  'mentions_over_two_days',
  'mentions_over_three_days',
] as const;

export type HiddenColumnField = typeof HIDDEN_COLUMN_FIELDS_FOR_TO[number];

export function isHiddenColumnForMarket(field: string): boolean {
  return (
    isTO && (HIDDEN_COLUMN_FIELDS_FOR_TO as readonly string[]).includes(field)
  );
}

export function filterColumnFields(fields: string[]): string[] {
  if (isUS) return fields;
  return fields.filter((field) => !isHiddenColumnForMarket(field));
}
