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
    () =>
      window.electronAPI.getAnalyticsListsByCriterion({
        criterion,
        date: selectedDate,
        ...(isMicro ? { price_band: priceBand } : {}),
      }),
    { enabled: !!selectedDate, staleTime: Infinity, retry: 1 }
  );

  return query;
}

export default useManyTickers;
