import {
  getBuildFlavor,
  getFlavorIconDir,
  getFlavorManifestEntry,
  getIconAssetPath,
} from '../config/buildFlavor';

describe('getBuildFlavor', () => {
  it('returns standard-us for standard US', () => {
    expect(getBuildFlavor('standard', 'US')).toBe('standard-us');
  });

  it('returns standard-to for standard TO', () => {
    expect(getBuildFlavor('standard', 'TO')).toBe('standard-to');
  });

  it('returns micro-us for micro US', () => {
    expect(getBuildFlavor('micro', 'US')).toBe('micro-us');
  });

  it('returns micro-to for micro TO', () => {
    expect(getBuildFlavor('micro', 'TO')).toBe('micro-to');
  });
});

describe('getFlavorManifestEntry', () => {
  it('returns distinct packaging identity for US vs TO standard builds', () => {
    const us = getFlavorManifestEntry('standard', 'US');
    const to = getFlavorManifestEntry('standard', 'TO');

    expect(us.appId).toBe('com.marketeye.standard.us');
    expect(to.appId).toBe('com.marketeye.standard.to');
    expect(us.executableName).toBe('MarketEye US');
    expect(to.executableName).toBe('MarketEye TSX');
  });
});

describe('getIconAssetPath', () => {
  it('points at standard-us flavor icon for standard US builds', () => {
    expect(getIconAssetPath('standard', 'US')).toBe(
      'assets/flavors/standard-us/icon.png'
    );
    expect(getIconAssetPath('standard', 'US', 'icon.ico')).toBe(
      'assets/flavors/standard-us/icon.ico'
    );
  });

  it('points at standard-to flavor icon for standard TO builds', () => {
    expect(getIconAssetPath('standard', 'TO')).toBe(
      'assets/flavors/standard-to/icon.png'
    );
    expect(getIconAssetPath('standard', 'TO', 'icon.ico')).toBe(
      'assets/flavors/standard-to/icon.ico'
    );
  });

  it('points at micro flavor icons for micro builds', () => {
    expect(getIconAssetPath('micro', 'US')).toBe(
      'assets/flavors/micro-us/icon.png'
    );
    expect(getIconAssetPath('micro', 'TO', 'icon.ico')).toBe(
      'assets/flavors/micro-to/icon.ico'
    );
  });
});

describe('getFlavorIconDir', () => {
  it('returns flavor directory segment', () => {
    expect(getFlavorIconDir('micro', 'US')).toBe('flavors/micro-us');
    expect(getFlavorIconDir('standard', 'TO')).toBe('flavors/standard-to');
  });
});
