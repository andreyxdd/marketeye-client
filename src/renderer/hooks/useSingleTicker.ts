import { useQuery } from '@tanstack/react-query';
import { IDataProps } from 'types';
import shallow from 'zustand/shallow';
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
    [selectedDate, ticker, isSingleTicker, criterion],
    async () => {
      try {
        const singleTickerData: IDataProps | null =
          await window.electronAPI.getTickerAnalytics({
            date: selectedDate,
            ticker,
            criterion,
          });

        if (singleTickerData) return [singleTickerData];

        return [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
        return [];
      }
    },
    {
      enabled: !!selectedDate && isSingleTicker && !!ticker,
      staleTime: Infinity,
    }
  );

  return query;
}

export default useSingleTicker;
