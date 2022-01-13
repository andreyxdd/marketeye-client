import { IDataProps, IDateProps } from 'types';

export interface IRequest {
  date: string;
  ticker: string;
}

export interface IElectronAPIConn {
  myPing: () => Promise<void>;
  on: () => Promise<void>;
  once: () => Promise<void>;
}

export interface IElectronAPI {
  getTickerAnalytics: (req: IRequest) => Promise<IDataProps | null>;
  getDates: () => Promise<Array<IDateProps>>;
  conn: IElectronAPIConn;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
