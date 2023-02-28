import { useQuery } from '@tanstack/react-query';
import { IMarketDataProps } from 'types';
import useStore from './useStore';

function useMarketData() {
  const date = useStore((state) => state.selectedDate);
  const query = useQuery(
    ['market', date],
    async () => {
      try {
        const response: IMarketDataProps | null =
          await window.electronAPI.getMarketAnalytics({ date });
        if (response) return response;
        return null;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
        return null;
      }
    },
    { enabled: !!date, staleTime: Infinity }
  );
  return query;
}

export default useMarketData;
