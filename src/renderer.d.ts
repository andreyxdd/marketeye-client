import {
  IDataProps,
  IDateProps,
  IDataByTypesProps,
  IMarketDataProps,
} from 'types';

export interface IRequest {
  date: string;
  ticker?: string;
}

export interface IElectronAPIConn {
  myPing: () => Promise<void>;
  on: () => Promise<void>;
  once: () => Promise<void>;
}

export interface IElectronAPI {
  getTickerAnalytics: (req: IRequest) => Promise<IDataProps | null>;
  getAnalyticsListsByCriteria: (
    req: IRequest
  ) => Promise<IDataByTypesProps | null>;
  getDates: () => Promise<Array<IDateProps>>;
  getMarketAnalytics: (req: IRequest) => Promise<IMarketDataProps | null>;
  conn: IElectronAPIConn;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
