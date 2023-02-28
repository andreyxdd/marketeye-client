import { useQuery } from '@tanstack/react-query';
import shallow from 'zustand/shallow';
import useStore from './useStore';

function useManyTickers() {
  const [selectedDate, criterion] = useStore(
    (state) => [state.selectedDate, state.criterion],
    shallow
  );

  const query = useQuery(
    [criterion, selectedDate],
    async () => {
      try {
        const response = await window.electronAPI.getAnalyticsListsByCriterion({
          criterion,
          date: selectedDate,
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
