import React, { useState, createContext, useEffect } from 'react';
import {
  IAppContextProps,
  IDataByTypesProps,
  IDataProps,
  IDateProps,
  ITextFieldProps,
} from '../../types';
import usePrevious from './usePrevious';

export const AppContext = createContext<IAppContextProps | null>(null);

interface IAppContextProviderProps {
  children: React.ReactNode;
}

const AppContextProvider: React.FC<IAppContextProviderProps> = ({
  children,
}) => {
  const [textField, setTextField] = useState<ITextFieldProps>({
    searchString: '',
    helperText: '',
    error: false,
    on: false,
  });
  const [date, setDate] = useState<string>('');
  const [availableDates, setAvailableDates] = useState<Array<string>>([]);
  const [data, setData] = useState<IDataByTypesProps | null>(null);
  const [dataToPresent, setDataToPresent] = useState<IDataByTypesProps | null>(
    null
  );
  const [dataType, setDataType] = useState<string>('by_one_day_avg_mf');
  const [dataIsLoaded, setDataIsLoaded] = useState<boolean>(false);

  const prevDate = usePrevious(date);
  const prevTextField = usePrevious(textField);

  const providerValue: IAppContextProps = {
    textField,
    setTextField,
    date,
    setDate,
    availableDates,
    setAvailableDates,
    data,
    setData,
    dataToPresent,
    setDataToPresent,
    dataType,
    setDataType,
    dataIsLoaded,
    setDataIsLoaded,
  };

  // fetch avaiable dates and show the last one on the view
  // on mount
  useEffect(() => {
    // eslint-disable-next-line func-names
    (async function () {
      try {
        const response: Array<IDateProps> = await window.electronAPI.getDates();
        const datesArray: Array<string> = response.map(
          ({ date_string }) => date_string
        );

        // to avoid error when computing nomarlized CVI the last date
        // (with index '0') is removed from available dates
        datesArray.shift();

        const nDates = datesArray.length;

        setAvailableDates(datesArray);

        if (nDates > 0) {
          setDate(datesArray[nDates - 1]);
        } else {
          throw new Error('datesArray is empty');
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  useEffect(() => {
    setDataIsLoaded(false);

    // --- FUNCTIONS INITIALIZATION ---
    const fetchDataByType = async () => {
      try {
        const response: IDataByTypesProps | null =
          await window.electronAPI.getAnalyticsListsByCriteria({
            date,
          });

        if (response) {
          setData(response);
          setDataToPresent(response);
          setDataIsLoaded(true);
        }
      } catch (e) {
        console.log(e);
      }
    };

    const fetchOneTickerData = async () => {
      try {
        if (textField.searchString) {
          const response: IDataProps | null =
            await window.electronAPI.getTickerAnalytics({
              date,
              ticker: textField.searchString,
            });

          if (response) {
            setDataToPresent({
              by_one_day_avg_mf: [response],
              by_three_day_avg_mf: [response],
              by_five_prec_open_close_change: [response],
              by_volume: [response],
              by_three_day_avg_volume: [response],
            });
            setDataIsLoaded(true);
          } else {
            setTextField({
              ...textField,
              helperText: 'Incorrect input ticker symbol',
              error: true,
            });
          }
        }
      } catch (e) {
        console.log(e);
      }
    };
    // -------------------------------

    if (date) {
      // make sure date is not empty
      if (textField.on) {
        console.log('textField is on');
        // search ticker is on
        fetchOneTickerData();
      } else {
        // eslint-disable-next-line no-lonely-if
        if (
          prevDate !== date ||
          data === null ||
          prevTextField?.on !== textField.on
        ) {
          // on mount and on date change
          fetchDataByType();
        } else {
          setDataToPresent(data);
          setDataIsLoaded(true);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, textField.on]);

  return (
    <AppContext.Provider value={providerValue as IAppContextProps}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
