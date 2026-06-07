import {
  getBuildFlavor,
  getFlavorIconDir,
  getIconAssetPath,
} from '../config/buildFlavor';

describe('getBuildFlavor', () => {
  it('returns standard for standard US', () => {
    expect(getBuildFlavor('standard', 'US')).toBe('standard');
  });

  it('returns standard for standard TO', () => {
    expect(getBuildFlavor('standard', 'TO')).toBe('standard');
  });

  it('returns micro-us for micro US', () => {
    expect(getBuildFlavor('micro', 'US')).toBe('micro-us');
  });

  it('returns micro-to for micro TO', () => {
    expect(getBuildFlavor('micro', 'TO')).toBe('micro-to');
  });
});

describe('getIconAssetPath', () => {
  it('points at standard flavor icon for standard builds', () => {
    expect(getIconAssetPath('standard', 'US')).toBe(
      'assets/flavors/standard/icon.png'
    );
    expect(getIconAssetPath('standard', 'TO', 'icon.ico')).toBe(
      'assets/flavors/standard/icon.ico'
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
  });
});
