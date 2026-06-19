import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import shallow from 'zustand/shallow';
import { isMicro } from '../../config/appMode';
import { PRICE_BANDS, PriceBand } from '../../config/priceBands';
import {
  isBandCachePopulated,
  isCriterionCachedForBand,
  seedBandCache,
  seedCriterionCache,
} from '../lib/analyticsCache';
import { runWithMaxConcurrency } from '../lib/prefetchQueue';
import useStore from './useStore';

const PREFETCH_CONCURRENCY = 1;

function usePrefetchAnalytics(): void {
  const queryClient = useQueryClient();
  const [selectedDate, priceBand, criterion] = useStore(
    (state) => [state.selectedDate, state.priceBand, state.criterion],
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

      const response = await window.electronAPI.getAnalyticsListsByCriteria({
        date: selectedDate,
        ...(band ? { price_band: band } : {}),
      });
      if (isStale()) return;
      seedBandCache(queryClient, selectedDate, band, response);
    };

    const prefetchCriterionBand = async (band: PriceBand) => {
      if (isStale()) return;
      if (
        isCriterionCachedForBand(queryClient, criterion, selectedDate, band)
      ) {
        return;
      }

      const response = await window.electronAPI.getAnalyticsListsByCriterion({
        criterion,
        date: selectedDate,
        price_band: band,
      });
      if (isStale()) return;
      seedCriterionCache(
        queryClient,
        criterion,
        selectedDate,
        band,
        response
      );
    };

    const prefetchBandSafe = async (band?: PriceBand) => {
      try {
        await prefetchBand(band);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Prefetch failed for band', band ?? '(standard)', e);
      }
    };

    const prefetchCriterionBandSafe = async (band: PriceBand) => {
      try {
        await prefetchCriterionBand(band);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Criterion prefetch failed for band', band, e);
      }
    };

    const prefetchOtherBandsLazy = (bands: PriceBand[]) => {
      if (bands.length === 0) return;
      void runWithMaxConcurrency(
        bands.map((band) => () => prefetchBandSafe(band)),
        PREFETCH_CONCURRENCY
      );
    };

    const prefetchOtherCriterionBandsLazy = (bands: PriceBand[]) => {
      if (bands.length === 0) return;
      void runWithMaxConcurrency(
        bands.map((band) => () => prefetchCriterionBandSafe(band)),
        PREFETCH_CONCURRENCY
      );
    };

    const run = async () => {
      if (isMicro) {
        await prefetchBandSafe(priceBand);
        if (isStale()) return;

        const otherBands = PRICE_BANDS.filter((b) => b !== priceBand);
        prefetchOtherBandsLazy(otherBands);
        if (isStale()) return;

        await prefetchCriterionBandSafe(priceBand);
        if (isStale()) return;

        prefetchOtherCriterionBandsLazy(otherBands);
      } else {
        await prefetchBandSafe();
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [queryClient, selectedDate, priceBand, criterion]);
}

export default usePrefetchAnalytics;
