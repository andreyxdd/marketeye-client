/* eslint-disable */

export interface IDataProps {
  ticker: string;
  date: number;
  macd: number;
  one_day_avg_mf: number;
  three_day_avg_mf: number;
  one_day_open_close_change: number;
  volume: number;
  three_day_avg_volume: number;
  one_day_volume_change: number;
  three_day_avg_volume_change: number;
  one_day_close_change: number;
  three_day_avg_close_change: number;
  ema_3over9: Array<string>;
  ema_12over9: Array<string>;
  ema_12over26: Array<string>;
  ema_50over20: Array<string>;
  closingPriceChangeDay12: number;
  closingPriceChangeDay23: number;
  mfi: number;
  ema3: number;
  ema9: number;
  ema12: number;
  ema20: number;
  ema26: number;
  ema50: number;
}

export interface IDataByTypesProps {
  by_one_day_avg_mf: Array<IDataProps>;
  by_three_day_avg_mf: Array<IDataProps>;
  by_five_prec_open_close_change: Array<IDataProps>;
  by_volume: Array<IDataProps>;
  by_three_day_avg_volume: Array<IDataProps>;
}

export interface IDateProps {
  epoch: number;
  date_string: string;
}

export interface IAppContextProps {
  date: Date | null;
  setDate: React.Dispatch<React.SetStateAction<Date | null>>;
  data: IDataByTypesProps;
  setData: React.Dispatch<React.SetStateAction<IDataByTypesProps>>;
  dataType: string;
  setDataType: React.Dispatch<React.SetStateAction<string>>;
}
