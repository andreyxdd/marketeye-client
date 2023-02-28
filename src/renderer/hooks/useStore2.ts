import { ICriteria, ITextfieldProps } from 'types';
import create from 'zustand';

interface IStore {
  selectedDate: string;
  availableDates: Array<string>;
  criterion: ICriteria;
  textfield: ITextfieldProps;
  isSingleTicker: boolean;
}

const initialState: IStore = {
  selectedDate: '',
  availableDates: [],
  criterion: 'one_day_avg_mf',
  textfield: {
    searchString: '',
    helperText: '',
    error: false,
  },
  isSingleTicker: false,
};

const useStore = create<IStore>(() => ({
  ...initialState,
}));

export default useStore;
