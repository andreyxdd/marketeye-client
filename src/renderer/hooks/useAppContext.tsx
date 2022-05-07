import { useContext } from 'react';
import { AppContext } from './AppContextProvider';
import { IAppContextProps } from '../../types';

// hook to resolve types
const useAppContext = () => useContext(AppContext) as IAppContextProps;

export default useAppContext;
