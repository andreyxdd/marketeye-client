import { createTheme, Theme } from '@mui/material/styles';
import { APP_MODE, AppMode } from './appMode';
import { MARKET, MarketCode } from './market';

const US_PRIMARY = '#1976d2';

const TO_PRIMARY = '#1B2A4A';
const TO_PRIMARY_DARK = '#0F1A2E';
const TO_SECONDARY = '#C9A227';

const MICRO_US_PRIMARY = '#00897B';
const MICRO_US_PRIMARY_DARK = '#00695C';

const MICRO_TO_PRIMARY = '#37474F';
const MICRO_TO_PRIMARY_DARK = '#263238';
const MICRO_TO_SECONDARY = '#D4A574';

export function getThemeForMarket(market: MarketCode): Theme {
  if (market === 'TO') {
    return createTheme({
      palette: {
        primary: {
          main: TO_PRIMARY,
          dark: TO_PRIMARY_DARK,
          contrastText: '#FFFFFF',
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
            contrastText: '#FFFFFF',
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
