import { useQuery } from '@tanstack/react-query';
import { IMarketDataProps } from 'types';
import { MARKET, showMarketWidePanel } from '../../config/market';
import useStore from './useStore';

function useMarketData() {
  const date = useStore((state) => state.selectedDate);
  const query = useQuery(
    ['market-wide', MARKET, date],
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
    { enabled: showMarketWidePanel && !!date, staleTime: Infinity }
  );
  return query;
}

export default useMarketData;
