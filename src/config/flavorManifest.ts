import { AppMode } from './appMode';
import { MarketCode } from './market';

export type FlavorShape = 'circle' | 'rounded-square' | 'diamond' | 'hexagon';

export type BuildFlavor =
  | 'standard-us'
  | 'standard-to'
  | 'micro-us'
  | 'micro-to';

export type FlavorManifestEntry = {
  key: BuildFlavor;
  mode: AppMode;
  market: MarketCode;
  productName: string;
  appId: string;
  releaseAppName: string;
  executableName: string;
  shape: FlavorShape;
  color: string;
};

export const FLAVOR_MANIFEST: Record<BuildFlavor, FlavorManifestEntry> = {
  'standard-us': {
    key: 'standard-us',
    mode: 'standard',
    market: 'US',
    productName: 'MarketEye US',
    appId: 'com.marketeye.standard.us',
    releaseAppName: 'marketeye-us',
    executableName: 'MarketEye US',
    shape: 'circle',
    color: '#1976d2',
  },
  'standard-to': {
    key: 'standard-to',
    mode: 'standard',
    market: 'TO',
    productName: 'MarketEye TSX',
    appId: 'com.marketeye.standard.to',
    releaseAppName: 'marketeye-tsx',
    executableName: 'MarketEye TSX',
    shape: 'rounded-square',
    color: '#1B2A4A',
  },
  'micro-us': {
    key: 'micro-us',
    mode: 'micro',
    market: 'US',
    productName: 'MicroFTM',
    appId: 'com.marketeye.micro.us',
    releaseAppName: 'microftm-us',
    executableName: 'MicroFTM',
    shape: 'diamond',
    color: '#00897B',
  },
  'micro-to': {
    key: 'micro-to',
    mode: 'micro',
    market: 'TO',
    productName: 'MicroFTM TSX',
    appId: 'com.marketeye.micro.to',
    releaseAppName: 'microftm-tsx',
    executableName: 'MicroFTM TSX',
    shape: 'hexagon',
    color: '#37474F',
  },
};

export function getBuildFlavor(mode: AppMode, market: MarketCode): BuildFlavor {
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
