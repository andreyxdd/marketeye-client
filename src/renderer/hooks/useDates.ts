import { useQuery } from '@tanstack/react-query';
import { IDateProps } from 'types';
import { MARKET } from '../../config/market';
import useStore from './useStore';

const useDates = () => {
  const query = useQuery<Array<string>>(
    ['dates', MARKET],
    async () => {
      const responseAvailableDates: Array<IDateProps> =
        await window.electronAPI.getDates();
      const availableDates: Array<string> = responseAvailableDates.map(
        ({ date_string }) => date_string
      );

      // to avoid error when computing nomarlized CVI the last date
      // (with index '0') is removed from available dates
      availableDates.shift();

      const nDates = availableDates.length;
      if (nDates > 0) {
        const selectedDate = availableDates[nDates - 1];
        useStore.setState({ selectedDate });
        return availableDates;
      }
      throw new Error('datesArray is empty');
    },
    { staleTime: Infinity }
  );

  return query;
};

export default useDates;
