import { GridColDef, GridValueFormatterParams } from '@mui/x-data-grid';

export const columnsDefinition: GridColDef[] = [
  {
    field: 'id',
    headerName: '#',
    width: 5,
    align: 'center',
    headerAlign: 'center',
    description: 'Ranking for the given creteria',
    hideable: false,
  },
  {
    field: 'ticker',
    headerName: 'Ticker',
    width: 70,
    renderCell: (params) => (
      <a
        href={`https://finance.yahoo.com/quote/${params.value}`}
        target="_blank"
        rel="noreferrer"
      >
        {params.value}
      </a>
    ),
    align: 'center',
    headerAlign: 'center',
    description: 'Stock symbol',
    disableColumnMenu: true,
    sortable: false,
    hideable: false,
  },
  {
    field: 'macd',
    headerName: 'MACD',
    type: 'number',
    width: 70,
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params: GridValueFormatterParams) => {
      return (params.value as number).toPrecision(4);
    },
    description:
      'Moving average convergence divergence. It is calculated by subtracting the 26-period EMA from the 12-period EMA',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'macd_2_sessions_ago',
    headerName: 'MACD 2 days ago',
    type: 'number',
    width: 140,
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params: GridValueFormatterParams) => {
      return (params.value as number).toPrecision(4);
    },
    description:
      'Moving average convergence divergence for the 2-days old session. So, it is calculated by subtracting the 27-period EMA from the 13-period EMA',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'macd_5_sessions_ago',
    headerName: 'MACD 5 days ago',
    type: 'number',
    width: 140,
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params: GridValueFormatterParams) => {
      return (params.value as number).toPrecision(4);
    },
    description:
      'Moving average convergence divergence for the 5-days old session. So, it is calculated by subtracting the 31-period EMA from the 17-period EMA',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'macd_20_sessions_ago',
    headerName: 'MACD 20 days ago',
    type: 'number',
    width: 140,
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params: GridValueFormatterParams) => {
      return (params.value as number).toPrecision(4);
    },
    description:
      'Moving average convergence divergence for the 20-days old session. So, it is calculated by subtracting the 46-period EMA from the 32-period EMA',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'one_day_avg_mf',
    headerName: '1-day Money Flow, $',
    width: 150,
    type: 'number',
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params: GridValueFormatterParams) => {
      const valueFormatted = Number(
        (params.value as number).toFixed(2)
      ).toLocaleString();
      return valueFormatted;
    },
    description: 'Money flow averaged over 1 day using typical price',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'three_day_avg_mf',
    headerName: '3-day Avg Money Flow, $',
    width: 170,
    type: 'number',
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params: GridValueFormatterParams) => {
      const valueFormatted = Number(
        (params.value as number).toFixed(2)
      ).toLocaleString();
      return valueFormatted;
    },
    description:
      'Money flow averaged over 3 days based on 1-day average money flows',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'one_day_open_close_change',
    headerName: '1-day Open-Close Change, %',
    width: 190,
    type: 'number',
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params: GridValueFormatterParams) => {
      const valueFormatted = Number(
        (params.value as number) * 100
      ).toLocaleString();
      return valueFormatted;
    },
    description: 'Precentage change between open and close prices',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'volume',
    headerName: 'Volume',
    width: 80,
    type: 'number',
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params: GridValueFormatterParams) => {
      const valueFormatted = Number(
        (params.value as number).toFixed(2)
      ).toLocaleString();
      return valueFormatted;
    },
    description: 'Stock volume',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'three_day_avg_volume',
    headerName: '3-day Avg Volume',
    width: 150,
    type: 'number',
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params: GridValueFormatterParams) => {
      const valueFormatted = Number(
        (params.value as number).toFixed(2)
      ).toLocaleString();
      return valueFormatted;
    },
    description: 'Stock volume averaged over three days',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'one_day_volume_change',
    headerName: '1-day Volume Change, %',
    width: 170,
    type: 'number',
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params: GridValueFormatterParams) => {
      const valueFormatted = Number(
        (params.value as number) * 100
      ).toLocaleString();
      return valueFormatted;
    },
    description:
      'Precentage change between closing volumes for the given trading day and the day before',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'three_day_avg_volume_change',
    headerName: '3-day Avg Volume Change, %',
    width: 200,
    type: 'number',
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params: GridValueFormatterParams) => {
      const valueFormatted = Number(
        (params.value as number) * 100
      ).toLocaleString();
      return valueFormatted;
    },
    description:
      'Precentage change between closing volumes for the given trading day and the day before averaged over three days',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'one_day_close_change',
    headerName: '1-day Close Change, %',
    width: 170,
    type: 'number',
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params: GridValueFormatterParams) => {
      const valueFormatted = Number(
        (params.value as number) * 100
      ).toLocaleString();
      return valueFormatted;
    },
    description:
      'Precentage change between closing prices for the given trading day and the day before',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'three_day_avg_close_change',
    headerName: '3-day Avg Close Change, %',
    width: 180,
    type: 'number',
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params: GridValueFormatterParams) => {
      const valueFormatted = Number(
        (params.value as number) * 100
      ).toLocaleString();
      return valueFormatted;
    },
    description:
      'Precentage change between closing prices for the given trading day and the day before averaged over three days',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'ema_3over9',
    headerName: 'EMA 3/9',
    width: 80,
    type: 'string',
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params: GridValueFormatterParams) => {
      return (params.value as Array<string>).join('-');
    },
    description: `Comparison between 3-day EMA and 9-day EMA. 'A' is above, 'B' is below. Three letters shows comparison for three last trading periods; one letter only for one trading period.`,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'ema_12over9',
    headerName: 'EMA 12/9',
    width: 90,
    type: 'string',
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params: GridValueFormatterParams) => {
      return (params.value as Array<string>).join('-');
    },
    description: `Comparison between 12-day EMA and 9-day EMA. 'A' is above, 'B' is below. Three letters shows comparison for three last trading periods; one letter only for one trading period.`,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'ema_12over26',
    headerName: 'EMA 12/26',
    width: 100,
    type: 'string',
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params: GridValueFormatterParams) => {
      return (params.value as Array<string>).join('-');
    },
    description: `Comparison between 12-day EMA and 26-day EMA. 'A' is above, 'B' is below. Three letters shows comparison for three last trading periods; one letter only for one trading period.`,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'ema_50over20',
    headerName: 'EMA 50/20',
    width: 100,
    type: 'string',
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params: GridValueFormatterParams) => {
      return (params.value as Array<string>).join('-');
    },
    description: `Comparison between 50-day EMA and 20-day EMA. 'A' is above, 'B' is below. Three letters shows comparison for three last trading periods; one letter only for one trading period.`,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'closingPriceChangeDay12',
    headerName: 'Days 1-2 Close Change, %',
    width: 180,
    type: 'number',
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params: GridValueFormatterParams) => {
      const valueFormatted = Number(
        (params.value as number) * 100
      ).toLocaleString();
      return valueFormatted;
    },
    description:
      'Precentage change between closing prices for the given trading day and the day before',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'closingPriceChangeDay23',
    headerName: 'Days 2-3 Close Change, %',
    width: 180,
    type: 'number',
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params: GridValueFormatterParams) => {
      const valueFormatted = Number(
        (params.value as number) * 100
      ).toLocaleString();
      return valueFormatted;
    },
    description:
      'Precentage change between closing prices for the trading day before given date and the day before that',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'mfi',
    headerName: 'Money Flow Index',
    width: 140,
    type: 'number',
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params: GridValueFormatterParams) => {
      const valueFormatted = Number(
        (params.value as number).toPrecision(4)
      ).toLocaleString();
      return valueFormatted;
    },
    description:
      'Money Flow Index - is a technical oscillator that uses price and volume data for identifying overbought or oversold signals in an asset. It can also be used to spot divergences which warn of a trend change in price. The oscillator moves between 0 and 100.',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'ema3',
    headerName: 'EMA3',
    width: 80,
    type: 'number',
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params: GridValueFormatterParams) => {
      const valueFormatted = Number(
        (params.value as number).toPrecision(4)
      ).toLocaleString();
      return valueFormatted;
    },
    description:
      'Exponential Moving Average for the period of three days from the given date (including)',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'ema9',
    headerName: 'EMA9',
    width: 80,
    type: 'number',
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params: GridValueFormatterParams) => {
      const valueFormatted = Number(
        (params.value as number).toPrecision(4)
      ).toLocaleString();
      return valueFormatted;
    },
    description:
      'Exponential Moving Average for the period of nine days from the given date (including)',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'ema12',
    headerName: 'EMA12',
    width: 80,
    type: 'number',
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params: GridValueFormatterParams) => {
      const valueFormatted = Number(
        (params.value as number).toPrecision(4)
      ).toLocaleString();
      return valueFormatted;
    },
    description:
      'Exponential Moving Average for the period of 12 days from the given date (including)',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'ema20',
    headerName: 'EMA20',
    width: 80,
    type: 'number',
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params: GridValueFormatterParams) => {
      const valueFormatted = Number(
        (params.value as number).toPrecision(4)
      ).toLocaleString();
      return valueFormatted;
    },
    description:
      'Exponential Moving Average for the period of 20 days from the given date (including)',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'ema26',
    headerName: 'EMA26',
    width: 80,
    type: 'number',
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params: GridValueFormatterParams) => {
      const valueFormatted = Number(
        (params.value as number).toPrecision(4)
      ).toLocaleString();
      return valueFormatted;
    },
    description:
      'Exponential Moving Average for the period of 26 days from the given date (including)',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'ema50',
    headerName: 'EMA50',
    width: 80,
    type: 'number',
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params: GridValueFormatterParams) => {
      const valueFormatted = Number(
        (params.value as number).toPrecision(4)
      ).toLocaleString();
      return valueFormatted;
    },
    description:
      'Exponential Moving Average for the period of 50 days from the given date (including)',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'mentions_over_one_day',
    headerName: 'Mentions Over 1 Day',
    width: 180,
    type: 'number',
    align: 'center',
    headerAlign: 'center',
    description:
      'Number of times the exact ticker string was mentioned in the news media within the last day',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'mentions_over_two_days',
    headerName: 'Mentions Over 2 Days',
    width: 180,
    type: 'number',
    align: 'center',
    headerAlign: 'center',
    description:
      'Number of times the exact ticker string was mentioned in the news media within the last two days',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'mentions_over_three_days',
    headerName: 'Mentions Over 3 Days',
    width: 180,
    type: 'number',
    align: 'center',
    headerAlign: 'center',
    description:
      'Number of times the exact ticker string was mentioned in the news media within the last three days',
    disableColumnMenu: true,
    sortable: false,
  },
];

