import { createTheme, Theme } from '@mui/material/styles';
import { APP_MODE, AppMode } from './appMode';
import { MARKET, MarketCode } from './market';
import { getFlavorManifestEntry } from './flavorManifest';

export function getThemeForBuild(market: MarketCode, mode: AppMode): Theme {
  const entry = getFlavorManifestEntry(mode, market);
  return createTheme({
    palette: {
      primary: {
        main: entry.color,
        ...(entry.primaryDark ? { dark: entry.primaryDark } : {}),
        ...(entry.primaryContrastText
          ? { contrastText: entry.primaryContrastText }
          : {}),
      },
      ...(entry.secondary
        ? {
            secondary: {
              main: entry.secondary,
              ...(entry.secondaryContrastText
                ? { contrastText: entry.secondaryContrastText }
                : {}),
            },
          }
        : {}),
    },
  });
}

export function getThemeForMarket(market: MarketCode): Theme {
  return getThemeForBuild(market, 'standard');
}

export function getAppTheme(): Theme {
  return getThemeForBuild(MARKET, APP_MODE);
}
