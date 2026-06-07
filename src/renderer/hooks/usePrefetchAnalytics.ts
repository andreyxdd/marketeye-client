import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import shallow from 'zustand/shallow';
import { isMicro } from '../../config/appMode';
import { PRICE_BANDS, PriceBand } from '../../config/priceBands';
import { isBandCachePopulated, seedBandCache } from '../lib/analyticsCache';
import { runWithMaxConcurrency } from '../lib/prefetchQueue';
import useStore from './useStore';

function usePrefetchAnalytics(): void {
  const queryClient = useQueryClient();
  const [selectedDate, priceBand] = useStore(
    (state) => [state.selectedDate, state.priceBand],
    shallow
  );
  const generationRef = useRef(0);

  useEffect(() => {
    if (!selectedDate) return undefined;

    generationRef.current += 1;
    const generation = generationRef.current;
    let cancelled = false;

    const isStale = () => cancelled || generation !== generationRef.current;

    const prefetchBand = async (band?: PriceBand) => {
      if (isStale()) return;
      if (isBandCachePopulated(queryClient, selectedDate, band)) return;

      try {
        const response = await window.electronAPI.getAnalyticsListsByCriteria({
          date: selectedDate,
          ...(band ? { price_band: band } : {}),
        });
        if (isStale() || !response) return;
        seedBandCache(queryClient, selectedDate, band, response);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Prefetch failed for band', band ?? '(standard)', e);
      }
    };

    const run = async () => {
      if (isMicro) {
        await prefetchBand(priceBand);
        if (isStale()) return;

        const otherBands = PRICE_BANDS.filter((b) => b !== priceBand);
        await runWithMaxConcurrency(
          otherBands.map((band) => () => prefetchBand(band)),
          2
        );
      } else {
        await prefetchBand();
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [queryClient, selectedDate, priceBand]);
}

export default usePrefetchAnalytics;
