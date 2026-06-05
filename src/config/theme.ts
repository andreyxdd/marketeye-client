import { createTheme, Theme } from '@mui/material/styles';
import { MARKET, MarketCode } from './market';

const US_PRIMARY = '#1976d2';

const TO_PRIMARY = '#1B2A4A';
const TO_PRIMARY_DARK = '#0F1A2E';
const TO_SECONDARY = '#C9A227';

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

export function getAppTheme(): Theme {
  return getThemeForMarket(MARKET);
}
