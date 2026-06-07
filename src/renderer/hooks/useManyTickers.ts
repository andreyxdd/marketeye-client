import { useQuery } from '@tanstack/react-query';
import shallow from 'zustand/shallow';
import { isMicro } from '../../config/appMode';
import { getManyTickersQueryKey } from '../lib/analyticsCache';
import useStore from './useStore';

function useManyTickers() {
  const [selectedDate, criterion, priceBand] = useStore(
    (state) => [state.selectedDate, state.criterion, state.priceBand],
    shallow
  );

  const queryKey = isMicro
    ? getManyTickersQueryKey(criterion, selectedDate, priceBand)
    : getManyTickersQueryKey(criterion, selectedDate);

  const query = useQuery(
    queryKey,
    async () => {
      try {
        const response = await window.electronAPI.getAnalyticsListsByCriterion({
          criterion,
          date: selectedDate,
          ...(isMicro ? { price_band: priceBand } : {}),
        });

        if (response) return response;
        throw new Error('Fetched data is null');
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
      return [];
    },
    { enabled: !!selectedDate, staleTime: Infinity }
  );

  return query;
}

export default useManyTickers;
