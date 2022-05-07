/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, createContext } from 'react';
import {
  IAppContextProps,
  IDataByTypesProps,
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
  const [dataIsLoaded, setDataIsLoaded] = useState<boolean>(false);

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

  return (
    <AppContext.Provider value={providerValue as IAppContextProps}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