interface IColumnsToShowProps {
  by_one_day_avg_mf: Array<string>;
  by_three_day_avg_mf: Array<string>;
  by_macd: Array<string>;
  // by_five_prec_open_close_change: Array<string>;
  by_volume: Array<string>;
  by_three_day_avg_volume: Array<string>;
  [key: string]: Array<string>;
}

export const columnsToShow: IColumnsToShowProps = {
  by_one_day_avg_mf: [
    'id',
    'ticker',
    'macd',
    'ema_3over9',
    'ema_12over9',
    'ema_12over26',
    'ema_50over20',
    'one_day_volume_change',
    'one_day_open_close_change',
    'one_day_avg_mf',
    'mfi',
  ],
  by_three_day_avg_mf: [
    'id',
    'ticker',
    'macd',
    'ema_3over9',
    'ema_12over9',
    'ema_12over26',
    'ema_50over20',
    'three_day_avg_volume_change',
    'three_day_avg_close_change',
    'closingPriceChangeDay12',
    'closingPriceChangeDay23',
    'three_day_avg_mf',
    'mfi',
  ],
  by_macd: [
    'id',
    'ticker',
    'macd',
    'macd_2_sessions_ago',
    'macd_5_sessions_ago',
    'macd_20_sessions_ago',
  ],
  /* by_five_prec_open_close_change: [
    'id',
    'ticker',
    'macd',
    'ema_3over9',
    'ema_12over9',
    'ema_12over26',
    'one_day_open_close_change',
    'one_day_avg_mf',
    'mfi',
  ], */
  by_volume: [
    'id',
    'ticker',
    'macd',
    'volume',
    'ema_3over9',
    'ema_12over9',
    'ema_12over26',
    'one_day_close_change',
    'one_day_avg_mf',
    'mfi',
  ],
  by_three_day_avg_volume: [
    'id',
    'ticker',
    'macd',
    'three_day_avg_volume',
    'ema_3over9',
    'ema_12over9',
    'ema_12over26',
    'three_day_avg_close_change',
    'three_day_avg_mf',
    'mfi',
  ],
};
