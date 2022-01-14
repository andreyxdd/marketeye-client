import React, { useState, createContext, useEffect } from 'react';
import { IAppContextProps, IDataByTypesProps, IDataProps } from '../../types';

export const AppContext = createContext<IAppContextProps | null>(null);

interface IAppContextProviderProps {
  children: React.ReactNode;
}

const AppContextProvider: React.FC<IAppContextProviderProps> = ({
  children,
}) => {
  const [date, setDate] = useState<Date | null>(null);
  const [data, setData] = useState<IDataByTypesProps>({
    by_one_day_avg_mf: [],
    by_three_day_avg_mf: [],
    by_five_prec_open_close_change: [],
    by_volume: [],
    by_three_day_avg_volume: [],
  });
  const [dataToPresent, setDataToPresent] = useState<IDataByTypesProps>({
    by_one_day_avg_mf: [],
    by_three_day_avg_mf: [],
    by_five_prec_open_close_change: [],
    by_volume: [],
    by_three_day_avg_volume: [],
  });
  const [dataType, setDataType] = useState<string>('by_one_day_avg_mf');

  const providerValue: IAppContextProps = {
    date,
    setDate,
    data,
    setData,
    dataToPresent,
    setDataToPresent,
    dataType,
    setDataType,
  };

  useEffect(() => {
    // eslint-disable-next-line func-names
    (async function () {
      try {
        const response: IDataProps | null =
          await window.electronAPI.getTickerAnalytics({
            date: '2021-12-29',
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
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  return (
    <AppContext.Provider value={providerValue as IAppContextProps}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
