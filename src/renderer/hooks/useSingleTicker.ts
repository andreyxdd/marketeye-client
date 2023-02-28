import { useQuery } from '@tanstack/react-query';
import { IDataProps } from 'types';
import shallow from 'zustand/shallow';
import useStore from './useStore2';

function useSingleTicker() {
  const [selectedDate, ticker, isSingleTicker] = useStore(
    (state) => [
      state.selectedDate,
      state.textfield.searchString,
      state.isSingleTicker,
    ],
    shallow
  );

  const query = useQuery(
    [selectedDate, ticker, isSingleTicker],
    async () => {
      try {
        const singleTickerData: IDataProps | null =
          await window.electronAPI.getTickerAnalytics({
            date: selectedDate,
            ticker,
          });

        if (singleTickerData) return [singleTickerData];

        return [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e) {
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
