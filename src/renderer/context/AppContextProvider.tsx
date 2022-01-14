import React, { useState, createContext, useEffect } from 'react';
import {
  IAppContextProps,
  IDataByTypesProps,
  IDataProps,
  IDateProps,
  ITextFieldProps,
} from '../../types';

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
  };

  useEffect(() => {
    // eslint-disable-next-line func-names
    // eslint-disable-next-line spaced-comment
    /*
    (async function () {
      try {
        const response: IDataByTypesProps | null =
          await window.electronAPI.getAnalyticsListsByCriteria({
            date: '2021-12-29',
          });

        if (response) {
          setData(response);
          setDataToPresent(response);
        }
      } catch (e) {
        console.log(e);
      }
    })();*/

    // eslint-disable-next-line func-names
    (async function () {
      try {
        const response: Array<IDateProps> = await window.electronAPI.getDates();
        const datesArray: Array<string> = response.map(
          ({ date_string }) => date_string
        );
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
    if (date) {
      // eslint-disable-next-line func-names
      (async function () {
        try {
          if (textField.on) {
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
              } else {
                setTextField({
                  ...textField,
                  helperText: 'Incorrect input ticker symbol',
                  error: true,
                });
              }
            } else {
              setTextField({
                ...textField,
                helperText: 'Input is empty',
                error: true,
              });
            }
          } else {
            const response: IDataProps | null =
              await window.electronAPI.getTickerAnalytics({
                date,
                ticker: 'TSLA',
              });

            if (response) {
              const temp = {
                by_one_day_avg_mf: [response],
                by_three_day_avg_mf: [response],
                by_five_prec_open_close_change: [response],
                by_volume: [response],
                by_three_day_avg_volume: [response],
              };

              setData(temp);
              setDataToPresent(temp);
            }
          }
        } catch (e) {
          console.log(e);
        }
      })();
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
