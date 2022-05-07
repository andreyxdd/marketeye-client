import create from 'zustand';
import { IDateProps, IDataByTypesProps } from '../../types';

interface IState {
  selectedDate: string;
  availableDates: Array<string>;
  manyTickersData: IDataByTypesProps | null;
  oneTickerData: IDataByTypesProps | null;
  currentData: IDataByTypesProps | null;
  showOneTickerData: boolean;
  dataType: string;
  // textfield: ITextFieldProps;
}

const initialState: IState = {
  selectedDate: '',
  availableDates: [],
  manyTickersData: null,
  oneTickerData: null,
  currentData: null,
  showOneTickerData: false,
  dataType: 'by_one_day_avg_mf',
};

/* eslint-disable no-unused-vars */
export interface IStore extends IState {
  setSelectedDate: (selectedDate: string) => void;
  onMountFetch: () => void;
  setDataType: (dataType: string) => void;
}
/* eslint-enable no-unused-vars */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useStore = create<IStore>((set: any) => ({
  ...initialState,
  setSelectedDate: (selectedDate: string) => set({ selectedDate }),
  onMountFetch: async () => {
    try {
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
        const manyTickersData: IDataByTypesProps | null =
          await window.electronAPI.getAnalyticsListsByCriteria({
            date: selectedDate,
          });

        set({
          availableDates,
          selectedDate,
          manyTickersData,
          currentData: manyTickersData,
        });
      } else {
        throw new Error('datesArray is empty');
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  },
  setDataType: (dataType: string) => set({ dataType }),
}));

export default useStore;
