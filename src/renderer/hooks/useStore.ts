/* eslint-disable no-console */
import create from 'zustand';
import {
  IDateProps,
  IDataByTypesProps,
  IDataProps,
  ITextfieldProps,
} from '../../types';

interface IState {
  selectedDate: string;
  availableDates: Array<string>;
  manyTickersData: IDataByTypesProps | null;
  currentData: IDataByTypesProps | null;
  currentDataIsLoaded: boolean;
  manyTickersDataIsLoaded: boolean;
  showOneTickerData: boolean;
  dataType: string;
  textfield: ITextfieldProps;
  loadPrecentage: number;
}

const initialState: IState = {
  selectedDate: '',
  availableDates: [],
  manyTickersData: null,
  currentData: null,
  currentDataIsLoaded: false,
  manyTickersDataIsLoaded: false,
  showOneTickerData: false,
  dataType: 'by_one_day_avg_mf',
  textfield: {
    searchString: '',
    helperText: '',
    error: false,
  },
  loadPrecentage: 0,
};

/* eslint-disable no-unused-vars */
export interface IStore extends IState {
  setSelectedDate: (selectedDate: string) => void;
  onMountFetch: () => void;
  setDataType: (dataType: string) => void;
  fetchAndSetManyTickerData: () => void;
  fetchAndSetOneTickerData: () => void;
  setTextfield: (textfield: ITextfieldProps) => void;
  clearTextfield: () => void;
}
/* eslint-enable no-unused-vars */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useStore = create<IStore>((set: any, get: any) => ({
  ...initialState,
  setSelectedDate: (selectedDate: string) =>
    set({
      selectedDate,
      currentDataIsLoaded: false,
      manyTickersDataIsLoaded: false,
    }),
  fetchAndSetManyTickerData: async () => {
    const date = get().selectedDate;
    try {
      if (date) {
        const onDayAvgMF =
          await window.electronAPI.getAnalyticsListsByCriterion({
            criterion: 'one_day_avg_mf',
            date,
          });

        for (let i = 0; i < 20; i += 1)
          set((state: IStore) => ({
            loadPrecentage: state.loadPrecentage + 1,
          }));

        const threeDayAvgMF =
          await window.electronAPI.getAnalyticsListsByCriterion({
            criterion: 'three_day_avg_mf',
            date,
          });

        for (let i = 0; i < 20; i += 1)
          set((state: IStore) => ({
            loadPrecentage: state.loadPrecentage + 1,
          }));

        const macd = await window.electronAPI.getAnalyticsListsByCriterion({
          criterion: 'macd',
          date,
        });

        for (let i = 0; i < 20; i += 1)
          set((state: IStore) => ({
            loadPrecentage: state.loadPrecentage + 1,
          }));

        const volume = await window.electronAPI.getAnalyticsListsByCriterion({
          criterion: 'volume',
          date,
        });

        for (let i = 0; i < 20; i += 1)
          set((state: IStore) => ({
            loadPrecentage: state.loadPrecentage + 1,
          }));

        const threeDayAvgVolume =
          await window.electronAPI.getAnalyticsListsByCriterion({
            criterion: 'three_day_avg_volume',
            date,
          });

        for (let i = 0; i < 20; i += 1)
          set((state: IStore) => ({
            loadPrecentage: state.loadPrecentage + 1,
          }));

        const manyTickersData: IDataByTypesProps = {
          by_one_day_avg_mf: onDayAvgMF?.one_day_avg_mf || [],
          by_three_day_avg_mf: threeDayAvgMF?.three_day_avg_mf || [],
          by_macd: macd?.macd || [],
          by_volume: volume?.volume || [],
          by_three_day_avg_volume:
            threeDayAvgVolume?.three_day_avg_volume || [],
        };

        if (manyTickersData) {
          set({
            manyTickersData,
            currentDataIsLoaded: true,
            manyTickersDataIsLoaded: true,
          });

          if (!get().showOneTickerData) set({ currentData: manyTickersData });
        }
      }
    } catch (e) {
      console.log(e);
    }
  },
  fetchAndSetOneTickerData: async () => {
    const currTextfield = get().textfield;
    const date = get().selectedDate;
    try {
      if (currTextfield.searchString) {
        const oneTickerData: IDataProps | null =
          await window.electronAPI.getTickerAnalytics({
            date,
            ticker: currTextfield.searchString,
          });

        if (oneTickerData) {
          set({
            currentData: {
              by_one_day_avg_mf: [oneTickerData],
              by_three_day_avg_mf: [oneTickerData],
              by_volume: [oneTickerData],
              by_three_day_avg_volume: [oneTickerData],
            },
            currentDataIsLoaded: true,
            showOneTickerData: true,
          });
        } else {
          set({
            currentData: get().manyTickersData,
            textfield: {
              searchString: currTextfield.searchString,
              helperText: 'Incorrect input',
              error: true,
            },
            currentDataIsLoaded: true,
            showOneTickerData: false,
          });
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e) {
      console.log(e);
    }
  },
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

        set({
          availableDates,
          selectedDate,
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
  setTextfield: (textfield: ITextfieldProps) =>
    set({ textfield, currentData: get().manyTickersData }),
  clearTextfield: () =>
    set({
      textfield: { searchString: '', helperText: '', error: false },
      showOneTickerData: false,
      currentData: get().manyTickersDataIsLoaded ? get().manyTickersData : null,
    }),
}));

export default useStore;
