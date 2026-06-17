import { QueryClient } from '@tanstack/react-query';
import { ICriteria, IDataProps } from 'types';
import { MARKET } from '../../config/market';
import { PriceBand } from '../../config/priceBands';

export const CRITERIA: ICriteria[] = [
  'one_day_avg_mf',
  'three_day_avg_mf',
  'volume',
  'three_day_avg_volume',
  'macd',
];

export const CRITERIA_MAP: Record<string, ICriteria> = {
  by_one_day_avg_mf: 'one_day_avg_mf',
  by_three_day_avg_mf: 'three_day_avg_mf',
  by_volume: 'volume',
  by_three_day_avg_volume: 'three_day_avg_volume',
  by_macd: 'macd',
};

export type BulkAnalyticsResponse = Record<string, Array<IDataProps>>;

export function getManyTickersQueryKey(
  criterion: ICriteria,
  date: string,
  priceBand?: PriceBand
):
  | readonly [string, ICriteria, string]
  | readonly [string, ICriteria, string, PriceBand] {
  if (priceBand) {
    return [MARKET, criterion, date, priceBand] as const;
  }
  return [MARKET, criterion, date] as const;
}

export function seedBandCache(
  queryClient: QueryClient,
  date: string,
  priceBand: PriceBand | undefined,
  bulkResponse: BulkAnalyticsResponse
): void {
  Object.entries(CRITERIA_MAP).forEach(([bulkKey, criterion]) => {
    const rows = bulkResponse[bulkKey];
    if (!rows) return;
    queryClient.setQueryData(
      getManyTickersQueryKey(criterion, date, priceBand),
      rows
    );
  });
}

export function isBandCachePopulated(
  queryClient: QueryClient,
  date: string,
  priceBand?: PriceBand
): boolean {
  return CRITERIA.every(
    (criterion) =>
      queryClient.getQueryData(
        getManyTickersQueryKey(criterion, date, priceBand)
      ) !== undefined
  );
}

export function isCriterionCachedForBand(
  queryClient: QueryClient,
  criterion: ICriteria,
  date: string,
  priceBand: PriceBand
): boolean {
  return (
    queryClient.getQueryData(
      getManyTickersQueryKey(criterion, date, priceBand)
    ) !== undefined
  );
}

export function seedCriterionCache(
  queryClient: QueryClient,
  criterion: ICriteria,
  date: string,
  priceBand: PriceBand,
  rows: Array<IDataProps>
): void {
  queryClient.setQueryData(
    getManyTickersQueryKey(criterion, date, priceBand),
    rows
  );
}

export function invalidateBandCache(
  queryClient: QueryClient,
  date: string,
  priceBand?: PriceBand
): void {
  CRITERIA.forEach((criterion) => {
    queryClient.removeQueries({
      queryKey: getManyTickersQueryKey(criterion, date, priceBand),
      exact: true,
    });
  });
}

export function invalidateAllBandsForDate(
  queryClient: QueryClient,
  date: string,
  bands: PriceBand[]
): void {
  bands.forEach((band) => invalidateBandCache(queryClient, date, band));
  invalidateBandCache(queryClient, date);
}
