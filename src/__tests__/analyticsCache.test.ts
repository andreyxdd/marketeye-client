import { QueryClient } from '@tanstack/react-query';
import {
  CRITERIA_MAP,
  getManyTickersQueryKey,
  seedBandCache,
  isBandCachePopulated,
  isCriterionCachedForBand,
  seedCriterionCache,
  BulkAnalyticsResponse,
} from '../renderer/lib/analyticsCache';

describe('analyticsCache', () => {
  const date = '2024-01-15';
  const bulkResponse: BulkAnalyticsResponse = {
    by_one_day_avg_mf: [{ ticker: 'AAPL' } as import('types').IDataProps],
    by_three_day_avg_mf: [{ ticker: 'MSFT' } as import('types').IDataProps],
    by_volume: [{ ticker: 'GOOG' } as import('types').IDataProps],
    by_three_day_avg_volume: [{ ticker: 'AMZN' } as import('types').IDataProps],
    by_macd: [{ ticker: 'META' } as import('types').IDataProps],
  };

  it('CRITERIA_MAP maps by_* keys to criterion names', () => {
    expect(CRITERIA_MAP.by_one_day_avg_mf).toBe('one_day_avg_mf');
    expect(CRITERIA_MAP.by_macd).toBe('macd');
  });

  it('getManyTickersQueryKey includes priceBand when provided', () => {
    expect(getManyTickersQueryKey('volume', date, 'lte5')).toEqual([
      'US',
      'volume',
      date,
      'lte5',
    ]);
    expect(getManyTickersQueryKey('volume', date)).toEqual([
      'US',
      'volume',
      date,
    ]);
  });

  it('seedBandCache maps by_* keys into per-criterion query cache entries', () => {
    const queryClient = new QueryClient();
    seedBandCache(queryClient, date, 'lte5', bulkResponse);

    expect(
      queryClient.getQueryData(
        getManyTickersQueryKey('one_day_avg_mf', date, 'lte5')
      )
    ).toEqual([{ ticker: 'AAPL' }]);
    expect(
      queryClient.getQueryData(getManyTickersQueryKey('macd', date, 'lte5'))
    ).toEqual([{ ticker: 'META' }]);
  });

  it('seedBandCache without priceBand seeds standard-mode keys', () => {
    const queryClient = new QueryClient();
    seedBandCache(queryClient, date, undefined, bulkResponse);

    expect(
      queryClient.getQueryData(getManyTickersQueryKey('volume', date))
    ).toEqual([{ ticker: 'GOOG' }]);
  });

  it('isBandCachePopulated returns true after seedBandCache', () => {
    const queryClient = new QueryClient();
    expect(isBandCachePopulated(queryClient, date, '5to10')).toBe(false);

    seedBandCache(queryClient, date, '5to10', bulkResponse);
    expect(isBandCachePopulated(queryClient, date, '5to10')).toBe(true);
  });

  it('isCriterionCachedForBand returns false until that criterion is seeded', () => {
    const queryClient = new QueryClient();
    expect(isCriterionCachedForBand(queryClient, 'volume', date, 'lte5')).toBe(
      false
    );

    seedCriterionCache(queryClient, 'volume', date, 'lte5', [
      { ticker: 'GOOG' } as import('types').IDataProps,
    ]);
    expect(isCriterionCachedForBand(queryClient, 'volume', date, 'lte5')).toBe(
      true
    );
    expect(isCriterionCachedForBand(queryClient, 'macd', date, 'lte5')).toBe(
      false
    );
  });

  it('seedCriterionCache writes a single criterion entry for a price band', () => {
    const queryClient = new QueryClient();
    const rows = [{ ticker: 'NVDA' } as import('types').IDataProps];

    seedCriterionCache(queryClient, 'three_day_avg_mf', date, '5to10', rows);

    expect(
      queryClient.getQueryData(
        getManyTickersQueryKey('three_day_avg_mf', date, '5to10')
      )
    ).toEqual(rows);
  });
});
