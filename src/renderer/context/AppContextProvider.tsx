import React, { useState, createContext, useEffect } from 'react';
import {
  IAppContextProps,
  IDateProps,
  IDataByTypesProps,
  IDataProps,
} from '../../types';

export const AppContext = createContext<IAppContextProps | null>(null);

interface IAppContextProviderProps {
  children: React.ReactNode;
}

const AppContextProvider: React.FC<IAppContextProviderProps> = ({
  children,
}) => {
  const [dates, setDates] = useState<Array<IDateProps>>([]);
  const [data, setData] = useState<IDataByTypesProps>({
    by_one_day_avg_mf: [],
    by_three_day_avg_mf: [],
    by_five_prec_open_close_change: [],
    by_volume: [],
    by_three_day_avg_volume: [],
  });
  const [dataType, setDataType] = useState<string>('by_one_day_avg_mf');

  const providerValue: IAppContextProps = {
    dates,
    setDates,
    data,
    setData,
    dataType,
    setDataType,
  };

  useEffect(() => {
    // eslint-disable-next-line func-names
    (async function () {
      const response: IDataProps | null =
        await window.electronAPI.getTickerAnalytics({
          date: '2021-12-29',
          ticker: 'TSLA',
        });

      if (response) {
        setData({
          by_one_day_avg_mf: [response],
          by_three_day_avg_mf: [response],
          by_five_prec_open_close_change: [response],
          by_volume: [response],
          by_three_day_avg_volume: [response],
        });
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
