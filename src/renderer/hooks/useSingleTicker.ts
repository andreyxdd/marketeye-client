import { useQuery } from '@tanstack/react-query';
import { IDataProps } from 'types';
import shallow from 'zustand/shallow';
import { MARKET } from '../../config/market';
import useStore from './useStore';

function useSingleTicker() {
  const [selectedDate, ticker, isSingleTicker, criterion] = useStore(
    (state) => [
      state.selectedDate,
      state.textfield.searchString,
      state.isSingleTicker,
      state.criterion,
    ],
    shallow
  );

  const query = useQuery(
    [MARKET, selectedDate, ticker, isSingleTicker, criterion],
    async () => {
      const singleTickerData: IDataProps =
        await window.electronAPI.getTickerAnalytics({
          date: selectedDate,
          ticker,
          criterion,
        });

      return [singleTickerData];
    },
    {
      enabled: !!selectedDate && isSingleTicker && !!ticker,
      staleTime: Infinity,
    }
  );

  return query;
}

export default useSingleTicker;
