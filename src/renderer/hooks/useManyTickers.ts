import { useQuery } from '@tanstack/react-query';
import shallow from 'zustand/shallow';
import { isMicro } from '../../config/appMode';
import { MARKET } from '../../config/market';
import useStore from './useStore';

function useManyTickers() {
  const [selectedDate, criterion, priceBand] = useStore(
    (state) => [state.selectedDate, state.criterion, state.priceBand],
    shallow
  );

  const query = useQuery(
    isMicro
      ? [MARKET, criterion, selectedDate, priceBand]
      : [MARKET, criterion, selectedDate],
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
