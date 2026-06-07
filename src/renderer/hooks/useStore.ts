import { ICriteria, ITextfieldProps } from 'types';
import create from 'zustand';
import { PriceBand } from '../../config/priceBands';

interface IStore {
  selectedDate: string;
  availableDates: Array<string>;
  criterion: ICriteria;
  priceBand: PriceBand;
  textfield: ITextfieldProps;
  isSingleTicker: boolean;
}

const initialState: IStore = {
  selectedDate: '',
  availableDates: [],
  criterion: 'one_day_avg_mf',
  priceBand: 'lte5',
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
