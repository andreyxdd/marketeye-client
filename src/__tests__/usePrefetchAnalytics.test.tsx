import { render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IDataProps } from 'types';
import { PRICE_BANDS } from '../config/priceBands';
import {
  getManyTickersQueryKey,
  seedCriterionCache,
} from '../renderer/lib/analyticsCache';
import usePrefetchAnalytics from '../renderer/hooks/usePrefetchAnalytics';
import useStore from '../renderer/hooks/useStore';

jest.mock('../config/appMode', () => ({
  isMicro: true,
}));

const getAnalyticsListsByCriteria = jest.fn();
const getAnalyticsListsByCriterion = jest.fn();

function PrefetchHarness() {
  usePrefetchAnalytics();
  return null;
}

function renderPrefetch(queryClient = new QueryClient()) {
  return render(
    <QueryClientProvider client={queryClient}>
      <PrefetchHarness />
    </QueryClientProvider>
  );
}

const bulkResponse = {
  by_one_day_avg_mf: [{ ticker: 'AAPL' } as IDataProps],
  by_three_day_avg_mf: [{ ticker: 'MSFT' } as IDataProps],
  by_volume: [{ ticker: 'GOOG' } as IDataProps],
  by_three_day_avg_volume: [{ ticker: 'AMZN' } as IDataProps],
  by_macd: [{ ticker: 'META' } as IDataProps],
};

const bulkWithoutVolume = {
  by_one_day_avg_mf: bulkResponse.by_one_day_avg_mf,
  by_three_day_avg_mf: bulkResponse.by_three_day_avg_mf,
  by_three_day_avg_volume: bulkResponse.by_three_day_avg_volume,
  by_macd: bulkResponse.by_macd,
};

const bulkWithoutMacd = {
  by_one_day_avg_mf: bulkResponse.by_one_day_avg_mf,
  by_three_day_avg_mf: bulkResponse.by_three_day_avg_mf,
  by_volume: bulkResponse.by_volume,
  by_three_day_avg_volume: bulkResponse.by_three_day_avg_volume,
};

describe('usePrefetchAnalytics', () => {
  const date = '2024-01-15';

  beforeEach(() => {
    jest.clearAllMocks();
    useStore.setState({
      selectedDate: date,
      priceBand: 'lte5',
      criterion: 'one_day_avg_mf',
    });
    getAnalyticsListsByCriteria.mockResolvedValue(bulkResponse);
    getAnalyticsListsByCriterion.mockImplementation(
      async ({ criterion, price_band: band }) => [
        { ticker: `${criterion}-${band}` } as IDataProps,
      ]
    );
    window.electronAPI = {
      getAnalyticsListsByCriteria,
      getAnalyticsListsByCriterion,
    } as unknown as Window['electronAPI'];
  });

  it('bulk-prefetches all criteria for each band on date/band change', async () => {
    renderPrefetch();

    await waitFor(() => {
      expect(getAnalyticsListsByCriteria).toHaveBeenCalled();
    });

    expect(getAnalyticsListsByCriteria).toHaveBeenCalledWith({
      date,
      price_band: 'lte5',
    });
    PRICE_BANDS.filter((b) => b !== 'lte5').forEach((band) => {
      expect(getAnalyticsListsByCriteria).toHaveBeenCalledWith({
        date,
        price_band: band,
      });
    });
  });

  it('gap-fills the selected criterion across all bands when criterion changes', async () => {
    getAnalyticsListsByCriteria.mockResolvedValue(bulkWithoutVolume);
    renderPrefetch();

    await waitFor(() => {
      expect(getAnalyticsListsByCriteria).toHaveBeenCalled();
    });
    getAnalyticsListsByCriteria.mockClear();
    getAnalyticsListsByCriterion.mockClear();

    act(() => {
      useStore.setState({ criterion: 'volume' });
    });

    await waitFor(() => {
      expect(getAnalyticsListsByCriterion).toHaveBeenCalledTimes(4);
    });

    PRICE_BANDS.forEach((band) => {
      expect(getAnalyticsListsByCriterion).toHaveBeenCalledWith({
        criterion: 'volume',
        date,
        price_band: band,
      });
    });
  });

  it('skips criterion gap-fill when the band already has that criterion cached', async () => {
    const queryClient = new QueryClient();
    PRICE_BANDS.forEach((band) => {
      seedCriterionCache(queryClient, 'volume', date, band, [
        { ticker: 'cached' } as IDataProps,
      ]);
    });

    renderPrefetch(queryClient);

    await waitFor(() => {
      expect(getAnalyticsListsByCriteria).toHaveBeenCalled();
    });
    getAnalyticsListsByCriterion.mockClear();

    act(() => {
      useStore.setState({ criterion: 'volume' });
    });

    await waitFor(() => {
      expect(getAnalyticsListsByCriterion).not.toHaveBeenCalled();
    });
  });

  it('seeds criterion gap-fill responses into the query cache', async () => {
    const queryClient = new QueryClient();
    getAnalyticsListsByCriteria.mockResolvedValue(bulkWithoutMacd);
    renderPrefetch(queryClient);

    await waitFor(() => {
      expect(getAnalyticsListsByCriteria).toHaveBeenCalled();
    });
    getAnalyticsListsByCriterion.mockClear();

    act(() => {
      useStore.setState({ criterion: 'macd' });
    });

    await waitFor(() => {
      expect(
        queryClient.getQueryData(getManyTickersQueryKey('macd', date, 'lte5'))
      ).toEqual([{ ticker: 'macd-lte5' }]);
    });
  });
});
