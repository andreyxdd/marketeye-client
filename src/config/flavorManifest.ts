import { AppMode } from './appMode';
import { MarketCode } from './market';

export type FlavorShape = 'circle' | 'rounded-square' | 'diamond' | 'hexagon';

export type BuildFlavor =
  | 'standard-us'
  | 'standard-to'
  | 'micro-us'
  | 'micro-to'
  | 'bounce-us';

export type FlavorManifestEntry = {
  key: BuildFlavor;
  mode: AppMode;
  market: MarketCode;
  productName: string;
  displayName: string;
  appId: string;
  releaseAppName: string;
  executableName: string;
  updatesFeedUrl: string;
  shape: FlavorShape;
  color: string;
  primaryDark?: string;
  primaryContrastText?: string;
  secondary?: string;
  secondaryContrastText?: string;
};

const UPDATES_FEED_BASE =
  'https://andreyxdd.github.io/marketeye-client/updates';

function updatesFeedUrlFor(releaseAppName: string): string {
  return `${UPDATES_FEED_BASE}/${releaseAppName}/`;
}

export const FLAVOR_MANIFEST: Record<BuildFlavor, FlavorManifestEntry> = {
  'standard-us': {
    key: 'standard-us',
    mode: 'standard',
    market: 'US',
    productName: 'MarketEye US',
    displayName: 'MarketEye',
    appId: 'com.marketeye.standard.us',
    releaseAppName: 'marketeye-us',
    executableName: 'MarketEye US',
    updatesFeedUrl: updatesFeedUrlFor('marketeye-us'),
    shape: 'circle',
    color: '#1976d2',
  },
  'standard-to': {
    key: 'standard-to',
    mode: 'standard',
    market: 'TO',
    productName: 'MarketEye TSX',
    displayName: 'MarketEye TSX',
    appId: 'com.marketeye.standard.to',
    releaseAppName: 'marketeye-tsx',
    executableName: 'MarketEye TSX',
    updatesFeedUrl: updatesFeedUrlFor('marketeye-tsx'),
    shape: 'rounded-square',
    color: '#1B2A4A',
    primaryDark: '#0F1A2E',
    primaryContrastText: '#FFFFFF',
    secondary: '#C9A227',
    secondaryContrastText: '#1B2A4A',
  },
  'micro-us': {
    key: 'micro-us',
    mode: 'micro',
    market: 'US',
    productName: 'MicroFTM',
    displayName: 'MicroFTM',
    appId: 'com.marketeye.micro.us',
    releaseAppName: 'microftm-us',
    executableName: 'MicroFTM',
    updatesFeedUrl: updatesFeedUrlFor('microftm-us'),
    shape: 'diamond',
    color: '#00897B',
    primaryDark: '#00695C',
  },
  'micro-to': {
    key: 'micro-to',
    mode: 'micro',
    market: 'TO',
    productName: 'MicroFTM TSX',
    displayName: 'MicroFTM TSX',
    appId: 'com.marketeye.micro.to',
    releaseAppName: 'microftm-tsx',
    executableName: 'MicroFTM TSX',
    updatesFeedUrl: updatesFeedUrlFor('microftm-tsx'),
    shape: 'hexagon',
    color: '#37474F',
    primaryDark: '#263238',
    primaryContrastText: '#FFFFFF',
    secondary: '#D4A574',
    secondaryContrastText: '#263238',
  },
  'bounce-us': {
    key: 'bounce-us',
    mode: 'bounce',
    market: 'US',
    productName: 'StockBounce',
    displayName: 'StockBounce',
    appId: 'com.marketeye.bounce.us',
    releaseAppName: 'bounce-us',
    executableName: 'StockBounce',
    updatesFeedUrl: updatesFeedUrlFor('bounce-us'),
    shape: 'circle',
    color: '#2C5F2D',
    primaryDark: '#1B4332',
    secondary: '#97BC62',
  },
};

export function getBuildFlavor(mode: AppMode, market: MarketCode): BuildFlavor {
  if (mode === 'bounce') {
    if (market === 'TO') {
      throw new Error('StockBounce supports MARKETEYE_MARKET=US only');
    }
    return 'bounce-us';
  }
  if (mode === 'micro') {
    return market === 'TO' ? 'micro-to' : 'micro-us';
  }
  return market === 'TO' ? 'standard-to' : 'standard-us';
}

export function getFlavorManifestEntry(
  mode: AppMode,
  market: MarketCode
): FlavorManifestEntry {
  return FLAVOR_MANIFEST[getBuildFlavor(mode, market)];
}
