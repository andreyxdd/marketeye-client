import { useQuery } from '@tanstack/react-query';
import { MARKET, showMarketWidePanel } from '../../config/market';
import useStore from './useStore';

function useMarketData() {
  const date = useStore((state) => state.selectedDate);
  const query = useQuery(
    ['market-wide', MARKET, date],
    () => window.electronAPI.getMarketAnalytics({ date }),
    { enabled: showMarketWidePanel && !!date, staleTime: Infinity }
  );
  return query;
}

export default useMarketData;
