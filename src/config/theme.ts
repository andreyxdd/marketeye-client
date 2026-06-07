import { createTheme, Theme } from '@mui/material/styles';
import { APP_MODE, AppMode } from './appMode';
import { MARKET, MarketCode } from './market';
import {
  MICRO_TO_PRIMARY,
  MICRO_TO_PRIMARY_DARK,
  MICRO_TO_SECONDARY,
  MICRO_US_PRIMARY,
  MICRO_US_PRIMARY_DARK,
  TO_PRIMARY,
  TO_PRIMARY_DARK,
  TO_SECONDARY,
  US_PRIMARY,
  WHITE,
} from './palette';

export function getThemeForMarket(market: MarketCode): Theme {
  if (market === 'TO') {
    return createTheme({
      palette: {
        primary: {
          main: TO_PRIMARY,
          dark: TO_PRIMARY_DARK,
          contrastText: WHITE,
        },
        secondary: {
          main: TO_SECONDARY,
          contrastText: '#1B2A4A',
        },
      },
    });
  }

  return createTheme({
    palette: {
      primary: {
        main: US_PRIMARY,
      },
    },
  });
}

export function getThemeForBuild(market: MarketCode, mode: AppMode): Theme {
  if (mode === 'micro') {
    if (market === 'TO') {
      return createTheme({
        palette: {
          primary: {
            main: MICRO_TO_PRIMARY,
            dark: MICRO_TO_PRIMARY_DARK,
            contrastText: WHITE,
          },
          secondary: {
            main: MICRO_TO_SECONDARY,
            contrastText: '#263238',
          },
        },
      });
    }

    return createTheme({
      palette: {
        primary: {
          main: MICRO_US_PRIMARY,
          dark: MICRO_US_PRIMARY_DARK,
        },
      },
    });
  }

  return getThemeForMarket(market);
}

export function getAppTheme(): Theme {
  return getThemeForBuild(MARKET, APP_MODE);
}
