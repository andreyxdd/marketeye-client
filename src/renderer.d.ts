import {
  IDataProps,
  IDateProps,
  IDataByTypesProps,
  IMarketDataProps,
} from 'types';
import { BounceTransport } from './renderer/bounce/types';

export interface IRequest {
  date: string;
  ticker?: string;
  criterion?: string;
  price_band?: string;
}

export interface IEmail {
  body: string;
  subject: string;
}

export interface INotificationStatus {
  ok: boolean;
  error: string;
}

export interface IElectronAPIConn {
  myPing: () => Promise<void>;
  on: () => Promise<void>;
  once: () => Promise<void>;
}

export interface IElectronAPI extends BounceTransport {
  getTickerAnalytics: (req: IRequest) => Promise<IDataProps>;
  getAnalyticsListsByCriteria: (req: IRequest) => Promise<IDataByTypesProps>;
  getAnalyticsListsByCriterion: (req: IRequest) => Promise<Array<IDataProps>>;
  getDates: () => Promise<Array<IDateProps>>;
  getMarketAnalytics: (req: IRequest) => Promise<IMarketDataProps | null>;
  notifyDeveloper: (req: IEmail) => Promise<INotificationStatus>;
  conn: IElectronAPIConn;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
